import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusBadge = ({ status, className }) => {
  const statusConfig = {
    draft: {
      variant: "outline",
      icon: "Edit3",
      label: "Draft"
    },
    published: {
      variant: "success",
      icon: "Globe",
      label: "Published"
    },
    scheduled: {
      variant: "warning",
      icon: "Clock",
      label: "Scheduled"
    }
  };
  
  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} className={className}>
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {config.label}
    </Badge>
  );
};

export default StatusBadge;