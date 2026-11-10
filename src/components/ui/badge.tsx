import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-lavender text-accent-foreground",
        outline: "border-border bg-card text-muted-foreground",
        pending: "border-warning/30 bg-warning-soft text-warning-strong",
        success: "border-success/30 bg-success-soft text-success-strong",
        danger: "border-destructive/30 bg-destructive-soft text-destructive-strong",
        info: "border-info/30 bg-info-soft text-info-strong",
        orange: "border-orange/30 bg-orange-soft text-orange-strong",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
