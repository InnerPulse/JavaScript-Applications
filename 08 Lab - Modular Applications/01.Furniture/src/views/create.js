import { createItem } from '../api/data.js';
import { notify, clear } from './common/notification.js'
import { html } from '../../node_modules/lit-html/lit-html.js';

const createTemplate = (onSubmit) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Create New Furniture</h1>
            <p>Please fill all fields.</p>
        </div>
    </div>
    <form @submit=${onSubmit}>
        <div class="row space-top">
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-control-label" for="new-make">Make</label>
                    <input class="form-control valid" id="new-make" type="text" name="make" />
                </div>
                <div class="form-group has-success">
                    <label class="form-control-label" for="new-model">Model</label>
                    <input class="form-control" id="new-model" type="text" name="model" />
                </div>
                <div class="form-group has-danger">
                    <label class="form-control-label" for="new-year">Year</label>
                    <input class="form-control" id="new-year" type="number" name="year" />
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="new-description">Description</label>
                    <input class="form-control" id="new-description" type="text" name="description" />
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label class="form-control-label" for="new-price">Price</label>
                    <input class="form-control" id="new-price" type="number" name="price" />
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="new-image">Image</label>
                    <input class="form-control" id="new-image" type="text" name="img" />
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="new-material">Material (optional)</label>
                    <input class="form-control is-valid" id="new-material" type="text" name="material" />
                </div>
                <input type="submit" class="btn btn-primary" value="Create" />
            </div>
        </div>
    </form>
`;

export async function createPage(ctx) {
    ctx.render(createTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = [...new FormData(e.target).entries()].reduce((a, [k, v]) => Object.assign(a, { [k]: v }), {});
        // In real life situation that's bad practice of getting form data because anyone can just add new inputs with
        // whatever they want in it and that way I'm gonna get it! For the sake of keeping my focus on the main subject
        // I decided instead going trough all 7 fields to get the data and validate them at once
        if (
            Object.entries(formData)
                .filter(([k, v]) => k !== 'material')
                .some(([k, v]) => v === '')
        ) {
            return notify('Please fill all mandatory fields!');
        }

        formData.year = Number(formData.year);
        formData.price = Number(formData.price);

        await createItem(formData);
        clear();
        ctx.page.redirect('/');
    }
}
