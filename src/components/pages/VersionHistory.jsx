import React from "react";
import { useParams } from "react-router-dom";
import VersionHistoryComponent from "@/components/organisms/VersionHistory";

const VersionHistoryPage = () => {
  const { postId } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-charcoal">Version History</h1>
        <p className="text-gray-600 mt-1">
          {postId ? "View and manage versions for this post" : "View version history for your posts"}
        </p>
      </div>

      <VersionHistoryComponent 
        postId={postId ? parseInt(postId) : null}
        onRestoreVersion={null} // Restoration not available on standalone page
      />
    </div>
  );
};

export default VersionHistoryPage;