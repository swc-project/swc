//! Copied from https://github.com/google/closure-compiler/blob/6ca3b62990064488074a1a8931b9e8dc39b148b3/test/com/google/javascript/jscomp/InlineVariablesTest.java

#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use swc_common::chain;
use swc_ecma_transforms::{optimization::simplify::inlining, resolver};

#[macro_use]
mod common;

macro_rules! to {
    ($name:ident, $src:expr, $expected:expr) => {
        test!(
            Default::default(),
            |_| chain!(resolver(), inlining()),
            $name,
            $src,
            $expected
        );
    };
}

macro_rules! identical {
    ($name:ident, $src:expr) => {
        to!($name, $src, $src);
    };
}

fn test(src: &str, expected: &str) {
    test_transform!(
        ::swc_ecma_parser::Syntax::default(),
        |_| chain!(resolver(), inlining()),
        src,
        expected,
        true
    )
}

/// Should not modify expression.
fn test_same(s: &str) {
    test(s, s)
}

identical!(
    does_not_produce_invalid_code_1,
    "function f(x = void 0) {
  var z;
    {
     const y = {};
     x && (y['x'] = x);
     z = y;
   }
   return z;
}"
);

identical!(
    does_not_produce_invalid_code_2,
    "function f(x = void 0) {{var z;const y = {};x && (y['x'] = x);z = y;}return z;}"
);

#[test]
fn test_pass_doesnt_produce_invalid_code3() {
    test(
        concat!("function f(x = void 0) {var z;const y = {};x && (y['x'] = x);z = y;{return z;}}"),
        "function f(x = void 0) {
    var z;
    const y = {
    };
    x && (y['x'] = x);
    z = y;
    {
        return z;
    }
}
",
    );
}

to!(
    top_level_simple_var,
    "var a = 1; var b = a;",
    "var a = 1; var b = 1;"
);

to!(
    function_scope_simple_var,
    "var a = 1;
    var b = a;
    use(b);",
    "use(1);"
);

identical!(top_level_increment, "var x = 1; x++;");

identical!(top_level_decrement, "var x = 1; x--;");

identical!(top_level_assign_op, "var x = 1; x += 3;");

to!(
    simple_inline_in_fn,
    "var x = 1; var z = x; use(z)",
    "use(1)"
);

// TODO
//to!(
//    unresolved_inline_in_fn,
//    "var a = new obj();
//    result = a;",
//    "result = new obj()"
//);

#[test]
fn test_inline_in_function3() {
    test_same("function baz() { var a = new obj();(function(){a;})();result = a;}");
}

#[test]
fn test_inline_in_function4() {
    test_same("function baz() { var a = new obj();foo.result = a;}");
}

#[test]
fn test_inline_in_function5() {
    test_same("function baz() { var a = (foo = new obj());foo.x();result = a;}");
}

to!(block_in_fn_compiled_out, "{ var x = 1; var z = x; }", "{}");

to!(
    block_in_fn,
    "{ var x = 1; var z = x; use(z); }",
    "{ use(1) }"
);

#[test]
fn test_inline_in_function7() {
    test(
        "function baz() { var x = 1; { var z = x; } }",
        "function baz() { { var z = 1; } }",
    );
}

#[test]
fn test_inline_into_arrow_function1() {
    test("var x = 0; var f = () => x + 1;", "var f = () => 0 + 1;");
}

#[test]
fn test_inline_into_arrow_function2() {
    test(
        "var x = 0; var f = () => { return x + 1; }",
        "var f = () => { return 0 + 1; }",
    );
}

identical!(
    cond_true_1,
    "if (true) { var x = 1; } var z = x; use(x); use(x);"
);

to!(
    cond_true_1_fn,
    "if (true) { var x = 1; } var z = x; use(x); use(x);",
    "if (true) { var x = 1; } use(x); use(x);"
);

identical!(t_cond_true_2, "if (true) var x = 1; var z = x;");

// TODO: Remove x
to!(
    cond_true_2_fn,
    "if (true) var x = 1; var z = x;",
    "if (true) ;"
);

identical!(t_cond_true_3, "var x; if (true) x=1; var z = x;");

to!(
    cond_true_3_fn,
    "var x; if (true) x=1; var z = x; use(z)",
    "var x; if (true) x=1; use(x)"
);

identical!(while_loop, "while (z) { var x = 3; } var y = x;");

#[test]
fn test_do_not_exit_for_loop() {
    test(
        "for (var i = 1; false; false) var z = i;",
        "for (;false;false) var z = 1;",
    );
    test_same("for (; false; false) var i = 1; var z = i;");
    test_same("for (var i in {}); var z = i;");
}

#[test]
fn test_do_not_enter_subscope() {
    test_same("var x = function() {  var self = this;   return function() { var y = self; };}");
    test_same("var x = function() {  var y = [1];   return function() { var z = y; };}");
}

#[test]
fn test_do_not_exit_try() {
    test_same("try { var x = y; } catch (e) {} var z = y; ");
    test_same("try { throw e; var x = 1; } catch (e) {} var z = x; ");
}

#[test]
fn test_do_not_enter_catch() {
    test_same("try { } catch (e) { var z = e; } ");
}

