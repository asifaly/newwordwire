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
  angular.module('wordWire')
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

    self.computeScore = function computeScore(newWord) {
      self.message = null;
      self.newword.score = $filter('score')(newWord);
    };

    //defining firebase instances
    var sRef = new Firebase(FIREBASE_URI + "stats/");

    //watch for change in value of lastWord, firstLetter and pattern and update the scope using regular firebase
    sRef.on("value", function statsFbGet(statssnapshot) {
      $timeout(function statsscopeSet() {
        //get value of firebase/stats
        self.stats = statssnapshot.val();
        //using filter to convert string to regex
        self.stats.pattern = $filter('strtoregex')(statssnapshot.val().pattern);
      });
    });

    //function is called on clicking the submit button
    self.addWord = function firebaseAddWord() {
      self.isReadOnly = true;

      var lastWord = $filter('lowercase')(self.newword.name),
        firstLetter = $filter('firstlet')(lastWord),
        pattern = $filter('regtostr')(self.stats.pattern, firstLetter);

      WordsService.checkWord(lastWord).then(function checkWordPass(data) {
        WordsService.dictCheck(lastWord).then(function dictCheckPass(data) {
          self.newword = angular.extend(self.newword, data);
          console.log(self.newword);

          WordsService.addWord(angular.copy(self.newword)).then(function addWordPass(nref) {
            self.message = lastWord + " was successfully Added";
            self.isReadOnly = false;
            self.theForm.$setPristine();
            self.newword = {
              name: '',
              score: ''
            };
          });

          WordsService.setStats(lastWord, pattern, firstLetter).then(function setStatsPass(stref) {
            console.info("stats added at " + stref);
          });
        }).catch(function dictCheckFail(error) {
          self.message = error;
          self.isReadOnly = false;
        });
      }).catch(function checkWordFail(error) {
        self.message = error;
        self.isReadOnly = false;
      });
    };
  }
}());
