import { html } from '../lib.js';
import { search } from '../api/data.js';
import { vehicleCard } from './common/vehicleCard.js';

const template = (onSearch, result = []) => html`
    <!-- Search Page -->
    <section id="search-cars">
        <h1>Filter by year</h1>

        <div class="container">
            <input type="text" id="search-input" name="search" placeholder="Enter desired production year" />
            <button @click=${onSearch} class="button-list">Search</button>
        </div>

        <h2>Results:</h2>
        <div class="listings">${result.length ? result.map(vehicleCard) : html`<p class="no-cars">No results.</p>`}</div>
    </section>
`;

export default async function searchPage(ctx) {
    if (ctx.querystring) {
        const result = await search(ctx.querystring.split('=').pop());
        return ctx.render(template(onSearch, result));
    }
    ctx.render(template(onSearch));

    function onSearch() {
        const input = document.getElementById('search-input');
        const query = Number(input.value.trim());

        if (isNaN(query) || query < 1) {
            return alert('Please use valid year!');
        }
        input.value = '';
        ctx.page.redirect('/search?query=' + query);
    }
}
