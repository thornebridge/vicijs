/** Agent-selectable disposition statuses */
export const AgentStatus = {
	/** Answering Machine — operator-identified voicemail */
	A: "A",
	/** Busy — operator-identified busy signal */
	B: "B",
	/** Disconnected Number */
	DC: "DC",
	/** Declined Sale */
	DEC: "DEC",
	/** Do Not Call — added to DNC registry */
	DNC: "DNC",
	/** No Answer — operator-marked unanswered */
	N: "N",
	/** Not Interested */
	NI: "NI",
	/** No Pitch No Price */
	NP: "NP",
	/** Sale Made */
	SALE: "SALE",
	/** Alternate Number Dialing */
	ALTNUM: "ALTNUM",
} as const;

export type AgentStatus = (typeof AgentStatus)[keyof typeof AgentStatus];

/** Core call flow system statuses */
export const SystemStatus = {
	/** New Lead — not yet contacted */
	NEW: "NEW",
	/** Lead queued to be called */
	QUEUE: "QUEUE",
	/** Lead actively being called */
	INCALL: "INCALL",
	/** Agent not available — outbound drop */
	DROP: "DROP",
	/** Agent not available — inbound drop */
	XDROP: "XDROP",
	/** No Answer — auto-dial */
	NA: "NA",
	/** Scheduled callback */
	CALLBK: "CALLBK",
	/** Callback hold — awaiting trigger */
	CBHOLD: "CBHOLD",
	/** Inbound queue entry */
	INBND: "INBND",
} as const;

export type SystemStatus = (typeof SystemStatus)[keyof typeof SystemStatus];

/** Answering Machine Detection statuses */
export const AMDStatus = {
	/** Answering Machine Auto — dialer-detected */
	AA: "AA",
	/** Answering Machine Sent to Message */
	AM: "AM",
	/** Answering Machine Message Played */
	AL: "AL",
	/** Answering Machine Transfer */
	AMDXFR: "AMDXFR",
	/** Dead Air Auto — AMD no-audio detection */
	ADAIR: "ADAIR",
} as const;

export type AMDStatus = (typeof AMDStatus)[keyof typeof AMDStatus];

/** Auto-detection statuses */
export const AutoDetectStatus = {
	/** Fax Machine Auto */
	AFAX: "AFAX",
	/** Busy Auto — carrier-detected */
	AB: "AB",
	/** Disconnected Number Auto */
	ADC: "ADC",
	/** Congested Number Auto */
	ADCT: "ADCT",
	/** Disconnect Carrier-Defined (TILTX) */
	ADCCAR: "ADCCAR",
} as const;

export type AutoDetectStatus =
	(typeof AutoDetectStatus)[keyof typeof AutoDetectStatus];

/** DNC (Do Not Call) system statuses */
export const DNCStatus = {
	/** DNC Hopper Match */
	DNCL: "DNCL",
	/** DNC Campaign-specific */
	DNCC: "DNCC",
	/** DNC Carrier-Defined (TILTX) */
	DNCCAR: "DNCCAR",
} as const;

export type DNCStatus = (typeof DNCStatus)[keyof typeof DNCStatus];

/** Transfer/routing statuses */
export const TransferStatus = {
	/** Call Picked Up — pre-agent routing */
	PU: "PU",
	/** Played Message — broadcast/survey */
	PM: "PM",
	/** Call Transferred — agent-to-closer */
	XFER: "XFER",
	/** Hold Recall Transfer */
	HXFER: "HXFER",
	/** Re-Queue Transfer */
	RQXFER: "RQXFER",
	/** Remote Agent API Transfer */
	RAXFER: "RAXFER",
	/** Outbound Drop to Call Menu */
	IVRXFR: "IVRXFR",
	/** CPD Unknown Transfer */
	UNKXFR: "UNKXFR",
} as const;

export type TransferStatus =
	(typeof TransferStatus)[keyof typeof TransferStatus];

