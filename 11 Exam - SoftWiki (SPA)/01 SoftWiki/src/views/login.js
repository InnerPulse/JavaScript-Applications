import { html } from '../lib.js';
import { login } from '../api/data.js';

const template = (onSubmit) => html`
    <!-- Login Page -->
    <section id="login-page" class="content auth">
        <h1>Login</h1>

        <form @submit=${onSubmit} id="login" action="#" method="">
            <fieldset>
                <blockquote>
                    Knowledge is like money: to be of value it must circulate, and in circulating it can increase in quantity and, hopefully, in value
                </blockquote>
                <p class="field email">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="sample@email.com" required />
                </p>
                <p class="field password">
                    <label for="login-pass">Password:</label>
                    <input type="password" id="login-pass" name="password" required />
                </p>
                <p class="field submit">
                    <input class="btn submit" type="submit" value="Log in" />
                </p>
                <p class="field">
                    <span>If you don't have profile click <a href="/register">here</a></span>
                </p>
            </fieldset>
        </form>
    </section>
`;

export default async function loginPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [email, password] = [formData.get('email').trim(), formData.get('password').trim()];
        if (email === '' || password === '') {
            return alert('All fields are required!');
        }
        await login(email, password);
        ctx.setUserNav();
        ctx.page.redirect('/');
    }
}
