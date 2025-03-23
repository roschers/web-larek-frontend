import { Model } from "./base/Model";
import { ICardView, IOrderView, IAppState, FormErrors, CardBasketView } from "../types/index";
import { IEvents } from "./base/events";

export class AppData extends Model<IAppState> {
    constructor(events: IEvents, initialState: IAppState) {
        super(events, initialState);
    }

    catalog: ICardView[] = [];
    basket: ICardView[] = [];
    preview: string | null = null;
    order: IOrderView | null = {
        total: 0,
        items: [],
        email: '',
        phone: '',
        address: '',
        payment: '',
        valid: false,
        errors: []
    };

    formErrors: FormErrors = {};

    toggleBasketState(item: ICardView) {
        return !this.state.basket.includes(item.id)
            ? this.addToBasket(item)
            : this.deleteFromBasket(item);
    }

    addToBasket(item: ICardView) {
        this.basket = [...this.basket, item];
        this.emitChanges('basket:changed');
    }

    deleteFromBasket(item: ICardView) {
        this.basket = this.basket.filter((card) => card.id !== item.id);
        this.emitChanges('basket:changed');
    }

    clearBasket() {
        this.basket = [];
        this.emitChanges('basket:changed');
    }

    clearOrderState() {
        this.order = {
            total: 0,
            items: [],
            email: '',
            phone: '',
            address: '',
            payment: '',
            valid: false,
            errors: []
        };
    }

    getTotalPrice() {
        return this.basket.reduce((total, card) => total + (card.price || 0), 0);
    }

    getCountBasketProducts() {
        return this.basket.length;
    }

    getButtonStatus(item: ICardView) {
        if (item.price === null) {
            return 'Не для продажи';
        }
        if (!this.basket.some((card) => card.id === item.id)) {
            return 'Добавить в корзину';
        } else {
            return 'Убрать из корзины';
        }
    }

    setCatalog(items: ICardView[]) {
        this.catalog = items;
        this.emitChanges('cards:changed', { catalog: this.catalog });
    }

    setPreview(item: ICardView) {
        this.preview = item.id;
        this.emitChanges('preview:changed', { preview: item });
    }

    setOrderField<K extends keyof IOrderView>(field: K, value: IOrderView[K]) {
        if (this.order) {
            this.order[field] = value;
            this.validateOrder();
        }   
    }

    setOrderPayment(value: string) {
        if (this.order) {
            this.order.payment = value;
        }
    }

    setOrderAddress(value: string) {
        if (this.order) {
            this.order.address = value;
        }
    }

    setOrderPhone(value: string) {
        if (this.order) {
            this.order.phone = value;
        }
    }

    setOrderEmail(value: string) {
        if (this.order) {
            this.order.email = value;
        }
    }

    setBasketToOrder() {
        if (this.order) {
            this.order.items = this.basket.map((card) => card.id);
            this.order.total = this.getTotalPrice();
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if (!this.order?.email) {
            errors.email = `Необходимо указать email`;
        }
        if (!this.order?.phone) {
            errors.phone = `Необходимо указать номер телефона`;
        }
        if (!this.order?.address) {
            errors.address = `Необходимо указать адрес`;
        }
        if (!this.order?.payment) {
            errors.payment = `Необходимо указать способ оплаты`;
        }

        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}   