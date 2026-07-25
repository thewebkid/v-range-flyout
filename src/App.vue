<template>
  <div class="page" :class="{ 'page-dark': dark }">
    <div class="page-inner">
      <header class="hero">
        <div class="hero-badge">v-range-flyout</div>
        <h1>A number input with a <em>silky</em> slider flyout</h1>
        <p class="lede">
          Set a theme once on a container; override any single control. Focus an input to open
          its flyout and watch the accent follow.
        </p>

        <div class="toolbar">
          <div class="theme-picker" role="group" aria-label="Default theme">
            <span class="toolbar-label">Default theme</span>
            <button
              v-for="t in themes"
              :key="t.id"
              class="swatch-btn"
              :class="{ selected: theme === t.id }"
              :title="t.label"
              :aria-pressed="theme === t.id"
              @click="theme = t.id"
            >
              <span class="dot" :style="{ background: t.swatch }"></span>
              {{ t.label }}
            </button>
          </div>

          <label class="dark-toggle">
            <input type="checkbox" v-model="dark" />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            Dark canvas
          </label>
        </div>
      </header>

      <!-- Set-once default: the theme class + scheme live on <main>, so every
           control inside inherits them. -->
      <main :class="themeClass" :data-scheme="scheme">
        <section class="card">
          <h2>Set once, inherited everywhere</h2>
          <p class="card-sub">
            These controls have <strong>no theme of their own</strong> — they pick up
            <code>{{ themeLabel }}</code> and <code>{{ scheme }}</code> from the wrapper.
          </p>
          <div class="grid">
            <div class="control">
              <label>Bound to ±50 <output>{{ boundVal0 }}</output></label>
              <range-flyout :min="-50" :max="50" v-model="boundVal0" :scheme="scheme" />
              <pre class="use"><code>&lt;range-flyout :min="-50" :max="50"
  v-model="val" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>0 – 10, tall track <output>{{ boundVal }}</output></label>
              <range-flyout :min="0" :max="10" v-model="boundVal" :slider-height="100" :scheme="scheme" />
              <pre class="use"><code>&lt;range-flyout :min="0" :max="10"
  v-model="val" :slider-height="100" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>0 – 10, step 0.2 <output>{{ boundVal2 }}</output></label>
              <range-flyout :min="0" :max="10" v-model="boundVal2" :slider-height="100" :incr="0.2" :scheme="scheme" />
              <pre class="use"><code>&lt;range-flyout :min="0" :max="10"
  v-model="val" :incr="0.2" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>Wide range <output>{{ boundVal3 }}</output></label>
              <range-flyout :min="-500" :max="1000" v-model="boundVal3" :slider-height="100" :scheme="scheme" />
              <pre class="use"><code>&lt;range-flyout :min="-500" :max="1000"
  v-model="val" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>Step 11 <output>{{ boundVal4 }}</output></label>
              <range-flyout :min="-500" :max="1000" v-model="boundVal4" :incr="11" :scheme="scheme" />
              <pre class="use"><code>&lt;range-flyout :min="-500" :max="1000"
  v-model="val" :incr="11" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>Disabled</label>
              <range-flyout :min="0" :max="10" :model-value="5" :scheme="scheme" disabled />
              <pre class="use"><code>&lt;range-flyout :min="0" :max="10"
  v-model="val" disabled /&gt;</code></pre>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Override a single control</h2>
          <p class="card-sub">
            Everything else on this page is <code>{{ themeLabel }}</code>, but these two pin their
            own theme — a closer class always wins over the inherited default.
          </p>
          <div class="grid">
            <div class="control">
              <label>Always Forest <output>{{ pinnedForest }}</output></label>
              <range-flyout
                wrapper-class="vrf-theme-forest"
                :min="0" :max="100" v-model="pinnedForest"
                :slider-height="100" :scheme="scheme"
              />
              <pre class="use"><code>&lt;range-flyout
  wrapper-class="vrf-theme-forest"
  :min="0" :max="100" v-model="val" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>Custom brand (your CSS) <output>{{ pinnedBrand }}</output></label>
              <range-flyout
                wrapper-class="my-brand"
                :min="0" :max="100" v-model="pinnedBrand"
                :slider-height="100" :scheme="scheme"
              />
              <pre class="use"><code>&lt;range-flyout wrapper-class="my-brand"
  :min="0" :max="100" v-model="val" /&gt;</code></pre>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Gradient track, one prop</h2>
          <p class="card-sub"><code>slideBackground</code> / <code>handleBg</code> still work for one-off looks.</p>
          <div class="grid">
            <div class="control">
              <label>Hue <output>{{ hue }}°</output></label>
              <range-flyout
                :min="0" :max="360" v-model="hue" :slider-height="120" :scheme="scheme"
                slide-background="linear-gradient(to top, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)"
              />
              <pre class="use"><code>&lt;range-flyout :min="0" :max="360"
  v-model="hue"
  slide-background="linear-gradient(...)" /&gt;</code></pre>
            </div>
            <div class="control">
              <label>Heat <output>{{ heat }}</output></label>
              <range-flyout
                :min="0" :max="100" v-model="heat" :slider-height="120" :scheme="scheme"
                slide-background="linear-gradient(to top, #3b82f6, #facc15, #ef4444)"
              />
              <pre class="use"><code>&lt;range-flyout :min="0" :max="100"
  v-model="heat"
  slide-background="linear-gradient(...)" /&gt;</code></pre>
            </div>
          </div>
        </section>

        <section class="card">
          <h2>Skin it with your own CSS</h2>
          <p class="card-sub">
            The <code>my-brand</code> control above is styled by this exact rule — set it once,
            anywhere up the tree.
          </p>
          <pre class="codeblock"><code>.my-brand {
  --vrf-accent: #e11d48;         /* the only line you need for a new color   */
  --vrf-accent-hover: #fb7185;   /* hover / gradient highlight               */
  --vrf-input-radius: 4px;       /* radii, shadows, spacing — all overridable */
}</code></pre>
        </section>
      </main>

      <footer class="foot">
        <span>A theme sets the accent; <code>scheme="dark"</code> flips the surfaces. Compose freely.</span>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import RangeFlyout from './components/range-flyout.vue';

