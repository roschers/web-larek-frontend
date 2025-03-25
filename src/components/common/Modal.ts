import { Component } from "../base/Component";
import { IModalData } from '../../types';
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    protected _container: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Инициализация элементов
        this._closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close', 
            container
        );
        this._content = ensureElement<HTMLElement>(
            '.modal__content', 
            container
        );
        this._container = ensureElement<HTMLElement>(
            '.modal__container', 
            container
        );

        // Обработчики событий
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._container.addEventListener('click', (e) => e.stopPropagation());
    }

    // Установка содержимого модального окна
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    // Открытие модального окна
    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    // Закрытие модального окна
    close(): void {
        this.container.classList.remove('modal_active');
        this._content.innerHTML = '';
        this.events.emit('modal:close');
    }

    // Рендер модального окна (вызывается при обновлении данных)
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}