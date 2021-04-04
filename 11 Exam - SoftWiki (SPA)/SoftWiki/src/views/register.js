import { html } from '../lib.js';
import { register } from '../api/data.js';

const template = (onSubmit) => html`
    <!-- Register Page -->
    <section id="register-page" class="content auth">
        <h1>Register</h1>

        <form @submit=${onSubmit} id="register" action="#" method="">
            <fieldset>
                <blockquote>
                    Knowledge is not simply another commodity. On the contrary. Knowledge is never used up. It increases by diffusion and grows by
                    dispersion.
                </blockquote>
                <p class="field email">
                    <label for="register-email">Email:</label>
                    <input type="email" id="register-email" name="email" placeholder="sample@email.com" required />
                </p>
                <p class="field password">
                    <label for="register-pass">Password:</label>
                    <input type="password" name="password" id="register-pass" required />
                </p>
                <p class="field password">
                    <label for="register-rep-pass">Repeat password:</label>
                    <input type="password" name="rep-pass" id="register-rep-pass" required />
                </p>
                <p class="field submit">
                    <input class="btn submit" type="submit" value="Register" />
                </p>
                <p class="field">
                    <span>If you already have profile click <a href="/login">here</a></span>
                </p>
            </fieldset>
        </form>
    </section>
`;

export default async function registerPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [email, password, repeatPass] = [formData.get('email').trim(), formData.get('password').trim(), formData.get('rep-pass').trim()];

        if (email === '' || password === '') {
            return alert('All fields are required!');
        }

        if (password !== repeatPass) {
            return alert("Passwords don't match!");
        }

        await register(email, password);
        ctx.setUserNav();
        ctx.page.redirect('/');
    }
}
