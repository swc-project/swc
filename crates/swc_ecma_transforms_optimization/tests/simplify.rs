//! Copied from PeepholeIntegrationTest from the google closure compiler.

#![deny(warnings)]

use swc_common::{pass::Repeat, Mark};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::{helpers::inject_helpers, resolver};
use swc_ecma_transforms_compat::{es2015, es2016, es2017, es2018, es2022::class_properties, es3};
use swc_ecma_transforms_module::{common_js::common_js, import_analysis::import_analyzer};
use swc_ecma_transforms_optimization::simplify::{
    dce::{self, dce},
    dead_branch_remover, expr_simplifier,
    inlining::{self, inlining},
};
use swc_ecma_transforms_proposal::decorators;
use swc_ecma_transforms_testing::{test, test_transform};
use swc_ecma_transforms_typescript::strip;

fn test(src: &str, expected: &str) {
    test_transform(
        ::swc_ecma_parser::Syntax::default(),
        None,
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            (
                resolver(unresolved_mark, top_level_mark, false),
                Repeat::new((
                    expr_simplifier(unresolved_mark, Default::default()),
                    inlining::inlining(Default::default()),
                    dead_branch_remover(unresolved_mark),
                    dce::dce(Default::default(), unresolved_mark),
                )),
            )
        },
        src,
        expected,
    )
}

fn test_same(src: &str) {
    test(src, src)
}

macro_rules! to {
    ($name:ident, $src:expr) => {
        test!(
            Default::default(),
            |_| {
                let unresolved_mark = Mark::new();
                let top_level_mark = Mark::new();

                (
                    resolver(unresolved_mark, top_level_mark, false),
                    Repeat::new((
                        expr_simplifier(unresolved_mark, Default::default()),
                        inlining::inlining(Default::default()),
                        dead_branch_remover(unresolved_mark),
                        dce::dce(Default::default(), unresolved_mark),
                    )),
                )
            },
            $name,
            $src
        );
    };
}

macro_rules! optimized_out {
    ($name:ident, $src:expr) => {
        to!($name, $src);
    };
}

to!(
    single_pass,
    "
    const a = 1;

    if (a) {
        const b = 2;
    }
    "
);

optimized_out!(issue_607, "let a");

to!(
    multi_run,
    "
let b = 2;

let a = 1;
if (b) { // Removed by first run of remove_dead_branch
    a = 2; // It becomes `flat assignment` to a on second run of inlining
}

let c;
if (a) { // Removed by second run of remove_dead_branch
    c = 3; // It becomes `flat assignment` to c on third run of inlining.
}
console.log(c); // Prevent optimizing out.
"
);

#[test]
#[ignore] // TODO
fn test_fold_one_child_blocks_integration() {
    test(
        "function f(){switch(foo()){default:{break}}}",
        "function f(){foo()}",
    );

    test(
        "function f(){switch(x){default:{break}}} use(f);",
        "function f(){} use(f);",
    );

    test(
        "function f(){switch(x){default:x;case 1:return 2}} use(f);",
        "function f(){switch(x){default:case 1:return 2}} use(f);",
    );

    // ensure that block folding does not break hook ifs
    test(
        "if(x){if(true){foo();foo()}else{bar();bar()}}",
        "if(x){foo();foo()}",
    );

    test(
        "if(x){if(false){foo();foo()}else{bar();bar()}}",
        "if(x){bar();bar()}",
    );

    // Cases where the then clause has no side effects.
    test("if(x()){}", "x()");

    test("if(x()){} else {x()}", "x()||x()");
    test("if(x){}", ""); // Even the condition has no side effect.
    test(
        "if(a()){A()} else if (b()) {} else {C()}",
        "a()?A():b()||C()",
    );

    test(
        "if(a()){} else if (b()) {} else {C()}",
        "a() || (b() || C())",
    );
    test(
        "if(a()){A()} else if (b()) {} else if (c()) {} else{D()}",
        "a() ? A() : b() || (c() || D())",
    );
    test(
        "if(a()){} else if (b()) {} else if (c()) {} else{D()}",
        "a() || (b() || (c() || D()))",
    );
    test(
        "if(a()){A()} else if (b()) {} else if (c()) {} else{}",
        "a()?A():b()||c()",
    );

    // Verify that non-global scope works.
    test("function foo(){if(x()){}}", "function foo(){x()}");
}

