<template>
  <div :class="wrapperClass" class="range-flyout-wrapper">
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
.range-flyout-wrapper {
  position: relative;
  display: inline-block;
}

input[type='number'] {
  display: inline-block;
  width: auto;
  height: calc(1.5em + 0.75rem + 2px);
  padding: 0.15rem 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  appearance: textfield;
  -moz-appearance: textfield;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s linear;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.flyout {
  top: 0;
  position: absolute;
  margin-left: -4px;
  background: #f7f7f7;
  display: inline-block;
  box-shadow: 0 0 5px #888;

  .inner {
    width: 6px;
    box-shadow:
      inset 0 0 5px #999,
      1px 1px 0.5px #ccc;
    display: block;
    margin-left: -4px;
    left: 50%;
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
    cursor: pointer;
  }

  .flyout-handle-grip {
    background: lightblue;
    height: 12px;
    width: 16px;
    border-radius: 3px;
    border: solid 1px dodgerblue;
    box-sizing: border-box;

    &:hover {
      background: deepskyblue;
    }
  }

  label {
    display: block;
    padding: 7px 15px 3px 11px;
    text-align: center;
  }
}
</style>
