<template>
  <div
    :class="wrapperClass"
    class="range-flyout-wrapper"
    :data-vrf-scheme="scheme === 'dark' ? 'dark' : undefined"
  >
    <input
      ref="rangeInput"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      :readonly="disabled"
      v-model.number="curVal"
      :class="inputClass"
      :step="incrSize"
      @focus="focus"
      @blur="blurred"
      @change="onInputChange"
      @keydown.up.prevent="stepBy(1)"
      @keydown.down.prevent="stepBy(-1)"
    />
    <transition name="slide-fade">
      <div
        v-if="active && !hideFlyout && !disabled"
        class="flyout"
        :class="flyoutClass"
        @mousedown="onFlyoutMouseDown"
        @mouseup="onFlyoutMouseUp"
      >
        <label>{{ max }}</label>
        <div
          ref="trackEl"
          class="inner"
          :style="{ height: sldHeight + 'px', background: slideBackground }"
          @mousedown="slideClick"
        >
          <lit-movable
            ref="movableEl"
            class="flyout-handle"
            axis="y"
            :grid="gridSize"
            @movestart="onMoveStart"
            @move="onMove"
            @moveend="onMoveEnd"
          >
            <div class="flyout-handle-grip" :style="{ background: handleBg }"></div>
          </lit-movable>
        </div>
        <label>{{ min }}</label>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import 'lit-movable';

defineOptions({ name: 'VRangeFlyout' });

const props = defineProps({
  inputClass: { type: [String, Array, Object], default: undefined },
  wrapperClass: { type: [String, Array, Object], default: undefined },
  flyoutClass: { type: [String, Array, Object], default: undefined },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  sliderHeight: { type: Number, default: undefined },
  slideBackground: { type: String, default: undefined },
  handleBg: { type: String, default: undefined },
  /** @deprecated use v-model instead */
  val: { type: [Number, String], default: undefined },
  incr: { type: Number, default: undefined },
  hideFlyout: { type: Boolean, default: false },
  sticky: { type: Boolean, default: false },
  /** @deprecated use v-model instead */
  value: { type: [Number, String], default: undefined },
  disabled: { type: Boolean, default: false },
  modelValue: { type: [Number, String], default: undefined },
  /** Surface scheme: 'light' (default) or 'dark'. */
  scheme: { type: String, default: 'light' },
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'active']);

const getPrecision = (a) => {
  if (!isFinite(a)) return 0;
  let e = 1;
  while (Math.round(a * e) / e !== a) e *= 10;
  return Math.round(Math.log(e) / Math.LN10);
};

const clamp = (v) => Math.min(props.max, Math.max(props.min, v));

const active = ref(false);
const curVal = ref(0);
const handleY = ref(0);
const trackEl = ref(null);
const rangeInput = ref(null);
const movableEl = ref(null);
let noBlur = false;
let dragging = false;

const range = computed(() => props.max - props.min);

const sldHeight = computed(() => {
  if (props.sliderHeight && props.sliderHeight > 12) return props.sliderHeight;
  if (props.incr) return range.value / props.incr;
  return range.value;
});

const incrSize = computed(() => {
  if (props.incr) return props.incr;
  const inc = range.value / sldHeight.value;
  if (inc % 1 === 0) return inc;
  return range.value >= sldHeight.value ? Math.round(inc) : 1;
});

const gridSize = computed(() => {
  const incrPct = incrSize.value / range.value;
  return Math.max(1, Math.round(sldHeight.value * incrPct));
});

// Configure lit-movable for the current gesture. boundsY is a relative
// "min,max" delta from the handle's *current* top (see lit-movable docs), so
// it must be computed against the position at drag start and then left alone
// for the duration of the gesture — recomputing it reactively mid-drag makes
// the internal startCoord go stale and the handle appears frozen.
function armMovable() {
  const el = movableEl.value;
  if (!el) return;
  const top = handleY.value;
  el.posTop = top;
  el.boundsY = `${-top}, ${sldHeight.value - top}`;
}

function onMoveStart() {
  dragging = true;
  noBlur = true;
}

function onMove({ detail }) {
  if (detail.pctY === undefined) return;
  moved({ pctY: detail.pctY });
}

