import { towns } from './townsData.js';
import { html, render } from '../node_modules/lit-html/lit-html.js';

const searchTemplate = (towns, match) => html`
    <article>
        <div id="towns">
            <ul>
                ${towns.map((t) => itemTemplate(t, match))}
            </ul>
        </div>
        <input type="text" id="searchText" />
        <button @click=${search}>Search</button>
        <div id="result">${countMatches(towns, match)}</div>
    </article>
`;

const itemTemplate = (name, match) =>
    html`<li class=${match && name.toLowerCase().includes(match) ? 'active' : ''}>${name}</li>`;

const update = (match = '') => {
    render(searchTemplate(towns, match), document.body);
};

update();

function search(e) {
    const input = e.target.parentNode.querySelector('input').value;
    update(input);
}

function countMatches(towns, match) {
    const matches = towns.filter((t) => match && t.toLowerCase().includes(match.toLowerCase())).length;
    return matches ? `${matches} matches found` : '';
}
