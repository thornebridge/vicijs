import { ViciClient } from "../client.js";
import type { ViciConfig, ViciResponse } from "../types.js";
import { toApiParams } from "../types.js";
import type {
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
} from "./types.js";

const ADMIN_API_PATH = "/vicidial/non_agent_api.php";

// ─── Domain Sub-Clients ──────────────────────────────────────

class LeadsClient {
	constructor(private call: CallFn) {}

	/** Add a new lead */
	async add(params: AddLeadParams): Promise<ViciResponse> {
		return this.call("add_lead", toApiParams(params));
	}

	/** Update an existing lead */
	async update(params: UpdateLeadParams): Promise<ViciResponse> {
		return this.call("update_lead", toApiParams(params));
	}

	/** Batch update multiple leads with the same field values */
	async batchUpdate(params: BatchUpdateLeadParams): Promise<ViciResponse> {
		return this.call("batch_update_lead", toApiParams(params));
	}

	/** Get a single field value from a lead */
	async fieldInfo(params: LeadFieldInfoParams): Promise<ViciResponse> {
		return this.call("lead_field_info", toApiParams(params));
	}

	/** Get all lead data with optional custom fields */
	async allInfo(params: LeadAllInfoParams): Promise<ViciResponse> {
		return this.call("lead_all_info", toApiParams(params));
	}

	/** Get callback info for a lead */
	async callbackInfo(params: LeadCallbackInfoParams): Promise<ViciResponse> {
		return this.call("lead_callback_info", toApiParams(params));
	}

	/** Search leads by phone number */
	async search(params: LeadSearchParams): Promise<ViciResponse> {
		return this.call("lead_search", toApiParams(params));
	}

	/** Search leads by status and date */
	async statusSearch(params: LeadStatusSearchParams): Promise<ViciResponse> {
		return this.call("lead_status_search", toApiParams(params));
	}

	/** Get lead data for cross-cluster calls */
	async cccInfo(params: CccLeadInfoParams): Promise<ViciResponse> {
		return this.call("ccc_lead_info", toApiParams(params));
	}

	/** Get call info by call ID */
	async callidInfo(params: CallidInfoParams): Promise<ViciResponse> {
		return this.call("callid_info", toApiParams(params));
	}

	/** Move lead from archive to active table */
	async dearchive(leadId: number): Promise<ViciResponse> {
		return this.call("lead_dearchive", { lead_id: String(leadId) });
	}
}

class UsersClient {
	constructor(private call: CallFn) {}

	/** Add a new user account */
	async add(params: AddUserParams): Promise<ViciResponse> {
		return this.call("add_user", toApiParams(params));
	}

	/** Update user settings or delete a user */
	async update(params: UpdateUserParams): Promise<ViciResponse> {
		return this.call("update_user", toApiParams(params));
	}

	/** Duplicate an existing user */
	async copy(params: CopyUserParams): Promise<ViciResponse> {
		return this.call("copy_user", toApiParams(params));
	}

	/** Update remote agent configuration */
	async updateRemoteAgent(
		params: UpdateRemoteAgentParams,
	): Promise<ViciResponse> {
		return this.call("update_remote_agent", toApiParams(params));
	}

	/** Get user account details */
	async details(params: UserDetailsParams): Promise<ViciResponse> {
		return this.call("user_details", toApiParams(params));
	}

	/** Get allowed campaigns and inbound groups for an agent */
	async agentCampaigns(params: AgentCampaignsParams): Promise<ViciResponse> {
		return this.call("agent_campaigns", toApiParams(params));
	}
}

class CampaignsClient {
	constructor(private call: CallFn) {}

	/** Update campaign settings */
	async update(params: UpdateCampaignParams): Promise<ViciResponse> {
		return this.call("update_campaign", toApiParams(params));
	}

	/** List campaigns */
	async list(params: CampaignsListParams = {}): Promise<ViciResponse> {
		return this.call("campaigns_list", toApiParams(params));
	}

	/** List leads in the hopper for a campaign */
	async hopperList(params: HopperListParams): Promise<ViciResponse> {
		return this.call("hopper_list", toApiParams(params));
	}

	/** Bulk insert leads into the hopper */
	async hopperBulkInsert(
		params: HopperBulkInsertParams,
	): Promise<ViciResponse> {
		return this.call("hopper_bulk_insert", toApiParams(params));
	}
}

class ListsClient {
	constructor(private call: CallFn) {}

	/** Add a new list */
	async add(params: AddListParams): Promise<ViciResponse> {
		return this.call("add_list", toApiParams(params));
	}

	/** Update list settings, reset leads, or delete */
	async update(params: UpdateListParams): Promise<ViciResponse> {
		return this.call("update_list", toApiParams(params));
	}

