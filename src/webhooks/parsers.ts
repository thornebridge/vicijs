import type { AgentEvent } from "../enums/agent-events.js";
import type {
	AddLeadPayload,
	AgentEventPayload,
	DeadCallPayload,
	DispoCallbackPayload,
	NoAgentPayload,
	PauseMaxPayload,
	StartCallPayload,
} from "./types.js";

// ─── Internal Helpers ───────────────────────────────────────

/** Normalize input to URLSearchParams */
function toSearchParams(input: string | URLSearchParams): URLSearchParams {
	if (input instanceof URLSearchParams) return input;
	try {
		return new URL(input).searchParams;
	} catch {
		return new URLSearchParams(input);
	}
}

/** Get a string value, returning undefined for empty/missing */
function get(params: URLSearchParams, key: string): string | undefined {
	const val = params.get(key);
	return val === null || val === "" ? undefined : val;
}

/** Remove undefined values from an object */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
	const result = {} as Record<string, unknown>;
	for (const [k, v] of Object.entries(obj)) {
		if (v !== undefined) result[k] = v;
	}
	return result as T;
}

/** Extract all common lead fields from params */
function extractLeadFields(
	p: URLSearchParams,
): Record<string, string | undefined> {
	return {
		vendor_lead_code: get(p, "vendor_lead_code"),
		source_id: get(p, "source_id"),
		list_id: get(p, "list_id"),
		gmt_offset_now: get(p, "gmt_offset_now"),
		phone_code: get(p, "phone_code"),
		phone_number: get(p, "phone_number"),
		title: get(p, "title"),
		first_name: get(p, "first_name"),
		middle_initial: get(p, "middle_initial"),
		last_name: get(p, "last_name"),
		address1: get(p, "address1"),
		address2: get(p, "address2"),
		address3: get(p, "address3"),
		city: get(p, "city"),
		state: get(p, "state"),
		province: get(p, "province"),
		postal_code: get(p, "postal_code"),
		country_code: get(p, "country_code"),
		gender: get(p, "gender"),
		date_of_birth: get(p, "date_of_birth"),
		alt_phone: get(p, "alt_phone"),
		email: get(p, "email"),
		security_phrase: get(p, "security_phrase"),
		comments: get(p, "comments"),
		called_since_last_reset: get(p, "called_since_last_reset"),
		lead_id: get(p, "lead_id"),
		rank: get(p, "rank"),
		owner: get(p, "owner"),
	};
}

/** Extract all common call/session fields from params */
function extractCallFields(
	p: URLSearchParams,
): Record<string, string | undefined> {
	return {
		campaign: get(p, "campaign"),
		phone_login: get(p, "phone_login"),
		group: get(p, "group"),
		channel_group: get(p, "channel_group"),
		SQLdate: get(p, "SQLdate"),
		epoch: get(p, "epoch"),
		uniqueid: get(p, "uniqueid"),
		customer_zap_channel: get(p, "customer_zap_channel"),
		server_ip: get(p, "server_ip"),
		SIPexten: get(p, "SIPexten"),
		session_id: get(p, "session_id"),
		dialed_number: get(p, "dialed_number"),
		dialed_label: get(p, "dialed_label"),
		call_id: get(p, "call_id"),
		closecallid: get(p, "closecallid"),
		xfercallid: get(p, "xfercallid"),
		agent_log_id: get(p, "agent_log_id"),
		called_count: get(p, "called_count"),
		entry_list_id: get(p, "entry_list_id"),
		entry_date: get(p, "entry_date"),
	};
}

/** Extract recording, DID, user, and custom extension fields */
function extractExtensionFields(
	p: URLSearchParams,
): Record<string, string | undefined> {
	return {
		recording_filename: get(p, "recording_filename"),
		recording_id: get(p, "recording_id"),
		did_id: get(p, "did_id"),
		did_extension: get(p, "did_extension"),
		did_pattern: get(p, "did_pattern"),
		did_description: get(p, "did_description"),
		did_custom_one: get(p, "did_custom_one"),
		did_custom_two: get(p, "did_custom_two"),
		did_custom_three: get(p, "did_custom_three"),
		did_custom_four: get(p, "did_custom_four"),
		did_custom_five: get(p, "did_custom_five"),
		did_carrier_description: get(p, "did_carrier_description"),
		user: get(p, "user"),
		fullname: get(p, "fullname"),
		user_group: get(p, "user_group"),
		agent_email: get(p, "agent_email"),
		user_custom_one: get(p, "user_custom_one"),
		user_custom_two: get(p, "user_custom_two"),
		user_custom_three: get(p, "user_custom_three"),
		user_custom_four: get(p, "user_custom_four"),
		user_custom_five: get(p, "user_custom_five"),
		ig_custom_one: get(p, "ig_custom_one"),
		ig_custom_two: get(p, "ig_custom_two"),
		ig_custom_three: get(p, "ig_custom_three"),
		ig_custom_four: get(p, "ig_custom_four"),
		ig_custom_five: get(p, "ig_custom_five"),
		camp_custom_one: get(p, "camp_custom_one"),
		camp_custom_two: get(p, "camp_custom_two"),
		camp_custom_three: get(p, "camp_custom_three"),
		camp_custom_four: get(p, "camp_custom_four"),
		camp_custom_five: get(p, "camp_custom_five"),
		list_description: get(p, "list_description"),
		list_name: get(p, "list_name"),
	};
}

