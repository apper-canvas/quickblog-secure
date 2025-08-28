import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const themes = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design with gradient accents",
    preview: {
      primary: "from-sky to-blue-500",
      background: "bg-gray-50",
      card: "bg-white border-gray-200",
      text: "text-gray-900",
      accent: "bg-sky text-white"
    }
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional and timeless with elegant typography",
    preview: {
      primary: "from-slate-700 to-slate-800",
      background: "bg-stone-50",
      card: "bg-white border-stone-200",
      text: "text-slate-900",
      accent: "bg-slate-700 text-white"
    }
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and focused with plenty of whitespace",
    preview: {
      primary: "from-gray-800 to-gray-900",
      background: "bg-white",
      card: "bg-gray-50 border-gray-100",
      text: "text-gray-900",
      accent: "bg-gray-800 text-white"
    }
  },
  {
    id: "dark",
    name: "Dark",
    description: "Modern dark theme easy on the eyes",
    preview: {
      primary: "from-blue-500 to-purple-600",
      background: "bg-gray-900",
      card: "bg-gray-800 border-gray-700",
      text: "text-gray-100",
      accent: "bg-blue-600 text-white"
    }
  },
  {
    id: "colorful",
    name: "Colorful",
    description: "Vibrant and energetic with bold color combinations",
    preview: {
      primary: "from-pink-500 to-orange-400",
      background: "bg-orange-50",
      card: "bg-white border-orange-200",
      text: "text-orange-900",
      accent: "bg-pink-500 text-white"
    }
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated design with refined color palette",
    preview: {
      primary: "from-purple-600 to-indigo-600",
      background: "bg-purple-50",
      card: "bg-white border-purple-200",
      text: "text-purple-900",
      accent: "bg-purple-600 text-white"
    }
  }
];

const ThemePreview = () => {
  const [currentTheme, setCurrentTheme] = useState("modern");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("blog-theme");
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId) => {
    document.documentElement.setAttribute("data-theme", themeId);
  };

  const handleThemeChange = async (themeId) => {
    if (themeId === currentTheme) return;
    
    setLoading(themeId);
    
    try {
      // Simulate theme switching delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCurrentTheme(themeId);
      applyTheme(themeId);
      localStorage.setItem("blog-theme", themeId);
      
      const themeName = themes.find(t => t.id === themeId)?.name;
      toast.success(`Switched to ${themeName} theme`);
    } catch (error) {
      toast.error("Failed to switch theme");
      console.error(error);
    } finally {
      setLoading("");
    }
  };

  const resetToDefault = () => {
    handleThemeChange("modern");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-charcoal">
            Theme Preferences
          </h2>
          <p className="text-gray-600 mt-1">
            Choose a theme that matches your blog's personality and brand.
          </p>
        </div>
        
        <Button 
          variant="secondary" 
          onClick={resetToDefault}
          disabled={currentTheme === "modern"}
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Reset to Default
        </Button>
      </div>

      {/* Current Theme */}
      <Card className="p-6 border-2 border-sky bg-sky/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold font-display text-charcoal">
              Current Theme
            </h3>
            <p className="text-sky font-medium mt-1">
              {themes.find(t => t.id === currentTheme)?.name}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {themes.find(t => t.id === currentTheme)?.description}
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-sky to-blue-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Palette" size={24} className="text-white" />
          </div>
        </div>
      </Card>

      {/* Theme Grid */}
      <div>
        <h3 className="text-lg font-semibold font-display text-charcoal mb-6">
          Available Themes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card 
              key={theme.id}
              className={cn(
                "p-6 cursor-pointer transition-all duration-200",
                currentTheme === theme.id 
                  ? "border-2 border-sky bg-sky/5 ring-2 ring-sky/20" 
                  : "hover:shadow-lg hover:border-gray-300"
              )}
              onClick={() => handleThemeChange(theme.id)}
            >
              {/* Theme Preview */}
              <div className={cn(
                "rounded-lg p-4 mb-4 transition-all duration-200",
                theme.preview.background
              )}>
                <div className={cn(
                  "rounded-md p-3 mb-3",
                  theme.preview.card
                )}>
                  <div className={cn(
                    "w-full h-2 rounded mb-2 bg-gradient-to-r",
                    theme.preview.primary
                  )} />
                  <div className={cn(
                    "w-3/4 h-1.5 rounded mb-1",
                    theme.preview.text === "text-gray-100" ? "bg-gray-300" : "bg-gray-300"
                  )} />
                  <div className={cn(
                    "w-1/2 h-1.5 rounded",
                    theme.preview.text === "text-gray-100" ? "bg-gray-400" : "bg-gray-200"
                  )} />
                </div>
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    theme.preview.accent
                  )}>
                    Sample
                  </div>
                  <div className="flex space-x-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      theme.preview.text === "text-gray-100" ? "bg-gray-500" : "bg-gray-300"
                    )} />
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      theme.preview.text === "text-gray-100" ? "bg-gray-600" : "bg-gray-200"
                    )} />
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-charcoal">
                    {theme.name}
                  </h4>
                  {currentTheme === theme.id ? (
                    <div className="flex items-center text-sky text-sm">
                      <ApperIcon name="Check" size={16} className="mr-1" />
                      Active
                    </div>
                  ) : loading === theme.id ? (
                    <div className="w-4 h-4 border-2 border-sky rounded-full animate-spin border-t-transparent" />
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-xs"
                    >
                      Preview
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {theme.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Theme Features */}
      <Card className="p-6 bg-gradient-to-br from-background to-gray-100">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-br from-sky to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Sparkles" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold font-display text-charcoal">
              Professional Theme System
            </h3>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Each theme is carefully crafted with consistent typography, color harmony, and 
              accessibility in mind. Your chosen theme applies across all pages and components 
              for a cohesive brand experience.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Palette" size={16} className="mr-2 text-sky" />
              Color Harmony
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Type" size={16} className="mr-2 text-sky" />
              Typography
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Smartphone" size={16} className="mr-2 text-sky" />
              Responsive
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Eye" size={16} className="mr-2 text-sky" />
              Accessible
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThemePreview;