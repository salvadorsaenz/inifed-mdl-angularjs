 
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
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined)
                    return ''
                var transformedInput = inputValue.replace(/[^0-9.]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});