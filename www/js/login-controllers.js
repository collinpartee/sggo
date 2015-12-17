angular.module('starter.controllers', [])

.controller('WelcomeCtrl', function($scope, $state, $ionicModal, $timeout, $ionicLoading,$ionicPopup, $cordovaKeyboard,FBURL, Auth,global) {
    
    $scope.dontLogin = function(){
      $ionicLoading.show({
          template: 'Loading...'
        });
        $state.go('tab.myList');
    };
    
    $scope.keyboardScroll = function(){
         $cordovaKeyboard.disableScroll(true);
    };
    
  $scope.user = null;
  var itemRef = new Firebase('https://sggo.firebaseio.com/');


  //if user already aunthenticated
  Auth.onAuth(authDataCallback);
  function authDataCallback(authData) {
    if (authData) {
      console.log("User " + authData.uid + " is logged in with " + authData.provider);
      $scope.setInfo(authData);
      $ionicLoading.show({
        template: 'Loading...'
      });
      $state.go('tab.listNearMe');
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
  $scope.facebookLogin = function scopeLogin() {
    Auth.loginWithFacebook()
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
      $scope.setInfo(authData);
      $ionicLoading.show({
        template: 'Loading...'
      });
      $state.go('tab.listNearMe');
    } else {
        
        console.log("user doesnt exist");
console.log("wtf");
        console.log('info',getName(authData),getEmail(authData),getImage(authData));

        itemRef.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData),
            email: getEmail(authData),
            avatar: getImage(authData)
        },onComplete);
        $scope.setInfo(authData);
      var onComplete = function(error) {
      if (error) {
        console.log('Synchronization failed');
      } else {
        //$state.go('tab.myList');
      }
       
    }
     
  }
  // Logs a user out

};
// Same as the previous example, except we will also log a message
// when the data has finished synchronizing
  $scope.logout = Auth.logout;

  // detect changes in authentication state
  // when a user logs in, set them to $scope
  // Auth.onAuth(function(authData) {
  //   $scope.user = authData;
  // });

  function getName(authData) {
    console.log('get name');
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
      
    switch(authData.provider) {
       case 'google':
         return authData.google.email;
       case 'twitter':
         return authData.twitter.email;
       case 'facebook':
         return authData.facebook.email;
    }
  }

  function getImage(authData) {
      
    switch(authData.provider) {
       case 'google':
         return authData.google.profileImageURL;
       case 'twitter':
         return authData.twitter.email;
       case 'facebook':
         return authData.facebook.profileImageURL;
    }
  }
    //add new list modal window
  $ionicModal.fromTemplateUrl('signUp-modal.html', {
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
      $scope.didSubmitLogin = false;
      $scope.lemail= null;
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
    
    $scope.didSubmitLogin = false;
    //loading spinner


    $scope.signUp=function(sname,semail,spassword){
      console.log(semail,spassword);
      itemRef.createUser({
        email    : semail,
        password : spassword
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          //alert invalid or duplicated user email
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          itemRef.authWithPassword({
            email    : semail,
            password : spassword
          }, function(error, authData) { 
            if(error)
            {

               console.log("user exists");
            }
            else
            {
                  itemRef.child("users").child(authData.uid).set({
                      provider: authData.provider,
                      name: sname,
                      email: semail,
                      avatar: 'img/adam.jpg'
                  });
                  $scope.didSubmitLogin=false;
                  $scope.closeModal(); 
                  $ionicLoading.show({
                    template: 'Loading...'
                  });
                  $state.go('tab.listNearMe');
            }

          }, {
          });
        }
      });
    };

    $scope.logIn=function(lemail,lpassword){
      itemRef.authWithPassword({
        email    : lemail,
        password : lpassword
      }, function(error, authData) { 
        if(error)
        {
             console.log("wrong username");
            alert('Wrong username or password');
        }
        else
        {
            $scope.setInfo(authData);
                  $scope.closeModal(); 
                  $ionicLoading.show({
                    template: 'Loading...'
                  });
                  $state.go('tab.listNearMe');
        }
      }, {

      });  
    };

    $scope.setInfo = function(authData){
            itemRef.child("users").child(authData.uid).child('name').once('value', function(dataSnapshot) {
              global.setMyName(dataSnapshot.val());
            });
            itemRef.child("users").child(authData.uid).child('avatar').once('value', function(dataSnapshot) {
              global.setMyAvatar(dataSnapshot.val());
            });
    };
    $scope.resetPassword=function(lemail){
      console.log(lemail);
      itemRef.resetPassword({
        email : lemail
      }, function(error) {
        if (error === null) {
          var options={title: 'Pass word reset Successfully', template:'Please check your email'};
          $scope.showAlert(options);
          console.log("Password reset email sent successfully");
        } else {
          var options={title: 'Error sending password reset email', template:error};
          console.log("Error sending password reset email:", error);
          $scope.showAlert(options);
        }
      });
    }
    $scope.showAlert = function(options) {
     var alertPopup = $ionicPopup.alert({
         title: options.title,
         template: options.template
       });
       alertPopup.then(function(res) {
         console.log('Thank you for not eating my delicious ice cream cone');
       });
     };
    
});

