import './scss/styles.scss';

import { AppData } from './components/AppData';
import { BasketCard, Card } from './components/Card';
import { AuctionAPI } from './components/myApi';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Order, Contacts } from './components/Order';
import { Success } from './components/common/Success';
import { ICardView, IOrderView, CardBasketView } from './types/index';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new AuctionAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
});

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contacsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const window = ensureElement<HTMLElement>('#modal-container');
const pageBody = document.body;

const appData = new AppData(events, {
    catalog: [],
    basket: [],
    preview: null,
    order: null,
    formErrors: {}
});

const page = new Page(pageBody, events);
const modal = new Modal(window, events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contacsTemplate), events);

api.getCardList()
.then((cards: ICardView[]) => {
    appData.setCatalog(cards);
})
.catch((err) => {
    console.error(err);
});

events.on('cards:changed', () => {
    page.counter = appData.basket.length;
    page.gallery = appData.catalog.map((item: ICardView) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => {
                events.emit('preview:changed', item);
            },
        });
        return card.render(item);
    });
});

events.on('card:selected', (item: ICardView) => {
    appData.setPreview(item);
});

events.on('preview:changed', (item: ICardView) => {
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            events.emit('card:basket', item);
            events.emit('preview:changed', item);
            modal.close();
        },
    });
    modal.render({
        content: card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            button: appData.getButtonStatus(item),
        }),
    });
    modal.open();
});

events.on('card:basket', (item: ICardView) => {
    appData.toggleBasketState(item);
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render(),
    });
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

events.on('basket:changed', () => {
    page.counter = appData.basket.length;
    basket.total = appData.getTotalPrice();
    basket.items = appData.basket.map((basketCard: ICardView, index: number) => {
        const newBasketCard = new BasketCard(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.deleteFromBasket(basketCard);
            },
        });
        return newBasketCard.render({
            id: basketCard.id,
            title: basketCard.title,
            price: basketCard.price || 0,
            index,
            isMyBid: false,
            image: basketCard.image,
            category: basketCard.category,
            button: appData.getButtonStatus(basketCard)
        });
    });
});

events.on('order:open', () => {
    order.clearPayButton();
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: [],
            payment: '',
            email: '',
            phone: ''
        }),
    });
});

events.on(
    /^order\..*:changed/,
    (data: {
        field: keyof Pick<IOrderView, 'address' | 'phone' | 'email'>;
        value: string;
    }) => {
        appData.setOrderField(data.field, data.value);
    }
);

events.on('order:changed', (data: { payment: string; button: HTMLElement }) => {
    order.togglePayButton(data.button);
    appData.setOrderPayment(data.payment);
    appData.validateOrder();
});

events.on('formErrors:changed', (errors: Partial<IOrderView>) => {
    const { email, phone, address, payment } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address })
        .filter((i) => !!i)
        .join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone })
        .filter((i) => !!i)
        .join('; ');
});

events.on('order:submit', () => {
    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('contacts:submit', () => {
    appData.setBasketToOrder();
    api
        .orderItems(appData.order)
        .then((result) => {
            const successWindow = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                },
            });
            appData.clearBasket();
            appData.clearOrderState();

            modal.render({ content: successWindow.render({ total: result.total }) });
        })
        .catch((err) => {
            console.error(`Ошибка выполнения заказа ${err}`);
        });
});