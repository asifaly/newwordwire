'use strict';

describe('Filter: firstlet', function () {

  // load the filter's module
  beforeEach(module('wordWire'));

  // initialize a new instance of the filter before each test
  var firstlet;
  beforeEach(inject(function ($filter) {
    firstlet = $filter('firstlet');
  }));

  it('should return the input prefixed with "firstlet filter:"', function () {
    var text = 'angularjs';
    expect(firstlet(text)).toBe('firstlet filter: ' + text);
  });

});
