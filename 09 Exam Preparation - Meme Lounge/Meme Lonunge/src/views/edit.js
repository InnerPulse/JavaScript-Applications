import { html } from '../lib.js';
import { notify } from '../notification.js';
import { getMemeById, editMeme } from '../api/data.js';

const template = ({ title, description, imageUrl }, onSubmit) => html`
    <!-- Edit Meme Page ( Only for logged user and creator to this meme )-->
    <section id="edit-meme">
        <form @submit=${onSubmit} id="edit-form">
            <h1>Edit Meme</h1>
            <div class="container">
                <label for="title">Title</label>
                <input id="title" type="text" placeholder="Enter Title" name="title" .value=${title} />
                <label for="description">Description</label>
                <textarea id="description" placeholder="Enter Description" name="description" .value=${description}> </textarea>
                <label for="imageUrl">Image Url</label>
                <input id="imageUrl" type="text" placeholder="Enter Meme ImageUrl" name="imageUrl" .value=${imageUrl} />
                <input type="submit" class="registerbtn button" value="Edit Meme" />
            </div>
        </form>
    </section>
`;

export default async function editPage(ctx) {
    const meme = await getMemeById(ctx.params.id);
    ctx.render(template(meme, onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title').trim();
        const imageUrl = formData.get('imageUrl').trim();
        const description = formData.get('description').trim();

        if ([title, imageUrl, description].map(Boolean).includes(false)) {
            return notify('All fields are required!');
        }

        await editMeme(meme._id, { title, description, imageUrl });
        e.target.reset();
        ctx.page.redirect('/details/' + meme._id);
    }
}
