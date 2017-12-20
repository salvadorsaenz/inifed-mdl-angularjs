
app.controller("obraCtrl", obraCtrl);

function obraCtrl($scope, environment, consultarPost, consultarGet, appServices, appModelServ, $log) {
        
    $log.info('obraCtrl');
    var imagenActual = {
        num: -1,
        name: ''
    };
    $scope.user = appModelServ.user;
    $scope.VISTAS = appModelServ.VISTAS;
    $scope.reporte = {
        avanceSemanal: 0
    };

    $scope.muestraOcultaInfoObra = function() {
        $scope.VISTAS['home'].infoObra_show = !$scope.VISTAS['home'].infoObra_show;
    };

    $scope.seleccionaVista = function(opcion) {
        angular.forEach(appModelServ.VISTAS, function(value, key) {
            if (key != opcion) {
                value.selected = false;
            }
        });

        appModelServ.VISTAS[opcion].selected = !appModelServ.VISTAS[opcion].selected;
        if (!appModelServ.VISTAS[opcion].selected) {
            appModelServ.VISTAS['home'].selected = true;
        }
        appModelServ.setVariableSesion('VISTAS', appModelServ.VISTAS);
    };
    
    $scope.seleccionaEtapa = function(vista, opcion) {
        $log.info('seleccionaEtapa opcion', opcion, 'vista', vista);
        var result = $.grep(appModelServ.VISTAS[vista].listado.etapas, function(e){ return e.idEtapa == opcion; });
        if (result.length == 1) {
            $log.info('etapa', result[0]);
            appModelServ.VISTAS[vista].listado.etapaSeleccionada = result[0];
            appModelServ.VISTAS[vista].listado.etapaSelected = false;
            appModelServ.VISTAS[vista].listado.tareaSelected = true;
            appModelServ.setVariableSesion('VISTAS', appModelServ.VISTAS);
        }
    };
    
    $scope.seleccionaTarea = function(vista, opcion) {
//        $log.info('seleccionaEtapa opcion', opcion, 'vista', vista);
        var result = $.grep(appModelServ.VISTAS[vista].listado.etapaSeleccionada.tareas, function(e){ return e.idTarea == opcion; });
        if (result.length == 1) {
            $log.info('tarea', result[0]);
            appModelServ.VISTAS[vista].listado.tareaSeleccionada = result[0];
            appModelServ.VISTAS[vista].listado.selected = false;
            appModelServ.VISTAS[vista].cargar.selected = true;
            appModelServ.setVariableSesion('VISTAS', appModelServ.VISTAS);
        }
    };
    
    $scope.irAEtapas = function() {
//        $log.info('irAEtapas');
        appModelServ.VISTAS['imagenes'].listado.etapaSeleccionada = {};
        appModelServ.VISTAS['imagenes'].listado.etapaSelected = true;
        appModelServ.VISTAS['imagenes'].listado.tareaSelected = false;
    };

    var consultaObra = function() {
        var promise = {};
        if (environment.getEnvironment === 'SALVADOR') {
            var serviceItem = {
                use: 'json'
                , json: 'public/assets/json/ObraAsignada_' + appModelServ.user.idAsignacionSeleccionada + '.json'
            };
            promise = appServices.exec(serviceItem);
        } else {
            // CambiarNombreServicio
            promise = consultarGet({idAsignacion: appModelServ.user.idAsignacionSeleccionada}, 'residente/cct/consulta');
        }

        promise.then(
                function(payload) {
                    var result = payload.data;
                    if (result.success) {
                        appModelServ.user.obraSeleccionada = result.data;
                        appModelServ.setVariableSesion('userInifed', appModelServ.user);
//                        $log.info('obraCtrl consultaObra appModelServ.user', appModelServ.user);
                    }
                },
                function(errorPayload) {
                    $log.error('error consultaObra', errorPayload);
                });
    };
    
    var consultaEtapas = function() {
        var promise = {};
        if (environment.getEnvironment === 'SALVADOR') {
            var serviceItem = {
                use: 'json'
                , json: 'public/assets/json/ListadoEtapasTareas_response.json'
            };
            promise = appServices.exec(serviceItem);
        } else {
            // CambiarNombreServicio
            promise = consultarGet({idAsignacion: appModelServ.user.idAsignacionSeleccionada}, 'residente/programa/consulta');
        }

        promise.then(
                function(payload) {
                    var result = payload.data;
                    if (result.success) {
                        appModelServ.VISTAS = appModelServ.getNewVISTAS();
                        appModelServ.VISTAS['reportes'].listado.etapas = result.data;
                        appModelServ.VISTAS['imagenes'].listado.etapas = result.data;
                        appModelServ.setVariableSesion('VISTAS', appModelServ.VISTAS);
//                        $log.info('obraCtrl consultaEtapas result', result);
                    }
                },
                function(errorPayload) {
                    $log.error('error consultaObra', errorPayload);
                });
    };
    
    var recorreLaSiguienteImagen = function() {
        if ((imagenActual.num + 1) < appModelServ.VISTAS['imagenes'].cargar.imagenes.length) {
            imagenActual.num++;
            appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].standby_show = false;
            appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].archivo_show = true;
            appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].imagencargada_show = false;
        }
        $scope.$apply();
    };
    
    var resultBase64 = function(base64data) {
        appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].imagencargada_show = true;
        appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].imagencargada_show = true;
        appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].imagencargada_base64 = base64data;
        appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].imagencargada_nombre = imagenActual.name;
        appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].standby_show = false;
        appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num].archivo_show = false;
        
//        console.log('resultBase64', appModelServ.VISTAS['imagenes'].cargar.imagenes[imagenActual.num]);
        recorreLaSiguienteImagen();
    };
    
    var uploadfilesChange = function(that, callback) {
        imagenActual.num = parseInt($(that).prop('id').split('_')[1]);
//        console.info('uploadfilesChange num', imagenActual.num);
        var files = that.files;
        for (var i = 0; i < files.length; i++) {
            imagenActual.name = files[i].name;
            console.info('name', imagenActual.name);
            var reader = new window.FileReader();
            reader.readAsDataURL(files[i]);
            reader.onloadend = function() {
                var base64data = reader.result;
                if (typeof callback === "function") {
                    callback(base64data);
                }
            };
        }
    };

    var init = function() {
        $('.archivo').on('change', function() {
            uploadfilesChange(this, resultBase64);
        });
        
//        var hazRequestConsultaObras = false;
//        if (!appModelServ.user.hasOwnProperty('obraSeleccionada')) {
//            hazRequestConsultaObras = true;
//        } else if (appModelServ.user.obraSeleccionada.idAsignacion == -1) {
//            hazRequestConsultaObras = true;
//        } else if (appModelServ.user.idAsignacionSeleccionada != appModelServ.user.obraSeleccionada.idAsignacion) {
//            hazRequestConsultaObras = true;
//        }
//        
//        if (hazRequestConsultaObras) {
            $log.info('consultaObra y consultaEtapas');
            consultaObra();
            consultaEtapas();
//        } else {
//            $log.info('obraCtrl init appModelServ.user', appModelServ.user);
//        }
    };

    init();
}