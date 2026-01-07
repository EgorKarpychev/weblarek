import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
    private items: IProduct[] = [];

    constructor(protected events: IEvents) {
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
            this.events.emit('cart:change')
        }
    }

    removeProduct(item: IProduct): void {
        this.items = this.items.filter(i => i.id !== item.id)
        this.events.emit('cart:change')
    }

    clearCart(): void {
        this.items = []
        this.events.emit('cart:change')
    }

    getTotalPrice(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0)
    }

    getTotalItems(): number {
        return this.items.length
    }
}