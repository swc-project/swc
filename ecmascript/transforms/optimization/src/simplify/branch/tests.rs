use super::{super::expr_simplifier, dead_branch_remover};
use swc_common::chain;

macro_rules! test_stmt {
    ($l:expr, $r:expr) => {
        swc_ecma_transforms_testing::test_transform(
            ::swc_ecma_parser::Syntax::default(),
            |_| chain!(expr_simplifier(), dead_branch_remover()),
            $l,
            $r,
            true,
        )
    };
    ($l:expr, $r:expr,) => {
        test_expr!($l, $r);
    };
}

fn test(src: &str, expected: &str) {
    test_stmt!(src, expected)
}

/// Should not modify expression.
fn test_same(s: &str) {
    test(s, s)
}

// /// Should not modify expression.
// macro_rules! same_stmt {
//     ($l:expr) => {
//         test_stmt!($l, $l)
//     };
// }

/// Ensures that it is removed.
macro_rules! compiled_out {
    ($src:expr) => {
        test_stmt!($src, "")
    };
}

#[test]
fn usage() {
    test_stmt!("use(8+8);", "use(16);");
}

#[test]
fn compiled_out_simple() {
    compiled_out!(";");
    compiled_out!("8;");
    compiled_out!("8+8;");
}

#[test]
fn test_remove_no_op_labelled_statement() {
    test("a: break a;", "");
    test("a: { break a; }", "");

    test("a: { break a; console.log('unreachable'); }", "");
    test(
        "a: { break a; var x = 1; } x = 2;",
        "a: { var x; break a; } x = 2; ",
    );

    test("b: { var x = 1; } x = 2;", "b: var x = 1; x = 2;");
    test("a: b: { var x = 1; } x = 2;", "a: b: var x = 1; x = 2;");
}

#[test]
fn test_fold_block() {
    test("{{foo()}}", "foo()");
    test("{foo();{}}", "foo()");
    test("{{foo()}{}}", "foo()");
    test("{{foo()}{bar()}}", "foo();bar()");
    test("{if(false)foo(); {bar()}}", "bar()");
    test("{if(false)if(false)if(false)foo(); {bar()}}", "bar()");

    test("{'hi'}", "");
    test("{x==3}", "");
    test("{`hello ${foo}`}", "");
    test("{ (function(){x++}) }", "");
    test_same("function f(){return;}");
    test("function f(){return 3;}", "function f(){return 3}");
    test_same("function f(){if(x)return; x=3; return; }");
    test("{x=3;;;y=2;;;}", "x=3;y=2");

    // Cases to test for empty block.
    test("while(x()){x}", "while(x());");
    test("while(x()){x()}", "while(x())x()");
    test("for(x=0;x<100;x++){x}", "for(x=0;x<100;x++);");
    test("for(x in y){x}", "for(x in y);");
    test("for (x of y) {x}", "for(x of y);");
    test_same("for (let x = 1; x <10; x++ );");
    test_same("for (var x = 1; x <10; x++ );");
}

#[test]
fn test_fold_block_with_declaration() {
    test_same("{let x}");
    test_same("function f() {let x}");
    test_same("{const x = 1}");
    test_same("{x = 2; y = 4; let z;}");
    test("{'hi'; let x;}", "{let x}");
    test("{x = 4; {let y}}", "x = 4; {let y}");
    test_same("{class C {}} {class C {}}");
    test("{label: var x}", "label: var x");
    // `{label: let x}` is a syntax error
    test_same("{label: var x; let y;}");
}

#[test]
/// Try to remove spurious blocks with multiple children
fn test_fold_blocks_with_many_children() {
    test("function f() { if (false) {} }", "function f(){}");
    test(
        "function f() { { if (false) {} if (true) {} {} } }",
        "function f(){}",
    );
    test(
        "{var x; var y; var z; class Foo { constructor() { var a; { var b; } } } }",
        "{var x;var y;var z;class Foo { constructor() { var a;var b} } }",
    );
    test(
        "{var x; var y; var z; { { var a; { var b; } } } }",
        "var x;var y;var z; var a;var b",
    );
}

#[test]
fn test_if() {
    test("if (1){ x=1; } else { x = 2;}", "x=1");
    test("if (false){ x = 1; } else { x = 2; }", "x=2");
    test("if (undefined){ x = 1; } else { x = 2; }", "x=2");
    test("if (null){ x = 1; } else { x = 2; }", "x=2");
    test("if (void 0){ x = 1; } else { x = 2; }", "x=2");
    test("if (void foo()){ x = 1; } else { x = 2; }", "foo();x=2");
    test(
        "if (false){ x = 1; } else if (true) { x = 3; } else { x = 2; }",
        "x=3",
    );
    test("if (x){ x = 1; } else if (false) { x = 3; }", "if(x)x=1");
    test_same(concat!(
        "if (x) {",
        "  if (y) log(1);",
        "  else if (z) log(2);",
        "} else log(3);",
    ));
    test_same("if (0 | x) y = 1; else y = 2;");
    test("if (1 | x) y = 1; else y = 2;", "y=1;");
    test("if (0 & x) y = 1; else y = 2;", "y=2");
    test_same("if (1 & x) y = 1; else y = 2;");
}

