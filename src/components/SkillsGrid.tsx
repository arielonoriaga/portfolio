import { For, createSignal } from 'solid-js';

interface Skill {
  name: string;
  category: string;
  icon?: string;
}

const skills: Skill[] = [
  // Languages
  { name: 'TypeScript', category: 'Language', icon: 'TS' },
  { name: 'JavaScript', category: 'Language', icon: 'JS' },
  { name: 'Go', category: 'Language', icon: 'Go' },
  { name: 'Python', category: 'Language', icon: 'Py' },
  { name: 'Rust', category: 'Language', icon: 'Rs' },

  // Package Manager & Build
  { name: 'Bun', category: 'Runtime', icon: '🦉' },
  { name: 'Docker', category: 'DevOps', icon: '🐳' },
  { name: 'GitHub Actions', category: 'CI/CD', icon: '⚙️' },

  // Databases
  { name: 'PostgreSQL', category: 'Database', icon: '🐘' },

  // Infra
  { name: 'Nginx', category: 'Infrastructure', icon: '⚡' },

  // Frontend
  { name: 'Astro', category: 'Frontend', icon: '🌌' },
  { name: 'SolidJS', category: 'Frontend', icon: '💎' },
  { name: 'React', category: 'Frontend', icon: '⚛️' },
  { name: 'Tailwind', category: 'Styling', icon: '🎨' },

  // Graphics
  { name: 'Three.js', category: 'Graphics', icon: '🎮' },
  { name: 'Phaser', category: 'Graphics', icon: '🎯' },
  { name: 'WebGL', category: 'Graphics', icon: '✨' },

  // Architecture
  { name: 'DDD', category: 'Architecture', icon: '🏗️' },
  { name: 'E2E Testing', category: 'Testing', icon: '✅' },
];

const categories = Array.from(new Set(skills.map(s => s.category)));

export default function SkillsGrid() {
  const [hoveredSkill, setHoveredSkill] = createSignal<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Language': '#3B82F6',
      'Frontend': '#8B5CF6',
      'Runtime': '#EC4899',
      'Database': '#F59E0B',
      'DevOps': '#10B981',
      'CI/CD': '#14B8A6',
      'Infrastructure': '#F97316',
      'Styling': '#06B6D4',
      'Graphics': '#EF4444',
      'Architecture': '#6366F1',
      'Testing': '#10B981',
    };
    return colors[category] || '#9CA3AF';
  };

  return (
    <div class="w-full">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <For each={skills}>
          {(skill) => (
            <div
              class="group relative p-4 rounded-lg border border-gray-800 bg-gray-950/50 backdrop-blur-sm hover:bg-gray-900 transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                borderColor: hoveredSkill() === skill.name ? getCategoryColor(skill.category) + '80' : 'rgb(31, 41, 55)',
                backgroundColor: hoveredSkill() === skill.name ? getCategoryColor(skill.category) + '10' : 'rgb(15, 23, 42)',
              }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              {/* Animated gradient background */}
              <div
                class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${getCategoryColor(skill.category)}20 0%, transparent 70%)`,
                }}
              />

              <div class="relative z-10">
                <div class="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {skill.icon || '●'}
                </div>
                <h3 class="font-semibold text-sm mb-1 text-white group-hover:text-opacity-100">
                  {skill.name}
                </h3>
                <p class="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                  {skill.category}
                </p>
              </div>

              {/* Animated border glow on hover */}
              <div
                class="absolute inset-0 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, ${getCategoryColor(skill.category)}40 0%, transparent 100%)`,
                  borderRadius: 'inherit',
                }}
              />
            </div>
          )}
        </For>
      </div>

      {/* Category legend */}
      <div class="mt-8 pt-6 border-t border-gray-800">
        <p class="text-xs text-gray-500 mb-4">CATEGORIES</p>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <For each={categories}>
            {(category) => (
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getCategoryColor(category) }}
                />
                <span class="text-xs text-gray-400">{category}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
