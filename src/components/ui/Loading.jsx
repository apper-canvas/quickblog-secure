import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg shimmer w-1/3" />
          <div className="h-4 bg-gray-200 rounded shimmer w-1/2" />
        </div>
        
        {/* Content skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 shimmer" />
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded shimmer w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded shimmer" />
                  <div className="h-4 bg-gray-200 rounded shimmer w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-gray-200 rounded shimmer w-1/4" />
                  <div className="h-4 bg-gray-200 rounded shimmer w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center justify-center py-16", className)}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-sky rounded-full animate-spin border-t-transparent"></div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-charcoal">Loading...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your content</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;