import { IModalData } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Modal extends Component<IModalData> {
	protected closeButton: HTMLButtonElement;
	protected _content: HTMLElement;
	protected _container: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._container = ensureElement<HTMLElement>('.modal__container', container);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this.closeButton.addEventListener('click', () => this.close());
		this.container.addEventListener('click', () => this.close());
		this._container.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(value: HTMLElement | null) {
		if (value) {
			this._content.innerHTML = '';
			this._content.append(value);
		} else {
			this._content.innerHTML = '';
		}
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		return this.container;
	}
}