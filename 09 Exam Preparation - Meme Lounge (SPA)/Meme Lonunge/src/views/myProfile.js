import { html } from '../lib.js';
import { getUserMemes } from '../api/data.js';

const template = (memes, { username, email }) => html`
    <!-- Profile Page ( Only for logged users ) -->
    <section id="user-profile-page" class="user-profile">
        <article class="user-info">
            <img id="user-avatar-url" alt="user-profile" src="/images/female.png" />
            <div class="user-content">
                <p>Username: ${username}</p>
                <p>Email:${email}</p>
                <p>My memes count: ${memes.length}</p>
            </div>
        </article>
        <h1 id="user-listings-title">User Memes</h1>
        <div class="user-meme-listings">${memes.length ? memes.map(cardTemplate) : html`<p class="no-memes">No memes in database.</p>`}</div>
    </section>
`;

const cardTemplate = ({ title, imageUrl, _id }) => html`
    <div class="user-meme">
        <p class="user-meme-title">${title}</p>
        <img class="userProfileImage" alt="meme-img" src=${imageUrl} />
        <a class="button" href=${'/details/' + _id}>Details</a>
    </div>
`;

export default async function profilePage(ctx) {
    const auth = JSON.parse(sessionStorage.getItem('auth'));
    const myMemes = await getUserMemes(auth._id);
    ctx.render(template(myMemes, auth));
}
