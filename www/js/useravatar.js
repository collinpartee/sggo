angular.module('starter.useravatar', [])
.directive('useravatar', ["avatarService", function (avatarService) {
	var controller = function ($scope) {
		$scope.ImageAvailable = false;
		if (!$scope.User.Avatar) {
			$scope.GenericAvatar = avatarService.getAvatar($scope.User);
		} else {
			$scope.ImageAvailable = true;
		}
	};
	return {
		restrict: 'C',
		scope: {
			User: '=user'
		},
		template: '<div class="generic-avatar avatar">'+
		'<a class="thumb spacer animated fadeIn color" style="background-color:{{GenericAvatar.Background}}"></a>'+
		'<a class="name">{{GenericAvatar.Initials}}</a>' +
		'</div>',
		controller: controller
	};
}])
.factory("avatarService", function(){
    var avatarService = function(user){
      var colorCodes = {
//				1: "#F29691",
//				2: "#92D6C2",
//				3: "#CFD696",
//				4: "#FACA82",
//				5: "#D7ADE0"
                     1:"#3F51B5",
                     2:"#2196F3",
                     3:"#03A9F4",
                     4:"#00BCD4",
                     5:"#009688",
                     6:"#4CAF50",
                     7:"#8BC34A",
                     8:"#CDDC39",
                     9:"#FFEB3B",
                     10:"#FFC107",
                     11:"#FF9800",
                     12:"#FF5722",
                     13:"#795548",
                     14:"#9E9E9E",
                     15:"#607D8B"
			};
            var initials='';
            var charCode='';
			var i1 = "", i2 = "", nameArray = [];
			if (angular.isDefined(user.ListName)) {
				i1 = angular.uppercase(user.ListName.charAt(0));
				nameArray = user.ListName.split(" ");
				console.log(i1,nameArray);
				if (nameArray.length > 1) {
					i2 = angular.uppercase(nameArray[nameArray.length - 1].charAt(0));
                    initials = i1 + i2;
                    charCode = initials.charCodeAt(0) + initials.charCodeAt(1);
				} else {
					i2 = '';
                    initials = i1 + i2;
                    charCode = initials.charCodeAt(0);
				}
			} else {
				i1 = angular.uppercase(user.FirstName.charAt(0));
				nameArray = user.LastName.split(" ");
				if (nameArray.length > 2) {
					i2 = nameArray[nameArray.length - 1].charAt(0);
				} else {
					i2 = angular.uppercase(nameArray[0].charAt(0));
				}
			}
			
			
        console.log(charCode);
			charCode = charCode%15+1;
			var background = colorCodes[charCode];
        
			return ({ "Initials": initials, "Background": background });
    }
    return {
      getAvatar: avatarService
    }
});