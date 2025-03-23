import { IEvents } from "./events";
import { 
		IAppState, 
		ICardView, 
		IOrderView, 
		FormErrors, 
		CardBasketView 
} from "../../types";

// Гарда для проверки на модель
export const isModel = (obj: unknown): obj is Model<any> => {
	return obj instanceof Model;
}

/**
 * Базовая модель, чтобы можно было отличить ее от простых объектов с данными
 */
export abstract class Model<T> {
	protected events: IEvents;
	protected _state: T;

	constructor(events: IEvents, initialState: T) {
		this.events = events;
		this._state = initialState;
	}

	protected emitChanges(event: string, payload?: object) {
		this.events.emit(event, payload ?? {});
	}

	protected setState(state: Partial<T>) {
		this._state = { ...this._state, ...state };
	}

	get state(): T {
		return this._state;
	}
}

export class AppModel extends Model<IAppState> {
	constructor(events: IEvents) {
		super(events, {
			catalog: [],
			basket: [],
			preview: null,
			order: null,
			formErrors: {}
		});
	}

	setCatalog(items: ICardView[]) {
		this.setState({ catalog: items });
		this.emitChanges('cards:changed', { catalog: items });
	}

	setPreview(item: ICardView | null) {
		this.setState({ preview: item });
		this.emitChanges('preview:changed', item);
	}

	addToBasket(item: ICardView) {
		const basket = [...this.state.basket, item.id];
		this.setState({ basket });
		this.emitChanges('basket:changed', { basket });
	}

	removeFromBasket(id: string) {
		const basket = this.state.basket.filter((itemId) => itemId !== id);
		this.setState({ basket });
		this.emitChanges('basket:changed', { basket });
	}

	setOrder(order: IOrderView) {
		this.setState({ order });
		this.emitChanges('order:changed', order);
	}

	setFormErrors(errors: FormErrors) {
		this.setState({ formErrors: errors });
		this.emitChanges('formErrors:changed', errors);
	}

	getButtonStatus(item: ICardView): string {
		return this.state.basket.includes(item.id) ? 'В корзине' : 'В корзину';
	}

	getBasketTotal(): number {
		return this.state.basket.reduce((sum: number, itemId: string) => {
			const item = this.state.catalog.find((item) => item.id === itemId);
			return sum + (item?.price || 0);
		}, 0);
	}

	getBasketItems(): CardBasketView[] {
		return this.state.basket.map((itemId: string, index: number) => {
			const item = this.state.catalog.find((item) => item.id === itemId);
			return {
				id: itemId,
				title: item?.title || '',
				price: item?.price || 0,
				index
			};
		});
	}

	clearBasket() {
		this.setState({ basket: [] });
		this.emitChanges('basket:changed', { basket: [] });
	}

	clearOrderState() {
		this.setState({ order: null, formErrors: {} });
		this.emitChanges('order:changed', null);
		this.emitChanges('formErrors:changed', {});
	}

	setBasketToOrder() {
		this.setState({ order: { ...this.state.order, items: this.state.basket } });
		this.emitChanges('order:changed', { ...this.state.order, items: this.state.basket });
	}
}