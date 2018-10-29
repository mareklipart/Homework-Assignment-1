const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const httpServer = http.createServer(function(req,res) {

    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname;

    const trimmedPath = path.replace(/^\/+|\/+$/g,'');

    const method = req.method.toLowerCase();

    const queryStringObject =  parsedUrl.query;

    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');

    let buffer = '';

    req.on('data', function(data) {
        buffer += decoder.write(data)
    });

    req.on('end', function() {

        const data = {
            'trimmedPath': trimmedPath,
            'method': method,
            'queryStringObject': queryStringObject,
            'headers': headers,
            'payload': buffer
        };

        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        chosenHandler(data,function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {'message': 'Try again!'};
            
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/JSON')
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('response is ', statusCode, payloadString);
        });
    });  
});

httpServer.listen('3030', function() {
    console.log('server is listening...');
});

const handlers = {};

handlers.hello  = function(data, callback) {
    callback(200, {'message': 'Welcome user! What can I do for you?'});
};

handlers.notFound = function(data, callback) {
    callback(404);
};

const router = {
    'hello': handlers.hello
};


