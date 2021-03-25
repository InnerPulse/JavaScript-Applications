import { html } from '../../../node_modules/lit-html/lit-html.js';

export const teamTemplate = ({ name, logoUrl, description, _ownerId, _id, memberCount }) =>
    html`
        <article class="layout" .value=${_ownerId}>
            <img src=${logoUrl} class="team-logo left-col" />
            <div class="tm-preview">
                <h2>${name}</h2>
                <p>${description}</p>
                <span class="details">${memberCount} ${memberCount > 1 ? ' Members' : ' Member'}</span>
                <div><a href=${`/details/${_id}`} class="action">See details</a></div>
            </div>
        </article>
    `;
