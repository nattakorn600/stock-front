export interface Product {
  product_Id: number;
  product_Name: string;
  unit_Price: number;
}

export interface Stock {
  stock_Id: number;
  product_Id: number;
  amount: number;
}

export interface CartItem extends Product {
  quantity: number;
}