#[test]
fn test_do_not_enter_finally() {
    test_same("try { throw e; var x = 1; } catch (e) {} finally  { var z = x; } ");
}

#[test]
fn test_inside_if_conditional() {
    test(
        "var a = foo(); if (a) { alert(3); }",
        "if (foo()) { alert(3); }",
    );
    test(
        "var a; a = foo(); if (a) { alert(3); }",
        "if (foo()) { alert(3); }",
    );
}

to!(only_read_at_initialization_1, "var a; a = foo();", "foo();");

#[test]
fn test_only_read_at_initialization() {
    test(
        "var a; if (a = foo()) { alert(3); }",
        "var a; if (a = foo()) { alert(3); }",
    );
    test("var a; switch (a = foo()) {}", "switch(foo()) {}");
    test(
        "var a; function f(){ return a = foo(); }",
        "function f(){ return foo(); }",
    );
    test(
        "function f(){ var a; return a = foo(); }",
        "function f(){ return foo(); }",
    );
    test(
        "var a; with (a = foo()) { alert(3); }",
        "with (foo()) { alert(3); }",
    );

    test("var a; b = (a = foo());", "b = foo();");
    test(
        "var a; while(a = foo()) { alert(3); }",
        "while(foo()) { alert(3); }",
    );
    test(
        "var a; for(;a = foo();) { alert(3); }",
        "for(;foo();) { alert(3); }",
    );
    test(
        "var a; do {} while(a = foo()) { alert(3); }",
        "do {} while(foo()) { alert(3); }",
    );
}

#[test]
fn test_immutable_with_single_reference_after_initialzation() {
    test("var a; a = 1;", "1;");
    test("var a; if (a = 1) { alert(3); }", "if (1) { alert(3); }");
    test("var a; switch (a = 1) {}", "switch(1) {}");
    test(
        "var a; function f(){ return a = 1; }",
        "function f(){ return 1; }",
    );
    test(
        "function f(){ var a; return a = 1; }",
        "function f(){ return 1; }",
    );
    test(
        "var a; with (a = 1) { alert(3); }",
        "with (1) { alert(3); }",
    );

    test("var a; b = (a = 1);", "b = 1;");
    test(
        "var a; while(a = 1) { alert(3); }",
        "while(1) { alert(3); }",
    );
    test(
        "var a; for(;a = 1;) { alert(3); }",
        "for(;1;) { alert(3); }",
    );
    test(
        "var a; do {} while(a = 1) { alert(3); }",
        "do {} while(1) { alert(3); }",
    );
}

to!(
    single_reference_after_initialzation_1,
    "var a; a = foo();a;",
    "foo();"
);

#[test]
fn single_reference_after_initialzation() {
    test_same("var a; if (a = foo()) { alert(3); } a;");
    test_same("var a; switch (a = foo()) {} a;");
    test_same("var a; function f(){ return a = foo(); } a;");
    test_same("function f(){ var a; return a = foo(); a;}");
    test_same("var a; with (a = foo()) { alert(3); } a;");
    test("var a; b = (a = foo()); a;", "var a; b = a = foo(); a;");
    test_same("var a; while(a = foo()) { alert(3); } a;");
    test_same("var a; for(;a = foo();) { alert(3); } a;");
    test_same("var a; do {} while(a = foo()) { alert(3); } a;");
}

#[test]
fn test_inside_if_branch() {
    test_same("var a = foo(); if (1) { alert(a); }");
}

#[test]
fn test_inside_and_conditional() {
    test("var a = foo(); a && alert(3);", "foo() && alert(3);");
}

#[test]
fn test_inside_and_branch() {
    test_same("var a = foo(); 1 && alert(a);");
}

#[test]
fn test_inside_or_branch() {
    test_same("var a = foo(); 1 || alert(a);");
}

#[test]
fn test_inside_hook_branch() {
    test_same("var a = foo(); 1 ? alert(a) : alert(3)");
}

#[test]
fn test_inside_hook_conditional() {
    test(
        "var a = foo(); a ? alert(1) : alert(3)",
        "foo() ? alert(1) : alert(3)",
    );
}

#[test]
fn test_inside_or_branch_inside_if_conditional() {
    test_same("var a = foo(); if (x || a) {}");
}

#[test]
fn test_inside_or_branch_inside_if_conditional_with_constant() {
    // We don't inline non-immutable constants into branches.
    test_same("var a = [false]; if (x || a) {}");
}

#[test]
fn test_cross_functions_as_left_leaves() {
    //// Ensures getNext() understands how to walk past a function leaf
    //test(
    //new String[] { "var x = function() {};", "",
    //"function cow() {} var z = x;"},
    //new String[] { "", "", "function cow() {} var z = function() {};" });
    //test(
    //new String[] { "var x = function() {};", "",
    //"var cow = function() {}; var z = x;"},
    //new String[] { "", "",
    //"var cow = function() {}; var z = function() {};" });
    //test_same(
    //new String[] { "var x = a;", "",
    //"(function() { a++; })(); var z = x;"});
    //test(
    //new String[] { "var x = a;", "",
    //"function cow() { a++; }; cow(); var z = x;"},
    //new String[] { "var x = a;", "",
    //";(function cow(){ a++; })(); var z = x;"});
    //test_same(
    //new String[] { "var x = a;", "",
    //"cow(); var z = x; function cow() { a++; };"});
}

