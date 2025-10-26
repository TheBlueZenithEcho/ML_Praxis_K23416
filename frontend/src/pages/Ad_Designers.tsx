import React from 'react';
import DesignersTable from '../components/DesignersTable'; 
import AddButton from '../components/Button';

const Ad_Designers = () => {
  return (
    <div className='Ad_Designers p-4 flex flex-col gap-4 h-full'>
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-700">Designers</h1>
        <AddButton to="/admin_products/new">
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