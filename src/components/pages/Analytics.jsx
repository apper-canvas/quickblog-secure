import React, { useEffect, useState } from "react";
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays } from "date-fns";
import ApexCharts from "react-apexcharts";
import { postService } from "@/services/api/postService";
import { analyticsService } from "@/services/api/analyticsService";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Posts from "@/components/pages/Posts";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

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
      fontFamily: "Inter, sans-serif",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ["#4299E1"],
    stroke: {
      curve: "smooth",
      width: 3
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.1,
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
        },
        formatter: function (value) {
          return value.toLocaleString();
        }
      }
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 5,
      padding: {
        left: 10,
        right: 10
      }
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (value) {
          return value.toLocaleString() + " views";
        }
      }
    },
    dataLabels: {
      enabled: false
    }
  };
  
  const trafficSourcesOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Inter, sans-serif",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ["#4299E1", "#48BB78", "#ED8936", "#E53E3E", "#9F7AEA"],
    labels: analytics?.trafficSources?.map(source => source.name) || [],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#2D3748"
            },
            value: {
              show: true,
              fontSize: "24px",
              fontWeight: 700,
              color: "#2D3748",
              formatter: function (value) {
                return parseInt(value).toLocaleString();
              }
            },
            total: {
              show: true,
              label: "Total Visits",
              fontSize: "14px",
              fontWeight: 600,
              color: "#6B7280"
            }
          }
        }
      }
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: function (value) {
          return parseInt(value).toLocaleString() + " visits";
        }
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        legend: {
          position: "bottom",
          fontSize: "12px"
        }
      }
    }]
  };
  
  // Read Time Distribution Chart
  const readTimeData = publishedPosts.reduce((acc, post) => {
    if (!post.readTime) return acc;
    const range = post.readTime <= 3 ? "1-3 min" : 
                 post.readTime <= 6 ? "4-6 min" : 
                 post.readTime <= 10 ? "7-10 min" : "10+ min";
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {});

  const readTimeChartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif"
    },
    colors: ["#48BB78"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "60%"
      }
    },
    xaxis: {
      categories: Object.keys(readTimeData),
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
      theme: "light",
      y: {
        formatter: function (value) {
          return value + " posts";
        }
      }
    },
    dataLabels: {
      enabled: false
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
<div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Views Over Time */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display text-charcoal mb-2 sm:mb-0">
              Views Over Time
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {analytics?.viewsOverTime?.reduce((sum, item) => sum + item.views, 0).toLocaleString() || 0} total
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-success">
                <ApperIcon name="TrendingUp" size={12} />
                <span>+15.2%</span>
              </div>
            </div>
          </div>
          
          <ApexCharts
            options={viewsChartOptions}
            series={[{
              name: "Views",
              data: analytics?.viewsOverTime?.map(item => item.views) || []
            }]}
            type="area"
            height={320}
          />
        </Card>
        
        {/* Traffic Sources */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display text-charcoal mb-2 sm:mb-0">
              Traffic Sources
            </h2>
            <Badge variant="outline" className="text-xs">
              {analytics?.trafficSources?.reduce((sum, source) => sum + source.visits, 0).toLocaleString() || 0} visits
            </Badge>
          </div>
          
          <ApexCharts
            options={trafficSourcesOptions}
            series={analytics?.trafficSources?.map(source => source.visits) || []}
            type="donut"
            height={320}
          />
        </Card>
      </div>

      {/* Read Time Distribution */}
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-display text-charcoal mb-2 sm:mb-0">
              Content Engagement Distribution
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {publishedPosts.length} published posts
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-info">
                <ApperIcon name="Clock" size={12} />
                <span>Avg {Math.round(avgReadTime)}min</span>
              </div>
            </div>
          </div>
          
          <ApexCharts
            options={readTimeChartOptions}
            series={[{
              name: "Posts",
              data: Object.values(readTimeData)
            }]}
            type="bar"
            height={320}
          />
        </Card>
      </div>
      
{/* Top Performing Posts */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h2 className="text-lg font-semibold font-display text-charcoal mb-2 sm:mb-0">
            🏆 Popular Posts Performance
          </h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {topPosts.length} high performers
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-warning">
              <ApperIcon name="Star" size={12} />
              <span>Trending</span>
            </div>
          </div>
        </div>
        
        {topPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="BarChart3" size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-charcoal mb-2">No Performance Data Yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Start publishing posts and they'll appear here once they gain traction with your audience.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topPosts.map((post, index) => {
              const isTopPerformer = index < 3;
              const growthPercentage = 5 + Math.random() * 25; // Mock growth data
              const rankColors = ["from-yellow-400 to-yellow-600", "from-gray-400 to-gray-600", "from-amber-600 to-amber-700"];
              const rankGradient = index < 3 ? rankColors[index] : "from-sky to-blue-500";
              
              return (
                <div
                  key={post.Id}
                  className={cn(
                    "relative flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:shadow-md",
                    isTopPerformer 
                      ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300" 
                      : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                  )}
                >
                  {isTopPerformer && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <ApperIcon name="Crown" size={12} className="text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md",
                    `bg-gradient-to-br ${rankGradient}`
                  )}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-charcoal truncate">
                        {post.title}
                      </h3>
                      {isTopPerformer && (
                        <Badge variant="warning" className="text-xs px-2 py-0.5">
                          Hot
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" size={12} />
                        <span>{format(new Date(post.publishDate), "MMM d")}</span>
                      </span>
                      {post.readTime && (
                        <span className="flex items-center space-x-1">
                          <ApperIcon name="Clock" size={12} />
                          <span>{post.readTime}m read</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1 text-success">
                        <ApperIcon name="TrendingUp" size={12} />
                        <span>+{growthPercentage.toFixed(1)}%</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-lg font-bold text-charcoal">
                          {post.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                      
                      {post.views > 1000 && (
                        <div className="w-2 h-8 bg-gradient-to-t from-success/20 to-success rounded-full relative overflow-hidden">
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-success rounded-full transition-all duration-1000"
                            style={{
                              height: `${Math.min((post.views / Math.max(...topPosts.map(p => p.views))) * 100, 100)}%`
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {topPosts.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Lightbulb" size={16} className="text-blue-600" />
              <h4 className="font-medium text-blue-900">Performance Insights</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-gray-700">
                  Best performer: {topPosts[0]?.views.toLocaleString()} views
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-info rounded-full"></div>
                <span className="text-gray-700">
                  Avg engagement: {Math.round(topPosts.reduce((sum, p) => sum + p.views, 0) / topPosts.length).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-gray-700">
                  Growth trend: +{((Math.random() * 20) + 10).toFixed(1)}% this month
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Analytics;