#[test]
fn test_hook() {
    test("true ? a() : b()", "a()");
    test("false ? a() : b()", "b()");

    test("a() ? b() : true", "a() && b()");
    test("a() ? true : b()", "a() || b()");

    test("(a = true) ? b() : c()", "a = true, b()");
    test("(a = false) ? b() : c()", "a = false, c()");
    test(
        "do {f()} while((a = true) ? b() : c())",
        "do f(); while(a = true , b())",
    );
    test(
        "do {f()} while((a = false) ? b() : c())",
        "do f(); while(a = false , c())",
    );

    test("var x = (true) ? 1 : 0", "var x=1");
    test(
        "var y = (true) ? ((false) ? 12 : (cond ? 1 : 2)) : 13",
        "var y=cond?1:2",
    );

    test_same("var z=x?void 0:y()");
    test_same("z=x?void 0:y()");
    test_same("z*=x?void 0:y()");

    test_same("var z=x?y():void 0");
    test_same("(w?x:void 0).y=z");
    test_same("(w?x:void 0).y+=z");

    test("y = (x ? void 0 : void 0)", "y = void 0");
}

#[test]
#[ignore]
fn test_hook_extra() {
    test("y = (x ? f() : f())", "y = f()");
    test("(function(){}) ? function(){} : function(){}", "");
}

#[test]
fn test_constant_condition_with_side_effect1() {
    test("if (b=true) x=1;", "b=true;x=1");
    test("if (b=/ab/) x=1;", "b=/ab/;x=1");
    test("if (b=/ab/){ x=1; } else { x=2; }", "b=/ab/;x=1");
    // test("var b;b=/ab/;if(b)x=1;", "var b;b=/ab/;x=1");
    test_same("var b;b=f();if(b)x=1;");
    // test("var b=/ab/;if(b)x=1;", "var b=/ab/;x=1");
    test_same("var b=f();if(b)x=1;");
    test_same("b=b++;if(b)x=b;");
    test("(b=0,b=1);if(b)x=b;", "b=0,b=1;if(b)x=b;");
    // test("b=1;if(foo,b)x=b;", "b=1;x=b;");
    test_same("b=1;if(foo=1,b)x=b;");
}

#[test]
fn test_constant_condition_with_side_effect2() {
    test("(b=true)?x=1:x=2;", "b=true,x=1");
    test("(b=false)?x=1:x=2;", "b=false,x=2");
    test("if (b=/ab/) x=1;", "b=/ab/;x=1");
    // test("var b;b=/ab/;(b)?x=1:x=2;", "var b;b=/ab/;x=1");
    test_same("var b;b=f();b?x=1:x=2;");
    // test("var b=/ab/;(b)?x=1:x=2;", "var b=/ab/;x=1");
    test_same("var b=f();b?x=1:x=2;");
}

#[test]
fn test_var_lifting() {
    test("if(true)var a", "var a");
    test("if(false)var a", "var a");

    // More var lifting tests in PeepholeIntegrationTests
}

#[test]
fn test_let_const_lifting() {
    test("if(true) {const x = 1}", "{const x = 1}");
    test("if(false) {const x = 1}", "");
    test("if(true) {let x}", "{let x}");
    test("if(false) {let x}", "");
}

#[test]
fn test_fold_useless_for() {
    test("for(;false;) { foo() }", "");
    test("for(;void 0;) { foo() }", "");
    test("for(;undefined;) { foo() }", "");
    test("for(;true;) foo() ", "for(;;) foo() ");
    test_same("for(;;) foo()");
    test("for(;false;) { var a = 0; }", "var a");
    test("for(;false;) { const a = 0; }", "");
    test("for(;false;) { let a = 0; }", "");

    // Make sure it plays nice with minimizing
    test("for(;false;) { foo(); continue }", "");
}

#[test]
fn test_fold_useless_do_1() {
    test("do { foo() } while(false);", "foo()");
    test("do { foo() } while(void 0);", "foo()");
    test("do { foo() } while(undefined);", "foo()");
    test("do { foo() } while(true);", "for(;;) foo();");
    test("do { var a = 0; } while(false);", "var a=0");
}

#[test]
#[ignore]
fn test_fold_useless_do_2() {
    // Can't fold with break or continues.
    test("do { foo(); continue; } while(0)", "foo();");
}

#[test]
fn test_fold_useless_do_3() {
    test(
        "do { try { foo() } catch (e) { break; } } while (0);",
        "try { foo(); } catch (e) { break; }",
    );
    test("do { foo(); break; } while(0)", "foo();");
    test(
        "do { for (;;) {foo(); continue;} } while(0)",
        "for (;;) {foo(); continue;}",
    );
    test(
        "l1: do { for (;;) { foo() } } while(0)",
        "l1: for(;;) foo();",
    );
    test(
        "do { switch (1) { default: foo(); break} } while(0)",
        "foo();",
    );
    test(
        "do { switch (1) { default: foo(); continue} } while(0)",
        "foo();",
    );

    test(
        "l1: { do { x = 1; break l1; } while (0); x = 2; }",
        "l1: { x = 1; break l1; x = 2;}",
    );
}

#[test]
#[ignore]
fn test_fold_useless_do_extra() {
    test("do { x = 1; } while (x = 0);", "x = 1; x = 0;");
    test(
        "let x = 1; (function() { do { let x = 2; } while (x = 10, false); })();",
        "let x = 1; (function() { { let x = 2 } x = 10 })();",
    );
}

#[test]
fn test_fold_empty_do() {
    test("do { } while(true);", "for (;;);");
}

#[test]
fn test_minimize_loop_with_constant_condition_vanilla_for() {
    test("for(;true;) foo()", "for(;;) foo()");
    test("for(;0;) foo()", "");
    test("for(;0.0;) foo()", "");
    test("for(;NaN;) foo()", "");
    test("for(;null;) foo()", "");
    test("for(;undefined;) foo()", "");
    test("for(;'';) foo()", "");
}