// Test movement of constant values

#[test]
fn test_do_cross_function() {
    // We know foo() does not affect x because we require that x is only
    // referenced twice.
    test("var x = 1; foo(); var z = x;", "foo(); var z = 1;");
}

#[test]
fn test_do_not_cross_referencing_function() {
    test_same("var f = function() { var z = x; };var x = 1;f();var z = x;f();");
}

// Test tricky declarations and references

#[test]
fn test_chained_assignment() {
    test("var a = 2, b = 2; var c = b;", "var a = 2; var c = 2;");
    test("var a = 2, b = 2; var c = a;", "var b = 2; var c = 2;");
    test(
        "var a = b = 2; var f = 3; var c = a;",
        "var f = 3; var c = b = 2;",
    );
    test_same("var a = b = 2; var c = b;");
}

#[test]
fn test_for_in() {
    test_same("for (var i in j) { var c = i; }");
    test_same("var i = 0; for (i in j) ;");
    test_same("var i = 0; for (i in j) { var c = i; }");
    test_same("i = 0; for (var i in j) { var c = i; }");
    test_same("var j = {'key':'value'}; for (var i in j) {print(i)};");
}

// Test movement of values that have (may) side effects

#[test]
fn test_do_cross_new_variables() {
    test("var x = foo(); var z = x;", "var z = foo();");
}

#[test]
fn test_do_not_cross_function_calls() {
    test_same("var x = foo(); bar(); var z = x;");
}

// Test movement of values that are complex but lack side effects

#[test]
fn test_do_not_cross_assignment() {
    test_same("var x = {}; var y = x.a; x.a = 1; var z = y;");
    test_same("var a = this.id; foo(this.id = 3, a);");
}

#[test]
fn test_do_not_cross_delete() {
    test_same("var x = {}; var y = x.a; delete x.a; var z = y;");
}

#[test]
fn test_do_not_cross_assignment_plus() {
    test_same("var a = b; b += 2; var c = a;");
}

#[test]
fn test_do_not_cross_increment() {
    test_same("var a = b.c; b.c++; var d = a;");
}

#[test]
fn test_do_not_cross_constructor() {
    test_same("var a = b; new Foo(); var c = a;");
}

#[test]
fn test_do_cross_var() {
    // Assumes we do not rely on undefined variables (not technically correct!)
    test("var a = b; var b = 3; alert(a)", "alert(3);");
}

#[test]
fn test_overlapping_in_lines() {
    let source = "a = function(el, x, opt_y) {   var cur = bar(el);   opt_y = x.y;   x = x.x;   \
                  var dx = x - cur.x;   var dy = opt_y - cur.y;  foo(el, el.offsetLeft + dx, \
                  el.offsetTop + dy); };";
    let expected = "a = function(el, x, opt_y) {   var cur = bar(el);   opt_y = x.y;   x = x.x;   \
                    foo(el, el.offsetLeft + (x - cur.x),      el.offsetTop + (opt_y - cur.y)); };";

    test(source, expected);
}

#[test]
fn test_overlapping_inline_functions() {
    let source = "a = function() {   var b = function(args) {var n;};   var c = function(args) \
                  {};   d(b,c); };";
    let expected = "a = function() {   d(function(args){var n;}, function(args){}); };";

    test(source, expected);
}

#[test]
fn test_inline_into_loops() {
    test(
        "var x = true; while (true) alert(x);",
        "while (true) alert(true);",
    );
    test(
        "var x = true; while (true) for (var i in {}) alert(x);",
        "while (true) for (var i in {}) alert(true);",
    );
    test_same("var x = [true]; while (true) alert(x);");
}

#[test]
fn test_inline_into_function() {
    test(
        "var x = false; var f = function() { alert(x); };",
        "var f = function() { alert(false); };",
    );
    test_same("var x = [false]; var f = function() { alert(x); };");
}

#[test]
fn test_no_inline_into_named_function() {
    test_same("f(); var x = false; function f() { alert(x); }");
}

#[test]
fn test_inline_into_nested_non_hoisted_named_functions() {
    test(
        "f(); var x = false; if (false) function f() { alert(x); };",
        "f(); if (false) function f() { alert(false); };",
    );
}

#[test]
fn test_no_inline_into_nested_named_functions() {
    test_same("f(); var x = false; function f() { if (false) { alert(x); } };");
}

#[test]
fn test_no_inline_mutated_variable() {
    test_same("var x = false; if (true) { var y = x; x = true; }");
}

#[test]
fn test_inline_immutable_multiple_times() {
    test("var x = null; var y = x, z = x;", "var y = null, z = null;");
    test("var x = 3; var y = x, z = x;", "var y = 3, z = 3;");
}

#[test]
fn test_inline_string_multiple_times() {
    test(
        "var x = 'abcdefghijklmnopqrstuvwxyz'; var y = x, z = x;",
        "var y = 'abcdefghijklmnopqrstuvwxyz',     z = 'abcdefghijklmnopqrstuvwxyz';",
    );
}

