!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.rpepWebsockets=n():e.rpepWebsockets=n()}(this,function(){return function(e){function n(t){if(o[t])return o[t].exports;var r=o[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var o={};return n.m=e,n.c=o,n.d=function(e,o,t){n.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(o,"a",o),o},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n){e.exports=function(e){return{connect:function(e,n){if(arguments.length<=3){arguments[2]}else{var o=arguments[2];arguments[3]}o||(o={}),o.protocol||(o.protocol="ws");var t=new WebSocket(o.protocol+"://"+e+":"+n);return o.binaryType&&(t.binaryType=o.binaryType),{send:function(e){t.send(e)},close:function(){t.close()},onOpen:function(e){t.onopen=e},onClose:function(e){t.onclose=e},onMessage:function(e){t.onmessage=function(n){e(n.data)}},onError:function(e){t.onerror=function(n){if(n instanceof Event){var o=new Error("Websocket error event (probably means the connection couldn't be made or has been closed)");o.event=n,e(o)}else e(n)}},rawConnection:t}}}}}])});