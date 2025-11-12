// Sửa import Link và Button nếu chưa có hoặc sai
import { Link } from 'react-router';
import InteriorsTable from '@/components/admin/InteriorGrid'; 
import React from 'react';

const Ad_Interior = () => {
  return (
    <div className='Ad_Interior pt-4 px-4 pb-1 flex flex-col gap-1 h-full'>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className='text-3xl font-bold text-[#386641]'>Interior Designs</h1>
      </div>

      <div className="bg-white p-0 rounded shadow flex-1 min-h-0 overflow-hidden">
        <InteriorsTable/>
      </div>
    </div>
  );
}

export default Ad_Interior;