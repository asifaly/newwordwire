/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name wordWire.controller:UserCtrl
   * @description
   * # UserCtrl
   * Controller of the wordWire
   */
  angular.module('wordWire')
    .controller('UserCtrl', ['UserService', '$location', 'Auth', UserCtrl]);

  function UserCtrl(UserService, $location, Auth) {
    var self = this;

    self.authObj = Auth;

    self.isActive = function setActiveTab(route) {
      return route === $location.path();
    };

    self.user = {
      displayName: '',
      uid: '',
      avatar: ''
    };

    self.onlineusers = UserService.getOnline();

    //logout user
    self.logout = function logout() {
      self.authObj.$unauth();
      Firebase.goOffline(); //go offline from firebase on logout to show only logged in online users
      self.user = {
        displayName: '',
        uid: ''
      };
      $location.path("/login");
    };

    //social login user
    self.login = function socialLogin(provider) {
      Firebase.goOnline();
      self.authObj.$authWithOAuthPopup(provider).then(function authUser(authData) {
        $location.path("/game");
        UserService.addUser(authData).then(function addUserPass(data) {
          console.info(data);
        }).catch(function authFailed(error) {
          console.error("Authentication failed:", error);
        });
      });
    };

    //onAuth updateself.user
    self.authObj.$onAuth(function authenticateUser(authData) {
      if (authData) {
        //onlogin, presence will be updated to true i.e to show online users
        UserService.presence(authData).then(function presenceIndicator(data) {
          self.user = data;
        });
      } else {
        console.log("Logged out");
      }
    });
  }
}());
