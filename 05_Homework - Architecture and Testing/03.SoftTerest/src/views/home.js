export function setupHome(section, navigation) {
    section.querySelector('a').addEventListener('click', (ev) => {
        ev.preventDefault();
        navigation.goTo('dashboard');
    });

    return showHome;

    async function showHome() {
        return section;
    }
}
