# Microfrontend Monorepo — Vercel Deployment Guide

> A step-by-step reference for deploying a pnpm monorepo with Module Federation to Vercel.
> Written based on the OctoHealth MFE v2 deployment (May 2026).

---

## Table of Contents

1. [Overview](#overview)
2. [Part 1 — Prepare Your Code](#part-1--prepare-your-code)
3. [Part 2 — Deploy via Vercel Dashboard (Recommended)](#part-2--deploy-via-vercel-dashboard-recommended)
4. [Part 3 — Deploy via CLI (Alternative)](#part-3--deploy-via-cli-alternative)
5. [Part 4 — How Environment Variables Wire the Federation](#part-4--how-environment-variables-wire-the-federation)
6. [Part 5 — Common Errors and Fixes](#part-5--common-errors-and-fixes)
7. [Part 6 — Quick Checklist](#part-6--quick-checklist)

---

## Overview

A microfrontend monorepo has multiple packages (shell + remotes) that must each be deployed as a **separate Vercel project**. They all share the same GitHub repository but each Vercel project points to a different subfolder via the **Root Directory** setting.

### Example structure

```
my-monorepo/
├── packages/
│   ├── shell/          → Vercel project: my-app-shell
│   ├── shared-ui/      → Vercel project: my-app-shared-ui
│   ├── remote-crm/     → Vercel project: my-app-remote-crm
│   ├── remote-admin/   → Vercel project: my-app-remote-admin
│   └── remote-sales/   → Vercel project: my-app-remote-sales
├── package.json
└── pnpm-workspace.yaml
```

### Why separate projects?

Each remote (`shared-ui`, `remote-crm`, etc.) produces a `remoteEntry.js` file that must be served from a stable public URL. The shell loads these files at runtime in the browser. Each needs its own URL, so each needs its own Vercel project.

---

## Part 1 — Prepare Your Code

### 1.1 Add `vercel.json` to each package

Create a `vercel.json` file inside **every package folder**.

#### For remotes (shared-ui, remote-crm, remote-admin, remote-sales)

```json
{
  "framework": null,
  "buildCommand": "NODE_OPTIONS='--max-old-space-size=3072' pnpm --filter shared-ui build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile",
  "headers": [
    {
      "source": "/assets/remoteEntry.js",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

> Change `--filter shared-ui` to match the package name (e.g. `--filter remote-crm`).

#### For the shell (add the `rewrites` block for SPA routing)

```json
{
  "framework": null,
  "buildCommand": "NODE_OPTIONS='--max-old-space-size=3072' pnpm --filter shell build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install --frozen-lockfile",
  "headers": [
    {
      "source": "/assets/remoteEntry.js",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [{ "source": "/((?!assets/).*)", "destination": "/index.html" }]
}
```

#### What each field means

| Field                                      | What it does                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `framework: null`                          | Stops Vercel from auto-detecting and overriding your build                                                                           |
| `buildCommand`                             | The command that builds the package. `--filter [name]` builds only that package                                                      |
| `NODE_OPTIONS='--max-old-space-size=3072'` | Gives Node.js 3 GB of RAM. Prevents build being killed on large TypeScript + Vite projects                                           |
| `outputDirectory: dist`                    | Tells Vercel where to find the built files                                                                                           |
| `installCommand`                           | Installs all workspace dependencies. Runs from the repo root                                                                         |
| `headers` on `remoteEntry.js`              | Adds `Access-Control-Allow-Origin: *` so the shell can load it cross-origin. Sets `no-cache` so the latest version is always fetched |
| `headers` on other assets                  | Same CORS header + `immutable` cache (1 year) because Vite hashes asset filenames                                                    |
| `rewrites` (shell only)                    | Redirects all URLs (e.g. `/crm/contacts`) to `index.html` so React Router handles routing client-side                                |

---

### 1.2 Add `src/env.d.ts` to each package

This gives TypeScript type safety for your environment variables.

```ts
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SHELL_URL?: string;
  readonly VITE_SHARED_UI_URL?: string;
  readonly VITE_REMOTE_CRM_URL?: string;
  readonly VITE_REMOTE_ADMIN_URL?: string;
  readonly VITE_REMOTE_SALES_URL?: string;
  readonly VITE_API_BASE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

> Only declare the variables that each specific package actually uses.

---

### 1.3 Update `vite.config.ts` — replace hardcoded localhost URLs

Remote URLs are baked into `remoteEntry.js` at build time. In production the localhost URLs would be wrong. Use environment variables with localhost fallbacks so local dev still works.

```ts
// Before (breaks in production)
remotes: {
  shell: 'http://localhost:3000/assets/remoteEntry.js',
  sharedUi: 'http://localhost:3005/assets/remoteEntry.js',
}

// After (works in both local dev and production)
remotes: {
  shell: env.VITE_SHELL_URL || 'http://localhost:3000/assets/remoteEntry.js',
  sharedUi: env.VITE_SHARED_UI_URL || 'http://localhost:3005/assets/remoteEntry.js',
}
```

To read env vars inside `vite.config.ts`, use the factory function pattern:

```ts
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      federation({
        remotes: {
          shell: env.VITE_SHELL_URL || 'http://localhost:3000/assets/remoteEntry.js',
        },
        // ...
      }),
    ],
    build: { target: 'esnext' },
  };
});
```

---

### 1.4 Push to GitHub

```bash
git add .
git commit -m "add vercel deployment config"
git push origin main
```

Make sure the repository is either **public**, or the **Vercel GitHub App** is installed and has access to it (GitHub → Settings → Applications → Vercel → Configure → select the repo).

---

## Part 2 — Deploy via Vercel Dashboard (Recommended)

This is the fully manual, no-CLI approach.

---

### Step 1 — Decide your project names upfront

Choose names before doing anything else. These names become your permanent URLs and you will use them in env vars.

| Package      | Suggested project name | Production URL                   |
| ------------ | ---------------------- | -------------------------------- |
| shell        | `my-app-shell`         | `my-app-shell.vercel.app`        |
| shared-ui    | `my-app-shared-ui`     | `my-app-shared-ui.vercel.app`    |
| remote-crm   | `my-app-remote-crm`    | `my-app-remote-crm.vercel.app`   |
| remote-admin | `my-app-remote-admin`  | `my-app-remote-admin.vercel.app` |
| remote-sales | `my-app-remote-sales`  | `my-app-remote-sales.vercel.app` |

> The stable URL format is always: `[project-name].vercel.app`

---

### Step 2 — Create one Vercel project per package

You will repeat this process **once for every package** (5 times for a 5-package monorepo).

1. Go to [vercel.com](https://vercel.com) → click **Add New → Project**
2. Click **Import Git Repository** → select your GitHub repo
3. On the configuration screen:
   - **Project Name**: type the project name (e.g. `my-app-shared-ui`)
   - **Framework Preset**: leave as Vite (auto-detected) or Other
   - **Root Directory**: click **Edit** → type the package path (e.g. `packages/shared-ui`)
4. Click **Deploy**

Repeat for all 5 packages, changing the Project Name and Root Directory each time:

| Import # | Project Name          | Root Directory          |
| -------- | --------------------- | ----------------------- |
| 1        | `my-app-shared-ui`    | `packages/shared-ui`    |
| 2        | `my-app-remote-crm`   | `packages/remote-crm`   |
| 3        | `my-app-remote-admin` | `packages/remote-admin` |
| 4        | `my-app-remote-sales` | `packages/remote-sales` |
| 5        | `my-app-shell`        | `packages/shell`        |

> The first build will likely fail — that is expected. You set env vars in the next step, then redeploy.

---

### Step 3 — Set environment variables (BEFORE final deploy)

Go to each project → **Settings → Environment Variables**.
Add each variable for the **Production** environment.

#### `my-app-shell`

| Variable                | Value                                                          |
| ----------------------- | -------------------------------------------------------------- |
| `VITE_SHARED_UI_URL`    | `https://my-app-shared-ui.vercel.app/assets/remoteEntry.js`    |
| `VITE_REMOTE_CRM_URL`   | `https://my-app-remote-crm.vercel.app/assets/remoteEntry.js`   |
| `VITE_REMOTE_ADMIN_URL` | `https://my-app-remote-admin.vercel.app/assets/remoteEntry.js` |
| `VITE_REMOTE_SALES_URL` | `https://my-app-remote-sales.vercel.app/assets/remoteEntry.js` |
| `VITE_API_BASE_URL`     | `https://your-api-domain.com/api/v1`                           |

#### `my-app-shared-ui`

| Variable         | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| `VITE_SHELL_URL` | `https://my-app-shell.vercel.app/assets/remoteEntry.js` |

#### `my-app-remote-crm` / `my-app-remote-admin` / `my-app-remote-sales`

| Variable             | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| `VITE_SHELL_URL`     | `https://my-app-shell.vercel.app/assets/remoteEntry.js`     |
| `VITE_SHARED_UI_URL` | `https://my-app-shared-ui.vercel.app/assets/remoteEntry.js` |

---

### Step 4 — Verify Build and Deployment settings

For each project go to **Settings → Build and Deployment** and confirm:

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Build Command    | `NODE_OPTIONS='--max-old-space-size=3072' pnpm --filter [name] build` |
| Output Directory | `dist`                                                                |
| Install Command  | `pnpm install --frozen-lockfile`                                      |
| Root Directory   | `packages/[name]`                                                     |
| Node.js Version  | `20.x`                                                                |

> If the Override toggle is ON, the dashboard values take precedence over `vercel.json`.
> If Override is OFF, the values from `vercel.json` are used automatically.

---

### Step 5 — Redeploy in order

After setting all env vars, redeploy in this order (remotes first, shell last):

1. `my-app-shared-ui` → Deployments → Redeploy
2. `my-app-remote-crm` → Deployments → Redeploy
3. `my-app-remote-admin` → Deployments → Redeploy
4. `my-app-remote-sales` → Deployments → Redeploy
5. `my-app-shell` → Deployments → Redeploy

**Why this order?** The shell's build bakes in the remote URLs. If remotes aren't built yet, the shell would point to non-existent files.

---

### Step 6 — Verify all deployments

Open your terminal and run:

```bash
curl -I https://my-app-shared-ui.vercel.app/assets/remoteEntry.js
curl -I https://my-app-remote-crm.vercel.app/assets/remoteEntry.js
curl -I https://my-app-remote-admin.vercel.app/assets/remoteEntry.js
curl -I https://my-app-remote-sales.vercel.app/assets/remoteEntry.js
curl -I https://my-app-shell.vercel.app
```

Every line should return `HTTP/2 200`. Then open `https://my-app-shell.vercel.app` in your browser.

---

## Part 3 — Deploy via CLI (Alternative)

This method uses the `vercel` CLI instead of the dashboard. Useful if you prefer the terminal.

### Install and log in

```bash
npm install -g vercel
vercel login
```

### What `vercel link` does

```bash
cd packages/shared-ui
vercel link --yes --project my-app-shared-ui
```

This creates a `.vercel/project.json` file inside the current folder:

```json
{
  "orgId": "team_xxx",
  "projectId": "prj_xxx"
}
```

It tells the CLI: _"when I run `vercel --prod` from this folder, deploy to the project named `my-app-shared-ui`"_.

It is the CLI equivalent of: Create project in dashboard → set Root Directory → done.

### Link all packages

Run from the repo root:

```bash
cd packages/shared-ui   && vercel link --yes --project my-app-shared-ui   && cd ../..
cd packages/remote-crm  && vercel link --yes --project my-app-remote-crm  && cd ../..
cd packages/remote-admin && vercel link --yes --project my-app-remote-admin && cd ../..
cd packages/remote-sales && vercel link --yes --project my-app-remote-sales && cd ../..
cd packages/shell        && vercel link --yes --project my-app-shell        && cd ../..
```

### Set env vars (same as dashboard method, Step 3)

Set all env vars in the Vercel dashboard before deploying.

### Deploy

```bash
# Do NOT use the CLI to deploy with Git integration active
# Just push to GitHub instead:
git push origin main
```

> Note: If you use Git integration (recommended), just `git push` and Vercel builds automatically. The CLI deploy (`vercel --prod`) is only for deployments without a connected GitHub repo.

---

## Part 4 — How Environment Variables Wire the Federation

### The problem

Module Federation works by each remote exposing a `remoteEntry.js` file. The shell imports this file at **runtime in the browser**. The URL to this file must be correct.

During the build, Vite replaces `import.meta.env.VITE_SHARED_UI_URL` with the actual value. So the URL gets **baked into the built JavaScript files**. If the env var is wrong or missing at build time, the wrong URL ends up in production.

### The flow

```
1. You set VITE_SHARED_UI_URL = https://my-app-shared-ui.vercel.app/assets/remoteEntry.js
         ↓
2. Vercel builds the shell — vite.config.ts reads the env var
         ↓
3. Built shell code contains:
   import('https://my-app-shared-ui.vercel.app/assets/remoteEntry.js')
         ↓
4. User opens the app in browser
         ↓
5. Browser fetches remoteEntry.js from shared-ui's Vercel URL (cross-origin)
         ↓
6. CORS headers (Access-Control-Allow-Origin: *) allow this to succeed
         ↓
7. remoteEntry.js tells browser where to find the Sidebar, TopBar, etc. chunks
         ↓
8. Browser downloads and runs those chunks
         ↓
9. Shell renders Sidebar as if it was part of shell's own code
```

### Why set env vars before deploying?

If you set them after:

- The already-built `remoteEntry.js` still has the old (wrong) URLs
- You must redeploy every package that has incorrect URLs
- This is why env vars are set first, then deploy

### The stable project alias URL

Always use `[project-name].vercel.app` in your env vars — **never** use the hashed deployment URL like `my-app-shared-ui-abc123xyz.vercel.app`. The hashed URL changes with every deployment. The alias URL is permanent.

---

## Part 5 — Common Errors and Fixes

### `SIGKILL` — build process killed

**Cause:** Node.js ran out of memory (Vercel hobby plan has 1 GB limit).

**Fix:** Add memory flag to `buildCommand` in `vercel.json`:

```
NODE_OPTIONS='--max-old-space-size=3072' pnpm --filter [name] build
```

---

### `ERR_PNPM_NO_PKG_MANIFEST No package.json found in /`

**Cause:** The install/build command has `cd ../..` but Vercel Git integration already runs commands from the repo root. `cd ../..` goes above the repo to `/`.

**Fix:** Remove `cd ../..` from both commands:

```
# Wrong
"installCommand": "cd ../.. && pnpm install --frozen-lockfile"

# Correct
"installCommand": "pnpm install --frozen-lockfile"
```

---

### `HTTP 500` error cloning the repository

**Cause:** Vercel's build servers cannot access your private GitHub repository.

**Fix option 1:** Make the repo public on GitHub → Settings → Change visibility → Make public.

**Fix option 2:** Install the Vercel GitHub App on the account/organisation that owns the repo:
GitHub → Settings → Applications → Vercel → Configure → add the repo.

---

### `not a member of the team` email from Vercel

**Cause:** The git commit author email doesn't match any Vercel team member's email.

**Fix:** Set your git config to use your GitHub account email:

```bash
git config --global user.email "your-github-email@example.com"
git config --global user.name "your-github-username"
```

Then make a new commit and push.

---

### Federation CORS error in browser console

```
Access to script at 'https://remote.vercel.app/assets/remoteEntry.js'
from origin 'https://shell.vercel.app' has been blocked by CORS policy
```

**Cause:** The remote's `vercel.json` is missing the CORS headers.

**Fix:** Add to each remote's `vercel.json`:

```json
"headers": [
  {
    "source": "/assets/(.*)",
    "headers": [{ "key": "Access-Control-Allow-Origin", "value": "*" }]
  }
]
```

---

### App loads but still uses localhost remote URLs

**Cause:** Env vars were set after the build ran, or the wrong deployment was promoted.

**Fix:** Set env vars → Redeploy. Check DevTools → Network tab to confirm `remoteEntry.js` loads from `vercel.app` URLs, not `localhost`.

---

### Page shows blank / 404 on refresh (shell only)

**Cause:** Shell `vercel.json` is missing the `rewrites` block for SPA routing.

**Fix:** Add to shell's `vercel.json`:

```json
"rewrites": [
  { "source": "/((?!assets/).*)", "destination": "/index.html" }
]
```

---

## Part 6 — Quick Checklist

Use this checklist every time you deploy a new microfrontend monorepo.

### Before you touch Vercel

- [ ] `vercel.json` exists in every package with correct `--filter [name]` in `buildCommand`
- [ ] Shell's `vercel.json` has the `rewrites` block
- [ ] All packages have `src/env.d.ts` with `ImportMetaEnv` declarations
- [ ] All `vite.config.ts` remote URLs use `env.VITE_*_URL || 'http://localhost:PORT/...'`
- [ ] Code is pushed to GitHub
- [ ] Project names are decided upfront (you need the final URLs before setting env vars)

### In Vercel dashboard

- [ ] One project created per package with correct Root Directory
- [ ] Node.js version set to `20.x` for each project
- [ ] All env vars set to **Production** environment BEFORE redeploying
- [ ] Env vars use stable alias URLs (`[name].vercel.app`) not hashed deployment URLs

### After deploying

- [ ] All `curl -I [url]/assets/remoteEntry.js` return `HTTP/2 200`
- [ ] Shell URL opens the app in browser
- [ ] DevTools → Network → `remoteEntry.js` loaded from Vercel URLs (not localhost)
- [ ] DevTools → Console → zero federation errors

---

_Guide written May 2026 — based on OctoHealth MFE v2 deployment_
_Stack: pnpm workspaces · Vite · @originjs/vite-plugin-federation · React 19 · Vercel Hobby plan_
