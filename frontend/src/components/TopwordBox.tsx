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

        // Kiểm tra xem API trả về mảng trơn
        if (Array.isArray(responseData)) {
            data = responseData;
        } else if (responseData && Array.isArray(responseData.topKeywords)) {
            data = responseData.topKeywords;
        
        } else {
            throw new Error('Cấu trúc API không hợp lệ (không phải mảng hoặc object chứa "topKeywords")');
        }

        const sortedData = data.sort((a, b) => b.mentions - a.mentions);
        
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
      return <div className="text-black">Đang tải...</div>;
    }

    if (error) {
      return <div className="text-red-500">Lỗi: {error}</div>;
    }
    
    return (
      <div className="flex flex-col gap-4">
        {keywords.map((item, index) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <span className="w-5 text-black">{index + 1}.</span>
              <span className="text-black font-medium">{item.keyword}</span>
            </div>
            <span className="text-black font-medium">{item.mentions} lượt</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-xl text-black font-bold mb-4">Top Key Words</h1>
      {renderContent()}
    </div>
  );
};

export default TopwordBox;