import { describe, expect, it, vi } from "vitest";
import { ViciAdmin } from "../../src/admin/index.js";

function createMockFetch(responseText: string) {
	return vi.fn().mockResolvedValue({
		ok: true,
		text: () => Promise.resolve(responseText),
	});
}

function createAdmin(fetchFn: ReturnType<typeof vi.fn>) {
	return new ViciAdmin({
		baseUrl: "https://dialer.example.com",
		user: "apiuser",
		pass: "apipass",
		source: "test",
		fetch: fetchFn as unknown as typeof globalThis.fetch,
	});
}

describe("ViciAdmin", () => {
	describe("leads", () => {
		it("adds a lead", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: add_lead LEAD HAS BEEN ADDED - 5551234567|apiuser|101|99999|5.00",
			);
			const admin = createAdmin(mockFetch);
			const result = await admin.leads.add({
				phoneNumber: "5551234567",
				listId: 101,
				firstName: "John",
				lastName: "Doe",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.pathname).toBe("/vicidial/non_agent_api.php");
			expect(url.searchParams.get("function")).toBe("add_lead");
			expect(url.searchParams.get("phone_number")).toBe("5551234567");
			expect(url.searchParams.get("list_id")).toBe("101");
			expect(url.searchParams.get("first_name")).toBe("John");
			expect(result.type).toBe("SUCCESS");
		});

		it("updates a lead", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: update_lead LEAD HAS BEEN UPDATED - apiuser|12345",
			);
			const admin = createAdmin(mockFetch);
			await admin.leads.update({
				leadId: 12345,
				firstName: "Jane",
				status: "SALE",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("update_lead");
			expect(url.searchParams.get("lead_id")).toBe("12345");
			expect(url.searchParams.get("first_name")).toBe("Jane");
			expect(url.searchParams.get("status")).toBe("SALE");
		});

		it("batch updates leads", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: batch_update_lead LEADS HAVE BEEN UPDATED - apiuser|3|1,2,3",
			);
			const admin = createAdmin(mockFetch);
			await admin.leads.batchUpdate({
				leadIds: "1,2,3",
				status: "DNC",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("batch_update_lead");
			expect(url.searchParams.get("lead_ids")).toBe("1,2,3");
		});

		it("searches leads by phone", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: lead_search RESULTS - 5551234567|2|12345-12346",
			);
			const admin = createAdmin(mockFetch);
			await admin.leads.search({ phoneNumber: "5551234567" });

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("lead_search");
			expect(url.searchParams.get("phone_number")).toBe("5551234567");
		});

		it("dearchives a lead", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: lead_dearchive LEAD DE-ARCHIVED - apiuser|12345|1|1",
			);
			const admin = createAdmin(mockFetch);
			await admin.leads.dearchive(12345);

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("lead_dearchive");
			expect(url.searchParams.get("lead_id")).toBe("12345");
		});
	});

	describe("users", () => {
		it("adds a user", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: add_user USER HAS BEEN ADDED - apiuser|newagent|pass123|7|New Agent|AGENTS",
			);
			const admin = createAdmin(mockFetch);
			await admin.users.add({
				agentUser: "newagent",
				agentPass: "pass123",
				agentUserLevel: 7,
				agentFullName: "New Agent",
				agentUserGroup: "AGENTS",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("add_user");
			expect(url.searchParams.get("agent_user")).toBe("newagent");
			expect(url.searchParams.get("agent_user_level")).toBe("7");
		});

		it("gets user details", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: user_details RESULT - agent1|Full Name|AGENTS|7|Y",
			);
			const admin = createAdmin(mockFetch);
			await admin.users.details({ agentUser: "agent1" });

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("user_details");
		});
	});

	describe("campaigns", () => {
		it("lists campaigns", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: campaigns_list CAMPAIGNS LIST - SALES1|Sales Campaign|Y|ADMIN",
			);
			const admin = createAdmin(mockFetch);
			await admin.campaigns.list();

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("campaigns_list");
		});

		it("updates campaign", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: update_campaign CAMPAIGN HAS BEEN UPDATED - apiuser|SALES1",
			);
			const admin = createAdmin(mockFetch);
			await admin.campaigns.update({
				campaignId: "SALES1",
				dialLevel: 3,
				active: "Y",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("campaign_id")).toBe("SALES1");
			expect(url.searchParams.get("dial_level")).toBe("3");
		});
	});

	describe("monitoring", () => {
		it("gets agent status", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: agent_status RESULT - INCALL|call123|12345|SALES1|25|Agent Name|AGENTS|7||RING|5551234567|vendor1|12345|",
			);
			const admin = createAdmin(mockFetch);
			await admin.monitoring.agentStatus({ agentUser: "agent1" });

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("agent_status");
			expect(url.searchParams.get("agent_user")).toBe("agent1");
		});

		it("gets logged in agents", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: logged_in_agents RESULT - agent1|agent2|agent3",
			);
			const admin = createAdmin(mockFetch);
			await admin.monitoring.loggedInAgents();

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("logged_in_agents");
		});
	});

	describe("dnc", () => {
		it("adds phone to DNC", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: add_dnc_phone DNC NUMBER HAS BEEN ADDED - apiuser|5551234567|SYSTEM_INTERNAL",
			);
			const admin = createAdmin(mockFetch);
			await admin.dnc.addPhone({
				phoneNumber: "5551234567",
				campaignId: "SYSTEM_INTERNAL",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("add_dnc_phone");
			expect(url.searchParams.get("phone_number")).toBe("5551234567");
			expect(url.searchParams.get("campaign_id")).toBe("SYSTEM_INTERNAL");
		});
	});

	describe("system", () => {
		it("gets version", async () => {
			const mockFetch = createMockFetch(
				"VERSION: 2.4-34|BUILD: 110424-0854|DATE: 2025-01-15 14:59:33|EPOCH: 1222020803|DST: 0|TZ: -5.00|TZNOW: -5.00|",
			);
			const admin = createAdmin(mockFetch);
			await admin.system.version();

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("version");
		});

		it("checks phone number", async () => {
			const mockFetch = createMockFetch(
				"SUCCESS: check_phone_number PHONE NUMBER IS VALID - 5551234567",
			);
			const admin = createAdmin(mockFetch);
			await admin.system.checkPhoneNumber({
				phoneNumber: "5551234567",
				dncCheck: "Y",
			});

			const url = new URL(mockFetch.mock.calls[0][0]);
			expect(url.searchParams.get("function")).toBe("check_phone_number");
			expect(url.searchParams.get("dnc_check")).toBe("Y");
		});
	});
});
