import Vue from 'vue';
import rangeFlyout from './components/range-flyout.vue';
import movable from 'v-movable';
export default {
  install(Vue) {
    //Vue.use(movable);
    Vue.component("range-flyout", rangeFlyout);
  }
};