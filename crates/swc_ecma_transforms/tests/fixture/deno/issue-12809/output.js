function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") {
            throw new TypeError("Object expected.");
        }
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) {
                throw new TypeError("Symbol.asyncDispose is not defined.");
            }
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) {
                throw new TypeError("Symbol.dispose is not defined.");
            }
            dispose = value[Symbol.dispose];
            if (async) {
                inner = dispose;
            }
        }
        if (typeof dispose !== "function") {
            throw new TypeError("Object not disposable.");
        }
        if (inner) {
            dispose = function() {
                try {
                    inner.call(this);
                } catch (e) {
                    return Promise.reject(e);
                }
            };
        }
        env.stack.push({
            value: value,
            dispose: dispose,
            async: async
        });
    } else if (async) {
        env.stack.push({
            async: true
        });
    }
    return value;
}
var _SuppressedError1 = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
function _ts_dispose_resources(env) {
    function fail(e) {
        env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
        env.hasError = true;
    }
    var r, s = 0;
    function next() {
        while(r = env.stack.pop()){
            try {
                if (!r.async && s === 1) {
                    return s = 0, env.stack.push(r), Promise.resolve().then(next);
                }
                if (r.dispose) {
                    var result = r.dispose.call(r.value);
                    if (r.async) {
                        return s |= 2, Promise.resolve(result).then(next, function(e) {
                            fail(e);
                            return next();
                        });
                    }
                } else {
                    s |= 1;
                }
            } catch (e) {
                fail(e);
            }
        }
        if (s === 1) {
            return env.hasError ? Promise.reject(env.error) : Promise.resolve();
        }
        if (env.hasError) {
            throw env.error;
        }
    }
    return next();
}
const env = {
    stack: [],
    error: void 0,
    hasError: false
};
try {
    var res = _ts_add_disposable_resource(env, {
        [Symbol.dispose] () {
            console.log(value, all);
        }
    }, false);
    (function(N) {
        function next() {
            return 42;
        }
        N.next = next;
    })(N || (N = {}));
    var value = N.next();
    var E = /*#__PURE__*/ function(E) {
        E[E["A"] = 1] = "A";
        return E;
    }(E || {});
    (function(E) {
        E[E["B"] = 2] = "B";
    })(E);
    var C = class C {
    };
    (function(C) {
        C.x = 3;
    })(C || (C = {}));
    var all = [
        E.A,
        E.B,
        C.x
    ];
    var N, C;
} catch (e) {
    env.error = e;
    env.hasError = true;
} finally{
    _ts_dispose_resources(env);
}
export { N };
export { value };
export { E };
export { C };
export function f() {}
(function(f) {
    f.y = 4;
})(f || (f = {}));
export { all };
