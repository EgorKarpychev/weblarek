import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

interface ICardPreviewData extends IProduct {
    description: string;
    buttonText: string;
    buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
    protected _description: HTMLParagraphElement;
    protected _button: HTMLButtonElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    private _onButtonClick: () => void;

    constructor(container: HTMLElement, protected events: IEvents, onButtonClick: () => void) {
        super(container);
        
        this._description = ensureElement<HTMLParagraphElement>('.card__text', this.container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this._image = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._category = ensureElement<HTMLElement>('.card__category', this.container);
        this._onButtonClick = onButtonClick;

        this._button.addEventListener('click', (e) => {
            e.preventDefault();
            this._onButtonClick(); 
        });
    }
    
    set category(value: string) {
        this._category.textContent = value;
        this._category.className = 'card__category';
        const categoryClass = categoryMap[value as keyof typeof categoryMap];

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

    set description(value: string) {
        this._description.textContent = value
    }
    
    set buttonText(value: string) {
        this._button.textContent = value;
    }
    
    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }
}