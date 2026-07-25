import RangeFlyout from './components/range-flyout.vue';

export { RangeFlyout };
export { RangeFlyout as VRangeFlyout };

export default {
  install(app) {
    app.component('RangeFlyout', RangeFlyout);
    app.component('VRangeFlyout', RangeFlyout);
  },
};
