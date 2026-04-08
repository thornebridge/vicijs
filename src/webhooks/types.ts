import type { AgentEvent } from "../enums/agent-events.js";

// ─── Webhook Type Discriminator ─────────────────────────────

/** All supported webhook types */
export const WebhookType = {
	AGENT_EVENT: "agent_event",
	DISPO_CALLBACK: "dispo_callback",
	START_CALL: "start_call",
	NO_AGENT: "no_agent",
	ADD_LEAD: "add_lead",
	DEAD_CALL: "dead_call",
	PAUSE_MAX: "pause_max",
} as const;

export type WebhookType = (typeof WebhookType)[keyof typeof WebhookType];

// ─── Shared Field Interfaces ────────────────────────────────

/** Lead/contact fields common across multiple webhook payloads */
export interface WebhookLeadFields {
	vendor_lead_code?: string;
	source_id?: string;
	list_id?: string;
	gmt_offset_now?: string;
	phone_code?: string;
	phone_number?: string;
	title?: string;
	first_name?: string;
	middle_initial?: string;
	last_name?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	city?: string;
	state?: string;
	province?: string;
	postal_code?: string;
	country_code?: string;
	gender?: string;
	date_of_birth?: string;
	alt_phone?: string;
	email?: string;
	security_phrase?: string;
	comments?: string;
	called_since_last_reset?: string;
	lead_id?: string;
	rank?: string;
	owner?: string;
}

/** Call/session fields common across multiple webhook payloads */
export interface WebhookCallFields {
	campaign?: string;
	phone_login?: string;
	group?: string;
	channel_group?: string;
	SQLdate?: string;
	epoch?: string;
	uniqueid?: string;
	customer_zap_channel?: string;
	server_ip?: string;
	SIPexten?: string;
	session_id?: string;
	dialed_number?: string;
	dialed_label?: string;
	call_id?: string;
	closecallid?: string;
	xfercallid?: string;
	agent_log_id?: string;
	called_count?: string;
	entry_list_id?: string;
	entry_date?: string;
}

/** Recording fields */
export interface WebhookRecordingFields {
	recording_filename?: string;
	recording_id?: string;
}

/** DID fields */
export interface WebhookDidFields {
	did_id?: string;
	did_extension?: string;
	did_pattern?: string;
	did_description?: string;
	did_custom_one?: string;
	did_custom_two?: string;
	did_custom_three?: string;
	did_custom_four?: string;
	did_custom_five?: string;
	did_carrier_description?: string;
}

/** User fields */
export interface WebhookUserFields {
	user?: string;
	fullname?: string;
	user_group?: string;
	agent_email?: string;
	user_custom_one?: string;
	user_custom_two?: string;
	user_custom_three?: string;
	user_custom_four?: string;
	user_custom_five?: string;
}

/** Custom extension fields (in-group, campaign, list) */
export interface WebhookCustomFields {
	ig_custom_one?: string;
	ig_custom_two?: string;
	ig_custom_three?: string;
	ig_custom_four?: string;
	ig_custom_five?: string;
	camp_custom_one?: string;
	camp_custom_two?: string;
	camp_custom_three?: string;
	camp_custom_four?: string;
	camp_custom_five?: string;
	list_description?: string;
	list_name?: string;
}

/** Script and preset fields */
export interface WebhookScriptFields {
	camp_script?: string;
	in_script?: string;
	script_width?: string;
	script_height?: string;
	preset_number_a?: string;
	preset_number_b?: string;
	preset_number_c?: string;
	preset_number_d?: string;
	preset_number_e?: string;
	preset_number_f?: string;
	preset_dtmf_a?: string;
	preset_dtmf_b?: string;
}

// ─── Per-Webhook Payload Types ──────────────────────────────

/** Agent Events Push payload (from agent screen AJAX) */
export interface AgentEventPayload {
	user: string;
	event: AgentEvent;
	message?: string;
	lead_id?: string;
	counter?: string;
	epoch?: string;
	agent_log_id?: string;
}

/** Dispo Call URL payload (sent on call disposition) */
export interface DispoCallbackPayload
	extends WebhookLeadFields,
		WebhookCallFields,
		WebhookRecordingFields,
		WebhookDidFields,
		WebhookUserFields,
		WebhookCustomFields,
		WebhookScriptFields {
	dispo: string;
	talk_time?: string;
	call_notes?: string;
	callback_lead_status?: string;
	callback_datetime?: string;
	term_reason?: string;
	status?: string;
}

/** Start Call URL payload (sent when call routes to agent) */
export interface StartCallPayload
	extends WebhookLeadFields,
		WebhookCallFields,
		WebhookRecordingFields,
		WebhookDidFields,
		WebhookUserFields,
		WebhookCustomFields,
		WebhookScriptFields {}

/** No Agent Call URL payload (sent on drops/timeouts/busys) */
export interface NoAgentPayload
	extends WebhookLeadFields,
		WebhookCallFields,
		WebhookRecordingFields,
		WebhookDidFields,
		WebhookUserFields,
		WebhookCustomFields,
		WebhookScriptFields {
	status?: string;
}

/** Add Lead URL payload (sent when inbound lead is created) */
export interface AddLeadPayload
	extends WebhookLeadFields,
		WebhookCallFields,
		WebhookRecordingFields,
		WebhookDidFields,
		WebhookUserFields,
		WebhookCustomFields {
	lead_id: string;
}

/** Dead Call Trigger URL payload (sent when customer hangs up) */
export interface DeadCallPayload
	extends WebhookLeadFields,
		WebhookCallFields,
		WebhookRecordingFields,
		WebhookDidFields,
		WebhookUserFields,
		WebhookCustomFields {}

/** Pause Max URL payload (sent when agent exceeds max pause time) */
export interface PauseMaxPayload {
	user: string;
	campaign?: string;
	fullname?: string;
	user_custom_one?: string;
	user_custom_two?: string;
	user_custom_three?: string;
	user_custom_four?: string;
	user_custom_five?: string;
	user_group?: string;
	agent_email?: string;
}

// ─── Builder Option Types ───────────────────────────────────

/** Options for buildCallbackUrl */
export interface CallbackUrlOptions {
	/** Base URL (e.g., "https://hooks.example.com/vici/dispo") */
	baseUrl: string;
	/** Array of CallbackVariable values to include as --A--var--B-- placeholders */
	variables: readonly string[];
	/** Optional static query params to merge in (e.g., { type: "dispo_callback" }) */
	staticParams?: Record<string, string>;
}

/** Options for wrapWithGet2Post */
export interface Get2PostOptions {
	/** The external URL to wrap (may contain --A--/--B-- template tokens) */
	externalUrl: string;
	/** Base path to get2post.php proxy (default: "get2post.php") */
	proxyBase?: string;
	/** Optional uniqueid template expression (default: "--A--epoch--B--.--A--agent_log_id--B--") */
	uniqueId?: string;
	/** Optional type label (e.g., "event", "dispo") */
	type?: string;
}

// ─── Router Handler Types ───────────────────────────────────

/** Handler function for a specific webhook type */
export type WebhookHandler<T> = (payload: T) => void | Promise<void>;

/** Map from webhook type to payload type for handler registration */
export interface WebhookHandlerMap {
	agent_event: AgentEventPayload;
	dispo_callback: DispoCallbackPayload;
	start_call: StartCallPayload;
	no_agent: NoAgentPayload;
	add_lead: AddLeadPayload;
	dead_call: DeadCallPayload;
	pause_max: PauseMaxPayload;
}

/** Agent event-specific handler */
export type AgentEventHandler = (
	payload: AgentEventPayload,
) => void | Promise<void>;
