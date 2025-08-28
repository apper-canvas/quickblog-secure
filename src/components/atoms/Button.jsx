import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-sky to-blue-500 text-white shadow-sm hover:from-blue-600 hover:to-blue-700 hover:shadow-md transform hover:scale-[1.02]",
    secondary: "bg-white text-charcoal border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md transform hover:scale-[1.02]",
    ghost: "text-charcoal hover:bg-gray-100 hover:text-slate",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-sm hover:from-red-600 hover:to-red-700 hover:shadow-md transform hover:scale-[1.02]"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;