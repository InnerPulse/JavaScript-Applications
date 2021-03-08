(() => {
    getMessages();
    document.getElementById('refresh').addEventListener('click', getMessages);
    document.getElementById('send').addEventListener('click', sendMessage);
    setInterval(getMessages, 5000);
})();

async function getMessages() {
    const allMessages = document.getElementById('messages');
    allMessages.value = 'Loading messages...';

    try {
        const response = await fetch('http://localhost:3030/jsonstore/messenger');

        if (response.ok == false) {
            const error = await response.json();
            return alert(error.message);
        }

        const data = await response.json();
        allMessages.value = Object.values(data)
            .map(({ author, content }) => `${author}: ${content}`)
            .join('\n');
    } catch (error) {
        alert(error);
    }
}

async function sendMessage() {
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;

    try {
        const response = await fetch('http://localhost:3030/jsonstore/messenger', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, content }),
        });

        if (response.ok == false) {
            const error = await response.json();
            return alert(error.message);
        }
    } catch (error) {
        alert(error);
    }

    document.getElementById('author').value = '';
    document.getElementById('content').value = '';
    getMessages();
}
