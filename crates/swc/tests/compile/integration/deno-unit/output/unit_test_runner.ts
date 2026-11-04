#!/usr/bin/env -S deno run --reload --allow-run
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
}
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
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
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import "./unit_tests.ts";
import { REGISTERED_UNIT_TESTS, colors, readLines, permissionCombinations, registerUnitTests, fmtPerms, parseArgs, reportToConn } from "./test_util.ts";
// @ts-expect-error TypeScript (as of 3.7) does not support indexing namespaces by symbol
var internalObj = Deno[Deno.internal];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var reportToConsole = internalObj.reportToConsole;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var runTests = internalObj.runTests;
var PERMISSIONS = [
    "read",
    "write",
    "net",
    "env",
    "run",
    "plugin",
    "hrtime"
];
/**
 * Take a list of permissions and revoke missing permissions.
 */ function dropWorkerPermissions(requiredPermissions) {
    return _async_to_generator(function() {
        var permsToDrop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, perm, err;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    permsToDrop = PERMISSIONS.filter(function(p) {
                        return !requiredPermissions.includes(p);
                    });
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator = permsToDrop[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                        3,
                        5
                    ];
                    perm = _step.value;
                    return [
                        4,
                        Deno.permissions.revoke({
                            name: perm
                        })
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
}
function workerRunnerMain(addrStr, permsStr, filter) {
    return _async_to_generator(function() {
        var _addrStr_split, hostname, port, addr, perms, conn;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _addrStr_split = _sliced_to_array(addrStr.split(":"), 2), hostname = _addrStr_split[0], port = _addrStr_split[1];
                    addr = {
                        hostname: hostname,
                        port: Number(port)
                    };
                    perms = [];
                    if (permsStr.length > 0) {
                        perms = permsStr.split(",");
                    }
                    return [
                        4,
                        Deno.connect(addr)
                    ];
                case 1:
                    conn = _state.sent();
                    // Drop current process permissions to requested set
                    return [
                        4,
                        dropWorkerPermissions(perms)
                    ];
                case 2:
                    _state.sent();
                    // Register unit tests that match process permissions
                    return [
                        4,
                        registerUnitTests()
                    ];
                case 3:
                    _state.sent();
                    // Execute tests
                    return [
                        4,
                        runTests({
                            exitOnFail: false,
                            filter: filter,
                            reportToConsole: false,
                            onMessage: reportToConn.bind(null, conn)
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
function spawnWorkerRunner(verbose, addr, perms, filter) {
    // run subsequent tests using same deno executable
    var permStr = Object.keys(perms).filter(function(permName) {
        return perms[permName] === true;
    }).join(",");
    var cmd = [
        Deno.execPath(),
        "run",
        "--unstable",
        "-A",
        "cli/tests/unit/unit_test_runner.ts",
        "--worker",
        "--addr=".concat(addr),
        "--perms=".concat(permStr)
    ];
    if (filter) {
        cmd.push("--");
        cmd.push(filter);
    }
    var ioMode = verbose ? "inherit" : "null";
    var p = Deno.run({
        cmd: cmd,
        stdin: ioMode,
        stdout: ioMode,
        stderr: ioMode
    });
    return p;
}
function runTestsForPermissionSet(listener, addrStr, verbose, perms, filter) {
    return _async_to_generator(function() {
        var permsFmt, workerProcess, conn, expectedPassedTests, endMessage, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, line, message, err, workerStatus, passed;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    permsFmt = fmtPerms(perms);
                    console.log("Running tests for: ".concat(permsFmt));
                    workerProcess = spawnWorkerRunner(verbose, addrStr, perms, filter);
                    return [
                        4,
                        listener.accept()
                    ];
                case 1:
                    conn = _state.sent();
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        ,
                        15,
                        16
                    ]);
                    _iteratorAbruptCompletion = false, _didIteratorError = false;
                    _state.label = 3;
                case 3:
                    _state.trys.push([
                        3,
                        8,
                        9,
                        14
                    ]);
                    _iterator = _async_iterator(readLines(conn));
                    _state.label = 4;
                case 4:
                    return [
                        4,
                        _iterator.next()
                    ];
                case 5:
                    if (!(_iteratorAbruptCompletion = !(_step = _state.sent()).done)) return [
                        3,
                        7
                    ];
                    _value = _step.value;
                    line = _value;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    message = JSON.parse(line);
                    reportToConsole(message);
                    if (message.start != null) {
                        expectedPassedTests = message.start.tests.length;
                    } else if (message.end != null) {
                        endMessage = message.end;
                    }
                    _state.label = 6;
                case 6:
                    _iteratorAbruptCompletion = false;
                    return [
                        3,
                        4
                    ];
                case 7:
                    return [
                        3,
                        14
                    ];
                case 8:
                    err = _state.sent();
                    _didIteratorError = true;
                    _iteratorError = err;
                    return [
                        3,
                        14
                    ];
                case 9:
                    _state.trys.push([
                        9,
                        ,
                        12,
                        13
                    ]);
                    if (!(_iteratorAbruptCompletion && _iterator.return != null)) return [
                        3,
                        11
                    ];
                    return [
                        4,
                        _iterator.return()
                    ];
                case 10:
                    _state.sent();
                    _state.label = 11;
                case 11:
                    return [
                        3,
                        13
                    ];
                case 12:
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                    return [
                        7
                    ];
                case 13:
                    return [
                        7
                    ];
                case 14:
                    return [
                        3,
                        16
                    ];
                case 15:
                    // Close socket to worker.
                    conn.close();
                    return [
                        7
                    ];
                case 16:
                    if (expectedPassedTests == null) {
                        throw new Error("Worker runner didn't report start");
                    }
                    if (endMessage == null) {
                        throw new Error("Worker runner didn't report end");
                    }
                    return [
                        4,
                        workerProcess.status()
                    ];
                case 17:
                    workerStatus = _state.sent();
                    if (!workerStatus.success) {
                        throw new Error("Worker runner exited with status code: ".concat(workerStatus.code));
                    }
                    workerProcess.close();
                    passed = expectedPassedTests === endMessage.passed + endMessage.ignored;
                    return [
                        2,
                        {
                            perms: perms,
                            passed: passed,
                            permsStr: permsFmt,
                            endMessage: endMessage
                        }
                    ];
            }
        });
    })();
}
function masterRunnerMain(verbose, filter) {
    return _async_to_generator(function() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, perms, testResults, addr, addrStr, listener, _iteratorNormalCompletion1, _didIteratorError1, _iteratorError1, _iterator1, _step1, perms1, result, err, testsPassed, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, testResult, permsStr, endMessage;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    console.log("Discovered permission combinations for tests:", permissionCombinations.size);
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = permissionCombinations.values()[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            perms = _step.value;
                            console.log("\t" + fmtPerms(perms));
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                    testResults = new Set();
                    addr = {
                        hostname: "127.0.0.1",
                        port: 4510
                    };
                    addrStr = "".concat(addr.hostname, ":").concat(addr.port);
                    listener = Deno.listen(addr);
                    _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        6,
                        7,
                        8
                    ]);
                    _iterator1 = permissionCombinations.values()[Symbol.iterator]();
                    _state.label = 2;
                case 2:
                    if (!!(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done)) return [
                        3,
                        5
                    ];
                    perms1 = _step1.value;
                    return [
                        4,
                        runTestsForPermissionSet(listener, addrStr, verbose, perms1, filter)
                    ];
                case 3:
                    result = _state.sent();
                    testResults.add(result);
                    _state.label = 4;
                case 4:
                    _iteratorNormalCompletion1 = true;
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
                    _didIteratorError1 = true;
                    _iteratorError1 = err;
                    return [
                        3,
                        8
                    ];
                case 7:
                    try {
                        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                            _iterator1.return();
                        }
                    } finally{
                        if (_didIteratorError1) {
                            throw _iteratorError1;
                        }
                    }
                    return [
                        7
                    ];
                case 8:
                    // if any run tests returned non-zero status then whole test
                    // run should fail
                    testsPassed = true;
                    _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                    try {
                        for(_iterator2 = testResults[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                            testResult = _step2.value;
                            permsStr = testResult.permsStr, endMessage = testResult.endMessage;
                            console.log("Summary for ".concat(permsStr));
                            reportToConsole({
                                end: endMessage
                            });
                            testsPassed = testsPassed && testResult.passed;
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally{
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                _iterator2.return();
                            }
                        } finally{
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                    if (!testsPassed) {
                        console.error("Unit tests failed");
                        Deno.exit(1);
                    }
                    console.log("Unit tests passed");
                    if (REGISTERED_UNIT_TESTS.find(function(param) {
                        var only = param.only;
                        return only;
                    })) {
                        console.error("\n".concat(colors.red("FAILED"), ' because the "only" option was used'));
                        Deno.exit(1);
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
var HELP = 'Unit test runner\n\nRun tests matching current process permissions:\n\n  deno --allow-write unit_test_runner.ts\n\n  deno --allow-net --allow-hrtime unit_test_runner.ts\n\n  deno --allow-write unit_test_runner.ts -- testWriteFile\n\nRun "master" process that creates "worker" processes\nfor each discovered permission combination:\n\n  deno -A unit_test_runner.ts --master\n\nRun worker process for given permissions:\n\n  deno -A unit_test_runner.ts --worker --perms=net,read,write --addr=127.0.0.1:4500\n\n\nOPTIONS:\n  --master\n    Run in master mode, spawning worker processes for\n    each discovered permission combination\n\n  --worker\n    Run in worker mode, requires "perms" and "addr" flags,\n    should be run with "-A" flag; after setup worker will\n    drop permissions to required set specified in "perms"\n\n  --perms=<perm_name>...\n    Set of permissions this process should run tests with,\n\n  --addr=<addr>\n    Address of TCP socket for reporting\n\nARGS:\n  -- <filter>...\n    Run only tests with names matching filter, must\n    be used after "--"\n';
function assertOrHelp(expr) {
    if (!expr) {
        console.log(HELP);
        Deno.exit(1);
    }
}
function main() {
    return _async_to_generator(function() {
        var args, filter;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    args = parseArgs(Deno.args, {
                        boolean: [
                            "master",
                            "worker",
                            "verbose"
                        ],
                        "--": true
                    });
                    if (args.help) {
                        console.log(HELP);
                        return [
                            2
                        ];
                    }
                    filter = args["--"][0];
                    // Master mode
                    if (args.master) {
                        return [
                            2,
                            masterRunnerMain(args.verbose, filter)
                        ];
                    }
                    // Worker mode
                    if (args.worker) {
                        assertOrHelp(typeof args.addr === "string");
                        assertOrHelp(typeof args.perms === "string");
                        return [
                            2,
                            workerRunnerMain(args.addr, args.perms, filter)
                        ];
                    }
                    // Running tests matching current process permissions
                    return [
                        4,
                        registerUnitTests()
                    ];
                case 1:
                    _state.sent();
                    return [
                        4,
                        runTests({
                            filter: filter
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
main();
