// Loaded from https://cdn.skypack.dev/-/@octokit/request@v5.4.14-wyXvM7RXsYgnzD3sHtDY/dist=es2020,mode=imports/optimized/@octokit/request.js


import {endpoint as endpoint2} from "/-/@octokit/endpoint@v6.0.11-srDmNWrALHw5STKLaFHD/dist=es2020,mode=imports/optimized/@octokit/endpoint.js";
import {getUserAgent} from "/-/universal-user-agent@v6.0.0-fUAPE3UH5QP7qG0fd0dH/dist=es2020,mode=imports/optimized/universal-user-agent.js";
import {isPlainObject} from "/-/is-plain-object@v5.0.0-8mrVMp9y5RYdpZYGe1Tt/dist=es2020,mode=imports/optimized/is-plain-object.js";
import {RequestError} from "/-/@octokit/request-error@v2.0.5-M484dtcgyBZagFjx2PkF/dist=es2020,mode=imports/optimized/@octokit/request-error.js";
var getGlobal = function() {
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
};
var global = getGlobal();
var nodeFetch = global.fetch.bind(global);
const Headers = global.Headers;
const Request = global.Request;
const Response = global.Response;
const VERSION = "5.4.14";
function getBufferResponse(response) {
  return response.arrayBuffer();
}
function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then((response) => {
    url = response.url;
    status = response.status;
    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }
    if (status === 204 || status === 205) {
      return;
    }
    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }
      throw new RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }
    if (status === 304) {
      throw new RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }
    if (status >= 400) {
      return response.text().then((message) => {
        const error = new RequestError(message, status, {
          headers,
          request: requestOptions
        });
        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors;
          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {
        }
        throw error;
      });
    }
    const contentType = response.headers.get("content-type");
    if (/application\/json/.test(contentType)) {
      return response.json();
    }
    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }
    return getBufferResponse(response);
  }).then((data) => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch((error) => {
    if (error instanceof RequestError) {
      throw error;
    }
    throw new RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}
function withDefaults(oldEndpoint, newDefaults) {
  const endpoint3 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint3.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint3.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(endpoint3.parse(endpoint3.merge(route2, parameters2)));
    };
    Object.assign(request2, {
      endpoint: endpoint3,
      defaults: withDefaults.bind(null, endpoint3)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint3,
    defaults: withDefaults.bind(null, endpoint3)
  });
}
const request = withDefaults(endpoint2, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${getUserAgent()}`
  }
});
export {request};
export default null;
