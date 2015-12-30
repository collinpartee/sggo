angular.module('starter.spin', [])
.controller('spinCtrl', function($scope, $state,$firebaseObject, $interval, $timeout,$stateParams,$firebaseArray, $ionicHistory, FBURL,tables, global) {
    $scope.$parent.clearAllFabs();
console.log($stateParams);
    
    $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
    $scope.listName=$stateParams.ListName;
    $scope.listImg=$stateParams.listImg;
    console.log($scope.listImg);
var myName=global.getMyName();
    if($stateParams.from=='myList')
    {
      var words = $stateParams.places;
      var listSpinRef=new Firebase(FBURL+"/users/"+$stateParams.creater_id+"/myLists/"+$stateParams.$id);
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
          var listSpinRef=new Firebase(FBURL+"/users/"+uid+"/myLists/"+listkey);
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
        var listSpinRef = new Firebase('https://sggo.firebaseio.com/tables/'+$stateParams.listId);
        $scope.chats=$firebaseArray(listSpinRef.child('messages'));
          
      }

    }
      

      

      function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
      }
     // SECOND SPIN STYLE 
      $scope.shuffleButtonPressed = false;

      $scope.viewPlace=function(){
        console.log($scope.currPlace);
        $state.go('tab.placeDetailsListNearMe',$scope.currPlace);
      }


    $scope.shuffleButton =function(){
        $scope.countDown=5;
        $scope.shuffleButtonPressed = true;
        listSpinRef.child('triggers').once('value',function(datasnapshot){
            var newSpins=1;
            if(datasnapshot.exists())
            {
                var newSpins=datasnapshot.val()+1;
            }
            listSpinRef.update({'triggers':newSpins});
            
        })
        myName='System';
        var message=global.getMyName()+' just fugged ';
        $scope.sendMessage(message);
        listSpinRef.update({'ranNum':getRandomInt(0,words.length-1)});
        myName=global.getMyName();
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

})
.controller('viewListDetailCtrl', function($scope, $state,$firebaseObject, $interval, $timeout,$stateParams,$firebaseArray, $ionicHistory, FBURL,tables, global){
    $scope.placeDetial=$stateParams;
    
    $scope.$on('$ionicView.beforeEnter', function() {
            
            $scope.$root.hideTabsOnThisPage = true;
        });
})
;