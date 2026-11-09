import { RateLimitEngine, rateLimitKey } from "@hypergaruda/rate-limit";
import { GatewayError } from "./errors.js";
import { ProviderRegistry } from "./registry.js";
import { validateRequest } from "./validation.js";
import type { GatewayRequest, GatewayResponse } from "./types.js";

export interface GatewayRuntimeOptions {
  registry: ProviderRegistry;
  rateLimiter: RateLimitEngine;
  /** Per-process ceiling. Production deployments also need shared infrastructure limits. */
  maxConcurrentPerProvider?: number;
  now?: () => number;
}

export class GatewayRuntime {
  private readonly registry: ProviderRegistry;
  private readonly rateLimiter: RateLimitEngine;
  private readonly maxConcurrentPerProvider: number;
  private readonly now: () => number;
  private readonly activeByProvider = new Map<string, number>();

  constructor(options: GatewayRuntimeOptions) {
    this.registry = options.registry;
    this.rateLimiter = options.rateLimiter;
    this.maxConcurrentPerProvider = options.maxConcurrentPerProvider ?? 4;
    this.now = options.now ?? Date.now;
    if (!Number.isSafeInteger(this.maxConcurrentPerProvider) || this.maxConcurrentPerProvider < 1) {
      throw new Error("maxConcurrentPerProvider must be a positive safe integer.");
    }
  }

  async dispatch(request: GatewayRequest): Promise<GatewayResponse> {
    const startedAt = this.now();
    const { route, adapter } = this.registry.resolve(request.endpointId);
    validateRequest(request, route);

    let decision;
    try {
      decision = await this.rateLimiter.checkMany([
        {
          key: rateLimitKey("hypergaruda", "gateway-client", request.clientIdentity),
          policy: route.clientPolicy,
        },
        {
          key: rateLimitKey("hypergaruda", "provider", route.providerId + ":" + route.endpointId),
          policy: route.providerPolicy,
        },
      ]);
    } catch {
      throw new GatewayError(
        "RATE_LIMIT_STORE_UNAVAILABLE",
        "Gateway protection is temporarily unavailable.",
      );
    }
    if (!decision.allowed) {
      throw new GatewayError(
        "RATE_LIMITED",
        "Request quota exceeded.",
        Math.max(1, Math.ceil(decision.retryAfterMs / 1000)),
      );
    }

    const active = this.activeByProvider.get(route.providerId) ?? 0;
    if (active >= this.maxConcurrentPerProvider) {
      throw new GatewayError("PROVIDER_BUSY", "Provider concurrency capacity is currently full.");
    }
    this.activeByProvider.set(route.providerId, active + 1);

    const signal = AbortSignal.timeout(route.timeoutMs);
    const operation = Promise.resolve().then(() => adapter.execute({
      method: route.method,
      path: route.providerPath,
      params: request.params ?? {},
      signal,
      requestId: request.requestId,
    }));
    const settled = operation.then(
      (value) => { this.release(route.providerId); return value; },
      (error: unknown) => { this.release(route.providerId); throw error; },
    );

    let timeoutListener: (() => void) | undefined;
    const timeout = new Promise<never>((_resolve, reject) => {
      timeoutListener = () => reject(new GatewayError(
        "UPSTREAM_TIMEOUT",
        "The provider did not respond within the configured deadline.",
      ));
      signal.addEventListener("abort", timeoutListener, { once: true });
    });

    let result;
    try {
      result = await Promise.race([settled, timeout]);
    } catch (error) {
      if (error instanceof GatewayError) throw error;
      throw new GatewayError("UPSTREAM_FAILURE", "The provider request could not be completed.");
    } finally {
      if (timeoutListener) signal.removeEventListener("abort", timeoutListener);
    }

    const bodyBytes = typeof result.body === "string"
      ? new TextEncoder().encode(result.body).byteLength
      : result.body.byteLength;
    if (bodyBytes > route.maxResponseBytes) {
      throw new GatewayError("UPSTREAM_RESPONSE_TOO_LARGE", "Provider response exceeded the configured size limit.");
    }
    if (!Number.isInteger(result.status) || result.status < 100 || result.status > 599) {
      throw new GatewayError("UPSTREAM_FAILURE", "Provider returned an invalid HTTP status.");
    }

    const headers: Record<string, string> = {};
    const contentType = result.headers?.["content-type"] ?? result.headers?.["Content-Type"];
    if (contentType && contentType.length <= 128 && /^[\w.+/-]+(?:;[\w=.+-]+)*$/.test(contentType)) {
      headers["content-type"] = contentType;
    }
    return {
      status: result.status,
      headers,
      body: result.body,
      requestId: request.requestId,
      providerId: route.providerId,
      durationMs: Math.max(0, this.now() - startedAt),
    };
  }

  private release(providerId: string): void {
    const active = this.activeByProvider.get(providerId) ?? 0;
    if (active <= 1) this.activeByProvider.delete(providerId);
    else this.activeByProvider.set(providerId, active - 1);
  }
}