/** Sangoma Call Progress Detection statuses */
export const CPDStatus = {
	/** CPD All-Trunks-Busy */
	CPDATB: "CPDATB",
	/** CPD Busy */
	CPDB: "CPDB",
	/** CPD No-Answer */
	CPDNA: "CPDNA",
	/** CPD Reject */
	CPDREJ: "CPDREJ",
	/** CPD Invalid-Number */
	CPDINV: "CPDINV",
	/** CPD Service-Unavailable */
	CPDSUA: "CPDSUA",
	/** CPD Sit-Intercept */
	CPDSI: "CPDSI",
	/** CPD Sit-No-Circuit */
	CPDSNC: "CPDSNC",
	/** CPD Sit-Reorder */
	CPDSR: "CPDSR",
	/** CPD Sit-Unknown */
	CPDSUK: "CPDSUK",
	/** CPD Sit-Vacant */
	CPDSV: "CPDSV",
	/** CPD Unknown */
	CPDUK: "CPDUK",
	/** CPD Error */
	CPDERR: "CPDERR",
} as const;

export type CPDStatus = (typeof CPDStatus)[keyof typeof CPDStatus];

/** Error/system state statuses */
export const ErrorStatus = {
	/** Agent Error — browser closed pre-dispo */
	ERI: "ERI",
	/** Manual Dial No Disposition */
	DONEM: "DONEM",
	/** Disposition Screen Error */
	DISPO: "DISPO",
	/** Local Channel Resolution Error */
	LRERR: "LRERR",
} as const;

export type ErrorStatus = (typeof ErrorStatus)[keyof typeof ErrorStatus];

/** Survey campaign statuses */
export const SurveyStatus = {
	/** Survey sent to Extension */
	SVYEXT: "SVYEXT",
	/** Survey sent to Voicemail */
	SVYVM: "SVYVM",
	/** Survey Hungup */
	SVYHU: "SVYHU",
	/** Survey sent to Record */
	SVYREC: "SVYREC",
	/** Survey sent to Call Menu */
	SVYCLM: "SVYCLM",
} as const;

export type SurveyStatus = (typeof SurveyStatus)[keyof typeof SurveyStatus];

/** Inbound-specific statuses */
export const InboundStatus = {
	/** Hold time option termination */
	HOLDTO: "HOLDTO",
	/** Queue Abandon Voicemail Left */
	QVMAIL: "QVMAIL",
	/** Inbound Drop Timeout */
	TIMEOT: "TIMEOT",
	/** After Hours Drop */
	AFTHRS: "AFTHRS",
	/** No Agent No Queue Drop */
	NANQUE: "NANQUE",
	/** Wait time option termination */
	WAITTO: "WAITTO",
	/** Pre-routing Dropped Call */
	PDROP: "PDROP",
	/** Max Calls Drop */
	MAXCAL: "MAXCAL",
	/** Closing-Time Option */
	CLOSOP: "CLOSOP",
	/** In-Queue No-Agent-No-Queue */
	IQNANQ: "IQNANQ",
	/** Shared Campaign Drop */
	SRDROP: "SRDROP",
	/** Area Code Filter Check */
	ACFLTR: "ACFLTR",
} as const;

export type InboundStatus = (typeof InboundStatus)[keyof typeof InboundStatus];

/** Quality Control statuses */
export const QCStatus = {
	/** QC Fail Callback */
	QCFAIL: "QCFAIL",
	/** QC Cancel */
	QCCANC: "QCCANC",
	/** QC Passed */
	QCPASS: "QCPASS",
} as const;

export type QCStatus = (typeof QCStatus)[keyof typeof QCStatus];

/** Miscellaneous system statuses */
export const MiscStatus = {
	/** Multi-Lead Auto-Alt-Dial — lead set inactive */
	MLINAT: "MLINAT",
	/** Lead Search Merge */
	LSMERG: "LSMERG",
	/** Dispo Call Max */
	DISMX: "DISMX",
	/** CPD Unknown Message */
	UNKAM: "UNKAM",
	/** CPD Unknown Message Played */
	UNKAL: "UNKAL",
	/** NVA Phone Default Status */
	NVAINS: "NVAINS",
	/** Pause Max Seconds Timeout */
	PAUSMX: "PAUSMX",
	/** Campaign HotKey Voicemail */
	LTMGAD: "LTMGAD",
	/** Campaign HotKey Voicemail Alt */
	XAMMAD: "XAMMAD",
} as const;

export type MiscStatus = (typeof MiscStatus)[keyof typeof MiscStatus];

/** All possible lead/call status codes */
export type LeadStatus =
	| AgentStatus
	| SystemStatus
	| AMDStatus
	| AutoDetectStatus
	| DNCStatus
	| TransferStatus
	| CPDStatus
	| ErrorStatus
	| SurveyStatus
	| InboundStatus
	| QCStatus
	| MiscStatus;
