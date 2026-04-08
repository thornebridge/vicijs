import type {
	BlindMonitorStage,
	CallbackSearchLocation,
	DNCCheck,
	DuplicateCheck,
	Gender,
	OutputFormat,
	PhoneNumberLogDetail,
	PhoneNumberLogType,
	PhoneProtocol,
	RemoteAgentStatus,
	SearchLocation,
	SearchMethod,
	TimeFormat,
	TZMethod,
	WebphoneType,
} from "../enums/admin-api.js";
import type { CallbackType } from "../enums/agent-api.js";

// ─── Common output params ─────────────────────────────────────
export interface OutputParams {
	stage?: OutputFormat;
	header?: "YES" | "NO";
}

// ─── Monitoring ───────────────────────────────────────────────
export interface BlindMonitorParams {
	phoneLogin: string;
	sessionId: string;
	serverIp: string;
	stage?: BlindMonitorStage;
}

export interface AgentStatusParams extends OutputParams {
	agentUser: string;
	includeIp?: "YES" | "NO";
}

export interface UserGroupStatusParams extends OutputParams {
	/** Pipe-delimited group list (e.g., "ADMIN|AGENTS") */
	userGroups: string;
}

export interface InGroupStatusParams extends OutputParams {
	/** Pipe-delimited group list */
	inGroups: string;
}

export interface LoggedInAgentsParams extends OutputParams {
	/** Pipe-delimited campaign list (e.g. "TESTCAMP|INBOUND"), default is all */
	campaigns?: string;
	/** Pipe-delimited user group list (e.g. "ADMIN|AGENTS"), default is all */
	userGroups?: string;
	/** Show agent sub-status and pause_code */
	showSubStatus?: "YES" | "NO";
}

export interface AgentIngroupInfoParams {
	agentUser: string;
	stage?: "info" | "change" | "text";
}

// ─── Reporting ────────────────────────────────────────────────
export interface RecordingLookupParams extends OutputParams {
	agentUser?: string;
	leadId?: number;
	date?: string;
	uniqueid?: string;
	extension?: string;
	duration?: "Y" | "N";
}

export interface DidLogExportParams extends OutputParams {
	phoneNumber: string;
	date: string;
}

export interface AgentStatsExportParams extends OutputParams {
	datetimeStart: string;
	datetimeEnd: string;
	agentUser?: string;
	campaignId?: string;
	timeFormat?: TimeFormat;
	groupByCampaign?: "YES" | "NO";
}

export interface CallStatusStatsParams extends OutputParams {
	/** Dash-delimited campaign IDs, or "---ALL---" / "ALLCAMPAIGNS" */
	campaigns: string;
	/** YYYY-MM-DD format, defaults to today */
	queryDate?: string;
	/** Dash-delimited in-group IDs */
	ingroups?: string;
	/** Dash-delimited status codes */
	statuses?: string;
}

export interface CallDispoReportParams extends OutputParams {
	/** Dash-delimited campaign IDs (at least one of campaigns/ingroups/didPatterns required) */
	campaigns?: string;
	/** Dash-delimited in-group IDs */
	ingroups?: string;
	/** Dash-delimited DID numbers. Note: ViciDial docs also reference this as "did_patterns" in examples. */
	dids?: string;
	/** YYYY-MM-DD format, defaults to today */
	queryDate?: string;
	/** YYYY-MM-DD format, defaults to today */
	endDate?: string;
	/** Dash-delimited status codes */
	statuses?: string;
	/** Dash-delimited status categories */
	categories?: string;
	/** Dash-delimited user list */
	users?: string;
	/** Show breakdown of all statuses */
	statusBreakdown?: "0" | "1";
	/** Show percentages (requires statusBreakdown=1) */
	showPercentages?: "0" | "1";
	/** Download as CSV file */
	fileDownload?: "0" | "1";
}

export interface PhoneNumberLogParams extends OutputParams {
	/** Comma-separated phone numbers */
	phoneNumber: string;
	detail?: PhoneNumberLogDetail;
	type?: PhoneNumberLogType;
	archivedLead?: "Y" | "N";
}

