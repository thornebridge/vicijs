// Client classes

export { ViciAdmin } from "./admin/index.js";
// Admin API types
export type {
	AddDidParams,
	AddGroupAliasParams,
	AddLeadParams,
	AddListParams,
	AddPhoneAliasParams,
	AddPhoneParams,
	AddUserParams,
	AgentCampaignsParams,
	AgentIngroupInfoParams,
	AgentStatsExportParams,
	AgentStatusParams,
	BatchUpdateLeadParams,
	BlindMonitorParams,
	CallDispoReportParams,
	CallidInfoParams,
	CallStatusStatsParams,
	CampaignsListParams,
	CccLeadInfoParams,
	CheckPhoneNumberParams,
	CopyDidParams,
	CopyUserParams,
	DidLogExportParams,
	DncPhoneParams,
	FpgPhoneParams,
	HopperBulkInsertParams,
	HopperListParams,
	InGroupStatusParams,
	LeadAllInfoParams,
	LeadCallbackInfoParams,
	LeadFieldInfoParams,
	LeadSearchParams,
	LeadStatusSearchParams,
	ListCustomFieldsParams,
	ListInfoParams,
	LoggedInAgentsParams,
	PhoneNumberLogParams,
	RecordingLookupParams,
	UpdateAltUrlParams,
	UpdateCampaignParams,
	UpdateCidGroupEntryParams,
	UpdateDidParams,
	UpdateLeadParams,
	UpdateListParams,
	UpdateLogEntryParams,
	UpdatePhoneAliasParams,
	UpdatePhoneParams,
	UpdatePresetsParams,
	UpdateRemoteAgentParams,
	UpdateUserParams,
	UserDetailsParams,
	UserGroupStatusParams,
} from "./admin/types.js";
export { ViciAgent } from "./agent/index.js";
// Agent API types
export type {
	AudioPlaybackParams,
	ChangeIngroupsParams,
	DialParams,
	ExternalAddLeadParams,
	ExternalStatusParams,
	ForceFronterParams,
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
} from "./agent/types.js";
export { ViciClient } from "./client.js";
// Enums
export * from "./enums/index.js";
// Error classes
export {
	ViciAuthError,
	ViciError,
	ViciHttpError,
	ViciNotFoundError,
	ViciPermissionError,
	ViciTimeoutError,
	ViciValidationError,
} from "./errors.js";
// Parser utilities
export {
	mapFields,
	parseDelimitedData,
	parseMultiLine,
	parseResponse,
	splitFields,
} from "./parser.js";
// Response schemas
export { ADMIN_SCHEMAS, AGENT_SCHEMAS } from "./schemas.js";
// Shared types
export type {
	AgentConfig,
	CallbackData,
	LeadData,
	ViciConfig,
	ViciResponse,
} from "./types.js";
export { blank, toApiParams } from "./types.js";
