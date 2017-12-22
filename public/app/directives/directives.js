 
app.directive("compareTo", function() {
    return {
                require: "ngModel",
                scope: {
            otherModelValue: "=compareTo"
                },
                link: function(scope, element, attributes, ngModel) {
                        ngModel.$validators.compareTo = function(modelValue) {
                        return modelValue == scope.otherModelValue;
                        };
 
                        scope.$watch("otherModelValue", function() {
                            ngModel.$validate();
                        });
                }
        };
});

app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});