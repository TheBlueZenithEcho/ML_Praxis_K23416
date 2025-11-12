import React, { useState, useEffect } from 'react'; // <-- 1. THÊM useEffect
import { TrendingUp, TrendingDown, Clock, MessageCircle, CheckCircle, Users, Star, BarChart3 } from 'lucide-react';

// (Các interface KPIData và SentimentData giữ nguyên)
interface KPIData {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}
interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}
// Thêm 2 interface mới cho dữ liệu mock
interface ResponseTimeData {
  label: string;
  value: number;
  color: string;
}
interface ActivityData {
  type: string;
  message: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}


// 3. SỬA LẠI HÀM LẤY MÀU ĐỂ HỖ TRỢ DARK MODE
const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { 
      bg: 'bg-blue-50 dark:bg-blue-900/50', 
      text: 'text-blue-600 dark:text-blue-300', 
      icon: 'bg-blue-100 dark:bg-blue-800' 
    },
    purple: { 
      bg: 'bg-purple-50 dark:bg-purple-900/50', 
      text: 'text-purple-600 dark:text-purple-300', 
      icon: 'bg-purple-100 dark:bg-purple-800' 
    },
    green: { 
      bg: 'bg-green-50 dark:bg-green-900/50', 
      text: 'text-green-600 dark:text-green-300', 
      icon: 'bg-green-100 dark:bg-green-800' 
    },
    orange: { 
      bg: 'bg-orange-50 dark:bg-orange-900/50', 
      text: 'text-orange-600 dark:text-orange-300', 
      icon: 'bg-orange-100 dark:bg-orange-800' 
    },
    yellow: { 
      bg: 'bg-yellow-50 dark:bg-yellow-900/50', 
      text: 'text-yellow-600 dark:text-yellow-300', 
      icon: 'bg-yellow-100 dark:bg-yellow-800' 
    },
    teal: { 
      bg: 'bg-teal-50 dark:bg-teal-900/50', 
      text: 'text-teal-600 dark:text-teal-300', 
      icon: 'bg-teal-100 dark:bg-teal-800' 
    }
  };
  return colors[color] || colors.blue;
};

const DashboardPage: React.FC = () => {
  // 4. THIẾT LẬP STATE BAN ĐẦU
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeData[]>([]);
  const [recentActivityData, setRecentActivityData] = useState<ActivityData[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 5. DÙNG useEffect ĐỂ GỌI API KHI TẢI TRANG
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Link này cần chứa 1 object, ví dụ: { kpis: [...], sentiment: [...], ... }
        const response = await fetch('https://api.npoint.io/c30d6e6bc80bae0f6cf0');
        
        if (!response.ok) {
          throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        
        // Giả định API trả về cấu trúc
        const data = await response.json(); 
        
        setKpiData(data.kpis || []);
        setSentimentData(data.sentiment || []);
        setResponseTimeData(data.responseTime || []);
        setRecentActivityData(data.recentActivity || []);

      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false); // Dừng loading
      }
    };

    fetchDashboardData();
  }, []); // [] rỗng = chỉ chạy 1 lần

  // 6. THÊM TRẠNG THÁI LOADING/ERROR
  if (isLoading) {
    return (
      <div className="py-8 px-4 text-center text-gray-600 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 text-center text-red-600">
        <p className="font-semibold">Failed to load dashboard data</p>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your performance and customer satisfaction</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi, index) => {
            const colors = getColorClasses(kpi.color);
            return (
              <div key={index} className={`${colors.bg} rounded-lg p-6 transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`${colors.icon} p-3 rounded-lg`}>
                    <div className={colors.text}>{kpi.icon}</div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(kpi.change)}%
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">vs last month</p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer Sentiment Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Customer Sentiment Analysis</h3>
            <div className="space-y-4">
              {sentimentData.map((data, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{data.date}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">100%</span>
                  </div>
                  <div className="flex w-full h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${data.positive}%` }}
                    >
                      {data.positive}%
                    </div>
                    <div
                      className="bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-800 dark:text-gray-100 font-medium"
                      style={{ width: `${data.neutral}%` }}
                    >
                      {data.neutral}%
                    </div>
                    <div
                      className="bg-red-500 flex items-center justify-center text-xs text-white font-medium"
                      style={{ width: `${data.negative}%` }}
                    >
                      {data.negative}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-6 pt-6 border-t dark:border-t-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Negative</span>
              </div>
            </div>
          </div>

          {/* Response Time Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Response Time Trend</h3>
            <div className="space-y-4">
              {responseTimeData.map((data, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{data.label}</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.value} min</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`${data.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${(data.value / 25) * 100}%` }} // Giả sử max là 25
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t dark:border-t-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Target: &lt; 20 min</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <TrendingDown size={16} />
                  Improving
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivityData.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className={`${activity.color} mt-1`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary (Đã có style tối màu) */}
        <div className="mt-8 bg-gradient-to-r from-[#2B7516] to-[#1f5510] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Great Performance! 🎉</h3>
              <p className="text-white/90">
                You're doing excellent work. Your customer satisfaction rate is above 90%!
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">A+</p>
              <p className="text-sm text-white/80">Overall Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;