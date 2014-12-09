/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name wordWire.controller:ListCtrl
   * @description
   * # ListCtrl
   * Controller of the wordWire
   */
  angular.module('wordWire')
    .controller('ListCtrl', ['WordsService', ListCtrl]);

  function ListCtrl(WordsService) {
    var self = this;
    WordsService.getWords().then(function (data) {
      self.words = data;
      self.active = data.length - 1;
    });

    self.select = function setActiveWord(index) {
      self.active = self.words.length - index - 1;
    };
  }
}());
