/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name wordWire.controller:GameController
   * @description
   * # GameController
   * Controller of the wordWire
   */
  angular.module('wordWire')
    .controller('GameController', ['FIREBASE_URI', '$timeout', '$filter', 'WordsService', GameCtrl]);

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

      WordsService.checkWord(self.newword, self.stats.pattern).then(function (message){
        self.message = message;
        self.theForm.$setPristine();
        self.newword = {
          name: '',
          score: ''
        };
      }).catch(function (error){
        self.message = error;
      }).finally(function (){
        self.isReadOnly = false;
      });
    };
  }
}());
