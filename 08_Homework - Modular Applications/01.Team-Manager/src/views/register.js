import { register } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';

const registerTemplate = (onSubmit, errMsg) => html`
    <section id="register">
        <article class="narrow">
            <header class="pad-med">
                <h1>Register</h1>
            </header>

            <form @submit=${onSubmit} id="register-form" class="main-form pad-large">
                ${errMsg ? html`<div class="error">${errMsg + '!'}</div>` : null}
                <label>E-mail: <input type="text" name="email" /></label>
                <label>Username: <input type="text" name="username" /></label>
                <label>Password: <input type="password" name="password" /></label>
                <label>Repeat: <input type="password" name="repass" /></label>
                <input class="action cta" type="submit" value="Create Account" />
            </form>
            <footer class="pad-small">Already have an account? <a href="/login" class="invert">Sign in here</a></footer>
        </article>
    </section>
`;

export default async function registerPage(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const rePass = formData.get('repass');

        [...e.target.querySelectorAll('input')].forEach((i) => (i.disabled = true));

        try {
            if (email === '') {
                throw new Error('Email is required');
            }

            if (email.length < 4) {
                throw new Error('Please use a valid email');
            }

            if (username.length < 3) {
                throw new Error('Username must be at least 3 characters long');
            }

            if (password.length < 3) {
                throw new Error('Password must be at least 3 characters/digits long');
            }

            if (password !== rePass) {
                throw new Error("Passwords don't match");
            }

            await register(email, password, username);

            e.target.reset();
            ctx.setUserNav();
            ctx.page.redirect('/my-teams');
        } catch (err) {
            ctx.render(registerTemplate(onSubmit, err.message));
        } finally {
            [...e.target.querySelectorAll('input')].forEach((i) => (i.disabled = false));
        }
    }
}
