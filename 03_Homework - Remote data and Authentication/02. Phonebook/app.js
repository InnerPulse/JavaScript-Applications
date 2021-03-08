(() => {
    loadContacts();
    document.getElementById('btnLoad').addEventListener('click', loadContacts);
    document.getElementById('btnCreate').addEventListener('click', createContact);
})();

async function loadContacts() {
    const phonebook = document.getElementById('phonebook');
    phonebook.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3030/jsonstore/phonebook');

        if (response.ok == false) {
            const error = await response.json();
            return alert(error.message);
        }

        const data = await response.json();

        Object.values(data)
            .map(build)
            .forEach((c) => phonebook.append(c));
    } catch (error) {
        alert(error);
    }
}

async function createContact() {
    const person = document.getElementById('person').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (person && phone) {
        try {
            const response = await fetch('http://localhost:3030/jsonstore/phonebook', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ person, phone }),
            });

            if (response.ok == false) {
                const error = await response.json();
                return alert(error.message);
            }

            document.getElementById('person').value = '';
            document.getElementById('phone').value = '';
            loadContacts();
        } catch (error) {
            alert(error);
        }
    } else {
        return alert('All fields are required!');
    }
}

async function deleteContact(event) {
    const id = event.target.parentNode.id;

    try {
        const response = await fetch(`http://localhost:3030/jsonstore/phonebook/${id}`, {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok == false) {
            const error = await response.json();
            return alert(error.message);
        }

        loadContacts();
    } catch (error) {
        alert(error);
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