#[test]
fn test_no_inline_backwards() {
    test_same("var y = x; var x = null;");
}

#[test]
fn test_no_inline_out_of_branch() {
    test_same("if (true) var x = null; var y = x;");
}

#[test]
fn test_interfering_in_lines() {
    test(
        "var a = 3; var f = function() { var x = a; alert(x); };",
        "var f = function() { alert(3); };",
    );
}

#[test]
fn test_inline_into_try_catch() {
    test(
        "var a = true; try { var b = a; } catch (e) { var c = a + b; var d = true; } finally { \
         var f = a + b + c + d; }",
        "try { var b = true; } catch (e) { var c = true + b; var d = true; } finally { var f = \
         true + b + c + d; }",
    );
}

// Make sure that we still inline constants that are not provably
// written before they're read.
#[test]
fn test_inline_constants() {
    test(
        "function foo() { return XXX; } var XXX = true;",
        "function foo() { return true; }",
    );
}

#[test]
fn test_inline_string_when_worthwhile() {
    test("var x = 'a'; foo(x, x, x);", "foo('a', 'a', 'a');");
}

#[test]
fn test_inline_constant_alias() {
    test(
        "var XXX = new Foo(); q(XXX); var YYY = XXX; bar(YYY)",
        "var XXX = new Foo(); q(XXX); bar(XXX)",
    );
}

#[test]
fn test_inline_constant_alias_with_non_constant() {
    test(
        "var XXX = new Foo(); q(XXX); var y = XXX; bar(y); baz(y)",
        "var XXX = new Foo(); q(XXX); bar(XXX); baz(XXX)",
    );
}

identical!(no_inline_getprop_into_call_3, "var a = b.c; a();");

#[test]
fn test_inline_function_declaration() {
    test(
        "var f = function () {}; var a = f;",
        "var a = function () {};",
    );
    test(
        "var f = function () {}; foo(); var a = f;",
        "foo(); var a = function () {};",
    );
    test("var f = function () {}; foo(f);", "foo(function () {});");

    test_same("var f = function () {}; function g() {var a = f;}");
    test_same("var f = function () {}; function g() {h(f);}");
}

#[test]
fn test2388531() {
    test_same("var f = function () {};var g = function () {};goog.inherits(f, g);");
    test_same("var f = function () {};var g = function () {};goog$inherits(f, g);");
}

#[test]
fn test_recursive_function1() {
    test_same("var x = 0; (function x() { return x ? x() : 3; })();");
}

#[test]
fn test_recursive_function2() {
    test_same("function y() { return y(); }");
}

#[test]
fn test_unreferenced_bleeding_function() {
    test_same("var x = function y() {}");
}

#[test]
fn test_referenced_bleeding_function() {
    test_same("var x = function y() { return y(); }");
}

#[test]
fn test_inline_aliases1() {
    test(
        "var x = this.foo(); this.bar(); var y = x; this.baz(y);",
        "var x = this.foo(); this.bar(); this.baz(x);",
    );
}

#[test]
fn test_inline_aliases1b() {
    test(
        "var x = this.foo(); this.bar(); var y; y = x; this.baz(y);",
        "var x = this.foo(); this.bar(); x; this.baz(x);",
    );
}

#[test]
fn test_inline_aliases1c() {
    test(
        "var x; x = this.foo(); this.bar(); var y = x; this.baz(y);",
        "var x; x = this.foo(); this.bar(); this.baz(x);",
    );
}

#[test]
fn test_inline_aliases1d() {
    test(
        "var x; x = this.foo(); this.bar(); var y; y = x; this.baz(y);",
        "var x; x = this.foo(); this.bar(); x; this.baz(x);",
    );
}

#[test]
fn test_inline_aliases2() {
    test(
        "var x = this.foo(); this.bar(); function f() { var y = x; this.baz(y); }",
        "var x = this.foo(); this.bar(); function f() { this.baz(x); }",
    );
}

#[test]
fn test_inline_aliases2b() {
    test(
        "var x = this.foo(); this.bar(); function f() { var y; y = x; this.baz(y); }",
        "var x = this.foo(); this.bar(); function f() { this.baz(x); }",
    );
}

#[test]
fn test_inline_aliases2c() {
    test(
        "var x; x = this.foo(); this.bar(); function f() { var y = x; this.baz(y); }",
        "var x; x = this.foo(); this.bar(); function f() { this.baz(x); }",
    );
}

#[test]
fn test_inline_aliases2d() {
    test(
        "var x; x = this.foo(); this.bar(); function f() { var y; y = x; this.baz(y); }",
        "var x; x = this.foo(); this.bar(); function f() { this.baz(x); }",
    );
}

#[test]
fn test_inline_aliases_in_loop() {
    test(
        "function f() {   var x = extern();  for (var i = 0; i < 5; i++) {    (function() {       \
         var y = x; window.setTimeout(function() { extern(y); }, 0);     })();  }}",
        "function f() {   var x = extern();  for (var i = 0; i < 5; i++) {    (function() {       \
         window.setTimeout(function() { extern(x); }, 0);     })();  }}",
    );
}

