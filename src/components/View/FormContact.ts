import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormContacts {
    email: string;
    phone: string;
    valid: boolean;
    error: string;
}

export class FormContacts extends Component<IFormContacts> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('order.email:change', { value: this.emailInput.value });
        });
        
        this.phoneInput.addEventListener('input', () => {
            this.events.emit('order.phone:change', { value: this.phoneInput.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('order:submit'); 
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set error(value: string) {
        this.errors.textContent = value;
    }
}