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
import { assert, assertThrows, assertEquals, assertStringContains, unitTest } from "./test_util.ts";
unitTest(function runPermissions() {
    assertThrows(function() {
        Deno.run({
            cmd: [
                "python",
                "-c",
                "print('hello world')"
            ]
        });
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        run: true
    }
}, function runSuccess() {
    return _async_to_generator(function() {
        var p, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "print('hello world')"
                        ],
                        stdout: "piped",
                        stderr: "null"
                    });
                    return [
                        4,
                        p.status()
                    ];
                case 1:
                    status = _state.sent();
                    assertEquals(status.success, true);
                    assertEquals(status.code, 0);
                    assertEquals(status.signal, undefined);
                    p.stdout.close();
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runStdinRid0() {
    return _async_to_generator(function() {
        var p, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "print('hello world')"
                        ],
                        stdin: 0,
                        stdout: "piped",
                        stderr: "null"
                    });
                    return [
                        4,
                        p.status()
                    ];
                case 1:
                    status = _state.sent();
                    assertEquals(status.success, true);
                    assertEquals(status.code, 0);
                    assertEquals(status.signal, undefined);
                    p.stdout.close();
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runInvalidStdio() {
    assertThrows(function() {
        return Deno.run({
            cmd: [
                "python",
                "-c",
                "print('hello world')"
            ],
            // @ts-expect-error because Deno.run should throw on invalid stdin.
            stdin: "a"
        });
    });
    assertThrows(function() {
        return Deno.run({
            cmd: [
                "python",
                "-c",
                "print('hello world')"
            ],
            // @ts-expect-error because Deno.run should throw on invalid stdout.
            stdout: "b"
        });
    });
    assertThrows(function() {
        return Deno.run({
            cmd: [
                "python",
                "-c",
                "print('hello world')"
            ],
            // @ts-expect-error because Deno.run should throw on invalid stderr.
            stderr: "c"
        });
    });
});
unitTest({
    perms: {
        run: true
    }
}, function runCommandFailedWithCode() {
    return _async_to_generator(function() {
        var p, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys;sys.exit(41 + 1)"
                        ]
                    });
                    return [
                        4,
                        p.status()
                    ];
                case 1:
                    status = _state.sent();
                    assertEquals(status.success, false);
                    assertEquals(status.code, 42);
                    assertEquals(status.signal, undefined);
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    // No signals on windows.
    ignore: Deno.build.os === "windows",
    perms: {
        run: true
    }
}, function runCommandFailedWithSignal() {
    return _async_to_generator(function() {
        var p, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import os;os.kill(os.getpid(), 9)"
                        ]
                    });
                    return [
                        4,
                        p.status()
                    ];
                case 1:
                    status = _state.sent();
                    assertEquals(status.success, false);
                    assertEquals(status.code, 128 + 9);
                    assertEquals(status.signal, 9);
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runNotFound() {
    var error;
    try {
        Deno.run({
            cmd: [
                "this file hopefully doesn't exist"
            ]
        });
    } catch (e) {
        error = e;
    }
    assert(error !== undefined);
    assert(_instanceof(error, Deno.errors.NotFound));
});
unitTest({
    perms: {
        write: true,
        run: true
    }
}, function runWithCwdIsAsync() {
    return _async_to_generator(function() {
        var enc, cwd, exitCodeFile, pyProgramFile, pyProgram, p, code, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    enc = new TextEncoder();
                    return [
                        4,
                        Deno.makeTempDir({
                            prefix: "deno_command_test"
                        })
                    ];
                case 1:
                    cwd = _state.sent();
                    exitCodeFile = "deno_was_here";
                    pyProgramFile = "poll_exit.py";
                    pyProgram = '\nfrom sys import exit\nfrom time import sleep\n\nwhile True:\n  try:\n    with open("'.concat(exitCodeFile, '", "r") as f:\n      line = f.readline()\n    code = int(line)\n    exit(code)\n  except IOError:\n    # Retry if we got here before deno wrote the file.\n    sleep(0.01)\n    pass\n');
                    Deno.writeFileSync("".concat(cwd, "/").concat(pyProgramFile, ".py"), enc.encode(pyProgram));
                    p = Deno.run({
                        cwd: cwd,
                        cmd: [
                            "python",
                            "".concat(pyProgramFile, ".py")
                        ]
                    });
                    // Write the expected exit code *after* starting python.
                    // This is how we verify that `run()` is actually asynchronous.
                    code = 84;
                    Deno.writeFileSync("".concat(cwd, "/").concat(exitCodeFile), enc.encode("".concat(code)));
                    return [
                        4,
                        p.status()
                    ];
                case 2:
                    status = _state.sent();
                    assertEquals(status.success, false);
                    assertEquals(status.code, code);
                    assertEquals(status.signal, undefined);
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runStdinPiped() {
    return _async_to_generator(function() {
        var p, msg, n, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; assert 'hello' == sys.stdin.read();"
                        ],
                        stdin: "piped"
                    });
                    assert(p.stdin);
                    assert(!p.stdout);
                    assert(!p.stderr);
                    msg = new TextEncoder().encode("hello");
                    return [
                        4,
                        p.stdin.write(msg)
                    ];
                case 1:
                    n = _state.sent();
                    assertEquals(n, msg.byteLength);
                    p.stdin.close();
                    return [
                        4,
                        p.status()
                    ];
                case 2:
                    status = _state.sent();
                    assertEquals(status.success, true);
                    assertEquals(status.code, 0);
                    assertEquals(status.signal, undefined);
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runStdoutPiped() {
    return _async_to_generator(function() {
        var p, data, r, s, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; sys.stdout.write('hello')"
                        ],
                        stdout: "piped"
                    });
                    assert(!p.stdin);
                    assert(!p.stderr);
                    data = new Uint8Array(10);
                    return [
                        4,
                        p.stdout.read(data)
                    ];
                case 1:
                    r = _state.sent();
                    if (r === null) {
                        throw new Error("p.stdout.read(...) should not be null");
                    }
                    assertEquals(r, 5);
                    s = new TextDecoder().decode(data.subarray(0, r));
                    assertEquals(s, "hello");
                    return [
                        4,
                        p.stdout.read(data)
                    ];
                case 2:
                    r = _state.sent();
                    assertEquals(r, null);
                    p.stdout.close();
                    return [
                        4,
                        p.status()
                    ];
                case 3:
                    status = _state.sent();
                    assertEquals(status.success, true);
                    assertEquals(status.code, 0);
                    assertEquals(status.signal, undefined);
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runStderrPiped() {
    return _async_to_generator(function() {
        var p, data, r, s, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; sys.stderr.write('hello')"
                        ],
                        stderr: "piped"
                    });
                    assert(!p.stdin);
                    assert(!p.stdout);
                    data = new Uint8Array(10);
                    return [
                        4,
                        p.stderr.read(data)
                    ];
                case 1:
                    r = _state.sent();
                    if (r === null) {
                        throw new Error("p.stderr.read should not return null here");
                    }
                    assertEquals(r, 5);
                    s = new TextDecoder().decode(data.subarray(0, r));
                    assertEquals(s, "hello");
                    return [
                        4,
                        p.stderr.read(data)
                    ];
                case 2:
                    r = _state.sent();
                    assertEquals(r, null);
                    p.stderr.close();
                    return [
                        4,
                        p.status()
                    ];
                case 3:
                    status = _state.sent();
                    assertEquals(status.success, true);
                    assertEquals(status.code, 0);
                    assertEquals(status.signal, undefined);
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runOutput() {
    return _async_to_generator(function() {
        var p, output, s;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; sys.stdout.write('hello')"
                        ],
                        stdout: "piped"
                    });
                    return [
                        4,
                        p.output()
                    ];
                case 1:
                    output = _state.sent();
                    s = new TextDecoder().decode(output);
                    assertEquals(s, "hello");
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runStderrOutput() {
    return _async_to_generator(function() {
        var p, error, s;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; sys.stderr.write('error')"
                        ],
                        stderr: "piped"
                    });
                    return [
                        4,
                        p.stderrOutput()
                    ];
                case 1:
                    error = _state.sent();
                    s = new TextDecoder().decode(error);
                    assertEquals(s, "error");
                    p.close();
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
}, function runRedirectStdoutStderr() {
    return _async_to_generator(function() {
        var tempDir, fileName, file, p, fileContents, decoder, text;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    fileName = tempDir + "/redirected_stdio.txt";
                    return [
                        4,
                        Deno.open(fileName, {
                            create: true,
                            write: true
                        })
                    ];
                case 2:
                    file = _state.sent();
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; sys.stderr.write('error\\n'); sys.stdout.write('output\\n');"
                        ],
                        stdout: file.rid,
                        stderr: file.rid
                    });
                    return [
                        4,
                        p.status()
                    ];
                case 3:
                    _state.sent();
                    p.close();
                    file.close();
                    return [
                        4,
                        Deno.readFile(fileName)
                    ];
                case 4:
                    fileContents = _state.sent();
                    decoder = new TextDecoder();
                    text = decoder.decode(fileContents);
                    assertStringContains(text, "error");
                    assertStringContains(text, "output");
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
}, function runRedirectStdin() {
    return _async_to_generator(function() {
        var tempDir, fileName, encoder, file, p, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        Deno.makeTempDir()
                    ];
                case 1:
                    tempDir = _state.sent();
                    fileName = tempDir + "/redirected_stdio.txt";
                    encoder = new TextEncoder();
                    return [
                        4,
                        Deno.writeFile(fileName, encoder.encode("hello"))
                    ];
                case 2:
                    _state.sent();
                    return [
                        4,
                        Deno.open(fileName)
                    ];
                case 3:
                    file = _state.sent();
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import sys; assert 'hello' == sys.stdin.read();"
                        ],
                        stdin: file.rid
                    });
                    return [
                        4,
                        p.status()
                    ];
                case 4:
                    status = _state.sent();
                    assertEquals(status.code, 0);
                    p.close();
                    file.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runEnv() {
    return _async_to_generator(function() {
        var p, output, s;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "import os, sys; sys.stdout.write(os.environ.get('FOO', '') + os.environ.get('BAR', ''))"
                        ],
                        env: {
                            FOO: "0123",
                            BAR: "4567"
                        },
                        stdout: "piped"
                    });
                    return [
                        4,
                        p.output()
                    ];
                case 1:
                    output = _state.sent();
                    s = new TextDecoder().decode(output);
                    assertEquals(s, "01234567");
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function runClose() {
    return _async_to_generator(function() {
        var p, data, r;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "from time import sleep; import sys; sleep(10000); sys.stderr.write('error')"
                        ],
                        stderr: "piped"
                    });
                    assert(!p.stdin);
                    assert(!p.stdout);
                    p.close();
                    data = new Uint8Array(10);
                    return [
                        4,
                        p.stderr.read(data)
                    ];
                case 1:
                    r = _state.sent();
                    assertEquals(r, null);
                    p.stderr.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function signalNumbers() {
    if (Deno.build.os === "darwin") {
        assertEquals(Deno.Signal.SIGSTOP, 17);
    } else if (Deno.build.os === "linux") {
        assertEquals(Deno.Signal.SIGSTOP, 19);
    }
});
unitTest(function killPermissions() {
    assertThrows(function() {
        // Unlike the other test cases, we don't have permission to spawn a
        // subprocess we can safely kill. Instead we send SIGCONT to the current
        // process - assuming that Deno does not have a special handler set for it
        // and will just continue even if a signal is erroneously sent.
        Deno.kill(Deno.pid, Deno.Signal.SIGCONT);
    }, Deno.errors.PermissionDenied);
});
unitTest({
    perms: {
        run: true
    }
}, function killSuccess() {
    return _async_to_generator(function() {
        var p, status;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    p = Deno.run({
                        cmd: [
                            "python",
                            "-c",
                            "from time import sleep; sleep(10000)"
                        ]
                    });
                    assertEquals(Deno.Signal.SIGINT, 2);
                    Deno.kill(p.pid, Deno.Signal.SIGINT);
                    return [
                        4,
                        p.status()
                    ];
                case 1:
                    status = _state.sent();
                    assertEquals(status.success, false);
                    try {
                        assertEquals(status.code, 128 + Deno.Signal.SIGINT);
                        assertEquals(status.signal, Deno.Signal.SIGINT);
                    } catch (unused) {
                        // TODO(nayeemrmn): On Windows sometimes the following values are given
                        // instead. Investigate and remove this catch when fixed.
                        assertEquals(status.code, 1);
                        assertEquals(status.signal, undefined);
                    }
                    p.close();
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest({
    perms: {
        run: true
    }
}, function killFailed() {
    var p = Deno.run({
        cmd: [
            "python",
            "-c",
            "from time import sleep; sleep(10000)"
        ]
    });
    assert(!p.stdin);
    assert(!p.stdout);
    assertThrows(function() {
        Deno.kill(p.pid, 12345);
    }, TypeError);
    p.close();
});
