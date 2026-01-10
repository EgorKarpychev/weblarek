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
        this.payment = payment;
        this.events.emit('buyer:change', { field: 'payment' });
    }

    getPayment(): TPayment {
        return this.payment;
    }

    setEmail(email: string): void {
        this.email = email;
        this.events.emit('buyer:change', { field: 'email' });
    }

    getEmail(): string {
        return this.email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
        this.events.emit('buyer:change', { field: 'phone' });
    }

    getPhone(): string {
        return this.phone;
    }

    setAddress(address: string): void {
        this.address = address;
        this.events.emit('buyer:change', { field: 'address' });
    }

    getAddress(): string {
        return this.address;
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clearData(): void {
        this.payment = 'card';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:change', { field: 'all' });
    }

    validateOrder(): string {
        if (this.payment === '') {
            return 'Выберите тип оплаты';
        }
        if (this.address === '') {
            return 'Укажите адрес';
        }
        return '';
    }

    validateContacts(): string {
        if (this.email === '') {
            return 'Укажите email';
        }

        const trimmedEmail = this.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            return 'Введите корректный email (user@example.com)';
        }

        if (this.phone === '') {
            return 'Укажите номер телефона';
        }

        const trimmedPhone = this.phone.trim();
        const phoneDigits = trimmedPhone.replace(/\D/g, '');
    
        if (phoneDigits.length < 10) {
            return 'Номер телефона должен содержать не менее 10 цифр';
        }

        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(trimmedPhone)) {
            return 'Укажите корректный номер телефона';
        }

        return '';
    }
}