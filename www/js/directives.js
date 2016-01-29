angular.module('starter.directives', [])

// constructor injection for a Firebase reference
// I've created this directive as an example of $compile in action. 
.directive('myPostRepeatDirective', function($timeout) {
    
  return{ 
      restrict: 'A',
      link:function(scope, element, attr) {
      
    if (scope.$last){
      // iteration is complete, do whatever post-processing
      // is necessary
      
            scope.$emit('applyEffect');
    
      
    }
  }
};
})
.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);

    for (var i=0; i<total; i++) {
      input.push(i);
    }

    return input;
  };
 })
.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].$id == +id) {
        return input[i];
      }
    }
    return null;
  }
})
.directive('hideTabBar', function($timeout,$state, global) {
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
            console.log('$ionicView.beforeEnter',$state.is('tab.listNearMe'));
            console.log($scope.$root.hideTabsOnThisPage);
            if($state.is('tab.myList') || $state.is('tab.listNearMe') || $state.is('tab.friendList')|| $state.is('tab.account')){
              tabBar.classList.remove('slide-away');
              scroll.classList.remove('no-tabs')      
              console.log('first 4 tab');
            }
            else{
                tabBar.classList.add('slide-away');
                scroll.classList.add('no-tabs');     
            }
        });
        
      }
    }
  };
});