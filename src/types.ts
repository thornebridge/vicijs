import type { Gender } from "./enums/admin-api.js";
import type { CallbackType } from "./enums/agent-api.js";

/** Configuration for ViciDial API clients */
export interface ViciConfig {
	/** Base URL of ViciDial server (e.g. "https://dialer.example.com") */
	baseUrl: string;
	/** API username */
	user: string;
	/** API password */
	pass: string;
	/** Source identifier for API calls (max 20 chars, default: "vicijs") */
	source?: string;
	/** Request timeout in milliseconds (default: 30000) */
	timeout?: number;
	/** Custom fetch implementation for testing or proxying */
	fetch?: typeof globalThis.fetch;
}

/** Configuration for Agent API client — extends base with agent_user */
export interface AgentConfig extends ViciConfig {
	/** The ViciDial agent user whose session to control */
	agentUser: string;
}

/** Common lead/contact data fields */
export interface LeadData {
	vendorLeadCode?: string;
	sourceId?: string;
	listId?: number;
	phoneCode?: string;
	phoneNumber?: string;
	title?: string;
	firstName?: string;
	middleInitial?: string;
	lastName?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	city?: string;
	state?: string;
	province?: string;
	postalCode?: string;
	countryCode?: string;
	gender?: Gender;
	dateOfBirth?: string;
	altPhone?: string;
	email?: string;
	securityPhrase?: string;
	comments?: string;
	rank?: number;
	owner?: string;
	gmtOffsetNow?: string;
}

/** Scheduled callback data */
export interface CallbackData {
	callbackDatetime: string;
	callbackType?: CallbackType;
	callbackUser?: string;
	callbackComments?: string;
	callbackStatus?: string;
}

/** Parsed ViciDial API response */
export interface ViciResponse<T = Record<string, unknown>> {
	/** Response type prefix */
	type: "SUCCESS" | "ERROR" | "NOTICE";
	/** API function that was called */
	function: string;
	/** Human-readable message */
	message: string;
	/** Raw response text */
	raw: string;
	/** Parsed data fields */
	data: T;
	/** Raw pipe-delimited data string */
	rawData: string;
}

/** Maps camelCase SDK param names to snake_case ViciDial API param names */
export function toApiParams(params: object): Record<string, string> {
	const result: Record<string, string> = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;
		const apiKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
		result[apiKey] = String(value);
	}
	return result;
}

/** Converts a value to the ViciDial blank sentinel */
export function blank(): string {
	return "--BLANK--";
}
