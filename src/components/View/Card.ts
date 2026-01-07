import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Card<T> extends Component<T> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this.title = ensureElement<HTMLElement>('.card__title', this.container);
        this.price = ensureElement<HTMLElement>('.card__price', this.container);
    }


    set cardTitle(value: string) {
        this.title.textContent = value;
    }

    set cardPrice(value: number | null) {
        this.price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
}