'use strict';

describe('account', function () {

    var username = element(by.id('sp-login'));
    var password = element(by.id('sp-password'));
    var accountMenu = element(by.id('account-menu'));
    var login = element(by.id('login'));
    var logout = element(by.id('logout'));

    beforeAll(function () {
        browser.get('/');
    });

    it('should fail to login with bad password', function () {
        element.all(by.css('h1')).first().getAttribute('data-translate').then(function (value) {
            expect(value).toMatch(/home.title/);
        });
        accountMenu.click();
        login.click();

        username.sendKeys('admin');
        password.sendKeys('foo');
        element(by.css('button[type=submit]')).click();

        expect(element(by.css('.text-danger')).getText()).toEqual('Invalid username or password.');
    });
});
