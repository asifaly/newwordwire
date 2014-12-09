/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name wordWire.WordsService
   * @description
   * # WordsService
   * Service in the wordWire.
   */
  angular.module('wordWire')
    .service('WordsService', ['$http', '$log', '$q', 'FIREBASE_URI', '$firebase', '$filter', WordsService]);

  function WordsService($http, $log, $q, FIREBASE_URI, $firebase, $filter) {

    var wRef = new Firebase(FIREBASE_URI + "words/"),
      wordRef = $firebase(wRef).$asArray(),
      sRef = new Firebase(FIREBASE_URI + "stats/"),
      stRef = $firebase(sRef).$asObject(),
      statRef = $firebase(sRef);

    return {
      getWords: getWords,
      checkWord: checkWord
    };

    //get the list of words to be shown on words page
    function getWords() {
      var q = $q.defer();
      q.resolve(wordRef);
      return q.promise;
    }

    //check if the new word exists in Firebase
    function checkWord(newword, oldpattern) {
      var q = $q.defer(),
        word = $filter('lowercase')(newword.name),
        firstLetter = $filter('firstlet')(newword.name),
        newpattern = $filter('regtostr')(oldpattern, firstLetter),
        wordDef = {},
        url = 'https://api.wordnik.com/v4/word.json/' + word + '/definitions?limit=1&includeRelated=false&sourceDictionaries=webster%2Cwordnet&useCanonical=false&includeTags=false&api_key=9a67169ed9a424f1400000112af04acdc9cf96bea0fe263ed';

      wRef.orderByChild("name").equalTo(word).once("value", function (snapshot) {
        if (snapshot.val() !== null) { //if word exists in firebase
          q.reject(new Error(word + " already exists! chose another"));
        } else {
          $http.get(url)
            .success(function (data) {
              if (data.length > 0) {
                wordDef = {
                  name: data[0].word,
                  definition: data[0].text,
                  pos: data[0].partOfSpeech,
                  attr: data[0].attributionText,
                  source: data[0].sourceDictionary
                };
                wordDef = angular.extend(newword, wordDef);
                wordRef.$add(angular.copy(wordDef)).then(function (nref) {
                  $log.info(nref.key());
                  statRef.$set({
                    firstletter: firstLetter,
                    lastword: word,
                    pattern: newpattern
                  }).then(function (stref) {
                    q.resolve("Word added at " + nref.key() + ", Stats added at " + stref.key());
                  }).catch(function (error) {
                    wordRef.$remove(nref.key());
                    q.reject(new Error("Stats Could not be updated due to " + error));
                  });
                });
              } else {
                q.reject(new Error(word + " was not found in the dictionary"));
              }
            }).error(function (msg, code) {
              q.reject(new Error("Error Connecting to Dictionary, please try again!"));
              $log.error(msg, code);
            });
        }
      });
      return q.promise;
    }
  }
}());
