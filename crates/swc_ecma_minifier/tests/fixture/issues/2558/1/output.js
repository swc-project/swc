!function(self) {
    "use strict";
    var ampersandTest, propValue, nativeURLSearchParams = function() {
        try {
            if (self.URLSearchParams && "bar" === new self.URLSearchParams("foo=bar").get("foo")) return self.URLSearchParams;
        } catch (e) {}
        return null;
    }(), isSupportObjectConstructor = nativeURLSearchParams && "a=1" === new nativeURLSearchParams({
        a: 1
    }).toString(), decodesPlusesCorrectly = nativeURLSearchParams && "+" === new nativeURLSearchParams("s=%2B").get("s"), __URLSearchParams__ = "__URLSearchParams__", encodesAmpersandsCorrectly = !nativeURLSearchParams || ((ampersandTest = new nativeURLSearchParams()).append("s", " &"), "s=+%26" === ampersandTest.toString()), prototype = URLSearchParamsPolyfill.prototype, iterable = !!(self.Symbol && self.Symbol.iterator);
    if (!nativeURLSearchParams || !isSupportObjectConstructor || !decodesPlusesCorrectly || !encodesAmpersandsCorrectly) {
        prototype.append = function(name, value) {
            appendTo(this[__URLSearchParams__], name, value);
        }, prototype.delete = function(name) {
            delete this[__URLSearchParams__][name];
        }, prototype.get = function(name) {
            var dict = this[__URLSearchParams__];
            return this.has(name) ? dict[name][0] : null;
        }, prototype.getAll = function(name) {
            var dict = this[__URLSearchParams__];
            return this.has(name) ? dict[name].slice(0) : [];
        }, prototype.has = function(name) {
            return hasOwnProperty(this[__URLSearchParams__], name);
        }, prototype.set = function(name, value) {
            this[__URLSearchParams__][name] = [
                "" + value
            ];
        }, prototype.toString = function() {
            var i, key, name, value, dict = this[__URLSearchParams__], query = [];
            for(key in dict)for(i = 0, name = encode(key), value = dict[key]; i < value.length; i++)query.push(name + "=" + encode(value[i]));
            return query.join("&");
        }, decodesPlusesCorrectly && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy ? (propValue = new Proxy(nativeURLSearchParams, {
            construct: function(target, args) {
                return new target(new URLSearchParamsPolyfill(args[0]).toString());
            }
        })).toString = Function.prototype.toString.bind(URLSearchParamsPolyfill) : propValue = URLSearchParamsPolyfill, Object.defineProperty(self, "URLSearchParams", {
            value: propValue
        });
        var USPProto = self.URLSearchParams.prototype;
        USPProto.polyfill = !0, USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
            var dict = parseToDict(this.toString());
            Object.getOwnPropertyNames(dict).forEach(function(name) {
                dict[name].forEach(function(value) {
                    callback.call(thisArg, value, name, this);
                }, this);
            }, this);
        }, USPProto.sort = USPProto.sort || function() {
            var k, i, j, dict = parseToDict(this.toString()), keys = [];
            for(k in dict)keys.push(k);
            for(keys.sort(), i = 0; i < keys.length; i++)this.delete(keys[i]);
            for(i = 0; i < keys.length; i++){
                var key = keys[i], values = dict[key];
                for(j = 0; j < values.length; j++)this.append(key, values[j]);
            }
        }, USPProto.keys = USPProto.keys || function() {
            var items = [];
            return this.forEach(function(item, name) {
                items.push(name);
            }), makeIterator(items);
        }, USPProto.values = USPProto.values || function() {
            var items = [];
            return this.forEach(function(item) {
                items.push(item);
            }), makeIterator(items);
        }, USPProto.entries = USPProto.entries || function() {
            var items = [];
            return this.forEach(function(item, name) {
                items.push([
                    name,
                    item
                ]);
            }), makeIterator(items);
        }, iterable && (USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries);
    }
    function URLSearchParamsPolyfill(search) {
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
            if (isArray(search)) for(var i = 0; i < search.length; i++){
                var item = search[i];
                if (isArray(item) && 2 === item.length) appendTo(dict, item[0], item[1]);
                else throw TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
            }
            else for(var key in search)search.hasOwnProperty(key) && appendTo(dict, key, search[key]);
        } else {
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
