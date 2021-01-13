toplevel_on_loops_1: {
    options = {
        evaluate: true,
        loops: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function bar() {
            console.log("bar:", --x);
        }
        var x = 3;
        do
            bar();
        while (x);
    }
    expect: {
        function bar() {
            console.log("bar:", --x);
        }
        var x = 3;
        do
            bar();
        while (x);
    }
    expect_stdout: true
}

toplevel_off_loops_1: {
    options = {
        evaluate: true,
        loops: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        unused: true,
    }
    input: {
        function bar() {
            console.log("bar:", --x);
        }
        var x = 3;
        do
            bar();
        while (x);
    }
    expect: {
        function bar() {
            console.log("bar:", --x);
        }
        var x = 3;
        do
            bar();
        while (x);
    }
    expect_stdout: true
}

toplevel_on_loops_2: {
    options = {
        evaluate: true,
        loops: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function bar() {
            console.log("bar:");
        }
        var x = 3;
        do
            bar();
        while (x);
    }
    expect: {
        function bar() {
            console.log("bar:");
        }
        for (; ;) bar();
    }
}

toplevel_off_loops_2: {
    options = {
        evaluate: true,
        loops: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        unused: true,
    }
    input: {
        function bar() {
            console.log("bar:");
        }
        var x = 3;
        do
            bar();
        while (x);
    }
    expect: {
        function bar() {
            console.log("bar:");
        }
        var x = 3;
        do
            bar();
        while (x);
    }
}

toplevel_on_loops_3: {
    options = {
        evaluate: true,
        loops: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var x = 3;
        while (x) bar();
    }
    expect: {
        for (; ;) bar();
    }
}

toplevel_off_loops_3: {
    options = {
        evaluate: true,
        loops: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        unused: true,
    }
    input: {
        var x = 3;
        while (x) bar();
    }
    expect: {
        var x = 3;
        for (; x;) bar();
    }
}

defun_reference: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        function f() {
            function g() {
                x();
                return a;
            }
            var a = h();
            var b = 2;
            return a + b;
            function h() {
                y();
                return b;
            }
        }
    }
    expect: {
        function f() {
            function g() {
                x();
                return a;
            }
            var a = h();
            var b = 2;
            return a + 2;
            function h() {
                y();
                return 2;
            }
        }
    }
}

defun_inline_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            return g(2) + h();
            function g(b) {
                return b;
            }
            function h() {
                return h();
            }
        }
    }
    expect: {
        function f() {
            return function (b) {
                return b;
            }(2) + function h() {
                return h();
            }();
        }
    }
}

defun_inline_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            function g(b) {
                return b;
            }
            function h() {
                return h();
            }
            return g(2) + h();
        }
    }
    expect: {
        function f() {
            return function (b) {
                return b;
            }(2) + function h() {
                return h();
            }();
        }
    }
}

defun_inline_3: {
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        function f() {
            return g(2);
            function g(b) {
                return b;
            }
        }
    }
    expect: {
        function f() {
            return 2;
        }
    }
}

defun_call: {
    options = {
        evaluate: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            return g() + h(1) - h(g(), 2, 3);
            function g() {
                return 4;
            }
            function h(a) {
                return a;
            }
        }
    }
    expect: {
        function f() {
            return 1;
        }
    }
}

defun_redefine: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            function g() {
                return 1;
            }
            function h() {
                return 2;
            }
            g = function () {
                return 3;
            };
            return g() + h();
        }
    }
    expect: {
        function f() {
            (function () {
                return 3;
            });
            return 3 + 2;
        }
    }
}

func_inline: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            var g = function () {
                return 1;
            };
            console.log(g() + h());
            var h = function () {
                return 2;
            };
        }
    }
    expect: {
        function f() {
            console.log(1 + h());
            var h = function () {
                return 2;
            };
        }
    }
}

func_modified: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f(a) {
            function a() { return 1; }
            function b() { return 2; }
            function c() { return 3; }
            b.inject = [];
            c = function () { return 4; };
            return a() + b() + c();
        }
    }
    expect: {
        function f(a) {
            function b() {
                return 2;
            }

            b.inject = [];
            (function () {
                return 4;
            });
            return 1 + 2 + 4;
        }
    }
}

unused_modified: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function () {
            var b = 1, c = "FAIL";
            if (0 || b--)
                c = "PASS";
            b = 1;
            return c;
        }());
    }
    expect: {
        console.log(function () {
            var b = 1, c = "FAIL";
            if (0 || b--)
                c = "PASS";
            b = 1;
            return c;
        }());
    }
    expect_stdout: "PASS"
}

defun_label: {
    options = {
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            function f(a) {
                L: {
                    if (a) break L;
                    return 1;
                }
            }
            console.log(f(2));
        }();
    }
    expect: {
        !function () {
            console.log(function (a) {
                L: {
                    if (2) break L;
                    return 1;
                }
            }());
        }();
    }
    expect_stdout: true
}

double_reference: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            var g = function g() {
                g();
            };
            g();
        }
    }
    expect: {
        function f() {
            (function g() {
                g();
            })();
        }
    }
}

iife_eval_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function (x) {
            console.log(x() === eval("x"));
        })(function f() {
            return f;
        });
    }
    expect: {
        (function (x) {
            console.log(x() === eval("x"));
        })(function f() {
            return f;
        });
    }
    expect_stdout: true
}

iife_eval_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            var x = function f() {
                return f;
            };
            console.log(x() === eval("x"));
        })();
    }
    expect: {
        (function () {
            var x = function f() {
                return f;
            };
            console.log(x() === eval("x"));
        })();
    }
    expect_stdout: true
}

iife_func_side_effects: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function x() {
            console.log("x");
        }
        function y() {
            console.log("y");
        }
        function z() {
            console.log("z");
        }
        (function (a, b, c) {
            function y() {
                console.log("FAIL");
            }
            return y + b();
        })(x(), function () {
            return y();
        }, z());
    }
    expect: {
        function x() {
            console.log("x");
        }
        function y() {
            console.log("y");
        }
        function z() {
            console.log("z");
        }
        (function (a, b, c) {
            return function () {
                console.log("FAIL");
            } + b();
        })(x(), function () {
            return y();
        }, z());
    }
    expect_stdout: [
        "x",
        "z",
        "y",
    ]
}

issue_1595_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function f(a) {
            return f(a + 1);
        })(2);
    }
    expect: {
        (function f(a) {
            return f(a + 1);
        })(2);
    }
}

issue_1595_2: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function f(a) {
            return g(a + 1);
        })(2);
    }
    expect: {
        (function (a) {
            return g(a + 1);
        })(2);
    }
}

issue_1595_3: {
    options = {
        evaluate: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function f(a) {
            return g(a + 1);
        })(2);
    }
    expect: {
        (function (a) {
            return g(3);
        })();
    }
}

issue_1595_4: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function iife(a, b, c) {
            console.log(a, b, c);
            if (a) iife(a - 1, b, c);
        })(3, 4, 5);
    }
    expect: {
        (function iife(a, b, c) {
            console.log(a, b, c);
            if (a) iife(a - 1, b, c);
        })(3, 4, 5);
    }
    expect_stdout: true
}

issue_1606: {
    options = {
        evaluate: true,
        hoist_vars: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        function f() {
            var a;
            function g() { };
            var b = 2;
            x(b);
        }
    }
    expect: {
        function f() {
            var a, b;
            function g() { };
            b = 2;
            x(b);
        }
    }
}

issue_1670_1: {
    options = {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        typeofs: true,
        unused: true,
    }
    input: {
        (function f() {
            switch (1) {
                case 0:
                    var a = true;
                    break;
                default:
                    if (typeof a === "undefined") console.log("PASS");
                    else console.log("FAIL");
            }
        })();
    }
    expect: {
        (function () {
            var a;
            void 0 === a ? console.log("PASS") : console.log("FAIL");
        })();
    }
    expect_stdout: "PASS"
}

