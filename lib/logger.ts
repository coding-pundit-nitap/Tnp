/**
 * Development-only Logger Utility
 * All logs are suppressed in production (NODE_ENV !== 'development')
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context: string;
  message: string;
  data?: unknown;
}

/**
 * Format timestamp as HH:MM:SS
 */
function getTimestamp(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * Colorize console output based on log level
 */
function getColorCode(level: LogLevel): string {
  switch (level) {
    case "info":
      return "\x1b[36m"; // Cyan
    case "warn":
      return "\x1b[33m"; // Yellow
    case "error":
      return "\x1b[31m"; // Red
    case "debug":
      return "\x1b[35m"; // Magenta
  }
}

const resetColor = "\x1b[0m";

/**
 * Log info level message
 * @param context - Component/function name
 * @param message - Log message
 * @param data - Optional data object
 */
export function logInfo(
  context: string,
  message: string,
  data?: unknown,
): void {
  if (process.env.NODE_ENV !== "production") {
    const color = getColorCode("info");
    const timestamp = getTimestamp();
    console.log(
      `${color}[${timestamp}] [INFO] [${context}] ${message}${resetColor}`,
      data ? data : "",
    );
  }
}

/**
 * Log warning level message
 * @param context - Component/function name
 * @param message - Log message
 * @param data - Optional data object
 */
export function logWarn(
  context: string,
  message: string,
  data?: unknown,
): void {
  if (process.env.NODE_ENV !== "production") {
    const color = getColorCode("warn");
    const timestamp = getTimestamp();
    console.warn(
      `${color}[${timestamp}] [WARN] [${context}] ${message}${resetColor}`,
      data ? data : "",
    );
  }
}

/**
 * Log error level message with full error stack
 * @param context - Component/function name
 * @param error - Error object or message
 * @param additionalData - Optional additional context
 */
export function logError(
  context: string,
  error: unknown,
  additionalData?: unknown,
): void {
  if (process.env.NODE_ENV !== "production") {
    const color = getColorCode("error");
    const timestamp = getTimestamp();

    let errorMessage = "Unknown error";
    let errorStack = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack ? `\n${error.stack}` : "";
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      errorMessage = JSON.stringify(error);
    }

    console.error(
      `${color}[${timestamp}] [ERROR] [${context}] ${errorMessage}${resetColor}${errorStack}`,
      additionalData ? additionalData : "",
    );
  }
}

/**
 * Log debug level message (only when DEBUG env var is set)
 * @param context - Component/function name
 * @param message - Log message
 * @param data - Optional data object
 */
export function logDebug(
  context: string,
  message: string,
  data?: unknown,
): void {
  if (process.env.NODE_ENV !== "production" && process.env.DEBUG === "true") {
    const color = getColorCode("debug");
    const timestamp = getTimestamp();
    console.debug(
      `${color}[${timestamp}] [DEBUG] [${context}] ${message}${resetColor}`,
      data ? data : "",
    );
  }
}

/**
 * Log API call start
 * @param context - API endpoint or function name
 * @param method - HTTP method
 * @param url - Endpoint URL
 */
export function logApiStart(
  context: string,
  method: string,
  url: string,
): void {
  if (process.env.NODE_ENV !== "production") {
    logInfo(context, `→ ${method} ${url}`);
  }
}

/**
 * Log API call completion
 * @param context - API endpoint or function name
 * @param method - HTTP method
 * @param statusCode - HTTP status code
 * @param duration - Time in milliseconds
 */
export function logApiEnd(
  context: string,
  method: string,
  statusCode: number,
  duration: number,
): void {
  if (process.env.NODE_ENV !== "production") {
    const statusColor =
      statusCode >= 400 ? getColorCode("error") : getColorCode("info");
    const timestamp = getTimestamp();
    console.log(
      `${statusColor}[${timestamp}] [API] [${context}] ← ${statusCode} in ${duration}ms${resetColor}`,
    );
  }
}

/**
 * Log database operation
 * @param context - Operation context
 * @param operation - Type of operation (create, update, delete, query)
 * @param model - Prisma model name
 * @param duration - Time in milliseconds
 */
export function logDb(
  context: string,
  operation: string,
  model: string,
  duration: number,
): void {
  if (process.env.NODE_ENV !== "production") {
    logInfo(
      context,
      `[DB] ${operation.toUpperCase()} ${model} in ${duration}ms`,
    );
  }
}

/**
 * Log authentication event
 * @param event - Type of auth event
 * @param userId - User ID (optional)
 * @param details - Additional details
 */
export function logAuth(
  event: "LOGIN" | "LOGOUT" | "REGISTER" | "SESSION_CHECK",
  userId?: string,
  details?: unknown,
): void {
  if (process.env.NODE_ENV !== "production") {
    const message = userId ? `${event} (userId: ${userId})` : event;
    logInfo("auth", message, details);
  }
}

/**
 * Log permission/authorization check
 * @param context - Component/function name
 * @param resource - Resource being accessed
 * @param allowed - Whether access was allowed
 * @param userId - User ID
 */
export function logPermission(
  context: string,
  resource: string,
  allowed: boolean,
  userId?: string,
): void {
  if (process.env.NODE_ENV !== "production") {
    const message = allowed ? "✓" : "✗";
    const level = allowed ? "info" : "warn";
    const fn = level === "info" ? logInfo : logWarn;
    fn(
      context,
      `${message} ${resource} access ${allowed ? "granted" : "denied"} ${userId ? `(${userId})` : ""}`,
    );
  }
}

/**
 * Log validation result
 * @param context - Context of validation
 * @param schema - Schema name
 * @param valid - Whether validation passed
 * @param errors - Validation errors (if any)
 */
export function logValidation(
  context: string,
  schema: string,
  valid: boolean,
  errors?: string[],
): void {
  if (process.env.NODE_ENV !== "production") {
    if (valid) {
      logInfo(context, `✓ ${schema} validation passed`);
    } else {
      logWarn(context, `✗ ${schema} validation failed`, errors);
    }
  }
}

/**
 * Log performance timing
 * @param context - Operation context
 * @param metric - Metric name
 * @param duration - Duration in milliseconds
 * @param threshold - Warning threshold in milliseconds
 */
export function logPerformance(
  context: string,
  metric: string,
  duration: number,
  threshold?: number,
): void {
  if (process.env.NODE_ENV !== "production") {
    const isSlowth = threshold && duration > threshold;
    const level = isSlowth ? "warn" : "info";
    const fn = level === "warn" ? logWarn : logInfo;
    const message = `⏱️  ${metric}: ${duration}ms${isSlowth ? " (SLOW)" : ""}`;
    fn(context, message);
  }
}

/**
 * Create a timer for measuring operation duration
 * @returns Object with start time and duration method
 */
export function createTimer() {
  const startTime = performance.now();
  return {
    duration: (): number => Math.round(performance.now() - startTime),
    log: (context: string, operation: string, threshold?: number) => {
      const duration = Math.round(performance.now() - startTime);
      logPerformance(context, operation, duration, threshold);
      return duration;
    },
  };
}

export default {
  logInfo,
  logWarn,
  logError,
  logDebug,
  logAuth,
  logDb,
  logApiStart,
  logApiEnd,
  logPermission,
  logValidation,
  logPerformance,
  createTimer,
};
