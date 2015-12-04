angular.module('starter.listNearMe', [])

.controller('nearMeCtrl', function($scope, $state,$cordovaGeolocation,geoFire,global) {



		var radius=100;
		var listexist={};
		$scope.listDetail=[];
        $scope.myplace=global.getMyLoc();
		var lat=global.getMyLoc().lat;
		var lon=global.getMyLoc().lon;
		console.log(lat,lon);
		if(lat==null)
		{
			
		}
	      var geoQuery = geoFire.query({
	        center: [lat, lon],
	        radius: radius
	      });

	      geoQuery.on("key_entered", function(key, location, distance) {
				        
				        console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
				        var listItem={loc:location,dis:distance.toFixed(2)};

				        	
						   // { foo: "bar" }
						   // will be saved to the database
						  //ref.set({ foo: "baz" });  // this would update the database and $scope.data
						  

				        	console.log(key);
				        	var uid=key.substring(0,key.lastIndexOf(':'));
				        	var listkey=key.substring(key.lastIndexOf(':')+1,key.length);
				        	var nearbyListRef=new Firebase('https://sggo.firebaseio.com'+"/users/"+uid+"/myLists/"+listkey);
				        	nearbyListRef.once('value',function(snap){
				        		if(listexist.key!=null)
				        		{
				        			console.log('eixst',$scope.listDetail);
				        		}
				        		else
				        		{
				        			var listItem=snap.val();
				        			listItem.$id=key;
				        			$scope.listDetail.push(listItem);
				        			console.log(listItem);
				        			listexist[key]='1';
				        			if(!$scope.$$phase) {
									  $scope.$digest();
									}
				        		}
						});
			        //$state.go($state.current, {}, {reload: true});

	    });


	      geoQuery.on("key_exited", function(key, location, distance) {
	        console.log(key, location, distance);

        	//console.log($scope.lists);

	        //console.log($scope.lists);

		  $scope.listDetail=[];

	        	console.log(key);
	        	var uid=key.substring(0,key.lastIndexOf(':'));
	        	var listkey=key.substring(key.lastIndexOf(':')+1,key.length);
	        	var nearbyListRef=new Firebase('https://sggo.firebaseio.com'+"/users/"+uid+"/myLists/"+listkey);

	        	nearbyListRef.once('value',function(snap){

	        		if(listexist.key!=null)
	        		{
	        			console.log('eixst',$scope.listDetail);
	        		}
	        		else
	        		{
	        			$scope.listDetail.push(snap.val());
	        			console.log(snap.val());
	        			listexist[key]='1';
	        			if(!$scope.$$phase) {
						  $scope.$digest();
						}
	        			
	        		}
	        	});
			  console.log($scope.lists); // { foo: "bar" }

	      });

	      $scope.goToSpin=function(list){
	      	console.log(list);
	      	$state.go('tab.spinNearby',list);
	      }
          
          $scope.goToEditListNearMe=function(listItem){
	      	$state.go('tab.editListNearMe',listItem);
              $scope.$root.tabsHidden = "tabs-hide";
	      }

})

.controller('nearMeCtrlEdit', function($scope, $state,$stateParams) {
	console.log($stateParams);
	$scope.nearbyListPlaces=$stateParams.places;

    $scope.goBackAndShowTabBar = function(){
        $scope.$root.tabsHidden = "tabs-show";
        //$ionicGoBack();
    };

    $scope.goToSpin=function(){
	      $state.go('tab.spinListNearMe',$stateParams);
	}
})
;
