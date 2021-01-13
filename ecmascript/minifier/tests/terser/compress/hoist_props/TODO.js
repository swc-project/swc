contains_this_1: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            u: function () {
                return this === this;
            },
            p: 1
        };
        console.log(o.p, o.p);
    }
    expect: {
        console.log(1, 1);
    }
    expect_stdout: "1 1"
}

contains_this_2: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            u: function () {
                return this === this;
            },
            p: 1
        };
        console.log(o.p, o.p, o.u);
    }
    expect: {
        console.log(1, 1, function () {
            return this === this;
        });
    }
    expect_stdout: true
}

contains_this_3: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            u: function () {
                return this === this;
            },
            p: 1
        };
        console.log(o.p, o.p, o.u());
    }
    expect: {
        var o = {
            u: function () {
                return this === this;
            },
            p: 1
        };
        console.log(o.p, o.p, o.u());
    }
    expect_stdout: "1 1 true"
}

hoist_class: {
    options = {
        comparisons: true,
        evaluate: true,
        hoist_props: true,
        inline: true,
        keep_classnames: true,
        keep_fnames: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        function run(c, v) {
            return new c(v).value;
        }
        var o = {
            p: class Foo {
                constructor(value) {
                    this.value = value * 10;
                }
            },
            x: 1,
            y: 2,
        };
        console.log(o.p.name, o.p === o.p, run(o.p, o.x), run(o.p, o.y));
    }
    expect: {
        function run(c, v) {
            return new c(v).value;
        }
        var o_p = class Foo {
            constructor(value) {
                this.value = 10 * value;
            }
        };
        console.log(o_p.name, true, run(o_p, 1), run(o_p, 2));
    }
    expect_stdout: "Foo true 10 20"
}

hoist_class_with_new: {
    options = {
        comparisons: true,
        evaluate: true,
        hoist_props: true,
        inline: true,
        keep_classnames: true,
        keep_fnames: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            p: class Foo {
                constructor(value) {
                    this.value = value * 10;
                }
            },
            x: 1,
            y: 2,
        };
        console.log(o.p.name, o.p === o.p, new o.p(o.x).value, new o.p(o.y).value);
    }
    expect: {
        var o_p = class Foo {
            constructor(value) {
                this.value = 10 * value;
            }
        };
        console.log(o_p.name, true, new o_p(1).value, new o_p(2).value);
    }
    expect_stdout: "Foo true 10 20"
}

hoist_function_with_call: {
    options = {
        comparisons: true,
        evaluate: true,
        hoist_props: true,
        inline: true,
        keep_fnames: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            p: function Foo(value) {
                return 10 * value;
            },
            x: 1,
            y: 2
        };
        console.log(o.p.name, o.p === o.p, o.p(o.x), o.p(o.y));
    }
    expect: {
        var o = {
            p: function Foo(value) {
                return 10 * value;
            },
            x: 1,
            y: 2
        };
        console.log(o.p.name, o.p == o.p, o.p(o.x), o.p(o.y));
    }
    expect_stdout: "Foo true 10 20"
}

new_this: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        passes: 2,
        reduce_funcs: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            a: 1,
            b: 2,
            f: function (a) {
                this.b = a;
            }
        };
        console.log(new o.f(o.a).b, o.b);
    }
    expect: {
        console.log(new function (a) {
            this.b = a;
        }(1).b, 2);
    }
    expect_stdout: "1 2"
}

issue_2462: {
    options = {
        hoist_props: true,
        reduce_funcs: true,
        reduce_vars: true,
    }
    input: {
        export const Foo = {
            a: 1,
            b: () => 2
        };
    }
    expect: {
        export const Foo = {
            a: 1,
            b: () => 2
        };
    }
}

issue_2473_1: {
    options = {
        hoist_props: false,
        reduce_vars: true,
        top_retain: [
            "x",
            "y"
        ],
        toplevel: true,
        unused: true,
    }
    input: {
        var x = {};
        var y = [];
        var z = {};
    }
    expect: {
        var x = {};
        var y = [];
    }
}

