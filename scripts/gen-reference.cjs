#!/usr/bin/env node
/**
 * Generates HTML reference tables from TypeScript source files.
 * Reads every interface and produces docs-ready HTML snippets.
 */
const fs = require("fs");

function parseInterfaces(content) {
	const interfaces = [];
	let current = null;
	let pendingDoc = "";

	const lines = content.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const trimmed = line.trim();

		// Collect JSDoc for fields
		if (trimmed.startsWith("/**") && trimmed.endsWith("*/")) {
			pendingDoc = trimmed.replace(/^\/\*\*\s*/, "").replace(/\s*\*\/$/, "");
			continue;
		}
		if (trimmed.startsWith("/**")) { pendingDoc = trimmed.replace(/^\/\*\*\s*/, ""); continue; }
		if (trimmed.startsWith("*") && !trimmed.startsWith("*/")) {
			pendingDoc += " " + trimmed.replace(/^\*\s*/, "");
			continue;
		}
		if (trimmed === "*/") continue;
		if (trimmed.startsWith("//")) { pendingDoc = ""; continue; }

		// Interface declaration
		const ifaceMatch = line.match(/^export interface (\w+)(?:\s+extends\s+(\w+))?/);
		if (ifaceMatch) {
			current = { name: ifaceMatch[1], extends: ifaceMatch[2] || null, fields: [] };
			pendingDoc = "";
			continue;
		}

		// End of interface
		if (current && trimmed === "}") {
			interfaces.push(current);
			current = null;
			pendingDoc = "";
			continue;
		}

		// Field definition
		if (current) {
			// Single-line field: name?: type;
			const fm = trimmed.match(/^([a-zA-Z_]\w*)(\??)\s*:\s*(.+?)\s*;?\s*$/);
			if (fm && !trimmed.startsWith("//") && !trimmed.startsWith("*") && !trimmed.startsWith("|")) {
				current.fields.push({
					name: fm[1],
					required: fm[2] !== "?",
					type: fm[3].replace(/;$/, "").trim(),
					doc: pendingDoc,
				});
				pendingDoc = "";
				continue;
			}

			// Multi-line union type start: name?:
			const multiMatch = trimmed.match(/^([a-zA-Z_]\w*)(\??)\s*:\s*$/);
			if (multiMatch) {
				// Read union lines until we hit a semicolon
				let unionType = "";
				let j = i + 1;
				while (j < lines.length) {
					const uline = lines[j].trim();
					if (uline.endsWith(";")) {
						unionType += " " + uline.replace(/;$/, "");
						break;
					}
					unionType += " " + uline;
					j++;
				}
				current.fields.push({
					name: multiMatch[1],
					required: multiMatch[2] !== "?",
					type: unionType.replace(/\s+/g, " ").trim(),
					doc: pendingDoc,
				});
				pendingDoc = "";
				i = j; // skip ahead
				continue;
			}

			// If it's a union continuation line, skip
			if (trimmed.startsWith("|")) continue;
		}

		if (!trimmed.startsWith("import") && !trimmed.startsWith("export type")) {
			pendingDoc = "";
		}
	}
	return interfaces;
}

function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function typeToHtml(t) {
	return `<code>${escapeHtml(t)}</code>`;
}

function generateTable(iface, fnName) {
	let html = "";
	if (fnName) {
		html += `<h3 id="ref-${fnName}">${iface.name}`;
		html += ` <code class="fn-tag">${fnName}</code>`;
		if (iface.extends) html += ` <span class="extends">extends ${iface.extends}</span>`;
		html += `</h3>\n`;
	} else {
		html += `<h3>${iface.name}`;
		if (iface.extends) html += ` <span class="extends">extends ${iface.extends}</span>`;
		html += `</h3>\n`;
	}

	if (iface.fields.length === 0) {
		html += "<p><em>No parameters</em></p>\n";
		return html;
	}

	html += `<table>\n<tr><th>Parameter</th><th>Type</th><th>Req</th><th>Description</th></tr>\n`;
	for (const f of iface.fields) {
		const req = f.required ? "Yes" : "";
		html += `<tr><td><code>${f.name}</code></td><td>${typeToHtml(f.type)}</td><td>${req}</td><td>${escapeHtml(f.doc)}</td></tr>\n`;
	}
	html += `</table>\n`;
	return html;
}

// ── Parse source files ──
const agentTypes = fs.readFileSync("src/agent/types.ts", "utf8");
const adminTypes = fs.readFileSync("src/admin/types.ts", "utf8");
const agentIfaces = parseInterfaces(agentTypes);
const adminIfaces = parseInterfaces(adminTypes);

// ── Map interfaces to API function names ──
const agentFnMap = {
	DialParams: "external_dial",
	ExternalStatusParams: "external_status",
	ChangeIngroupsParams: "change_ingroups",
	UpdateFieldsParams: "update_fields",
	SetTimerActionParams: "set_timer_action",
	RaCallControlParams: "ra_call_control",
	TransferConferenceParams: "transfer_conference",
	RecordingParams: "recording",
	StereoRecordingParams: "stereo_recording",
	AudioPlaybackParams: "audio_playback",
	SwitchLeadParams: "switch_lead",
	ForceFronterParams: "force_fronter_leave_3way",
	SendNotificationParams: "send_notification",
	VmMessageParams: "vm_message",
	RefreshPanelParams: "refresh_panel",
	ExternalAddLeadParams: "external_add_lead",
	StLoginLogParams: "st_login_log",
};

