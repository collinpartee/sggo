angular.module('starter.listNearMe', [])

.controller('nearMeCtrl', function($scope, $state,$cordovaGeolocation,geoFire,global,myNearByList) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
		var radius=30;
		$scope.lists=myNearByList;
		var lat=global.getMyLoc().lat;
		var lon=global.getMyLoc().lon;
		console.log(lat,lon);
	      var geoQuery = geoFire.query({
	        center: [lat, lon],
	        radius: radius
	      });
	      geoQuery.on("key_entered", function(key, location, distance) {

	        console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
	        var listItem={'key':key,loc:location,dis:distance.toFixed(2)};
	        var ref =new Firebase('https://sggo.firebaseio.com/users/');
	        var authData = ref.getAuth();
	        var reflist = new Firebase('https://sggo.firebaseio.com/users/'+authData.uid+'/myNearByList');
	        
	        reflist.orderByChild('key')
	        .startAt(key)
	        .endAt(key)
	        .once('value', function(snap) {

	        	if(snap.exists())
	        	{
	        		//do nothing
	        		console.log("exist");
	        	}
	        	else
	        	{
	        		myNearByList.$add(listItem);
	        	}
	        });
	        
	        //$state.go($state.current, {}, {reload: true});
	      });


})
;
