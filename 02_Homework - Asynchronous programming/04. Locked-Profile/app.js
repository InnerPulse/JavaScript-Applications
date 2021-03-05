function lockedProfile() {
    getUsers();
}

async function getUsers() {
    try {
        const main = document.getElementById('main');
        const url = 'http://localhost:3030/jsonstore/advanced/profiles';
        const response = await fetch(url);
        const allUsers = await response.json();

        Object.values(allUsers)
            .map(createProfileCard)
            .forEach((user) => main.append(user));
    } catch (error) {
        alert(error);
    }
}

function createProfileCard({ age, email, username, _id }) {
    const profileWrapper = e('div', null, 'profile');
    const img = e('img', null, 'userIcon', { src: './iconProfile2.png' });

    const labelLock = e('label', 'Lock');
    const inputLock = e('input', null, null, {
        type: 'radio',
        name: _id,
        value: 'lock',
        checked: true,
    });

    const labelUnlock = e('label', 'Unlock');
    const inputUnlock = e('input', null, null, {
        type: 'radio',
        name: _id,
        value: 'unlock',
    });

    const br = e('br');
    const hr1 = e('hr');
    const labelUser = e('label', 'Username');
    const inputReadOnly = e('input', null, null, {
        type: 'text',
        name: `user1Username`,
        value: username,
        disabled: true,
        readonly: true,
    });
    const divId = e('div', null, null, { id: `user1HiddenFields` });

    const hr2 = e('hr');
    const labelEmail = e('label', 'Email:');
    const inputEmail = e('input', null, null, {
        type: 'text',
        name: 'user1Email',
        value: email,
        disabled: true,
        readonly: true,
    });
    const labelAge = e('label', 'Age:');
    const inputAge = e('input', null, null, {
        type: 'text',
        name: 'user1Age',
        value: age,
        disabled: true,
        readonly: true,
    });
    const showBtn = e('button', 'Show more');
    showBtn.addEventListener('click', () => {
        if (inputLock.checked) {
            return;
        }

        divId.style.display = showBtn.textContent === 'Hide it' ? 'none' : 'block';
        showBtn.textContent = showBtn.textContent === 'Show more' ? 'Hide it' : 'Show more';
    });

    build(profileWrapper, img, labelLock, inputLock, labelUnlock, inputUnlock, br, hr1, labelUser, inputReadOnly);
    build(divId, hr2, labelEmail, inputEmail, labelAge, inputAge);

    return build(profileWrapper, divId, showBtn);

    function e(type, txt, className, attributes) {
        const e = document.createElement(type);

        if (txt) {
            e.textContent = txt;
        }
        if (className) {
            e.className = className;
        }
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                e.setAttribute(key, value == true ? '' : value);
            });
        }

        return e;
    }
}

function build(main, ...rest) {
    while (rest.length) {
        main.append(rest.shift());
    }
    return main;
}