issue_2473_2: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        top_retain: [
            "x",
            "y"
        ],
        toplevel: true,
        unused: true,
    }
    input: {
        var x = {};
        var y = [];
        var z = {};
    }
    expect: {
        var x = {};
        var y = [];
    }
}

issue_2473_3: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        top_retain: "o",
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            a: 1,
            b: 2,
        };
        console.log(o.a, o.b);
    }
    expect: {
        var o = {
            a: 1,
            b: 2,
        };
        console.log(o.a, o.b);
    }
    expect_stdout: "1 2"
}

issue_2473_4: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        top_retain: "o",
        toplevel: true,
        unused: true,
    }
    input: {
        (function () {
            var o = {
                a: 1,
                b: 2,
            };
            console.log(o.a, o.b);
        })();
    }
    expect: {
        (function () {
            var o_a = 1, o_b = 2;
            console.log(o_a, o_b);
        })();
    }
    expect_stdout: "1 2"
}

issue_2508_1: {
    options = {
        collapse_vars: true,
        hoist_props: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            a: [1],
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.a);
    }
    expect: {
        (function (x) {
            console.log(x);
        })([1]);
    }
    expect_stdout: true
}

issue_2508_2: {
    options = {
        collapse_vars: true,
        hoist_props: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            a: { b: 2 },
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.a);
    }
    expect: {
        (function (x) {
            console.log(x);
        })({ b: 2 });
    }
    expect_stdout: true
}

issue_2508_3: {
    options = {
        collapse_vars: true,
        hoist_props: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            a: [o],
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.a);
    }
    expect: {
        var o = {
            a: [o],
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.a);
    }
    expect_stdout: true
}

issue_2508_4: {
    options = {
        collapse_vars: true,
        hoist_props: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            a: { b: o },
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.a);
    }
    expect: {
        var o = {
            a: { b: o },
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.a);
    }
    expect_stdout: true
}

issue_2508_5: {
    options = {
        collapse_vars: true,
        hoist_props: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            f: function (x) {
                console.log(x);
            }
        };
        o.f(o.f);
    }
    expect: {
        var o_f = function (x) {
            console.log(x);
        };
        o_f(o_f);
    }
    expect_stdout: true
}

issue_2508_6: {
    options = {
        collapse_vars: true,
        hoist_props: true,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var o = {
            f: x => {
                console.log(x);
            }
        };
        o.f(o.f);
    }
    expect: {
        var o_f = x => {
            console.log(x);
        };
        o_f(o_f);
    }
    expect_stdout: true
}

issue_2519: {
    options = {
        collapse_vars: true,
        evaluate: true,
        hoist_props: true,
        reduce_vars: true,
        unused: true,
    }
    input: {
        function testFunc() {
            var dimensions = {
                minX: 5,
                maxX: 6,
            };
            var scale = 1;
            var d = {
                x: (dimensions.maxX + dimensions.minX) / 2,
            };
            return d.x * scale;
        }
        console.log(testFunc());
    }
    expect: {
        function testFunc() {
            return 1 * ((6 + 5) / 2);
        }
        console.log(testFunc());
    }
    expect_stdout: "5.5"
}

toplevel_const: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        toplevel: false,
    }
    input: {
        const a = {
            b: 1,
            c: 2
        };
        console.log(a.b + a.c);
    }
    expect: {
        const a = {
            b: 1,
            c: 2
        };
        console.log(a.b + a.c);
    }
    expect_stdout: "3"
}

toplevel_let: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        toplevel: false,
    }
    input: {
        let a = {
            b: 1,
            c: 2
        };
        console.log(a.b + a.c);
    }
    expect: {
        let a = {
            b: 1,
            c: 2
        };
        console.log(a.b + a.c);
    }
    expect_stdout: "3"
}

