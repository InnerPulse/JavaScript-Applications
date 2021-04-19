import { html } from '../lib.js';
import { register } from '../api/data.js';
import { welcomeMsg } from './common/welcomeMsg.js';

const template = (onSubmit) => html`
    <!-- Register Page -->
    <section id="register">
        <div class="container">
            <form @submit=${onSubmit} id="register-form">
                <h1>Register</h1>
                <br />
                <p>Please fill in this form to create an account.</p>
                <hr />

                <p>Username</p>
                <input type="text" placeholder="Enter Username" name="username" required />

                <p>Password</p>
                <input type="password" placeholder="Enter Password" name="password" required />

                <p>Repeat Password</p>
                <input type="password" placeholder="Repeat Password" name="repeatPass" required />
                <hr />

                <input type="submit" class="registerbtn" value="Register" />
            </form>
            <div class="signin">
                <p>Already have an account? <a href="/login">Sign in</a>.</p>
            </div>
        </div>
    </section>
`;

export default async function registerPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [username, password, repeatPass] = [formData.get('username').trim(), formData.get('password').trim(), formData.get('repeatPass').trim()];

        if (username === '' || password === '') {
            return alert('All fields are required!');
        }

        if (password !== repeatPass) {
            return alert("Passwords don't match");
        }

        await register(username, password);
        welcomeMsg(username);
        ctx.setUserNav();
        ctx.page.redirect('/catalog');
    }
}
