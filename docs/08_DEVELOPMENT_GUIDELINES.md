# Multi Company Enterprise ERP
# Development Guidelines

---

# DEV-001
## New Feature Development Flow

Every new feature must follow this order:

1. Requirement Understanding
2. Module Specification Check
3. Database Structure Check
4. Model Layer Creation
5. Service Layer Implementation
6. Controller Implementation
7. Route Binding
8. Validation Layer
9. API Testing
10. Integration (Finance / Inventory if needed)

---

# DEV-002
## Existing Code Modification Rules

Before modifying existing code:

- Understand full flow first
- Identify dependencies
- Check side effects
- Verify related modules

❌ Direct modification without analysis is not allowed

---

# DEV-003
## Refactoring Rules

Refactoring means:

✔ Improve structure  
✔ Remove duplication  
✔ Improve naming  
✔ Split large files  

❌ Business logic should NOT change unless explicitly required

---

# DEV-004
## Finance & Inventory Safety Rule

Finance and Inventory are critical systems.

Rules:

- No direct DB updates for financial logic
- Always use service layer
- Always use transactions
- Always maintain audit trail

---

# DEV-005
## Debugging Process

Bug fixing flow:

1. Reproduce issue
2. Check logs
3. Identify module
4. Trace service layer
5. Verify database state
6. Fix root cause (not symptom)
7. Add prevention logic

---

# DEV-006
## Testing Checklist (Manual)

Every feature must be tested for:

- Valid input
- Invalid input
- Missing fields
- Boundary values
- Company isolation
- Authorization checks
- Duplicate prevention

---

# DEV-007
## Database Change Rules

Before modifying database:

- Check foreign keys
- Check existing data impact
- Create migration script if needed
- Ensure backward compatibility

❌ Direct production changes are not allowed

---

# DEV-008
## API Discipline Rules

- Do not break existing APIs
- Maintain consistent response format
- Maintain error format standard
- Use pagination for large data

---

# DEV-009
## Logging Standards

Important actions must be logged:

- Purchase created
- Stock updated
- Journal posted
- Payment processed

Logs should help debugging, not clutter system.

---

# DEV-010
## Performance Rules

Avoid:

- SELECT *
- Nested DB calls in loops
- Unindexed queries

Prefer:

- Batch operations
- Indexed lookups
- Service-based architecture

---

# DEV-011
## Code Review Checklist

Before marking feature complete:

- Naming correct?
- Service layer used?
- Controller clean?
- Error handling added?
- Transaction used?
- Company isolation respected?

---

# DEV-012
## Production Safety Rules

- No direct DB edits in production
- No debug logs in production
- Always maintain rollback plan
- Never deploy incomplete features

---

# Version
1.0
Last Updated: 03 July 2026