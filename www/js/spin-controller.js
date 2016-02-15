angular.module('starter.spin', [])
.controller('spinCtrl', function($scope, $state,$firebaseObject, $interval, $timeout,$stateParams,$ionicPopup,$firebaseArray, $ionicHistory, authData,friendList , FBURL,tables, global) {
    $scope.$parent.clearAllFabs();
console.log($stateParams);
    
    $scope.$on('$ionicView.beforeEnter', function() {
            
            $scope.$root.hideTabsOnThisPage = true;
        });
    
    $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
    $scope.listName=$stateParams.ListName;
    $scope.listImg=$stateParams.listImg;
    console.log($scope.listImg);
var myName=global.getMyName();
var listSpinRef;
    if($stateParams.from=='myList')
    {
      var words = $stateParams.places;
      listSpinRef=new Firebase(FBURL+"/users/"+$stateParams.creater_id+"/myLists/"+$stateParams.$id);
      $scope.chats=$firebaseArray(listSpinRef.child('messages'));
    }
    else
    {
      if($stateParams.from=='myListNearMe')
      {
         var words = $stateParams.places;
         var key=$stateParams.$id;
         var uid=key.substring(0,key.lastIndexOf(':'));
          var listkey=key.substring(key.lastIndexOf(':')+1,key.length);
          listSpinRef=new Firebase(FBURL+"/users/"+uid+"/myLists/"+listkey);
           $scope.chats=$firebaseArray(listSpinRef.child('messages'));

      }
      else
      {
        console.log('name',$stateParams.listId);
        var currTable=tables.$getRecord($stateParams.listId);
        //$scope.chats=$firebaseArray(currTable.messages);
        $scope.listImg=currTable.listImg;
        console.log(currTable);
        var words = currTable.places;

        //get chat list
        listSpinRef = new Firebase('https://sggo.firebaseio.com/tables/'+$stateParams.listId);
        $scope.chats=$firebaseArray(listSpinRef.child('messages'));
          
      }

    }
      

      

      function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
      }
     // SECOND SPIN STYLE 
      $scope.shuffleButtonPressed = false;

      $scope.viewPlace=function(){
        console.log('currplace: ' +$scope.currPlace);
        $state.go('tab.placeDetailsListNearMe',$scope.currPlace);
      }


    $scope.shuffleButton =function(){
        $scope.countDown=5;
        $scope.shuffleButtonPressed = true;
        listSpinRef.update({'ranNum':getRandomInt(0,words.length-1)}, function(error){
           listSpinRef.child('triggers').once('value',function(datasnapshot){
              var newSpins=1;
              if(datasnapshot.exists())
              {
                  var newSpins=datasnapshot.val()+1;
              }
              listSpinRef.update({'triggers':newSpins});
              
          })
          myName='System';
          var message=global.getMyName()+' just fugged your list';
          $scope.sendMessage(message);
          
          myName=global.getMyName();         
        });

    };
    $scope.countDown=5;
     var runCounter = function() {
        if ( $scope.ccountDown<=0 )
        {
          $scope.countDown=5;
          return;
        } 
            
        $scope.countDown -= 1;            
        if ( $scope.countDown > 0)        
            $timeout(runCounter, 1000); 
    }
    $(function(){
	
	// container is the DOM element;
	// userText is the textbox
	     
        var container = $("#container")
        
        listSpinRef.child('triggers').on('value', function(datasnapshot){
            listSpinRef.child('ranNum').once('value',function(snap){
                $scope.shuffleButtonPressed = true;
                var currnum=snap.val()==null? 0:snap.val();
                console.log('currnum',currnum);
                $scope.currPlace=words[currnum];
                container.shuffleLetters({
                    "text": words[currnum].name
                    
                });
                runCounter();
                $scope.countDown=5;
            });
             
        });
			// The return key was pressed
			
       
			

	
    });
    


    $scope.sendMessage=function(message){
      console.log(message);
      var meessageEntry={'user':myName,'message':message,'createdAt':Firebase.ServerValue.TIMESTAMP};
      $scope.chats.$add(meessageEntry);
      if($scope.chats.length>10)
      {
          $scope.chats.$remove(0);
      }
      this.message="";
    }

    $scope.goBackAndShowTabBar = function(){
        $scope.$root.tabsHidden = "tabs-show";
        $scope.$root.hideTabsOnThisPage = false;
        //$ionicGoBack();
    };


    var invitationsRef=new Firebase(FBURL+"/users/"+authData.uid+'/invitations');
    var invitationObject=$firebaseObject(invitationsRef);
    var date = new Date();
    
    $scope.invite=function(){
      var limit=2
      if(invitationObject[date.getFullYear()+" "+(date.getMonth()+1)+" "+date.getDate()]==null || invitationObject[date.getFullYear()+" "+(date.getMonth()+1)+" "+date.getDate()].$value<limit)
      {
       var alertPopup = $ionicPopup.confirm({
         title: "Invitatation",
         template: 'Inviate '+$stateParams.creater_name+' to '+$scope.currPlace.name+" ?"
       });
       alertPopup.then(function(res) {
         //add as friend
         var friendEmailRef=new Firebase(FBURL+"/users/"+$stateParams.creater_id+'/email');
          friendEmailRef.once('value',function(snap){
            console.log('emali',snap.val());
            var friend={name:$stateParams.creater_name,email:snap.val(),key:$stateParams.creater_id,avatar:$stateParams.avatar};
            console.log(friend);
            addFriend(friend,$scope.currPlace.name);
            console.log('Thank you for not eating my delicious ice cream cone');
          });
         
       });        
      }
      else
      {
        var alertPopup = $ionicPopup.alert({
         title: "You've reached your daily limit",
         template: 'You can only invite '+(limit-1)+" time(s) per day"
       });
      }
        



    }
    var addFriend = function(friend,inivteplace){
      friendList[friend.key]=friend;
        friendList.$save().then(function(ref) {
          var friendRef=new Firebase(FBURL+"/users/"+$stateParams.creater_id);
          var friedListObj= $firebaseObject(friendRef);
          ref.parent().once('value',function(snap){
            console.log('add me to friend');
              var me={name:snap.val().name,email:snap.val().email,key:snap.key(),avatar:snap.val().avatar};
              friedListObj[authData.uid]=me;
              console.log('me',me);
              friedListObj.$save().then(function(reff) {
                //send invite
                console.log('send invite');
                  var index= authData.uid>$stateParams.$id ? authData.uid+$stateParams.creater_id : $stateParams.creater_id+authData.uid;
                  var listSpinRef=new Firebase(FBURL+"/chats/"+index);
                  var chats=$firebaseArray(listSpinRef.child('messages'));
                  var meessageEntry={'user':authData.uid,'message':me.name+' would like to invate you to '+inivteplace,'createdAt':Firebase.ServerValue.TIMESTAMP};
                  chats.$add(meessageEntry).then(function(ref) {
                      var alertPopup = $ionicPopup.alert({
                         title: "Message has been sent",
                         template: 'You can check his/her response in Friend tab'
                       });
                  
                      console.log(date.getFullYear(),date.getMonth(),date.getDate());
                      invitationObject[date.getFullYear()+" "+(date.getMonth()+1)+" "+date.getDate()]=1;
                      invitationObject.$save();
                  }, function(error) {
                    console.log("Error:", error);
                  });

          });
       }, function(error) {
              console.log("Error:", error);
        });
      
    });
}

})
.controller('viewListDetailCtrl', function($scope, $state,$firebaseObject, $interval, $timeout, $ionicPopup ,$stateParams,$firebaseArray, $ionicHistory, $cordovaClipboard, FBURL,tables, global){
    $scope.$parent.clearAllFabs();
    $scope.placeDetial=$stateParams;
    
    $scope.$on('$ionicView.beforeEnter', function() {
            
            $scope.$root.hideTabsOnThisPage = true;
        });
    $scope.gotoWebsite=function(pd)
    {
        window.open(pd.website,'_system','location=yes');
    }
    
    $scope.gotoAddress=function(addr){
        window.open('maps://maps.google.com/?daddr=' + addr, '_system');
    }
    $scope.showCouponCode = function() {
            $ionicPopup.confirm({
              title: 'Success',
              templateUrl: 'showCouponCode-popUp.html',
                cancelText: 'close',
                okText: 'use'
            }).then(function(res) {
//              console.log('Test Alert Box');
            });
          };
    
     $scope.copyText = function() {
        $cordovaClipboard.copy('value').then(function() {
            console.log("Copied text");
        }, function() {
            console.error("There was an error copying");
        });
    }
    
})
;