/** Extract script/preset fields */
function extractScriptFields(
	p: URLSearchParams,
): Record<string, string | undefined> {
	return {
		camp_script: get(p, "camp_script"),
		in_script: get(p, "in_script"),
		script_width: get(p, "script_width"),
		script_height: get(p, "script_height"),
		preset_number_a: get(p, "preset_number_a"),
		preset_number_b: get(p, "preset_number_b"),
		preset_number_c: get(p, "preset_number_c"),
		preset_number_d: get(p, "preset_number_d"),
		preset_number_e: get(p, "preset_number_e"),
		preset_number_f: get(p, "preset_number_f"),
		preset_dtmf_a: get(p, "preset_dtmf_a"),
		preset_dtmf_b: get(p, "preset_dtmf_b"),
	};
}

/** Extract all common fields across lead/call/extension webhooks */
function extractCommonFields(
	p: URLSearchParams,
): Record<string, string | undefined> {
	return {
		...extractLeadFields(p),
		...extractCallFields(p),
		...extractExtensionFields(p),
	};
}

// ─── Public Parsers ─────────────────────────────────────────

/**
 * Parse an Agent Events Push webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed AgentEventPayload
 * @throws If required field "user" or "event" is missing
 */
export function parseAgentEvent(
	input: string | URLSearchParams,
): AgentEventPayload {
	const p = toSearchParams(input);
	const user = get(p, "user");
	const event = get(p, "event");
	if (!user) throw new Error("Missing required field: user");
	if (!event) throw new Error("Missing required field: event");
	return stripUndefined({
		user,
		event: event as AgentEvent,
		message: get(p, "message"),
		lead_id: get(p, "lead_id"),
		counter: get(p, "counter"),
		epoch: get(p, "epoch"),
		agent_log_id: get(p, "agent_log_id"),
	}) as AgentEventPayload;
}

/**
 * Parse a Dispo Call URL webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed DispoCallbackPayload
 * @throws If required field "dispo" is missing
 */
export function parseDispoCallback(
	input: string | URLSearchParams,
): DispoCallbackPayload {
	const p = toSearchParams(input);
	const dispo = get(p, "dispo");
	if (!dispo) throw new Error("Missing required field: dispo");
	return stripUndefined({
		...extractCommonFields(p),
		...extractScriptFields(p),
		dispo,
		talk_time: get(p, "talk_time"),
		call_notes: get(p, "call_notes"),
		callback_lead_status: get(p, "callback_lead_status"),
		callback_datetime: get(p, "callback_datetime"),
		term_reason: get(p, "term_reason"),
		status: get(p, "status"),
	}) as DispoCallbackPayload;
}

/**
 * Parse a Start Call URL webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed StartCallPayload
 */
export function parseStartCallback(
	input: string | URLSearchParams,
): StartCallPayload {
	const p = toSearchParams(input);
	return stripUndefined({
		...extractCommonFields(p),
		...extractScriptFields(p),
	}) as StartCallPayload;
}

/**
 * Parse a No Agent Call URL webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed NoAgentPayload
 */
export function parseNoAgentCallback(
	input: string | URLSearchParams,
): NoAgentPayload {
	const p = toSearchParams(input);
	return stripUndefined({
		...extractCommonFields(p),
		...extractScriptFields(p),
		status: get(p, "status"),
	}) as NoAgentPayload;
}

/**
 * Parse an Add Lead URL webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed AddLeadPayload
 * @throws If required field "lead_id" is missing
 */
export function parseAddLeadCallback(
	input: string | URLSearchParams,
): AddLeadPayload {
	const p = toSearchParams(input);
	const lead_id = get(p, "lead_id");
	if (!lead_id) throw new Error("Missing required field: lead_id");
	return stripUndefined({
		...extractCommonFields(p),
		lead_id,
	}) as AddLeadPayload;
}

/**
 * Parse a Dead Call Trigger URL webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed DeadCallPayload
 */
export function parseDeadCallCallback(
	input: string | URLSearchParams,
): DeadCallPayload {
	const p = toSearchParams(input);
	return stripUndefined(extractCommonFields(p)) as DeadCallPayload;
}

/**
 * Parse a Pause Max URL webhook request.
 *
 * @param input - Full URL string, query string, or URLSearchParams
 * @returns Typed PauseMaxPayload
 * @throws If required field "user" is missing
 */
export function parsePauseMaxCallback(
	input: string | URLSearchParams,
): PauseMaxPayload {
	const p = toSearchParams(input);
	const user = get(p, "user");
	if (!user) throw new Error("Missing required field: user");
	return stripUndefined({
		user,
		campaign: get(p, "campaign"),
		fullname: get(p, "fullname"),
		user_custom_one: get(p, "user_custom_one"),
		user_custom_two: get(p, "user_custom_two"),
		user_custom_three: get(p, "user_custom_three"),
		user_custom_four: get(p, "user_custom_four"),
		user_custom_five: get(p, "user_custom_five"),
		user_group: get(p, "user_group"),
		agent_email: get(p, "agent_email"),
	}) as PauseMaxPayload;
}