#[test]
fn test_minimize_loop_with_constant_condition_do_while() {
    test("do { foo(); } while (true)", "for(;;)foo();");
    test("do { foo(); } while (0)", "foo();");
    test("do { foo(); } while (0.0)", "foo();");
    test("do { foo(); } while (NaN)", "foo();");
    test("do { foo(); } while (null)", "foo();");
    test("do { foo(); } while (undefined)", "foo();");
    test("do { foo(); } while ('')", "foo();");
}

#[test]
fn test_fold_constant_comma_expressions() {
    test("if (true, false) {foo()}", "");
    test("if (false, true) {foo()}", "foo()");
    test("true, foo()", "foo()");
    test("(1 + 2 + ''), foo()", "foo()");
}

#[test]
fn test_remove_useless_ops1() {
    test_same("(function () { f(); })();");
}

#[test]
fn test_remove_useless_ops2() {
    // There are four place where expression results are discarded:
    //  - a top-level expression EXPR_RESULT
    //  - the LHS of a COMMA
    //  - the FOR init expression
    //  - the FOR increment expression

    // Known side-effect free functions calls are removed.
    test("Math.random()", "");
    test("Math.random(f() + g())", "f(),g();");
    test("Math.random(f(),g(),h())", "f(),g(),h();");

    // Calls to functions with unknown side-effects are are left.
    test_same("f();");
    test_same("(function () { f(); })();");

    // We know that this function has no side effects because of the
    // PureFunctionIdentifier.
    test("(function () {})();", "");

    // Uncalled function expressions are removed
    test("(function () {});", "");
    test("(function f() {});", "");
    test("(function* f() {})", "");
    // ... including any code they contain.
    test("(function () {foo();});", "");

    // Useless operators are removed.
    test("+f()", "f()");
    test("a=(+f(),g())", "a=(f(),g())");
    test("a=(true,g())", "a=g()");
    test("f(),true", "f()");
    test("f() + g()", "f(),g()");

    test("for(;;+f()){}", "for(;;f());");
    test("for(+f();;g()){}", "for(f();;g());");
    test("for(;;Math.random(f(),g(),h())){}", "for(;;f(),g(),h());");

    // The optimization cascades into conditional expressions:
    test("g() && +f()", "g() && f()");
    test("g() || +f()", "g() || f()");
    test("x ? g() : +f()", "x ? g() : f()");

    test("+x()", "x()");
    test("+x() * 2", "x()");
    test("-(+x() * 2)", "x()");
    test("2 -(+x() * 2)", "x()");
    //test("x().foo", "x()");
    test_same("x().foo()");

    test_same("x++");
    test_same("++x");
    test_same("x--");
    test_same("--x");
    test_same("x = 2");
    test_same("x *= 2");

    // Sanity check, other expression are left alone.
    test_same("function f() {}");
    test_same("var x;");
}

#[test]
fn test_optimize_switch_1() {
    test("switch(a){}", "");
    test("switch(foo()){}", "foo()");
    test("switch(a){default:}", "");
    test("switch(a){default:break;}", "");
    test("switch(a){default:var b;break;}", "var b");
    test("switch(a){case 1: default:}", "");
    test("switch(a){default: case 1:}", "");
    test("switch(a){default: break; case 1:break;}", "");
    //test(
    //    "switch(a){default: var b; break; case 1: var c; break;}",
    //    "var c; var b;",
    //);
    //test("var x=1; switch(x) { case 1: var y; }", "var y; var x=1;");

    // Can't remove cases if a default exists and is not the last case.
    test_same("function f() {switch(a){default: return; case 1: break;}}");
    test(
        "function f() {switch(1){default: return; case 1: break;}}",
        "function f() {}",
    );
    test_same("function f() {switch(a){case 1: foo();}}");
    test_same("function f() {switch(a){case 3: case 2: case 1: foo();}}");

    test(
        "function f() {switch(a){case 2: case 1: default: foo();}}",
        "function f() { foo(); }",
    );
    //test(
    //    "switch(a){case 1: default:break; case 2: foo()}",
    //    "switch(a){case 2: foo()}",
    //);
    test_same("switch(a){case 1: goo(); default:break; case 2: foo()}");

    // TODO(johnlenz): merge the useless "case 2"
    test_same("switch(a){case 1: goo(); case 2:break; case 3: foo()}");

    // Can't remove unused code with a "var" in it.
    test("switch(1){case 2: var x=0;}", "var x;");
    test(
        "switch ('repeated') {\ncase 'repeated':\n  foo();\n  break;\ncase 'repeated':\n  var \
         x=0;\n  break;\n}",
        "foo(); var x;",
    );

    // Can't remove cases if something useful is done.
    test_same("switch(a){case 1: var c =2; break;}");
    test_same("function f() {switch(a){case 1: return;}}");
    test_same("x:switch(a){case 1: break x;}");

    test(
        "switch ('foo') {\ncase 'foo':\n  foo();\n  break;\ncase 'bar':\n  bar();\n  break;\n}",
        "foo();",
    );
    test(
        "switch ('noMatch') {\ncase 'foo':\n  foo();\n  break;\ncase 'bar':\n  bar();\n  break;\n}",
        "",
    );
}

#[test]
#[ignore]
fn test_optimize_switch_2() {
    test(
        concat!(
            "switch ('fallThru') {",
            "case 'fallThru':",
            "  if (foo(123) > 0) {",
            "    foobar(1);",
            "    break;",
            "  }",
            "  foobar(2);",
            "case 'bar':",
            "  bar();",
            "}",
        ),
        concat!(
            "switch ('fallThru') {",
            "case 'fallThru':",
            "  if (foo(123) > 0) {",
            "    foobar(1);",
            "    break;",
            "  }",
            "  foobar(2);",
            "  bar();",
            "}",
        ),
    );
}

