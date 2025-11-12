import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const staticConfig = {
  users: {
    color: '#63A361',
    icon: 'bi bi-people', 
    link: '/admin_users', 
    title: "Total Users",
    dataKey: 'users',
    duration: 'this month',
    apiUrl: 'https://api.npoint.io/08cab0751b745af2d7cf', 
  },
  designers: {
    color: '#63A361', 
    icon: 'bi bi-palette', 
    link: '/admin_designers', 
    title: "Total Designers",
    dataKey: 'designers', 
    duration: 'up to now',
    apiUrl: 'https://api.npoint.io/18a7768061fd7301315f', 
  }
};

type ChartBoxProps = {
  type: 'users' | 'designers';
};

// Định nghĩa kiểu dữ liệu trả về từ API
type ApiData = {
  number: string | number;
  percentage?: number;
  chartData?: object[];
};

const ChartBox = (props: ChartBoxProps) => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = staticConfig[props.type];

  // Logic fetch data (Giữ nguyên)
  useEffect(() => {
    const fetchData = async () => {
      if (!config.apiUrl) {
        setLoading(false);
        setError("API URL chưa được định nghĩa");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(config.apiUrl);
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

    fetchData();
  }, [config.apiUrl]); 


  if (loading) {
    // Giao diện skeleton loading (Giữ nguyên)
    return (
      <div className="p-4 h-full flex flex-col justify-between animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }
  if (error) {
    return <div className="p-4 text-red-500">Lỗi: {error}</div>;
  }
  if (!data) {
    return <div className="p-4">Không có dữ liệu.</div>;
  }

  // Kiểm tra xem có dữ liệu biểu đồ hay không
  const hasChart = data.chartData && data.chartData.length > 0;

  // Cập nhật layout cho box KHÔNG CÓ CHART ("Total Designers")
  if (!hasChart) {
    return (
      <div className='flex flex-col justify-between h-full p-4'> 
        {/* Tiêu đề */}
        <div className="title font-bold text-green-800 text-2xl flex items-center gap-2">
            <i className={`${config.icon} text-xl`}></i>
            <span>{config.title}</span>
        </div>
        
        {/* SỬA TẠI ĐÂY: Thêm 'text-center' */}
        <h1 className='text-4xl text-black font-bold my-2 text-center'>{data.number}</h1>
        
        {/* Footer */}
        <div className="flex justify-between items-end">
            <div className='text-green-700 hover:text-amber-600 transition-colors'>
                <Link to={config.link}> View all </Link>
            </div>
            {config.duration && (
                <span className="duration text-sm text-gray-500">{config.duration}</span>
            )}
        </div>
      </div>
    );
  }

  // Cập nhật layout cho box CÓ CHART ("Total Users")
  return (
    <div className='grid grid-cols-2 h-full gap-4 p-4 chartBox'>
        
        {/* --- CỘT 1: THÔNG TIN CHUNG --- */}
        <div className='flex flex-col justify-between col-span-1'>
            {/* Tiêu đề */}
            <div className="title font-bold text-green-800 text-lg flex items-center gap-2">
                <i className={`${config.icon} text-xl`}></i>
                <span>{config.title}</span>
            </div>
            {/* Số liệu */}
            <h1 className='text-4xl text-black font-bold my-2'>{data.number}</h1>
            {/* Link */}
            <div className='text-green-700 hover:text-amber-600 transition-colors'>
                <Link to={config.link}> View all </Link>
            </div>
        </div>

        {/* --- CỘT 2: BIỂU ĐỒ & CON SỐ --- */}
        <div className='flex flex-col justify-between col-span-1'>
            {/* Biểu đồ (chiếm 3/4 chiều cao cột) */}
            <div className="chart h-3/4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data.chartData}>
                        <Tooltip
                            contentStyle={{ background: "transparent", border: "none" }}
                            labelStyle={{ display: "none" }} // Ẩn label tooltip
                            position={{ y: 0 }} // Đẩy tooltip lên
                        />
                        <Line
                            type="monotone"
                            dataKey={config.dataKey}
                            stroke={config.color}
                            strokeWidth={2} 
                            dot={false} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            {/* Text (chiếm 1/4 chiều cao cột) */}
            <div className="texts flex flex-col text-right justify-end h-1/4">
                {data.percentage !== undefined && (
                    <span 
                      className='font-semibold text-lg' 
                      // Thêm màu sắc động
                      style={{ color: data.percentage < 0 ? "#E53E3E" : "#38A169" }} 
                    >
                        {data.percentage > 0 && '+'}{data.percentage}% 
                    </span>
                )}
                {config.duration && (
                     <span className="duration text-gray-500 text-sm">{config.duration}</span>
                )}
            </div>
        </div>
    </div>
  );
}

export default ChartBox;