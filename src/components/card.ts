import { ICard } from '../types';
import { ICardActions } from "../types";
import { ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';

export const categories = new Map([
	['софт-скил', 'card__category_soft'],
	['хард-скил', 'card__category_hard'],
	['другое', 'card__category_other'],
	['дополнительное', 'card__category_additional'],
	['кнопка', 'card__category_button'],
]);

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _description?: HTMLElement;
	protected _price: HTMLSpanElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLSpanElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._description = container.querySelector(`.card__text`);
		this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
		this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector(`.card__button`);

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

	set price(value: string) {
		if (value) {
			this.setText(
				this._price,
				`${
					value.toString().length <= 4 ? value : formatNumber(Number(value))
				} синапсов`
			);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price() {
		return this._price.textContent;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.add(categories.get(value));
	}

	get category() {
		return this._category.textContent || '';
	}

	set button(value: string) {
		this._button.textContent = value;
	}
}

export class BasketCard extends Card {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _deleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);
		if (actions && actions.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}
	set index(value: number) {
		this.setText(this._index, value);
	}
}