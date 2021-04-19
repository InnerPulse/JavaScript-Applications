export default async function setupView(event) {
    if (event == undefined) {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('commentsPage').style.display = 'flex';
        return;
    }

    document.getElementById('homePage').style.display = 'flex';
    document.getElementById('commentsPage').style.display = 'none';
}
