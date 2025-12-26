import { IBuyer, TPayment } from "../../types";

export class Buyer {
    private payment: TPayment = 'card';
    private email: string = '';
    private phone: string = '';
    private address: string = '';

    constructor() {
    }

    setPayment(payment: TPayment): void {
        this.payment = payment
    }

    getPayment(): TPayment {
        return this.payment
    }

    setEmail(email: string): void {
        this.email = email
    }

    getEmail(): string {
        return this.email
    }

    setPhone(phone: string): void {
        this.phone = phone
    }

    getPhone(): string {
        return this.phone
    }

    setAddress(address: string): void {
        this.address = address
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
        this.payment = ''
        this.email = ''
        this.phone = ''
        this.address = ''
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