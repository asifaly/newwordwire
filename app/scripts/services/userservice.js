/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name wwnewApp.UserService
   * @description
   * # UserService
   * Service in the wwnewApp.
   */
  angular.module('wordWire')
    .service('UserService', ['$q', 'FIREBASE_URI', '$firebase', UserService]);

  function UserService($q, FIREBASE_URI, $firebase) {

    var uRef = new Firebase(FIREBASE_URI),
      usersRef = new Firebase(FIREBASE_URI + "users/"),
      amOnline = new Firebase(FIREBASE_URI + '.info/connected'),
      oRef = new Firebase(FIREBASE_URI + "presence/"),
      onlineRef = $firebase(oRef).$asArray();

    return {
      presence: presence,
      addUser: addUser,
      getOnline: getOnline
    };

    //once user is logged in set the user presence to online and on logout remove presence
    function presence(authData) {
      var deferred = $q.defer();
      amOnline.on('value', function (snapshot) {
        var presRef = new Firebase(FIREBASE_URI + 'presence/' + authData.uid),
          user = {},
          pRef = $firebase(presRef);
        if (snapshot.val()) {
          presRef.onDisconnect().remove();
          if (authData.provider === 'google') {
            user.avatar = authData[authData.provider].cachedUserProfile.picture;
          } else if (authData.provider === 'facebook') {
            user.avatar = authData[authData.provider].cachedUserProfile.picture.data.url;
          } else if (authData.provider === 'twitter') {
            user.avatar = authData[authData.provider].cachedUserProfile.profile_image_url_https;
          }
          user.uid = authData.uid;
          user.online = true;
          user.displayName = authData[authData.provider].displayName;
          deferred.resolve(user);
          pRef.$set(user);
        }
      });
      return deferred.promise;
    }

    //add user if it does not exist in Firebase
    function addUser(authData) {
      var deferred = $q.defer();
      usersRef.child(authData.uid).once('value', function (snapshot) {
        if (snapshot.val() !== null) {
          deferred.resolve("User Already Exists");
        } else {
          uRef.child('users').child(authData.uid).set(authData);
          deferred.resolve("New User" + "User ID: " + authData.uid + " created");
        }
      });
      return deferred.promise;
    }

    function getOnline() {
      return onlineRef;
    }
  }
}());
