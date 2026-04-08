import { describe, expect, it } from "vitest";
import { mapFields } from "../src/parser.js";
import { ADMIN_SCHEMAS, AGENT_SCHEMAS } from "../src/schemas.js";

describe("AGENT_SCHEMAS", () => {
	it("parses external_hangup response", () => {
		const data = mapFields("1|agent1", AGENT_SCHEMAS.external_hangup);
		expect(data).toEqual({ value: "1", user: "agent1" });
	});

	it("parses external_dial response", () => {
		const data = mapFields(
			"5551234567|agent1|YES|YES|NO|12345|1234567890|SALES1|alias1|5559876543",
			AGENT_SCHEMAS.external_dial,
		);
		expect(data.phone).toBe("5551234567");
		expect(data.user).toBe("agent1");
		expect(data.lead_id).toBe("12345");
		expect(data.campaign_id).toBe("SALES1");
	});

	it("parses external_pause response", () => {
		const data = mapFields(
			"PAUSE|1234567890|agent1",
			AGENT_SCHEMAS.external_pause,
		);
		expect(data).toEqual({
			value: "PAUSE",
			timestamp: "1234567890",
			user: "agent1",
		});
	});

	it("parses calls_in_queue_count response", () => {
		const data = mapFields("5", AGENT_SCHEMAS.calls_in_queue_count);
		expect(data).toEqual({ count: "5" });
	});

	it("parses external_add_lead response with correct list_id field", () => {
		const data = mapFields(
			"7275551212|TESTCAMP|101|123456|6666",
			AGENT_SCHEMAS.external_add_lead,
		);
		expect(data.phone).toBe("7275551212");
		expect(data.campaign).toBe("TESTCAMP");
		expect(data.list_id).toBe("101");
		expect(data.new_lead_id).toBe("123456");
		expect(data.user).toBe("6666");
	});

	it("parses vm_message response with audio files", () => {
		const data = mapFields(
			"6666|12345|EXship01|EXship02|EXship03",
			AGENT_SCHEMAS.vm_message,
		);
		expect(data.user).toBe("6666");
		expect(data.lead_id).toBe("12345");
		expect(data.audio_file_1).toBe("EXship01");
		expect(data.audio_file_2).toBe("EXship02");
		expect(data.audio_file_3).toBe("EXship03");
	});

	it("parses recording_status response", () => {
		const data = mapFields(
			"6666|121242|20120810-012008__6666_|192.168.1.5|2012-08-10 01:20:10|192.168.1.5|8600051|PAUSED",
			AGENT_SCHEMAS.recording_status,
		);
		expect(data.user).toBe("6666");
		expect(data.recording_id).toBe("121242");
		expect(data.filename).toBe("20120810-012008__6666_");
		expect(data.server).toBe("192.168.1.5");
		expect(data.agent_status).toBe("PAUSED");
	});

	it("parses stereo_recording_status response", () => {
		const data = mapFields(
			"6666|121242|20120810-012008__6666_|192.168.1.5|2012-08-10 01:20:10|192.168.1.5|8600051|PAUSED",
			AGENT_SCHEMAS.stereo_recording_status,
		);
		expect(data.user).toBe("6666");
		expect(data.recording_id).toBe("121242");
		expect(data.agent_status).toBe("PAUSED");
	});

	it("parses transfer_conference response (skips empty keys)", () => {
		const data = mapFields(
			"LOCAL_CLOSER|SALESLINE||NO|agent1|callid",
			AGENT_SCHEMAS.transfer_conference,
		);
		expect(data.value).toBe("LOCAL_CLOSER");
		expect(data.ingroup).toBe("SALESLINE");
		expect(data.consultative).toBe("NO");
		expect(data.user).toBe("agent1");
		// Empty schema key at position 2 is skipped
		expect("" in data).toBe(false);
	});
});

