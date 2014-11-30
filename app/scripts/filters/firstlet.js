'use strict';

/**
 * @ngdoc filter
 * @name wwnewApp.filter:firstlet
 * @function
 * @description
 * # firstlet
 * Filter in the wwnewApp.
 */
angular.module('wwnewApp')
    .filter('firstlet', function () {
        return function (text) {
            if (text !== undefined) {
                text = text.charAt(text.length - 1);
                return text;
            } else {
                return text;
            }
        };
    });