# v-range-flyout [![npm version](https://badge.fury.io/js/v-range-flyout.svg)](https://badge.fury.io/js/v-range-flyout) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Range Flyout](http://thewebkid.com/rangeflyout.png)

A vue component that wraps a input type=number with a customizable range slider flyout.

[Live Demo](http://thewebkid.com/modules/v-range-flyout)

## Installation
    npm i --save v-range-flyout

### Initialize in main.js
    import rangeFlyout from "v-range-flyout";
    Vue.use(rangeFlyout);

### Options (element attributes)
- **v-model** or **value** : _Number_ - Required. String values will be converted to Number.
- **min**: _Number_ - Required
- **max**: _Number_ - Required
- **disabled**: _Boolean_ - Disable the control
- **sliderHeight**: _Number_ - Optionally set the height of the slideable area of the flyout.
- **incr**: _Number_ - Optionally set value increment (step attribute in input[type=number]) the control should snap to a multiple of.
- **slideBackground**: _String_ - used to show color scales as gradients.
- **inputClass**: _String_ - Optional css class to add to the input element
- **flyoutClass**: _String_ - Optional wrapper class for the flyout wrapper div

### Events
- **@input**: Fires on keyboard or slider input
- **@change**: Fires when value changes and control is no longer in focus. Returns the numeric value.
- **@active**: Fires when flyout is toggled or input changes focus state. A boolean is passed to indicate "active" state.


### Usage Examples

```html
<template>
  <div class="wrap">
    <div class="control">
      <label>Choose a value between -50 and 50</label>
      <range-flyout :min="-50" :max="50" v-model="chosenVal"/>
    </div>
    <p>You chose: {{chosenVal}}</p>
  </div>
</template>
<script>
export default {
  data:() => { return {chosenVal:50} }
}
</script>
<style lang="scss">
.wrap{
  .control{
    display: inline-block;
    padding:12px;
    margin-right:50px;
    label{
      display:block;
    }
  }
}
</style>
```

### Disclaimer
This is in active development. Stability not guaranteed. Please file github issues for bugs/features.
