/**
 * All ViciDial URL template variable names used in callback URLs.
 * Variables are inserted into URLs using --A--variable_name--B-- syntax.
 */
export const CallbackVariable = {
	// ─── Lead Data ────────────────────────────────────────────
	LEAD_ID: "lead_id",
	VENDOR_LEAD_CODE: "vendor_lead_code",
	SOURCE_ID: "source_id",
	LIST_ID: "list_id",
	GMT_OFFSET_NOW: "gmt_offset_now",
	PHONE_CODE: "phone_code",
	PHONE_NUMBER: "phone_number",
	TITLE: "title",
	FIRST_NAME: "first_name",
	MIDDLE_INITIAL: "middle_initial",
	LAST_NAME: "last_name",
	ADDRESS1: "address1",
	ADDRESS2: "address2",
	ADDRESS3: "address3",
	CITY: "city",
	STATE: "state",
	PROVINCE: "province",
	POSTAL_CODE: "postal_code",
	COUNTRY_CODE: "country_code",
	GENDER: "gender",
	DATE_OF_BIRTH: "date_of_birth",
	ALT_PHONE: "alt_phone",
	EMAIL: "email",
	SECURITY_PHRASE: "security_phrase",
	COMMENTS: "comments",
	CALLED_SINCE_LAST_RESET: "called_since_last_reset",
	RANK: "rank",
	OWNER: "owner",

	// ─── Call/Session Data ────────────────────────────────────
	CAMPAIGN: "campaign",
	PHONE_LOGIN: "phone_login",
	GROUP: "group",
	CHANNEL_GROUP: "channel_group",
	SQLDATE: "SQLdate",
	EPOCH: "epoch",
	UNIQUEID: "uniqueid",
	CUSTOMER_ZAP_CHANNEL: "customer_zap_channel",
	SERVER_IP: "server_ip",
	SIP_EXTEN: "SIPexten",
	SESSION_ID: "session_id",
	DIALED_NUMBER: "dialed_number",
	DIALED_LABEL: "dialed_label",
	CALL_ID: "call_id",
	CLOSECALLID: "closecallid",
	XFERCALLID: "xfercallid",
	AGENT_LOG_ID: "agent_log_id",
	CALLED_COUNT: "called_count",
	ENTRY_LIST_ID: "entry_list_id",
	ENTRY_DATE: "entry_date",

	// ─── User Data ────────────────────────────────────────────
	USER: "user",
	FULLNAME: "fullname",
	USER_GROUP: "user_group",
	AGENT_EMAIL: "agent_email",
	USER_CUSTOM_ONE: "user_custom_one",
	USER_CUSTOM_TWO: "user_custom_two",
	USER_CUSTOM_THREE: "user_custom_three",
	USER_CUSTOM_FOUR: "user_custom_four",
	USER_CUSTOM_FIVE: "user_custom_five",

	// ─── Disposition-Specific ─────────────────────────────────
	DISPO: "dispo",
	TALK_TIME: "talk_time",
	CALL_NOTES: "call_notes",
	CALLBACK_LEAD_STATUS: "callback_lead_status",
	CALLBACK_DATETIME: "callback_datetime",
	TERM_REASON: "term_reason",
	STATUS: "status",

	// ─── Recording ────────────────────────────────────────────
	RECORDING_FILENAME: "recording_filename",
	RECORDING_ID: "recording_id",

	// ─── Scripts/Presets ──────────────────────────────────────
	CAMP_SCRIPT: "camp_script",
	IN_SCRIPT: "in_script",
	SCRIPT_WIDTH: "script_width",
	SCRIPT_HEIGHT: "script_height",
	PRESET_NUMBER_A: "preset_number_a",
	PRESET_NUMBER_B: "preset_number_b",
	PRESET_NUMBER_C: "preset_number_c",
	PRESET_NUMBER_D: "preset_number_d",
	PRESET_NUMBER_E: "preset_number_e",
	PRESET_NUMBER_F: "preset_number_f",
	PRESET_DTMF_A: "preset_dtmf_a",
	PRESET_DTMF_B: "preset_dtmf_b",

	// ─── DID Fields ───────────────────────────────────────────
	DID_ID: "did_id",
	DID_EXTENSION: "did_extension",
	DID_PATTERN: "did_pattern",
	DID_DESCRIPTION: "did_description",
	DID_CUSTOM_ONE: "did_custom_one",
	DID_CUSTOM_TWO: "did_custom_two",
	DID_CUSTOM_THREE: "did_custom_three",
	DID_CUSTOM_FOUR: "did_custom_four",
	DID_CUSTOM_FIVE: "did_custom_five",
	DID_CARRIER_DESCRIPTION: "did_carrier_description",

	// ─── In-Group Custom ──────────────────────────────────────
	IG_CUSTOM_ONE: "ig_custom_one",
	IG_CUSTOM_TWO: "ig_custom_two",
	IG_CUSTOM_THREE: "ig_custom_three",
	IG_CUSTOM_FOUR: "ig_custom_four",
	IG_CUSTOM_FIVE: "ig_custom_five",

	// ─── Campaign Custom ──────────────────────────────────────
	CAMP_CUSTOM_ONE: "camp_custom_one",
	CAMP_CUSTOM_TWO: "camp_custom_two",
	CAMP_CUSTOM_THREE: "camp_custom_three",
	CAMP_CUSTOM_FOUR: "camp_custom_four",
	CAMP_CUSTOM_FIVE: "camp_custom_five",

	// ─── List Metadata ────────────────────────────────────────
	LIST_DESCRIPTION: "list_description",
	LIST_NAME: "list_name",

	// ─── Agent Event Push Specific ────────────────────────────
	EVENT: "event",
	MESSAGE: "message",
	COUNTER: "counter",
} as const;

export type CallbackVariable =
	(typeof CallbackVariable)[keyof typeof CallbackVariable];
