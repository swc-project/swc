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
// chown on Windows is noop for now, so ignore its testing on Windows
if (Deno.build.os !== "windows") {
    var getUidAndGid = function getUidAndGid() {
        return _async_to_generator(function() {
            var uidProc, gidProc, uid, _, _1, gid, _2, _3;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        // get the user ID and group ID of the current process
                        uidProc = Deno.run({
                            stdout: "piped",
                            cmd: [
                                "python",
                                "-c",
                                "import os; print(os.getuid())"
                            ]
                        });
                        gidProc = Deno.run({
                            stdout: "piped",
                            cmd: [
                                "python",
                                "-c",
                                "import os; print(os.getgid())"
                            ]
                        });
                        return [
                            4,
                            uidProc.status()
                        ];
                    case 1:
                        assertEquals.apply(void 0, [
                            _state.sent().code,
                            0
                        ]);
                        return [
                            4,
                            gidProc.status()
                        ];
                    case 2:
                        assertEquals.apply(void 0, [
                            _state.sent().code,
                            0
                        ]);
                        _1 = (_ = new TextDecoder("utf-8")).decode;
                        return [
                            4,
                            uidProc.output()
                        ];
                    case 3:
                        uid = parseInt.apply(void 0, [
                            _1.apply(_, [
                                _state.sent()
                            ])
                        ]);
                        uidProc.close();
                        _3 = (_2 = new TextDecoder("utf-8")).decode;
                        return [
                            4,
                            gidProc.output()
                        ];
                    case 4:
                        gid = parseInt.apply(void 0, [
                            _3.apply(_2, [
                                _state.sent()
                            ])
                        ]);
                        gidProc.close();
                        return [
                            2,
                            {
                                uid: uid,
                                gid: gid
                            }
                        ];
                }
            });
        })();
    };
    unitTest(function chownNoWritePermission() {
        return _async_to_generator(function() {
            var filePath, e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        filePath = "chown_test_file.txt";
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            Deno.chown(filePath, 1000, 1000)
                        ];
                    case 2:
                        _state.sent();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        e = _state.sent();
                        assert(_instanceof(e, Deno.errors.PermissionDenied));
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    });
    unitTest({
        perms: {
            run: true,
            write: true
        }
    }, function chownSyncFileNotExist() {
        return _async_to_generator(function() {
            var _ref, uid, gid, filePath;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            getUidAndGid()
                        ];
                    case 1:
                        _ref = _state.sent(), uid = _ref.uid, gid = _ref.gid;
                        filePath = Deno.makeTempDirSync() + "/chown_test_file.txt";
                        try {
                            Deno.chownSync(filePath, uid, gid);
                        } catch (e) {
                            assert(_instanceof(e, Deno.errors.NotFound));
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
            run: true,
            write: true
        }
    }, function chownFileNotExist() {
        return _async_to_generator(function() {
            var _ref, uid, gid, filePath, e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            getUidAndGid()
                        ];
                    case 1:
                        _ref = _state.sent(), uid = _ref.uid, gid = _ref.gid;
                        return [
                            4,
                            Deno.makeTempDir()
                        ];
                    case 2:
                        filePath = _state.sent() + "/chown_test_file.txt";
                        _state.label = 3;
                    case 3:
                        _state.trys.push([
                            3,
                            5,
                            ,
                            6
                        ]);
                        return [
                            4,
                            Deno.chown(filePath, uid, gid)
                        ];
                    case 4:
                        _state.sent();
                        return [
                            3,
                            6
                        ];
                    case 5:
                        e = _state.sent();
                        assert(_instanceof(e, Deno.errors.NotFound));
                        return [
                            3,
                            6
                        ];
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
            write: true
        }
    }, function chownSyncPermissionDenied() {
        var enc = new TextEncoder();
        var dirPath = Deno.makeTempDirSync();
        var filePath = dirPath + "/chown_test_file.txt";
        var fileData = enc.encode("Hello");
        Deno.writeFileSync(filePath, fileData);
        try {
            // try changing the file's owner to root
            Deno.chownSync(filePath, 0, 0);
        } catch (e) {
            assert(_instanceof(e, Deno.errors.PermissionDenied));
        }
        Deno.removeSync(dirPath, {
            recursive: true
        });
    });
    unitTest({
        perms: {
            write: true
        }
    }, function chownPermissionDenied() {
        return _async_to_generator(function() {
            var enc, dirPath, filePath, fileData, e;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        enc = new TextEncoder();
                        return [
                            4,
                            Deno.makeTempDir()
                        ];
                    case 1:
                        dirPath = _state.sent();
                        filePath = dirPath + "/chown_test_file.txt";
                        fileData = enc.encode("Hello");
                        return [
                            4,
                            Deno.writeFile(filePath, fileData)
                        ];
                    case 2:
                        _state.sent();
                        _state.label = 3;
                    case 3:
                        _state.trys.push([
                            3,
                            5,
                            ,
                            6
                        ]);
                        // try changing the file's owner to root
                        return [
                            4,
                            Deno.chown(filePath, 0, 0)
                        ];
                    case 4:
                        _state.sent();
                        return [
                            3,
                            6
                        ];
                    case 5:
                        e = _state.sent();
                        assert(_instanceof(e, Deno.errors.PermissionDenied));
                        return [
                            3,
                            6
                        ];
                    case 6:
                        return [
                            4,
                            Deno.remove(dirPath, {
                                recursive: true
                            })
                        ];
                    case 7:
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
            run: true,
            write: true
        }
    }, function chownSyncSucceed() {
        return _async_to_generator(function() {
            var _ref, uid, gid, enc, dirPath, filePath, fileData;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            getUidAndGid()
                        ];
                    case 1:
                        _ref = _state.sent(), uid = _ref.uid, gid = _ref.gid;
                        enc = new TextEncoder();
                        dirPath = Deno.makeTempDirSync();
                        filePath = dirPath + "/chown_test_file.txt";
                        fileData = enc.encode("Hello");
                        Deno.writeFileSync(filePath, fileData);
                        // the test script creates this file with the same uid and gid,
                        // here chown is a noop so it succeeds under non-privileged user
                        Deno.chownSync(filePath, uid, gid);
                        Deno.removeSync(dirPath, {
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
            run: true,
            write: true
        }
    }, function chownSyncWithUrl() {
        return _async_to_generator(function() {
            var _ref, uid, gid, enc, dirPath, fileUrl, fileData;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            getUidAndGid()
                        ];
                    case 1:
                        _ref = _state.sent(), uid = _ref.uid, gid = _ref.gid;
                        enc = new TextEncoder();
                        dirPath = Deno.makeTempDirSync();
                        fileUrl = new URL("file://".concat(dirPath, "/chown_test_file.txt"));
                        fileData = enc.encode("Hello");
                        Deno.writeFileSync(fileUrl, fileData);
                        // the test script creates this file with the same uid and gid,
                        // here chown is a noop so it succeeds under non-privileged user
                        Deno.chownSync(fileUrl, uid, gid);
                        Deno.removeSync(dirPath, {
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
            run: true,
            write: true
        }
    }, function chownSucceed() {
        return _async_to_generator(function() {
            var _ref, uid, gid, enc, dirPath, filePath, fileData;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            getUidAndGid()
                        ];
                    case 1:
                        _ref = _state.sent(), uid = _ref.uid, gid = _ref.gid;
                        enc = new TextEncoder();
                        return [
                            4,
                            Deno.makeTempDir()
                        ];
                    case 2:
                        dirPath = _state.sent();
                        filePath = dirPath + "/chown_test_file.txt";
                        fileData = enc.encode("Hello");
                        return [
                            4,
                            Deno.writeFile(filePath, fileData)
                        ];
                    case 3:
                        _state.sent();
                        // the test script creates this file with the same uid and gid,
                        // here chown is a noop so it succeeds under non-privileged user
                        return [
                            4,
                            Deno.chown(filePath, uid, gid)
                        ];
                    case 4:
                        _state.sent();
                        Deno.removeSync(dirPath, {
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
            run: true,
            write: true
        }
    }, function chownWithUrl() {
        return _async_to_generator(function() {
            var _ref, uid, gid, enc, dirPath, fileUrl, fileData;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            getUidAndGid()
                        ];
                    case 1:
                        _ref = _state.sent(), uid = _ref.uid, gid = _ref.gid;
                        enc = new TextEncoder();
                        return [
                            4,
                            Deno.makeTempDir()
                        ];
                    case 2:
                        dirPath = _state.sent();
                        fileUrl = new URL("file://".concat(dirPath, "/chown_test_file.txt"));
                        fileData = enc.encode("Hello");
                        return [
                            4,
                            Deno.writeFile(fileUrl, fileData)
                        ];
                    case 3:
                        _state.sent();
                        // the test script creates this file with the same uid and gid,
                        // here chown is a noop so it succeeds under non-privileged user
                        return [
                            4,
                            Deno.chown(fileUrl, uid, gid)
                        ];
                    case 4:
                        _state.sent();
                        Deno.removeSync(dirPath, {
                            recursive: true
                        });
                        return [
                            2
                        ];
                }
            });
        })();
    });
}
