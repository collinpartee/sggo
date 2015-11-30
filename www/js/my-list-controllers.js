angular.module('starter.myList', ['google.places'])

.controller('myListCtrl', function($scope, $state,$ionicListDelegate, $ionicModal, $ionicPopup, $timeout,$firebaseObject,$cordovaGeolocation, $cordovaKeyboard, authData, global, myListFirebase, myNearByList, tables,friendList) {
        
    var ref = new Firebase('https://sggo.firebaseio.com');
    var tableRef=new Firebase('https://sggo.firebaseio.com'+"/users/"+authData.uid+"/myTables");
    var tableRefObj=$firebaseObject(tableRef);
    tableRefObj.$loaded().then(function(data){
        tableRefObj.$bindTo($scope,'myTableLists');
    });

    $scope.myLists =myListFirebase;
    console.log($scope.myLists);



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


 //$cordovaKeyboard.disableScroll(true);

  $scope.friends=friendList;

    $scope.openListDetail= function()
    {
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
         $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            var lat  = position.coords.latitude;
            var lon = position.coords.longitude;

            global.setMyLoc({'lat':lat,'lon':lon});
            console.log("myloc ",global.getMyLoc());
        }, function(err) {
          // error
          console.log("myloc error");
          global.setMyLoc(37.38, -122.09)
        });
        //ADD  list Modal
        global.setCurrList({});
        $state.go('tab.listDetails');
    };
    
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
                        console.log('removed ');
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
                    //$state.go('tab.decisionTableList');
                }
              
          } else {
            console.log('You clicked on "Cancel" button');
          }
        });
      };

    //delete table
    $scope.deleteTable=function(k)
    {
        console.log(k);

        var rec=tables.$getRecord(k).inviteFriendList;
        var index=0;
        //remove myself from table invited friend list
        angular.forEach(rec, function (friend){
            console.log(friend);
            if(friend.key==authData.uid)
            {
                console.log("found match ",index);

                rec.splice(index);

                //remove table if friend list is 0
                if(rec.length==0)
                {
                    //thi shit didnt work,, why...-------------------------------
                    tables.$remove(tables.$getRecord(k)).then(function(ref) {
                      console.log('remove entry'); // true
                    });                    
                }

                tables.$save(tables.$getRecord(k)).then(function(ref) {
                  console.log('saved'); // true
                });

            }
            else
            index++
            console.log(index); 
        });
        //remove myself from friend's table's invite list
        //console.log(rec);
        angular.forEach(rec, function (friend){
            var friendRefObj=$firebaseObject(ref.child("users/"+friend.key+"/myTables/"+k));
            var idx=0;
            var keepgoing=true;
            friendRefObj.$loaded().then(function(data){
                console.log(friendRefObj.inviteFriendList);
                angular.forEach(friendRefObj.inviteFriendList, function (m){
                    if(keepgoing && m.key==authData.uid)
                    {
                        friendRefObj.inviteFriendList.splice(idx);

                        keepgoing=false;
                        friendRefObj.$save().then(function(ref) {
                          console.log("removed myself from friends table");
                        }, function(error) {
                          console.log("Error:", error);
                        });
                    }
                    idx++;
                    console.log("index",idx); 
                });
            });

        });

        
        //remove table from my list
        delete tableRefObj[k];
        tableRefObj.$save().then(function(ref) {
            console.log('saved tableRefObj');
        }); 

        

        tableRefObj.inviteFriendList;
        console.log("after",tables.$getRecord(k));
    }

    $scope.randomNumbersForLists = ['sfsdfsd', 'sdfsdfsd', 'sdfdsf', 'dsfdfsdffd', 'sdfdsfsdf', 'boo', 'bar', 'fuz', 'quark', 'booty'];
    
     $scope.showPopup = function(list) {
         console.log(list.places);
    // An elaborate, custom popup
         //<ul class="list"><li class="item">'+list.places+'</li></ul>
   var myPopup = $ionicPopup.show({
     template: '<ul class="list"><li class="item" ng-repeat="things in this.list">{{things}}</li></ul>',
     title: list.ListName,
     scope: $scope,
     buttons: [
       { text: 'Cancel',
            type: 'button-assertive'},
         { text: 'Edit'},
       {
         text: '<b>Spin</b>',
         type: 'button-positive',
         onTap: function(e) {
             console.log('clicked');
           $state.go('tab.spin',list);
         }
       },
     ]
   });
   myPopup.then(function(res) {
     console.log('Tapped!', res);
   });
     }
    
})

.controller('addListCtrl', function($scope, $state,$cordovaGeolocation,global,myListFirebase,geoFire,authData){
        
    $scope.categoryPics = ['../img/chicken.png', '../img/coffee.png', '../img/cupcake.png', '../img/egg.png', '../img/hamburger.png', '../img/hotdog.png', '../img/pizza.png', '../img/steak.png', '../img/french_fry.png' ];


    var currListItem=global.getCurrList();
    console.log('first call'+currListItem);

    var ref = new Firebase('https://sggo.firebaseio.com');
    var myName;
    getName(authData);

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
        $cordovaKeyboard.close()
    };
    
    $scope.saveList = function(name){
        var currListItem=global.getCurrList();
        currListItem['places']=$scope.placeList;
        console.log("place list "+JSON.stringify($scope.placeList));
        console.log("save button pressed "+JSON.stringify(currListItem));
        console.log("listname",name);

        var newList=true;
        console.log(currListItem.ListName+" tf "+newList);
        if(currListItem.ListName!=null)
        {
            
            $scope.ListName = currListItem.ListName;
            
            newList=false;
        }

        if(newList)
        {
            if(myName==null)
            {
                myName='oops not fast enough';
            }
           var finalList={'ListName':name,'creater_id':authData.uid,'creater_name':myName,'places':currListItem.places,'share':true};
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
    
    $scope.deletePlace = function(place){
        console.log($scope.placeList.indexOf(place));
       $scope.placeList.splice(place,1);
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

    function getName(authData) {

            ref.child('users/'+authData.uid+'/name').once('value', function(dataSnapshot) {
                console.log(dataSnapshot.val());
              myName= dataSnapshot.val();
            });

      };
    
    $scope.goBackToMyList = function(){
        $state.go('tab.myList');
    };


});
