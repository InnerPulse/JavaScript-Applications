import * as api from './api.js';

const host = 'http://localhost:3030';
api.settings.host = host;

export const login = api.login;
export const logout = api.logout;
export const register = api.register;

// Team collection

export async function getTeamById(id) {
    return await api.get(host + '/data/teams/' + id);
}

export async function deleteTeam(id) {
    return await api.del(host + '/data/teams/' + id);
}

export async function joinRequest(teamId) {
    const body = { teamId };
    return await api.post(host + '/data/members', body);
}
export async function editTeam(id, team) {
    return await api.put(host + '/data/teams/' + id, team);
}

export async function createTeam(team) {
    const result = await api.post(host + '/data/teams', team);
    const request = await joinRequest(result._id);
    await approveMembership(request);

    return result;
}

export async function getTeams() {
    const teams = await api.get(host + '/data/teams');
    const members = await getMembers(teams.map((t) => t._id));
    teams.forEach((t) => (t.memberCount = members.filter((m) => m.teamId === t._id).length));
    return teams;
}

export async function getMyTeams() {
    const userId = JSON.parse(sessionStorage.getItem('auth'))._id;
    const teamMembership = await api.get(
        host + `/data/members?where=_ownerId%3D%22${userId}%22%20AND%20status%3D%22member%22&load=team%3DteamId%3Ateams`
    );
    const teams = teamMembership.map((r) => r.team);
    const members = await getMembers(teams.map((t) => t._id));
    teams.forEach((t) => (t.memberCount = members.filter((m) => m.teamId == t._id).length));
    return teams;
}

// Members collection

export async function approveMembership(request) {
    const body = {
        teamId: request.teamId,
        status: 'member',
    };
    return await api.put(host + '/data/members/' + request._id, body);
}

export async function cancelMembership(membershipId) {
    return await api.del(host + '/data/members/' + membershipId);
}

export async function getMembers(IDs) {
    const query = encodeURIComponent(`teamId IN ("${IDs.join('", "')}") AND status="member"`);
    return await api.get(host + '/data/members?where=' + query);
}

export async function getRequestsByTeamId(id) {
    return await api.get(host + `/data/members?where=teamId%3D%22${id}%22&load=user%3D_ownerId%3Ausers`);
}
