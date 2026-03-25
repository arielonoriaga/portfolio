# Setup & Deployment Checklist

Use this checklist to ensure everything is configured for production deployment.

## ✅ Local Development

### Prerequisites
- [x] Bun v1.0+ installed
- [x] Node.js v22+ installed
- [x] Git initialized
- [x] Package dependencies installed

### Verify Local Development
```bash
cd ~/clawd/portfolio

# Start dev server
bun run dev
# ✓ Server runs at http://localhost:3000
# ✓ HMR (hot reload) working
# ✓ 3D particles rendering
# ✓ Skills grid interactive
# ✓ Project cards responsive

# Run production build
bun run build
# ✓ No TypeScript errors
# ✓ dist/ directory created
# ✓ All assets optimized

# Preview production build
bun run preview
# ✓ Static site served
# ✓ All pages load correctly
# ✓ 3D components functional
```

---

## ✅ Docker Setup

### Build & Test Locally
```bash
# Build Docker image
docker build -t portfolio:latest .
# ✓ Build completes without errors
# ✓ Multi-stage build optimizes image

# Run with docker-compose
docker compose up -d
# ✓ Container starts
# ✓ Health check passes
# ✓ Port 3000 accessible

# Verify
docker compose logs portfolio
curl http://localhost:3000
# ✓ Server responds
# ✓ HTML rendered correctly

# Cleanup
docker compose down
# ✓ Containers removed
# ✓ Volumes cleaned
```

---

## ✅ Git Repository

### Initialize & Commit
```bash
cd ~/clawd/portfolio

# Verify git status
git status
# ✓ All files tracked
# ✓ No untracked files

# View commit
git log --oneline
# ✓ Initial commit present

# Check remotes
git remote -v
# Next: Add GitHub remote
```

### Push to GitHub
```bash
# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/arielonoriaga/portfolio.git

# Verify remote
git remote -v
# ✓ Origin configured

# Push to GitHub
git branch -M main
git push -u origin main
# ✓ Repository on GitHub
# ✓ Main branch pushed
```

---

## ✅ GitHub Configuration

### Secrets for CI/CD
Set in GitHub Settings → Secrets and variables → Actions:

```
☐ DEPLOY_HOST      = 217.196.62.243
☐ DEPLOY_USER      = root
☐ DEPLOY_KEY       = <ssh-private-key>
```

**To create deploy key:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy -N ""

# Get private key (for GitHub Secret)
cat ~/.ssh/portfolio_deploy

# Get public key (for server)
cat ~/.ssh/portfolio_deploy.pub
```

### Workflow Verification
- [ ] `.github/workflows/deploy.yml` is present
- [ ] Workflow file has no syntax errors
- [ ] Workflow triggers on push to `main`
- [ ] All steps are properly defined

---

## ✅ Server Preparation

### SSH & Authentication
```bash
# Test SSH connection
ssh -i ~/.ssh/portfolio_deploy root@217.196.62.243
# ✓ Connection successful
# ✓ No passphrase required

# Add public key to authorized_keys
echo "$(cat ~/.ssh/portfolio_deploy.pub)" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
# ✓ Key added

# Exit server
exit
```

### Install Docker
```bash
# Connect to server
ssh root@217.196.62.243

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install -y docker-compose
# ✓ Docker installed
# ✓ Docker Compose installed

# Verify installation
docker --version
docker compose --version

# Exit
exit
```

### Create Deployment Directory
```bash
# On server
ssh root@217.196.62.243

# Create directory
mkdir -p ~/portfolio
cd ~/portfolio

# Initialize git repo
git init
git remote add origin https://github.com/arielonoriaga/portfolio.git

# Exit
exit
```

---

## ✅ Network & DNS

### Domain Configuration
- [ ] Domain: `arielonoriaga.huggian.com`
- [ ] DNS A record points to VPS: `217.196.62.243`
- [ ] DNS propagation verified (check with `dig` or `nslookup`)

```bash
# Verify DNS
dig arielonoriaga.huggian.com
# ✓ A record resolves to VPS IP
```

### SSL/TLS Certificate
If using Traefik:
- [ ] Traefik configured on server
- [ ] Let's Encrypt integration enabled
- [ ] Certificate resolver set to `letsencrypt`

---

## ✅ Final Deployment

### Trigger First Deployment
```bash
# Make a small change (optional)
echo "# Deployment test" >> README.md

