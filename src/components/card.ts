import { ICardView, CardBasketView, ICardViewActions } from '../types';
import { Component } from './base/Component';
import { ensureElement, createElement } from '../utils/utils';

export const categories = new Map([
	['софт-скил', 'card__category_soft'],
	['хард-скил', 'card__category_hard'],
	['другое', 'card__category_other'],
	['дополнительное', 'card__category_additional'],
	['кнопка', 'card__category_button'],
]);

export class Card extends Component<ICardView> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardViewActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
		this._description = ensureElement<HTMLElement>('.card__text', this.container);
		this._category = ensureElement<HTMLElement>('.card__category', this.container);
		this._button = container.querySelector('.button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title() {
		return this._title.textContent || '';
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description() {
		return this._description.textContent || '';
	}

	set price(value: number | null) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
	}

	get price() {
		const priceText = this._price.textContent;
		if (priceText === 'Бесценно') return null;
		return parseInt(priceText?.replace(' синапсов', '') || '0', 10);
	}

	set image(value: string) {
		this.setImage(this._image, value, '');
	}

	set category(value: string) {
		this.setText(this._category, value);
		const categoryClass = categories.get(value);
		if (categoryClass) {
			this._category.classList.add(categoryClass);
		}
	}

	get category() {
		return this._category.textContent || '';
	}

	set button(value: string) {
		if (this._button) {
			this._button.disabled = value === 'В корзине';
			this.setText(this._button, value);
		}
	}

	render(data: ICardView): HTMLElement {
		super.render(data);
		this.title = data.title;
		this.price = data.price;
		this.image = data.image;
		this.description = data.description || '';
		this.category = data.category;
		this.button = data.button;
		return this.container;
	}
}

export class BasketCard extends Card {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardViewActions) {
		super(container, actions);
		this._index = ensureElement<HTMLElement>('.basket__item-index', this.container);
		this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

		if (actions?.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value.toString());
	}

	render(data: CardBasketView): HTMLElement {
		this.setText(this._title, data.title);
		this.setText(this._price, `${data.price} синапсов`);
		return this.container;
	}
}