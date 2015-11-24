angular.module('starter.accountSetting', [])

.controller('AccountCtrl', function($scope, $ionicActionSheet,$ionicPopup, Auth,authData) {
	var myEmail;
	var ref = new Firebase("https://sggo.firebaseio.com");
     ref.child('users/'+authData.uid+'/email').once('value', function(dataSnapshot) {
            console.log(dataSnapshot.val());
          myEmail= dataSnapshot.val();
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

	$scope.changePassWord= function(){

		$scope.newitem = {}
		var confirmPopup = $ionicPopup.confirm({
          title: 'Change your password',
          templateUrl: 'changepassword-Popup.html',
            scope: $scope
        });

        confirmPopup.then(function(res) {
          if(res) {
          	console.log(res);
          	 console.log($scope.newitem.oldp,$scope.newitem.newp,$scope.newitem.reenter);
          	 var options={title:'Password change failed'};
          	 if($scope.newitem.newp!=$scope.newitem.reenter)
          	 {
          	 	
          	 	options.template='re-entered password does not match';
          	 	$scope.showAlert(options);
          	 }
          	 else
          	 {


				ref.changePassword({
				  email       : myEmail,
				  oldPassword : $scope.newitem.oldp,
				  newPassword : $scope.newitem.newp
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
