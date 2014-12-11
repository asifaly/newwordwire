/*jslint devel: true, maxerr: 50*/
/*global angular*/
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name wordWire.controller:ListController
   * @description
   * # ListController
   * Controller of the wordWire
   */
  angular.module('wordWire')
    .controller('ListController', ['WordsService', ListCtrl]);

  function ListCtrl(WordsService) {
    var self = this;
    WordsService.getWords().then(function setWords (data) {
      self.words = data;
      self.active = data.length - 1;
    });

    self.select = function setActiveWord(index) {
      self.active = self.words.length - index - 1;
    };
  }
}());
