import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import TagInput from "@/components/molecules/TagInput";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PublishPanel = ({ 
  post, 
  onPublish, 
  onSchedule, 
  onSaveDraft,
  isOpen,
  onClose,
  className 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    slug: "",
    tags: [],
    category: "",
    metaTitle: "",
    metaDescription: "",
    publishDate: "",
    status: "draft"
  });
  
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        slug: post.slug || "",
        tags: post.tags || [],
        category: post.category || "",
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        publishDate: post.publishDate || "",
        status: post.status || "draft"
      });
    }
  }, [post]);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
  
  useEffect(() => {
    if (formData.title && !formData.slug) {
      handleChange("slug", generateSlug(formData.title));
    }
  }, [formData.title]);
  
  const tagSuggestions = [
    "Technology", "Web Development", "JavaScript", "React", "Tutorial",
    "Tips", "Best Practices", "Programming", "Design", "UX", "Performance",
    "Security", "Mobile", "Frontend", "Backend", "Database", "API"
  ];
  
  const categories = [
    "Technology", "Business", "Design", "Marketing", "Tutorial",
    "News", "Opinion", "Review", "Guide", "Tips"
  ];
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full",
        className
      )}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-charcoal">
              Publish Settings
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-charcoal">Post Details</h3>
            
            <FormField
              label="Title"
              required
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter post title..."
            />
            
            <FormField
              label="URL Slug"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="url-friendly-slug"
            />
            
            <FormField
              label="Excerpt"
              type="textarea"
              value={formData.excerpt}
              onChange={(e) => handleChange("excerpt", e.target.value)}
              placeholder="Brief description of your post..."
            />
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Tags
              </label>
              <TagInput
                tags={formData.tags}
                onTagsChange={(tags) => handleChange("tags", tags)}
                suggestions={tagSuggestions}
                placeholder="Add tags..."
              />
            </div>
          </div>
          
          {/* SEO Settings */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-charcoal">SEO Settings</h3>
            
            <FormField
              label="Meta Title"
              value={formData.metaTitle}
              onChange={(e) => handleChange("metaTitle", e.target.value)}
              placeholder="SEO title (leave blank to use post title)"
            />
            
            <FormField
              label="Meta Description"
              type="textarea"
              value={formData.metaDescription}
              onChange={(e) => handleChange("metaDescription", e.target.value)}
              placeholder="SEO description..."
              className="min-h-[80px]"
            />
          </div>
          
          {/* Scheduling */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-charcoal">Publishing</h3>
<FormField
              label="Schedule for later (optional)"
              type="datepicker"
              value={formData.publishDate}
              onChange={(value) => handleChange("publishDate", value)}
              placeholder="Select publication date..."
              minDate={new Date()}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 space-y-3">
          <Button
            onClick={() => onPublish(formData)}
            disabled={!formData.title.trim()}
            className="w-full"
          >
            <ApperIcon name="Globe" size={16} className="mr-2" />
            {formData.publishDate ? "Schedule Post" : "Publish Now"}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => onSaveDraft(formData)}
              className="w-full"
            >
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Draft
            </Button>
            
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublishPanel;