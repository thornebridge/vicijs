import type { ViciResponse } from "./types.js";

/** Response type prefix */
export type ResponseType = "SUCCESS" | "ERROR" | "NOTICE";

// Precompiled regexes — allocated once, reused on every call
const RESPONSE_RE = /^(SUCCESS|ERROR|NOTICE):\s+(\S+)\s+(.*?)(?:\s+-\s+(.*))?$/;
const SIMPLE_RE = /^(SUCCESS|ERROR|NOTICE):\s+(.*)$/;
const VERSION_RE =
	/^VERSION:\s+(.+?)\|BUILD:\s+(.+?)\|DATE:\s+(.+?)\|EPOCH:\s+(\d+)/;

/**
 * Parse a raw ViciDial API response string into a structured object.
 *
 * Handles three response formats:
 * 1. Standard: `TYPE: function_name MESSAGE - field1|field2|field3`
 * 2. Version:  `VERSION: x.x|BUILD: y|DATE: z|EPOCH: n`
 * 3. Simple:   `TYPE: message`
 */
export function parseResponse(raw: string): ViciResponse {
	const trimmed = raw.trim();

	// Handle VERSION response (unique format — not TYPE: func MESSAGE - data)
	const versionMatch = trimmed.match(VERSION_RE);
	if (versionMatch) {
		const [, version, build, date, epoch] = versionMatch;
		return {
			type: "SUCCESS",
			function: "version",
			message: "VERSION",
			raw: trimmed,
			data: { version, build, date, epoch },
			rawData: trimmed,
		};
	}

	// Standard format: TYPE: function_name MESSAGE - data
	const match = trimmed.match(RESPONSE_RE);
	if (match) {
		const [, type, fn, message, rawData = ""] = match;
		return {
			type: type as ResponseType,
			function: fn,
			message,
			raw: trimmed,
			data: {},
			rawData,
		};
	}

	// Simple format: TYPE: message (no function name or data section)
	const simpleMatch = trimmed.match(SIMPLE_RE);
	if (simpleMatch) {
		const [, type, rest] = simpleMatch;
		return {
			type: type as ResponseType,
			function: "",
			message: rest,
			raw: trimmed,
			data: {},
			rawData: rest,
		};
	}

	// Fallback — treat entire response as raw data
	return {
		type: "SUCCESS",
		function: "",
		message: trimmed,
		raw: trimmed,
		data: {},
		rawData: trimmed,
	};
}

/**
 * Split pipe-delimited data string into an array of field values.
 * Handles trailing pipes and empty fields.
 */
export function splitFields(data: string): string[] {
	if (!data) return [];
	// Remove trailing pipe if present
	const cleaned = data.endsWith("|") ? data.slice(0, -1) : data;
	return cleaned.split("|");
}

/**
 * Map positional pipe-delimited fields to named properties.
 *
 * @param data - Raw pipe-delimited string
 * @param schema - Array of field names in positional order
 * @returns Object with named fields
 *
 * @example
 * ```ts
 * const data = mapFields('agent1|12345|2025-01-01', ['user', 'id', 'date']);
 * // { user: 'agent1', id: '12345', date: '2025-01-01' }
 * ```
 */
export function mapFields<T extends Record<string, string>>(
	data: string,
	schema: readonly string[],
): T {
	const fields = splitFields(data);
	const result: Record<string, string> = {};
	for (let i = 0; i < schema.length && i < fields.length; i++) {
		// Skip empty schema keys (placeholder positions)
		if (schema[i]) {
			result[schema[i]] = fields[i];
		}
	}
	return result as T;
}

/**
 * Parse a multi-line response where each line is a separate record.
 * Used by functions that return lists (e.g., recording_lookup, hopper_list).
 */
export function parseMultiLine(raw: string): ViciResponse[] {
	return raw
		.trim()
		.split("\n")
		.filter((line) => line.trim())
		.map((line) => parseResponse(line));
}

/**
 * Parse a delimited data response into rows.
 * Supports pipe, csv, tab, and newline delimiters.
 */
export function parseDelimitedData(
	data: string,
	format: "pipe" | "csv" | "tab" | "newline" = "pipe",
	hasHeader = false,
): { headers?: string[]; rows: string[][] } {
	const delimiter =
		format === "pipe"
			? "|"
			: format === "csv"
				? ","
				: format === "tab"
					? "\t"
					: "\n";

	const lines = data.trim().split("\n");
	let headers: string[] | undefined;
	const startIdx = hasHeader ? 1 : 0;

	if (hasHeader && lines.length > 0) {
		headers = lines[0].split(delimiter);
	}

	const rows = lines.slice(startIdx).map((line) => line.split(delimiter));

	return { headers, rows };
}
