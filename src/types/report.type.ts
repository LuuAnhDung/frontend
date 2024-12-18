import { IOrder } from './order.type';

export interface IReport {
  categories: number;
  courses: number;
  users: number;
  orders: IOrder[];
  ordersCount: number;
  saleOf30days: number;
  totalOrdersIn30Days: number;
  conversions: number;
}
