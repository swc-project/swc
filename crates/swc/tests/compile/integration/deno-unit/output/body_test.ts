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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertEquals, assert } from "./test_util.ts";
// just a hack to get a body object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildBody(body) {
    var stub = new Request("", {
        body: body
    });
    return stub;
}
var intArrays = [
    Int8Array,
    Int16Array,
    Int32Array,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Uint8ClampedArray,
    Float32Array,
    Float64Array
];
unitTest(function arrayBufferFromByteArrays() {
    return _async_to_generator(function() {
        var buffer, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, type, body, text, _, _1, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    buffer = new TextEncoder().encode("ahoyhoy8").buffer;
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = intArrays[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    type = _step.value;
                    body = buildBody(new type(buffer));
                    _1 = (_ = new TextDecoder("utf-8")).decode;
                    return [
                        4,
                        body.arrayBuffer()
                    ];
                case 3:
                    text = _1.apply(_, [
                        _state.sent()
                    ]);
                    assertEquals(text, "ahoyhoy8");
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
//FormData
unitTest({
    perms: {
        net: true
    }
}, function bodyMultipartFormData() {
    return _async_to_generator(function() {
        var response, text, body, formData;
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
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    body = buildBody(text);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    body.contentType = "multipart/form-data;boundary=boundary";
                    return [
                        4,
                        body.formData()
                    ];
                case 3:
                    formData = _state.sent();
                    assert(formData.has("field_1"));
                    assertEquals(formData.get("field_1").toString(), "value_1 \r\n");
                    assert(formData.has("field_2"));
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
}, function bodyURLEncodedFormData() {
    return _async_to_generator(function() {
        var response, text, body, formData;
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
                        response.text()
                    ];
                case 2:
                    text = _state.sent();
                    body = buildBody(text);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    body.contentType = "application/x-www-form-urlencoded";
                    return [
                        4,
                        body.formData()
                    ];
                case 3:
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
    perms: {}
}, function bodyURLSearchParams() {
    return _async_to_generator(function() {
        var body, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    body = buildBody(new URLSearchParams({
                        hello: "world"
                    }));
                    return [
                        4,
                        body.text()
                    ];
                case 1:
                    text = _state.sent();
                    assertEquals(text, "hello=world");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function bodyArrayBufferMultipleParts() {
    return _async_to_generator(function() {
        var parts, size, i, part, offset, stream, body;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    parts = [];
                    size = 0;
                    for(i = 0; i <= 150000; i++){
                        part = new Uint8Array([
                            1
                        ]);
                        parts.push(part);
                        size += part.length;
                    }
                    offset = 0;
                    stream = new ReadableStream({
                        pull: function pull(controller) {
                            // parts.shift() takes forever: https://github.com/denoland/deno/issues/5259
                            var chunk = parts[offset++];
                            if (!chunk) return controller.close();
                            controller.enqueue(chunk);
                        }
                    });
                    body = buildBody(stream);
                    return [
                        4,
                        body.arrayBuffer()
                    ];
                case 1:
                    assertEquals.apply(void 0, [
                        _state.sent().byteLength,
                        size
                    ]);
                    return [
                        2
                    ];
            }
        });
    })();
});
