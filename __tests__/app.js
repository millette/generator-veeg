'use strict';
// Const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-veeg:app', () => {
  /* Skip
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'));
  });
  */

  it('creates files', () => {
    // Skip assert.file(['package.json', 'bs-config.json']);
    return helpers
      .run(require.resolve('../generators/app'))
      .withPrompts({
        author: 'Rick',
        name: 'yup'
      })
      .then(function() {
        assert.file(['package.json', 'bs-config.json']);
        /* Skip
        assert.file('LICENSE');
        assert.noFile('package.json');
        */
      });
  });
});
