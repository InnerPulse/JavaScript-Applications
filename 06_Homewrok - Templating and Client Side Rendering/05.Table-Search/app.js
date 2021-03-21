import { html, render } from '../node_modules/lit-html/lit-html.js';

const tableRowTemplate = (student, match) => html`
    <tr class=${match ? 'select' : ''}>
        <td>${student.firstName} ${student.lastName}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
    </tr>
`;

const tbody = document.querySelector('table tbody');
const input = document.getElementById('searchField');
const endpoint = 'http://localhost:3030/jsonstore/advanced/table';

const initialize = async () => {
    input.addEventListener('input', () => update(list, input.value));

    const studentsData = await (await fetch(endpoint)).json();
    const list = Object.values(studentsData);

    update(list);
};

initialize();

const update = (list, match = '') => {
    const result = list.map((e) => tableRowTemplate(e, compare(e, match)));
    render(result, tbody);
};

function compare(item, match) {
    return Object.values(item).some((v) => match && v.toLowerCase().includes(match.toLowerCase()));
}
