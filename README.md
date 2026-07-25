# v-range-flyout [![npm version](https://badge.fury.io/js/v-range-flyout.svg)](https://badge.fury.io/js/v-range-flyout) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Range Flyout](http://thewebkid.com/rangeflyout.png)

A Vue 3 component that wraps an `input[type=number]` with a customizable range slider flyout.

> **v2 is a Vue 3 rewrite.** For Vue 2, stay on `v-range-flyout@1.x`.

[Live Demo](http://thewebkid.com/modules/v-range-flyout)

## Installation

```bash
npm i v-range-flyout
```

Requires **Vue 3.4+** (peer dependency).

## Usage

Register globally as a plugin:

```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import RangeFlyout from 'v-range-flyout';
import 'v-range-flyout/style.css';

createApp(App).use(RangeFlyout).mount('#app');
```

Then use `<range-flyout>` (also registered as `<v-range-flyout>`) anywhere:

```html
<range-flyout :min="-50" :max="50" v-model="chosenVal" />
```

Or import the component locally:

```vue
<script setup>
import { ref } from 'vue';
import { RangeFlyout } from 'v-range-flyout';
import 'v-range-flyout/style.css';

const chosenVal = ref(50);
</script>

<template>
  <range-flyout :min="-50" :max="50" v-model="chosenVal" />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `v-model` (`modelValue`) | `Number \| String` | — | Current value. Strings are converted to numbers. |
| `min` | `Number` | `0` | Minimum allowed value. |
| `max` | `Number` | `100` | Maximum allowed value. |
| `disabled` | `Boolean` | `false` | Disable the control. |
| `sliderHeight` | `Number` | — | Height (px) of the slideable area of the flyout. |
| `incr` | `Number` | — | Increment the value snaps to (maps to the input `step` attribute). |
| `slideBackground` | `String` | — | CSS background for the track (e.g. gradients for color scales). |
| `handleBg` | `String` | — | CSS background for the drag handle. |
| `inputClass` | `String \| Array \| Object` | — | Class(es) added to the input element. |
| `wrapperClass` | `String \| Array \| Object` | — | Class(es) added to the outer wrapper div. |
| `flyoutClass` | `String \| Array \| Object` | — | Class(es) added to the flyout wrapper div. |
| `hideFlyout` | `Boolean` | `false` | Hide the flyout (input-only mode). |
| `sticky` | `Boolean` | `false` | Keep the flyout open even when the input loses focus. |
| `val` / `value` | `Number \| String` | — | **Deprecated.** Use `v-model` instead. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `@update:modelValue` | `Number` | Fires on keyboard or slider input ( backs `v-model`). |
| `@input` | `Number` | Fires on keyboard or slider input. |
| `@change` | `Number` | Fires when the value changes and the control is no longer in focus. |
| `@active` | `Boolean` | Fires when the flyout is toggled / input focus state changes. |

## Example

```vue
<script setup>
import { ref } from 'vue';
import { RangeFlyout } from 'v-range-flyout';
import 'v-range-flyout/style.css';

const chosenVal = ref(50);
</script>

<template>
  <div class="wrap">
    <div class="control">
      <label>Choose a value between -50 and 50</label>
      <range-flyout :min="-50" :max="50" v-model="chosenVal" />
    </div>
    <p>You chose: {{ chosenVal }}</p>
  </div>
</template>

<style lang="scss">
.wrap {
  .control {
    display: inline-block;
    padding: 12px;
    margin-right: 50px;
    label {
      display: block;
    }
  }
}
</style>
```

## Migrating from v1 (Vue 2)

- Vue 3 is now a **peer dependency** (no more bundled Vue 2).
- Use `v-model` instead of the `value` prop + `@input` listener (`val` / `value` are still accepted for back-compat).
- The drag library changed from `v-movable` to [`lit-movable`](https://www.npmjs.com/package/lit-movable) (the web-component successor by the same author) — no action needed unless you styled the old `.--movable-base` class. The handle is now `.flyout-handle`.
- The built files moved from `dist/index.js` to `dist/v-range-flyout.js` (ESM) / `dist/v-range-flyout.umd.cjs` (UMD). If you imported deep paths, update them or rely on the package `exports`.

> **Note:** `lit-movable` is a web component that registers itself via `window.customElements` at import time. Like the old `v-movable`, it runs in the browser only — guard the import if you're doing SSR (e.g. Nuxt) so it isn't evaluated on the server.

## Developing

```bash
npm install
npm run dev    # Vite playground (index.html + src/App.vue)
npm run build  # library build into dist/
```

## Disclaimer

This is in active development. Stability not guaranteed. Please file GitHub issues for bugs/features.
