import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PostCard from "@/components/organisms/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { postService } from "@/services/api/postService";
import { commentService } from "@/services/api/commentService";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [postsData, commentsData] = await Promise.all([
        postService.getAll(),
        commentService.getAll()
      ]);
      setPosts(postsData);
      setComments(commentsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      await postService.delete(postId);
      setPosts(posts.filter(post => post.Id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
      console.error(err);
    }
  };
  
  const handleCreatePost = () => {
    navigate("/editor");
  };
  
  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  // Dashboard stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.status === "published").length;
  const draftPosts = posts.filter(post => post.status === "draft").length;
  const pendingComments = comments.filter(comment => comment.status === "pending").length;
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  
  // Recent posts (latest 6)
  const recentPosts = posts
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);
  
  // Recent comments (latest 5)
  const recentComments = comments
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal">
            Welcome back!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your blog today.
          </p>
        </div>
        
        <Button onClick={handleCreatePost} className="w-fit">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Post
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-charcoal mt-1">{totalPosts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sky/10 to-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={24} className="text-sky" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-charcoal mt-1">{publishedPosts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Globe" size={24} className="text-success" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-charcoal mt-1">{draftPosts}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-warning/10 to-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Edit3" size={24} className="text-warning" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-charcoal mt-1">{totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Eye" size={24} className="text-info" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Posts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-display text-charcoal">
              Recent Posts
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/posts")}
            >
              View all
              <ApperIcon name="ArrowRight" size={16} className="ml-1" />
            </Button>
          </div>
          
          {recentPosts.length === 0 ? (
            <Empty
              icon="FileText"
              title="No posts yet"
              message="Start writing your first blog post to get your audience engaged."
              actionLabel="Create First Post"
              onAction={handleCreatePost}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {recentPosts.map(post => (
                <PostCard
                  key={post.Id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-charcoal mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleCreatePost}
              >
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create New Post
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate("/media")}
              >
                <ApperIcon name="Image" size={16} className="mr-2" />
                Upload Media
</Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate("/analytics")}
              >
                <ApperIcon name="BarChart3" size={16} className="mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => navigate("/versions")}
              >
                <ApperIcon name="History" size={16} className="mr-2" />
                View Version History
              </Button>
            </div>
          </Card>
          
          {/* Recent Comments */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-charcoal">Recent Comments</h3>
              {pendingComments > 0 && (
                <Badge variant="warning">{pendingComments} pending</Badge>
              )}
            </div>
            
            {recentComments.length === 0 ? (
              <div className="text-center py-4">
                <ApperIcon name="MessageCircle" size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No comments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentComments.map(comment => (
                  <div key={comment.Id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-charcoal truncate">
                            {comment.author}
                          </p>
                          <Badge 
                            variant={comment.status === "pending" ? "warning" : "success"}
                            className="text-xs"
                          >
                            {comment.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;