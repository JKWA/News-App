import {browser, by, element, ExpectedConditions as EC} from 'protractor';
import {type, go, see, slow, click, under, leftOf, below, rightOf} from 'blue-harvest';

// async function waitForEnabled(label) {
//   await browser.wait(EC.elementToBeClickable(element(by.buttonText(label))));
// }

describe('News section page', () => {
  beforeEach(async() => {
    await go('/news-section');
  });

  it('should news section toogle save to local storage', async() => {
    await click('Sports');
    await click('Business');
    await click('Entertainment');
    await click('General');
    await click('Health');
    await click('Science');
    await click('Sports');
    await click('Technology');
    await click('Technology');
    await click('Business');
    await click('Entertainment');
    const savedSelectedNewsSections = browser.executeScript('return window.localStorage.getItem("newsSections");');
    expect(savedSelectedNewsSections).toEqual('health,technology');
  });

  it('should remember sections on reload', async() => {

     await expect(element(by.id('business')).getAttribute('ng-reflect-checked')).toBe('false');
     await expect(element(by.id('entertainment')).getAttribute('ng-reflect-checked')).toBe('false');
     await expect(element(by.id('general')).getAttribute('ng-reflect-checked')).toBe('false');
     await expect(element(by.id('health')).getAttribute('ng-reflect-checked')).toBe('true');
     await expect(element(by.id('science')).getAttribute('ng-reflect-checked')).toBe('false');
     await expect(element(by.id('sports')).getAttribute('ng-reflect-checked')).toBe('false');
     await expect(element(by.id('technology')).getAttribute('ng-reflect-checked')).toBe('true');

  });

  afterAll(async () => {
    await browser.executeScript('return window.localStorage.clear();');
    await browser.sleep(2000);
  });
});