function onMoveEnd({ detail }) {
  dragging = false;
  if (detail.pctY !== undefined) {
    handleY.value = Math.round(sldHeight.value * detail.pctY);
  }
  noBlur = false;
  selectValue();
}

function moved({ pctY }) {
  const y = 1 - pctY;
  precisionVal(range.value * y);
  emitValue();
}

function precisionVal(v1) {
  const pw = Math.pow(10, getPrecision(incrSize.value));
  const v2 = v1 * pw;
  const i2 = incrSize.value * pw;
  const v = Math.round(v2 / i2) * i2; // nearest increment
  curVal.value = Math.min(props.max, props.min + v / pw);
}

function emitValue() {
  emit('update:modelValue', curVal.value);
  emit('input', curVal.value);
}

function syncFromValue(v) {
  const num = Number(v);
  curVal.value = Number.isNaN(num) ? props.min : clamp(num);
  const pctY = 1 - (curVal.value - props.min) / range.value;
  handleY.value = Math.round(sldHeight.value * pctY);
  // Don't fight the user's gesture — only reposition programmatically when not
  // mid-drag.
  if (!dragging) {
    nextTick(armMovable);
  }
}

function init(v) {
  let initial = v;
  if (initial === undefined || initial === null) {
    initial = props.modelValue !== undefined
      ? props.modelValue
      : props.value !== undefined
        ? props.value
        : props.val !== undefined
          ? props.val
          : props.min;
  }
  syncFromValue(initial);
}

function slideClick(e) {
  if (e.target.classList.contains('inner')) {
    const rect = trackEl.value.getBoundingClientRect();
    const pctY = (e.clientY - rect.top) / sldHeight.value;
    moved({ pctY });
    // Snap the bar to the clicked position (moved() only updates the value).
    handleY.value = Math.round(sldHeight.value * pctY);
    nextTick(armMovable);
  }
  window.setTimeout(() => selectValue(), 333);
}

function selectValue() {
  nextTick(() => rangeInput.value?.select());
  emitValue();
  emit('change', curVal.value);
}

function stepBy(dir) {
  const next = clamp(Number(curVal.value || 0) + dir * incrSize.value);
  curVal.value = next;
  syncFromValue(next);
  emitValue();
  emit('change', curVal.value);
}

function onInputChange() {
  syncFromValue(curVal.value);
  emitValue();
  emit('change', curVal.value);
}

function onFlyoutMouseDown() {
  noBlur = true;
}

function onFlyoutMouseUp() {
  // Keep noBlur true briefly after mouseup so the input's blur (fired when the
  // pointer left the input) doesn't close the flyout mid-interaction.
  window.setTimeout(() => {
    noBlur = false;
  }, 333);
}

function blurred() {
  if (noBlur || props.sticky) return;
  active.value = false;
  emit('active', false);
}

function focus() {
  active.value = true;
  emit('active', true);
  // The movable element mounts with the flyout, so (re)position it once it's
  // in the DOM.
  nextTick(armMovable);
}

watch(
  () => props.modelValue,
  (v) => {
    // Ignore echoes of our own drag/emit (already in sync) to avoid resetting
    // the handle position mid-drag.
    if (v === undefined || Number(v) === Number(curVal.value)) return;
    syncFromValue(v);
  }
);

watch(
  () => [props.val, props.value],
  () => {
    if (props.modelValue === undefined) init();
  }
);

watch(
  () => [props.min, props.max, props.sliderHeight, props.incr],
  () => syncFromValue(curVal.value)
);

init();
</script>

