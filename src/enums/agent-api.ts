/** Agent API function names */
export const AgentApiFunction = {
	VERSION: "version",
	EXTERNAL_HANGUP: "external_hangup",
	EXTERNAL_STATUS: "external_status",
	EXTERNAL_PAUSE: "external_pause",
	EXTERNAL_DIAL: "external_dial",
	PREVIEW_DIAL_ACTION: "preview_dial_action",
	EXTERNAL_ADD_LEAD: "external_add_lead",
	CHANGE_INGROUPS: "change_ingroups",
	UPDATE_FIELDS: "update_fields",
	SET_TIMER_ACTION: "set_timer_action",
	ST_LOGIN_LOG: "st_login_log",
	ST_GET_AGENT_ACTIVE_LEAD: "st_get_agent_active_lead",
	RA_CALL_CONTROL: "ra_call_control",
	SEND_DTMF: "send_dtmf",
	TRANSFER_CONFERENCE: "transfer_conference",
	PARK_CALL: "park_call",
	LOGOUT: "logout",
	RECORDING: "recording",
	STEREO_RECORDING: "stereo_recording",
	WEBSERVER: "webserver",
	WEBPHONE_URL: "webphone_url",
	CALL_AGENT: "call_agent",
	AUDIO_PLAYBACK: "audio_playback",
	SWITCH_LEAD: "switch_lead",
	CALLS_IN_QUEUE_COUNT: "calls_in_queue_count",
	FORCE_FRONTER_LEAVE_3WAY: "force_fronter_leave_3way",
	FORCE_FRONTER_AUDIO_STOP: "force_fronter_audio_stop",
	SEND_NOTIFICATION: "send_notification",
	VM_MESSAGE: "vm_message",
	REFRESH_PANEL: "refresh_panel",
	PAUSE_CODE: "pause_code",
} as const;

export type AgentApiFunction =
	(typeof AgentApiFunction)[keyof typeof AgentApiFunction];

/** Pause action values */
export type PauseValue = "PAUSE" | "RESUME";

/** Preview dial action values */
export type PreviewDialAction =
	| "SKIP"
	| "DIALONLY"
	| "ALTDIAL"
	| "ADR3DIAL"
	| "FINISH";

/** In-group change mode */
export type InGroupChangeMode = "CHANGE" | "REMOVE" | "ADD";

/** Timer action values */
export type TimerAction =
	| "NONE"
	| "WEBFORM"
	| "WEBFORM2"
	| "D1_DIAL"
	| "D2_DIAL"
	| "D3_DIAL"
	| "D4_DIAL"
	| "D5_DIAL"
	| "MESSAGE_ONLY";

/** Remote agent call control stages */
export type RaCallControlStage =
	| "HANGUP"
	| "EXTENSIONTRANSFER"
	| "INGROUPTRANSFER";

/** Transfer conference action values */
export type TransferConferenceAction =
	| "HANGUP_XFER"
	| "HANGUP_BOTH"
	| "BLIND_TRANSFER"
	| "LEAVE_VM"
	| "LOCAL_CLOSER"
	| "DIAL_WITH_CUSTOMER"
	| "PARK_CUSTOMER_DIAL"
	| "LEAVE_3WAY_CALL";

/** Caller ID choice values */
export type CidChoice = "CAMPAIGN" | "AGENT_PHONE" | "CUSTOMER" | "CUSTOM_CID";

/** Park call action values */
export type ParkCallAction =
	| "PARK_CUSTOMER"
	| "GRAB_CUSTOMER"
	| "PARK_IVR_CUSTOMER"
	| "GRAB_IVR_CUSTOMER"
	| "PARK_XFER"
	| "GRAB_XFER"
	| "SWAP_PARK_CUSTOMER"
	| "SWAP_PARK_XFER"
	| "HANGUP_XFER_GRAB_CUSTOMER";

/** Recording action values */
export type RecordingAction = "START" | "STOP" | "STATUS";

/** Stereo recording action values */
export type StereoRecordingAction = "BEGIN" | "END" | "STATUS";

/** Audio playback stage values */
export type AudioPlaybackStage =
	| "PLAY"
	| "STOP"
	| "PAUSE"
	| "RESUME"
	| "RESTART";

/** Webphone URL action values */
export type WebphoneUrlAction = "DISPLAY" | "LAUNCH";

/** Callback type values */
export type CallbackType = "USERONLY" | "ANYONE";

/** Alternate dial mode values */
export type AltDialValue = "ALT" | "ADDR3" | "SEARCH";

/** Fronter search scope values */
export type FronterSearchScope = "LOCAL_ONLY" | "LOCAL_AND_CCC" | "CCC_REMOTE";

/** Notification recipient type values */
export type NotificationRecipientType = "USER" | "USER_GROUP" | "CAMPAIGN";

/** Blended mode values */
export type BlendedMode = "YES" | "NO";
