import { IComponent } from '../types';

export class Basket implements IComponent {
    protected _element: HTMLElement;

    constructor() {
        this._element = document.createElement('div');
        this._element.classList.add('basket');
    }

    render(): HTMLElement {
        return this._element;
    }

    toggleClass(className: string, force?: boolean): void {
        this._element.classList.toggle(className, force);
    }

    setText(text: string): void {
        this._element.textContent = text;
    }

    setImage(src: string, alt?: string): void {
        const img = document.createElement('img');
        img.src = src;
        if (alt) img.alt = alt;
        this._element.innerHTML = '';
        this._element.appendChild(img);
    }

    setDisable(state: boolean): void {
        this._element.classList.toggle('basket--disabled', state);
    }

    setVisible(): void {
        this._element.classList.add('basket--visible');
    }

    setHidden(): void {
        this._element.classList.remove('basket--visible');
    }
} 