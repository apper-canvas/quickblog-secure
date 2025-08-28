import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { mediaService } from "@/services/api/mediaService";
import { cn } from "@/utils/cn";

const MediaSelector = ({ 
  onSelect, 
  onCancel, 
  multiple = true, 
  filter = "image",
  className 
}) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getAll();
      const filteredData = filter ? data.filter(item => item.type === filter) : data;
      setMedia(filteredData);
      setError(null);
    } catch (err) {
      setError("Failed to load media");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaToggle = (mediaItem) => {
    if (multiple) {
      setSelectedMedia(prev => {
        const exists = prev.find(item => item.Id === mediaItem.Id);
        return exists 
          ? prev.filter(item => item.Id !== mediaItem.Id)
          : [...prev, mediaItem];
      });
    } else {
      setSelectedMedia([mediaItem]);
    }
  };

  const handleSelect = () => {
    if (selectedMedia.length === 0) {
      toast.error("Please select at least one media item");
      return;
    }
    
    if (onSelect) {
      onSelect(selectedMedia);
    }
  };

  const filteredMedia = media.filter(item =>
    item.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.alt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMedia} />;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">
          Select Media {filter && `(${filter}s only)`}
        </h3>
        <Button variant="ghost" onClick={onCancel}>
          <ApperIcon name="X" size={16} />
        </Button>
      </div>
      
      <SearchBar
        placeholder="Search media files..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      
      {filteredMedia.length === 0 ? (
        <Empty 
          title="No media found"
          description={searchQuery ? "Try adjusting your search" : "Upload some files to get started"}
        />
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto">
          {filteredMedia.map(item => {
            const isSelected = selectedMedia.find(selected => selected.Id === item.Id);
            
            return (
              <Card
                key={item.Id}
                className={cn(
                  "relative aspect-square cursor-pointer transition-all duration-200 hover:scale-105",
                  isSelected ? "ring-2 ring-sky bg-sky/10" : "hover:shadow-md"
                )}
                onClick={() => handleMediaToggle(item)}
              >
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.alt || item.filename}
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-sky rounded-full flex items-center justify-center">
                    <ApperIcon name="Check" size={12} className="text-white" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-xs truncate">{item.filename}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-600">
          {selectedMedia.length} selected {multiple ? `(${multiple ? 'multiple' : 'single'} selection)` : ''}
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect} 
            disabled={selectedMedia.length === 0}
          >
            <ApperIcon name="Check" size={16} className="mr-2" />
            {multiple ? `Select ${selectedMedia.length} Items` : 'Select Item'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MediaSelector;