issue_1670_2: {
    options = {
        conditionals: true,
        dead_code: true,
        evaluate: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
    input: {
        (function f() {
            switch (1) {
                case 0:
                    var a = true;
                    break;
                default:
                    if (typeof a === "undefined") console.log("PASS");
                    else console.log("FAIL");
            }
        })();
    }
    expect: {
        (function () {
            console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}

issue_1670_3: {
    options = {
        comparisons: true,
        conditionals: true,
        dead_code: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        typeofs: true,
        unused: true,
    }
    input: {
        (function f() {
            switch (1) {
                case 0:
                    var a = true;
                    break;
                case 1:
                    if (typeof a === "undefined") console.log("PASS");
                    else console.log("FAIL");
            }
        })();
    }
    expect: {
        (function () {
            var a;
            void 0 === a ? console.log("PASS") : console.log("FAIL");
        })();
    }
    expect_stdout: "PASS"
}

issue_1670_4: {
    options = {
        conditionals: true,
        dead_code: true,
        evaluate: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
    input: {
        (function f() {
            switch (1) {
                case 0:
                    var a = true;
                    break;
                case 1:
                    if (typeof a === "undefined") console.log("PASS");
                    else console.log("FAIL");
            }
        })();
    }
    expect: {
        (function () {
            console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}

issue_1670_5: {
    options = {
        dead_code: true,
        evaluate: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
    input: {
        (function (a) {
            switch (1) {
                case a:
                    console.log(a);
                    break;
                default:
                    console.log(2);
                    break;
            }
        })(1);
    }
    expect: {
        (function () {
            console.log(1);
        })();
    }
    expect_stdout: "1"
}

issue_1670_6: {
    options = {
        dead_code: true,
        evaluate: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        switches: true,
        unused: true,
    }
    input: {
        (function (a) {
            switch (1) {
                case a = 1:
                    console.log(a);
                    break;
                default:
                    console.log(2);
                    break;
            }
        })(1);
    }
    expect: {
        (function (a) {
            switch (1) {
                case a = 1:
                    console.log(a);
                    break;
                default:
                    console.log(2);
            }
        })(1);
    }
    expect_stdout: "1"
}

unary_delete: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var b = 10;
        function f() {
            var a;
            if (delete a) b--;
        }
        f();
        console.log(b);
    }
    expect: {
        var b = 10;
        function f() {
            var a;
            if (delete a) b--;
        }
        f();
        console.log(b);
    }
    expect_stdout: true
}

redefine_arguments_1: {
    options = {
        evaluate: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            var arguments;
            return typeof arguments;
        }
        function g() {
            var arguments = 42;
            return typeof arguments;
        }
        function h(x) {
            var arguments = x;
            return typeof arguments;
        }
        console.log(f(), g(), h());
    }
    expect: {
        function f() {
            var arguments;
            return typeof arguments;
        }
        function g() {
            var arguments = 42;
            return typeof arguments;
        }
        function h(x) {
            var arguments = x;
            return typeof arguments;
        }
        console.log(f(), g(), h());
    }
    expect_stdout: "object number undefined"
}

redefine_arguments_2: {
    options = {
        evaluate: true,
        inline: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            var arguments;
            return typeof arguments;
        }
        function g() {
            var arguments = 42;
            return typeof arguments;
        }
        function h(x) {
            var arguments = x;
            return typeof arguments;
        }
        console.log(f(), g(), h());
    }
    expect: {
        console.log(function () {
            var arguments;
            return typeof arguments;
        }(), function () {
            var arguments = 42;
            return typeof arguments;
        }(), function (x) {
            var arguments = x;
            return typeof arguments;
        }());
    }
    expect_stdout: "object number undefined"
}

redefine_arguments_3: {
    options = {
        evaluate: true,
        inline: true,
        keep_fargs: false,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            var arguments;
            return typeof arguments;
        }
        function g() {
            var arguments = 42;
            return typeof arguments;
        }
        function h(x) {
            var arguments = x;
            return typeof arguments;
        }
        console.log(f(), g(), h());
    }
    expect: {
        console.log(function () {
            var arguments;
            return typeof arguments;
        }(), function () {
            var arguments = 42;
            return typeof arguments;
        }(), function (x) {
            var arguments = x;
            return typeof arguments;
        }());
    }
    expect_stdout: "object number undefined"
}

redefine_farg_1: {
    options = {
        evaluate: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f(a) {
            var a;
            return typeof a;
        }
        function g(a) {
            var a = 42;
            return typeof a;
        }
        function h(a, b) {
            var a = b;
            return typeof a;
        }
        console.log(f([]), g([]), h([]));
    }
    expect: {
        function f(a) {
            return typeof a;
        }
        function g() {
            return "number";
        }
        function h(a, b) {
            a = b;
            return typeof a;
        }
        console.log(f([]), g([]), h([]));
    }
    expect_stdout: "object number undefined"
}

redefine_farg_2: {
    options = {
        evaluate: true,
        inline: true,
        keep_fargs: false,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(a) {
            var a;
            return typeof a;
        }
        function g(a) {
            var a = 42;
            return typeof a;
        }
        function h(a, b) {
            var a = b;
            return typeof a;
        }
        console.log(f([]), g([]), h([]));
    }
    expect: {
        console.log((a = [], typeof a), "number", function (a, b) {
            a = b;
            return typeof a;
        }([]));
        var a;
    }
    expect_stdout: "object number undefined"
}

redefine_farg_3: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        keep_fargs: false,
        passes: 3,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(a) {
            var a;
            return typeof a;
        }
        function g(a) {
            var a = 42;
            return typeof a;
        }
        function h(a, b) {
            var a = b;
            return typeof a;
        }
        console.log(f([]), g([]), h([]));
    }
    expect: {
        console.log(typeof [], "number", "undefined");
    }
    expect_stdout: "object number undefined"
}

delay_def: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            return a;
            var a;
        }
        function g() {
            return a;
            var a = 1;
        }
        console.log(f(), g());
    }
    expect: {
        function f() {
            return;
        }
        function g() {
            return a;
            var a = 1;
        }
        console.log(f(), g());
    }
    expect_stdout: true
}

delay_def_lhs: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        console.log(function () {
            long_name++;
            return long_name;
            var long_name;
        }());
    }
    expect: {
        console.log(function () {
            long_name++;
            return long_name;
            var long_name;
        }());
    }
    expect_stdout: "NaN"
}

booleans: {
    options = {
        booleans: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        console.log(function (a) {
            if (a != 0);
            switch (a) {
                case 0:
                    return "FAIL";
                case false:
                    return "PASS";
            }
        }(false));
    }
    expect: {
        console.log(function (a) {
            if (0);
            switch (a) {
                case 0:
                    return "FAIL";
                case !1:
                    return "PASS";
            }
        }(!1));
    }
    expect_stdout: "PASS"
}

side_effects_assign: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        var a = typeof void (a && a.in == 1, 0);
        console.log(a);
    }
    expect: {
        var a = typeof void (a && a.in);
        console.log(a);
    }
    expect_stdout: "undefined"
}

pure_getters_1: {
    options = {
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
    }
    input: {
        try {
            var a = (a.b, 2);
        } catch (e) { }
        console.log(a);
    }
    expect: {
        try {
            var a = (a.b, 2);
        } catch (e) { }
        console.log(a);
    }
    expect_stdout: "undefined"
}

pure_getters_2: {
    options = {
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        var a = a && a.b;
    }
    expect: {
        var a = a && a.b;
    }
}

pure_getters_3: {
    options = {
        pure_getters: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        var a = a && a.b;
    }
    expect: {
    }
}

catch_var: {
    options = {
        booleans: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        try {
            throw {};
        } catch (e) {
            var e;
            console.log(!!e);
        }
    }
    expect: {
        try {
            throw {};
        } catch (e) {
            var e;
            console.log(!!e);
        }
    }
    expect_stdout: "true"
}

var_assign_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        !function () {
            var a;
            a = 2;
            console.log(a);
        }();
    }
    expect: {
        !function () {
            console.log(2);
        }();
    }
    expect_stdout: "2"
}

var_assign_2: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        !function () {
            var a;
            if (a = 2) console.log(a);
        }();
    }
    expect: {
        !function () {
            if (2) console.log(2);
        }();
    }
    expect_stdout: "2"
}

var_assign_3: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        !function () {
            var a;
            while (a = 2);
            console.log(a);
        }();
    }
    expect: {
        !function () {
            var a;
            while (a = 2);
            console.log(a);
        }();
    }
}

var_assign_4: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        !function a() {
            a = 2;
            console.log(a);
        }();
    }
    expect: {
        !function a() {
            a = 2,
                console.log(a);
        }();
    }
}

var_assign_5: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        !function () {
            var a;
            !function (b) {
                a = 2;
                console.log(a, b);
            }(a);
        }();
    }
    expect: {
        !function () {
            var a;
            !function (b) {
                a = 2,
                    console.log(a, b);
            }(a);
        }();
    }
    expect_stdout: "2 undefined"
}

var_assign_6: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            var a = function () { }(a = 1);
            console.log(a);
        }();
    }
    expect: {
        !function () {
            var a = function () { }(a = 1);
            console.log(a);
        }();
    }
    expect_stdout: "undefined"
}

immutable: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            var a = "test";
            console.log(a.indexOf("e"));
        }();
    }
    expect: {
        !function () {
            console.log("test".indexOf("e"));
        }();
    }
    expect_stdout: "1"
}

issue_1814_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        const a = 42;
        !function () {
            var b = a;
            !function (a) {
                console.log(a++, b);
            }(0);
        }();
    }
    expect: {
        const a = 42;
        !function () {
            !function (a) {
                console.log(a++, 42);
            }(0);
        }();
    }
    expect_stdout: "0 42"
}

issue_1814_2: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        const a = "32";
        !function () {
            var b = a + 1;
            !function (a) {
                console.log(b, a++);
            }(0);
        }();
    }
    expect: {
        const a = "32";
        !function () {
            !function (a) {
                console.log("321", a++);
            }(0);
        }();
    }
    expect_stdout: "321 0"
}

try_abort: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            try {
                var a = 1;
                throw "";
                var b = 2;
            } catch (e) {
            }
            console.log(a, b);
        }();
    }
    expect: {
        !function () {
            try {
                var a = 1;
                throw "";
                var b = 2;
            } catch (e) {
            }
            console.log(a, b);
        }();
    }
    expect_stdout: "1 undefined"
}

boolean_binary_assign: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            var a;
            void 0 && (a = 1);
            console.log(a);
        }();
    }
    expect: {
        !function () {
            var a;
            void 0;
            console.log(a);
        }();
    }
    expect_stdout: "undefined"
}

cond_assign: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            var a;
            void 0 ? (a = 1) : 0;
            console.log(a);
        }();
    }
    expect: {
        !function () {
            var a;
            void 0 ? (a = 1) : 0;
            console.log(a);
        }();
    }
    expect_stdout: "undefined"
}

iife_assign: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            var a = 1, b = 0;
            !function () {
                b++;
                return;
                a = 2;
            }();
            console.log(a);
        }();
    }
    expect: {
        !function () {
            var a = 1, b = 0;
            !function () {
                b++;
                return;
                a = 2;
            }();
            console.log(a);
        }();
    }
    expect_stdout: "1"
}

issue_1850_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        unused: true,
    }
    input: {
        function f() {
            console.log(a, a, a);
        }
        var a = 1;
        f();
    }
    expect: {
        function f() {
            console.log(a, a, a);
        }
        var a = 1;
        f();
    }
    expect_stdout: true
}

issue_1850_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: "funcs",
        unused: true,
    }
    input: {
        function f() {
            console.log(a, a, a);
        }
        var a = 1;
        f();
    }
    expect: {
        var a = 1;
        (function () {
            console.log(a, a, a);
        })();
    }
    expect_stdout: true
}

