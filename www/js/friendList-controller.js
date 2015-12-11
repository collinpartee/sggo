angular.module('starter.friendList', [])

.controller('friendListCtrl', function($scope, $state,$ionicListDelegate, $ionicModal, $firebaseObject,authData,FBURL,global,friendList) {
    friendList.$loaded()
  .then(function(data) {
    friendList.$bindTo($scope, "friendList")
  })
  .catch(function(error) {
    console.error("Error:", error);
  });
       //add this to slider menu
    $scope.$parent.clearFabs();
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
    $scope.searchResult={};
  });  

  $scope.openModal = function() {
    $scope.email="";
    $scope.friendName="";
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    friendList[$scope.searchResult.key]=$scope.searchResult;
      friendList.$save().then(function(ref) {
        var friendRef=ref.parent().parent().child($scope.searchResult.key+'/friendList');
        var friedListObj= $firebaseObject(friendRef);
        ref.parent().once('value',function(snap){
            var me={name:snap.val().name,email:snap.val().email,key:snap.key(),avatar:snap.val().avatar};
            friedListObj[authData.uid]=me;
            friedListObj.$save();
        });
     }, function(error) {
            console.log("Error:", error);
          });
        $scope.modal.hide();
      };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
    
  $scope.searchFriend= function(email) {
      console.log(email);
        var ref = new Firebase(FBURL);
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
