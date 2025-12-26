import { IProduct } from "../../types";

export class Cart {
    private items: IProduct[] = [];

    constructor() {
    }

    getCart(): IProduct[] {
        return [...this.items]
    }

    contains(productId: string): boolean {
        return this.items.some(item => item.id === productId)
    }

    addProduct(product: IProduct): void {
        if (!this.contains(product.id)) {
            this.items.push(product)
        }
    }

    removeProduct(item: IProduct): void {
        this.items = this.items.filter(i => i.id !== item.id)
    }

    clearCart(): void {
        this.items = []
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0)
    }

    getTotalItems(): number {
        return this.items.length
    }
}