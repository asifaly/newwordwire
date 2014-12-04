/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc filter
   * @name wwnewApp.filter:strtoregex
   * @function
   * @description
   * # strtoregex
   * Filter in the wwnewApp.
   */
  angular.module('wwnewApp')
    .filter('strtoregex', strToRegex);

  function strToRegex() {
    return function (text) {
      if (text !== undefined) {
        text = text.split("/");
        text = new RegExp(text[1], text[2]);
        return text;
      } else {
        return text;
      }
    };
  }
}());
