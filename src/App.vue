<template>
  <div id="app">
    <div class="control">
      <label>-50, 50</label>
      <range-flyout :min="-50" :max="50" :val="20"/>
    </div>
    <div class="control">
      <label>0, 10 (sliderHeight:100)</label>
      <range-flyout :min="0" :max="10" v-model="boundVal" :slider-height="100"/>
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

<script>
import rangeFlyout from './components/range-flyout.vue'

export default {
  data:()=>{
    return {
      boundVal:2
    }
  },
  name: 'app',
  components: { rangeFlyout }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  margin-top: 60px;
  .control{
    label{
      display:block;
    }
    display: inline-block;
    padding:12px;
    margin-right:50px;
  }
}
</style>
