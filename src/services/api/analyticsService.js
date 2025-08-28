import { subDays, format } from "date-fns";

class AnalyticsService {
  constructor() {
    this.generateMockData();
  }

  async getAnalytics(dateRange = "30d") {
    await this.delay(400);
    
    const days = this.parseDateRange(dateRange);
    
    return {
      bounceRate: 24,
      viewsOverTime: this.generateViewsOverTime(days),
      trafficSources: this.generateTrafficSources(),
      topPages: this.generateTopPages(),
      deviceStats: this.generateDeviceStats(),
      geographicData: this.generateGeographicData()
    };
  }

  parseDateRange(range) {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      case "1y": return 365;
      default: return 30;
    }
  }

  generateViewsOverTime(days) {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const baseViews = Math.floor(Math.random() * 100) + 50;
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
      
      data.push({
        date: date.toISOString(),
        views: Math.floor(baseViews * weekendMultiplier)
      });
    }
    return data;
  }

  generateTrafficSources() {
    return [
      { name: "Direct", visits: 1247, percentage: 35.2 },
      { name: "Google Search", visits: 892, percentage: 25.1 },
      { name: "Social Media", visits: 654, percentage: 18.4 },
      { name: "Referrals", visits: 423, percentage: 11.9 },
      { name: "Email", visits: 334, percentage: 9.4 }
    ];
  }

  generateTopPages() {
    return [
      { 
        path: "/getting-started-modern-web-development", 
        title: "Getting Started with Modern Web Development",
        views: 1247,
        bounceRate: 22.1,
        avgTime: "4:32"
      },
      { 
        path: "/art-of-writing-clean-maintainable-code", 
        title: "The Art of Writing Clean, Maintainable Code",
        views: 892,
        bounceRate: 18.5,
        avgTime: "3:45"
      },
      { 
        path: "/mastering-css-grid-complete-layout-solution", 
        title: "Mastering CSS Grid: A Complete Layout Solution",
        views: 756,
        bounceRate: 25.3,
        avgTime: "5:12"
      }
    ];
  }

  generateDeviceStats() {
    return [
      { device: "Desktop", percentage: 54.2, sessions: 1923 },
      { device: "Mobile", percentage: 39.7, sessions: 1408 },
      { device: "Tablet", percentage: 6.1, sessions: 216 }
    ];
  }

  generateGeographicData() {
    return [
      { country: "United States", sessions: 1247, percentage: 35.1 },
      { country: "United Kingdom", sessions: 456, percentage: 12.9 },
      { country: "Canada", sessions: 334, percentage: 9.4 },
      { country: "Germany", sessions: 289, percentage: 8.1 },
      { country: "Australia", sessions: 223, percentage: 6.3 },
      { country: "France", sessions: 198, percentage: 5.6 },
      { country: "Netherlands", sessions: 167, percentage: 4.7 },
      { country: "Other", sessions: 636, percentage: 17.9 }
    ];
  }

  generateMockData() {
    // Initialize any mock data that needs to be persistent
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const analyticsService = new AnalyticsService();