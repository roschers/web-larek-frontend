import {Api, ApiListResponse} from "./base/api";
import {ICardView, IOrderView, IOrderViewResult} from "../types/index";

export class AuctionAPI extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardItem(id: string): Promise<ICardView> {
        return this.get(`/lot/${id}`).then(
            (item: ICardView) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }

    getLotUpdate(id: string): Promise<ICardView> {
        return this.get(`/lot/${id}/_auction`).then(
            (data: ICardView) => data
        );
    }

    getCardList(): Promise<ICardView[]> {
        return this.get('/lot').then((data: ApiListResponse<ICardView>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    placeBid(id: string, price: number): Promise<ICardView> {
        return this.post(`/lot/${id}/_bid`, { price }).then(
            (data: ICardView) => data
        );
    }

    orderItems(order: IOrderView): Promise<IOrderViewResult> {
        return this.post('/order', order).then(
            (data: IOrderViewResult) => data
        );
    }
}