<style lang="scss" scoped>
// ── Theming ─────────────────────────────────────────────────────────────────
// Fallback chain for every token: var(--vrf-x, <default>). Nothing is declared
// on the wrapper itself, so a theme set on ANY ancestor inherits down, and a
// class applied directly to the component overrides it. Defaults come from a
// single :root block in the unscoped stylesheet (below) — the only place values
// are hard-coded.
.range-flyout-wrapper {
  // Derived accents recomputed from whatever --vrf-accent is in effect.
  --vrf-accent-dark: color-mix(in srgb, var(--vrf-accent) 62%, white);
  --vrf-accent-ring: color-mix(in srgb, var(--vrf-accent) 30%, transparent);

  // Effective (light-mode) accent applied to derived vars.
  --vrf-focus-border: var(--vrf-accent);
  --vrf-handle-bg: linear-gradient(180deg, var(--vrf-accent-hover), var(--vrf-accent));
  --vrf-handle-bg-hover: linear-gradient(180deg, var(--vrf-accent), var(--vrf-accent));

  position: relative;
  display: inline-block;

  &[data-vrf-scheme='dark'] {
    --vrf-input-bg: #1e293b;
    --vrf-input-color: #e2e8f0;
    --vrf-input-border: #475569;
    --vrf-flyout-bg: #1e293b;
    --vrf-flyout-border: #334155;
    --vrf-flyout-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.6), 0 4px 10px -6px rgb(0 0 0 / 0.4);
    --vrf-label-color: #64748b;
    --vrf-track-bg: #334155;
    --vrf-handle-shadow: 0 1px 3px rgb(0 0 0 / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.12);

    // Recompute the accent for dark surfaces.
    --vrf-focus-border: var(--vrf-accent-dark);
    --vrf-handle-bg: linear-gradient(180deg, var(--vrf-accent-dark), var(--vrf-accent));
    --vrf-handle-bg-hover: linear-gradient(180deg, var(--vrf-accent-dark), var(--vrf-accent-dark));
  }
}

