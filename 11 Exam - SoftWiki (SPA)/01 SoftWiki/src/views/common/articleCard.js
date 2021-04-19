import { html } from '../../lib.js';

export const articleCard = ({ title, category, _id }) => html`
    <a class="article-preview" href=${'/details/' + _id}>
        <article>
            <h3>Topic: <span>${title}</span></h3>
            <p>Category: <span>${category}</span></p>
        </article>
    </a>
`;
