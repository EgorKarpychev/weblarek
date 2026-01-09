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
import { SuccessView } from './components/View/Success';
import { Gallery } from './components/View/Gallery';

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
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const success = new SuccessView(cloneTemplate(successTemplate), events);
const galleryElement = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(galleryElement, events);

apiClient.getProducts()
    .then((data) => {
        const productsWithCartState = data.map(item => ({
            ...item,
            inCart: false 
        }));
        products.setProducts(productsWithCartState);
    })
    .catch((error) => {
        console.error('Ошибка загрузки товаров:', error);
    });

events.on('products:changed', () => {
    const allProducts = products.getAll();
    const itemCards = allProducts.map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), events, item.id);
        
        return card.render(item);
    });

    gallery.catalog = itemCards;
});

events.on('card:select', (data: { id: string }) => {
    const productItem = products.getById(data.id);
    if (productItem) {
        products.setSelected(productItem);
    }
});

events.on('products:changeSelected', () => {
    const productItem = products.getSelected();
    if (!productItem) return;
    
    const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);
    
    const inCart = cart.contains(productItem.id);
    const isAvailable = productItem.price !== null;
    
    const previewElement = cardPreview.render({
        id: productItem.id,
        title: productItem.title,
        price: productItem.price,
        category: productItem.category,
        image: productItem.image,
        description: productItem.description || '',
        inCart: inCart,
        isAvailable: isAvailable
    });
    
    modal.modalContent = previewElement;
    modal.open();
});

events.on('preview:add', () => {
    const productItem = products.getSelected();
    
    if (productItem && productItem.price !== null) {
        if (cart.contains(productItem.id)) {
            cart.removeProduct(productItem);
        } else {
            cart.addProduct(productItem);
        }
        header.basketCounter = cart.getTotalItems();
        modal.close();
    } 
});

events.on('basket:remove', (data: { id: string }) => {
    const productItem = products.getById(data.id);
    if (productItem) {
        cart.removeProduct(productItem);
    }
});

events.on('buyer:change', (data: { field: string }) => {
    const modalContainer = document.querySelector('#modal-container');
    if (!modalContainer) return;
    
    const hasEmailField = modalContainer.querySelector('input[name="email"]') !== null;
    const hasAddressField = modalContainer.querySelector('input[name="address"]') !== null;
    const hasItems = cart.getTotalItems() > 0;
    
    if (data.field === 'all') {
        if (hasAddressField) {
            const orderError = buyer.validateOrder();
            const isOrderValid = orderError === '' && hasItems;
            
            formOrder.render({
                payment: buyer.getPayment(),
                address: buyer.getAddress(),
                valid: isOrderValid
            });
            if (buyer.getPayment() === '' && buyer.getAddress() === '') {
                formOrder.error = '';
            } else {
                formOrder.error = orderError || '';
            }
        }
        
        if (hasEmailField) {
            const contactsError = buyer.validateContacts();
            const isContactsValid = contactsError === '' && hasItems;
            
            formContacts.render({
                email: buyer.getEmail(),
                phone: buyer.getPhone(),
                valid: isContactsValid
            });
            if (buyer.getEmail() === '' && buyer.getPhone() === '') {
                formContacts.error = '';
            } else {
                formContacts.error = contactsError || '';
            }
        }
    } else {
        if (hasAddressField) {
            const orderError = buyer.validateOrder();
            const isOrderValid = orderError === '' && hasItems;
            
            formOrder.render({
                payment: buyer.getPayment(),
                address: buyer.getAddress(),
                valid: isOrderValid
            });
            
            if ((data.field === 'payment' && buyer.getPayment() !== '') || 
                (data.field === 'address' && buyer.getAddress() !== '')) {
                formOrder.error = orderError;
            }
        }
        
        if (hasEmailField) {
            const contactsError = buyer.validateContacts();
            const isContactsValid = contactsError === '' && hasItems;
            
            formContacts.render({
                email: buyer.getEmail(),
                phone: buyer.getPhone(),
                valid: isContactsValid
            });
            
            if ((data.field === 'email' && buyer.getEmail() !== '') || 
                (data.field === 'phone' && buyer.getPhone() !== '')) {
                formContacts.error = contactsError;
            }
        }
    }
});

events.on('cart:change', () => {
    const items = cart.getCart();
    const cardBasketArr = items.map((item, index) => {
        const cardBasket = new CardBasket(
            cloneTemplate(cardBasketTemplate),
            events,
            () => {
                events.emit('basket:remove', { id: item.id });
            }
        );
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
        const cardBasket = new CardBasket(
            cloneTemplate(cardBasketTemplate),
            events,
            () => {
                events.emit('basket:remove', { id: item.id });
            }
        );
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
    const orderError = buyer.validateOrder();
    const hasItems = cart.getTotalItems() > 0;
    const isValid = orderError === '' && hasItems;
    
    const formElement = formOrder.render({
        payment: buyer.getPayment(),
        address: buyer.getAddress(),
        valid: isValid
    });
    
    if (orderError && (buyer.getPayment() !== '' || buyer.getAddress() !== '')) {
        formOrder.error = orderError;
    } else {
        formOrder.error = '';
    }
    
    modal.modalContent = formElement;
    modal.open();
});

events.on('order:next', () => {
    const step1Valid = buyer.validateOrder() === '';
    const hasItems = cart.getTotalItems() > 0;
    
    if (step1Valid && hasItems) {
        modal.close();
        
        setTimeout(() => {
            const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
            const contactsClone = cloneTemplate(contactsTemplate);
            
            const formContactsNew = new FormContacts(contactsClone, events);
            
            const contactsError = buyer.validateContacts();
            const isContactsValid = contactsError === '' && hasItems;
            
            const formElement = formContactsNew.render({
                email: buyer.getEmail(),
                phone: buyer.getPhone(),
                valid: isContactsValid
            });
        
            if (contactsError && (buyer.getEmail() !== '' || buyer.getPhone() !== '')) {
                formContactsNew.error = contactsError;
            }
            
            modal.modalContent = formElement;
            modal.open();
            
            formContacts = formContactsNew;
        }, 300);
    } else {
        const error = buyer.validateOrder();
        formOrder.error = error || 'Добавьте товары в корзину';
    }
});

events.on('order:next', () => {
    const step1Valid = buyer.validateOrder() === '';
    
    if (step1Valid && cart.getTotalItems() > 0) {
        modal.close();
        
        setTimeout(() => {
            const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
            const contactsClone = cloneTemplate(contactsTemplate);
            
            const formContactsNew = new FormContacts(contactsClone, events);
            
            const formElement = formContactsNew.render({
                email: buyer.getEmail(),
                phone: buyer.getPhone(),
                valid: buyer.validateContacts() === '' && cart.getTotalItems() > 0
            });
            
            modal.modalContent = formElement;
            modal.open();
            
            formContacts = formContactsNew;
        }, 300);
    } else {
        const error = buyer.validateOrder();
        formOrder.error = error;
    }
});

events.on('payment:change', (data: { payment: string }) => {
    buyer.setPayment(data.payment as any);
});

events.on('order.address:change', (data: { value: string }) => {
    buyer.setAddress(data.value);
});

events.on('order.email:change', (data: { value: string }) => {
    buyer.setEmail(data.value);
});

events.on('order.phone:change', (data: { value: string }) => {
    buyer.setPhone(data.value);
});

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
            
            success.total = orderTotal;
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