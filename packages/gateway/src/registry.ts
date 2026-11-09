import { GatewayError } from "./errors.js";
import { validateRoute } from "./validation.js";
import type { GatewayRoute, ProviderAdapter } from "./types.js";

export class ProviderRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();
  private readonly routes = new Map<string, GatewayRoute>();

  constructor(adapters: readonly ProviderAdapter[], routes: readonly GatewayRoute[]) {
    for (const adapter of adapters) {
      if (!adapter.id || this.adapters.has(adapter.id)) {
        throw new Error("Provider adapter IDs must be unique and non-empty.");
      }
      this.adapters.set(adapter.id, adapter);
    }
    for (const route of routes) {
      validateRoute(route);
      if (this.routes.has(route.endpointId)) {
        throw new Error("Gateway endpoint IDs must be unique.");
      }
      if (!this.adapters.has(route.providerId)) {
        throw new Error("Every gateway route must reference a registered provider adapter.");
      }
      this.routes.set(route.endpointId, route);
    }
  }

  resolve(endpointId: string): { route: GatewayRoute; adapter: ProviderAdapter } {
    const route = this.routes.get(endpointId);
    if (!route) throw new GatewayError("ROUTE_NOT_FOUND", "The requested endpoint is not registered.");
    const adapter = this.adapters.get(route.providerId);
    if (!adapter) throw new GatewayError("PROVIDER_UNAVAILABLE", "The configured provider is unavailable.");
    return { route, adapter };
  }

  get endpointCount(): number {
    return this.routes.size;
  }

  get providerCount(): number {
    return this.adapters.size;
  }
}
