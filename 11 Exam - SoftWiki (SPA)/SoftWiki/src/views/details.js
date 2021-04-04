import { html } from '../lib.js';
import { getArticleById, deleteArticle } from '../api/data.js';

const template = ({ title, category, content, _id }, goBack, onDelete, isOwner) => html`
    <!-- Details Page -->
    <section id="details-page" class="content details">
        <h1>${title}</h1>

        <div class="details-content">
            <strong>Published in category ${category}</strong>
            <p>${content}</p>

            ${isOwner
                ? html`
                      <div class="buttons">
                          <a @click=${onDelete} href="javascript:void(0)" class="btn delete">Delete</a>
                          <a href=${'/edit/' + _id} class="btn edit">Edit</a>
                      </div>
                  `
                : null}
            <a @click=${goBack} href="javascript:void(0)" class="btn edit">Back</a>
        </div>
    </section>
`;

export default async function detailsPage(ctx) {
    const articleId = ctx.params.id;
    const auth = sessionStorage.getItem('auth');
    const userId = auth ? JSON.parse(auth)._id : null;
    const article = await getArticleById(articleId);
    const goBack = () => window.history.back();

    ctx.render(template(article, goBack, onDelete, userId === article._ownerId));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this article?');

        if (confirmed) {
            await deleteArticle(articleId);
            ctx.page.redirect('/');
        }
    }
}
