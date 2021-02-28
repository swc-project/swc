// Loaded from https://raw.githubusercontent.com/denjucks/dex/master/lib/deps/pg-connection-string@2.2.0/index.dew.js


import _url from "../@jspm/core@1.1.0/nodelibs/process.js";
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;
  var url = _url;
//Parse method copied from https://github.com/brianc/node-postgres
  //Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
  //MIT License
  //parses a connection string

  function parse(str) {
    //unix socket
    if (str.charAt(0) === '/') {
      var config = str.split(' ');
      return {
        host: config[0],
        database: config[1]
      };
    } // url parse expects spaces encoded as %20


    var result = url.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str) ? encodeURI(str).replace(/\%25(\d\d)/g, "%$1") : str, true);
    var config = result.query;

    for (var k in config) {
      if (Array.isArray(config[k])) {
        config[k] = config[k][config[k].length - 1];
      }
    }

    var auth = (result.auth || ':').split(':');
    config.user = auth[0];
    config.password = auth.splice(1).join(':');
    config.port = result.port;

    if (result.protocol == 'socket:') {
      config.host = decodeURI(result.pathname);
      config.database = result.query.db;
      config.client_encoding = result.query.encoding;
      return config;
    }

    if (!config.host) {
      // Only set the host if there is no equivalent query param.
      config.host = result.hostname;
    } // If the host is missing it might be a URL-encoded path to a socket.


    var pathname = result.pathname;

    if (!config.host && pathname && /^%2f/i.test(pathname)) {
      var pathnameSplit = pathname.split('/');
      config.host = decodeURIComponent(pathnameSplit[0]);
      pathname = pathnameSplit.splice(1).join('/');
    } // result.pathname is not always guaranteed to have a '/' prefix (e.g. relative urls)
    // only strip the slash if it is present.


    if (pathname && pathname.charAt(0) === '/') {
      pathname = pathname.slice(1) || null;
    }

    config.database = pathname && decodeURI(pathname);

    if (config.ssl === 'true' || config.ssl === '1') {
      config.ssl = true;
    }

    if (config.ssl === '0') {
      config.ssl = false;
    }

    if (config.sslcert || config.sslkey || config.sslrootcert) {
      config.ssl = {};
    }

    if (config.sslcert) {
      config.ssl.cert = new TextDecoder.decode(Deno.readFileSync(config.sslcert));
    }

    if (config.sslkey) {
      config.ssl.key = new TextDecoder.decode(Deno.readFileSync(config.sslkey));
    }

    if (config.sslrootcert) {
      config.ssl.ca = new TextDecoder.decode(Deno.readFileSync(config.sslrootcert));
    }

    return config;
  }

  exports = parse;
  parse.parse = parse;
  return exports;
}