#[test]
#[ignore] // swc optimizes out everything
fn test_fold_one_child_blocks_string_compare() {
    test(
        "if (x) {if (y) { var x; } } else{ var z; }",
        "if (x) { if (y) var x } else var z",
    );
}

#[test]
fn test_necessary_dangling_else() {
    test(
        "if (x) if (y){ y(); z() } else; else x()",
        "if (x) { if(y) { y(); z() } } else x()",
    );
}

#[test]
#[ignore] // TODO
fn test_fold_returns_integration() {
    // if-then-else duplicate statement removal handles this case:
    test("function f(){if(x)return;else return}", "function f(){}");
}

#[test]
fn test_bug1059649() {
    // ensure that folding blocks with a single var node doesn't explode
    test(
        "if(x){var y=3;}var z=5; use(y, z)",
        "if(x)var y=3; use(y, 5)",
    );

    test(
        "for(var i=0;i<10;i++){var y=3;}var z=5; use(y, z)",
        "for(var i=0;i<10;i++)var y=3; use(y, 5)",
    );
    test(
        "for(var i in x){var y=3;}var z=5; use(y, z)",
        "for(var i in x)var y=3; use(y, 5)",
    );
    test(
        "do{var y=3;}while(x);var z=5; use(y, z)",
        "do var y=3;while(x); use(y, 5)",
    );
}

#[test]
#[ignore] // TODO
fn test_hook_if_integration() {
    test(
        "if (false){ x = 1; } else if (cond) { x = 2; } else { x = 3; }",
        "x=cond?2:3",
    );

    test("x?void 0:y()", "x||y()");
    test("!x?void 0:y()", "x&&y()");
    test("x?y():void 0", "x&&y()");
}

#[test]
#[ignore] // normalize
fn test_remove_duplicate_statements_integration() {
    test(
        concat!(
            "function z() {if (a) { return true }",
            "else if (b) { return true }",
            "else { return true }}",
        ),
        "function z() {return true;}",
    );

    test(
        concat!(
            "function z() {if (a()) { return true }",
            "else if (b()) { return true }",
            "else { return true }}",
        ),
        "function z() {a()||b();return true;}",
    );
}

#[test]
#[ignore] // TODO
fn test_fold_logical_op_integration() {
    test("if(x && true) z()", "x&&z()");
    test("if(x && false) z()", "");
    test("if(x || 3) z()", "z()");
    test("if(x || false) z()", "x&&z()");
    test("if(x==y && false) z()", "");
    test("if(y() || x || 3) z()", "y();z()");
}

#[test]
#[ignore] // TODO: This is a bug, but does anyone write code like this?
fn test_fold_bitwise_op_string_compare_integration() {
    test("for (;-1 | 0;) {}", "for (;;);");
}

#[test]
fn test_var_lifting_integration() {
    test("if(true);else var a;", "");
    test("if(false) foo();else var a;", "");
    test("if(true)var a;else;", "");
    test("if(false)var a;else;", "");
    test("if(false)var a,b;", "");
    test("if(false){var a;var a;}", "");
    test("if(false)var a=function(){var b};", "");

    // TODO(kdy1): We can optimize this.
    // test("if(a)if(false)var a;else var b;", "");
    test("if(a)if(false)var a;else var b;", "if(a) var a;");
}

#[test]
fn test_bug1438784() {
    test_same("for(var i=0;i<10;i++)if(x)x.y;");
}

#[test]
fn test_fold_useless_for_integration() {
    test("for(;!true;) { foo() }", "");
    test("for(;void 0;) { foo() }", "");
    // test("for(;undefined;) { foo() }", "");
    test("for(;1;) foo()", "for(;;) foo()");
    test("for(;!void 0;) foo()", "for(;;) foo()");

    // Make sure proper empty nodes are inserted.
    //    test("if(foo())for(;false;){foo()}else bar()", "foo()||bar()");
    test(
        "if(foo())for(;false;){foo()}else bar()",
        "if (foo()); else bar();",
    );
}

