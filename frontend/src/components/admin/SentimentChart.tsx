import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid, // Thêm Grid (đường lưới)
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// API cho biểu đồ cảm xúc
const API_SENTIMENT_URL = 'https://api.npoint.io/4d23aaf7a46c4c1dff0e'; // <--- THAY LINK JSON CỦA BẠN

// Định nghĩa kiểu dữ liệu
type ProjectConfig = {
  dataKey: string;
  name: string;
  color: string;
};

type SentimentDataPoint = {
  time_percent: number;
  [key: string]: number; // Cho các key của dự án (projectA, projectB...)
};

type ApiData = {
  chartTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  projects: ProjectConfig[];
  chartData: SentimentDataPoint[];
};

const MultiProjectSentimentChart = () => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_SENTIMENT_URL);
        if (!response.ok) {
          throw new Error('Tải dữ liệu API thất bại');
        }
        const apiData: ApiData = await response.json();
        setData(apiData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, []);

  const renderContent = () => {
    if (loading) {
      // Giao diện skeleton loading (Tương tự TopwordBox)
      return (
        <div className="flex flex-col gap-3 animate-pulse"> {/* */}
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div> {/* */}
          <div className="h-80 bg-gray-200 rounded w-full"></div> {/* */}
        </div>
      );
    }

    if (error) {
      return <div className="p-4 text-red-500">Lỗi: {error}</div>; //
    }

    if (!data) {
      return <div className="p-4">Không có dữ liệu.</div>; //
    }

    // --- NỘI DUNG CHÍNH (BIỂU ĐỒ) ---
    return (
      <div className="h-[400px]">
        {/* Tiêu đề biểu đồ */}
        <h1 className="text-3xl text-[#386641] font-bold mb-6 text-center"> {/* */}
          {data.chartTitle}
        </h1>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 20, 
            }}
          >
            {/* Đường lưới đứt nét giống ảnh */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            {/* Trục X (Thời gian hội thoại) */}
            <XAxis
              dataKey="time_percent"
              tickFormatter={(value) => `${value}%`}
              stroke="#6B7280"
              label={{ value: data.xAxisLabel, position: 'insideBottom', offset: -15 }}
            />

            {/* Trục Y (Điểm Cảm Xúc) */}
            <YAxis
              stroke="#6B7280"
              domain={[0, 100]} // Set cứng 0-100
              label={{ value: data.yAxisLabel, angle: -90, position: 'insideLeft', offset: -10 }}
            />
            
            {/* Chú thích (Tên các dự án) */}
            <Legend verticalAlign="top" height={36} />

            {/* Tooltip khi hover */}
            <Tooltip
              formatter={(value: number) => [value, "Điểm"]}
              labelFormatter={(label: string) => `${label}% Thời gian`}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                borderColor: '#E5E7EB',
              }}
            />

            {/* Tự động VẼ CÁC ĐƯỜNG LINE
                Bằng cách lặp qua mảng 'projects' từ JSON
            */}
            {data.projects.map((project) => (
              <Line
                key={project.dataKey}
                type="monotone"
                dataKey={project.dataKey}
                name={project.name}
                stroke={project.color}
                strokeWidth={3}
                dot={false} // Ẩn dấu chấm
                activeDot={{ r: 6 }} // Hiện dấu chấm to khi hover
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
};

export default MultiProjectSentimentChart;