import React from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  children, 
  required = false, 
  className,
  type = "input",
  ...props 
}) => {
  const Component = type === "textarea" ? Textarea : Input;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-charcoal">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children || <Component error={!!error} {...props} />}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;