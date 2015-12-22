angular.module('starter.accountSetting', [])

.controller('AccountCtrl', function($scope, $ionicActionSheet,$ionicPopup, $state,$firebaseObject,$timeout,ionicMaterialMotion,ionicMaterialInk, Auth,authData,FBURL,global) {
//	$scope.$parent.showHeader();
    $scope.$parent.clearAllFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);
    // Set Ink
    ionicMaterialInk.displayEffect();
	var myEmail;
	var ref = new Firebase(FBURL);
     ref.child('users/'+authData.uid+'/email').once('value', function(dataSnapshot) {
            console.log(dataSnapshot.val());
          myEmail= dataSnapshot.val();
        });

     $scope.myName=global.getMyName();
      var myAvatar=$firebaseObject(ref.child('users/'+authData.uid+'/avatar'));
      myAvatar.$loaded().then(function() {
      	myAvatar.$bindTo($scope, "avatar");
      });

      var myLikes=$firebaseObject(ref.child('users/'+authData.uid+'/likes'));
      myLikes.$loaded().then(function() {
      	myLikes.$bindTo($scope, "likes");
      });   

      var myDownloads=$firebaseObject(ref.child('users/'+authData.uid+'/downloads'));
      myDownloads.$loaded().then(function() {
      	myDownloads.$bindTo($scope, "downloads");
      });         
    $scope.showLogOutMenu = function() {
		// Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			//Here you can add some more buttons
			// buttons: [
			// { text: '<b>Share</b> This' },
			// { text: 'Move' }
			// ],
			destructiveText: 'Logout',
			titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				//Called when one of the non-destructive buttons is clicked,
				//with the index of the button that was clicked and the button object.
				//Return true to close the action sheet, or false to keep it opened.
				return true;
			},
			destructiveButtonClicked: function(){
				//Called when the destructive button is clicked.
				//Return true to close the action sheet, or false to keep it opened.
                Auth.logout();
				
			}
		});

	};

    
    $scope.linkToPassword = function(){
    	console.log(myEmail);
        $state.go('tab.changePassword',{'myEmail':myEmail});
    };
    
    $scope.linkToChangeAvatar = function(){
    	
        $state.go('tab.changeAvatar');
    };
    $scope.linkToChangeName = function(){
      $state.go('tab.changeName',{'myName':$scope.myName});
    }
    
})
.controller('PasswordCtrl', function($scope, $ionicPopup,$stateParams) {
	$scope.newitem={};
	var ref = new Firebase("https://sggo.firebaseio.com");
	console.log($stateParams.myEmail);
	$scope.changePassWord= function(newitem){


          	 console.log(newitem);
          	 var options={title:'Password change failed'};
          	 if(newitem.newp!=newitem.reenter)
          	 {
          	 	
          	 	options.template='re-entered password does not match';
          	 	$scope.showAlert(options);
          	 }
          	 else
          	 {


				ref.changePassword({
				  email       : $stateParams.myEmail,
				  oldPassword : newitem.oldp,
				  newPassword : newitem.newp
				}, function(error) {
				  if (error === null) {
				  	options.title='Password changed successfully';
				  	options.template='your password has been changed';
				    console.log("Password changed successfully");
				    $scope.showAlert(options);
				  } else {
				  	options.template=error;
				    console.log("Error changing password:", error);
				    $scope.showAlert(options);
				  }
				});
          	 	
          	 }          	 
          
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

})
.controller('ChangeAvatarCtrl', function($scope,$stateParams,$state) {
    
    var avatarURLs = [];
    
    for(var i = 0; i<28; i++){
        var url = 'img/avatar/'+i+'.png';
        avatarURLs.push(url);
    }
	
    var monthDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,       24, 25, 26, 27, 28, 29, 30, 31];
    
    var dates = [];
    for (var i = 0; i < avatarURLs.length; i++ ) {
        if (i % 5 == 0) dates.push([]);
        dates[dates.length-1].push(avatarURLs[i]);
    }
  return $scope.dates = dates;
    
})

.controller('changeNameCtrl', function($scope,$stateParams,$state,FBURL,authData,global) {
    var ref = new Firebase(FBURL);
    console.log($stateParams.myName);
    $scope.newitem={'newn':$stateParams.myName};
    $scope.changeName=function(newitem){
      var myNameRef=ref.child('users/'+authData.uid+'/name');
      console.log(newitem.newn);
      myNameRef.set($scope.newitem.newn,function(error){
        if(error)
        {
          console.log(error);
        }
        else
        {
          global.setMyName($scope.newitem.newn);
          $state.go('tab.account');
        }
      });
    }
})
;
