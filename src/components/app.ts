import { Modal, PreviewModal, BasketModal, FormModal, SuccessModal } from './modal';
import { IProduct, IOrderView, IOrder } from '../types';
import { AppModel } from './model';
import { CatalogCard } from './card';

export class App {
    private _model: AppModel;
    private _previewModal: PreviewModal;
    private _basketModal: BasketModal;
    private _formModal: FormModal;
    private _successModal: SuccessModal;

    constructor(container: HTMLElement) {
        this._model = new AppModel();
        this._previewModal = new PreviewModal(container);
        this._basketModal = new BasketModal(container);
        this._formModal = new FormModal(container);
        this._successModal = new SuccessModal(container);

        // Подписываемся на события модели
        this._model.on('state:changed', () => {
            this.render();
        });

        // Обработчики событий
        this._previewModal.on('click', (product: IProduct) => {
            this._model.addToBasket(product);
        });

        this._basketModal.on('click', (event: { id: string }) => {
            this._model.removeFromBasket(event.id);
        });

        this._formModal.on('submit', (data: IOrderView) => {
            this.createOrder(data);
        });

        this._successModal.on('click', () => {
            this._model.clearBasket();
            this._successModal.setHidden();
        });
    }

    private createOrder(data: IOrderView): void {
        const order: IOrder = {
            ...data,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            items: this._model.getState().basket.map(item => item.id),
            total: this._model.getState().basket.reduce((sum: number, item: IProduct) => sum + (item.price || 0), 0)
        };
        this._model.setState({ order });
        this._formModal.setHidden();
        this._successModal.setVisible();
    }

    render(): void {
        const state = this._model.getState();

        // Рендерим каталог
        const catalog = document.querySelector('.catalog');
        if (catalog) {
            catalog.innerHTML = '';
            state.catalog.forEach(item => {
                const card = new CatalogCard(item, (product: IProduct) => {
                    this._previewModal.setVisible();
                    this._previewModal.open(this.createPreviewContent(product));
                });
                catalog.appendChild(card.render());
            });
        }

        // Обновляем счетчик корзины
        const counter = document.querySelector('.basket__counter');
        if (counter) {
            counter.textContent = state.basket.length.toString();
        }
    }

    private createPreviewContent(product: IProduct): HTMLElement {
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="preview">
                <div class="preview__content">
                    <h2 class="preview__title">${product.title}</h2>
                    <img class="preview__image" src="${product.image}" alt="${product.title}" />
                    <p class="preview__description">${product.description}</p>
                    <span class="preview__price">${product.price ? `${product.price} синапсов` : 'Бесценно'}</span>
                    <button class="preview__button">В корзину</button>
                </div>
            </div>
        `;
        return content;
    }
}