// ─── Lead Management ─────────────────────────────────────────
export interface AddLeadParams {
	phoneNumber: string;
	phoneCode?: string;
	listId?: number;
	dncCheck?: DNCCheck;
	campaignDncCheck?: DNCCheck;
	campaignId?: string;
	addToHopper?: "Y" | "N";
	hopperPriority?: number;
	hopperLocalCallTimeCheck?: "Y" | "N";
	duplicateCheck?: DuplicateCheck | string;
	usacanPrefixCheck?: "Y" | "N";
	usacanAreacodeCheck?: "Y" | "N";
	nanpaAcPrefixCheck?: "Y" | "N";
	customFields?: "Y" | "N";
	tzMethod?: TZMethod;
	lookupState?: "Y" | "N";
	callback?: "Y" | "N";
	callbackStatus?: string;
	callbackDatetime?: string;
	callbackType?: CallbackType;
	callbackUser?: string;
	callbackComments?: string;
	listExistsCheck?: "Y" | "N";
	// Lead data fields
	vendorLeadCode?: string;
	sourceId?: string;
	gmtOffsetNow?: string;
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
	multiAltPhones?: string;
	rank?: number;
	owner?: string;
	entryListId?: number;
}

export interface UpdateLeadParams {
	leadId?: number;
	vendorLeadCode?: string;
	phoneNumber?: string;
	searchMethod?: SearchMethod | string;
	searchLocation?: SearchLocation;
	/** List to search in when search_location=LIST, or list for insert_if_not_found */
	listId?: number;
	/** Campaign ID, required for callbacks */
	campaignId?: string;
	insertIfNotFound?: "Y" | "N";
	records?: number;
	noUpdate?: "Y" | "N";
	customFields?: "Y" | "N";
	deleteLead?: "Y" | "N";
	deleteCfData?: "Y" | "N";
	resetLead?: "Y" | "N";
	updatePhoneNumber?: "Y" | "N";
	listExistsCheck?: "Y" | "N";
	archivedLead?: "Y" | "N";
	// Callback
	callback?: "Y" | "N" | "REMOVE";
	callbackStatus?: string;
	callbackDatetime?: string;
	callbackType?: CallbackType;
	callbackUser?: string;
	callbackComments?: string;
	// Hopper
	addToHopper?: "Y" | "N";
	removeFromHopper?: "Y" | "N";
	hopperPriority?: number;
	hopperLocalCallTimeCheck?: "Y" | "N";
	// Lead data
	userField?: string;
	listIdField?: number;
	status?: string;
	sourceId?: string;
	gmtOffsetNow?: string;
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
	calledCount?: number;
	phoneCode?: string;
	entryListId?: number;
	forceEntryListId?: number;
	multiAltPhones?: string;
}

export interface BatchUpdateLeadParams {
	/** Comma-separated lead IDs (max 100) */
	leadIds: string;
	records?: number;
	listExistsCheck?: "Y" | "N";
	resetLead?: "Y" | "N";
	archivedLead?: "Y" | "N";
	// Lead data fields
	userField?: string;
	listIdField?: number;
	status?: string;
	vendorLeadCode?: string;
	sourceId?: string;
	gmtOffsetNow?: string;
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
	calledCount?: number;
	phoneCode?: string;
}

export interface LeadFieldInfoParams {
	leadId: number;
	fieldName: string;
	customFields?: "Y" | "N";
	listId?: number;
	archivedLead?: "Y" | "N";
}

export interface LeadAllInfoParams extends OutputParams {
	leadId?: number;
	phoneNumber?: string;
	customFields?: "Y" | "N";
	forceEntryListId?: number;
	archivedLead?: "Y" | "N";
}

export interface LeadCallbackInfoParams extends OutputParams {
	leadId: number;
	searchLocation?: CallbackSearchLocation;
}

export interface LeadSearchParams {
	phoneNumber: string;
	records?: number;
	archivedLead?: "Y" | "N";
	header?: "YES" | "NO";
}

export interface LeadStatusSearchParams {
	status?: string;
	date?: string;
	leadId?: number;
	customFields?: "Y" | "N";
	listId?: number;
	archivedLead?: "Y" | "N";
}

export interface CccLeadInfoParams extends OutputParams {
	callId: string;
}

export interface CallidInfoParams extends OutputParams {
	callId: string;
	detail?: "YES" | "NO";
}

