import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { ApiClient } from './components/Models/ApiClient';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview'
import { CardBasket } from './components/View/CardBasket';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { FormOrder } from './components/View/FormOrder';
import { FormContacts } from './components/View/FormContact';
import { Header } from './components/View/Header';
import { categoryMap } from './utils/constants';
import { SuccessView } from './components/View/Success';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiClient = new ApiClient(api);

const products = new Products(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');
const modal = new Modal(modalContainer, events);
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formOrder = new FormOrder(cloneTemplate(orderTemplate), events);
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
let formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);
const header = new Header(ensureElement('.header'), events);
const success = new SuccessView(events);

apiClient.getProducts()
    .then((data) => {
        products.setProducts(data);
    })
    .catch((error) => {
        console.error('Ошибка загрузки товаров:', error);
    });

events.on('products:changed', () => {
    const allProducts = products.getAll();
    const itemCards = allProducts.map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events);
        const cardElement = card.render(item);
        
        cardElement.addEventListener('click', (e) => {
            if (!(e.target as HTMLElement).closest('.card__button')) {
                events.emit('card:select', { id: item.id });
            }
        });
        
        return cardElement;
    });
    
    const galleryContainer = ensureElement('.gallery');
    galleryContainer.innerHTML = '';
    itemCards.forEach(card => {
        galleryContainer.appendChild(card);
    });
});

events.on('card:select', (data: { id: string }) => {
    const productItem = products.getById(data.id);
    
    if (productItem) {
        const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
        
        const inCart = cart.getCart().some(item => item.id === productItem.id);
        
        cardPreview.productId = productItem.id;
        cardPreview.cardTitle = productItem.title || 'Нет названия';
        cardPreview.cardPrice = productItem.price;
        
        const categoryClass = (categoryMap as Record<string, string>)[productItem.category] || 'other';
        cardPreview.setCategory(productItem.category || '', categoryClass);
        
        if (productItem.image) {
            cardPreview.setUpImage(productItem.image, productItem.title || '');
        }
        
        cardPreview.setDescription(productItem.description || 'Нет описания');
        
        if (productItem.price === null) {
            cardPreview.buttonText = 'Недоступно';
            cardPreview.buttonDisabled = true;
        } else if (inCart) {
            cardPreview.buttonText = 'Уже в корзине';
            cardPreview.buttonDisabled = true;
        } else {
            cardPreview.buttonText = 'В корзину';
            cardPreview.buttonDisabled = false;
        }
        
        const previewElement = cardPreview.render();
        modal.modalContent = previewElement;
        modal.open();
    }
});

events.on('catalog:add', (data: { id: string }) => {
    const productItem = products.getById(data.id);
    if (productItem && productItem.price) {
        cart.addProduct(productItem);
        const allProducts = products.getAll();
        const updatedProducts = allProducts.map(p => p.id === data.id ? { ...p, inCart: true } : p);
        products.setProducts(updatedProducts);
    }
});

events.on('preview:add', (data: { id: string }) => {
    const productItem = products.getById(data.id);
    if (productItem && productItem.price) {
        cart.addProduct(productItem);
        const allProducts = products.getAll();
        const updatedProducts = allProducts.map(p => p.id === data.id ? { ...p, inCart: true } : p);
        products.setProducts(updatedProducts);
        modal.close();
    }
});

events.on('basket:remove', (data: { id: string }) => {
    const productItem = products.getById(data.id);
    if (productItem) {
        cart.removeProduct(productItem);
    }
});

events.on('cart:change', () => {
    const items = cart.getCart();
    const cardBasketArr = items.map((item, index) => {
        const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        return cardBasket.render({
            index: index + 1,
            ...item,
        });
    });

    header.basketCounter = cart.getTotalItems();
    const basketElement = basket.render({
        items: cardBasketArr,
        totalPrice: cart.getTotalPrice()
    });
    modal.modalContent = basketElement;
});