issue_1850_3: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: "vars",
        unused: true,
    }
    input: {
        function f() {
            console.log(a, a, a);
        }
        var a = 1;
        f();
    }
    expect: {
        function f() {
            console.log(a, a, a);
        }
        var a = 1;
        f();
    }
    expect_stdout: true
}

issue_1850_4: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            console.log(a, a, a);
        }
        var a = 1;
        f();
    }
    expect: {
        var a = 1;
        (function () {
            console.log(a, a, a);
        })();
    }
    expect_stdout: true
}

issue_1865: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unsafe: true,
    }
    input: {
        function f(some) {
            some.thing = false;
        }
        console.log(function () {
            var some = { thing: true };
            f(some);
            return some.thing;
        }());
    }
    expect: {
        function f(some) {
            some.thing = false;
        }
        console.log(function () {
            var some = { thing: true };
            f(some);
            return some.thing;
        }());
    }
    expect_stdout: true
}

issue_1922_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function (a) {
            arguments[0] = 2;
            return a;
        }(1));
    }
    expect: {
        console.log(function (a) {
            arguments[0] = 2;
            return a;
        }(1));
    }
    expect_stdout: "2"
}

issue_1922_2: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function () {
            var a;
            eval("a = 1");
            return a;
        }(1));
    }
    expect: {
        console.log(function () {
            var a;
            eval("a = 1");
            return a;
        }(1));
    }
    expect_stdout: "1"
}

accessor_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var a = 1;
        console.log({
            get a() {
                a = 2;
                return a;
            },
            b: 1
        }.b, a);
    }
    expect: {
        var a = 1;
        console.log({
            get a() {
                a = 2;
                return a;
            },
            b: 1
        }.b, a);
    }
    expect_stdout: "1 1"
}

accessor_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var A = 1;
        var B = {
            get c() {
                console.log(A);
            }
        };
        B.c;
    }
    expect: {
        ({
            get c() {
                console.log(1);
            }
        }).c;
    }
    expect_stdout: "1"
}

method_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var a = 1;
        console.log(new class {
            a() {
                a = 2;
                return a;
            }
        }().a(), a);
    }
    expect: {
        var a = 1;
        console.log(new class {
            a() {
                a = 2;
                return a;
            }
        }().a(), a);
    }
    expect_stdout: "2 2"
}

method_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var A = 1;
        var B = class {
            c() {
                console.log(A);
            }
        };
        new B().c();
    }
    expect: {
        new class {
            c() {
                console.log(1);
            }
        }().c();
    }
    expect_stdout: "1"
}

issue_2090_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        console.log(function () {
            var x = 1;
            [].forEach(() => x = 2);
            return x;
        }());
    }
    expect: {
        console.log(function () {
            var x = 1;
            [].forEach(() => x = 2);
            return x;
        }());
    }
    expect_stdout: "1"
}

issue_2090_2: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        console.log(function () {
            var x = 1;
            [].forEach(() => {
                x = 2;
            });
            return x;
        }());
    }
    expect: {
        console.log(function () {
            var x = 1;
            [].forEach(() => {
                x = 2;
            });
            return x;
        }());
    }
    expect_stdout: "1"
}

for_in_prop: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        var a = {
            foo: function () {
                for (this.b in [1, 2]);
            }
        };
        a.foo();
        console.log(a.b);
    }
    expect: {
        var a = {
            foo: function () {
                for (this.b in [1, 2]);
            }
        };
        a.foo();
        console.log(a.b);
    }
    expect_stdout: "1"
}

obj_var_1: {
    options = {
        evaluate: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var C = 1;
        var obj = {
            bar: function () {
                return C + C;
            }
        };
        console.log(obj.bar());
    }
    expect: {
        console.log({
            bar: function () {
                return 2;
            }
        }.bar());
    }
    expect_stdout: "2"
}

obj_var_2: {
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var C = 1;
        var obj = {
            bar: function () {
                return C + C;
            }
        };
        console.log(obj.bar());
    }
    expect: {
        console.log(2);
    }
    expect_stdout: "2"
}

obj_arg_1: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var C = 1;
        function f(obj) {
            return obj.bar();
        }
        console.log(f({
            bar: function () {
                return C + C;
            }
        }));
    }
    expect: {
        console.log({
            bar: function () {
                return 2;
            }
        }.bar());
    }
    expect_stdout: "2"
}

obj_arg_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 3,
        properties: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var C = 1;
        function f(obj) {
            return obj.bar();
        }
        console.log(f({
            bar: function () {
                return C + C;
            }
        }));
    }
    expect: {
        console.log(2);
    }
    expect_stdout: "2"
}

func_arg_1: {
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = 42;
        !function (a) {
            console.log(a());
        }(function () {
            return a;
        });
    }
    expect: {
        console.log(42);
    }
    expect_stdout: "42"
}

func_arg_2: {
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = 42;
        !function (a) {
            console.log(a());
        }(function (a) {
            return a;
        });
    }
    expect: {
        console.log(void 0);
    }
    expect_stdout: "undefined"
}

regex_loop: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f(x) {
            for (var r, s = "acdabcdeabbb"; r = x().exec(s);)
                console.log(r[0]);
        }
        var a = /ab*/g;
        f(function () {
            return a;
        });
    }
    expect: {
        var a = /ab*/g;
        (function (x) {
            for (var r, s = "acdabcdeabbb"; r = x().exec(s);)
                console.log(r[0]);
        })(function () {
            return a;
        });
    }
    expect_stdout: true
}

obj_for_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = { a: 1 };
        for (var i = o.a--; i; i--)
            console.log(i);
    }
    expect: {
        for (var i = { a: 1 }.a--; i; i--)
            console.log(i);
    }
    expect_stdout: "1"
}

obj_for_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = { a: 1 };
        for (var i; i = o.a--;)
            console.log(i);
    }
    expect: {
        var o = { a: 1 };
        for (var i; i = o.a--;)
            console.log(i);
    }
    expect_stdout: "1"
}

array_forin_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = [1, 2, 3];
        for (var b in a)
            console.log(b);
    }
    expect: {
        for (var b in [1, 2, 3])
            console.log(b);
    }
    expect_stdout: [
        "0",
        "1",
        "2",
    ]
}

array_forin_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = [];
        for (var b in [1, 2, 3])
            a.push(b);
        console.log(a.length);
    }
    expect: {
        var a = [];
        for (var b in [1, 2, 3])
            a.push(b);
        console.log(a.length);
    }
    expect_stdout: "3"
}

array_forof_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = [1, 2, 3];
        for (var b of a)
            console.log(b);
    }
    expect: {
        for (var b of [1, 2, 3])
            console.log(b);
    }
    expect_stdout: [
        "1",
        "2",
        "3",
    ]
}

array_forof_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = [];
        for (var b of [1, 2, 3])
            a.push(b);
        console.log(a.length);
    }
    expect: {
        var a = [];
        for (var b of [1, 2, 3])
            a.push(b);
        console.log(a.length);
    }
    expect_stdout: "3"
}

const_expr_1: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var o = {
            a: 1,
            b: 2
        };
        o.a++;
        console.log(o.a, o.b);
    }
    expect: {
        var o = {
            a: 1,
            b: 2
        };
        o.a++;
        console.log(o.a, o.b);
    }
    expect_stdout: "2 2"
}

const_expr_2: {
    options = {
        evaluate: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        Object.prototype.c = function () {
            this.a++;
        };
        var o = {
            a: 1,
            b: 2
        };
        o.c();
        console.log(o.a, o.b);
    }
    expect: {
        Object.prototype.c = function () {
            this.a++;
        };
        var o = {
            a: 1,
            b: 2
        };
        o.c();
        console.log(o.a, o.b);
    }
    expect_stdout: "2 2"
}

issue_2406_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: false,
        unused: true,
    }
    input: {
        const c = {
            fn: function () {
                return this;
            }
        };
        let l = {
            fn: function () {
                return this;
            }
        };
        var v = {
            fn: function () {
                return this;
            }
        };
        console.log(c.fn(), l.fn(), v.fn());
    }
    expect: {
        const c = {
            fn: function () {
                return this;
            }
        };
        let l = {
            fn: function () {
                return this;
            }
        };
        var v = {
            fn: function () {
                return this;
            }
        };
        console.log(c.fn(), l.fn(), v.fn());
    }
}

issue_2406_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        const c = {
            fn: function () {
                return this;
            }
        };
        let l = {
            fn: function () {
                return this;
            }
        };
        var v = {
            fn: function () {
                return this;
            }
        };
        console.log(c.fn(), l.fn(), v.fn());
    }
    expect: {
        console.log({
            fn: function () {
                return this;
            }
        }.fn(), {
            fn: function () {
                return this;
            }
        }.fn(), {
            fn: function () {
                return this;
            }
        }.fn());
    }
}

escaped_prop_1: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var obj = { o: { a: 1 } };
        (function (o) {
            o.a++;
        })(obj.o);
        (function (o) {
            console.log(o.a);
        })(obj.o);
    }
    expect: {
        var obj = { o: { a: 1 } };
        obj.o.a++;
        console.log(obj.o.a);
    }
    expect_stdout: "2"
}

escaped_prop_2: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 2,
        pure_getters: "strict",
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var obj = { o: { a: 1 } };
        (function (o) {
            o.a++;
        })(obj.o);
        (function (o) {
            console.log(o.a);
        })(obj.o);
    }
    expect: {
        var obj = { o: { a: 1 } };
        obj.o.a++;
        console.log(obj.o.a);
    }
    expect_stdout: "2"
}

escaped_prop_3: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        function f(b) {
            if (a) console.log(a === b.c);
            a = b.c;
        }
        function g() { }
        function h() {
            f({ c: g });
        }
        h();
        h();
    }
    expect: {
        var a;
        function g() { }
        function h() {
            (function (b) {
                if (a) console.log(a === b.c);
                a = b.c;
            })({ c: g });
        }
        h();
        h();
    }
    expect_stdout: "true"
}

