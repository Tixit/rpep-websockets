var http = require("http")
var https = require("https")

var proto = require('proto')
var WebSocketServer = require('websocket').server
var WebSocketClient = require('websocket').client


module.exports = function() {
    
    return {
        // connectionOptions - Options to pass to WebSocket-Node's WebSocketClient.
            // protocol - (Default: 'ws') Either 'wss' or 'ws'
            // wsProtocols - A string or array of strings representing the websocket-protocols to request
            // origin
            // headers
            // requestOptions
            // Additional options from https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md
        connect: function(host, port/*, [connectionOptions,] rpepOptions*/) {
            if(arguments.length <= 3) {
                var rpepOptions = arguments[2]
            } else {
                var connectionOptions = arguments[2]
                var rpepOptions = arguments[3]
            }

            if(connectionOptions === undefined) connectionOptions = {}
            var co = Object.assign({}, connectionOptions) // copy

            if(co.protocol === undefined) co.protocol = 'ws'
            if(co.wsProtocol === undefined) co.wsProtocol = ''

            var client = new WebSocketClient(co)
            client.connect(co.protocol+'://'+host+':'+port, co.wsProtocol, co.origin, co.headers, co.requestOptions)

            return ClientConnectionObject(client)
        },

        // port - (Optional) The port to use *only* if the `httpServer`
        // listenerOptions - options for https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketServer.md
            // secure - (Default:false) If true and `httpServer` is undefined, will create an https server
            // secureOptions - The options to pass into `https.createServer` if `secure` is true
            // httpServer - If this is defined, uses this server instead of creating a new one
            // httpHandler(request) - If this is defined, it is a callback that's called when a normal http request comes through.
        // rpepOptions - Unused here, but will be passed.
        listen: function(port/*,[listenerOptions,] rpepOptions, requestHandler*/) {
            if(arguments.length <= 3) {
                var rpepOptions = arguments[1]
                var requestHandler = arguments[2]
            } else {
                var listenerOptions = arguments[1]
                var rpepOptions = arguments[2]
                var requestHandler = arguments[3]
            }

            if(listenerOptions === undefined) listenerOptions = {}
            var LO = listenerOptions

            if(LO.wsProtocol === undefined) LO.wsProtocol = ''

            if(LO.httpServer === undefined) {
                if(LO.secure) {
                    LO.httpServer = https.createServer(LO.secureOptions, LO.httpHandler)
                } else {
                    LO.httpServer = http.createServer(LO.httpHandler)
                }
                LO.httpServer.listen(port)
            }

            var wsServer = new WebSocketServer(listenerOptions)
            wsServer.on('request', function(request) {
                try {
                    requestHandler({
                        rawRequest: request,
                        //resource: request.resource,
                        // remoteAddress: request.remoteAddress,
                        // origin: request.origin,

                        accept: function(protocol) {
                            // a websocket connection: https://github.com/theturtle32/WebSocket-Node/wiki/Documentation
                            var connection = request.accept(protocol, request.origin)
                            return ServerConnectionObject(connection)
                        },

                        // xWebSocketRejectReason is a message to send back to the client in the form of an "X-WebSocket-Reject-Reason" header
                        reject: function(httpStatus, xWebSocketRejectReason) {
                            if(xWebSocketRejectReason === undefined) xWebSocketRejectReason = "Websocket connection was rejected by the application."
                            if(httpStatus === undefined) httpStatus = 404
                            
                            request.reject(httpStatus, xWebSocketRejectReason)
                        }
                    })
                } catch(e) {
                    if(errorHandler) {
                        errorHandler(e)
                    }
                }
            })

            var onCloseHandler, errorHandler;
            return {
                close: function() {
                    wsServer.shutDown()
                    listenerOptions.httpServer.close()
                    if(onCloseHandler) onCloseHandler()
                },
                onListening: function(cb) {
                    listenerOptions.httpServer.on('listening', cb)
                },
                onClose: function(cb) {
                    onCloseHandler = cb
                },
                onError: function(cb) {
                    errorHandler = cb
                    listenerOptions.httpServer.on('error', cb)
                }
            }
        }
    }
}



var ClientConnectionObject = function(client) {

    var wsConnection, onCloseHandler, onMessageHandler, onErrorHandler;
    client.on('connect', function(connection) {
        wsConnection = connection
        attachCloseHandler(connection, onCloseHandler)
        attachMessageHandler(connection, onMessageHandler)
        attachErrorHandler(connection, onErrorHandler)
    })
    client.on('connectFailed', function(errorString) {
        var reason = errorString.toString().match(/x-websocket-reject-reason: (.*)/)

        var e = new Error('connectionFailure')
            e.cause = errorString.toString()
            e.toString = function() {
                return 'connectionFailure - '+errorString
            }
        if(reason !== null) {
            e.reason = reason[1]
        }

        onErrorHandler(e)
        onCloseHandler() // this should have been setup at this point
    })

    return {
        send: function(m) {
            wsConnection.send(m)
        },
        close: function() {
            wsConnection.close()
        },
        onOpen: function(cb) {
            client.on('connect', function(connection) {
                cb()
            })
        },
        onClose: function(cb) {
            onCloseHandler = cb
        },
        onMessage: function(cb) {
            onMessageHandler = cb
        },
        onError: function(cb) {
            onErrorHandler = cb
        },
        get rawConnection() {
            return wsConnection
        }
    }
}


var ServerConnectionObject = function(wsConnection) {
    return {
        send: function(m) {
            wsConnection.send(m)
        },
        close: function() {
            wsConnection.close()
        },
        onOpen: function(cb) {
            setTimeout(function() {
                cb() // connection is already open
            })
        },
        onClose: function(cb) {
            attachCloseHandler(wsConnection, cb)
        },
        onMessage: function(cb) {
            attachMessageHandler(wsConnection, cb)
        },
        onError: function(cb) {
            attachErrorHandler(wsConnection, cb)
        },
        get rawConnection() {
            return wsConnection
        }
    }
}

function attachCloseHandler(wsConnection, onCloseHandler) {
    if(onCloseHandler) {
        wsConnection.on('close', function(reasonCode, description) {
            onCloseHandler()
        })
    }
}
function attachMessageHandler(wsConnection, onMessageHandler) {
    if(onMessageHandler) {
        wsConnection.on('message', function(data) {
            if(data.type === 'utf8') {
                onMessageHandler(data.utf8Data)
            } else if(data.type === 'binary') {
                onMessageHandler(data.binaryData)
            } else {
                throw Error('Unknown type: '+data.type)
            }
        })
    }
}
function attachErrorHandler(wsConnection, onErrorHandler) {
    if(onErrorHandler) {
        wsConnection.on('error', function(e) {
            onErrorHandler(e)
        })
    }
}