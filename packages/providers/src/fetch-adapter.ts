import type {
  GatewayMethod,
  ProviderAdapter,
  ProviderCall,
  ProviderResult,
} from "@hypergaruda/gateway";

export interface FetchProviderAdapterOptions {
  id: string;
  /** Fixed HTTPS origin supplied by trusted server configuration, never by a request. */
  origin: string;
  /** Exact hostnames only. Wildcards and suffix matching are intentionally unsupported. */
  allowedHosts: readonly string[];
  /** Optional secret value, normally read by the host application from its secret store. */
  authorization?: string;
  /** Adapter-level response cap; route-level limits are still enforced by GatewayRuntime. */
  maxResponseBytes?: number;
  /** Optional fetch implementation for controlled host integration. */
  fetchImpl?: typeof fetch;
}

const MAX_ALLOWED_RESPONSE_BYTES = 10_000_000;
const ALLOWED_METHODS = new Set<GatewayMethod>(["GET", "POST", "PUT", "PATCH", "DELETE"]);

function validateOrigin(originValue: string, allowedHosts: readonly string[]): URL {
  let origin: URL;
  try {
    origin = new URL(originValue);
  } catch {
    throw new Error("Provider origin must be a valid absolute URL.");
  }

  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash ||
    (origin.port && origin.port !== "443")
  ) {
    throw new Error("Provider origin must be a clean HTTPS origin on the default port.");
  }

  const normalizedHosts = new Set(allowedHosts.map((host) => host.trim().toLowerCase()));
  if (
    normalizedHosts.size === 0 ||
    [...normalizedHosts].some((host) => !host || host.includes("*") || host.endsWith(".")) ||
    !normalizedHosts.has(origin.hostname.toLowerCase())
  ) {
    throw new Error("Provider origin hostname must exactly match an explicit allowed host.");
  }

  return origin;
}

function validateProviderPath(path: string): void {
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#") ||
    /[\u0000-\u001f\u007f]/.test(path) ||
    /%(?:2f|5c)/i.test(path)
  ) {
    throw new Error("Provider path must be a fixed, safe absolute path.");
  }

  for (const segment of path.split("/")) {
    let decoded: string;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw new Error("Provider path contains invalid percent encoding.");
    }
    if (decoded === "." || decoded === "..") {
      throw new Error("Provider path cannot contain traversal segments.");
    }
  }
}

async function readBoundedBody(response: Response, maxBytes: number): Promise<Uint8Array> {
  const contentLength = response.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > maxBytes) {
    await response.body?.cancel();
    throw new Error("Provider response exceeded the configured byte limit.");
  }

  if (!response.body) return new Uint8Array();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new Error("Provider response exceeded the configured byte limit.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export class FetchProviderAdapter implements ProviderAdapter {
  readonly id: string;
  private readonly origin: URL;
  private readonly authorization?: string;
  private readonly maxResponseBytes: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: FetchProviderAdapterOptions) {
    if (!options.id.trim()) throw new Error("Provider adapter ID is required.");
    this.id = options.id;
    this.origin = validateOrigin(options.origin, options.allowedHosts);

    if (
      options.authorization !== undefined &&
      (options.authorization.length > 4096 || /[\r\n]/.test(options.authorization))
    ) {
      throw new Error("Provider authorization value is invalid.");
    }
    this.authorization = options.authorization;

    this.maxResponseBytes = options.maxResponseBytes ?? 1_000_000;
    if (
      !Number.isSafeInteger(this.maxResponseBytes) ||
      this.maxResponseBytes < 1 ||
      this.maxResponseBytes > MAX_ALLOWED_RESPONSE_BYTES
    ) {
      throw new Error("maxResponseBytes must be between 1 and 10000000.");
    }

    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async execute(call: ProviderCall): Promise<ProviderResult> {
    if (!ALLOWED_METHODS.has(call.method)) {
      throw new Error("Provider method is not allowed.");
    }
    validateProviderPath(call.path);

    const url = new URL(call.path, this.origin);
    if (url.origin !== this.origin.origin || url.hostname !== this.origin.hostname) {
      throw new Error("Resolved provider URL escaped the configured origin.");
    }

    for (const [key, value] of Object.entries(call.params).sort(([a], [b]) => a.localeCompare(b))) {
      url.searchParams.append(key, String(value));
    }

    const headers = new Headers({ accept: "application/json, text/plain;q=0.9, */*;q=0.1" });
    if (this.authorization) headers.set("authorization", this.authorization);

    const response = await this.fetchImpl(url, {
      method: call.method,
      headers,
      signal: call.signal,
      redirect: "manual",
      cache: "no-store",
    });

    if (response.status >= 300 && response.status < 400) {
      await response.body?.cancel();
      throw new Error("Provider redirects are disabled.");
    }

    const body = await readBoundedBody(response, this.maxResponseBytes);
    const contentType = response.headers.get("content-type");
    const safeHeaders: Record<string, string> = {};
    if (contentType && contentType.length <= 128 && /^[\w.+/-]+(?:;[\w=.+-]+)*$/.test(contentType)) {
      safeHeaders["content-type"] = contentType;
    }

    return {
      status: response.status,
      headers: safeHeaders,
      body,
    };
  }
}
