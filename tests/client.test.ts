import { describe, expect, it, vi } from "vitest";
import { ViciAgent } from "../src/agent/index.js";
import {
	ViciHttpError,
	ViciTimeoutError,
	ViciValidationError,
} from "../src/errors.js";

function createMockFetch(responseText: string, options?: { delay?: number }) {
	return vi.fn().mockImplementation(
		(_url: string, init?: { signal?: AbortSignal }) =>
			new Promise((resolve, reject) => {
				const timeout = setTimeout(() => {
					resolve({
						ok: true,
						status: 200,
						text: () => Promise.resolve(responseText),
					});
				}, options?.delay ?? 0);

				init?.signal?.addEventListener("abort", () => {
					clearTimeout(timeout);
					reject(new DOMException("The operation was aborted.", "AbortError"));
				});
			}),
	);
}

function createAgent(fetchFn: ReturnType<typeof vi.fn>, timeout?: number) {
	return new ViciAgent({
		baseUrl: "https://dialer.example.com",
		user: "apiuser",
		pass: "apipass",
		agentUser: "agent1",
		source: "test",
		timeout,
		fetch: fetchFn as unknown as typeof globalThis.fetch,
	});
}

describe("ViciClient — constructor validation", () => {
	it("throws on missing baseUrl", () => {
		expect(
			() =>
				new ViciAgent({
					baseUrl: "",
					user: "u",
					pass: "p",
					agentUser: "a",
				} as never),
		).toThrow("baseUrl is required");
	});

	it("throws on missing user", () => {
		expect(
			() =>
				new ViciAgent({
					baseUrl: "https://example.com",
					user: "",
					pass: "p",
					agentUser: "a",
				} as never),
		).toThrow("user is required");
	});

	it("throws on missing pass", () => {
		expect(
			() =>
				new ViciAgent({
					baseUrl: "https://example.com",
					user: "u",
					pass: "",
					agentUser: "a",
				} as never),
		).toThrow("pass is required");
	});

	it("throws on missing agentUser", () => {
		expect(
			() =>
				new ViciAgent({
					baseUrl: "https://example.com",
					user: "u",
					pass: "p",
					agentUser: "",
				} as never),
		).toThrow("agentUser is required");
	});
});

describe("ViciClient — timeout handling", () => {
	it("throws ViciTimeoutError when request exceeds timeout", async () => {
		const mockFetch = createMockFetch("SUCCESS: version OK", {
			delay: 500,
		});
		const agent = createAgent(mockFetch, 50);

		await expect(agent.version()).rejects.toThrow(ViciTimeoutError);
	});

	it("timeout error includes timeout value", async () => {
		const mockFetch = createMockFetch("SUCCESS: version OK", {
			delay: 500,
		});
		const agent = createAgent(mockFetch, 100);

		try {
			await agent.version();
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(ViciTimeoutError);
			expect((err as ViciTimeoutError).timeoutMs).toBe(100);
		}
	});
});

describe("ViciClient — HTTP error handling", () => {
	it("throws ViciHttpError on 500", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
		});
		const agent = createAgent(mockFetch);

		await expect(agent.version()).rejects.toThrow(ViciHttpError);
	});

	it("throws ViciHttpError on 401", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 401,
			statusText: "Unauthorized",
		});
		const agent = createAgent(mockFetch);

		try {
			await agent.version();
			expect.unreachable("should have thrown");
		} catch (err) {
			expect(err).toBeInstanceOf(ViciHttpError);
			expect((err as ViciHttpError).statusCode).toBe(401);
		}
	});

	it("throws ViciHttpError on 404", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 404,
			statusText: "Not Found",
		});
		const agent = createAgent(mockFetch);

		await expect(agent.version()).rejects.toThrow(ViciHttpError);
	});
});

describe("ViciClient — API error handling", () => {
	it("throws typed error for ERROR responses", async () => {
		const mockFetch = createMockFetch(
			"ERROR: external_dial not valid - 555|1|YES|agent1",
		);
		const agent = createAgent(mockFetch);

		await expect(agent.dial({ value: "555" })).rejects.toThrow(
			ViciValidationError,
		);
	});

	it("does not throw for NOTICE responses", async () => {
		const mockFetch = createMockFetch(
			"NOTICE: recording active - agent1|12345|rec001|server|time|server2|sess|RECORDING",
		);
		const agent = createAgent(mockFetch);

		const result = await agent.recording({ value: "STATUS" });
		expect(result.type).toBe("NOTICE");
	});
});

describe("ViciClient — URL construction", () => {
	it("builds correct URL with all params", async () => {
		const mockFetch = createMockFetch(
			"SUCCESS: external_hangup function set - 1|agent1",
		);
		const agent = createAgent(mockFetch);
		await agent.hangup();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.origin).toBe("https://dialer.example.com");
		expect(url.pathname).toBe("/agc/api.php");
		expect(url.searchParams.get("user")).toBe("apiuser");
		expect(url.searchParams.get("pass")).toBe("apipass");
		expect(url.searchParams.get("source")).toBe("test");
		expect(url.searchParams.get("function")).toBe("external_hangup");
		expect(url.searchParams.get("agent_user")).toBe("agent1");
	});

	it("strips trailing slashes from baseUrl", async () => {
		const mockFetch = createMockFetch("SUCCESS: version OK");
		const agent = new ViciAgent({
			baseUrl: "https://dialer.example.com///",
			user: "u",
			pass: "p",
			agentUser: "a",
			fetch: mockFetch as unknown as typeof globalThis.fetch,
		});
		await agent.version();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.origin).toBe("https://dialer.example.com");
	});

	it("truncates source to 20 chars", async () => {
		const mockFetch = createMockFetch("SUCCESS: version OK");
		const agent = new ViciAgent({
			baseUrl: "https://example.com",
			user: "u",
			pass: "p",
			agentUser: "a",
			source: "this-is-a-very-long-source-name-that-exceeds-twenty-characters",
			fetch: mockFetch as unknown as typeof globalThis.fetch,
		});
		await agent.version();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("source")?.length).toBeLessThanOrEqual(20);
	});

	it("defaults source to 'vicijs'", async () => {
		const mockFetch = createMockFetch("SUCCESS: version OK");
		const agent = new ViciAgent({
			baseUrl: "https://example.com",
			user: "u",
			pass: "p",
			agentUser: "a",
			fetch: mockFetch as unknown as typeof globalThis.fetch,
		});
		await agent.version();

		const url = new URL(mockFetch.mock.calls[0][0]);
		expect(url.searchParams.get("source")).toBe("vicijs");
	});
});
