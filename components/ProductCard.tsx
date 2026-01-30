"use client";

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 p-4 flex items-center gap-6 group">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">{product.product_Name}</h3>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-xl font-bold text-indigo-600 w-24 text-right">
          ${product.unit_Price.toLocaleString()}
        </span>
        <button 
          onClick={() => addToCart(product)}
          className="p-2.5 rounded-lg transition-all duration-200 shadow-sm flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
        >
          <Plus size={20} />
          <span className="text-sm font-medium hidden sm:inline">
            Add
          </span>
        </button>
      </div>
    </div>
  );
}
