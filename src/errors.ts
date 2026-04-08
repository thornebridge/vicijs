/** Base error class for all ViciDial API errors */
export class ViciError extends Error {
	/** The API function that returned the error */
	readonly function: string;
	/** Error details from the response */
	readonly details: string;
	/** Raw response text */
	readonly raw: string;

	constructor(fn: string, message: string, details: string, raw: string) {
		super(`${fn}: ${message}`);
		this.name = "ViciError";
		this.function = fn;
		this.details = details;
		this.raw = raw;
	}
}

/** Authentication failure — invalid user/pass */
export class ViciAuthError extends ViciError {
	constructor(fn: string, details: string, raw: string) {
		super(fn, "Authentication failed", details, raw);
		this.name = "ViciAuthError";
	}
}

/** Permission denied — user lacks required access level or feature flag */
export class ViciPermissionError extends ViciError {
	constructor(fn: string, details: string, raw: string) {
		super(fn, "Permission denied", details, raw);
		this.name = "ViciPermissionError";
	}
}

/** Resource not found — lead, user, campaign, etc. does not exist */
export class ViciNotFoundError extends ViciError {
	constructor(fn: string, details: string, raw: string) {
		super(fn, "Not found", details, raw);
		this.name = "ViciNotFoundError";
	}
}

/** Validation failure — invalid parameters, duplicates, etc. */
export class ViciValidationError extends ViciError {
	constructor(fn: string, details: string, raw: string) {
		super(fn, "Validation failed", details, raw);
		this.name = "ViciValidationError";
	}
}

/** HTTP transport error — network failure, non-200 status */
export class ViciHttpError extends ViciError {
	readonly statusCode: number;

	constructor(statusCode: number, statusText: string) {
		super("http", `HTTP ${statusCode}: ${statusText}`, "", "");
		this.name = "ViciHttpError";
		this.statusCode = statusCode;
	}
}

/** Request timeout — server did not respond within the configured timeout */
export class ViciTimeoutError extends ViciError {
	readonly timeoutMs: number;

	constructor(timeoutMs: number) {
		super("timeout", `Request timed out after ${timeoutMs}ms`, "", "");
		this.name = "ViciTimeoutError";
		this.timeoutMs = timeoutMs;
	}
}

/** Parse an error response string into the appropriate error type */
export function parseError(raw: string): ViciError {
	// Format: ERROR: function_name MESSAGE - details
	const match = raw.match(/^ERROR:\s+(\S+)\s+(.*?)(?:\s+-\s+(.*))?$/);
	if (!match) {
		return new ViciError("unknown", raw, "", raw);
	}

	const [, fn, message, details = ""] = match;

	// Classify by message content
	const upper = message.toUpperCase();

	if (upper.includes("NO USER FOUND") || upper.includes("AUTH ")) {
		return new ViciAuthError(fn, details, raw);
	}

	if (
		upper.includes("PERMISSION") ||
		upper.includes("NOT ALLOWED") ||
		upper.includes("ACCESS")
	) {
		return new ViciPermissionError(fn, details, raw);
	}

	if (
		upper.includes("NOT FOUND") ||
		upper.includes("DOES NOT EXIST") ||
		upper.includes("NOT LOGGED IN") ||
		upper.includes("NO MATCHES") ||
		upper.includes("NO RECORDS FOUND") ||
		upper.includes("NO RECORDINGS FOUND") ||
		upper.includes("NO LEADS") ||
		upper.includes("NO CUSTOM FIELDS")
	) {
		return new ViciNotFoundError(fn, details, raw);
	}

	if (
		upper.includes("DUPLICATE") ||
		upper.includes("ALREADY EXISTS") ||
		upper.includes("INVALID") ||
		upper.includes("NOT VALID") ||
		upper.includes("REQUIRED FIELDS") ||
		upper.includes("DISABLED")
	) {
		return new ViciValidationError(fn, details, raw);
	}

	return new ViciError(fn, message, details, raw);
}
