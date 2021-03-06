angular.module('starter.friendList', [])

.controller('friendListCtrl', function($scope, $state,$ionicListDelegate, $ionicModal, $firebaseObject,$timeout,ionicMaterialMotion,ionicMaterialInk,authData,FBURL,global,friendList) {
    friendList.$loaded()
  .then(function(data) {
    friendList.$bindTo($scope, "friendList")
  })
  .catch(function(error) {
    console.error("Error:", error);
  });
       //add this to slider menu
  $scope.isExpanded = true;
  $scope.$parent.clearFabs();
  $scope.$parent.setHeaderFab('right');
  $scope.$on('applyEffect',function(e){
      // Set Motion
    
  
      console.log('triggered');
    $timeout(function(){

          ionicMaterialMotion.ripple();
          ionicMaterialInk.displayEffect();
        },0);
  });


  $scope.$on('addFriendClicked',function(e){
      // Set Motion
    $scope.email="";
    $scope.friendName="";
    $scope.modal.show();
  });
  $scope.deleteFriend= function(friend){
      console.log(JSON.stringify(friend));
    delete friendList[friend.key];
    friendList.$save();
  };
    
  $ionicModal.fromTemplateUrl('addFriend-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.searchResult=null;
  });  


  $scope.closeModal = function() {
      
    console.log($scope.modal.searchResult);
    if($scope.modal.searchResult==null)
    {
      console.log("empty");
    }
    else
    {
      friendList[$scope.modal.searchResult.key]=$scope.modal.searchResult;
        friendList.$save().then(function(ref) {
          var friendRef=ref.parent().parent().child($scope.modal.searchResult.key+'/friendList');
          var friedListObj= $firebaseObject(friendRef);
          ref.parent().once('value',function(snap){
              var me={name:snap.val().name,email:snap.val().email,key:snap.key(),avatar:snap.val().avatar};
              friedListObj[authData.uid]=me;
              friedListObj.$save();
          });
       }, function(error) {
              console.log("Error:", error);
            });  
    }
      $scope.modal.searched=false;
    $scope.modal.hide();
    };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
    
  $scope.close=function(){
        $scope.modal.searched=false;
        $scope.modal.hide();
  };
  $scope.searchFriend= function(email) {
      $scope.modal.searched=true;

      console.log(email);
        var ref = new Firebase(FBURL);
        ref.child('users').orderByChild('email')
        .startAt(email)
        .endAt(email)
        .once('value', function(snap) {
          var newFriend=  {};
            if(!snap.exists())
            {
                    console.log("dne");
                    $scope.modal.searchResult=null;
                    if(!$scope.$$phase) {
				console.log('diggest');	        				
                   $scope.$digest();

               }
            }
            else
            {
                 snap.forEach(function(s) {
                   newFriend={name:s.val().name,email:s.val().email,key:s.key(),avatar:s.val().avatar};
                   var friendName=$firebaseObject(s.ref().child('name'));
                    $scope.friendname=s.val().name;

                   console.log(newFriend); 
                    $scope.modal.searchResult=newFriend;
                    if(!$scope.$$phase) {
                    console.log('diggest');	        				
                       $scope.$digest();

                   }
              });                   
            }

            

          });
  };
    
});
