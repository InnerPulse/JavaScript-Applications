import { html, render } from '//unpkg.com/lit-html?module';

const elementTemplate = (title, description) => html`
    <style>
        h1 {
            color: aqua;
        }
    </style>

    <article>
        <h1>
            <slot name="title">Default Title</slot>
        </h1>
        <p>
            <slot name="description">Default Description</slot>
        </p>
    </article>
`;

class MyLitElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        render(elementTemplate(), this.shadowRoot, { eventContext: this });
    }

    // disconnectedCallback() {} 
}

window.customElements.define('card-element', MyLitElement);
