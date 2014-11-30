'use strict';

/**
 * @ngdoc service
 * @name wwnewApp.WordsService
 * @description
 * # WordsService
 * Service in the wwnewApp.
 */
angular.module('wwnewApp')
    .service('WordsService', ['$http', '$log', '$q', '$window', 'FIREBASE_URI', '$firebase', '$filter',
        function ($http, $log, $q, $window, FIREBASE_URI, $firebase, $filter) {

            var wRef = new Firebase(FIREBASE_URI + "words/"),
                wordRef = $firebase(wRef).$asArray(),
                sRef = new Firebase(FIREBASE_URI + "stats/"),
                statRef = $firebase(sRef);

            return {
                //check the word added exists in Firebase and if it is a valid word in dictionary
                dictCheck: function (lastWord) {
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
                                deferred.reject(new Error("Word Not Found in Dictionary"));
                            }
                        }).error(function (msg, code) {
                            deferred.reject(msg);
                            $log.error(msg, code);
                        });
                    return deferred.promise;
                },

                getWords: function () {
                    return wordRef;
                },

                /*            getStats: function () {
                statRef.pattern = $filter('strtoregex')(statRef.pattern);
                $log.info(statRef);
                $log.info(statRef.pattern);
                return statRef;
            },*/

                addWord: function (word) {
                    var deferred = $q.defer();
                    wordRef.$add(word).then(function (nref) {
                        $log.info(nref.key());
                        deferred.resolve(nref.key());
                    });
                    return deferred.promise;
                },

                checkWord: function (word) {
                    var deferred = $q.defer();
                    wRef.orderByChild("name").equalTo(word).once("value", function (snapshot) {
                        if (snapshot.val() !== null) { //if word exists in firebase
                            deferred.reject(new Error("Word already exists chose another"));
                        } else {
                            deferred.resolve();
                        }
                    });
                    return deferred.promise;
                },

                setStats: function (lastWord, pattern, firstLetter) {
                    var deferred = $q.defer();
                    statRef.$set({
                        firstletter: firstLetter,
                        lastword: lastWord,
                        pattern: pattern
                    }).then(function (stref) {
                        deferred.resolve(stref.key());
                    }).catch(function (error) {
                        deferred.reject(new Error("Stats Could not be updated"));
                    });
                    return deferred.promise;
                }
            };
        }]);
