import { html, render } from '../node_modules/lit-html/lit-html.js';

document.getElementById('btnLoadTowns').addEventListener('click', updateList);
const listTemplate = (data) => html`
    <ul>
        ${data.map((town) => html`<li>${town}</li>`)}
    </ul>
`;

function updateList(e) {
    e.preventDefault();

    const towns = document
        .getElementById('towns')
        .value.split(',')
        .map((x) => x.trim());

    render(listTemplate(towns), document.getElementById('root'));
}
