(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rpepWebsockets"] = factory();
	else
		root["rpepWebsockets"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./ws.browser.js ***!
  \***********************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(transportOptions) {
    return {
        // connectionOptions
            // binaryType - The binaryType property of a websocket connection
            // protocol - (Default: 'ws') Either 'wss' or 'ws'
        connect: function(host, port/*, [connectionOptions,] rpepOptions*/) {
            if(arguments.length <= 3) {
                var rpepOptions = arguments[2]
            } else {
                var connectionOptions = arguments[2]
                var rpepOptions = arguments[3]
            }

            if(!connectionOptions) connectionOptions = {}
            if(!connectionOptions.protocol) connectionOptions.protocol = 'ws'

            var wsConnection = new WebSocket(connectionOptions.protocol+'://'+host+':'+port)
            if(connectionOptions.binaryType)
                wsConnection.binaryType = connectionOptions.binaryType

            return {
                send: function(m) {
                    wsConnection.send(m)
                },
                close: function() {
                    wsConnection.close()
                },
                onOpen: function(cb) {
                    wsConnection.onopen = cb
                },
                onClose: function(cb) {
                    wsConnection.onclose = cb
                },
                onMessage: function(cb) {
                    wsConnection.onmessage = function(m) {
                        cb(m.data)
                    }
                },
                onError: function(cb) {
                    wsConnection.onerror = function(e) {
                        if(e instanceof Event) {
                            var error = new Error('Websocket error event (probably means the connection couldn\'t be made or has been closed)')
                            error.event = e
                            cb(error)
                        } else {
                            cb(e)
                        }
                    }
                },
                rawConnection: wsConnection
            }
        }
    }
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=rpepWebsockets-dev.umd.js.map