export interface Task {
  id: number;
  title: string;
  done: boolean;
  lastdoneby?: string;
  lastdoneat?: string;
};

export interface CareRecord {
  id: number;
  type: string;
  date: string;
};

export interface FoodItem {
  id: number;
  name: string;
  expiry: string;
  stock: number;
};
