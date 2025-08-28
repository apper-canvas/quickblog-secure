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
}

export const settingsService = new SettingsService();