#[test]
#[ignore]
fn test_optimize_switch_3() {
    test(
        concat!(
            "switch ('fallThru') {",
            "case 'fallThru':",
            "  foo();",
            "case 'bar':",
            "  bar();",
            "}",
        ),
        concat!("foo();", "bar();"),
    );
}

#[test]
fn test_optimize_switch_4() {
    test(
        "switch ('repeated') {\ncase 'repeated':\n  foo();\n  break;\ncase 'repeated':\n  \
         bar();\n  break;\n}",
        "foo();",
    );
    test(
        "switch ('foo') {\ncase 'bar':\n  bar();\n  break;\ncase notConstant:\n  foobar();\n  \
         break;\ncase 'foo':\n  foo();\n  break;\n}",
        "switch ('foo') {\ncase notConstant:\n  foobar();\n  break;\ncase 'foo':\n  foo();\n  \
         break;\n}",
    );
    test(
        "switch (1) {\ncase 1:\n  foo();\n  break;\ncase 2:\n  bar();\n  break;\n}",
        "foo();",
    );
    test(
        "switch (1) {\ncase 1.1:\n  foo();\n  break;\ncase 2:\n  bar();\n  break;\n}",
        "",
    );
    test(
        "switch (0) {\ncase NaN:\n  foobar();\n  break;\ncase -0.0:\n  foo();\n  break;\ncase \
         2:\n  bar();\n  break;\n}",
        "foo();",
    );
    // test_same("switch ('\\v') {\ncase '\\u000B':\n  foo();\n}");
    test(
        concat!(
            "switch ('empty') {",
            "case 'empty':",
            "case 'foo':",
            "  foo();",
            "}",
        ),
        "foo()",
    );

    // TODO:
    //test(
    //    concat!(
    //        "let x;", //
    //        "switch (use(x)) {",
    //        "  default: {let y;}",
    //        "}",
    //    ),
    //    concat!(
    //        "let x;", //
    //        "use(x);", "{let y}",
    //    ),
    //);

    test(
        concat!(
            "let x;", //
            "switch (use(x)) {",
            "  default: {let y;}",
            "}",
        ),
        concat!(
            "let x;", //
            "use(x); { let y; }",
        ),
    );

    test(
        concat!(
            "let x;", //
            "switch (use(x)) {",
            "  default: let y;",
            "}",
        ),
        concat!(
            "let x;", //
            "{ use(x); let y; }",
        ),
    );
}

#[test]
fn test_optimize_switch_bug11536863() {
    test(
        "outer: {  switch (2) {\n    case 2:\n      f();\n      break outer;\n  }}",
        "outer: {f(); break outer;}",
    );
}

#[test]
fn test_optimize_switch2() {
    test(
        "outer: switch (2) {\n  case 2:\n    f();\n    break outer;\n}",
        "outer: {f(); break outer;}",
    );
}

#[test]
fn test_optimize_switch3() {
    test(
        concat!(
            "switch (1) {",
            "  case 1:",
            "  case 2:",
            "  case 3: {",
            "    break;",
            "  }",
            "  case 4:",
            "  case 5:",
            "  case 6:",
            "  default:",
            "    fail('Should not get here');",
            "    break;",
            "}",
        ),
        "",
    );
}

#[test]
fn test_optimize_switch_with_labelless_break() {
    test(
        concat!(
            "function f() {",
            "  switch('x') {",
            "    case 'x': var x = 1; break;",
            "    case 'y': break;",
            "  }",
            "}",
        ),
        "function f() { var x = 1; }",
    );

    // TODO(moz): Convert this to an if statement for better optimization
    test_same(concat!(
        "function f() {",
        "  switch(x) {",
        "    case 'y': break;",
        "    default: var x = 1;",
        "  }",
        "}",
    ));

    test(
        concat!(
            "var exit;",
            "switch ('a') {",
            "  case 'a':",
            "    break;",
            "  default:",
            "    exit = 21;",
            "    break;",
            "}",
            "switch(exit) {",
            "  case 21: throw 'x';",
            "  default : console.log('good');",
            "}",
        ),
        concat!(
            "var exit;",
            "switch(exit) {",
            "  case 21: throw 'x';",
            "  default : console.log('good');",
            "}",
        ),
    );

    test(
        concat!(
            "let x = 1;",
            "switch('x') {",
            "  case 'x': let x = 2; break;",
            "}",
        ),
        concat!("let x = 1;", "{let x = 2}"),
    );
}

#[test]
fn test_optimize_switch_with_labelled_break() {
    test(
        concat!(
            "function f() {",
            "  label:",
            "  switch('x') {",
            "    case 'x': break label;",
            "    case 'y': throw f;",
            "  }",
            "}",
        ),
        "function f() { }",
    );

    test(
        concat!(
            "function f() {",
            "  label:",
            "  switch('x') {",
            "    case 'x': break label;",
            "    default: throw f;",
            "  }",
            "}",
        ),
        "function f() { }",
    );
}

#[test]
fn test_optimize_switch_with_return() {
    test(
        concat!(
            "function f() {",
            "  switch('x') {",
            "    case 'x': return 1;",
            "    case 'y': return 2;",
            "  }",
            "}",
        ),
        "function f() { return 1; }",
    );

    test(
        concat!(
            "function f() {",
            "  let x = 1;",
            "  switch('x') {",
            "    case 'x': { let x = 2; } return 3;",
            "    case 'y': return 4;",
            "  }",
            "}",
        ),
        concat!(
            "function f() {",
            "  let x = 1;",
            "  { let x = 2; } return 3; ",
            "}",
        ),
    );
}

