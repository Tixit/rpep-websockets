
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

Accessing rpep:
```javascript
// node.js
var rpepWebsockets = require('rpep-websockets')

// amd
require.config({paths: {rpepWebsockets: '../dist/rpep-websockets.umd.js'}})
require(['rpepWebsockets'], function(rpepWebsockets) { /* your code */ })

// global variable
<script src="rpep-websockets.umd.js"></script>
rpepWebsockets; // rpep-websockets.umd.js can define rpepWebsockets globally if you really
             //   want to shun module-based design
```

How to Test
===========

* Test for node: `node test/test.node`
* Test for browsers: `node test/testServer`

License
=======
Released under the MIT license: http://opensource.org/licenses/MIT