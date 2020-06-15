
`rpep-websockets`
=====

This is a [Websocket](https://tools.ietf.org/html/rfc6455) transport for [rpep.js](https://github.com/Tixit/rpep.js) using [theturtle32/WebSocket-Node](https://github.com/theturtle32/WebSocket-Node). RPEP is a simple, light-weight protocol for request-response and stream-event style communication between peers.

Install
=======

```
yarn install rpep-websockets
```

Usage
=====

Accessing rpep websockets:
```javascript
// node.js
var rpepWebsockets = require('rpep-websockets')

// node.js style for the browser (eg webpack)
var rpepWebsockets = require('rpep-websockets/ws.browser')

// amd
require.config({paths: {rpepWebsockets: '../dist/rpep-websockets.umd.js'}})
require(['rpepWebsockets'], function(rpepWebsockets) { /* your code */ })

// global variable
<script src="rpep-websockets.umd.js"></script>
rpepWebsockets; // rpep-websockets.umd.js can define rpepWebsockets globally if you really
             //   want to shun module-based design
```

API:

* **`var transport = rpepWebsockets(transportOptions)`** - Creates a new instance of the transport (to be pased into `rpep`'s constructor).
  * `transportOptions ` - (Optional) For node.js, these are options for [theturtle32/WebSocket-Node WebSocketServer](https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketServer.md) which can also be passed additional options from [theturtle32/WebSocket-Node WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md) (should just be `tlsOptions` and `webSocketVersion`). The most important option is `httpServer`, where you can pass a handle to an existing http server or https server. If no http/https server is passed, one will be created internally (http or https is determined by arguments passed to `listen`). For the browser, there are no transportOptions so none need be passed.
  
* **`transport.connect(host, port, [connectionOptions,] rpepOptions)`** - Connects to a websocket host. These arguments will be passed through to this method from a call to `rpep.connect`.
  * `connectionOptions` for node.js - These are [theturtle32/WebSocket-Node WebSocketClient](https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketClient.md) options. Important ones being:
    * `protocol` - (Default: 'ws') Either 'wss' or 'ws'
    * `wsProtocols` - A string or array of strings representing the websocket-protocols to request.
    * `origin`
    * `headers`
    * `requestOptions`
  * `connectionOptions` for the browser:
    * `binaryType` - The [binaryType property](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType) of a websocket connection. Defaults to "arraybuffer", which is what the `theturtle32/WebSocket-Node` library used for node.js requires.
    * `protocol` - (Default: 'ws') Either 'wss' or 'ws'.
  * `rpepOptions` are pass through arguments that don't affect the operation of this transport.

* **`transport.listen(port, [listenerOptions,] rpepOptions, requestHandler)`** - Listens for websocket connections. These arguments will be passed through to this method from a call to `rpep.listen`. This method only exists for the node.js version. You can't listen for websocket connections from a browser.
  * `listenerOptions`
    * `secure` - (Default:`false`) If `true` and `transportOptions.httpServer` is undefined, will create an https server. If `transportOptions.httpServer` is defined, this is ignored.
    * `secureOptions` - The options to pass into `https.createServer` if `secure` is true.
    * `httpServer` - If this is defined, uses this server instead of creating a new one.
    * `httpHandler(request, response)` - If this is defined, it is a callback that's called when a normal http/https request comes through.
  * `rpepOptions` are pass through arguments that don't affect the operation of this transport.

How to Test
===========

* Test for node: `node test/test.node`
* Test for browsers: `node test/testServer`

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT
