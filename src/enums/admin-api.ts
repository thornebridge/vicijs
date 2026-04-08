/** Non-Agent API function names */
export const AdminApiFunction = {
	// System
	VERSION: "version",
	SOUNDS_LIST: "sounds_list",
	MOH_LIST: "moh_list",
	VM_LIST: "vm_list",
	SERVER_REFRESH: "server_refresh",
	CONTAINER_LIST: "container_list",

	// Monitoring
	BLIND_MONITOR: "blind_monitor",
	AGENT_INGROUP_INFO: "agent_ingroup_info",
	AGENT_STATUS: "agent_status",
	USER_GROUP_STATUS: "user_group_status",
	IN_GROUP_STATUS: "in_group_status",
	LOGGED_IN_AGENTS: "logged_in_agents",

	// Reporting
	RECORDING_LOOKUP: "recording_lookup",
	DID_LOG_EXPORT: "did_log_export",
	AGENT_STATS_EXPORT: "agent_stats_export",
	CALL_STATUS_STATS: "call_status_stats",
	CALL_DISPO_REPORT: "call_dispo_report",
	PHONE_NUMBER_LOG: "phone_number_log",

	// Leads
	ADD_LEAD: "add_lead",
	UPDATE_LEAD: "update_lead",
	BATCH_UPDATE_LEAD: "batch_update_lead",
	LEAD_FIELD_INFO: "lead_field_info",
	LEAD_ALL_INFO: "lead_all_info",
	LEAD_CALLBACK_INFO: "lead_callback_info",
	LEAD_SEARCH: "lead_search",
	LEAD_STATUS_SEARCH: "lead_status_search",
	CCC_LEAD_INFO: "ccc_lead_info",
	CALLID_INFO: "callid_info",
	LEAD_DEARCHIVE: "lead_dearchive",

	// Users
	ADD_USER: "add_user",
	UPDATE_USER: "update_user",
	COPY_USER: "copy_user",
	UPDATE_REMOTE_AGENT: "update_remote_agent",
	USER_DETAILS: "user_details",
	AGENT_CAMPAIGNS: "agent_campaigns",

	// Phones
	ADD_PHONE: "add_phone",
	UPDATE_PHONE: "update_phone",
	ADD_PHONE_ALIAS: "add_phone_alias",
	UPDATE_PHONE_ALIAS: "update_phone_alias",

	// Lists
	ADD_LIST: "add_list",
	UPDATE_LIST: "update_list",
	LIST_INFO: "list_info",
	LIST_CUSTOM_FIELDS: "list_custom_fields",

	// Campaigns
	UPDATE_CAMPAIGN: "update_campaign",
	CAMPAIGNS_LIST: "campaigns_list",
	HOPPER_LIST: "hopper_list",
	HOPPER_BULK_INSERT: "hopper_bulk_insert",

	// DIDs
	ADD_DID: "add_did",
	COPY_DID: "copy_did",
	UPDATE_DID: "update_did",

	// DNC
	ADD_DNC_PHONE: "add_dnc_phone",
	DELETE_DNC_PHONE: "delete_dnc_phone",
	ADD_FPG_PHONE: "add_fpg_phone",
	DELETE_FPG_PHONE: "delete_fpg_phone",

	// Validation
	CHECK_PHONE_NUMBER: "check_phone_number",

	// CID/Aliases
	ADD_GROUP_ALIAS: "add_group_alias",
	UPDATE_CID_GROUP_ENTRY: "update_cid_group_entry",

	// Campaign URLs/Presets
	UPDATE_ALT_URL: "update_alt_url",
	UPDATE_PRESETS: "update_presets",

	// Logs
	UPDATE_LOG_ENTRY: "update_log_entry",
} as const;

export type AdminApiFunction =
	(typeof AdminApiFunction)[keyof typeof AdminApiFunction];

/** Blind monitor stage values */
export type BlindMonitorStage =
	| "MONITOR"
	| "BARGE"
	| "BARGESWAP"
	| "HIJACK"
	| "WHISPER";

/** Campaign dial method */
export type DialMethod =
	| "MANUAL"
	| "RATIO"
	| "INBOUND_MAN"
	| "ADAPT_AVERAGE"
	| "ADAPT_HARD_LIMIT"
	| "ADAPT_TAPERED";

/** Phone protocol */
export type PhoneProtocol = "IAX2" | "SIP" | "Zap" | "EXTERNAL";

/** Basic sort order for leads/lists. Composite values like "RANDOM 2nd NEW" or "DOWN COUNT" are also valid. */
export type SortOrder = "UP" | "DOWN" | "RANDOM";

/** API output format */
export type OutputFormat = "csv" | "tab" | "pipe" | "newline" | "selectframe";

/** Time format for stats */
export type TimeFormat = "H" | "HF" | "M" | "S";

/** Gender values */
export type Gender = "U" | "M" | "F";

/** Search location scope */
export type SearchLocation = "LIST" | "CAMPAIGN" | "SYSTEM";

/** Callback search location */
export type CallbackSearchLocation = "CURRENT" | "ARCHIVE" | "ALL";

/** DNC check mode */
export type DNCCheck = "Y" | "N" | "AREACODE";

/** Timezone lookup method */
export type TZMethod =
	| ""
	| "COUNTRY_AND_AREA_CODE"
	| "POSTAL_CODE"
	| "NANPA_PREFIX"
	| "OWNER_TIME_ZONE_CODE";

/** Webphone type */
export type WebphoneType = "Y" | "N" | "Y_API_LAUNCH";

/** Remote agent status */
export type RemoteAgentStatus = "ACTIVE" | "INACTIVE";

/** Agent real-time sub-status */
export type AgentRealTimeSubStatus =
	| "DEAD"
	| "DISPO"
	| "3-WAY"
	| "PARK"
	| "RING"
	| "PREVIEW"
	| "DIAL"
	| "";

/** Phone number log call direction */
export type PhoneNumberLogType = "IN" | "OUT" | "ALL";

/** Phone number log detail level */
export type PhoneNumberLogDetail = "ALL" | "LAST";

/** Base duplicate check methods */
type DuplicateCheckBase =
	| "DUPLIST"
	| "DUPCAMP"
	| "DUPSYS"
	| "DUPPHONEALTLIST"
	| "DUPPHONEALTCAMP"
	| "DUPPHONEALTSYS"
	| "DUPTITLEALTPHONELIST"
	| "DUPTITLEALTPHONECAMP"
	| "DUPTITLEALTPHONESYS"
	| "DUPNAMEPHONELIST"
	| "DUPNAMEPHONECAMP"
	| "DUPNAMEPHONESYS";

/** Day-bound suffixes for time-limited duplicate checks */
type DuplicateCheckDayBound =
	| "1DAY"
	| "2DAY"
	| "3DAY"
	| "7DAY"
	| "14DAY"
	| "15DAY"
	| "21DAY"
	| "28DAY"
	| "30DAY"
	| "60DAY"
	| "90DAY"
	| "180DAY"
	| "360DAY";

/** Duplicate check methods — base types or any base with a day-bound suffix (e.g. "DUPLIST30DAY") */
export type DuplicateCheck =
	| DuplicateCheckBase
	| `${DuplicateCheckBase}${DuplicateCheckDayBound}`;

/** Search method for update_lead */
export type SearchMethod = "LEAD_ID" | "VENDOR_LEAD_CODE" | "PHONE_NUMBER";

/** Custom field types */
export type CustomFieldType =
	| "TEXT"
	| "AREA"
	| "SELECT"
	| "MULTI"
	| "RADIO"
	| "CHECKBOX"
	| "DATE"
	| "TIME";
