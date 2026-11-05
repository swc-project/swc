function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) {
        return Array.from(iter);
    }
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
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
import { assert, assertEquals } from "../../../std/testing/asserts.ts";
import * as colors from "../../../std/fmt/colors.ts";
export { colors };
import { resolve } from "../../../std/path/mod.ts";
export { assert, assertThrows, assertThrowsAsync, assertEquals, assertMatch, assertNotEquals, assertStrictEquals, assertStringContains, unreachable, fail } from "../../../std/testing/asserts.ts";
export { readLines } from "../../../std/io/bufio.ts";
export { parse as parseArgs } from "../../../std/flags/mod.ts";
export function fmtPerms(perms) {
    var p = Object.keys(perms).filter(function(e) {
        return perms[e] === true;
    }).map(function(key) {
        return "--allow-".concat(key);
    });
    if (p.length) {
        return p.join(" ");
    }
    return "<no permissions>";
}
var isGranted = function isGranted(name) {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.permissions.query({
                            name: name
                        })
                    ];
                case 1:
                    return [
                        2,
                        _state.sent().state === "granted"
                    ];
            }
        });
    })();
};
export function getProcessPermissions() {
    return _async_to_generator(function() {
        var _tmp;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _tmp = {};
                    return [
                        4,
                        isGranted("run")
                    ];
                case 1:
                    _tmp.run = _state.sent();
                    return [
                        4,
                        isGranted("read")
                    ];
                case 2:
                    _tmp.read = _state.sent();
                    return [
                        4,
                        isGranted("write")
                    ];
                case 3:
                    _tmp.write = _state.sent();
                    return [
                        4,
                        isGranted("net")
                    ];
                case 4:
                    _tmp.net = _state.sent();
                    return [
                        4,
                        isGranted("env")
                    ];
                case 5:
                    _tmp.env = _state.sent();
                    return [
                        4,
                        isGranted("plugin")
                    ];
                case 6:
                    _tmp.plugin = _state.sent();
                    return [
                        4,
                        isGranted("hrtime")
                    ];
                case 7:
                    return [
                        2,
                        (_tmp.hrtime = _state.sent(), _tmp)
                    ];
            }
        });
    })();
}
export function permissionsMatch(processPerms, requiredPerms) {
    for(var permName in processPerms){
        if (processPerms[permName] !== requiredPerms[permName]) {
            return false;
        }
    }
    return true;
}
export var permissionCombinations = new Map();
function permToString(perms) {
    var r = perms.read ? 1 : 0;
    var w = perms.write ? 1 : 0;
    var n = perms.net ? 1 : 0;
    var e = perms.env ? 1 : 0;
    var u = perms.run ? 1 : 0;
    var p = perms.plugin ? 1 : 0;
    var h = perms.hrtime ? 1 : 0;
    return "permR".concat(r, "W").concat(w, "N").concat(n, "E").concat(e, "U").concat(u, "P").concat(p, "H").concat(h);
}
function registerPermCombination(perms) {
    var key = permToString(perms);
    if (!permissionCombinations.has(key)) {
        permissionCombinations.set(key, perms);
    }
}
export function registerUnitTests() {
    return _async_to_generator(function() {
        var processPerms, onlyTests, unitTests, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, unitTestDefinition;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        getProcessPermissions()
                    ];
                case 1:
                    processPerms = _state.sent();
                    onlyTests = REGISTERED_UNIT_TESTS.filter(function(param) {
                        var only = param.only;
                        return only;
                    });
                    unitTests = onlyTests.length > 0 ? onlyTests : REGISTERED_UNIT_TESTS;
                    _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        for(_iterator = unitTests[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            unitTestDefinition = _step.value;
                            if (!permissionsMatch(processPerms, unitTestDefinition.perms)) {
                                continue;
                            }
                            Deno.test(unitTestDefinition);
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
                    return [
                        2
                    ];
            }
        });
    })();
}
function normalizeTestPermissions(perms) {
    return {
        read: !!perms.read,
        write: !!perms.write,
        net: !!perms.net,
        run: !!perms.run,
        env: !!perms.env,
        plugin: !!perms.plugin,
        hrtime: !!perms.hrtime
    };
}
export var REGISTERED_UNIT_TESTS = [];
export function unitTest(optionsOrFn, maybeFn) {
    assert(optionsOrFn, "At least one argument is required");
    var options;
    var name;
    var fn;
    if (typeof optionsOrFn === "function") {
        options = {};
        fn = optionsOrFn;
        name = fn.name;
        assert(name, "Missing test function name");
    } else {
        options = optionsOrFn;
        assert(maybeFn, "Missing test function definition");
        assert(typeof maybeFn === "function", "Second argument should be test function definition");
        fn = maybeFn;
        name = fn.name;
        assert(name, "Missing test function name");
    }
    var normalizedPerms = normalizeTestPermissions(options.perms || {});
    registerPermCombination(normalizedPerms);
    var unitTestDefinition = {
        name: name,
        fn: fn,
        ignore: !!options.ignore,
        only: !!options.only,
        perms: normalizedPerms
    };
    REGISTERED_UNIT_TESTS.push(unitTestDefinition);
}
export function createResolvable() {
    var methods;
    var promise = new Promise(function(resolve, reject) {
        methods = {
            resolve: resolve,
            reject: reject
        };
    });
    // TypeScript doesn't know that the Promise callback occurs synchronously
    // therefore use of not null assertion (`!`)
    return Object.assign(promise, methods);
}
var encoder = new TextEncoder();
// Replace functions with null, errors with their stack strings, and JSONify.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeTestMessage(message) {
    var _message_testEnd_error;
    return JSON.stringify({
        start: message.start && _object_spread_props(_object_spread({}, message.start), {
            tests: message.start.tests.map(function(test) {
                return _object_spread_props(_object_spread({}, test), {
                    fn: null
                });
            })
        }),
        testStart: message.testStart && _object_spread_props(_object_spread({}, message.testStart), {
            fn: null
        }),
        testEnd: message.testEnd && _object_spread_props(_object_spread({}, message.testEnd), {
            error: String((_message_testEnd_error = message.testEnd.error) === null || _message_testEnd_error === void 0 ? void 0 : _message_testEnd_error.stack)
        }),
        end: message.end && _object_spread_props(_object_spread({}, message.end), {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            results: message.end.results.map(function(result) {
                var _result_error;
                return _object_spread_props(_object_spread({}, result), {
                    error: (_result_error = result.error) === null || _result_error === void 0 ? void 0 : _result_error.stack
                });
            })
        })
    });
}
export function reportToConn(conn, // eslint-disable-next-line @typescript-eslint/no-explicit-any
message) {
    return _async_to_generator(function() {
        var line, encodedMsg;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    line = serializeTestMessage(message);
                    encodedMsg = encoder.encode(line + (message.end == null ? "\n" : ""));
                    return [
                        4,
                        Deno.writeAll(conn, encodedMsg)
                    ];
                case 1:
                    _state.sent();
                    if (message.end != null) {
                        conn.closeWrite();
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
unitTest(function permissionsMatches() {
    assert(permissionsMatch({
        read: true,
        write: false,
        net: false,
        env: false,
        run: false,
        plugin: false,
        hrtime: false
    }, normalizeTestPermissions({
        read: true
    })));
    assert(permissionsMatch({
        read: false,
        write: false,
        net: false,
        env: false,
        run: false,
        plugin: false,
        hrtime: false
    }, normalizeTestPermissions({})));
    assertEquals(permissionsMatch({
        read: false,
        write: true,
        net: true,
        env: true,
        run: true,
        plugin: true,
        hrtime: true
    }, normalizeTestPermissions({
        read: true
    })), false);
    assertEquals(permissionsMatch({
        read: true,
        write: false,
        net: true,
        env: false,
        run: false,
        plugin: false,
        hrtime: false
    }, normalizeTestPermissions({
        read: true
    })), false);
    assert(permissionsMatch({
        read: true,
        write: true,
        net: true,
        env: true,
        run: true,
        plugin: true,
        hrtime: true
    }, {
        read: true,
        write: true,
        net: true,
        env: true,
        run: true,
        plugin: true,
        hrtime: true
    }));
});
/*
 * Ensure all unit test files (e.g. xxx_test.ts) are present as imports in
 * cli/tests/unit/unit_tests.ts as it is easy to miss this out
 */ unitTest({
    perms: {
        read: true
    }
}, function assertAllUnitTestFilesImported() {
    var directoryTestFiles = _to_consumable_array(Deno.readDirSync("./cli/tests/unit/")).map(function(k) {
        return k.name;
    }).filter(function(file) {
        return file.endsWith(".ts") && !file.endsWith("unit_tests.ts") && !file.endsWith("test_util.ts") && !file.endsWith("unit_test_runner.ts");
    });
    var unitTestsFile = Deno.readFileSync("./cli/tests/unit/unit_tests.ts");
    var importLines = new TextDecoder("utf-8").decode(unitTestsFile).split("\n").filter(function(line) {
        return line.startsWith("import");
    });
    var importedTestFiles = importLines.map(function(relativeFilePath) {
        return relativeFilePath.match(/\/([^\/]+)";/)[1];
    });
    directoryTestFiles.forEach(function(dirFile) {
        if (!importedTestFiles.includes(dirFile)) {
            throw new Error("cil/tests/unit/unit_tests.ts is missing import of test file: cli/js/" + dirFile);
        }
    });
});
export function pathToAbsoluteFileUrl(path) {
    path = resolve(path);
    return new URL("file://".concat(Deno.build.os === "windows" ? "/" : "").concat(path));
}
