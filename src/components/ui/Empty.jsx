import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "FileText",
  title = "No content found",
  message = "Get started by creating your first piece of content.",
  actionLabel = "Create New",
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-sky/10 to-blue-100 rounded-full flex items-center justify-center">
            <ApperIcon name={icon} size={32} className="text-sky" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-semibold font-display text-charcoal">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
        
        {onAction && (
          <Button onClick={onAction} className="mx-auto">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;