import * as React from 'react';

export interface TooltipProviderContext {
  delay: number | undefined;
  closeDelay: number | undefined;
}

export const TooltipProviderContext = React.createContext<TooltipProviderContext | undefined>(
  undefined,
);

if (process.env.NODE_ENV !== 'production') {
  TooltipProviderContext.displayName = 'TooltipProviderContext';
}

export function useTooltipProviderContext(): TooltipProviderContext | undefined {
  return React.useContext(TooltipProviderContext);
}
