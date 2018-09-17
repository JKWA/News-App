import {browser, by, element, ExpectedConditions as EC} from 'protractor';
import {type, go, see, slow, click, under, leftOf, below, rightOf} from 'blue-harvest';

describe('News page', () => {
  beforeEach(async() => {
    await go('/news');
  });

  it('tab bar click should show tab and save value to local storage', async() => {
    // await slow.see('Science');
    await click('Science');
    await click('Technology');
    await expect(element(by.id('mat-tab-label-0-2')).getAttribute('aria-selected')).toBe('true');
    const savedCurrentlyViewedSections = browser.executeScript('return window.localStorage.getItem("currentlyViewingNewsSection");');
    expect(savedCurrentlyViewedSections).toEqual('technology');
  });

  // it('reload should show tab from last saved value', async() => {
  //   // why isn't this working?
  //   await expect(element(by.id('mat-tab-label-0-2')).getAttribute('aria-selected')).toBe('true');
  // });

  it('scroll should load additional articles', async() => {
    // is there a better way to wait for the data to load?
    await browser.sleep(1000);
    await browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    await browser.sleep(3000);
    const numberArticles = element.all(by.css('.news-card')).count();
    await expect(numberArticles).toEqual(38);
  });

  it('reload should return articles from indexed db', async() => {
    await browser.sleep(1000);
    const numberArticles = element.all(by.css('.news-card')).count();
    await expect(numberArticles).toEqual(38);
  });



  afterAll(async () => {
    await browser.sleep(2000);
  });
});

