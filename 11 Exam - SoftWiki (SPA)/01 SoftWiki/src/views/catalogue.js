import { html } from '../lib.js';
import { getAllArticles } from '../api/data.js';
import { articleCard } from './common/articleCard.js';

const template = (articles) => html`
    <!-- Catalogue Page -->
    <section id="catalog-page" class="content catalogue">
        <h1>All Articles</h1>
        ${articles.length ? articles.map(articleCard) : html`<h3 class="no-articles">No articles yet</h3>`}
    </section>
`;

export default async function cataloguePage(ctx) {
    const articles = await getAllArticles();
    ctx.render(template(articles));
}
