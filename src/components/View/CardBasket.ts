import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

type TCardBasket = {
    index: number;
    title?: string;
    price?: number | null;
}

export class CardBasket extends Card<TCardBasket> {
    protected index: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.index = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
        
        this.deleteButton.addEventListener('click', () => {
            events.emit('basket:remove', { id: this.container.dataset.id });
        });
    }

    setIndex(value: number) {
        this.index.textContent = String(value);
    }

    render(data: TCardBasket & { id: string }): HTMLElement {
        console.log('CardBasket render with:', data);
        
        this.setIndex(data.index);
        
        if (data.title !== undefined) {
            this.cardTitle = data.title;
        }
        
        if (data.price !== undefined) {
            this.cardPrice = data.price;
        }
        
        this.container.dataset.id = data.id;
        
        return this.container;
    }
}