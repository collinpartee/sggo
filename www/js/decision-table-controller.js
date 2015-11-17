angular.module('starter.decisionTable', ['google.places'])
.controller('decisionTableListCtrl', function($scope, $state,$firebaseObject, global,tables) {


    //$scope.myTableLists =myTableLists;
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    var tableRef=new Firebase('https://sggo.firebaseio.com'+"/users/"+authData.uid+"/myTables");
    var tableRefObj=$firebaseObject(tableRef);
    tableRefObj.$loaded().then(function(data){
        tableRefObj.$bindTo($scope,'myTableLists');
    });
    //console.log($scope.myTableLists);
    $scope.deleteList=function(k)
    {
        console.log(k);

        var rec=tables.$getRecord(k).inviteFriendList;
        var index=0;
        var keeGoing=true;
        //remove myself from table invited friend list
        angular.forEach(rec, function (friend){
            console.log(friend);
            if(keeGoing && friend.key==authData.uid)
            {
                console.log("found match ",index);

                rec.splice(index);
                keeGoing=false;

                //remove table if friend list is 0
                if(rec.length==0)
                {
                    //thi shit didnt work,, why...-------------------------------
                    tables.$remove(tables.$getRecord(k)).then(function(ref) {
                      console.log('remove entry'); // true
                    });                    
                }

                tables.$save(tables.$getRecord(k)).then(function(ref) {
                  console.log('saved'); // true
                });

            }
            index++
        });
        //remove table from my list
        delete tableRefObj[k];
        tableRefObj.$save().then(function(ref) {
            console.log('saved tableRefObj');
        }); 


        tableRefObj.inviteFriendList;
        console.log("after",tables.$getRecord(k));
    }

    
})
.controller('decisionTableCtrl', function($scope, $state, global,myListFirebase) {

    $scope.currList =global.getCurrList();
    console.log($scope.currList);

    $scope.createTable=function(){
        console.log("go to decision talbe");
        $state.go('tab.decisionTableDetail');
    };


    
})
.controller('decisionTableDetailCtrl', function($scope, $state, $firebaseObject,global,myListFirebase,tables,friendList) {
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    $scope.currList =global.getCurrList();
    console.log(global.getCurrList());
    $scope.currTable={inviteFriendList:[],choices:global.getCurrList()};

    $scope.addToList=function(friendName){
        
        angular.forEach(friendList, function(friend) {
            //console.log(friend.name);
            //use email later---------------------------------------------------------------------------
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
                delete $scope.currTable.$id;
                delete $scope.currTable.$priority;
                delete $scope.currTable.choices.$id;
                delete $scope.currTable.choices.$priority;
                tables.$add(angular.copy($scope.currTable)).then(function(refAdd){
                    angular.forEach($scope.currTable.inviteFriendList, function(friend) {
                        //console.log(friend.name);
                        var friendRefObj=$firebaseObject(ref.child("users/"+friend.key+"/myTables"));
                        var myTableEntry={inviteFriendList:$scope.currTable.inviteFriendList,tableName:global.getCurrList().ListName}
                        
                        friendRefObj.$loaded().then(function(data){
                            friendRefObj[refAdd.key()]=myTableEntry;
                            friendRefObj.$save();
                        });

                        // console.log(friend);
                        // tableEntryRef=ref.child("users/"+friend.key+"/myTables").push();

                        // console.log(angular.copy($scope.currTable));
                        // tableEntryRef.set(angular.copy($scope.currTable));

                    
                    });                    
                });

            });
            $state.go('tab.decisionTableList');
        }

        
    };



    
});