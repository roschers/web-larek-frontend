import { Api, ApiListResponse } from "./base/Api";
import { IApi, ICard, IOrder, IOrderResult } from '../types';

export class myApi extends Api implements IApi {
    private cdn: string;

    constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<ICard> {
        return this.get(`/product/${id}`).then((item: ICard) => ({
            ...item,
            image: this.cdn + item.image
        }));
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) =>
            data.items.map((item: ICard) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data);
    }
}