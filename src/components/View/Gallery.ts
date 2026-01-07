import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IGallery {
    items: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected list: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.list = ensureElement('.gallery', this.container);
    }

    set catalog(items: HTMLElement[]) {
        this.list.append(...items);
    }
}