#[test]
fn test_no_inline_aliases_in_loop() {
    test_same(
        "function f() {   for (var i = 0; i < 5; i++) {    var x = extern();    (function() {       var y = x; window.setTimeout(function() { extern(y); }, 0);     })();  }}",
    );
}

#[test]
fn test_no_inline_aliases1() {
    test_same("var x = this.foo(); this.bar(); var y = x; x = 3; this.baz(y);");
}

#[test]
fn test_no_inline_aliases1b() {
    test_same("var x = this.foo(); this.bar(); var y; y = x; x = 3; this.baz(y);");
}

#[test]
fn test_no_inline_aliases2() {
    test_same("var x = this.foo(); this.bar(); var y = x; y = 3; this.baz(y); ");
}

#[test]
fn test_no_inline_aliases2b() {
    test_same("var x = this.foo(); this.bar(); var y; y = x; y = 3; this.baz(y); ");
}

#[test]
fn test_no_inline_aliases3() {
    test_same(
        "var x = this.foo(); this.bar(); function f() { var y = x; g(); this.baz(y); } function \
         g() { x = 3; }",
    );
}

#[test]
fn test_no_inline_aliases3b() {
    test_same(
        "var x = this.foo(); this.bar(); function f() { var y; y = x; g(); this.baz(y); } \
         function g() { x = 3; }",
    );
}

#[test]
fn test_no_inline_aliases4() {
    test_same("var x = this.foo(); this.bar(); function f() { var y = x; y = 3; this.baz(y); }");
}

#[test]
fn test_no_inline_aliases4b() {
    test_same("var x = this.foo(); this.bar(); function f() { var y; y = x; y = 3; this.baz(y); }");
}

#[test]
fn test_no_inline_aliases5() {
    test_same("var x = this.foo(); this.bar(); var y = x; this.bing();this.baz(y); x = 3;");
}

#[test]
fn test_no_inline_aliases5b() {
    test_same("var x = this.foo(); this.bar(); var y; y = x; this.bing();this.baz(y); x = 3;");
}

#[test]
fn test_no_inline_aliases6() {
    test_same("var x = this.foo(); this.bar(); var y = x; this.bing();this.baz(y); y = 3;");
}

#[test]
fn test_no_inline_aliases6b() {
    test_same("var x = this.foo(); this.bar(); var y; y = x; this.bing();this.baz(y); y = 3;");
}

#[test]
fn test_no_inline_aliases7() {
    test_same(
        "var x = this.foo(); this.bar(); function f() { var y = x; this.bing(); this.baz(y); x = \
         3; }",
    );
}

#[test]
fn test_no_inline_aliases7b() {
    test_same(
        "var x = this.foo(); this.bar(); function f() { var y; y = x; this.bing(); this.baz(y); x \
         = 3; }",
    );
}

#[test]
fn test_no_inline_aliases8() {
    test_same("var x = this.foo(); this.bar(); function f() { var y = x; this.baz(y); y = 3; }");
}

#[test]
fn test_no_inline_aliases8b() {
    test_same("var x = this.foo(); this.bar(); function f() { var y; y = x; this.baz(y); y = 3; }");
}

//#[test]
//fn testSideEffectOrder() {
//    // z can not be changed by the call to y, so x can be inlined.
//    let EXTERNS = "var z; function f(){}";
//    test(
//        externs(EXTERNS),
//        srcs("var x = f(y.a, y); z = x;"),
//        expected("z = f(y.a, y);"),
//    );
//    // z.b can be changed by the call to y, so x can not be inlined.
//    test_same(externs(EXTERNS), srcs("var x = f(y.a, y); z.b = x;"));
//}

#[test]
fn test_inline_parameter_alias1() {
    test(
        "function f(x) {  var y = x;  g();  y;y;}",
        "function f(x) {  g();  x;x;}",
    );
}

#[test]
fn test_inline_parameter_alias2() {
    test(
        "function f(x) {  var y; y = x;  g();  y;y;}",
        "function f(x) {  x;  g();  x;x;}",
    );
}

#[test]
fn test_inline_function_alias1a() {
    test(
        "function f(x) {}var y = f;g();y();y();",
        "var y = function f(x) {};g();y();y();",
    );
}

#[test]
fn test_inline_function_alias1b() {
    test(
        "function f(x) {};f;var y = f;g();y();y();",
        "function f(x) {};f;g();f();f();",
    );
}

#[test]
fn test_inline_function_alias2a() {
    test(
        "function f(x) {}var y; y = f;g();y();y();",
        "var y; y = function f(x) {};g();y();y();",
    );
}

#[test]
fn test_inline_function_alias2b() {
    test(
        "function f(x) {};f; var y; y = f;g();y();y();",
        "function f(x) {};f; f;g();f();f();",
    );
}

#[test]
fn test_inline_switch_var() {
    test("var x = y; switch (x) {}", "switch (y) {}");
}

#[test]
fn test_inline_switch_let() {
    test("let x = y; switch (x) {}", "switch (y) {}");
}

