import {browser, by, element, ExpectedConditions as EC} from 'protractor';
import {type, go, see, slow, click, under, leftOf, below, rightOf} from 'blue-harvest';

// async function waitForEnabled(label) {
//   await browser.wait(EC.elementToBeClickable(element(by.buttonText(label))));
// }

describe('Filter page', () => {
  beforeEach(async() => {
    await go('/filter');
  });

  it('should add filter', async() => {
    await click('Filter');
    await type('Alderaan');
    await click('Add');
    const savedFilters = browser.executeScript('return window.localStorage.getItem("filters");');
    expect(savedFilters).toEqual('trump,sanders,alderaan');

  });

  it('should remove filter', async() => {
    await slow.see('ALDERAAN');
    await rightOf('ALDERAAN').click('Delete');
    const savedFilters = browser.executeScript('return window.localStorage.getItem("filters");');
    expect(savedFilters).toEqual('trump,sanders');
  });

  afterAll(async () => {
    await browser.executeScript('return window.localStorage.clear();');
    await browser.sleep(2000);
  });
});

