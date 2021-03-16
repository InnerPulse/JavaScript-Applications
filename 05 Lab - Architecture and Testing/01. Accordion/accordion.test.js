const { expect } = require('chai');
const { chromium } = require('playwright-chromium');

let browser, page; // Declare reusable variables

describe('E2E tests', function () {
    this.timeout(6000);
    before(async () => {
        // browser = await chromium.launch({ headless: false, slowMo: 500 }); // visualizing the actions
        browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('loads static page and checks if all topics are present', async () => {
        await page.goto('http://localhost:3000');

        const titles = await page.$$eval('.accordion .head span', (spans) => spans.map((s) => s.textContent)); // css selectors
        expect(titles).includes('Scalable Vector Graphics');
        expect(titles).includes('Unix');
        expect(titles).includes('Open standard');
        expect(titles).includes('ALGOL');
    });

    it('checks for correct positioning of the first topic', async () => {
        await page.goto('http://localhost:3000');

        const firstTopicContent = await page.textContent('.accordion .head span');
        expect(firstTopicContent).to.contains('Scalable Vector Graphics');
    });

    it('checks if card toggles content', async () => {
        await page.goto('http://localhost:3000');

        await page.click('#main .accordion:first-child >> text=More'); // css selectors + playwright selector
        await page.waitForSelector('#main .accordion:first-child >> .extra p');

        const visible = await page.isVisible('#main .accordion:first-child >> .extra p');
        expect(visible).to.be.true;
    });

    it('checks if card hides content', async () => {
        await page.goto('http://localhost:3000');

        await page.click('#main .accordion:first-child >> text=More');
        await page.waitForSelector('#main .accordion:first-child >> .extra p');
        await page.click('#main .accordion:first-child >> text=Less');

        const visible = await page.isVisible('#main .accordion:first-child >> .extra p');
        expect(visible).to.be.false;
    });
});
