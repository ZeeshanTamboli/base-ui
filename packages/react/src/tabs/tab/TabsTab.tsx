'use client';
import * as React from 'react';
import { useTabsTab } from './useTabsTab';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import type { BaseUIComponentProps } from '../../utils/types';
import type { TabsOrientation, TabValue } from '../root/TabsRoot';
import { useTabsRootContext } from '../root/TabsRootContext';
import { useTabsListContext } from '../list/TabsListContext';

/**
 * An individual interactive tab button that toggles the corresponding panel.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export const TabsTab = React.forwardRef(function Tab(
  props: TabsTab.Props,
  forwardedRef: React.ForwardedRef<Element>,
) {
  const { className, disabled = false, render, value: valueProp, id: idProp, ...other } = props;

  const {
    value: selectedTabValue,
    getTabPanelIdByTabValueOrIndex,
    orientation,
  } = useTabsRootContext();

  const { activateOnFocus, highlightedTabIndex, onTabActivation, setHighlightedTabIndex } =
    useTabsListContext();

  const { getRootProps, index, selected } = useTabsTab({
    activateOnFocus,
    disabled,
    getTabPanelIdByTabValueOrIndex,
    highlightedTabIndex,
    id: idProp,
    onTabActivation,
    rootRef: forwardedRef,
    setHighlightedTabIndex,
    selectedTabValue,
    value: valueProp,
  });

  const highlighted = index > -1 && index === highlightedTabIndex;

  const state: TabsTab.State = React.useMemo(
    () => ({
      disabled,
      highlighted,
      selected,
      orientation,
    }),
    [disabled, highlighted, selected, orientation],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'button',
    className,
    state,
    extraProps: other,
  });

  return renderElement();
});

export namespace TabsTab {
  export interface Props extends BaseUIComponentProps<'button', TabsTab.State> {
    /**
     * The value of the Tab.
     * When not specified, the value is the child position index.
     */
    value?: TabValue;
  }

  export interface State {
    /**
     * Whether the component should ignore user interaction.
     */
    disabled: boolean;
    selected: boolean;
    orientation: TabsOrientation;
  }
}
