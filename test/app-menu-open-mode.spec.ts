import { expect } from 'chai';
import { App } from '../src/model/App.js';
import { MenuOpenMode } from '../src/model/Enums.js';

describe('App menuOpenMode', () => {
  it('should return the configured menu open mode', () => {
    const app = new App({
      menuOpenMode: MenuOpenMode.NEW_TAB,
    } as bkper.App);

    expect(app.getMenuOpenMode()).to.equal(MenuOpenMode.NEW_TAB);
  });

  it('should return SIDEBAR when menu open mode is not set', () => {
    const app = new App({});

    expect(app.getMenuOpenMode()).to.equal(MenuOpenMode.SIDEBAR);
  });

  it('should set menu open mode on the payload', () => {
    const app = new App({});

    const result = app.setMenuOpenMode(MenuOpenMode.EXPANDED);

    expect(result).to.equal(app);
    expect(app.getMenuOpenMode()).to.equal(MenuOpenMode.EXPANDED);
  });
});
