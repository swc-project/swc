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
import { unitTest, assert } from "./test_util.ts";
unitTest(function metrics() {
    return _async_to_generator(function() {
        var m1, dataMsg, m2;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    m1 = Deno.metrics();
                    assert(m1.opsDispatched > 0);
                    assert(m1.opsDispatchedSync > 0);
                    assert(m1.opsCompleted > 0);
                    assert(m1.opsCompletedSync > 0);
                    assert(m1.bytesSentControl > 0);
                    assert(m1.bytesSentData >= 0);
                    assert(m1.bytesReceived > 0);
                    // Write to stdout to ensure a "data" message gets sent instead of just
                    // control messages.
                    dataMsg = new Uint8Array([
                        13,
                        13,
                        13
                    ]); // "\r\r\r",
                    return [
                        4,
                        Deno.stdout.write(dataMsg)
                    ];
                case 1:
                    _state.sent();
                    m2 = Deno.metrics();
                    assert(m2.opsDispatched > m1.opsDispatched);
                    assert(m2.opsDispatchedSync > m1.opsDispatchedSync);
                    assert(m2.opsDispatchedAsync > m1.opsDispatchedAsync);
                    assert(m2.opsCompleted > m1.opsCompleted);
                    assert(m2.opsCompletedSync > m1.opsCompletedSync);
                    assert(m2.opsCompletedAsync > m1.opsCompletedAsync);
                    assert(m2.bytesSentControl > m1.bytesSentControl);
                    assert(m2.bytesSentData >= m1.bytesSentData + dataMsg.byteLength);
                    assert(m2.bytesReceived > m1.bytesReceived);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        write: true
    }
}, function metricsUpdatedIfNoResponseSync() {
    var filename = Deno.makeTempDirSync() + "/test.txt";
    var data = new Uint8Array([
        41,
        42,
        43
    ]);
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
    var metrics = Deno.metrics();
    assert(metrics.opsDispatched === metrics.opsCompleted);
    assert(metrics.opsDispatchedSync === metrics.opsCompletedSync);
});
unitTest({
    perms: {
        write: true
    }
}, function metricsUpdatedIfNoResponseAsync() {
    return _async_to_generator(function() {
        var filename, data, metrics;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = Deno.makeTempDirSync() + "/test.txt";
                    data = new Uint8Array([
                        41,
                        42,
                        43
                    ]);
                    return [
                        4,
                        Deno.writeFile(filename, data, {
                            mode: 438
                        })
                    ];
                case 1:
                    _state.sent();
                    metrics = Deno.metrics();
                    assert(metrics.opsDispatched === metrics.opsCompleted);
                    assert(metrics.opsDispatchedSync === metrics.opsCompletedSync);
                    assert(metrics.opsDispatchedAsync === metrics.opsCompletedAsync);
                    return [
                        2
                    ];
            }
        });
    })();
});
