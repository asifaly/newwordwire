/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

/**
 * @ngdoc function
 * @name wordWire.controller:InvitesController
 * @description
 * # InvitesController
 * Controller of the wordWire
 */
angular.module('wordWire')
  .controller('InvitesController', ['$firebase', 'FIREBASE_URI', 'UserService', 'currentAuth', InvitesCtrl]);

  function InvitesCtrl ($firebase, FIREBASE_URI, UserService, currentAuth) {
    console.log(currentAuth);

    var self = this,
      mySentInvitesRef = new Firebase(FIREBASE_URI + 'users/' + currentAuth.uid + '/invites/sent'),
      myRecdInvitesRef = new Firebase(FIREBASE_URI + 'users/' + currentAuth.uid + '/invites/received'),
      mySentInvites = $firebase(mySentInvitesRef).$asArray(),
      myRecdInvites = $firebase(myRecdInvitesRef).$asArray();

      myRecdInvites.$loaded().then(function (){
      self.invitesRecd = myRecdInvites;
    });

    mySentInvites.$loaded().then(function (){
      self.invitesSent = mySentInvites;
    });

    self.onlineusers = UserService.getOnline();

    self.invite = function inviteUser (recvUID){
      var recdURL = FIREBASE_URI + 'users/' + recvUID + '/invites/received',
        sentURL = FIREBASE_URI + 'users/' + currentAuth.uid + '/invites/sent',
        recdRef = new Firebase(recdURL),
        iRecdRef = $firebase(recdRef),
        sentRef = new Firebase(sentURL),
        iSentRef = $firebase(sentRef),
        sentKey,
        recdKey,
        a = 0;

      console.log(recvUID, currentAuth.uid);

      iSentRef.$push({To: recvUID}).then(function (sref){
        console.log('Invite is sent');
        console.log(sref.key());
        sentURL = sentURL + '/' + sref.key();
        sentKey = sref.key();
        a = a+1;
        updateRef();
        console.log('a is ' + a);
      });

      iRecdRef.$push({from: currentAuth.uid}).then(function(rref){
        console.log('Invite is Received');
        console.log(rref.key());
        recdURL = recdURL + '/' + rref.key();
        recdKey = rref.key();
        a = a+1;
        updateRef();
        console.log('a is ' + a);
      });

      function updateRef() {
        if (a === 2) {
          console.log('inside the if');
          recdRef = new Firebase(recdURL);
          iRecdRef = $firebase(recdRef);
          sentRef = new Firebase(sentURL);
          iSentRef = $firebase(sentRef);
          iRecdRef.$update({sentkey: sentKey}).then(function () {
            console.log(sentKey + 'updated successfully');
          });
          iSentRef.$update({recdkey: recdKey}).then(function () {
            console.log(recdKey + 'updated successfully');
          });
        }
      }
    };

    self.removeInvite = function ignoreInvite (id, key, uid){
      console.log(id, key, uid);
      var sentURL = FIREBASE_URI + 'users/' + uid + '/invites/sent/'+ key,
        sentRef = new Firebase(sentURL),
        iSentRef = $firebase(sentRef);

      myRecdInvites.$remove(id).then(function(){
        console.log('item with ' + id + 'successfully removed');
      });

      iSentRef.$remove().then(function(){
        console.log('item removed from sent also');
      });

    };

  }

}());
