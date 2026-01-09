import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

type TCardBasket = {
    index: number;
    title?: string;
    price?: number | null;
}

export class CardBasket extends Card<TCardBasket> {
    protected _index: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents, private onDeleteClick: () => void) {
        super(container);
        
        this._index = ensureElement<HTMLElement>('.basket__item-index', this.container,);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this.deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.onDeleteClick();
        });
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}