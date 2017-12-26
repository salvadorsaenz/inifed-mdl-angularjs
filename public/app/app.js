/**
 * Created with JetBrains PhpStorm.
 * User: Israel
 * Date: 3/07/13
 * Time: 15:20
 * To change this template use File | Settings | File Templates.
 */
var app = angular.module("app", ['ngRoute', 'ngMessages', 'common.services', 'common.environments']);

//damos configuración de ruteo a nuestro sistema de login
app.config(function ($routeProvider, $compileProvider, $sceDelegateProvider) {
    $routeProvider
            .when("/login", {
                controller: "loginCtrl",
                templateUrl: "public/app/modules/login/login.html",
                transclude: true
            })
            .when("/home", {
                controller: "homeCtrl",
                templateUrl: "public/app/modules/home/home.html"
            })
            .when("/obra", {
                controller: "obraCtrl",
                templateUrl: "public/app/modules/obra/obra.html"
            })
            .when("/imagenes", {
                controller: "imagenesCtrl",
                templateUrl: "public/app/modules/imagenes/imagenes.html"
            })
            .otherwise({
                redirectTo: '/login'
            })
            ;
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data|file|chrome-extension):/);
        //environment.getUrlServer;
        // We must whitelist the JSONP endpoint that we are using to show that we trust it
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://187.188.119.197/**',
            'https://192.168.2.218/**'
        ]);
});

//mientras corre la aplicación, comprobamos si el usuario tiene acceso a la ruta a la que está accediendo
//como vemos inyectamos authServ
app.run(function ($rootScope, $location, appModelServ, $timeout) {
    //creamos un array con las rutas que queremos controlar
    var rutasPrivadas = ['/login', '/home', '/obra', '/imagenes', '/logout'];
    $rootScope.anchoVentana = window.innerWidth;
    $rootScope.altoVentana = window.innerHeight;
    //al cambiar de rutas
    $rootScope.$on('$routeChangeStart', function () {
        //si en el array rutasPrivadas existe $location.path(), locationPath en el login
        //es /login, en la home /home etc, o el usuario no ha iniciado sesión, lo volvemos 
        //a dejar en el formulario de login
        if (in_array($location.path(), rutasPrivadas) && !appModelServ.isLoggedIn()) {
            $location.path("/login");
        }
        //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
        if (($location.path() === '/login') && appModelServ.isLoggedIn()) {
            $location.path("/home");
        }
        if ($location.path() === '/logout') {
//            appModelServ.user = appModelServ.getNewUser();
//            appModelServ.VISTAS = appModelServ.getNewVISTAS();
            appModelServ.logout('logout');
        }
    });

    $rootScope.$on('$viewContentLoaded', function () {
        $timeout(function () {
            componentHandler.upgradeAllRegistered();
        });
    });

    var addRippleEffect = function (e) {
        var target = e.target;
        if (target.tagName.toLowerCase() !== 'button')
            return false;
        var rect = target.getBoundingClientRect();
        var ripple = target.querySelector('.ripple');
        if (!ripple) {
            ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
            target.appendChild(ripple);
        }
        ripple.classList.remove('show');
        var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
        var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
        ripple.style.top = top + 'px';
        ripple.style.left = left + 'px';
        ripple.classList.add('show');
        return false;
    }
    document.addEventListener('click', addRippleEffect, false);

    function resizeEvent() {
        $rootScope.$apply(function () {
            $rootScope.altoVentana = window.innerHeight;
            $rootScope.anchoVentana = window.innerWidth;
        });
    }
    $(window).resize(function () {
        resizeEvent();
    });
});

//función in_array que usamos para comprobar si el usuario
//tiene permisos para estar en la ruta actual
function in_array(needle, haystack, argStrict) {
    var key = '',
            strict = !!argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
    return false;
}

