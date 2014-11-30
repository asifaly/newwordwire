'use strict';

describe('Filter: strtoregex', function () {

  // load the filter's module
  beforeEach(module('wwnewApp'));

  // initialize a new instance of the filter before each test
  var strtoregex;
  beforeEach(inject(function ($filter) {
    strtoregex = $filter('strtoregex');
  }));

  it('should return the input prefixed with "strtoregex filter:"', function () {
    var text = 'angularjs';
    expect(strtoregex(text)).toBe('strtoregex filter: ' + text);
  });

});
