function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) {
        return Array.from(iter);
    }
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals, assertStringContains } from "./test_util.ts";
var stringifyArgs = Deno[Deno.internal].stringifyArgs;
unitTest(function headersHasCorrectNameProp() {
    assertEquals(Headers.name, "Headers");
});
// Logic heavily copied from web-platform-tests, make
// sure pass mostly header basic test
// ref: https://github.com/web-platform-tests/wpt/blob/7c50c216081d6ea3c9afe553ee7b64534020a1b2/fetch/api/headers/headers-basic.html
unitTest(function newHeaderTest() {
    new Headers();
    new Headers(undefined);
    new Headers({});
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new Headers(null);
    } catch (e) {
        assertEquals(e.message, "Failed to construct 'Headers'; The provided value was not valid");
    }
});
var headerDict = {
    name1: "value1",
    name2: "value2",
    name3: "value3",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name4: undefined,
    "Content-Type": "value4"
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var headerSeq = [];
for(var name in headerDict){
    headerSeq.push([
        name,
        headerDict[name]
    ]);
}
unitTest(function newHeaderWithSequence() {
    var headers = new Headers(headerSeq);
    for(var name in headerDict){
        assertEquals(headers.get(name), String(headerDict[name]));
    }
    assertEquals(headers.get("length"), null);
});
unitTest(function newHeaderWithRecord() {
    var headers = new Headers(headerDict);
    for(var name in headerDict){
        assertEquals(headers.get(name), String(headerDict[name]));
    }
});
unitTest(function newHeaderWithHeadersInstance() {
    var headers = new Headers(headerDict);
    var headers2 = new Headers(headers);
    for(var name in headerDict){
        assertEquals(headers2.get(name), String(headerDict[name]));
    }
});
unitTest(function headerAppendSuccess() {
    var headers = new Headers();
    for(var name in headerDict){
        headers.append(name, headerDict[name]);
        assertEquals(headers.get(name), String(headerDict[name]));
    }
});
unitTest(function headerSetSuccess() {
    var headers = new Headers();
    for(var name in headerDict){
        headers.set(name, headerDict[name]);
        assertEquals(headers.get(name), String(headerDict[name]));
    }
});
unitTest(function headerHasSuccess() {
    var headers = new Headers(headerDict);
    for(var name in headerDict){
        assert(headers.has(name), "headers has name " + name);
        assert(!headers.has("nameNotInHeaders"), "headers do not have header: nameNotInHeaders");
    }
});
unitTest(function headerDeleteSuccess() {
    var headers = new Headers(headerDict);
    for(var name in headerDict){
        assert(headers.has(name), "headers have a header: " + name);
        headers.delete(name);
        assert(!headers.has(name), "headers do not have anymore a header: " + name);
    }
});
unitTest(function headerGetSuccess() {
    var headers = new Headers(headerDict);
    for(var name in headerDict){
        assertEquals(headers.get(name), String(headerDict[name]));
        assertEquals(headers.get("nameNotInHeaders"), null);
    }
});
unitTest(function headerEntriesSuccess() {
    var headers = new Headers(headerDict);
    var iterators = headers.entries();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = iterators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var it = _step.value;
            var key = it[0];
            var value = it[1];
            assert(headers.has(key));
            assertEquals(value, headers.get(key));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
unitTest(function headerKeysSuccess() {
    var headers = new Headers(headerDict);
    var iterators = headers.keys();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = iterators[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var it = _step.value;
            assert(headers.has(it));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
unitTest(function headerValuesSuccess() {
    var headers = new Headers(headerDict);
    var iterators = headers.values();
    var entries = headers.entries();
    var values = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var pair = _step.value;
            values.push(pair[1]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = iterators[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var it = _step1.value;
            assert(values.includes(it));
        }
    } catch (err) {
        _didIteratorError1 = true;
        _iteratorError1 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                _iterator1.return();
            }
        } finally{
            if (_didIteratorError1) {
                throw _iteratorError1;
            }
        }
    }
});
var headerEntriesDict = {
    name1: "value1",
    Name2: "value2",
    name: "value3",
    "content-Type": "value4",
    "Content-Typ": "value5",
    "Content-Types": "value6"
};
unitTest(function headerForEachSuccess() {
    var headers = new Headers(headerEntriesDict);
    var keys = Object.keys(headerEntriesDict);
    keys.forEach(function(key) {
        var value = headerEntriesDict[key];
        var newkey = key.toLowerCase();
        headerEntriesDict[newkey] = value;
    });
    var callNum = 0;
    headers.forEach(function(value, key, container) {
        assertEquals(headers, container);
        assertEquals(value, headerEntriesDict[key]);
        callNum++;
    });
    assertEquals(callNum, keys.length);
});
unitTest(function headerSymbolIteratorSuccess() {
    assert(Symbol.iterator in Headers.prototype);
    var headers = new Headers(headerEntriesDict);
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = headers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var header = _step.value;
            var key = header[0];
            var value = header[1];
            assert(headers.has(key));
            assertEquals(value, headers.get(key));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
});
unitTest(function headerTypesAvailable() {
    function newHeaders() {
        return new Headers();
    }
    var headers = newHeaders();
    assert(_instanceof(headers, Headers));
});
// Modified from https://github.com/bitinn/node-fetch/blob/7d3293200a91ad52b5ca7962f9d6fd1c04983edb/test/test.js#L2001-L2014
// Copyright (c) 2016 David Frank. MIT License.
unitTest(function headerIllegalReject() {
    var errorCount = 0;
    try {
        new Headers({
            "He y": "ok"
        });
    } catch (e) {
        errorCount++;
    }
    try {
        new Headers({
            "Hé-y": "ok"
        });
    } catch (e) {
        errorCount++;
    }
    try {
        new Headers({
            "He-y": "ăk"
        });
    } catch (e) {
        errorCount++;
    }
    var headers = new Headers();
    try {
        headers.append("Hé-y", "ok");
    } catch (e) {
        errorCount++;
    }
    try {
        headers.delete("Hé-y");
    } catch (e) {
        errorCount++;
    }
    try {
        headers.get("Hé-y");
    } catch (e) {
        errorCount++;
    }
    try {
        headers.has("Hé-y");
    } catch (e) {
        errorCount++;
    }
    try {
        headers.set("Hé-y", "ok");
    } catch (e) {
        errorCount++;
    }
    try {
        headers.set("", "ok");
    } catch (e) {
        errorCount++;
    }
    assertEquals(errorCount, 9);
    // 'o k' is valid value but invalid name
    new Headers({
        "He-y": "o k"
    });
});
// If pair does not contain exactly two items,then throw a TypeError.
unitTest(function headerParamsShouldThrowTypeError() {
    var hasThrown = 0;
    try {
        new Headers([
            [
                "1"
            ]
        ]);
        hasThrown = 1;
    } catch (err) {
        if (_instanceof(err, TypeError)) {
            hasThrown = 2;
        } else {
            hasThrown = 3;
        }
    }
    assertEquals(hasThrown, 2);
});
unitTest(function headerParamsArgumentsCheck() {
    var methodRequireOneParam = [
        "delete",
        "get",
        "has",
        "forEach"
    ];
    var methodRequireTwoParams = [
        "append",
        "set"
    ];
    methodRequireOneParam.forEach(function(method) {
        var headers = new Headers();
        var hasThrown = 0;
        var errMsg = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headers[method]();
            hasThrown = 1;
        } catch (err) {
            errMsg = err.message;
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
        assertStringContains(errMsg, "".concat(method, " requires at least 1 argument, but only 0 present"));
    });
    methodRequireTwoParams.forEach(function(method) {
        var headers = new Headers();
        var hasThrown = 0;
        var errMsg = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headers[method]();
            hasThrown = 1;
        } catch (err) {
            errMsg = err.message;
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
        assertStringContains(errMsg, "".concat(method, " requires at least 2 arguments, but only 0 present"));
        hasThrown = 0;
        errMsg = "";
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            headers[method]("foo");
            hasThrown = 1;
        } catch (err) {
            errMsg = err.message;
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
        assertStringContains(errMsg, "".concat(method, " requires at least 2 arguments, but only 1 present"));
    });
});
unitTest(function headersInitMultiple() {
    var headers = new Headers([
        [
            "Set-Cookie",
            "foo=bar"
        ],
        [
            "Set-Cookie",
            "bar=baz"
        ],
        [
            "X-Deno",
            "foo"
        ],
        [
            "X-Deno",
            "bar"
        ]
    ]);
    var actual = _to_consumable_array(headers);
    assertEquals(actual, [
        [
            "set-cookie",
            "foo=bar"
        ],
        [
            "set-cookie",
            "bar=baz"
        ],
        [
            "x-deno",
            "foo, bar"
        ]
    ]);
});
unitTest(function headersAppendMultiple() {
    var headers = new Headers([
        [
            "Set-Cookie",
            "foo=bar"
        ],
        [
            "X-Deno",
            "foo"
        ]
    ]);
    headers.append("set-Cookie", "bar=baz");
    headers.append("x-Deno", "bar");
    var actual = _to_consumable_array(headers);
    assertEquals(actual, [
        [
            "set-cookie",
            "foo=bar"
        ],
        [
            "x-deno",
            "foo, bar"
        ],
        [
            "set-cookie",
            "bar=baz"
        ]
    ]);
});
unitTest(function headersAppendDuplicateSetCookieKey() {
    var headers = new Headers([
        [
            "Set-Cookie",
            "foo=bar"
        ]
    ]);
    headers.append("set-Cookie", "foo=baz");
    headers.append("Set-cookie", "baz=bar");
    var actual = _to_consumable_array(headers);
    assertEquals(actual, [
        [
            "set-cookie",
            "foo=baz"
        ],
        [
            "set-cookie",
            "baz=bar"
        ]
    ]);
});
unitTest(function headersSetDuplicateCookieKey() {
    var headers = new Headers([
        [
            "Set-Cookie",
            "foo=bar"
        ]
    ]);
    headers.set("set-Cookie", "foo=baz");
    headers.set("set-cookie", "bar=qat");
    var actual = _to_consumable_array(headers);
    assertEquals(actual, [
        [
            "set-cookie",
            "foo=baz"
        ],
        [
            "set-cookie",
            "bar=qat"
        ]
    ]);
});
unitTest(function headersGetSetCookie() {
    var headers = new Headers([
        [
            "Set-Cookie",
            "foo=bar"
        ],
        [
            "set-Cookie",
            "bar=qat"
        ]
    ]);
    assertEquals(headers.get("SET-COOKIE"), "foo=bar, bar=qat");
});
unitTest(function toStringShouldBeWebCompatibility() {
    var headers = new Headers();
    assertEquals(headers.toString(), "[object Headers]");
});
function stringify() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return stringifyArgs(args).replace(/\n$/, "");
}
unitTest(function customInspectReturnsCorrectHeadersFormat() {
    var blankHeaders = new Headers();
    assertEquals(stringify(blankHeaders), "Headers {}");
    var singleHeader = new Headers([
        [
            "Content-Type",
            "application/json"
        ]
    ]);
    assertEquals(stringify(singleHeader), "Headers { content-type: application/json }");
    var multiParamHeader = new Headers([
        [
            "Content-Type",
            "application/json"
        ],
        [
            "Content-Length",
            "1337"
        ]
    ]);
    assertEquals(stringify(multiParamHeader), "Headers { content-type: application/json, content-length: 1337 }");
});
