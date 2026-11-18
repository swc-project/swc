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
import { unitTest, assert, assertEquals } from "./test_util.ts";
unitTest(function fromInit() {
    var req = new Request("https://example.com", {
        body: "ahoyhoy",
        method: "POST",
        headers: {
            "test-header": "value"
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assertEquals("ahoyhoy", req._bodySource);
    assertEquals(req.url, "https://example.com");
    assertEquals(req.headers.get("test-header"), "value");
});
unitTest(function fromRequest() {
    var r = new Request("https://example.com");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r._bodySource = "ahoyhoy";
    r.headers.set("test-header", "value");
    var req = new Request(r);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    assertEquals(req._bodySource, r._bodySource);
    assertEquals(req.url, r.url);
    assertEquals(req.headers.get("test-header"), r.headers.get("test-header"));
});
unitTest(function cloneRequestBodyStream() {
    return _async_to_generator(function() {
        var stream, r1, r2, b1, b2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // hack to get a stream
                    stream = new Request("", {
                        body: "a test body"
                    }).body;
                    r1 = new Request("https://example.com", {
                        body: stream
                    });
                    r2 = r1.clone();
                    return [
                        4,
                        r1.text()
                    ];
                case 1:
                    b1 = _state.sent();
                    return [
                        4,
                        r2.text()
                    ];
                case 2:
                    b2 = _state.sent();
                    assertEquals(b1, b2);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    assert(r1._bodySource !== r2._bodySource);
                    return [
                        2
                    ];
            }
        });
    })();
});
