// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.myList', 'starter.listNearMe', 'starter.accountSetting', 'starter.services','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  //MY LIST STATES -------->
  .state('tab.myList', {
    url: '/myList',
    views: {
      'tab-myList': {
        templateUrl: 'templates/tab-myList.html',
        controller: 'myListCtrl'
      }
        
    }
  })
  
  .state('tab.listAdd', {
    url: '/listAdd',
    views: {
      'tab-myList': {
        templateUrl: 'templates/tab-listAdd.html',
        controller: 'addListCtrl'
      }
        
    }
  })
  
  .state('tab.listDetails', {
    url: '/listDetails',
    views: {
      'tab-myList': {
        templateUrl: 'templates/tab-listDetails.html',
        controller: 'addListCtrl'
      }
        
    }
  })
// END OF MY LIST STATES ------>
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  
  .state('loginPage', {
    url: "/loginPage",
    templateUrl: "templates/loginPage.html",
    controller: 'WelcomeCtrl'
  })
  
  .state('tab.listNearMe', {
    url: '/listNearMe',
    views: {
      'tab-listNearMe': {
        templateUrl: 'templates/tab-listNearMe.html',
        controller: 'nearMeCtrl'
      }
    }
  })
  
  
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/loginPage');

})

// change this URL to your Firebase
.constant('FBURL', 'https://sggo.firebaseio.com');

