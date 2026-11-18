function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
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
import { unitTest, assert, assertEquals, assertThrows, assertThrowsAsync, fail } from "./test_util.ts";
unitTest({
    perms: {
        net: true
    }
}, function fetchProtocolError() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                fetch("file:///")
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, TypeError, "not supported")
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchConnectionError() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                fetch("http://localhost:4000")
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.Http, "error trying to connect")
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchJsonSuccess() {
    return _async_to_generator(function() {
        var response, json;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.json()
                    ];
                case 2:
                    json = _state.sent();
                    assertEquals(json.name, "deno");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function fetchPerm() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                fetch("http://localhost:4545/cli/tests/fixture.json")
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.PermissionDenied)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchUrl() {
    return _async_to_generator(function() {
        var response, _json;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.url, "http://localhost:4545/cli/tests/fixture.json");
                    return [
                        4,
                        response.json()
                    ];
                case 2:
                    _json = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchURL() {
    return _async_to_generator(function() {
        var response, _json;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch(new URL("http://localhost:4545/cli/tests/fixture.json"))
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.url, "http://localhost:4545/cli/tests/fixture.json");
                    return [
                        4,
                        response.json()
                    ];
                case 2:
                    _json = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchHeaders() {
    return _async_to_generator(function() {
        var response, headers, _json;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    headers = response.headers;
                    assertEquals(headers.get("Content-Type"), "application/json");
                    assert(headers.get("Server").startsWith("SimpleHTTP"));
                    return [
                        4,
                        response.json()
                    ];
                case 2:
                    _json = _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBlob() {
    return _async_to_generator(function() {
        var response, headers, blob;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    headers = response.headers;
                    return [
                        4,
                        response.blob()
                    ];
                case 2:
                    blob = _state.sent();
                    assertEquals(blob.type, headers.get("Content-Type"));
                    assertEquals(blob.size, Number(headers.get("Content-Length")));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyUsed() {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.bodyUsed, false);
                    assertThrows(function() {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        response.bodyUsed = true;
                    });
                    return [
                        4,
                        response.blob()
                    ];
                case 2:
                    _state.sent();
                    assertEquals(response.bodyUsed, true);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyUsedReader() {
    return _async_to_generator(function() {
        var response, reader;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    assert(response.body !== null);
                    reader = response.body.getReader();
                    // Getting a reader should lock the stream but does not consume the body
                    // so bodyUsed should not be true
                    assertEquals(response.bodyUsed, false);
                    reader.releaseLock();
                    return [
                        4,
                        response.json()
                    ];
                case 2:
                    _state.sent();
                    assertEquals(response.bodyUsed, true);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyUsedCancelStream() {
    return _async_to_generator(function() {
        var response, promise;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    assert(response.body !== null);
                    assertEquals(response.bodyUsed, false);
                    promise = response.body.cancel();
                    assertEquals(response.bodyUsed, true);
                    return [
                        4,
                        promise
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchAsyncIterator() {
    return _async_to_generator(function() {
        var response, headers, total, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    headers = response.headers;
                    assert(response.body !== null);
                    total = 0;
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        7,
                        8,
                        13
                    ]);
                    _iterator = _async_iterator(response.body);
                    _state.label = 3;
                case 3:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 4:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        6
                    ];
                    _value = _step.value;
                    chunk = _value;
                    total += chunk.length;
                    _state.label = 5;
                case 5:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        3
                    ];
                case 6:
                    return [
                        3,
                        13
                    ];
                case 7:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        13
                    ];
                case 8:
                    _state.trys.push([
                        8,
                        ,
                        11,
                        12
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        10
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 9:
                    _state.sent();
                    _state.label = 10;
                case 10:
                    return [
                        3,
                        12
                    ];
                case 11:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 12:
                    return [
                        7
                    ];
                case 13:
                    assertEquals(total, Number(headers.get("Content-Length")));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyReader() {
    return _async_to_generator(function() {
        var response, headers, reader, total, _ref, done, value;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    headers = response.headers;
                    assert(response.body !== null);
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 2:
                    reader = _state.sent();
                    total = 0;
                    _state.label = 3;
                case 3:
                    if (!true) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        reader.read()
                    ];
                case 4:
                    _ref = _state.sent(), done = _ref.done, value = _ref.value;
                    if (done) return [
                        3,
                        5
                    ];
                    assert(value);
                    total += value.length;
                    return [
                        3,
                        3
                    ];
                case 5:
                    assertEquals(total, Number(headers.get("Content-Length")));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyReaderBigBody() {
    return _async_to_generator(function() {
        var data, response, reader, total, _ref, done, value;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "a".repeat(10 << 10); // 10mb
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/echo_server", {
                            method: "POST",
                            body: data
                        })
                    ];
                case 1:
                    response = _state.sent();
                    assert(response.body !== null);
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 2:
                    reader = _state.sent();
                    total = 0;
                    _state.label = 3;
                case 3:
                    if (!true) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        reader.read()
                    ];
                case 4:
                    _ref = _state.sent(), done = _ref.done, value = _ref.value;
                    if (done) return [
                        3,
                        5
                    ];
                    assert(value);
                    total += value.length;
                    return [
                        3,
                        3
                    ];
                case 5:
                    assertEquals(total, data.length);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function responseClone() {
    return _async_to_generator(function() {
        var response, response1, u8a, _, u8a1, _1, i;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    response1 = response.clone();
                    assert(response !== response1);
                    assertEquals(response.status, response1.status);
                    assertEquals(response.statusText, response1.statusText);
                    _ = Uint8Array.bind;
                    return [
                        4,
                        response.arrayBuffer()
                    ];
                case 2:
                    u8a = new (_.apply(Uint8Array, [
                        void 0,
                        _state.sent()
                    ]));
                    _1 = Uint8Array.bind;
                    return [
                        4,
                        response1.arrayBuffer()
                    ];
                case 3:
                    u8a1 = new (_1.apply(Uint8Array, [
                        void 0,
                        _state.sent()
                    ]));
                    for(i = 0; i < u8a.byteLength; i++){
                        assertEquals(u8a[i], u8a1[i]);
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchEmptyInvalid() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                fetch("")
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, URIError)
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchMultipartFormDataSuccess() {
    return _async_to_generator(function() {
        var response, formData, file;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/subdir/multipart_form_data.txt")
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    formData = _state.sent();
                    assert(formData.has("field_1"));
                    assertEquals(formData.get("field_1").toString(), "value_1 \r\n");
                    assert(formData.has("field_2"));
                    file = formData.get("field_2");
                    assertEquals(file.name, "file.js");
                    return [
                        4,
                        file.text()
                    ];
                case 3:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        'console.log("Hi")'
                    ]);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchURLEncodedFormDataSuccess() {
    return _async_to_generator(function() {
        var response, formData;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/subdir/form_urlencoded.txt")
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    formData = _state.sent();
                    assert(formData.has("field_1"));
                    assertEquals(formData.get("field_1").toString(), "Hi");
                    assert(formData.has("field_2"));
                    assertEquals(formData.get("field_2").toString(), "<Deno>");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitFormDataBinaryFileBody() {
    return _async_to_generator(function() {
        var binaryFile, response, resultForm, resultFile, _;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // Some random bytes
                    // prettier-ignore
                    binaryFile = new Uint8Array([
                        108,
                        2,
                        0,
                        0,
                        145,
                        22,
                        162,
                        61,
                        157,
                        227,
                        166,
                        77,
                        138,
                        75,
                        180,
                        56,
                        119,
                        188,
                        177,
                        183
                    ]);
                    return [
                        4,
                        fetch("http://localhost:4545/echo_multipart_file", {
                            method: "POST",
                            body: binaryFile
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    resultForm = _state.sent();
                    resultFile = resultForm.get("file");
                    assertEquals(resultFile.type, "application/octet-stream");
                    assertEquals(resultFile.name, "file.bin");
                    _ = Uint8Array.bind;
                    return [
                        4,
                        resultFile.arrayBuffer()
                    ];
                case 3:
                    assertEquals.apply(void 0, [
                        new (_.apply(Uint8Array, [
                            void 0,
                            _state.sent()
                        ])),
                        binaryFile
                    ]);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitFormDataMultipleFilesBody() {
    return _async_to_generator(function() {
        var files, form, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file, response, resultForm, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, file1, inputFile, resultFile, _, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    files = [
                        {
                            // prettier-ignore
                            content: new Uint8Array([
                                137,
                                80,
                                78,
                                71,
                                13,
                                10,
                                26,
                                10,
                                137,
                                1,
                                25
                            ]),
                            type: "image/png",
                            name: "image",
                            fileName: "some-image.png"
                        },
                        {
                            // prettier-ignore
                            content: new Uint8Array([
                                108,
                                2,
                                0,
                                0,
                                145,
                                22,
                                162,
                                61,
                                157,
                                227,
                                166,
                                77,
                                138,
                                75,
                                180,
                                56,
                                119,
                                188,
                                177,
                                183
                            ]),
                            name: "file",
                            fileName: "file.bin",
                            expectedType: "application/octet-stream"
                        },
                        {
                            content: new TextEncoder().encode("deno land"),
                            type: "text/plain",
                            name: "text",
                            fileName: "deno.txt"
                        }
                    ];
                    form = new FormData();
                    form.append("field", "value");
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = files[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            file = _step.value;
                            form.append(file.name, new Blob([
                                file.content
                            ], {
                                type: file.type
                            }), file.fileName);
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
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: form
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    resultForm = _state.sent();
                    assertEquals(form.get("field"), resultForm.get("field"));
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        8,
                        9,
                        10
                    ]);
                    _iterator1 = files[Symbol.iterator]();
                    _state.label = 4;
                case 4:
                    if (!!(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done)) return [
                        3,
                        7
                    ];
                    file1 = _step1.value;
                    inputFile = form.get(file1.name);
                    resultFile = resultForm.get(file1.name);
                    assertEquals(inputFile.size, resultFile.size);
                    assertEquals(inputFile.name, resultFile.name);
                    assertEquals(file1.expectedType || file1.type, resultFile.type);
                    _ = Uint8Array.bind;
                    return [
                        4,
                        resultFile.arrayBuffer()
                    ];
                case 5:
                    assertEquals.apply(void 0, [
                        new (_.apply(Uint8Array, [
                            void 0,
                            _state.sent()
                        ])),
                        file1.content
                    ]);
                    _state.label = 6;
                case 6:
                    _iteratorNormalCompletion1 = true;
                    return [
                        3,
                        4
                    ];
                case 7:
                    return [
                        3,
                        10
                    ];
                case 8:
                    err = _state.sent();
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                    return [
                        3,
                        10
                    ];
                case 9:
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                    return [
                        7
                    ];
                case 10:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchWithRedirection() {
    return _async_to_generator(function() {
        var response, body;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4546/")
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.status, 200);
                    assertEquals(response.statusText, "OK");
                    assertEquals(response.url, "http://localhost:4545/");
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    body = _state.sent();
                    assert(body.includes("<title>Directory listing for /</title>"));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchWithRelativeRedirection() {
    return _async_to_generator(function() {
        var response, body;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests")
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.status, 200);
                    assertEquals(response.statusText, "OK");
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    body = _state.sent();
                    assert(body.includes("<title>Directory listing for /cli/tests/</title>"));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchWithInfRedirection() {
    return _async_to_generator(function() {
        var response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4549/cli/tests")
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.status, 0); // network error
                    assertEquals(response.type, "error");
                    assertEquals(response.ok, false);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitStringBody() {
    return _async_to_generator(function() {
        var data, response, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "Hello World";
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: data
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    assertEquals(text, data);
                    assert(response.headers.get("content-type").startsWith("text/plain"));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchRequestInitStringBody() {
    return _async_to_generator(function() {
        var data, req, response, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "Hello World";
                    req = new Request("http://localhost:4545/echo_server", {
                        method: "POST",
                        body: data
                    });
                    return [
                        4,
                        fetch(req)
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    assertEquals(text, data);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitTypedArrayBody() {
    return _async_to_generator(function() {
        var data, response, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "Hello World";
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: new TextEncoder().encode(data)
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    assertEquals(text, data);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitArrayBufferBody() {
    return _async_to_generator(function() {
        var data, response, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "Hello World";
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: new TextEncoder().encode(data).buffer
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    assertEquals(text, data);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitURLSearchParamsBody() {
    return _async_to_generator(function() {
        var data, params, response, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "param1=value1&param2=value2";
                    params = new URLSearchParams(data);
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: params
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    assertEquals(text, data);
                    assert(response.headers.get("content-type").startsWith("application/x-www-form-urlencoded"));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitBlobBody() {
    return _async_to_generator(function() {
        var data, blob, response, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "const a = 1";
                    blob = new Blob([
                        data
                    ], {
                        type: "text/javascript"
                    });
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: blob
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    assertEquals(text, data);
                    assert(response.headers.get("content-type").startsWith("text/javascript"));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitFormDataBody() {
    return _async_to_generator(function() {
        var form, response, resultForm;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    form = new FormData();
                    form.append("field", "value");
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: form
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    resultForm = _state.sent();
                    assertEquals(form.get("field"), resultForm.get("field"));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitFormDataBlobFilenameBody() {
    return _async_to_generator(function() {
        var form, response, resultForm, file;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    form = new FormData();
                    form.append("field", "value");
                    form.append("file", new Blob([
                        new TextEncoder().encode("deno")
                    ]));
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: form
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    resultForm = _state.sent();
                    assertEquals(form.get("field"), resultForm.get("field"));
                    file = resultForm.get("file");
                    assert(_instanceof(file, File));
                    assertEquals(file.name, "blob");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchInitFormDataTextFileBody() {
    return _async_to_generator(function() {
        var fileContent, form, response, resultForm, file, resultFile, _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    fileContent = "deno land";
                    form = new FormData();
                    form.append("field", "value");
                    form.append("file", new Blob([
                        new TextEncoder().encode(fileContent)
                    ], {
                        type: "text/plain"
                    }), "deno.txt");
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: form
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.formData()
                    ];
                case 2:
                    resultForm = _state.sent();
                    assertEquals(form.get("field"), resultForm.get("field"));
                    file = form.get("file");
                    resultFile = resultForm.get("file");
                    assertEquals(file.size, resultFile.size);
                    assertEquals(file.name, resultFile.name);
                    assertEquals(file.type, resultFile.type);
                    return [
                        4,
                        file.text()
                    ];
                case 3:
                    _tmp = [
                        _state.sent()
                    ];
                    return [
                        4,
                        resultFile.text()
                    ];
                case 4:
                    assertEquals.apply(void 0, _tmp.concat([
                        _state.sent()
                    ]));
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchUserAgent() {
    return _async_to_generator(function() {
        var data, response;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "Hello World";
                    return [
                        4,
                        fetch("http://localhost:4545/echo_server", {
                            method: "POST",
                            body: new TextEncoder().encode(data)
                        })
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.headers.get("user-agent"), "Deno/".concat(Deno.version.deno));
                    return [
                        4,
                        response.text()
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
// TODO(ry) The following tests work but are flaky. There's a race condition
// somewhere. Here is what one of these flaky failures looks like:
//
// unitTest fetchPostBodyString_permW0N1E0R0
// assertEquals failed. actual =   expected = POST /blah HTTP/1.1
// hello: World
// foo: Bar
// host: 127.0.0.1:4502
// content-length: 11
// hello world
// Error: actual:  expected: POST /blah HTTP/1.1
// hello: World
// foo: Bar
// host: 127.0.0.1:4502
// content-length: 11
// hello world
//     at Object.assertEquals (file:///C:/deno/js/testing/util.ts:29:11)
//     at fetchPostBodyString (file
function bufferServer(addr) {
    var _addr_split = _sliced_to_array(addr.split(":"), 2), hostname = _addr_split[0], port = _addr_split[1];
    var listener = Deno.listen({
        hostname: hostname,
        port: Number(port)
    });
    var buf = new Deno.Buffer();
    listener.accept().then(function(conn) {
        return _async_to_generator(function() {
            var p1, p2;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        p1 = buf.readFrom(conn);
                        p2 = conn.write(new TextEncoder().encode("HTTP/1.0 404 Not Found\r\nContent-Length: 2\r\n\r\nNF"));
                        // Wait for both an EOF on the read side of the socket and for the write to
                        // complete before closing it. Due to keep-alive, the EOF won't be sent
                        // until the Connection close (HTTP/1.0) response, so readFrom() can't
                        // proceed write. Conversely, if readFrom() is async, waiting for the
                        // write() to complete is not a guarantee that we've read the incoming
                        // request.
                        return [
                            4,
                            Promise.all([
                                p1,
                                p2
                            ])
                        ];
                    case 1:
                        _state.sent();
                        conn.close();
                        listener.close();
                        return [
                            2
                        ];
                }
            });
        })();
    });
    return buf;
}
unitTest({
    perms: {
        net: true
    }
}, function fetchRequest() {
    return _async_to_generator(function() {
        var addr, buf, response, actual, expected;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    addr = "127.0.0.1:4501";
                    buf = bufferServer(addr);
                    return [
                        4,
                        fetch("http://".concat(addr, "/blah"), {
                            method: "POST",
                            headers: [
                                [
                                    "Hello",
                                    "World"
                                ],
                                [
                                    "Foo",
                                    "Bar"
                                ]
                            ]
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.arrayBuffer()
                    ];
                case 2:
                    _state.sent();
                    assertEquals(response.status, 404);
                    assertEquals(response.headers.get("Content-Length"), "2");
                    actual = new TextDecoder().decode(buf.bytes());
                    expected = [
                        "POST /blah HTTP/1.1\r\n",
                        "hello: World\r\n",
                        "foo: Bar\r\n",
                        "accept: */*\r\n",
                        "user-agent: Deno/".concat(Deno.version.deno, "\r\n"),
                        "accept-encoding: gzip, br\r\n",
                        "host: ".concat(addr, "\r\n\r\n")
                    ].join("");
                    assertEquals(actual, expected);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchPostBodyString() {
    return _async_to_generator(function() {
        var addr, buf, body, response, actual, expected;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    addr = "127.0.0.1:4502";
                    buf = bufferServer(addr);
                    body = "hello world";
                    return [
                        4,
                        fetch("http://".concat(addr, "/blah"), {
                            method: "POST",
                            headers: [
                                [
                                    "Hello",
                                    "World"
                                ],
                                [
                                    "Foo",
                                    "Bar"
                                ]
                            ],
                            body: body
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.arrayBuffer()
                    ];
                case 2:
                    _state.sent();
                    assertEquals(response.status, 404);
                    assertEquals(response.headers.get("Content-Length"), "2");
                    actual = new TextDecoder().decode(buf.bytes());
                    expected = [
                        "POST /blah HTTP/1.1\r\n",
                        "hello: World\r\n",
                        "foo: Bar\r\n",
                        "content-type: text/plain;charset=UTF-8\r\n",
                        "accept: */*\r\n",
                        "user-agent: Deno/".concat(Deno.version.deno, "\r\n"),
                        "accept-encoding: gzip, br\r\n",
                        "host: ".concat(addr, "\r\n"),
                        "content-length: ".concat(body.length, "\r\n\r\n"),
                        body
                    ].join("");
                    assertEquals(actual, expected);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchPostBodyTypedArray() {
    return _async_to_generator(function() {
        var addr, buf, bodyStr, body, response, actual, expected;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    addr = "127.0.0.1:4503";
                    buf = bufferServer(addr);
                    bodyStr = "hello world";
                    body = new TextEncoder().encode(bodyStr);
                    return [
                        4,
                        fetch("http://".concat(addr, "/blah"), {
                            method: "POST",
                            headers: [
                                [
                                    "Hello",
                                    "World"
                                ],
                                [
                                    "Foo",
                                    "Bar"
                                ]
                            ],
                            body: body
                        })
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.arrayBuffer()
                    ];
                case 2:
                    _state.sent();
                    assertEquals(response.status, 404);
                    assertEquals(response.headers.get("Content-Length"), "2");
                    actual = new TextDecoder().decode(buf.bytes());
                    expected = [
                        "POST /blah HTTP/1.1\r\n",
                        "hello: World\r\n",
                        "foo: Bar\r\n",
                        "accept: */*\r\n",
                        "user-agent: Deno/".concat(Deno.version.deno, "\r\n"),
                        "accept-encoding: gzip, br\r\n",
                        "host: ".concat(addr, "\r\n"),
                        "content-length: ".concat(body.byteLength, "\r\n\r\n"),
                        bodyStr
                    ].join("");
                    assertEquals(actual, expected);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchWithManualRedirection() {
    return _async_to_generator(function() {
        var response, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4546/", {
                            redirect: "manual"
                        })
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.status, 0);
                    assertEquals(response.statusText, "");
                    assertEquals(response.url, "");
                    assertEquals(response.type, "opaqueredirect");
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        response.text()
                    ];
                case 3:
                    _state.sent();
                    fail("Response.text() didn't throw on a filtered response without a body (type opaqueredirect)");
                    return [
                        3,
                        5
                    ];
                case 4:
                    e = _state.sent();
                    return [
                        2
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchWithErrorRedirection() {
    return _async_to_generator(function() {
        var response, e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4546/", {
                            redirect: "error"
                        })
                    ];
                case 1:
                    response = _state.sent();
                    assertEquals(response.status, 0);
                    assertEquals(response.statusText, "");
                    assertEquals(response.url, "");
                    assertEquals(response.type, "error");
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        response.text()
                    ];
                case 3:
                    _state.sent();
                    fail("Response.text() didn't throw on a filtered response without a body (type error)");
                    return [
                        3,
                        5
                    ];
                case 4:
                    e = _state.sent();
                    return [
                        2
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function responseRedirect() {
    var redir = Response.redirect("example.com/newLocation", 301);
    assertEquals(redir.status, 301);
    assertEquals(redir.statusText, "");
    assertEquals(redir.url, "");
    assertEquals(redir.headers.get("Location"), "example.com/newLocation");
    assertEquals(redir.type, "default");
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyReadTwice() {
    return _async_to_generator(function() {
        var response, _json, methods, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, method, unused, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    return [
                        4,
                        response.json()
                    ];
                case 2:
                    _json = _state.sent();
                    assert(_json);
                    // All calls after the body was consumed, should fail
                    methods = [
                        "json",
                        "text",
                        "formData",
                        "arrayBuffer"
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        10,
                        11,
                        12
                    ]);
                    _iterator = methods[Symbol.iterator]();
                    _state.label = 4;
                case 4:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        9
                    ];
                    method = _step.value;
                    _state.label = 5;
                case 5:
                    _state.trys.push([
                        5,
                        7,
                        ,
                        8
                    ]);
                    return [
                        4,
                        response[method]()
                    ];
                case 6:
                    _state.sent();
                    fail("Reading body multiple times should failed, the stream should've been locked.");
                    return [
                        3,
                        8
                    ];
                case 7:
                    unused = _state.sent();
                    return [
                        3,
                        8
                    ];
                case 8:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        4
                    ];
                case 9:
                    return [
                        3,
                        12
                    ];
                case 10:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        12
                    ];
                case 11:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 12:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyReaderAfterRead() {
    return _async_to_generator(function() {
        var response, reader, _ref, done, value;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    response = _state.sent();
                    assert(response.body !== null);
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 2:
                    reader = _state.sent();
                    _state.label = 3;
                case 3:
                    if (!true) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        reader.read()
                    ];
                case 4:
                    _ref = _state.sent(), done = _ref.done, value = _ref.value;
                    if (done) return [
                        3,
                        5
                    ];
                    assert(value);
                    return [
                        3,
                        3
                    ];
                case 5:
                    try {
                        response.body.getReader();
                        fail("The stream should've been locked.");
                    } catch (unused) {
                    // pass
                    }
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyReaderWithCancelAndNewReader() {
    return _async_to_generator(function() {
        var data, response, firstReader, reader, total, _ref, done, value;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "a".repeat(1 << 10);
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/echo_server", {
                            method: "POST",
                            body: data
                        })
                    ];
                case 1:
                    response = _state.sent();
                    assert(response.body !== null);
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 2:
                    firstReader = _state.sent();
                    // Acquire reader without reading & release
                    return [
                        4,
                        firstReader.releaseLock()
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 4:
                    reader = _state.sent();
                    total = 0;
                    _state.label = 5;
                case 5:
                    if (!true) return [
                        3,
                        7
                    ];
                    return [
                        4,
                        reader.read()
                    ];
                case 6:
                    _ref = _state.sent(), done = _ref.done, value = _ref.value;
                    if (done) return [
                        3,
                        7
                    ];
                    assert(value);
                    total += value.length;
                    return [
                        3,
                        5
                    ];
                case 7:
                    assertEquals(total, data.length);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchBodyReaderWithReadCancelAndNewReader() {
    return _async_to_generator(function() {
        var data, response, firstReader, _ref, firstValue, reader, total, _ref1, done, value;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    data = "a".repeat(1 << 10);
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/echo_server", {
                            method: "POST",
                            body: data
                        })
                    ];
                case 1:
                    response = _state.sent();
                    assert(response.body !== null);
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 2:
                    firstReader = _state.sent();
                    return [
                        4,
                        firstReader.read()
                    ];
                case 3:
                    _ref = _state.sent(), firstValue = _ref.value;
                    assert(firstValue);
                    return [
                        4,
                        firstReader.releaseLock()
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        response.body.getReader()
                    ];
                case 5:
                    reader = _state.sent();
                    total = firstValue.length || 0;
                    _state.label = 6;
                case 6:
                    if (!true) return [
                        3,
                        8
                    ];
                    return [
                        4,
                        reader.read()
                    ];
                case 7:
                    _ref1 = _state.sent(), done = _ref1.done, value = _ref1.value;
                    if (done) return [
                        3,
                        8
                    ];
                    assert(value);
                    total += value.length;
                    return [
                        3,
                        6
                    ];
                case 8:
                    assertEquals(total, data.length);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchResourceCloseAfterStreamCancel() {
    return _async_to_generator(function() {
        var res;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/fixture.json")
                    ];
                case 1:
                    res = _state.sent();
                    assert(res.body !== null);
                    // After ReadableStream.cancel is called, resource handle must be closed
                    // The test should not fail with: Test case is leaking resources
                    return [
                        4,
                        res.body.cancel()
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchNullBodyStatus() {
    return _async_to_generator(function() {
        var nullBodyStatus, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, status, headers, res, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    nullBodyStatus = [
                        101,
                        204,
                        205,
                        304
                    ];
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = nullBodyStatus[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    status = _step.value;
                    headers = new Headers([
                        [
                            "x-status",
                            String(status)
                        ]
                    ]);
                    return [
                        4,
                        fetch("http://localhost:4545/cli/tests/echo_server", {
                            body: "deno",
                            method: "POST",
                            headers: headers
                        })
                    ];
                case 3:
                    res = _state.sent();
                    assertEquals(res.body, null);
                    assertEquals(res.status, status);
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion = true;
                    return [
                        3,
                        2
                    ];
                case 5:
                    return [
                        3,
                        8
                    ];
                case 6:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        8
                    ];
                case 7:
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                    return [
                        7
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        net: true
    }
}, function fetchResponseConstructorNullBody() {
    var nullBodyStatus = [
        204,
        205,
        304
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = nullBodyStatus[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var status = _step.value;
            try {
                new Response("deno", {
                    status: status
                });
                fail("Response with null body status cannot have body");
            } catch (e) {
                assert(_instanceof(e, TypeError));
                assertEquals(e.message, "Response with null body status cannot have body");
            }
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
unitTest({
    perms: {
        net: true
    }
}, function fetchResponseConstructorInvalidStatus() {
    var invalidStatus = [
        101,
        600,
        199
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = invalidStatus[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var status = _step.value;
            try {
                new Response("deno", {
                    status: status
                });
                fail("Invalid status");
            } catch (e) {
                assert(_instanceof(e, RangeError));
                assertEquals(e.message, "The status provided (".concat(status, ") is outside the range [200, 599]"));
            }
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
