import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { ApiClient } from './components/Models/ApiClient';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

async function test() {
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

    console.log('Корзина до добавления товаров:', cart.getTotalItems(), 'товаров');
    console.log('Содержимое корзины:', cart.getCart());
    console.log('Общая стоимость:', cart.getTotalPrice(), 'руб')

    const productsFromCatalog = productsModel.getAll();
    if (productsFromCatalog.length >= 3) {
        cart.addProduct(productsFromCatalog[0]);
        cart.addProduct(productsFromCatalog[1]);
        cart.addProduct(productsFromCatalog[2]);
        console.log('Добавлено 3 товара в корзину');
    }

    console.log('Корзина после добавления товаров:', cart.getTotalItems(), 'товаров');
    console.log('Содержимое корзины:', cart.getCart())
    console.log('Общая стоимость:', cart.getTotalPrice(), 'руб.');

    console.log('\nПроверка наличия товара:');
    console.log('Товар в корзине?', cart.contains(productsFromCatalog[0].id));

    console.log('\nУдаляем товар из корзины:',productsFromCatalog[1]);
    cart.removeProduct(productsFromCatalog[1]);
    console.log('Корзина после удаления товара:', cart.getTotalItems(), 'товаров');
    console.log('Содержимое корзины:', cart.getCart());
    console.log('Общая стоимость:', cart.getTotalPrice(), 'руб');

    console.log('\nПроверка наличия удаленного товара:');
    console.log('Товар в корзине?', cart.contains(productsFromCatalog[1].id));

    console.log('\nОчищаем корзину полностью:');
    cart.clearCart();
    console.log('Корзина после очистки:', cart.getTotalItems(), 'товаров');
    console.log('СОдержимое корзины:', cart.getCart());
    console.log('Общая стоимость:', cart.getTotalPrice(), 'руб');

    console.log('\n\n3. ТЕСТ КЛАССА Buyer:');
    console.log('----------------------');
    console.log('3.1 Все данные равны непустой строке:');

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

    console.log('\n3.2 Не все данные равны непустой строке:');

    const buyer2 = new Buyer();
    buyer2.setPayment('card');
    buyer2.setEmail('test@example.com');
    buyer2.setAddress('Москва, ул. Примерная, д. 1');

    console.log('Данные покупателя:');
    console.log('Email:', buyer2.getEmail());
    console.log('Телефон:', buyer2.getPhone());
    console.log('Адрес:', buyer2.getAddress());
    console.log('Способ оплаты:', buyer2.getPayment());

    const validation2 = buyer2.validate();
    console.log('\nВалидация данных:');
    console.log('Результат:', validation2 === '' ? 'Данные валидны' : validation2);

    console.log('\n\n4. ТЕСТ КЛАССА ApiClient:');
    console.log('--------------------------');

    const api = new Api(API_URL);
    const apiClient = new ApiClient(api);

    console.log('Создан экземпляр ApiClient');

    console.log('\nТестирование GET запроса:');
    
    try {
        const productsFromServer = await apiClient.getProducts();
        console.log('GET запрос выполнен успешно!');
        console.log('Получено товаров с сервера:', productsFromServer.length);

        const productsModelFromServer = new Products();
        console.log('Создан экземпляр Products')

        productsModelFromServer.setProducts(productsFromServer);
        console.log('\nМассив товаров с сервера сохранен в поле products')
        console.log('Передано товаров:', productsFromServer.length)

        const allProductsFromServer = productsModelFromServer.getAll();
        console.log('\nПолучено значение поля products');
        console.log('Полученный массив:', allProductsFromServer);

        const testProductIdFromServer = allProductsFromServer[0].id;
        const foundProductFromServer = productsModelFromServer.getById(testProductIdFromServer);
        console.log('\nПоиск товара по ID');
        console.log(`\nТовар по id "${testProductIdFromServer}":`, foundProductFromServer?.title);

        console.log('Выбранный товар до выбора:', productsModelFromServer.getSelected()?.title || 'нет');

    if (foundProductFromServer) {
        productsModelFromServer.setSelected(foundProductFromServer);
        console.log('Выбранный товар после выбора:', productsModelFromServer.getSelected()?.title);
    }

    // НЕМНОГО НЕ ПОНЯЛ, В КОММЕНТАРИИ СКАЗАНО, ЧТО НУЖНО ПРОТЕСТИРОВАТЬ
    // МЕТОДЫ, КОТОРЫЙ РАБОТАЮТ НЕПОСРЕДСТВЕННО С МАССИВОМ Products?
    // И НУЖНО ЛИ ДОБАВЛЯТЬ ЭТИ МЕТОДЫ?

    } catch (error) {
        console.error('Ошибка при выполнении GET запроса:', error);
    }

    console.log('\n=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');
}

test();