# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

### Интерфейс товара - IProduct
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

### Интерфейс покупателя - IBuyer
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

### Интерфейсы заказа
interface IOrderRequest {
  items: string[];
  total: number;
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

interface IOrderResponse {
  id: string;
  total: number;
}

### Тип оплаты
type TPayment = 'card' | 'cash';

## Модели данных

### Класс Products
Управление списком товаров.

Конструктор:
constructor(products: IProduct[] = [], selectedProduct: IProduct | null = null)

Поля:
- private products: IProduct[] - массив товаров
- private selectedProduct: IProduct | null - выбранный товар

Методы:
- setProducts(products: IProduct[]): void - установить товары
- getAll(): IProduct[] - получить все товары
- getById(id: string): IProduct | undefined - найти товар по ID
- setSelected(product: IProduct | null): void - выбрать товар
- getSelected(): IProduct | null - получить выбранный товар

### Класс Cart
Управление корзиной покупок.

Конструктор:
constructor(items: IProduct[] = [])

Поля:
- private items: IProduct[] - товары в корзине

Методы:
- getCart(): IProduct[] - получить корзину
- addProduct(product: IProduct): void - добавить товар
- removeProduct(productId: string): boolean - удалить товар
- getTotalPrice(): number - общая стоимость
- getCount(): number - количество товаров
- has(productId: string): boolean - проверить наличие
- clear(): void - очистить корзину
- isEmpty(): boolean - пустая ли корзина

### Класс Buyer
Управление данными покупателя.

Конструктор:
constructor(payment: TPayment = 'card', email: string = '', phone: string = '', address: string = '')

Поля:
- private payment: TPayment - способ оплаты
- private email: string - email
- private phone: string - телефон
- private address: string - адрес

Методы:
- setPayment(payment: TPayment): void - установить оплату
- getPayment(): TPayment - получить оплату
- setEmail(email: string): void - установить email
- getEmail(): string - получить email
- setPhone(phone: string): void - установить телефон
- getPhone(): string - получить телефон
- setAddress(address: string): void - установить адрес
- getAddress(): string - получить адрес
- getData(): IBuyer - получить все данные
- validate(): string - валидация (возвращает ошибку или пустую строку)
- clear(): void - очистить данные

## Слой коммуникации

### Класс ApiClient
Работа с API сервера.

Конструктор:
constructor(baseUrl: string = '')

Методы:
- getProducts(): Promise<IProduct[]> - GET запрос на /product/
- createOrder(orderData: IOrderRequest): Promise<IOrderResponse> - POST запрос на /order/
- get<T extends object>(uri: string): Promise<T> - общий GET
- post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T> - общий POST

# Документация классов слоя Представления (View)

## Базовые классы представления

### Класс Component
Базовый класс для всех компонентов представления. Реализует паттерн компонента для отображения данных в DOM.

**Конструктор:**
`constructor(protected container: HTMLElement)`

**Поля:**
- `container: HTMLElement` - корневой DOM элемент компонента

**Методы:**
- `render(data?: Partial<T>): HTMLElement` - основной метод рендеринга, принимает данные и возвращает DOM элемент
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - утилита для управления CSS классами

### Класс Card
Абстрактный базовый класс для всех карточек товаров. Наследуется от `Component`.

**Конструктор:**
`constructor(container: HTMLElement)`

**Поля:**
- `protected title: HTMLElement` - элемент для отображения названия товара
- `protected price: HTMLElement` - элемент для отображения цены товара

**Методы:**
- `set title(value: string)` - сеттер для установки названия товара
- `set price(value: number | null)` - сеттер для установки цены товара
- `protected setImage(element: HTMLImageElement, src: string): void` - защищенный метод для установки изображения

## Классы представления карточек товаров

### Класс CardCatalog
Отвечает за отображение карточки товара в каталоге. Наследуется от `Card`.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected image: HTMLImageElement` - элемент изображения товара
- `protected button: HTMLButtonElement` - кнопка "Купить"

**Методы:**
- `render(item: IProduct): HTMLElement` - рендерит карточку товара в каталоге
- Генерирует события:
  - `'catalog:add'` - при клике на кнопку "Купить"
  - `'card:select'` - при клике на карточку (кроме кнопки)

### Класс CardPreview
Отвечает за отображение детальной карточки товара в модальном окне. Наследуется от `Card`.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected description: HTMLParagraphElement` - элемент описания товара
- `protected category: HTMLElement` - элемент категории товара
- `protected image: HTMLImageElement` - элемент изображения товара
- `protected button: HTMLButtonElement` - кнопка действия

**Методы:**
- `render(data: IProduct & { inCart?: boolean }): HTMLElement` - рендерит детальную карточку товара
- `setCategory(value: string, className?: string): void` - устанавливает категорию с CSS классом
- `setUpImage(url: string, alt: string): void` - устанавливает изображение товара
- Генерирует события:
  - `'preview:add'` - при клике на кнопку в превью

### Класс CardBasket
Отвечает за отображение карточки товара в корзине. Наследуется от `Card`.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected index: HTMLElement` - элемент порядкового номера
- `protected deleteButton: HTMLButtonElement` - кнопка удаления

**Методы:**
- `render(data: { index: number } & IProduct): HTMLElement` - рендерит карточку товара в корзине
- `set cardIndex(value: number)` - устанавливает порядковый номер
- Генерирует события:
  - `'basket:remove'` - при клике на кнопку удаления

## Классы представления форм

### Базовый класс Form
Абстрактный базовый класс для всех форм. Наследуется от `Component`.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected submitButton: HTMLButtonElement` - кнопка отправки формы
- `protected errors: HTMLElement` - элемент отображения ошибок

**Методы:**
- `set valid(value: boolean)` - активирует/деактивирует кнопку отправки
- `set error(value: string)` - отображает ошибку валидации
- `protected findInput(name: string): HTMLInputElement` - защищенный метод поиска поля ввода

### Класс FormOrder
Отвечает за отображение формы заказа (выбор оплаты и адреса). Наследуется от `Form`.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)`

**Поля:**
- `protected paymentButtons: NodeListOf<HTMLButtonElement>` - кнопки выбора способа оплаты
- `protected addressInput: HTMLInputElement` - поле ввода адреса

**Методы:**
- `render(data?: { payment: TPayment, address: string, valid: boolean }): HTMLElement` - рендерит форму заказа
- Генерирует события:
  - `'payment:change'` - при изменении способа оплаты
  - `'order.address:change'` - при изменении адреса
  - `'order:next'` - при отправке формы

### Класс FormContacts
Отвечает за отображение формы контактов (email и телефон). Наследуется от `Form`.

**Конструктор:**
`constructor(container: HTMLElement, events: IEvents)`

**Поля:**
- `protected emailInput: HTMLInputElement` - поле ввода email
- `protected phoneInput: HTMLInputElement` - поле ввода телефона

**Методы:**
- `render(data?: { email: string, phone: string, valid: boolean }): HTMLElement` - рендерит форму контактов
- Генерирует события:
  - `'order.email:change'` - при изменении email
  - `'order.phone:change'` - при изменении телефона
  - `'order:submit'` - при отправке формы

## Прочие классы представления

### Класс Modal
Управляет модальным окном. Не наследуется и не имеет потомков.

**Конструктор:**
`constructor(protected container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected closeButton: HTMLButtonElement` - кнопка закрытия модалки
- `protected content: HTMLElement` - контейнер для контента

**Методы:**
- `open(): void` - открывает модальное окно
- `close(): void` - закрывает модальное окно
- `set modalContent(value: HTMLElement)` - устанавливает контент модального окна
- Генерирует события:
  - `'modal:close'` - при закрытии модалки

### Класс Basket
Отвечает за отображение корзины товаров.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected list: HTMLElement` - список товаров в корзине
- `protected total: HTMLElement` - элемент общей стоимости
- `protected button: HTMLButtonElement` - кнопка оформления заказа

**Методы:**
- `render(data: { items: HTMLElement[], totalPrice: number }): HTMLElement` - рендерит корзину
- Генерирует события:
  - `'basket:order'` - при клике на кнопку оформления заказа

### Класс Header
Отвечает за отображение шапки сайта.

**Конструктор:**
`constructor(container: HTMLElement, protected events: IEvents)`

**Поля:**
- `protected counter: HTMLElement` - счетчик товаров в корзине
- `protected button: HTMLButtonElement` - кнопка открытия корзины

**Методы:**
- `set basketCounter(value: number)` - обновляет счетчик корзины
- Генерирует события:
  - `'basket:open'` - при клике на кнопку корзины

# События приложения

## События каталога товаров

### `'products:changed'`
**Генерируется:** В `main.ts` после загрузки товаров с сервера
**Данные:** Отсутствуют
**Описание:** Сигнализирует об изменении списка товаров. Инициирует перерисовку каталога.

### `'card:select'`
**Генерируется:** В `CardCatalog` при клике на карточку товара
**Данные:** `{ id: string }` - ID выбранного товара
**Описание:** Открывает модальное окно с детальной информацией о товаре.

### `'catalog:add'`
**Генерируется:** В `CardCatalog` при клике на кнопку "Купить" в каталоге
**Данные:** `{ id: string }` - ID добавляемого товара
**Описание:** Добавляет товар в корзину и обновляет состояние кнопки.

## События модального окна превью

### `'preview:add'`
**Генерируется:** В `CardPreview` при клике на кнопку "Купить" в модальном окне
**Данные:** `{ id: string }` - ID добавляемого товара
**Описание:** Добавляет товар в корзину и закрывает модальное окно.

## События корзины

### `'basket:open'`
**Генерируется:** В `Header` при клике на иконку корзины
**Данные:** Отсутствуют
**Описание:** Открывает модальное окно с содержимым корзины.

### `'basket:remove'`
**Генерируется:** В `CardBasket` при клике на кнопку удаления товара
**Данные:** `{ id: string }` - ID удаляемого товара
**Описание:** Удаляет товар из корзины и обновляет отображение.

### `'basket:order'`
**Генерируется:** В `Basket` при клике на кнопку оформления заказа
**Данные:** Отсутствуют
**Описание:** Открывает форму для оформления заказа (шаг 1 - оплата и адрес).

## События форм заказа

### `'payment:change'`
**Генерируется:** В `FormOrder` при изменении способа оплаты
**Данные:** `{ payment: string }` - выбранный способ оплаты ('card' или 'cash')
**Описание:** Сохраняет выбранный способ оплаты в модели покупателя.

### `'order.address:change'`
**Генерируется:** В `FormOrder` при изменении поля адреса
**Данные:** `{ value: string }` - введенный адрес
**Описание:** Сохраняет адрес доставки в модели покупателя.

### `'order:next'`
**Генерируется:** В `FormOrder` при отправке формы (клик по кнопке "Далее")
**Данные:** Отсутствуют
**Описание:** Проверяет валидность данных формы и открывает форму контактов.

### `'order.email:change'`
**Генерируется:** В `FormContacts` при изменении поля email
**Данные:** `{ value: string }` - введенный email
**Описание:** Сохраняет email покупателя в модели.

### `'order.phone:change'`
**Генерируется:** В `FormContacts` при изменении поля телефона
**Данные:** `{ value: string }` - введенный телефон
**Описание:** Сохраняет телефон покупателя в модели.

### `'order:submit'`
**Генерируется:** В `FormContacts` при отправке формы (клик по кнопке "Оплатить")
**Данные:** Отсутствуют
**Описание:** Отправляет данные заказа на сервер, очищает корзину и показывает сообщение об успехе.

## События модального окна

### `'modal:close'`
**Генерируется:** В `Modal` при клике на кнопку закрытия или вне контента
**Данные:** Отсутствуют
**Описание:** Закрывает модальное окно.

### `'success:close'`
**Генерируется:** В `main.ts` после успешного оформления заказа
**Данные:** Отсутствуют
**Описание:** Закрывает модальное окно с сообщением об успешном заказе.

## События состояния

### `'cart:change'`
**Генерируется:** В `Cart` при любом изменении содержимого корзины
**Данные:** Отсутствуют
**Описание:** Инициирует обновление счетчика в шапке и перерисовку корзины.

## Порядок обработки событий

1. **Просмотр каталога:**
   - `card:select` → открытие превью товара
   - `catalog:add` → добавление в корзину из каталога

2. **Работа с корзиной:**
   - `basket:open` → открытие корзины
   - `basket:remove` → удаление из корзины
   - `basket:order` → переход к оформлению заказа

3. **Оформление заказа:**
   - `payment:change` → выбор оплаты
   - `order.address:change` → ввод адреса
   - `order:next` → переход к контактам
   - `order.email:change` → ввод email
   - `order.phone:change` → ввод телефона
   - `order:submit` → отправка заказа

4. **Системные события:**
   - `products:changed` → обновление каталога
   - `cart:change` → обновление состояния корзины
   - `modal:close` → закрытие модалок

# Презентер

Презентер является центральным звеном приложения, связывающим слой данных (Model) и слой представления (View). Вся бизнес-логика приложения содержится в презентере, который обрабатывает события от представлений, взаимодействует с моделями данных и обновляет представления.

**Основные функции:**
- Инициализация приложения и загрузка данных
- Обработка событий от представлений
- Управление состоянием приложения
- Валидация данных
- Взаимодействие с API

**Логика работы:**
1. Инициализация компонентов представления и моделей данных
2. Подписка на события от всех представлений
3. Обработка пользовательских действий через события
4. Обновление моделей данных
5. Обновление представлений на основе изменений в моделях

**Особенности реализации:**
- Презентер реализован в файле `main.ts`
- Использует EventEmitter для связи между компонентами
- Все пользовательские действия генерируют события
- Каждое событие обрабатывается соответствующей функцией-обработчиком