describe("ADMIN_SCHEMAS", () => {
	it("parses add_lead response", () => {
		const data = mapFields(
			"5551234567|apiuser|101|99999|5.00",
			ADMIN_SCHEMAS.add_lead,
		);
		expect(data.phone_number).toBe("5551234567");
		expect(data.user).toBe("apiuser");
		expect(data.list_id).toBe("101");
		expect(data.lead_id).toBe("99999");
	});

	it("parses lead_all_info response", () => {
		const data = mapFields(
			"SALE|agent1|VLC001|SRC001|101|5.00|1|5551234567|Mr|John|Q|Doe|123 Main|Apt 4||Springfield|IL||62701|US|M|1990-01-15|5559876543|john@test.com|phrase|notes|5|2025-01-01|3|admin|101|12345",
			ADMIN_SCHEMAS.lead_all_info,
		);
		expect(data.status).toBe("SALE");
		expect(data.first_name).toBe("John");
		expect(data.last_name).toBe("Doe");
		expect(data.phone_number).toBe("5551234567");
		expect(data.lead_id).toBe("12345");
		expect(data.email).toBe("john@test.com");
	});

	it("parses agent_status response", () => {
		const data = mapFields(
			"INCALL|call123|12345|SALES1|25|Agent Name|AGENTS|7|LUNCH|RING|5551234567|VLC001|99999",
			ADMIN_SCHEMAS.agent_status,
		);
		expect(data.status).toBe("INCALL");
		expect(data.call_id).toBe("call123");
		expect(data.campaign_id).toBe("SALES1");
		expect(data.full_name).toBe("Agent Name");
		expect(data.pause_code).toBe("LUNCH");
		expect(data.real_time_sub_status).toBe("RING");
	});

	it("parses user_details response", () => {
		const data = mapFields(
			"agent1|Full Name|AGENTS|7|Y",
			ADMIN_SCHEMAS.user_details,
		);
		expect(data).toEqual({
			user: "agent1",
			full_name: "Full Name",
			user_group: "AGENTS",
			user_level: "7",
			active: "Y",
		});
	});

	it("parses phone_number_log response", () => {
		const data = mapFields(
			"5551234567|2025-01-15 10:30:00|101|120|SALE|AGENT|DONE|SRC001|agent1",
			ADMIN_SCHEMAS.phone_number_log,
		);
		expect(data.phone_number).toBe("5551234567");
		expect(data.length_in_sec).toBe("120");
		expect(data.lead_status).toBe("SALE");
	});

	it("has schemas for all major functions", () => {
		// Spot-check that critical schemas exist
		expect(ADMIN_SCHEMAS.add_lead).toBeDefined();
		expect(ADMIN_SCHEMAS.update_lead).toBeDefined();
		expect(ADMIN_SCHEMAS.lead_all_info).toBeDefined();
		expect(ADMIN_SCHEMAS.agent_status).toBeDefined();
		expect(ADMIN_SCHEMAS.campaigns_list).toBeDefined();
		expect(ADMIN_SCHEMAS.hopper_list).toBeDefined();
		expect(ADMIN_SCHEMAS.recording_lookup).toBeDefined();
		expect(ADMIN_SCHEMAS.user_details).toBeDefined();
	});

	it("parses blind_monitor response", () => {
		const data = mapFields(
			"350a|010*010*010*017*350|8600051",
			ADMIN_SCHEMAS.blind_monitor,
		);
		expect(data).toEqual({
			phone_login: "350a",
			dial_string: "010*010*010*017*350",
			session_id: "8600051",
		});
	});

	it("parses logged_in_agents response", () => {
		const data = mapFields(
			"6666|TESTCAMP|8600051|PAUSED|1079409||1|Admin|ADMIN|9",
			ADMIN_SCHEMAS.logged_in_agents,
		);
		expect(data.user).toBe("6666");
		expect(data.campaign_id).toBe("TESTCAMP");
		expect(data.session_id).toBe("8600051");
		expect(data.status).toBe("PAUSED");
		expect(data.full_name).toBe("Admin");
		expect(data.user_level).toBe("9");
	});

	it("parses logged_in_agents_detail response (with sub_status)", () => {
		const data = mapFields(
			"6666|TESTCAMP|8600051|INCALL|1079409|M2260919190001079409|1|Admin|ADMIN|9|LOGIN|DEAD",
			ADMIN_SCHEMAS.logged_in_agents_detail,
		);
		expect(data.user).toBe("6666");
		expect(data.pause_code).toBe("LOGIN");
		expect(data.sub_status).toBe("DEAD");
	});

	it("parses add_group_alias response", () => {
		const data = mapFields(
			"6666|7275551212|test_group_alias|test group alias",
			ADMIN_SCHEMAS.add_group_alias,
		);
		expect(data).toEqual({
			user: "6666",
			caller_id_number: "7275551212",
			group_alias_id: "test_group_alias",
			group_alias_name: "test group alias",
		});
	});

	it("parses update_cid_group_entry response", () => {
		const data = mapFields(
			"6666|1101|813|8135551212|1",
			ADMIN_SCHEMAS.update_cid_group_entry,
		);
		expect(data).toEqual({
			user: "6666",
			cid_group_id: "1101",
			areacode: "813",
			outbound_cid: "8135551212",
			entries_affected: "1",
		});
	});

	it("parses update_alt_url response", () => {
		const data = mapFields(
			"6666|1|dispo|campaign|TESTCAMP",
			ADMIN_SCHEMAS.update_alt_url,
		);
		expect(data).toEqual({
			user: "6666",
			alt_url_id: "1",
			url_type: "dispo",
			entry_type: "campaign",
			campaign_id: "TESTCAMP",
		});
	});

	it("parses hopper_bulk_insert response", () => {
		const data = mapFields(
			"2|0|8432948|6666",
			ADMIN_SCHEMAS.hopper_bulk_insert,
		);
		expect(data).toEqual({
			inserted_count: "2",
			not_inserted_count: "0",
			last_lead_id: "8432948",
			user: "6666",
		});
	});

	it("parses server_refresh response", () => {
		const data = mapFields("6666|1", ADMIN_SCHEMAS.server_refresh);
		expect(data).toEqual({ user: "6666", server_count: "1" });
	});

	it("parses call_status_stats response", () => {
		const data = mapFields(
			"TESTCAMP|26|26|00-0,01-1,02-1|NP-4,TD-22",
			ADMIN_SCHEMAS.call_status_stats,
		);
		expect(data.campaign_or_ingroup).toBe("TESTCAMP");
		expect(data.total_calls).toBe("26");
		expect(data.human_answered_calls).toBe("26");
		expect(data.status_breakdown).toBe("NP-4,TD-22");
	});
});
