/*
 * Entornos de la aplicación.
 */
(function () {
    'use strict';
    angular
            .module("common.environments", [])
            .factory('environment', environment);

    function environment() {

        //====================================================================================================        
        // CONFIG
        //====================================================================================================        

        var H_PREFIX = "http"; // http | https
        var ENVIRONMENT = "SALVADOR"; // LOCALHOST | DESARROLLO | INTERNET2 | PANUCO | SALVADOR

        //====================================================================================================        
        // ENVIRONMENTS
        //====================================================================================================        

        var IP = {
            101: '192.168.2.101',            
            204: '192.168.2.204',  
            218: '192.168.2.218',          
            212: '192.168.2.212',            
            187: '187.188.119.197'
        };
        var SR = function (ip, port) {
            return IP[ip] + ':' + port;
        };

        var SERVER_BACK = {
            LOCALHOST: SR(218, 8080),
            DESARROLLO: SR(218, 8181),            
            OCOTEPEC: SR(212, 8083),
            INTERNET2: SR(187, 46101)};
        var SERVER_NODE = {
            LOCALHOST: SR(187, 9011),
            DESARROLLO: SR(187, 9011),            
            OCOTEPEC: SR(212, 9011),
            INTERNET2: SR(187, 9011)};
        var SERVER_RECURSOS = {
            LOCALHOST: IP[101],
            DESARROLLO: IP[101],            
            OCOTEPEC: IP[212],
            INTERNET2: IP[187]};

        //====================================================================================================        
        // FUNCTIONS
        //====================================================================================================        
        /**
         * @name getUrlBase
         * @param {array} server
         * @returns {String}
         * @description concatena el modo de conexión con el dominio del ambiente que se recibe por parametro
         */
        function getUrlBase(server) {
            return H_PREFIX + '://' + server[ENVIRONMENT];
        }
        /**
         * 
         * @param {*} server 
         * @description concatena el modo de conexión segura con el dominio del ambiente que se recibe por parametro
         */
        function getUrlBaseSec(server) {
            var sec = H_PREFIX;
            if (ENVIRONMENT === 'DESARROLLO' || ENVIRONMENT === 'INTERNET2') {
                sec = H_PREFIX + 's';
            }
            return sec + '://' + server[ENVIRONMENT];
        }
        /**
         * @name getServerBack
         * @returns {String}
         * @description devuelve la cadena de conexión a los servicios rest
         */
        function getServerBack() {
            return getUrlBaseSec(SERVER_BACK);
        }
        /**
         * @name getServerNode
         * @returns {String}
         * @description devuelve la cadena de conexión a los servicios de NODEjs
         */
        function getServerNode() {
            return getUrlBase(SERVER_NODE);
        }
        /**
         * @name getUrlRecursos
         * @returns {String}
         * @description devuelve la cadena de conexión al server de los recursos externos para que la aplicación 
         * los pueda consumir
         */
        function getUrlRecursos() {
            var url;
            if (ENVIRONMENT === 'LOCALHOST' || ENVIRONMENT === 'DESARROLLO') {
                url = getUrlBase(SERVER_RECURSOS) + '/pruebas/redes/recursos';
            } else {
                url = getUrlBase(SERVER_RECURSOS) + '/recursos';
            }
            return url;
        }
        /**
         * @name getUrlJson
         * @returns {String}
         * @description devuelve la cadena de conexión para el consumo de archivos externos
         */
        function getUrlJson() {
            var url;
            if (ENVIRONMENT === 'LOCALHOST') {
                url = 'assets';
            } else if (ENVIRONMENT === 'DESARROLLO') {
                url = getUrlBase(SERVER_RECURSOS) + '/pruebas/redes/recursos';
            } else {
                url = getUrlBase(SERVER_RECURSOS) + '/recursos';
            }
            return url;
        }
        /**
         * @name getTiles
         * @returns {String}
         * @description devuelve la dirección del server en donde se encuentran alojados las imagenes 
         * de la base del mapa(TILES) para uso de la aplicación
         */
        function getTiles() {
            var url;
            if (ENVIRONMENT === 'LOCALHOST' || ENVIRONMENT === 'DESARROLLO') {
                url = getUrlBase(SERVER_RECURSOS) + '/pruebas/redes/recursos';
            } else {
                url = getUrlBase(SERVER_RECURSOS) + '/recursos';
            }
            return url;
        }
        /**
         * @description devuelve la cadena de conexión hacia los servicios rest de back, acorde al tipo de 
         * ambiente espcificado 
         */
        function getUrlServices(){
            var url;
            var nombre = '/seguimientoinifedwsr/rest';
            if (ENVIRONMENT === 'DESARROLLO' || ENVIRONMENT === 'INTERNET2') {
                nombre = '/seguimientoinifedwsrs/rest';
            }
            url = getServerBack() + nombre;
            return url;
        }
        
        return {
            URL_SERVICES: getUrlServices()
            , URL_NODE_SERVICES: getServerNode()
            , URL_NODE_SOCKET: getServerNode() + '/redes'
            , URL_RECURSOS: getUrlRecursos()
            , URL_JSON: getUrlJson()
            , URL_TILES: getTiles()
            , getEnvironment: ENVIRONMENT
        };
    }

})();
