
import React from 'react';

import QuotationGrid from '@/components/admin/QuotationGrid';

const Ad_Quotation = () => {
  return (
    <div className='Ad_Approval p-4 flex flex-col gap-4 h-full'>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className='text-3xl font-bold text-[#386641]'>Quotation</h1>
      </div>

      {/* Component Lưới */}
      <div className="bg-white p-0 rounded shadow flex-1 min-h-0 overflow-y-auto">
        <QuotationGrid />
      </div>
    </div>
  );
}

export default Ad_Quotation;