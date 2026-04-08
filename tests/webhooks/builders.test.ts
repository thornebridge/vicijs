import { describe, expect, it } from "vitest";
import {
	buildCallbackUrl,
	buildEventPushUrl,
	templateToken,
	wrapWithGet2Post,
} from "../../src/webhooks/builders.js";
import { CallbackVariable } from "../../src/webhooks/variables.js";

describe("templateToken", () => {
	it("wraps a variable name in --A--/--B-- syntax", () => {
		expect(templateToken("lead_id")).toBe("--A--lead_id--B--");
	});

	it("handles case-sensitive names", () => {
		expect(templateToken("SQLdate")).toBe("--A--SQLdate--B--");
	});
});

describe("buildCallbackUrl", () => {
	it("builds URL with a single variable", () => {
		const url = buildCallbackUrl({
			baseUrl: "https://example.com/hook",
			variables: [CallbackVariable.LEAD_ID],
		});
		expect(url).toBe("https://example.com/hook?lead_id=--A--lead_id--B--");
	});

	it("builds URL with multiple variables", () => {
		const url = buildCallbackUrl({
			baseUrl: "https://example.com/hook",
			variables: [
				CallbackVariable.LEAD_ID,
				CallbackVariable.DISPO,
				CallbackVariable.PHONE_NUMBER,
			],
		});
		expect(url).toContain("lead_id=--A--lead_id--B--");
		expect(url).toContain("dispo=--A--dispo--B--");
		expect(url).toContain("phone_number=--A--phone_number--B--");
	});

	it("includes static params before template params", () => {
		const url = buildCallbackUrl({
			baseUrl: "https://example.com/hook",
			variables: [CallbackVariable.LEAD_ID],
			staticParams: { type: "dispo_callback", key: "abc123" },
		});
		const queryStart = url.indexOf("?") + 1;
		const query = url.slice(queryStart);
		expect(query).toMatch(/^type=dispo_callback/);
		expect(url).toContain("lead_id=--A--lead_id--B--");
	});

	it("handles baseUrl with existing query params", () => {
		const url = buildCallbackUrl({
			baseUrl: "https://example.com/hook?existing=1",
			variables: [CallbackVariable.LEAD_ID],
		});
		expect(url).toBe(
			"https://example.com/hook?existing=1&lead_id=--A--lead_id--B--",
		);
	});

	it("returns bare baseUrl when no variables or static params", () => {
		const url = buildCallbackUrl({
			baseUrl: "https://example.com/hook",
			variables: [],
		});
		expect(url).toBe("https://example.com/hook");
	});

	it("preserves template token literals (not URL-encoded)", () => {
		const url = buildCallbackUrl({
			baseUrl: "https://example.com/hook",
			variables: [CallbackVariable.SQLDATE],
		});
		expect(url).toContain("--A--SQLdate--B--");
		expect(url).not.toContain("%2D%2DA");
	});
});

describe("buildEventPushUrl", () => {
	it("includes all 7 standard agent event variables", () => {
		const url = buildEventPushUrl("https://example.com/events");
		expect(url).toContain("user=--A--user--B--");
		expect(url).toContain("event=--A--event--B--");
		expect(url).toContain("message=--A--message--B--");
		expect(url).toContain("lead_id=--A--lead_id--B--");
		expect(url).toContain("counter=--A--counter--B--");
		expect(url).toContain("epoch=--A--epoch--B--");
		expect(url).toContain("agent_log_id=--A--agent_log_id--B--");
	});

	it("passes through static params", () => {
		const url = buildEventPushUrl("https://example.com/events", {
			type: "agent_event",
		});
		expect(url).toContain("type=agent_event");
	});
});

describe("wrapWithGet2Post", () => {
	it("wraps external URL with get2post.php prefix", () => {
		const url = wrapWithGet2Post({
			externalUrl: "https://ext.example.com/hook?user=--A--user--B--",
		});
		expect(url).toMatch(/^get2post\.php\?/);
		expect(url).toContain("HTTPURLTOPOST=");
		expect(url).toContain("https://ext.example.com/hook");
	});

	it("includes uniqueid and type params", () => {
		const url = wrapWithGet2Post({
			externalUrl: "https://ext.example.com/hook",
			type: "event",
		});
		expect(url).toContain("uniqueid=--A--epoch--B--.--A--agent_log_id--B--");
		expect(url).toContain("type=event");
	});

	it("uses custom proxyBase", () => {
		const url = wrapWithGet2Post({
			externalUrl: "https://ext.example.com/hook",
			proxyBase: "/agc/get2post.php",
		});
		expect(url).toMatch(/^\/agc\/get2post\.php\?/);
	});

	it("allows custom uniqueId", () => {
		const url = wrapWithGet2Post({
			externalUrl: "https://ext.example.com/hook",
			uniqueId: "custom-123",
		});
		expect(url).toContain("uniqueid=custom-123");
	});

	it("preserves template tokens in external URL", () => {
		const url = wrapWithGet2Post({
			externalUrl:
				"https://ext.example.com/hook?event=--A--event--B--&user=--A--user--B--",
			type: "event",
		});
		expect(url).toContain("--A--event--B--");
		expect(url).toContain("--A--user--B--");
	});

	it("omits type segment when type is not provided", () => {
		const url = wrapWithGet2Post({
			externalUrl: "https://ext.example.com/hook",
		});
		expect(url).not.toContain("type=");
		expect(url).toContain("uniqueid=");
		expect(url).toContain("HTTPURLTOPOST=");
	});
});
