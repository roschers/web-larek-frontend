import { IForm } from "../../types/types"
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Form<T> extends Component<IForm> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (evt: Event) => {
			const target = evt.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (evt: Event) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`order.${String(field)}:changed`, {
			field,
			value,
		});
	}

	clearValue() {
		this.container.reset();
	}

	render(state: Partial<T> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}