angular.module('hideTabBar', [])

.directive('hideTabBar', function($timeout, global) {
  var style = angular.element('<style>').html(
    '.has-tabs.no-tabs:not(.has-tabs-top) { bottom: 0; }\n' +
    '.no-tabs.has-tabs-top { top: 44px; }');
  document.body.appendChild(style[0]);
  return {
    restrict: 'A',
    compile: function(element, attr) {
      var tabBar = document.querySelector('.tab-nav');
      return function($scope, $element, $attr) {
        var scroll = $element[0].querySelector('.scroll-content');
        $scope.$on('$ionicView.beforeEnter', function() {
            console.log('$ionicView.beforeEnter');
            console.log($scope.$root.hideTabsOnThisPage);
            if($scope.$root.hideTabsOnThisPage == true){
                
          tabBar.classList.add('slide-away');
          scroll.classList.add('no-tabs');
            }
        })
        $scope.$on('$ionicView.beforeLeave', function() {
            console.log('$ionicView.beforeLeave');
            if($scope.$root.hideTabsOnThisPage == false){
            
          tabBar.classList.remove('slide-away');
          scroll.classList.remove('no-tabs')
            }
        });
      }
    }
  };
});
