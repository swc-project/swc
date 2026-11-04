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
import { unitTest, assert, assertEquals, assertThrows } from "./test_util.ts";
function assertMissing(path) {
    var caughtErr = false;
    var info;
    try {
        info = Deno.lstatSync(path);
    } catch (e) {
        caughtErr = true;
        assert(_instanceof(e, Deno.errors.NotFound));
    }
    assert(caughtErr);
    assertEquals(info, undefined);
}
function assertFile(path) {
    var info = Deno.lstatSync(path);
    assert(info.isFile);
}
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
}, function renameSyncSuccess() {
    var testDir = Deno.makeTempDirSync();
    var oldpath = testDir + "/oldpath";
    var newpath = testDir + "/newpath";
    Deno.mkdirSync(oldpath);
    Deno.renameSync(oldpath, newpath);
    assertDirectory(newpath);
    assertMissing(oldpath);
});
unitTest({
    perms: {
        read: false,
        write: true
    }
}, function renameSyncReadPerm() {
    assertThrows(function() {
        var oldpath = "/oldbaddir";
        var newpath = "/newbaddir";
        Deno.renameSync(oldpath, newpath);
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: false
    }
}, function renameSyncWritePerm() {
    assertThrows(function() {
        var oldpath = "/oldbaddir";
        var newpath = "/newbaddir";
        Deno.renameSync(oldpath, newpath);
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        read: true,
        write: true
    }
}, function renameSuccess() {
    return _async_to_generator(function() {
        var testDir, oldpath, newpath;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    testDir = Deno.makeTempDirSync();
                    oldpath = testDir + "/oldpath";
                    newpath = testDir + "/newpath";
                    Deno.mkdirSync(oldpath);
                    return [
                        4,
                        Deno.rename(oldpath, newpath)
                    ];
                case 1:
                    _state.sent();
                    assertDirectory(newpath);
                    assertMissing(oldpath);
                    return [
                        2
                    ];
            }
        });
    })();
});
function readFileString(filename) {
    var dataRead = Deno.readFileSync(filename);
    var dec = new TextDecoder("utf-8");
    return dec.decode(dataRead);
}
function writeFileString(filename, s) {
    var enc = new TextEncoder();
    var data = enc.encode(s);
    Deno.writeFileSync(filename, data, {
        mode: 438
    });
}
unitTest({
    ignore: Deno.build.os === "windows",
    perms: {
        read: true,
        write: true
    }
}, function renameSyncErrorsUnix() {
    var testDir = Deno.makeTempDirSync();
    var oldfile = testDir + "/oldfile";
    var olddir = testDir + "/olddir";
    var emptydir = testDir + "/empty";
    var fulldir = testDir + "/dir";
    var file = fulldir + "/file";
    writeFileString(oldfile, "Hello");
    Deno.mkdirSync(olddir);
    Deno.mkdirSync(emptydir);
    Deno.mkdirSync(fulldir);
    writeFileString(file, "world");
    assertThrows(function() {
        Deno.renameSync(oldfile, emptydir);
    }, Error, "Is a directory");
    assertThrows(function() {
        Deno.renameSync(olddir, fulldir);
    }, Error, "Directory not empty");
    assertThrows(function() {
        Deno.renameSync(olddir, file);
    }, Error, "Not a directory");
    var fileLink = testDir + "/fileLink";
    var dirLink = testDir + "/dirLink";
    var danglingLink = testDir + "/danglingLink";
    Deno.symlinkSync(file, fileLink);
    Deno.symlinkSync(emptydir, dirLink);
    Deno.symlinkSync(testDir + "/nonexistent", danglingLink);
    assertThrows(function() {
        Deno.renameSync(olddir, fileLink);
    }, Error, "Not a directory");
    assertThrows(function() {
        Deno.renameSync(olddir, dirLink);
    }, Error, "Not a directory");
    assertThrows(function() {
        Deno.renameSync(olddir, danglingLink);
    }, Error, "Not a directory");
    // should succeed on Unix
    Deno.renameSync(olddir, emptydir);
    Deno.renameSync(oldfile, dirLink);
    Deno.renameSync(dirLink, danglingLink);
    assertFile(danglingLink);
    assertEquals("Hello", readFileString(danglingLink));
});
unitTest({
    ignore: Deno.build.os !== "windows",
    perms: {
        read: true,
        write: true
    }
}, function renameSyncErrorsWin() {
    var testDir = Deno.makeTempDirSync();
    var oldfile = testDir + "/oldfile";
    var olddir = testDir + "/olddir";
    var emptydir = testDir + "/empty";
    var fulldir = testDir + "/dir";
    var file = fulldir + "/file";
    writeFileString(oldfile, "Hello");
    Deno.mkdirSync(olddir);
    Deno.mkdirSync(emptydir);
    Deno.mkdirSync(fulldir);
    writeFileString(file, "world");
    assertThrows(function() {
        Deno.renameSync(oldfile, emptydir);
    }, Deno.errors.PermissionDenied, "Access is denied");
    assertThrows(function() {
        Deno.renameSync(olddir, fulldir);
    }, Deno.errors.PermissionDenied, "Access is denied");
    assertThrows(function() {
        Deno.renameSync(olddir, emptydir);
    }, Deno.errors.PermissionDenied, "Access is denied");
    // should succeed on Windows
    Deno.renameSync(olddir, file);
    assertDirectory(file);
});
