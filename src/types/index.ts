// Типы данных API
export interface IApiProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  description?: string;
}

export interface IApiOrder {
  payment: "online" | "cash";
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // Массив ID товаров
}

export interface IApiOrderResponse {
  id: string;
  total: number;
}

// Базовые типы для Model
export interface IProduct extends Pick<IApiProduct, "id" | "title" | "price" | "category" | "image"> {
  isInBasket: boolean;
}

export interface IOrder extends Omit<IApiOrder, "items"> {
  items: IProduct[];
}

// Интерфейсы для View
export interface ICardView {
  element: HTMLElement;
  categoryElement: HTMLSpanElement;
  titleElement: HTMLHeadingElement;
  imageElement: HTMLImageElement;
  priceElement: HTMLSpanElement;
  render(templateId: string): HTMLElement;
  bindEvents(handler: (id: string) => void): void;
}

export interface IBasketView {
  listElement: HTMLUListElement;
  totalPriceElement: HTMLSpanElement;
  update(items: IProduct[]): void;
}

export interface IModalView {
  open(content: HTMLElement): void;
  close(): void;
  handleOutsideClick(event: MouseEvent): void;
}

// Интерфейс API-клиента
export interface IApiClient {
  getProducts(): Promise<IApiProduct[]>;
  postOrder(order: IApiOrder): Promise<IApiOrderResponse>;
}

// Базовые интерфейсы
export interface IEventEmitter {
  on(event: string, callback: Function): void;
  emit(event: string, data?: unknown): void;
  off(event: string, callback: Function): void;
}

// События приложения
export interface ICardSelectEvent {
  type: "card:select";
  data: { productId: string };
}

export interface IBasketUpdateEvent {
  type: "basket:update";
  data: { items: IProduct[] };
}

export interface IOrderSubmitEvent {
  type: "order:submit";
  data: IOrder;
}

// Утилитарные типы
export type PaymentMethod = "online" | "cash";

export interface IValidationResult {
  isValid: boolean;
  message?: string;
}

// Расширенные типы для компонентов
export type TCardTemplate = "catalog" | "preview" | "basket";

export interface ICardConfig {
  template: TCardTemplate;
  onClick?: (productId: string) => void;
}

// Интерфейсы для моделей
export interface IProductModel {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  isInBasket: boolean;
}

export interface IBasketModel {
  items: IProductModel[];
  addProduct(product: IProductModel): void;
  removeProduct(productId: string): void;
  getTotalPrice(): number;
  clear(): void;
}