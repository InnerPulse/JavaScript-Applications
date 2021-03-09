(() => {
    loadContacts();
    document.getElementById('btnLoad').addEventListener('click', loadContacts);
    document.getElementById('btnCreate').addEventListener('click', createContact);
})();

async function loadContacts() {
    const phonebook = document.getElementById('phonebook');
    phonebook.innerHTML = '';
    const data = await request('http://localhost:3030/jsonstore/phonebook');

    if (!data) {
        return;
    }

    Object.values(data)
        .map(build)
        .forEach((c) => phonebook.append(c));
}

async function createContact() {
    const person = document.getElementById('person').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (person && phone) {
        const response = request('http://localhost:3030/jsonstore/phonebook', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ person, phone }),
        });

        if (!response) {
            return;
        }

        document.getElementById('person').value = '';
        document.getElementById('phone').value = '';
        loadContacts();
    } else {
        return alert('All fields are required!');
    }
}

async function deleteContact(event) {
    const id = event.target.parentNode.id;
    const response = await request(`http://localhost:3030/jsonstore/phonebook/${id}`, {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response) {
        return;
    }

    event.target.parentNode.remove();
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

function build({ person, phone, _id }) {
    const contact = document.createElement('li');
    contact.setAttribute('id', _id);
    contact.textContent = `${person}: ${phone}`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', deleteContact);
    contact.append(delBtn);

    return contact;
}
