
app.controller("obraCtrl", obraCtrl);

function obraCtrl($scope, environment, consultarPost, consultarGet, appServices, appModelServ,
        postNtfFiles, $log, $location) {

    $log.info('obraCtrl');
    var imagenActual = {
        num: -1,
        name: ''
    };
    var dialog = document.querySelector('dialog');
    $scope.user = appModelServ.user;
    $scope.VISTAS = appModelServ.VISTAS;
    var newReporte = function() {
        return {
            avanceSemanal: 0,
            textoAvance: '',
            imagenesAdjuntasSelected: [false, false, false, false, false, false],
            imagenesAdjuntas: [],
            puedeEnviarReporte: false
        };
    };
    $scope.reporte = newReporte();
    $scope.imagenes = {
        porSubir: 0,
        respondioService: 0,
        cargadas: 0
    };
    $scope.dialog = {
        status: 'Reporte enviado correctamente',
        mensaje: 'Folio: B20420'
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
        var result = $.grep(appModelServ.VISTAS[vista].listado.etapas, function(e) {
            return e.idEtapa == opcion;
        });
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
        var result = $.grep(appModelServ.VISTAS[vista].listado.etapaSeleccionada.tareas, function(e) {
            return e.idTarea == opcion;
        });
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

    var muestraDatosModal = function() {
        if (appModelServ.VISTAS['imagenes'].selected) {
            $scope.dialog.status = 'Carga exitosa';
            $scope.dialog.mensaje = 'Se añadieron ' + $scope.imagenes.cargadas
                    + ' imágenes a '
                    + appModelServ.VISTAS['imagenes'].listado.tareaSeleccionada.orden + ' '
                    + appModelServ.VISTAS['imagenes'].listado.tareaSeleccionada.nombre;
        } else {
            $scope.dialog.status = 'Reporte enviado correctamente';
            $scope.dialog.mensaje = 'Folio: ';
        }
        dialog.showModal();
    };

    $scope.guardar = function() {
        $log.info('guardar');
        $scope.imagenes = {
            porSubir: 0,
            respondioService: 0,
            cargadas: 0
        };
        var files = $('.archivo');
        var arrFiles = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].files.length > 0) {
//                $log.info('file', files[i].files[0]);
                arrFiles.push(files[i].files[0]);
            }
        }
        $log.info('arrFiles', arrFiles);
        $scope.imagenes.porSubir = arrFiles.length;

        if ($scope.imagenes.porSubir > 0) {
            var promise = {};
            for (var j = 0; j < arrFiles.length; j++) {
                if (environment.getEnvironment === 'SALVADOR') {
                    var serviceItem = {
                        use: 'json'
                        , json: 'public/assets/json/GuardaImagen_response.json'
                    };
                    promise = appServices.exec(serviceItem);
                } else {
                    // CambiarNombreServicio
                    var data = {
                        idTarea: appModelServ.VISTAS['imagenes'].listado.tareaSeleccionada.idTarea,
                        file: arrFiles[j]
                    };
                    promise = postNtfFiles(data, 'imagen/fileupload');
                }

                promise.then(
                        function(payload) {
                            var result = payload.data;
                            $log.info('result', result);
                            if (result.success) {
                                $scope.imagenes.cargadas++;
                            }
                            $scope.imagenes.respondioService++;

                            if ($scope.imagenes.respondioService === $scope.imagenes.porSubir) {
                                muestraDatosModal();
                            }
                        },
                        function(errorPayload) {
                            $log.error('failure errorPayload', errorPayload);
                            $scope.imagenes.respondioService++;

                            if ($scope.imagenes.respondioService === $scope.imagenes.porSubir) {
                                muestraDatosModal();
                            }
                        });
            }
        }

    };

    var consultaImagenesPorTarea = function() {
        var promise = {};
        if (environment.getEnvironment === 'SALVADOR') {
            var serviceItem = {
                use: 'json'
                , json: 'public/assets/json/ListaImagenesPorTarea_response.json'
            };
            promise = appServices.exec(serviceItem);
        } else {
            // CambiarNombreServicio
            promise = consultarGet({idTarea: appModelServ.VISTAS['imagenes'].listado.tareaSeleccionada.idTarea}, 'imagen/preasignada/tarea/lista');
        }

        promise.then(
                function(payload) {
                    var result = payload.data;
                    $log.info('consultaImagenesPorTarea result', result);
                    if (result.success) {
                        appModelServ.VISTAS['reportes'].cargar.imagenesPorTarea = result.data;
                        appModelServ.setVariableSesion('VISTAS', appModelServ.VISTAS);

                        for (var i = 0; i < result.data.length; i++) {
                            appModelServ.VISTAS['reportes'].cargar.imagenes[i].imagencargada_idImagen = result.data[i].idImagen;
                            appModelServ.VISTAS['reportes'].cargar.imagenes[i].imagencargada_base64 = result.data[i].imagen;
                            appModelServ.VISTAS['reportes'].cargar.imagenes[i].imagencargada_nombre = result.data[i].nombre;
                            appModelServ.VISTAS['reportes'].cargar.imagenes[i].standby_show = false;
                            appModelServ.VISTAS['reportes'].cargar.imagenes[i].imagencargada_show = true;
                        }
                    }
                },
                function(errorPayload) {
                    $log.error('error consultaImagenesPorTarea', errorPayload);
                });
    };

    $scope.agregarImagenes = function() {
        appModelServ.VISTAS['reportes'].cargar.reporteSelected = false;
        appModelServ.VISTAS['reportes'].cargar.imagenesSelected = true;
        consultaImagenesPorTarea();
    };

    $scope.adjuntar = function() {
        $scope.reporte.imagenesAdjuntas = [];
        for (var i = 0; i < $scope.reporte.imagenesAdjuntasSelected.length; i++) {
            if ($scope.reporte.imagenesAdjuntasSelected[i]) {
                $scope.reporte.imagenesAdjuntas.push(appModelServ.VISTAS['reportes'].cargar.imagenes[i].imagencargada_idImagen);
            }
        }
        $log.info('imagenesAdjuntas', $scope.reporte.imagenesAdjuntas);
        appModelServ.VISTAS['reportes'].cargar.reporteSelected = true;
        appModelServ.VISTAS['reportes'].cargar.imagenesSelected = false;
    };

    $scope.enviarReporte = function() {
        var data = {
            idSemana: appModelServ.VISTAS['reportes'].listado.tareaSeleccionada.idSemana,
            idTarea: appModelServ.VISTAS['reportes'].listado.tareaSeleccionada.idTarea,
            porcentaje: $scope.reporte.avanceSemanal,
            porcentajeAculado: appModelServ.VISTAS['reportes'].listado.tareaSeleccionada.porcentajeAcumulado,
            descripcion: $scope.reporte.textoAvance,
            usuario: appModelServ.user.idUsuario,
            imagenes: $scope.reporte.imagenesAdjuntas
        };
        $log.info('enviarReporte data', data);
        var promise = {};
        if (environment.getEnvironment === 'SALVADOR') {
            var serviceItem = {
                use: 'json'
                , json: 'public/assets/json/EnviaReporte_response.json'
            };
            promise = appServices.exec(serviceItem);
        } else {
            // CambiarNombreServicio
            promise = consultarPost(data, 'residente/reporte/tarea');
        }

        promise.then(
                function(payload) {
                    var result = payload.data;
                    if (result.success) {
                        $scope.reporte = newReporte();
                        muestraDatosModal();
                    }
                },
                function(errorPayload) {
                    $log.error('error consultaObra', errorPayload);
                    muestraDatosModal();
                });
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

    var regresarAHome = function() {
        if (appModelServ.VISTAS['imagenes'].selected) {
            appModelServ.VISTAS['imagenes'].listado.selected = true;
            appModelServ.VISTAS['imagenes'].cargar.selected = false;
            appModelServ.VISTAS['imagenes'].listado.etapaSelected = true;
            appModelServ.VISTAS['imagenes'].listado.tareaSelected = false;
            appModelServ.VISTAS['imagenes'].cargar.imagenes = appModelServ.getNewViewImagenes();
        } else {
            appModelServ.VISTAS['reportes'].listado.selected = true;
            appModelServ.VISTAS['reportes'].cargar.selected = false;
            appModelServ.VISTAS['reportes'].listado.etapaSelected = true;
            appModelServ.VISTAS['reportes'].listado.tareaSelected = false;
            appModelServ.VISTAS['reportes'].cargar.imagenes = appModelServ.getNewViewImagenes();
        }
        appModelServ.VISTAS['home'].selected = true;
        appModelServ.VISTAS['imagenes'].selected = false;
        appModelServ.VISTAS['reportes'].selected = false;

        $scope.$apply();
    };
    
    var init = function() {
        $('.archivo').on('change', function() {
            uploadfilesChange(this, resultBase64);
        });

        if (!dialog.showModal) {
            dialogPolyfill.registerDialog(dialog);
        }
        $('.close').on('click', function() {
            $log.info('close');
            dialog.close();
            regresarAHome();
        });

        $log.info('consultaObra y consultaEtapas');
        consultaObra();
        consultaEtapas();
    };

    init();
}