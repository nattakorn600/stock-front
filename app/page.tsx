"use client";

import { CartProvider } from '@/context/CartContext';
import StockApp from '@/components/StockApp';

export default function Home() {
  return (
    <CartProvider>
      <StockApp />
    </CartProvider>
  );
}
