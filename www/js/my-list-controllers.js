angular.module('starter.myList', ['google.places'])
.controller('myListCtrl', function($scope, $state,$ionicListDelegate,$location,$ionicModal, $ionicPopup, $timeout,$firebaseObject,$filter,ionicMaterialInk, ionicMaterialMotion,$cordovaGeolocation, $cordovaKeyboard, FBURL,authData, global, myListFirebase, tables,friendList) {
//    $('.profile').initial({name:myLists.name});
    //$scope.$parent.showHeader();
    $scope.isExpanded = true;
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('right');
    $scope.$on('applyEffect',function(e){
        // Set Motion
      
    
        console.log('triggered');
      $timeout(function(){

            ionicMaterialMotion.ripple();
            ionicMaterialInk.displayEffect();
            $('.profile').initial();
          },0);
        
        // Activate ink for controller
		    ionicMaterialInk.displayEffect();
    });

    
    
    var ref = new Firebase(FBURL);
    var tableRef=new Firebase(FBURL+"/users/"+authData.uid+"/myTables");
    var tableRefObj=$firebaseObject(tableRef);
    tableRefObj.$loaded().then(function(data){
        tableRefObj.$bindTo($scope,'myTableLists');
    });

    $scope.myLists =myListFirebase;
    console.log($scope.myLists);

    
    $scope.setInfo = function(authData){
            ref.child("users").child(authData.uid).child('name').once('value', function(dataSnapshot) {
              global.setMyName(dataSnapshot.val());
            });
            ref.child("users").child(authData.uid).child('avatar').once('value', function(dataSnapshot) {
              global.setMyAvatar(dataSnapshot.val());
            });
    };
    $scope.setInfo(authData);
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
        
        $state.go('tab.listDetails');
        $scope.$root.tabsHidden = "tabs-hide";
    };
    
    var friendlyList = [];
    $scope.addFriendToList = function(friend, checked){
       // console.log(checked);
        
        var lookup = {};           
            if(checked == true){
                console.log('friend',friend);
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

      $scope.showAlert = function(options) {
       var alertPopup = $ionicPopup.alert({
           title: options.title,
           template: options.template
         });
         alertPopup.then(function(res) {
           $state.go('tab.myList');
           console.log('Thank you for not eating my delicious ice cream cone');
         });
       };
    
  // Confirm popup code
      $scope.shareListWithFriends=function(list){
        console.log(list.ListName);
        if(false)
        {
          
          var options={title: 'Your group list is full', template:'Sorry, you can only have 10 groups'};
          
          $scope.showAlert(options);
        }
        else
        {
          shareListWithFriendsGo(list);
        }
      }
      var shareListWithFriendsGo = function(list) {
        console.log(tables.length);

        $ionicListDelegate.closeOptionButtons();
        $scope.currTable={inviteFriendList:[],places:list.places};
        var confirmPopup = $ionicPopup.confirm({
          title: 'Choose Your Friends',
          templateUrl: 'shareListWithFriends-Popup.html',
            scope: $scope,
            cancelText: 'Done'
        });
        confirmPopup.then(function(res) {
          if(res) {
                $scope.currTable.inviteFriendList=friendlyList;
                console.log($scope.currTable);
                $scope.currTable.ListName=list.ListName+' group';
                $scope.currTable.creater_name=list.creater_name;
                 if($scope.currTable.ListName!=null)
                {
                    var userRef=ref.child('users/'+authData.uid);
                    userRef.once('value',function(snap){
                        console.log(snap.val());
                        var addSefl={name:snap.val().name,email:snap.val().email,key:authData.uid,avatar:snap.val().avatar};
                        $scope.currTable.inviteFriendList.push(addSefl);
                        $scope.currTable.tags=list.tags;
                        $scope.currTable.listImg=list.listImg;
                        if($scope.currTable.tags==null)
                        {
                            $scope.currTable.tags=[];
                        }
                        //add table to friend's table list
                        delete $scope.currTable.$id;
                        delete $scope.currTable.$priority;
                        delete $scope.currTable.places.$id;
                        delete $scope.currTable.places.$priority;
                        console.log($scope.currTable);
                        tables.$add(angular.copy($scope.currTable)).then(function(refAdd){
                            angular.forEach($scope.currTable.inviteFriendList, function(friend) {
                                //console.log(friend.name);
                                var friendRefObj=$firebaseObject(ref.child("users/"+friend.key+"/myTables"));
                                var myTableEntry={inviteFriendList:$scope.currTable.inviteFriendList,'ListName':$scope.currTable.ListName,'creater_name':list.creater_name,tags:$scope.currTable.tags,listImg:list.listImg};
                                
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
        console.log("id",k);

        if(tables.$getRecord(k)==null)
        {

        }
        else
        {
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
                        tables.$ref().child(k).remove();                  
                    }
                    else
                    {
                        tables.$save(tables.$getRecord(k)).then(function(ref) {
                          console.log('saved'); // true
                        });
                    }


                }
                index++
                console.log(index); 
                $ionicListDelegate.closeOptionButtons();
            });
            //remove myself from friend's table's invite list
            //console.log(rec);
            angular.forEach(rec, function (friend){
                console.log("users/"+friend.key+"/myTables/"+k);
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
        }
        


        
        //remove table from my list
        delete tableRefObj[k];
        tableRefObj.$save().then(function(ref) {
            console.log('saved tableRefObj');
        }); 

    }

    $scope.showEditMyListPage = function(){
        $state.go('tab.');
    };
    


$scope.goToEditListPage = function(list){

    if(typeof list == 'string')
    {
        var tableItemRef = new Firebase('https://sggo.firebaseio.com/tables/'+list);
        tableItemRef.once('value',function(data){
            
            var listItem=data.val();
            listItem.listId=list;
            console.log(listItem);
            $state.go('tab.editMyListTable',listItem);
        });
        
    }
    else
    {
        $state.go('tab.editMyList',list);
    }
}
    
    
})

.controller('editListCtrl', function($scope, $state,$stateParams,$firebaseObject,$filter,$ionicListDelegate,$ionicPopup,$timeout,tables,ionicMaterialMotion,FBURL,authData,ionicMaterialInk,friendList){

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    var ref = new Firebase(FBURL);
    //$scope.$parent.setHeaderFab('right');
    // Set Motion

    
       $scope.$on('$ionicView.beforeEnter', function() {
            
            $scope.$root.hideTabsOnThisPage = true;
        });
        $scope.$on('$ionicView.leave', function() {
            
            $scope.$root.hideTabsOnThisPage = false;
        });
        //$scope.chats=$firebaseArray(currTable.messages);
        console.log($stateParams);

        $scope.listItem=$stateParams;

    $scope.$on('editClicked',function(){
        console.log('triggered edit clicked');
        if($scope.option)
        {
            if($stateParams.from == 'myTable')
            {
                $state.go('tab.listDetails',$stateParams);
            }
            else
            {
                $state.go('tab.listDetails',$stateParams);
                
            } 
        }
        else
        {
            console.log("invite more friend");
            $scope.shareListWithFriends($stateParams);
        }

    });


    $scope.goSpin =  function(){
        if($stateParams.from == 'myTable')
        {
            $state.go('tab.spinTable',{'listId':$stateParams.listId});
        }
        else
        {
            $state.go('tab.spin',$stateParams);
        }
    }
    $scope.option=true;
    $scope.optionClicked=function(){
        $scope.inviteFriend=false;
        $scope.option=true;
        $scope.$emit('changeToEditList');
    }
    $scope.inviteFriendClicked=function(){
        $scope.option=false;
        $scope.inviteFriend=true;
        $scope.$emit('changeToAddFriend');

    }
    console.log(friendList)
    $scope.friends={};
    var idx=0;

    console.log($scope.friends);
    var friendlyList=[];
    if($stateParams.from=='myTable')
    {
        console.log(friendList);
        console.log($stateParams.inviteFriendList);
        angular.forEach(friendList, function(value, key) {
        var found=false;    
            angular.forEach($stateParams.inviteFriendList, function (value, search) {
                 found =false;
                if(key==value.key)
                    {
                        console.log('found');
                        found= true;
                    }
                else{
                    console.log('notFoudn');
                }
            });

      if(found)
      {
        console.log('found',found);
      }
      else
      {

        $scope.friends[key]=friendList[key];
      }
      idx++;
      console.log(idx);
    });
    }
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
        $ionicListDelegate.closeOptionButtons();
        $scope.currTable={inviteFriendList:[],places:list.places};
        var confirmPopup = $ionicPopup.confirm({
          title: 'Choose Your Friends',
          templateUrl: 'shareListWithFriends-Popup.html',
            scope: $scope
        });
        confirmPopup.then(function(res) {
          if(res) {
                angular.forEach(friendlyList, function(friend) {
                    tables.$getRecord($stateParams.listId).inviteFriendList.push(friend);
                    $scope.listItem.inviteFriendList.push(friend);
                });
                tables.$save(tables.$getRecord($stateParams.listId)).then(function(ref) {
                  if(!$scope.$$phase) {
                      $scope.$digest();
                    }
                });
            
              
          } else {
            console.log('You clicked on "Cancel" button');
          }
        });
      };
    
    $scope.goToPlaceDetails = function(){
        $state.go('tab.placeDetails');
    };
    
    $scope.viewPlace=function(item){
        console.log(item);
        $state.go('tab.placeDetailsMyList',item);
      }

})
.controller('addListCtrl', function($scope, $state, $ionicHistory, $stateParams, $cordovaGeolocation, $ionicPopup, $http, FBURL,global,myListFirebase,geoFire,authData){
        console.log('list size',myListFirebase.length);


        $scope.showAlert = function(options) {
         var alertPopup = $ionicPopup.alert({
             title: options.title,
             template: options.template
           });
           alertPopup.then(function(res) {
             $state.go('tab.myList');
             console.log('Thank you for not eating my delicious ice cream cone');
           });
         };

        if(myListFirebase.length>10 && $stateParams.$id=='none')
        {
          var options={title: 'Your list is full', template:'Sorry, you can only have 10 lists'};
          $scope.showAlert(options);
        }
        $scope.$parent.clearAllFabs();
    
        $scope.$on('$ionicView.beforeEnter', function() {
            
            $scope.$root.hideTabsOnThisPage = true;
        });
    

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };    
    
        $scope.goNameList = function(){
            currListItem.places=$scope.placeList;
            console.log('befre',currListItem);
            if($stateParams.from=='myList' || $stateParams.from=='')
            {
                $state.go('tab.nameList',currListItem);
            }
            else{
                console.log($stateParams);
                ref.child('tables/'+$stateParams.listId+'/places').set($stateParams.places);
                $state.go('tab.editMyListTable',$stateParams);
            }
        
        };

    var currListItem=$stateParams;
    console.log('first call'+JSON.stringify($stateParams));

    var ref = new Firebase(FBURL);
    var myName=global.getMyName();
    

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
    $scope.listName= currListItem.ListName;
    $scope.tags=currListItem.tags;
    $scope.publicList=currListItem.share;
    if($scope.placeList==null)
    {
        $scope.placeList=[];
    }
        
    $scope.removePlace=function(index){
      console.log(index);
      $scope.placeList.splice(index,1);
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
                {
                    _place['weekday_text']=place.opening_hours.weekday_text;
                }
                if(place.price_level)
                    _place['price_level']=place.price_level;
                if(place.rating)
                    _place['rating']=place.rating;
                if(place.vicinity)
                    _place['vicinity']=place.formatted_address;
                if(place.price_level)
                    _place['price_level']=place.price_level;
                if(place.formatted_phone_number)
                    _place['phone']=place.formatted_phone_number;
                if(place.website)
                    _place['website']=place.website;
                if(place.photos)
                {
                    _place['icon']=place.photos[0].getUrl({ 'maxWidth': 200, 'maxHeight': 200 });
                }
                else
                {
                        _place['icon']='img/icons/'+getRandomInt(1,30)+'.png';
                }
            }
            else
            {
                _place['name']=place;
//                _place['icon']='img/drawn_icons/'+getRandomInt(0,11)+'.jpg';
                _place['icon']='img/icons/'+getRandomInt(1,30)+'.png';
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
        //$cordovaKeyboard.close()
    };
    
    $scope.saveList = function(name,tags,publicList,anon){
        var currListItem={};
        currListItem['places']=$stateParams.places;
        currListItem['tags']=tags;
        console.log("place list "+currListItem['places']);
        console.log("save button pressed "+JSON.stringify(currListItem));
        console.log("listname",name);
        console.log("tags",tags);
        var newList=true;
        console.log(currListItem.ListName+" tf "+newList);
        if(currListItem.ListName!=null)
        {
            
            $scope.ListName = currListItem.ListName;
            
            newList=false;
        }

        if($stateParams.$id=='none')
        {
            if(myName==null)
            {
                myName='oops not fast enough';
            }
            if(name==null)
            {
                name='Not Named';
            }
            console.log(publicList)
            if(anon==true)
            {
                myName='Too Afraid to show name';

            }
//            var img='img/drawn_icons/'+getRandomInt(0,11)+'.jpg';
//image limit
            var img='img/food_bkgds/'+getRandomInt(0,13)+'.jpg';

//            var finalList={'ListName':name,'creater_id':authData.uid,'creater_name':myName,'places':currListItem.places,'tags':currListItem.tags,'share':publicList,'listImg':img};
            var finalList={'ListName':name,'creater_id':authData.uid,'creater_name':myName,'places':currListItem.places,'tags':currListItem.tags,'share':publicList,listImg:img};
            
           //add to my list
           console.log("final list",finalList);
           myListFirebase.$add(finalList)
           .then(function(ref) {
                if(publicList==true)
                {
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
                }else
                {
                    //donot share
                }
              
            });

        }
        else
        {
          //this is edit
            var item= myListFirebase.$getRecord($stateParams.$id);
            console.log('scope'+$scope.ListName);
            item.ListName=name;
            item.places=currListItem.places;
            item.tags=currListItem.tags;
            item.share=publicList;
            item.creater_name=myName;

            myListFirebase.$save(item)
            .then(function(ref) {
                var id = ref.key();
                var key =authData.uid+':'+id;
                if(publicList==true)
                {
                   
                
                  var lat=global.getMyLoc().lat
                  var lon=global.getMyLoc().lon
                  console.log(key,lat,lon);
                    geoFire.set(key, [lat, lon]).then(function() {
                      console.log("Provided key has been added to GeoFire");
                    }, function(error) {
                      console.log("Error: " + error);
                     }); 
                }else
                {
                    //remove from nearbylist
                    geoFire.remove(key);
                }
              
            });
        }


        $state.go('tab.myList');
        $scope.$root.tabsHidden = "tabs-show";
    };
    
    $scope.deletePlace = function(place){
        console.log($scope.placeList.indexOf(place));
       $scope.placeList.splice(place,1);
    };
    
     //new new 

    $scope.goBackToMyList = function(){
        $state.go('tab.myList');
    };

    function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      $scope.loadTags = function(query) {
        var taglists=[
                        {'text':'food'},
                        {'text':'american'},
                        {'text':'chinese'},
                        {'text':'japanese'},
                        {'text':'italian'},
                        {'text':'mexican'},
                        {'text':'noodles'},
                        {'text':'drinks'},
                        {'text':'new'},
                        {'text':'old'},
                        {'text':'gottaTry'},
                        {'text':'gross'},
                        {'text':'cheap'},
                        {'text':'expensive'},
                        {'text':'african'},
                        {'text':'soulFood'},
                        {'text':'chicken'},
                        {'text':'desert'},
                        {'text':'breakfast'},
                        {'text':'lunch'},
                        {'text':'dinner'},
                        {'text':'snack'},
                        {'text':'texMex'},
                        {'text':'yummy'},
                        {'text':'great'},
                        {'text':'amazing'},
                        {'text':'good'},
                        {'text':'needInMyLife'},
                        {'text':'life'},
                        {'text':'fleek'}
                    ];
          return taglists;
      };
    
    $scope.goBackAndShowTabBar = function(){
        $scope.$root.tabsHidden = "tabs-show";
        $scope.$root.hideTabsOnThisPage = false;
        //$ionicGoBack();
    };
         

});