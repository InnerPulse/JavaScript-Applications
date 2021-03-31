import { html } from '../lib.js';
import { login } from '../api/data.js';
import { notify } from '../notification.js';

const template = (onSubmit) => html`
    <!-- Login Page ( Only for guest users ) -->
    <section id="login">
        <form @submit=${onSubmit} id="login-form">
            <div class="container">
                <h1>Login</h1>
                <label for="email">Email</label>
                <input id="email" placeholder="Enter Email" name="email" type="text" />
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Enter Password" name="password" />
                <input type="submit" class="registerbtn button" value="Login" />
                <div class="container signin">
                    <p>Dont have an account?<a href="/register">Sign up</a>.</p>
                </div>
            </div>
        </form>
    </section>
`;

export default function loginPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [email, password] = [formData.get('email').trim(), formData.get('password').trim()];

        if (email === '' || password === '') {
            return notify('Please enter valid details!');
        }

        await login(email, password);
        e.target.reset();

        const greetingMsg = document.createElement('span');
        greetingMsg.textContent = `Welcome, ${email}`;
        document.getElementById('greetingUser').insertAdjacentElement('afterbegin', greetingMsg);

        ctx.setUserNav();
        ctx.page.redirect('/all-memes');
    }
}
