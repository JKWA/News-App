import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';


describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should display welcome message', async() => {
    page.navigateTo();
    // browser.pause();
    debugger;
    expect(page.getParagraphText()).toEqual('Welcome to news-project!');
  });
});
