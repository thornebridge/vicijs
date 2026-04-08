import { describe, expect, it } from "vitest";
import { CallbackVariable } from "../../src/webhooks/variables.js";

describe("CallbackVariable", () => {
	const entries = Object.entries(CallbackVariable);
	const values = Object.values(CallbackVariable);

	it("has 90+ template variables", () => {
		expect(entries.length).toBeGreaterThanOrEqual(90);
	});

	it("every value is a non-empty string", () => {
		for (const [_key, value] of entries) {
			expect(typeof value).toBe("string");
			expect(value.length).toBeGreaterThan(0);
		}
	});

	it("has no duplicate values", () => {
		const unique = new Set(values);
		expect(unique.size).toBe(values.length);
	});

	it("includes critical lead variables", () => {
		expect(CallbackVariable.LEAD_ID).toBe("lead_id");
		expect(CallbackVariable.PHONE_NUMBER).toBe("phone_number");
		expect(CallbackVariable.FIRST_NAME).toBe("first_name");
		expect(CallbackVariable.LAST_NAME).toBe("last_name");
		expect(CallbackVariable.EMAIL).toBe("email");
	});

	it("includes critical call variables", () => {
		expect(CallbackVariable.CAMPAIGN).toBe("campaign");
		expect(CallbackVariable.UNIQUEID).toBe("uniqueid");
		expect(CallbackVariable.CALL_ID).toBe("call_id");
		expect(CallbackVariable.EPOCH).toBe("epoch");
	});

	it("includes dispo-specific variables", () => {
		expect(CallbackVariable.DISPO).toBe("dispo");
		expect(CallbackVariable.TALK_TIME).toBe("talk_time");
		expect(CallbackVariable.CALL_NOTES).toBe("call_notes");
		expect(CallbackVariable.TERM_REASON).toBe("term_reason");
	});

	it("includes agent event push variables", () => {
		expect(CallbackVariable.USER).toBe("user");
		expect(CallbackVariable.EVENT).toBe("event");
		expect(CallbackVariable.MESSAGE).toBe("message");
		expect(CallbackVariable.COUNTER).toBe("counter");
	});

	it("preserves case-sensitive ViciDial names", () => {
		expect(CallbackVariable.SQLDATE).toBe("SQLdate");
		expect(CallbackVariable.SIP_EXTEN).toBe("SIPexten");
	});

	it("includes DID custom fields", () => {
		expect(CallbackVariable.DID_CUSTOM_ONE).toBe("did_custom_one");
		expect(CallbackVariable.DID_CUSTOM_FIVE).toBe("did_custom_five");
	});

	it("includes in-group and campaign custom fields", () => {
		expect(CallbackVariable.IG_CUSTOM_ONE).toBe("ig_custom_one");
		expect(CallbackVariable.CAMP_CUSTOM_ONE).toBe("camp_custom_one");
	});
});
