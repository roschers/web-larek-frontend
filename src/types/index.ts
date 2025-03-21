// Базовые типы
export type EventCallback = (data?: unknown) => void;
export type AppEvents = 
  | 'items:changed'
  | 'basket:changed'
  | 'preview:changed'
  | 'order:changed'
  | 'formErrors:changed';

// Базовые интерфейсы
export interface IEventEmitter {
  on(event: string, callback: EventCallback): void;
  emit(event: string, data?: unknown): void;
  off(event: string, callback: EventCallback): void;
  onAll(callback: (event: string, data?: unknown) => void): void;
  offAll(): void;
}

export interface IComponent {
  render(): HTMLElement;
  toggleClass(className: string, force?: boolean): void;
  setText(text: string): void;
  setImage(src: string, alt?: string): void;
  setDisable(state: boolean): void;
  setVisible(): void;
  setHidden(): void;
}

// API интерфейс
export interface IApi {
  getCardItem: (id: string) => Promise<ICardView>;
  getCardList: () => Promise<ICardView[]>;
  orderItems: (order: IOrderView) => Promise<IOrderViewResult>;
}

// Модели
export interface IModel {
  emitChanges(event: string, payload?: unknown): void;
}

// Типы данных
export type CardType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export type FormErrors = Record<string, string>;

export type CardBasketView = Pick<ICardView, 'id' | 'title' | 'price'> & { index: number };

// Интерфейсы представлений
export interface IPageView extends IComponent {
  counter: number;
  gallery: HTMLElement[];
}

export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description: string;
  image: string;
  category: CardType;
}

export interface ICardView extends IComponent {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  category: CardType;
  button: string;
}

export interface ICardViewActions {
  onClick: (event: MouseEvent) => void;
}

export interface IModal extends IComponent {
  open(content?: HTMLElement): void;
  close(): void;
  content: HTMLElement;
}

export interface IForm extends IComponent {
  valid: boolean;
  errors: FormErrors;
  reset(): void;
}

export interface IContactsView extends IForm {
  email: HTMLInputElement;
  phone: HTMLInputElement;
}

export interface IOrderView {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderForm {
  payment: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderViewResult {
  id: string;
  total: number;
}

export interface IDoneView extends IComponent {
  close: HTMLButtonElement;
  description: string;
  total: number;
}

export interface IDoneViewActions {
  onClick: () => void;
}

export interface IBasketView extends IComponent {
  items: CardBasketView[];
  total: number | null;
}

// Типы для корзины
export interface ICartItem extends IProduct {
  quantity: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface ICartContext {
  cart: ICart;
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartItem: (productId: string, quantity: number) => void;
}

// Типы для заказа
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IOrder extends IOrderView {
  id: string;
  status: OrderStatus;
  createdAt: string;
}

// Состояние приложения
export interface IAppState {
  catalog: IProduct[];
  basket: ICartItem[];
  preview: IProduct | null;
  order: IOrder | null;
  formErrors: FormErrors;
}

// Типы для валидации
export interface IValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// Типы для API ответов
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}