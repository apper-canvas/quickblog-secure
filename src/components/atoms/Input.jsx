import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-gray-500 focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        error && "border-error focus:border-error focus:ring-error",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;