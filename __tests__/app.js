'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-veeg:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'));
  });

  it('creates files', () => {
    assert.file(['bs-config.json']);
  });
});
