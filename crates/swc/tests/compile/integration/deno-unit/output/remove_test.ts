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
function _ts_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) {
        return m.call(o);
    }
    if (o && typeof o.length === "number") {
        return {
            next: function() {
                if (o && i >= o.length) {
                    o = void 0;
                }
                return {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertThrows, assertThrowsAsync } from "./test_util.ts";
var REMOVE_METHODS = [
    "remove",
    "removeSync"
];
unitTest({
    perms: {
        write: true,
        read: true
    }
}, function removeDirSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, path, pathInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // REMOVE EMPTY DIRECTORY
                                    path = Deno.makeTempDirSync() + "/subdir";
                                    Deno.mkdirSync(path);
                                    pathInfo = Deno.statSync(path);
                                    assert(pathInfo.isDirectory); // check exist first
                                    return [
                                        4,
                                        Deno[method](path)
                                    ];
                                case 1:
                                    _state.sent(); // remove
                                    // We then check again after remove
                                    assertThrows(function() {
                                        Deno.statSync(path);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeFileSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, enc, data, filename, fileInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // REMOVE FILE
                                    enc = new TextEncoder();
                                    data = enc.encode("Hello");
                                    filename = Deno.makeTempDirSync() + "/test.txt";
                                    Deno.writeFileSync(filename, data, {
                                        mode: 438
                                    });
                                    fileInfo = Deno.statSync(filename);
                                    assert(fileInfo.isFile); // check exist first
                                    return [
                                        4,
                                        Deno[method](filename)
                                    ];
                                case 1:
                                    _state.sent(); // remove
                                    // We then check again after remove
                                    assertThrows(function() {
                                        Deno.statSync(filename);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeFileByUrl() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, enc, data, tempDir, fileUrl, fileInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // REMOVE FILE
                                    enc = new TextEncoder();
                                    data = enc.encode("Hello");
                                    tempDir = Deno.makeTempDirSync();
                                    fileUrl = new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(tempDir, "/test.txt"));
                                    Deno.writeFileSync(fileUrl, data, {
                                        mode: 438
                                    });
                                    fileInfo = Deno.statSync(fileUrl);
                                    assert(fileInfo.isFile); // check exist first
                                    return [
                                        4,
                                        Deno[method](fileUrl)
                                    ];
                                case 1:
                                    _state.sent(); // remove
                                    // We then check again after remove
                                    assertThrows(function() {
                                        Deno.statSync(fileUrl);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeFail() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, path, subPath, pathInfo, subPathInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // NON-EMPTY DIRECTORY
                                    path = Deno.makeTempDirSync() + "/dir/subdir";
                                    subPath = path + "/subsubdir";
                                    Deno.mkdirSync(path, {
                                        recursive: true
                                    });
                                    Deno.mkdirSync(subPath);
                                    pathInfo = Deno.statSync(path);
                                    assert(pathInfo.isDirectory); // check exist first
                                    subPathInfo = Deno.statSync(subPath);
                                    assert(subPathInfo.isDirectory); // check exist first
                                    return [
                                        4,
                                        assertThrowsAsync(function() {
                                            return _async_to_generator(function() {
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            return [
                                                                4,
                                                                Deno[method](path)
                                                            ];
                                                        case 1:
                                                            _state.sent();
                                                            return [
                                                                2
                                                            ];
                                                    }
                                                });
                                            })();
                                        }, Error)
                                    ];
                                case 1:
                                    _state.sent();
                                    // TODO(ry) Is Other really the error we should get here? What would Go do?
                                    // NON-EXISTENT DIRECTORY/FILE
                                    return [
                                        4,
                                        assertThrowsAsync(function() {
                                            return _async_to_generator(function() {
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            return [
                                                                4,
                                                                Deno[method]("/baddir")
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
                                case 2:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeDanglingSymlinkSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, danglingSymlinkPath, pathInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    danglingSymlinkPath = Deno.makeTempDirSync() + "/dangling_symlink";
                                    if (Deno.build.os === "windows") {
                                        Deno.symlinkSync("unexistent_file", danglingSymlinkPath, {
                                            type: "file"
                                        });
                                    } else {
                                        Deno.symlinkSync("unexistent_file", danglingSymlinkPath);
                                    }
                                    pathInfo = Deno.lstatSync(danglingSymlinkPath);
                                    assert(pathInfo.isSymlink);
                                    return [
                                        4,
                                        Deno[method](danglingSymlinkPath)
                                    ];
                                case 1:
                                    _state.sent();
                                    assertThrows(function() {
                                        Deno.lstatSync(danglingSymlinkPath);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeValidSymlinkSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, encoder, data, tempDir, filePath, validSymlinkPath, symlinkPathInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    encoder = new TextEncoder();
                                    data = encoder.encode("Test");
                                    tempDir = Deno.makeTempDirSync();
                                    filePath = tempDir + "/test.txt";
                                    validSymlinkPath = tempDir + "/valid_symlink";
                                    Deno.writeFileSync(filePath, data, {
                                        mode: 438
                                    });
                                    if (Deno.build.os === "windows") {
                                        Deno.symlinkSync(filePath, validSymlinkPath, {
                                            type: "file"
                                        });
                                    } else {
                                        Deno.symlinkSync(filePath, validSymlinkPath);
                                    }
                                    symlinkPathInfo = Deno.statSync(validSymlinkPath);
                                    assert(symlinkPathInfo.isFile);
                                    return [
                                        4,
                                        Deno[method](validSymlinkPath)
                                    ];
                                case 1:
                                    _state.sent();
                                    assertThrows(function() {
                                        Deno.statSync(validSymlinkPath);
                                    }, Deno.errors.NotFound);
                                    return [
                                        4,
                                        Deno[method](filePath)
                                    ];
                                case 2:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: false
    }
}, function removePerm() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    return [
                                        4,
                                        assertThrowsAsync(function() {
                                            return _async_to_generator(function() {
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            return [
                                                                4,
                                                                Deno[method]("/baddir")
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
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeAllDirSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, path, pathInfo, subPath, subPathInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // REMOVE EMPTY DIRECTORY
                                    path = Deno.makeTempDirSync() + "/dir/subdir";
                                    Deno.mkdirSync(path, {
                                        recursive: true
                                    });
                                    pathInfo = Deno.statSync(path);
                                    assert(pathInfo.isDirectory); // check exist first
                                    return [
                                        4,
                                        Deno[method](path, {
                                            recursive: true
                                        })
                                    ];
                                case 1:
                                    _state.sent(); // remove
                                    // We then check again after remove
                                    assertThrows(function() {
                                        Deno.statSync(path);
                                    }, Deno.errors.NotFound);
                                    // REMOVE NON-EMPTY DIRECTORY
                                    path = Deno.makeTempDirSync() + "/dir/subdir";
                                    subPath = path + "/subsubdir";
                                    Deno.mkdirSync(path, {
                                        recursive: true
                                    });
                                    Deno.mkdirSync(subPath);
                                    pathInfo = Deno.statSync(path);
                                    assert(pathInfo.isDirectory); // check exist first
                                    subPathInfo = Deno.statSync(subPath);
                                    assert(subPathInfo.isDirectory); // check exist first
                                    return [
                                        4,
                                        Deno[method](path, {
                                            recursive: true
                                        })
                                    ];
                                case 2:
                                    _state.sent(); // remove
                                    // We then check parent directory again after remove
                                    assertThrows(function() {
                                        Deno.statSync(path);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    // Directory is gone
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true,
        read: true
    }
}, function removeAllFileSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, enc, data, filename, fileInfo;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // REMOVE FILE
                                    enc = new TextEncoder();
                                    data = enc.encode("Hello");
                                    filename = Deno.makeTempDirSync() + "/test.txt";
                                    Deno.writeFileSync(filename, data, {
                                        mode: 438
                                    });
                                    fileInfo = Deno.statSync(filename);
                                    assert(fileInfo.isFile); // check exist first
                                    return [
                                        4,
                                        Deno[method](filename, {
                                            recursive: true
                                        })
                                    ];
                                case 1:
                                    _state.sent(); // remove
                                    // We then check again after remove
                                    assertThrows(function() {
                                        Deno.statSync(filename);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    // File is gone
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: true
    }
}, function removeAllFail() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // NON-EXISTENT DIRECTORY/FILE
                                    return [
                                        4,
                                        assertThrowsAsync(function() {
                                            return _async_to_generator(function() {
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            // Non-existent
                                                            return [
                                                                4,
                                                                Deno[method]("/baddir", {
                                                                    recursive: true
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
                                        }, Deno.errors.NotFound)
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
        write: false
    }
}, function removeAllPerm() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    return [
                                        4,
                                        assertThrowsAsync(function() {
                                            return _async_to_generator(function() {
                                                return _ts_generator(this, function(_state) {
                                                    switch(_state.label){
                                                        case 0:
                                                            return [
                                                                4,
                                                                Deno[method]("/baddir", {
                                                                    recursive: true
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
                                        }, Deno.errors.PermissionDenied)
                                    ];
                                case 1:
                                    _state.sent();
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
    ignore: Deno.build.os === "windows",
    perms: {
        write: true,
        read: true
    }
}, function removeUnixSocketSuccess() {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _loop = function() {
                        var method, path, listener;
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    method = _step.value;
                                    // MAKE TEMPORARY UNIX SOCKET
                                    path = Deno.makeTempDirSync() + "/test.sock";
                                    listener = Deno.listen({
                                        transport: "unix",
                                        path: path
                                    });
                                    listener.close();
                                    Deno.statSync(path); // check if unix socket exists
                                    return [
                                        4,
                                        Deno[method](path)
                                    ];
                                case 1:
                                    _state.sent();
                                    assertThrows(function() {
                                        Deno.statSync(path);
                                    }, Deno.errors.NotFound);
                                    return [
                                        2
                                    ];
                            }
                        });
                    };
                    _iterator = REMOVE_METHODS[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    return [
                        5,
                        _ts_values(_loop())
                    ];
                case 3:
                    _state.sent();
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
if (Deno.build.os === "windows") {
    unitTest({
        perms: {
            run: true,
            write: true,
            read: true
        }
    }, function removeFileSymlink() {
        return _async_to_generator(function() {
            var symlink;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        symlink = Deno.run({
                            cmd: [
                                "cmd",
                                "/c",
                                "mklink",
                                "file_link",
                                "bar"
                            ],
                            stdout: "null"
                        });
                        return [
                            4,
                            symlink.status()
                        ];
                    case 1:
                        assert.apply(void 0, [
                            _state.sent()
                        ]);
                        symlink.close();
                        return [
                            4,
                            Deno.remove("file_link")
                        ];
                    case 2:
                        _state.sent();
                        return [
                            4,
                            assertThrowsAsync(function() {
                                return _async_to_generator(function() {
                                    return _ts_generator(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    Deno.lstat("file_link")
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
                    case 3:
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
            write: true,
            read: true
        }
    }, function removeDirSymlink() {
        return _async_to_generator(function() {
            var symlink;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        symlink = Deno.run({
                            cmd: [
                                "cmd",
                                "/c",
                                "mklink",
                                "/d",
                                "dir_link",
                                "bar"
                            ],
                            stdout: "null"
                        });
                        return [
                            4,
                            symlink.status()
                        ];
                    case 1:
                        assert.apply(void 0, [
                            _state.sent()
                        ]);
                        symlink.close();
                        return [
                            4,
                            Deno.remove("dir_link")
                        ];
                    case 2:
                        _state.sent();
                        return [
                            4,
                            assertThrowsAsync(function() {
                                return _async_to_generator(function() {
                                    return _ts_generator(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                return [
                                                    4,
                                                    Deno.lstat("dir_link")
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
                    case 3:
                        _state.sent();
                        return [
                            2
                        ];
                }
            });
        })();
    });
}
