import { describe, expect, it } from "vitest";
import {
	parseError,
	ViciAuthError,
	ViciError,
	ViciNotFoundError,
	ViciPermissionError,
	ViciTimeoutError,
	ViciValidationError,
} from "../src/errors.js";

describe("parseError", () => {
	it("classifies auth errors — no user found", () => {
		const err = parseError("ERROR: external_hangup no user found - agent1");
		expect(err).toBeInstanceOf(ViciAuthError);
		expect(err.function).toBe("external_hangup");
		expect(err.details).toBe("agent1");
	});

	it("classifies auth errors — auth prefix", () => {
		const err = parseError(
			"ERROR: external_dial auth USER DOES NOT HAVE PERMISSION TO USE THIS FUNCTION - val|agent|fn",
		);
		expect(err).toBeInstanceOf(ViciAuthError);
	});

	it("classifies permission errors", () => {
		const err = parseError(
			"ERROR: add_lead USER DOES NOT HAVE PERMISSION TO ADD LEADS TO THE SYSTEM - apiuser|3",
		);
		expect(err).toBeInstanceOf(ViciPermissionError);
		expect(err.function).toBe("add_lead");
	});

	it("classifies permission errors — not allowed", () => {
		const err = parseError(
			"ERROR: update_campaign NOT ALLOWED LIST ID - apiuser|101",
		);
		expect(err).toBeInstanceOf(ViciPermissionError);
	});

	it("classifies not found errors", () => {
		const err = parseError("ERROR: agent_status AGENT NOT FOUND - apiuser||");
		expect(err).toBeInstanceOf(ViciNotFoundError);
		expect(err.function).toBe("agent_status");
	});

	it("classifies not logged in as not found", () => {
		const err = parseError(
			"ERROR: external_pause agent_user is not logged in - agent1",
		);
		expect(err).toBeInstanceOf(ViciNotFoundError);
	});

	it("classifies does not exist as not found", () => {
		const err = parseError(
			"ERROR: update_phone PHONE DOES NOT EXIST - apiuser|ext1|192.168.1.1",
		);
		expect(err).toBeInstanceOf(ViciNotFoundError);
	});

	it("classifies no matches as not found", () => {
		const err = parseError(
			"ERROR: update_lead NO MATCHES FOUND IN THE SYSTEM - apiuser|||",
		);
		expect(err).toBeInstanceOf(ViciNotFoundError);
	});

	it("classifies no recordings found as not found", () => {
		const err = parseError(
			"ERROR: recording_lookup NO RECORDINGS FOUND - 0|apiuser||2025-01-01|",
		);
		expect(err).toBeInstanceOf(ViciNotFoundError);
	});

	it("classifies validation errors — duplicate", () => {
		const err = parseError(
			"ERROR: add_lead DUPLICATE PHONE NUMBER IN LIST - 5551234|101|12345",
		);
		expect(err).toBeInstanceOf(ViciValidationError);
	});

	it("classifies validation errors — already exists", () => {
		const err = parseError(
			"ERROR: add_user USER ALREADY EXISTS - apiuser|newagent",
		);
		expect(err).toBeInstanceOf(ViciValidationError);
	});

	it("classifies validation errors — invalid", () => {
		const err = parseError(
			"ERROR: external_dial not valid - 5551234|1|YES|agent1",
		);
		expect(err).toBeInstanceOf(ViciValidationError);
	});

	it("classifies validation errors — required fields", () => {
		const err = parseError(
			"ERROR: add_user YOU MUST USE ALL REQUIRED FIELDS - apiuser||||",
		);
		expect(err).toBeInstanceOf(ViciValidationError);
	});

	it("classifies validation errors — disabled", () => {
		const err = parseError(
			"ERROR: send_notification Agent API Notifications are disabled on this system - 0",
		);
		expect(err).toBeInstanceOf(ViciValidationError);
	});

	it("falls back to generic ViciError for unknown patterns", () => {
		const err = parseError(
			"ERROR: some_function SOMETHING WEIRD HAPPENED - data",
		);
		expect(err).toBeInstanceOf(ViciError);
		expect(err).not.toBeInstanceOf(ViciAuthError);
		expect(err).not.toBeInstanceOf(ViciPermissionError);
		expect(err).not.toBeInstanceOf(ViciNotFoundError);
		expect(err).not.toBeInstanceOf(ViciValidationError);
	});

	it("handles malformed error strings", () => {
		const err = parseError("this is not a valid error");
		expect(err).toBeInstanceOf(ViciError);
		expect(err.function).toBe("unknown");
	});

	it("handles error with no data section", () => {
		const err = parseError("ERROR: version SOMETHING WRONG");
		expect(err).toBeInstanceOf(ViciError);
		expect(err.details).toBe("");
	});

	it("preserves raw error string", () => {
		const raw =
			"ERROR: add_lead DUPLICATE PHONE NUMBER IN LIST - 5551234|101|12345";
		const err = parseError(raw);
		expect(err.raw).toBe(raw);
	});

	it("produces readable error messages", () => {
		const err = parseError("ERROR: add_lead DUPLICATE - 5551234");
		expect(err.message).toContain("add_lead");
	});
});

describe("ViciTimeoutError", () => {
	it("creates with timeout value", () => {
		const err = new ViciTimeoutError(30000);
		expect(err.timeoutMs).toBe(30000);
		expect(err.message).toContain("30000ms");
		expect(err.name).toBe("ViciTimeoutError");
	});

	it("is instanceof ViciError", () => {
		const err = new ViciTimeoutError(5000);
		expect(err).toBeInstanceOf(ViciError);
	});
});

describe("Error class names", () => {
	it("all errors have correct name property", () => {
		expect(new ViciError("fn", "msg", "", "").name).toBe("ViciError");
		expect(new ViciAuthError("fn", "", "").name).toBe("ViciAuthError");
		expect(new ViciPermissionError("fn", "", "").name).toBe(
			"ViciPermissionError",
		);
		expect(new ViciNotFoundError("fn", "", "").name).toBe("ViciNotFoundError");
		expect(new ViciValidationError("fn", "", "").name).toBe(
			"ViciValidationError",
		);
		expect(new ViciTimeoutError(1000).name).toBe("ViciTimeoutError");
	});
});
