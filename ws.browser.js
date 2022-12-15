module.exports = function(transportOptions) {
    return {
        // connectionOptions
            // binaryType - The binaryType property of a websocket connection. Defaults to "arraybuffer"
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
            wsConnection.binaryType = connectionOptions.binaryType || "arraybuffer"

            const handlers = {open:[], close:[], message:[], error:[]}
            wsConnection.onopen = function() {
                for(const handler of handlers.open) {
                    handler.apply(wsConnection, arguments)
                }
            }
            wsConnection.onclose = function() {
                for(const handler of handlers.close) {
                    handler.apply(wsConnection, arguments)
                }
            }
            wsConnection.onmessage = function(m) {
                for(const handler of handlers.message) {
                    handler.apply(wsConnection, [m.data])
                }
            }
            wsConnection.onerror = function(e) {
                for(const handler of handlers.error) {
                    if(e instanceof Event) {
                        var error = new Error('Websocket error event (probably means the connection couldn\'t be made or has been closed)')
                        error.event = e
                        handler.apply(wsConnection, [error])
                    } else {
                        handler.apply(wsConnection, [e])
                    }
                }
            }

            return {
                send: function(m) {
                    wsConnection.send(m)
                },
                close: function() {
                    wsConnection.close()
                },
                onOpen: function(cb) {
                    handlers.open.push(cb)
                },
                onClose: function(cb) {
                    handlers.close.push(cb)
                },
                onMessage: function(cb) {
                    handlers.message.push(cb)
                },
                onError: function(cb) {
                    handlers.error.push(cb)
                },
                rawConnection: wsConnection
            }
        }
    }
}