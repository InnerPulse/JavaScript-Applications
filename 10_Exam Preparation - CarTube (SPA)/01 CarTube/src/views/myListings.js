import { html } from '../lib.js';
import { getUserAds } from '../api/data.js';
import { vehicleCard } from './common/vehicleCard.js';

const template = (ads) => html`
    <!-- My Listings Page -->
    <section id="my-listings">
        <h1>My car listings</h1>
        <br />
        <div class="listings">${ads.length ? ads.map(vehicleCard) : html`<p class="no-cars">You haven't listed any cars yet.</p>`}</div>
    </section>
`;

export default async function myListingsPage(ctx) {
    const userId = JSON.parse(sessionStorage.getItem('auth'))._id;
    const userAds = await getUserAds(userId);
    ctx.render(template(userAds));
}
