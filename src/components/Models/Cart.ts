import { IProduct } from "../../types";

export class Cart {
    private items: IProduct[];

    constructor(items: IProduct[] = []) {
        this.items = items;
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

    removeProduct(productId: string): void {
        const index = this.items.findIndex(item => item.id === productId)
        if (index !== -1) {
            this.items.splice(index, 1)
        }
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