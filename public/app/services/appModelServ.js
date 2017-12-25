app.service('appModelServ', appModelServ);

function appModelServ(sesionesControl, $location, $log, $window) {
    $log.info('appModelServ');

    /*
     * Modelo Login
     */
    var user = {};
    var VISTAS = {};
    var home = {};
    var alertas = {};
    var reportes = {};
    var imagenes = {};
    VISTAS['home'] = home;
    VISTAS['alertas'] = alertas;
    VISTAS['reportes'] = reportes;
    VISTAS['imagenes'] = imagenes;

    var limpiaModelo = function(opcion) {
        $log.info('limpiaModelo opcion', opcion);
        $log.info('isLoggedIn', isLoggedIn());

        if (isLoggedIn() && (opcion != 'logout')) {
            $log.info('limpiaModelo con sessionStorage');
            user = getVariableSesion('userInifed');
            VISTAS = getVariableSesion('VISTAS');
        } else {
            $log.info('limpiaModelo completamente');
            VISTAS.home = getNewHome();
            VISTAS.alertas = getNewAlertas();
            VISTAS.reportes = getNewReportes();
            VISTAS.imagenes = getNewImagenes();
        }
        $log.info('user', user);
    };

    //función que comprueba si la sesión userLogin almacenada en sesionStorage existe
    var isLoggedIn = function() {
        return sesionesControl.get('userInifedLogin');
    };

    var cacheSesion = function(data) {
        //creamos la sesión con el objeto user
        sesionesControl.set('userInifedLogin', true);
        sesionesControl.set('userInifed', JSON.stringify(data));
    };
    var unCacheSesion = function() {
        //eliminamos la sesión del storage
        sesionesControl.unset('userInifedLogin');
        sesionesControl.unset('userInifed');
    };
    var setVariableSesion = function(name, data) {
        //creamos la sesión con el email del usuario
        sesionesControl.set(name, JSON.stringify(data));
    };
    var getVariableSesion = function(name) {
        try {
            return $.parseJSON(sesionesControl.get(name));
        } catch (err) {
            return {};
        }
    };
    var logout = function(message) {
        unCacheSesion();

        //mandamos al login
        $location.path('/login');
        $window.location.reload();
    };

    var getUser = function() {
        return user;
    };
    var setUser = function(user) {
        this.user = user;
    };
    var getNewUser = function() {
        return {
            usuario: '',
            password: '',
            idUsuario: 0,
            nombre: '',
            constructora: {
                idEmpresa: 0,
                nombreEmpresa: '',
                logo: ''
            },
            obrasAsignadas: [],
            idAsignacionSeleccionada: 0,
            obraSeleccionada: {
                idAsignacion: -1,
                idCCTTurno: 0,
                claveCCT: '',
                nombre: '',
                turno: '',
                nivel: '',
                estado: '',
                municipio: '',
                localidad: '',
                etps: []
            }
        };
    };

    var getNewHome = function() {
        return {
            id: 'home',
            desc: 'Home',
            selected: true,
            infoObra_show: false
        };
    };
    var getNewAlertas = function() {
        return {
            id: 'alertas',
            desc: 'Historial de Alertas',
            selected: false,
            alertas: {
                notificaciones: [],
                totalNoAtendidas: 0
            },
            alertaNoVista: true
            
        };
    };
    var getNewReportes = function() {
        return {
            id: 'reportes',
            desc: 'Gestor de Reportes',
            selected: false,
            listado: {
                selected: true,
                etapaSelected: true,
                tareaSelected: false,
                etapaSeleccionada: {
                    tareas: []
                },
                tareaSeleccionada: {},
                etapas: []
            },
            cargar: {
                selected: false,
                reporteSelected: true,
                imagenesSelected: false,
                imagenesPorTarea: [],
                imagenes: getNewViewImagenes()
            }
        };
    };
    var getNewViewImagenes = function() {
        var img = [
            {
                standby_show: false,
                archivo_show: true,
                imagencargada_show: false,
                imagencargada_idImagen: '',
                imagencargada_base64: '',
                imagencargada_nombre: ''
            }
            , {
                standby_show: true,
                archivo_show: false,
                imagencargada_show: false,
                imagencargada_idImagen: '',
                imagencargada_base64: '',
                imagencargada_nombre: ''
            }
            , {
                standby_show: true,
                archivo_show: false,
                imagencargada_show: false,
                imagencargada_idImagen: '',
                imagencargada_base64: '',
                imagencargada_nombre: ''
            }
            , {
                standby_show: true,
                archivo_show: false,
                imagencargada_show: false,
                imagencargada_idImagen: '',
                imagencargada_base64: '',
                imagencargada_nombre: ''
            }
            , {
                standby_show: true,
                archivo_show: false,
                imagencargada_show: false,
                imagencargada_idImagen: '',
                imagencargada_base64: '',
                imagencargada_nombre: ''
            }
            , {
                standby_show: true,
                archivo_show: false,
                imagencargada_show: false,
                imagencargada_idImagen: '',
                imagencargada_base64: '',
                imagencargada_nombre: ''
            }
        ];
        return img;
    };
    var getNewImagenes = function() {
        return {
            id: 'imagenes',
            desc: 'Gestor de Imágenes',
            selected: false,
            listado: {
                selected: true,
                etapaSelected: true,
                tareaSelected: false,
                etapaSeleccionada: {
                    tareas: []
                },
                tareaSeleccionada: {},
                etapas: []
            },
            cargar: {
                selected: false,
                imagenActual: {
                    num: 0,
                    name: ''
                },
                imagenes: getNewViewImagenes()
            }
        };
    };
    var getNewVISTAS = function() {
        VISTAS.home = getNewHome();
        VISTAS.alertas = getNewAlertas();
        VISTAS.reportes = getNewReportes();
        VISTAS.imagenes = getNewImagenes();
        return VISTAS;
    };

    var init = function() {
        limpiaModelo('inicio');
    };

    init();

    return {
        // Variables
        user: user
        , getUser: getUser
        , getNewUser: getNewUser
        , setUser: setUser
        , VISTAS: VISTAS
        , getNewVISTAS: getNewVISTAS
        , getNewImagenes: getNewImagenes
        , getNewViewImagenes: getNewViewImagenes

                // Funciones
        , cacheSesion: cacheSesion
        , unCacheSesion: unCacheSesion
        , logout: logout
        , isLoggedIn: isLoggedIn
        , limpiaModelo: limpiaModelo
        , setVariableSesion: setVariableSesion
        , getVariableSesion: getVariableSesion
    };

}