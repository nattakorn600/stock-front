import axios from 'axios';
import { Product, Stock } from '@/types';

const API_URL = 'http://localhost:5185/api';

const api = axios.create({
  baseURL: API_URL,
});

//Products
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/Products');
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`/Products/${id}`);
  return response.data;
};

export const updateProduct = async (id: number, product: Product): Promise<Product> => {
  const response = await api.put<Product>(`/Products/${id}`, product);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/Products/${id}`);
};


//Stock
export const getStockById = async (id: number): Promise<Stock> => {
  const response = await api.get<Stock>(`/Stock/${id}`);
  return response.data;
};

export const getStock = async (): Promise<Stock[]> => {
  const response = await api.get<Stock[]>('/Stock');
  return response.data;
};

export const updateStock = async (id: number, stock: Stock): Promise<Stock> => {
  const response = await api.put<Stock>(`/Stock/${id}`, stock);
  return response.data;
};

export const deleteStock = async (id: number): Promise<void> => {
  await api.delete(`/Stock/${id}`);
};  
