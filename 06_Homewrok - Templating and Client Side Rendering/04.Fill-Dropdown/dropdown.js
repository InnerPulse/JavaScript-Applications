import { html, render } from '../node_modules/lit-html/lit-html.js';

const selectTemplate = (list) => html`
    <select id="menu">
        ${list.map((x) => html`<option value=${x._id}>${x.text}</option>`)}
    </select>
`;

const main = document.querySelector('div');
const input = document.getElementById('itemText');
const endpoint = 'http://localhost:3030/jsonstore/advanced/dropdown';

const initialize = async () => {
    document.querySelector('form').addEventListener('submit', (e) => addItem(e, list));

    const response = await fetch(endpoint);
    const data = await response.json();
    const list = Object.values(data);

    update(list);
};

initialize();

const update = (list) => {
    render(selectTemplate(list), main);
};

async function addItem(e, list) {
    e.preventDefault();

    if (input.value) {
        const item = {
            text: input.value,
        };

        const response = await fetch(endpoint, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' }, // there is no error handling but that's not the focus here!
            body: JSON.stringify(item),
        });

        const result = await response.json();
        list.push(result);

        input.value = '';
        update(list);
    }
}
