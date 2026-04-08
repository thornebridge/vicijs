import type { CallbackUrlOptions, Get2PostOptions } from "./types.js";
import { CallbackVariable } from "./variables.js";

/**
 * Wrap a variable name in ViciDial's URL template syntax.
 *
 * @param variable - The variable name (e.g., "lead_id")
 * @returns The template token (e.g., "--A--lead_id--B--")
 */
export function templateToken(variable: string): string {
	return `--A--${variable}--B--`;
}

/**
 * Build a ViciDial callback URL with --A--variable--B-- template placeholders.
 *
 * Constructs a URL suitable for pasting into ViciDial campaign/system settings
 * (Dispo Call URL, Start Call URL, No Agent Call URL, Agent Push URL, etc.).
 *
 * @example
 * ```ts
 * const url = buildCallbackUrl({
 *   baseUrl: "https://hooks.example.com/vici/dispo",
 *   variables: [CallbackVariable.LEAD_ID, CallbackVariable.DISPO, CallbackVariable.PHONE_NUMBER],
 *   staticParams: { type: "dispo_callback" },
 * });
 * // "https://hooks.example.com/vici/dispo?type=dispo_callback&lead_id=--A--lead_id--B--&..."
 * ```
 */
export function buildCallbackUrl(options: CallbackUrlOptions): string {
	const { baseUrl, variables, staticParams } = options;
	const parts: string[] = [];

	if (staticParams) {
		for (const [key, value] of Object.entries(staticParams)) {
			parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
		}
	}

	for (const variable of variables) {
		parts.push(`${encodeURIComponent(variable)}=${templateToken(variable)}`);
	}

	if (parts.length === 0) return baseUrl;

	const separator = baseUrl.includes("?") ? "&" : "?";
	return `${baseUrl}${separator}${parts.join("&")}`;
}

/** The 7 standard Agent Events Push variables */
const AGENT_EVENT_VARIABLES = [
	CallbackVariable.USER,
	CallbackVariable.EVENT,
	CallbackVariable.MESSAGE,
	CallbackVariable.LEAD_ID,
	CallbackVariable.COUNTER,
	CallbackVariable.EPOCH,
	CallbackVariable.AGENT_LOG_ID,
] as const;

/**
 * Build an Agent Events Push URL with the standard event push variables.
 *
 * Includes: user, event, message, lead_id, counter, epoch, agent_log_id
 *
 * @param baseUrl - Base URL for the event receiver
 * @param staticParams - Optional static params (e.g., { type: "agent_event" })
 * @returns The complete Agent Push URL string
 */
export function buildEventPushUrl(
	baseUrl: string,
	staticParams?: Record<string, string>,
): string {
	return buildCallbackUrl({
		baseUrl,
		variables: AGENT_EVENT_VARIABLES,
		staticParams,
	});
}

/**
 * Wrap an external URL for use with ViciDial's get2post.php AJAX proxy.
 *
 * ViciDial agent screens use AJAX which enforces same-origin. The get2post.php
 * script (from ViciDial's extras/ directory) relays requests to external servers.
 *
 * @example
 * ```ts
 * const url = wrapWithGet2Post({
 *   externalUrl: buildEventPushUrl("https://ext.example.com/hook"),
 *   type: "event",
 * });
 * // "get2post.php?uniqueid=--A--epoch--B--.--A--agent_log_id--B--&type=event&HTTPURLTOPOST=..."
 * ```
 */
export function wrapWithGet2Post(options: Get2PostOptions): string {
	const {
		externalUrl,
		proxyBase = "get2post.php",
		uniqueId = `${templateToken("epoch")}.${templateToken("agent_log_id")}`,
		type,
	} = options;

	const parts = [`uniqueid=${uniqueId}`];
	if (type) {
		parts.push(`type=${encodeURIComponent(type)}`);
	}
	parts.push(`HTTPURLTOPOST=${externalUrl}`);

	return `${proxyBase}?${parts.join("&")}`;
}
