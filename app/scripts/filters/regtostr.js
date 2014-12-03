/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc filter
   * @name wwnewApp.filter:regtostr
   * @function
   * @description
   * # regtostr
   * Filter in the wwnewApp.
   */
  angular.module('wwnewApp')
    .filter('regtostr', function regxTostring() {
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
    });
}());
