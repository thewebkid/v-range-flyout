import type { App, DefineComponent, Plugin } from 'vue';

export interface RangeFlyoutProps {
  /** Optional css class(es) to add to the input element */
  inputClass?: string | string[] | Record<string, boolean>;
  /** Optional css class(es) to add to the outer wrapper div */
  wrapperClass?: string | string[] | Record<string, boolean>;
  /** Optional css class(es) to add to the flyout wrapper div */
  flyoutClass?: string | string[] | Record<string, boolean>;
  /** Minimum allowed value. Default: 0 */
  min?: number;
  /** Maximum allowed value. Default: 100 */
  max?: number;
  /** Height (px) of the slideable area of the flyout */
  sliderHeight?: number;
  /** CSS background for the slider track (e.g. gradients for color scales) */
  slideBackground?: string;
  /** CSS background for the drag handle */
  handleBg?: string;
  /** Increment the control snaps to (maps to the input step attribute) */
  incr?: number;
  /** Hide the flyout entirely (input-only mode) */
  hideFlyout?: boolean;
  /** Keep the flyout open even when the input loses focus */
  sticky?: boolean;
  /** Disable the control */
  disabled?: boolean;
  /** Current value — use with v-model */
  modelValue?: number | string;
  /** @deprecated use v-model instead */
  val?: number | string;
  /** @deprecated use v-model instead */
  value?: number | string;
}

export declare const RangeFlyout: DefineComponent<
  RangeFlyoutProps,
  {},
  {},
  {},
  {},
  {},
  {},
  {
    'update:modelValue': (value: number) => void;
    input: (value: number) => void;
    change: (value: number) => void;
    active: (isActive: boolean) => void;
  }
>;

export declare const VRangeFlyout: typeof RangeFlyout;

declare const plugin: Plugin & {
  install: (app: App) => void;
};

export default plugin;
