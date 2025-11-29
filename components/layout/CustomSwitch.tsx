"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Check, Circle } from "lucide-react";

const CustomSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={[
      "peer inline-flex h-6 w-11  shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
      className,
    ].join(" ")}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={[
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
        "transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        "flex items-center justify-center",
      ].join(" ")}
    >
      {props.checked ? (
        <Check className="h-3 w-3 text-primary-foreground" />
      ) : (
        <Circle className="h-3 w-3 text-muted-foreground" strokeWidth={3} />
      )}
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));
CustomSwitch.displayName = "CustomSwitch";

export { CustomSwitch };