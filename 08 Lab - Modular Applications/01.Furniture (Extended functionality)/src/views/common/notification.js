import { html, render } from '../../../node_modules/lit-html/lit-html.js';

const notificationTemplate = (msg, clear) => html`
    <section id="notification">${msg}<span @click=${clear} class="close-notification">✖</span></section>
`;

const container = document.createElement('div');
container.id = 'notification-holder';

export function notify(msg) {
    render(notificationTemplate(msg, clear), container);
    document.body.appendChild(container);
    setTimeout(clear, 3000);
    clearTimeout(clear);
}

export function clear() {
    render('', container);
}
