import { html } from '../lib.js';
import { register } from '../api/data.js';
import { notify } from '../notification.js';

const template = (onSubmit) => html`
    <!-- Register Page ( Only for guest users ) -->
    <section id="register">
        <form @submit=${onSubmit} id="register-form">
            <div class="container">
                <h1>Register</h1>
                <label for="username">Username</label>
                <input id="username" type="text" placeholder="Enter Username" name="username" />
                <label for="email">Email</label>
                <input id="email" type="text" placeholder="Enter Email" name="email" />
                <label for="password">Password</label>
                <input id="password" type="password" placeholder="Enter Password" name="password" />
                <label for="repeatPass">Repeat Password</label>
                <input id="repeatPass" type="password" placeholder="Repeat Password" name="repeatPass" />
                <div class="gender">
                    <input type="radio" name="gender" id="female" value="female" />
                    <label for="female">Female</label>
                    <input type="radio" name="gender" id="male" value="male" checked />
                    <label for="male">Male</label>
                </div>
                <input type="submit" class="registerbtn button" value="Register" />
                <div class="container signin">
                    <p>Already have an account?<a href="/login">Sign in</a>.</p>
                </div>
            </div>
        </form>
    </section>
`;

export default function registerPage(ctx) {
    ctx.render(template(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const gender = formData.get('gender');
        const [email, username] = [formData.get('email').trim(), formData.get('username').trim()];
        const [password, repeatPass] = [formData.get('password').trim(), formData.get('repeatPass').trim()];

        if (email === '' || password === '' || gender === '') {
            return notify('All fields are required!');
        }

        if (password !== repeatPass) {
            return notify("Passwords don't match!");
        }

        await register(username, email, password, gender);
        e.target.reset();

        const greetingMsg = document.createElement('span');
        greetingMsg.textContent = `Welcome, ${email}`;
        document.getElementById('greetingUser').insertAdjacentElement('afterbegin', greetingMsg);

        ctx.setUserNav();
        ctx.page.redirect('/all-memes');
    }
}
