/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc overview
   * @name wordWire
   * @description
   * # wordWire
   *
   * Main module of the application.
   */
  angular
    .module('wordWire', [
      'ngAnimate',
      'ngCookies',
      'ngMessages',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'firebase'
    ]).constant('FIREBASE_URI', 'https://wordwire.firebaseio.com/').run(['$rootScope', '$location',
      function ($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
          if (error === 'AUTH_REQUIRED') {
            $location.path('/login');
          }
        });
      }]).config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider.
          when('/game', {
            templateUrl: 'views/game.html',
            controller: 'GameController',
            controllerAs: 'gm',
            resolve: {
              'currentAuth': ['Auth',
                function (Auth) {
                  return Auth.$requireAuth();
                }]
            }
          }).
          when('/login', {
            templateUrl: 'views/login.html',
            controller: 'UserController',
            controllerAs: 'usr',
            resolve: {
              'currentAuth': ['Auth',
                function (Auth) {
                  return Auth.$waitForAuth();
                }]
            }
          }).
          when('/players', {
            templateUrl: 'views/players.html',
            controller: 'InvitesController',
            controllerAs: 'inv',
            resolve: {
              'currentAuth': ['Auth',
                function (Auth) {
                  return Auth.$requireAuth();
                }]
            }
          }).
          when('/words', {
            templateUrl: 'views/words.html',
            controller: 'ListController',
            controllerAs: 'list',
            resolve: {
              'currentAuth': ['Auth',
                function (Auth) {
                  return Auth.$requireAuth();
                }]
            }
          }).
          when('/main', {
            templateUrl: 'views/main.html',
            controller: 'UserController',
            controllerAs: 'usr',
            resolve: {
              'currentAuth': ['Auth',
                function (Auth) {
                  return Auth.$waitForAuth();
                }]
            }
          }).
          otherwise({
            redirectTo: '/main'
          });
      }]);
}());
