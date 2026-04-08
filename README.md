# ViciJS

The definitive TypeScript SDK for [ViciDial](https://vicidial.org). Type-safe, zero-dependency, isomorphic.

**91 API functions. 658 typed parameters. 108 tests. 0 dependencies.**

```bash
npm install vicijs
```

## Why ViciJS

ViciDial's API returns pipe-delimited plaintext over HTTP GET with credentials in query strings. Every integration today is raw `fetch` calls, manual string splitting, and zero type safety.

ViciJS fixes all of that:

- **Full type safety** for every parameter, response, and enum value
- **Structured error hierarchy** — catch `ViciAuthError`, `ViciPermissionError`, `ViciNotFoundError`, `ViciValidationError`, `ViciTimeoutError` individually
- **Response schemas** — map pipe-delimited output to named fields instantly
- **Isomorphic** — works in Node.js 18+ and browsers (with CORS configured)
- **ESM + CJS** dual build with full `.d.ts` declarations
- **Tree-shakeable** — import only what you use

## Quick Start

### Agent API

Control agent sessions — dial, pause, transfer, park, record, hangup.

```typescript
import { ViciAgent } from 'vicijs';

const agent = new ViciAgent({
  baseUrl: 'https://dialer.example.com',
  user: 'apiuser',
  pass: 'apipass',
  agentUser: '1001',
});

await agent.dial({ value: '5551234567', search: 'YES', preview: 'YES' });
await agent.pause('PAUSE');
await agent.transferConference({ value: 'LOCAL_CLOSER', ingroupChoices: 'SALESLINE' });
await agent.parkCall('PARK_CUSTOMER');
await agent.recording({ value: 'START' });
await agent.hangup();
await agent.setStatus({ value: 'SALE' });
await agent.logout();
```

### Admin API

Manage leads, users, campaigns, lists, DIDs, DNC, monitor agents, pull reports.

```typescript
import { ViciAdmin } from 'vicijs';

const admin = new ViciAdmin({
  baseUrl: 'https://dialer.example.com',
  user: 'apiuser',
  pass: 'apipass',
});

// Leads
await admin.leads.add({ phoneNumber: '5551234567', listId: 101, firstName: 'John' });
await admin.leads.update({ leadId: 12345, status: 'SALE' });
await admin.leads.batchUpdate({ leadIds: '1001,1002,1003', status: 'DNC' });
const lead = await admin.leads.allInfo({ leadId: 12345, customFields: 'Y' });

// Users
await admin.users.add({
  agentUser: 'newagent', agentPass: 'pass123',
  agentUserLevel: 7, agentFullName: 'New Agent', agentUserGroup: 'AGENTS',
});

// Campaigns
await admin.campaigns.update({ campaignId: 'SALES1', autoDialLevel: '3.0' });

// Real-time monitoring
const status = await admin.monitoring.agentStatus({ agentUser: '1001' });

// Reporting
const stats = await admin.reporting.agentStatsExport({
  datetimeStart: '2025-01-01+00:00:00',
  datetimeEnd: '2025-01-31+23:59:59',
});

// DNC
await admin.dnc.addPhone({ phoneNumber: '5551234567', campaignId: 'SYSTEM_INTERNAL' });
```

## API Domains

The Admin client organizes 60 functions into 10 domain sub-clients:

| Domain | Methods | Description |
|--------|---------|-------------|
| `admin.leads` | 11 | Add, update, search, batch update, dearchive |
| `admin.users` | 6 | Add, update, copy, delete users |
| `admin.campaigns` | 4 | Update campaigns, manage hopper |
| `admin.lists` | 4 | Add, update lists, manage custom fields |
| `admin.phones` | 4 | Add, update phones and aliases |
| `admin.dids` | 3 | Add, copy, update DIDs |
| `admin.dnc` | 4 | DNC and filter phone groups |
| `admin.monitoring` | 6 | Real-time agent/group status, blind monitor |
| `admin.reporting` | 6 | Recordings, stats, call logs |
| `admin.system` | 12 | Version, sounds, CID groups, presets |

## Error Handling

Every error is typed. Every error preserves the raw ViciDial response.

```typescript
import {
  ViciError,            // Base — catches everything
  ViciAuthError,        // Invalid credentials
  ViciPermissionError,  // Insufficient access level
  ViciNotFoundError,    // Resource doesn't exist
  ViciValidationError,  // Bad params, duplicates, disabled features
  ViciHttpError,        // Non-2xx HTTP status
  ViciTimeoutError,     // Request exceeded timeout
} from 'vicijs';

try {
  await admin.leads.add({ phoneNumber: '5551234567', listId: 101 });
} catch (err) {
  if (err instanceof ViciTimeoutError) {
    console.log(`Timed out after ${err.timeoutMs}ms`);
  } else if (err instanceof ViciValidationError) {
    console.log('Validation failed:', err.details);  // pipe-delimited details
    console.log('Raw response:', err.raw);            // full ViciDial response
  } else if (err instanceof ViciAuthError) {
    console.log('Check your credentials');
  }
}
```

## Response Parsing

ViciDial returns pipe-delimited text. Use the built-in schemas to map positional fields to named properties:

```typescript
import { mapFields, ADMIN_SCHEMAS, AGENT_SCHEMAS } from 'vicijs';

const result = await admin.leads.allInfo({ leadId: 12345 });
const lead = mapFields(result.rawData, ADMIN_SCHEMAS.lead_all_info);

lead.first_name;    // 'John'
lead.phone_number;  // '5551234567'
lead.status;        // 'SALE'
lead.email;         // 'john@example.com'

// VERSION responses auto-parse into data
const version = await admin.system.version();
version.data.version;  // '2.4-34'
version.data.build;    // '250720-1841'
```

## Enums

85+ status codes, 70 agent events, and 30+ parameter enums — all typed.

```typescript
import { AgentStatus, SystemStatus, AgentEvent } from 'vicijs';

AgentStatus.SALE      // 'SALE'
AgentStatus.DNC       // 'DNC'
SystemStatus.NEW      // 'NEW'
SystemStatus.CALLBK   // 'CALLBK'

AgentEvent.CALL_ANSWERED    // 'call_answered'
AgentEvent.DISPO_SET        // 'dispo_set'
AgentEvent.LOGGED_IN        // 'logged_in'
AgentEvent.PARK_STARTED     // 'park_started'
```

## Configuration

```typescript
interface ViciConfig {
  baseUrl: string;       // ViciDial server URL
  user: string;          // API username
  pass: string;          // API password
  source?: string;       // Call source identifier (max 20 chars, default: 'vicijs')
  timeout?: number;      // Request timeout ms (default: 30000)
  fetch?: typeof fetch;  // Custom fetch for testing/proxying
}


// Agent client extends with:
interface AgentConfig extends ViciConfig {
  agentUser: string;     // Agent session to control
}
```

## Browser Usage (CORS)

For browser usage, configure CORS on your ViciDial server. See the [ViciDial CORS docs](https://vicidial.org/docs/CORS_SUPPORT.txt). Never set `$CORS_allowed_origin` to `'*'`.

## Verified Against Documentation

Every parameter, enum value, and function name has been cross-referenced against the official ViciDial documentation:

| Document | What We Verified | Result |
|----------|-----------------|--------|
| [Agent API](https://vicidial.org/docs/AGENT_API.txt) (51KB) | 31 functions, 136 typed fields | 5 audit passes, 0 mismatches |
| [Non-Agent API](https://vicidial.org/docs/NON-AGENT_API.txt) (168KB) | 60 functions, 522 typed fields | 5 audit passes, 0 mismatches |
| [Status Codes](https://vicidial.org/docs/VICIDIAL_statuses.txt) | 86 disposition codes | 86/86 match |
| [Agent Events](https://vicidial.org/docs/AGENT_EVENTS_PUSH.txt) | 49 push event types | 49/49 match |
| [Custom Fields](https://vicidial.org/docs/CUSTOM_FIELDS.txt) | 8 field types | 8/8 match |

## License

AGPL-2.0 (matching ViciDial's license)
