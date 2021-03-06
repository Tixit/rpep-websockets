var path = require("path")

var buildModule = require("build-modules")

var buildDirectory = path.join(__dirname,'dist')
var generatedTestDirectory = path.join(__dirname,'test/generated')

var copywrite = '/* Copyright (c) 2013 Billy Tetrud - Free to use for any purpose: MIT License*/'

console.log('building and minifying...')
var name = 'rpepWebsockets'
var prod = build('ws.browser', false, {output: {path:buildDirectory}, header: copywrite, name:name, minify:true})
var dev = build('ws.browser', false, {output: {path:buildDirectory, name:name+'-dev.umd.js'}, header: copywrite, name:name, minify:false})

// tests
name = 'test.browser'
var test = build('./test/'+name, false, {output: {path:generatedTestDirectory, name:name+'.umd.js'}, header: copywrite, name:name, minify:false})

exports.done = new Promise(function(resolve) {
    var n = 0, bundles = [test]//,prod,dev]

    var check = function() {
        if(n === bundles.length) resolve()
    }

    bundles.forEach(function(buildRun) {
        buildRun.on('done', function() {
            n++
            check()
        })

    })
})

function build(relativeModulePath, watch, options) {
    var emitter = buildModule(path.join(__dirname, '.', relativeModulePath), {
        watch: watch/*, header: copyright*/, name: options.name, minify: options.minify,
        output: options.output
    })
    emitter.on('done', function() {
       console.log((new Date())+" - Done building "+relativeModulePath+"!")
    })
    emitter.on('error', function(e) {
       console.log(e)
    })
    emitter.on('warning', function(w) {
       console.log(w)
    })

    return emitter
}
