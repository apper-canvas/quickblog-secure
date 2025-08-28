import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your content. Please try again.",
  onRetry,
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-error/10 to-red-100 rounded-full flex items-center justify-center">
            <ApperIcon name="AlertTriangle" size={32} className="text-error" />
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
        
        {onRetry && (
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button onClick={onRetry}>
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Try Again
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.reload()}
            >
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Refresh Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Error;