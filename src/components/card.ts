import { IComponent, IProduct } from '../types';

// Базовый класс для карточек
export class BaseCard implements IComponent {
    protected _element: HTMLElement;
    protected _product: IProduct;

    constructor(product: IProduct) {
        this._element = document.createElement('div');
        this._element.classList.add('card');
        this._product = product;
    }

    render(): HTMLElement {
        this._element.innerHTML = this.getTemplate();
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
        this._element.classList.toggle('card--disabled', state);
    }

    setVisible(): void {
        this._element.classList.add('card--visible');
    }

    setHidden(): void {
        this._element.classList.remove('card--visible');
    }

    protected getTemplate(): string {
        return `
            <span class="card__category card__category_${this._product.category}">${this._product.category}</span>
            <h2 class="card__title">${this._product.title}</h2>
            <img class="card__image" src="${this._product.image}" alt="${this._product.title}" />
            <span class="card__price">${this._product.price ? `${this._product.price} синапсов` : 'Бесценно'}</span>
        `;
    }
}

// Карточка в каталоге
export class CatalogCard extends BaseCard {
    constructor(protected _product: IProduct, private _onClick: (product: IProduct) => void) {
        super(_product);
        this._element.addEventListener('click', () => this._onClick(this._product));
    }
}

// Карточка в корзине
export class BasketCard extends BaseCard {
    constructor(product: IProduct, private _onRemove: (id: string) => void) {
        super(product);
        this._element.classList.add('card_compact');
    }

    protected getTemplate(): string {
        return `
            <h2 class="card__title">${this._product.title}</h2>
            <span class="card__price">${this._product.price} синапсов</span>
            <button class="card__remove" type="button">✕</button>
        `;
    }

    render(): HTMLElement {
        const element = super.render();
        element.querySelector('.card__remove')?.addEventListener('click', () => {
            this._onRemove(this._product.id);
        });
        return element;
    }
}