export const notify = (msg) => {
    const box = document.getElementById('errorBox');
    box.innerHTML = `<span>${msg}</span>`;

    let lock = false;
    box.style.display = 'block';
    box.addEventListener('click', () => {
        box.style.display = 'none';
        lock = true;
    });

    setTimeout(() => {
        if (lock) {
            return;
        }
        box.style.display = 'none';
        lock = true;
    }, 3000);
};
