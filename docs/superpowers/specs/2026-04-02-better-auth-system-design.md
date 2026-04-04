# Better Auth System Design

**Date:** 2026-04-02
**Status:** Approved (v2 — revised to use existing MOODSVIBE database)
**Scope:** Replace demo auth with production-ready Better Auth, connecting to the existing MOODSVIBE Postgres database via Prisma

---

## Overview

Replace the current demo authentication system (hardcoded emails, localStorage sessions, no password validation) with a production-ready auth system using **Better Auth**, connected to the **existing MOODSVIBE PostgreSQL database** which already contains user, session, account, organization, member, and invitation tables — all managed by Prisma. Supports web (Next.js) and mobile (React Native + Expo).

## Key Discovery

The MOODSVIBE-frontend project (`/Users/stephan/bosun/workspaces/1772533357220/MOODSVIBE-frontend`) already has a complete Better Auth-compatible schema with 158 Prisma models, including:

- **`user`** — id, name, firstName, lastName, email, emailVerified, role, banned, onboardingComplete, twoFactorEnabled, failedLoginAttempts, lockedUntil
- **`account`** — Better Auth standard (providerId, accountId, password, accessToken, etc.)
- **`session`** — Better Auth standard + activeOrganizationId, impersonatedBy
- **`verification`** — Better Auth standard (identifier, value, expiresAt)
- **`organization`** — id, name, slug, logo, metadata + org-specific settings
- **`member`** — userId, organizationId, role (MemberRole enum), organizationRoleId
- **`invitation`** — organizationId, email, firstName, lastName, role, status, expiresAt, inviterId
- **`MemberRole` enum** — owner, admin, therapist, hr, client

This means we don't need to create any tables, schemas, or Docker containers. We connect to the existing database and use Prisma as the Better Auth adapter.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Auth framework | Better Auth | TypeScript-first, plugin ecosystem, org support, Expo integration |
| Auth database | Existing MOODSVIBE Postgres | Already has all auth tables, managed by Prisma |
| ORM adapter | Prisma (via `better-auth/adapters/prisma`) | Matches existing project, shared schema management |
| Organization model | Org-scoped roles on `member` table | Already implemented in existing schema |
| Access model | Invite-only | Healthcare practice controls who gets access |
| Auth methods | Email/password + magic link | Simple start, magic link for convenience |
| Session management | DB sessions + cookie cache (web), bearer + expo plugin (mobile) | Fast reads with revocation, mobile-compatible |
| Mobile support | Better Auth expo plugin (server + client) | Deep linking, SecureStore sessions, scheme URLs |

## Roles

Five org-scoped roles — already defined as `MemberRole` enum in the existing Prisma schema:

| Role | Access |
|------|--------|
| `owner` | Full access, org settings, can manage all roles |
| `admin` | User management, invites, planning, reporting |
| `hr` | HR & verlof tab, team management |
| `therapist` | Own schedule, client records |
| `client` | Own appointments, e-health tasks |

## Better Auth Plugins

| Plugin | Purpose |
|--------|---------|
| `emailAndPassword` | Credentials-based login |
| `magicLink` | Passwordless email sign-in |
| `organization` | Org-scoped membership + roles |
| `bearer` | Token auth for mobile API calls |
| `admin` | User management (list, ban, impersonate) |
| `expo` (from `@better-auth/expo`) | Mobile client support — deep linking, secure storage, scheme URLs |

## Database Architecture

