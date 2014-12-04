/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name wwnewApp.Auth
   * @description
   * # Auth
   * Service in the wwnewApp.
   */
  angular.module('wwnewApp')
    .service('Auth', ['$firebaseAuth', 'FIREBASE_URI', Auth]);

  function Auth($firebaseAuth, FIREBASE_URI) {
    var uRef = new Firebase(FIREBASE_URI);
    return $firebaseAuth(uRef);
  }
}());
