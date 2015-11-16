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
        myNearByList.$loaded().then(function() {
	        
	        myNearByList.$bindTo($scope, "lists");
        //$state.go($state.current, {}, {reload: true});


      });
		var lat=global.getMyLoc().lat;
		var lon=global.getMyLoc().lon;
		console.log(lat,lon);
	      var geoQuery = geoFire.query({
	        center: [lat, lon],
	        radius: radius
	      });

	      geoQuery.on("key_entered", function(key, location, distance) {
				        
				        console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
				        var listItem={loc:location,dis:distance.toFixed(2)};
				        myNearByList[key] = listItem; 
				        myNearByList.$save().then(function(ref) {
						  console.log($scope.lists); // { foo: "bar" }
						   // will be saved to the database
						  //ref.set({ foo: "baz" });  // this would update the database and $scope.data
						});						
			        //$state.go($state.current, {}, {reload: true});

	    });


	      geoQuery.on("key_exited", function(key, location, distance) {
	        console.log(key, location, distance);
        	if($scope.lists==null)
        	{
        		myNearByList.$bindTo($scope, "lists");

        	}
        	//console.log($scope.lists);
        	delete myNearByList[key];
	        //console.log($scope.lists);
	        myNearByList.$save().then(function(ref) {


			  console.log($scope.lists); // { foo: "bar" }
			   // will be saved to the database
			  //ref.set({ foo: "baz" });  // this would update the database and $scope.data
			});	
	      });


})
;
