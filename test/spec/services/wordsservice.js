'use strict';

describe('Service: WordsService', function () {

  // load the service's module
  beforeEach(module('wordWire'));

  // instantiate service
  var WordsService;
  beforeEach(inject(function (_WordsService_) {
    WordsService = _WordsService_;
  }));

  it('should do something', function () {
    expect(!!WordsService).toBe(true);
  });

});
