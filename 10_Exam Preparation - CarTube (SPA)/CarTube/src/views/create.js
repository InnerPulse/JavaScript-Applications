import { html } from '../lib.js';
import { createAd } from '../api/data.js';

const template = (onSubmit) => html`
    <!-- Create Listing Page -->
    <section id="create-listing">
        <div class="container">
            <form @submit=${onSubmit} id="create-form">
                <h1>Create Car Listing</h1>
                <p>Please fill in this form to create an listing.</p>
                <hr />

                <p>Car Brand</p>
                <input type="text" placeholder="Enter Car Brand" name="brand" required />

                <p>Car Model</p>
                <input type="text" placeholder="Enter Car Model" name="model" required />

                <p>Description</p>
                <input type="text" placeholder="Enter Description" name="description" required />

                <p>Car Year</p>
                <input type="number" placeholder="Enter Car Year" name="year" required />

                <p>Car Image</p>
                <input type="text" placeholder="Enter Car Image" name="imageUrl" required />

                <p>Car Price</p>
                <input type="number" placeholder="Enter Car Price" name="price" required />

                <hr />
                <input type="submit" class="registerbtn" value="Create Listing" />
            </form>
        </div>
    </section>
`;

export default async function createPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const brand = formData.get('brand').trim();
        const model = formData.get('model').trim();
        const imageUrl = formData.get('imageUrl').trim();
        const year = Number(formData.get('year').trim());
        const price = Number(formData.get('price').trim());
        const description = formData.get('description').trim();
        const ad = { brand, model, description, year, imageUrl, price };

        if ([brand, model, imageUrl, description].map(Boolean).includes(false)) {
            return alert('All fields are required!');
        }

        if (year < 1 || price < 1) {
            return alert('Year and price must be a positive numbers!');
        }

        await createAd(ad);
        ctx.page.redirect('/catalog');
    }
}
