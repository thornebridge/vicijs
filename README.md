# ViciJS

Type-safe TypeScript SDK for ViciDial. Full feature parity with the Agent API (31 functions) and Non-Agent Admin API (60 functions).

- Zero dependencies
- Isomorphic (Node.js 18+ and browser)
- ESM + CJS dual build
- Full TypeScript types for every parameter, response, and enum

## Install

```bash
npm install vicijs
```

## Quick Start

### Agent API

Control agent sessions — dial, pause, transfer, record, hangup.

```typescript
import { ViciAgent } from 'vicijs';

const agent = new ViciAgent({
  baseUrl: 'https://dialer.example.com',
  user: 'apiuser',
  pass: 'apipass',
  agentUser: '1001',
});

// Dial a number
await agent.dial({ value: '5551234567', search: 'YES', preview: 'YES' });

// Pause/resume
await agent.pause('PAUSE');
await agent.pause('RESUME');

// Transfer to another agent group
await agent.transferConference({
  value: 'LOCAL_CLOSER',
  ingroupChoices: 'SALESLINE',
});

// Park and retrieve
await agent.parkCall('PARK_CUSTOMER');
await agent.parkCall('GRAB_CUSTOMER');

// Recording
await agent.recording({ value: 'START' });
await agent.recording({ value: 'STOP' });

// Hangup and set disposition
await agent.hangup();
await agent.setStatus({ value: 'SALE' });

// Logout
await agent.logout();
```

### Admin (Non-Agent) API

Manage leads, users, campaigns, lists, DIDs, DNC, and more.

```typescript
import { ViciAdmin } from 'vicijs';

const admin = new ViciAdmin({
  baseUrl: 'https://dialer.example.com',
  user: 'apiuser',
  pass: 'apipass',
});

// Lead management
const result = await admin.leads.add({
  phoneNumber: '5551234567',
  listId: 101,
  firstName: 'John',
  lastName: 'Doe',
});

await admin.leads.update({
  leadId: 12345,
  status: 'SALE',
  firstName: 'Jane',
});

await admin.leads.batchUpdate({
  leadIds: '1001,1002,1003',
  status: 'DNC',
});

const info = await admin.leads.allInfo({
  leadId: 12345,
  customFields: 'Y',
});

// User management
await admin.users.add({
  agentUser: 'newagent',
  agentPass: 'pass123',
  agentUserLevel: 7,
  agentFullName: 'New Agent',
  agentUserGroup: 'AGENTS',
});

// Campaign management
await admin.campaigns.update({
  campaignId: 'SALES1',
  dialLevel: 3,
  dialMethod: 'RATIO',
});

const campaigns = await admin.campaigns.list();

// Real-time monitoring
const status = await admin.monitoring.agentStatus({ agentUser: '1001' });
const groups = await admin.monitoring.userGroupStatus({ userGroups: 'ADMIN|AGENTS' });

// Reporting
const recordings = await admin.reporting.recordingLookup({
  date: '2025-01-15',
  agentUser: '1001',
});

const stats = await admin.reporting.agentStatsExport({
  datetimeStart: '2025-01-01+00:00:00',
  datetimeEnd: '2025-01-31+23:59:59',
});

// DNC management
await admin.dnc.addPhone({
  phoneNumber: '5551234567',
  campaignId: 'SYSTEM_INTERNAL',
});

// Phone number validation
await admin.system.checkPhoneNumber({
  phoneNumber: '5551234567',
  dncCheck: 'Y',
});
```

## API Domains

The Admin client organizes 60 functions into 10 domain sub-clients:

