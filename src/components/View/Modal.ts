import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
            
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
        this.content = ensureElement<HTMLElement>('.modal__content', this.container);
            
        this.closeButton.addEventListener('click', () => {
            events.emit('modal:close');
        });
            
        this.container.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.container) {
                events.emit('modal:close');
            }
        });
    }

    render(data: IModal): HTMLElement {
        this.modalContent = data.content;
       
        return this.container;
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }

    set modalContent(value: HTMLElement) {
        this.content.innerHTML = '';
        this.content.append(value);
    }
}