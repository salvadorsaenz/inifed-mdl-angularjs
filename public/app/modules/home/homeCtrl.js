//controlador home al que le añadimos la función de poder cerrar la sesión y pasamos
//con $scope.email el email con el que ha iniciado sesión para saludarlo, para esto 
//debemos inyectar las factorias sesionesControl y authServ
app.controller("homeCtrl", homeCtrl);

function homeCtrl($scope, environment, consultarPost, consultarGet, appServices, appModelServ, 
    $location, $log) {
                        
    $scope.user = appModelServ.user;
    $log.info('homeCtrl user', appModelServ.user);

    $scope.seleccionaObra = function(idAsignacion) {
        appModelServ.user.idAsignacionSeleccionada = idAsignacion;
        appModelServ.setVariableSesion('userInifed', appModelServ.user);
        console.log('seleccionaObra obraSeleccionada', appModelServ.user.idAsignacionSeleccionada);
        $location.path("/obra");
    };

    $scope.logout = function() {
        var promise = {};
        if (environment.getEnvironment === 'SALVADOR') {
            var serviceItem = {
                use: 'json'
                , json: 'public/assets/json/Logout_response.json'
            };
            promise = appServices.exec(serviceItem);
        } else {
            // CambiarNombreServicio
            var data = {};
            promise = consultarPost(data, 'acceso/logout');
        }
            
        promise.then(
            function(payload) {
                var result = payload.data;
                $log.info('homeCtrl logout payload', payload);
                if (result.success) {
                    appModelServ.logout('You logout correctly');
                }
            },
            function(errorPayload) {
                $log.error('failure loading list', errorPayload);

                $location.path("/");
            });
    };
    
    var consultaObrasAsignadas = function() {
        var promise = {};
        if (environment.getEnvironment === 'SALVADOR') {
            var serviceItem = {
                use: 'json'
                , json: 'public/assets/json/ObrasAsignadas_' + appModelServ.user.usuario + '.json'
            };
            promise = appServices.exec(serviceItem);
        } else {
            // CambiarNombreServicio
            promise = consultarGet(appModelServ.user.idUsuario, 'residente/cct/lista');
        }
            
        promise.then(
            function(payload) {
                var result = payload.data;
                $log.info('homeCtrl consultaObrasAsignadas result', result);
                if (result.success) {
                    appModelServ.user.obrasAsignadas = result.data;
                    appModelServ.setVariableSesion('userInifed', appModelServ.user);
                }
            },
            function(errorPayload) {
                $log.error('error consultaObrasAsignadas', errorPayload);
            });
    };

    var init = function() {
        if (appModelServ.user.hasOwnProperty('obrasAsignadas')) {
            if (appModelServ.user.obrasAsignadas.length == 0) {
                $log.info('consultaObrasAsignadas');
                consultaObrasAsignadas();
            } else {
                $log.info('Trae obras que estaban en memoria');
            }
        } else {
            consultaObrasAsignadas();
        }
    };

    init();
}