	/** Get summary info about a list */
	async info(params: ListInfoParams): Promise<ViciResponse> {
		return this.call("list_info", toApiParams(params));
	}

	/** Get custom field definitions for a list */
	async customFields(
		params: ListCustomFieldsParams = {},
	): Promise<ViciResponse> {
		return this.call("list_custom_fields", toApiParams(params));
	}
}

class PhonesClient {
	constructor(private call: CallFn) {}

	/** Add a phone extension */
	async add(params: AddPhoneParams): Promise<ViciResponse> {
		return this.call("add_phone", toApiParams(params));
	}

	/** Update or delete a phone entry */
	async update(params: UpdatePhoneParams): Promise<ViciResponse> {
		return this.call("update_phone", toApiParams(params));
	}

	/** Create a phone alias mapping */
	async addAlias(params: AddPhoneAliasParams): Promise<ViciResponse> {
		return this.call("add_phone_alias", toApiParams(params));
	}

	/** Update or delete a phone alias */
	async updateAlias(params: UpdatePhoneAliasParams): Promise<ViciResponse> {
		return this.call("update_phone_alias", toApiParams(params));
	}
}

class DidsClient {
	constructor(private call: CallFn) {}

	/** Add an inbound DID */
	async add(params: AddDidParams): Promise<ViciResponse> {
		return this.call("add_did", toApiParams(params));
	}

	/** Copy an existing DID */
	async copy(params: CopyDidParams): Promise<ViciResponse> {
		return this.call("copy_did", toApiParams(params));
	}

	/** Update or delete a DID */
	async update(params: UpdateDidParams): Promise<ViciResponse> {
		return this.call("update_did", toApiParams(params));
	}
}

class DncClient {
	constructor(private call: CallFn) {}

	/** Add a phone number to DNC list */
	async addPhone(params: DncPhoneParams): Promise<ViciResponse> {
		return this.call("add_dnc_phone", toApiParams(params));
	}

	/** Remove a phone number from DNC list */
	async deletePhone(params: DncPhoneParams): Promise<ViciResponse> {
		return this.call("delete_dnc_phone", toApiParams(params));
	}

	/** Add phone to a Filter Phone Group */
	async addFpgPhone(params: FpgPhoneParams): Promise<ViciResponse> {
		return this.call("add_fpg_phone", toApiParams(params));
	}

	/** Remove phone from a Filter Phone Group */
	async deleteFpgPhone(params: FpgPhoneParams): Promise<ViciResponse> {
		return this.call("delete_fpg_phone", toApiParams(params));
	}
}

class MonitoringClient {
	constructor(private call: CallFn) {}

	/** Launch a blind monitor/barge/hijack on an agent's call */
	async blindMonitor(params: BlindMonitorParams): Promise<ViciResponse> {
		return this.call("blind_monitor", toApiParams(params));
	}

	/** Get in-group and outbound info for a logged-in agent */
	async agentIngroupInfo(
		params: AgentIngroupInfoParams,
	): Promise<ViciResponse> {
		return this.call("agent_ingroup_info", toApiParams(params));
	}

	/** Get real-time status for a single agent */
	async agentStatus(params: AgentStatusParams): Promise<ViciResponse> {
		return this.call("agent_status", toApiParams(params));
	}

	/** Get real-time status for user groups */
	async userGroupStatus(params: UserGroupStatusParams): Promise<ViciResponse> {
		return this.call("user_group_status", toApiParams(params));
	}

	/** Get real-time status for inbound groups */
	async inGroupStatus(params: InGroupStatusParams): Promise<ViciResponse> {
		return this.call("in_group_status", toApiParams(params));
	}

	/** List all currently logged-in agents */
	async loggedInAgents(
		params: LoggedInAgentsParams = {},
	): Promise<ViciResponse> {
		return this.call("logged_in_agents", toApiParams(params));
	}
}

class ReportingClient {
	constructor(private call: CallFn) {}

	/** Search for call recordings */
	async recordingLookup(params: RecordingLookupParams): Promise<ViciResponse> {
		return this.call("recording_lookup", toApiParams(params));
	}

	/** Export inbound calls to a DID */
	async didLogExport(params: DidLogExportParams): Promise<ViciResponse> {
		return this.call("did_log_export", toApiParams(params));
	}

	/** Get agent activity statistics */
	async agentStatsExport(
		params: AgentStatsExportParams,
	): Promise<ViciResponse> {
		return this.call("agent_stats_export", toApiParams(params));
	}

