'use strict';

describe('Filter: score', function () {

  // load the filter's module
  beforeEach(module('wwnewApp'));

  // initialize a new instance of the filter before each test
  var score;
  beforeEach(inject(function ($filter) {
    score = $filter('score');
  }));

  it('should return the input prefixed with "score filter:"', function () {
    var text = 'angularjs';
    expect(score(text)).toBe('score filter: ' + text);
  });

});