#[test]
fn test_fold_useless_do_integration() {
    test("do { foo() } while(!true);", "foo()");
    test("do { foo() } while(void 0);", "foo()");
    // test("do { foo() } while(undefined);", "foo()");
    test("do { foo() } while(!void 0);", "for(;;)foo();");

    // Make sure proper empty nodes are inserted.
    //    test(
    //        "if(foo())do {foo()} while(false) else bar()",
    //        "foo()?foo():bar()",
    //    );

    test(
        "if(foo())do {foo()} while(false) else bar()",
        "if (foo()) foo(); else bar();",
    );
}

#[test]
#[ignore] // TODO
fn test_minimize_expr() {
    test("!!true", "");

    test("!!x()", "x()");
    test("!(!x()&&!y())", "x()||y()");
    test("x()||!!y()", "x()||y()");

    /* This is similar to the !!true case */
    test("!!x()&&y()", "x()&&y()");
}

#[test]
fn test_bug_issue3() {
    test(
        concat!(
            "function foo() {",
            "  if(sections.length != 1) children[i] = 0;",
            "  else var selectedid = children[i]",
            "}",
            "foo()"
        ),
        concat!(
            "function foo() {",
            "  if(sections.length != 1) children[i] = 0;",
            "  else children[i]",
            "}",
            "foo()"
        ),
    );
}

#[test]
fn test_bug_issue43() {
    test_same("function foo() {\n  if (a) bar(); else a.b = 1; \n} use(foo);");
}

#[test]
fn test_fold_negative_bug() {
    test("for (;-3;){};", "for (;;);");
}

#[test]
#[ignore] // normalize
fn test_no_normalize_labeled_expr() {
    test_same("var x; foo:{x = 3;}");
    test_same("var x; foo:x = 3;");
}

#[test]
fn test_short_circuit1() {
    test("1 && a()", "a()");
}

#[test]
fn test_short_circuit2() {
    test("1 && a() && 2", "a()");
}

#[test]
fn test_short_circuit3() {
    test("a() && 1 && 2", "a()");
}

#[test]
#[ignore]
fn test_short_circuit4() {
    test("a() && (1 && b())", "a() && b()");
    test("a() && 1 && b()", "a() && b()");
    test("(a() && 1) && b()", "a() && b()");
}

#[test]
#[ignore] // TODO
fn test_minimize_expr_condition() {
    test("(x || true) && y()", "y()");
    test("(x || false) && y()", "x&&y()");
    test("(x && true) && y()", "x && y()");
    test("(x && false) && y()", "");
    test("a = x || false ? b : c", "a=x?b:c");
    test("do {x()} while((x && false) && y())", "x()");
}

// A few miscellaneous cases where one of the peephole passes increases the
// size, but it does it in such a way that a later pass can decrease it.
// Test to make sure the overall change is a decrease, not an increase.
#[test]
#[ignore] // TODO
fn test_misc() {
    test("use(x = [foo()] && x)", "use(x = (foo(),x))");
    test("x = foo() && false || bar()", "x = (foo(), bar())");
    test("if(foo() && false) z()", "foo()");
}

#[test]
#[ignore] // swc strips out whole of this
fn test_comma_spliting_constant_condition() {
    test("(b=0,b=1);if(b)x=b;", "b=0;b=1;x=b;");
    test("(b=0,b=1);if(b)x=b;", "b=0;b=1;x=b;");
}

#[test]
#[ignore]
fn test_avoid_comma_splitting() {
    test("x(),y(),z()", "x();y();z()");
}

#[test]
fn test_object_literal() {
    test("({})", "");
    test("({a:1})", "");
    test("({a:foo()})", "foo()");
    test("({'a':foo()})", "foo()");
}

#[test]
fn test_array_literal() {
    test("([])", "");
    test("([1])", "");
    test("([a])", "a");
    test("([foo()])", "foo()");
}

#[test]
#[ignore] // TODO
fn test_fold_ifs1() {
    test(
        "function f() {if (x) return 1; else if (y) return 1;}",
        "function f() {if (x||y) return 1;}",
    );
    test(
        "function f() {if (x) return 1; else {if (y) return 1; else foo();}}",
        "function f() {if (x||y) return 1; foo();}",
    );
}

#[test]
#[ignore] // TODO
fn test_fold_ifs2() {
    test(
        "function f() {if (x) { a(); } else if (y) { a() }}",
        "function f() {x?a():y&&a();}",
    );
}

