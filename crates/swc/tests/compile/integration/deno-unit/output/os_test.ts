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
import { assert, assertEquals, assertNotEquals, assertThrows, unitTest } from "./test_util.ts";
unitTest({
    perms: {
        env: true
    }
}, function envSuccess() {
    Deno.env.set("TEST_VAR", "A");
    var env = Deno.env.toObject();
    Deno.env.set("TEST_VAR", "B");
    assertEquals(env["TEST_VAR"], "A");
    assertNotEquals(Deno.env.get("TEST_VAR"), env["TEST_VAR"]);
});
unitTest({
    perms: {
        env: true
    }
}, function envNotFound() {
    var r = Deno.env.get("env_var_does_not_exist!");
    assertEquals(r, undefined);
});
unitTest({
    perms: {
        env: true
    }
}, function deleteEnv() {
    Deno.env.set("TEST_VAR", "A");
    assertEquals(Deno.env.get("TEST_VAR"), "A");
    assertEquals(Deno.env.delete("TEST_VAR"), undefined);
    assertEquals(Deno.env.get("TEST_VAR"), undefined);
});
unitTest(function envPermissionDenied1() {
    assertThrows(function() {
        Deno.env.toObject();
    }, Deno.errors.PermissionDenied);
});
unitTest(function envPermissionDenied2() {
    assertThrows(function() {
        Deno.env.get("PATH");
    }, Deno.errors.PermissionDenied);
});
// This test verifies that on Windows, environment variables are
// case-insensitive. Case normalization needs be done using the collation
// that Windows uses, rather than naively using String.toLowerCase().
unitTest({
    ignore: Deno.build.os !== "windows",
    perms: {
        read: true,
        env: true,
        run: true
    }
}, function envCaseInsensitive() {
    return _async_to_generator(function() {
        var checkChildEnv, lc1, uc1, _obj, _obj1, c2, lc2, uc2, _obj2, _obj3, _obj4, _obj5;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    // Utility function that runs a Deno subprocess with the environment
                    // specified in `inputEnv`. The subprocess reads the environment variables
                    // which are in the keys of `expectedEnv` and writes them to stdout as JSON.
                    // It is then verified that these match with the values of `expectedEnv`.
                    checkChildEnv = function checkChildEnv(inputEnv, expectedEnv) {
                        return _async_to_generator(function() {
                            var src, proc, status, expectedValues, actualValues, _, _1, _2;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        src = "\n      console.log(\n        ".concat(JSON.stringify(Object.keys(expectedEnv)), ".map(k => Deno.env.get(k))\n      )");
                                        proc = Deno.run({
                                            cmd: [
                                                Deno.execPath(),
                                                "eval",
                                                src
                                            ],
                                            env: inputEnv,
                                            stdout: "piped"
                                        });
                                        return [
                                            4,
                                            proc.status()
                                        ];
                                    case 1:
                                        status = _state.sent();
                                        assertEquals(status.success, true);
                                        expectedValues = Object.values(expectedEnv);
                                        _ = JSON.parse;
                                        _2 = (_1 = new TextDecoder()).decode;
                                        return [
                                            4,
                                            proc.output()
                                        ];
                                    case 2:
                                        actualValues = _.apply(JSON, [
                                            _2.apply(_1, [
                                                _state.sent()
                                            ])
                                        ]);
                                        assertEquals(actualValues, expectedValues);
                                        proc.close();
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    };
                    assertEquals(Deno.env.get("path"), Deno.env.get("PATH"));
                    assertEquals(Deno.env.get("Path"), Deno.env.get("PATH"));
                    // Check 'foo', 'Foo' and 'Foo' are case folded.
                    return [
                        4,
                        checkChildEnv({
                            foo: "X"
                        }, {
                            foo: "X",
                            Foo: "X",
                            FOO: "X"
                        })
                    ];
                case 1:
                    _state.sent();
                    // Check that 'µ' and 'Μ' are not case folded.
                    lc1 = "µ";
                    uc1 = lc1.toUpperCase();
                    assertNotEquals(lc1, uc1);
                    return [
                        4,
                        checkChildEnv((_obj = {}, _define_property(_obj, lc1, "mu"), _define_property(_obj, uc1, "MU"), _obj), (_obj1 = {}, _define_property(_obj1, lc1, "mu"), _define_property(_obj1, uc1, "MU"), _obj1))
                    ];
                case 2:
                    _state.sent();
                    // Check that 'ǆ' and 'Ǆ' are folded, but 'ǅ' is preserved.
                    c2 = "ǅ";
                    lc2 = c2.toLowerCase();
                    uc2 = c2.toUpperCase();
                    assertNotEquals(c2, lc2);
                    assertNotEquals(c2, uc2);
                    return [
                        4,
                        checkChildEnv((_obj2 = {}, _define_property(_obj2, c2, "Dz"), _define_property(_obj2, lc2, "dz"), _obj2), (_obj3 = {}, _define_property(_obj3, c2, "Dz"), _define_property(_obj3, lc2, "dz"), _define_property(_obj3, uc2, "dz"), _obj3))
                    ];
                case 3:
                    _state.sent();
                    return [
                        4,
                        checkChildEnv((_obj4 = {}, _define_property(_obj4, c2, "Dz"), _define_property(_obj4, uc2, "DZ"), _obj4), (_obj5 = {}, _define_property(_obj5, c2, "Dz"), _define_property(_obj5, uc2, "DZ"), _define_property(_obj5, lc2, "DZ"), _obj5))
                    ];
                case 4:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function osPid() {
    assert(Deno.pid > 0);
});
unitTest({
    perms: {
        read: true
    }
}, function execPath() {
    assertNotEquals(Deno.execPath(), "");
});
unitTest({
    perms: {
        read: false
    }
}, function execPathPerm() {
    assertThrows(function() {
        Deno.execPath();
    }, Deno.errors.PermissionDenied, "read access to <exec_path>, run again with the --allow-read flag");
});
unitTest({
    perms: {
        env: true
    }
}, function loadavgSuccess() {
    var load = Deno.loadavg();
    assertEquals(load.length, 3);
});
unitTest({
    perms: {
        env: false
    }
}, function loadavgPerm() {
    assertThrows(function() {
        Deno.loadavg();
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        env: true
    }
}, function hostnameDir() {
    assertNotEquals(Deno.hostname(), "");
});
unitTest({
    perms: {
        env: false
    }
}, function hostnamePerm() {
    assertThrows(function() {
        Deno.hostname();
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        env: true
    }
}, function releaseDir() {
    assertNotEquals(Deno.osRelease(), "");
});
unitTest({
    perms: {
        env: false
    }
}, function releasePerm() {
    assertThrows(function() {
        Deno.osRelease();
    }, Deno.errors.PermissionDenied);
});
