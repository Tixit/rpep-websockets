"use strict";

var http = require("http")
var rpep = require("rpep")
var Unit = require('deadunit')

var testTransport = require('rpep/test/node_modules/testTransport')
var testUtils = require("rpep/test/node_modules/testUtils")

var wsNode = require('../ws.node')
var msgpack = require("rpep-msgpack")

Unit.test('All node tests', function(t) {
    this.timeout(5000)

    // this is here so that we actually get stack traces for unhandled promise rejections
    process.on('unhandledRejection', (reason, p) => {
      t.ok(false, 'Unhandled Rejection reason: '+reason)
      t.log(p)
    })
    process.on('uncaughtException', (reason) => {
        t.ok(false)
        t.log(reason)
    })


    //*

    this.test('ws.node', function(t) {
            t.count(2+1)

            var testOptions = {
                clientErrorOptions: ['localhost', 6080],
                clientError: "Connection couldn\'t be opened: \nconnectionFailure - Error: connect ECONNREFUSED 127.0.0.1:6080",
                listenerErrorOptions: ['notAValidPort'], listenerError: "listen EACCES: permission denied notAValidPort",
                rawMessages: testUtils.createRawMessageTests(msgpack),
                nextListenerOptions: function(lastOptions) {
                    if(lastOptions === undefined) lastOptions = [testOptions.clientErrorOptions[1]]
                    return [lastOptions[0]+1]
                },
                nextClientOptions: function(lastOptions) {
                    if(lastOptions === undefined) lastOptions = testOptions.clientErrorOptions
                    return ['localhost', lastOptions[1]+1]
                }
            }

            testUtils.runTest(this, 'rpep with websockets for node', msgpack, wsNode, testOptions).then(function() {
                t.test("ws.node-specific tests", function(t) {
                    this.count(3)

                    var pem = require('pem')
                    pem.createCertificate({days:365*10, selfSigned:true}, function(e, tlsKeys) {
                        if(e) throw e

                        testOptions.clientErrorOptions[1] = 7080
                        testOptions.clientError = "Connection couldn\'t be opened: \nconnectionFailure - Error: connect ECONNREFUSED 127.0.0.1:7080",
                        testOptions.nextListenerOptions = function(lastOptions) {
                            if(lastOptions === undefined) lastOptions = [testOptions.clientErrorOptions[1]]
                            return [lastOptions[0]+1, {
                                secure:true,
                                secureOptions:{key: tlsKeys.serviceKey, cert: tlsKeys.certificate}
                            }]
                        }
                        testOptions.nextClientOptions = function(lastOptions) {
                            if(lastOptions === undefined) lastOptions = testOptions.clientErrorOptions
                            return ['localhost', lastOptions[1]+1, {protocol:'wss', tlsOptions:{rejectUnauthorized: false}}]
                        }

                        testUtils.runTest(t, 'tls/wss', msgpack, function() {
                            return wsNode()
                        }, testOptions)
                    })


                    // this.test('maximum frame size exceeded', function() {
                    //
                    // })
                    //
                    this.test('http server option', function() {
                        this.count(2)

                        const httpServerPort = 8912, ignoredPort = 8000
                        const httpServer = http.createServer(function (request, response) {
                            response.writeHead(200)
                            response.end()
                        }).listen(httpServerPort)

                        var server = rpep(wsNode(), msgpack)
                        server.listen(ignoredPort, {httpServer}, function(request) {
                            request.accept()
                            setTimeout(() => server.close())
                        })

                        const client = rpep(wsNode(), msgpack)
                        client.connect('localhost', httpServerPort).then(connection => {
                            this.ok(true)
                        })

                        client.connect('localhost', ignoredPort).catch(e => {
                            this.ok(e.message.includes("ECONNREFUSED"))
                        })
                    })
                    //
                    // this.test('different protocols', function() {
                    //
                    // })
                })
            })


        })


    //*/

}).writeConsole(1000)