import { IApi, IProduct, IOrderResponse, IOrderRequest } from '../../types';

export class ApiClient {
    constructor(private api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<IProduct[]> {
        const data = await this.api.get<{ items: IProduct[] }>('/product/');
        return data.items
    }

    async createOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        const data = await this.api.post<IOrderResponse>('/order/', orderData);
        return data
    }
}