const adminFnMap = {
	BlindMonitorParams: "blind_monitor", AgentStatusParams: "agent_status",
	UserGroupStatusParams: "user_group_status", InGroupStatusParams: "in_group_status",
	LoggedInAgentsParams: "logged_in_agents", AgentIngroupInfoParams: "agent_ingroup_info",
	RecordingLookupParams: "recording_lookup", DidLogExportParams: "did_log_export",
	AgentStatsExportParams: "agent_stats_export", CallStatusStatsParams: "call_status_stats",
	CallDispoReportParams: "call_dispo_report", PhoneNumberLogParams: "phone_number_log",
	AddLeadParams: "add_lead", UpdateLeadParams: "update_lead",
	BatchUpdateLeadParams: "batch_update_lead", LeadFieldInfoParams: "lead_field_info",
	LeadAllInfoParams: "lead_all_info", LeadCallbackInfoParams: "lead_callback_info",
	LeadSearchParams: "lead_search", LeadStatusSearchParams: "lead_status_search",
	CccLeadInfoParams: "ccc_lead_info", CallidInfoParams: "callid_info",
	AddUserParams: "add_user", UpdateUserParams: "update_user",
	CopyUserParams: "copy_user", UpdateRemoteAgentParams: "update_remote_agent",
	UserDetailsParams: "user_details", AgentCampaignsParams: "agent_campaigns",
	AddPhoneParams: "add_phone", UpdatePhoneParams: "update_phone",
	AddPhoneAliasParams: "add_phone_alias", UpdatePhoneAliasParams: "update_phone_alias",
	AddListParams: "add_list", UpdateListParams: "update_list",
	ListInfoParams: "list_info", ListCustomFieldsParams: "list_custom_fields",
	UpdateCampaignParams: "update_campaign", CampaignsListParams: "campaigns_list",
	HopperListParams: "hopper_list", HopperBulkInsertParams: "hopper_bulk_insert",
	AddDidParams: "add_did", CopyDidParams: "copy_did", UpdateDidParams: "update_did",
	DncPhoneParams: "add_dnc_phone", FpgPhoneParams: "add_fpg_phone",
	CheckPhoneNumberParams: "check_phone_number",
	AddGroupAliasParams: "add_group_alias", UpdateCidGroupEntryParams: "update_cid_group_entry",
	UpdateAltUrlParams: "update_alt_url", UpdatePresetsParams: "update_presets",
	UpdateLogEntryParams: "update_log_entry",
};

// ── Generate HTML ──
let html = "";

// Agent API
html += '<h2>Agent API &mdash; ViciAgent</h2>\n';
html += '<p>Endpoint: <code>/agc/api.php</code> &mdash; All methods require <code>agentUser</code> in config.</p>\n';
for (const iface of agentIfaces) {
	const fn = agentFnMap[iface.name];
	if (fn || iface.name === "VersionResponse" || iface.name === "WebphoneUrlResponse") {
		html += generateTable(iface, fn || iface.name);
	}
}

// Admin API by domain
const adminDomains = {
	"Leads (admin.leads)": ["AddLeadParams","UpdateLeadParams","BatchUpdateLeadParams","LeadFieldInfoParams","LeadAllInfoParams","LeadCallbackInfoParams","LeadSearchParams","LeadStatusSearchParams","CccLeadInfoParams","CallidInfoParams"],
	"Users (admin.users)": ["AddUserParams","UpdateUserParams","CopyUserParams","UpdateRemoteAgentParams","UserDetailsParams","AgentCampaignsParams"],
	"Monitoring (admin.monitoring)": ["BlindMonitorParams","AgentIngroupInfoParams","AgentStatusParams","UserGroupStatusParams","InGroupStatusParams","LoggedInAgentsParams"],
	"Reporting (admin.reporting)": ["RecordingLookupParams","DidLogExportParams","AgentStatsExportParams","CallStatusStatsParams","CallDispoReportParams","PhoneNumberLogParams"],
	"Campaigns (admin.campaigns)": ["UpdateCampaignParams","CampaignsListParams","HopperListParams","HopperBulkInsertParams"],
	"Lists (admin.lists)": ["AddListParams","UpdateListParams","ListInfoParams","ListCustomFieldsParams"],
	"Phones (admin.phones)": ["AddPhoneParams","UpdatePhoneParams","AddPhoneAliasParams","UpdatePhoneAliasParams"],
	"DIDs (admin.dids)": ["AddDidParams","CopyDidParams","UpdateDidParams"],
	"DNC (admin.dnc)": ["DncPhoneParams","FpgPhoneParams"],
	"System (admin.system)": ["CheckPhoneNumberParams","AddGroupAliasParams","UpdateCidGroupEntryParams","UpdateAltUrlParams","UpdatePresetsParams","UpdateLogEntryParams"],
};

html += '\n<h2>Admin API &mdash; ViciAdmin</h2>\n';
html += '<p>Endpoint: <code>/vicidial/non_agent_api.php</code></p>\n';

const adminByName = {};
for (const i of adminIfaces) adminByName[i.name] = i;

for (const [domain, ifaceNames] of Object.entries(adminDomains)) {
	html += `<h2>${domain}</h2>\n`;
	for (const name of ifaceNames) {
		const iface = adminByName[name];
		if (iface) {
			html += generateTable(iface, adminFnMap[name]);
		}
	}
}

fs.writeFileSync('docs/_reference_content.html', html);
console.log('Generated ' + html.split('<table>').length + ' reference tables');
console.log('Written to docs/_reference_content.html');