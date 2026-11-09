export type RuntimeMode = "development" | "test" | "production";
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface RuntimeConfig {
  nodeEnv: RuntimeMode;
  appBaseUrl: string;
  logLevel: LogLevel;
}

export type EnvironmentInput = Record<string, string | undefined>;

const runtimeModes: RuntimeMode[] = ["development", "test", "production"];
const logLevels: LogLevel[] = ["debug", "info", "warn", "error"];

/**
 * Parse only non-secret runtime settings.
 * Pass process.env from a server-only entry point; never expose this module
 * through a client bundle.
 */
export function parseRuntimeConfig(input: EnvironmentInput): RuntimeConfig {
  const nodeEnv = input.NODE_ENV ?? "development";
  const logLevel = input.LOG_LEVEL ?? "info";
  const appBaseUrl = input.APP_BASE_URL ?? "http://localhost:3000";

  if (!runtimeModes.includes(nodeEnv as RuntimeMode)) {
    throw new Error("NODE_ENV must be development, test, or production.");
  }

  if (!logLevels.includes(logLevel as LogLevel)) {
    throw new Error("LOG_LEVEL must be debug, info, warn, or error.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(appBaseUrl);
  } catch {
    throw new Error("APP_BASE_URL must be a valid absolute URL.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("APP_BASE_URL must use HTTP or HTTPS.");
  }

  return {
    nodeEnv: nodeEnv as RuntimeMode,
    appBaseUrl: parsedUrl.toString(),
    logLevel: logLevel as LogLevel,
  };
}
