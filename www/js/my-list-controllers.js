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
        global.setPrevList(listItem.$id);
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

    var currListItem=global.getCurrList();



    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    var bruceHouse = new google.maps.LatLng(34.029, -84.203);

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'us' },
        types: ['establishment'],
        location: bruceHouse,
        radius: '1000'
    }
    
    $scope.placeList = currListItem.places;
    if($scope.placeList==null)
        $scope.placeList=[];
    console.log(currListItem);
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
            
            $scope.placeList.push(_place);
    //        $scope.myList[place.id] = place.name;
            console.log($scope.placeList);
        }
        else
        {
            //alert
        }
        this.place=null;
    };
    
    $scope.saveList = function(){
        currListItem.places=$scope.placeList;
        console.log("save button pressed "+JSON.stringify(currListItem));
        global.setCurrList(currListItem);
        $state.go('tab.listDetails');
        
    };
    
    $scope.clearList = function(place){
       
    };
    
    


})
.controller('saveListCtrl', function($scope, $state,global,myListFirebase){
    var ref = new Firebase('https://sggo.firebaseio.com');
    var authData = ref.getAuth();
    var currListItem=global.getCurrList();
    var newList=true;

    if(currListItem.ListName!=null)
    {
        
        $scope.ListName = currListItem.ListName;
        
        newList=false;
    }

    $scope.saveListWithName = function(name){
        //save list to lists
        if(newList)
        {
           var finalList={'ListName':name,'creater_id':authData.uid,'creater_name':getName(authData),'places':currListItem.places};
           //add to my list
           myListFirebase.$add(finalList);
               
        }
        else
        {

            var item= myListFirebase.$getRecord(global.getPrevList());
            console.log("getPrevList "+JSON.stringify(global.getPrevList()));
            console.log('scope'+$scope.ListName);
            item.ListName=name;
            item.places=currListItem.places;
            myListFirebase.$save(item);
        }

        $state.go('tab.myList');  
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
