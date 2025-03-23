export interface IAuctionAPI { 
  getCardItem: (id: string) => Promise<ICardView>; 
  getCardList: () => Promise<ICardView[]>; 
  getLotUpdate: (id: string) => Promise<CarUpdate>;
  placeBid(id: string, bid: IBid): Promise<CarUpdate>;
  orderItems: (order: IOrderView) => Promise<IOrderViewResult>; 
} 
 
export interface IBid {
  price: number
}
// Базовые интерфейсы 
// export interface IEventEmitter { 
//   on<T extends object>(event: string, callback: (data: T) => void): void; 
//   emit<T extends object>(event: string, data?: T): void; 
//   off(event: string, callback: Function): void; 
//   onAll(callback: (event: string, data?: unknown) => void): void;  
//   offAll(): void; 
// } 

export type CarStatus = 'wait' | 'active' | 'closed';

export type CarUpdate = {
    id: string;
    datetime: string;
    status: CarStatus;
    price: number;
    history?: number[];
};

export interface IAuction {
  status: CarStatus;
  datetime: string;
  price: number;
  minPrice: number;
  history?: number[];
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
  locked: boolean;
} 
 
export interface ICardView { 
  id: string; 
  title: string; 
  description?: string; 
  price: number | null; 
  image: string; 
  category: CardType; 
  button: string; 
} 
 
export interface ICardViewActions { 
  onClick: (event: MouseEvent) => void; 
} 
 
export interface IModalData {
    content: HTMLElement; 
}
 
export interface IFormView { 
  valid: boolean; 
  errors: string[]; 
} 
 
export interface IContactsView extends IFormView {
    email: string;
    phone: string;
    valid: boolean;
    errors: string[];
}
 
export interface IOrderView extends IFormView {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
    total?: number;
    items?: string[];
}
 
export interface IOrderViewResult { 
  id: string; 
  total: number; 
} 
 
export interface IBasketView { 
  items: CardBasketView[]; 
  total: number | null; 
} 
 
export interface ISuccessView {
  close: HTMLButtonElement;
	description: HTMLSpanElement;
	total: number;
}

export interface ISuccessViewActions {
  onClick: () => void;
}
 
// export interface IComponent<T> { 
//   toggleClass(className: string, force?: boolean): void; 
//   setText(text: string): void; 
//   setImage(src: string, alt?: string): void; 
//   setDisable(state: boolean): void; 
//   setVisible(): void; 
//   setHidden(): void; 
//   render(data?: Partial<T>): HTMLElement; 
// } 
 
// export interface IModel<T> { 
//   emitChanges(event: string, payload?: unknown): void; 
// } 
 
export type CardBasketView = Pick<ICardView, 'id' | 'title' | 'price'> & {
  index: number;
  isMyBid: boolean;
  image: string;
  category: CardType;
  button: string;
}; 
 
export type CardType = 
  | 'другое' 
  | 'софт-скил' 
  | 'дополнительное' 
  | 'кнопка' 
  | 'хард-скил'; 
 
export type FormErrors = Partial<Record<keyof IOrderView, string>>;

// export interface IProduct {
//     id: string;
//     title: string;
//     description: string;
//     price: number | null;
//     image: string;
//     category: CardType;
// }

