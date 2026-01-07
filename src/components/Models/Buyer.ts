import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
    private payment: TPayment = 'card';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor(protected events: IEvents) {
    }

    setPayment(payment: TPayment): void {
        this.payment = payment
        this.events.emit('buyer:change')
    }

    getPayment(): TPayment {
        return this.payment
    }

    setEmail(email: string): void {
        this.email = email
        this.events.emit('buyer:change')
    }

    getEmail(): string {
        return this.email
    }

    setPhone(phone: string): void {
        this.phone = phone
        this.events.emit('buyer:change')
    }

    getPhone(): string {
        return this.phone
    }

    setAddress(address: string): void {
        this.address = address
        this.events.emit('buyer:change')
    }

    getAddress(): string {
        return this.address
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        }
    }

    clearData(): void {
        this.payment = 'card'
        this.email = ''
        this.phone = ''
        this.address = ''
        this.events.emit('buyer:change')
    }

    validate(): string {
        if (this.payment === '') {
            return 'Выберите тип оплаты'
        }
        if (this.email === '') {
            return 'Укажите email'
        }
        if (this.phone === '') {
            return 'Укажите номер телефона'
        }
        if (this.address === '') {
            return 'Укажите адрес'
        }
        return '';
    }
}