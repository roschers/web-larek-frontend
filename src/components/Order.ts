import { Component } from './base/Component';
import { IOrderView, IContactsView } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

export class Order extends Component<IOrderView> {
	protected _button: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _payment: HTMLButtonElement[];
	protected _errors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
		this._address = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
		this._payment = Array.from(this.container.querySelectorAll('.order__buttons .button_alt'));
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		if (this._address) {
			this._address.addEventListener('input', () => {
				this.events.emit('order.address:changed', {
					field: 'address',
					value: this._address.value
				});
			});
		}

		this._payment.forEach(button => {
			button.addEventListener('click', () => {
				this.events.emit('order:changed', {
					payment: button.name,
					button: button
				});
			});
		});

		this._button.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('order:submit');
		});
	}

	set valid(value: boolean) {
		this._button.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	clearPayButton() {
		this._payment.forEach(button => {
			button.classList.remove('button_alt-active');
		});
	}

	togglePayButton(button: HTMLElement) {
		this._payment.forEach(btn => {
			btn.classList.remove('button_alt-active');
		});
		button.classList.add('button_alt-active');
	}

	render(data: IOrderView): HTMLElement {
		super.render(data);
		this.valid = data.valid;
		this.errors = data.errors.join('; ');
		return this.container;
	}
}

export class Contacts extends Component<IContactsView> {
	protected _button: HTMLButtonElement;
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
		this._email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
		this._phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		if (this._email) {
			this._email.addEventListener('input', () => {
				this.events.emit('contacts.email:changed', {
					field: 'email',
					value: this._email.value
				});
			});
		}

		if (this._phone) {
			this._phone.addEventListener('input', () => {
				this.events.emit('contacts.phone:changed', {
					field: 'phone',
					value: this._phone.value
				});
			});
		}

		this._button.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('contacts:submit');
		});
	}

	set valid(value: boolean) {
		this._button.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(data: IContactsView): HTMLElement {
		super.render(data);
		this.valid = data.valid;
		this.errors = data.errors.join('; ');
		return this.container;
	}
}