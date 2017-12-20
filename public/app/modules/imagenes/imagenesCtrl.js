//controlador imagenes al que le añadimos la función de poder cerrar la sesión y pasamos
//con $scope.email el email con el que ha iniciado sesión para saludarlo, para esto 
//debemos inyectar las factorias sesionesControl y authServ
app.controller("imagenesCtrl", imagenesCtrl);

function imagenesCtrl($scope, environment, consultarPost, consultarGet, appServices, appModelServ, $timeout, $location, $log) {
    $scope.imagenActual = {
        num: 0,
        name: ''
    };
    $scope.imagenes = [
        {
            standby_show: false,
            archivo_show: true,
            imagencargada_show: false,
            imagencargada_base64: '',
            imagencargada_nombre: ''
        }
        , {
            standby_show: true,
            archivo_show: false,
            imagencargada_show: false,
            imagencargada_base64: '',
            imagencargada_nombre: ''
        }
        , {
            standby_show: true,
            archivo_show: false,
            imagencargada_show: false,
            imagencargada_base64: '',
            imagencargada_nombre: ''
        }
        , {
            standby_show: true,
            archivo_show: false,
            imagencargada_show: false,
            imagencargada_base64: '',
            imagencargada_nombre: ''
        }
        , {
            standby_show: true,
            archivo_show: false,
            imagencargada_show: false,
            imagencargada_base64: '',
            imagencargada_nombre: ''
        }
        , {
            standby_show: true,
            archivo_show: false,
            imagencargada_show: false,
            imagencargada_base64: '',
            imagencargada_nombre: ''
        }
    ];

    var recorreLaSiguienteImagen = function() {
        if (($scope.imagenActual.num + 1) < $scope.imagenes.length) {
            $scope.imagenActual.num++;
            $scope.imagenes[$scope.imagenActual.num].standby_show = false;
            $scope.imagenes[$scope.imagenActual.num].archivo_show = true;
            $scope.imagenes[$scope.imagenActual.num].imagencargada_show = false;
        }
        $scope.$apply();
    };

    var resultBase64 = function(base64data) {
        $scope.imagenes[$scope.imagenActual.num].imagencargada_show = true;
        $scope.imagenes[$scope.imagenActual.num].imagencargada_base64 = base64data;
        $scope.imagenes[$scope.imagenActual.num].imagencargada_nombre = $scope.imagenActual.name;
        $scope.imagenes[$scope.imagenActual.num].standby_show = false;
        $scope.imagenes[$scope.imagenActual.num].archivo_show = false;

        console.log('resultBase64', $scope.imagenes[$scope.imagenActual.num]);
        recorreLaSiguienteImagen();
    };

    var uploadfilesChange = function(that, callback) {
        $scope.imagenActual.num = parseInt($(that).prop('id').split('_')[1]);
        console.info('uploadfilesChange num', $scope.imagenActual.num);
        var files = that.files;
        for (var i = 0; i < files.length; i++) {
            $scope.imagenActual.name = files[i].name;
            var reader = new window.FileReader();
            reader.readAsDataURL(files[i]);
            reader.onloadend = function() {
                var base64data = reader.result;
                if (typeof callback === "function") {
                    callback(base64data);
                }
//                console.log('base64data', base64data);

            };
        }
    };

    $('.archivo').on('change', function() {
        uploadfilesChange(this, resultBase64);
    });
}