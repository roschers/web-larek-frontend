import { IModal, IComponent } from '../types';
import { EventEmitter } from './base/events';

export class Modal extends EventEmitter implements IModal {
    protected _content: HTMLElement;
    protected _container: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super();
        this._container = container;
        this._content = document.createElement('div');
        this._content.className = 'modal__content';
        this._container.appendChild(this._content);

        // Создаем кнопку закрытия
        this._closeButton = document.createElement('button');
        this._closeButton.className = 'modal__close';
        this._closeButton.innerHTML = '✕';
        this._container.appendChild(this._closeButton);

        // Обработчики закрытия
        this._closeButton.addEventListener('click', () => this.close());
        this._container.addEventListener('click', (e) => {
            if (e.target === this._container) {
                this.close();
            }
        });
    }

    render(): HTMLElement {
        return this._container;
    }

    toggleClass(className: string, force?: boolean): void {
        this._container.classList.toggle(className, force);
    }

    setText(text: string): void {
        this._content.textContent = text;
    }

    setImage(src: string, alt?: string): void {
        const img = document.createElement('img');
        img.src = src;
        if (alt) img.alt = alt;
        this._content.innerHTML = '';
        this._content.appendChild(img);
    }

    setDisable(state: boolean): void {
        this._container.classList.toggle('modal--disabled', state);
    }

    setVisible(): void {
        this._container.classList.add('modal--visible');
    }

    setHidden(): void {
        this._container.classList.remove('modal--visible');
    }

    open(content?: HTMLElement): void {
        if (content) {
            this._content.innerHTML = '';
            this._content.appendChild(content);
        }
        this.setVisible();
    }

    close(): void {
        this.setHidden();
        this.emit('close');
    }

    get content(): HTMLElement {
        return this._content;
    }
}

export class PreviewModal extends Modal {
    constructor(container: HTMLElement) {
        super(container);
        this._container.classList.add('modal', 'preview');
    }
}

export class BasketModal extends Modal {
    constructor(container: HTMLElement) {
        super(container);
        this._container.classList.add('modal', 'basket');
    }
}

export class FormModal extends Modal {
    constructor(container: HTMLElement) {
        super(container);
        this._container.classList.add('modal', 'form');
    }
}

export class SuccessModal extends Modal {
    constructor(container: HTMLElement) {
        super(container);
        this._container.classList.add('modal', 'success');
    }
} 