# Commit
git add .
git commit -m "Ready for deployment"

# Push to main (triggers CI/CD)
git push origin main
```

### Monitor Deployment
1. Go to GitHub → Actions
2. Watch the "Build & Deploy" workflow
3. Verify all steps complete:
   - ✓ Checkout code
   - ✓ Setup Bun
   - ✓ Install dependencies
   - ✓ Build project
   - ✓ Type check
   - ✓ Build Docker image
   - ✓ Deploy via SSH

### Verify Live Deployment
```bash
# Check if site is live
curl -I https://arielonoriaga.huggian.com
# ✓ HTTP 200 response
# ✓ SSL certificate valid

# Open in browser
# ✓ Portfolio loads
# ✓ 3D particles render
# ✓ All sections interactive

# Check server status
ssh root@217.196.62.243
docker compose ps
# ✓ Container running
# ✓ Health check passing

# View logs (if needed)
docker compose logs portfolio
exit
```

---

## ✅ Post-Deployment Testing

### Browser Testing
- [ ] Portfolio loads at https://arielonoriaga.huggian.com
- [ ] Hero section with 3D particles renders
- [ ] Skills grid interactive
- [ ] Project cards 3D effects work
- [ ] All links functional
- [ ] Mobile responsive (iPhone, iPad, Android)
- [ ] Desktop responsive (1920px, 1440px, 1024px)

### Performance Testing
```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://arielonoriaga.huggian.com

# Should get:
# ✓ Performance: 95+
# ✓ Accessibility: 95+
# ✓ Best Practices: 95+
# ✓ SEO: 100

# Page load time
# ✓ < 1 second on 4G
# ✓ < 0.5 second on LTE
```

### Browser DevTools
- [ ] No console errors
- [ ] No console warnings (except node_modules)
- [ ] Network requests < 1MB total
- [ ] No layout shift (CLS)

---

## ✅ Maintenance

### Regular Updates
- [ ] Monthly: Check for security updates
  ```bash
  cd ~/clawd/portfolio
  bun update
  ```

- [ ] Monthly: Rebuild Docker image for security patches
  ```bash
  docker compose build --no-cache
  docker compose up -d
  ```

### Monitoring
```bash
# Check container health
ssh root@217.196.62.243
docker compose ps
# ✓ STATUS column shows "Up (healthy)"

# Check logs for errors
docker compose logs portfolio | tail -50

# Check disk space
df -h
# ✓ Sufficient disk available

exit
```

### Backup
```bash
# Backup portfolio code
cd ~/clawd
tar -czf portfolio_backup_$(date +%Y%m%d).tar.gz portfolio/

# Backup on server (optional)
ssh root@217.196.62.243
cd ~
tar -czf portfolio_backup_$(date +%Y%m%d).tar.gz portfolio/
exit
```

---

## 📋 Pre-Launch Verification

### Code Quality
- [x] No TypeScript errors
- [x] No unused imports
- [x] No console logs (except intentional)
- [x] All components functional
- [x] Git initialized & committed

### Performance
- [x] Build size optimized (~1.1 MB)
- [x] Static generation enabled
- [x] Minimal JavaScript
- [x] 3D animations smooth (60fps target)

### Deployment
- [x] Docker image builds successfully
- [x] docker-compose.yml configured
- [x] GitHub Actions workflow defined
- [x] Health checks in place
- [x] Non-root Docker user

### Documentation
- [x] README.md complete
- [x] DEPLOY.md comprehensive
- [x] PROJECT_SUMMARY.md detailed
- [x] SETUP_CHECKLIST.md (this file)
- [x] .env.example provided

---

## 🎉 Launch Checklist

Before going live, verify:

- [ ] GitHub Secrets configured
- [ ] SSH key deployed to server
- [ ] Docker installed on server
- [ ] Domain DNS configured
- [ ] First deployment successful
- [ ] Site loads at custom domain
- [ ] 3D components render
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance metrics good

---

## 🚀 Ready to Deploy!

Once all checkboxes are checked, your portfolio is ready for production.

```bash
# Final confirmation
cd ~/clawd/portfolio
git push origin main

# Monitor at: https://github.com/arielonoriaga/portfolio/actions
# Live site: https://arielonoriaga.huggian.com
```

---

**Last Updated**: 2024-03-24  
**Status**: ✅ Production Ready
