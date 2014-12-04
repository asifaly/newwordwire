/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name wwnewApp.controller:GameCtrl
   * @description
   * # GameCtrl
   * Controller of the wwnewApp
   */
  angular.module('wwnewApp')
    .controller('GameCtrl', ['FIREBASE_URI', '$timeout', '$filter', 'WordsService', GameCtrl]);

  function GameCtrl(FIREBASE_URI, $timeout, $filter, WordsService) {
    //initialize pattern if it is not done, when app initializes, there is an error for invalid pattern
    var self = this;

    self.stats = {};
    self.stats.pattern = new RegExp();
    self.newword = {
      name: '',
      score: ''
    };
    self.isReadOnly = false;

    //defining firebase instances
    var sRef = new Firebase(FIREBASE_URI + "stats/");

    //watch for change in value of lastWord, firstLetter and pattern and update theself using regular firebase
    sRef.on("value", function statsFbGet(statssnapshot) {
      $timeout(function statsscopeSet() {
        //get value of firebase/stats
        self.stats = statssnapshot.val();
        //using filter to convert string to regex
        self.stats.pattern = $filter('strtoregex')(statssnapshot.val().pattern);
      });
    });

    //self function is called on clicking the submit button
    self.addWord = function firebaseAddWord() {
      //create variables to update stats
      self.isReadOnly = true;

      var lastWord = $filter('lowercase')(self.newword.name),
        firstLetter = $filter('firstlet')(lastWord),
        pattern = $filter('regtostr')(self.stats.pattern, firstLetter);

      WordsService.checkWord(lastWord).then(function firebasePass(data) {
        WordsService.dictCheck(lastWord).then(function wordnikPass(data) {
          self.newword = angular.extend(self.newword, data);
          console.log(self.newword);

          WordsService.addWord(angular.copy(self.newword)).then(function afterWordAdd(nref) {
            self.message = lastWord + " was successfully Added";
            self.isReadOnly = false;
            self.theForm.$setPristine();
            self.newword = {
              name: '',
              score: ''
            }; //clear the ng-model newword
          });

          WordsService.setStats(lastWord, pattern, firstLetter).then(function afterStatAdd(stref) {
            console.info("stats added at " + stref);
          });
        }).catch(function wordnikFail(error) {
          self.message = error;
          self.isReadOnly = false;
        });
      }).catch(function firebaseFail(error) {
        self.message = error;
        self.isReadOnly = false;
      });
    };

    self.computeScore = function (newValue) {
      self.message = null;
      self.newword.score = $filter('score')(newValue);
    };
  }
}());
