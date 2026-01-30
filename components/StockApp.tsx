"use client";

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { getProducts } from '@/lib/api';
import ProductCard from './ProductCard';
import CartSidebar from './CartSidebar';
import { useCart } from '@/context/CartContext';

export default function StockApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { itemCount } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stock Management</h1>
            <p className="text-gray-500 text-sm">Manage inventory and sales</p>
          </div>
        </header>

        {/* Product Grid */}
        <main className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl h-72 animate-pulse" />
                ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-24">
                {products.map((product) => (
                    <ProductCard key={product.product_Id} product={product} />
                ))}
            </div>
          )}
        </main>
      </div>

      {/* Cart Sidebar - Fixed on the right */}
      <div className="w-[400px] border-l border-gray-200 bg-white h-full z-20 shadow-2xl">
        <CartSidebar />
      </div>
    </div>
  );
}
