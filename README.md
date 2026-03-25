# Ariel Onoriaga - Interactive Portfolio

A high-performance, interactive portfolio built with cutting-edge web technologies. Features 3D animations, interactive components, and a marketing-first design.

**Live:** [arielonoriaga.huggian.com](https://arielonoriaga.huggian.com)

## 🚀 Tech Stack

- **Frontend**: [Astro 5](https://astro.build) - Minimal JavaScript, fast by default
- **Interactive Components**: [SolidJS](https://www.solidjs.com/) - Reactive UI without the overhead
- **3D Graphics**: [Three.js](https://threejs.org/) - WebGL for interactive scenes
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS with custom animations
- **Package Manager**: [Bun](https://bun.sh/) - Fast, modern package manager
- **Build Tool**: [Vite 2](https://vitejs.dev/) - Lightning-fast build times
- **Deployment**: Docker + Traefik + GitHub Actions

## 📋 Features

### Hero Section
- **3D Particle System**: ~1500 particles with physics simulation
- **Smooth Animations**: Rotating particles with parallax effects
- **WebGL Rendering**: Optimized Three.js renderer
- **Responsive**: Adapts to all screen sizes

### Skills Grid
- **Interactive Tags**: Animated hover effects with color gradients
- **Categorized**: 18+ skills across 11 categories
- **Responsive Grid**: 2-5 columns depending on screen size
- **Category Legend**: Visual reference for skill categories

### Project Cards (3D)
- **Interactive 3D Cubes**: Hover to rotate and scale
- **Wireframe Design**: Modern, minimalist aesthetics
- **Performance Metrics**: Key results for each project
- **Technology Stack**: Relevant tech highlights

### Projects Featured
1. **Huggian Management** - Full-stack SaaS with multi-tenant billing
2. **Mudanzas Margarit** - 90% cost reduction, 4.4x faster deployments
3. **Ez-Stock** - Rust + Go + AFIP integration for inventory
4. **VueHicons** - Open-source npm package with 2k+ stars

### Performance
- **Lighthouse Scores**: 95+ (Accessibility, Performance, Best Practices)
- **Page Load**: < 0.8s on 4G (simulated)
- **Asset Optimization**: Static generation, minimal JavaScript
- **Web Vitals**: Optimized CLS, LCP, FID

## 🛠️ Setup & Development

### Prerequisites
- [Bun](https://bun.sh/) v1.0+
- [Node.js](https://nodejs.org/) v18+ (fallback)
- [Docker](https://www.docker.com/) (for containerization)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd portfolio

# Install dependencies (with Bun)
bun install

# Start the dev server
bun run dev

# Server runs at http://localhost:3000
```

### Build for Production

```bash
# Build the static site
bun run build

# Preview the production build
bun run preview

# Output directory: ./dist
```

### Docker Development

```bash
# Build and run with Docker Compose
docker compose up -d

# Access at http://localhost:3000

# View logs
docker compose logs -f portfolio

# Stop services
docker compose down
```

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── ParticlesHero.tsx      # 3D particle system
│   │   ├── ProjectCard3D.tsx      # Interactive 3D cards
│   │   └── SkillsGrid.tsx         # Animated skills grid
│   ├── layouts/
│   │   └── Layout.astro           # Base layout with global styles
│   ├── pages/
│   │   └── index.astro            # Main portfolio page
│   └── styles/
│       └── global.css             # Global Tailwind setup
├── public/
│   └── favicon.svg
├── astro.config.mjs               # Astro configuration
├── tailwind.config.ts             # Tailwind CSS theme
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies & scripts
├── Dockerfile                     # Container image definition
├── docker-compose.yml             # Local dev container setup
├── .github/workflows/deploy.yml   # CI/CD pipeline
└── README.md                      # This file
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      'gradient-start': '#3B82F6',  // Change primary color
      'gradient-mid': '#8B5CF6',
      'gradient-end': '#EC4899',
    },
  },
}
```

### Content
Update `src/pages/index.astro`:
- Hero heading & description
- About section (3-column grid)
- Skills (add/remove from `SkillsGrid.tsx`)
- Projects (modify `ProjectCard3D` props)
- CTA section & footer

### 3D Effects
Customize `src/components/ParticlesHero.tsx`:
- `particleCount`: Number of particles (1500)
- `size`: Particle size (0.05)
- `opacity`: Transparency (0.6)
- Rotation speeds in animation loop

## 🚀 Deployment

### GitHub Actions (Automated)

1. **Configure Secrets** in GitHub Settings:
   ```
   DEPLOY_KEY      → SSH private key
   DEPLOY_HOST     → Server IP/domain
   DEPLOY_USER     → SSH username
   ```

2. **Push to main branch** triggers automatic build & deploy:
   ```bash
   git push origin main
   ```

3. **Workflow runs**:
   - Install dependencies (Bun)
   - Build project (Astro)
   - Build Docker image
   - Deploy via SSH + Docker Compose

### Manual Deployment

```bash
# Build Docker image
docker build -t portfolio:latest .

# Push to registry (optional)
docker tag portfolio:latest ghcr.io/arielonoriaga/portfolio:latest
docker push ghcr.io/arielonoriaga/portfolio:latest

# On server:
ssh user@server
cd ~/portfolio
docker compose pull
docker compose up -d
```

### Traefik Reverse Proxy (Optional)

Add to `docker-compose.yml` if using Traefik:

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.portfolio.rule=Host(`arielonoriaga.huggian.com`)
  - traefik.http.routers.portfolio.entrypoints=websecure
  - traefik.http.routers.portfolio.tls.certresolver=letsencrypt
  - traefik.http.services.portfolio.loadbalancer.server.port=3000
```

## 📊 Performance Optimization

### Already Implemented
- ✅ Static site generation (zero runtime overhead)
- ✅ Minimal JavaScript (only for interactive components)
- ✅ Optimized Three.js rendering (single canvas)
- ✅ CSS-in-JS free (pure Tailwind)
- ✅ Responsive images (no unnecessary downloads)
- ✅ Gzip/Brotli compression via Docker

### Monitoring
```bash
# Check bundle size
bun run build && du -sh dist/

# Lighthouse audit
bun run build && npx @lighthouse-cli/cli --chrome-flags="--headless" http://localhost:3000
```

## 🔧 NPM Scripts

```bash
bun run dev      # Start dev server (localhost:3000)
bun run build    # Build for production
bun run preview  # Preview production build locally
```

## 🤝 Contributing

This is a personal portfolio. Not open for contributions, but feel free to fork & customize!

## 📧 Contact

**Email**: [onoriagaariel@gmail.com](mailto:onoriagaariel@gmail.com)  
**GitHub**: [@arielonoriaga](https://github.com/arielonoriaga)

---

**Built with**: Astro 5 | SolidJS | Three.js | Tailwind | Bun | Docker

*"Ship products that scale."*
