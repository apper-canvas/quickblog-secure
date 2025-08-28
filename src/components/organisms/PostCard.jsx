import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const PostCard = ({ post, onDelete, className }) => {
  const navigate = useNavigate();
  
  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/editor/${post.Id}`);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(post.Id);
  };
  
  const handleCardClick = () => {
    navigate(`/editor/${post.Id}`);
  };
  
  return (
    <Card 
      hover 
      onClick={handleCardClick}
      className={cn("group overflow-hidden", className)}
    >
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <StatusBadge status={post.status} />
              {post.readTime && (
                <Badge variant="outline" className="text-xs">
                  {post.readTime} min read
                </Badge>
              )}
            </div>
            
            <h3 className="text-xl font-semibold font-display text-charcoal line-clamp-2 group-hover:text-sky transition-colors duration-200">
              {post.title}
            </h3>
            
            {post.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="p-2"
            >
              <ApperIcon name="Edit3" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-2 hover:text-error"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Tag" size={14} />
                <span>{post.tags.slice(0, 2).join(", ")}</span>
                {post.tags.length > 2 && (
                  <span>+{post.tags.length - 2}</span>
                )}
              </div>
            )}
            
            {post.views > 0 && (
              <div className="flex items-center space-x-1">
                <ApperIcon name="Eye" size={14} />
                <span>{post.views}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={14} />
            <span>
              {post.status === "published" && post.publishDate
                ? format(new Date(post.publishDate), "MMM d, yyyy")
                : format(new Date(post.updatedAt), "MMM d, yyyy")
              }
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;