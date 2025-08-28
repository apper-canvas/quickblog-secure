import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { settingsService } from "@/services/api/settingsService";

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    blogTitle: "",
    blogDescription: "",
    blogUrl: "",
    language: "en",
    timezone: "UTC",
    
    // SEO Settings
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    
    // Appearance Settings
    theme: "classic",
    customDomain: "",
    headerLogo: "",
    favicon: "",
    
    // Comment Settings
    commentsEnabled: true,
    moderationRequired: true,
    spamFilter: true,
    emailNotifications: true,
    
    // Newsletter Settings
    newsletterEnabled: false,
    newsletterProvider: "",
    
    // Monetization Settings
    monetizationEnabled: false,
    tipsEnabled: false,
    paywallEnabled: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  
  const loadSettings = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      setError("Failed to load settings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      await settingsService.updateSettings(settings);
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadSettings} />;
  
  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "seo", label: "SEO", icon: "Search" },
    { id: "appearance", label: "Appearance", icon: "Palette" },
    { id: "comments", label: "Comments", icon: "MessageCircle" },
    { id: "newsletter", label: "Newsletter", icon: "Mail" },
    { id: "monetization", label: "Monetization", icon: "DollarSign" }
  ];
  
  const themes = [
    { value: "classic", label: "Classic" },
    { value: "magazine", label: "Magazine" },
    { value: "minimal", label: "Minimal" }
  ];
  
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" }
  ];
  
  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Chicago", label: "Central Time" },
    { value: "America/Denver", label: "Mountain Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Europe/Paris", label: "Paris" },
    { value: "Asia/Tokyo", label: "Tokyo" }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your blog settings and preferences
          </p>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-sky to-blue-500 text-white shadow-md"
                    : "text-slate hover:text-charcoal hover:bg-gray-100"
                }`}
              >
                <ApperIcon 
                  name={tab.icon} 
                  size={18} 
                  className={activeTab === tab.id ? "text-white" : "text-slate"} 
                />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                    General Settings
                  </h2>
                  <div className="space-y-4">
                    <FormField
                      label="Blog Title"
                      required
                      value={settings.blogTitle}
                      onChange={(e) => handleChange("blogTitle", e.target.value)}
                      placeholder="My Awesome Blog"
                    />
                    
                    <FormField
                      label="Blog Description"
                      type="textarea"
                      value={settings.blogDescription}
                      onChange={(e) => handleChange("blogDescription", e.target.value)}
                      placeholder="A brief description of your blog..."
                    />
                    
                    <FormField
                      label="Blog URL"
                      value={settings.blogUrl}
                      onChange={(e) => handleChange("blogUrl", e.target.value)}
                      placeholder="https://myblog.com"
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Language
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleChange("language", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
                        >
                          {languages.map(lang => (
                            <option key={lang.value} value={lang.value}>
                              {lang.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-charcoal mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleChange("timezone", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
                        >
                          {timezones.map(tz => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "seo" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                    SEO Settings
                  </h2>
                  <div className="space-y-4">
                    <FormField
                      label="Meta Title"
                      value={settings.metaTitle}
                      onChange={(e) => handleChange("metaTitle", e.target.value)}
                      placeholder="Default meta title for your blog"
                    />
                    
                    <FormField
                      label="Meta Description"
                      type="textarea"
                      value={settings.metaDescription}
                      onChange={(e) => handleChange("metaDescription", e.target.value)}
                      placeholder="Default meta description for your blog..."
                    />
                    
                    <FormField
                      label="Meta Keywords"
                      value={settings.metaKeywords}
                      onChange={(e) => handleChange("metaKeywords", e.target.value)}
                      placeholder="blog, writing, content, etc."
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                    Appearance Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleChange("theme", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
                      >
                        {themes.map(theme => (
                          <option key={theme.value} value={theme.value}>
                            {theme.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <FormField
                      label="Custom Domain"
                      value={settings.customDomain}
                      onChange={(e) => handleChange("customDomain", e.target.value)}
                      placeholder="blog.yourdomain.com"
                    />
                    
                    <FormField
                      label="Header Logo URL"
                      value={settings.headerLogo}
                      onChange={(e) => handleChange("headerLogo", e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                    
                    <FormField
                      label="Favicon URL"
                      value={settings.favicon}
                      onChange={(e) => handleChange("favicon", e.target.value)}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "comments" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                    Comment Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-charcoal">
                          Enable Comments
                        </label>
                        <p className="text-xs text-gray-500">
                          Allow visitors to comment on your posts
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange("commentsEnabled", !settings.commentsEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.commentsEnabled ? "bg-sky" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.commentsEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-charcoal">
                          Moderation Required
                        </label>
                        <p className="text-xs text-gray-500">
                          Comments require approval before appearing
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange("moderationRequired", !settings.moderationRequired)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.moderationRequired ? "bg-sky" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.moderationRequired ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-charcoal">
                          Spam Filter
                        </label>
                        <p className="text-xs text-gray-500">
                          Automatically detect and filter spam comments
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange("spamFilter", !settings.spamFilter)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.spamFilter ? "bg-sky" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.spamFilter ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-charcoal">
                          Email Notifications
                        </label>
                        <p className="text-xs text-gray-500">
                          Get notified when new comments are posted
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange("emailNotifications", !settings.emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.emailNotifications ? "bg-sky" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "newsletter" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                    Newsletter Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-charcoal">
                          Enable Newsletter
                        </label>
                        <p className="text-xs text-gray-500">
                          Allow visitors to subscribe to your newsletter
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange("newsletterEnabled", !settings.newsletterEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.newsletterEnabled ? "bg-sky" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.newsletterEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    
                    {settings.newsletterEnabled && (
                      <FormField
                        label="Newsletter Provider"
                        value={settings.newsletterProvider}
                        onChange={(e) => handleChange("newsletterProvider", e.target.value)}
                        placeholder="e.g., Mailchimp, ConvertKit, etc."
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "monetization" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-charcoal mb-4">
                    Monetization Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-charcoal">
                          Enable Monetization
                        </label>
                        <p className="text-xs text-gray-500">
                          Allow readers to support your work
                        </p>
                      </div>
                      <button
                        onClick={() => handleChange("monetizationEnabled", !settings.monetizationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.monetizationEnabled ? "bg-sky" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.monetizationEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    
                    {settings.monetizationEnabled && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-charcoal">
                              Tips & Donations
                            </label>
                            <p className="text-xs text-gray-500">
                              Allow readers to tip or donate
                            </p>
                          </div>
                          <button
                            onClick={() => handleChange("tipsEnabled", !settings.tipsEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.tipsEnabled ? "bg-sky" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.tipsEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-charcoal">
                              Paywall
                            </label>
                            <p className="text-xs text-gray-500">
                              Restrict premium content to subscribers
                            </p>
                          </div>
                          <button
                            onClick={() => handleChange("paywallEnabled", !settings.paywallEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.paywallEnabled ? "bg-sky" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.paywallEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;