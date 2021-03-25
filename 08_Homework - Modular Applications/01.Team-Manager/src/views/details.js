import { loaderTemplate } from './common/loader.js';
import { html } from '../../node_modules/lit-html/lit-html.js';
import { until } from '../../node_modules/lit-html/directives/until.js';
import { getTeamById, joinRequest, getRequestsByTeamId, cancelMembership, approveMembership } from '../api/data.js';

const detailsTemplate = ({ logoUrl, name, description, memberCount }, createControls, pending, members, isOwner) => html`
    <section id="team-home">
        <article class="layout">
            <img src=${logoUrl} class="team-logo left-col" />
            <div class="tm-preview">
                <h2>${name}</h2>
                <p>${description}</p>
                <span class="details">${memberCount} ${memberCount > 1 ? ' Members' : ' Member'}</span>
                <div>${createControls()}</div>
            </div>

            <div class="pad-large">
                <h3>Members</h3>
                <ul class="tm-members">
                    ${members.map((m) => membersTemplate(m, isOwner))}
                </ul>
            </div>

            ${isOwner
                ? html`
                      <div class="pad-large">
                          <h3>Membership Requests</h3>
                          <ul class="tm-members">
                              ${pending.map(pendingMemberTemplate)}
                          </ul>
                      </div>
                  `
                : null}
        </article>
    </section>
`;

const membersTemplate = (request, isOwner) => html`
    <li>
        ${request.user.username}
        ${isOwner ? html`<a @click=${request.decline} href="javascript:void(0)" class="tm-control action">Remove from team</a>` : null}
    </li>
`;

const pendingMemberTemplate = (request) =>
    html`
        <li>
            ${request.user.username}
            <a @click=${request.approve} href="javascript:void(0)" class="tm-control action">Approve</a>
            <a @click=${request.decline} href="javascript:void(0)" class="tm-control action">Decline</a>
        </li>
    `;

export default async function detailsPage(ctx) {
    const teamId = ctx.params.id;
    ctx.render(until(populateTemplate(teamId), loaderTemplate()));

    async function populateTemplate(teamId) {
        const auth = sessionStorage.getItem('auth');
        const [team, requests] = await Promise.all([getTeamById(teamId), getRequestsByTeamId(teamId)]);
        const isOwner = auth && JSON.parse(auth)._id === team._ownerId;
        const members = requests.filter((r) => r.status === 'member');
        const pending = requests.filter((r) => r.status === 'pending');
        team.memberCount = members.length;

        requests.forEach((r) => {
            r.approve = (e) => approve(e, r);
            r.decline = (e) => leave(e, r._id);
        });

        return detailsTemplate(team, createControls, pending, members, isOwner);

        function createControls() {
            if (auth) {
                const request = requests.find((r) => r._ownerId === JSON.parse(auth)._id);

                if (isOwner) {
                    // Current user is owner
                    return html` <a href=${'/edit/' + teamId} class="action">Edit team</a>`;
                } else if (request && request.status === 'member') {
                    // Current user is a member
                    return html`<a @click=${(e) => leave(e, request._id)} href="javascript:void(0)" class="action invert">Leave team</a>`;
                } else if (request && request.status === 'pending') {
                    // Current user has a pending request
                    return html`Membership pending. <a @click=${(e) => leave(e, request._id)} href="javascript:void(0)">Cancel request</a>`;
                } else {
                    // Current user is not related to the team
                    return html`<a @click=${join} href="javascript:void(0)" class="action">Join team</a>`;
                }
            } else {
                // Guest visitor
                return null;
            }
        }

        async function join(e) {
            e.target.remove();
            await joinRequest(teamId);
            // No need of 'until' because I want to render only what's changed on the page
            ctx.render(await populateTemplate(teamId));
        }

        async function leave(e, id) {
            const confirmed = confirm('Are you sure you want to leave?');
            if (confirmed) {
                e.target.remove();
                await cancelMembership(id);
                ctx.render(await populateTemplate(teamId));
            }
        }

        async function approve(e, request) {
            e.target.remove();
            await approveMembership(request);
            ctx.render(await populateTemplate(teamId));
        }
    }
}