issue_2420_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function run() {
            var self = this;
            if (self.count++)
                self.foo();
            else
                self.bar();
        }
        var o = {
            count: 0,
            foo: function () { console.log("foo"); },
            bar: function () { console.log("bar"); },
        };
        run.call(o);
        run.call(o);
    }
    expect: {
        function run() {
            if (this.count++)
                this.foo();
            else
                this.bar();
        }
        var o = {
            count: 0,
            foo: function () { console.log("foo"); },
            bar: function () { console.log("bar"); },
        };
        run.call(o);
        run.call(o);
    }
    expect_stdout: [
        "bar",
        "foo",
    ]
}

issue_2420_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            var that = this;
            if (that.bar)
                that.foo();
            else
                !function (that, self) {
                    console.log(this === that, self === this, that === self);
                }(that, this);
        }
        f.call({
            bar: 1,
            foo: function () { console.log("foo", this.bar); },
        });
        f.call({});
    }
    expect: {
        function f() {
            if (this.bar)
                this.foo();
            else
                !function (that, self) {
                    console.log(this === that, self === this, that === self);
                }(this, this);
        }
        f.call({
            bar: 1,
            foo: function () { console.log("foo", this.bar); },
        });
        f.call({});
    }
    expect_stdout: [
        "foo 1",
        "false false true",
    ]
}

issue_2420_3: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            var that = this;
            if (that.bar)
                that.foo();
            else
                ((that, self) => {
                    console.log(this === that, self === this, that === self);
                })(that, this);
        }
        f.call({
            bar: 1,
            foo: function () { console.log("foo", this.bar); },
        });
        f.call({});
    }
    expect: {
        function f() {
            if (this.bar)
                this.foo();
            else
                ((that, self) => {
                    console.log(this === that, self === this, that === self);
                })(this, this);
        }
        f.call({
            bar: 1,
            foo: function () { console.log("foo", this.bar); },
        });
        f.call({});
    }
    expect_stdout: [
        "foo 1",
        "true true true",
    ]
}

issue_2423_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function c() { return 1; }
        function p() { console.log(c()); }
        p();
        p();
    }
    expect: {
        function p() { console.log(function () { return 1; }()); }
        p();
        p();
    }
    expect_stdout: [
        "1",
        "1",
    ]
}

issue_2423_2: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function c() { return 1; }
        function p() { console.log(c()); }
        p();
        p();
    }
    expect: {
        function p() { console.log(1); }
        p();
        p();
    }
    expect_stdout: [
        "1",
        "1",
    ]
}

issue_2423_3: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function c() { return 1; }
        function p() { console.log(c()); }
        p();
    }
    expect: {
        (function () { console.log(function () { return 1; }()); })();
    }
    expect_stdout: "1"
}

issue_2423_4: {
    options = {
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function c() { return 1; }
        function p() { console.log(c()); }
        p();
    }
    expect: {
        console.log(1);
    }
    expect_stdout: "1"
}

issue_2423_5: {
    options = {
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function x() {
            y();
        }
        function y() {
            console.log(1);
        }
        function z() {
            function y() {
                console.log(2);
            }
            x();
        }
        z();
        z();
    }
    expect: {
        function z() {
            console.log(1);
        }
        z();
        z();
    }
    expect_stdout: [
        "1",
        "1",
    ]
}

issue_2423_6: {
    options = {
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function x() {
            y();
        }
        function y() {
            console.log(1);
        }
        function z() {
            function y() {
                console.log(2);
            }
            x();
            y();
        }
        z();
        z();
    }
    expect: {
        function z() {
            console.log(1);
            console.log(2);
        }
        z();
        z();
    }
    expect_stdout: [
        "1",
        "2",
        "1",
        "2",
    ]
}

issue_2440_eval_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo() {
            return bar();
        }
        baz = {
            quux: foo
        };
        exec = function () {
            return eval("foo()");
        };
    }
    expect: {
        function foo() {
            return bar();
        }
        baz = {
            quux: foo
        };
        exec = function () {
            return eval("foo()");
        };
    }
}

issue_2440_eval_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        baz = {
            quux: foo
        };
        exec = function () {
            return eval("foo()");
        };
        function foo() {
            return bar();
        }
    }
    expect: {
        baz = {
            quux: foo
        };
        exec = function () {
            return eval("foo()");
        };
        function foo() {
            return bar();
        }
    }
}

issue_2440_with_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo() {
            return bar();
        }
        baz = {
            quux: foo
        };
        with (o) whatever();
    }
    expect: {
        function foo() {
            return bar();
        }
        baz = {
            quux: foo
        };
        with (o) whatever();
    }
}

issue_2440_with_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        baz = {
            quux: foo
        };
        with (o) whatever();
        function foo() {
            return bar();
        }
    }
    expect: {
        baz = {
            quux: foo
        };
        with (o) whatever();
        function foo() {
            return bar();
        }
    }
}

issue_2442: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo() {
            foo();
        }
    }
    expect: { }
}

recursive_inlining_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            function foo() { bar(); }
            function bar() { foo(); }
            console.log("PASS");
        }();
    }
    expect: {
        !function () {
            console.log("PASS");
        }();
    }
    expect_stdout: "PASS"
}

recursive_inlining_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            function foo() { qux(); }
            function bar() { foo(); }
            function qux() { bar(); }
            console.log("PASS");
        }();
    }
    expect: {
        !function () {
            console.log("PASS");
        }();
    }
    expect_stdout: "PASS"
}

recursive_inlining_3: {
    options = {
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            function foo(x) { console.log("foo", x); if (x) bar(x - 1); }
            function bar(x) { console.log("bar", x); if (x) qux(x - 1); }
            function qux(x) { console.log("qux", x); if (x) foo(x - 1); }
            qux(4);
        }();
    }
    expect: {
        !function () {
            function qux(x) {
                console.log("qux", x);
                if (x) (function (x) {
                    console.log("foo", x);
                    if (x) (function (x) {
                        console.log("bar", x);
                        if (x) qux(x - 1);
                    })(x - 1);
                })(x - 1);
            }
            qux(4);
        }();
    }
    expect_stdout: [
        "qux 4",
        "foo 3",
        "bar 2",
        "qux 1",
        "foo 0",
    ]
}

recursive_inlining_4: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            function foo(x) { console.log("foo", x); if (x) bar(x - 1); }
            function bar(x) { console.log("bar", x); if (x) qux(x - 1); }
            function qux(x) { console.log("qux", x); if (x) foo(x - 1); }
            qux(4);
            bar(5);
        }();
    }
    expect: {
        !function () {
            function bar(x) {
                console.log("bar", x);
                if (x) qux(x - 1);
            }
            function qux(x) {
                console.log("qux", x);
                if (x) (function (x) {
                    console.log("foo", x);
                    if (x) bar(x - 1);
                })(x - 1);
            }
            qux(4);
            bar(5);
        }();
    }
    expect_stdout: [
        "qux 4",
        "foo 3",
        "bar 2",
        "qux 1",
        "foo 0",
        "bar 5",
        "qux 4",
        "foo 3",
        "bar 2",
        "qux 1",
        "foo 0",
    ]
}

recursive_inlining_5: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        !function () {
            function foo(x) { console.log("foo", x); if (x) bar(x - 1); }
            function bar(x) { console.log("bar", x); if (x) qux(x - 1); }
            function qux(x) { console.log("qux", x); if (x) foo(x - 1); }
            qux(4);
            bar(5);
            foo(3);
        }();
    }
    expect: {
        !function () {
            function foo(x) {
                console.log("foo", x);
                if (x) bar(x - 1);
            }
            function bar(x) {
                console.log("bar", x);
                if (x) qux(x - 1);
            }
            function qux(x) {
                console.log("qux", x);
                if (x) foo(x - 1);
            }
            qux(4);
            bar(5);
            foo(3);
        }();
    }
    expect_stdout: [
        "qux 4",
        "foo 3",
        "bar 2",
        "qux 1",
        "foo 0",
        "bar 5",
        "qux 4",
        "foo 3",
        "bar 2",
        "qux 1",
        "foo 0",
        "foo 3",
        "bar 2",
        "qux 1",
        "foo 0",
    ]
}

issue_2450_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() { }
        function g() {
            return f;
        }
        console.log(g() === g());
    }
    expect: {
        function f() { }
        function g() {
            return f;
        }
        console.log(g() === g());
    }
    expect_stdout: "true"
}

issue_2450_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function g() {
            function f() { }
            return f;
        }
        console.log(g() === g());
    }
    expect: {
        function g() {
            return function () { };
        }
        console.log(g() === g());
    }
    expect_stdout: "false"
}

issue_2450_3: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var x = (function () {
            function test() {
                return "foo";
            }
            return function b() {
                return [1, test];
            }
        })();
        console.log(x()[1] === x()[1]);
    }
    expect: {
        var x = (function () {
            function test() {
                return "foo";
            }
            return function () {
                return [1, test];
            }
        })();
        console.log(x()[1] === x()[1]);
    }
    expect_stdout: "true"
}

issue_2450_4: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        function f(b) {
            console.log(a === b);
            a = b;
        }
        function g() { }
        for (var i = 3; --i >= 0;)
            f(g);
    }
    expect: {
        var a;
        function f(b) {
            console.log(a === b);
            a = b;
        }
        function g() { }
        for (var i = 3; --i >= 0;)
            f(g);
    }
    expect_stdout: [
        "false",
        "true",
        "true",
    ]
}

issue_2450_5: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a;
        function f(b) {
            console.log(a === b);
            a = b;
        }
        function g() { }
        [1, 2, 3].forEach(function () {
            f(g);
        });
    }
    expect: {
        var a;
        function g() { }
        [1, 2, 3].forEach(function () {
            (function (b) {
                console.log(a === b);
                a = b;
            })(g);
        });
    }
    expect_stdout: [
        "false",
        "true",
        "true",
    ]
}

