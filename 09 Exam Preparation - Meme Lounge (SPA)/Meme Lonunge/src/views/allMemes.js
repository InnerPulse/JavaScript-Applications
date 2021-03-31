import { html } from '../lib.js';
import { getAllMemes } from '../api/data.js';

const template = (memes) => html`
    <!-- All Memes Page ( for Guests and Users )-->
    <section id="meme-feed">
        <h1>All Memes</h1>
        <div id="memes">${memes.length ? memes.map(cardTemplate) : html`<p class="no-memes">No memes in database.</p>`}</div>
    </section>
`;

const cardTemplate = ({ title, imageUrl, _id, _ownerId }) => html`
    <div class="meme" dataset=${_ownerId}>
        <div class="card">
            <div class="info">
                <p class="meme-title">${title}</p>
                <img class="meme-image" alt="meme-img" src=${imageUrl} />
            </div>
            <div id="data-buttons">
                <a class="button" href=${'/details/' + _id}>Details</a>
            </div>
        </div>
    </div>
`;

export default async function allMemesPage(ctx) {
    const memes = await getAllMemes();
    ctx.render(template(memes));
}
