import { IApi, ICardView, IOrderView, IOrderViewResult } from '../types';

export class myApi implements IApi {
    constructor(private readonly cdn: string, private readonly api: string) {}

    async getCardList(): Promise<ICardView[]> {
        const response = await fetch(`${this.api}/items`);
        if (!response.ok) {
            throw new Error('Failed to fetch card list');
        }
        const data = await response.json();
        return data.items.map((item: ICardView) => ({
            ...item,
            image: this.cdn + item.image
        }));
    }

    async getCardItem(id: string): Promise<ICardView> {
        const response = await fetch(`${this.api}/items/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch card item');
        }
        const item = await response.json();
        return {
            ...item,
            image: this.cdn + item.image
        };
    }

    async orderItems(order: IOrderView): Promise<IOrderViewResult> {
        const response = await fetch(`${this.api}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error('Failed to order items');
        }
        return await response.json();
    }
} 