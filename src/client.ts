import { parseError, ViciHttpError, ViciTimeoutError } from "./errors.js";
import { parseResponse } from "./parser.js";
import type { ViciConfig, ViciResponse } from "./types.js";

const DEFAULT_SOURCE = "vicijs";
const DEFAULT_TIMEOUT = 30_000;

/**
 * Base HTTP client for ViciDial API communication.
 * Uses native fetch (Node 18+ / browser). Zero dependencies.
 */
export class ViciClient {
	protected readonly baseUrl: string;
	protected readonly user: string;
	protected readonly pass: string;
	protected readonly source: string;
	protected readonly timeout: number;
	private readonly _fetch: typeof globalThis.fetch;

	constructor(config: ViciConfig) {
		if (!config.baseUrl) throw new Error("baseUrl is required");
		if (!config.user) throw new Error("user is required");
		if (!config.pass) throw new Error("pass is required");

		this.baseUrl = config.baseUrl.replace(/\/+$/, "");
		this.user = config.user;
		this.pass = config.pass;
		this.source = (config.source ?? DEFAULT_SOURCE).slice(0, 20);
		this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
		// Bind fetch to prevent losing context in some environments
		this._fetch = config.fetch ?? globalThis.fetch.bind(globalThis);
	}

	/**
	 * Execute an API request against a ViciDial endpoint.
	 *
	 * @param path - API endpoint path (e.g., "/agc/api.php")
	 * @param params - Query parameters to include
	 * @returns Parsed response
	 * @throws {ViciTimeoutError} when request exceeds configured timeout
	 * @throws {ViciHttpError} on non-2xx HTTP status codes
	 * @throws {ViciError} on API-level errors (auth, permission, validation, not found)
	 */
	protected async request(
		path: string,
		params: Record<string, string>,
	): Promise<ViciResponse> {
		const url = this.buildUrl(path, params);
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await this._fetch(url, {
				method: "GET",
				signal: controller.signal,
			});

			if (!response.ok) {
				throw new ViciHttpError(response.status, response.statusText);
			}

			const text = await response.text();
			const parsed = parseResponse(text);

			if (parsed.type === "ERROR") {
				throw parseError(text);
			}

			return parsed;
		} catch (err: unknown) {
			// Convert AbortError to typed timeout error
			if (err instanceof DOMException && err.name === "AbortError") {
				throw new ViciTimeoutError(this.timeout);
			}
			// Re-throw our own errors and anything else
			throw err;
		} finally {
			clearTimeout(timer);
		}
	}

	/** Build full URL with query parameters */
	private buildUrl(path: string, params: Record<string, string>): string {
		const url = new URL(path, this.baseUrl);

		// Auth params first
		url.searchParams.set("user", this.user);
		url.searchParams.set("pass", this.pass);
		url.searchParams.set("source", this.source);

		// Function-specific params
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== "") {
				url.searchParams.set(key, value);
			}
		}

		return url.toString();
	}
}