| Domain | Methods | Description |
|--------|---------|-------------|
| `admin.leads` | 11 | Add, update, search, batch update, dearchive leads |
| `admin.users` | 6 | Add, update, copy, delete users |
| `admin.campaigns` | 4 | Update campaigns, manage hopper |
| `admin.lists` | 4 | Add, update lists, manage custom fields |
| `admin.phones` | 4 | Add, update phones and aliases |
| `admin.dids` | 3 | Add, copy, update DIDs |
| `admin.dnc` | 4 | Manage DNC and filter phone groups |
| `admin.monitoring` | 6 | Real-time agent/group status, blind monitor |
| `admin.reporting` | 6 | Recordings, stats, call logs |
| `admin.system` | 12 | Version, sounds, CID groups, presets |

## Error Handling

All API errors are thrown as typed error classes with full inheritance:

```typescript
import {
  ViciError,           // Base class — catches all API errors
  ViciAuthError,       // Invalid user/pass
  ViciPermissionError, // Insufficient access level or feature flag
  ViciNotFoundError,   // Lead, user, campaign, etc. doesn't exist
  ViciValidationError, // Duplicate, invalid params, disabled feature
  ViciHttpError,       // Non-2xx HTTP status
  ViciTimeoutError,    // Request exceeded configured timeout
} from 'vicijs';

try {
  await admin.leads.add({ phoneNumber: '5551234567', listId: 101 });
} catch (err) {
  if (err instanceof ViciTimeoutError) {
    console.log(`Timed out after ${err.timeoutMs}ms`);
  } else if (err instanceof ViciValidationError) {
    console.log('Validation failed:', err.details);
  } else if (err instanceof ViciAuthError) {
    console.log('Auth failed');
  } else if (err instanceof ViciPermissionError) {
    console.log('Permission denied');
  } else if (err instanceof ViciHttpError) {
    console.log(`HTTP ${err.statusCode}`);
  }
}
```

Every error preserves the raw ViciDial response string (`err.raw`), the function name (`err.function`), and parsed details (`err.details`).

## Response Parsing

ViciDial returns pipe-delimited text. Use the built-in schemas to get named fields:

```typescript
import { mapFields, ADMIN_SCHEMAS, AGENT_SCHEMAS, parseResponse } from 'vicijs';

// Parse a raw response
const result = await admin.leads.allInfo({ leadId: 12345 });

// Map positional pipe-delimited data to named fields using schemas
const lead = mapFields(result.rawData, ADMIN_SCHEMAS.lead_all_info);
console.log(lead.first_name);  // 'John'
console.log(lead.phone_number); // '5551234567'
console.log(lead.status);       // 'SALE'

// VERSION responses are auto-parsed into data
const version = await admin.system.version();
console.log(version.data.version); // '2.4-34'
console.log(version.data.build);   // '250720-1841'
```

Schemas are exported for all Agent and Admin API functions — use `AGENT_SCHEMAS.*` and `ADMIN_SCHEMAS.*` for autocomplete.

## Enums

All ViciDial status codes, events, and parameter values are exported as typed constants:

```typescript
import { AgentStatus, SystemStatus, AgentEvent, LeadStatus } from 'vicijs';

// Status codes
AgentStatus.SALE     // 'SALE'
SystemStatus.NEW     // 'NEW'
SystemStatus.CALLBK  // 'CALLBK'

// Agent push events (70 events)
AgentEvent.CALL_ANSWERED   // 'call_answered'
AgentEvent.DISPO_SET       // 'dispo_set'
AgentEvent.LOGGED_IN       // 'logged_in'
```

## CORS Setup

For browser usage, you must configure CORS on your ViciDial server. See the [ViciDial CORS docs](https://vicidial.org/docs/CORS_SUPPORT.txt) for instructions. Never set `$CORS_allowed_origin` to `'*'`.

## Configuration

```typescript
interface ViciConfig {
  baseUrl: string;          // ViciDial server URL
  user: string;             // API username
  pass: string;             // API password
  source?: string;          // API call source identifier (max 20 chars, default: 'vicijs')
  timeout?: number;         // Request timeout in ms (default: 30000)
  fetch?: typeof fetch;     // Custom fetch for testing/proxying
}
```

## License

AGPL-2.0 (matching ViciDial's license)