### Two Database Connections

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  Next.js Web │────▶│  /api/auth/**    │────▶│  MOODSVIBE Postgres     │
│  (cookies)   │     │  (Better Auth)   │     │  (user, session, member,│
└─────────────┘     │                  │     │   organization, etc.)   │
                    │  /api/agenda/**  │────▶│                         │
┌─────────────┐     │  (agenda data)   │     ├─────────────────────────┤
│  RN/Expo    │────▶│                  │     │  Agenda Postgres        │
│  (bearer)   │     └──────────────────┘     │  (silver.hci_time_entry)│
└─────────────┘                              └─────────────────────────┘
```

| Connection | Env Var | Purpose | Access Method |
|------------|---------|---------|---------------|
| MOODSVIBE DB | `DATABASE_URL` | Auth tables (user, session, account, member, org, invitation) | Prisma Client |
| Agenda DB | `AGENDA_DATABASE_URL` | Time entries, therapist data | Raw `pg` (existing `lib/db.ts`) |

### Existing Schema (no changes needed)

All tables already exist and are managed by MOODSVIBE-frontend's Prisma migrations. The moodsai-demo project connects as a **read/write consumer** using a shared Prisma schema (copied or referenced).

**Better Auth core tables:**
- `user` — with `@@map("user")`
- `account` — with `@@map("account")`
- `session` — with `@@map("session")`, includes `active_organization_id`, `impersonated_by`
- `verification` — with `@@map("verification")`

**Organization tables:**
- `organization` — with org-specific settings (stripe, openai, epd, etc.)
- `member` — role via `MemberRole` enum, links user ↔ organization
- `invitation` — email, role, status (pending/accepted/rejected/canceled), expiresAt

### Prisma Adapter Configuration

Better Auth uses Prisma model names, NOT table names. Key mappings:

| Prisma Model | DB Table | Better Auth Model Name |
|-------------|----------|----------------------|
| `User` | `user` | `user` |
| `Account` | `account` | `account` |
| `Session` | `session` | `session` |
| `Verification` | `verification` | `verification` |
| `Organization` | `organization` | `organization` |
| `Member` | `member` | `member` |
| `Invitation` | `invitation` | `invitation` |

### Prisma Schema for moodsai-demo

We need a **subset Prisma schema** in this project containing only the auth-related models. This avoids importing all 158 models from MOODSVIBE-frontend. The schema must match the existing table structure exactly (same column names, types, indexes).

Models to include: User, Account, Session, Verification, Organization, Member, Invitation, plus the MemberRole, InvitationStatus, and UserRole enums.

## Auth Flows

### Invite + Signup

1. Admin/owner navigates to `/admin/invite`
2. Fills in: firstName, lastName, email, role, location (optional), phone (optional)
3. Server creates `invitation` record via Prisma (status: `pending`, 7-day expiry)
4. Email sent via Resend with onboarding link: `/onboarding?invitationId=xxx`
5. User clicks link → server validates invitation (exists, status=pending, not expired)
6. User sets password (and completes onboarding steps: language, location, reason)
7. Better Auth creates `user` + `account` records
8. Organization plugin creates `member` record with role from invitation
9. Invitation status updated to `accepted`
10. Session established → redirect to role-appropriate dashboard

### Login (email/password)

1. User submits email + password at `/login`
2. Better Auth `signIn.email()` validates credentials against `account.password`
3. Session created in DB + cookie cache set
4. Client fetches session → includes active org membership + role
5. Redirect based on role: owner/admin → `/admin`, therapist → `/therapist`, client → `/client`, hr → `/admin?tab=hr`

### Login (magic link)

1. User enters email at `/login`, clicks "Stuur login link"
2. Better Auth creates `verification` record and sends email via Resend
3. User clicks link → verification validated → session created
4. Redirect by role (same as above)

### Mobile (React Native + Expo)

1. Same `/api/auth/**` endpoints
2. Expo client uses `expoClient` plugin with app scheme + SecureStore
3. Server-side `expo` plugin handles deep linking callbacks and cookie-to-token translation
4. Bearer token used for API requests via `Authorization` header
5. Session cached in SecureStore (no loading spinner on app restart)

### Logout

1. `signOut()` → session record deleted from DB
2. Cookie cleared (web) / SecureStore cleared (mobile)
3. Redirect to `/login`

## Route Protection

**middleware.ts** checks session on every request:

```
Public (no auth required):
  /login
  /onboarding/**
  /api/auth/**
  /r/** (public therapist profiles)

Protected (any authenticated user):
  /api/agenda/**
  /api/invite/** (further role-checked in handler)
  /api/email/**

Role-restricted:
  /admin/**     → owner, admin
  /admin?tab=hr → owner, admin, hr
  /therapist/** → owner, admin, therapist
  /client/**    → owner, admin, client
```

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `lib/auth.ts` | Better Auth server config (Prisma adapter, plugins, email handlers) |
| `lib/auth-client.ts` | Better Auth React client (useSession, signIn, signOut, organization) |
| `prisma/schema.prisma` | Subset Prisma schema with auth-related models only |
| `app/api/auth/[...all]/route.ts` | Better Auth catch-all API handler |
| `middleware.ts` | Route protection + role-based access |

### Modified Files

| File | Change |
|------|--------|
| `contexts/AuthContext.tsx` | Replace demo logic with Better Auth session hooks (useSession, active org, member role) |
| `app/(auth)/login/page.tsx` | Wire to `signIn.email()` + `signIn.magicLink()` |
| `app/(auth)/verify/page.tsx` | Repurpose for magic link callback or remove |
| `app/(dashboard)/layout.tsx` | Use real session instead of localStorage check |
| `app/(dashboard)/admin/invite/page.tsx` | Create invitation via Prisma, send email via Resend |
| `app/(onboarding)/onboarding/page.tsx` | Validate invitation, create account via Better Auth, update invitation status |
| `package.json` | Add `better-auth`, `@better-auth/expo`, `@prisma/client`, `prisma` |
| `.env.local` | Add `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |

### Removed

| What | Why |
|------|-----|
| Demo email mappings in AuthContext | Replaced by real DB users |
| localStorage session management | Replaced by Better Auth sessions |
| `app/(auth)/signup/page.tsx` | Invite-only — signup happens via onboarding |
| Fake login validation | Replaced by Better Auth credentials check |

### Unchanged

| File | Why |
|------|-----|
| `lib/db.ts` | Agenda DB connection stays as-is (raw pg for silver schema) |
| `app/api/agenda/**` | Agenda API routes, no auth changes needed yet |
| `app/(dashboard)/admin/planning.tsx` | UI component, unaffected |
| `emails/MoodsTransactional.tsx` | Reused for invites + magic links |
| `data/agenda-mock-data.ts` | Mock data fallback, unchanged |

## Environment Variables

```env
# MOODSVIBE database (existing — contains auth tables)
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Better Auth
BETTER_AUTH_SECRET=<generated-32-char-secret>
BETTER_AUTH_URL=http://localhost:3000

# Existing (unchanged)
AGENDA_DATABASE_URL=<existing-remote-postgres>
RESEND_API_KEY=<existing>
RESEND_FROM_EMAIL=noreply@moodsai.ai
```

## Better Auth Server Config (lib/auth.ts)

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization, bearer, admin } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins/magic-link";
import { expo } from "@better-auth/expo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
  plugins: [
    organization({
      roles: {
        owner: { authorize: () => true },
        admin: { authorize: () => true },
        hr: {},
        therapist: {},
        client: {},
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Uses existing lib/resend.ts + MoodsTransactional email template
      },
    }),
    bearer(),
    admin(),
    expo(),
  ],
  session: {
    cookieCache: { enabled: true, maxAge: 300 },
  },
  trustedOrigins: ["moodsai://"],
  user: {
    additionalFields: {
      firstName: { type: "string", required: false },
      lastName: { type: "string", required: false },
      onboardingComplete: { type: "boolean", defaultValue: false },
      locale: { type: "string", required: false },
    },
  },
});
```

## Prisma Schema Strategy

The moodsai-demo project gets its own `prisma/schema.prisma` containing only the auth-related models. This schema must produce table structures identical to the existing MOODSVIBE database.

Steps:
1. Copy the relevant models (User, Account, Session, Verification, Organization, Member, Invitation) and enums from the MOODSVIBE schema
2. Run `prisma generate` (NOT `prisma migrate` — tables already exist)
3. Use `prisma db pull` to verify the schema matches the live database

We never run migrations from moodsai-demo — schema evolution is owned by MOODSVIBE-frontend.

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Invalid invitation ID | Show "Ongeldige of verlopen uitnodiging" |
| Expired invitation | Show "Uitnodiging verlopen — neem contact op met je organisatie" |
| Already-accepted invitation | Show "Deze uitnodiging is al gebruikt" |
| Wrong password | Better Auth returns 401, show "Onjuist e-mailadres of wachtwoord" |
| Magic link expired | "Link verlopen, vraag een nieuwe aan" |
| Auth DB unreachable | 500 error, log server-side, show generic error |
| No session on protected route | middleware redirects to `/login` |
| Insufficient role | middleware redirects to role-appropriate dashboard |

## Out of Scope

- Two-factor authentication (user table has `twoFactorEnabled` field — can activate later via `twoFactor` plugin)
- OAuth/social login (can add later)
- Password complexity requirements beyond min length
- Audit logging
- User profile editing (name, image)
- Multi-org support (architecture supports it, single org for now)
- Docker Compose for local DB (not needed — using existing MOODSVIBE database)
- Prisma migrations (owned by MOODSVIBE-frontend)