issue_2449: {
    options = {
        passes: 10,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a = "PASS";
        function f() {
            return a;
        }
        function g() {
            return f();
        }
        (function () {
            var a = "FAIL";
            if (a == a) console.log(g());
        })();
    }
    expect: {
        var a = "PASS";
        function g() {
            return function () {
                return a;
            }();
        }
        (function () {
            var a = "FAIL";
            if (a == a) console.log(g());
        })();
    }
    expect_stdout: "PASS"
}

perf_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function foo(x, y, z) {
            return x < y ? x * y + z : x * z - y;
        }
        function indirect_foo(x, y, z) {
            return foo(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i) {
            sum += indirect_foo(i, i + 1, 3 * i);
        }
        console.log(sum);
    }
    expect: {
        function indirect_foo(x, y, z) {
            return function (x, y, z) {
                return x < y ? x * y + z : x * z - y;
            }(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i)
            sum += indirect_foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect_stdout: "348150"
}

perf_3: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var foo = function (x, y, z) {
            return x < y ? x * y + z : x * z - y;
        }
        var indirect_foo = function (x, y, z) {
            return foo(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i)
            sum += indirect_foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect: {
        var indirect_foo = function (x, y, z) {
            return function (x, y, z) {
                return x < y ? x * y + z : x * z - y;
            }(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i)
            sum += indirect_foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect_stdout: "348150"
}

perf_5: {
    options = {
        passes: 10,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function indirect_foo(x, y, z) {
            function foo(x, y, z) {
                return x < y ? x * y + z : x * z - y;
            }
            return foo(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i) {
            sum += indirect_foo(i, i + 1, 3 * i);
        }
        console.log(sum);
    }
    expect: {
        function indirect_foo(x, y, z) {
            return function (x, y, z) {
                return x < y ? x * y + z : x * z - y;
            }(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i)
            sum += indirect_foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect_stdout: "348150"
}

perf_7: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var indirect_foo = function (x, y, z) {
            var foo = function (x, y, z) {
                return x < y ? x * y + z : x * z - y;
            }
            return foo(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i)
            sum += indirect_foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect: {
        var indirect_foo = function (x, y, z) {
            return function (x, y, z) {
                return x < y ? x * y + z : x * z - y;
            }(x, y, z);
        }
        var sum = 0;
        for (var i = 0; i < 100; ++i)
            sum += indirect_foo(i, i + 1, 3 * i);
        console.log(sum);
    }
    expect_stdout: "348150"
}

issue_2485: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        var foo = function (bar) {
            var n = function (a, b) {
                return a + b;
            };
            var sumAll = function (arg) {
                return arg.reduce(n, 0);
            };
            var runSumAll = function (arg) {
                return sumAll(arg);
            };
            bar.baz = function (arg) {
                var n = runSumAll(arg);
                return (n.get = 1), n;
            };
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect: {
        var foo = function (bar) {
            var n = function (a, b) {
                return a + b;
            };
            var runSumAll = function (arg) {
                return function (arg) {
                    return arg.reduce(n, 0);
                }(arg);
            };
            bar.baz = function (arg) {
                var n = runSumAll(arg);
                return (n.get = 1), n;
            };
            return bar;
        };
        var bar = foo({});
        console.log(bar.baz([1, 2, 3]));
    }
    expect_stdout: "6"
}

issue_2496: {
    options = {
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function execute(callback) {
            callback();
        }
        class Foo {
            constructor(message) {
                this.message = message;
            }
            go() {
                this.message = "PASS";
                console.log(this.message);
            }
            run() {
                execute(() => {
                    this.go();
                });
            }
        }
        new Foo("FAIL").run();
    }
    expect: {
        new class {
            constructor(message) {
                this.message = message;
            }
            go() {
                this.message = "PASS";
                console.log(this.message);
            }
            run() {
                (function (callback) {
                    callback();
                })(() => {
                    this.go();
                });
            }
        }("FAIL").run();
    }
    expect_stdout: "PASS"
}

issue_2416: {
    options = {
        keep_classnames: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        class Foo { }
        console.log(Foo.name);
    }
    expect: {
        console.log((class Foo { }).name);
    }
    expect_stdout: "Foo"
}

issue_2455: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        function foo() {
            var that = this;
            for (; ;) that.bar();
        }
    }
    expect: {
        function foo() {
            for (; ;) this.bar();
        }
    }
}

escape_conditional: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        }
        function baz(s) {
            return s ? foo : bar;
        }
        function foo() { }
        function bar() { }
        main();
    }
    expect: {
        function baz(s) {
            return s ? foo : bar;
        }
        function foo() { }
        function bar() { }
        (function () {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}

/*
https://github.com/terser/terser/issues/431
escape_sequence: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        }
        function baz() {
            return foo, bar;
        }
        function foo() {}
        function bar() {}
        main();
    }
    expect: {
        function baz() {
            return function() {}, bar;
        }
        function bar() {}
        (function() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}
*/

escape_throw: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        }
        function baz() {
            try {
                throw foo;
            } catch (bar) {
                return bar;
            }
        }
        function foo() { }
        main();
    }
    expect: {
        function baz() {
            try {
                throw foo;
            } catch (bar) {
                return bar;
            }
        }
        function foo() { }
        (function () {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}

escape_local_conditional: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("PASS");
            else
                console.log("FAIL");
        }
        function baz(s) {
            function foo() { }
            function bar() { }
            return s ? foo : bar;
        }
        main();
    }
    expect: {
        function baz(s) {
            return s ? function () { } : function () { };
        }
        (function () {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("PASS");
            else
                console.log("FAIL");
        })();
    }
    expect_stdout: "PASS"
}

escape_local_sequence: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("PASS");
            else
                console.log("FAIL");
        }
        function baz() {
            function foo() { }
            function bar() { }
            return foo, bar;
        }
        main();
    }
    expect: {
        function baz() {
            return function () { }, function () { };
        }
        (function () {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("PASS");
            else
                console.log("FAIL");
        })();
    }
    expect_stdout: "PASS"
}

escape_local_throw: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("PASS");
            else
                console.log("FAIL");
        }
        function baz() {
            function foo() { }
            try {
                throw foo;
            } catch (bar) {
                return bar;
            }
        }
        main();
    }
    expect: {
        function baz() {
            try {
                throw function () { };
            } catch (bar) {
                return bar;
            }
        }
        (function () {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("PASS");
            else
                console.log("FAIL");
        })();
    }
    expect_stdout: "PASS"
}

escape_yield: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = gen.next().value;
            if (thing !== (thing = gen.next().value))
                console.log("FAIL");
            else
                console.log("PASS");
        }
        function foo() { }
        function* baz(s) {
            for (; ;) yield foo;
        }
        var gen = baz();
        main();
    }
    expect: {
        function foo() { }
        var gen = function* (s) {
            for (; ;) yield foo;
        }();
        (function () {
            var thing = gen.next().value;
            if (thing !== (thing = gen.next().value))
                console.log("FAIL");
            else
                console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}

escape_await: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing;
            baz().then(x => {
                thing = x;
            });
            baz().then(x => {
                if (thing !== (thing = x))
                    console.log("FAIL");
                else
                    console.log("PASS");
            });
        }
        function foo() { }
        async function baz() {
            return await foo;
        }
        main();
    }
    expect: {
        function foo() { }
        async function baz() {
            return await foo;
        }
        (function () {
            var thing;
            baz().then(x => {
                thing = x;
            });
            baz().then(x => {
                if (thing !== (thing = x))
                    console.log("FAIL");
                else
                    console.log("PASS");
            });
        })();
    }
}

escape_expansion: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function main() {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        }
        function foo() { }
        function bar(...x) {
            return x[0];
        }
        function baz() {
            return bar(...[foo]);
        }
        main();
    }
    expect: {
        function foo() { }
        function baz() {
            return function (...x) {
                return x[0];
            }(foo);
        }
        (function () {
            var thing = baz();
            if (thing !== (thing = baz()))
                console.log("FAIL");
            else
                console.log("PASS");
        })();
    }
    expect_stdout: "PASS"
}

inverted_var: {
    options = {
        evaluate: true,
        inline: true,
        passes: 3,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        console.log(function () {
            var a = 1;
            return a;
        }(), function () {
            var b;
            b = 2;
            return b;
        }(), function () {
            c = 3;
            return c;
            var c;
        }(), function (c) {
            c = 4;
            return c;
        }(), function (c) {
            c = 5;
            return c;
            var c;
        }(), function c() {
            c = 6;
            return c;
        }(), function c() {
            c = 7;
            return c;
            var c;
        }(), function () {
            c = 8;
            return c;
            var c = "foo";
        }());
    }
    expect: {
        console.log(1, 2, 3, 4, 5, function c() {
            c = 6;
            return c;
        }(), 7, function () {
            c = 8;
            return c;
            var c = "foo";
        }());
    }
    expect_stdout: true
}

defun_single_use_loop: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        for (var x, i = 2; --i >= 0;) {
            var y = x;
            x = f;
            console.log(x === y);
        }
        function f() { };
    }
    expect: {
        for (var x, i = 2; --i >= 0;) {
            var y = x;
            x = f;
            console.log(x === y);
        }
        function f() { };
    }
    expect_stdout: [
        "false",
        "true",
    ]
}

do_while: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        function f(a) {
            do {
                (function () {
                    a && (c = "PASS");
                })();
            } while (a = 0);
        }
        var c = "FAIL";
        f(1);
        console.log(c);
    }
    expect: {
        function f(a) {
            do {
                (function () {
                    a && (c = "PASS");
                })();
            } while (a = 0);
        }
        var c = "FAIL";
        f(1);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_2598: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() { }
        function g(a) {
            return a || f;
        }
        console.log(g(false) === g(null));
    }
    expect: {
        function f() { }
        function g(a) {
            return a || f;
        }
        console.log(g(false) === g(null));
    }
    expect_stdout: "true"
}

