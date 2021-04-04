import { html } from '../lib.js';
import { search } from '../api/data.js';
import { articleCard } from './common/articleCard.js';

const template = (onSearch, result = []) => html`
    <!-- Search Page -->
    <section id="search-page" class="content">
        <h1>Search</h1>
        <form @submit=${onSearch} id="search-form">
            <p class="field search">
                <input type="text" placeholder="Search by article title" name="search" />
            </p>
            <p class="field submit">
                <input class="btn submit" type="submit" value="Search" />
            </p>
        </form>
        <div class="search-container">${result.length ? result.map(articleCard) : html`<h3 class="no-articles">No matching articles</h3>`}</div>
    </section>
`;

export default async function searchPage(ctx) {
    if (ctx.querystring) {
        const result = await search(ctx.querystring.split('=')[1]);
        return ctx.render(template(onSearch, result));
    }
    ctx.render(template(onSearch));

    function onSearch(e) {
        e.preventDefault();
        const query = new FormData(e.target).get('search').trim();

        if (query === '') {
            return alert("Search details can't be empty!");
        }

        e.target.reset();
        ctx.page.redirect('/search?query=' + query);
        ctx.render(template(onSearch));
    }
}
