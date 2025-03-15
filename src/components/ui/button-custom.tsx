
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pyme-blue disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pyme-blue to-pyme-blue-light text-white shadow-sm hover:shadow-md hover:from-pyme-blue-dark hover:to-pyme-blue transform hover:-translate-y-0.5",
        destructive: "bg-pyme-danger text-white hover:bg-pyme-danger/90",
        outline: "border border-pyme-blue/20 hover:border-pyme-blue/50 text-pyme-blue bg-transparent hover:bg-pyme-blue/5",
        secondary: "bg-pyme-gray-light text-pyme-gray-dark hover:bg-pyme-gray-light/80",
        ghost: "hover:bg-pyme-blue/5 hover:text-pyme-blue",
        link: "text-pyme-blue underline-offset-4 hover:underline",
        success: "bg-pyme-success text-white hover:bg-pyme-success/90",
        warning: "bg-pyme-warning text-white hover:bg-pyme-warning/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom, buttonVariants };
