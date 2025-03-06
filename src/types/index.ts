// Типы данных, приходящие через API
export interface ApiProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

export interface ApiOrder {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // Массив ID товаров
}

export interface ApiOrderResponse {
  id: string;
  total: number;
}

// Типы данных для отображения на экране
export interface Product extends ApiProduct {
  isInBasket: boolean; // Флаг, указывающий, добавлен ли товар в корзину
}

export interface Order {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: Product[]; // Массив товаров
}

// Интерфейс API-клиента
export interface IApiClient {
  getProducts(): Promise<ApiProduct[]>;
  postOrder(order: ApiOrder): Promise<ApiOrderResponse>;
}

// Интерфейсы модели данных
export interface IProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

export interface IBasket {
  items: Product[];
  totalPrice: number;
  addProduct(product: Product): void;
  removeProduct(productId: string): void;
  getTotalPrice(): number;
  clear(): void;
}

// Интерфейсы отображений
export interface IGallery {
  render(): void;
  handleProductClick(productId: string): void;
}

export interface IBasketView {
  render(): void;
  handleRemoveClick(productId: string): void;
}

export interface IOrderView {
  renderStep1(): void;
  renderStep2(): void;
  validateStep1(): boolean;
  validateStep2(): boolean;
  submitOrder(): void;
}

// Интерфейсы базовых классов
export interface IEventEmitter {
  on(event: string, callback: Function): void;
  emit(event: string, data?: any): void;
  off(event: string, callback: Function): void;
}

export interface IModal {
  isOpen: boolean;
  open(content: HTMLElement): void;
  close(): void;
  handleOutsideClick(event: MouseEvent): void;
}

// Перечисление событий и их интерфейсы
export interface ProductAddedEvent {
  product: Product;
}

export interface ProductRemovedEvent {
  productId: string;
}

export interface OrderSubmittedEvent {
  order: Order;
}

export interface ModalEvent {
  content: HTMLElement;
}

// Дополнительные типы и интерфейсы
export type PaymentMethod = "online" | "cash";

export interface OrderStep1 {
  payment: PaymentMethod;
  address: string;
}

export interface OrderStep2 {
  email: string;
  phone: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}