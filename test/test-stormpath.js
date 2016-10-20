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
        .run(path.join( __dirname, '../generators/app'))
        .inTmpDir(function (dir) {
          fse.copySync(path.join(__dirname, '../test/templates/default'), dir)
        })
        .withOptions({
          testmode: true
        })
        .withPrompts({
          stormpathDefault: 'automated'
        })
        .withGenerators(deps)
        .on('end', done);
    });

    it('generates stormpath.config.js file', function () {
      assert.file([
        'src/main/webapp/app/blocks/config/stormpath.config.js'
      ]);
    });
  });
});
