import { describe, expect, it, vi } from "vitest";
import { ViciAgent } from "../../src/agent/index.js";
import { ViciValidationError } from "../../src/errors.js";

function createMockFetch(responseText: string) {
	return vi.fn().mockResolvedValue({
		ok: true,
		text: () => Promise.resolve(responseText),
	});
}

function createAgent(fetchFn: ReturnType<typeof vi.fn>) {
	return new ViciAgent({
		baseUrl: "https://dialer.example.com",
		user: "apiuser",
		pass: "apipass",
		agentUser: "agent1",
		source: "test",
		fetch: fetchFn as unknown as typeof globalThis.fetch,
	});
}

describe("ViciAgent", () => {
	it("sends version request without agent_user", async () => {
		const mockFetch = createMockFetch(
			"VERSION: 2.0.5-2|BUILD: 90116-1229|DATE: 2025-01-15 14:59:33|EPOCH: 1222020803",
		);
		const agent = createAgent(mockFetch);
		await agent.version();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.pathname).toBe("/agc/api.php");
		expect(url.searchParams.get("function")).toBe("version");
		expect(url.searchParams.get("user")).toBe("apiuser");
		expect(url.searchParams.get("pass")).toBe("apipass");
	});

	it("sends hangup request", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: external_hangup function set - 1|agent1",
		);
		const agent = createAgent(mockFetch);
		const result = await agent.hangup();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("function")).toBe("external_hangup");
		expect(url.searchParams.get("agent_user")).toBe("agent1");
		expect(url.searchParams.get("value")).toBe("1");
		expect(result.type).toBe("SUCCESS");
	});

	it("sends dial request with params", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: external_dial function set - 5551234567|agent1|YES|YES|NO||12345|CAMPAIGN1||",
		);
		const agent = createAgent(mockFetch);
		await agent.dial({
			value: "5551234567",
			search: "YES",
			preview: "YES",
			phoneCode: "1",
		});

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("function")).toBe("external_dial");
		expect(url.searchParams.get("value")).toBe("5551234567");
		expect(url.searchParams.get("search")).toBe("YES");
		expect(url.searchParams.get("preview")).toBe("YES");
		expect(url.searchParams.get("phone_code")).toBe("1");
	});

	it("sends pause request", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: external_pause function set - PAUSE|12345|agent1",
		);
		const agent = createAgent(mockFetch);
		await agent.pause("PAUSE");

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("value")).toBe("PAUSE");
	});

	it("sends transfer_conference request", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: transfer_conference function set - LOCAL_CLOSER|SALESLINE||NO|agent1|callid|",
		);
		const agent = createAgent(mockFetch);
		await agent.transferConference({
			value: "LOCAL_CLOSER",
			ingroupChoices: "SALESLINE",
		});

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("function")).toBe("transfer_conference");
		expect(url.searchParams.get("value")).toBe("LOCAL_CLOSER");
		expect(url.searchParams.get("ingroup_choices")).toBe("SALESLINE");
	});

	it("sends park_call request", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: park_call function set - PARK_CUSTOMER|agent1",
		);
		const agent = createAgent(mockFetch);
		await agent.parkCall("PARK_CUSTOMER");

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("value")).toBe("PARK_CUSTOMER");
	});

	it("sends recording start request", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: recording function sent - agent1|START||||server|sess|RECORDING",
		);
		const agent = createAgent(mockFetch);
		await agent.recording({ value: "START" });

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("function")).toBe("recording");
		expect(url.searchParams.get("value")).toBe("START");
	});

	it("sends send_notification request", async () => {
		const mockFetch = createMockFetch("SUCCESS: notification queued");
		const agent = createAgent(mockFetch);
		await agent.sendNotification({
			recipientType: "USER",
			recipient: "agent2",
			notificationText: "Great job!",
			showConfetti: "Y",
		});

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("function")).toBe("send_notification");
		expect(url.searchParams.get("recipient_type")).toBe("USER");
		expect(url.searchParams.get("notification_text")).toBe("Great job!");
	});

	it("preserves camelCase for maxParticleCount and particleSpeed", async () => {
		const mockFetch = createMockFetch("SUCCESS: notification queued");
		const agent = createAgent(mockFetch);
		await agent.sendNotification({
			recipientType: "USER",
			recipient: "agent2",
			showConfetti: "Y",
			maxParticleCount: 3000,
			particleSpeed: 50,
			duration: 4,
		});

		const url = new URL(mockFetch.mock.calls[0][0]);
		// ViciDial expects these in camelCase, NOT snake_case
		expect(url.searchParams.get("maxParticleCount")).toBe("3000");
		expect(url.searchParams.get("particleSpeed")).toBe("50");
		// But duration is lowercase, so no conversion needed
		expect(url.searchParams.get("duration")).toBe("4");
		// And other params should be snake_case
		expect(url.searchParams.get("show_confetti")).toBe("Y");
	});

	it("sends logout request", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: logout function set - LOGOUT|12345|agent1",
		);
		const agent = createAgent(mockFetch);
		await agent.logout();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("function")).toBe("logout");
		expect(url.searchParams.get("value")).toBe("LOGOUT");
	});

	it("throws ViciValidationError on error response", async () => {
		const mockFetch = createMockFetch(
			"ERROR: external_dial not valid - 5551234|1|YES|agent1",
		);
		const agent = createAgent(mockFetch);

		await expect(agent.dial({ value: "5551234" })).rejects.toThrow(
			ViciValidationError,
		);
	});

	it("sends DTMF with substitution characters", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: send_dtmf function set - 1234P5678S|agent1",
		);
		const agent = createAgent(mockFetch);
		await agent.sendDtmf("1234P5678S");

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("value")).toBe("1234P5678S");
	});
});
