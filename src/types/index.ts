export interface IApi {
  getCardItem: (id: string) => Promise<ICardView>;
  getCardList: () => Promise<ICardView[]>;
  orderItems: (order: IOrderView) => Promise<IOrderViewResult>;
}

// Базовые интерфейсы
export interface IEventEmitter {
  on(event: string, callback: Function): void;
  emit(event: string, data?: unknown): void;
  off(event: string, callback: Function): void;
  onAll(callback: (event: string, data?: unknown) => void): void; 
  offAll(): void;
}

export interface IAppState {
  catalog: ICardView[];
  basket: string[];
  preview: ICardView | null;
  order: IOrderView | null;
  formErrors: FormErrors;
}

export interface IPageView {
  counter: number;
  gallery: HTMLElement[];
}

export interface ICardView {
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

export interface IModalData {
  open(content: HTMLElement): void;
  close(): void;
  content: HTMLElement;
}

export interface IFormView {
  valid: boolean;
  errors: string[];
}

export interface IContactsView extends IFormView {
  email: HTMLInputElement;
  phone: HTMLInputElement;
}

export interface IOrderView extends IFormView {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
  total?: number;
  items?: string[];
  togglePayButton?(method: string): void; // методы для управления UI
  clearPayButton?(): void;
}

export interface IOrderViewResult {
  id: string;
  total: number;
}

export interface IDoneView {
  close: HTMLButtonElement;
  description: string;
  total: number;
}

export interface IDoneViewActions {
  onClick: () => void;
}

export interface IBasketView {
  items: CardBasketView[];
  total: number | null;
}

export interface IComponent<T> {
  toggleClass(className: string, force?: boolean): void;
  setText(text: string): void;
  setImage(src: string, alt?: string): void;
  setDisable(state: boolean): void;
  setVisible(): void;
  setHidden(): void;
  render(): HTMLElement;
}

export interface IModel<T> {
  emitChanges(event: string, payload?: unknown): void;
}

export type CardBasketView = Pick<ICardView, 'id' | 'title' | 'price'> & { index: number };

export type CardType =
  | 'другое'
  | 'софт-скил'
  | 'дополнительное'
  | 'кнопка'
  | 'хард-скил';

export type FormErrors = Partial<Record<keyof IOrderView, string>>;