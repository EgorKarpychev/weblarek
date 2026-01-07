import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class CardCatalog extends Card<IProduct> {
    protected category: HTMLElement;
    protected image: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.category = ensureElement<HTMLElement>('.card__category', this.container);
        this.image = ensureElement<HTMLImageElement>('.card__image', this.container);
    }

    render(data: IProduct): HTMLElement {        
        this.container.dataset.id = data.id;
        
        this.cardTitle = data.title;
        this.cardPrice = data.price;
        
        this.cardCategory = data.category;
        this.cardImage = data.image;
        
        return this.container;
    }

    set cardCategory(value: string) {
        this.category.textContent = value;
        this.category.className = 'card__category';
        
        if (categoryMap[value as keyof typeof categoryMap]) {
            this.category.classList.add(categoryMap[value as keyof typeof categoryMap]);
        }
    }

    set cardImage(value: string) {
        this.setImage(this.image, CDN_URL + value)
    }
}