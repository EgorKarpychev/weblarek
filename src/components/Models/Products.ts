import { IProduct } from "../../types";

export class Products {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor () {
    }

    getAll(): IProduct[] {
        return [...this.products]
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
    }

    setSelected(product: IProduct | null): void {
        this.selectedProduct = product;
    }

    getSelected(): IProduct | null {
        return this.selectedProduct;
    }

    getById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }
}