events.on('basket:open', () => {
    const items = cart.getCart();
    const cardBasketArr = items.map((item, index) => {
        const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), events);
        return cardBasket.render({
            index: index + 1,
            ...item,
        });
    });

    const basketElement = basket.render({
        totalPrice: cart.getTotalPrice(),
        items: cardBasketArr,
    });
    
    modal.modalContent = basketElement;
    modal.open();
});

events.on('basket:order', () => {
    modal.close();
    
    const formElement = formOrder.render({
        payment: buyer.getPayment(),
        address: buyer.getAddress(),
        valid: false
    });
    
    modal.modalContent = formElement;
    modal.open();
});

events.on('order:next', () => {
    const step1Valid = buyer.getPayment() && buyer.getAddress() && buyer.getAddress().trim().length >= 5;
    
    if (step1Valid && cart.getTotalItems() > 0) {
        modal.close();
        const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
        const contactsClone = cloneTemplate(contactsTemplate);
            
        const formContactsNew = new FormContacts(contactsClone, events);
            
        const formElement = formContactsNew.render({
            email: buyer.getEmail() || '',
            phone: buyer.getPhone() || '',
            valid: false
        });
            
        modal.modalContent = formElement;
        modal.open();
            
        formContacts = formContactsNew;
    } else {
        if (!buyer.getPayment()) {
            formOrder.error = 'Выберите способ оплаты';
        } else if (!buyer.getAddress() || buyer.getAddress().trim().length < 5) {
            formOrder.error = 'Введите адрес доставки';
        }
    }
});

events.on('payment:change', (data: { payment: string }) => {
    buyer.setPayment(data.payment as any);
    updateValidation();
});

events.on('order.address:change', (data: { value: string }) => {
    buyer.setAddress(data.value);
    updateValidation();
});

events.on('order.email:change', (data: { value: string }) => {
    buyer.setEmail(data.value);
    updateValidation();
});

events.on('order.phone:change', (data: { value: string }) => {
    buyer.setPhone(data.value);
    updateValidation();
});

function updateValidation() {
    const modalContainer = document.querySelector('#modal-container');
    if (!modalContainer) return;
    
    const hasEmailField = modalContainer.querySelector('input[name="email"]') !== null;
    const hasAddressField = modalContainer.querySelector('input[name="address"]') !== null;
    
    if (hasAddressField) {
        const hasPayment = !!buyer.getPayment();
        const hasAddress = !!(buyer.getAddress() && buyer.getAddress().trim().length >= 5);
        const hasItems = cart.getTotalItems() > 0;
        
        formOrder.valid = hasPayment && hasAddress && hasItems;
        formOrder.error = hasPayment && hasAddress ? '' : 'Заполните обязательные поля';
    }
    
    if (hasEmailField) {
        const error = buyer.validate();
        formContacts.valid = error === '' && cart.getTotalItems() > 0;
        formContacts.error = error;
    }
}

events.on('order:submit', async () => {
    const validation = buyer.validate();
    
    if (validation === '' && cart.getTotalItems() > 0) {
        const order = {
            payment: buyer.getPayment(),
            email: buyer.getEmail(),
            phone: buyer.getPhone(),
            address: buyer.getAddress(),
            total: cart.getTotalPrice(),
            items: cart.getCart().map(item => item.id)
        };
        
        try {
            await apiClient.createOrder(order);
            
            const orderTotal = cart.getTotalPrice();
            
            cart.clearCart();
            buyer.clearData();
            header.basketCounter = 0;
            
            modal.close();
            
            success.setTotal(orderTotal);
            const successElement = success.render();
            modal.modalContent = successElement;
            modal.open();
            
        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            formContacts.error = 'Ошибка оформления заказа. Попробуйте снова.';
        }
    } else {
        formContacts.error = validation;
    }
});

events.on('modal:close', () => {
    modal.close();
});

events.on('success:close', () => {
    modal.close();
});