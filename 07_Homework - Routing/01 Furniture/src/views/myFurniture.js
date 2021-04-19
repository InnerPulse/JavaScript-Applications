import { getMyFurniture } from '../api/data.js';
import { itemTemplate } from './common/itemTemplate.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const myFurnitureTemplate = (data) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>My Furniture</h1>
            <p>This is a list of your publications.</p>
        </div>
    </div>
    <div class="row space-top">${data.map(itemTemplate)}</div>
`;

export async function myFurniturePage(ctx) {
    const data = await getMyFurniture();
    ctx.render(myFurnitureTemplate(data));
}
