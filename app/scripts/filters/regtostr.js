/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc filter
   * @name wordWire.filter:regtostr
   * @function
   * @description
   * # regtostr
   * Filter in the wordWire.
   */
  angular.module('wordWire')
    .filter('regtostr', regxToString);

  function regxToString() {
    return function (text, first) {
      if (text !== undefined) {
        text = text.toString().split("");
        text[4] = first;
        text = text.join("");
        return text;
      } else {
        return text;
      }
    };
  }
}());