// Successfully inlines 'values' and 'e'
#[test]
fn test_inline_into_for_loop1() {
    test(
        concat!(
            "function calculate_hashCode() {",
            "  var values = [1, 2, 3, 4, 5];",
            "  var hashCode = 1;",
            "  for (var $array = values, i = 0; i < $array.length; i++) {",
            "    var e = $array[i];",
            "    hashCode = 31 * hashCode + calculate_hashCode(e);",
            "  }",
            "  return hashCode;",
            "}",
        ),
        concat!(
            "function calculate_hashCode() {",
            "  var hashCode = 1;",
            "  var $array = [1, 2, 3, 4, 5];",
            "  var i = 0;",
            "  for (; i < $array.length; i++) {",
            "    hashCode = 31 * hashCode + calculate_hashCode($array[i]);",
            "  }",
            "  return hashCode;",
            "}",
        ),
    );
}

// Inlines 'e' but fails to inline 'values'
// TODO(tbreisacher): Investigate and see if we can improve this.
#[test]
fn test_inline_into_for_loop2() {
    test(
        concat!(
            "function calculate_hashCode() {",
            "  let values = [1, 2, 3, 4, 5];",
            "  let hashCode = 1;",
            "  for (let $array = values, i = 0; i < $array.length; i++) {",
            "    let e = $array[i];",
            "    hashCode = 31 * hashCode + calculate_hashCode(e);",
            "  }",
            "  return hashCode;",
            "}",
        ),
        concat!(
            "function calculate_hashCode() {",
            "  let values = [1, 2, 3, 4, 5];",
            "  let hashCode = 1;",
            "  for (let $array = values, i = 0; i < $array.length; i++) {",
            "    hashCode = 31 * hashCode + calculate_hashCode($array[i]);",
            "  }",
            "  return hashCode;",
            "}",
        ),
    );
}

// This used to be inlined, but regressed when we switched to the ES6 scope
// creator.
#[test]
fn test_no_inline_catch_alias_var1() {
    test_same(concat!(
        "try {",
        "} catch (e) {",
        "  var y = e;",
        "  g();",
        "  y;y;",
        "}",
    ));
}

// This used to be inlined, but regressed when we switched to the ES6 scope
// creator.
#[test]
fn test_no_inline_catch_alias_var2() {
    test_same(concat!(
        "try {",
        "} catch (e) {",
        "  var y; y = e;",
        "  g();",
        "  y;y;",
        "}",
    ));
}

#[test]
fn test_inline_catch_alias_let1() {
    test(
        concat!(
            "try {",
            "} catch (e) {",
            "  let y = e;",
            "  g();",
            "  y;y;",
            "}",
        ),
        concat!("try {", "} catch (e) {", "  g();", "  e;e;", "}"),
    );
}

#[test]
fn test_inline_catch_alias_let2() {
    test(
        concat!(
            "try {",
            "} catch (e) {",
            "  let y; y = e;",
            "  g();",
            "  y;y;",
            "}",
        ),
        concat!("try {", "} catch (e) {", "  e;", "  g();", "  e;e;", "}"),
    );
}

#[test]
fn test_inline_this() {
    test(
        concat!(
            "/** @constructor */",
            "function C() {}",
            "",
            "C.prototype.m = function() {",
            "  var self = this;",
            "  if (true) {",
            "    alert(self);",
            "  }",
            "};",
        ),
        concat!(
            "(/** @constructor */",
            "function C() {}).prototype.m = function() {",
            "  if (true) {",
            "    alert(this);",
            "  }",
            "};",
        ),
    );
}

#[test]
fn test_locals_only1() {
    test(
        "var x=1; x; function f() {var x = 1; x;}",
        "var x=1; x; function f() {1;}",
    );
}

#[test]
fn test_inline_undefined1() {
    test("var x; x;", "void 0;");
}

#[test]
fn test_inline_undefined2() {
    test_same("var x; x++;");
}

#[test]
fn test_inline_undefined3() {
    test_same("var x; var x;");
}

#[test]
fn test_inline_undefined4() {
    test("var x; x; x;", "void 0; void 0;");
}

#[test]
fn test_inline_undefined5() {
    test_same("var x; for(x in a) {}");
}

#[test]
fn test_issue90() {
    test("var x; x && alert(1)", "void 0 && alert(1)");
}

#[test]
fn test_rename_property_function() {
    test_same("var JSCompiler_renameProperty; JSCompiler_renameProperty('foo')");
}

#[test]
#[ignore]
fn test_this_alias() {
    test(
        "function f() { var a = this; a.y(); a.z(); }",
        "function f() { this.y(); this.z(); }",
    );
}

#[test]
fn test_this_escaped_alias() {
    test_same("function f() { var a = this; var g = function() { a.y(); }; a.z(); }");
}

#[test]
fn test_inline_named_function() {
    test("function f() {} f();", "(function f(){})()");
}

#[test]
fn test_issue378_modified_arguments1() {
    test_same(
        "function g(callback) {\n  var f = callback;\n  arguments[0] = this;\n  f.apply(this, \
         arguments);\n}",
    );
}

