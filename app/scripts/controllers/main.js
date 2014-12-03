/*jslint devel: true, maxerr: 50*/
/*global wordWire*/
/*global angular*/
/*global Firebase*/
(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name wwnewApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the wwnewApp
   */
  angular.module('wwnewApp')
    .controller('WordCtrl', ['$scope', '$firebase', 'FIREBASE_URI', '$timeout', '$filter', 'WordsService', '$location',
      function ($scope, $firebase, FIREBASE_URI, $timeout, $filter, WordsService, $location) {
        //initialize pattern if it is not done, when app initializes, there is an error for invalid pattern
        $scope.stats = {};
        $scope.stats.pattern = new RegExp();
        $scope.newword = {
          name: '',
          score: ''
        };

        //defining firebase instances
        var sRef = new Firebase(FIREBASE_URI + "stats/");

        //watch for change in value of lastWord, firstLetter and pattern and update the$scope using regular firebase
        sRef.on("value", function statsFbGet(statssnapshot) {
          $timeout(function statsscopeSet() {
            //get value of firebase/stats
            $scope.stats = statssnapshot.val();
            //using filter to convert string to regex
            $scope.stats.pattern = $filter('strtoregex')(statssnapshot.val().pattern);
          });
        });

        //$scope function is called on clicking the submit button
        $scope.addWord = function firebaseAddWord() {
          //create variables to update stats
          $scope.isReadOnly = true;

          var lastWord = $filter('lowercase')($scope.newword.name),
            firstLetter = $filter('firstlet')(lastWord),
            pattern = $filter('regtostr')($scope.stats.pattern, firstLetter);

          WordsService.checkWord(lastWord).then(function firebasePass(data) {
            WordsService.dictCheck(lastWord).then(function wordnikPass(data) {
              $scope.newword = angular.extend($scope.newword, data);
              console.log($scope.newword);

              WordsService.addWord(angular.copy($scope.newword)).then(function afterWordAdd(nref) {
                $scope.message = lastWord + " was successfully Added";
                $scope.isReadOnly = false;
                $scope.theForm.$setPristine();
                $scope.newword = {
                  name: '',
                  score: ''
                }; //clear the ng-model newword
              });

              WordsService.setStats(lastWord, pattern, firstLetter).then(function afterStatAdd(stref) {
                console.info("stats added at " + stref);
              });
            }).catch(function wordnikFail(error) {
              $scope.message = error;
              $scope.isReadOnly = false;
            });
          }).catch(function firebaseFail(error) {
            $scope.message = error;
            $scope.isReadOnly = false;
          });
        };

        //watch for changes to input field ng-model=newword.name and compute newword.score
        $scope.$watch("newword.name", function scoreCompute(newValue) {
          $scope.newword.score = $filter('score')(newValue);
        });
      }]);
}());
