import { getItemById, deleteItem } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const detailsTemplate = (item, onDelete, isOwner) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Furniture Details</h1>
        </div>
    </div>
    <div class="row space-top">
        <div class="col-md-4">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <img src=${item.img} />
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <p>Make: <span>${item.make}</span></p>
            <p>Model: <span>${item.model}</span></p>
            <p>Year: <span>${item.year}</span></p>
            <p>Description: <span>${item.description}</span></p>
            <p>Price: <span>${item.price}</span></p>
            <p>Material: <span>${item.material}</span></p>
            ${isOwner
                ? html` <div>
                      <a href=${'/edit/' + item._id} class="btn btn-info">Edit</a>
                      <a @click=${onDelete} href="javascript:void(0)" class="btn btn-red">Delete</a>
                  </div>`
                : null}
        </div>
    </div>
`;

export async function detailsPage(ctx) {
    const itemId = ctx.params.id;
    const item = await getItemById(itemId);
    ctx.render(detailsTemplate(item, onDelete, sessionStorage.getItem('userId') === item._ownerId));

    async function onDelete() {
        const confirmed = confirm('Are you sure you want to delete this item?');

        if (confirmed) {
            await deleteItem(itemId);
            ctx.page.redirect('/');
        }
    }
}