	/** Get call status statistics by campaign/ingroup */
	async callStatusStats(params: CallStatusStatsParams): Promise<ViciResponse> {
		return this.call("call_status_stats", toApiParams(params));
	}

	/** Get call disposition breakdown report */
	async callDispoReport(params: CallDispoReportParams): Promise<ViciResponse> {
		return this.call("call_dispo_report", toApiParams(params));
	}

	/** Export call logs for phone numbers */
	async phoneNumberLog(params: PhoneNumberLogParams): Promise<ViciResponse> {
		return this.call("phone_number_log", toApiParams(params));
	}
}

class SystemClient {
	constructor(private call: CallFn) {}

	/** Get API version */
	async version(): Promise<ViciResponse> {
		return this.call("version", {});
	}

	/** List audio files */
	async soundsList(
		params: { format?: string; stage?: string; comments?: string } = {},
	): Promise<ViciResponse> {
		return this.call("sounds_list", toApiParams(params));
	}

	/** List music-on-hold classes */
	async mohList(
		params: { format?: string; comments?: string } = {},
	): Promise<ViciResponse> {
		return this.call("moh_list", toApiParams(params));
	}

	/** List voicemail boxes */
	async vmList(
		params: { format?: string; comments?: string } = {},
	): Promise<ViciResponse> {
		return this.call("vm_list", toApiParams(params));
	}

	/** Force conf file refresh on all servers */
	async serverRefresh(): Promise<ViciResponse> {
		return this.call("server_refresh", { stage: "REFRESH" });
	}

	/** List containers */
	async containerList(): Promise<ViciResponse> {
		return this.call("container_list", {});
	}

	/** Validate a phone number */
	async checkPhoneNumber(
		params: CheckPhoneNumberParams,
	): Promise<ViciResponse> {
		return this.call("check_phone_number", toApiParams(params));
	}

	/** Add a group alias (caller ID group) */
	async addGroupAlias(params: AddGroupAliasParams): Promise<ViciResponse> {
		return this.call("add_group_alias", toApiParams(params));
	}

	/** Update a CID group entry */
	async updateCidGroupEntry(
		params: UpdateCidGroupEntryParams,
	): Promise<ViciResponse> {
		return this.call("update_cid_group_entry", toApiParams(params));
	}

	/** Update alternate disposition call URLs */
	async updateAltUrl(params: UpdateAltUrlParams): Promise<ViciResponse> {
		return this.call("update_alt_url", toApiParams(params));
	}

	/** Update campaign presets */
	async updatePresets(params: UpdatePresetsParams): Promise<ViciResponse> {
		return this.call("update_presets", toApiParams(params));
	}

	/** Update a call log entry status */
	async updateLogEntry(params: UpdateLogEntryParams): Promise<ViciResponse> {
		return this.call("update_log_entry", toApiParams(params));
	}
}

// ─── Type for the internal call function ──────────────────────
type CallFn = (
	fn: string,
	params: Record<string, string>,
) => Promise<ViciResponse>;

// ─── Main Admin Client ───────────────────────────────────────

/**
 * ViciDial Non-Agent (Admin) API client.
 * Wraps all 60 Non-Agent API functions organized by domain.
 *
 * @example
 * ```ts
 * const admin = new ViciAdmin({
 *   baseUrl: 'https://dialer.example.com',
 *   user: 'apiuser',
 *   pass: 'apipass',
 * });
 *
 * await admin.leads.add({ phoneNumber: '5551234567', listId: 101 });
 * await admin.users.add({ agentUser: 'agent1', agentPass: 'pass', ... });
 * const status = await admin.monitoring.agentStatus({ agentUser: '1001' });
 * ```
 */
export class ViciAdmin extends ViciClient {
	readonly leads: LeadsClient;
	readonly users: UsersClient;
	readonly campaigns: CampaignsClient;
	readonly lists: ListsClient;
	readonly phones: PhonesClient;
	readonly dids: DidsClient;
	readonly dnc: DncClient;
	readonly monitoring: MonitoringClient;
	readonly reporting: ReportingClient;
	readonly system: SystemClient;

	constructor(config: ViciConfig) {
		super(config);

		const callFn: CallFn = (fn, params) =>
			this.request(ADMIN_API_PATH, { function: fn, ...params });

		this.leads = new LeadsClient(callFn);
		this.users = new UsersClient(callFn);
		this.campaigns = new CampaignsClient(callFn);
		this.lists = new ListsClient(callFn);
		this.phones = new PhonesClient(callFn);
		this.dids = new DidsClient(callFn);
		this.dnc = new DncClient(callFn);
		this.monitoring = new MonitoringClient(callFn);
		this.reporting = new ReportingClient(callFn);
		this.system = new SystemClient(callFn);
	}
}
