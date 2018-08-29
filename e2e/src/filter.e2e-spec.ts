import {browser, by, element, ExpectedConditions as EC} from 'protractor';
import {type, go, see, slow, click, under, leftOf, below, rightOf} from 'blue-harvest';

async function waitForEnabled(label) {
  await browser.wait(EC.elementToBeClickable(element(by.buttonText(label))));
}

describe('Filter form', () => {
  beforeEach(async() => {
    await go('/filter');
  });

  it('should add add filter', async() => {
    await click('Filter');
    await type('Alderaan');
    await click('Add');
    await slow.see('ALDERAAN');
    await rightOf('ALDERAAN').click('Delete');

    await click('Filter');
    await type('test');
  });

  afterAll(async () => {
    await browser.sleep(5000);
  });
});
