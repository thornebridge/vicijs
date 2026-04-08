import { ViciClient } from "../client.js";
import type { AgentConfig, ViciResponse } from "../types.js";
import { toApiParams } from "../types.js";
import type {
	AudioPlaybackParams,
	ChangeIngroupsParams,
	DialParams,
	ExternalAddLeadParams,
	ExternalStatusParams,
	ForceFronterParams,
	ParkCallAction,
	PauseValue,
	PreviewDialAction,
	RaCallControlParams,
	RecordingParams,
	RefreshPanelParams,
	SendNotificationParams,
	SetTimerActionParams,
	StereoRecordingParams,
	StLoginLogParams,
	SwitchLeadParams,
	TransferConferenceParams,
	UpdateFieldsParams,
	VmMessageParams,
	WebphoneUrlAction,
} from "./types.js";

const AGENT_API_PATH = "/agc/api.php";

/**
 * ViciDial Agent API client.
 * Wraps all 31 Agent API functions with full type safety.
 *
 * @example
 * ```ts
 * const agent = new ViciAgent({
 *   baseUrl: 'https://dialer.example.com',
 *   user: 'apiuser',
 *   pass: 'apipass',
 *   agentUser: '1001',
 * });
 *
 * await agent.dial({ value: '5551234567', search: 'YES' });
 * await agent.pause('PAUSE');
 * await agent.hangup();
 * ```
 */
export class ViciAgent extends ViciClient {
	private readonly agentUser: string;

	constructor(config: AgentConfig) {
		super(config);
		if (!config.agentUser) throw new Error("agentUser is required");
		this.agentUser = config.agentUser;
	}

	/** Execute an Agent API function */
	private async call(
		fn: string,
		params: Record<string, string> = {},
	): Promise<ViciResponse> {
		return this.request(AGENT_API_PATH, {
			function: fn,
			agent_user: this.agentUser,
			...params,
		});
	}

	// ─── System/Info ──────────────────────────────────────────

	/** Get API version, build number, and server date/time */
	async version(): Promise<ViciResponse> {
		return this.request(AGENT_API_PATH, { function: "version" });
	}

	/** Get server configuration, timezone, and system specs */
	async webserver(): Promise<ViciResponse> {
		return this.request(AGENT_API_PATH, { function: "webserver" });
	}

	/** Look up agent by CRM AgentID and associate a TeamID */
	async stLoginLog(params: StLoginLogParams): Promise<ViciResponse> {
		return this.call("st_login_log", toApiParams(params));
	}

	/** Get active lead for agent identified by CRM AgentID */
	async stGetAgentActiveLead(params: StLoginLogParams): Promise<ViciResponse> {
		return this.call("st_get_agent_active_lead", toApiParams(params));
	}

	// ─── Call Control ─────────────────────────────────────────

	/** Hang up the current customer call */
	async hangup(): Promise<ViciResponse> {
		return this.call("external_hangup", { value: "1" });
	}

	/** Place a manual dial call on the agent screen */
	async dial(params: DialParams): Promise<ViciResponse> {
		return this.call("external_dial", toApiParams(params));
	}

	/** Send action for a previewed or manual alt-dial lead */
	async previewDialAction(action: PreviewDialAction): Promise<ViciResponse> {
		return this.call("preview_dial_action", { value: action });
	}

	/** Send DTMF tones to the agent's active session */
	async sendDtmf(value: string): Promise<ViciResponse> {
		return this.call("send_dtmf", { value });
	}

	/** Transfer/conference call control */
	async transferConference(
		params: TransferConferenceParams,
	): Promise<ViciResponse> {
		return this.call("transfer_conference", toApiParams(params));
	}

	/** Park or retrieve a customer call */
	async parkCall(action: ParkCallAction): Promise<ViciResponse> {
		return this.call("park_call", { value: action });
	}

	/** Remote agent call control — hangup, transfer to extension/ingroup */
	async raCallControl(params: RaCallControlParams): Promise<ViciResponse> {
		return this.call("ra_call_control", toApiParams(params));
	}

	/** Switch the lead associated with a live inbound call */
	async switchLead(params: SwitchLeadParams): Promise<ViciResponse> {
		return this.call("switch_lead", toApiParams(params));
	}