const boundVal0 = ref(20);
const boundVal = ref(2);
const boundVal2 = ref(2);
const boundVal3 = ref(-500);
const boundVal4 = ref(-500);
const pinnedForest = ref(60);
const pinnedBrand = ref(40);
const hue = ref(210);
const heat = ref(35);

const themes = [
  { id: 'default', label: 'Indigo', swatch: 'linear-gradient(135deg,#818cf8,#6366f1)' },
  { id: 'vrf-theme-dark', label: 'Midnight', swatch: 'linear-gradient(135deg,#64748b,#475569)' },
  { id: 'vrf-theme-ocean', label: 'Ocean', swatch: 'linear-gradient(135deg,#22d3ee,#0891b2)' },
  { id: 'vrf-theme-sunset', label: 'Sunset', swatch: 'linear-gradient(135deg,#fb923c,#ea580c)' },
  { id: 'vrf-theme-forest', label: 'Forest', swatch: 'linear-gradient(135deg,#34d399,#059669)' },
  { id: 'vrf-theme-mono', label: 'Mono', swatch: 'linear-gradient(135deg,#4b5563,#111827)' },
];

const theme = ref('default');
const dark = ref(false);

// Color theme (accent) and surface scheme (light/dark) are independent axes.
const themeClass = computed(() => (theme.value === 'default' ? '' : theme.value));
const scheme = computed(() => (dark.value ? 'dark' : 'light'));
const themeLabel = computed(() => themes.find((t) => t.id === theme.value)?.label ?? 'Indigo');
</script>

<style lang="scss">
// Page chrome (not part of the component).
.page {
  --pg-bg: #f1f5f9;
  --pg-surface: #ffffff;
  --pg-text: #0f172a;
  --pg-muted: #64748b;
  --pg-border: #e2e8f0;
  --pg-accent: #6366f1;

  min-height: 100vh;
  box-sizing: border-box;
  background:
    radial-gradient(1200px 500px at 80% -10%, color-mix(in srgb, var(--pg-accent) 12%, transparent), transparent 60%),
    var(--pg-bg);
  color: var(--pg-text);
  font-family: 'Inter', 'Avenir', system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;

  &.page-dark {
    --pg-bg: #0b1120;
    --pg-surface: #111a2e;
    --pg-text: #e2e8f0;
    --pg-muted: #7d8aa5;
    --pg-border: #22304d;
    --pg-accent: #818cf8;
  }

  *, *::before, *::after { box-sizing: inherit; }
}

