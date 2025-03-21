import { Api } from './base/api';
import { IProduct, IOrder } from '../types';

export class WebLarekAPI extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string) {
        super(baseUrl);
        this.cdn = cdn;
    }

    protected handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    private addCdnToImage(item: IProduct): IProduct {
        return {
            ...item,
            image: this.cdn + item.image
        };
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/products')
            .then(this.handleResponse)
            .then((data: IProduct[]) => data.map(this.addCdnToImage));
    }

    getProduct(id: string): Promise<IProduct> {
        return this.get(`/products/${id}`)
            .then(this.handleResponse)
            .then(this.addCdnToImage);
    }

    createOrder(order: IOrder): Promise<{ id: string }> {
        return this.post('/orders', order)
            .then(this.handleResponse)
            .then((data: { id: string }) => ({ id: data.id }));
    }
} 