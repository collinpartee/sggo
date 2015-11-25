angular.module('starter.friendList', [])

.controller('friendListCtrl', function($scope, $state,$ionicListDelegate, $ionicModal, $firebaseObject,global,friendList) {
    $scope.friendList = friendList;
       //add this to slider menu
    
  $scope.deleteFriend= function(friend){
      console.log(JSON.stringify(friend));
    friendList.$remove(friend);
  };
    
  $ionicModal.fromTemplateUrl('addFriend-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.searchResult={};
  });  

  $scope.openModal = function() {
    $scope.email="";
    $scope.friendName="";
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    var exist=false;
    angular.forEach(friendList, function(f) {
            console.log(f.email);
            if(f.email==$scope.searchResult.email)
            {
              console.log('ext ',f.email);
              exist= true;
            }
        });
    if(!exist)
    {
      friendList.$add($scope.searchResult);
    }


    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
    
  $scope.searchFriend= function(email) {
      console.log(email);
        var ref = new Firebase('https://sggo.firebaseio.com');
        ref.child('users').orderByChild('email')
        .startAt(email)
        .endAt(email)
        .once('value', function(snap) {
          var newFriend=  {};
            snap.forEach(function(s) {
               newFriend={name:s.val().name,email:s.val().email,key:s.key(),avatar:s.val().avatar};
               var friendName=$firebaseObject(s.ref().child('name'));
               friendName.$bindTo($scope, "friendname");
               console.log(friendName);   
          });
          $scope.searchResult=newFriend;
          console.log($scope.searchResult.name);    

          });
  };
    
});
