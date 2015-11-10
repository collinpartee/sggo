angular.module('starter.services', [])

// constructor injection for a Firebase reference
.service('Root', ['FBURL', Firebase])

// create a custom Auth factory to handle $firebaseAuth
.factory('Auth', function($firebaseAuth, Root, $timeout,$state){
  var auth = $firebaseAuth(Root);
  return {
    // helper method to login with multiple providers
    loginWithProvider: function loginWithProvider(provider) {
      return auth.$authWithOAuthPopup(provider);
    },
    // convenience method for logging in with Google
    loginWithGoogle: function login() {
      return this.loginWithProvider("google");
    },
    // wrapping the unauth function
    logout: function logout() {
        
      auth.$unauth();
        $state.go("loginPage");
    },
    // wrap the $onAuth function with $timeout so it processes
    // in the digest loop.
    onAuth: function onLoggedIn(callback) {
      auth.$onAuth(function(authData) {
        $timeout(function() {
          callback(authData);
        });
      });
    }
  };
})
// globle varibale usage
.factory('global', function(){
  var currList = [];
  return {
    // helper method to login with multiple providers
    setCurrList: function setCurrList(mylist) {
      currList=mylist;
    },
    // convenience method for logging in with Google
    getCurrList: function getCurrList() {
      return angular.copy(currList);
    },
  };
});