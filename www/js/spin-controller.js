angular.module('starter.spin', [])
.controller('spinCtrl', function($scope, $state,$firebaseObject, $interval, $timeout,$stateParams,$firebaseArray,tables, global) {
console.log($stateParams);

    if($stateParams.from=='myList')
    {
      var words = $stateParams.places;
      var myListRef=new Firebase('https://sggo.firebaseio.com'+"/users/"+$stateParams.createrId+"/myLists/"+$stateParams.$id+'/messages');
      $scope.chats=$firebaseArray(myListRef);
    }
    else
    {
      if($stateParams.from=='myListNearMe')
      {
         var words = $stateParams.places;
         var key=$stateParams.$id;
         var uid=key.substring(0,key.lastIndexOf(':'));
          var listkey=key.substring(key.lastIndexOf(':')+1,key.length);
          var nearbyListRef=new Firebase('https://sggo.firebaseio.com'+"/users/"+uid+"/myLists/"+listkey+'/messages');
           $scope.chats=$firebaseArray(nearbyListRef);

      }
      else
      {
        console.log('name',global.getMyName());
        var currTable=tables.$getRecord($stateParams.listId);
        //$scope.chats=$firebaseArray(currTable.messages);
        console.log(currTable);
        var words = currTable.choices;

        //get chat list
        var chatListRef = new Firebase('https://sggo.firebaseio.com/tables/'+$stateParams.listId+'/messages');
        $scope.chats=$firebaseArray(chatListRef);
      }

    }
      

      

      function getRandomInt(min, max) {
              return Math.floor(Math.random() * (max - min + 1)) + min;
      }
     // SECOND SPIN STYLE 
      

      $(function(){
  	
      	// container is the DOM element;
      	// userText is the textbox
      	
      	var container = $("#container")
      	$scope.shuffleButton =function(){
              console.log('c',words[getRandomInt(0,words.length-1)].name);
               container.shuffleLetters({
                  "text": words[getRandomInt(0,words.length-1)].name
              });
          };
      			
      			// The return key was pressed
      			
           
    			

    	
    });


    

    $scope.sendMessage=function(message){
      console.log(message);
      var meessageEntry={'user':global.getMyName(),'message':message,'createdAt':Firebase.ServerValue.TIMESTAMP};
      $scope.chats.$add(meessageEntry);
      this.message="";
    }


});