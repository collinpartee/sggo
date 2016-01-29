angular.module('starter.listNearMe', [])

.controller('nearMeCtrl', function($scope, $state,$cordovaGeolocation,$timeout,$ionicLoading,$filter,ionicMaterialMotion,ionicMaterialInk,geoFire,global,FBURL,locationService,avatarService) {
		$ionicLoading.hide();
	    $scope.isExpanded = true;
	    $scope.$parent.clearAllFabs();
        $scope.hideNavBar = true;
	    $scope.$on('applyEffect',function(e){
	    	
//	        console.log('triggered');
	      $timeout(function(){
				$('.profile').initial();
	            ionicMaterialMotion.fadeSlideInRight();
	            ionicMaterialInk.displayEffect();
	            
	          },0);
	      $ionicLoading.hide();
	    });






		//console.log('myloc',myLoc);
		var lat=global.getMyLoc().lat;
		var lon=global.getMyLoc().lon;
		var radius=100;
		var listexist={};
		var limit=30;
		$scope.listDetail=[];

		console.log(lat,lon);
		if(lat==null)
		{
			
		}
	      var geoQuery = geoFire.query({
	        center: [lat, lon],
	        radius: radius
	      });

	      geoQuery.on("key_entered", function(key, location, distance) {
				        
//				        console.log(key + " is located at [" + location + "] which is within the query (" + distance.toFixed(2) + " km from center)");
				        var listItem={loc:location,dis:distance.toFixed(2)};

				        	
						   // { foo: "bar" }
						   // will be saved to the database
						  //ref.set({ foo: "baz" });  // this would update the database and $scope.data
						  

				        	var uid=key.substring(0,key.lastIndexOf(':'));
				        	var listkey=key.substring(key.lastIndexOf(':')+1,key.length);
				        	var nearbyListRef=new Firebase(FBURL+"/users/"+uid+"/myLists/"+listkey);
				        	nearbyListRef.once('value',function(snap){
				        		if(snap.exists())
				        		{
					        		if(listexist[key]==1)
					        		{
					        			console.log('eixst',$scope.listDetail);
					        			if(!$scope.$$phase) {
						        				
											$scope.$digest();

										}	
					        		}
					        		else
					        		{
					        			var listItem=snap.val();
					        			listItem.$id=key;
					        			listItem.dis=parseFloat(distance.toFixed(2), 10);
					        			var nearbyListUserRef=new Firebase(FBURL+"/users/"+uid+"/avatar");
					        			nearbyListUserRef.once('value',function(snap){
	//				        				console.log(snap.val());
					        				listItem.avatar=snap.val();
	                                        listItem.avatarImg=avatarService.getAvatar(listItem);
	                                        console.log(listItem.avatarImg);
					        				if($scope.listDetail.length<limit)
					        				{
					        					$scope.listDetail.push(listItem);
					        				}
					        				
						        			
						        			listexist[key]='1';
						        			if(!$scope.$$phase) {
						        				
											  $scope.$digest();

											}
					        			});
					        			
					        		}				        			
				        		}

						});
			        //$state.go($state.current, {}, {reload: true});

	    });


	      geoQuery.on("key_exited", function(key, location, distance) {
	        console.log(key, location, distance);

	        	delete listexist[key];
	        	var found = $filter('getById')($scope.listDetail, key);
	        	var index = $scope.listDetail.indexOf(found);
	        	console.log(found);
  				$scope.listDetail.splice(index, 1);  
    			if(!$scope.$$phase) {
				  $scope.$digest();
				}

	      });

	      $scope.goToSpin=function(list){
	      	console.log(list);
	      	$state.go('tab.spinNearby',list);
	      }
          
          $scope.goToEditListNearMe=function(listItem){
	      	$state.go('tab.editListNearMe',listItem);
              console.log(listItem);
              $scope.$root.tabsHidden = "tabs-hide";
	      }
          

})

