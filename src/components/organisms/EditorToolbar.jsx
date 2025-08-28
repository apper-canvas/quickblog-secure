import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const EditorToolbar = ({ 
  editorMode, 
  onModeChange, 
  onFormat, 
  onInsertMedia, 
  onSave,
  onToggleAI,
  showAI = false,
  isSaving = false,
  className 
}) => {
  const formatOptions = [
    { action: "bold", icon: "Bold", label: "Bold" },
    { action: "italic", icon: "Italic", label: "Italic" },
    { action: "underline", icon: "Underline", label: "Underline" },
    { action: "separator" },
    { action: "heading1", icon: "Heading1", label: "Heading 1" },
    { action: "heading2", icon: "Heading2", label: "Heading 2" },
    { action: "heading3", icon: "Heading3", label: "Heading 3" },
    { action: "separator" },
    { action: "bulletList", icon: "List", label: "Bullet List" },
    { action: "numberedList", icon: "ListOrdered", label: "Numbered List" },
    { action: "quote", icon: "Quote", label: "Quote" },
    { action: "separator" },
    { action: "link", icon: "Link", label: "Link" },
    { action: "image", icon: "Image", label: "Image" }
  ];
  
  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-white border-b border-gray-200",
      className
    )}>
      <div className="flex items-center space-x-2">
        {/* Editor Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <Button
            variant={editorMode === "visual" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onModeChange("visual")}
            className="px-3 py-1 text-xs"
          >
            <ApperIcon name="Eye" size={14} className="mr-1" />
            Visual
          </Button>
          <Button
            variant={editorMode === "markdown" ? "primary" : "ghost"}
            size="sm"
            onClick={() => onModeChange("markdown")}
            className="px-3 py-1 text-xs"
          >
            <ApperIcon name="FileText" size={14} className="mr-1" />
            Markdown
          </Button>
        </div>
        
        {/* Formatting Tools (only in visual mode) */}
        {editorMode === "visual" && (
          <div className="flex items-center space-x-1 ml-4">
            {formatOptions.map((option, index) => {
              if (option.action === "separator") {
                return (
                  <div key={index} className="w-px h-6 bg-gray-300 mx-1" />
                );
              }
              
              return (
                <Button
                  key={option.action}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (option.action === "image") {
                      onInsertMedia();
                    } else {
                      onFormat(option.action);
                    }
                  }}
                  className="p-2"
                  title={option.label}
                >
                  <ApperIcon name={option.icon} size={16} />
                </Button>
              );
            })}
          </div>
)}
      </div>
      
      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {/* AI Assistant Toggle */}
        <div className="flex items-center border-l border-gray-200 pl-4">
          <Button
            variant={showAI ? "default" : "ghost"}
            size="sm"
            onClick={onToggleAI}
            className={cn(showAI && "bg-sky text-white")}
          >
            <ApperIcon name="Brain" size={16} className="mr-1" />
            AI Assistant
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="Save" size={14} />
          <span>Auto-saved 2 mins ago</span>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} className="mr-1" />
              Save Draft
            </>
)}
        </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;