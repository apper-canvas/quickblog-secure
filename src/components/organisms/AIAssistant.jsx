import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { aiService } from "@/services/api/aiService";
import { cn } from "@/utils/cn";

const AIAssistant = ({ content, onApplyTitle, onApplyExcerpt, onApplyTags, className }) => {
  const [suggestions, setSuggestions] = useState({
    titles: [],
    summaries: [],
    keywords: []
  });
  const [loading, setLoading] = useState({
    titles: false,
    summaries: false,
    keywords: false
  });
  const [expandedSections, setExpandedSections] = useState({
    titles: true,
    summaries: false,
    keywords: false
  });

  // Generate suggestions when content changes
  useEffect(() => {
    if (content && content.length > 50) {
      generateAllSuggestions();
    }
  }, [content]);

  const generateAllSuggestions = async () => {
    await Promise.all([
      generateSuggestions('titles'),
      generateSuggestions('summaries'),
      generateSuggestions('keywords')
    ]);
  };

  const generateSuggestions = async (type) => {
    if (!content || content.length < 50) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      let newSuggestions = [];
      
      switch (type) {
        case 'titles':
          newSuggestions = await aiService.generateTitles(content);
          break;
        case 'summaries':
          newSuggestions = await aiService.generateSummaries(content);
          break;
        case 'keywords':
          newSuggestions = await aiService.generateKeywords(content);
          break;
      }
      
      setSuggestions(prev => ({ ...prev, [type]: newSuggestions }));
    } catch (error) {
      console.error(`Failed to generate ${type}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const applySuggestion = (type, suggestion) => {
    switch (type) {
      case 'title':
        onApplyTitle(suggestion);
        break;
      case 'excerpt':
        onApplyExcerpt(suggestion);
        break;
      case 'keywords':
        onApplyTags(suggestion);
        break;
    }
  };

  if (!content || content.length < 50) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="text-center py-8 text-gray-500">
          <ApperIcon name="Brain" size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Write at least 50 characters to get AI suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Title Suggestions */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('titles')}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Type" size={16} />
            <span className="font-medium text-sm">Title Suggestions</span>
          </div>
          <ApperIcon 
            name={expandedSections.titles ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </button>
        
        {expandedSections.titles && (
          <div className="p-3 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">AI Generated Titles</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateSuggestions('titles')}
                disabled={loading.titles}
                className="h-6 px-2"
              >
                {loading.titles ? (
                  <ApperIcon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <ApperIcon name="RotateCcw" size={12} />
                )}
              </Button>
            </div>
            
            {loading.titles ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded shimmer" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.titles.map((title, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded group"
                  >
                    <span className="text-sm flex-1 pr-2">{title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestion('title', title)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2"
                    >
                      <ApperIcon name="Plus" size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Suggestions */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('summaries')}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" size={16} />
            <span className="font-medium text-sm">Summary Suggestions</span>
          </div>
          <ApperIcon 
            name={expandedSections.summaries ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </button>
        
        {expandedSections.summaries && (
          <div className="p-3 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">AI Generated Summaries</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateSuggestions('summaries')}
                disabled={loading.summaries}
                className="h-6 px-2"
              >
                {loading.summaries ? (
                  <ApperIcon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <ApperIcon name="RotateCcw" size={12} />
                )}
              </Button>
            </div>
            
            {loading.summaries ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded shimmer" />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.summaries.map((summary, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-2 hover:bg-gray-50 rounded group"
                  >
                    <p className="text-sm flex-1 pr-2 leading-relaxed">{summary}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => applySuggestion('excerpt', summary)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2 mt-1"
                    >
                      <ApperIcon name="Plus" size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Keyword Suggestions */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => toggleSection('keywords')}
          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="Tags" size={16} />
            <span className="font-medium text-sm">Keyword Suggestions</span>
          </div>
          <ApperIcon 
            name={expandedSections.keywords ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </button>
        
        {expandedSections.keywords && (
          <div className="p-3 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">AI Generated Keywords</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => generateSuggestions('keywords')}
                disabled={loading.keywords}
                className="h-6 px-2"
              >
                {loading.keywords ? (
                  <ApperIcon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <ApperIcon name="RotateCcw" size={12} />
                )}
              </Button>
            </div>
            
            {loading.keywords ? (
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gray-100 rounded shimmer" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {suggestions.keywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion('keywords', [keyword])}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;