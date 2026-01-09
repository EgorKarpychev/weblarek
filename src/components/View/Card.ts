import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Card<T> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        
        this._title = ensureElement<HTMLElement>('.card__title', this.container);
        this._price = ensureElement<HTMLElement>('.card__price', this.container);
    }


    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
}