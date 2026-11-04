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
import { unitTest, assertEquals, assertThrows, assertThrowsAsync } from "./test_util.ts";
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeTextFileSyncSuccess() {
    var filename = Deno.makeTempDirSync() + "/test.txt";
    Deno.writeTextFileSync(filename, "Hello");
    var dataRead = Deno.readTextFileSync(filename);
    assertEquals("Hello", dataRead);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeTextFileSyncByUrl() {
    var tempDir = Deno.makeTempDirSync();
    var fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
    Deno.writeTextFileSync(fileUrl, "Hello");
    var dataRead = Deno.readTextFileSync(fileUrl);
    assertEquals("Hello", dataRead);
    Deno.removeSync(fileUrl, {
        recursive: true
    });
});
unitTest({
    perms: {
        write: true
    }
}, function writeTextFileSyncFail() {
    var filename = "/baddir/test.txt";
    // The following should fail because /baddir doesn't exist (hopefully).
    assertThrows(function() {
        Deno.writeTextFileSync(filename, "hello");
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        write: false
    }
}, function writeTextFileSyncPerm() {
    var filename = "/baddir/test.txt";
    // The following should fail due to no write permission
    assertThrows(function() {
        Deno.writeTextFileSync(filename, "Hello");
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function writeTextFileSuccess() {
    return _async_to_generator(function() {
        var filename, dataRead;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = Deno.makeTempDirSync() + "/test.txt";
                    return [
                        4,
                        Deno.writeTextFile(filename, "Hello")
                    ];
                case 1:
                    _state.sent();
                    dataRead = Deno.readTextFileSync(filename);
                    assertEquals("Hello", dataRead);
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
}, function writeTextFileByUrl() {
    return _async_to_generator(function() {
        var tempDir, fileUrl, dataRead;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    tempDir = Deno.makeTempDirSync();
                    fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
                    return [
                        4,
                        Deno.writeTextFile(fileUrl, "Hello")
                    ];
                case 1:
                    _state.sent();
                    dataRead = Deno.readTextFileSync(fileUrl);
                    assertEquals("Hello", dataRead);
                    Deno.removeSync(fileUrl, {
                        recursive: true
                    });
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
}, function writeTextFileNotFound() {
    return _async_to_generator(function() {
        var filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "/baddir/test.txt";
                    // The following should fail because /baddir doesn't exist (hopefully).
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.writeTextFile(filename, "Hello")
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.NotFound)
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
        write: false
    }
}, function writeTextFilePerm() {
    return _async_to_generator(function() {
        var filename;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    filename = "/baddir/test.txt";
                    // The following should fail due to no write permission
                    return [
                        4,
                        assertThrowsAsync(function() {
                            return _async_to_generator(function() {
                                return _ts_generator(this, function(_state) {
                                    switch(_state.label){
                                        case 0:
                                            return [
                                                4,
                                                Deno.writeTextFile(filename, "Hello")
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
