import { html } from '../lib.js';
import { getAllAds } from '../api/data.js';
import { vehicleCard } from './common/vehicleCard.js';

const template = (ads) => html`
    <!-- All Listings Page -->
    <section id="car-listings">
        <h1>Car Listings</h1>
        <div class="listings">${ads.length ? ads.map(vehicleCard) : html`<p class="no-cars">No cars in database.</p>`}</div>
    </section>
`;

export default async function catalogPage(ctx) {
    const ads = await getAllAds();
    ctx.render(template(ads));
}
