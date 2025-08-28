import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className }) => {
  const location = useLocation();
  
  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: "LayoutDashboard" 
    },
    { 
      path: "/posts", 
      label: "Posts", 
      icon: "FileText" 
    },
    { 
      path: "/editor", 
      label: "New Post", 
      icon: "PenTool" 
    },
{ 
      path: "/media", 
      label: "Media", 
      icon: "Image" 
    },
    { 
      path: "/versions", 
      label: "Version History", 
      icon: "History" 
    },
    { 
      path: "/analytics", 
      label: "Analytics", 
      icon: "BarChart3" 
    },
    { 
      path: "/settings", 
      label: "Settings", 
      icon: "Settings" 
    }
  ];
  
  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <NavLink
        to={item.path}
        onClick={onClose}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-gradient-to-r from-sky to-blue-500 text-white shadow-md"
            : "text-slate hover:text-charcoal hover:bg-gray-100"
        )}
      >
        <ApperIcon 
          name={item.icon} 
          size={20} 
          className={cn(
            "transition-transform duration-200",
            isActive ? "text-white" : "text-slate group-hover:text-charcoal group-hover:scale-110"
          )}
        />
        <span>{item.label}</span>
      </NavLink>
    );
  };
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-gray-200",
        className
      )}>
        <div className="flex items-center px-6 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-sky to-blue-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="PenTool" size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-charcoal">QuickBlog</h1>
              <p className="text-xs text-slate">Content Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 bg-gradient-to-br from-success to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">Author</p>
              <p className="text-xs text-slate truncate">Content Creator</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "block" : "hidden"
      )}>
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className={cn(
          "absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sky to-blue-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="PenTool" size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-display text-charcoal">QuickBlog</h1>
                <p className="text-xs text-slate">Content Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} className="text-slate" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;