toplevel_var: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        toplevel: false,
    }
    input: {
        var a = {
            b: 1,
            c: 2
        };
        console.log(a.b + a.c);
    }
    expect: {
        var a = {
            b: 1,
            c: 2
        };
        console.log(a.b + a.c);
    }
    expect_stdout: "3"
}

undefined_key: {
    options = {
        evaluate: true,
        hoist_props: true,
        join_vars: true,
        passes: 4,
        reduce_vars: true,
        toplevel: true,
        unused: true,
    }
    input: {
        var a, o = {};
        o[a] = 1;
        o.b = 2;
        console.log(o[a] + o.b);
    }
    expect: {
        console.log(3);
    }
    expect_stdout: "3"
}

issue_3021: {
    options = {
        hoist_props: true,
        reduce_vars: true,
    }
    input: {
        var a = 1, b = 2;
        (function () {
            b = a;
            if (a++ + b--)
                return 1;
            return;
            var b = {};
        })();
        console.log(a, b);
    }
    expect: {
        var a = 1, b = 2;
        (function () {
            b = a;
            if (a++ + b--)
                return 1;
            return;
            var b = {};
        })();
        console.log(a, b);
    }
    expect_stdout: "2 2"
}

issue_3046: {
    options = {
        hoist_props: true,
        reduce_vars: true,
    }
    input: {
        console.log(function (a) {
            do {
                var b = {
                    c: a++
                };
            } while (b.c && a);
            return a;
        }(0));
    }
    expect: {
        // NOTE: differs from uglify-js, but produces correct result
        console.log(function (a) {
            do {
                var b = {
                    c: a++
                };
            } while (b.c && a);
            return a;
        }(0));
    }
    expect_stdout: "1"
}

issue_3071_1: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        join_vars: true,
        passes: 3,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        (function () {
            var obj = {};
            obj.one = 1;
            obj.two = 2;
            console.log(obj.one);
        })();
    }
    expect_stdout: "1"
}

issue_3071_2: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        join_vars: true,
        passes: 3,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        unused: true,
    }
    input: {
        (function () {
            obj = {};
            obj.one = 1;
            obj.two = 2;
            console.log(obj.one);
            var obj;
        })();
    }
    expect_stdout: "1"
}

issue_3071_2_toplevel: {
    options = {
        evaluate: true,
        hoist_props: true,
        inline: true,
        join_vars: true,
        passes: 3,
        reduce_vars: true,
        sequences: true,
        side_effects: true,
        toplevel: true,
        unused: true,
    }
    input: {
        (function () {
            obj = {};
            obj.one = 1;
            obj.two = 2;
            console.log(obj.one);
            var obj;
        })();
    }
    expect_stdout: "1"
}

issue_3071_3: {
    options = {
        hoist_props: true,
        reduce_vars: true,
    }
    input: {
        var c = 0;
        (function (a, b) {
            (function f(o) {
                var n = 2;
                while (--b + (o = {
                    p: c++,
                }) && --n > 0);
            })();
        })();
        console.log(c);
    }
    expect: {
        var c = 0;
        (function (a, b) {
            (function f(o) {
                var n = 2;
                while (--b + (o = {
                    p: c++,
                }) && --n > 0);
            })();
        })();
        console.log(c);
    }
    expect_stdout: "2"
}

does_not_hoist_objects_with_computed_props: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const x = { [console.log("PASS")]: 123 }
    }
    expect_stdout: "PASS"
}

issue_851_hoist_to_conflicting_name: {
    options = {
        hoist_props: true,
        reduce_vars: true,
        toplevel: true
    }
    input: {
        const BBB = { CCC: "PASS" }

        if (id(true)) {
            const BBB_CCC = BBB.CCC
            console.log(BBB_CCC)
        }
    }

    expect: {
        const BBB_CCC$0 = "PASS";

        if (id(true)) {
            const BBB_CCC = BBB_CCC$0;
            console.log(BBB_CCC);
        }
    }

    expect_stdout: "PASS"
}
