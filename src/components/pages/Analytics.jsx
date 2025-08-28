import React, { useState, useEffect } from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import ApexCharts from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { postService } from "@/services/api/postService";
import { analyticsService } from "@/services/api/analyticsService";

const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  
  const loadAnalytics = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [postsData, analyticsData] = await Promise.all([
        postService.getAll(),
        analyticsService.getAnalytics(dateRange)
      ]);
      setPosts(postsData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError("Failed to load analytics data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);
  
  if (loading) return <Loading variant="skeleton" />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;
  
  const publishedPosts = posts.filter(post => post.status === "published");
  const totalViews = publishedPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const avgReadTime = publishedPosts.length > 0 
    ? publishedPosts.reduce((sum, post) => sum + (post.readTime || 0), 0) / publishedPosts.length
    : 0;
  
  // Top performing posts
  const topPosts = publishedPosts
    .filter(post => post.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Chart configurations
  const viewsChartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#4299E1"],
    stroke: {
      curve: "smooth",
      width: 2
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: analytics?.viewsOverTime?.map(item => format(new Date(item.date), "MMM d")) || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      }
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 5
    },
    tooltip: {
      theme: "light"
    }
  };
  
  const trafficSourcesOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#4299E1", "#48BB78", "#ED8936", "#E53E3E", "#9F7AEA"],
    labels: analytics?.trafficSources?.map(source => source.name) || [],
    legend: {
      position: "bottom",
      fontSize: "14px"
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#2D3748"
            }
          }
        }
      }
    },
    tooltip: {
      theme: "light"
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-charcoal">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your blog performance and audience insights
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Time range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-sky focus:ring-2 focus:ring-sky focus:ring-offset-0 transition-colors duration-200"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-charcoal mt-1">
                {totalViews.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <ApperIcon name="TrendingUp" size={14} className="text-success" />
                <span className="text-sm text-success">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-sky/10 to-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Eye" size={24} className="text-sky" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published Posts</p>
              <p className="text-2xl font-bold text-charcoal mt-1">
                {publishedPosts.length}
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <ApperIcon name="TrendingUp" size={14} className="text-success" />
                <span className="text-sm text-success">+3 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" size={24} className="text-success" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Read Time</p>
              <p className="text-2xl font-bold text-charcoal mt-1">
                {Math.round(avgReadTime)}m
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <ApperIcon name="Clock" size={14} className="text-info" />
                <span className="text-sm text-info">Good engagement</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-info/10 to-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={24} className="text-info" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-charcoal mt-1">
                {analytics?.bounceRate || 24}%
              </p>
              <div className="flex items-center space-x-1 mt-2">
                <ApperIcon name="TrendingDown" size={14} className="text-success" />
                <span className="text-sm text-success">-2.1%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-warning/10 to-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" size={24} className="text-warning" />
            </div>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display text-charcoal">
              Views Over Time
            </h2>
            <Badge variant="outline">
              {analytics?.viewsOverTime?.reduce((sum, item) => sum + item.views, 0) || 0} total
            </Badge>
          </div>
          
          <ApexCharts
            options={viewsChartOptions}
            series={[{
              name: "Views",
              data: analytics?.viewsOverTime?.map(item => item.views) || []
            }]}
            type="area"
            height={350}
          />
        </Card>
        
        {/* Traffic Sources */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display text-charcoal">
              Traffic Sources
            </h2>
            <Badge variant="outline">
              {analytics?.trafficSources?.reduce((sum, source) => sum + source.visits, 0) || 0} visits
            </Badge>
          </div>
          
          <ApexCharts
            options={trafficSourcesOptions}
            series={analytics?.trafficSources?.map(source => source.visits) || []}
            type="donut"
            height={350}
          />
        </Card>
      </div>
      
      {/* Top Performing Posts */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold font-display text-charcoal">
            Top Performing Posts
          </h2>
          <Badge variant="outline">
            {topPosts.length} posts
          </Badge>
        </div>
        
        {topPosts.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="BarChart3" size={32} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No performance data available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div
                key={post.Id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-sky to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-charcoal truncate">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>Published {format(new Date(post.publishDate), "MMM d, yyyy")}</span>
                    {post.readTime && (
                      <span>{post.readTime} min read</span>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-bold text-charcoal">
                    {post.views.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;