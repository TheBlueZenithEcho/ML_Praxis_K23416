// Ad_Users.tsx
import UsersTable from '@/components/admin/UsersTable';
import React from 'react'

const Ad_Users = () => {
  return (
    <div className='users flex flex-col h-full pt-4 px-4 pb-1 gap-1'> 
      <div className='info flex-shrink-0'>
        <h1 className='text-3xl font-bold text-[#386641]'> Users </h1>
      </div>
      
      <div className="overflow-x-auto flex-1 min-h-0">
        <UsersTable/>
      </div>
    </div>
  );
};

export default Ad_Users