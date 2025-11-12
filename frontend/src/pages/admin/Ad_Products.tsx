import AddButton from '@/components/Button';
import ProductsTable from '@/components/admin/ProductsTable';
import React from 'react';
import { Link } from 'react-router';

const Ad_Products = () => {
  return (
    <div className='Ad_Products pt-4 px-4 pb-1 flex flex-col gap-1 h-full'>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className='text-3xl font-bold text-[#386641]'>Products</h1>
        <AddButton to="/admin_products/new">
        Add New Product
        </AddButton>
      </div>

      <div className="bg-white p-0 rounded shadow flex-1 min-h-0 overflow-hidden">
        <ProductsTable/>
      </div>
    </div>
  );
}

export default Ad_Products;