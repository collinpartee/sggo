angular.module('starter.directives', [])

// constructor injection for a Firebase reference
// I've created this directive as an example of $compile in action. 
.directive('addInput', ['$compile', function ($compile) { // inject $compile service as dependency
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // click on the button to add new input field            
            element.find('button').bind('click', function () {
                // I'm using Angular syntax. Using jQuery will have the same effect
                // Create input element
                var input = angular.element('<div class="item item-button-right list-item"><input type="text" id="listInputField" g-places-autocomplete options="autocompleteOptions" ng-model="place[' + scope.inputCounter + ']" autofocus><button class="button button-clear" ng-show="place[' + scope.inputCounter + ']" ng-click="deletePlace(place);"><i class="icon ion-close" style="color: red;"></i></button> <hr /></div>');

                //var buttonpress = element.find('button');
                // Compile the HTML and assign to scope
                
                var compile = $compile(input)(scope);
     
                if(scope.inputCounter == 0 ){
                	// Append input to div
               		element.append(input);
                	// Increment the counter for the next input to be added
                	scope.inputCounter++;
                }else{
                
                if(scope.place[scope.inputCounter - 1] == null){
                	//do nothing
                    console.log(scope.place[scope.inputCounter - 1]);
                }else{
				
                	// Append input to div
               		element.append(input);
                	// Increment the counter for the next input to be added
                	scope.inputCounter++;
                }
                }
                
            });
        }
    }
}]);