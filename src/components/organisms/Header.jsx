import React from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ title, onMenuClick, showSearch = false, onSearch, className }) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200 px-4 lg:px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold font-display text-charcoal">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block w-80">
              <SearchBar 
                placeholder="Search posts..." 
                onSearch={onSearch}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="Bell" size={20} />
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2">
              <ApperIcon name="HelpCircle" size={20} />
            </Button>
          </div>
        </div>
      </div>
      
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar 
            placeholder="Search posts..." 
            onSearch={onSearch}
          />
        </div>
      )}
    </header>
  );
};

export default Header;