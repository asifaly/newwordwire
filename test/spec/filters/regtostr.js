'use strict';

describe('Filter: regtostr', function () {

  // load the filter's module
  beforeEach(module('wordWire'));

  // initialize a new instance of the filter before each test
  var regtostr;
  beforeEach(inject(function ($filter) {
    regtostr = $filter('regtostr');
  }));

  it('should return the input prefixed with "regtostr filter:"', function () {
    var text = 'angularjs';
    expect(regtostr(text)).toBe('regtostr filter: ' + text);
  });

});
