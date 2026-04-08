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
});
