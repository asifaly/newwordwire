'use strict';

/**
 * @ngdoc service
 * @name wwnewApp.UserService
 * @description
 * # UserService
 * Service in the wwnewApp.
 */
angular.module('wwnewApp')
    .service('UserService', ['$log', '$q', 'FIREBASE_URI', '$firebase',
        function ($log, $q, FIREBASE_URI, $firebase) {

            var uRef = new Firebase(FIREBASE_URI),
                usersRef = new Firebase(FIREBASE_URI + "users/"),
                amOnline = new Firebase(FIREBASE_URI + '.info/connected'),
                oRef = new Firebase(FIREBASE_URI + "presence/"),
                onlineRef = $firebase(oRef).$asArray();

            return {
                //once user is logged in set the user presence to online and on logout remove presence
                presence: function (authData) {
                    var deferred = $q.defer();
                    amOnline.on('value', function (snapshot) {
                        var presRef = new Firebase(FIREBASE_URI + 'presence/' + authData.uid),
                            user = {},
                            pRef = $firebase(presRef);
                        if (snapshot.val()) {
                            presRef.onDisconnect().remove();
                            if (authData.provider === 'google') {
                                user.displayName = authData.google.displayName;
                                user.avatar = authData.google.cachedUserProfile.picture;
                            } else if (authData.provider === 'facebook') {
                                user.displayName = authData.facebook.displayName;
                                user.avatar = authData.facebook.cachedUserProfile.picture.data.url;
                            } else if (authData.provider === 'twitter') {
                                user.displayName = authData.twitter.displayName;
                                user.avatar = authData.twitter.cachedUserProfile.profile_image_url_https;
                            }
                            user.uid = authData.uid;
                            user.online = true;
                            deferred.resolve(user);
                            pRef.$set(user);
                        }
                    });
                    return deferred.promise;
                },

                //add user if it does not exist in Firebase
                addUser: function (authData) {
                    var deferred = $q.defer();
                    usersRef.child(authData.uid).once('value', function (snapshot) {
                        if (snapshot.val() !== null) {
                            $log.info("User Already Exists");
                        } else {
                            uRef.child('users').child(authData.uid).set(authData);
                            $log.info("New User" + "User ID: " + authData.uid + " created");
                        }
                    });
                    $log.info("Authentication Successful");
                    return deferred.promise;
                },

                getOnline: function () {
                    return onlineRef;
                }
            };
    }]);