// ─── User Management ─────────────────────────────────────────
export interface AddUserParams {
	agentUser: string;
	agentPass: string;
	agentUserLevel: number;
	agentFullName: string;
	agentUserGroup: string;
	phoneLogin?: string;
	phonePass?: string;
	hotkeysActive?: 0 | 1;
	voicemailId?: string;
	email?: string;
	customOne?: string;
	customTwo?: string;
	customThree?: string;
	customFour?: string;
	customFive?: string;
	wrapupSecondsOverride?: number;
	agentChooseIngroups?: 0 | 1;
	agentChooseBlended?: 0 | 1;
	closerDefaultBlended?: 0 | 1;
	/** Pipe-delimited ingroup list */
	inGroups?: string;
}

export interface UpdateUserParams {
	agentUser: string;
	agentPass?: string;
	agentUserLevel?: number;
	agentFullName?: string;
	agentUserGroup?: string;
	phoneLogin?: string;
	phonePass?: string;
	hotkeysActive?: 0 | 1;
	voicemailId?: string;
	email?: string;
	customOne?: string;
	customTwo?: string;
	customThree?: string;
	customFour?: string;
	customFive?: string;
	active?: "Y" | "N";
	wrapupSecondsOverride?: number;
	campaignRank?: number;
	campaignGrade?: number;
	ingroupRank?: number;
	ingroupGrade?: number;
	campRgOnly?: 0 | 1;
	campaignId?: string;
	ingrpRgOnly?: 0 | 1;
	groupId?: string;
	resetPassword?: number;
	inGroups?: string;
	/** Undocumented in official API but functional — triggers user deletion */
	deleteUser?: "Y";
}

export interface CopyUserParams {
	agentUser: string;
	agentPass: string;
	agentFullName: string;
	sourceUser: string;
}

export interface UpdateRemoteAgentParams {
	agentUser: string;
	status?: RemoteAgentStatus;
	campaignId?: string;
	numberOfLines?: number;
}

export interface UserDetailsParams extends OutputParams {
	agentUser: string;
}

export interface AgentCampaignsParams extends OutputParams {
	agentUser: string;
	campaignId?: string;
	ignoreAgentdirect?: "Y" | "N";
}

// ─── Phone Management ─────────────────────────────────────────
export interface AddPhoneParams {
	extension: string;
	dialplanNumber: string;
	voicemailId: string;
	phoneLogin: string;
	phonePass: string;
	serverIp: string;
	protocol: PhoneProtocol;
	registrationPassword: string;
	phoneFullName: string;
	localGmt?: string;
	outboundCid: string;
	phoneContext?: string;
	email?: string;
	adminUserGroup?: string;
	isWebphone?: WebphoneType;
	webphoneAutoAnswer?: "Y" | "N";
	useExternalServerIp?: "Y" | "N";
	templateId?: string;
	onHookAgent?: "Y" | "N";
}

export interface UpdatePhoneParams {
	extension: string;
	serverIp: string;
	deletePhone?: "Y";
	dialplanNumber?: string;
	voicemailId?: string;
	phoneLogin?: string;
	phonePass?: string;
	protocol?: PhoneProtocol;
	registrationPassword?: string;
	phoneFullName?: string;
	localGmt?: string;
	outboundCid?: string;
	outboundAltCid?: string;
	phoneContext?: string;
	email?: string;
	adminUserGroup?: string;
	phoneRingTimeout?: number;
	deleteVmAfterEmail?: "Y" | "N";
	isWebphone?: WebphoneType;
	webphoneAutoAnswer?: "Y" | "N";
	useExternalServerIp?: "Y" | "N";
	templateId?: string;
	onHookAgent?: "Y" | "N";
}

export interface AddPhoneAliasParams {
	/** 2-20 characters */
	aliasId: string;
	/** Comma-separated phone logins (2-255 characters) */
	phoneLogins: string;
	/** 1-50 characters */
	aliasName: string;
}

export interface UpdatePhoneAliasParams {
	/** 2-20 characters */
	aliasId: string;
	/** Comma-separated phone logins (2-255 characters) */
	phoneLogins: string;
	/** 1-50 characters */
	aliasName: string;
	/** Delete the phone alias */
	deleteAlias?: "Y" | "N";
}

