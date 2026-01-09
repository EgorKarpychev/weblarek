import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";

export class CardCatalog extends Card<{
    title: string;
    price: number | null;
    category: string;
    image: string;
}> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents, private itemId: string) {
        super(container);
        
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        
        this.container.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('.card__button')) {
                events.emit('card:select', { id: this.itemId });
            }
        });
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = 'card__category';
        const categoryClass = (categoryMap as Record<string, string>)[value];

        if (categoryClass) {
            this._category.classList.add(categoryClass);
        }
    }

    set image(value: string) {
        if (value && this._image) {
            this._image.src = CDN_URL + value;
            this._image.alt = this._title?.textContent || 'Изображение товара';
        }
    }
}