var digestUtils = require('digestUtils')

exports.testFormatNonceCount = function(beforeExit, assert) {
    assert.equal("00000000", digestUtils.formatNonceCount(0))
    assert.equal("00000001", digestUtils.formatNonceCount(1))
    assert.equal("00000002", digestUtils.formatNonceCount(2))
    //assert.equal("00010000", digestUtils.formatNonceCount(10000))
    //assert.equal("99999999", digestUtils.formatNonceCount(99999999))
}

exports.testBuildA1 = function(beforeExit, assert) {
    assert.equal("usr:myRealm:passwd", digestUtils.buildA1("myRealm", "usr", "passwd"))
}

exports.testBuildA2 = function(beforeExit, assert) {
    assert.equal("GET:/path/to/foo", digestUtils.buildA2("GET", "/path/to/foo"))
}

exports.testParseWWWAuth = function(beforeExit, assert) {
    var rawWWAuthHeader = 'WWW-Authenticate: Digest realm="COHODO", nonce="Wa1mo7WvBAA=6cf7970ba44b9757fcc687b94798e31f6e080bc2", algorithm=MD5, qop="auth"'
    var parsed = digestUtils.parseWWWAuth(rawWWAuthHeader)
    assert.equal("COHODO", parsed.realm)
    assert.equal("Wa1mo7WvBAA=6cf7970ba44b9757fcc687b94798e31f6e080bc2", parsed.nonce)
    assert.equal("MD5", parsed.algorithm)
    assert.equal("auth", parsed.qop)
}

exports.testBuildAuthHeader = function(beforeExit, assert) {
    var expected = 'Digest username="user", realm="myRealm", nonce="myNonce", uri="/path/to/", cnonce="myCNonce", nc=00000007, qop="myQop", response="RESPONSE", algorithm="myAlgorithm"'
    var header = digestUtils.buildAuthHeader("user", "myRealm", "myNonce", "/path/to/", "myCNonce", "00000007", "myQop", "RESPONSE", "myAlgorithm")
    assert.equal(expected, header)
}

exports.testBuildResponse =  function(beforeExit, assert) {
    var expected = 'ha1:nonce:nc:cnonce:qop:ha2'
    var header = digestUtils.buildResponse("ha1", "ha2", "nonce", "nc", "cnonce", "qop")
    assert.equal(expected, header)
}

exports.testCreateRealAuthHeader =  function(beforeExit, assert) {
    var expected = 'Digest username="cohodo", realm="COHODO", nonce="J6CsO7avBAA=056921a6d78e4feafd50ab5c4911027c07f12578", uri="/foo", cnonce="MDQwNDk4", nc=00000001, qop="auth", response="084dad79760cfbcd35873e859ad1af54", algorithm="MD5"'
    var header = digestUtils.createAuthHeader("GET", "COHODO", "J6CsO7avBAA=056921a6d78e4feafd50ab5c4911027c07f12578", "MD5", "auth", "MDQwNDk4", "cohodo", "pass", "/foo")
    assert.equal(expected, header)
}
