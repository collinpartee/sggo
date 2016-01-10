// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'ngCordova', 'ionic-material', 'ionMdInput', 'ionic.service.analytics', 'starter.controllers', 'starter.myList', 'starter.tabCtrl', 'starter.decisionTable', 'starter.listNearMe', 'starter.accountSetting', 'starter.friendList', 'starter.services', 'starter.directives', 'starter.spin', 'firebase', 'ngTagsInput', 'starter.useravatar'])

.run(function ($ionicPlatform, $cordovaGeolocation, $ionicLoading, $ionicAnalytics, global) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        $ionicAnalytics.register();
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        var deploy = new Ionic.Deploy();
        deploy.check().then(function (hasUpdate) {
            console.log('Ionic Deploy: Update available: ' + hasUpdate);
            var alertPopup = $ionicPopup.alert({
                title: "Update detected",
                template: "Please comfirm to perform automatic update"
            });
            alertPopup.then(function (res) {
                deploy.update().then(function (res) {
                    console.log('Ionic Deploy: Update Success! ', res);
                    $ionicLoading.hide();
                }, function (err) {
                    console.log('Ionic Deploy: Update error! ', err);
                }, function (prog) {
                    $ionicLoading.show({
                        template: 'Updating...'
                    });
                });
            });
        }, function (err) {
            console.error('Ionic Deploy: Unable to check for updates', err);
        });
        // window.screen.lockOrientation('portrait');
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;

                global.setMyLoc({
                    'lat': lat,
                    'lon': lon
                });
                console.log("myloc ", global.getMyLoc());
            }, function (err) {
                // error
                console.log("myloc error");
                global.setMyLoc({
                    'lat': 37.38,
                    'lon': -122.09
                })
            });

    });

})

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.swipeBackEnabled(false);
    $ionicConfigProvider.navBar.alignTitle('center');
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'tabCtrl'
    })

    // Each tab has its own nav history stack:

    //MY LIST STATES -------->
    .state('tab.myList', {
            url: '/myList',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-myList.html',
                    controller: 'myListCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-add" class="button button-fab button-fab-top-right expanded button-energized-900 spin" ui-sref="tab.listDetails"><i class="icon ion-plus"></i></button>',
                    controller: function ($timeout) {
                        $timeout(function () {
                            document.getElementById('fab-add').classList.toggle('on');
                        }, 900);
                    }
                }

            }
        })
        .state('tab.editMyList', {
            url: '/editMyList',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-editMyList.html',
                    controller: 'editListCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-edit" class="button button-fab button-fab-bottom-right expanded button-energized-900 spin" ng-click="editThisListP()"><i class="icon ion-edit"></i></button>',
                    controller: function ($timeout) {
                        $timeout(function () {
                            document.getElementById('fab-edit').classList.toggle('on');
                        }, 900);
                    }
                }

            },
            params: {
                'from': 'myList',
                '$id': 'none',
                'ListName': '',
                'creater_id': '',
                'creater_name': '',
                'places': [],
                'share': true,
                'tags': [],
                'listImg': ''
            }
        })
        .state('tab.editMyListTable', {
            url: '/editMyList',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-editMyTable.html',
                    controller: 'editListCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-edit" class="button button-fab button-fab-bottom-right expanded button-energized-900 spin" ng-click="editThisListP()"><i ng-class="{&apos;icon ion-edit&apos;: isEdit, &apos;ion-ios-personadd&apos;: !isEdit}"></i></button>',
                    controller: function ($timeout) {
                        $timeout(function () {
                            document.getElementById('fab-edit').classList.toggle('on');
                        }, 900);
                    }
                }

            },
            params: {
                'from': 'myTable',
                'listId': '',
                'places': [],
                'creater_name': "",
                'inviteFriendList': [],
                'ranNum': 0,
                'ListName': "",
                'tags': [],
                'triggers': 0

            }
        })
        .state('tab.placeDetailsMyList', {
            url: '/viewListDetail',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-placeDetails.html',
                    controller: 'viewListDetailCtrl',

                }

            },
            params: {
                'icon': "",
                'name': "North Point Mall",
                'periods': [],
                'rating': 0,
                'vicinity': "",
                'phone':'',
                'website':'',
                'weekday_text': []
            }
        })
        .state('tab.listDetails', {
            url: '/listDetails',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-listDetails.html',
                    controller: 'addListCtrl'
                }

            },
            params: {
                'from': '',
                '$id': 'none',
                'creater_id': '',
                'listId': '',
                'places': [],
                'creater_name': "",
                'inviteFriendList': [],
                'ranNum': 0,
                'ListName': "",
                'tags': [],
                'triggers': 0
            }
        })
        .state('tab.nameList', {
            url: '/nameList',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-nameList.html',
                    controller: 'addListCtrl'
                }

            },
            params: {

                '$id': 'none',
                'ListName': '',
                'creater_id': '',
                'creater_name': '',
                'places': [],
                'share': true,
                'tags': []
            }

        })
        .state('tab.spin', {
            url: '/spin',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-spin.html',
                    controller: 'spinCtrl',

                }

            },
            params: {
                'from': 'myList',
                '$id': 'none',
                'ListName': '',
                'creater_id': '',
                'creater_name': '',
                'places': [],
                'share': true,
                'tags': [],
                'listImg': ''
            }
        })
        .state('tab.spinTable', {
            url: '/spin',
            views: {
                'tab-myList': {
                    templateUrl: 'templates/tab-spin.html',
                    controller: 'spinCtrl',

                }

            },
            params: {
                'from': 'myTable',
                'listId': "k"
            }
        })
    

    // END OF MY LIST STATES ------>

    //account states 
    .state('tab.account', {
            url: '/account',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl'
                }
            }
        })
        .state('tab.changePassword', {
            url: '/changePassword',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-changePassword.html',
                    controller: 'PasswordCtrl'
                }
            },
            params: {
                'myEmail': ''
            }
        })
        .state('tab.changeName', {
            url: '/changeName',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-changeName.html',
                    controller: 'changeNameCtrl'
                }
            },
            params: {
                'myName': ''
            }
        })
        .state('tab.changeAvatar', {
            url: '/changeAvatar',
            views: {
                'tab-account': {
                    templateUrl: 'templates/tab-changeAvatar.html',
                    controller: 'ChangeAvatarCtrl'
                }
            },
            params: {
                'myEmail': ''
            }
        })
        //

    //login state
    .state('loginPage', {
            url: "/loginPage",
            templateUrl: "templates/loginPage.html",
            controller: 'WelcomeCtrl'
        })
        //

    //near me states
    .state('tab.listNearMe', {
            url: '/listNearMe',
            views: {
                'tab-listNearMe': {
                    templateUrl: 'templates/tab-listNearMe.html',
                    controller: 'nearMeCtrl',
                    resolve: {
                        myLoc: function (locationService) {
                            return locationService.getLocation()
                        }
                    }
                }
            }
        })
        .state('tab.editListNearMe', {
            url: '/editListNearMe',
            views: {
                'tab-listNearMe': {
                    templateUrl: 'templates/tab-editListNearMe.html',
                    controller: 'nearMeCtrlEdit'
                }
            },
            params: {
                '$id': 'none',
                'ListName': '',
                'listImg': '',
                'creater_id': '',
                'creater_name': '',
                'places': [],
                'share': true,
                'tags': [],
                'avatar': ''
            }
        })
        .state('tab.spinListNearMe', {
            url: '/spin',
            views: {
                'tab-listNearMe': {
                    templateUrl: 'templates/tab-spin.html',
                    controller: 'spinCtrl',

                }

            },
            params: {
                'from': 'myListNearMe',
                '$id': 'none',
                'ListName': '',
                'creater_id': '',
                'creater_name': '',
                'places': [],
                'share': true,
                'tags': [],
                'listImg': ''
            }
        })
        .state('tab.spinNearby', {
            url: '/spin',
            views: {
                'tab-listNearMe': {
                    templateUrl: 'templates/tab-spin.html',
                    controller: 'spinCtrl',

                }

            },
            params: {
                'ListName': '',
                'creater_id': '',
                'creater_name': '',
                'places': [],
                'share': true,
                'tags': []
            }
        })
        .state('tab.placeDetailsListNearMe', {
            url: '/viewListDetail',
            views: {
                'tab-listNearMe': {
                    templateUrl: 'templates/tab-placeDetails.html',
                    controller: 'viewListDetailCtrl',

                }

            },
            params: {
                'icon': "",
                'name': "North Point Mall",
                'periods': [],
                'rating': 0,
                'vicinity': "",
                'phone':'',
                'website':'',
                'weekday_text': []
            }
        })
        //friend list state
        .state('tab.friendList', {
            url: '/friendList',
            views: {
                'tab-friendList': {
                    templateUrl: 'templates/tab-friendList.html',
                    controller: 'friendListCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-add" class="button button-fab button-fab-top-right expanded button-energized-900 spin " ng-click="addFriendP()"><i class="ion-ios-personadd"></i></button>',
                    controller: function ($timeout) {
                        $timeout(function () {
                            document.getElementById('fab-add').classList.toggle('on');
                        }, 900);
                    }
                }

            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/loginPage');

})

// change this URL to your Firebase
.constant('FBURL', 'https://sggo.firebaseio.com');