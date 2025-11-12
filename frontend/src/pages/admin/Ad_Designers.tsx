import React from 'react';
import DesignersTable from '@/components/admin/DesignersTable'; 
import AddButton from '@/components/Button';

const Ad_Designers = () => {
  return (
    <div className='Ad_Designers pt-4 px-4 pb-1 flex flex-col gap-1 h-full'>
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#386641]">Designers</h1>
        <AddButton to="/admin_designer/new">
        Add New Designer
        </AddButton>
      </div>

      <div className="overflow-x-auto flex-1 min-h-0"> 
        <DesignersTable />
      </div>

    </div>
  );
};

export default Ad_Designers; 