.controller('nearMeCtrlEdit', function($scope, $state,$stateParams,$firebaseObject,$timeout,ionicMaterialMotion,ionicMaterialInk,FBURL,myListFirebase,authData) {
//	$scope.$parent.showHeader();
	$scope.nearByListItem=$stateParams;
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    $('.profile').initial({name:"steve"});
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
//            $('.profile').initial();
            selector: '.slide-up'
        });
        $('.profile').initial();
    }, 300);

    $timeout(function() {
//        $('.profile').initial();
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    //ionicMaterialInk.displayEffect();

    $scope.$on('$ionicView.enter', function() {
            console.log("my page has arrived");
        $('.profile').initial({name:"Steve"});
            $scope.$root.hideTabsOnThisPage = true;
    });
    
    
    console.log($stateParams);
	
    var key=$stateParams.$id;
    var uid=key.substring(0,key.lastIndexOf(':'));
    var listkey=key.substring(key.lastIndexOf(':')+1,key.length);
    var listLikeRef=new Firebase(FBURL+"/users/"+uid+"/myLists/"+listkey+"/likes");
    $scope.goBackAndShowTabBar = function(){
        $scope.$root.tabsHidden = "tabs-show";
        $scope.$root.hideTabsOnThisPage = false;
        //$ionicGoBack();
    };

    $scope.goToSpin=function(){
	      $state.go('tab.spinListNearMe',$stateParams);
	}
    var myLikes=$firebaseObject(listLikeRef);
    myLikes.$loaded().then(function() {
      	myLikes.$bindTo($scope, "likes");
      });


	var listDownloadRef=new Firebase(FBURL+"/users/"+uid+"/myLists/"+listkey+"/downloads");
    var myDownloads=$firebaseObject(listDownloadRef);
	myDownloads.$loaded().then(function() {
	  	myDownloads.$bindTo($scope, "downloads");
	  });
    

    $scope.heartClass = 'ion-ios-heart-outline';
    $scope.likeThisList=function(){
    var likeRef=new Firebase(FBURL+"/users/"+uid+"/likes");    
        if ($scope.heartClass== 'ion-ios-heart-outline'){
            $scope.heartClass= 'ion-ios-heart'
            console.log('heartClass activated');
            console.log($scope.likes);
            $scope.likes.$value=1+$scope.likes.$value;
            
            likeRef.once('value',function(snapshot){
			  	if(snapshot.exists())
			  	{
					likeRef.set(snapshot.val()+1);
			  	}
			  	else
			  	{
			  		likeRef.set(1);
			  	}
				  	
			});
        }else{
            $scope.heartClass= 'ion-ios-heart-outline'
            console.log($scope.likes);
            $scope.likes.$value=-1+$scope.likes.$value;
            likeRef.once('value',function(snapshot){
			  	if(snapshot.exists())
			  	{
					likeRef.set(snapshot.val()-1);
			  	}
			  	else
			  	{
			  		likeRef.set(0);
			  	}
				  	
			});
        }
        
        
    }
    $scope.downLoad=function(){
    	var ref = new Firebase(FBURL);
    	

        ref.child('users/'+authData.uid+'/myLists').orderByChild('ListDownloadId')
        .startAt($stateParams.$id)
        .endAt($stateParams.$id)
        .once('value', function(snap) {
        	
            if(snap.hasChildren())
            {
            	console.log('exist ');
            }
            else
            {
            	var downloadItem = $stateParams;
		    	downloadItem.share=false;
		    	downloadItem.ListDownloadId=$stateParams.$id;
		    	delete downloadItem.$id;
		    	myListFirebase.$add(downloadItem).then(function(ref) {
				  $scope.downloads.$value=1+$scope.downloads.$value;
				  var DownloadRef=new Firebase(FBURL+"/users/"+uid+"/downloads");
				  DownloadRef.once('value',function(snapshot){
				  	console.log(snapshot.exists());
				  	if(snapshot.exists())
				  	{
						DownloadRef.set(snapshot.val()+1);
				  	}
				  	else
				  	{
				  		DownloadRef.set(1);
				  	}
				  	
				  });
				  
				});
            }
        });

    }
    
    $scope.viewPlace=function(item){
        console.log(item);
        $state.go('tab.placeDetailsListNearMe',item);
      }
    
})
    
.controller('FriendsCtrl', function($scope,$timeout,ionicMaterialMotion,ionicMaterialInk) {

    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

;
