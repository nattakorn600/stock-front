"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '@/types';
import { getStockById, updateStock } from '@/lib/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => Promise<void> | void;
  increaseQuantity: (productId: number) => Promise<void> | void;
  decreaseQuantity: (productId: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  checkout: () => { success: boolean; message: string };
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: Product) => {
    let currstock = await getStockById(product.product_Id);
    currstock.amount = currstock.amount - 1;
    updateStock(product.product_Id, currstock);

    setCart((prev) => {
      const existing = prev.find((item) => item.product_Id === product.product_Id);
      if (existing) {
        if (existing.quantity >= currstock.amount) {
            alert('สินค้าหมดสต็อกหรือคุณหยิบสินค้าครบตามจำนวนที่มีแล้ว');
            return prev;
        }
        return prev.map((item) =>   
          item.product_Id === product.product_Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (currstock.amount <= 0) {
        alert('สินค้าหมดสต็อก');
        return prev;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = async (productId: number) => {
    let currstock = await getStockById(productId);
    currstock.amount = (currstock.amount + (cart.find((item) => item.product_Id === productId)?.quantity??0));
    updateStock(productId, currstock);

    setCart((prev) => prev.filter((item) => item.product_Id !== productId));
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) {
      //removeFromCart(productId);
      return;
    }
    
    try {
      const currstock = await getStockById(productId);
      
      setCart((prev) => {
         const item = prev.find(i => i.product_Id === productId);
         if (quantity > currstock.amount) {
           alert('ไม่สามารถเพิ่มจำนวนสินค้าได้เนื่องจากเกินจำนวนสต็อกที่มี');
           return prev;
         }
         
         return prev.map((item) =>
          item.product_Id === productId ? { ...item, quantity } : item
         );
      });
    } catch (error) {
      console.error("Failed to check stock for update", error);
    }
  };

  const increaseQuantity = async (productId: number) => {
    let currstock = await getStockById(productId);

    const item = cart.find(i => i.product_Id === productId);
    if (item) {
      const newQuantity = item.quantity + 1;
      if (newQuantity > currstock.amount) {
        alert('สินค้าหมดสต็อกหรือคุณหยิบสินค้าครบตามจำนวนที่มีแล้ว');
        return;
      }
      currstock.amount = currstock.amount - newQuantity;
      await updateStock(productId, currstock);
      await updateQuantity(productId, newQuantity);
    }
  };

  const decreaseQuantity = async (productId: number) => {
    let currstock = await getStockById(productId);

    const item = cart.find(i => i.product_Id === productId);
    if (item) {
      if (item.quantity <= 1) {
        removeFromCart(productId);
        return;
      }

      const newQuantity = item.quantity - 1;
      currstock.amount = currstock.amount + newQuantity;
      await updateStock(productId, currstock);
      await updateQuantity(productId, newQuantity);
    }
  };

  const clearCart = async () => {
    cart.forEach(async (item) => {
      let currstock = await getStockById(item.product_Id);
      currstock.amount = currstock.amount + item.quantity;
      updateStock(item.product_Id, currstock);
    });
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.unit_Price * item.quantity, 0);
  };

  const checkout = () => {
    clearCart();
    return { success: true, message: 'Checkout successful!' };
  };

  const totalPrice = getCartTotal();
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getCartTotal,
      checkout,
      totalPrice,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
