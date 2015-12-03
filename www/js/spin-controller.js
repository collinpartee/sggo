angular.module('starter.spin', [])
.controller('spinCtrl', function($scope, $state,$firebaseObject, $interval, $timeout,$stateParams,$firebaseArray,tables, global) {
console.log($stateParams);

  if($stateParams.listId==null)
  {
    var words = $stateParams.places;
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
    

    $scope.spun = false;
    
    $scope.spinWheel = function(){
        var randoms = window.document.getElementsByClassName("randoms");
        var chosenOne = window.document.getElementById("chosen");
		for (i = 0; i < randoms.length; i++)
        {
            var interval1 = $interval(function() {
            }, 425);
            var interval2  = $interval(function() {
            }, getRandomInt(500, 800));
            changeWord(randoms[i],0,interval1,interval2);
        }
        if($scope.spun == true){
            document.getElementById("ignored1").style.color = "black";
           document.getElementById("ignored2").style.color = "black";
           document.getElementById("ignored3").style.color = "black";
           document.getElementById("ignored4").style.color = "black";
           document.getElementById("ignored5").style.color = "black";
            document.getElementById("chosen").style.color = "black";
            $scope.spun = false;
        }
        
    };
    

    
    function changeWord(a,idx,interval1,interval2) {
		a.style.opacity = '0.1';
		a.innerHTML = words[getRandomInt(0, words.length - 1)].name;
        var randomNumber = getRandomInt(500, 800);


        console.log(idx);

        $timeout(function(){
            document.getElementById("chosen").style.color = "black";
            document.getElementById("ignored1").style.color = "black";
           document.getElementById("ignored2").style.color = "black";
           document.getElementById("ignored3").style.color = "black";
           document.getElementById("ignored4").style.color = "black";
           document.getElementById("ignored5").style.color = "black";
            document.getElementById("chosen").style.color = "black";
        }, 10);
        
        $timeout(function(){
            $interval.cancel(interval1);
            $interval.cancel(interval2);
        }, 3000);
        
         $timeout(function(){
       
           document.getElementById("chosen").style.color = "red";
        document.getElementById("chosen").style.opacity = "1";     
           //window.document.getElementsByClassName("randoms").style.opacity = '0';
           document.getElementById("ignored1").style.color = "white";
           document.getElementById("ignored2").style.color = "white";
            document.getElementById("ignored3").style.color = "white";
             document.getElementById("ignored4").style.color = "white";
             document.getElementById("ignored5").style.color = "white";
           $scope.spun = true;
           console.log(chosen.innerHTML);
//            $interval.cancel(interval1);
//            $interval.cancel(interval2);
       }, 3000);
        
//        $timeout(function(){
//             document.getElementById("ignored1").style.color = "white";
//             document.getElementById("ignored3").style.color = "white";                              
//             document.getElementById("ignored4").style.color = "white";
//            $scope.spun = true;
//        }, 5000);
//        
//        $timeout(function(){
//             document.getElementById("ignored1").style.color = "white";
//             document.getElementById("chosen").style.color = "red";
//            document.getElementById("chosen").style.opacity = "1";
//            $scope.spun = true;
//        }, 7000);
        if(idx>5)
        {
            return;
        }
        var ninterval1 = $interval(function() {
				a.style.opacity = '1';
		}, 500);
        var ninterval2  = $interval(function() {
                    idx=idx+1;
        changeWord(a,idx,ninterval1,ninterval2); 
		}, randomNumber );

};
    


function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
}
    
    

    $scope.sendMessage=function(message){
      console.log(message);
      var meessageEntry={'user':global.getMyName(),'message':message,'createdAt':Firebase.ServerValue.TIMESTAMP};
      $scope.chats.$add(meessageEntry);
      this.message="";
    }

});