//factoria para guardar y eliminar sesiones con sessionStorage
app.factory('sesionesControl', function () {
    return {
        //obtenemos una sesión //getter
        get: function (key) {
            return sessionStorage.getItem(key);
        },
        //creamos una sesión //setter
        set: function (key, val) {
            return sessionStorage.setItem(key, val);
        },
        //limpiamos una sesión
        unset: function (key) {
            return sessionStorage.removeItem(key);
        }
    };
});

//esto simplemente es para lanzar un mensaje si el login falla, se puede extender para darle más uso
app.factory('mensajesFlash', function ($rootScope) {
    return {
        show: function (message) {
            Materialize.toast(message, 4000);
        },
        clear: function () {
            $rootScope.flash = "";
        }
    };
});