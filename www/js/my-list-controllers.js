angular.module('starter.myList', ['google.places'])

.controller('myListCtrl', function($scope, $state,$ionicListDelegate, $ionicModal, $ionicPopup, $timeout,$firebaseObject, global,myListFirebase,myNearByList,tables,friendList) {
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();

    $scope.myLists =myListFirebase;
    console.log($scope.myLists);

    $scope.addNewList = function(){
    global.setCurrList({});
    $state.go('tab.listAdd');
    };

    $scope.editList = function(listItem){
         console.log('edit '+JSON.stringify(listItem));
        global.setCurrList(listItem);
        global.setPrevList(listItem.$id);
        $state.go('tab.listAdd');
        $ionicListDelegate.closeOptionButtons();
    };
    
    $scope.deleteList=function(listItem){ 
         
        //$scope.myLists.splice(listItem); 
        $ionicListDelegate.closeOptionButtons();
        //var itemRef = new Firebase('https://sggo.firebaseio.com/users/'+authData.uid+'/myLists' + listItem.$id);
        //might need callback later
        $scope.myLists.$remove(listItem).then(function(ref){
            var removeRef = new Firebase('https://sggo.firebaseio.com/geoData/'+authData.uid+':'+ref.key());
            console.log('https://sggo.firebaseio.com/geoData/'+authData.uid+':'+ref.key());
            removeRef.remove();
            
        });
    };

    $scope.goToDecisionTable=function(listItem){ 
        global.setCurrList(listItem);   
        $state.go('tab.decisionTable');
    };

    $scope.shareList=function(listItem){ 
        global.setCurrList(listItem);   
        $state.go('tab.decisionTableDetail');
    };

    //add new list modal window
      $ionicModal.fromTemplateUrl('addList-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });  

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  $scope.friends=friendList;

    
    
    var friendlyList = [];
    $scope.addFriendToList = function(friend, checked){
       // console.log(checked);
        
        var lookup = {};           
            if(checked == true){
                friendlyList.push(friend);
            }else{
                for(var i = 0; i < friendlyList.length; i++) {
                    var obj = friendlyList[i];

                    if(friend.key == friendlyList[i].key) {
                        friendlyList.splice(i, 1);
                        i--;
                    }
                }
            }
           
            
            //console.log(lookup.key);
        
        
        //console.log(friendlyList);
    };
    
  // Confirm popup code
      $scope.shareListWithFriends = function(list) {
        $scope.currTable={inviteFriendList:[],choices:list.places};
        var confirmPopup = $ionicPopup.confirm({
          title: 'Choose Your Friends',
          templateUrl: 'shareListWithFriends-Popup.html',
            scope: $scope
        });
        confirmPopup.then(function(res) {
          if(res) {
                $scope.currTable.inviteFriendList=friendlyList;
                console.log($scope.currTable);
                $scope.currTable.tableName=list.ListName;
                $scope.currTable.creator=list.creater_name;
                 if($scope.currTable.tableName!=null)
                {
                    var userRef=ref.child('users/'+authData.uid);
                    userRef.once('value',function(snap){
                        console.log(snap.val());
                        var addSefl={name:snap.val().name,email:snap.val().email,key:authData.uid};
                        $scope.currTable.inviteFriendList.push(addSefl);
                        //add table to friend's table list
                        delete $scope.currTable.$id;
                        delete $scope.currTable.$priority;
                        delete $scope.currTable.choices.$id;
                        delete $scope.currTable.choices.$priority;
                        tables.$add(angular.copy($scope.currTable)).then(function(refAdd){
                            angular.forEach($scope.currTable.inviteFriendList, function(friend) {
                                //console.log(friend.name);
                                var friendRefObj=$firebaseObject(ref.child("users/"+friend.key+"/myTables"));
                                var myTableEntry={inviteFriendList:$scope.currTable.inviteFriendList,tableName:list.ListName,creator:list.creater_name};
                                
                                friendRefObj.$loaded().then(function(data){
                                    friendRefObj[refAdd.key()]=myTableEntry;
                                    friendRefObj.$save();
                                });

                                // console.log(friend);
                                // tableEntryRef=ref.child("users/"+friend.key+"/myTables").push();

                                // console.log(angular.copy($scope.currTable));
                                // tableEntryRef.set(angular.copy($scope.currTable));

                            
                            });                    
                        });

                    });
                    $state.go('tab.decisionTableList');
                }
              
          } else {
            console.log('You clicked on "Cancel" button');
          }
        });
      };

    
})

.controller('addListCtrl', function($scope, $state,$cordovaGeolocation,global,myListFirebase){


    $scope.categoryPics = ['../img/chicken.png', '../img/coffee.png', '../img/cupcake.png', '../img/egg.png', '../img/hamburger.png', '../img/hotdog.png', '../img/pizza.png', '../img/steak.png', '../img/french_fry.png' ];


    var currListItem=global.getCurrList();
    console.log('first call'+currListItem);

    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();

    $scope.openModalIni = function(){
            var posOptions = {timeout: 10000, enableHighAccuracy: false};


            // while(global.getMyLoc()!="none")
            // {
            //     console.log('null');
            // }
            var lat=global.getMyLoc().lat
            var lon=global.getMyLoc().lon
          console.log(lat);
          var bruceHouse = new google.maps.LatLng(lat, lon);

            $scope.autocompleteOptions = {
                types: ['establishment'],
                location: bruceHouse,
                radius: '1000'
            };

        console.log(lat);
        $scope.openModal();
    }

    

    
    $scope.placeList = currListItem.places;
    if($scope.placeList==null)
    {
        $scope.placeList=[];
    }
        
    
    $scope.addToList = function(place){
        console.log(place);
        var _place={};
        if(place!=null)
        {
            if(typeof place =='object')
            {
                _place['name']=place.name;
                if(place.opening_hours)
                    _place['weekday_text']=place.opening_hours.weekday_text;
                if(place.price_level)
                    _place['price_level']=place.price_level;
                if(place.rating)
                    _place['rating']=place.rating;
                if(place.vicinity)
                    _place['vicinity']=place.vicinity;
            }
            else
            {
                _place['name']=place;
                
            }
            
            $scope.placeList.push(_place);
    //        $scope.myList[place.id] = place.name;
            console.log($scope.placeList);
        }
        else
        {
            //alert
        }
        this.place=null;
    };
    
    $scope.saveList = function(){
        
        currListItem['places']=$scope.placeList;
        console.log("place list "+JSON.stringify($scope.placeList));
        console.log("save button pressed "+JSON.stringify(currListItem));
        
        global.setCurrList(currListItem);
        $scope.closeModal();
        $state.go('tab.listDetails');
        
    };
    
    $scope.deletePlace = function(place){
        console.log($scope.placeList.indexOf(place));
       $scope.placeList.splice($scope.placeList.indexOf(place),1);
    };
    
     //new new 

    $scope.numberOfListItems = [];
    $scope.numberOfListItems.push({});
    $scope.addListItem = function(place){
            console.log('place' + place);
            $scope.numberOfListItems[$scope.numberOfListItems.length-1]={'name':place};
            $scope.numberOfListItems.push({});
    };

 // Define $scope.place as an array
    $scope.place = [];
    // Create a counter to keep track of the additional place inputs
    $scope.inputCounter = 0;




})
.controller('saveListCtrl', function($scope, $state,$cordovaGeolocation,global,myListFirebase,geoFire){
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    var currListItem=global.getCurrList();
    var newList=true;
    console.log(currListItem.ListName+" tf "+newList);
    if(currListItem.ListName!=null)
    {
        
        $scope.ListName = currListItem.ListName;
        
        newList=false;
    }
    console.log(currListItem.ListName+" tf "+newList);
    $scope.saveListWithName = function(name){
        //save list to lists
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        if(newList)
        {
           var finalList={'ListName':name,'creater_id':authData.uid,'creater_name':getName(authData),'places':currListItem.places,'share':true};
           //add to my list
           myListFirebase.$add(finalList)
           .then(function(ref) {
              var id = ref.key();
              var key =authData.uid+':'+id;

              var lat=global.getMyLoc().lat
              var lon=global.getMyLoc().lon
                  console.log(key,lat,lon);
                    geoFire.set(key, [lat, lon]).then(function() {
                      console.log("Provided key has been added to GeoFire");
                    }, function(error) {
                      console.log("Error: " + error);
                     });
            });

        }
        else
        {

            var item= myListFirebase.$getRecord(global.getPrevList());
            console.log("getPrevList "+JSON.stringify(global.getPrevList()));
            console.log('scope'+$scope.ListName);
            item.ListName=name;
            item.places=currListItem.places;
            myListFirebase.$save(item);
        }
        global.setCurrList({});
        $state.go('tab.myList');  
    };

    function getName(authData) {
        switch(authData.provider) {
           case 'google':
             return authData.google.displayName;
           case 'twitter':
             return authData.twitter.displayName;
           case 'facebook':
             return authData.facebook.displayName;
        }
      };
});
