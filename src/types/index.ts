export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}


export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type TPayment = 'card' | 'cash' | '';

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderRequest{
    items: string[];
    total: number;
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrderResponse {
    id: number;
    total: number;
}

export interface ItemsRequest {
    total: number;
    items: IProduct[];
}

export interface ICardActions {
    onClick: () => void;
}