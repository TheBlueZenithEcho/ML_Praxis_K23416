import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const staticConfig = {
  users: {
    color: '#8884d8',
    icon: 'bi bi-people', 
    link: '/admin_users', 
    title: "Total Users",
    dataKey: 'users',
    duration: 'this month',
    apiUrl: 'https://api.npoint.io/08cab0751b745af2d7cf', 
  },
  designers: {
    color: '#8884d8', 
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
    return <div className="p-4">Đang tải...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">Lỗi: {error}</div>;
  }
  if (!data) {
    return <div className="p-4">Không có dữ liệu.</div>;
  }

  // Kiểm tra xem có dữ liệu biểu đồ hay không
  const hasChart = data.chartData && data.chartData.length > 0;

  // Nếu KHÔNG CÓ CHART ("Total Designers")
  if (!hasChart) {
    return (
      <div className='flex h-full pl-[15px]'> 
        <div className='flex flex-col justify-between w-full'>
            <div className="title font-bold text-black text-lg flex gap-3">
                <i className={config.icon}></i>
                <span>{config.title}</span>
            </div>
            
            <h1 className='text-3xl text-black font-bold text-center'>{data.number}</h1>
            
            <div className="flex justify-between items-end">
                <div className='text-amber-300 hover:text-soft-bg'>
                    <Link to={config.link}> View all </Link>
                </div>
                {config.duration && (
                    <span className="duration text-sm">{config.duration}</span>
                )}
            </div>
        </div>
      </div>
    );
  }

  // Nếu CÓ CHART ("Total Users")
  return (
    <div className='flex h-full chartBox'>
        {/* --- PHẦN THÔNG TIN --- */}
        <div className='boxInfo pl-[15px] flex-3 flex-col justify-between flex'>
            <div className="title font-bold text-black text-lg flex text-center">
                <i className={config.icon}></i>
                <span>{config.title}</span>
            </div>
            <h1 className='text-3xl text-black font-bold'>{data.number}</h1>
            <div className='text-amber-300 hover:text-soft-bg'>
                <Link to={config.link}> View all </Link>
            </div>
        </div>

        {/* --- PHẦN BIỂU ĐỒ --- */}
        <div className='chartInfo flex-2 flex flex-col justify-between'>
            <div className="chart h-full w-full ">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data.chartData}>
                        <Tooltip
                            contentStyle={{ background: "transparent", border: "none" }}
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
            <div className="texts flex flex-col text-right">
                {data.percentage !== undefined && (
                    <span className='percentage' style={{ color: data.percentage < 0 ? "tomato" : "limegreen" }} >
                        {data.percentage}% 
                    </span>
                )}
                {config.duration && (
                     <span className="duration">{config.duration}</span>
                )}
            </div>
        </div>
    </div>
  );
}

export default ChartBox;