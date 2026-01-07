import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CardPreview extends Card<IProduct> {
    protected description: HTMLParagraphElement;
    protected button: HTMLButtonElement;
    protected image: HTMLImageElement;
    protected category: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.description = ensureElement<HTMLParagraphElement>('.card__text', this.container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        
        this.button.addEventListener('click', () => {
            events.emit('preview:add', { id: this.container.dataset.id });
        });
    }

    set productId(value: string) {
        this.container.dataset.id = value;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    setCategory(value: string, className?: string) {
        this.category.textContent = value;
        let categoryClass: string;
        
        if (className) {
            categoryClass = className;
        } else {
            categoryClass = (categoryMap as Record<string, string>)[value] || 'other';
        }
        
        this.category.className = `card__category card__category_${categoryClass}`;
    }

    setUpImage(url: string, alt: string) {
        this.image.src = CDN_URL + url;
        this.image.alt = alt;
    }

    setDescription(value: string) {
        this.description.textContent = value;
    }

    render(): HTMLElement {
        return this.container;
    }
}