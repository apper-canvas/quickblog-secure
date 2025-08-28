class SettingsService {
  constructor() {
    this.settings = {
      // General Settings
      blogTitle: "QuickBlog",
      blogDescription: "A modern blogging platform for content creators who want to publish quickly and beautifully.",
      blogUrl: "https://myblog.quickblog.com",
      language: "en",
      timezone: "UTC",
      
      // SEO Settings
      metaTitle: "QuickBlog - Instant Content Publishing",
      metaDescription: "Create and publish beautiful blog content in minutes with our intuitive blogging platform.",
      metaKeywords: "blog, blogging, content, writing, publishing, cms",
      
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
      newsletterEnabled: true,
      newsletterProvider: "Mailchimp",
      
      // Monetization Settings
      monetizationEnabled: false,
      tipsEnabled: false,
      paywallEnabled: false
    };
  }

  async getSettings() {
    await this.delay(200);
    return { ...this.settings };
  }

  async updateSettings(newSettings) {
    await this.delay(400);
    this.settings = {
      ...this.settings,
      ...newSettings,
      updatedAt: new Date().toISOString()
    };
    return { ...this.settings };
  }

  async resetSettings() {
    await this.delay(300);
    this.settings = {
      blogTitle: "QuickBlog",
      blogDescription: "",
      blogUrl: "",
      language: "en",
      timezone: "UTC",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      theme: "classic",
      customDomain: "",
      headerLogo: "",
      favicon: "",
      commentsEnabled: true,
      moderationRequired: true,
      spamFilter: true,
      emailNotifications: true,
      newsletterEnabled: false,
      newsletterProvider: "",
      monetizationEnabled: false,
      tipsEnabled: false,
      paywallEnabled: false
    };
    return { ...this.settings };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  // User Profile Management
  getUserProfile() {
    return {
      Id: 1,
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
      sessionTimeout: 30,
      memberSince: "2024-01-15",
      accountType: "Creator",
      postsPublished: 12,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: new Date().toISOString()
    };
  }

  async updateUserProfile(profileData) {
    await this.delay(800);
    // In real implementation, this would update the user profile
    const updatedProfile = {
      ...this.getUserProfile(),
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    return updatedProfile;
  }

  async changePassword(passwordData) {
    await this.delay(1000);
    const { currentPassword, newPassword } = passwordData;
    
    // In real implementation, verify current password
    if (!currentPassword || currentPassword.length < 6) {
      throw new Error("Current password is invalid");
    }
    
    if (!newPassword || newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters");
    }
    
    // Simulate password change
    return {
      success: true,
      message: "Password changed successfully",
      timestamp: new Date().toISOString()
    };
  }

  async updateNotificationPreferences(preferences) {
    await this.delay(300);
    return {
      ...preferences,
      updatedAt: new Date().toISOString()
    };
  }

  async updateSecuritySettings(securityData) {
    await this.delay(400);
    return {
      ...securityData,
      updatedAt: new Date().toISOString()
    };
  }

  async uploadAvatar(file) {
    await this.delay(1500);
    // Simulate file upload
    const mockAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    return {
      avatarUrl: mockAvatarUrl,
      uploadedAt: new Date().toISOString()
    };
  }

  async deleteAccount(confirmation) {
    await this.delay(2000);
    if (confirmation !== "DELETE") {
      throw new Error("Confirmation text must be 'DELETE'");
    }
    return {
      success: true,
      message: "Account scheduled for deletion",
      timestamp: new Date().toISOString()
    };
  }
}

export const settingsService = new SettingsService();