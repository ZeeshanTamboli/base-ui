'use client';
import * as React from 'react';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { useOnMount } from '../../utils/useOnMount';
import type { BaseUIComponentProps } from '../../utils/types';
import type { TabsOrientation, TabsRoot } from '../root/TabsRoot';
import { useTabsRootContext } from '../root/TabsRootContext';
import { tabsStyleHookMapping } from '../root/styleHooks';
import { useTabsListContext } from '../list/TabsListContext';
import { ActiveTabPosition, ActiveTabSize, useTabsIndicator } from './useTabsIndicator';
import { script as prehydrationScript } from './prehydrationScript.min';
import { generateId } from '../../utils/generateId';

const noop = () => null;

/**
 * A visual indicator that can be styled to match the position of the currently active tab.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Tabs](https://base-ui.com/react/components/tabs)
 */
export const TabsIndicator = React.forwardRef(function TabIndicator(
  props: TabsIndicator.Props,
  forwardedRef: React.ForwardedRef<HTMLSpanElement>,
) {
  const { className, render, renderBeforeHydration = false, ...other } = props;

  const { getTabElementBySelectedValue, orientation, tabActivationDirection, value } =
    useTabsRootContext();

  const { tabsListRef } = useTabsListContext();

  const [instanceId] = React.useState(() => generateId('tab'));
  const [isMounted, setIsMounted] = React.useState(false);
  const { value: activeTabValue } = useTabsRootContext();

  useOnMount(() => setIsMounted(true));

  const {
    getRootProps,
    activeTabPosition: selectedTabPosition,
    activeTabSize: selectedTabSize,
  } = useTabsIndicator({
    getTabElementBySelectedValue,
    tabsListRef,
    value,
  });

  const state: TabsIndicator.State = React.useMemo(
    () => ({
      orientation,
      selectedTabPosition,
      selectedTabSize,
      tabActivationDirection,
    }),
    [orientation, selectedTabPosition, selectedTabSize, tabActivationDirection],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getRootProps,
    render: render ?? 'span',
    className,
    state,
    extraProps: {
      ...other,
      'data-instance-id': !(isMounted && renderBeforeHydration) ? instanceId : undefined,
      suppressHydrationWarning: true,
    },
    customStyleHookMapping: {
      ...tabsStyleHookMapping,
      selectedTabPosition: noop,
      selectedTabSize: noop,
    },
    ref: forwardedRef,
  });

  if (activeTabValue == null) {
    return null;
  }

  return (
    <React.Fragment>
      {renderElement()}
      {!isMounted && renderBeforeHydration && (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: prehydrationScript }}
          suppressHydrationWarning
        />
      )}
    </React.Fragment>
  );
});

export namespace TabsIndicator {
  export interface State extends TabsRoot.State {
    selectedTabPosition: ActiveTabPosition | null;
    selectedTabSize: ActiveTabSize | null;
    orientation: TabsOrientation;
  }

  export interface Props extends BaseUIComponentProps<'span', TabsIndicator.State> {
    /**
     * Whether to render itself before React hydrates.
     * This minimizes the time that the indicator isn’t visible after server-side rendering.
     * @default false
     */
    renderBeforeHydration?: boolean;
  }
}