// ─── List Management ──────────────────────────────────────────
export interface AddListParams {
	/** 2-14 digits */
	listId: number;
	/** 2-30 characters */
	listName: string;
	/** 2-8 characters, must be valid */
	campaignId: string;
	active?: "Y" | "N";
	/** Up to 255 chars. Use "--BLANK--" to empty. */
	listDescription?: string;
	/** 6-20 digits */
	outboundCid?: string;
	/** 1-10 chars, must be valid script */
	script?: string;
	/** 2-100 characters */
	amMessage?: string;
	/** 1-10 chars, must be valid in-group */
	dropInboundGroup?: string;
	/** 6-100 chars, URL-encodable */
	webFormAddress?: string;
	/** 6-100 chars, URL-encodable */
	webFormAddressTwo?: string;
	/** 6-100 chars, URL-encodable */
	webFormAddressThree?: string;
	/** 4-100 chars, valid 4-digit groups of 24-hour time (e.g. "0900-1700-2359") */
	resetTime?: string;
	tzMethod?: TZMethod;
	/** Valid call time ID or "campaign" (default) */
	localCallTime?: string;
	/** YYYY-MM-DD format */
	expirationDate?: string;
	/** Transfer - Conf Number 1 (1-50 characters) */
	xferconfOne?: string;
	/** Transfer - Conf Number 2 (1-50 characters) */
	xferconfTwo?: string;
	/** Transfer - Conf Number 3 (1-50 characters) */
	xferconfThree?: string;
	/** Transfer - Conf Number 4 (1-50 characters) */
	xferconfFour?: string;
	/** Transfer - Conf Number 5 (1-50 characters) */
	xferconfFive?: string;
	/** 2-14 digits, valid list ID with custom fields. Requires "Custom Fields Modify" permission. */
	customFieldsCopy?: number;
	customCopyMethod?: "APPEND" | "UPDATE" | "REPLACE";
}

export interface UpdateListParams {
	/** 2-14 digits */
	listId: number;
	// Settings
	/** Attempt insert as new list if no match */
	insertIfNotFound?: "Y" | "N";
	/** Reset Called-Since-Last-Reset flag for all leads */
	resetList?: "Y" | "N";
	/** Delete the list */
	deleteList?: "Y" | "N";
	/** Delete all leads with this list_id */
	deleteLeads?: "Y" | "N";
	/** Affect only vicidial_list_archive leads */
	archivedLead?: "Y" | "N";
	// Editable fields (same as AddListParams)
	listName?: string;
	campaignId?: string;
	active?: "Y" | "N";
	listDescription?: string;
	outboundCid?: string;
	script?: string;
	amMessage?: string;
	dropInboundGroup?: string;
	webFormAddress?: string;
	webFormAddressTwo?: string;
	webFormAddressThree?: string;
	resetTime?: string;
	tzMethod?: TZMethod;
	localCallTime?: string;
	expirationDate?: string;
	xferconfOne?: string;
	xferconfTwo?: string;
	xferconfThree?: string;
	xferconfFour?: string;
	xferconfFive?: string;
	customFieldsCopy?: number;
	customCopyMethod?: "APPEND" | "UPDATE" | "REPLACE";
	// Custom field operations — set to "Y" and provide field_* params alongside
	customFieldsAdd?: "Y";
	customFieldsUpdate?: "Y";
	customFieldsDelete?: "Y";
	/** Required for custom field add/update/delete */
	fieldLabel?: string;
	fieldName?: string;
	fieldSize?: number;
	fieldType?:
		| "TEXT"
		| "SELECT"
		| "AREA"
		| "MULTI"
		| "RADIO"
		| "CHECKBOX"
		| "DATE"
		| "TIME";
	fieldRank?: number;
	fieldOrder?: number;
	fieldRerank?: "YES" | "NO";
	fieldMax?: number;
	fieldDefault?: string;
	/** Use %0A for newline, %7C for pipe */
	fieldOptions?: string;
	fieldDuplicate?: "Y" | "N";
	fieldDescription?: string;
	fieldHelp?: string;
	fieldRequired?: "Y" | "N";
	multiPosition?: "HORIZONTAL" | "VERTICAL";
	namePosition?: "TOP" | "LEFT";
	fieldEncrypt?: "Y" | "N";
	fieldShowHide?:
		| "DISABLED"
		| "X_OUT_ALL"
		| "LAST_1"
		| "LAST_2"
		| "LAST_3"
		| "LAST_4"
		| "FIRST_1_LAST_4";
}

export interface ListInfoParams extends OutputParams {
	listId: number;
	dialableCount?: "Y" | "N";
	/** Include counts of all leads and NEW status leads */
	leadsCounts?: "Y" | "N";
	/** Query only vicidial_list_archive leads */
	archivedLead?: "Y" | "N";
}

