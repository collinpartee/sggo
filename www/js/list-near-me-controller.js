angular.module('starter.listNearMe', [])

.controller('nearMeCtrl', function($scope, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
        $scope.lists = [
        {title: 'Steak', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Sandwhich', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Breakfast', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']}
    ];

})
;
