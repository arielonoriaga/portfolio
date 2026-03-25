# Deployment Guide

Complete instructions for deploying Ariel's portfolio to production.

## 🚀 Quick Start

### 1. Initialize Git Repository

```bash
cd ~/clawd/portfolio

# Initialize git (if not already done)
git init
git config user.name "arielonoriaga"
git config user.email "onoriagaariel@gmail.com"

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Portfolio website built with Astro 5, SolidJS, Three.js"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/arielonoriaga/portfolio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Configure GitHub Secrets

For automated CI/CD via GitHub Actions, add these secrets in GitHub Settings → Secrets and variables → Actions:

```
DEPLOY_HOST      : 217.196.62.243 (or your VPS IP)
DEPLOY_USER      : root
DEPLOY_KEY       : (SSH private key content)
```

#### Generate SSH Key for Deployment

```bash
# Generate a new SSH key (no passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy -N ""

# Copy the private key to GitHub Secrets
cat ~/.ssh/portfolio_deploy

# Copy the public key to your VPS
cat ~/.ssh/portfolio_deploy.pub

# On VPS, add to authorized_keys:
echo "$(cat ~/.ssh/portfolio_deploy.pub)" >> ~/.ssh/authorized_keys
```

### 3. Server Setup (VPS)

SSH into your server and prepare deployment environment:

```bash
# Connect to VPS
ssh root@217.196.62.243

# Install Docker (if not present)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install -y docker-compose

# Create deployment directory
mkdir -p ~/portfolio
cd ~/portfolio

# Initialize git repo for deployment
git init
git remote add origin https://github.com/arielonoriaga/portfolio.git
```

### 4. Deploy via GitHub Actions

Simply push to the `main` branch:

```bash
cd ~/clawd/portfolio

# Make a change
echo "# Updated" >> README.md

# Commit and push
git add .
git commit -m "Update: Deployment ready"
git push origin main

# GitHub Actions will automatically:
# 1. Install dependencies
# 2. Build the project
# 3. Create Docker image
# 4. SSH into VPS and deploy
```

#### Monitor Deployment

Go to GitHub → Actions to watch the workflow run:
- ✅ Install dependencies
- ✅ Build project
- ✅ Check build output
- ✅ Build Docker image
- ✅ Deploy to server

---

## 🔧 Manual Deployment (Without GitHub Actions)

If you prefer manual deployment:

### Build Locally

```bash
cd ~/clawd/portfolio

# Build
bun run build

# Test the build
bun run preview
# Visit http://localhost:3000
```

### Deploy to Server

```bash
# Build Docker image locally
docker build -t portfolio:latest .

# Or use docker-compose
docker compose build

# Push to server
docker compose up -d

# Verify
docker compose ps
curl http://localhost:3000
```

---

## 🌐 Reverse Proxy Setup (Traefik)

If you're using Traefik as a reverse proxy on your VPS:

### 1. Update docker-compose.yml

```yaml
version: '3.9'

services:
  portfolio:
    container_name: ariel-portfolio
    build:
      context: .
      dockerfile: Dockerfile
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - traefik-network
    labels:
      - traefik.enable=true
      - traefik.http.routers.portfolio.rule=Host(`arielonoriaga.huggian.com`)
      - traefik.http.routers.portfolio.entrypoints=websecure
      - traefik.http.routers.portfolio.tls.certresolver=letsencrypt
      - traefik.http.services.portfolio.loadbalancer.server.port=3000
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

networks:
  traefik-network:
    external: true
```

### 2. Deploy with Traefik

```bash
# On VPS, ensure Traefik network exists
docker network create traefik-network

# Deploy
docker compose up -d

# Traefik will automatically provision SSL cert and route traffic
```

---

## 📊 Monitoring

### Check Logs

```bash
# Local dev
bun run dev

# Docker logs
docker compose logs -f portfolio

# On server
ssh root@217.196.62.243
docker compose logs -f portfolio
```

### Performance Checks

```bash
# Check build size
du -sh dist/

# Check deployment
curl -I https://arielonoriaga.huggian.com

# Lighthouse audit
npm install -g lighthouse
lighthouse https://arielonoriaga.huggian.com --chrome-flags="--headless" --output-path=./report.html
```

---

## 🔄 Continuous Deployment

### Auto-deploy on Push

The `.github/workflows/deploy.yml` is configured to:

1. **Trigger**: Every push to `main` branch
2. **Steps**:
   - Checkout code
   - Install Bun + dependencies
   - Build project
   - Build Docker image
   - SSH deploy to VPS
   - Run `docker compose up -d` on server

### Manual Trigger

If you want to manually trigger a deployment:

```bash
# On GitHub: Actions tab → Click "Build & Deploy" → "Run workflow"
```

---

## 🚨 Troubleshooting

### Build Fails Locally

```bash
# Clean and rebuild
rm -rf node_modules dist .astro
bun install
bun run build
```

### Docker Container Won't Start

```bash
# Check logs
docker compose logs portfolio

# Rebuild
docker compose down
docker compose build --no-cache
docker compose up -d
```

### SSH Deployment Fails

```bash
# Test SSH connection
ssh -i ~/.ssh/portfolio_deploy root@217.196.62.243

# Verify public key on server
cat ~/.ssh/authorized_keys | grep "$(cat ~/.ssh/portfolio_deploy.pub)"
```

### HTTPS Certificate Issues

```bash
# On server with Traefik, check certs
docker exec traefik ls -la /letsencrypt/

# Traefik should auto-renew, but restart if needed
docker compose restart traefik
```

---

## 📝 Deployment Checklist

- [ ] Git repo initialized and pushed to GitHub
- [ ] GitHub Secrets configured (DEPLOY_HOST, DEPLOY_USER, DEPLOY_KEY)
- [ ] VPS has Docker + Docker Compose installed
- [ ] SSH key pair generated and added to authorized_keys
- [ ] `.github/workflows/deploy.yml` is present
- [ ] First push to `main` triggers automatic deployment
- [ ] Portfolio is live at https://arielonoriaga.huggian.com
- [ ] Lighthouse score 95+ for Performance
- [ ] No console errors in browser DevTools

---

## 📧 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/arielonoriaga/portfolio/issues)
- Email: [onoriagaariel@gmail.com](mailto:onoriagaariel@gmail.com)

---

**Deployment by**: Huggian AI | **Last Updated**: 2024
