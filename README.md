# v-range-flyout [![npm version](https://badge.fury.io/js/v-range-flyout.svg)](https://badge.fury.io/js/v-range-flyout) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Range Flyout](http://thewebkid.com/rangeflyout.png)

A vue component that wraps a input type=number with a customizable range slider flyout.

[Live Demo](http://preview.thewebkid.com/modules/v-range-flyout)

## Installation
    npm i --save v-range-flyout

### Initialize in main.js
    import rangeFlyout from "v-range-flyout";
    Vue.use(rangeFlyout);
    
### Options (element attributes)
- **val**: _Number_ - Required
- **min**: _Number_ - Required
- **max**: _Number_ - Required
- **sliderHeight**: _Number_ - Optionally set the height of the slideable area of the flyout.
- **incr**: _Number_ - Optionally set value increment (step attribute in input[type=number]) the control should snap to a multiple of.
- **slideBackground**: _String_ - used to show color scales as gradients. 
- **inputClass**: _String_ - Optional css class to add to the input element
- **wrapperClass**: _String_ - Optional wrapper class for the component wrapper div
- **flyoutClass**: _String_ - Optional wrapper class for the flyout wrapper div

### Events
- **@change**: Fires when value changes. Returns the numeric value.
- **@active**: Fires when flyout is toggled or input changes focus state. A boolean is passed to indicate "active" state. 


### Usage Examples
    
```html
    <template>
      <div id="app">
        <div class="control">
          <label>-50, 50</label>
          <range-flyout :min="-50" :max="50" :val="20"/>
        </div>
        <div class="control">
          <label>0, 10 (sliderHeight:100)</label>
          <range-flyout :min="0" :max="10" :val="2" :slider-height="100"/>
        </div>
        <div class="control">
          <label>0, 10 (sliderHeight:100, incr:.2)</label>
          <range-flyout :min="0" :max="10" :val="2" :slider-height="100" :incr=".2"/>
        </div>
        <div class="control">
          <label>-500, 1000 (sliderHeight:100)</label>
          <range-flyout :min="-500" :max="1000" :val="-500" :slider-height="100" />
        </div>
        <div class="control">
          <label>-500, 1000 (incr:11)</label>
          <range-flyout :min="-500" :max="1000" :val="-500" :incr="11" />
        </div>
      </div>
    </template>
   
    <style lang="scss">
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      margin-top: 60px;
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
