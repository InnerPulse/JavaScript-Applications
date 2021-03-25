import { createTeam } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const createTemplate = (onSubmit, errMsg) => html`
    <section id="create">
        <article class="narrow">
            <header class="pad-med">
                <h1>New Team</h1>
            </header>

            <form @submit=${onSubmit} id="create-form" class="main-form pad-large">
                ${errMsg ? html`<div class="error">${errMsg + '!'}</div>` : null}
                <label>Team name: <input type="text" name="name" /></label>
                <label>Logo URL: <input type="text" name="logoUrl" /></label>
                <label>Description: <textarea name="description"></textarea></label>
                <input class="action cta" type="submit" value="Create Team" />
            </form>
        </article>
    </section>
`;

export default async function createPage(ctx) {
    if (sessionStorage.getItem('auth') === null) {
        return alert('You need to login first!');
    }

    ctx.render(createTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const logoUrl = formData.get('logoUrl');
        const description = formData.get('description');

        [...e.target.querySelectorAll('input')].forEach((i) => (i.disabled = true));

        try {
            if (name.length < 4) {
                throw new Error('Team name must be at least 4 characters long');
            }

            if (logoUrl === '') {
                throw new Error('Team logo is required');
            }

            if (description.length < 10) {
                throw new Error('Description must be at least 10 characters');
            }

            const team = await createTeam({ name, logoUrl, description });
            // TODO: add creator as member and approve request

            e.target.reset();
            ctx.page.redirect('/details/' + team._id);
        } catch (err) {
            ctx.render(createTemplate(onSubmit, err.message));
        } finally {
            [...e.target.querySelectorAll('input')].forEach((i) => (i.disabled = false));
        }
    }
}
