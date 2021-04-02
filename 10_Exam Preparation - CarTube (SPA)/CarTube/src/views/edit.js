import { html } from '../lib.js';
import { getAdById, editAd } from '../api/data.js';

const template = ({ imageUrl, brand, model, year, price, _id, description }, onSubmit) => html`
    <!-- Edit Listing Page -->
    <section id="edit-listing">
        <div class="container">
            <form @submit=${onSubmit} id="edit-form">
                <h1>Edit Car Listing</h1>
                <p>Please fill in this form to edit an listing.</p>
                <hr />

                <p>Car Brand</p>
                <input type="text" placeholder="Enter Car Brand" name="brand" .value=${brand} required />

                <p>Car Model</p>
                <input type="text" placeholder="Enter Car Model" name="model" .value=${model} required />

                <p>Description</p>
                <input type="text" placeholder="Enter Description" name="description" .value=${description} required />

                <p>Car Year</p>
                <input type="number" placeholder="Enter Car Year" name="year" .value=${year} required />

                <p>Car Image</p>
                <input type="text" placeholder="Enter Car Image" name="imageUrl" .value=${imageUrl} required />

                <p>Car Price</p>
                <input type="number" placeholder="Enter Car Price" name="price" .value=${price} required />

                <hr />
                <input type="submit" class="registerbtn" value="Edit Listing" />
            </form>
        </div>
    </section>
`;

export default async function editPage(ctx) {
    const ad = await getAdById(ctx.params.id);
    ctx.render(template(ad, onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const brand = formData.get('brand').trim();
        const model = formData.get('model').trim();
        const year = Number(formData.get('year').trim());
        const price = Number(formData.get('price').trim());
        const imageUrl = formData.get('imageUrl').trim();
        const description = formData.get('description').trim();
        const editedAd = { brand, model, description, year, imageUrl, price };

        if ([brand, model, imageUrl, description].map(Boolean).includes(false)) {
            return alert('All fields are required!');
        }

        if (year < 1 || price < 1) {
            return alert('Year and price must be a positive numbers!');
        }

        await editAd(ad._id, editedAd);
        ctx.page.redirect('/catalog');
    }
}
