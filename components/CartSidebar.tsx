"use client";

import { useCart } from '@/context/CartContext';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { useState } from 'react';

export default function CartSidebar() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);


  if (cart.length === 0) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50 border-l border-gray-200">
            <ShoppingCart size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Add products to start a new order.</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 shadow-xl">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="text-indigo-600" size={24} />
                Current Order
            </h2>
            <button 
                onClick={clearCart} 
                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
            >
                Clear All
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.map((item) => (
                <div key={item.product_Id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{item.product_Name}</h4>
                            <button 
                                onClick={() => removeFromCart(item.product_Id)}
                                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-indigo-600 font-medium text-sm mb-2">${item.unit_Price}</p>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => updateQuantity(item.product_Id, item.quantity - 1)}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                            >
                                <Minus size={12} />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.product_Id, item.quantity + 1)}
                                className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                            >
                                <Plus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">${totalPrice}</span>
            </div>
            <button 
                disabled={isCheckingOut}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
            </button>
        </div>
    </div>
  );
}
