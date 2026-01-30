'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">สินค้าทั้งหมด</h2>
      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <ProductCard key={product.product_Id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
