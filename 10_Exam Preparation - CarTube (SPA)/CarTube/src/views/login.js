import { html } from '../lib.js';
import { login } from '../api/data.js';
import { welcomeMsg } from './common/welcomeMsg.js';

const template = (onSubmit) => html`
    <!-- Login Page -->
    <section id="login">
        <div class="container">
            <form @submit=${onSubmit} id="login-form" action="#" method="post">
                <h1>Login</h1>
                <br />
                <p>Please enter your credentials.</p>
                <hr />

                <p>Username</p>
                <input placeholder="Enter Username" name="username" type="text" required />

                <p>Password</p>
                <input type="password" placeholder="Enter Password" name="password" required />
                <input type="submit" class="registerbtn" value="Login" />
            </form>
            <div class="signin">
                <p>Dont have an account? <a href="/register">Sign up</a>.</p>
            </div>
        </div>
    </section>
`;

export default async function loginPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const [username, password] = [formData.get('username').trim(), formData.get('password').trim()];

        if (username === '' || password === '') {
            return alert('All fields are required!');
        }

        await login(username, password);
        welcomeMsg(username);F
        ctx.setUserNav();
        ctx.page.redirect('/catalog');
    }
}
