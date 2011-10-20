var hashlib = require("hashlib");
var digestParse = /Digest\s+realm="([^"]*)",\s*nonce="([^"]*)",\s*algorithm=([^,]*),\s*qop="([^"]*)".*.*/

function buildResponse(ha1, ha2, nonce, nc, cnonce, qop) {
    return ha1 + ":" + nonce + ":" + nc + ":" + cnonce + ":" + qop + ":" + ha2
}

function createAuthHeader(method, realm, nonce, algorithm, qop, cnonce, username, password, uri) {
    var nc = formatNonceCount(1)
    var a1 = buildA1(realm, username, password)
    var a2 = buildA2(method, uri)
    var ha1 = hashlib.md5(a1)
    var ha2 = hashlib.md5(a2)
    var response = buildResponse(ha1, ha2, nonce, nc, cnonce, qop)
    var hresp = hashlib.md5(response)
    return buildAuthHeader(username, realm, nonce, uri, cnonce, nc, qop, hresp, algorithm)
}

function buildAuthHeader(username, realm, nonce, uri, cnonce, nc, qop, hresp, algorithm) {
    return 'Digest username="' + username +
			    '", realm="' + realm +
			    '", nonce="' + nonce +
			    '", uri="' + uri +
			    '", cnonce="' + cnonce +
			    '", nc=' + nc +
			    ', qop="' + qop +
			    '", response="' + hresp +
			    '", algorithm="' + algorithm + '"'    
}

function formatNonceCount(count) {
    var nc = count.toString(16);
    while(nc.length < 8) {
	nc = "0" + nc;
    }
    return nc
}

function buildA1(realm, user, passwd) {
    return user + ":" + realm + ":" + passwd
}

function buildA2(method, uri) {
    return method + ":" + uri
}


function parseWWWAuth(wwwAuth) {
    var matches = digestParse(wwwAuth)
    return {
	realm: matches[1],
	nonce: matches[2],
	algorithm: matches[3],
	qop: matches[4]
    }    
}


module.exports.formatNonceCount = formatNonceCount
module.exports.buildA1 = buildA1
module.exports.buildA2 = buildA2
module.exports.parseWWWAuth = parseWWWAuth   
module.exports.createAuthHeader = createAuthHeader
module.exports.buildAuthHeader = buildAuthHeader
module.exports.buildResponse = buildResponse