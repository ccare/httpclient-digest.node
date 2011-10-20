var http = require("httpclient-digest")
http.addUser('MY_REALM', 'MY_USERNAME', "MY_PASSWORD")
var requestOptions = {
        port: 80,
        host: 'example.com',
        path: "/path/to/resource",
        method: "GET",
        headers: { }
    };    
var request = http.request(requestOptions)
request.on("response", function(resp) {
    console.log("got response")
})
request.end()