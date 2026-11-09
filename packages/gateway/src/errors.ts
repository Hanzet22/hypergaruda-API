export type GatewayErrorCode =
  | "INVALID_REQUEST"
  | "ROUTE_NOT_FOUND"
  | "PROVIDER_UNAVAILABLE"
  | "PROVIDER_BUSY"
  | "RATE_LIMITED"
  | "RATE_LIMIT_STORE_UNAVAILABLE"
  | "UPSTREAM_TIMEOUT"
  | "UPSTREAM_FAILURE"
  | "UPSTREAM_RESPONSE_TOO_LARGE";

const statusByCode: Record<GatewayErrorCode, number> = {
  INVALID_REQUEST: 400,
  ROUTE_NOT_FOUND: 404,
  PROVIDER_UNAVAILABLE: 503,
  PROVIDER_BUSY: 503,
  RATE_LIMITED: 429,
  RATE_LIMIT_STORE_UNAVAILABLE: 503,
  UPSTREAM_TIMEOUT: 504,
  UPSTREAM_FAILURE: 502,
  UPSTREAM_RESPONSE_TOO_LARGE: 502,
};

export class GatewayError extends Error {
  readonly status: number;
  constructor(
    readonly code: GatewayErrorCode,
    message: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "GatewayError";
    this.status = statusByCode[code];
  }
}
