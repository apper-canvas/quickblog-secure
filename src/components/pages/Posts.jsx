import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import PostCard from "@/components/organisms/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { postService } from "@/services/api/postService";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  
  const loadPosts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await postService.getAll();
      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      setError("Failed to load posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, []);
  
  // Filter posts based on search and status
  useEffect(() => {
    let filtered = posts;
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(post => post.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Sort by most recent
    filtered = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    
    setFilteredPosts(filtered);
  }, [posts, searchQuery, statusFilter]);
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
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
  if (error) return <Error message={error} onRetry={loadPosts} />;
  
  // Post statistics
  const totalPosts = posts.length;
  const publishedCount = posts.filter(post => post.status === "published").length;
  const draftCount = posts.filter(post => post.status === "draft").length;
  const scheduledCount = posts.filter(post => post.status === "scheduled").length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal">Posts</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your blog content
          </p>
        </div>
        
        <Button onClick={handleCreatePost}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Post
        </Button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-charcoal">{totalPosts}</p>
            <p className="text-sm text-gray-600">Total Posts</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{publishedCount}</p>
            <p className="text-sm text-gray-600">Published</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{draftCount}</p>
            <p className="text-sm text-gray-600">Drafts</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-info">{scheduledCount}</p>
            <p className="text-sm text-gray-600">Scheduled</p>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search posts by title, content, or tags..."
            onSearch={handleSearch}
            value={searchQuery}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>
      
      {/* Results Summary */}
      {(searchQuery || statusFilter !== "all") && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Search" size={16} className="text-blue-600" />
            <span className="text-sm text-blue-800">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
              {searchQuery && ` for "${searchQuery}"`}
              {statusFilter !== "all" && ` with status "${statusFilter}"`}
            </span>
          </div>
          
          {(searchQuery || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}
      
      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        searchQuery || statusFilter !== "all" ? (
          <Empty
            icon="Search"
            title="No posts match your criteria"
            message="Try adjusting your search terms or filters to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
          />
        ) : (
          <Empty
            icon="FileText"
            title="No posts yet"
            message="Start creating engaging content for your blog. Your first post is just a click away!"
            actionLabel="Create First Post"
            onAction={handleCreatePost}
          />
        )
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map(post => (
            <PostCard
              key={post.Id}
              post={post}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;