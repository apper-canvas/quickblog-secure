import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { postService } from "@/services/api/postService";
import { mediaService } from "@/services/api/mediaService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import VideoEmbed from "@/components/molecules/VideoEmbed";
import MediaUploader from "@/components/molecules/MediaUploader";
import ImageGallery from "@/components/molecules/ImageGallery";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Media from "@/components/pages/Media";
import EditorToolbar from "@/components/organisms/EditorToolbar";
import AIAssistant from "@/components/organisms/AIAssistant";
import PublishPanel from "@/components/organisms/PublishPanel";
import VersionHistory from "@/components/organisms/VersionHistory";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    featuredImage: "",
    tags: [],
    category: "",
    status: "draft",
    galleries: [],
    videoEmbeds: [],
    captions: {}
  });
const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
  const [editorMode, setEditorMode] = useState("visual");
const [publishPanelOpen, setPublishPanelOpen] = useState(false);
const [showMediaUploader, setShowMediaUploader] = useState(false);
const [showMediaSelector, setShowMediaSelector] = useState(false);
const [showAIAssistant, setShowAIAssistant] = useState(false);
const [showVersionHistory, setShowVersionHistory] = useState(false);
// Load post data if editing
  useEffect(() => {
    if (isEditing) {
      loadPost();
    }
  }, [id]);
  
  const loadPost = async () => {
    setLoading(true);
    setError("");
    
    try {
      const postData = await postService.getById(parseInt(id));
      setPost(postData);
    } catch (err) {
      setError("Failed to load post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setPost(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      const postData = {
        ...post,
        updatedAt: new Date().toISOString()
      };
      
      if (isEditing) {
        await postService.update(parseInt(id), postData);
        toast.success("Post saved successfully");
      } else {
        const newPost = await postService.create({
          ...postData,
          createdAt: new Date().toISOString()
        });
        navigate(`/editor/${newPost.Id}`, { replace: true });
        toast.success("Post created successfully");
      }
    } catch (err) {
      toast.error("Failed to save post");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  const handlePublish = async (publishData) => {
    setSaving(true);
    
    try {
      const postData = {
        ...post,
        ...publishData,
        status: publishData.publishDate ? "scheduled" : "published",
        publishDate: publishData.publishDate || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (isEditing) {
        await postService.update(parseInt(id), postData);
      } else {
        const newPost = await postService.create({
          ...postData,
          createdAt: new Date().toISOString()
        });
        navigate(`/editor/${newPost.Id}`, { replace: true });
      }
      
      setPost(postData);
      setPublishPanelOpen(false);
      toast.success(
        postData.status === "scheduled" 
          ? "Post scheduled successfully" 
          : "Post published successfully"
      );
    } catch (err) {
      toast.error("Failed to publish post");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
const handleMediaUpload = async (files) => {
    try {
      const uploadPromises = files.map(file => mediaService.create(file));
      const uploadedMedia = await Promise.all(uploadPromises);
      
      // Insert the first uploaded image into content
      if (uploadedMedia.length > 0) {
        const imageMarkdown = `\n![${uploadedMedia[0].alt || "Image"}](${uploadedMedia[0].url})\n`;
        handleInputChange("content", post.content + imageMarkdown);
      }
      
      setShowMediaUploader(false);
      toast.success(`${uploadedMedia.length} file(s) uploaded successfully`);
    } catch (err) {
      toast.error("Failed to upload media");
      console.error(err);
    }
  };

  const handleAddGallery = () => {
    setShowMediaSelector(true);
  };

  const handleAddVideoEmbed = () => {
    const url = prompt("Enter YouTube or Vimeo URL:");
    if (url && (url.includes('youtube.com') || url.includes('vimeo.com'))) {
      const videoEmbed = {
        id: Date.now(),
        url,
        type: url.includes('youtube.com') ? 'youtube' : 'vimeo',
        caption: ""
      };
      handleInputChange("videoEmbeds", [...post.videoEmbeds, videoEmbed]);
      toast.success("Video embed added successfully");
    } else if (url) {
      toast.error("Please enter a valid YouTube or Vimeo URL");
    }
  };

  const handleGalleryCreate = (selectedMedia) => {
    if (selectedMedia.length > 0) {
      const gallery = {
        id: Date.now(),
        title: `Gallery ${post.galleries.length + 1}`,
        images: selectedMedia.map(media => ({
          id: media.Id,
          url: media.url,
          alt: media.alt || "",
          caption: ""
        }))
      };
      handleInputChange("galleries", [...post.galleries, gallery]);
      setShowMediaSelector(false);
      toast.success("Gallery created successfully");
    }
  };
  
  const handleFormat = (action) => {
    // Basic formatting for visual mode
    // In a real app, this would integrate with a rich text editor
    console.log("Format action:", action);
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPost} />;
  
return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
{/* Toolbar */}
      <EditorToolbar
        editorMode={editorMode}
        onModeChange={setEditorMode}
onFormat={handleFormat}
        onInsertMedia={() => setShowMediaUploader(!showMediaUploader)}
        onAddGallery={handleAddGallery}
        onAddVideoEmbed={handleAddVideoEmbed}
        onSave={handleSave}
        onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
        showAI={showAIAssistant}
        onToggleVersions={() => setShowVersionHistory(!showVersionHistory)}
        showVersions={showVersionHistory}
        isSaving={saving}
      />
      
      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col bg-white">
          {/* Title */}
          <div className="p-6 border-b border-gray-200">
            <Input
              placeholder="Enter your post title..."
              value={post.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="text-2xl font-bold font-display border-0 px-0 py-0 focus:ring-0 placeholder:text-gray-400"
            />
          </div>
          
          {/* Content Editor */}
          <div className="flex-1 overflow-y-auto">
            {showMediaUploader ? (
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-charcoal">Upload Media</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMediaUploader(false)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
                <MediaUploader
                  onUpload={handleMediaUpload}
                  multiple
                />
              </div>
            ) : (
<div className="h-full">
                {editorMode === "visual" ? (
                  <div className="p-6 h-full space-y-6">
                    <Textarea
                      placeholder="Start writing your post..."
                      value={post.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      className="w-full h-64 border-0 focus:ring-0 resize-none text-base leading-relaxed"
                    />
                    
                    {/* Galleries */}
{(post.galleries?.length || 0) > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-charcoal">Galleries</h3>
                        {post.galleries.map(gallery => (
                          <ImageGallery key={gallery.id} gallery={gallery} />
                        ))}
                      </div>
                    )}
                    
                    {/* Video Embeds */}
{(post.videoEmbeds?.length || 0) > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-charcoal">Video Embeds</h3>
                        {post.videoEmbeds.map(video => (
                          <VideoEmbed key={video.id} video={video} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 h-full">
                    {/* Markdown Editor */}
                    <div className="border-r border-gray-200 p-6">
                      <Textarea
                        placeholder="Write in Markdown..."
                        value={post.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        className="w-full h-full border-0 focus:ring-0 resize-none font-mono text-sm"
                      />
                    </div>
                    
                    {/* Preview */}
                    <div className="p-6 overflow-y-auto bg-gray-50">
                      <div className="prose prose-sm max-w-none space-y-6">
                        <div 
                          className="editor-content"
                          dangerouslySetInnerHTML={{
                            __html: post.content
                              .replace(/\n/g, "<br />")
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.*?)\*/g, "<em>$1</em>")
                          }}
                        />
                        
                        {/* Preview Galleries */}
{(post.galleries || []).map(gallery => (
                          <ImageGallery key={gallery.id} gallery={gallery} />
                        ))}
                        
                        {/* Preview Video Embeds */}
                        {post.videoEmbeds.map(video => (
                          <VideoEmbed key={video.id} video={video} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
{/* Action Panel */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
          {/* AI Assistant Panel */}
          {showAIAssistant && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Brain" size={18} />
                <h3 className="font-medium text-charcoal">AI Assistant</h3>
              </div>
              <AIAssistant
                content={post.content}
                onApplyTitle={(title) => {
                  handleInputChange("title", title);
                  toast.success("Title applied successfully");
                }}
                onApplyExcerpt={(excerpt) => {
                  handleInputChange("excerpt", excerpt);
                  toast.success("Summary applied successfully");
                }}
                onApplyTags={(tags) => {
                  const currentTags = post.tags || [];
                  const newTags = Array.isArray(tags) ? tags : [tags];
                  const uniqueTags = [...new Set([...currentTags, ...newTags])];
                  handleInputChange("tags", uniqueTags);
                  toast.success(`${newTags.length} keyword(s) added`);
                }}
              />
            </div>
)}

          {/* Version History Panel */}
          {showVersionHistory && isEditing && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="History" size={18} />
                  <h3 className="font-medium text-charcoal">Version History</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVersionHistory(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <VersionHistory
                postId={parseInt(id)}
                onRestoreVersion={async (restoredData) => {
                  setPost(prevPost => ({
                    ...prevPost,
                    title: restoredData.title,
                    content: restoredData.content,
                    excerpt: restoredData.excerpt,
                    status: restoredData.status,
                    tags: restoredData.tags,
                    updatedAt: new Date().toISOString()
                  }));
                  
                  // Also update the post in the service
                  await postService.update(parseInt(id), {
                    title: restoredData.title,
                    content: restoredData.content,
                    excerpt: restoredData.excerpt,
                    status: restoredData.status,
                    tags: restoredData.tags
                  });
                }}
                compact={true}
              />
            </div>
          )}
          <div className="space-y-6">
            {/* Publish Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => setPublishPanelOpen(true)}
                disabled={!post.title.trim()}
                className="w-full"
              >
                <ApperIcon name="Globe" size={16} className="mr-2" />
                {post.status === "published" ? "Update Post" : "Publish"}
              </Button>
              
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={saving || !post.title.trim()}
                className="w-full"
              >
                {saving ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
            </div>
            
            {/* Quick Settings */}
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Excerpt
                </label>
                <Textarea
                  placeholder="Brief description..."
                  value={post.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
Featured Image URL
                </label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={post.featuredImage}
                  onChange={(e) => handleInputChange("featuredImage", e.target.value)}
                />
              </div>
              
              {/* Gallery Management */}
{(post.galleries?.length || 0) > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-charcoal">
                    Galleries ({post.galleries.length})
                  </label>
                  <div className="space-y-2">
                    {post.galleries.map((gallery, index) => (
                      <div key={gallery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="grid grid-cols-3 gap-1 w-12 h-8 overflow-hidden rounded">
                            {gallery.images.slice(0, 3).map((img, i) => (
                              <img key={i} src={img.url} alt="" className="w-full h-full object-cover" />
                            ))}
                          </div>
                          <span className="text-sm text-charcoal">{gallery.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {gallery.images.length} images
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedGalleries = post.galleries.filter((_, i) => i !== index);
                            handleInputChange("galleries", updatedGalleries);
                          }}
                          className="text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Video Embeds Management */}
{(post.videoEmbeds?.length || 0) > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-charcoal">
                    Video Embeds ({post.videoEmbeds.length})
                  </label>
                  <div className="space-y-2">
                    {post.videoEmbeds.map((video, index) => (
                      <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <ApperIcon name="Play" size={12} className="text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm text-charcoal capitalize">{video.type} Video</p>
                            <p className="text-xs text-gray-500 truncate max-w-40">{video.url}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedVideos = post.videoEmbeds.filter((_, i) => i !== index);
                            handleInputChange("videoEmbeds", updatedVideos);
                          }}
                          className="text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
)}
            </div>
            
            {/* Post Info */}
            {isEditing && (
              <div className="pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={14} />
                  <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={14} />
                  <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                </div>
                {post.views > 0 && (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Eye" size={14} />
                    <span>Views: {post.views}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Publish Panel */}
      <PublishPanel
        post={post}
        isOpen={publishPanelOpen}
        onClose={() => setPublishPanelOpen(false)}
        onPublish={handlePublish}
        onSaveDraft={handleSave}
      />
    </div>
  );
};

export default Editor;