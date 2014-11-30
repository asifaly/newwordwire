'use strict';

/**
 * @ngdoc function
 * @name wwnewApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the wwnewApp
 */
angular.module('wwnewApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
