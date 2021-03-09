(() => {
    getMessages();
    document.getElementById('refresh').addEventListener('click', getMessages);
    document.getElementById('send').addEventListener('click', sendMessage);
    setInterval(getMessages, 5000); // - constantly refreshing for new messages
})();

async function getMessages(event) {
    if (event) {
        // clearing inputs in case refresh comes from the button and is not done from line 5
        document.getElementById('author').value = '';
        document.getElementById('content').value = '';
    }

    const allMessages = document.getElementById('messages');
    allMessages.value = 'Loading messages...';
    const data = await request('http://localhost:3030/jsonstore/messenger');

    if (!data) {
        return (allMessages.value = 'Error occurred, please try again later!');
    }

    allMessages.value = Object.values(data)
        .map(({ author, content }) => `${author}: ${content}`)
        .join('\n');
}

async function sendMessage() {
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    if (author == '' || content == '') {
        return alert('All fields are required!');
    }

    const response = await request('http://localhost:3030/jsonstore/messenger', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, content }),
    });

    if (!response) {
        return;
    }

    document.getElementById('author').value = '';
    document.getElementById('content').value = '';
    getMessages();
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
