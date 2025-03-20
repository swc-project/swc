!/**!
 * url-search-params-polyfill
 *
 * @author Jerry Bendy (https://github.com/jerrybendy)
 * @licence MIT
 */ function(self) {
    "use strict";
    var ampersandTest, propValue, nativeURLSearchParams = function() {
        // #41 Fix issue in RN
        try {
            if (self.URLSearchParams && "bar" === new self.URLSearchParams("foo=bar").get("foo")) return self.URLSearchParams;
        } catch (e) {}
        return null;
    }(), isSupportObjectConstructor = nativeURLSearchParams && "a=1" === new nativeURLSearchParams({
        a: 1
    }).toString(), // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
    decodesPlusesCorrectly = nativeURLSearchParams && "+" === new nativeURLSearchParams("s=%2B").get("s"), __URLSearchParams__ = "__URLSearchParams__", // Fix bug in Edge which cannot encode ' &' correctly
    encodesAmpersandsCorrectly = !nativeURLSearchParams || ((ampersandTest = new nativeURLSearchParams()).append("s", " &"), "s=+%26" === ampersandTest.toString()), prototype = URLSearchParamsPolyfill.prototype, iterable = !!(self.Symbol && self.Symbol.iterator);
    if (!nativeURLSearchParams || !isSupportObjectConstructor || !decodesPlusesCorrectly || !encodesAmpersandsCorrectly) {
        /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */ prototype.append = function(name, value) {
            appendTo(this[__URLSearchParams__], name, value);
        }, /**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */ prototype.delete = function(name) {
            delete this[__URLSearchParams__][name];
        }, /**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */ prototype.get = function(name) {
            var dict = this[__URLSearchParams__];
            return this.has(name) ? dict[name][0] : null;
        }, /**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */ prototype.getAll = function(name) {
            var dict = this[__URLSearchParams__];
            return this.has(name) ? dict[name].slice(0) : [];
        }, /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */ prototype.has = function(name) {
            return hasOwnProperty(this[__URLSearchParams__], name);
        }, /**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the
     * others.
     *
     * @param {string} name
     * @param {string} value
     */ prototype.set = function(name, value) {
            this[__URLSearchParams__][name] = [
                "" + value
            ];
        }, /**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */ prototype.toString = function() {
            var i, key, name, value, dict = this[__URLSearchParams__], query = [];
            for(key in dict)for(i = 0, name = encode(key), value = dict[key]; i < value.length; i++)query.push(name + "=" + encode(value[i]));
            return query.join("&");
        }, decodesPlusesCorrectly && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy ? // Chrome <=60 .toString() on a function proxy got error "Function.prototype.toString is not generic"
        // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
        (propValue = new Proxy(nativeURLSearchParams, {
            construct: function(target, args) {
                return new target(new URLSearchParamsPolyfill(args[0]).toString());
            }
        })).toString = Function.prototype.toString.bind(URLSearchParamsPolyfill) : propValue = URLSearchParamsPolyfill, /*
     * Apply polifill to global object and append other prototype into it
     */ Object.defineProperty(self, "URLSearchParams", {
            value: propValue
        });
        var USPProto = self.URLSearchParams.prototype;
        USPProto.polyfill = !0, /**
     *
     * @param {function} callback
     * @param {object} thisArg
     */ USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
            var dict = parseToDict(this.toString());
            Object.getOwnPropertyNames(dict).forEach(function(name) {
                dict[name].forEach(function(value) {
                    callback.call(thisArg, value, name, this);
                }, this);
            }, this);
        }, /**
     * Sort all name-value pairs
     */ USPProto.sort = USPProto.sort || function() {
            var k, i, j, dict = parseToDict(this.toString()), keys = [];
            for(k in dict)keys.push(k);
            for(keys.sort(), i = 0; i < keys.length; i++)this.delete(keys[i]);
            for(i = 0; i < keys.length; i++){
                var key = keys[i], values = dict[key];
                for(j = 0; j < values.length; j++)this.append(key, values[j]);
            }
        }, /**
     * Returns an iterator allowing to go through all keys of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */ USPProto.keys = USPProto.keys || function() {
            var items = [];
            return this.forEach(function(item, name) {
                items.push(name);
            }), makeIterator(items);
        }, /**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */ USPProto.values = USPProto.values || function() {
            var items = [];
            return this.forEach(function(item) {
                items.push(item);
            }), makeIterator(items);
        }, /**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */ USPProto.entries = USPProto.entries || function() {
            var items = [];
            return this.forEach(function(item, name) {
                items.push([
                    name,
                    item
                ]);
            }), makeIterator(items);
        }, iterable && (USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries);
    }
    /**
     * Make a URLSearchParams instance
     *
     * @param {object|string|URLSearchParams} search
     * @constructor
     */ function URLSearchParamsPolyfill(search) {
        ((search = search || "") instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) && (search = search.toString()), this[__URLSearchParams__] = parseToDict(search);
    }
    function encode(str) {
        var replace = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+",
            "%00": "\x00"
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
            return replace[match];
        });
    }
    function decode(str) {
        return str.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function(match) {
            return decodeURIComponent(match);
        });
    }
    function makeIterator(arr) {
        var iterator = {
            next: function() {
                var value = arr.shift();
                return {
                    done: void 0 === value,
                    value: value
                };
            }
        };
        return iterable && (iterator[self.Symbol.iterator] = function() {
            return iterator;
        }), iterator;
    }
    function parseToDict(search) {
        var dict = {};
        if ("object" == typeof search) {
            // if `search` is an array, treat it as a sequence
            if (isArray(search)) for(var i = 0; i < search.length; i++){
                var item = search[i];
                if (isArray(item) && 2 === item.length) appendTo(dict, item[0], item[1]);
                else throw TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
            }
            else for(var key in search)search.hasOwnProperty(key) && appendTo(dict, key, search[key]);
        } else {
            // remove first '?'
            0 === search.indexOf("?") && (search = search.slice(1));
            for(var pairs = search.split("&"), j = 0; j < pairs.length; j++){
                var value = pairs[j], index = value.indexOf("=");
                -1 < index ? appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1))) : value && appendTo(dict, decode(value), "");
            }
        }
        return dict;
    }
    function appendTo(dict, name, value) {
        var val = "string" == typeof value ? value : null != value && "function" == typeof value.toString ? value.toString() : JSON.stringify(value);
        // #47 Prevent using `hasOwnProperty` as a property name
        hasOwnProperty(dict, name) ? dict[name].push(val) : dict[name] = [
            val
        ];
    }
    function isArray(val) {
        return !!val && "[object Array]" === Object.prototype.toString.call(val);
    }
    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }
}("undefined" != typeof global ? global : "undefined" != typeof window ? window : this);
