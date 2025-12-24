import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ApiClient } from './components/Models/ApiClient';
import { apiProducts } from './utils/data';

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===\n');

console.log('1. ТЕСТ КЛАССА Products:');
console.log('------------------------');

const productsModel = new Products();
console.log('Создан экземпляр Products');

productsModel.setProducts(apiProducts.items);
console.log('Товары установлены (setProducts)');

const allProducts = productsModel.getAll();
console.log('Массив товаров из каталога:', allProducts);
console.log('Количество товаров:', allProducts.length);

const testProductId = apiProducts.items[0].id;
const foundProduct = productsModel.getById(testProductId);
console.log(`\nТовар по id "${testProductId}":`, foundProduct?.title);

console.log('\nРабота с выбранным товаром:');
console.log('Выбранный товар до выбора:', productsModel.getSelected()?.title || 'нет');

if (foundProduct) {
    productsModel.setSelected(foundProduct);
    console.log('Выбранный товар после выбора:', productsModel.getSelected()?.title);
}

console.log('\n\n2. ТЕСТ КЛАССА Cart:');
console.log('---------------------');

const cart = new Cart();
console.log('Создан экземпляр Cart');

console.log('Корзина до добавления товаров:', cart.getCart().length, 'товаров');

const productsFromCatalog = productsModel.getAll();
if (productsFromCatalog.length >= 3) {
    cart.addProduct(productsFromCatalog[0]);
    cart.addProduct(productsFromCatalog[1]);
    cart.addProduct(productsFromCatalog[2]);
    console.log('Добавлено 3 товара в корзину');
}

console.log('Корзина после добавления товаров:', cart.getCart().length, 'товаров');
console.log('Общая стоимость:', cart.getTotalPrice(), 'руб.');

if (productsFromCatalog[0]) {
    console.log(`\n🔎 Проверка наличия товара:`);
    console.log('Товар в корзине?', cart.contains(productsFromCatalog[0].id));
}

console.log('\n\n3. ТЕСТ КЛАССА Buyer:');
console.log('----------------------');

const buyer = new Buyer();
console.log('Создан экземпляр Buyer');

buyer.setPayment('card');
buyer.setEmail('test@example.com');
buyer.setPhone('89991234567');
buyer.setAddress('Москва, ул. Примерная, д. 1');

console.log('Данные покупателя:');
console.log('Email:', buyer.getEmail());
console.log('Телефон:', buyer.getPhone());
console.log('Адрес:', buyer.getAddress());
console.log('Способ оплаты:', buyer.getPayment());

console.log('\nВалидация данных:');
const validationResult = buyer.validate();
console.log('Результат:', validationResult === '' ? 'Данные валидны' : validationResult);

console.log('\n\n4. ТЕСТ КЛАССА ApiClient:');
console.log('--------------------------');

const apiClient = new ApiClient('https://api.example.com');
console.log('Создан экземпляр ApiClient');

console.log('\nМетоды ApiClient:');
console.log('1. getProducts() - GET запрос на /product/');
console.log('2. createOrder(orderData) - POST запрос на /order/');

console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');