#[test]
fn test_optimize_switch_with_throw() {
    test(
        concat!(
            "function f() {",
            "  switch('x') {",
            "    case 'x': throw f;",
            "    case 'y': throw f;",
            "  }",
            "}",
        ),
        "function f() { throw f; }",
    );
}

#[test]
fn test_optimize_switch_with_continue() {
    test(
        concat!(
            "function f() {",
            "  for (;;) {",
            "    switch('x') {",
            "      case 'x': continue;",
            "      case 'y': continue;",
            "    }",
            "  }",
            "}",
        ),
        "function f() { for (;;) continue; }",
    );
}

#[test]
#[ignore]
fn test_optimize_switch_with_default_case_with_fallthru() {
    test(
        concat!(
            "function f() {",
            "  switch(a) {",
            "    case 'x':",
            "    case foo():",
            "    default: return 3",
            "  }",
            "}",
        ),
        "foo()",
    );
}

// GitHub issue #1722: https://github.com/google/closure-compiler/issues/1722
#[test]
fn test_optimize_switch_with_default_case() {
    test(
        concat!(
            "function f() {",
            "  switch('x') {",
            "    case 'x': return 1;",
            "    case 'y': return 2;",
            "    default: return 3",
            " }",
            "}",
        ),
        "function f() { return 1; }",
    );

    test(
        concat!(
            "switch ('hasDefaultCase') {",
            "  case 'foo':",
            "    foo();",
            "    break;",
            "  default:",
            "    bar();",
            "    break;",
            "}",
        ),
        "bar();",
    );

    test_same("switch (x) { default: if (a) break; bar(); }");

    // Potentially foldable
    test(
        concat!(
            "switch (x) {",
            "  case x:",
            "    foo();",
            "    break;",
            "  default:",
            "    if (a) { break; }",
            "    bar();",
            "}",
        ),
        "foo()",
    );

    test(
        concat!(
            "switch ('hasDefaultCase') {",
            "  case 'foo':",
            "    foo();",
            "    break;",
            "  default:",
            "    if (true) { break; }",
            "    bar();",
            "}",
        ),
        "",
    );

    test(
        concat!(
            "switch ('hasDefaultCase') {",
            "  case 'foo':",
            "    foo();",
            "    break;",
            "  default:",
            "    if (a) { break; }",
            "    bar();",
            "}",
        ),
        "switch ('hasDefaultCase') { default: if (a) break; bar(); }",
    );

    test(
        concat!(
            "l: switch ('hasDefaultCase') {",
            "  case 'foo':",
            "    foo();",
            "    break;",
            "  default:",
            "    if (a) { break l; }",
            "    bar();",
            "    break;",
            "}",
        ),
        "l:{ if (a) break l; bar(); }",
    );

    test(
        concat!(
            "switch ('hasDefaultCase') {",
            "  case 'foo':",
            "    bar();",
            "    break;",
            "  default:",
            "    foo();",
            "    break;",
            "}",
        ),
        "foo();",
    );

    test("switch (a()) { default: bar(); break;}", "a(); bar();");

    test("switch (a()) { default: break; bar();}", "a();");

    test(
        concat!(
            "loop: ",
            "for (;;) {",
            "  switch (a()) {",
            "    default:",
            "      bar();",
            "      break loop;",
            "  }",
            "}",
        ),
        "loop: for (;;) { a(); bar(); break loop; }",
    );
}

#[test]
fn test_remove_number() {
    test("3", "");
}

#[test]
fn test_remove_var_get1() {
    test("a", "");
}

#[test]
fn test_remove_var_get2() {
    test("var a = 1;a", "var a = 1");
}

#[test]
#[ignore]
fn test_remove_namespace_get1() {
    test("var a = {};a.b", "var a = {}");
}

#[test]
#[ignore]
fn test_remove_namespace_get2() {
    test("var a = {};a.b=1;a.b", "var a = {};a.b=1");
}

#[test]
#[ignore]
fn test_remove_prototype_get1() {
    test("var a = {};a.prototype.b", "var a = {}");
}

#[test]
#[ignore]
fn test_remove_prototype_get2() {
    test(
        "var a = {};a.prototype.b = 1;a.prototype.b",
        "var a = {};a.prototype.b = 1",
    );
}

#[test]
fn test_remove_add1() {
    test("1 + 2", "");
}

#[test]
fn test_no_remove_var1() {
    test_same("var a = 1");
}

#[test]
fn test_no_remove_var2() {
    test_same("var a = 1, b = 2");
}

#[test]
fn test_no_remove_assign1() {
    test_same("a = 1");
}

#[test]
fn test_no_remove_assign2() {
    test_same("a = b = 1");
}

#[test]
fn test_no_remove_assign3() {
    test("1 + (a = 2)", "a = 2");
}

#[test]
fn test_no_remove_assign4() {
    test_same("x.a = 1");
}

#[test]
fn test_no_remove_assign5() {
    test_same("x.a = x.b = 1");
}

#[test]
fn test_no_remove_assign6() {
    test("1 + (x.a = 2)", "x.a = 2");
}

#[test]
fn test_no_remove_call1() {
    test_same("a()");
}

#[test]
fn test_no_remove_call2() {
    test("a()+b()", "a(),b()");
}

#[test]
fn test_no_remove_call3() {
    test_same("a() && b()");
}

#[test]
fn test_no_remove_call4() {
    test_same("a() || b()");
}

#[test]
fn test_no_remove_call5() {
    test("a() || 1", "a()");
}

