/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc filter
   * @name wordWire.filter:firstlet
   * @function
   * @description
   * # firstlet
   * Filter in the wordWire.
   */
  angular.module('wordWire')
    .filter('firstlet', firstLetter);

  function firstLetter() {
    return function (text) {
      if (text !== undefined) {
        text = text.charAt(text.length - 1);
        return text;
      } else {
        return text;
      }
    };
  }
}());
