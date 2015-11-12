angular.module('starter.controllers', [])

.controller('WelcomeCtrl', function($scope, $state,Auth) {

    $scope.dontLogin = function(){
        $state.go('tab.myList');
    };
    
  $scope.user = null;
  var itemRef = new Firebase('https://sggo.firebaseio.com/');

  //if user already aunthenticated
  Auth.onAuth(authDataCallback);
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      $state.go('tab.myList');
    } else {
      console.log("User is logged out");
    }
  }
  // Logs a user in with Facebook
  // Calls $authWithOAuthPopup on $firebaseAuth
  // This will be processed by the InAppBrowser plugin on mobile
  // We can add the user to $scope here or in the $onAuth fn
  $scope.googleLogin = function scopeLogin() {
    Auth.loginWithGoogle()
    .then(function(authData){
      console.log('We are logged in!', authData);
      //add user to data base
      afterLogIn(authData);
        
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  //if user logs in
  function afterLogIn(authData)
  {
      var userRef = new Firebase('https://sggo.firebaseio.com/users');
      userRef.child(authData.uid).once('value', function(snapshot) {
        var exists  = snapshot.exists();
        userExistsCallback(exists,authData);
      });
  }
  function userExistsCallback(exists,authData) {
    if (exists) {
    } else {
        
        console.log("user doesnt exist");
        itemRef.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData),
            email: getEmail(authData)
        });

        $state.go('tab.myList');
    }
  }
  // Logs a user out
  $scope.logout = Auth.logout;

  // detect changes in authentication state
  // when a user logs in, set them to $scope
  // Auth.onAuth(function(authData) {
  //   $scope.user = authData;
  // });

  function getName(authData) {
    switch(authData.provider) {
       case 'google':
         return authData.google.displayName;
       case 'twitter':
         return authData.twitter.displayName;
       case 'facebook':
         return authData.facebook.displayName;
    }
  }

    function getEmail(authData) {
      console.log(authData.google.email);
    switch(authData.provider) {
       case 'google':
         return authData.google.email;
       case 'twitter':
         return authData.twitter.email;
       case 'facebook':
         return authData.facebook.email;
    }
  }
})

//.controller('myListCtrl', function($scope, $state) {
//
//    $scope.lists = [
//        {title: 'Steak', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
//        {title: 'Sandwhich', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
//        {title: 'Breakfast', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']}
//    ];
//
//})
//
//.controller('nearMeCtrl', function($scope, $state) {
//  // With the new view caching in Ionic, Controllers are only called
//  // when they are recreated or on app start, instead of every page change.
//  // To listen for when this page is active (for example, to refresh data),
//  // listen for the $ionicView.enter event:
//  //
//  //$scope.$on('$ionicView.enter', function(e) {
//  //});
//        $scope.lists = [
//        {title: 'Steak', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
//        {title: 'Sandwhich', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
//        {title: 'Breakfast', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']}
//    ];
//
//})
//
//.controller('listEditCtrl', function($scope) {
//
//})
//
//.controller('AccountCtrl', function($scope) {
//  $scope.settings = {
//    enableFriends: true
//  };
;
