import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

type TSuccessData = {
    total: number;
}

export class SuccessView extends Component<TSuccessData> {
    private description: HTMLElement;
    private button: HTMLButtonElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        
        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}