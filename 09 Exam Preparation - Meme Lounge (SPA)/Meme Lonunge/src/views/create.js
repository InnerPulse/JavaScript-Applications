import { html } from '../lib.js';
import { createMeme } from '../api/data.js';
import { notify } from '../notification.js';

const template = (onSubmit) => html`
    <!-- Create Meme Page ( Only for logged users ) -->
    <section id="create-meme">
        <form @submit=${onSubmit} id="create-form">
            <div class="container">
                <h1>Create Meme</h1>
                <label for="title">Title</label>
                <input id="title" type="text" placeholder="Enter Title" name="title" />
                <label for="description">Description</label>
                <textarea id="description" placeholder="Enter Description" name="description"></textarea>
                <label for="imageUrl">Meme Image</label>
                <input id="imageUrl" type="text" placeholder="Enter meme ImageUrl" name="imageUrl" />
                <input type="submit" class="registerbtn button" value="Create Meme" />
            </div>
        </form>
    </section>
`;

export default async function createPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title').trim();
        const imageUrl = formData.get('imageUrl').trim();
        const description = formData.get('description').trim();

        if ([title, imageUrl, description].map(Boolean).includes(false)) {
            return notify('All fields are required!');
        }

        await createMeme({ title, description, imageUrl });
        e.target.reset();
        ctx.page.redirect('/all-memes/');
    }
}
