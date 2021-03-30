export const notify = (msg) => {
    const section = document.createElement('section');
    const span = document.createElement('span');
    const div = document.createElement('div');
    section.setAttribute('id', 'notifications');
    div.setAttribute('class', 'notification');
    div.setAttribute('id', 'errorBox');
    span.textContent = msg;

    div.append(span);
    section.append(div);

    document.getElementById('container').insertAdjacentElement('afterbegin', section);

    let lock = false;
    div.style.display = 'block';
    div.addEventListener('click', () => section.remove());

    setTimeout(() => {
        if (lock) {
            return;
        }
        section.remove();
        lock = true;
    }, 3000);
};