#[test]
#[ignore] // TODO
fn test_fold_hook2() {
    test(
        "function f(a) {if (!a) return a; else return a;}",
        "function f(a) {return a}",
    );
}

#[test]
#[ignore] // TODO
fn test_template_strings_known_methods() {
    test("x = `abcdef`.indexOf('b')", "x = 1");
    test("x = [`a`, `b`, `c`].join(``)", "x='abc'");
    test("x = `abcdef`.substr(0,2)", "x = 'ab'");
    test("x = `abcdef`.substring(0,2)", "x = 'ab'");
    test("x = `abcdef`.slice(0,2)", "x = 'ab'");
    test("x = `abcdef`.charAt(0)", "x = 'a'");
    test("x = `abcdef`.charCodeAt(0)", "x = 97");
    test("x = `abc`.toUpperCase()", "x = 'ABC'");
    test("x = `ABC`.toLowerCase()", "x = 'abc'");
    //test("x = `\t\n\uFEFF\t asd foo bar \r\n`.trim()", "x = 'asd foo bar'");
    test("x = parseInt(`123`)", "x = 123");
    test("x = parseFloat(`1.23`)", "x = 1.23");
}

test!(
    Syntax::Typescript(TsSyntax {
        decorators: true,
        ..Default::default()
    }),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            class_properties(
                class_properties::Config {
                    set_public_fields: true,
                    ..Default::default()
                },
                unresolved_mark,
            ),
            dce(Default::default(), unresolved_mark),
            inlining(Default::default()),
        )
    },
    issue_1156_1,
    "
    interface D {
        resolve: any;
        reject: any;
    }

    function d(): D {
        let methods;
        const promise = new Promise((resolve, reject) => {
          methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }

    class A {
        private s: D = d();

        a() {
            this.s.resolve();
        }

        b() {
            this.s = d();
        }
    }

    new A();
    "
);

test!(
    Syntax::Es(Default::default()),
    |t| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            decorators(Default::default()),
            resolver(unresolved_mark, top_level_mark, false),
            strip(unresolved_mark, top_level_mark),
            class_properties(Default::default(), unresolved_mark),
            Repeat::new((
                expr_simplifier(unresolved_mark, Default::default()),
                inlining::inlining(Default::default()),
                dead_branch_remover(unresolved_mark),
                dce::dce(Default::default(), unresolved_mark),
            )),
            es2018(Default::default()),
            es2017(Default::default(), unresolved_mark),
            es2016(),
            es2015(
                unresolved_mark,
                Some(t.comments.clone()),
                Default::default(),
            ),
            es3(true),
            import_analyzer(false.into(), false),
            inject_helpers(unresolved_mark),
            common_js(
                Default::default(),
                Mark::fresh(Mark::root()),
                Default::default(),
                Default::default(),
            ),
        )
    },
    issue_389_3,
    "
import Foo from 'foo';
Foo.bar = true;
"
);

test!(
    Syntax::default(),
    |_| {
        let top_level_mark = Mark::fresh(Mark::root());

        expr_simplifier(top_level_mark, Default::default())
    },
    issue_1619_1,
    r#"
    "use strict";

    console.log("\x00" + "\x31");

    "#
);

test!(
    Syntax::default(),
    |_| {
        let top_level_mark = Mark::fresh(Mark::root());

        dead_branch_remover(top_level_mark)
    },
    issue_2466_1,
    "
    const X = {
        run() {
            console.log(this === globalThis);
        },
    };

    X.run();
    (0, X.run)();
    "
);

test!(
    Syntax::default(),
    |_| {
        let top_level_mark = Mark::fresh(Mark::root());

        dead_branch_remover(top_level_mark)
    },
    issue_4272,
    "
    function oe() {
        var e, t;
        return t !== i && (e, t = t), e = t;
    }
    "
);

test!(
    Syntax::default(),
    |_| {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        (
            resolver(unresolved_mark, top_level_mark, false),
            Repeat::new((
                inlining(Default::default()),
                dead_branch_remover(unresolved_mark),
            )),
        )
    },
    issue_4173,
    "
function emit(type) {
    const e = events[type];
    if (Array.isArray(e)) {
        for (let i = 0; i < e.length; i += 1) {
            e[i].apply(this);
        }
    }
}
"
);
