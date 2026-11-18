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
import { unitTest, assert, assertEquals, assertThrows, assertThrowsAsync, pathToAbsoluteFileUrl } from "./test_util.ts";
unitTest({
    perms: {
        read: true
    }
}, function fstatSyncSuccess() {
    var file = Deno.openSync("README.md");
    var fileInfo = Deno.fstatSync(file.rid);
    assert(fileInfo.isFile);
    assert(!fileInfo.isSymlink);
    assert(!fileInfo.isDirectory);
    assert(fileInfo.size);
    assert(fileInfo.atime);
    assert(fileInfo.mtime);
    assert(fileInfo.birthtime);
    Deno.close(file.rid);
});
unitTest({
    perms: {
        read: true
    }
}, function fstatSuccess() {
    return _async_to_generator(function() {
        var file, fileInfo;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.open("README.md")
                    ];
                case 1:
                    file = _state.sent();
                    return [
                        4,
                        Deno.fstat(file.rid)
                    ];
                case 2:
                    fileInfo = _state.sent();
                    assert(fileInfo.isFile);
                    assert(!fileInfo.isSymlink);
                    assert(!fileInfo.isDirectory);
                    assert(fileInfo.size);
                    assert(fileInfo.atime);
                    assert(fileInfo.mtime);
                    assert(fileInfo.birthtime);
                    Deno.close(file.rid);
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
}, function statSyncSuccess() {
    var packageInfo = Deno.statSync("README.md");
    assert(packageInfo.isFile);
    assert(!packageInfo.isSymlink);
    var modulesInfo = Deno.statSync("cli/tests/symlink_to_subdir");
    assert(modulesInfo.isDirectory);
    assert(!modulesInfo.isSymlink);
    var testsInfo = Deno.statSync("cli/tests");
    assert(testsInfo.isDirectory);
    assert(!testsInfo.isSymlink);
    var tempFile = Deno.makeTempFileSync();
    var tempInfo = Deno.statSync(tempFile);
    var now = Date.now();
    assert(tempInfo.atime !== null && now - tempInfo.atime.valueOf() < 1000);
    assert(tempInfo.mtime !== null && now - tempInfo.mtime.valueOf() < 1000);
    assert(tempInfo.birthtime === null || now - tempInfo.birthtime.valueOf() < 1000);
    var packageInfoByUrl = Deno.statSync(pathToAbsoluteFileUrl("README.md"));
    assert(packageInfoByUrl.isFile);
    assert(!packageInfoByUrl.isSymlink);
    var modulesInfoByUrl = Deno.statSync(pathToAbsoluteFileUrl("cli/tests/symlink_to_subdir"));
    assert(modulesInfoByUrl.isDirectory);
    assert(!modulesInfoByUrl.isSymlink);
    var testsInfoByUrl = Deno.statSync(pathToAbsoluteFileUrl("cli/tests"));
    assert(testsInfoByUrl.isDirectory);
    assert(!testsInfoByUrl.isSymlink);
    var tempFileForUrl = Deno.makeTempFileSync();
    var tempInfoByUrl = Deno.statSync(new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempFileForUrl)));
    now = Date.now();
    assert(tempInfoByUrl.atime !== null && now - tempInfoByUrl.atime.valueOf() < 1000);
    assert(tempInfoByUrl.mtime !== null && now - tempInfoByUrl.mtime.valueOf() < 1000);
    assert(tempInfoByUrl.birthtime === null || now - tempInfoByUrl.birthtime.valueOf() < 1000);
    Deno.removeSync(tempFile, {
        recursive: true
    });
    Deno.removeSync(tempFileForUrl, {
        recursive: true
    });
});
unitTest({
    perms: {
        read: false
    }
}, function statSyncPerm() {
    assertThrows(function() {
        Deno.statSync("README.md");
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true
    }
}, function statSyncNotFound() {
    assertThrows(function() {
        Deno.statSync("bad_file_name");
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        read: true
    }
}, function lstatSyncSuccess() {
    var packageInfo = Deno.lstatSync("README.md");
    assert(packageInfo.isFile);
    assert(!packageInfo.isSymlink);
    var packageInfoByUrl = Deno.lstatSync(pathToAbsoluteFileUrl("README.md"));
    assert(packageInfoByUrl.isFile);
    assert(!packageInfoByUrl.isSymlink);
    var modulesInfo = Deno.lstatSync("cli/tests/symlink_to_subdir");
    assert(!modulesInfo.isDirectory);
    assert(modulesInfo.isSymlink);
    var modulesInfoByUrl = Deno.lstatSync(pathToAbsoluteFileUrl("cli/tests/symlink_to_subdir"));
    assert(!modulesInfoByUrl.isDirectory);
    assert(modulesInfoByUrl.isSymlink);
    var coreInfo = Deno.lstatSync("core");
    assert(coreInfo.isDirectory);
    assert(!coreInfo.isSymlink);
    var coreInfoByUrl = Deno.lstatSync(pathToAbsoluteFileUrl("core"));
    assert(coreInfoByUrl.isDirectory);
    assert(!coreInfoByUrl.isSymlink);
});
unitTest({
    perms: {
        read: false
    }
}, function lstatSyncPerm() {
    assertThrows(function() {
        Deno.lstatSync("README.md");
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true
    }
}, function lstatSyncNotFound() {
    assertThrows(function() {
        Deno.lstatSync("bad_file_name");
    }, Deno.errors.NotFound);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function statSuccess() {
    return _async_to_generator(function() {
        var packageInfo, packageInfoByUrl, modulesInfo, modulesInfoByUrl, testsInfo, testsInfoByUrl, tempFile, tempInfo, now, tempFileForUrl, tempInfoByUrl;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.stat("README.md")
                    ];
                case 1:
                    packageInfo = _state.sent();
                    assert(packageInfo.isFile);
                    assert(!packageInfo.isSymlink);
                    return [
                        4,
                        Deno.stat(pathToAbsoluteFileUrl("README.md"))
                    ];
                case 2:
                    packageInfoByUrl = _state.sent();
                    assert(packageInfoByUrl.isFile);
                    assert(!packageInfoByUrl.isSymlink);
                    return [
                        4,
                        Deno.stat("cli/tests/symlink_to_subdir")
                    ];
                case 3:
                    modulesInfo = _state.sent();
                    assert(modulesInfo.isDirectory);
                    assert(!modulesInfo.isSymlink);
                    return [
                        4,
                        Deno.stat(pathToAbsoluteFileUrl("cli/tests/symlink_to_subdir"))
                    ];
                case 4:
                    modulesInfoByUrl = _state.sent();
                    assert(modulesInfoByUrl.isDirectory);
                    assert(!modulesInfoByUrl.isSymlink);
                    return [
                        4,
                        Deno.stat("cli/tests")
                    ];
                case 5:
                    testsInfo = _state.sent();
                    assert(testsInfo.isDirectory);
                    assert(!testsInfo.isSymlink);
                    return [
                        4,
                        Deno.stat(pathToAbsoluteFileUrl("cli/tests"))
                    ];
                case 6:
                    testsInfoByUrl = _state.sent();
                    assert(testsInfoByUrl.isDirectory);
                    assert(!testsInfoByUrl.isSymlink);
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 7:
                    tempFile = _state.sent();
                    return [
                        4,
                        Deno.stat(tempFile)
                    ];
                case 8:
                    tempInfo = _state.sent();
                    now = Date.now();
                    assert(tempInfo.atime !== null && now - tempInfo.atime.valueOf() < 1000);
                    assert(tempInfo.mtime !== null && now - tempInfo.mtime.valueOf() < 1000);
                    assert(tempInfo.birthtime === null || now - tempInfo.birthtime.valueOf() < 1000);
                    return [
                        4,
                        Deno.makeTempFile()
                    ];
                case 9:
                    tempFileForUrl = _state.sent();
                    return [
                        4,
                        Deno.stat(new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempFileForUrl)))
                    ];
                case 10:
                    tempInfoByUrl = _state.sent();
                    now = Date.now();
                    assert(tempInfoByUrl.atime !== null && now - tempInfoByUrl.atime.valueOf() < 1000);
                    assert(tempInfoByUrl.mtime !== null && now - tempInfoByUrl.mtime.valueOf() < 1000);
                    assert(tempInfoByUrl.birthtime === null || now - tempInfoByUrl.birthtime.valueOf() < 1000);
                    Deno.removeSync(tempFile, {
                        recursive: true
                    });
                    Deno.removeSync(tempFileForUrl, {
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
        read: false
    }
}, function statPerm() {
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
                                                Deno.stat("README.md")
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
        read: true
    }
}, function statNotFound() {
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
                                                Deno.stat("bad_file_name")
                                            ];
                                        case 1:
                                            _state.sent(), Deno.errors.NotFound;
                                            return [
                                                2
                                            ];
                                    }
                                });
                            })();
                        })
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
        read: true
    }
}, function lstatSuccess() {
    return _async_to_generator(function() {
        var packageInfo, packageInfoByUrl, modulesInfo, modulesInfoByUrl, coreInfo, coreInfoByUrl;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.lstat("README.md")
                    ];
                case 1:
                    packageInfo = _state.sent();
                    assert(packageInfo.isFile);
                    assert(!packageInfo.isSymlink);
                    return [
                        4,
                        Deno.lstat(pathToAbsoluteFileUrl("README.md"))
                    ];
                case 2:
                    packageInfoByUrl = _state.sent();
                    assert(packageInfoByUrl.isFile);
                    assert(!packageInfoByUrl.isSymlink);
                    return [
                        4,
                        Deno.lstat("cli/tests/symlink_to_subdir")
                    ];
                case 3:
                    modulesInfo = _state.sent();
                    assert(!modulesInfo.isDirectory);
                    assert(modulesInfo.isSymlink);
                    return [
                        4,
                        Deno.lstat(pathToAbsoluteFileUrl("cli/tests/symlink_to_subdir"))
                    ];
                case 4:
                    modulesInfoByUrl = _state.sent();
                    assert(!modulesInfoByUrl.isDirectory);
                    assert(modulesInfoByUrl.isSymlink);
                    return [
                        4,
                        Deno.lstat("core")
                    ];
                case 5:
                    coreInfo = _state.sent();
                    assert(coreInfo.isDirectory);
                    assert(!coreInfo.isSymlink);
                    return [
                        4,
                        Deno.lstat(pathToAbsoluteFileUrl("core"))
                    ];
                case 6:
                    coreInfoByUrl = _state.sent();
                    assert(coreInfoByUrl.isDirectory);
                    assert(!coreInfoByUrl.isSymlink);
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        read: false
    }
}, function lstatPerm() {
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
                                                Deno.lstat("README.md")
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
        read: true
    }
}, function lstatNotFound() {
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
                                                Deno.lstat("bad_file_name")
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
    ignore: Deno.build.os !== "windows",
    perms: {
        read: true,
        write: true
    }
}, function statNoUnixFields() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var tempDir = Deno.makeTempDirSync();
    var filename = tempDir + "/test.txt";
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
    var s = Deno.statSync(filename);
    assert(s.dev === null);
    assert(s.ino === null);
    assert(s.mode === null);
    assert(s.nlink === null);
    assert(s.uid === null);
    assert(s.gid === null);
    assert(s.rdev === null);
    assert(s.blksize === null);
    assert(s.blocks === null);
});
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function statUnixFields() {
    var enc = new TextEncoder();
    var data = enc.encode("Hello");
    var tempDir = Deno.makeTempDirSync();
    var filename = tempDir + "/test.txt";
    var filename2 = tempDir + "/test2.txt";
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
    // Create a link
    Deno.linkSync(filename, filename2);
    var s = Deno.statSync(filename);
    assert(s.dev !== null);
    assert(s.ino !== null);
    assertEquals(s.mode & 438, 438);
    assertEquals(s.nlink, 2);
    assert(s.uid !== null);
    assert(s.gid !== null);
    assert(s.rdev !== null);
    assert(s.blksize !== null);
    assert(s.blocks !== null);
});
