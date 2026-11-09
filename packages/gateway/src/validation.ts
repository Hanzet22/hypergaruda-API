import { GatewayError } from "./errors.js";
import type { GatewayRequest, GatewayRoute } from "./types.js";

const identifierPattern = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,127}$/;
const parameterPattern = /^[a-zA-Z][a-zA-Z0-9_]{0,63}$/;

export function validateRoute(route: GatewayRoute): void {
  if (!identifierPattern.test(route.endpointId) || !identifierPattern.test(route.providerId)) {
    throw new Error("Gateway route identifiers must be stable non-empty identifiers.");
  }
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(route.method)) {
    throw new Error("Gateway route method is not supported.");
  }
  if (!route.providerPath.startsWith("/") || route.providerPath.startsWith("//") ||
      route.providerPath.includes("://") || route.providerPath.split("/").some((part) => part === "..")) {
    throw new Error("Provider paths must be fixed relative paths.");
  }
  if (!Number.isSafeInteger(route.timeoutMs) || route.timeoutMs < 100 || route.timeoutMs > 60_000) {
    throw new Error("Route timeout must be between 100 and 60000 milliseconds.");
  }
  if (!Number.isSafeInteger(route.maxResponseBytes) || route.maxResponseBytes < 1 ||
      route.maxResponseBytes > 10_000_000) {
    throw new Error("Maximum response size must be between 1 and 10000000 bytes.");
  }
  if (new Set(route.allowedParams).size !== route.allowedParams.length ||
      route.allowedParams.some((name) => !parameterPattern.test(name))) {
    throw new Error("Allowed parameter names must be unique safe identifiers.");
  }
  if (route.clientPolicy.scope !== "gateway-client" || route.providerPolicy.scope !== "provider") {
    throw new Error("Gateway routes require gateway-client and provider rate-limit policies.");
  }
}

export function validateRequest(request: GatewayRequest, route: GatewayRoute): void {
  if (!identifierPattern.test(request.endpointId) || !identifierPattern.test(request.requestId) ||
      !request.clientIdentity || request.clientIdentity.trim() !== request.clientIdentity ||
      request.clientIdentity.length > 256) {
    throw new GatewayError("INVALID_REQUEST", "Request identity or request ID is invalid.");
  }
  const params = request.params ?? {};
  if (typeof params !== "object" || params === null || Array.isArray(params)) {
    throw new GatewayError("INVALID_REQUEST", "Parameters must be a plain object.");
  }
  const keys = Object.keys(params);
  if (keys.length > 32) throw new GatewayError("INVALID_REQUEST", "Too many request parameters.");
  for (const key of keys) {
    if (!route.allowedParams.includes(key)) {
      throw new GatewayError("INVALID_REQUEST", "Request contains an unsupported parameter.");
    }
    const value = params[key];
    if (!["string", "number", "boolean"].includes(typeof value) ||
        (typeof value === "number" && !Number.isFinite(value))) {
      throw new GatewayError("INVALID_REQUEST", "Parameter values must be finite primitive values.");
    }
    if (String(value).length > 2048) {
      throw new GatewayError("INVALID_REQUEST", "A request parameter exceeds the allowed length.");
    }
  }
}
