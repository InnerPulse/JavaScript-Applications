import { html, render } from '//unpkg.com/lit-html?module';
import { classMap } from '//unpkg.com/lit-html/directives/class-map?module';

const buttonTemplate = (text, type) => html`
    <style>
        .btn {
            padding: 0.5em 1em;
            border-radius: 0.5em;
            font-family: sans-serif;
            font-weight: bold;
            font-size: 1.2em;
            outline: none;
            cursor: pointer;
            box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
            border: none;
        }

        .primary {
            color: rgb(255, 255, 255);
            background-color: rgb(63, 81, 181);
        }

        .accent {
            color: rgb(255, 255, 255);
            background-color: rgb(255, 64, 129);
        }

        .warn {
            color: rgb(255, 255, 255);
            background-color: rgb(244, 67, 54);
        }
    </style>
    <!-- Without classMap -->
    <button class="btn ${type}">${text}</button>
    
    <!-- With classMap -->
    <!-- ${classMap({
        btn: true,
        warn: type === 'warn',
        accent: type === 'accent',
        primary: type === 'primary',
    })} -->
`;

class CustomButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const text = this.getAttribute('text');
        const type = this.getAttribute('type');

        render(buttonTemplate(text, type), this.shadowRoot);
    }
}

window.customElements.define('custom-button', CustomButton);
