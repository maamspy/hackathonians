# Agent Rules

Rules for any AI agent or contributor working in this repository. These are
project rules, not suggestions. If a change needs to break one, it needs a
discussion first. Do not quietly work around them.

---

## 1. No fallback for any environment variable

Every environment variable this project reads is required and must be present.
Read it directly. Do not invent a value.

```js
// Forbidden
const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

// Correct. Fails loudly if the platform did not supply it
const url = process.env.NEXT_PUBLIC_SITE_URL;
```

Applies to every `||`, `??`, `if (x || ...)`, and default parameter used to
substitute a value for a missing environment variable.

**Because** a silent fallback produces a wrong URL, an empty API key or a broken
sitemap that looks like it worked. A missing variable should stop the build, not
degrade it.

When you add a new environment variable, add it to `.env.example` and list it in
the `Environment variables` section below.

## 2. No environment detection, no environment-specific code

There is one code path, shared by development, build and production. The only
difference between environments is the **value** of an environment variable,
supplied by the platform. The code never branches on which environment it is in.

```js
// Forbidden — all of these
if (process.env.NODE_ENV !== "production") console.warn(...);
if (process.env.VERCEL) return ...
const isDev = process.env.NODE_ENV === "development";
if (process.env.CI) skipSomething();
```

Never

- read `NODE_ENV`, `VERCEL`, `CI`, `PROD`, or any other environment marker
- add dev-only or prod-only branches, banners, warnings or debug output
- ship code that behaves differently under `next dev` and `next start`

If something seems to need different behaviour in development, the fix is a
variable's value, not a branch in the code.

**Because** environment branches are invisible in review, untested in one of the two
environments and rot the moment the platform's markers change.

---

## Environment variables

| Variable               | Required | Purpose                                                                                                                 |
| ---------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | yes      | Absolute origin, e.g. `https://hackathonians.com`. Used for canonicals, OpenGraph URLs, sitemap, robots and `llms.txt`. |

Set to a different value per environment; that is the entire mechanism for
telling one environment from another.
