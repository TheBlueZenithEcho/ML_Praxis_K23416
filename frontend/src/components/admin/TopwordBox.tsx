import React, { useState, useEffect } from 'react';

type TopKeyword = {
  id: number;
  keyword: string;
  mentions: number;
};

const API_TOP_WORDS_URL = 'https://api.npoint.io/add6a2d6694e8034cbff'; 

const TopwordBox = () => {
  const [keywords, setKeywords] = useState<TopKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // SỬA 1: Thêm state để lưu số lượt cao nhất
  const [maxMentions, setMaxMentions] = useState<number>(1); // Bắt đầu từ 1 để tránh lỗi chia cho 0

  useEffect(() => {
    const fetchTopWords = async () => {
      try {
        setLoading(true); 
        setError(null);

        const response = await fetch(API_TOP_WORDS_URL);
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu từ API');
        }
        
        const responseData = await response.json(); 
        let data: TopKeyword[] = []; 

        if (Array.isArray(responseData)) {
            data = responseData;
        } else if (responseData && Array.isArray(responseData.topKeywords)) {
            data = responseData.topKeywords;
        } else {
            throw new Error('Cấu trúc API không hợp lệ');
        }

        const sortedData = data.sort((a, b) => b.mentions - a.mentions);
        
        // SỬA 2: Tìm và lưu lại số lượt cao nhất
        const max = sortedData[0]?.mentions || 1;
        setMaxMentions(max);
        
        setKeywords(sortedData); 

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setLoading(false); 
      }
    };

    fetchTopWords();
  }, []); 

  // Hàm render nội dung
  const renderContent = () => {
    if (loading) {
      // SỬA 3: Thêm Giao diện skeleton loading cho đẹp
      return (
        <div className="flex flex-col gap-3 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">Lỗi: {error}</div>;
    }
    
    // SỬA 4: Cập nhật lại cấu trúc JSX để thêm thanh bar
    return (
      <div className="flex flex-col gap-2"> {/* Giảm gap để list sát hơn */}
        {keywords.map((item, index) => {
          // Tính toán chiều rộng thanh bar
          const barWidth = (item.mentions / maxMentions) * 100;

          return (
            <div 
              key={item.id} 
              className="relative w-full rounded-md overflow-hidden" // Container chính
            >
              {/* Thanh Bar (nằm ở dưới) */}
              <div
                className="absolute top-0 left-0 h-full bg-[#FFE797]/40" // Dùng màu của title nhưng làm mờ
                style={{ width: `${barWidth}%` }}
              ></div>
              
              {/* Nội dung (nằm ở trên) */}
              <div className="relative z-10 flex justify-between items-center p-2.5">
                <div className="flex items-center gap-x-3">
                  <span className="w-5 text-gray-500 font-semibold text-sm text-right">
                    {index + 1}.
                  </span>
                  <span className="text-gray-900 font-medium text-base">
                    {item.keyword}
                  </span>
                </div>
                <span className="text-gray-700 font-semibold text-sm">
                  {/* Thêm format số cho đẹp (1.520 thay vì 1520) */}
                  {item.mentions.toLocaleString('vi-VN')} lượt
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl text-[#386641] font-bold mb-4">Top Key Words</h1>
      {renderContent()}
    </div>
  );
};

export default TopwordBox;