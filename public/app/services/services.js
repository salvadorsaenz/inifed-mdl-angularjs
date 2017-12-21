/*
 * Servicios y Factorías Comúnes.
 */
(function () {
    'use strict';

    angular
            .module('common.services', [])
            .factory("consultarPost", consultarPost)
            .factory("consultarGet", consultarGet)
            .factory("appServices", appServices)
            .factory("postNtfFiles", postNtfFiles)
            ;

    //Servicios
    //--------------------------------------------------------------------------
    /**
     * @name consultarPost
     * @param {type} $http
     * @param {type} environment
     * @returns {Function}
     * @description permite realizar peticiones de tipo rest mediante el metodo POST 
     * devolviendo el resultado de tal petición
     */
    function consultarPost($http, environment) {
        return function (datos, servicio) {
            servicio = environment.URL_SERVICES + "/" + servicio;
            var req = {
                method: 'POST',
                url: servicio,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: datos
            };
            return $http(req);
        };
    }
    /**
     * @name consultarGet
     * @param {type} $http
     * @param {type} environment
     * @returns {Function}
     * @description permite realizar peticiones de tipo rest mediante el metodo POST 
     * devolviendo el resultado de tal petición
     */
    function consultarGet($http, environment) {
        return function (data, servicio) {
            servicio = environment.URL_SERVICES + "/" + servicio;
            var req = {
                method: 'GET',
                url: servicio,
                params: data
            };
            //req = $.extend(req, data);
            return $http(req);
        };

    }
    
    /**
     * @name postNtfFiles
     * @param {type} $http
     * @param {type} environment
     * @returns {Function}
     * @description permite realizar peticiones de tipo rest mediante el metodo POST 
     * devolviendo el resultado de tal petición
     */
    function postNtfFiles($http, environment) {
        return function (data, servicio) {
            servicio = environment.URL_SERVICES + "/" + servicio;
            var req = {
                method: 'POST',
                url: servicio,
                headers: { 'Content-Type': undefined },
                transformRequest: function (data) {
                    var formData = new FormData();                                                                
                    formData.append('idTarea', data.idTarea);
                    formData.append('file', data.file);
                    return formData;
                }, 
                data: data
            };
            return $http(req);
        };

    }
    /**
     * @name appServices
     * @param {type} $http
     * @param {type} environment
     * @param {type} $rootScope
     * @param {type} APP_CONFIG
     * @returns {services_L4.appServices.servicesAnonym$0}
     * @description contiene el catalogo de nombres de los servicios y su detalle que se ocupan dentro de la aplicación,
     * así mismo las funciones para realizar las peticiones rest a la BD
     */
    function appServices($http, environment) {
        var SERV_CAT = environment.URL_SERVICES;

        var services = {
            cat_huso_horario: {use: 'json', tipo: 'GET', service: SERV_CAT + '/..', json: 'assets/json/husohorario.json'}
        };

        function exec(serviceItem, data) {
            if (serviceItem.use === 'json') {
                return $http.get(serviceItem.json);
            }
            if (serviceItem.use === 'service') {
                if (serviceItem.tipo === 'GET') {
                    return get(serviceItem.service, data);
                } else if (serviceItem.tipo === 'POST') {
                    return post(serviceItem.service, data);
                }
            }
        }

        function post(urlService, data) {
            var request = {
                method: 'POST',
                url: urlService,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: data,
                cache: false
            };
            return $http(request);
        }

        function get(urlService, params) {
            var request = {
                method: 'GET',
                url: urlService,
                params: params,
                cache: false
            };
            return $http(request);
        }
        
        return {
            exec: exec,
            services: services
        };
    }

}());
