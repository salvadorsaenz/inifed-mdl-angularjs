//controlador loginCtrl
//inyectamos la factoria authServ en el controlador loginCtrl
//para hacer el login de los usuarios
app.controller("loginCtrl", loginCtrl);

function loginCtrl($scope, appModelServ, consultarPost, appServices, environment, $location, $log) {
    
    $scope.user = appModelServ.user;
    $log.info('loginCtrl appModelServ.user', appModelServ.user);

    //función que llamamos al hacer sumbit al formulario
    $scope.login = function() {
        if ($scope.userForm.$valid) {
            $log.info('login');
            appModelServ.user.submitted = false;

            var promise = {};
            if (environment.getEnvironment === 'SALVADOR') {
                if (appModelServ.user.usuario === 'chalo' || appModelServ.user.usuario === 'admin') {
                        var serviceItem = {
                            use: 'json'
                            , json: 'public/assets/json/Login_response_' + appModelServ.user.usuario + '.json'
                        };
                        promise = appServices.exec(serviceItem);
                } else {
                    appModelServ.msg = 'El usuario o password son incorrectos';
                    appModelServ.success = true;
                }
                
            } else {
                // CambiarNombreServicio
                appModelServ.user.password = patify(appModelServ.user.password);
                promise = consultarPost(appModelServ.user, 'acceso/login');
            }

            if (!jQuery.isEmptyObject(promise)) {
                promise.then(
                        function(payload) {
                            var result = payload.data;
                            $log.info('loginCtrl result', result);
                            if (result.success) {
                                //creamos la sesión con el email del usuario
                                appModelServ.user = result.data;
                                appModelServ.cacheSesion(appModelServ.user);
                                
                                //mandamos a la home
                                $location.path("/home");
                            }
                        },
                        function(errorPayload) {
                            $log.error('failure loading list', errorPayload);

                            $location.path("/");
                        });
            }
        } else {
            appModelServ.submitted = true;
        }

    };

    var init = function() {

        $('.inputs').keydown(function(e) {
            if (e.which === 13) {
                $log.info($(this).attr('id'));
                var index = $('.inputs').index(this) + 1;
                $('.inputs').eq(index).focus();
            }
        });

        /**
         * Check the validity state and update field accordingly.
         *
         * @public
         */
        MaterialTextfield.prototype.checkValidity = function() {
            if (this.input_.validity.valid) {
                this.element_.classList.remove(this.CssClasses_.IS_INVALID);
            } else {
                if (this.element_.getElementsByTagName('input')[0].value.length > 0) {
                    this.element_.classList.add(this.CssClasses_.IS_INVALID);
                }
            }
        };
    };

    init();
}