import { IProduct, IOrderResponse } from '../../types';

export class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const response = await fetch(`${this.baseUrl}/product/`)

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const data = await response.json();
            return data.items || [];
        }

        catch (error) {
            console.error('Не удалось получить товары', error);
            return [];
        }
    }

    async createOrder(orderData: IOrderResponse): Promise<IOrderResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/order/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error (`Ошибка HTTP: ${response.status}`)
            }

            const data: IOrderResponse = await response.json();
            return data;
        }

        catch (error) {
            console.error('Не удалось создать заказ', error);
            throw error;
        }
    }
}