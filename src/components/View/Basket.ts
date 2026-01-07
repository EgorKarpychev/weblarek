import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[];
    totalPrice: number;
}

export class Basket extends Component<IBasket> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.total = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.button.textContent = 'Оформить'

        this.button.addEventListener('click', () => {
            events.emit('basket:order');
        })
    }

    set items(items: HTMLElement[]) {
        this.list.innerHTML = '';
        if (items.length) {
            this.button.disabled = false;
            items.forEach(item => {
                this.list.append(item);
            })
        } else {
            this.button.disabled = true;
            this.list.textContent = 'Корзина пуста'
        }
    }

    set totalPrice(value: number) {
        this.total.textContent = `${value} синапсов`
    }
}