#[test]
fn test_issue378_modified_arguments2() {
    test_same(
        "function g(callback) {\n  /** @const */\n  var f = callback;\n  arguments[0] = this;\n  \
         f.apply(this, arguments);\n}",
    );
}

#[test]
fn test_issue378_escaped_arguments1() {
    test_same(
        "function g(callback) {\n  var f = callback;\n  h(arguments,this);\n  f.apply(this, \
         arguments);\n}\nfunction h(a,b) {\n  a[0] = b;}",
    );
}

#[test]
fn test_issue378_escaped_arguments2() {
    test_same(
        "function g(callback) {\n  /** @const */\n  var f = callback;\n  h(arguments,this);\n  \
         f.apply(this);\n}\nfunction h(a,b) {\n  a[0] = b;}",
    );
}

#[test]
fn test_issue378_escaped_arguments3() {
    test(
        "function g(callback) {\n  var f = callback;\n  f.apply(this, arguments);\n}\n",
        "function g(callback) {\n  callback.apply(this, arguments);\n}\n",
    );
}

#[test]
fn test_issue378escaped_arguments4() {
    test_same(
        "function g(callback) {\n  var f = callback;\n  h(arguments[0],this);\n  f.apply(this, \
         arguments);\n}\nfunction h(a,b) {\n  a[0] = b;}",
    );
}

#[test]
fn test_issue378arguments_read1() {
    test(
        "function g(callback) {\n  var f = callback;\n  var g = arguments[0];\n  f.apply(this, \
         arguments);\n}",
        "function g(callback) {\n  var g = arguments[0];\n  callback.apply(this, arguments);\n}",
    );
}

#[test]
fn test_issue378arguments_read2() {
    test(
        "function g(callback) {\n  var f = callback;\n  h(arguments[0],this);\n  f.apply(this, \
         arguments[0]);\n}\nfunction h(a,b) {\n  a[0] = b;}",
        "function g(callback) {\n  h(arguments[0],this);\n  callback.apply(this, \
         arguments[0]);\n}\nfunction h(a,b) {\n  a[0] = b;}",
    );
}

#[test]
fn test_arguments_modified_in_outer_function() {
    test(
        "function g(callback) {\n  var f = callback;\n  arguments[0] = this;\n  f.apply(this, \
         arguments);\n  function inner(callback) {    var x = callback;\n    x.apply(this);\n  }}",
        "function g(callback) {\n  var f = callback;\n  arguments[0] = this;\n  f.apply(this, \
         arguments);\n  function inner(callback) {    callback.apply(this);\n  }}",
    );
}

#[test]
fn test_arguments_modified_in_inner_function() {
    test(
        "function g(callback) {\n  var f = callback;\n  f.apply(this, arguments);\n  function inner(callback) {    var x = callback;\n    arguments[0] = this;\n    x.apply(this);\n  }}",
        "function g(callback) {\n  callback.apply(this, arguments);\n  function inner(callback) {    var x = callback;\n    arguments[0] = this;\n    x.apply(this);\n  }}",
    );
}

//#[test]
//fn testNoInlineRedeclaredExterns() {
//    let externs = "var test = 1;";
//    let code = "/** @suppress {duplicate} */ var test = 2;alert(test);";
//    test_same(externs(externs), code);
//}

#[test]
fn test_bug6598844() {
    test_same(
        "function F() { this.a = 0; }F.prototype.inc = function() { this.a++; return 10; \
         };F.prototype.bar = function() { var x = this.inc(); this.a += x; };",
    );
}

#[test]
fn test_external_issue1053() {
    test_same("var u; function f() { u = Random(); var x = u; f(); alert(x===u)}");
}

#[test]
fn test_hoisted_function1() {
    test(
        "var x = 1; function f() { return x; }",
        "function f() { return 1; }",
    );
}

#[test]
fn test_hoisted_function2() {
    test_same(
        "var impl_0;b(a());function a() { impl_0 = {}; }function b() { window['f'] = impl_0; }",
    );
}

#[test]
fn test_hoisted_function3() {
    test_same("var impl_0;b();impl_0 = 1;function b() { window['f'] = impl_0; }");
}

#[test]
fn test_hoisted_function4() {
    test(
        "var impl_0;impl_0 = 1;b();function b() { window['f'] = impl_0; }",
        "1; b(); function b() { window['f'] = 1; }",
    );
}

#[test]
fn test_hoisted_function5() {
    test_same("a();var debug = 1;function b() { return debug; }function a() { return b(); }");
}

#[test]
fn test_hoisted_function6() {
    test(
        "var debug = 1;a();function b() { return debug; }function a() { return b(); }",
        "a();function b() { return 1; }function a() { return b(); }",
    );
}

#[test]
fn test_issue354() {
    test(
        "var enabled = true;function Widget() {}Widget.prototype = {  frob: function() {    \
         search();  }};function search() {  if (enabled)    alert(1);  else    \
         alert(2);}window.foo = new Widget();window.bar = search;",
        "function Widget() {}Widget.prototype = {  frob: function() {    search();  }};function \
         search() {  if (true)    alert(1);  else    alert(2);}window.foo = new \
         Widget();window.bar = search;",
    );
}

