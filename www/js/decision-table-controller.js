angular.module('starter.decisionTable', ['google.places'])
.controller('decisionTableListCtrl', function($scope, $state, global,myTables) {

    $scope.myTableLists =myTables;
    console.log($scope.myTableLists);

    
})
.controller('decisionTableCtrl', function($scope, $state, global,myListFirebase) {

    $scope.currList =global.getCurrList();
    console.log($scope.currList);

    $scope.createTable=function(){
        console.log("go to decision talbe");
        $state.go('tab.decisionTableDetail');
    };


    
})
.controller('decisionTableDetailCtrl', function($scope, $state, global,myListFirebase,myTables,friendList) {
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    $scope.currList =global.getCurrList();
    console.log(global.getCurrList());
    $scope.currTable={inviteFriendList:[],choices:global.getCurrList()};

    $scope.addToList=function(friendName){
        
        angular.forEach(friendList, function(friend) {
            //console.log(friend.name);
            if(friend.name==friendName)
            {
                 var f={email:friend.email,key:friend.key,name:friend.name};
                 $scope.currTable.inviteFriendList.push(f);

            }
           
        });
        console.log($scope.currTable);

    };

    $scope.saveAndSendInvite=function(){
        console.log($scope.currTable.tableName);
        if($scope.currTable.tableName!=null)
        {
            var userRef=ref.child('users/'+authData.uid);
            userRef.once('value',function(snap){
                console.log(snap.val());
                var addSefl={name:snap.val().name,email:snap.val().email,key:authData.uid};
                $scope.currTable.inviteFriendList.push(addSefl);
                //add table to friend's table list
                angular.forEach($scope.currTable.inviteFriendList, function(friend) {
                    //console.log(friend.name);
                    
                    console.log(friend);
                    tableEntryRef=ref.child("users/"+friend.key+"/myTables").push();
                    delete $scope.currTable.$id;
                    delete $scope.currTable.$priority;
                    delete $scope.currTable.choices.$id;
                    delete $scope.currTable.choices.$priority;
                    console.log(angular.copy($scope.currTable));
                    tableEntryRef.set(angular.copy($scope.currTable));
                
                });
            });
            $state.go('tab.decisionTableList');
        }

        
    };

    //add this to slider menu
    $scope.searchFriend=function(email){
        ref.child('users').orderByChild('email')
        .startAt(email)
        .endAt(email)
        .once('value', function(snap) {
            snap.forEach(function(s) {
                console.log(JSON.stringify(s.val()));
               var newFriend={name:s.val().name,email:s.val().email,key:s.key()};
               console.log(JSON.stringify(newFriend));
               friendList.$add(newFriend);
          });

        });
    }

    
});