#[test]
fn test_no_remove_call6() {
    test("1 || a()", "");
}

#[test]
fn test_no_remove_throw1() {
    test_same("function f(){throw a()}");
}

#[test]
fn test_no_remove_throw2() {
    test_same("function f(){throw a}");
}

#[test]
fn test_no_remove_throw3() {
    test_same("function f(){throw 10}");
}

#[test]
fn test_remove_in_control_structure1() {
    test("if(x()) 1", "x()");
}

#[test]
fn test_remove_in_control_structure3() {
    test("for(1;2;3) 4", "for(;;);");
}

#[test]
fn test_hook1() {
    test("1 ? 2 : 3", "");
}

#[test]
fn test_hook2() {
    test("x ? a() : 3", "x && a()");
}

#[test]
fn test_hook3() {
    test("x ? 2 : a()", "x || a()");
}

#[test]
fn test_hook4() {
    test_same("x ? a() : b()");
}

#[test]
fn test_hook5() {
    test("a() ? 1 : 2", "a()");
}

#[test]
fn test_hook6() {
    test("a() ? b() : 2", "a() && b()");
}

// TODO(johnlenz): Consider adding a post optimization pass to
// convert OR into HOOK to save parentheses when the operator
// precedents would require them.
#[test]
fn test_hook7() {
    test("a() ? 1 : b()", "a() || b()");
}

#[test]
fn test_hook8() {
    test_same("a() ? b() : c()");
}

#[test]
fn test_hook9() {
    test("true ? a() : (function f() {})()", "a()");
    test(
        "false ? a() : (function f() {alert(x)})()",
        "(function f() {alert(x)})()",
    );
}