issue_2669: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        let foo;
        console.log(([foo] = ["PASS"]) && foo);
    }
    expect: {
        let foo;
        console.log(([foo] = ["PASS"]) && foo);
    }
    expect_stdout: "PASS"
}

issue_2670: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        const obj = {};
        obj.prop = "PASS";
        const { prop: value } = obj;
        console.log(value);
    }
    expect: {
        const obj = {};
        obj.prop = "PASS";
        const { prop: value } = obj;
        console.log(value);
    }
    expect_stdout: "PASS"
}

var_if: {
    options = {
        evaluate: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function f() {
            if (x()) {
                var a;
                if (!g) a = true;
                if (a) g();
            }
        }
    }
    expect: {
        function f() {
            if (x()) {
                var a;
                if (!g) a = true;
                if (a) g();
            }
        }
    }
}

defun_assign: {
    options = {
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        console.log(typeof a);
        a = 42;
        console.log(typeof a);
        function a() { }
        console.log(typeof a);
    }
    expect: {
        console.log(typeof a);
        a = 42;
        console.log(typeof a);
        function a() { }
        console.log(typeof a);
    }
    expect_stdout: [
        "function",
        "number",
        "number",
    ]
}

defun_var_1: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        typeofs: true,
        unused: true,
    }
    input: {
        var a = 42, b;
        function a() { }
        function b() { }
        console.log(typeof a, typeof b);
    }
    expect: {
        console.log("number", "function");
    }
    expect_stdout: "number function"
}

defun_var_2: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        typeofs: true,
        unused: true,
    }
    input: {
        function a() { }
        function b() { }
        var a = 42, b;
        console.log(typeof a, typeof b);
    }
    expect: {
        console.log("number", "function");
    }
    expect_stdout: "number function"
}

defun_var_3: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        typeofs: true,
        unused: true,
    }
    input: {
        function a() { }
        function b() { }
        console.log(typeof a, typeof b);
        var a = 42, b;
    }
    expect: {
        function a() { }
        console.log(typeof a, "function");
        var a = 42;
    }
    expect_stdout: "function function"
}

defun_catch_1: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function a() { }
        try {
            throw 42;
        } catch (a) {
            console.log(a);
        }
    }
    expect: {
        // TODO: drop unused AST_Defun
        function a() { }
        try {
            throw 42;
        } catch (a) {
            console.log(a);
        }
    }
    expect_stdout: "42"
}

defun_catch_2: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
            function a() { }
            throw 42;
        } catch (a) {
            console.log(a);
        }
    }
    expect: {
        try {
            // TODO: drop unused AST_Defun
            function a() { }
            throw 42;
        } catch (a) {
            console.log(a);
        }
    }
    expect_stdout: "42"
}

defun_catch_3: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
            throw 42;
            function a() { }
        } catch (a) {
            console.log(a);
        }
    }
    expect: {
        try {
            throw 42;
            // TODO: drop unused AST_Defun
            function a() { }
        } catch (a) {
            console.log(a);
        }
    }
    expect_stdout: "42"
}

defun_catch_4: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
            throw 42;
        } catch (a) {
            function a() { }
            console.log(a);
        }
    }
    expect: {
        try {
            throw 42;
        } catch (a) {
            function a() { }
            console.log(a);
        }
    }
    expect_stdout: true
}

defun_catch_5: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
            throw 42;
        } catch (a) {
            console.log(a);
            function a() { }
        }
    }
    expect: {
        try {
            throw 42;
        } catch (a) {
            console.log(a);
            function a() { }
        }
    }
    expect_stdout: true
}

defun_catch_6: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        try {
            throw 42;
        } catch (a) {
            console.log(a);
        }
        function a() { }
    }
    expect: {
        try {
            throw 42;
        } catch (a) {
            console.log(a);
        }
        // TODO: drop unused AST_Defun
        function a() { }
    }
    expect_stdout: "42"
}

duplicate_lambda_defun_name_1: {
    options = {
        reduce_vars: true,
    }
    input: {
        console.log(function f(a) {
            function f() { }
            return f.length;
        }());
    }
    expect: {
        console.log(function f(a) {
            function f() { }
            return f.length;
        }());
    }
    expect_stdout: "0"
}

duplicate_lambda_defun_name_2: {
    options = {
        passes: 2,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function f(a) {
            function f() { }
            return f.length;
        }());
    }
    expect: {
        console.log(function (a) {
            return function () { }.length;
        }());
    }
    expect_stdout: "0"
}

named_function_with_recursive_ref_reuse: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true
    }
    input: {
        var result = [];
        var do_not_inline = function foo() {
            result.push(foo)
        };
        [0, 1].map(() => do_not_inline());
        console.log(result[0] === result[1]);
    }
    expect: {
        var result = [];
        var do_not_inline = function foo() {
            result.push(foo)
        };
        [0, 1].map(() => do_not_inline());
        console.log(result[0] === result[1]);
    }
    expect_stdout: "true"
}

issue_2757_1: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        let u;
        (function () {
            let v;
            console.log(u, v);
        })();
    }
    expect: {
        let u;
        console.log(u, void 0);
    }
    expect_stdout: "undefined undefined"
}

issue_2757_2: {
    options = {
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function () {
            let bar;
            const unused = function () {
                bar = true;
            };
            if (!bar) {
                console.log(1);
            }
            console.log(2);
        }());
    }
    expect: {
        console.log(1),
            console.log(2);
    }
    expect_stdout: [
        "1",
        "2",
    ]
}

issue_2774: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log({
            get a() {
                var b;
                (b = true) && b.c;
                b = void 0;
            }
        }.a);
    }
    expect: {
        console.log({
            get a() {
                var b;
                (b = true) && b.c;
                b = void 0;
            }
        }.a);
    }
    expect_stdout: "undefined"
}

issue_2799_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        console.log(function () {
            return f;
            function f(n) {
                function g(i) {
                    return i && i + g(i - 1);
                }
                function h(j) {
                    return g(j);
                }
                return h(n);
            }
        }()(5));
    }
    expect: {
        console.log(function () {
            return function (n) {
                function g(i) {
                    return i && i + g(i - 1);
                }
                return function (j) {
                    return g(j);
                }(n);
            }
        }()(5));
    }
    expect_stdout: "15"
}

issue_2799_2: {
    options = {
        reduce_vars: true,
        unsafe_proto: true,
        unused: true,
    }
    input: {
        (function () {
            function foo() {
                Function.prototype.call.apply(console.log, [null, "PASS"]);
            }
            foo();
        })();
    }
    expect: {
        (function () {
            (function () {
                (function () { }).call.apply(console.log, [null, "PASS"]);
            })();
        })();
    }
    expect_stdout: "PASS"
}

issue_2836: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() {
            return "FAIL";
        }
        console.log(f());
        function f() {
            return "PASS";
        }
    }
    expect: {
        console.log(function () {
            return "PASS";
        }());
    }
    expect_stdout: "PASS"
}

lvalues_def_1: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var b = 1;
        var a = b++, b = NaN;
        console.log(a, b);
    }
    expect: {
        var b = 1;
        var a = b++;
        b = NaN;
        console.log(a, b);
    }
    expect_stdout: "1 NaN"
}

lvalues_def_2: {
    options = {
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var b = 1;
        var a = b += 1, b = NaN;
        console.log(a, b);
    }
    expect: {
        var b = 1;
        var a = b += 1;
        b = NaN;
        console.log(a, b);
    }
    expect_stdout: "2 NaN"
}

chained_assignments: {
    options = {
        evaluate: true,
        inline: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        function f() {
            var a = [0x5e, 0xad, 0xbe, 0xef];
            var b = 0;
            b |= a[0];
            b <<= 8;
            b |= a[1];
            b <<= 8;
            b |= a[2];
            b <<= 8;
            b |= a[3];
            return b;
        }
        console.log(f().toString(16));
    }
    expect: {
        console.log("5eadbeef");
    }
    expect_stdout: "5eadbeef"
}

issue_2860_1: {
    options = {
        dead_code: true,
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        console.log(function (a) {
            return a ^= 1;
            a ^= 2;
        }());
    }
    expect: {
        console.log(function (a) {
            return 1 ^ a;
        }());
    }
    expect_stdout: "1"
}

issue_2860_2: {
    options = {
        dead_code: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
    }
    input: {
        console.log(function (a) {
            return a ^= 1;
            a ^= 2;
        }());
    }
    expect: {
        console.log(1);
    }
    expect_stdout: "1"
}

issue_2869: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var c = "FAIL";
        (function f(a) {
            var a;
            if (!f) a = 0;
            if (a) c = "PASS";
        })(1);
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        (function f(a) {
            var a;
            if (!f) a = 0;
            if (a) c = "PASS";
        })(1);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3042_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function f() { }
        var a = [1, 2].map(function () {
            return new f();
        });
        console.log(a[0].constructor === a[1].constructor);
    }
    expect: {
        function f() { }
        var a = [1, 2].map(function () {
            return new f();
        });
        console.log(a[0].constructor === a[1].constructor);
    }
    expect_stdout: "true"
}

issue_3042_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function Foo() {
            this.isFoo = function (o) {
                return o instanceof Foo;
            };
        }
        function FooCollection() {
            this.foos = [1, 1].map(function () {
                return new Foo();
            });
        }
        var fooCollection = new FooCollection();
        console.log(fooCollection.foos[0].isFoo(fooCollection.foos[0]));
        console.log(fooCollection.foos[0].isFoo(fooCollection.foos[1]));
        console.log(fooCollection.foos[1].isFoo(fooCollection.foos[0]));
        console.log(fooCollection.foos[1].isFoo(fooCollection.foos[1]));
    }
    expect: {
        function Foo() {
            this.isFoo = function (o) {
                return o instanceof Foo;
            };
        }
        var fooCollection = new function () {
            this.foos = [1, 1].map(function () {
                return new Foo();
            });
        }();
        console.log(fooCollection.foos[0].isFoo(fooCollection.foos[0]));
        console.log(fooCollection.foos[0].isFoo(fooCollection.foos[1]));
        console.log(fooCollection.foos[1].isFoo(fooCollection.foos[0]));
        console.log(fooCollection.foos[1].isFoo(fooCollection.foos[1]));
    }
    expect_stdout: [
        "true",
        "true",
        "true",
        "true",
    ]
}