	/** Get count of calls in queue that could route to this agent */
	async callsInQueueCount(): Promise<ViciResponse> {
		return this.call("calls_in_queue_count", { value: "DISPLAY" });
	}

	/** Initiate a call to the agent's registered phone */
	async callAgent(): Promise<ViciResponse> {
		return this.call("call_agent", { value: "CALL" });
	}

	// ─── Agent State ──────────────────────────────────────────

	/** Pause or resume the agent */
	async pause(action: PauseValue): Promise<ViciResponse> {
		return this.call("external_pause", { value: action });
	}

	/** Set disposition status for the current call */
	async setStatus(params: ExternalStatusParams): Promise<ViciResponse> {
		return this.call("external_status", toApiParams(params));
	}

	/** Log the agent out */
	async logout(): Promise<ViciResponse> {
		return this.call("logout", { value: "LOGOUT" });
	}

	/** Assign a pause code (agent must be paused) */
	async pauseCode(code: string): Promise<ViciResponse> {
		return this.call("pause_code", { value: code });
	}

	/** Modify inbound group assignments for the agent */
	async changeIngroups(params: ChangeIngroupsParams): Promise<ViciResponse> {
		return this.call("change_ingroups", toApiParams(params));
	}

	/** Set a timed action on the agent screen */
	async setTimerAction(params: SetTimerActionParams): Promise<ViciResponse> {
		return this.call("set_timer_action", toApiParams(params));
	}

	// ─── Lead Management ──────────────────────────────────────

	/** Add a new lead to the agent's manual dial queue */
	async addLead(params: ExternalAddLeadParams): Promise<ViciResponse> {
		return this.call("external_add_lead", toApiParams(params));
	}

	/** Update customer fields on the agent screen */
	async updateFields(params: UpdateFieldsParams): Promise<ViciResponse> {
		return this.call("update_fields", toApiParams(params));
	}

	/** Refresh/reload agent screen panels */
	async refreshPanel(params: RefreshPanelParams): Promise<ViciResponse> {
		return this.call("refresh_panel", toApiParams(params));
	}

	// ─── Recording ────────────────────────────────────────────

	/** Start, stop, or check recording status */
	async recording(params: RecordingParams): Promise<ViciResponse> {
		return this.call("recording", toApiParams(params));
	}

	/** Start, stop, or check stereo recording status */
	async stereoRecording(params: StereoRecordingParams): Promise<ViciResponse> {
		return this.call("stereo_recording", toApiParams(params));
	}

	/** Control audio playback in the agent session */
	async audioPlayback(params: AudioPlaybackParams): Promise<ViciResponse> {
		return this.call("audio_playback", toApiParams(params));
	}

	// ─── Notifications ────────────────────────────────────────

	/** Send a text notification (with optional confetti) to agent screens */
	async sendNotification(
		params: SendNotificationParams,
	): Promise<ViciResponse> {
		// ViciDial expects maxParticleCount and particleSpeed in camelCase
		const { maxParticleCount, particleSpeed, ...rest } = params;
		const apiParams = toApiParams(rest);
		if (maxParticleCount !== undefined)
			apiParams.maxParticleCount = String(maxParticleCount);
		if (particleSpeed !== undefined)
			apiParams.particleSpeed = String(particleSpeed);
		// send_notification is not agent-scoped — don't send agent_user
		return this.request(AGENT_API_PATH, {
			function: "send_notification",
			...apiParams,
		});
	}

	/** Set a custom voicemail message for the agent's VM button */
	async vmMessage(params: VmMessageParams): Promise<ViciResponse> {
		return this.call("vm_message", toApiParams(params));
	}

	/** Force the fronter agent to leave a 3-way call */
	async forceFronterLeave3Way(
		params: ForceFronterParams,
	): Promise<ViciResponse> {
		return this.call("force_fronter_leave_3way", toApiParams(params));
	}

	/** Force the fronter agent to stop audio playback */
	async forceFronterAudioStop(
		params: ForceFronterParams,
	): Promise<ViciResponse> {
		return this.call("force_fronter_audio_stop", toApiParams(params));
	}

	/** Get or launch the webphone interface URL */
	async webphoneUrl(action: WebphoneUrlAction): Promise<ViciResponse> {
		return this.call("webphone_url", { value: action });
	}
}
