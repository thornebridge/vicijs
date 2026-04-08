import type {
	AltDialValue,
	AudioPlaybackStage,
	BlendedMode,
	CallbackType,
	CidChoice,
	FronterSearchScope,
	InGroupChangeMode,
	NotificationRecipientType,
	ParkCallAction,
	PauseValue,
	PreviewDialAction,
	RaCallControlStage,
	RecordingAction,
	StereoRecordingAction,
	TimerAction,
	TransferConferenceAction,
	WebphoneUrlAction,
} from "../enums/agent-api.js";

// ─── Version ──────────────────────────────────────────────────
export interface VersionResponse {
	version?: string;
	build?: string;
	date?: string;
	epoch?: string;
}

// ─── Webserver ────────────────────────────────────────────────
export interface WebserverResponse {
	timezone?: string;
	now?: string;
	activeExt?: string;
	agentSession?: string;
	webProtocol?: string;
	phpVersion?: string;
	serverGmt?: string;
}

// ─── External Dial ────────────────────────────────────────────
export interface DialParams {
	/** Phone number to dial, or "MANUALNEXT" */
	value?: string;
	/** Lead ID to dial (overrides value) */
	leadId?: number;
	phoneCode?: string;
	search?: "YES" | "NO";
	preview?: "YES" | "NO";
	focus?: "YES" | "NO";
	vendorId?: string;
	dialPrefix?: string;
	groupAlias?: string;
	vtigerCallback?: "YES" | "NO";
	altUser?: string;
	altDial?: AltDialValue;
	dialIngroup?: string;
	outboundCid?: string;
}

// ─── External Status ──────────────────────────────────────────
export interface ExternalStatusParams {
	/** Disposition status code */
	value: string;
	callbackDatetime?: string;
	callbackType?: CallbackType;
	callbackComments?: string;
	qmDispoCode?: string;
}

// ─── Change Ingroups ──────────────────────────────────────────
export interface ChangeIngroupsParams {
	value: InGroupChangeMode;
	blended: BlendedMode;
	ingroupChoices?: string;
	setAsDefault?: "YES" | "NO";
}

// ─── Update Fields ────────────────────────────────────────────
export interface UpdateFieldsParams {
	firstName?: string;
	lastName?: string;
	middleInitial?: string;
	title?: string;
	phoneNumber?: string;
	phoneCode?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	altPhone?: string;
	city?: string;
	state?: string;
	province?: string;
	postalCode?: string;
	countryCode?: string;
	email?: string;
	gender?: string;
	dateOfBirth?: string;
	comments?: string;
	securityPhrase?: string;
	sourceId?: string;
	vendorLeadCode?: string;
	gmtOffsetNow?: string;
	rank?: number;
	owner?: string;
	formreload?: 1;
	scriptreload?: 1;
	script2reload?: 1;
	emailreload?: 1;
	chatreload?: 1;
}

// ─── Set Timer Action ─────────────────────────────────────────
export interface SetTimerActionParams {
	value: TimerAction;
	notes?: string;
	/** Seconds elapsed before action triggers */
	rank?: number;
}

// ─── RA Call Control ──────────────────────────────────────────
export interface RaCallControlParams {
	/** Call ID from CallerIDname or SIP header */
	value: string;
	stage: RaCallControlStage;
	ingroupChoices?: string;
	phoneNumber?: string;
	status?: string;
}

// ─── Transfer Conference ──────────────────────────────────────
export interface TransferConferenceParams {
	value: TransferConferenceAction;
	phoneNumber?: string;
	ingroupChoices?: string;
	consultative?: "YES" | "NO";
	dialOverride?: "YES" | "NO";
	groupAlias?: string;
	cidChoice?: CidChoice;
	multiDialPhones?: string;
	mdCheck?: "YES" | "NO";
	twCheck?: "YES" | "NO";
}

// ─── Recording ────────────────────────────────────────────────
export interface RecordingParams {
	value: RecordingAction;
	/** Text appended to filename (max 14 chars) */
	stage?: string;
}

// ─── Stereo Recording ─────────────────────────────────────────
export interface StereoRecordingParams {
	value: StereoRecordingAction;
	/** Text appended to filename (max 14 chars) */
	stage?: string;
}

// ─── Audio Playback ───────────────────────────────────────────
export interface AudioPlaybackParams {
	stage: AudioPlaybackStage;
	/** Audio filename without extension (required for PLAY) */
	value?: string;
	dialOverride?: "Y" | "N";
}

// ─── Switch Lead ──────────────────────────────────────────────
export interface SwitchLeadParams {
	leadId?: number;
	vendorLeadCode?: string;
}

// ─── Force Fronter ────────────────────────────────────────────
export interface ForceFronterParams {
	value: FronterSearchScope;
	leadId?: number;
}

// ─── Send Notification ────────────────────────────────────────
export interface SendNotificationParams {
	recipientType: NotificationRecipientType;
	recipient: string;
	notificationDate?: string;
	notificationText?: string;
	textSize?: number;
	textFont?: string;
	textWeight?: string;
	textColor?: string;
	showConfetti?: "Y" | "N";
	duration?: number;
	maxParticleCount?: number;
	particleSpeed?: number;
}

// ─── VM Message ───────────────────────────────────────────────
export interface VmMessageParams {
	/** Audio file(s) — single filename or pipe-separated list */
	value: string;
	leadId?: number;
}

// ─── Refresh Panel ────────────────────────────────────────────
export interface RefreshPanelParams {
	formreload?: 1;
	scriptreload?: 1;
	script2reload?: 1;
	emailreload?: 1;
	chatreload?: 1;
	callbacksreload?: 1;
}

// ─── External Add Lead ───────────────────────────────────────
export interface ExternalAddLeadParams {
	phoneNumber?: string;
	phoneCode?: string;
	dncCheck?: "YES" | "NO";
	campaignDncCheck?: "YES" | "NO";
	firstName?: string;
	lastName?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	altPhone?: string;
	city?: string;
	comments?: string;
	countryCode?: string;
	dateOfBirth?: string;
	email?: string;
	gender?: string;
	gmtOffsetNow?: string;
	middleInitial?: string;
	postalCode?: string;
	province?: string;
	securityPhrase?: string;
	sourceId?: string;
	state?: string;
	title?: string;
	vendorLeadCode?: string;
	rank?: number;
	owner?: string;
}

// ─── Webphone URL ─────────────────────────────────────────────
export interface WebphoneUrlResponse {
	url: string;
}

// ─── ST Login Log ─────────────────────────────────────────────
export interface StLoginLogParams {
	/** CRM AgentID to lookup */
	value: string;
	/** CRM TeamID to associate */
	vendorId: string;
}

// ─── Pause ────────────────────────────────────────────────────
export type {
	ParkCallAction,
	PauseValue,
	PreviewDialAction,
	WebphoneUrlAction,
};
