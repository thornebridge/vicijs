/** All 70 agent push event types */
export const AgentEvent = {
	// Session events
	LOGGED_IN: "logged_in",
	LOGGED_OUT: "logged_out",
	LOGGED_OUT_COMPLETE: "logged_out_complete",
	LOGIN_INVALID: "login_invalid",
	SESSION_DISABLED: "session_disabled",
	SESSION_EMPTY: "session_empty",
	SESSION_CHANNELS: "session_channels",

	// Agent state events
	STATE_READY: "state_ready",
	STATE_PAUSED: "state_paused",

	// Call events
	CALL_DIALED: "call_dialed",
	CALL_ANSWERED: "call_answered",
	CALL_DEAD: "call_dead",
	CALL_SCRIPT: "call_script",
	AGENT_HANGUP: "agent_hangup",

	// Dead call trigger events
	DEAD_TRIGGER_AUDIO: "dead_trigger_audio",
	DEAD_TRIGGER_URL: "dead_trigger_url",
	DEAD_TRIGGER_URL_SENT: "dead_trigger_url_sent",

	// Communication events
	OTHER_ANSWERED: "other_answered",

	// Disposition events
	DISPO_SCREEN_OPEN: "dispo_screen_open",
	DISPO_SET: "dispo_set",
	DISPO_SET_TWICE: "dispo_set_twice",

	// Three-way call events
	THREE_WAY_START: "3way_start",
	THREE_WAY_ANSWERED: "3way_answered",
	THREE_WAY_AGENT_HANGUP: "3way_agent_hangup",
	THREE_WAY_AGENT_LEAVE: "3way_agent_leave",

	// Transfer events
	TRANSFER_LOCAL_CLOSER: "transfer_local_closer",
	TRANSFER_BLIND: "transfer_blind",
	TRANSFER_VMAIL: "transfer_vmail",
	TRANSFER_PANEL_OPEN: "transfer_panel_open",
	TRANSFER_PANEL_CLOSED: "transfer_panel_closed",

	// Park events
	PARK_STARTED: "park_started",
	PARK_RETRIEVED: "park_retrieved",
	PARK_IVR_STARTED: "park_ivr_started",
	PARK_IVR_RETRIEVED: "park_ivr_retrieved",

	// Screen/UI events
	MANUAL_DIAL_OPEN: "manual_dial_open",
	CALLBACK_SELECT_OPEN: "callback_select_open",
	INGROUP_SCREEN_OPEN: "ingroup_screen_open",
	INGROUP_SCREEN_CLOSED: "ingroup_screen_closed",
	TERRITORY_SCREEN_OPEN: "territory_screen_open",
	TERRITORY_SCREEN_CLOSED: "territory_screen_closed",
	CONTACT_SEARCH_OPEN: "contact_search_open",
	LEAD_SEARCH_OPEN: "lead_search_open",
	PAUSE_CODE_OPEN: "pause_code_open",
	CUSTOMER_GONE: "customer_gone",
	BLIND_MONITOR_ALERT: "blind_monitor_alert",

	// System events
	AGENT_ALERT: "agent_alert",
	TIME_SYNC: "time_sync",
	NONE_IN_SESSION: "none_in_session",
	UPDATE_FIELDS: "update_fields",
} as const;

export type AgentEvent = (typeof AgentEvent)[keyof typeof AgentEvent];
