import { Fortune100Page } from './app.po';

describe('fortune100 App', function() {
  let page: Fortune100Page;

  beforeEach(() => {
    page = new Fortune100Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