identical!(
    closure_compiler_1177_1,
    "function x_64(){var x_7;for(;;); var x_68=x_7=x_7;}"
);

identical!(
    closure_compiler_1177_2,
    "function x_64(){var x_7;for(;;);var x_68=x_7=x_7++;}"
);

identical!(
    closure_compiler_1177_3,
    "function x_64(){var x_7;for(;;);var x_68=x_7=x_7*2;}"
);

// GitHub issue #1234: https://github.com/google/closure-compiler/issues/1234
identical!(
    closure_compiler_1234,
    "var x;
    switch ('a') {
      case 'a':
            break;
      default: 
            x = 1;
            break;
    }
    use(x);"
);

to!(
    let_1,
    "function f(x) {
        if (true) {
            let y = x;
            y;
            y;
        }
    }",
    "function f(x) {
      if (true) {
        x;
        x;
      }
    }"
);

to!(
    const_1,
    "function f(x) {
        if (true) {
            const y = x;
            y;
            y;
        }
    }",
    "function f(x) {
      if (true) {
        x;
        x;
      }
    }"
);

to!(
    let_2,
    "let y;
    {
        let y = x;
        y;
    }
    y;
",
    "let y;
    {
        x;
    }
    void 0;"
);

to!(
    let_const,
    "let y = x;
    y;
    const g = 2;
    {
        const g = 3;
        let y = g;
        y;
    }
    y;
    g;
",
    "x;
    {
        3;
    }
    x;
    2;
    "
);

to!(
    generator_let_yield,
    "function* f() {  let x = 1; yield x; }",
    "function* f() {  yield 1; }"
);

to!(
    generator_let_increment,
    "function* f(x) {  let y = x++;  yield y; }",
    "function* f(x) { yield x++; }"
);

identical!(for_of_1, "var i = 0; for(i of n) {}");

identical!(for_of_2, "for( var i of n) { var x = i; }");

to!(
    for_of_2_fn,
    "for( var i of n) { var x = i; }",
    "for( var i of n) { }"
);

to!(
    tpl_lit_1,
    "var name = 'Foo'; `Hello ${name}`",
    "var name = 'Foo'; `Hello ${'Foo'}`"
);

to!(
    tpl_lit_2,
    "var name = 'Foo'; var foo = name; `Hello ${foo}`",
    "var name = 'Foo'; var foo = 'Foo'; `Hello ${'Foo'}`"
);

to!(
    tpl_lit_3,
    "var age = 3; `Age: ${age}`",
    "var age = 3; `Age: ${3}`"
);

to!(
    tagged_tpl_lit_1,
    concat!(
        "var name = 'Foo';",
        "function myTag(strings, nameExp, numExp) {",
        "  var modStr;",
        "  if (numExp > 2) {",
        "    modStr = nameExp + 'Bar'",
        "  } else { ",
        "    modStr = nameExp + 'BarBar'",
        "  }",
        "}",
        "var output = myTag`My name is ${name} ${3}`;",
    ),
    concat!(
        "var output = function myTag(strings, nameExp, numExp) {",
        "  var modStr;",
        "  if (numExp > 2) {",
        "    modStr = nameExp + 'Bar'",
        "  } else { ",
        "    modStr = nameExp + 'BarBar'",
        "  }",
        "}`My name is ${'Foo'} ${3}`;",
    )
);

to!(
    tagged_tpl_lit_2,
    concat!(
        "var name = 'Foo';",
        "function myTag(strings, nameExp, numExp) {",
        "  var modStr;",
        "  if (numExp > 2) {",
        "    modStr = nameExp + 'Bar'",
        "  } else { ",
        "    modStr = nameExp + 'BarBar'",
        "  }",
        "}",
        "var output = myTag`My name is ${name} ${3}`;",
        "output = myTag`My name is ${name} ${2}`;",
    ),
    concat!(
        "var name = 'Foo';",
        "function myTag(strings, nameExp, numExp) {",
        "  var modStr;",
        "  if (numExp > 2) {",
        "    modStr = nameExp + 'Bar'",
        "  } else { ",
        "    modStr = nameExp + 'BarBar'",
        "  }",
        "}",
        "var output = myTag`My name is ${'Foo'} ${3}`;",
        "output = myTag`My name is ${'Foo'} ${2}`;",
    )
);

to!(
    destructuring_fn,
    "var [a, b, c] = [1, 2, 3]
            var x = a;
            x; x;",
    "var [a, b, c] = [1, 2, 3]; a; a;"
);

identical!(
    function_scope_var_1,
    "var x = 1;
function foo(){
    x = 2;
}
use(x);
"
);

identical!(
    function_scope_var_2,
    "(function(){
        var x = 1;
        function foo(){
            x = 2;
        }
        use(x);
    }());"
);

identical!(
    top_level_does_not_inline_fn_decl,
    "function foo(){}
    use(foo);"
);

to!(
    custom_1,
    "
let b = 2;

let a = 1;
if (b) {
    a = 2;
}

let c;
if (a) {
    c = 3;
}
",
    "let b = 2;

let a = 1;
if (2) {
    a = 2;
}

let c;
if (a) {
    c = 3;
}"
);
