# Microfrontend Monorepo — Docker & Cloud Deployment Guide

> How to containerise and deploy your pnpm monorepo MFE to AWS, Azure, or DigitalOcean.
> This guide shows you what to do — not a step-by-step automation.

---

## Table of Contents

1. [How It Works](#how-it-works)
2. [Part 1 — Dockerise Each Package](#part-1--dockerise-each-package)
3. [Part 2 — Test Locally with Docker Compose](#part-2--test-locally-with-docker-compose)
4. [Part 3 — Deploy to AWS](#part-3--deploy-to-aws)
5. [Part 4 — Deploy to Azure](#part-4--deploy-to-azure)
6. [Part 5 — Deploy to DigitalOcean](#part-5--deploy-to-digitalocean)
7. [Part 6 — NGINX Configuration Explained](#part-6--nginx-configuration-explained)
8. [Part 7 — Environment Variables with Docker](#part-7--environment-variables-with-docker)
9. [Part 8 — Platform Comparison](#part-8--platform-comparison)

---

## How It Works

With Vercel, the platform handled hosting. With Docker you take over that responsibility:

```
Vercel approach:
  Code → Vercel builds it → Vercel serves it → Done

Docker approach:
  Code → You build it (Docker) → You push image to registry
       → Cloud platform runs the container → NGINX serves the files
```

Each package becomes a Docker image that contains:

- The built static files (`dist/` folder)
- An NGINX web server to serve those files

The flow for all 5 packages:

```
┌─────────────────────────────────────────────────────┐
│  Build stage (Node.js)                              │
│  pnpm install → pnpm --filter [name] build          │
│  Output: dist/ folder                               │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Serve stage (NGINX)                                │
│  Copy dist/ into NGINX container                    │
│  NGINX serves files on port 80                      │
│  CORS headers added for remoteEntry.js              │
└─────────────────────────────────────────────────────┘
```

---

## Part 1 — Dockerise Each Package

### 1.1 Create a Dockerfile in each package

Place this file at `packages/shared-ui/Dockerfile` (repeat for each package, changing the filter name).

```dockerfile
# ─── Stage 1: Build ───────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all packages (needed for workspace install)
COPY packages/ ./packages/

# Install all dependencies from repo root
RUN pnpm install --frozen-lockfile

# Build only this package
# Change --filter value to match each package name
ARG NODE_OPTIONS=--max-old-space-size=3072
RUN pnpm --filter shared-ui build

# ─── Stage 2: Serve ───────────────────────────────────────────────
FROM nginx:alpine AS server

# Copy built files into NGINX's serve directory
COPY --from=builder /app/packages/shared-ui/dist /usr/share/nginx/html

# Copy custom NGINX config (see Part 6)
COPY packages/shared-ui/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

> Change `--filter shared-ui` and the paths to match each package.

---

### 1.2 Create `nginx.conf` in each package

Place this at `packages/shared-ui/nginx.conf`.

#### For remotes (shared-ui, remote-crm, remote-admin, remote-sales)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # CORS + no-cache for remoteEntry.js
    location = /assets/remoteEntry.js {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # CORS + long-cache for hashed assets
    location /assets/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Handle OPTIONS preflight requests
    location / {
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            return 204;
        }
    }
}
```

#### For the shell only (add SPA routing)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing — send all non-asset URLs to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # CORS + no-cache for remoteEntry.js
    location = /assets/remoteEntry.js {
        add_header Access-Control-Allow-Origin *;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # CORS + long-cache for hashed assets
    location /assets/ {
        add_header Access-Control-Allow-Origin *;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

### 1.3 Add `.dockerignore` to the repo root

```
node_modules
**/node_modules
**/.vercel
**/.git
**/dist
```

---

### 1.4 Build each Docker image

Run from the **repo root** (not inside the package folder):

```bash
# Build each image — the context must be the repo root so Docker
# can access all packages for the workspace install

docker build -f packages/shared-ui/Dockerfile   -t my-app-shared-ui   .
docker build -f packages/remote-crm/Dockerfile  -t my-app-remote-crm  .
docker build -f packages/remote-admin/Dockerfile -t my-app-remote-admin .
docker build -f packages/remote-sales/Dockerfile -t my-app-remote-sales .
docker build -f packages/shell/Dockerfile        -t my-app-shell        .
```

> The `.` at the end is critical — it tells Docker the build context is the repo root.

---

### 1.5 Pass environment variables at build time

Remote URLs are baked into `remoteEntry.js` at build time, so you must pass them as Docker build arguments:

```dockerfile
# In Dockerfile, after ARG NODE_OPTIONS, add:
ARG VITE_SHELL_URL
ARG VITE_SHARED_UI_URL
ARG VITE_API_BASE_URL

ENV VITE_SHELL_URL=$VITE_SHELL_URL
ENV VITE_SHARED_UI_URL=$VITE_SHARED_UI_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
```

Then pass them when building:

```bash
docker build \
  --build-arg VITE_SHELL_URL=https://shell.yourdomain.com/assets/remoteEntry.js \
  --build-arg VITE_SHARED_UI_URL=https://shared-ui.yourdomain.com/assets/remoteEntry.js \
  -f packages/remote-crm/Dockerfile \
  -t my-app-remote-crm \
  .
```

---

## Part 2 — Test Locally with Docker Compose

Before pushing to any cloud, verify everything works locally with Docker Compose.

Create `docker-compose.yml` at the repo root:

```yaml
version: '3.8'

services:
  shared-ui:
    build:
      context: .
      dockerfile: packages/shared-ui/Dockerfile
      args:
        VITE_SHELL_URL: http://localhost:3000/assets/remoteEntry.js
    ports:
      - '3005:80'

  remote-crm:
    build:
      context: .
      dockerfile: packages/remote-crm/Dockerfile
      args:
        VITE_SHELL_URL: http://localhost:3000/assets/remoteEntry.js
        VITE_SHARED_UI_URL: http://localhost:3005/assets/remoteEntry.js
    ports:
      - '3001:80'

  remote-admin:
    build:
      context: .
      dockerfile: packages/remote-admin/Dockerfile
      args:
        VITE_SHELL_URL: http://localhost:3000/assets/remoteEntry.js
        VITE_SHARED_UI_URL: http://localhost:3005/assets/remoteEntry.js
    ports:
      - '3002:80'

  remote-sales:
    build:
      context: .
      dockerfile: packages/remote-sales/Dockerfile
      args:
        VITE_SHELL_URL: http://localhost:3000/assets/remoteEntry.js
        VITE_SHARED_UI_URL: http://localhost:3005/assets/remoteEntry.js
    ports:
      - '3003:80'

  shell:
    build:
      context: .
      dockerfile: packages/shell/Dockerfile
      args:
        VITE_SHARED_UI_URL: http://localhost:3005/assets/remoteEntry.js
        VITE_REMOTE_CRM_URL: http://localhost:3001/assets/remoteEntry.js
        VITE_REMOTE_ADMIN_URL: http://localhost:3002/assets/remoteEntry.js
        VITE_REMOTE_SALES_URL: http://localhost:3003/assets/remoteEntry.js
        VITE_API_BASE_URL: https://your-api.com/api/v1
    ports:
      - '3000:80'
    depends_on:
      - shared-ui
      - remote-crm
      - remote-admin
      - remote-sales
```

Run it:

```bash
docker-compose up --build
```

Open `http://localhost:3000` — you should see the login page.

---

## Part 3 — Deploy to AWS

AWS has multiple options. The two most practical for this use case:

---

### Option A — AWS ECS + ECR (Docker containers — recommended)

ECR = Elastic Container Registry (stores your Docker images)
ECS = Elastic Container Service (runs your Docker containers)

#### Step 1 — Create an ECR repository for each package

```
AWS Console → ECR → Create repository
```

Create 5 repositories:

- `my-app-shell`
- `my-app-shared-ui`
- `my-app-remote-crm`
- `my-app-remote-admin`
- `my-app-remote-sales`

#### Step 2 — Authenticate Docker with ECR

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### Step 3 — Build, tag, and push each image

```bash
# Example for shared-ui
docker build \
  --build-arg VITE_SHELL_URL=https://shell.yourdomain.com/assets/remoteEntry.js \
  -f packages/shared-ui/Dockerfile \
  -t my-app-shared-ui .

docker tag my-app-shared-ui \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/my-app-shared-ui:latest

docker push \
  YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/my-app-shared-ui:latest
```

Repeat for all 5 images.

#### Step 4 — Create ECS Cluster and Services

```
AWS Console → ECS → Create Cluster → (Fargate, serverless)
```

For each package:

1. Create a **Task Definition** — point to the ECR image, set port 80, memory 512MB
2. Create a **Service** — runs the task, attach a Load Balancer
3. The Load Balancer gives you a public URL for each service

#### Step 5 — Point a domain (optional)

Use **Route 53** or your own DNS provider to point subdomains to each Load Balancer:

- `shell.yourdomain.com` → shell Load Balancer
- `shared-ui.yourdomain.com` → shared-ui Load Balancer

---

### Option B — AWS S3 + CloudFront (static hosting — simpler, cheaper)

No Docker needed for this option. You build locally and upload the files directly.

#### Step 1 — Build each package locally

```bash
VITE_SHARED_UI_URL=https://... pnpm --filter shared-ui build
VITE_SHELL_URL=https://... pnpm --filter remote-crm build
# etc.
```

#### Step 2 — Create an S3 bucket per package

```
AWS Console → S3 → Create bucket
```

Settings:

- Uncheck "Block all public access"
- Enable "Static website hosting"
- Index document: `index.html`
- Error document: `index.html` (for shell SPA routing)

#### Step 3 — Upload dist/ files

```bash
aws s3 sync packages/shared-ui/dist s3://my-app-shared-ui --delete
aws s3 sync packages/shell/dist s3://my-app-shell --delete
# etc.
```

#### Step 4 — Create a CloudFront distribution per bucket

```
AWS Console → CloudFront → Create Distribution
```

- Origin: your S3 bucket
- Add CORS response headers policy
- For shell: add a custom error page (404 → index.html, 200) for SPA routing

CloudFront gives you a URL like `d1234abcd.cloudfront.net`. Point your domain to it via Route 53.

---

## Part 4 — Deploy to Azure

### Option A — Azure Container Apps (Docker — recommended)

Similar to AWS ECS but simpler to set up.

#### Step 1 — Create Azure Container Registry (ACR)

```
Azure Portal → Container Registries → Create
```

Name it something like `myappregistry`.

#### Step 2 — Push images to ACR

```bash
# Login
az acr login --name myappregistry

# Build and push
docker build -f packages/shared-ui/Dockerfile -t myappregistry.azurecr.io/shared-ui:latest .
docker push myappregistry.azurecr.io/shared-ui:latest

# Repeat for each package
```

#### Step 3 — Create Container Apps

```
Azure Portal → Container Apps → Create Container App
```

For each package:

1. Select your ACR image
2. Set port to 80
3. Enable **ingress** (HTTP traffic from internet)
4. Azure gives you a URL like `shared-ui.nicename.azurecontainerapps.io`

Use those URLs as your env vars when building the shell image.

---

### Option B — Azure Static Web Apps (no Docker — simpler)

Best for purely static microfrontends with no server-side logic.

#### Step 1 — Create a Static Web App per package

```
Azure Portal → Static Web Apps → Create
```

Connect to your GitHub repo and set:

- **App location**: `packages/shared-ui`
- **Output location**: `dist`
- **Build command**: `pnpm --filter shared-ui build`

Azure automatically creates a GitHub Actions workflow that builds and deploys on every push.

#### Step 2 — Set environment variables

```
Azure Portal → your Static Web App → Configuration → Application settings
```

Add `VITE_SHELL_URL`, `VITE_SHARED_UI_URL`, etc.

#### Step 3 — Add CORS headers

Azure Static Web Apps uses a `staticwebapp.config.json` file instead of `vercel.json`.
Place this in `packages/shared-ui/staticwebapp.config.json`:

```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "*"
  },
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*"]
  }
}
```

---

## Part 5 — Deploy to DigitalOcean

DigitalOcean is the simplest of the three for Docker deployments.

### Option A — App Platform (recommended — no server management)

This is DigitalOcean's equivalent of Vercel/Heroku.

#### Step 1 — Push your code to GitHub (already done)

#### Step 2 — Create an App

```
DigitalOcean Console → App Platform → Create App
```

Connect your GitHub repo. For each component:

- **Type**: Web Service
- **Source directory**: `packages/shared-ui`
- **Dockerfile path**: `packages/shared-ui/Dockerfile`
- **HTTP port**: 80

#### Step 3 — Add environment variables

In the App Platform settings for each component, add your `VITE_*` build-time env vars.

#### Step 4 — Deploy

DigitalOcean builds the Docker image and deploys it. Each component gets a URL.

---

### Option B — Droplet with Docker Compose (full control)

A Droplet is a virtual machine. You SSH in and run Docker Compose yourself.

#### Step 1 — Create a Droplet

```
DigitalOcean → Droplets → Create
```

- Choose: Ubuntu 22.04
- Size: at least 2GB RAM (building is memory-intensive)
- Enable SSH access

#### Step 2 — Install Docker on the Droplet

```bash
ssh root@YOUR_DROPLET_IP

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose
apt-get install docker-compose-plugin
```

#### Step 3 — Copy your project to the Droplet

```bash
# From your local machine
scp -r /Users/lfz-stanley/projects/octosoft/octohealth-mfe-v2 root@YOUR_DROPLET_IP:/app
```

Or clone from GitHub directly on the Droplet:

```bash
git clone https://github.com/stanzealot/octohealth-mfe-v2 /app
```

#### Step 4 — Create a production `.env` file on the Droplet

```bash
# On the Droplet
nano /app/.env
```

```env
VITE_SHELL_URL=http://YOUR_DROPLET_IP:3000/assets/remoteEntry.js
VITE_SHARED_UI_URL=http://YOUR_DROPLET_IP:3005/assets/remoteEntry.js
VITE_REMOTE_CRM_URL=http://YOUR_DROPLET_IP:3001/assets/remoteEntry.js
VITE_API_BASE_URL=https://your-api.com/api/v1
```

#### Step 5 — Run Docker Compose

```bash
cd /app
docker-compose --env-file .env up --build -d
```

The `-d` flag runs it in the background. Your app is now at `http://YOUR_DROPLET_IP:3000`.

#### Step 6 — Point a domain (optional)

Use DigitalOcean's **Managed DNS** or any DNS provider to point your domain to the Droplet's IP. Then install **Certbot** for HTTPS.

---

## Part 6 — NGINX Configuration Explained

NGINX is the web server inside each Docker container. Here's what each directive does:

```nginx
server {
    listen 80;
    # Listen on port 80 (HTTP)

    root /usr/share/nginx/html;
    # Where the built files are stored

    index index.html;
    # Default file to serve

    location / {
        try_files $uri $uri/ /index.html;
        # SHELL ONLY: try the exact file, then a folder,
        # then fall back to index.html (for React Router)
        # Without this, refreshing /crm/contacts gives a 404
    }

    location = /assets/remoteEntry.js {
        add_header Access-Control-Allow-Origin *;
        # Allow any domain to fetch this file (required for federation)

        add_header Cache-Control "public, max-age=0, must-revalidate";
        # Never cache remoteEntry.js — always fetch the latest version
        # Critical: if cached, new deployments won't be picked up
    }

    location /assets/ {
        add_header Access-Control-Allow-Origin *;

        add_header Cache-Control "public, max-age=31536000, immutable";
        # Cache all other assets for 1 year
        # Safe because Vite adds a content hash to filenames
        # e.g. main.a3f8d2.js — if content changes, filename changes
    }
}
```

---

## Part 7 — Environment Variables with Docker

### The key difference from Vercel

With Vercel, env vars are set in the dashboard and Vercel injects them automatically. With Docker, **you are responsible** for passing env vars at build time.

### Why build time and not runtime?

Vite replaces `import.meta.env.VITE_*` with the actual values when it builds. The final JavaScript files contain the literal URL strings. The running container has no way to change them.

```
WRONG APPROACH:
  Build image → Run container → Set env var → Nothing changes
  (The JS files are already built with old values)

CORRECT APPROACH:
  Set env var → Build image → Push image → Run container
```

### Practical consequence

You need a separate Docker image for each environment (staging, production). Or use build arguments to parametrise the build:

```bash
# Build for staging
docker build \
  --build-arg VITE_SHELL_URL=https://staging-shell.yourdomain.com/assets/remoteEntry.js \
  -t my-app-shell:staging .

# Build for production
docker build \
  --build-arg VITE_SHELL_URL=https://shell.yourdomain.com/assets/remoteEntry.js \
  -t my-app-shell:production .
```

### Build order matters

Always build and deploy remotes before shell:

```bash
# 1. Build remotes first
docker build ... -t my-app-shared-ui .
docker build ... -t my-app-remote-crm .
docker build ... -t my-app-remote-admin .
docker build ... -t my-app-remote-sales .

# 2. Build shell last (after remotes are live and URLs are confirmed)
docker build \
  --build-arg VITE_SHARED_UI_URL=https://shared-ui.live-url.com/assets/remoteEntry.js \
  ... -t my-app-shell .
```

---

## Part 8 — Platform Comparison

| Feature                | Vercel               | AWS (ECS+ECR)       | Azure Container Apps  | DigitalOcean App Platform |
| ---------------------- | -------------------- | ------------------- | --------------------- | ------------------------- |
| Setup complexity       | ⭐ Easiest           | ⭐⭐⭐⭐ Complex    | ⭐⭐⭐ Moderate       | ⭐⭐ Simple               |
| Cost (small project)   | Free (hobby)         | ~$30–80/month       | ~$20–60/month         | ~$12–25/month             |
| Auto deploy on push    | ✅ Built in          | ✅ via CodePipeline | ✅ via GitHub Actions | ✅ Built in               |
| Custom domains + HTTPS | ✅ Free              | ✅ Extra setup      | ✅ Extra setup        | ✅ Built in               |
| Docker required        | ❌ No                | ✅ Yes              | ✅ Yes                | Optional                  |
| Best for               | Prototypes, startups | Enterprise, scale   | Microsoft ecosystem   | Simple, affordable        |

### Recommendation

| Situation                                   | Best choice                                           |
| ------------------------------------------- | ----------------------------------------------------- |
| Fastest to deploy, no DevOps experience     | **Vercel**                                            |
| Need Docker, want simplicity                | **DigitalOcean App Platform**                         |
| Full control, self-managed server           | **DigitalOcean Droplet** with Docker Compose          |
| Microsoft/Azure organisation                | **Azure Static Web Apps** or **Azure Container Apps** |
| Large scale, enterprise, AWS already in use | **AWS ECS + ECR**                                     |

---

## Files to Create Per Package (Summary)

```
packages/
  shared-ui/
    Dockerfile          ← Multi-stage build (Node → NGINX)
    nginx.conf          ← CORS headers, no SPA rewrite
  remote-crm/
    Dockerfile
    nginx.conf
  remote-admin/
    Dockerfile
    nginx.conf
  remote-sales/
    Dockerfile
    nginx.conf
  shell/
    Dockerfile
    nginx.conf          ← Same but WITH try_files for SPA routing

docker-compose.yml      ← Root level, for local testing
.dockerignore           ← Root level, excludes node_modules etc.
```

---

_Guide written May 2026_
_Stack: pnpm workspaces · Vite · Module Federation · React 19 · NGINX · Docker_
