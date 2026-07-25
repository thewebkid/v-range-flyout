<template>
  <div id="app">
    <div class="control">
      <label>-50, 50 (v-model: {{ boundVal0 }})</label>
      <range-flyout :min="-50" :max="50" v-model="boundVal0" />
    </div>
    <div class="control">
      <label>0, 10 (sliderHeight:100, v-model: {{ boundVal }})</label>
      <range-flyout :min="0" :max="10" v-model="boundVal" :slider-height="100" />
    </div>
    <div class="control">
      <label>0, 10 (sliderHeight:100, incr:.2, v-model: {{ boundVal2 }})</label>
      <range-flyout :min="0" :max="10" v-model="boundVal2" :slider-height="100" :incr=".2" />
    </div>
    <div class="control">
      <label>-500, 1000 (sliderHeight:100, v-model: {{ boundVal3 }})</label>
      <range-flyout :min="-500" :max="1000" v-model="boundVal3" :slider-height="100" />
    </div>
    <div class="control">
      <label>-500, 1000 (incr:11, v-model: {{ boundVal4 }})</label>
      <range-flyout :min="-500" :max="1000" v-model="boundVal4" :incr="11" />
    </div>
    <div class="control">
      <label>disabled</label>
      <range-flyout :min="0" :max="10" :model-value="5" disabled />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import RangeFlyout from './components/range-flyout.vue';

const boundVal0 = ref(20);
const boundVal = ref(2);
const boundVal2 = ref(2);
const boundVal3 = ref(-500);
const boundVal4 = ref(-500);
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  margin-top: 60px;

  .control {
    label {
      display: block;
    }

    display: inline-block;
    padding: 12px;
    margin-right: 50px;
  }
}
</style>