issue_2919: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var arr = [function () { }];
        console.log(typeof arr[0]);
    }
    expect: {
        console.log("function");
    }
    expect_stdout: "function"
}

issue_2436: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        unsafe: true,
    }
    input: {
        var c;
        console.log(((c = {
            a: 1,
            b: 2
        }).a = 3, {
            x: c.a,
            y: c.b
        }));
    }
    expect: {
        var c;
        console.log(((c = {
            a: 1,
            b: 2
        }).a = 3, {
            x: c.a,
            y: c.b
        }));
    }
    expect_stdout: true
}

issue_2916: {
    options = {
        collapse_vars: true,
        evaluate: true,
        inline: true,
        passes: 2,
        reduce_vars: true,
        side_effects: true,
        unsafe: true,
        unused: true,
    }
    input: {
        var c = "FAIL";
        (function (b) {
            (function (d) {
                d[0] = 1;
            })(b);
            +b && (c = "PASS");
        })([]);
        console.log(c);
    }
    expect: {
        var c = "FAIL";
        (function (b) {
            b[0] = 1;
            +b && (c = "PASS");
        })([]);
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3125: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
        unsafe: true,
    }
    input: {
        var o;
        console.log((function () {
            this.p++;
        }.call(o = {
            p: 6
        }), o.p));
    }
    expect: {
        var o;
        console.log((function () {
            this.p++;
        }.call(o = {
            p: 6
        }), o.p));
    }
    expect_stdout: "7"
}

issue_2992: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var c = "PASS";
        (function f(b) {
            switch (0) {
                case 0:
                case b = 1:
                    b && (c = "FAIL");
            }
        })();
        console.log(c);
    }
    expect: {
        var c = "PASS";
        (function f(b) {
            switch (0) {
                case 0:
                case b = 1:
                    b && (c = "FAIL");
            }
        })();
        console.log(c);
    }
    expect_stdout: "PASS"
}

issue_3068_1: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        (function () {
            do {
                continue;
                var b = "defined";
            } while (b && b.c);
        })();
    }
    expect: {
        (function () {
            do {
                continue;
                var b = "defined";
            } while (b && b.c);
        })();
    }
    expect_stdout: true
}

issue_3068_2: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        (function () {
            do {
                try {
                    while ("" == typeof a);
                } finally {
                    continue;
                }
                var b = "defined";
            } while (b && b.c);
        })();
    }
    expect: {
        (function () {
            do {
                try {
                    while ("" == typeof a);
                } finally {
                    continue;
                }
                var b = "defined";
            } while (b && b.c);
        })();
    }
    expect_stdout: true
}

issue_3110_1: {
    options = {
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 3,
        properties: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function () {
            function foo() {
                return isDev ? "foo" : "bar";
            }
            var isDev = true;
            var obj = {
                foo: foo
            };
            console.log(foo());
            console.log(obj.foo());
        })();
    }
    expect_stdout: [
        "foo",
        "foo",
    ]
}

issue_3110_2: {
    options = {
        conditionals: true,
        evaluate: true,
        inline: true,
        passes: 4,
        properties: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function () {
            function foo() {
                return isDev ? "foo" : "bar";
            }
            var isDev = true;
            console.log(foo());
            var obj = {
                foo: foo
            };
            console.log(obj.foo());
        })();
    }
    expect_stdout: [
        "foo",
        "foo",
    ]
}

issue_3110_3: {
    options = {
        conditionals: true,
        evaluate: true,
        inline: true,
        properties: true,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function () {
            function foo() {
                return isDev ? "foo" : "bar";
            }
            console.log(foo());
            var isDev = true;
            var obj = {
                foo: foo
            };
            console.log(obj.foo());
        })();
    }
    expect: {
        (function () {
            function foo() {
                return isDev ? "foo" : "bar";
            }
            console.log(foo());
            var isDev = true;
            var obj = {
                foo: foo
            };
            console.log(obj.foo());
        })();
    }
    expect_stdout: [
        "bar",
        "foo",
    ]
}

issue_3113_1: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var c = 0;
        (function () {
            function f() {
                while (g());
            }
            var a = f();
            function g() {
                a && a[c++];
            }
            g(a = 1);
        })();
        console.log(c);
    }
    expect: {
        var c = 0;
        (function () {
            function f() {
                while (g());
            }
            var a = f();
            function g() {
                a && a[c++];
            }
            g(a = 1);
        })();
        console.log(c);
    }
    expect_stdout: "1"
}

issue_3113_2: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var c = 0;
        (function () {
            function f() {
                while (g());
            }
            var a = f();
            function g() {
                a && a[c++];
            }
            a = 1;
            g();
        })();
        console.log(c);
    }
    expect: {
        var c = 0;
        (function () {
            function f() {
                while (g());
            }
            var a = f();
            function g() {
                a && a[c++];
            }
            a = 1;
            g();
        })();
        console.log(c);
    }
    expect_stdout: "1"
}

issue_3113_3: {
    options = {
        evaluate: true,
        inline: true,
        passes: 2,
        pure_getters: "strict",
        reduce_vars: true,
        side_effects: true,
        unused: true,
    }
    input: {
        var c = 0;
        (function () {
            function f() {
                while (g());
            }
            var a;
            function g() {
                a && a[c++];
            }
            g(a = 1);
        })();
        console.log(c);
    }
    expect_stdout: "1"
}

issue_3113_4: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        var a = 0, b = 0;
        function f() {
            b += a;
        }
        f(f(), ++a);
        console.log(a, b);
    }
    expect: {
        var a = 0, b = 0;
        function f() {
            b += a;
        }
        f(f(), ++a);
        console.log(a, b);
    }
    expect_stdout: "1 1"
}

issue_3113_5: {
    options = {
        evaluate: true,
        reduce_vars: true,
        toplevel: true,
    }
    input: {
        function f() {
            console.log(a);
        }
        function g() {
            f();
        }
        while (g());
        var a = 1;
        f();
    }
    expect: {
        function f() {
            console.log(a);
        }
        function g() {
            f();
        }
        while (g());
        var a = 1;
        f();
    }
    expect_stdout: [
        "undefined",
        "1",
    ]
}

conditional_nested_1: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var a = 1, b = 0;
        (function f(c) {
            function g() {
                c && (c.a = 0);
                c && (c.a = 0);
                c && (c[b++] *= 0);
            }
            g(a-- && f(g(c = 42)));
        })();
        console.log(b);
    }
    expect: {
        var a = 1, b = 0;
        (function f(c) {
            function g() {
                c && (c.a = 0);
                c && (c.a = 0);
                c && (c[b++] *= 0);
            }
            g(a-- && f(g(c = 42)));
        })();
        console.log(b);
    }
    expect_stdout: "2"
}

conditional_nested_2: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var c = 0;
        (function (a) {
            function f() {
                a && c++;
            }
            f(!c && f(), a = 1);
        })();
        console.log(c);
    }
    expect: {
        var c = 0;
        (function (a) {
            function f() {
                a && c++;
            }
            f(!c && f(), a = 1);
        })();
        console.log(c);
    }
    expect_stdout: "1"
}

conditional_nested_3: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var n = 2, c = 0;
        (function f(a) {
            0 < n-- && g(a = 1);
            function g() {
                a && c++;
            }
            g();
            0 < n-- && f();
        })();
        console.log(c);
    }
    expect: {
        var n = 2, c = 0;
        (function f(a) {
            0 < n-- && g(a = 1);
            function g() {
                a && c++;
            }
            g();
            0 < n-- && f();
        })();
        console.log(c);
    }
    expect_stdout: "2"
}

issue_3140_1: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                this();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                this();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect_stdout: "PASS"
}

issue_3140_2: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                var self = this;
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                self();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                this();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect_stdout: "PASS"
}

issue_3140_3: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                var self = this;
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                (function () {
                    return self;
                })()();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                var self = this;
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                (function () {
                    return self;
                })()();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect_stdout: "PASS"
}

issue_3140_4: {
    options = {
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                var o = {
                    p: this
                };
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                o.p();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect: {
        (function () {
            var a;
            function f() {
            }
            f.g = function g() {
                var o = {
                    p: this
                };
                function h() {
                    console.log(a ? "PASS" : "FAIL");
                }
                a = true;
                o.p();
                a = false;
                h.g = g;
                return h;
            };
            return f;
        })().g().g();
    }
    expect_stdout: "PASS"
}

issue_3140_5: {
    options = {
        evaluate: true,
        reduce_vars: true,
    }
    input: {
        var n = 1, c = 0;
        (function (a) {
            var b = function () {
                this;
                n-- && h();
            }();
            function h() {
                b && c++;
            }
            h(b = 1);
        })();
        console.log(c);
    }
    expect: {
        var n = 1, c = 0;
        (function (a) {
            var b = function () {
                this;
                n-- && h();
            }();
            function h() {
                b && c++;
            }
            h(b = 1);
        })();
        console.log(c);
    }
    expect_stdout: "1"
}

reduce_funcs_in_array_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            function Foo() {
                return 123;
            }
            function bar() {
                return [Foo].concat([2]);
            }
            var a = [bar(), bar()];
            console.log(a[0][0] === a[1][0], a[0][0]());
        })();
    }
    expect_stdout: "true 123"
}

