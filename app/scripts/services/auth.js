'use strict';

/**
 * @ngdoc service
 * @name wwnewApp.Auth
 * @description
 * # Auth
 * Service in the wwnewApp.
 */
angular.module('wwnewApp')
  .service('Auth', ['$firebaseAuth', 'FIREBASE_URI', function($firebaseAuth, FIREBASE_URI) {
    var uRef = new Firebase(FIREBASE_URI);
    return $firebaseAuth(uRef);
}]);