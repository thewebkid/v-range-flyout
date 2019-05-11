import Vue from 'vue';
import rangeFlyout from './components/range-flyout.vue';
export default {
  install(Vue) {
    Vue.component("range-flyout", rangeFlyout);
  }
};