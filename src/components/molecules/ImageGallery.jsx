import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ImageGallery = ({ gallery, className, onEdit, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const handleImageClick = (image, index) => {
    setSelectedImage({ ...image, index });
    setShowLightbox(true);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const newIndex = direction === "next" 
      ? (selectedImage.index + 1) % gallery.images.length
      : (selectedImage.index - 1 + gallery.images.length) % gallery.images.length;
    
    const newImage = gallery.images[newIndex];
    setSelectedImage({ ...newImage, index: newIndex });
  };

  return (
    <>
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal">{gallery.title}</h3>
          {(onEdit || onDelete) && (
            <div className="flex space-x-2">
              {onEdit && (
                <Button variant="ghost" size="sm" onClick={() => onEdit(gallery)}>
                  <ApperIcon name="Edit" size={16} />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(gallery.id)} className="text-error hover:bg-error/10">
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {gallery.images.map((image, index) => (
            <div 
              key={image.id || index} 
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => handleImageClick(image, index)}
            >
              <img
                src={image.url}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <ApperIcon 
                  name="Eye" 
                  size={24} 
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                />
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {gallery.images.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Images" size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No images in this gallery</p>
          </div>
        )}
      </Card>

      {/* Lightbox */}
      {showLightbox && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation */}
            {gallery.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage("prev")}
                >
                  <ApperIcon name="ChevronLeft" size={24} />
                </Button>
                <Button
                  variant="ghost"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage("next")}
                >
                  <ApperIcon name="ChevronRight" size={24} />
                </Button>
              </>
            )}
            
            {/* Close button */}
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setShowLightbox(false)}
            >
              <ApperIcon name="X" size={24} />
            </Button>
            
            {/* Caption */}
            {selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-center">{selectedImage.caption}</p>
              </div>
            )}
            
            {/* Image counter */}
            {gallery.images.length > 1 && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                {selectedImage.index + 1} / {gallery.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;