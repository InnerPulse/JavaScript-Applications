(() => {
    document.getElementById('loginForm').addEventListener('submit', login);
    document.getElementById('registerForm').addEventListener('submit', register);
})();

async function login(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const user = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    if (!user.email || !user.password) {
        alert('All fields are required!');
        throw new Error('All fields are required!');
    }

    event.target.reset();

    const data = await request('http://localhost:3030/users/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    sessionStorage.setItem('id', data._id);
    sessionStorage.setItem('token', data.accessToken);
    window.location.pathname = 'index.html';
}

async function register(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPass = formData.get('rePass');

    if (!email) {
        alert('Email is required!');
        return;
    }

    if (!password) {
        alert('Password is missing!');
        return;
    }

    if (password !== repeatPass) {
        alert("Passwords don't match!");
        return;
    }

    const data = await request('http://localhost:3030/users/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    sessionStorage.setItem('token', data.accessToken);
    sessionStorage.setItem('id', data._id);
    window.location.pathname = 'index.html';
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
