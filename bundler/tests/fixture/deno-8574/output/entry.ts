function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(o) {
    var ctor, prot;
    if (isObject(o) === false) return false;
    ctor = o.constructor;
    if (ctor === void 0) return true;
    prot = ctor.prototype;
    if (isObject(prot) === false) return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
        return false;
    }
    return true;
}
function defaultSetTimout() {
    throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
    throw new Error("clearTimeout has not been defined");
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
var globalContext;
if (typeof window !== "undefined") {
    globalContext = window;
} else if (typeof self !== "undefined") {
    globalContext = self;
} else {
    globalContext = {
    };
}
if (typeof globalContext.setTimeout === "function") {
    cachedSetTimeout = setTimeout;
}
if (typeof globalContext.clearTimeout === "function") {
    cachedClearTimeout = clearTimeout;
}
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
    }
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e2) {
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
    }
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            return cachedClearTimeout.call(null, marker);
        } catch (e2) {
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}
function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;
    var len = queue.length;
    while(len){
        currentQueue = queue;
        queue = [];
        while((++queueIndex) < len){
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for(var i = 1; i < arguments.length; i++){
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function() {
    this.fun.apply(null, this.array);
};
var title = "browser";
var platform = "browser";
var browser = true;
var argv = [];
var version = "";
var versions = {
};
var release = {
};
var config = {
};
function noop() {
}
var on = noop;
var addListener = noop;
var once1 = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;
function binding(name) {
    throw new Error("process.binding is not supported");
}
function cwd() {
    return "/";
}
function chdir(dir) {
    throw new Error("process.chdir is not supported");
}
function umask() {
    return 0;
}
var performance = globalContext.performance || {
};
var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
    return new Date().getTime();
};
function hrtime(previousTimestamp) {
    var clocktime = performanceNow.call(performance) * 0.001;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor(clocktime % 1 * 1000000000);
    if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1000000000;
        }
    }
    return [
        seconds,
        nanoseconds
    ];
}
var startTime = new Date();
function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
}
var process = {
    nextTick,
    title,
    browser,
    env: {
        NODE_ENV: "production"
    },
    argv,
    version,
    versions,
    on,
    addListener,
    once: once1,
    off,
    removeListener,
    removeAllListeners,
    emit,
    binding,
    cwd,
    chdir,
    umask,
    hrtime,
    platform,
    release,
    config,
    uptime
};
function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
        return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
}
function lowercaseKeys(object) {
    if (!object) {
        return {
        };
    }
    return Object.keys(object).reduce((newObj, key)=>{
        newObj[key.toLowerCase()] = object[key];
        return newObj;
    }, {
    });
}
function mergeDeep(defaults, options) {
    const result = Object.assign({
    }, defaults);
    Object.keys(options).forEach((key)=>{
        if (isPlainObject(options[key])) {
            if (!(key in defaults)) Object.assign(result, {
                [key]: options[key]
            });
            else result[key] = mergeDeep(defaults[key], options[key]);
        } else {
            Object.assign(result, {
                [key]: options[key]
            });
        }
    });
    return result;
}
function removeUndefinedProperties(obj) {
    for(const key in obj){
        if (obj[key] === void 0) {
            delete obj[key];
        }
    }
    return obj;
}
function merge(defaults, route, options) {
    if (typeof route === "string") {
        let [method, url] = route.split(" ");
        options = Object.assign(url ? {
            method,
            url
        } : {
            url: method
        }, options);
    } else {
        options = Object.assign({
        }, route);
    }
    options.headers = lowercaseKeys(options.headers);
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {
    }, options);
    if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview)=>!mergedOptions.mediaType.previews.includes(preview)
        ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview)=>preview.replace(/-preview/, "")
    );
    return mergedOptions;
}
function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
        return url;
    }
    return url + separator + names.map((name)=>{
        if (name === "q") {
            return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
        }
        return `${name}=${encodeURIComponent(parameters[name])}`;
    }).join("&");
}
const urlVariableRegex = /\{[^}]+\}/g;
function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
        return [];
    }
    return matches.map(removeNonChars).reduce((a, b)=>a.concat(b)
    , []);
}
function omit(object, keysToOmit) {
    return Object.keys(object).filter((option)=>!keysToOmit.includes(option)
    ).reduce((obj, key)=>{
        obj[key] = object[key];
        return obj;
    }, {
    });
}
function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
        }
        return part;
    }).join("");
}
function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
function encodeValue(operator, value, key) {
    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
    if (key) {
        return encodeUnreserved(key) + "=" + value;
    } else {
        return value;
    }
}
function isDefined(value) {
    return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
    var value = context[key], result = [];
    if (isDefined(value) && value !== "") {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            value = value.toString();
            if (modifier && modifier !== "*") {
                value = value.substring(0, parseInt(modifier, 10));
            }
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
        } else {
            if (modifier === "*") {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function(value2) {
                        result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
                    });
                } else {
                    Object.keys(value).forEach(function(k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                const tmp = [];
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function(value2) {
                        tmp.push(encodeValue(operator, value2));
                    });
                } else {
                    Object.keys(value).forEach(function(k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeUnreserved(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }
                if (isKeyOperator(operator)) {
                    result.push(encodeUnreserved(key) + "=" + tmp.join(","));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(","));
                }
            }
        }
    } else {
        if (operator === ";") {
            if (isDefined(value)) {
                result.push(encodeUnreserved(key));
            }
        } else if (value === "" && (operator === "&" || operator === "?")) {
            result.push(encodeUnreserved(key) + "=");
        } else if (value === "") {
            result.push("");
        }
    }
    return result;
}
function parseUrl(template) {
    return {
        expand: expand.bind(null, template)
    };
}
function expand(template, context) {
    var operators = [
        "+",
        "#",
        ".",
        "/",
        ";",
        "?",
        "&"
    ];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
        if (expression) {
            let operator = "";
            const values = [];
            if (operators.indexOf(expression.charAt(0)) !== -1) {
                operator = expression.charAt(0);
                expression = expression.substr(1);
            }
            expression.split(/,/g).forEach(function(variable) {
                var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
                values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
            });
            if (operator && operator !== "+") {
                var separator = ",";
                if (operator === "?") {
                    separator = "&";
                } else if (operator !== "#") {
                    separator = operator;
                }
                return (values.length !== 0 ? operator : "") + values.join(separator);
            } else {
                return values.join(",");
            }
        } else {
            return encodeReserved(literal);
        }
    });
}
function parse(options) {
    let method = options.method.toUpperCase();
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({
    }, options.headers);
    let body;
    let parameters = omit(options, [
        "method",
        "baseUrl",
        "url",
        "headers",
        "request",
        "mediaType"
    ]);
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
        url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options).filter((option)=>urlVariableNames.includes(option)
    ).concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
        if (options.mediaType.format) {
            headers.accept = headers.accept.split(/,/).map((preview)=>preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)
            ).join(",");
        }
        if (options.mediaType.previews.length) {
            const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
            headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview)=>{
                const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
                return `application/vnd.github.${preview}-preview${format}`;
            }).join(",");
        }
    }
    if ([
        "GET",
        "HEAD"
    ].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
    } else {
        if ("data" in remainingParameters) {
            body = remainingParameters.data;
        } else {
            if (Object.keys(remainingParameters).length) {
                body = remainingParameters;
            } else {
                headers["content-length"] = 0;
            }
        }
    }
    if (!headers["content-type"] && typeof body !== "undefined") {
        headers["content-type"] = "application/json; charset=utf-8";
    }
    if ([
        "PATCH",
        "PUT"
    ].includes(method) && typeof body === "undefined") {
        body = "";
    }
    return Object.assign({
        method,
        url,
        headers
    }, typeof body !== "undefined" ? {
        body
    } : null, options.request ? {
        request: options.request
    } : null);
}
function endpointWithDefaults(defaults, route, options) {
    return parse(merge(defaults, route, options));
}
function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS2 = merge(oldDefaults, newDefaults);
    const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
    return Object.assign(endpoint2, {
        DEFAULTS: DEFAULTS2,
        defaults: withDefaults.bind(null, DEFAULTS2),
        merge: merge.bind(null, DEFAULTS2),
        parse
    });
}
const VERSION = "6.0.11";
const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;
const DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent
    },
    mediaType: {
        format: "",
        previews: []
    }
};
const endpoint = withDefaults(null, DEFAULTS);
class Deprecation extends Error {
    constructor(message){
        super(message);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "Deprecation";
    }
}
var wrappy_1 = wrappy;
function wrappy(fn, cb) {
    if (fn && cb) return wrappy(fn)(cb);
    if (typeof fn !== "function") throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
        var args = new Array(arguments.length);
        for(var i = 0; i < args.length; i++){
            args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
            Object.keys(cb2).forEach(function(k) {
                ret[k] = cb2[k];
            });
        }
        return ret;
    }
}
var once_1 = wrappy_1(once2);
var strict = wrappy_1(onceStrict);
once2.proto = once2(function() {
    Object.defineProperty(Function.prototype, "once", {
        value: function() {
            return once2(this);
        },
        configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
            return onceStrict(this);
        },
        configurable: true
    });
});
function once2(fn) {
    var f = function() {
        if (f.called) return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
}
function onceStrict(fn) {
    var f = function() {
        if (f.called) throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
    };
    var name = fn.name || "Function wrapped with `once`";
    f.onceError = name + " shouldn't be called more than once";
    f.called = false;
    return f;
}
once_1.strict = strict;
const logOnce = once_1((deprecation2)=>console.warn(deprecation2)
);
class RequestError extends Error {
    constructor(message1, statusCode, options){
        super(message1);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
        this.name = "HttpError";
        this.status = statusCode;
        Object.defineProperty(this, "code", {
            get () {
                logOnce(new Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
                return statusCode;
            }
        });
        this.headers = options.headers || {
        };
        const requestCopy = Object.assign({
        }, options.request);
        if (options.request.headers.authorization) {
            requestCopy.headers = Object.assign({
            }, options.request.headers, {
                authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
            });
        }
        requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
        this.request = requestCopy;
    }
}
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
const VERSION1 = "5.4.14";
function getBufferResponse(response) {
    return response.arrayBuffer();
}
function fetchWrapper(requestOptions) {
    if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {
    };
    let status;
    let url;
    const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
    return fetch(requestOptions.url, Object.assign({
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect
    }, requestOptions.request)).then((response)=>{
        url = response.url;
        status = response.status;
        for (const keyAndValue of response.headers){
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
            return response.text().then((message2)=>{
                const error = new RequestError(message2, status, {
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
    }).then((data)=>{
        return {
            status,
            url,
            headers,
            data
        };
    }).catch((error)=>{
        if (error instanceof RequestError) {
            throw error;
        }
        throw new RequestError(error.message, 500, {
            headers,
            request: requestOptions
        });
    });
}
function withDefaults1(oldEndpoint, newDefaults) {
    const endpoint3 = oldEndpoint.defaults(newDefaults);
    const newApi = function(route, parameters) {
        const endpointOptions = endpoint3.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
            return fetchWrapper(endpoint3.parse(endpointOptions));
        }
        const request2 = (route2, parameters2)=>{
            return fetchWrapper(endpoint3.parse(endpoint3.merge(route2, parameters2)));
        };
        Object.assign(request2, {
            endpoint: endpoint3,
            defaults: withDefaults1.bind(null, endpoint3)
        });
        return endpointOptions.request.hook(request2, endpointOptions);
    };
    return Object.assign(newApi, {
        endpoint: endpoint3,
        defaults: withDefaults1.bind(null, endpoint3)
    });
}
const request = withDefaults1(endpoint, {
    headers: {
        "user-agent": `octokit-request.js/${VERSION1} ${getUserAgent()}`
    }
});
const { data  } = await request('GET /repos/{owner}/{repo}/license', {
    headers: {
        authorization: `token ${Deno.env.get('GITHUB_TOKEN')}`
    },
    owner: 'denoland',
    repo: 'deno'
});
console.log(data.license.name);
