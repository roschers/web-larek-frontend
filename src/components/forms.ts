import { IForm, IOrderForm, FormErrors } from '../types';

// Базовый класс для всех форм
export abstract class BaseForm implements IForm {
    protected _element: HTMLFormElement;
    protected _errors: FormErrors = {};
    protected _submitButton: HTMLButtonElement | null = null;

    constructor(protected onSubmit: (data: Partial<IOrderForm>) => void) {
        this._element = document.createElement('form');
        this._element.classList.add('form');
        
        this._element.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.valid) {
                const formData = new FormData(this._element);
                this.onSubmit(Object.fromEntries(formData));
            }
        });
    }

    set errors(value: FormErrors) {
        this._errors = value;
        Object.keys(value).forEach(key => {
            const error = this._element.querySelector(`[data-error="${key}"]`);
            if (error) {
                error.textContent = value[key] || '';
            }
        });
        this.updateSubmitButton();
    }

    get valid(): boolean {
        return Object.keys(this._errors).length === 0;
    }

    reset() {
        this._element.reset();
        this.errors = {};
    }

    protected updateSubmitButton() {
        if (this._submitButton) {
            this._submitButton.disabled = !this.valid;
            this._submitButton.classList.toggle('button_disabled', !this.valid);
        }
    }

    toggleClass(className: string, force?: boolean): void {
        this._element.classList.toggle(className, force);
    }

    setText(text: string): void {
        this._element.textContent = text;
    }

    setImage(src: string, alt?: string): void {
        const img = document.createElement('img');
        img.src = src;
        if (alt) img.alt = alt;
        this._element.innerHTML = '';
        this._element.appendChild(img);
    }

    setDisable(state: boolean): void {
        this._element.classList.toggle('form--disabled', state);
    }

    setVisible(): void {
        this._element.classList.add('form--visible');
    }

    setHidden(): void {
        this._element.classList.remove('form--visible');
    }

    protected createField(label: string, name: string, type: string = 'text', required: boolean = true): string {
        return `
            <label class="order__field">
                <span class="form__label modal__title">${label}</span>
                <input name="${name}" class="form__input" type="${type}" ${required ? 'required' : ''} />
                <span data-error="${name}"></span>
            </label>
        `;
    }

    protected createButton(text: string, type: string = 'submit'): string {
        return `
            <div class="modal__actions">
                <button type="${type}" class="button button_disabled" disabled>${text}</button>
            </div>
        `;
    }

    abstract render(): HTMLElement;
}

// Форма заказа
export class OrderForm extends BaseForm {
    render(): HTMLElement {
        this._element.innerHTML = `
            <div class="order">
                <div class="order__field">
                    <h2 class="modal__title">Способ оплаты</h2>
                    <div class="order__buttons">
                        <button name="payment" value="card" type="button" class="button button_alt">Онлайн</button>
                        <button name="payment" value="cash" type="button" class="button button_alt">При получении</button>
                    </div>
                    <span data-error="payment"></span>
                </div>
                ${this.createField('Адрес доставки', 'address')}
            </div>
            ${this.createButton('Далее')}
        `;

        // Обработчики кнопок оплаты
        const paymentButtons = this._element.querySelectorAll('button[name="payment"]');
        paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                paymentButtons.forEach(btn => btn.classList.remove('button_active'));
                button.classList.add('button_active');
                this.validatePayment();
            });
        });

        // Обработчик поля адреса
        const addressInput = this._element.querySelector('input[name="address"]');
        if (addressInput) {
            addressInput.addEventListener('input', () => this.validateAddress());
        }

        this._submitButton = this._element.querySelector('button[type="submit"]');
        return this._element;
    }

    private validatePayment(): void {
        const payment = this._element.querySelector('button[name="payment"].button_active');
        if (!payment) {
            this.errors = { ...this._errors, payment: 'Выберите способ оплаты' };
        } else {
            const { payment: _, ...rest } = this._errors;
            this.errors = rest;
        }
    }

    private validateAddress(): void {
        const address = this._element.querySelector('input[name="address"]') as HTMLInputElement;
        if (!address.value.trim()) {
            this.errors = { ...this._errors, address: 'Введите адрес доставки' };
        } else {
            const { address: _, ...rest } = this._errors;
            this.errors = rest;
        }
    }
}

// Форма контактов
export class ContactsForm extends BaseForm {
    render(): HTMLElement {
        this._element.innerHTML = `
            <div class="order">
                ${this.createField('Email', 'email', 'email')}
                ${this.createField('Телефон', 'phone', 'tel')}
            </div>
            ${this.createButton('Оплатить')}
        `;

        // Обработчики полей
        const emailInput = this._element.querySelector('input[name="email"]');
        const phoneInput = this._element.querySelector('input[name="phone"]');

        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateEmail());
        }
        if (phoneInput) {
            phoneInput.addEventListener('input', () => this.validatePhone());
        }

        this._submitButton = this._element.querySelector('button[type="submit"]');
        return this._element;
    }

    private validateEmail(): void {
        const email = this._element.querySelector('input[name="email"]') as HTMLInputElement;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            this.errors = { ...this._errors, email: 'Введите корректный email' };
        } else {
            const { email: _, ...rest } = this._errors;
            this.errors = rest;
        }
    }

    private validatePhone(): void {
        const phone = this._element.querySelector('input[name="phone"]') as HTMLInputElement;
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(phone.value.replace(/\D/g, ''))) {
            this.errors = { ...this._errors, phone: 'Введите корректный номер телефона' };
        } else {
            const { phone: _, ...rest } = this._errors;
            this.errors = rest;
        }
    }
}