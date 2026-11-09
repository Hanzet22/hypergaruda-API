import type { GatewayMethod } from "@hypergaruda/gateway";

export type ProviderPermissionStatus = "pending-confirmation" | "confirmed";

export interface ProviderEndpointMapping {
  endpointId: string;
  method: GatewayMethod;
  /** Fixed provider-relative path copied from reviewed provider documentation. */
  providerPath: string;
  allowedParams: readonly string[];
}

export interface ProviderMappingManifest {
  providerId: string;
  origin: string;
  allowedHosts: readonly string[];
  sourceReference: string;
  permissionStatus: ProviderPermissionStatus;
  endpoints: readonly ProviderEndpointMapping[];
}

/**
 * A mapping cannot be promoted for route registration until permission is explicitly
 * confirmed and every endpoint has a unique ID and a fixed relative path.
 */
export function assertProviderMappingApproved(
  manifest: ProviderMappingManifest,
): asserts manifest is ProviderMappingManifest & { permissionStatus: "confirmed" } {
  if (manifest.permissionStatus !== "confirmed") {
    throw new Error("Provider mapping is blocked until permission is confirmed.");
  }
  if (!manifest.providerId.trim() || !manifest.sourceReference.trim()) {
    throw new Error("Provider ID and source reference are required.");
  }

  const origin = new URL(manifest.origin);
  if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error("Provider mapping origin must be a clean HTTPS origin.");
  }

  const hosts = new Set(manifest.allowedHosts.map((host) => host.trim().toLowerCase()));
  if (!hosts.has(origin.hostname.toLowerCase()) || [...hosts].some((host) => !host || host.includes("*") || host.endsWith("."))) {
    throw new Error("Provider mapping requires an exact hostname allowlist.");
  }

  const endpointIds = new Set<string>();
  for (const endpoint of manifest.endpoints) {
    if (!endpoint.endpointId.trim() || endpointIds.has(endpoint.endpointId)) {
      throw new Error("Provider endpoint IDs must be unique and non-empty.");
    }
    endpointIds.add(endpoint.endpointId);

    if (
      !endpoint.providerPath.startsWith("/") ||
      endpoint.providerPath.startsWith("//") ||
      endpoint.providerPath.includes("\\") ||
      endpoint.providerPath.includes("?") ||
      endpoint.providerPath.includes("#") ||
      /%(?:2f|5c)/i.test(endpoint.providerPath)
    ) {
      throw new Error("Provider endpoint paths must be fixed relative paths.");
    }
  }
  if (manifest.endpoints.length === 0) {
    throw new Error("At least one reviewed endpoint mapping is required.");
  }
}
