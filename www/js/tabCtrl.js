angular.module('starter.tabCtrl',[])
.controller('tabCtrl', function($scope, $ionicModal,$state, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;
$scope.$on('$ionicView.beforeEnter', function() {

            $scope.$root.hideTabsOnThisPage = false;
            $('.profile').initial();
        });
    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        console.log(fabs.length);
        if (fabs.length && fabs.length > 1) {

            fabs[0].remove();
        }
    };

    $scope.clearAllFabs=function(){
        var fabs = document.getElementsByClassName('button-fab');
        console.log(fabs.length);
        if (fabs.length) {

            fabs[0].remove();
        }
    };

    $scope.editThisListP=function(){
        console.log('parent Edit');
        $scope.$broadcast('editClicked');

    };

    $scope.addFriendP=function(){
        console.log('parent Edit');
        $scope.$broadcast('addFriendClicked');

    };
    
    $scope.goTab=function(tab){
      console.log(tab);
        switch(tab) {
           case 'mylist':
             $state.go('tab.myList');
             return true;
           case 'listnearme':
                $state.go('tab.listNearMe');
             return true;
           case 'friend':
                console.log(tab);
               $state.go('tab.friendList'); 
             return true;
            case 'account':
                $state.go('tab.account');
                return true;
                
        }
  
    };
    $scope.isEdit=true;
    $scope.$on('changeToAddFriend',function(){

        var fabs = document.getElementById('fab-edit');
        $scope.isEdit=false;
    });
    $scope.$on('changeToEditList',function(){

        var fabs = document.getElementById('fab-edit');
        $scope.isEdit=true;
    });    
})
.controller('introCtrl', function($scope, $state,$ionicSlideBoxDelegate) {
    console.log('intro ctrl');
    $scope.startApp = function() {
        $state.go('tab.listNearMe');

    };
    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
});