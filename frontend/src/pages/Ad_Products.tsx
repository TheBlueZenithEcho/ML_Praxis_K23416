import AddButton from '../components/Button';
import ProductsTable from '../components/ProductsTable';
import React from 'react';
import { Link } from 'react-router';

const Ad_Products = () => {
  return (
    <div className='Ad_Products p-4 flex flex-col gap-4 h-full'>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className='text-3xl font-bold text-gray-800'>Products</h1>
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