import { describe, expect, it } from "vitest";
import {
	parseAddLeadCallback,
	parseAgentEvent,
	parseDeadCallCallback,
	parseDispoCallback,
	parseNoAgentCallback,
	parsePauseMaxCallback,
	parseStartCallback,
} from "../../src/webhooks/parsers.js";

describe("parseAgentEvent", () => {
	it("parses from a full URL string", () => {
		const url =
			"https://example.com/events?user=agent1&event=call_answered&message=12345&lead_id=99";
		const payload = parseAgentEvent(url);
		expect(payload.user).toBe("agent1");
		expect(payload.event).toBe("call_answered");
		expect(payload.message).toBe("12345");
		expect(payload.lead_id).toBe("99");
	});

	it("parses from URLSearchParams", () => {
		const params = new URLSearchParams("user=agent1&event=dispo_set&counter=5");
		const payload = parseAgentEvent(params);
		expect(payload.user).toBe("agent1");
		expect(payload.event).toBe("dispo_set");
		expect(payload.counter).toBe("5");
	});

	it("parses from a bare query string", () => {
		const payload = parseAgentEvent("user=agent1&event=logged_in");
		expect(payload.user).toBe("agent1");
		expect(payload.event).toBe("logged_in");
	});

	it("includes epoch and agent_log_id when present", () => {
		const payload = parseAgentEvent(
			"user=agent1&event=call_dialed&epoch=1700000000&agent_log_id=54321",
		);
		expect(payload.epoch).toBe("1700000000");
		expect(payload.agent_log_id).toBe("54321");
	});

	it("omits optional fields when absent", () => {
		const payload = parseAgentEvent("user=agent1&event=state_ready");
		expect(payload).not.toHaveProperty("message");
		expect(payload).not.toHaveProperty("lead_id");
		expect(payload).not.toHaveProperty("counter");
		expect(payload).not.toHaveProperty("epoch");
		expect(payload).not.toHaveProperty("agent_log_id");
	});

	it("throws on missing user", () => {
		expect(() => parseAgentEvent("event=call_answered")).toThrow(
			"Missing required field: user",
		);
	});

	it("throws on missing event", () => {
		expect(() => parseAgentEvent("user=agent1")).toThrow(
			"Missing required field: event",
		);
	});

	it("throws when required field is empty string", () => {
		expect(() => parseAgentEvent("user=&event=call_answered")).toThrow(
			"Missing required field: user",
		);
	});
});

