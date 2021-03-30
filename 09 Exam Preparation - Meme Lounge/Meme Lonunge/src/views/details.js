import { html } from '../lib.js';
import { getMemeById, deleteMeme } from '../api/data.js';

const template = (meme, isOwner, onDelete) => html`
    <!-- Details Meme Page (for guests and logged users) -->
    <section id="meme-details">
        <h1>Meme Title: ${meme.title}</h1>
        <div class="meme-details">
            <div class="meme-img">
                <img alt="meme-alt" src=${meme.imageUrl} />
            </div>
            <div class="meme-description">
                <h2>Meme Description</h2>
                <p>${meme.description}</p>

                <!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
                ${isOwner
                    ? html` <a class="button warning" href=${'/edit/' + meme._id}>Edit</a>
                          <button @click=${onDelete} class="button danger">Delete</button>`
                    : null}
            </div>
        </div>
    </section>
`;

export default async function detailsPage(ctx) {
    const userId = sessionStorage.getItem('auth') ? JSON.parse(sessionStorage.getItem('auth'))._id : null;
    const meme = await getMemeById(ctx.params.id);
    ctx.render(template(meme, userId === meme._ownerId, onDelete));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this meme?');

        if (confirmed) {
            await deleteMeme(meme._id);
            ctx.page.redirect('/all-memes');
        }
    }
}
