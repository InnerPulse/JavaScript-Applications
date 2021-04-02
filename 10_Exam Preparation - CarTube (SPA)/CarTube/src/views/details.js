import { html } from '../lib.js';
import { getAdById, deleteAd } from '../api/data.js';

const template = ({ imageUrl, brand, model, year, price, _id, description }, onDelete, isOwner) => html`
    <!-- Listing Details Page -->
    <section id="listing-details">
        <h1>Details</h1>
        <div class="details-info">
            <img src=${imageUrl} />
            <hr />
            <ul class="listing-props">
                <li><span>Brand:</span>${brand}</li>
                <li><span>Model:</span>${model}</li>
                <li><span>Year:</span>${year}</li>
                <li><span>Price:</span>${price}$</li>
            </ul>

            <p class="description-para">${description}</p>

            <div class="listings-buttons">
                ${isOwner
                    ? html`
                          <a href=${'/edit/' + _id} class="button-list">Edit</a>
                          <a @click=${onDelete} href="javascript:void(0)" class="button-list">Delete</a>
                      `
                    : null}
            </div>
        </div>
    </section>
`;

export default async function detailsPage(ctx) {
    const adId = ctx.params.id;
    const auth = sessionStorage.getItem('auth');
    const userId = auth ? JSON.parse(auth)._id : null;
    const ad = await getAdById(adId);

    ctx.render(template(ad, onDelete, userId === ad._ownerId));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this advertise?');

        if (confirmed) {
            await deleteAd(adId);
            ctx.page.redirect('/catalog');
        }
    }
}