describe("parseDispoCallback", () => {
	it("parses core dispo fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&lead_id=12345&phone_number=5551234567&first_name=John&talk_time=120&term_reason=AGENT",
		);
		expect(payload.dispo).toBe("SALE");
		expect(payload.lead_id).toBe("12345");
		expect(payload.phone_number).toBe("5551234567");
		expect(payload.first_name).toBe("John");
		expect(payload.talk_time).toBe("120");
		expect(payload.term_reason).toBe("AGENT");
	});

	it("includes callback and status fields", () => {
		const payload = parseDispoCallback(
			"dispo=CALLBK&callback_lead_status=CALLBK&callback_datetime=2025-06-15+14:30:00&status=CALLBK",
		);
		expect(payload.callback_lead_status).toBe("CALLBK");
		expect(payload.callback_datetime).toBe("2025-06-15 14:30:00");
		expect(payload.status).toBe("CALLBK");
	});

	it("includes recording fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&recording_filename=20250115-103000_1001_5551234567&recording_id=99887",
		);
		expect(payload.recording_filename).toBe("20250115-103000_1001_5551234567");
		expect(payload.recording_id).toBe("99887");
	});

	it("includes DID fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&did_id=50&did_pattern=7275551113&did_description=Main+Line&did_carrier_description=Carrier+A",
		);
		expect(payload.did_id).toBe("50");
		expect(payload.did_pattern).toBe("7275551113");
		expect(payload.did_description).toBe("Main Line");
		expect(payload.did_carrier_description).toBe("Carrier A");
	});

	it("includes user and user custom fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&user=agent1&fullname=John+Agent&user_group=SALES&agent_email=j@test.com&user_custom_one=dept1",
		);
		expect(payload.user).toBe("agent1");
		expect(payload.fullname).toBe("John Agent");
		expect(payload.user_group).toBe("SALES");
		expect(payload.agent_email).toBe("j@test.com");
		expect(payload.user_custom_one).toBe("dept1");
	});

	it("includes call/session fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&campaign=SALES1&uniqueid=1700000000.123&call_id=M9876&epoch=1700000000&session_id=8600051",
		);
		expect(payload.campaign).toBe("SALES1");
		expect(payload.uniqueid).toBe("1700000000.123");
		expect(payload.call_id).toBe("M9876");
		expect(payload.epoch).toBe("1700000000");
		expect(payload.session_id).toBe("8600051");
	});

	it("includes custom extension fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&ig_custom_one=val1&camp_custom_two=val2&list_name=MyList&list_description=A+list",
		);
		expect(payload.ig_custom_one).toBe("val1");
		expect(payload.camp_custom_two).toBe("val2");
		expect(payload.list_name).toBe("MyList");
		expect(payload.list_description).toBe("A list");
	});

	it("includes script and preset fields", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&camp_script=script1&in_script=inscript1&script_width=600&script_height=400&preset_number_a=5551112222&preset_dtmf_a=12345",
		);
		expect(payload.camp_script).toBe("script1");
		expect(payload.in_script).toBe("inscript1");
		expect(payload.script_width).toBe("600");
		expect(payload.script_height).toBe("400");
		expect(payload.preset_number_a).toBe("5551112222");
		expect(payload.preset_dtmf_a).toBe("12345");
	});

	it("reads case-sensitive field names", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&SQLdate=2025-01-15+10:30:00&SIPexten=8001",
		);
		expect(payload.SQLdate).toBe("2025-01-15 10:30:00");
		expect(payload.SIPexten).toBe("8001");
	});

	it("returns only present fields", () => {
		const payload = parseDispoCallback("dispo=DNC&lead_id=1");
		expect(payload.dispo).toBe("DNC");
		expect(payload.lead_id).toBe("1");
		expect(payload).not.toHaveProperty("talk_time");
		expect(payload).not.toHaveProperty("phone_number");
		expect(payload).not.toHaveProperty("recording_filename");
	});

	it("throws on missing dispo", () => {
		expect(() => parseDispoCallback("lead_id=123")).toThrow(
			"Missing required field: dispo",
		);
	});
});

describe("parseStartCallback", () => {
	it("parses lead and call fields", () => {
		const payload = parseStartCallback(
			"lead_id=500&phone_number=5559876543&campaign=SALES1&uniqueid=1234567890.123",
		);
		expect(payload.lead_id).toBe("500");
		expect(payload.phone_number).toBe("5559876543");
		expect(payload.campaign).toBe("SALES1");
		expect(payload.uniqueid).toBe("1234567890.123");
	});

	it("includes script and preset fields", () => {
		const payload = parseStartCallback(
			"camp_script=myscript&preset_number_b=5559999999&script_width=800",
		);
		expect(payload.camp_script).toBe("myscript");
		expect(payload.preset_number_b).toBe("5559999999");
		expect(payload.script_width).toBe("800");
	});

	it("includes recording and DID fields", () => {
		const payload = parseStartCallback(
			"recording_filename=rec001&did_pattern=7275551113&did_custom_one=tag1",
		);
		expect(payload.recording_filename).toBe("rec001");
		expect(payload.did_pattern).toBe("7275551113");
		expect(payload.did_custom_one).toBe("tag1");
	});

	it("returns partial payload", () => {
		const payload = parseStartCallback("campaign=TEST");
		expect(payload.campaign).toBe("TEST");
		expect(payload).not.toHaveProperty("lead_id");
	});

	it("returns empty-like object for no query params", () => {
		const payload = parseStartCallback("");
		expect(Object.keys(payload).length).toBe(0);
	});
});

