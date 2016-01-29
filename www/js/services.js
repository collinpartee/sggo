angular.module('starter.services', [])

// constructor injection for a Firebase reference
.service('Root', ['FBURL', Firebase])
.service('locationService', function($q,$cordovaGeolocation,global) {
  return {
    getLocation: function() {
      console.log(global.getMyLoc());
      var dfd = $q.defer()
        if(global.getMyLoc().lat==null)
        {
           setTimeout(function() {
           
            var posOptions = {timeout: 10000, enableHighAccuracy: false};
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function (position) {
                    var lat  = position.coords.latitude;
                    var lon = position.coords.longitude;

                    global.setMyLoc({'lat':lat,'lon':lon});
                    console.log("myloc ",global.getMyLoc());
                    dfd.resolve({
                      myloc:global.getMyLoc()
                    });
                }, function(err) {
                  // error
                  console.log("myloc error");
                  global.setMyLoc({'lat':37.38, 'lon':-122.09})
                });
            
          }, 2000)         
        }
        else
        {
          
          dfd.resolve({
            myloc:global.getMyLoc()
          });          
        }


      return dfd.promise
    }
  }
})

// create a custom Auth factory to handle $firebaseAuth
.factory('Auth', function($firebaseAuth, Root, $timeout,$state){
  var auth = $firebaseAuth(Root);
  return {
    // helper method to login with multiple providers
    loginWithProvider: function loginWithProvider(provider,scope) {
      return auth.$authWithOAuthRedirect(provider,scope);
    },
    // convenience method for logging in with Google
    loginWithGoogle: function login() {
      return this.loginWithProvider("google",{scope:'email'});
    },
    loginWithFacebook: function login() {
      return this.loginWithProvider("facebook",{scope:'email'});
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

  var myLoc={};
  var myName='unKnow';
  var myAvatar='';
  return {
    // helper method to login with multiple providers

    setMyLoc: function setMyLoc(myloc){
      myLoc=myloc;
    },
    getMyLoc: function getMyLoc(){
      return myLoc;
    },
    setMyName: function setMyName(myN){
      myName=myN;
    },
    getMyName: function getMyName(){
      return myName;
    },
    setMyAvatar: function setMyAvatar(myN){
      myAvatar=myN;
    },
    getMyAvatar: function getMyAvatar(){
      return myAvatar;
    }

  };
})
.factory('authData', function() {
  var ref = new Firebase("https://sggo.firebaseio.com");
  var authData = ref.getAuth();
  return authData;
})

.factory('geoFire', function() {
  var firebaseRef = new Firebase("https://sggo.firebaseio.com/geoData/");
  var geoFire = new GeoFire(firebaseRef);
  return geoFire;
})
//global item list base on user
.factory('myListFirebase', ['$firebaseArray', function($firebaseArray) {
  var ref = new Firebase('https://sggo.firebaseio.com');
  var authData = ref.getAuth();
  console.log(authData.uid);
  var myListsRef = new Firebase('https://sggo.firebaseio.com/users/'+authData.uid+'/myLists');
  return $firebaseArray(myListsRef);
}])
//global item list base on tables
.factory('tables', ['$firebaseArray', function($firebaseArray) {

  var myListsRef = new Firebase('https://sggo.firebaseio.com/tables');
  return $firebaseArray(myListsRef);
}])
//global item list base on friendlist
.factory('friendList', ['$firebaseObject', function($firebaseObject) {
  var ref = new Firebase('https://sggo.firebaseio.com/');
  var authData = ref.getAuth();
  console.log(authData.uid);
  var myListsRef = new Firebase('https://sggo.firebaseio.com/users/'+authData.uid+'/friendList');
  return $firebaseObject(myListsRef);
}]);
;