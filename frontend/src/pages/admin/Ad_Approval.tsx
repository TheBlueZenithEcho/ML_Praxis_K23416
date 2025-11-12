// Tên file: pages/admin/Ad_Approval.tsx
// (Full code)

import React from 'react';
// SỬA: Đảm bảo đường dẫn này đúng
// Nếu PendingInteriorsGrid.tsx ở src/admin/ thì dùng:
// import PendingInteriorsGrid from '@/src/admin/PendingInteriorsGrid';
// Nếu ở components/admin/ thì dùng:
import PendingInteriorsGrid from '@/components/admin/PendingInteriorsGrid'; 

const Ad_Approval = () => {
  return (
    <div className='Ad_Approval p-4 flex flex-col gap-4 h-full'>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className='text-3xl font-bold text-[#386641]'>Pending Approval</h1>
      </div>

      {/* Component Lưới */}
      <div className="bg-white p-0 rounded shadow flex-1 min-h-0 overflow-y-auto">
        <PendingInteriorsGrid />
      </div>
    </div>
  );
}

export default Ad_Approval;