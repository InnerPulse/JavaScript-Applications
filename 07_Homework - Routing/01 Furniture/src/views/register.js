import { register } from '../api/data.js';
import { html } from '../../node_modules/lit-html/lit-html.js';
import { styleMap } from '../../node_modules/lit-html/directives/style-map.js';

const registerTemplate = (onSubmit, errMsg, invalidEmail, invalidPass, invalidRePass) => html`
    <div class="row space-top">
        <div class="col-md-12">
            <h1>Register New User</h1>
            <p>Please fill all fields.</p>
        </div>
    </div>
    <form @submit=${onSubmit}>
        <div class="row space-top">
            <div class="col-md-4">
                ${errMsg
                    ? html`<div class="form-group">
                          <p style=${styleMap({ color: errMsg ? 'red' : '' })}>${errMsg}</p>
                      </div>`
                    : ''}
                <div class="form-group">
                    <label class="form-control-label" for="email">Email</label>
                    <input
                        class=${'form-control' + (invalidEmail ? ' is-invalid' : '')}
                        id="email"
                        type="text"
                        name="email"
                    />
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="password">Password</label>
                    <input
                        id="password"
                        class=${'form-control' + (invalidPass ? ' is-invalid' : '')}
                        type="password"
                        name="password"
                    />
                </div>
                <div class="form-group">
                    <label class="form-control-label" for="rePass">Repeat</label>
                    <input
                        class=${'form-control' + (invalidRePass ? ' is-invalid' : '')}
                        id="rePass"
                        type="password"
                        name="rePass"
                    />
                </div>
                <input type="submit" class="btn btn-primary" value="Register" />
            </div>
        </div>
    </form>
`;

export async function registerPage(ctx) {
    ctx.render(registerTemplate(onSubmit));

    async function onSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email').trim();
        const password = formData.get('password').trim();
        const rePass = formData.get('rePass').trim();

        if (!email || !password || !rePass) {
            return ctx.render(registerTemplate(onSubmit, 'All fields are required!', !email, !password, !rePass));
        }

        if (password !== rePass) {
            return ctx.render(registerTemplate(onSubmit, "Passwords don't match!", false, true, true));
        }

        await register(email, password);

        e.target.reset();
        ctx.setUserNav();
        ctx.page.redirect('/');
    }
}