reduce_funcs_in_array_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            function Foo() {
                return 123;
            }
            function bar(val) {
                return [val || Foo].concat([2]);
            }
            var a = [bar(), bar()];
            console.log(a[0][0] === a[1][0], a[0][0]());
        })();
    }
    expect_stdout: "true 123"
}

reduce_funcs_in_object_literal_1: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            function Foo() {
                return 123;
            }
            function bar() {
                return [({ prop: Foo }).prop].concat([2]);
            }
            var a = [bar(), bar()];
            console.log(a[0][0] === a[1][0], a[0][0]());
        })();
    }
    expect_stdout: "true 123"
}

reduce_funcs_in_object_literal_2: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            function Foo() {
                return 123;
            }
            function bar(val) {
                return [val || Foo].concat([2]);
            }
            var a = [bar(), bar()];
            console.log(a[0][0] === a[1][0], a[0][0]());
        })();
    }
    expect_stdout: "true 123"
}

single_use_class_referenced_in_array: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            class Foo {
                data() {
                    return 123;
                }
            }
            function bar(val) {
                return [val || Foo].concat([2]);
            }
            var a = [bar(), bar()];
            console.log(a[0][0] === a[1][0], (new a[0][0]).data());
        })();
    }
    expect_stdout: "true 123"
}

single_use_class_referenced_in_object_literal: {
    options = {
        reduce_funcs: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        (function () {
            class Foo {
                data() {
                    return 123;
                }
            }
            function bar(val) {
                return [({ prop: val || Foo }).prop].concat([2]);
            }
            var a = [bar(), bar()];
            console.log(a[0][0] === a[1][0], (new a[0][0]).data());
        })();
    }
    expect_stdout: "true 123"
}

issue_369: {
    options = {
        reduce_vars: true
    }
    input: {
        var printTest = function (ret) {
            function ret() {
                console.log("Value after override");
            }
            return ret;
        }("Value before override");

        printTest();
    }
    expect_stdout: "Value after override"
}

variables_collision_in_immediately_invoked_func: {
    options = {
        defaults: true
    }
    input: {
        (function (callback) {
            callback();
        })(function () {
            window.used = function () {
                var A = window.foo,
                    B = window.bar,
                    C = window.foobar;

                return (function (A, c) {
                    if (-1 === c) return A;
                    return $(A, c);
                })(B, C);
            }.call(this);
        });
    }
    expect: {
        !function () {
            window.used = function () {
                return (
                    window.foo,
                    function (A, c) {
                        return -1 === c
                            ? A
                            : $(A, c)
                    }(window.bar, window.foobar)
                );
            }.call(this);
        }();
    }
}

issue_308: {
    options = {
        defaults: true,
        passes: 2
    };
    input: {
        exports.withStyles = withStyles;

        function _inherits(superClass) {
            if (typeof superClass !== "function") {
                throw new TypeError();
            }
            Object.create(superClass);
        }

        function withStyles() {
            var a = EXTERNAL();
            return function (_a) {
                _inherits(_a);
                function d() { }
            }(a);
        }
    }
    expect: {
        function _inherits(superClass) {
            if ("function" != typeof superClass)
                throw new TypeError();
            Object.create(superClass);
        }

        function withStyles() {
            _inherits(EXTERNAL());
        }

        exports.withStyles = withStyles;
    }
}

issue_294: {
    options = {
        defaults: true,
        passes: 2
    };
    input: {
        module.exports = (function (constructor) {
            return constructor();
        })(function () {
            return function (input) {
                var keyToMap = input.key;
                return {
                    mappedKey: (function (value) {
                        return value || "CONDITIONAL_DEFAULT_VALUE";
                    })(keyToMap)
                };
            };
        });
    }
    expect: {
        module.exports = function (input) {
            var value;
            return { mappedKey: (value = input.key, value || "CONDITIONAL_DEFAULT_VALUE") };
        };
    }
}

issue_432_1: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        const selectServer = () => {
            selectServers();
        }

        function selectServers() {
            const retrySelection = () => {
                var descriptionChangedHandler = () => {
                    selectServers();
                };
            };

            retrySelection();
        }

        leak(() => Topology)

        console.log('PASS')
    }

    expect_stdout: "PASS"
}

issue_432_2: {
    options = {
        defaults: true,
        toplevel: true
    }
    input: {
        const selectServer = () => {
            selectServers();
        }

        function selectServers() {
            function retrySelection() {
                var descriptionChangedHandler = () => {
                    selectServers();
                };
                leak(descriptionChangedHandler)
            };

            retrySelection();
        }

        leak(() => Topology)

        console.log("PASS")
    }

    expect_stdout: "PASS"
}

issue_379: {
    input: {
        global.a = ((...args) => ((a1, a2) => a1.foo === a2.foo))(...args)
    }
    expect: {
        global.a = ((...args) => ((a1, a2) => a1.foo === a2.foo))(...args)
    }
}

issue_443: {
    options = {
        unused: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const one_name = "PASS";
        var get_one = () => {
            if (one_name) return one_name;
        }
        {
            let one_name = get_one();
            console.log(one_name)
        }
    }
    expect_stdout: "PASS"
}

reduce_class_with_side_effects_in_extends: {
    node_version = ">=12"
    options = {
        unused: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        let x = ""
        class Y extends (x += "PA", Array) { }
        class X extends (x += "SS", Array) { }
        global.something = [new X(), new Y()]
        console.log(x)
    }
    expect_stdout: "PASS"
}

reduce_class_with_side_effects_in_properties: {
    node_version = ">=12"
    options = {
        unused: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        let x = ""
        class Y {
            static _ = (x += "PA")
        }
        class X {
            static _ = (x += "SS")
        }
        global.something = [new X(), new Y()]
        console.log(x)
    }
    expect_stdout: "PASS"
}

issue_581: {
    options = {
        unused: true,
        reduce_vars: true,
    }
    input: {
        class Yellow {
            method() {
                const errorMessage = "FAIL";

                return applyCb(errorMessage, () => console.log(this.message()));
            }

            message() {
                return "PASS";
            }
        }

        function applyCb(errorMessage, callback) {
            return callback(errorMessage)
        }

        (new Yellow()).method()
    }
    expect_stdout: "PASS"
}

issue_581_2: {
    options = {
        unused: true,
        reduce_vars: true,
    }
    input: {
        (function () {
            return function (callback) {
                return callback()
            }(() => {
                console.log(this.message)
            });
        }).call({ message: 'PASS' })
    }
    expect: {
        (function () {
            return function (callback) {
                return callback()
            }(() => {
                console.log(this.message)
            });
        }).call({ message: 'PASS' })
    }
    expect_stdout: "PASS"
}

issue_639: {
    input: {
        const path = id({ extname: (name) => { console.log('PASS:' + name) } })

        global.getExtFn = function getExtFn() {
            return function (path) {
                return getExt(path);
            }
        }

        function getExt(name) {
            let ext;
            if (!ext) {
                ext = getExtInner(name);
            }
            return ext;
        }

        function getExtInner(name) {
            return path.extname(name);
        }

        getExtFn()('name')
    }
    expect_stdout: [
        "PASS:name"
    ]
}

issue_741_reference_cycle: {
    input: {
        for (var a = console.log, s = 1; s <= 3;) {
            var c = s;
            a(c);
            s++;
        }
    }
    expect_stdout: ["1", "2", "3"]
}

issue_741_2: {
    input: {
        var a = console.log
        var might_change = 0;

        global.problem = () => {
            var c = might_change
            a(c)
        }
        global.increment = () => {
            might_change++
        }

        increment()
        problem()
        increment()
        problem()
    }
    expect_stdout: ["1", "2"]
}

conditional_chain_call: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        global.a = { b: null }

        let foo = "PASS"

        a.b?.c(foo = "FAIL")

        console.log(foo)
    }
    expect: {
        global.a = { b: null }

        let foo = "PASS"

        a.b?.c(foo = "FAIL")

        console.log(foo)
    }
    expect_stdout: ["PASS"]
    node_version = ">=14"
}

conditional_chain_call_direct: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        global.a = { b: null }

        let foo = "PASS"

        a.b?.(foo = "FAIL")

        console.log(foo)
    }
    expect: {
        global.a = { b: null }

        let foo = "PASS"

        a.b?.(foo = "FAIL")

        console.log(foo)
    }
    expect_stdout: ["PASS"]
    node_version = ">=14"
}

conditional_chain_prop: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        global.a = null

        let foo = "PASS"

        a?.b[foo = "FAIL"]

        console.log(foo)
    }
    expect: {
        global.a = null

        let foo = "PASS"

        a?.b[foo = "FAIL"]

        console.log(foo)
    }
    expect_stdout: ["PASS"]
    node_version = ">=14"
}

conditional_chain_prop_direct: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        global.a = { b: null }

        let foo = "PASS"

        a.b?.[foo = "FAIL"]

        console.log(foo)
    }
    expect: {
        global.a = { b: null }

        let foo = "PASS"

        a.b?.[foo = "FAIL"]

        console.log(foo)
    }
    expect_stdout: ["PASS"]
    node_version = ">=14"
}

conditional_chain_certain_part: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        global.a = { b: null }

        let foo = "FAIL"

        a.b.c(foo = "PASS")?.x

        console.log(foo)
    }
    expect: {
        global.a = { b: null }

        let foo = "FAIL"

        a.b.c(foo = "PASS")?.x

        // "PASS" here because we know `foo = "PASS"` always happens.
        console.log("PASS")
    }
}

conditional_chain_certain_and_uncertain_part: {
    options = {
        toplevel: true,
        evaluate: true,
        inline: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        global.a = { b: null }

        let foo = "FAIL"

        a.b?.[foo = "PASS"]?.d(foo = "FAIL")

        console.log(foo)
    }
    expect: {
        global.a = { b: null }

        let foo = "FAIL"

        a.b?.[foo = "PASS"]?.d(foo = "FAIL")

        console.log(foo)
    }
}
