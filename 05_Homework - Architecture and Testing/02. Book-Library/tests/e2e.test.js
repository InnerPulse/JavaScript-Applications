const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const host = 'http://localhost:3000';

let browser;
let context;
let page;

// The current tests are running using the actual server and data in it, and the tests itself
// will modified the data  until the server is restarted, so keep that in mind!

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => {
        // browser = await chromium.launch({ headless: false, slowMo: 500 });
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(host);
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    describe('Home', () => {
        it('load all books', async () => {
            await page.click('#loadBooks');
            await page.waitForSelector('tbody tr td');

            const firstBookTitle = await page.$eval('tbody tr:first-child :first-child', (el) => el.textContent.trim());
            const firstBookAuthor = await page.$eval('tbody tr:first-child :nth-child(2)', (el) => el.textContent.trim());

            const secondBookTitle = await page.$eval('tbody :nth-child(2) :first-child', (el) => el.textContent.trim());
            const secondBookAuthor = await page.$eval('tbody :nth-child(2) :nth-child(2)', (el) => el.textContent.trim());

            expect(firstBookTitle).to.eql('Harry Potter and the Philosopher\'s Stone')
            expect(firstBookAuthor).to.eql('J.K.Rowling')
            expect(secondBookTitle).to.eql('C# Fundamentals')
            expect(secondBookAuthor).to.eql('Svetlin Nakov')

        });
        
        it('create book', async () => {
            await page.fill('#createForm [name="title"]', 'AAA');
            await page.fill('#createForm [name="author"]', '111');
            await page.click('text=Submit');
            await page.click('#loadBooks');
            await page.waitForSelector('tbody tr td');

            const newBookTitle = await page.$eval('tbody tr:last-child :first-child', (el) => el.textContent.trim());
            const newBookAuthor = await page.$eval('tbody tr:last-child :nth-child(2)', (el) => el.textContent.trim());

            expect(newBookTitle).to.eql('AAA');
            expect(newBookAuthor).to.eql('111');
        });

        it('edit book', async () => {
            await page.click('#loadBooks');
            await page.waitForSelector('.editBtn');

            await page.click('tbody tr:last-child .editBtn');
            await page.waitForSelector('#editForm');

            await page.evaluate(() => document.getElementById('editForm').reset());

            await page.fill('#editForm [name="title"]', 'BBB');
            await page.fill('#editForm [name="author"]', '222');
            await page.click('text=Save');
            await page.click('#loadBooks');
            await page.waitForSelector('tbody tr td');

            const editedBookTitle = await page.$eval('tbody tr:last-child :first-child', (el) => el.textContent.trim());
            const editedBookAuthor = await page.$eval('tbody tr:last-child :nth-child(2)', (el) => el.textContent.trim());

            expect(editedBookTitle).to.eql('BBB');
            expect(editedBookAuthor).to.eql('222');
        });

        it('delete book', async () => {
            await page.click('#loadBooks');

            page.on('dialog', (dialog) => {
                dialog.accept();
            });

            await page.click('tbody tr:last-child .deleteBtn');
            await page.click('#loadBooks');
            await page.waitForSelector('tbody tr td');

            const firstBook = await page.$eval('tbody tr:last-child :first-child', (el) => el.textContent.trim());
            const firstBookAuthor = await page.$eval('tbody tr:last-child :nth-child(2)', (el) => el.textContent.trim());

            expect(firstBook).to.eql('C# Fundamentals');
            expect(firstBookAuthor).to.eql('Svetlin Nakov');
        });

    });
});