export interface ListCustomFieldsParams extends OutputParams {
	/** List ID, or "---ALL---" for all lists */
	listId?: number | string;
	/** Field ordering: table_order (default), alpha_up, alpha_down */
	customOrder?: "table_order" | "alpha_up" | "alpha_down";
}

// ─── Campaign Management ──────────────────────────────────────
export interface UpdateCampaignParams {
	campaignId: string;
	/** 6-40 characters */
	campaignName?: string;
	active?: "Y" | "N";
	/** 2-5 characters, e.g. "3.0" */
	autoDialLevel?: string;
	/** 3-20 digits */
	adaptiveMaximumLevel?: string;
	/** 3-20 characters */
	campaignVdadExten?: string;
	/** 1-2000 */
	hopperLevel?: number;
	/** Reset the campaign hopper */
	resetHopper?: "Y" | "N";
	dialMethod?:
		| "MANUAL"
		| "RATIO"
		| "INBOUND_MAN"
		| "ADAPT_AVERAGE"
		| "ADAPT_HARD_LIMIT"
		| "ADAPT_TAPERED";
	/** 1-120 seconds */
	dialTimeout?: number;
	/** Lead ordering — e.g. "UP", "DOWN", "RANDOM 2nd NEW", "DOWN COUNT" */
	listOrder?: string;
	/** Randomize hopper loading within list order */
	listOrderRandomize?: "Y" | "N";
	/** e.g. "LEAD_ASCEND", "CALLTIME_DESCEND", "VENDOR_ASCEND" */
	listOrderSecondary?: string;
	/** 1-20 digits */
	outboundCid?: string;
	/** 1-6 character status code to add to dial statuses */
	dialStatusAdd?: string;
	/** 1-6 character status code to remove from dial statuses */
	dialStatusRemove?: string;
	/** Valid filter ID or "---NONE---" */
	leadFilterId?: string;
	/** Transfer - Conf Number 1 (1-50 characters) */
	xferconfOne?: string;
	/** Transfer - Conf Number 2 (1-50 characters) */
	xferconfTwo?: string;
	/** Transfer - Conf Number 3 (1-50 characters) */
	xferconfThree?: string;
	/** Transfer - Conf Number 4 (1-50 characters) */
	xferconfFour?: string;
	/** Transfer - Conf Number 5 (1-50 characters) */
	xferconfFive?: string;
	/** Disposition URL — must be URL-encoded. Set to "ALT" to use alt URLs */
	dispoCallUrl?: string;
	/** Agent Screen Webform 1 URL — must be URL-encoded */
	webformOne?: string;
	/** Agent Screen Webform 2 URL — must be URL-encoded */
	webformTwo?: string;
	/** Agent Screen Webform 3 URL — must be URL-encoded */
	webformThree?: string;
}

export interface CampaignsListParams extends OutputParams {
	campaignId?: string;
}

export interface HopperListParams extends OutputParams {
	campaignId: string;
	searchMethod?: "BLOCK";
}

export interface HopperBulkInsertParams {
	/** Comma-separated lead IDs (max 1000) */
	leadIds: string;
	hopperPriority?: number;
	hopperLocalCallTimeCheck?: "Y" | "N";
}

// ─── DID Management ───────────────────────────────────────────
export interface AddDidParams {
	/** 2-50 characters. URL-encode special chars (e.g. + as %2B) */
	didPattern: string;
	didDescription?: string;
	active?: "Y" | "N";
	didRoute?:
		| "EXTEN"
		| "VOICEMAIL"
		| "AGENT"
		| "PHONE"
		| "IN_GROUP"
		| "CALLMENU"
		| "VMAIL_NO_INST";
	recordCall?: "Y" | "N" | "Y_QUEUESTOP";
	extension?: string;
	extenContext?: string;
	voicemailExt?: string;
	phoneExtension?: string;
	serverIp?: string;
	/** Valid in-group group_id */
	group?: string;
	/** Valid call menu menu_id */
	menuId?: string;
	filterCleanCidNumber?: string;
	callHandleMethod?: string;
	agentSearchMethod?: "LO" | "LB" | "SO";
	listId?: number;
	entryListId?: number;
	campaignId?: string;
	phoneCode?: string;
}

export interface CopyDidParams {
	/** 2-50 characters, must be an existing DID */
	sourceDidPattern: string;
	/** 2-2000 characters, comma-separated for multiple DIDs */
	newDids: string;
	didDescription?: string;
}

