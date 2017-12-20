 
app
        .directive("compareTo", [function () {
            return {
                require: "ngModel",
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function (scope, element, attributes, ngModel) {
                    ngModel.$validators.compareTo = function (modelValue) {
                        return modelValue == scope.otherModelValue;
                    };
 
                    scope.$watch("otherModelValue", function () {
                        ngModel.$validate();
                    });
                }
            };
            }])

        .directive('ngEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        })
        ;