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
});