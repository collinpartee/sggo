angular.module('starter.itemDetails', [])

.controller('myItemDetailsCtrl', function($scope, $state,$cordovaGeolocation,geoFire,global) {

$scope.goBackToEditMyList = function(){
    $state.go('tab.editMyList');
};

	

})
.controller('nearMeItemDetailsCtrl', function($scope, $state,$cordovaGeolocation,geoFire,global) {



	

})
;
