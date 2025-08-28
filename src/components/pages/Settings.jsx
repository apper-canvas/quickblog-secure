import React, { useState } from "react";
import { toast } from "react-toastify";
import ThemePreview from "@/components/organisms/ThemePreview";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Media from "@/components/pages/Media";
import Loading from "@/components/ui/Loading";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    siteName: "My Blog",
    tagline: "Thoughts, stories and ideas.",
    description: "A place where I share my thoughts and experiences about web development, design, and technology.",
    author: "John Doe",
    email: "john@example.com",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: ""
    }
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "themes", label: "Themes", icon: "Palette" },
    { id: "social", label: "Social", icon: "Share2" }
  ];

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (platform, value) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display text-charcoal">
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your blog configuration and preferences.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${activeTab === tab.id
                  ? 'border-sky text-sky'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <ApperIcon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "general" && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Site Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                Site Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Site Name
                  </label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                    placeholder="Enter your site name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Tagline
                  </label>
                  <Input
                    value={settings.tagline}
                    onChange={(e) => handleInputChange("tagline", e.target.value)}
                    placeholder="A short description of your blog"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Description
                  </label>
                  <Textarea
                    value={settings.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="A longer description for SEO purposes"
                    rows={4}
                  />
                </div>
              </div>
            </Card>

            {/* Author Information */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                Author Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Author Name
                  </label>
                  <Input
                    value={settings.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Button */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal mb-4">Save Changes</h3>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Settings
                  </>
                )}
</Button>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-charcoal font-medium">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Site Status</span>
                  <span className="text-success font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Theme Version</span>
                  <span className="text-charcoal font-medium">1.0.0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "themes" && <ThemePreview />}

      {activeTab === "social" && (
        <div className="max-w-4xl">
          <Card className="p-6">
            <h2 className="text-lg font-semibold font-display text-charcoal mb-6">
              Social Media Links
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <ApperIcon name="Twitter" size={16} className="inline mr-2" />
                  Twitter
                </label>
                <Input
                  value={settings.socialLinks.twitter}
                  onChange={(e) => handleSocialChange("twitter", e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <ApperIcon name="Linkedin" size={16} className="inline mr-2" />
                  LinkedIn
                </label>
                <Input
                  value={settings.socialLinks.linkedin}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <ApperIcon name="Github" size={16} className="inline mr-2" />
                  GitHub
                </label>
                <Input
                  value={settings.socialLinks.github}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <ApperIcon name="Instagram" size={16} className="inline mr-2" />
                  Instagram
                </label>
                <Input
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Social Links
                  </>
                )}
              </Button>
            </div>
</Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;