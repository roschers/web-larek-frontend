# Проектная работа "Веб-ларек"
------

Проект "Веб-ларек" — веб-приложение для онлайн-покупок. Архитектура проекта построена по принципу **MVP**

Стек: HTML, SCSS, TS, Webpack, Внешний API, EventEmitter

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
------
Установите [Node.js]

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка
------

```
npm run build
```

или

```
yarn build
```

## 🏗️ Архитектура MVP

### Слои приложения

* **Model:**	Управление данными (товары, корзина, заказы), бизнес-логика, работа с API.
* **View:**	Рендеринг UI, обработка пользовательских событий.
* **Presenter:**	Координация Model и View через EventEmitter.

### Взаимодействие слоёв

Пользователь → View (клик) → EventEmitter → Presenter → Model → Обновление данных → View

-----

## Основные компоненты

### Слой Model

#### **ProductModel**

**Описание:** Хранит данные товара и состояние корзины.

**Поля:**
* id: string;
* title: string;
* price: number;
* category: string;
* image: string;
* isInBasket: boolean;

#### **BasketModel**

* **Методы:** 
addProduct(product: ProductModel): void;  // Добавить товар
removeProduct(id: string): void;          // Удалить товар
getTotalPrice(): number;                  // Сумма корзины
clear(): void;                            // Очистить корзину

-----

### Слой View

#### **CardView**

**Описание:** Рендерит карточку товара из шаблона.

**Методы:** 
render(templateId: string): HTMLElement;  // Генерация DOM-элемента
bindEvents(handler: (id: string) => void): void; // Обработка кликов

#### **ModalView**

**Описание:** Управляет модальными окнами (корзина, детали товара, формы заказа).

**Методы:**
open(content: HTMLElement): void;  // Показать модальное окно
close(): void;                     // Скрыть модальное окно

-----

### Слой Presenter 

Реализован через **EventEmitter:**
// Пример подписки на событие
eventEmitter.on("basket:add", (productId: string) => {
  BasketModel.add(productId);
  BasketView.update(BasketModel.items);
});

**Ключевые события:**

* card:select — выбор товара для просмотра.
* basket:add — добавление товара в корзину.
* order:submit — оформление заказа.


## 🛠️ Взаимодействие с API

**ApiClient**
class ApiClient {
  async getProducts(): Promise<IApiProduct[]> { ... }  // Загрузка товаров
  async postOrder(order: IApiOrder): Promise<void> { ... }  // Отправка заказа
}

## 🔗 Связь с шаблонами 
**Шаблоны (из index.html):**

#card-catalog — карточка в каталоге.
#basket — содержимое корзины.

**Принцип работы:**
// Пример рендеринга карточки
const card = new CardView(product);
gallery.append(card.render("#card-catalog"));


## 📜 Описание базовых классов
------

### Слой Model
---

* Класс **Product** - Хранит данные товара.
*Метод:*
	id, title, price, isInBasket (флаг наличия в корзине)

* Класс **Basket** - Управляет корзиной: добавление, удаление, расчёт суммы.
*Метод:*
	addProduct(), removeProduct(), getTotalPrice(), clear()

* Класс **ApiClient** - Обеспечивает взаимодействие с API.
*Метод:*
	getProducts(), postOrder()

### Слой View
---

* Класс **Card** - Рендерит карточку товара из шаблонов.
*Метод:*
	render(), bindEvents()

* Класс **Modal** - Управляет модальными окнами.
*Метод:*
	open(), close(), handleOutsideClick()


### Слой Presenter
---

* Класс **EventEmitter** - Брокер событий: регистрация, вызов, удаление обработчиков.


## Описание компонентов
------

### Компонент **Gallery**
---
* **Назначение:** Каталог товара.

* **Связи:** 
1. Использует **ApiClient** для получения данных.
2. Генерирует событие **card:select** при выборе товара.

### Компонент **BasketView**
---
* **Описание:** Содержимое корзины.

* **Связи:** 
1. Слушает событие **basket:update** для перерисовки.
2. Взаимодействует с **OrderView** через событие **order:init**.

### Компонент **OrderView**
---
* **Описание:**  Форма оформления заказа.

* **Связи:** 
1. Использует **ApiClient** для отправки данных заказа.
2. Валидирует поля через утилиту **validateForm()**.