export interface UpdateDidParams {
	/** 2-50 characters, must be an existing DID */
	didPattern: string;
	didDescription?: string;
	active?: "Y" | "N";
	didRoute?:
		| "EXTEN"
		| "VOICEMAIL"
		| "AGENT"
		| "PHONE"
		| "IN_GROUP"
		| "CALLMENU"
		| "VMAIL_NO_INST";
	recordCall?: "Y" | "N" | "Y_QUEUESTOP";
	extension?: string;
	extenContext?: string;
	voicemailExt?: string;
	phoneExtension?: string;
	serverIp?: string;
	group?: string;
	menuId?: string;
	filterCleanCidNumber?: string;
	callHandleMethod?: string;
	agentSearchMethod?: "LO" | "LB" | "SO";
	listId?: number;
	entryListId?: number;
	campaignId?: string;
	phoneCode?: string;
	deleteDid?: "Y";
}

// ─── DNC Management ───────────────────────────────────────────
export interface DncPhoneParams {
	phoneNumber: string;
	campaignId: string;
}

export interface FpgPhoneParams {
	phoneNumber: string;
	group: string;
}

// ─── Validation ───────────────────────────────────────────────
export interface CheckPhoneNumberParams {
	/** 6-16 digits */
	phoneNumber: string;
	/** 1-4 digits, defaults to 1 */
	phoneCode?: string;
	/** Must be a valid call time ID in the system */
	localCallTime: string;
	dncCheck?: DNCCheck;
	campaignDncCheck?: DNCCheck;
	campaignId?: string;
	usacanPrefixCheck?: "Y" | "N";
	usacanAreacodeCheck?: "Y" | "N";
	nanpaAcPrefixCheck?: "Y" | "N";
	tzMethod?: TZMethod;
	/** 5 digits, USA zipcodes only. Needed for POSTAL_CODE tz_method */
	postalCode?: string;
	/** 2 letters. Needed if state call time rules enabled */
	state?: string;
	/** 2-5 letters. Needed for TZCODE tz_method */
	owner?: string;
}

// ─── CID/Alias Management ─────────────────────────────────────
export interface AddGroupAliasParams {
	callerIdNumber: string;
	groupAliasId?: string;
	groupAliasName?: string;
	callerIdName?: string;
	active?: "Y" | "N";
	adminUserGroup?: string;
}

export interface UpdateCidGroupEntryParams {
	/** 2-20 characters, must be a valid CID Group ID or Campaign ID */
	cidGroupId: string;
	/** Areacode (e.g. "312"), state (e.g. "FL"), or "---ALL---" */
	areacode: string;
	/** Action to perform */
	stage: "UPDATE" | "ADD" | "DELETE" | "INFO";
	/** 1-20 digits, or "---ALL---" */
	outboundCid?: string;
	/** 6-50 characters */
	cidDescription?: string;
	active?: "Y" | "N";
}

// ─── Campaign URL/Presets ─────────────────────────────────────
export interface UpdateAltUrlParams {
	campaignId: string;
	entryType: "campaign";
	urlType: "dispo" | "start" | "addlead" | "noagent";
	/** Existing alt URL ID, "NEW" to create, or "LIST" to list all */
	altUrlId?: string | "NEW" | "LIST";
	active?: "Y" | "N";
	urlRank?: number;
	/** Space-separated status codes, or "---ALL---" */
	urlStatuses?: string;
	urlDescription?: string;
	/** Space-separated list IDs, or blank for all */
	urlLists?: string;
	/** Minimum call length in seconds (default: 0) */
	urlCallLength?: number;
	/** Must be URL-encoded */
	urlAddress?: string;
}

export interface UpdatePresetsParams {
	campaignId: string;
	/** Preset name — can be omitted if only one preset exists for this campaign */
	presetName?: string;
	/** "UPDATE" (default), "NEW", "DELETE", or "LIST" */
	action?: "UPDATE" | "NEW" | "DELETE" | "LIST";
	/** 1-50 digits */
	presetNumber?: string;
	presetHideNumber?: "Y" | "N";
	/** DTMF digits (0-9, P=#, S=*, Q=half-second quiet) */
	presetDtmf?: string;
	/** Output format for LIST action */
	stage?: OutputFormat;
	/** Include header for LIST action */
	header?: "YES" | "NO";
}

// ─── Log Management ───────────────────────────────────────────
export interface UpdateLogEntryParams {
	callId: string;
	group: string;
	status: string;
}
