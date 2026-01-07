import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected counter: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this.button = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        
        this.button.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    set basketCounter(value: number) {
        this.counter.textContent = String(value);
    }
}