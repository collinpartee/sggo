angular.module('starter.myList', ['google.places'])

.controller('myListCtrl', function($scope, $state) {

    $scope.lists = [
        {title: 'Steak', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Sandwhich', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']},
        {title: 'Breakfast', places: ['Burger King', 'MacDonalds', 'Honey Bits', 'Sweet Hut']}
    ];

    $scope.addNewList = function(){
    
    $state.go('tab.listEdit');
};
    
})

.controller('editListCtrl', function($scope, $state){

    $scope.place = null;

    var bruceHouse = new google.maps.LatLng(34.029, -84.203);

    $scope.autocompleteOptions = {
        componentRestrictions: { country: 'us' },
        types: ['establishment'],
        location: bruceHouse,
        radius: '1000'
    }
    
    $scope.myList = [];
    
    $scope.addToList = function(place){
        $scope.myList.push(place);
//        $scope.myList[place.id] = place.name;
        console.log($scope.myList);
    };
    
    $scope.saveList = function(place){
       $state.go('tab.listDetails');
        console.log("save button pressed");
    };
    
    $scope.clearList = function(place){
       
    };
    

})
.controller('listDetailsCtrl', function($scope, $state){

    
    
});
