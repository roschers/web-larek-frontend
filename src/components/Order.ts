import { IOrder } from '../types/types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrder> {
	protected _address: HTMLInputElement;
	protected buttonNal: HTMLButtonElement;
	protected buttonOnline: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._address = container.elements.namedItem('address') as HTMLInputElement;

		this.buttonOnline = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;

		this.buttonNal = container.elements.namedItem('cash') as HTMLButtonElement;

		if (this.buttonOnline) {
			this.buttonOnline.addEventListener('click', () => {
				events.emit(`order:changed`, {
					payment: this.buttonOnline.name,
					button: this.buttonOnline,
				});
			});
		}

		if (this.buttonNal) {
			this.buttonNal.addEventListener('click', () => {
				events.emit(`order:changed`, {
					payment: this.buttonNal.name,
					button: this.buttonNal,
				});
			});
		}
	}

	set address(value: string) {
		this._address.value = value;
	}

	togglePayButton(value: HTMLElement) {
		this.clearPayButton();
		this.toggleClass(value, 'button_alt-active', true);
	}

	clearPayButton() {
		this.toggleClass(this.buttonNal, 'button_alt-active', false);
		this.toggleClass(this.buttonOnline, 'button_alt-active', false);
	}
}

export class Contacts extends Form<IOrder> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._email = container.elements.namedItem('email') as HTMLInputElement;
		this._phone = container.elements.namedItem('phone') as HTMLInputElement;
	}
	set email(value: string) {
		this._email.value = value;
	}
	set phone(value: string) {
		this._phone.value = value;
	}
}
}