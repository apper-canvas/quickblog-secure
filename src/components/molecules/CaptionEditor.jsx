import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CaptionEditor = ({ 
  initialCaption = "", 
  onSave, 
  onCancel, 
  placeholder = "Add a caption...",
  className 
}) => {
  const [caption, setCaption] = useState(initialCaption);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(caption.trim());
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setCaption(initialCaption);
    if (onCancel) onCancel();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Textarea
        placeholder={placeholder}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="min-h-[80px] resize-none"
      />
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {caption.length}/500 characters
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || caption.length > 500}
          >
            {isSaving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Check" size={16} className="mr-2" />
                Save Caption
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaptionEditor;