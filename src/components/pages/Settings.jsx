import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Card from "@/components/atoms/Card";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Media from "@/components/pages/Media";
import ThemePreview from "@/components/organisms/ThemePreview";
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

  const [userProfile, setUserProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    username: "johndoe",
    bio: "Content creator and web developer passionate about sharing knowledge through blogging.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    avatar: "",
    timezone: "America/Los_Angeles",
    language: "en",
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    weeklyDigest: true,
    twoFactorAuth: false,
    sessionTimeout: 30
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "profile", label: "Profile", icon: "User" },
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

const handleProfileChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
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
      console.error("Settings save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Password change error:", error);
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

{activeTab === "profile" && (
        <div className="space-y-8">
          {/* Profile Information */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold font-display text-charcoal mb-6">
                  Personal Information
                </h2>
                
                {/* Avatar Section */}
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal">Profile Picture</h3>
                    <p className="text-sm text-gray-600">Upload a professional photo</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    <ApperIcon name="Upload" size={16} className="mr-2" />
                    Upload
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    required
                    value={userProfile.firstName}
                    onChange={(e) => handleProfileChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                  <FormField
                    label="Last Name"
                    required
                    value={userProfile.lastName}
                    onChange={(e) => handleProfileChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>

                <FormField
                  label="Email Address"
                  type="email"
                  required
                  value={userProfile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />

                <FormField
                  label="Username"
                  required
                  value={userProfile.username}
                  onChange={(e) => handleProfileChange("username", e.target.value)}
                  placeholder="Choose a unique username"
                />

                <FormField
                  label="Bio"
                  type="textarea"
                  value={userProfile.bio}
                  onChange={(e) => handleProfileChange("bio", e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    label="Location"
                    value={userProfile.location}
                    onChange={(e) => handleProfileChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                  <FormField
                    label="Website"
                    value={userProfile.website}
                    onChange={(e) => handleProfileChange("website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </Card>

              {/* Account Preferences */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold font-display text-charcoal mb-6">
                  Account Preferences
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Timezone
                    </label>
                    <select
                      value={userProfile.timezone}
                      onChange={(e) => handleProfileChange("timezone", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-0"
                    >
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Berlin">Berlin (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Language
                    </label>
                    <select
                      value={userProfile.language}
                      onChange={(e) => handleProfileChange("language", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-0"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Change Password */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold font-display text-charcoal mb-6">
                  Change Password
                </h2>
                <div className="space-y-4 max-w-md">
                  <FormField
                    label="Current Password"
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    placeholder="Enter current password"
                  />
                  <FormField
                    label="New Password"
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    placeholder="Enter new password"
                  />
                  <FormField
                    label="Confirm New Password"
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button onClick={handlePasswordSave} disabled={loading} size="sm">
                    {loading ? (
                      <Loading />
                    ) : (
                      <>
                        <ApperIcon name="Lock" size={16} className="mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Save Profile */}
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal mb-4">Save Profile</h3>
                <Button
                  onClick={handleProfileSave}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </Card>

              {/* Notification Settings */}
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal mb-4">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={userProfile.emailNotifications}
                      onChange={(e) => handleProfileChange("emailNotifications", e.target.checked)}
                      className="rounded border-gray-300 text-sky focus:ring-sky"
                    />
                    <span className="text-sm text-charcoal">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={userProfile.pushNotifications}
                      onChange={(e) => handleProfileChange("pushNotifications", e.target.checked)}
                      className="rounded border-gray-300 text-sky focus:ring-sky"
                    />
                    <span className="text-sm text-charcoal">Push notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={userProfile.marketingEmails}
                      onChange={(e) => handleProfileChange("marketingEmails", e.target.checked)}
                      className="rounded border-gray-300 text-sky focus:ring-sky"
                    />
                    <span className="text-sm text-charcoal">Marketing emails</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={userProfile.weeklyDigest}
                      onChange={(e) => handleProfileChange("weeklyDigest", e.target.checked)}
                      className="rounded border-gray-300 text-sky focus:ring-sky"
                    />
                    <span className="text-sm text-charcoal">Weekly digest</span>
                  </label>
                </div>
              </Card>

              {/* Security Settings */}
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal mb-4">Security</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={userProfile.twoFactorAuth}
                      onChange={(e) => handleProfileChange("twoFactorAuth", e.target.checked)}
                      className="rounded border-gray-300 text-sky focus:ring-sky"
                    />
                    <span className="text-sm text-charcoal">Two-factor authentication</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Session timeout (minutes)
                    </label>
                    <select
                      value={userProfile.sessionTimeout}
                      onChange={(e) => handleProfileChange("sessionTimeout", parseInt(e.target.value))}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Account Status */}
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="text-charcoal font-medium">Jan 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Type</span>
                    <span className="text-charcoal font-medium">Creator</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Posts Published</span>
                    <span className="text-charcoal font-medium">12</span>
                  </div>
                </div>
              </Card>
            </div>
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
  );
};

export default Settings;