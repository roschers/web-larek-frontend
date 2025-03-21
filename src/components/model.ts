import { IModel, IProduct, ICartItem, IAppState, IOrder, FormErrors } from '../types';
import { EventEmitter } from './base/events';

export class AppModel extends EventEmitter implements IModel {
    private _state: IAppState = {
        catalog: [],
        basket: [],
        preview: null,
        order: null,
        formErrors: {} as FormErrors
    };

    setState(patch: Partial<IAppState>) {
        this._state = { ...this._state, ...patch };
        this.emitChanges('state:changed', this._state);
    }

    getState(): IAppState {
        return this._state;
    }

    addToBasket(item: IProduct): void {
        const existingItem = this._state.basket.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this._state.basket.push({ ...item, quantity: 1 });
        }
        this.emitChanges('basket:changed', this._state.basket);
    }

    removeFromBasket(id: string): void {
        this._state.basket = this._state.basket.filter(item => item.id !== id);
        this.emitChanges('basket:changed', this._state.basket);
    }

    clearBasket(): void {
        this._state.basket = [];
        this.emitChanges('basket:changed', this._state.basket);
    }

    setPreview(item: IProduct | null): void {
        this._state.preview = item;
        this.emitChanges('preview:changed', this._state.preview);
    }

    emitChanges(event: string, payload: object): void {
        this.emit(event, payload);
    }

    validateOrder(order: Partial<IOrder>): FormErrors {
        const errors: FormErrors = {};
        
        if (!order.email?.includes('@')) {
            errors.email = 'Некорректный email';
        }
        if (!order.phone?.match(/^\+7\d{10}$/)) {
            errors.phone = 'Некорректный телефон';
        }
        if (!order.address?.length) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }

        this.setState({ formErrors: errors });
        return errors;
    }
}