input[type='number'] {
  display: inline-block;
  width: var(--vrf-input-width, 5.5em);
  padding: var(--vrf-input-padding, 0.45em 0.65em);
  font-family: var(--vrf-font-family, inherit);
  font-size: var(--vrf-input-font-size, 0.9375rem);
  font-weight: var(--vrf-input-font-weight, 500);
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  color: var(--vrf-input-color, #1e293b);
  background-color: var(--vrf-input-bg, #ffffff);
  background-clip: padding-box;
  border: 1px solid var(--vrf-input-border, #cbd5e1);
  border-radius: var(--vrf-input-radius, 8px);
  appearance: textfield;
  -moz-appearance: textfield;
  transition:
    border-color var(--vrf-transition, 160ms),
    box-shadow var(--vrf-transition, 160ms),
    background-color var(--vrf-transition, 160ms);

  &:hover:not(:disabled):not(:focus) {
    border-color: var(--vrf-input-hover-border, #818cf8);
  }

  &:focus {
    outline: none;
    border-color: var(--vrf-focus-border, #6366f1);
    box-shadow: 0 0 0 3px var(--vrf-accent-ring, rgb(99 102 241 / 0.3));
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.flyout {
  top: -6px;
  position: absolute;
  margin-left: 10px;
  background: var(--vrf-flyout-bg, #ffffff);
  border: 1px solid var(--vrf-flyout-border, #e2e8f0);
  border-radius: var(--vrf-flyout-radius, 12px);
  box-shadow: var(--vrf-flyout-shadow, 0 10px 25px -5px rgb(15 23 42 / 0.18));
  display: inline-block;
  padding: var(--vrf-flyout-padding, 4px);

  .inner {
    // Track width is clamped to a sane 1–8px band.
    width: clamp(1px, var(--vrf-track-width, 6px), 8px);
    background: var(--vrf-track-bg, #e2e8f0);
    border-radius: var(--vrf-track-radius, 999px);
    display: block;
    left: 50%;
    transform: translateX(-50%);
    position: relative;
  }

  // The lit-movable host is the positioned box (the library reads/writes its
  // style.left/top, treating them as px numbers). Keep those anchored to a
  // stable spot and do ALL optical centering via transform, which the library
  // never touches — so dragging can't shift the bar off the midline.
  .flyout-handle {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .flyout-handle-grip {
    position: relative;
    background: var(--vrf-handle-bg, #6366f1);
    height: var(--vrf-handle-height, 14px);
    width: var(--vrf-handle-width, 20px);
    border-radius: var(--vrf-handle-radius, 5px);
    border: 1px solid var(--vrf-handle-border, transparent);
    box-shadow: var(--vrf-handle-shadow, 0 1px 3px rgb(15 23 42 / 0.35));
    box-sizing: border-box;
    transition:
      background var(--vrf-transition, 160ms),
      box-shadow var(--vrf-transition, 160ms);

    // Grip lines to read as a drag handle at a glance.
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      margin: auto;
      width: 8px;
      height: calc(var(--vrf-handle-height, 14px) - 8px);
      min-height: 3px;
      border-left: 2px solid var(--vrf-accent-contrast, #ffffff);
      border-right: 2px solid var(--vrf-accent-contrast, #ffffff);
      opacity: 0.85;
    }

    &:hover {
      background: var(--vrf-handle-bg-hover);
    }
  }

  label {
    display: block;
    padding: 5px 10px;
    text-align: center;
    font-size: var(--vrf-label-font-size, 11px);
    font-weight: var(--vrf-label-font-weight, 600);
    letter-spacing: 0.02em;
    font-variant-numeric: tabular-nums;
    color: var(--vrf-label-color, #94a3b8);
    user-select: none;
  }
}

</style>

<!-- Defaults + shipped theme presets are intentionally UNSCOPED. Scoped styles
     would append a [data-v-xxx] attribute selector and silently break the
     "set a theme on any ancestor" model. -->
<style lang="scss">
// Token defaults live ONLY here. The component reads them via
// var(--vrf-x, <this-default>) fallbacks, so:
//   • nothing set → these defaults apply;
//   • a .vrf-theme-* / custom class on any ancestor → inherits & overrides;
//   • a class applied directly to the component → wins most specifically.
// These ship in the same CSS file as the component styles (no extra import),
// and because :root is the least-specific source, consumer rules override them.
:root {
  --vrf-accent: #6366f1;
  --vrf-accent-hover: #818cf8;
  --vrf-accent-contrast: #ffffff;

  --vrf-input-bg: #ffffff;
  --vrf-input-color: #1e293b;
  --vrf-input-border: #cbd5e1;
  --vrf-input-radius: 8px;
  --vrf-input-padding: 0.45em 0.65em;
  --vrf-input-width: 5.5em;
  --vrf-input-font-size: 0.9375rem;
  --vrf-input-font-weight: 500;
  --vrf-input-hover-border: var(--vrf-accent-hover);
  // Uncomment to force a font; by default the input inherits the app's font.
  // --vrf-font-family: inherit;

  --vrf-flyout-bg: #ffffff;
  --vrf-flyout-border: #e2e8f0;
  --vrf-flyout-shadow: 0 10px 25px -5px rgb(15 23 42 / 0.18), 0 4px 10px -6px rgb(15 23 42 / 0.1);
  --vrf-flyout-radius: 12px;
  --vrf-flyout-padding: 4px;

  --vrf-label-color: #94a3b8;
  --vrf-label-font-size: 11px;
  --vrf-label-font-weight: 600;

  --vrf-track-width: 6px;
  --vrf-track-bg: #e2e8f0;
  --vrf-track-radius: 999px;

  --vrf-handle-width: 20px;
  --vrf-handle-height: 14px;
  --vrf-handle-radius: 5px;
  --vrf-handle-shadow: 0 1px 3px rgb(15 23 42 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.25);

  --vrf-transition: 160ms cubic-bezier(0.4, 0, 0.2, 1);
}

// Each preset is just a distinct accent — dark/light surfaces are handled
// separately by `data-vrf-scheme`. The dark accent and ring derive
// automatically, so a preset only sets the "source" trio.
//   <range-flyout wrapper-class="vrf-theme-ocean" ... />
//   <section class="vrf-theme-sunset"> ... </section>

// Deep navy — reads clearly on light and dark surfaces.
.vrf-theme-dark {
  --vrf-accent: #475569;
  --vrf-accent-hover: #64748b;
}

.vrf-theme-ocean {
  --vrf-accent: #06b6d4;
  --vrf-accent-hover: #22d3ee;
  --vrf-accent-contrast: #083344;
}

.vrf-theme-sunset {
  --vrf-accent: #f97316;
  --vrf-accent-hover: #fb923c;
}

.vrf-theme-forest {
  --vrf-accent: #10b981;
  --vrf-accent-hover: #34d399;
  --vrf-accent-contrast: #022c22;
}

// Minimal square skin — shows that radii/shadows are themeable too.
.vrf-theme-mono {
  --vrf-accent: #111827;
  --vrf-accent-hover: #374151;
  --vrf-input-radius: 2px;
  --vrf-flyout-radius: 4px;
  --vrf-handle-radius: 2px;
  --vrf-handle-shadow: none;
}
</style>
