'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { NumberFieldRootContext } from './NumberFieldRootContext';
import { useNumberFieldRoot } from './useNumberFieldRoot';
import { useFieldRootContext } from '../../field/root/FieldRootContext';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import type { BaseUIComponentProps } from '../../utils/types';
import type { FieldRoot } from '../../field/root/FieldRoot';
import { styleHookMapping } from '../utils/styleHooks';

/**
 * Groups all parts of the number field and manages its state.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Number Field](https://base-ui.com/react/components/number-field)
 */
const NumberFieldRoot = React.forwardRef(function NumberFieldRoot(
  props: NumberFieldRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    id,
    min,
    max,
    smallStep,
    step,
    largeStep,
    required = false,
    disabled: disabledProp = false,
    readOnly = false,
    name,
    defaultValue,
    value,
    onValueChange,
    allowWheelScrub,
    snapOnStep,
    format,
    locale,
    render,
    className,
    ...otherProps
  } = props;

  const numberField = useNumberFieldRoot(props);

  const { state: fieldState, disabled: fieldDisabled } = useFieldRootContext();
  const disabled = fieldDisabled || disabledProp;

  const state: NumberFieldRoot.State = React.useMemo(
    () => ({
      ...fieldState,
      disabled,
      readOnly,
      required,
      value: numberField.value,
      inputValue: numberField.inputValue,
      scrubbing: numberField.isScrubbing,
    }),
    [
      fieldState,
      disabled,
      readOnly,
      required,
      numberField.value,
      numberField.inputValue,
      numberField.isScrubbing,
    ],
  );

  const contextValue = React.useMemo(
    () => ({
      ...numberField,
      state,
    }),
    [numberField, state],
  );

  const { renderElement } = useComponentRenderer({
    ref: forwardedRef,
    render: render ?? 'div',
    state,
    className,
    extraProps: otherProps,
    customStyleHookMapping: styleHookMapping,
  });

  return (
    <NumberFieldRootContext.Provider value={contextValue}>
      {renderElement()}
    </NumberFieldRootContext.Provider>
  );
});

namespace NumberFieldRoot {
  export interface Props
    extends useNumberFieldRoot.Parameters,
      Omit<BaseUIComponentProps<'div', State>, 'onChange'> {}

  export interface State extends FieldRoot.State {
    /**
     * The raw numeric value of the field.
     */
    value: number | null;
    /**
     * The formatted string value presented in the input element.
     */
    inputValue: string;
    /**
     * Whether the user must enter a value before submitting a form.
     */
    required: boolean;
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    /**
     * Whether the user should be unable to change the field value.
     */
    readOnly: boolean;
    /**
     * Whether the user is currently scrubbing the field.
     */
    scrubbing: boolean;
  }
}

NumberFieldRoot.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Whether to allow the user to scrub the input value with the mouse wheel while focused and
   * hovering over the input.
   * @default false
   */
  allowWheelScrub: PropTypes.bool,
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The uncontrolled value of the field when it’s initially rendered.
   *
   * To render a controlled number field, use the `value` prop instead.
   */
  defaultValue: PropTypes.number,
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * Options to format the input value.
   */
  format: PropTypes.shape({
    compactDisplay: PropTypes.oneOf(['long', 'short']),
    currency: PropTypes.string,
    currencyDisplay: PropTypes.oneOf(['code', 'name', 'narrowSymbol', 'symbol']),
    currencySign: PropTypes.oneOf(['accounting', 'standard']),
    localeMatcher: PropTypes.oneOf(['best fit', 'lookup']),
    maximumFractionDigits: PropTypes.number,
    maximumSignificantDigits: PropTypes.number,
    minimumFractionDigits: PropTypes.number,
    minimumIntegerDigits: PropTypes.number,
    minimumSignificantDigits: PropTypes.number,
    notation: PropTypes.oneOf(['compact', 'engineering', 'scientific', 'standard']),
    numberingSystem: PropTypes.string,
    signDisplay: PropTypes.oneOf(['always', 'auto', 'exceptZero', 'never']),
    style: PropTypes.oneOf(['currency', 'decimal', 'percent', 'unit']),
    unit: PropTypes.string,
    unitDisplay: PropTypes.oneOf(['long', 'narrow', 'short']),
    useGrouping: PropTypes.bool,
  }),
  /**
   * The id of the input element.
   */
  id: PropTypes.string,
  /**
   * The large step value of the input element when incrementing while the shift key is held. Snaps
   * to multiples of this value.
   * @default 10
   */
  largeStep: PropTypes.number,
  /**
   * The locale of the input element.
   * Defaults to the user's runtime locale.
   */
  locale: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          baseName: PropTypes.string.isRequired,
          calendar: PropTypes.string,
          caseFirst: PropTypes.oneOf(['false', 'lower', 'upper']),
          collation: PropTypes.string,
          hourCycle: PropTypes.oneOf(['h11', 'h12', 'h23', 'h24']),
          language: PropTypes.string.isRequired,
          maximize: PropTypes.func.isRequired,
          minimize: PropTypes.func.isRequired,
          numberingSystem: PropTypes.string,
          numeric: PropTypes.bool,
          region: PropTypes.string,
          script: PropTypes.string,
          toString: PropTypes.func.isRequired,
        }),
        PropTypes.string,
      ]).isRequired,
    ),
    PropTypes.shape({
      baseName: PropTypes.string.isRequired,
      calendar: PropTypes.string,
      caseFirst: PropTypes.oneOf(['false', 'lower', 'upper']),
      collation: PropTypes.string,
      hourCycle: PropTypes.oneOf(['h11', 'h12', 'h23', 'h24']),
      language: PropTypes.string.isRequired,
      maximize: PropTypes.func.isRequired,
      minimize: PropTypes.func.isRequired,
      numberingSystem: PropTypes.string,
      numeric: PropTypes.bool,
      region: PropTypes.string,
      script: PropTypes.string,
      toString: PropTypes.func.isRequired,
    }),
    PropTypes.string,
  ]),
  /**
   * The maximum value of the input element.
   */
  max: PropTypes.number,
  /**
   * The minimum value of the input element.
   */
  min: PropTypes.number,
  /**
   * Identifies the field when a form is submitted.
   */
  name: PropTypes.string,
  /**
   * Callback fired when the number value changes.
   * @param {number | null} value The new value.
   * @param {Event} event The event that triggered the change.
   */
  onValueChange: PropTypes.func,
  /**
   * Whether the user should be unable to change the field value.
   * @default false
   */
  readOnly: PropTypes.bool,
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * Whether the user must enter a value before submitting a form.
   * @default false
   */
  required: PropTypes.bool,
  /**
   * The small step value of the input element when incrementing while the meta key is held. Snaps
   * to multiples of this value.
   * @default 0.1
   */
  smallStep: PropTypes.number,
  /**
   * Whether the value should snap to the nearest step when incrementing or decrementing.
   * @default false
   */
  snapOnStep: PropTypes.bool,
  /**
   * Amount to increment and decrement with the buttons and arrow keys,
   * or to scrub with pointer movement in the scrub area.
   * @default 1
   */
  step: PropTypes.number,
  /**
   * The raw numeric value of the field.
   */
  value: PropTypes.number,
} as any;

export { NumberFieldRoot };
