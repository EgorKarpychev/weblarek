import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IFormOrder {
    payment: string;
    address: string;
    valid: boolean;
    error: string;
}

export class FormOrder extends Component<IFormOrder> {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;
    protected addressInput: HTMLInputElement;
    protected submitButton: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.paymentButtons = this.container.querySelectorAll('.button_alt');
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.getAttribute('name');
                this.events.emit('payment:change', { payment });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order.address:change', { value: this.addressInput.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('order:next'); 
        });
    }

    set payment(value: string) {
        this.paymentButtons.forEach(button => {
            if (button.getAttribute('name') === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set error(value: string) {
        this.errors.textContent = value;
    }
}