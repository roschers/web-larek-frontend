import { IForm, FormErrors } from '../../types';

export class BaseForm implements IForm {
    protected _form: HTMLFormElement;
    protected _errors: FormErrors = {};

    constructor(form: HTMLFormElement) {
        this._form = form;
    }

    render(): HTMLElement {
        return this._form;
    }

    toggleClass(className: string, force?: boolean): void {
        this._form.classList.toggle(className, force);
    }

    setText(text: string): void {
        this._form.textContent = text;
    }

    setImage(src: string, alt?: string): void {
        const img = document.createElement('img');
        img.src = src;
        if (alt) img.alt = alt;
        this._form.innerHTML = '';
        this._form.appendChild(img);
    }

    setDisable(state: boolean): void {
        this._form.classList.toggle('form--disabled', state);
    }

    setVisible(): void {
        this._form.classList.add('form--visible');
    }

    setHidden(): void {
        this._form.classList.remove('form--visible');
    }

    get valid(): boolean {
        return Object.keys(this._errors).length === 0;
    }

    get errors(): FormErrors {
        return this._errors;
    }

    reset(): void {
        this._form.reset();
        this._errors = {};
    }
} 