#[test]
fn test_hook10() {
    test("((function () {}), true) ? a() : b()", "a()");
    test(
        "((function () {alert(x)})(), true) ? a() : b()",
        "(function(){alert(x)})(),a()",
    );
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
fn test_short_circuit4() {
    test_same("a() && 1 && b()");
}

#[test]
fn test_complex1() {
    test("1 && a() + b() + c()", "a(), b(), c()");
}

#[test]
fn test_complex2() {
    test("1 && (a() ? b() : 1)", "a() && b()");
}

#[test]
fn test_complex3() {
    test("1 && (a() ? b() : 1 + c())", "a() ? b() : c()");
}

#[test]
fn test_complex4() {
    test("1 && (a() ? 1 : 1 + c())", "a() || c()");
}

#[test]
fn test_complex5() {
    // can't simplify LHS of short circuit statements with side effects
    test_same("(a() ? 1 : 1 + c()) && foo()");
}

#[test]
fn test_no_remove_function_declaration1() {
    test_same("function foo(){}");
}

#[test]
fn test_no_remove_function_declaration2() {
    test_same("var foo = function (){}");
}

#[test]
fn test_no_simplify_function_args1() {
    test("f(1 + 2, 3 + g())", "f(3, 3 + g())");
}

#[test]
fn test_no_simplify_function_args2() {
    test("1 && f(1 + 2, 3 + g())", "f(3, 3 + g())");
}

#[test]
fn test_no_simplify_function_args3() {
    test("1 && foo(a() ? b() : 1 + c())", "foo(a() ? b() : 1 + c())");
}

#[test]
fn test_no_remove_inherits1() {
    test_same("var a = {}; this.b = {}; var goog = {}; goog.inherits(b, a)");
}

#[test]
fn test_no_remove_inherits2() {
    test(
        "var a = {}; this.b = {}; var goog = {}; goog.inherits(b, a) + 1",
        "var a = {}; this.b = {}; var goog = {}; goog.inherits(b, a)",
    );
}

#[test]
fn test_no_remove_inherits3() {
    test_same("this.a = {}; var b = {}; b.inherits(a);");
}

#[test]
fn test_no_remove_inherits4() {
    test(
        "this.a = {}; var b = {}; b.inherits(a) + 1;",
        "this.a = {}; var b = {}; b.inherits(a)",
    );
}

#[test]
fn test_remove_from_label1() {
    test("LBL: void 0", "");
}

#[test]
fn test_remove_from_label2() {
    test("LBL: foo() + 1 + bar()", "LBL: foo(),bar()");
}

#[test]
fn test_call() {
    test_same("foo(0)");
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("Math.sin(0);", "");
    test("1 + Math.sin(0);", "");
}

#[test]
fn test_call_containing_spread() {
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("Math.sin(...c)", "[...c]");
    test("Math.sin(4, ...c, a)", "[...c]");
    test("Math.sin(foo(), ...c, bar())", "[foo(), ...c, bar()]");
    test("Math.sin(...a, b, ...c)", "[...a, ...c]");
    test("Math.sin(...b, ...c)", "[...b, ...c]");
}

#[test]
fn test_new() {
    test_same("new foo(0)");
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("new Date;", "");
    test("1 + new Date;", "");
}

#[test]
fn test_new_containing_spread_1() {
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("new Date(...c)", "[...c]");
    test("new Date(4, ...c, a)", "[...c]");
    test("new Date(...a, b, ...c)", "[...a, ...c]");
    test("new Date(...b, ...c)", "[...b, ...c]");
}

#[test]
#[ignore]
fn test_new_containing_spread_2() {
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("new Date(foo(), ...c, bar())", "(foo(), [...c], bar())");
}

#[test]
fn test_tagged_template_lit_simple_template() {
    test_same("foo`Simple`");
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("Math.sin`Simple`", "");
    test("1 + Math.sin`Simple`", "");
}

#[test]
fn test_tagged_template_lit_substituting_template() {
    test_same("foo`Complex ${butSafe}`");
    // We use a function with no side-effects, otherwise the entire invocation would
    // be preserved.
    test("Math.sin`Complex ${butSafe}`", "");
    test("Math.sin`Complex ${andDangerous()}`", "andDangerous()");
}

#[test]
fn test_fold_assign() {
    test("x=x", "");
    test_same("x=xy");
    test_same("x=x + 1");
    test_same("x.a=x.a");
    test("var y=(x=x)", "var y=x");
    test("y=1 + (x=x)", "y=1 + x");
}

#[test]
fn test_try_catch_finally() {
    test_same("try {foo()} catch (e) {bar()}");
    test_same("try { try {foo()} catch (e) {bar()}} catch (x) {bar()}");
    test("try {var x = 1} finally {}", "var x = 1;");
    test_same("try {var x = 1} finally {x()}");
    test(
        "function f() { return; try{var x = 1}finally{} }",
        "function f() { var x; return; }",
    );
    test("try {} finally {x()}", "x()");
    test("try {} catch (e) { bar()} finally {x()}", "x()");
    test("try {} catch (e) { bar()}", "");
    test(
        "try {} catch (e) { var a = 0; } finally {x()}",
        "var a; x()",
    );
    test("try {} catch (e) {}", "");
    test("try {} finally {}", "");
    test("try {} catch (e) {} finally {}", "");
}

#[test]
fn test_object_literal() {
    test("({})", "");
    test("({a:1})", "");
    test("({a:foo()})", "foo()");
    test("({'a':foo()})", "foo()");
    test("({}).foo", "({}).foo");
    // Object-spread may trigger getters.
    test_same("({...a})");
    test_same("({...foo()})");
}

#[test]
fn test_array_literal() {
    test("([])", "");
    test("([1])", "");
    test("([a])", "");
    test("([foo()])", "foo()");
}

#[test]
fn test_array_literal_containing_spread() {
    test("([...c])", "[...c]");
    test("([4, ...c, a])", "[...c]");
    test("([foo(), ...c, bar()])", "[foo(), ...c, bar()]");
    test("([...a, b, ...c])", "[...a, ...c]");
    test("([...b, ...c])", "[...b, ...c]");
}

#[test]
fn test_await() {
    test_same("async function f() { await something(); }");
    test_same("async function f() { await some.thing(); }");
}

#[test]
fn test_empty_pattern_in_declaration_removed_1() {
    test("var [] = [];", "");
    test("let [] = [];", "");
    test("const [] = [];", "");
    test("var {} = [];", "");
}

#[test]
#[ignore]
fn test_empty_pattern_in_declaration_removed_2() {
    test("var [] = foo();", "foo()");
}

#[test]
fn test_empty_array_pattern_in_assign_removed() {
    test("({} = {});", "");
    test("({} = foo());", "foo()");
    test("[] = [];", "");
    test("[] = foo();", "foo()");
}

#[test]
fn test_empty_pattern_in_params_not_removed() {
    test_same("function f([], a) {}");
    test_same("function f({}, a) {}");
}

#[test]
fn test_empty_pattern_in_for_of_loop_not_removed() {
    test_same("for (let [] of foo());");
    test_same("for (const [] of foo());");
    test_same("for ([] of foo());");
    test_same("for ({} of foo());");
}

#[test]
fn test_empty_slot_in_array_pattern_removed() {
    test("[,,] = foo();", "foo()");
    test("[a,b,,] = foo();", "[a,b] = foo();");
    test("[a,[],b,[],[]] = foo();", "[a,[],b] = foo();");
    test("[a,{},b,{},{}] = foo();", "[a,{},b] = foo();");
    test("function f([,,,]) {}", "function f([]) {}");
    test_same("[[], [], [], ...rest] = foo()");
}

#[test]
#[ignore]
fn test_empty_slot_in_array_pattern_with_default_value_maybe_removed_1() {
    test("[a,[] = 0] = [];", "[a] = [];");
}

#[test]
fn test_empty_slot_in_array_pattern_with_default_value_maybe_removed_2() {
    test_same("[a,[] = foo()] = [];");
}

#[test]
fn test_empty_key_in_object_pattern_removed() {
    test("const {f: {}} = {};", "");
    test("const {f: []} = {};", "");
    test("const {f: {}, g} = {};", "const {g} = {};");
    test("const {f: [], g} = {};", "const {g} = {};");
    test_same("const {[foo()]: {}} = {};");
}

#[test]
fn test_empty_key_in_object_pattern_with_default_value_maybe_removed() {
    test("const {f: {} = 0} = {};", "");
    // In theory the following case could be reduced to `foo()`, but that gets more
    // complicated to implement for object patterns with multiple keys with side
    // effects. Instead the pass backs off for any default with a possible side
    // effect
    test_same("const {f: {} = foo()} = {};");
}

#[test]
fn test_empty_key_in_object_pattern_not_removed_with_object_rest() {
    test_same("const {f: {}, ...g} = foo()");
    test_same("const {f: [], ...g} = foo()");
}

#[test]
fn test_undefined_default_parameter_removed() {
    test(
        "function f(x=undefined,y) {  }", //
        "function f(x,y)             {  }",
    );
    test(
        "function f(x,y=undefined,z) {  }", //
        "function f(x,y          ,z) {  }",
    );
    test(
        "function f(x=undefined,y=undefined,z=undefined) {  }", //
        "function f(x,          y,          z)           {  }",
    );
}

#[test]
fn test_pure_void_default_parameter_removed_1() {
    test(
        "function f(x = void 0) {  }", //
        "function f(x         ) {  }",
    );
    test(
        "function f(x = void \"XD\") {  }", //
        "function f(x              ) {  }",
    );
}

#[test]
#[ignore]
fn test_pure_void_default_parameter_removed_2() {
    test(
        "function f(x = void f()) {  }", //
        "function f(x)            {  }",
    );
}

#[test]
fn test_no_default_parameter_not_removed() {
    test_same("function f(x,y) {  }");
    test_same("function f(x) {  }");
    test_same("function f() {  }");
}

#[test]
fn test_effectful_default_parameter_not_removed() {
    test_same("function f(x = void console.log(1)) {  }");
    test_same("function f(x = void f()) { alert(x); }");
}

#[test]
fn test_destructuring_undefined_default_parameter() {
    test(
        "function f({a=undefined,b=1,c}) {  }", //
        "function f({a          ,b=1,c}) {  }",
    );
    test(
        "function f({a={},b=0}=undefined) {  }", //
        "function f({a={},b=0}) {  }",
    );
    test(
        "function f({a=undefined,b=0}) {  }", //
        "function f({a,b=0}) {  }",
    );
    test(
        " function f({a: {b = undefined}}) {  }", //
        " function f({a: {b}}) {  }",
    );
    test_same("function f({a,b}) {  }");
    test_same("function f({a=0, b=1}) {  }");
    test_same("function f({a=0,b=0}={}) {  }");
    test_same("function f({a={},b=0}={}) {  }");
}

#[test]
fn test_undefined_default_object_patterns() {
    test(
        "const {a = undefined} = obj;", //
        "const {a} = obj;",
    );
    test(
        "const {a = void 0} = obj;", //
        "const {a} = obj;",
    );
}

#[test]
fn test_do_not_remove_getter_only_access() {
    test_same(concat!(
        "var a = {", //
        "  get property() {}",
        "};",
        "a.property;",
    ));

    test_same(concat!(
        "var a = {};", //
        "Object.defineProperty(a, 'property', {",
        "  get() {}",
        "});",
        "a.property;",
    ));
}

#[test]
fn test_do_not_remove_nested_getter_only_access() {
    test_same(concat!(
        "var a = {", //
        "  b: { get property() {} }",
        "};",
        "a.b.property;",
    ));
}

#[test]
#[ignore]
fn test_remove_after_nested_getter_only_access() {
    test(
        concat!(
            "var a = {", //
            "  b: { get property() {} }",
            "};",
            "a.b.property.d.e;",
        ),
        concat!(
            "var a = {", //
            "  b: { get property() {} }",
            "};",
            "a.b.property;",
        ),
    );
}

#[test]
fn test_retain_setter_only_access() {
    test_same(concat!(
        "var a = {", //
        "  set property(v) {}",
        "};",
        "a.property;",
    ));
}

#[test]
fn test_do_not_remove_getter_setter_access() {
    test_same(concat!(
        "var a = {", //
        "  get property() {},",
        "  set property(x) {}",
        "};",
        "a.property;",
    ));
}

#[test]
fn test_do_not_remove_set_setter_to_getter() {
    test_same(concat!(
        "var a = {", //
        "  get property() {},",
        "  set property(x) {}",
        "};",
        "a.property = a.property;",
    ));
}

#[test]
fn test_do_not_remove_access_if_other_property_is_getter() {
    test_same(concat!(
        "var a = {", //
        "  get property() {}",
        "};",
        "var b = {",
        "  property: 0,",
        "};",
        // This pass should be conservative and not remove this since it sees a getter for
        // "property"
        "b.property;",
    ));

    test_same(concat!(
        "var a = {};", //
        "Object.defineProperty(a, 'property', {",
        "  get() {}",
        "});",
        "var b = {",
        "  property: 0,",
        "};",
        "b.property;",
    ));
}

#[test]
fn test_function_call_references_getter_is_not_removed() {
    test_same(concat!(
        "var a = {", //
        "  get property() {}",
        "};",
        "function foo() { a.property; }",
        "foo();",
    ));
}

#[test]
fn test_function_call_references_setter_is_not_removed() {
    test_same(concat!(
        "var a = {", //
        "  set property(v) {}",
        "};",
        "function foo() { a.property = 0; }",
        "foo();",
    ));
}

#[test]
fn custom_loop_1() {
    test(
        "let b = 2;

let a = 1;
if (2) {
a = 2;
}

let c;
if (a) {
c = 3;
}",
        "let b = 2;

let a = 1;
a = 2;

let c;
if (a) c = 3;",
    );
}

#[test]
fn custom_loop_2() {
    test(
        "let b = 2;

let a = 1;
if (2) {
a = 2;
}

let c;
if (a) {
c = 3;
}",
        "let b = 2;

let a = 1;
a = 2;

let c;
if (a) c = 3;",
    );
}

#[test]
fn custom_loop_3() {
    test(
        "let c;
if (2) c = 3;
console.log(c);",
        "let c;
c = 3;
console.log(c);",
    );
}

#[test]
fn nested_block_stmt() {
    test(
        "if (Date.now() < 0) {
            for(let i = 0; i < 10; i++){
                if (Date.now() < 0) {
                    console.log(1);
                }
            }
        } else {
            console.log(2);
        }",
        "if (Date.now() < 0) {
            for(let i = 0; i < 10; i++)if (Date.now() < 0) console.log(1);
        } else console.log(2);",
    );
}

#[test]
fn return_function_hoisting() {
    test(
        "function test() {
            return foo();
            function foo() {
                return 2;
            }
            console.log('hi');
        }",
        "function test() {
            function foo() {
                return 2;
            }
            return foo();
        }",
    );
}
