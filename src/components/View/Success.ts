import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class SuccessView extends Component<HTMLElement> {
    private description: HTMLElement;
    private button: HTMLButtonElement;

    constructor(private events: EventEmitter) {
        const template = document.getElementById('success') as HTMLTemplateElement;
        const container = template.content.cloneNode(true) as DocumentFragment;
        const element = container.firstElementChild as HTMLElement;
        super(element);
        
        this.description = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.button.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    setTotal(total: number): void {
        this.description.textContent = `Списано ${total} синапсов`;
    }

    render(): HTMLElement {
        return this.container;
    }
}