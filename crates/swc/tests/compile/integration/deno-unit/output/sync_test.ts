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
import { unitTest, assertEquals } from "./test_util.ts";
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function fdatasyncSyncSuccess() {
    var filename = Deno.makeTempDirSync() + "/test_fdatasyncSync.txt";
    var file = Deno.openSync(filename, {
        read: true,
        write: true,
        create: true
    });
    var data = new Uint8Array(64);
    Deno.writeSync(file.rid, data);
    Deno.fdatasyncSync(file.rid);
    assertEquals(Deno.readFileSync(filename), data);
    Deno.close(file.rid);
    Deno.removeSync(filename);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function fdatasyncSuccess() {
    return _async_to_generator(function() {
        var filename, file, data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    filename = _state.sent() + "/test_fdatasync.txt";
                    return [
                        4,
                        Deno.open(filename, {
                            read: true,
                            write: true,
                            create: true
                        })
                    ];
                case 2:
                    file = _state.sent();
                    data = new Uint8Array(64);
                    return [
                        4,
                        Deno.write(file.rid, data)
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        Deno.fdatasync(file.rid)
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        Deno.readFile(filename)
                    ];
                case 5:
                    assertEquals.apply(void 0, [
                        _state.sent(),
                        data
                    ]);
                    Deno.close(file.rid);
                    return [
                        4,
                        Deno.remove(filename)
                    ];
                case 6:
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
        read: true,
        write: true
    }
}, function fsyncSyncSuccess() {
    var filename = Deno.makeTempDirSync() + "/test_fsyncSync.txt";
    var file = Deno.openSync(filename, {
        read: true,
        write: true,
        create: true
    });
    var size = 64;
    Deno.ftruncateSync(file.rid, size);
    Deno.fsyncSync(file.rid);
    assertEquals(Deno.statSync(filename).size, size);
    Deno.close(file.rid);
    Deno.removeSync(filename);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function fsyncSuccess() {
    return _async_to_generator(function() {
        var filename, file, size;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    filename = _state.sent() + "/test_fsync.txt";
                    return [
                        4,
                        Deno.open(filename, {
                            read: true,
                            write: true,
                            create: true
                        })
                    ];
                case 2:
                    file = _state.sent();
                    size = 64;
                    return [
                        4,
                        Deno.ftruncate(file.rid, size)
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        Deno.fsync(file.rid)
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        Deno.stat(filename)
                    ];
                case 5:
                    assertEquals.apply(void 0, [
                        _state.sent().size,
                        size
                    ]);
                    Deno.close(file.rid);
                    return [
                        4,
                        Deno.remove(filename)
                    ];
                case 6:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
