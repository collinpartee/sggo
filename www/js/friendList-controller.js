angular.module('starter.friendList', [])

.controller('friendListCtrl', function($scope, $state,$ionicListDelegate, $ionicModal, global,friendList) {
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
    
  $scope.searchFriend= function(email) {
      console.log(email);
        var ref = new Firebase('https://sggo.firebaseio.com');
        ref.child('users').orderByChild('email')
        .startAt(email)
        .endAt(email)
        .once('value', function(snap) {
            console.log(JSON.stringify(snap.val()));
            snap.forEach(function(s) {
                console.log(JSON.stringify(s.val()));
               var newFriend={name:s.val().name,email:s.val().email,key:s.key()};
               console.log(JSON.stringify(newFriend));
               friendList.$add(newFriend);
               $scope.searchResult=newFriend.name;
          });

        });
  };
    
});
