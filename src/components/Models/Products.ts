import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor (protected events: IEvents) {
    }

    getAll(): IProduct[] {
        return [...this.products]
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('products:changed')
    }

    setSelected(product: IProduct | null): void {
        this.selectedProduct = product;
        this.events.emit('products:changeSelected')
    }

    getSelected(): IProduct | null {
        return this.selectedProduct;
    }

    getById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }
}