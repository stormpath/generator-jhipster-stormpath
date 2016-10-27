'use strict';
var path = require('path');
var fse = require('fs-extra');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var deps = [
    [helpers.createDummyGenerator(), 'jhipster:modules']
];

describe('JHipster generator Stormpath', function () {
    describe('Automated build', function () {
        before(function (done) {
            helpers
                .run(path.join(__dirname, '../generators/app'))
                .inTmpDir(function (dir) {
                    fse.copySync(path.join(__dirname, '../test/templates/default'), dir)
                })
                .withOptions({
                    skipInstall: true,
                    force: true,
                    testmode: true
                })
                .withPrompts({
                    installStormpath: true
                })
                .withGenerators(deps)
                .on('end', done);
        });

        it('generates stormpath.config.js file', function () {
            assert.file([
                'src/main/webapp/app/blocks/config/stormpath.config.js'
            ]);
        });
        it('stormpath lib inside pom.xml', function () {
            assert.fileContent('pom.xml', /com.stormpath.spring/);
        });
        it('stormpath lib inside bower.json', function () {
            assert.fileContent('bower.json', /stormpath-sdk-angularjs/);
        });
        it('jhiPrefixCapitalized works in navbar.html', function () {
            assert.fileContent('src/main/webapp/app/layouts/navbar/navbar.html', /JhiLanguageController as languageVm/);
        });
        it('proxyPath /login added in serve.js', function () {
            assert.fileContent('gulp/serve.js', /\/login/);
        });
    });
});
