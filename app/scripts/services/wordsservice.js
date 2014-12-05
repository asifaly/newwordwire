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
    .service('WordsService', ['$http', '$log', '$q', 'FIREBASE_URI', '$firebase', WordsService]);

  function WordsService($http, $log, $q, FIREBASE_URI, $firebase) {

    var wRef = new Firebase(FIREBASE_URI + "words/"),
      wordRef = $firebase(wRef).$asArray(),
      sRef = new Firebase(FIREBASE_URI + "stats/"),
      statRef = $firebase(sRef);

    return {
      getWords: getWords,
      checkWord: checkWord,
      dictCheck: dictCheck,
      addWord: addWord,
      setStats: setStats
    };

    //get the list of words to be shown on words page
    function getWords() {
      var deferred = $q.defer();
      deferred.resolve(wordRef);
      return deferred.promise;
    }

    //check if the new word exists in Firebase
    function checkWord(word) {
      var deferred = $q.defer();
      wRef.orderByChild("name").equalTo(word).once("value", function (snapshot) {
        if (snapshot.val() !== null) { //if word exists in firebase
          deferred.reject(new Error(word + " already exists! chose another"));
        } else {
          deferred.resolve();
        }
      });
      return deferred.promise;
    }

    //check if the new word exists in dictionary
    function dictCheck(lastWord) {
      var deferred = $q.defer(),
        url = 'https://api.wordnik.com/v4/word.json/' + lastWord + '/definitions?limit=1&includeRelated=false&sourceDictionaries=webster%2Cwordnet&useCanonical=false&includeTags=false&api_key=9a67169ed9a424f1400000112af04acdc9cf96bea0fe263ed';
      $http.get(url)
        .success(function (data) {
          if (data.length > 0) {
            deferred.resolve({
              name: data[0].word,
              definition: data[0].text,
              pos: data[0].partOfSpeech,
              attr: data[0].attributionText,
              source: data[0].sourceDictionary
            });
          } else {
            deferred.reject(new Error(lastWord + " was not found in the dictionary"));
          }
        }).error(function (msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });
      return deferred.promise;
    }

    //add the new word to firebase
    function addWord(word) {
      var deferred = $q.defer();
      wordRef.$add(word).then(function (nref) {
        $log.info(nref.key());
        deferred.resolve(nref.key());
      });
      return deferred.promise;
    }

    //add lastword, pattern and firstletter to firebase
    function setStats(lastWord, pattern, firstLetter) {
      var deferred = $q.defer();
      statRef.$set({
        firstletter: firstLetter,
        lastword: lastWord,
        pattern: pattern
      }).then(function (stref) {
        deferred.resolve(stref.key());
      }).catch(function (error) {
        deferred.reject(new Error("Stats Could not be updated due to " + error));
      });
      return deferred.promise;
    }
  }
}());
