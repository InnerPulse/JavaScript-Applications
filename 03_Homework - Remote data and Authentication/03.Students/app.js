(() => {
    getAllStudents();
    document.getElementById('submit').addEventListener('click', addStudent);
})();

async function getAllStudents() {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
    const data = await request('http://localhost:3030/jsonstore/collections/students');

    if (!data) {
        return;
    }

    Object.values(data)
        .map(createStudent)
        .forEach((s) => tableBody.append(s));
}

function createStudent({ facultyNumber, firstName, grade, lastName }) {
    const tr = document.createElement('tr');
    const tdFirstName = document.createElement('th');
    tdFirstName.textContent = firstName;
    const tdLastName = document.createElement('th');
    tdLastName.textContent = lastName;
    const tdFacNumber = document.createElement('th');
    tdFacNumber.textContent = facultyNumber;
    const tdGrade = document.createElement('th');
    tdGrade.textContent = grade;

    tr.append(tdFirstName, tdLastName, tdFacNumber, tdGrade);
    return tr;
}

async function addStudent(event) {
    event.preventDefault();
    const form = [...document.querySelectorAll('.inputs > input')];
    const values = form.map((e) => e.value);

    if (values.map(Boolean).includes(false)) {
        return alert('All fields are required!');
    }

    form.map((input) => (input.value = ''));
    const [firstName, lastName, facultyNumber, grade] = values;

    if (isNaN(grade) || isNaN(facultyNumber)) {
       return alert('Grade and Faculty Number must be Number');
    }

    const response = await request('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: { 'Content-Type': 'Application/json' },
        body: JSON.stringify({ firstName, lastName, facultyNumber, grade }),
    });

    if (!response) {
        return;
    }

    return getAllStudents();
}

async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok == false) {
            const error = await response.json();
            alert(error.message);
            throw new Error(error.message);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
        throw new Error(error);
    }
}
