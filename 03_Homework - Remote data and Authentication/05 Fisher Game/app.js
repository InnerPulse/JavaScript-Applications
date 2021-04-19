(() => {
    document.getElementById('loadBtn').addEventListener('click', loadAllCatches);
    const addBtn = document.getElementById('addCatchBtn');
    const logged = document.getElementById('logged');
    const guest = document.getElementById('guest');
    addBtn.addEventListener('click', addCatch);

    document.getElementById('logged').addEventListener('click', () => {
        sessionStorage.removeItem('id');
        sessionStorage.removeItem('token');
    });

    if (sessionStorage.getItem('token') == null) {
        addBtn.disabled = true;
        logged.style.display = 'none';
        guest.style.display = 'inline-block';
        loadAllCatches();
    } else {
        addBtn.disabled = false;
        guest.style.display = 'none';
        logged.style.display = 'inline-block';
        loadAllCatches();
    }

    loadAllCatches();
})();

async function loadAllCatches() {
    const displayCatches = document.getElementById('catches');
    displayCatches.innerHTML = '';
    displayCatches.textContent = 'Loading...';
    const catches = await request('http://localhost:3030/data/catches');
    displayCatches.innerHTML = '';
    catches.map(buildCatch).forEach((c) => {
        if (c.getAttribute('_ownerId') === sessionStorage.getItem('id')) {
            c.querySelector('.update').disabled = false;
            c.querySelector('.delete').disabled = false;
        }
        displayCatches.append(c);
    });
}

async function addCatch(event) {
    event.preventDefault();

    const inputs = event.target.parentNode.querySelectorAll('input');
    const values = [...inputs].map((el) => el.value);
    const [angler, weight, species, location, bait, capture] = values;

    if (values.map(Boolean).includes(false)) {
        return alert('All fields are required!');
    }

    inputs.forEach((i) => (i.value = ''));

    const newCatch = { angler, weight: Number(weight), species, location, bait, captureTime: Number(capture) };
    await request('http://localhost:3030/data/catches', {
        method: 'post',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': `${sessionStorage.getItem('token')}` },
        body: JSON.stringify(newCatch),
    });

    return loadAllCatches();
}

async function updateCatch(event) {
    const token = sessionStorage.getItem('token');
    const catchId = event.target.parentNode.getAttribute('_id');
    const [angler, weight, species, location, bait, capture] = [
        ...event.target.parentNode.querySelectorAll('input'),
    ].map((el) => el.value);

    await request('http://localhost:3030/data/catches/' + catchId, {
        method: 'put',
        headers: { 'Content-Type': 'application/json', 'X-Authorization': token },
        body: JSON.stringify({
            angler,
            weight: Number(weight),
            species,
            location,
            bait,
            captureTime: Number(capture),
        }),
    });

    return loadAllCatches();
}

async function deleteCatch(event) {
    const token = sessionStorage.getItem('token');
    const catchId = event.target.parentNode.getAttribute('_id');
    const confirmed = confirm('Are you sure you want to delete this catch?');

    if (confirmed) {
        await request('http://localhost:3030/data/catches/' + catchId, {
            method: 'delete',
            headers: { 'X-Authorization': token },
        });
        loadAllCatches();
    }
    return;
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

function buildCatch({ _id, _ownerId, angler, bait, captureTime, location, species, weight }) {
    const wrapper = buildElements('div', null, 'catch', { _id, _ownerId });

    const anglerLabel = buildElements('label', 'Angler');
    const anglerInput = buildElements('input', null, 'angler', { type: 'text', value: angler });
    const hrElement1 = buildElements('hr');

    const weightLabel = buildElements('label', 'Weight');
    const weightInput = buildElements('input', null, 'weight', { type: 'number', value: weight });
    const hrElement2 = buildElements('hr');

    const speciesLabel = buildElements('label', 'Species');
    const speciesInput = buildElements('input', null, 'species', { type: 'text', value: species });
    const hrElement3 = buildElements('hr');

    const locationLabel = buildElements('label', 'Location');
    const locationInput = buildElements('input', null, 'location', { type: 'text', value: location });
    const hrElement4 = buildElements('hr');

    const baitLabel = buildElements('label', 'Bait');
    const baitInput = buildElements('input', null, 'bait', { type: 'text', value: bait });
    const hrElement5 = buildElements('hr');

    const captureLabel = buildElements('label', 'capture time');
    const captureInput = buildElements('input', null, 'captureTime', { type: 'number', value: captureTime });
    const hrElement6 = buildElements('hr');

    const updateBtn = buildElements('button', 'UPDATE', 'update', { disabled: '' });
    const deleteBtn = buildElements('button', 'DELETE', 'delete', { disabled: '' });

    wrapper.append(
        anglerLabel,
        anglerInput,
        hrElement1,
        weightLabel,
        weightInput,
        hrElement2,
        speciesLabel,
        speciesInput,
        hrElement3,
        locationLabel,
        locationInput,
        hrElement4,
        baitLabel,
        baitInput,
        hrElement5,
        captureLabel,
        captureInput,
        hrElement6,
        updateBtn,
        deleteBtn
    );

    return wrapper;
}

function buildElements(type, txt, className, attributes) {
    const element = document.createElement(type);
    if (txt) {
        element.textContent = txt;
        if (txt == 'UPDATE' || txt == 'DELETE') {
            element.addEventListener('click', txt == 'UPDATE' ? updateCatch : deleteCatch);
        }
    }
    if (className) {
        element.className = className;
    }
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    }
    return element;
}
