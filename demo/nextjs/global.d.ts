// global.d.ts file

import { PropsWithChildren } from 'react'

declare module '@radix-ui/react-tabs' {
  export interface TabsProps extends PropsWithChildren {}
  export interface TabsListProps extends PropsWithChildren {}
  export interface TabsTriggerProps extends PropsWithChildren {}
  export interface TabsContentProps extends PropsWithChildren {}
}
declare module "@radix-ui/react-radio-group" {
    export interface RadioGroupItemProps extends ComponentProps<ReactElement> {}
    export const Item: React.ForwardRefExoticComponent<
      RadioGroupItemProps & React.RefAttributes<HTMLButtonElement>
    >;
  
    export interface RadioGroupIndicatorProps
      extends ComponentProps<ReactElement> {}
    export const Indicator: React.ForwardRefExoticComponent<
      RadioGroupIndicatorProps & React.RefAttributes<HTMLSpanElement>
    >;
  }