import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const VideoEmbed = ({ video, className, onEdit, onDelete, editable = false }) => {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(video.caption || "");

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleSaveCaption = () => {
    if (onEdit) {
      onEdit({ ...video, caption });
    }
    setEditing(false);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative aspect-video bg-gray-100">
        <iframe
          src={getEmbedUrl(video.url)}
          title={`${video.type} video`}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-black/60 text-white hover:bg-black/80"
                onClick={() => setEditing(!editing)}
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-black/60 text-white hover:bg-red-600"
                onClick={() => onDelete(video.id)}
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            )}
          </div>
        )}
        
        {/* Video type indicator */}
        <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center">
          <ApperIcon name="Video" size={12} className="mr-1" />
          {video.type.charAt(0).toUpperCase() + video.type.slice(1)}
        </div>
      </div>
      
      {/* Caption */}
      <div className="p-4">
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Video URL</label>
              <Input 
                value={video.url} 
                readOnly 
                className="bg-gray-50" 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Caption</label>
              <Textarea
                placeholder="Add a caption for this video..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={handleSaveCaption}>
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setEditing(false);
                  setCaption(video.caption || "");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {video.caption && (
              <p className="text-sm text-gray-700 leading-relaxed">{video.caption}</p>
            )}
            {!video.caption && editable && (
              <p className="text-sm text-gray-400 italic">No caption added</p>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default VideoEmbed;