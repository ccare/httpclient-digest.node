var http = require("http");
var MemoryStream = require('memstream').MemoryStream;
var digestUtils = require('./digestUtils')

function digestRequest(options) {
    var nextReq;
    var inputEnded = false;
    var memstream = new MemoryStream(function(buffer) {
	nextReq.write(buffer)
	inputEnded = true
	if (! memstream.writable) {
	    nextReq.end()
	}
    })
    var initialReq = http.request(options)
    initialReq.on('response', function(resp) {
        var wwwAuth = resp.headers['www-authenticate']
        var authInfo = digestUtils.parseWWWAuth(wwwAuth)
	if (options.method == null) {
	    options.method = "GET"
	}
	var realm = authInfo.realm
	var userInfo = passwordCache[realm]
	if (userInfo == null) {
	    throw "No user info for realm " + realm
	}
	var user = userInfo.user
	var password = userInfo.passwd
        var h = digestUtils.createAuthHeader(options.method, realm, authInfo.nonce, authInfo.algorithm, authInfo.qop, "MDI1NzAz", user, password, options.path)
	var nextReqOptions = {method: options.method, path: options.path, host: options.host, headers: options.headers}
        if (nextReqOptions.headers == null) {
            nextReqOptions.headers = {}
        }
        nextReqOptions.headers['Authorization'] = h
        nextReq = http.request(nextReqOptions)
        nextReq.on('response', function(resp2) {
            memstream.emit('response', resp2)
        })
	if (inputEnded) {
	    nextReq.end()
	} else if (memstream.readable) {
            memstream.resume()
        } else {
            nextReq.end()
        }
    })
    initialReq.end()
    memstream.pause()
    return memstream;
}

var passwordCache = {}

module.exports.addUser = function(realm, user, password) {
    passwordCache[realm] = {user: user, passwd: password}
}

module.exports.request = function(options) {
    return digestRequest(options)
}