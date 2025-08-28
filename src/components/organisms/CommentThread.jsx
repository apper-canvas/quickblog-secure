import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CommentThread = ({ comments, onApprove, onReject, onReply, className }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  
  const handleReply = (commentId) => {
    if (replyText.trim() && onReply) {
      onReply(commentId, replyText.trim());
      setReplyText("");
      setReplyingTo(null);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "success";
      case "pending": return "warning";
      case "spam": return "error";
      default: return "default";
    }
  };
  
  const Comment = ({ comment, isReply = false }) => (
    <Card className={cn(
      "p-4 space-y-3",
      isReply && "ml-6 border-l-2 border-sky"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Avatar
            fallback={comment.author.charAt(0).toUpperCase()}
            size="sm"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-charcoal text-sm">
                {comment.author}
              </span>
              <Badge variant={getStatusColor(comment.status)} className="text-xs">
                {comment.status}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        
        {comment.status === "pending" && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onApprove(comment.Id)}
              className="p-1 hover:text-success"
            >
              <ApperIcon name="Check" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReject(comment.Id)}
              className="p-1 hover:text-error"
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-700 leading-relaxed">
        {comment.content}
      </p>
      
      {!isReply && comment.status === "approved" && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(replyingTo === comment.Id ? null : comment.Id)}
            className="text-xs"
          >
            <ApperIcon name="Reply" size={14} className="mr-1" />
            Reply
          </Button>
        </div>
      )}
      
      {replyingTo === comment.Id && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <Textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => handleReply(comment.Id)}
              disabled={!replyText.trim()}
            >
              Post Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReplyingTo(null);
                setReplyText("");
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
  
  const organizeComments = (comments) => {
    const commentMap = {};
    const rootComments = [];
    
    comments.forEach(comment => {
      commentMap[comment.Id] = { ...comment, replies: [] };
    });
    
    comments.forEach(comment => {
      if (comment.parentId && commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies.push(commentMap[comment.Id]);
      } else {
        rootComments.push(commentMap[comment.Id]);
      }
    });
    
    return rootComments;
  };
  
  const organizedComments = organizeComments(comments);
  
  return (
    <div className={cn("space-y-4", className)}>
      {organizedComments.map(comment => (
        <div key={comment.Id} className="space-y-3">
          <Comment comment={comment} />
          {comment.replies.map(reply => (
            <Comment key={reply.Id} comment={reply} isReply />
          ))}
        </div>
      ))}
    </div>
  );
};

export default CommentThread;