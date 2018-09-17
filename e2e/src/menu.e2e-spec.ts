import {browser, by, element, ExpectedConditions as EC} from 'protractor';
import {type, go, see, slow, click, under, leftOf, below, rightOf} from 'blue-harvest';

describe('App menu', () => {
  beforeEach(async() => {
    await go('/');
  });

  it('click menu Filter should redirect to filter page', async() => {
    await click('settings');
    await click('Filter');
    expect(browser.driver.getCurrentUrl()).toEqual('filter');
  });

  it('click menu Section should redirect to news-section page', async() => {
    await click('settings');
    await click('Section');
    expect(browser.driver.getCurrentUrl()).toEqual('news-section');
  });

  it('click menu Log should redirect to log page', async() => {
    await click('settings');
    await click('Log');
    expect(browser.driver.getCurrentUrl()).toEqual('log');
  });




  // it('scroll should load additional articles', async() => {
  //   await browser.sleep(1000);
  //   await browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
  //   await browser.sleep(3000);
  //   const numberArticles = element.all(by.css('.news-card')).count();
  //   await expect(numberArticles).toEqual(38);
  // });

  // it('reload should return articles from indexed db', async() => {
  //   await browser.sleep(1000);
  //   const numberArticles = element.all(by.css('.news-card')).count();
  //   await expect(numberArticles).toEqual(38);
  // });



  afterAll(async () => {
    await browser.executeScript('return window.localStorage.clear();');
    await browser.sleep(2000);
  });
});

