angular.module('starter.myList', ['google.places'])

.controller('myListCtrl', function($scope, $state,$ionicListDelegate, global,myListFirebase) {
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();

    $scope.myLists =myListFirebase;
    console.log($scope.myLists);

    $scope.addNewList = function(){
    global.setCurrList([]);
    $state.go('tab.listAdd');
    };

    $scope.editList = function(listItem){
         
        global.setCurrList(listItem);
        $state.go('tab.listAdd');
        $ionicListDelegate.closeOptionButtons();
    };
    
    $scope.deleteList=function(listItem){ 
         
        //$scope.myLists.splice(listItem); 
        $ionicListDelegate.closeOptionButtons();
        //var itemRef = new Firebase('https://sggo.firebaseio.com/users/'+authData.uid+'/myLists' + listItem.$id);
        //might need callback later
        $scope.myLists.$remove(listItem).then(function(ref){
            ref.key()==listItem.$id;
        });
    }
    
})

.controller('addListCtrl', function($scope, $state,global,myListFirebase){

    $scope.place = null;
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    var myListsRef= ref.child('users').child(authData.uid).child('myLists');
    var bruceHouse = new google.maps.LatLng(34.029, -84.203);

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'us' },
        types: ['establishment'],
        location: bruceHouse,
        radius: '1000'
    }
    
    $scope.myList = global.getCurrList().places;
    if($scope.myList==null)
        $scope.myList=[];
    console.log(global.getCurrList());
    $scope.addToList = function(place){
        console.log(place);
        var _place={};
        if(place!=null)
        {
            if(typeof place =='object')
            {
                _place['name']=place.name;
                if(place.opening_hours)
                    _place['weekday_text']=place.opening_hours.weekday_text;
                if(place.price_level)
                    _place['price_level']=place.price_level;
                if(place.rating)
                    _place['rating']=place.rating;
                if(place.vicinity)
                    _place['vicinity']=place.vicinity;
            }
            else
            {
                _place['name']=place;
                
            }
            
            $scope.place="abc";
            $scope.myList.push(_place);
    //        $scope.myList[place.id] = place.name;
            console.log($scope.myList);
        }
        else
        {
            //alert
        }
    };
    
    $scope.saveList = function(){
        global.setCurrList($scope.myList);
       $state.go('tab.listDetails');
        console.log("save button pressed");
    };
    
    $scope.clearList = function(place){
       
    };
    
    
    $scope.saveListWithName = function(name){
        //save list to lists
       var finalList={'ListName':name,'creater_id':authData.uid,'creater_name':getName(authData),'places':global.getCurrList()};
       //add to my list
       myListFirebase.$add(finalList);

    };
      function getName(authData) {
        switch(authData.provider) {
           case 'google':
             return authData.google.displayName;
           case 'twitter':
             return authData.twitter.displayName;
           case 'facebook':
             return authData.facebook.displayName;
        }
      };
});