describe("parseNoAgentCallback", () => {
	it("includes status field", () => {
		const payload = parseNoAgentCallback(
			"status=DROP&lead_id=300&phone_number=5551234567",
		);
		expect(payload.status).toBe("DROP");
		expect(payload.lead_id).toBe("300");
	});

	it("includes recording and DID fields", () => {
		const payload = parseNoAgentCallback(
			"status=NA&recording_id=12345&did_pattern=7275551113&did_carrier_description=Carrier+B",
		);
		expect(payload.recording_id).toBe("12345");
		expect(payload.did_pattern).toBe("7275551113");
		expect(payload.did_carrier_description).toBe("Carrier B");
	});

	it("includes user and custom fields", () => {
		const payload = parseNoAgentCallback(
			"status=DROP&user=agent1&camp_custom_one=val1&ig_custom_two=val2",
		);
		expect(payload.user).toBe("agent1");
		expect(payload.camp_custom_one).toBe("val1");
		expect(payload.ig_custom_two).toBe("val2");
	});

	it("handles a full payload with call session fields", () => {
		const payload = parseNoAgentCallback(
			"status=NA&campaign=OUTBOUND&uniqueid=123.456&server_ip=10.0.0.1&epoch=1700000000",
		);
		expect(payload.status).toBe("NA");
		expect(payload.campaign).toBe("OUTBOUND");
		expect(payload.server_ip).toBe("10.0.0.1");
		expect(payload.epoch).toBe("1700000000");
	});

	it("includes script and preset fields", () => {
		const payload = parseNoAgentCallback(
			"status=DROP&camp_script=myscript&in_script=inscript1&preset_number_a=5551112222&preset_dtmf_b=6789",
		);
		expect(payload.camp_script).toBe("myscript");
		expect(payload.in_script).toBe("inscript1");
		expect(payload.preset_number_a).toBe("5551112222");
		expect(payload.preset_dtmf_b).toBe("6789");
	});
});

describe("parseAddLeadCallback", () => {
	it("returns all 11 AddLead fields", () => {
		const payload = parseAddLeadCallback(
			"lead_id=999&vendor_lead_code=VLC1&list_id=101&phone_number=5551112222&phone_code=1&did_id=50&did_extension=100&did_pattern=7275551113&did_description=Main+DID&uniqueid=123.456&call_id=M1234",
		);
		expect(payload.lead_id).toBe("999");
		expect(payload.vendor_lead_code).toBe("VLC1");
		expect(payload.list_id).toBe("101");
		expect(payload.phone_number).toBe("5551112222");
		expect(payload.phone_code).toBe("1");
		expect(payload.did_id).toBe("50");
		expect(payload.did_extension).toBe("100");
		expect(payload.did_pattern).toBe("7275551113");
		expect(payload.did_description).toBe("Main DID");
		expect(payload.uniqueid).toBe("123.456");
		expect(payload.call_id).toBe("M1234");
	});

	it("throws on missing lead_id", () => {
		expect(() => parseAddLeadCallback("phone_number=5551234567")).toThrow(
			"Missing required field: lead_id",
		);
	});

	it("omits absent optional fields", () => {
		const payload = parseAddLeadCallback("lead_id=1");
		expect(payload.lead_id).toBe("1");
		expect(payload).not.toHaveProperty("vendor_lead_code");
		expect(payload).not.toHaveProperty("did_pattern");
	});

	it("includes extended fields (user, recording, custom)", () => {
		const payload = parseAddLeadCallback(
			"lead_id=999&user=agent1&fullname=John+Agent&recording_id=88877&camp_custom_one=val1&campaign=INBOUND",
		);
		expect(payload.lead_id).toBe("999");
		expect(payload.user).toBe("agent1");
		expect(payload.fullname).toBe("John Agent");
		expect(payload.recording_id).toBe("88877");
		expect(payload.camp_custom_one).toBe("val1");
		expect(payload.campaign).toBe("INBOUND");
	});
});

