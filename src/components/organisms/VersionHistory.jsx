import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { versionService } from "@/services/api/versionService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const VersionHistory = ({ 
  postId, 
  onRestoreVersion, 
  currentVersion,
  className,
  compact = false 
}) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedVersion, setExpandedVersion] = useState(null);
  const [restoring, setRestoring] = useState(null);

  const loadVersions = async () => {
    if (!postId) return;
    
    setLoading(true);
    setError("");
    
    try {
      const data = await versionService.getVersionsByPostId(postId);
      setVersions(data);
    } catch (err) {
      setError("Failed to load version history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersions();
  }, [postId]);

  const handleRestoreVersion = async (version) => {
    if (!onRestoreVersion) {
      toast.info("Restore functionality not available in this context");
      return;
    }

    setRestoring(version.Id);
    
    try {
      const restoredData = await versionService.restoreVersion(postId, version.Id);
      
      // Call the parent's restore handler
      await onRestoreVersion(restoredData);
      
      // Reload versions to show the new restoration version
      await loadVersions();
      
      toast.success(`Restored to version ${version.versionNumber}`);
    } catch (err) {
      toast.error("Failed to restore version");
      console.error(err);
    } finally {
      setRestoring(null);
    }
  };

  const handleDeleteVersion = async (version) => {
    if (!confirm(`Are you sure you want to delete version ${version.versionNumber}?`)) {
      return;
    }

    try {
      await versionService.deleteVersion(version.Id);
      setVersions(versions.filter(v => v.Id !== version.Id));
      toast.success("Version deleted successfully");
    } catch (err) {
      toast.error("Failed to delete version");
      console.error(err);
    }
  };

  const toggleVersionDetails = (versionId) => {
    setExpandedVersion(expandedVersion === versionId ? null : versionId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'scheduled': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadVersions} />;

  if (versions.length === 0) {
    return (
      <Empty
        icon="History"
        title="No version history"
        message="Versions will appear here as you make changes to your post."
        size={compact ? "sm" : "md"}
      />
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="History" size={18} className="text-slate" />
            <h3 className="font-medium text-charcoal">Version History</h3>
            <Badge variant="secondary" size="sm">{versions.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={loadVersions}>
            <ApperIcon name="RefreshCw" size={14} className="mr-1" />
            Refresh
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {versions.map((version, index) => (
          <Card key={version.Id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-sky rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {version.versionNumber}
                    </div>
                    <span className="text-sm font-medium text-charcoal">
                      Version {version.versionNumber}
                    </span>
                  </div>
                  
                  {index === 0 && (
                    <Badge variant="success" size="sm">Current</Badge>
                  )}
                  
                  <Badge 
                    variant={getStatusColor(version.status)} 
                    size="sm"
                  >
                    {version.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate mb-2">
                  {version.changeDescription}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="Clock" size={12} />
                    <span>{formatDate(version.createdAt)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="User" size={12} />
                    <span>{version.createdBy}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="FileText" size={12} />
                    <span>{version.wordCount} words</span>
                  </span>
                </div>

                {expandedVersion === version.Id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-charcoal">Title:</span>
                        <p className="text-slate mt-1 truncate">{version.title}</p>
                      </div>
                      <div>
                        <span className="font-medium text-charcoal">Excerpt:</span>
                        <p className="text-slate mt-1 line-clamp-2">{version.excerpt}</p>
                      </div>
                    </div>
                    
                    {version.tags && version.tags.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-charcoal">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {version.tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Content: {version.characterCount} characters
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVersionDetails(version.Id)}
                  className="p-2"
                >
                  <ApperIcon 
                    name={expandedVersion === version.Id ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </Button>

                {index > 0 && onRestoreVersion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRestoreVersion(version)}
                    disabled={restoring === version.Id}
                    className="p-2"
                  >
                    {restoring === version.Id ? (
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      <ApperIcon name="RotateCcw" size={16} />
                    )}
                  </Button>
                )}

                {versions.length > 1 && index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVersion(version)}
                    className="p-2 text-error hover:text-error"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            </div>

            {/* Timeline connector */}
            {index < versions.length - 1 && (
              <div className="absolute left-8 mt-2 w-px h-4 bg-gray-200" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VersionHistory;