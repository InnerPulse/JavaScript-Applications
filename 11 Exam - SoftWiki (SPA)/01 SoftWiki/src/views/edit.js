import { html } from '../lib.js';
import { getArticleById, editArticle } from '../api/data.js';

const template = ({ title, category, content }, onSubmit) => html`
    <!-- Edit Page -->
    <section id="edit-page" class="content">
        <h1>Edit Article</h1>

        <form @submit=${onSubmit} id="edit" action="#" method="">
            <fieldset>
                <p class="field title">
                    <label for="title">Title:</label>
                    <input type="text" name="title" id="title" placeholder="Enter article title" .value=${title} required />
                </p>

                <p class="field category">
                    <label for="category">Category:</label>
                    <input type="text" name="category" id="category" placeholder="Enter article category" .value=${category} required />
                </p>
                <p class="field">
                    <label for="content">Content:</label>
                    <textarea name="content" id="content" .value=${content} required></textarea>
                </p>

                <p class="field submit">
                    <input class="btn submit" type="submit" value="Save Changes" />
                </p>
            </fieldset>
        </form>
    </section>
`;

export default async function editPage(ctx) {
    const article = await getArticleById(ctx.params.id);
    ctx.render(template(article, onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get('title').trim();
        const category = formData.get('category').trim();
        const content = formData.get('content').trim();

        if ([title, category, content].map(Boolean).includes(false)) {
            return alert('All fields are required!');
        }

        await editArticle(article._id, { title, category, content });
        ctx.page.redirect('/details/' + article._id);
    }
}
