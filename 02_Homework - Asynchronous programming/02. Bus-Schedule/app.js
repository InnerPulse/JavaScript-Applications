function solve() {
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const banner = document.querySelector('#info > span');

    departBtn.disabled = false;
    arriveBtn.disabled = true;

    let stop = {
        next: 'depot',
    };

    async function depart() {
        try {
            const url = `http://localhost:3030/jsonstore/bus/schedule/` + stop.next;
            const response = await fetch(url);
            const data = await response.json();

            stop = data;
            banner.textContent = `Next stop ${stop.name}`;

            departBtn.disabled = true;
            arriveBtn.disabled = false;
        } catch (error) {
            alert(error);
        }
    }

    function arrive() {
        banner.textContent = `Arriving at ${stop.name}`;

        departBtn.disabled = false;
        arriveBtn.disabled = true;
    }

    return {
        depart,
        arrive,
    };
}

const result = solve();
