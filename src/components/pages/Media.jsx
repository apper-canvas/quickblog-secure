import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { mediaService } from "@/services/api/mediaService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import MediaUploader from "@/components/molecules/MediaUploader";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
const [showUploader, setShowUploader] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [editingCaption, setEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState("");
  const loadMedia = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await mediaService.getAll();
      setMedia(data);
      setFilteredMedia(data);
    } catch (err) {
      setError("Failed to load media");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMedia();
  }, []);
  
  // Filter media based on search and type
  useEffect(() => {
    let filtered = media;
    
    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.alt?.toLowerCase().includes(query) ||
        item.filename?.toLowerCase().includes(query)
      );
    }
    
    // Sort by most recent
    filtered = filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    setFilteredMedia(filtered);
  }, [media, searchQuery, typeFilter]);
  
  const handleSearch = (query) => {
setSearchQuery(query);
  };
  
  const handleUpload = async (files) => {
    try {
      const uploadPromises = files.map(file => mediaService.create(file));
      const uploadedMedia = await Promise.all(uploadPromises);
      
      setMedia(prev => [...uploadedMedia, ...prev]);
      setShowUploader(false);
      toast.success(`${uploadedMedia.length} file(s) uploaded successfully`);
    } catch (err) {
      toast.error("Failed to upload media");
      console.error(err);
    }
  };

  const handleCaptionSave = async () => {
    if (!selectedMedia) return;
    
    try {
      const updatedMedia = { ...selectedMedia, caption: captionText };
      await mediaService.update(selectedMedia.Id, updatedMedia);
      
      setMedia(prev => prev.map(m => m.Id === selectedMedia.Id ? updatedMedia : m));
      setSelectedMedia(updatedMedia);
      setEditingCaption(false);
      toast.success("Caption updated successfully");
    } catch (err) {
      toast.error("Failed to update caption");
      console.error(err);
    }
  };
  
  const handleDelete = async (mediaId) => {
    if (!window.confirm("Are you sure you want to delete this media file?")) return;
    
    try {
      await mediaService.delete(mediaId);
      setMedia(prev => prev.filter(item => item.Id !== mediaId));
      setSelectedMedia(null);
      toast.success("Media deleted successfully");
    } catch (err) {
      toast.error("Failed to delete media");
      console.error(err);
    }
  };
  
  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  
  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadMedia} />;
  
  // Media statistics
  const totalFiles = media.length;
  const imageCount = media.filter(item => item.type === "image").length;
  const videoCount = media.filter(item => item.type === "video").length;
  const totalSize = media.reduce((sum, item) => sum + (item.size || 0), 0);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal">Media Library</h1>
          <p className="text-gray-600 mt-1">
            Manage your images, videos, and other media files
          </p>
        </div>
        
        <Button onClick={() => setShowUploader(!showUploader)}>
          <ApperIcon name="Upload" size={16} className="mr-2" />
          Upload Media
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-charcoal">{totalFiles}</p>
            <p className="text-sm text-gray-600">Total Files</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-sky">{imageCount}</p>
            <p className="text-sm text-gray-600">Images</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{videoCount}</p>
            <p className="text-sm text-gray-600">Videos</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{formatFileSize(totalSize)}</p>
            <p className="text-sm text-gray-600">Total Size</p>
          </div>
        </div>
      </div>
      
      {/* Upload Area */}
      {showUploader && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-charcoal">Upload New Media</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUploader(false)}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
          <MediaUploader
            onUpload={handleUpload}
            multiple
          />
        </Card>
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search media files..."
            onSearch={handleSearch}
            value={searchQuery}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
          >
            <option value="all">All Media</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>
      </div>
      
      {/* Results Summary */}
      {(searchQuery || typeFilter !== "all") && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Search" size={16} className="text-blue-600" />
            <span className="text-sm text-blue-800">
              {filteredMedia.length} {filteredMedia.length === 1 ? "file" : "files"} found
              {searchQuery && ` for "${searchQuery}"`}
              {typeFilter !== "all" && ` of type "${typeFilter}"`}
            </span>
          </div>
          
          {(searchQuery || typeFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
      
      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        searchQuery || typeFilter !== "all" ? (
          <Empty
            icon="Search"
            title="No media files match your criteria"
            message="Try adjusting your search terms or filters to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setTypeFilter("all");
            }}
          />
        ) : (
          <Empty
            icon="Image"
            title="No media files yet"
            message="Upload your first images or videos to get started with your media library."
            actionLabel="Upload Media"
            onAction={() => setShowUploader(true)}
          />
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredMedia.map(item => (
            <Card
              key={item.Id}
              hover
              onClick={() => setSelectedMedia(item)}
              className="group overflow-hidden"
            >
              <div className="aspect-square relative bg-gray-100">
                {item.type === "image" ? (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ApperIcon name="Video" size={32} className="text-gray-400" />
                  </div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Badge variant="primary" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              </div>
              
              <div className="p-3">
                <p className="text-sm font-medium text-charcoal truncate">
                  {item.filename || `${item.type}_${item.Id}`}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(item.size)} • {format(new Date(item.uploadedAt), "MMM d, yyyy")}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-charcoal">Media Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMedia(null)}
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
            
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Media Preview */}
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                {selectedMedia.type === "image" ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.alt}
                    className="max-w-full max-h-64 mx-auto rounded"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center">
                    <ApperIcon name="Video" size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Media Info */}
<div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Filename</label>
                  <p className="text-charcoal">{selectedMedia.filename || `${selectedMedia.type}_${selectedMedia.Id}`}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">URL</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-charcoal text-sm truncate flex-1">{selectedMedia.url}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMedia.url)}
                    >
                      <ApperIcon name="Copy" size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Caption Editor */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Caption</label>
                  {editingCaption ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a caption for this media..."
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={handleCaptionSave}>
                          Save Caption
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setEditingCaption(false);
                            setCaptionText(selectedMedia.caption || "");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <p className="text-charcoal flex-1">
                        {selectedMedia.caption || "No caption"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCaption(true);
                          setCaptionText(selectedMedia.caption || "");
                        }}
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="text-charcoal">{selectedMedia.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Size</label>
                    <p className="text-charcoal">{formatFileSize(selectedMedia.size)}</p>
                  </div>
                </div>
                
                {selectedMedia.dimensions && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dimensions</label>
                    <p className="text-charcoal">
                      {selectedMedia.dimensions.width} × {selectedMedia.dimensions.height}
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Uploaded</label>
                  <p className="text-charcoal">
                    {format(new Date(selectedMedia.uploadedAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
            
<div className="p-4 border-t border-gray-200 flex justify-between">
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedMedia.Id)}
                disabled={editingCaption}
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Delete
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => copyToClipboard(selectedMedia.url)}
                  disabled={editingCaption}
                >
                  <ApperIcon name="Copy" size={16} className="mr-2" />
                  Copy URL
                </Button>
                <Button
                  onClick={() => copyToClipboard(`![${selectedMedia.caption || selectedMedia.alt || 'Image'}](${selectedMedia.url})`)}
                  disabled={editingCaption}
                >
                  <ApperIcon name="Code" size={16} className="mr-2" />
                  Copy Markdown
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;