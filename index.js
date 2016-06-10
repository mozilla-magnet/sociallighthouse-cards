var http = require('http');
var url = require('url');
var request = require('request');
var querystring = require('querystring');

const PORT=3004;

function handleRequest(req, res){
  const requestUrl = url.parse(req.url);
  console.log(req.url);

  const params = querystring.parse(requestUrl.query);
  var twitterId = params.twitterId;
  var interests = params.interests;

  if (twitterId) {
    twitterId = twitterId.trim();
    interests = decodeURI(interests).trim();

    const jsonRequest = req.headers['accept'].indexOf('json') !== -1;
    if (!jsonRequest) {
      const location = 'https://twitter.com/' + twitterId;
      res.writeHead(301, {'Location': location});
      res.end();
      return;
    }

    const adapterUrl = 'http://box.wilsonpage.me/'
      + 'magnet-twitter-adaptor?url=https://twitter.com/'
      + twitterId;
    request(adapterUrl, (err, r, body) => {
      if (err) {
        abort(res);
        return;
      }
      const data = JSON.parse(body);
      if (interests.length > 0) {

      } 
      data.description = interests;
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(data));
    });
  } else {
    abort(res);
  }
}

function abort(res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.end('ko');
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
