angular.module('starter.controllers', [])

.controller('WelcomeCtrl', function($scope, $state,Auth) {

    $scope.dontLogin = function(){
        $state.go('tab.dash');
    };
    
    $scope.user = null;

  // Logs a user in with Facebook
  // Calls $authWithOAuthPopup on $firebaseAuth
  // This will be processed by the InAppBrowser plugin on mobile
  // We can add the user to $scope here or in the $onAuth fn
  $scope.googleLogin = function scopeLogin() {
    Auth.loginWithGoogle()
    .then(function(authData){
      console.log('We are logged in!', authData);
        $state.go('tab.dash');
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  // Logs a user out
  $scope.logout = Auth.logout;

  // detect changes in authentication state
  // when a user logs in, set them to $scope
  Auth.onAuth(function(authData) {
    $scope.user = authData;
  });

})

.controller('DashCtrl', function($scope, $state) {

    $scope.lists = [
        {title: 'Steak', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Sandwhich', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Breakfast', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']}
    ];

})

.controller('ChatsCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
        $scope.lists = [
        {title: 'Steak', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Sandwhich', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Breakfast', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']}
    ];

})

.controller('ChatDetailCtrl', function($scope) {

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
