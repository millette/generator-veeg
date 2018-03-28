'use strict';
// Const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-veeg:app', () => {
  it('creates files', () => {
    return helpers
      .run(require.resolve('../generators/app'))
      .withPrompts({
        author: 'Rick',
        name: 'yup'
      })
      .then(function() {
        assert.file(['package.json', 'bs-config.json']);
      });
  });
});
