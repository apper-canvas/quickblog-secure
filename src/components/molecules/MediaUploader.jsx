import React, { useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MediaUploader = ({ 
  onUpload, 
  accept = "image/*,video/*", 
  multiple = false,
  className,
  allowCaptions = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = "";
  };
  
const handleFiles = async (files) => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const filesWithCaptions = allowCaptions 
        ? Array.from(files).map(file => ({ file, caption: "" }))
        : files;
      await onUpload(filesWithCaptions);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };
  
return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          isDragging 
            ? "border-sky bg-sky/5 scale-[1.02]" 
            : "border-gray-300 hover:border-sky hover:bg-sky/5"
        )}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-gradient-to-br from-sky/10 to-blue-100 rounded-full">
            <ApperIcon 
              name={uploading ? "Loader2" : allowCaptions ? "ImagePlus" : "Upload"} 
              size={32} 
              className={cn(
                "text-sky",
                uploading && "animate-spin"
              )} 
            />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-charcoal">
              {uploading ? "Uploading files..." : allowCaptions ? "Add images to gallery" : "Drop files here"}
            </p>
            <p className="text-sm text-gray-600">
              or click to browse your computer
            </p>
            <p className="text-xs text-gray-500">
              {allowCaptions ? "Upload images with captions for your gallery" : "Supports images and videos up to 10MB"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <ApperIcon name="FolderOpen" size={16} className="mr-2" />
          Choose Files
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default MediaUploader;