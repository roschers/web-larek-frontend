import { Model } from "./base/Model";
import { ICard, IOrder, IAppState, FormErrors } from "../types/types";

export class AppData extends Model<IAppState> {
    catalog: ICard[] = [];
    basket: ICard[] = [];
    preview: string | null = null;
    order: IOrder | null = {  // Инициализируем объект order с пустыми полями
        total: 0,
        items: [],
        email: '',
        phone: '',
        address: '',
        payment: '',
    };

	formErrors: FormErrors = {
	}

    toggleBasketState(item: ICard) {
        return !this.basket.some((card) => card.id === item.id)
			? this.addToBasket(item)
			: this.deleteFromBasket(item);
    }

    addToBasket(item: ICard) {
		this.basket = [...this.basket, item];
		this.emitChanges('basket:changed');
	}

	deleteFromBasket(item: ICard) {
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
		};
	}

    getTotalPrice() {
        return this.basket.reduce((total, card) => total + card.price, 0);
    }

    getCountBasketProducts() {
        return this.basket.length;
    }

    getButtonStatus(item: ICard) {
		if (item.price === null) {
			return 'Не для продажи';
		}
		if (!this.basket.some((card) => card.id == item.id)) {
			return 'Добавить в корзину';
		} else {
			return 'Убрать из корзины';
		}
	}
    getCardIndex(item: ICard) {
		return Number(this.basket.indexOf(item)) + 1;
	}

    setCatalog(items: ICard[]) {
        items.forEach((item) => (this.catalog = [...this.catalog, item]));
		this.emitChanges('cards:changed', { catalog: this.catalog });
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', { preview: item });
    }

    setOrderField<K extends keyof IOrder>(field: K, value: IOrder[K]) {
		if (this.order) {
			this.order[field] = value;
			this.validateOrder();
		}   
	}

    setOrderPayment(value: string) {
		this.order.payment = value;
	}

	setOrderAddress(value: string) {
		this.order.address = value;
	}

	setOrderPhone(value: string) {
		this.order.phone = value;
	}

	setOrderEmail(value: string) {
		this.order.email = value;
	}

    setBasketToOrder() {
		this.order.items = this.basket.map((card) => card.id);
		this.order.total = this.getTotalPrice();
	}
    validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = `Необходимо указать email`;
		}
		if (!this.order.phone) {
			errors.phone = `Необходимо указать номер телефона`;
		}
		if (!this.order.address) {
			errors.address = `Необходимо указать адрес`;
		}
		if (!this.order.payment) {
			errors.payment = `Необходимо указать способ оплаты`;
		}

		this.formErrors = errors;
		this.events.emit('formErrors:changed', this.formErrors);
		return Object.keys(errors).length === 0;
	}

    
}   