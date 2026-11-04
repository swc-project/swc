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
import { unitTest, assert, assertEquals, assertThrows, assertThrowsAsync } from "./test_util.ts";
function assertDirectory(path, mode) {
    var info = Deno.lstatSync(path);
    assert(info.isDirectory);
    if (Deno.build.os !== "windows" && mode !== undefined) {
        assertEquals(info.mode & 511, mode & ~Deno.umask());
    }
}
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function mkdirSyncSuccess() {
    var path = Deno.makeTempDirSync() + "/dir";
    Deno.mkdirSync(path);
    assertDirectory(path);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function mkdirSyncMode() {
    var path = Deno.makeTempDirSync() + "/dir";
    Deno.mkdirSync(path, {
        mode: 479
    });
    assertDirectory(path, 479);
});
unitTest({
    perms: {
        write: false
    }
}, function mkdirSyncPerm() {
    assertThrows(function() {
        Deno.mkdirSync("/baddir");
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function mkdirSuccess() {
    return _async_to_generator(function() {
        var path;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    path = Deno.makeTempDirSync() + "/dir";
                    return [
                        4,
                        Deno.mkdir(path)
                    ];
                case 1:
                    _state.sent();
                    assertDirectory(path);
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
}, function mkdirMode() {
    return _async_to_generator(function() {
        var path;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    path = Deno.makeTempDirSync() + "/dir";
                    return [
                        4,
                        Deno.mkdir(path, {
                            mode: 479
                        })
                    ];
                case 1:
                    _state.sent();
                    assertDirectory(path, 479);
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
}, function mkdirErrSyncIfExists() {
    assertThrows(function() {
        Deno.mkdirSync(".");
    }, Deno.errors.AlreadyExists);
});
unitTest({
    perms: {
        write: true
    }
}, function mkdirErrIfExists() {
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
                                                Deno.mkdir(".")
                                            ];
                                        case 1:
                                            _state.sent();
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        }, Deno.errors.AlreadyExists)
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
        read: true,
        write: true
    }
}, function mkdirSyncRecursive() {
    var path = Deno.makeTempDirSync() + "/nested/directory";
    Deno.mkdirSync(path, {
        recursive: true
    });
    assertDirectory(path);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function mkdirRecursive() {
    return _async_to_generator(function() {
        var path;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    path = Deno.makeTempDirSync() + "/nested/directory";
                    return [
                        4,
                        Deno.mkdir(path, {
                            recursive: true
                        })
                    ];
                case 1:
                    _state.sent();
                    assertDirectory(path);
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
}, function mkdirSyncRecursiveMode() {
    var nested = Deno.makeTempDirSync() + "/nested";
    var path = nested + "/dir";
    Deno.mkdirSync(path, {
        mode: 479,
        recursive: true
    });
    assertDirectory(path, 479);
    assertDirectory(nested, 479);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function mkdirRecursiveMode() {
    return _async_to_generator(function() {
        var nested, path;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    nested = Deno.makeTempDirSync() + "/nested";
                    path = nested + "/dir";
                    return [
                        4,
                        Deno.mkdir(path, {
                            mode: 479,
                            recursive: true
                        })
                    ];
                case 1:
                    _state.sent();
                    assertDirectory(path, 479);
                    assertDirectory(nested, 479);
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
}, function mkdirSyncRecursiveIfExists() {
    var path = Deno.makeTempDirSync() + "/dir";
    Deno.mkdirSync(path, {
        mode: 479
    });
    Deno.mkdirSync(path, {
        recursive: true
    });
    Deno.mkdirSync(path, {
        recursive: true,
        mode: 473
    });
    assertDirectory(path, 479);
    if (Deno.build.os !== "windows") {
        var pathLink = path + "Link";
        Deno.symlinkSync(path, pathLink);
        Deno.mkdirSync(pathLink, {
            recursive: true
        });
        Deno.mkdirSync(pathLink, {
            recursive: true,
            mode: 473
        });
        assertDirectory(path, 479);
    }
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function mkdirRecursiveIfExists() {
    return _async_to_generator(function() {
        var path, pathLink;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    path = Deno.makeTempDirSync() + "/dir";
                    return [
                        4,
                        Deno.mkdir(path, {
                            mode: 479
                        })
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        Deno.mkdir(path, {
                            recursive: true
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        Deno.mkdir(path, {
                            recursive: true,
                            mode: 473
                        })
                    ];
                case 3:
                    _state.sent();
                    assertDirectory(path, 479);
                    if (!(Deno.build.os !== "windows")) return [
                        3,
                        6
                    ];
                    pathLink = path + "Link";
                    Deno.symlinkSync(path, pathLink);
                    return [
                        4,
                        Deno.mkdir(pathLink, {
                            recursive: true
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        4,
                        Deno.mkdir(pathLink, {
                            recursive: true,
                            mode: 473
                        })
                    ];
                case 5:
                    _state.sent();
                    assertDirectory(path, 479);
                    _state.label = 6;
                case 6:
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
}, function mkdirSyncErrors() {
    var testDir = Deno.makeTempDirSync();
    var emptydir = testDir + "/empty";
    var fulldir = testDir + "/dir";
    var file = fulldir + "/file";
    Deno.mkdirSync(emptydir);
    Deno.mkdirSync(fulldir);
    Deno.createSync(file).close();
    assertThrows(function() {
        Deno.mkdirSync(emptydir, {
            recursive: false
        });
    }, Deno.errors.AlreadyExists);
    assertThrows(function() {
        Deno.mkdirSync(fulldir, {
            recursive: false
        });
    }, Deno.errors.AlreadyExists);
    assertThrows(function() {
        Deno.mkdirSync(file, {
            recursive: false
        });
    }, Deno.errors.AlreadyExists);
    assertThrows(function() {
        Deno.mkdirSync(file, {
            recursive: true
        });
    }, Deno.errors.AlreadyExists);
    if (Deno.build.os !== "windows") {
        var fileLink = testDir + "/fileLink";
        var dirLink = testDir + "/dirLink";
        var danglingLink = testDir + "/danglingLink";
        Deno.symlinkSync(file, fileLink);
        Deno.symlinkSync(emptydir, dirLink);
        Deno.symlinkSync(testDir + "/nonexistent", danglingLink);
        assertThrows(function() {
            Deno.mkdirSync(dirLink, {
                recursive: false
            });
        }, Deno.errors.AlreadyExists);
        assertThrows(function() {
            Deno.mkdirSync(fileLink, {
                recursive: false
            });
        }, Deno.errors.AlreadyExists);
        assertThrows(function() {
            Deno.mkdirSync(fileLink, {
                recursive: true
            });
        }, Deno.errors.AlreadyExists);
        assertThrows(function() {
            Deno.mkdirSync(danglingLink, {
                recursive: false
            });
        }, Deno.errors.AlreadyExists);
        assertThrows(function() {
            Deno.mkdirSync(danglingLink, {
                recursive: true
            });
        }, Deno.errors.AlreadyExists);
    }
});
