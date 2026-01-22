# @legeon/ai-orchestrator

AI orchestration interfaces for CV extraction in the Legeon privacy-preserving onboarding system.

## Phase 0 Status

This package contains **interfaces only**. No AI implementation is provided.

## Critical Privacy Constraints (per CLAUDE.md)

### AI is Assistive Only, Never Authoritative
- AI extraction helps consultants **draft** their profile
- Extracted data is **NEVER** automatically published
- Consultants **MUST** explicitly review and confirm all fields
- Only confirmed data is promoted to ConsultantProfile

### Hard Privacy Rules
Raw CV content must NEVER:
- ❌ Be written directly to public profile fields
- ❌ Be embedded in ProfileNFT
- ❌ Be exposed to other users or systems
- ❌ Be used by AI without redaction and policy checks

## Architecture

```
CV Upload (encrypted)
      ↓
1. Redaction Service (remove PII)
      ↓
2. AI Extractor (structured data)
      ↓
3. Validation (quality check)
      ↓
4. Audit Logger (compliance log)
      ↓
ProfileDraft (consultant review required)
      ↓
Consultant Confirms
      ↓
ConsultantProfile (public)
```

## Workflow

### 1. Redaction (Privacy Layer)
Before AI sees any data:
- Remove PII (names, addresses, contact info)
- Apply jurisdiction-specific redaction policies
- Validate redaction completeness

### 2. Extraction (AI Layer)
From redacted content, extract:
- Skills and competencies
- Experience summaries
- Professional bio elements
- Domain expertise (e.g., SAP modules)

### 3. Validation (Quality Layer)
Check extracted data:
- Schema compliance
- Confidence scoring
- Anomaly detection

### 4. Audit Logging (Compliance Layer)
Record all extraction events:
- Model used
- Redaction policy applied
- Confidence scores
- Extraction duration

### 5. Consultant Review (Authorization Layer)
**CRITICAL**: Consultant must:
- Review ALL extracted fields
- Edit or reject any field
- Explicitly confirm before profile publication

## Interfaces

### `IAIExtractor`
Core extraction interface for CV processing

### `IRedactionService`
PII removal before AI processing

### `IAIAuditLogger`
Compliance and audit logging

### `IAIOrchestrator`
High-level workflow coordination

## Usage (Backend Only)

```typescript
import { IAIOrchestrator } from '@legeon/ai-orchestrator'

// Backend service implementation
const result = await orchestrator.processCV({
  credentialRef: 'encrypted-cv-ref',
  jurisdiction: 'US',
  consultantId: 'user-123'
})

// Result goes to ProfileDraft (NOT ConsultantProfile)
// Consultant must review and confirm before publication
```

## Important Constraints

- **Backend-only**: No frontend AI processing
- **Server-side**: All extraction server-coordinated
- **Jurisdiction-aware**: Redaction policies vary by region
- **Audit-logged**: All extractions tracked for compliance

## Next Steps (Phase 1+)

1. [ ] Implement redaction service with NLP
2. [ ] Integrate OpenAI/Anthropic for extraction
3. [ ] Build jurisdiction-specific redaction policies
4. [ ] Add skill taxonomy mapping (SAP, tech stacks)
5. [ ] Implement confidence scoring
6. [ ] Add extraction quality metrics

See `/CLAUDE.md` for authoritative constraints.
