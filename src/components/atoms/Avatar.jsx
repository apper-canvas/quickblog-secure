import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  src, 
  alt = "", 
  className, 
  size = "md", 
  fallback,
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl"
  };
  
  if (src) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-sky to-blue-500 font-medium text-white",
        sizes[size],
        className
      )}
      {...props}
    >
      {fallback}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;