describe("parseDeadCallCallback", () => {
	it("parses lead and call fields", () => {
		const payload = parseDeadCallCallback(
			"lead_id=400&phone_number=5551234567&campaign=SALES1&uniqueid=999.888&user=agent5",
		);
		expect(payload.lead_id).toBe("400");
		expect(payload.phone_number).toBe("5551234567");
		expect(payload.campaign).toBe("SALES1");
		expect(payload.user).toBe("agent5");
	});

	it("includes recording fields", () => {
		const payload = parseDeadCallCallback(
			"recording_filename=rec_dead_001&recording_id=77788",
		);
		expect(payload.recording_filename).toBe("rec_dead_001");
		expect(payload.recording_id).toBe("77788");
	});

	it("includes DID and custom fields", () => {
		const payload = parseDeadCallCallback(
			"did_pattern=7275551113&ig_custom_one=val1&camp_custom_three=val3&list_name=TestList",
		);
		expect(payload.did_pattern).toBe("7275551113");
		expect(payload.ig_custom_one).toBe("val1");
		expect(payload.camp_custom_three).toBe("val3");
		expect(payload.list_name).toBe("TestList");
	});

	it("includes call session fields", () => {
		const payload = parseDeadCallCallback(
			"epoch=1700000000&session_id=8600051&server_ip=10.0.0.1&call_id=M5555",
		);
		expect(payload.epoch).toBe("1700000000");
		expect(payload.session_id).toBe("8600051");
		expect(payload.server_ip).toBe("10.0.0.1");
		expect(payload.call_id).toBe("M5555");
	});
});

describe("parsePauseMaxCallback", () => {
	it("returns all user-level fields", () => {
		const payload = parsePauseMaxCallback(
			"user=agent1&campaign=SALES1&fullname=John+Doe&user_custom_one=val1&user_custom_two=val2&user_custom_three=val3&user_custom_four=val4&user_custom_five=val5&user_group=AGENTS&agent_email=john@example.com",
		);
		expect(payload.user).toBe("agent1");
		expect(payload.campaign).toBe("SALES1");
		expect(payload.fullname).toBe("John Doe");
		expect(payload.user_custom_one).toBe("val1");
		expect(payload.user_custom_two).toBe("val2");
		expect(payload.user_custom_three).toBe("val3");
		expect(payload.user_custom_four).toBe("val4");
		expect(payload.user_custom_five).toBe("val5");
		expect(payload.user_group).toBe("AGENTS");
		expect(payload.agent_email).toBe("john@example.com");
	});

	it("throws on missing user", () => {
		expect(() => parsePauseMaxCallback("campaign=SALES1")).toThrow(
			"Missing required field: user",
		);
	});

	it("omits absent optional fields", () => {
		const payload = parsePauseMaxCallback("user=agent1");
		expect(payload.user).toBe("agent1");
		expect(payload).not.toHaveProperty("campaign");
		expect(payload).not.toHaveProperty("fullname");
	});
});

describe("cross-cutting", () => {
	it("handles + encoding for spaces", () => {
		const payload = parseDispoCallback(
			"dispo=SALE&comments=hello+world&first_name=O%27Brien",
		);
		expect(payload.comments).toBe("hello world");
		expect(payload.first_name).toBe("O'Brien");
	});

	it("handles %20 encoding for spaces", () => {
		const payload = parseDispoCallback("dispo=SALE&comments=hello%20world");
		expect(payload.comments).toBe("hello world");
	});

	it("strips empty string values to undefined", () => {
		const payload = parseAgentEvent("user=agent1&event=logged_in&message=");
		expect(payload).not.toHaveProperty("message");
	});

	it("handles duplicate query parameters (first wins)", () => {
		const payload = parseAgentEvent("user=first&user=second&event=logged_in");
		expect(payload.user).toBe("first");
	});

	it("handles URL with no query string", () => {
		const payload = parseStartCallback("https://example.com/hook");
		expect(Object.keys(payload).length).toBe(0);
	});
});