// A consumer's custom brand theme — this is the "my-brand" example control.
.my-brand {
  --vrf-accent: #e11d48;
  --vrf-accent-hover: #fb7185;
  --vrf-input-radius: 4px;
}

.page-inner {
  max-width: 1020px;
  margin: 0 auto;
  padding: 56px 28px 64px;
}

.hero {
  margin-bottom: 32px;

  .hero-badge {
    display: inline-block;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--pg-accent);
    border: 1px solid color-mix(in srgb, var(--pg-accent) 45%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--pg-accent) 8%, transparent);
    margin-bottom: 18px;
  }

  h1 {
    margin: 0 0 12px;
    font-size: clamp(28px, 4.5vw, 42px);
    line-height: 1.1;
    letter-spacing: -0.02em;

    em {
      font-style: normal;
      background: linear-gradient(90deg, #818cf8, #e879f9);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  .lede {
    margin: 0 0 24px;
    max-width: 600px;
    color: var(--pg-muted);
    font-size: 16px;
    line-height: 1.6;
  }
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}

.toolbar-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pg-muted);
  margin-right: 2px;
}

.theme-picker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  .swatch-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--pg-text);
    background: var(--pg-surface);
    border: 1px solid var(--pg-border);
    border-radius: 999px;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
    }

    &:hover { transform: translateY(-1px); }

    &.selected {
      border-color: var(--pg-accent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--pg-accent) 25%, transparent);
    }
  }
}

.dark-toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--pg-muted);
  cursor: pointer;
  user-select: none;

  input { position: absolute; opacity: 0; pointer-events: none; }

  .toggle-track {
    width: 38px;
    height: 22px;
    border-radius: 999px;
    background: var(--pg-border);
    padding: 2px;
    transition: background 0.2s ease;
  }

  .toggle-thumb {
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--pg-surface);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
    transition: transform 0.2s ease;
  }

  input:checked + .toggle-track {
    background: var(--pg-accent);

    .toggle-thumb { transform: translateX(16px); }
  }

  input:focus-visible + .toggle-track {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--pg-accent) 35%, transparent);
  }
}

main {
  display: grid;
  gap: 22px;
}

.card {
  background: var(--pg-surface);
  border: 1px solid var(--pg-border);
  border-radius: 16px;
  padding: 26px 28px 30px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.05), 0 8px 24px -12px rgb(15 23 42 / 0.12);

  h2 {
    margin: 0 0 4px;
    font-size: 18px;
    letter-spacing: -0.01em;
  }

  .card-sub {
    margin: 0 0 22px;
    font-size: 14px;
    color: var(--pg-muted);

    strong { color: var(--pg-text); }
  }

  code {
    font-family: ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
    font-size: 0.88em;
    background: color-mix(in srgb, var(--pg-accent) 10%, transparent);
    border-radius: 5px;
    padding: 1px 6px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 26px 24px;
}

.control {
  label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 9px;
    font-size: 13px;
    font-weight: 600;
    color: var(--pg-muted);
  }

  output {
    font-variant-numeric: tabular-nums;
    color: var(--pg-accent);
    font-weight: 700;
  }
}

// Per-control usage snippet.
.use {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--pg-border);
  background: color-mix(in srgb, var(--pg-surface) 60%, var(--pg-bg));
  font-family: ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--pg-muted);
  white-space: pre;
  overflow-x: auto;

  code { background: none; padding: 0; color: inherit; }
}

.codeblock {
  margin: 0;
  padding: 18px 20px;
  border-radius: 10px;
  border: 1px solid var(--pg-border);
  background: #0f172a;
  color: #c7d2fe;
  font-family: ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;

  code { background: none; padding: 0; color: inherit; }
}

.foot {
  margin-top: 34px;
  font-size: 13px;
  color: var(--pg-muted);
  text-align: center;

  code {
    font-family: ui-monospace, 'Cascadia Code', Menlo, Consolas, monospace;
    font-size: 0.9em;
  }
}
</style>
