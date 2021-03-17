async function getInfo() {
    const input = document.getElementById('stopId');
    const url = 'http://localhost:3030/jsonstore/bus/businfo/';

    // valid IDs - 1287, 1308, 1327 and 2334

    try {
        const ulElement = document.getElementById('buses');
        ulElement.innerHTML = '';
        const id = input.value;

        const response = await fetch(url + id);
        const data = await response.json();

        document.getElementById('stopName').textContent = data.name;

        Object.entries(data.buses).map(([bus, time]) => {
            const result = document.createElement('li');
            result.textContent = `Bus ${bus} arrives in ${time} minutes`;

            ulElement.append(result);
        });

        input.value = '';
    } catch (error) {
        document.getElementById('buses').innerHTML = '';
        document.getElementById('stopName').textContent = 'Error';
    }
}