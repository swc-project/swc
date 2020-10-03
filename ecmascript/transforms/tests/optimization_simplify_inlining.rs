//! Copied from https://github.com/google/closure-compiler/blob/6ca3b62990064488074a1a8931b9e8dc39b148b3/test/com/google/javascript/jscomp/InlineVariablesTest.java

#![feature(test)]
use swc_common::chain;
use swc_ecma_transforms::{optimization::simplify::inlining::inlining, resolver};

#[macro_use]
mod common;

macro_rules! to {
    ($name:ident, $src:expr, $expected:expr) => {
        test!(
            Default::default(),
            |_| chain!(resolver(), inlining(Default::default())),
            $name,
            $src,
            $expected
        );
    };

    (ignore, $name:ident, $src:expr, $expected:expr) => {
        test!(
            ignore,
            Default::default(),
            |_| chain!(resolver(), inlining(Default::default())),
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
        |_| chain!(resolver(), inlining(Default::default())),
        src,
        expected,
        true
    )
}

/// Should not modify expression.
fn test_same(s: &str) {
    test(s, s)
}

to!(
    top_level_simple_var,
    "var a = 1; var b = a;",
    "var a; var b;"
);

to!(
    function_scope_simple_var,
    "var a = 1;
    var b = a;
    use(b);",
    "var a;
    var b;
    use(1);"
);

identical!(top_level_increment, "var x = 1; x++;");

identical!(top_level_decrement, "var x = 1; x--;");

identical!(top_level_assign_op, "var x = 1; x += 3;");

to!(
    simple_inline_in_fn,
    "var x = 1; var z = x; use(z)",
    "var x; var z; use(1)"
);

to!(
    ignore,
    unresolved_inline_in_fn,
    "var a = new obj();
    result = a;",
    "result = new obj()"
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
        let y;
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
        const y = x;
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
        let y1;  
        x;
    }
    y;"
);

to!(
    let_const_1,
    "
    const g = 3;
    let y = g;
    y;
",
    "const g = 3;
    let y;
    3;
"
);

to!(
    let_const_2,
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
    "let y;
    x;
    const g = 2;
    {
        const g1 = 3;
        let y1;
        3;
    }
    x;
    2;
    "
);

to!(
    regex,
    "var b;b=/ab/;(b)?x=1:x=2;",
    "var b;b=/ab/;/ab/?x=1:x=2;"
);

to!(
    generator_let_yield,
    "function* f() {  let x = 1; yield x; }",
    "function* f() {  let x; yield 1; }"
);

// TODO: Inline single use
identical!(
    generator_let_increment,
    "function* f(x) {  let y = x++;  yield y; }"
);

identical!(for_of_1, "var i = 0; for(i of n) {}");

identical!(for_of_2, "for( var i of n) { var x = i; }");

to!(
    tpl_lit_1,
    "var name = 'Foo'; `Hello ${name}`",
    "var name; `Hello ${'Foo'}`"
);

to!(
    tpl_lit_2,
    "var name = 'Foo'; var foo = name; `Hello ${foo}`",
    "var name; var foo; `Hello ${'Foo'}`"
);

to!(
    tpl_lit_3,
    "var age = 3; `Age: ${age}`",
    "var age; `Age: ${3}`"
);

to!(
    ignore,
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
        "var name;",
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
    })();"
);

identical!(
    top_level_does_not_inline_fn_decl,
    "function foo(){}
    use(foo);"
);

to!(
    custom_loop_1,
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
    "let b;

let a = 1;
if (2) {
    a = 2;
}

let c;
if (a) {
    c = 3;
}"
);

to!(
    custom_loop_2,
    "let b = 2;

let a = 1;
a = 2;

let c;
if (a) c = 3",
    "let b;

let a;
a = 2;

let c;
if (2) c = 3"
);

to!(
    custom_loop_3,
    "let c;
c = 3;
console.log(c);",
    "let c;
c = 3;
console.log(3);"
);

#[test]
fn test_pass_doesnt_produce_invalid_code1() {
    test_same(concat!(
        "function f(x = void 0) {",
        "  var z;",
        "  {",
        "    const y = {};",
        "    x && (y['x'] = x);",
        "    z = y;",
        "  }",
        "  return z;",
        "}",
    ));
}

#[test]
fn test_pass_doesnt_produce_invalid_code2() {
    test_same(concat!(
        "function f(x = void 0) {",
        "  {",
        "    var z;",
        "    const y = {};",
        "    x && (y['x'] = x);",
        "    z = y;",
        "  }",
        "  return z;",
        "}",
    ));
}

#[test]
fn test_pass_doesnt_produce_invalid_code3() {
    test(
        concat!(
            "function f(x = void 0) {",
            "  var z;",
            "  const y = {};",
            "  x && (y['x'] = x);",
            "  z = y;",
            "  {",
            "    return z;",
            "  }",
            "}",
        ),
        concat!(
            "function f(x = void 0) {",
            "  var z;",
            "  const y = {};",
            "  x && (y['x'] = x);",
            "  z = y;",
            "  {",
            "    return y;",
            "  }",
            "}",
        ),
    );
}

// Test respect for scopes and blocks

#[test]
fn test_inline_global() {
    test("var x = 1; var z = x;", "var x; var z;");
}

#[test]
fn test_do_not_inline_increment() {
    test_same("var x = 1; x++;");
}

#[test]
fn test_do_not_inline_decrement() {
    test_same("var x = 1; x--;");
}

#[test]
fn test_do_not_inline_into_lhs_of_assign() {
    test_same("var x = 1; x += 3;");
}

#[test]
#[ignore]
fn orig_test_inline_into_rhs_of_assign() {
    test("var x = foo(); var y = x;", "var x; var y = foo();");
}

#[test]
fn test_inline_into_rhs_of_assign() {
    test("var x = foo(); var y = x;", "var x = foo(); var y = x;");
}

#[test]
fn test_inline_in_function1() {
    test(
        "function baz() { var x = 1; var z = x; }",
        "function baz() { var x; var z; }",
    );
}

#[test]
#[ignore]
fn test_inline_in_function2() {
    test(
        "function baz() {  var a = new obj(); result = a; }",
        "function baz() {  result = new obj() }",
    );
}

#[test]
fn test_inline_in_function3() {
    test_same("function baz() {  var a = new obj(); (function(){a;})(); result = a; }");
}

#[test]
fn test_inline_in_function4() {
    test_same("function baz() {  var a = new obj(); foo.result = a; }");
}

#[test]
fn test_inline_in_function5() {
    test(
        "function baz() {  var a = (foo = new obj()); foo.x(); result = a; }",
        "function baz() {  var a = foo = new obj(); foo.x(); result = a; }",
    );
}

#[test]
#[ignore]
fn orig_test_inline_in_function6() {
    test(
        "function baz() { { var x = foo(); var z = x; } }",
        "function baz() { { var x; var z = foo(); } }",
    );
}

#[test]
fn test_inline_in_function6() {
    test(
        "function baz() { { var x = foo(); var z = x; } }",
        "function baz() { { var x = foo(); var z = x; } }",
    );
}

#[test]
fn test_inline_in_function7() {
    test(
        "function baz() { var x = 1; { var z = x; } }",
        "function baz() { var x; { var z; } }",
    );
}

#[test]
#[ignore]
fn test_inline_into_arrow_function1() {
    test("var x = 0; var f = () => x + 1;", "var f = () => 0 + 1;");
}

#[test]
#[ignore]
fn test_inline_into_arrow_function2() {
    test(
        "var x = 0; var f = () => { return x + 1; }",
        "var f = () => { return 0 + 1; }",
    );
}

#[test]
fn test_do_not_exit_conditional1() {
    test_same("if (true) { var x = 1; } var z = x;");
}

#[test]
fn test_do_not_exit_conditional2() {
    test_same("if (true) var x = 1; var z = x;");
}

#[test]
fn test_do_not_exit_conditional3() {
    test_same("var x; if (true) x=1; var z = x;");
}

#[test]
fn test_do_not_exit_loop() {
    test_same("while (z) { var x = 3; } var y = x;");
}

#[test]
#[ignore]
fn orig_test_do_not_exit_for_loop() {
    test(
        "for (var i = 1; false; false) var z = i;",
        "for (;false;false) var z = 1;",
    );
    test_same("for (; false; false) var i = 1; var z = i;");
    test_same("for (var i in {}); var z = i;");
}

#[test]
fn test_do_not_exit_for_loop() {
    test(
        "for (var i = 1; false; false) var z = i;",
        "for (var i = 1;false;false) var z = i;",
    );
    test_same("for (; false; false) var i = 1; var z = i;");
    test_same("for (var i in {}); var z = i;");
}

#[test]
fn test_do_not_enter_subscope() {
    test_same(concat!(
        "var x = function() {",
        "  var self = this; ",
        "  return function() { var y = self; };",
        "}"
    ));
    test_same("var x = function() {   var y = [1];    return function() { var z = y; }; }");
}

#[test]
fn test_do_not_exit_try() {
    test(
        "try { var x = y; } catch (e) {} var z = y; ",
        "try { var x = y; } catch (e) {} var z = y; ",
    );
    test_same("try { throw e; var x = 1; } catch (e) {} var z = x; ");
}

#[test]
fn test_do_not_enter_catch() {
    test_same("try { } catch (e) { var z = e; } ");
}

#[test]
fn test_do_not_enter_finally() {
    test_same("try { throw e; var x = 1; } catch (e) {}  finally  { var z = x; } ");
}

#[test]
#[ignore]
fn orig_test_inside_if_conditional() {
    test(
        "var a = foo(); if (a) { alert(3); }",
        "var a; if (foo()) { alert(3); }",
    );
    test(
        "var a; a = foo(); if (a) { alert(3); }",
        "var a; if (foo()) { alert(3); }",
    );
}

#[test]
fn test_inside_if_conditional() {
    test(
        "var a = foo(); if (a) { alert(3); }",
        "var a = foo(); if (a) { alert(3); }",
    );
    test(
        "var a; a = foo(); if (a) { alert(3); }",
        "var a; a = foo(); if (a) { alert(3); }",
    );
}

#[test]
#[ignore]
fn test_only_read_at_initialization() {
    test("var a; a = foo();", "foo();");
    test(
        "var a; if (a = foo()) { alert(3); }",
        "if (foo()) { alert(3); }",
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
#[ignore]
fn test_immutable_with_single_reference_after_initialzation() {
    test("var a; a = 1;", "var a; a = 1;");
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

#[test]
#[ignore]
fn test_single_reference_after_initialzation() {
    test("var a; a = foo();a;", "foo();");
    test_same("var a; if (a = foo()) { alert(3); } a;");
    test_same("var a; switch (a = foo()) {} a;");
    test_same("var a; function f(){ return a = foo(); } a;");
    test_same("function f(){ var a; return a = foo(); a;}");
    test_same("var a; with (a = foo()) { alert(3); } a;");
    test_same("var a; b = (a = foo()); a;");
    test_same("var a; while(a = foo()) { alert(3); } a;");
    test_same("var a; for(;a = foo();) { alert(3); } a;");
    test_same("var a; do {} while(a = foo()) { alert(3); } a;");
}

#[test]
fn test_inside_if_branch() {
    test_same("var a = foo(); if (1) { alert(a); }");
}

#[test]
#[ignore]
fn orig_test_inside_and_conditional() {
    test("var a = foo(); a && alert(3);", "foo() && alert(3);");
}

#[test]
fn test_inside_and_conditional() {
    test(
        "var a = foo(); a && alert(3);",
        "var a = foo(); a && alert(3);",
    );
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
#[ignore]
fn orig_test_inside_hook_conditional() {
    test(
        "var a = foo(); a ? alert(1) : alert(3)",
        "foo() ? alert(1) : alert(3)",
    );
}

#[test]
fn test_inside_hook_conditional() {
    test(
        "var a = foo(); a ? alert(1) : alert(3)",
        "var a = foo(); a ? alert(1) : alert(3)",
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

// Test movement of constant values

#[test]
#[ignore]
fn test_do_cross_function() {
    // We know foo() does not affect x because we require that x is only
    // referenced twice.
    test("var x = 1; foo(); var z = x;", "foo(); var z = 1;");
}

#[test]
#[ignore]
fn orig_test_do_not_cross_referencing_function() {
    test_same("var f = function() { var z = x; }; var x = 1; f(); var z = x; f();");
}

#[test]
fn test_do_not_cross_referencing_function() {
    test(
        "var f = function() { var z = foo(); }; var x = 1; f(); var z = x; f();",
        "var f = function() { var z = foo(); }; var x = 1; f(); var z = x; f();",
    );
}

// Test tricky declarations and references

#[test]
fn test_chained_assignment() {
    test("var a = 2, b = 2; var c = b;", "var a, b; var c;");
    test("var a = 2, b = 2; var c = a;", "var a, b; var c;");
    test(
        "var a = b = 2; var f = 3; var c = a;",
        "var a; var f; var c = b = 2;",
    );
    test_same("var a = b = 2; var c;");
}

#[test]
fn test_for_in() {
    test(
        "for (var i in j) { var c = i; }",
        "for (var i in j) { var c = i; }",
    );
    test_same("var i = 0; for (i in j) ;");
    test_same("var i = 0; for (i in j) { var c = i; }");
    test_same("i = 0; for (var i in j) { var c = i; }");
    test_same("var j = {'key':'value'}; for (var i in j) {print(i)};");
}

// Test movement of values that have (may) side effects

#[test]
#[ignore]
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
#[ignore]
fn test_do_cross_var() {
    // Assumes we do not rely on undefined variables (not technically correct!)
    test("var a = b; var b = 3; alert(a)", "alert(3);");
}

#[test]
#[ignore]
fn test_overlapping_in_lines() {
    test(
        concat!(
            "a = function(el, x, opt_y) { ",
            "  var cur = bar(el); ",
            "  opt_y = x.y; ",
            "  x = x.x; ",
            "  var dx = x - cur.x; ",
            "  var dy = opt_y - cur.y;",
            "  foo(el, el.offsetLeft + dx, el.offsetTop + dy); ",
            "};"
        ),
        concat!(
            "a = function(el, x, opt_y) { ",
            "  var cur = bar(el); ",
            "  opt_y = x.y; ",
            "  x = x.x; ",
            "  foo(el, el.offsetLeft + (x - cur.x),",
            "      el.offsetTop + (opt_y - cur.y)); ",
            "};"
        ),
    );
}

#[test]
#[ignore]
fn test_inline_into_loops() {
    test(
        "var x = true; while (true) alert(x);",
        "var x; while (true) alert(true);",
    );
    test(
        "var x = true; while (true) for (var i in {}) alert(x);",
        "var x; while (true) for (var i in {}) alert(true);",
    );
    test_same("var x = [true]; while (true) alert(x);");
}

#[test]
#[ignore]
fn test_inline_into_function() {
    test(
        "var x = false; var f = function() { alert(x); };",
        "var f = function() { alert(false); };",
    );
    test_same("var x = [false]; var f = function() { alert(x); };");
}

#[test]
fn test_no_inline_into_named_function() {
    test_same("f(); var x = false; function f() { alert(x); };");
}

#[test]
#[ignore]
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
    test("var x = null; var y = x, z = x;", "var x; var y, z;");
    test("var x = 3; var y = x, z = x;", "var x; var y, z;");
}

#[test]
fn test_inline_string_multiple_times_when_aliasing_all_strings() {
    test(
        "var x = 'abcdefghijklmnopqrstuvwxyz'; var y = x, z = x;",
        "var x; var y, z;",
    );
}

#[test]
fn test_no_inline_backwards() {
    test_same("var y = x; var x = foo();");
}

#[test]
fn test_no_inline_out_of_branch() {
    test_same("if (true) var x = foo(); var y = x;");
}

#[test]
#[ignore]
fn orig_test_interfering_in_lines() {
    test(
        "var a = 3; var f = function() { var x = a; alert(x); };",
        "var a; var f = function() { var x; alert(3); };",
    );
}

#[test]
fn test_interfering_in_lines() {
    test(
        "var a = 3; var f = function() { var x = a; alert(x); };",
        "var a = 3; var f = function() { var x = a; alert(x); };",
    );
}

#[test]
#[ignore]
fn test_inline_into_try_catch() {
    test(
        concat!(
            "var a = true; ",
            "try { var b = a; } ",
            "catch (e) { var c = a + b; var d = true; } ",
            "finally { var f = a + b + c + d; }"
        ),
        concat!(
            "try { var b = true; } ",
            "catch (e) { var c = true + b; var d = true; } ",
            "finally { var f = true + b + c + d; }"
        ),
    );
}

// Make sure that we still inline constants that are not provably
// written before they're read.
#[test]
fn test_inline_constants() {
    test(
        "function foo() { return XXX; } var XXX = true;",
        "function foo() { return XXX; } var XXX = true;",
    );
}

#[test]
fn test_inline_string_when_worthwhile() {
    test("var x = 'a'; foo(x, x, x);", "var x; foo('a', 'a', 'a');");
}

#[test]
fn test_inline_constant_alias() {
    test(
        "var XXX = new Foo(); q(XXX); var YYY = XXX; bar(YYY)",
        "var XXX = new Foo(); q(XXX); var YYY = XXX; bar(YYY)",
    );
}

#[test]
#[ignore]
fn orig_test_inline_constant_alias_with_non_constant() {
    test(
        "var XXX = new Foo(); q(XXX); var y = XXX; bar(y); baz(y)",
        "var XXX = new Foo(); q(XXX); var y; bar(XXX); baz(XXX)",
    );
}

#[test]
fn test_inline_constant_alias_with_non_constant() {
    test(
        "var XXX = new Foo(); q(XXX); var y = XXX; bar(y); baz(y)",
        "var XXX = new Foo(); q(XXX); var y = XXX; bar(y); baz(y)",
    );
}

#[test]
#[ignore]
fn orig_test_cascading_in_lines() {
    test(
        "var XXX = 4;  function f() { var YYY = XXX; bar(YYY); baz(YYY); }",
        "var XXX; function f() { var YYY; bar(4); baz(4); }",
    );
}

#[test]
fn test_cascading_in_lines() {
    test(
        "var XXX = 4;  function f() { var YYY = XXX; bar(YYY); baz(YYY); }",
        "var XXX = 4;  function f() { var YYY = XXX; bar(YYY); baz(YYY); }",
    );
}

#[test]
fn test_no_inline_getprop_into_call_1() {
    test("var a = b; a();", "var a; b();");
}

#[test]
fn test_no_inline_getprop_into_call_2() {
    test("var a = b.c; f(a);", "var a; f(b.c);");
}

#[test]
fn test_no_inline_getprop_into_call_3() {
    test_same("var a = b.c; a();");
}

#[test]
#[ignore]
fn test_inline_function_declaration() {
    test(
        "var f = function () {}; var a = f;",
        "var f; var a = function () {};",
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
#[ignore]
fn test_inline_aliases1() {
    test(
        "var x = this.foo(); this.bar(); var y = x; this.baz(y);",
        "var x = this.foo(); this.bar(); var y; this.baz(x);",
    );
}

#[test]
#[ignore]
fn test_inline_aliases1b() {
    test(
        "var x = this.foo(); this.bar(); var y; y = x; this.baz(y);",
        "var x = this.foo(); this.bar(); var y; x; this.baz(x);",
    );
}

#[test]
#[ignore]
fn test_inline_aliases1c() {
    test(
        "var x; x = this.foo(); this.bar(); var y = x; this.baz(y);",
        "var x; x = this.foo(); this.bar(); var y; this.baz(x);",
    );
}

#[test]
#[ignore]
fn test_inline_aliases1d() {
    test(
        "var x; x = this.foo(); this.bar(); var y; y = x; this.baz(y);",
        "var x; x = this.foo(); this.bar(); var y; x; this.baz(x);",
    );
}

#[test]
#[ignore]
fn test_inline_aliases2() {
    test(
        "var x = this.foo(); this.bar();  function f() { var y = x; this.baz(y); }",
        "var x = this.foo(); this.bar(); function f() { var y; this.baz(x); }",
    );
}

#[test]
#[ignore]
fn test_inline_aliases2b() {
    test(
        "var x = this.foo(); this.bar();  function f() { var y; y = x; this.baz(y); }",
        "var x = this.foo(); this.bar(); function f() { var y; x; this.baz(x); }",
    );
}

#[test]
#[ignore]
fn test_inline_aliases2c() {
    test(
        "var x; x = this.foo(); this.bar();  function f() { var y = x; this.baz(y); }",
        "var x; x = this.foo(); this.bar(); function f() { var y = x; this.baz(x); }",
    );
}

#[test]
#[ignore]
fn test_inline_aliases2d() {
    test(
        "var x; x = this.foo(); this.bar();  function f() { var y; y = x; this.baz(y); }",
        "var x; x = this.foo(); this.bar(); function f() { this.baz(x); }",
    );
}

#[test]
#[ignore]
fn test_inline_aliases_in_loop() {
    test(
        concat!(
            "function f() { ",
            "  var x = extern();",
            "  for (var i = 0; i < 5; i++) {",
            "    (function() {",
            "       var y = x; window.setTimeout(function() { extern(y); }, 0);",
            "     })();",
            "  }",
            "}"
        ),
        concat!(
            "function f() { ",
            "  var x = extern();",
            "  for (var i = 0; i < 5; i++) {",
            "    (function() {",
            "       window.setTimeout(function() { extern(x); }, 0);",
            "     })();",
            "  }",
            "}"
        ),
    );
}

#[test]
fn test_no_inline_aliases_in_loop() {
    test_same(concat!(
        "function f() { ",
        "  for (var i = 0; i < 5; i++) {",
        "    var x = extern();",
        "    (function() {",
        "       var y = x; window.setTimeout(function() { extern(y); }, 0);",
        "     })();",
        "  }",
        "}"
    ));
}

#[test]
fn modifier_test_no_inline_aliases1() {
    test(
        "var x = this.foo(); this.bar(); var y = x; x = 3; this.baz(y);",
        "var x = this.foo(); this.bar(); var y = x; x = 3; this.baz(y);",
    );
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
    test_same(concat!(
        "var x = this.foo(); this.bar(); ",
        "function f() { var y = x; g(); this.baz(y); } ",
        "function g() { x = 3; }"
    ));
}

#[test]
fn test_no_inline_aliases3b() {
    test_same(concat!(
        "var x = this.foo(); this.bar(); ",
        "function f() { var y; y = x; g(); this.baz(y); } ",
        "function g() { x = 3; }"
    ));
}

#[test]
fn test_no_inline_aliases4() {
    test_same("var x = this.foo(); this.bar();  function f() { var y = x; y = 3; this.baz(y); }");
}

#[test]
fn test_no_inline_aliases4b() {
    test_same(
        "var x = this.foo(); this.bar();  function f() { var y; y = x; y = 3; this.baz(y); }",
    );
}

#[test]
fn test_no_inline_aliases5() {
    test_same("var x = this.foo(); this.bar(); var y = x; this.bing(); this.baz(y); x = 3;");
}

#[test]
fn test_no_inline_aliases5b() {
    test_same("var x = this.foo(); this.bar(); var y; y = x; this.bing(); this.baz(y); x = 3;");
}

#[test]
fn test_no_inline_aliases6() {
    test_same("var x = this.foo(); this.bar(); var y = x; this.bing(); this.baz(y); y = 3;");
}

#[test]
fn test_no_inline_aliases6b() {
    test_same("var x = this.foo(); this.bar(); var y; y = x; this.bing(); this.baz(y); y = 3;");
}

#[test]
fn test_no_inline_aliases7() {
    test_same(concat!(
        "var x = this.foo(); this.bar(); ",
        "function f() { var y = x; this.bing(); this.baz(y); x = 3; }"
    ));
}

#[test]
fn test_no_inline_aliases7b() {
    test_same(concat!(
        "var x = this.foo(); this.bar(); ",
        "function f() { var y; y = x; this.bing(); this.baz(y); x = 3; }"
    ));
}

#[test]
fn test_no_inline_aliases8() {
    test_same("var x = this.foo(); this.bar();  function f() { var y = x; this.baz(y); y = 3; }");
}

#[test]
fn test_no_inline_aliases8b() {
    test_same(
        "var x = this.foo(); this.bar();  function f() { var y; y = x; this.baz(y); y = 3; }",
    );
}

#[test]
fn test_inline_parameter_alias1() {
    test(
        "function f(x) {   var y = x;   g();   y;y; }",
        "function f(x) { var y;  g();   x;x; }",
    );
}

#[test]
#[ignore]
fn test_inline_parameter_alias2() {
    test(
        "function f(x) {   var y; y = x;   g();   y;y; }",
        "function f(x) {   x;   g();   x;x; }",
    );
}

#[test]
#[ignore]
fn orig_test_inline_function_alias1a() {
    test(
        "function f(x) {} var y = f; g(); y();y();",
        "var y = function f(x) {}; g(); y();y();",
    );
}

#[test]
fn test_inline_function_alias1a() {
    test(
        "function f(x) {} var y = f; g(); y();y();",
        "function f(x) {} var y; g(); f();f();",
    );
}

#[test]
fn test_inline_function_alias1b() {
    test(
        "function f(x) {}; f;var y = f; g(); y();y();",
        "function f(x) {}; f; var y; g(); f();f();",
    );
}

#[test]
fn test_inline_function_alias2a() {
    test(
        "function f(x) {} var y; y = f; g(); y();y();",
        "function f(x) {}  var y; y = f; g(); f();f();",
    );
}

#[test]
fn test_inline_function_alias2b() {
    test(
        "function f(x) {}; f; var y; y = f; g(); y();y();",
        "function f(x) {}; f; var y; y = f; g(); f();f();",
    );
}

#[test]
fn test_inline_switch_var() {
    test("var x = y; switch (x) {}", "var x; switch (y) {}");
}

#[test]
fn test_inline_switch_let() {
    test("let x = y; switch (x) {}", "let x; switch (y) {}");
}

// Successfully inlines 'values' and 'e'
#[test]
#[ignore]
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
            "    let e = $array[i];",
            "    hashCode = 31 * hashCode + calculate_hashCode(e);",
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
#[ignore]
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
#[ignore]
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
#[ignore]
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
fn test_var_in_block1() {
    test(
        "function f(x) { if (true) {var y = x; y; y;} }",
        "function f(x) { if (true) {var y; x; x;} }",
    );
}

#[test]
fn test_var_in_block2() {
    test(
        "function f(x) { switch (0) { case 0: { var y = x; y; y; } } }",
        "function f(x) { switch (0) { case 0: { var y; x; x; } } }",
    );
}

#[test]
fn test_inline_undefined1() {
    test("var x; x;", "var x; void 0;");
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
    test("var x; x; x;", "var x; void 0; void 0;");
}

#[test]
fn test_inline_undefined5() {
    test_same("var x; for(x in a) {}");
}

#[test]
fn test_issue90() {
    test("var x; x && alert(1)", "var x; (void 0) && alert(1)");
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
#[ignore]
fn test_inline_named_function() {
    test("function f() {} f();", "(function f(){})()");
}

#[test]
fn test_issue378_modified_arguments1() {
    test_same(concat!(
        "function g(callback) {\n",
        "  var f = callback;\n",
        "  arguments[0] = this;\n",
        "  f.apply(this, arguments);\n",
        "}"
    ));
}

#[test]
fn test_issue378_modified_arguments2() {
    test_same(concat!(
        "function g(callback) {\n",
        "  /** @const */\n",
        "  var f = callback;\n",
        "  arguments[0] = this;\n",
        "  f.apply(this, arguments);\n",
        "}"
    ));
}

#[test]
fn test_issue378_escaped_arguments1() {
    test_same(concat!(
        "function g(callback) {\n",
        "  var f = callback;\n",
        "  h(arguments,this);\n",
        "  f.apply(this, arguments);\n",
        "}\n",
        "function h(a,b) {\n",
        "  a[0] = b;",
        "}"
    ));
}

#[test]
fn test_issue378_escaped_arguments2() {
    test_same(concat!(
        "function g(callback) {\n",
        "  /** @const */\n",
        "  var f = callback;\n",
        "  h(arguments,this);\n",
        "  f.apply(this);\n",
        "}\n",
        "function h(a,b) {\n",
        "  a[0] = b;",
        "}"
    ));
}

#[test]
#[ignore] // We just give up optimization when arguments is used
fn test_issue378_escaped_arguments3() {
    test(
        concat!(
            "function g(callback) {\n",
            "  var f = callback;\n",
            "  f.apply(this, arguments);\n",
            "}\n"
        ),
        "function g(callback) {\n   callback.apply(this, arguments);\n }\n",
    );
}

#[test]
fn test_issue378_escaped_arguments4() {
    test_same(concat!(
        "function g(callback) {\n",
        "  var f = callback;\n",
        "  h(arguments[0],this);\n",
        "  f.apply(this, arguments);\n",
        "}\n",
        "function h(a,b) {\n",
        "  a[0] = b;",
        "}"
    ));
}

#[test]
#[ignore] // We just give up optimization when arguments is used
fn test_issue378_arguments_read1() {
    test(
        concat!(
            "function g(callback) {\n",
            "  var f = callback;\n",
            "  var g = arguments[0];\n",
            "  f.apply(this, arguments);\n",
            "}"
        ),
        concat!(
            "function g(callback) {\n",
            "  var g = arguments[0];\n",
            "  callback.apply(this, arguments);\n",
            "}"
        ),
    );
}

#[test]
#[ignore] // We just give up optimization when arguments is used
fn test_issue378_arguments_read2() {
    test(
        concat!(
            "function g(callback) {\n",
            "  var f = callback;\n",
            "  h(arguments[0],this);\n",
            "  f.apply(this, arguments[0]);\n",
            "}\n",
            "function h(a,b) {\n",
            "  a[0] = b;",
            "}"
        ),
        concat!(
            "function g(callback) {\n",
            "  h(arguments[0],this);\n",
            "  callback.apply(this, arguments[0]);\n",
            "}\n",
            "function h(a,b) {\n",
            "  a[0] = b;",
            "}"
        ),
    );
}

#[test]
#[ignore] // We just give up optimization when arguments is used
fn test_arguments_modified_in_outer_function() {
    test(
        concat!(
            "function g(callback) {\n",
            "  var f = callback;\n",
            "  arguments[0] = this;\n",
            "  f.apply(this, arguments);\n",
            "  function inner(callback) {",
            "    var x = callback;\n",
            "    x.apply(this);\n",
            "  }",
            "}"
        ),
        concat!(
            "function g(callback) {\n",
            "  var f = callback;\n",
            "  arguments[0] = this;\n",
            "  f.apply(this, arguments);\n",
            "  function inner(callback) {",
            "    callback.apply(this);\n",
            "  }",
            "}"
        ),
    );
}

#[test]
#[ignore] // We just give up optimization when arguments is used
fn test_arguments_modified_in_inner_function() {
    test(
        concat!(
            "function g(callback) {\n",
            "  var f = callback;\n",
            "  f.apply(this, arguments);\n",
            "  function inner(callback) {",
            "    var x = callback;\n",
            "    arguments[0] = this;\n",
            "    x.apply(this);\n",
            "  }",
            "}"
        ),
        concat!(
            "function g(callback) {\n",
            "  callback.apply(this, arguments);\n",
            "  function inner(callback1) {",
            "    var x = callback1;\n",
            "    arguments[0] = this;\n",
            "    x.apply(this);\n",
            "  }",
            "}"
        ),
    );
}

#[test]
fn test_bug6598844() {
    test_same(concat!(
        "function F() { this.a = 0; }",
        "F.prototype.inc = function() { this.a++; return 10; };",
        "F.prototype.bar = function() { var x = this.inc(); this.a += x; };"
    ));
}

#[test]
fn test_external_issue1053() {
    test_same("var u; function f() { u = Random(); var x = u; f(); alert(x===u)}");
}

#[test]
#[ignore]
fn test_hoisted_function1() {
    test(
        "var x = 1; function f() { return x; }",
        "var x; function f() { return 1; }",
    );
}

#[test]
fn test_hoisted_function2() {
    test_same(concat!(
        "var impl_0;",
        "b(a());",
        "function a() { impl_0 = {}; }",
        "function b() { window['f'] = impl_0; }"
    ));
}

#[test]
fn test_hoisted_function3() {
    test_same("var impl_0; b(); impl_0 = 1; function b() { window['f'] = impl_0; }");
}

#[test]
#[ignore]
fn test_hoisted_function4() {
    test(
        "var impl_0; impl_0 = 1; b(); function b() { window['f'] = impl_0; }",
        "var impl_0; 1; b(); function b() { window['f'] = 1; }",
    );
}

#[test]
fn test_hoisted_function5() {
    test_same("a(); var debug = 1; function b() { return debug; } function a() { return b(); }");
}

#[test]
#[ignore]
fn test_hoisted_function6() {
    test(
        concat!(
            "var debug = 1;",
            "a();",
            "function b() { return debug; }",
            "function a() { return b(); }"
        ),
        "var debug; a(); function b() { return 1; } function a() { return b(); }",
    );
}

#[test]
#[ignore]
fn orig_test_issue354() {
    test(
        concat!(
            "var enabled = true;",
            "function Widget() {}",
            "Widget.prototype = {",
            "  frob: function() {",
            "    search();",
            "  }",
            "};",
            "function search() {",
            "  if (enabled)",
            "    alert(1);",
            "  else",
            "    alert(2);",
            "}",
            "window.foo = new Widget();",
            "window.bar = search;"
        ),
        concat!(
            "var enabled;",
            "function Widget() {}",
            "Widget.prototype = {",
            "  frob: function() {",
            "    search();",
            "  }",
            "};",
            "function search() {",
            "  if (true)",
            "    alert(1);",
            "  else",
            "    alert(2);",
            "}",
            "window.foo = new Widget();",
            "window.bar = search;"
        ),
    );
}

#[test]
fn test_issue354() {
    test(
        concat!(
            "var enabled = true;",
            "function Widget() {}",
            "Widget.prototype = {",
            "  frob: function() {",
            "    search();",
            "  }",
            "};",
            "function search() {",
            "  if (enabled)",
            "    alert(1);",
            "  else",
            "    alert(2);",
            "}",
            "window.foo = new Widget();",
            "window.bar = search;"
        ),
        concat!(
            "var enabled = true;",
            "function Widget() {}",
            "Widget.prototype = {",
            "  frob: function() {",
            "    search();",
            "  }",
            "};",
            "function search() {",
            "  if (enabled)",
            "    alert(1);",
            "  else",
            "    alert(2);",
            "}",
            "window.foo = new Widget();",
            "window.bar = search;"
        ),
    );
}

// Test respect for scopes and blocks
#[test]
#[ignore]
fn orig_test_issue1177() {
    test_same("function x_64(){var x_7;for(;;);var x_68=x_7=x_7;}");
    test_same("function x_64(){var x_7;for(;;);var x_68=x_7=x_7++;}");
    test_same("function x_64(){var x_7;for(;;);var x_68=x_7=x_7*2;}");
}

// GitHub issue #1234: https://github.com/google/closure-compiler/issues/1234
#[test]
fn test_switch_github_issue1234() {
    test_same(concat!(
        "var x;",
        "switch ('a') {",
        "  case 'a':",
        "    break;",
        "  default:",
        "    x = 1;",
        "    break;",
        "}",
        "use(x);",
    ));
}

#[test]
fn test_let_const() {
    test(
        concat!(
            "function f(x) {",
            "  if (true) {",
            "    let y = x; y; y;",
            "  }",
            "}",
        ),
        concat!(
            "function f(x) {",
            "  if (true) { ",
            "    let y;",
            "    x; x;",
            "  }",
            "}"
        ),
    );

    test(
        concat!(
            "function f(x) {",
            "  if (true) {",
            "    const y = x; y; y;",
            "    }",
            "  }",
        ),
        concat!(
            "function f(x) {",
            "  if (true) {",
            "    const y = x;",
            "    x; x;",
            "  }",
            "}"
        ),
    );

    test(
        concat!(
            "function f(x) {",
            "  let y;",
            "  {",
            "    let y = x; y;",
            "  }",
            "}",
        ),
        concat!(
            "function f(x) {",
            "  let y;",
            "  { let y1;",
            "    x;",
            "  }",
            "}"
        ),
    );

    test(
        concat!(
            "function f(x) {",
            "  let y = x; y; const g = 2; ",
            "  {",
            "    const g = 3; let y = g; y;",
            "  }",
            "}",
        ),
        concat!(
            "function f(x) {",
            "  let y; ",
            "  x; const g = 2;",
            "  { const g1 = 3; let y1; 3;}",
            "}"
        ),
    );
}

#[test]
#[ignore]
fn test_generators() {
    test(
        concat!("function* f() {", "  let x = 1;", "  yield x;", "}"),
        concat!("function* f() {", " let x;", " yield 1;", "}"),
    );

    test(
        concat!("function* f(x) {", "  let y = x++", "  yield y;", "}"),
        concat!("function* f(x) {", "  yield x++;", "}"),
    );
}

#[test]
fn test_template_strings() {
    test(
        " var name = 'Foo'; `Hello ${name}`",
        "var name;`Hello ${'Foo'}`",
    );

    test(
        " var name = 'Foo'; var foo = name; `Hello ${foo}`",
        "var name;
var foo; `Hello ${'Foo'}`",
    );

    test(" var age = 3; `Age: ${age}`", "var age; `Age: ${3}`");
}

#[test]
#[ignore]
fn test_tagged_template_literals() {
    test(
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
        ),
    );

    test(
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
        ),
    );
}

to!(
    deno_001,
    r#"

const encoder = new TextEncoder();
function encode(input) {
    return encoder.encode(input);
}
const decoder = new TextDecoder();
function decode(input) {
    return decoder.decode(input);
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
function deferred1() {
    let methods;
    const promise = new Promise((resolve, reject)=>{
    });
    return Object.assign(promise, methods);
}
function emptyReader() {
    return {
        read (_) {
            return Promise.resolve(null);
        }
    };
}
function bodyReader(contentLength, r) {
    let totalRead = 0;
    let finished = false;
    async function read(buf) {
        if (finished) return null;
        let result;
        const remaining = contentLength - totalRead;
        if (remaining >= buf.byteLength) {
            result = await r.read(buf);
        } else {
            const readBuf = buf.subarray(0, remaining);
            result = await r.read(readBuf);
        }
        finished = totalRead === contentLength;
        return result;
    }
    return {
        read
    };
}
function chunkedBodyReader(h, r) {
    const tp = new TextProtoReader(r);
    let finished = false;
    const chunks = [];
    async function read(buf) {
        if (finished) return null;
        const [chunk] = chunks;
        if (chunk) {
            const chunkRemaining = chunk.data.byteLength - chunk.offset;
            const readLength = Math.min(chunkRemaining, buf.byteLength);
            for(let i = 0; i < readLength; i++){
                buf[i] = chunk.data[chunk.offset + i];
            }
            chunk.offset += readLength;
            if (chunk.offset === chunk.data.byteLength) {
                chunks.shift();
                if (await tp.readLine() === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
            }
            return readLength;
        }
        const line = await tp.readLine();
        if (line === null) throw new Deno.errors.UnexpectedEof();
        const [chunkSizeString] = line.split(";");
        const chunkSize = parseInt(chunkSizeString, 16);
        if (Number.isNaN(chunkSize) || chunkSize < 0) {
            throw new Error("Invalid chunk size");
        }
        if (chunkSize > 0) {
            if (chunkSize > buf.byteLength) {
                let eof = await r.readFull(buf);
                if (eof === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
                const restChunk = new Uint8Array(chunkSize - buf.byteLength);
                eof = await r.readFull(restChunk);
                if (eof === null) {
                    throw new Deno.errors.UnexpectedEof();
                } else {
                    chunks.push({
                        offset: 0,
                        data: restChunk
                    });
                }
                return buf.byteLength;
            } else {
                const bufToFill = buf.subarray(0, chunkSize);
                const eof = await r.readFull(bufToFill);
                if (eof === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
                if (await tp.readLine() === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
                return chunkSize;
            }
        } else {
            assert(chunkSize === 0);
            if (await r.readLine() === null) {
                throw new Deno.errors.UnexpectedEof();
            }
            await readTrailers(h, r);
            finished = true;
            return null;
        }
    }
    return {
        read
    };
}
function isProhibidedForTrailer(key) {
    const s = new Set([
        "transfer-encoding",
        "content-length",
        "trailer"
    ]);
    return s.has(key.toLowerCase());
}
async function readTrailers(headers, r) {
    const trailers = parseTrailer(headers.get("trailer"));
    if (trailers == null) return;
    const trailerNames = [
        ...trailers.keys()
    ];
    const tp = new TextProtoReader(r);
    const result = await tp.readMIMEHeader();
    if (result == null) {
        throw new Deno.errors.InvalidData("Missing trailer header.");
    }
    const undeclared = [
        ...result.keys()
    ].filter((k)=>!trailerNames.includes(k)
    );
    if (undeclared.length > 0) {
        throw new Deno.errors.InvalidData(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
    }
    for (const [k, v] of result){
        headers.append(k, v);
    }
    const missingTrailers = trailerNames.filter((k1)=>!result.has(k1)
    );
    if (missingTrailers.length > 0) {
        throw new Deno.errors.InvalidData(`Missing trailers: ${Deno.inspect(missingTrailers)}.`);
    }
    headers.delete("trailer");
}
function parseTrailer(field) {
    if (field == null) {
        return undefined;
    }
    const trailerNames = field.split(",").map((v)=>v.trim().toLowerCase()
    );
    if (trailerNames.length === 0) {
        throw new Deno.errors.InvalidData("Empty trailer header.");
    }
    const prohibited = trailerNames.filter((k)=>isProhibidedForTrailer(k)
    );
    if (prohibited.length > 0) {
        throw new Deno.errors.InvalidData(`Prohibited trailer names: ${Deno.inspect(prohibited)}.`);
    }
    return new Headers(trailerNames.map((key)=>[
            key,
            ""
        ]
    ));
}
async function writeChunkedBody(w, r) {
    const writer = BufWriter.create(w);
    for await (const chunk of Deno.iter(r)){
        if (chunk.byteLength <= 0) continue;
        const start = encoder.encode(`${chunk.byteLength.toString(16)}\r\n`);
        const end = encoder.encode("\r\n");
        await writer.write(start);
        await writer.write(chunk);
        await writer.write(end);
    }
    const endChunk = encoder.encode("0\r\n\r\n");
    await writer.write(endChunk);
}
async function writeTrailers(w, headers, trailers) {
    const trailer = headers.get("trailer");
    if (trailer === null) {
        throw new TypeError("Missing trailer header.");
    }
    const transferEncoding = headers.get("transfer-encoding");
    if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
        throw new TypeError(`Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`);
    }
    const writer = BufWriter.create(w);
    const trailerNames = trailer.split(",").map((s)=>s.trim().toLowerCase()
    );
    const prohibitedTrailers = trailerNames.filter((k)=>isProhibidedForTrailer(k)
    );
    if (prohibitedTrailers.length > 0) {
        throw new TypeError(`Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`);
    }
    const undeclared = [
        ...trailers.keys()
    ].filter((k)=>!trailerNames.includes(k)
    );
    if (undeclared.length > 0) {
        throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
    }
    for (const [key, value] of trailers){
        await writer.write(encoder.encode(`${key}: ${value}\r\n`));
    }
    await writer.write(encoder.encode("\r\n"));
    await writer.flush();
}
async function writeResponse(w, r) {
    const protoMajor = 1;
    const protoMinor = 1;
    const statusCode = r.status || 200;
    const statusText = STATUS_TEXT.get(statusCode);
    const writer = BufWriter.create(w);
    if (!statusText) {
        throw new Deno.errors.InvalidData("Bad status code");
    }
    if (!r.body) {
        r.body = new Uint8Array();
    }
    if (typeof r.body === "string") {
        r.body = encoder.encode(r.body);
    }
    let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
    const headers = r.headers ?? new Headers();
    if (r.body && !headers.get("content-length")) {
        if (r.body instanceof Uint8Array) {
            out += `content-length: ${r.body.byteLength}\r\n`;
        } else if (!headers.get("transfer-encoding")) {
            out += "transfer-encoding: chunked\r\n";
        }
    }
    for (const [key, value] of headers){
        out += `${key}: ${value}\r\n`;
    }
    out += `\r\n`;
    const header = encoder.encode(out);
    const n = await writer.write(header);
    assert(n === header.byteLength);
    if (r.body instanceof Uint8Array) {
        const n1 = await writer.write(r.body);
        assert(n1 === r.body.byteLength);
    } else if (headers.has("content-length")) {
        const contentLength = headers.get("content-length");
        assert(contentLength != null);
        const bodyLength = parseInt(contentLength);
        const n1 = await Deno.copy(r.body, writer);
        assert(n1 === bodyLength);
    } else {
        await writeChunkedBody(writer, r.body);
    }
    if (r.trailers) {
        const t = await r.trailers();
        await writeTrailers(writer, headers, t);
    }
    await writer.flush();
}
function parseHTTPVersion(vers) {
    switch(vers){
        case "HTTP/1.1":
            return [
                1,
                1
            ];
        case "HTTP/1.0":
            return [
                1,
                0
            ];
        default:
            {
                const Big = 1000000;
                if (!vers.startsWith("HTTP/")) {
                    break;
                }
                const dot = vers.indexOf(".");
                if (dot < 0) {
                    break;
                }
                const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
                const major = Number(majorStr);
                if (!Number.isInteger(major) || major < 0 || major > Big) {
                    break;
                }
                const minorStr = vers.substring(dot + 1);
                const minor = Number(minorStr);
                if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
                    break;
                }
                return [
                    major,
                    minor
                ];
            }
    }
    throw new Error(`malformed HTTP version ${vers}`);
}
async function readRequest(conn, bufr) {
    const tp = new TextProtoReader(bufr);
    const firstLine = await tp.readLine();
    if (firstLine === null) return null;
    const headers = await tp.readMIMEHeader();
    if (headers === null) throw new Deno.errors.UnexpectedEof();
    const req = new ServerRequest();
    req.conn = conn;
    req.r = bufr;
    [req.method, req.url, req.proto] = firstLine.split(" ", 3);
    [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
    req.headers = headers;
    fixLength(req);
    return req;
}
function fixLength(req) {
    const contentLength = req.headers.get("Content-Length");
    if (contentLength) {
        const arrClen = contentLength.split(",");
        if (arrClen.length > 1) {
            const distinct = [
                ...new Set(arrClen.map((e)=>e.trim()
                ))
            ];
            if (distinct.length > 1) {
                throw Error("cannot contain multiple Content-Length headers");
            } else {
                req.headers.set("Content-Length", distinct[0]);
            }
        }
        const c = req.headers.get("Content-Length");
        if (req.method === "HEAD" && c && c !== "0") {
            throw Error("http: method cannot contain a Content-Length");
        }
        if (c && req.headers.has("transfer-encoding")) {
            throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
        }
    }
}
class ServerRequest {
    done = deferred();
    _contentLength = undefined;
    get contentLength() {
        if (this._contentLength === undefined) {
            const cl = this.headers.get("content-length");
            if (cl) {
                this._contentLength = parseInt(cl);
                if (Number.isNaN(this._contentLength)) {
                    this._contentLength = null;
                }
            } else {
                this._contentLength = null;
            }
        }
        return this._contentLength;
    }
    _body = null;
    get body() {
        if (!this._body) {
            if (this.contentLength != null) {
                this._body = bodyReader(this.contentLength, this.r);
            } else {
                const transferEncoding = this.headers.get("transfer-encoding");
                if (transferEncoding != null) {
                    const parts = transferEncoding.split(",").map((e)=>e.trim().toLowerCase()
                    );
                    assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
                    this._body = chunkedBodyReader(this.headers, this.r);
                } else {
                    this._body = emptyReader();
                }
            }
        }
        return this._body;
    }
    async respond(r) {
        let err;
        try {
            await writeResponse(this.w, r);
        } catch (e) {
            try {
                this.conn.close();
            } catch  {
            }
        }
        this.done.resolve(err);
        if (err) {
            throw err;
        }
    }
    finalized = false;
    async finalize() {
        if (this.finalized) return;
        this.finalized = true;
    }
}
class Server {
    closing = false;
    connections = [];
    constructor(listener1){
        this.listener = listener1;
    }
    close() {
        this.closing = true;
        this.listener.close();
        for (const conn of this.connections){
            try {
                conn.close();
            } catch (e) {
                if (!(e instanceof Deno.errors.BadResource)) {
                    throw e;
                }
            }
        }
    }
    async *iterateHttpRequests(conn) {
        const reader = new BufReader(conn);
        const writer = new BufWriter(conn);
        while(!this.closing){
            let request;
            try {
                request = await readRequest(conn, reader);
            } catch (error) {
                if (error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) {
                    await writeResponse(writer, {
                        status: 400,
                        body: encode(`${error.message}\r\n\r\n`)
                    });
                }
                break;
            }
            if (request === null) {
                break;
            }
            request.w = writer;
            yield request;
            const responseError = await request.done;
            if (responseError) {
                this.untrackConnection(request.conn);
                return;
            }
            await request.finalize();
        }
        this.untrackConnection(conn);
        try {
            conn.close();
        } catch (e) {
        }
    }
    trackConnection(conn) {
        this.connections.push(conn);
    }
    untrackConnection(conn) {
        const index = this.connections.indexOf(conn);
        if (index !== -1) {
            this.connections.splice(index, 1);
        }
    }
    async *acceptConnAndIterateHttpRequests(mux) {
        if (this.closing) return;
        let conn;
        try {
            conn = await this.listener.accept();
        } catch (error) {
            if (error instanceof Deno.errors.BadResource || error instanceof Deno.errors.InvalidData || error instanceof Deno.errors.UnexpectedEof) {
                return mux.add(this.acceptConnAndIterateHttpRequests(mux));
            }
            throw error;
        }
        this.trackConnection(conn);
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        yield* this.iterateHttpRequests(conn);
    }
    [Symbol.asyncIterator]() {
        const mux = new MuxAsyncIterator();
        mux.add(this.acceptConnAndIterateHttpRequests(mux));
        return mux.iterate();
    }
}
function _parseAddrFromStr(addr) {
    let url;
    try {
        const host = addr.startsWith(":") ? `0.0.0.0${addr}` : addr;
        url = new URL(`http://${host}`);
    } catch  {
        throw new TypeError("Invalid address.");
    }
    if (url.username || url.password || url.pathname != "/" || url.search || url.hash) {
        throw new TypeError("Invalid address.");
    }
    return {
        hostname: url.hostname,
        port: url.port === "" ? 80 : Number(url.port)
    };
}
function serve(addr) {
    if (typeof addr === "string") {
        addr = _parseAddrFromStr(addr);
    }
    const listener1 = Deno.listen(addr);
    return new Server(listener1);
}
function serveTLS(options) {
    const tlsOptions = {
        ...options,
        transport: "tcp"
    };
    const listener1 = Deno.listenTls(tlsOptions);
    return new Server(listener1);
}
var Status;
(function(Status1) {
    Status1[Status1["Continue"] = 100] = "Continue";
    Status1[Status1["SwitchingProtocols"] = 101] = "SwitchingProtocols";
    Status1[Status1["Processing"] = 102] = "Processing";
    Status1[Status1["EarlyHints"] = 103] = "EarlyHints";
    Status1[Status1["OK"] = 200] = "OK";
    Status1[Status1["Created"] = 201] = "Created";
    Status1[Status1["Accepted"] = 202] = "Accepted";
    Status1[Status1["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
    Status1[Status1["NoContent"] = 204] = "NoContent";
    Status1[Status1["ResetContent"] = 205] = "ResetContent";
    Status1[Status1["PartialContent"] = 206] = "PartialContent";
    Status1[Status1["MultiStatus"] = 207] = "MultiStatus";
    Status1[Status1["AlreadyReported"] = 208] = "AlreadyReported";
    Status1[Status1["IMUsed"] = 226] = "IMUsed";
    Status1[Status1["MultipleChoices"] = 300] = "MultipleChoices";
    Status1[Status1["MovedPermanently"] = 301] = "MovedPermanently";
    Status1[Status1["Found"] = 302] = "Found";
    Status1[Status1["SeeOther"] = 303] = "SeeOther";
    Status1[Status1["NotModified"] = 304] = "NotModified";
    Status1[Status1["UseProxy"] = 305] = "UseProxy";
    Status1[Status1["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    Status1[Status1["PermanentRedirect"] = 308] = "PermanentRedirect";
    Status1[Status1["BadRequest"] = 400] = "BadRequest";
    Status1[Status1["Unauthorized"] = 401] = "Unauthorized";
    Status1[Status1["PaymentRequired"] = 402] = "PaymentRequired";
    Status1[Status1["Forbidden"] = 403] = "Forbidden";
    Status1[Status1["NotFound"] = 404] = "NotFound";
    Status1[Status1["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    Status1[Status1["NotAcceptable"] = 406] = "NotAcceptable";
    Status1[Status1["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
    Status1[Status1["RequestTimeout"] = 408] = "RequestTimeout";
    Status1[Status1["Conflict"] = 409] = "Conflict";
    Status1[Status1["Gone"] = 410] = "Gone";
    Status1[Status1["LengthRequired"] = 411] = "LengthRequired";
    Status1[Status1["PreconditionFailed"] = 412] = "PreconditionFailed";
    Status1[Status1["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    Status1[Status1["RequestURITooLong"] = 414] = "RequestURITooLong";
    Status1[Status1["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    Status1[Status1["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
    Status1[Status1["ExpectationFailed"] = 417] = "ExpectationFailed";
    Status1[Status1["Teapot"] = 418] = "Teapot";
    Status1[Status1["MisdirectedRequest"] = 421] = "MisdirectedRequest";
    Status1[Status1["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    Status1[Status1["Locked"] = 423] = "Locked";
    Status1[Status1["FailedDependency"] = 424] = "FailedDependency";
    Status1[Status1["TooEarly"] = 425] = "TooEarly";
    Status1[Status1["UpgradeRequired"] = 426] = "UpgradeRequired";
    Status1[Status1["PreconditionRequired"] = 428] = "PreconditionRequired";
    Status1[Status1["TooManyRequests"] = 429] = "TooManyRequests";
    Status1[Status1["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    Status1[Status1["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    Status1[Status1["InternalServerError"] = 500] = "InternalServerError";
    Status1[Status1["NotImplemented"] = 501] = "NotImplemented";
    Status1[Status1["BadGateway"] = 502] = "BadGateway";
    Status1[Status1["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    Status1[Status1["GatewayTimeout"] = 504] = "GatewayTimeout";
    Status1[Status1["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    Status1[Status1["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    Status1[Status1["InsufficientStorage"] = 507] = "InsufficientStorage";
    Status1[Status1["LoopDetected"] = 508] = "LoopDetected";
    Status1[Status1["NotExtended"] = 510] = "NotExtended";
    Status1[Status1["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(Status || (Status = {
}));
const STATUS_TEXT = new Map([
    [
        Status.Continue,
        "Continue"
    ],
    [
        Status.SwitchingProtocols,
        "Switching Protocols"
    ],
    [
        Status.Processing,
        "Processing"
    ],
    [
        Status.EarlyHints,
        "Early Hints"
    ],
    [
        Status.OK,
        "OK"
    ],
    [
        Status.Created,
        "Created"
    ],
    [
        Status.Accepted,
        "Accepted"
    ],
    [
        Status.NonAuthoritativeInfo,
        "Non-Authoritative Information"
    ],
    [
        Status.NoContent,
        "No Content"
    ],
    [
        Status.ResetContent,
        "Reset Content"
    ],
    [
        Status.PartialContent,
        "Partial Content"
    ],
    [
        Status.MultiStatus,
        "Multi-Status"
    ],
    [
        Status.AlreadyReported,
        "Already Reported"
    ],
    [
        Status.IMUsed,
        "IM Used"
    ],
    [
        Status.MultipleChoices,
        "Multiple Choices"
    ],
    [
        Status.MovedPermanently,
        "Moved Permanently"
    ],
    [
        Status.Found,
        "Found"
    ],
    [
        Status.SeeOther,
        "See Other"
    ],
    [
        Status.NotModified,
        "Not Modified"
    ],
    [
        Status.UseProxy,
        "Use Proxy"
    ],
    [
        Status.TemporaryRedirect,
        "Temporary Redirect"
    ],
    [
        Status.PermanentRedirect,
        "Permanent Redirect"
    ],
    [
        Status.BadRequest,
        "Bad Request"
    ],
    [
        Status.Unauthorized,
        "Unauthorized"
    ],
    [
        Status.PaymentRequired,
        "Payment Required"
    ],
    [
        Status.Forbidden,
        "Forbidden"
    ],
    [
        Status.NotFound,
        "Not Found"
    ],
    [
        Status.MethodNotAllowed,
        "Method Not Allowed"
    ],
    [
        Status.NotAcceptable,
        "Not Acceptable"
    ],
    [
        Status.ProxyAuthRequired,
        "Proxy Authentication Required"
    ],
    [
        Status.RequestTimeout,
        "Request Timeout"
    ],
    [
        Status.Conflict,
        "Conflict"
    ],
    [
        Status.Gone,
        "Gone"
    ],
    [
        Status.LengthRequired,
        "Length Required"
    ],
    [
        Status.PreconditionFailed,
        "Precondition Failed"
    ],
    [
        Status.RequestEntityTooLarge,
        "Request Entity Too Large"
    ],
    [
        Status.RequestURITooLong,
        "Request URI Too Long"
    ],
    [
        Status.UnsupportedMediaType,
        "Unsupported Media Type"
    ],
    [
        Status.RequestedRangeNotSatisfiable,
        "Requested Range Not Satisfiable"
    ],
    [
        Status.ExpectationFailed,
        "Expectation Failed"
    ],
    [
        Status.Teapot,
        "I'm a teapot"
    ],
    [
        Status.MisdirectedRequest,
        "Misdirected Request"
    ],
    [
        Status.UnprocessableEntity,
        "Unprocessable Entity"
    ],
    [
        Status.Locked,
        "Locked"
    ],
    [
        Status.FailedDependency,
        "Failed Dependency"
    ],
    [
        Status.TooEarly,
        "Too Early"
    ],
    [
        Status.UpgradeRequired,
        "Upgrade Required"
    ],
    [
        Status.PreconditionRequired,
        "Precondition Required"
    ],
    [
        Status.TooManyRequests,
        "Too Many Requests"
    ],
    [
        Status.RequestHeaderFieldsTooLarge,
        "Request Header Fields Too Large"
    ],
    [
        Status.UnavailableForLegalReasons,
        "Unavailable For Legal Reasons"
    ],
    [
        Status.InternalServerError,
        "Internal Server Error"
    ],
    [
        Status.NotImplemented,
        "Not Implemented"
    ],
    [
        Status.BadGateway,
        "Bad Gateway"
    ],
    [
        Status.ServiceUnavailable,
        "Service Unavailable"
    ],
    [
        Status.GatewayTimeout,
        "Gateway Timeout"
    ],
    [
        Status.HTTPVersionNotSupported,
        "HTTP Version Not Supported"
    ],
    [
        Status.VariantAlsoNegotiates,
        "Variant Also Negotiates"
    ],
    [
        Status.InsufficientStorage,
        "Insufficient Storage"
    ],
    [
        Status.LoopDetected,
        "Loop Detected"
    ],
    [
        Status.NotExtended,
        "Not Extended"
    ],
    [
        Status.NetworkAuthenticationRequired,
        "Network Authentication Required"
    ], 
]);
const CHAR_UPPERCASE_A = 65;
const CHAR_LOWERCASE_A = 97;
const CHAR_UPPERCASE_Z = 90;
const CHAR_LOWERCASE_Z = 122;
const CHAR_DOT = 46;
const CHAR_FORWARD_SLASH = 47;
const CHAR_BACKWARD_SLASH = 92;
const CHAR_COLON = 58;
const CHAR_QUESTION_MARK = 63;
let NATIVE_OS = "linux";
const navigator = globalThis.navigator;
if (globalThis.Deno != null) {
    NATIVE_OS = Deno.build.os;
} else if (navigator?.appVersion?.includes?.("Win") ?? false) {
    NATIVE_OS = "windows";
}
const isWindows = NATIVE_OS == "windows";
const _posix = function() {
    const sep = "/";
    const delimiter = ":";
    function resolve(...pathSegments) {
        let resolvedPath = "";
        let resolvedAbsolute = false;
        for(let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--){
            let path;
            if (i >= 0) path = pathSegments[i];
            else {
                if (globalThis.Deno == null) {
                    throw new TypeError("Resolved a relative path without a CWD.");
                }
                path = Deno.cwd();
            }
            assertPath(path);
            if (path.length === 0) {
                continue;
            }
            resolvedPath = `${path}/${resolvedPath}`;
            resolvedAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        }
        resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute, "/", isPosixPathSeparator);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0) return `/${resolvedPath}`;
            else return "/";
        } else if (resolvedPath.length > 0) return resolvedPath;
        else return ".";
    }
    function normalize(path) {
        assertPath(path);
        if (path.length === 0) return ".";
        const isAbsolute = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        const trailingSeparator = path.charCodeAt(path.length - 1) === CHAR_FORWARD_SLASH;
        path = normalizeString(path, !isAbsolute, "/", isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute) path = ".";
        if (path.length > 0 && trailingSeparator) path += "/";
        if (isAbsolute) return `/${path}`;
        return path;
    }
    function isAbsolute(path) {
        assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === CHAR_FORWARD_SLASH;
    }
    function join(...paths) {
        if (paths.length === 0) return ".";
        let joined;
        for(let i = 0, len = paths.length; i < len; ++i){
            const path = paths[i];
            assertPath(path);
            if (path.length > 0) {
                if (!joined) joined = path;
                else joined += `/${path}`;
            }
        }
        if (!joined) return ".";
        return normalize(joined);
    }
    function relative(from, to) {
        assertPath(from);
        assertPath(to);
        if (from === to) return "";
        from = resolve(from);
        to = resolve(to);
        if (from === to) return "";
        let fromStart = 1;
        const fromEnd = from.length;
        for(; fromStart < fromEnd; ++fromStart){
            if (from.charCodeAt(fromStart) !== CHAR_FORWARD_SLASH) break;
        }
        const fromLen = fromEnd - fromStart;
        let toStart = 1;
        const toEnd = to.length;
        for(; toStart < toEnd; ++toStart){
            if (to.charCodeAt(toStart) !== CHAR_FORWARD_SLASH) break;
        }
        const toLen = toEnd - toStart;
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for(; i <= length; ++i){
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === CHAR_FORWARD_SLASH) {
                        return to.slice(toStart + i + 1);
                    } else if (i === 0) {
                        return to.slice(toStart + i);
                    }
                } else if (fromLen > length) {
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode) break;
            else if (fromCode === CHAR_FORWARD_SLASH) lastCommonSep = i;
        }
        let out = "";
        for(i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i){
        }
        if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === CHAR_FORWARD_SLASH) ++toStart;
            return to.slice(toStart);
        }
    }
    function toNamespacedPath(path) {
        return path;
    }
    function dirname(path) {
        assertPath(path);
        if (path.length === 0) return ".";
        const hasRoot = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        let end = -1;
        let matchedSlash = true;
        for(let i = path.length - 1; i >= 1; --i){
            if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    break;
                }
            } else {
                matchedSlash = false;
            }
        }
        if (end === -1) return hasRoot ? "/" : ".";
        if (hasRoot && end === 1) return "//";
        return path.slice(0, end);
    }
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string") {
            throw new TypeError('"ext" argument must be a string');
        }
        assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path) return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for(i = path.length - 1; i >= 0; --i){
                const code = path.charCodeAt(i);
                if (code === CHAR_FORWARD_SLASH) {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                } else {
                    if (firstNonSlashEnd === -1) {
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        if (code === ext.charCodeAt(extIdx)) {
                        } else {
                            extIdx = -1;
                        }
                    }
                }
            }
            if (start === end) end = firstNonSlashEnd;
            else if (end === -1) end = path.length;
            return path.slice(start, end);
        } else {
            for(i = path.length - 1; i >= 0; --i){
                if (path.charCodeAt(i) === CHAR_FORWARD_SLASH) {
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                } else if (end === -1) {
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1) return "";
            return path.slice(start, end);
        }
    }
    function extname(path) {
        assertPath(path);
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let preDotState = 0;
        for(let i = path.length - 1; i >= 0; --i){
            const code = path.charCodeAt(i);
            if (code === CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            return "";
        }
        return path.slice(startDot, end);
    }
    function format(pathObject) {
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return _format1("/", pathObject);
    }
    function parse(path) {
        assertPath(path);
        const ret = {
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: ""
        };
        if (path.length === 0) return ret;
        const isAbsolute1 = path.charCodeAt(0) === CHAR_FORWARD_SLASH;
        let start;
        if (isAbsolute1) {
            ret.root = "/";
        } else {
        }
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        let preDotState = 0;
        for(; i >= start; --i){
            const code = path.charCodeAt(i);
            if (code === CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                matchedSlash = false;
                end = i + 1;
            }
        }
        if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute1) {
                    ret.base = ret.name = path.slice(1, end);
                } else {
                    ret.base = ret.name = path.slice(startPart, end);
                }
            }
        } else {
            if (startPart === 0 && isAbsolute1) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            } else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute1) ret.dir = "/";
        return ret;
    }
    function fromFileUrl(url) {
        url = url instanceof URL ? url : new URL(url);
        if (url.protocol != "file:") {
            throw new TypeError("Must be a file URL.");
        }
        return decodeURIComponent(url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25"));
    }
    return {
        sep,
        delimiter,
        resolve,
        normalize,
        isAbsolute,
        join,
        relative,
        toNamespacedPath,
        dirname,
        basename,
        extname,
        format,
        parse,
        fromFileUrl
    };
}();
const path1 = isWindows ? _win32 : _posix;
const { basename , delimiter , dirname , extname: extname1 , format , fromFileUrl , isAbsolute , join , normalize , parse , relative , resolve , sep , toNamespacedPath ,  } = path1;
const matchCache = {
};
const FIELD_CONTENT_REGEXP = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const KEY_REGEXP = /(?:^|;) *([^=]*)=[^;]*/g;
const SAME_SITE_REGEXP = /^(?:lax|none|strict)$/i;
function getPattern(name) {
    if (name in matchCache) {
        return matchCache[name];
    }
    return matchCache[name] = new RegExp(`(?:^|;) *${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`);
}
function pushCookie(headers, cookie) {
    if (cookie.overwrite) {
        for(let i = headers.length - 1; i >= 0; i--){
            if (headers[i].indexOf(`${cookie.name}=`) === 0) {
                headers.splice(i, 1);
            }
        }
    }
    headers.push(cookie.toHeader());
}
function validateCookieProperty(key, value) {
    if (value && !FIELD_CONTENT_REGEXP.test(value)) {
        throw new TypeError(`The ${key} of the cookie (${value}) is invalid.`);
    }
}
class Cookie {
    httpOnly = true;
    overwrite = false;
    path = "/";
    sameSite = false;
    secure = false;
    constructor(name1, value1, attributes){
        validateCookieProperty("name", name1);
        validateCookieProperty("value", value1);
        this.name = name1;
        this.value = value1 ?? "";
        Object.assign(this, attributes);
        if (!this.value) {
            this.expires = new Date(0);
            this.maxAge = undefined;
        }
        validateCookieProperty("path", this.path);
        validateCookieProperty("domain", this.domain);
        if (this.sameSite && typeof this.sameSite === "string" && !SAME_SITE_REGEXP.test(this.sameSite)) {
            throw new TypeError(`The sameSite of the cookie ("${this.sameSite}") is invalid.`);
        }
    }
    toHeader() {
        let header = this.toString();
        if (this.maxAge) {
            this.expires = new Date(Date.now() + this.maxAge * 1000);
        }
        if (this.path) {
            header += `; path=${this.path}`;
        }
        if (this.expires) {
            header += `; expires=${this.expires.toUTCString()}`;
        }
        if (this.domain) {
            header += `; domain=${this.domain}`;
        }
        if (this.sameSite) {
            header += `; samesite=${this.sameSite === true ? "strict" : this.sameSite.toLowerCase()}`;
        }
        if (this.secure) {
            header += "; secure";
        }
        if (this.httpOnly) {
            header += "; httponly";
        }
        return header;
    }
    toString() {
        return `${this.name}=${this.value}`;
    }
}
class Cookies {
    #cookieKeys;
    #keys;
    #request;
    #response;
    #secure;
    #requestKeys=()=>{
        if (this.#cookieKeys) {
            return this.#cookieKeys;
        }
        const result = this.#cookieKeys = [];
        const header = this.#request.headers.get("cookie");
        if (!header) {
            return result;
        }
        let matches;
        while(matches = KEY_REGEXP.exec(header)){
            const [, key] = matches;
            result.push(key);
        }
        return result;
    };
    constructor(request, response, options1 = {
    }){
        const { keys: keys2 , secure  } = options1;
        this.#keys = keys2;
        this.#request = request;
        this.#response = response;
        this.#secure = secure;
    }
    delete(name, options = {
    }) {
        this.set(name, null, options);
        return true;
    }
    *entries() {
    }
    forEach(callback, thisArg = null) {
        const keys1 = this.#requestKeys();
        for (const key of keys1){
            const value1 = this.get(key);
            if (value1) {
                callback.call(thisArg, key, value1, this);
            }
        }
    }
    get(name, options = {
    }) {
        const signed = options.signed ?? !!this.#keys;
        const nameSig = `${name}.sig`;
        const header = this.#request.headers.get("cookie");
        if (!header) {
            return;
        }
        const match = header.match(getPattern(name));
        if (!match) {
            return;
        }
        const [, value1] = match;
        if (!signed) {
            return value1;
        }
        const digest = this.get(nameSig, {
            signed: false
        });
        if (!digest) {
            return;
        }
        const data = `${name}=${value1}`;
        if (!this.#keys) {
            throw new TypeError("keys required for signed cookies");
        }
        const index = this.#keys.indexOf(data, digest);
        if (index < 0) {
            this.delete(nameSig, {
                path: "/",
                signed: false
            });
        } else {
            if (index) {
                this.set(nameSig, this.#keys.sign(data), {
                    signed: false
                });
            }
            return value1;
        }
    }
    *keys() {
    }
    set(name, value, options = {
    }) {
        const request1 = this.#request;
        const response1 = this.#response;
        let headers = response1.headers.get("Set-Cookie") ?? [];
        if (typeof headers === "string") {
            headers = [
                headers
            ];
        }
        const secure1 = this.#secure !== undefined ? this.#secure : request1.secure;
        const signed = options.signed ?? !!this.#keys;
        if (!secure1 && options.secure) {
            throw new TypeError("Cannot send secure cookie over unencrypted connection.");
        }
        const cookie = new Cookie(name, value, options);
        cookie.secure = options.secure ?? secure1;
        pushCookie(headers, cookie);
        if (signed) {
            if (!this.#keys) {
                throw new TypeError(".keys required for signed cookies.");
            }
            cookie.value = this.#keys.sign(cookie.toString());
            cookie.name += ".sig";
            pushCookie(headers, cookie);
        }
        for (const header of headers){
            response1.headers.append("Set-Cookie", header);
        }
        return this;
    }
    *values() {
    }
    *[Symbol.iterator]() {
    }
}
const HEX_CHARS = "0123456789abcdef".split("");
const EXTRA = [
    -2147483648,
    8388608,
    32768,
    128
];
const SHIFT = [
    24,
    16,
    8,
    0
];
const K = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298, 
];
const blocks = [];
class Sha256 {
    #block;
    #blocks;
    #bytes;
    #finalized;
    #first;
    #h0;
    #h1;
    #h2;
    #h3;
    #h4;
    #h5;
    #h6;
    #h7;
    #hashed;
    #hBytes;
    #is224;
    #lastByteIndex=0;
    #start;
    constructor(is2241 = false, sharedMemory1 = false){
        this.init(is2241, sharedMemory1);
    }
    init(is224, sharedMemory) {
        if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.#blocks = blocks;
        } else {
            this.#blocks = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        if (is224) {
            this.#h0 = 3238371032;
            this.#h1 = 914150663;
            this.#h2 = 812702999;
            this.#h3 = 4144912697;
            this.#h4 = 4290775857;
            this.#h5 = 1750603025;
            this.#h6 = 1694076839;
            this.#h7 = 3204075428;
        } else {
            this.#h0 = 1779033703;
            this.#h1 = 3144134277;
            this.#h2 = 1013904242;
            this.#h3 = 2773480762;
            this.#h4 = 1359893119;
            this.#h5 = 2600822924;
            this.#h6 = 528734635;
            this.#h7 = 1541459225;
        }
        this.#block = this.#start = this.#bytes = this.#hBytes = 0;
        this.#finalized = this.#hashed = false;
        this.#first = true;
        this.#is224 = is224;
    }
    update(message) {
        if (this.#finalized) {
            return this;
        }
        let msg;
        if (message instanceof ArrayBuffer) {
            msg = new Uint8Array(message);
        } else {
            msg = message;
        }
        let index = 0;
        const length = msg.length;
        const blocks1 = this.#blocks;
        while(index < length){
            let i;
            if (this.#hashed) {
                this.#hashed = false;
                blocks1[0] = this.#block;
                blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] = blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] = blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] = blocks1[15] = 0;
            }
            if (typeof msg !== "string") {
                for(i = this.#start; index < length && i < 64; ++index){
                    blocks1[i >> 2] |= msg[index] << SHIFT[(i++) & 3];
                }
            } else {
                for(i = this.#start; index < length && i < 64; ++index){
                    let code = msg.charCodeAt(index);
                    if (code < 128) {
                        blocks1[i >> 2] |= code << SHIFT[(i++) & 3];
                    } else if (code < 2048) {
                        blocks1[i >> 2] |= (192 | code >> 6) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
                    } else if (code < 55296 || code >= 57344) {
                        blocks1[i >> 2] |= (224 | code >> 12) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
                    } else {
                        code = 65536 + ((code & 1023) << 10 | msg.charCodeAt(++index) & 1023);
                        blocks1[i >> 2] |= (240 | code >> 18) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[(i++) & 3];
                        blocks1[i >> 2] |= (128 | code & 63) << SHIFT[(i++) & 3];
                    }
                }
            }
            this.#lastByteIndex = i;
            this.#bytes += i - this.#start;
            if (i >= 64) {
                this.#block = blocks1[16];
                this.#start = i - 64;
                this.hash();
                this.#hashed = true;
            } else {
                this.#start = i;
            }
        }
        if (this.#bytes > 4294967295) {
            this.#hBytes += this.#bytes / 4294967296 << 0;
            this.#bytes = this.#bytes % 4294967296;
        }
        return this;
    }
    finalize() {
        if (this.#finalized) {
            return;
        }
        this.#finalized = true;
        const blocks1 = this.#blocks;
        const i = this.#lastByteIndex;
        blocks1[16] = this.#block;
        blocks1[i >> 2] |= EXTRA[i & 3];
        this.#block = blocks1[16];
        if (i >= 56) {
            if (!this.#hashed) {
                this.hash();
            }
            blocks1[0] = this.#block;
            blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] = blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] = blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] = blocks1[15] = 0;
        }
        blocks1[14] = this.#hBytes << 3 | this.#bytes >>> 29;
        blocks1[15] = this.#bytes << 3;
        this.hash();
    }
    hash() {
        let a = this.#h0;
        let b = this.#h1;
        let c = this.#h2;
        let d = this.#h3;
        let e = this.#h4;
        let f = this.#h5;
        let g = this.#h6;
        let h = this.#h7;
        const blocks1 = this.#blocks;
        let s0;
        let s1;
        let maj;
        let t1;
        let t2;
        let ch;
        let ab;
        let da;
        let cd;
        let bc;
        for(let j = 16; j < 64; ++j){
            t1 = blocks1[j - 15];
            s0 = (t1 >>> 7 | t1 << 25) ^ (t1 >>> 18 | t1 << 14) ^ t1 >>> 3;
            t1 = blocks1[j - 2];
            s1 = (t1 >>> 17 | t1 << 15) ^ (t1 >>> 19 | t1 << 13) ^ t1 >>> 10;
            blocks1[j] = blocks1[j - 16] + s0 + blocks1[j - 7] + s1 << 0;
        }
        bc = b & c;
        for(let j1 = 0; j1 < 64; j1 += 4){
            if (this.#first) {
                if (this.#is224) {
                    t1 = blocks1[0] - 1413257819;
                    h = t1 - 150054599 << 0;
                    d = t1 + 24177077 << 0;
                } else {
                    t1 = blocks1[0] - 210244248;
                    h = t1 - 1521486534 << 0;
                    d = t1 + 143694565 << 0;
                }
                this.#first = false;
            } else {
                s0 = (a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10);
                s1 = (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
                ab = a & b;
                maj = ab ^ a & c ^ bc;
                ch = e & f ^ ~e & g;
                t1 = h + s1 + ch + K[j1] + blocks1[j1];
                t2 = s0 + maj;
                h = d + t1 << 0;
                d = t1 + t2 << 0;
            }
            s0 = (d >>> 2 | d << 30) ^ (d >>> 13 | d << 19) ^ (d >>> 22 | d << 10);
            s1 = (h >>> 6 | h << 26) ^ (h >>> 11 | h << 21) ^ (h >>> 25 | h << 7);
            da = d & a;
            maj = da ^ d & b ^ ab;
            ch = h & e ^ ~h & f;
            t1 = g + s1 + ch + K[j1 + 1] + blocks1[j1 + 1];
            t2 = s0 + maj;
            g = c + t1 << 0;
            c = t1 + t2 << 0;
            s0 = (c >>> 2 | c << 30) ^ (c >>> 13 | c << 19) ^ (c >>> 22 | c << 10);
            s1 = (g >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7);
            cd = c & d;
            maj = cd ^ c & a ^ da;
            ch = g & h ^ ~g & e;
            t1 = f + s1 + ch + K[j1 + 2] + blocks1[j1 + 2];
            t2 = s0 + maj;
            f = b + t1 << 0;
            b = t1 + t2 << 0;
            s0 = (b >>> 2 | b << 30) ^ (b >>> 13 | b << 19) ^ (b >>> 22 | b << 10);
            s1 = (f >>> 6 | f << 26) ^ (f >>> 11 | f << 21) ^ (f >>> 25 | f << 7);
            bc = b & c;
            maj = bc ^ b & d ^ cd;
            ch = f & g ^ ~f & h;
            t1 = e + s1 + ch + K[j1 + 3] + blocks1[j1 + 3];
            t2 = s0 + maj;
            e = a + t1 << 0;
            a = t1 + t2 << 0;
        }
        this.#h0 = this.#h0 + a << 0;
        this.#h1 = this.#h1 + b << 0;
        this.#h2 = this.#h2 + c << 0;
        this.#h3 = this.#h3 + d << 0;
        this.#h4 = this.#h4 + e << 0;
        this.#h5 = this.#h5 + f << 0;
        this.#h6 = this.#h6 + g << 0;
        this.#h7 = this.#h7 + h << 0;
    }
    hex() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        const h5 = this.#h5;
        const h6 = this.#h6;
        const h7 = this.#h7;
        let hex = HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[h0 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[h1 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[h2 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[h3 & 15] + HEX_CHARS[h4 >> 28 & 15] + HEX_CHARS[h4 >> 24 & 15] + HEX_CHARS[h4 >> 20 & 15] + HEX_CHARS[h4 >> 16 & 15] + HEX_CHARS[h4 >> 12 & 15] + HEX_CHARS[h4 >> 8 & 15] + HEX_CHARS[h4 >> 4 & 15] + HEX_CHARS[h4 & 15] + HEX_CHARS[h5 >> 28 & 15] + HEX_CHARS[h5 >> 24 & 15] + HEX_CHARS[h5 >> 20 & 15] + HEX_CHARS[h5 >> 16 & 15] + HEX_CHARS[h5 >> 12 & 15] + HEX_CHARS[h5 >> 8 & 15] + HEX_CHARS[h5 >> 4 & 15] + HEX_CHARS[h5 & 15] + HEX_CHARS[h6 >> 28 & 15] + HEX_CHARS[h6 >> 24 & 15] + HEX_CHARS[h6 >> 20 & 15] + HEX_CHARS[h6 >> 16 & 15] + HEX_CHARS[h6 >> 12 & 15] + HEX_CHARS[h6 >> 8 & 15] + HEX_CHARS[h6 >> 4 & 15] + HEX_CHARS[h6 & 15];
        if (!this.#is224) {
            hex += HEX_CHARS[h7 >> 28 & 15] + HEX_CHARS[h7 >> 24 & 15] + HEX_CHARS[h7 >> 20 & 15] + HEX_CHARS[h7 >> 16 & 15] + HEX_CHARS[h7 >> 12 & 15] + HEX_CHARS[h7 >> 8 & 15] + HEX_CHARS[h7 >> 4 & 15] + HEX_CHARS[h7 & 15];
        }
        return hex;
    }
    toString() {
        return this.hex();
    }
    digest() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        const h5 = this.#h5;
        const h6 = this.#h6;
        const h7 = this.#h7;
        const arr = [
            h0 >> 24 & 255,
            h0 >> 16 & 255,
            h0 >> 8 & 255,
            h0 & 255,
            h1 >> 24 & 255,
            h1 >> 16 & 255,
            h1 >> 8 & 255,
            h1 & 255,
            h2 >> 24 & 255,
            h2 >> 16 & 255,
            h2 >> 8 & 255,
            h2 & 255,
            h3 >> 24 & 255,
            h3 >> 16 & 255,
            h3 >> 8 & 255,
            h3 & 255,
            h4 >> 24 & 255,
            h4 >> 16 & 255,
            h4 >> 8 & 255,
            h4 & 255,
            h5 >> 24 & 255,
            h5 >> 16 & 255,
            h5 >> 8 & 255,
            h5 & 255,
            h6 >> 24 & 255,
            h6 >> 16 & 255,
            h6 >> 8 & 255,
            h6 & 255, 
        ];
        if (!this.#is224) {
            arr.push(h7 >> 24 & 255, h7 >> 16 & 255, h7 >> 8 & 255, h7 & 255);
        }
        return arr;
    }
    array() {
        return this.digest();
    }
    arrayBuffer() {
        this.finalize();
        const buffer = new ArrayBuffer(this.#is224 ? 28 : 32);
        const dataView = new DataView(buffer);
        dataView.setUint32(0, this.#h0);
        dataView.setUint32(4, this.#h1);
        dataView.setUint32(8, this.#h2);
        dataView.setUint32(12, this.#h3);
        dataView.setUint32(16, this.#h4);
        dataView.setUint32(20, this.#h5);
        dataView.setUint32(24, this.#h6);
        if (!this.#is224) {
            dataView.setUint32(28, this.#h7);
        }
        return buffer;
    }
}
class HmacSha256 extends Sha256 {
    #inner;
    #is224;
    #oKeyPad;
    #sharedMemory;
    constructor(secretKey, is2242 = false, sharedMemory2 = false){
        super(is2242, sharedMemory2);
        let key;
        if (typeof secretKey === "string") {
            const bytes = [];
            const length = secretKey.length;
            let index = 0;
            for(let i = 0; i < length; ++i){
                let code = secretKey.charCodeAt(i);
                if (code < 128) {
                    bytes[index++] = code;
                } else if (code < 2048) {
                    bytes[index++] = 192 | code >> 6;
                    bytes[index++] = 128 | code & 63;
                } else if (code < 55296 || code >= 57344) {
                    bytes[index++] = 224 | code >> 12;
                    bytes[index++] = 128 | code >> 6 & 63;
                    bytes[index++] = 128 | code & 63;
                } else {
                    code = 65536 + ((code & 1023) << 10 | secretKey.charCodeAt(++i) & 1023);
                    bytes[index++] = 240 | code >> 18;
                    bytes[index++] = 128 | code >> 12 & 63;
                    bytes[index++] = 128 | code >> 6 & 63;
                    bytes[index++] = 128 | code & 63;
                }
            }
        } else {
            if (secretKey instanceof ArrayBuffer) {
                key = new Uint8Array(secretKey);
            } else {
                key = secretKey;
            }
        }
        if (key.length > 64) {
            key = new Sha256(is2242, true).update(key).array();
        }
        const oKeyPad = [];
        const iKeyPad = [];
        for(let i = 0; i < 64; ++i){
            const b = key[i] || 0;
            oKeyPad[i] = 92 ^ b;
            iKeyPad[i] = 54 ^ b;
        }
        this.update(iKeyPad);
        this.#oKeyPad = oKeyPad;
        this.#inner = true;
        this.#is224 = is2242;
        this.#sharedMemory = sharedMemory2;
    }
    finalize() {
        super.finalize();
        if (this.#inner) {
            this.#inner = false;
            const innerHash = this.array();
            super.init(this.#is224, this.#sharedMemory);
            this.update(this.#oKeyPad);
            this.update(innerHash);
            super.finalize();
        }
    }
}
const HmacSha2561 = HmacSha256;
const noColor = globalThis.Deno?.noColor ?? true;
let enabled = !noColor;
function code1(open, close) {
    return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g")
    };
}
function run(str, code1) {
    return enabled ? `${code1.open}${str.replace(code1.regexp, code1.open)}${code1.close}` : str;
}
function bold(str) {
    return run(str, code1([
        1
    ], 22));
}
function red(str) {
    return run(str, code1([
        31
    ], 39));
}
function green(str) {
    return run(str, code1([
        32
    ], 39));
}
function white(str) {
    return run(str, code1([
        37
    ], 39));
}
function gray(str) {
    return brightBlack(str);
}
function brightBlack(str) {
    return run(str, code1([
        90
    ], 39));
}
function clampAndTruncate(n, max = 255, min = 0) {
    return Math.trunc(Math.max(Math.min(n, max), min));
}
const ANSI_PATTERN = new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
function stripColor(string) {
    return string.replace(ANSI_PATTERN, "");
}
var DiffType;
(function(DiffType1) {
    DiffType1["removed"] = "removed";
    DiffType1["common"] = "common";
    DiffType1["added"] = "added";
})(DiffType || (DiffType = {
}));
const REMOVED = 1;
const COMMON = 2;
const ADDED = 3;
function createCommon(A, B, reverse) {
    const common = [];
    if (A.length === 0 || B.length === 0) return [];
    for(let i1 = 0; i1 < Math.min(A.length, B.length); i1 += 1){
        if (A[reverse ? A.length - i1 - 1 : i1] === B[reverse ? B.length - i1 - 1 : i1]) {
            common.push(A[reverse ? A.length - i1 - 1 : i1]);
        } else {
            return common;
        }
    }
    return common;
}
function diff(A, B) {
    const prefixCommon = createCommon(A, B);
    const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
    A = suffixCommon.length ? A.slice(prefixCommon.length, -suffixCommon.length) : A.slice(prefixCommon.length);
    B = suffixCommon.length ? B.slice(prefixCommon.length, -suffixCommon.length) : B.slice(prefixCommon.length);
    const swapped = B.length > A.length;
    [A, B] = swapped ? [
        B,
        A
    ] : [
        A,
        B
    ];
    const M = A.length;
    const N = B.length;
    if (!M && !N && !suffixCommon.length && !prefixCommon.length) return [];
    if (!N) {
        return [
            ...prefixCommon.map((c)=>({
                    type: DiffType.common,
                    value: c
                })
            ),
            ...A.map((a)=>({
                    type: swapped ? DiffType.added : DiffType.removed,
                    value: a
                })
            ),
            ...suffixCommon.map((c)=>({
                    type: DiffType.common,
                    value: c
                })
            ), 
        ];
    }
    const offset = N;
    const delta = M - N;
    const size = M + N + 1;
    const fp = new Array(size).fill({
        y: -1
    });
    const routes = new Uint32Array((M * N + size + 1) * 2);
    const diffTypesPtrOffset = routes.length / 2;
    let ptr = 0;
    let p = -1;
    function backTrace(A1, B1, current, swapped1) {
        const M1 = A1.length;
        const N1 = B1.length;
        const result = [];
        let a = M1 - 1;
        let b = N1 - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while(true){
            if (!j && !type) break;
            const prev = j;
            if (type === REMOVED) {
                result.unshift({
                    type: swapped1 ? DiffType.removed : DiffType.added,
                    value: B1[b]
                });
                b -= 1;
            } else if (type === ADDED) {
                result.unshift({
                    type: swapped1 ? DiffType.added : DiffType.removed,
                    value: A1[a]
                });
                a -= 1;
            } else {
                result.unshift({
                    type: DiffType.common,
                    value: A1[a]
                });
                a -= 1;
                b -= 1;
            }
            j = routes[prev];
            type = routes[prev + diffTypesPtrOffset];
        }
        return result;
    }
    function createFP(slide, down, k, M1) {
        if (slide && slide.y === -1 && down && down.y === -1) {
            return {
                y: 0,
                id: 0
            };
        }
        if (down && down.y === -1 || k === M1 || (slide && slide.y) > (down && down.y) + 1) {
            const prev = slide.id;
            ptr++;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = ADDED;
            return {
                y: slide.y,
                id: ptr
            };
        } else {
            const prev = down.id;
            ptr++;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = REMOVED;
            return {
                y: down.y + 1,
                id: ptr
            };
        }
    }
    function snake(k, slide, down, _offset, A1, B1) {
        const M1 = A1.length;
        const N1 = B1.length;
        if (k < -N1 || M1 < k) return {
            y: -1,
            id: -1
        };
        const fp1 = createFP(slide, down, k, M1);
        while(fp1.y + k < M1 && fp1.y < N1 && A1[fp1.y + k] === B1[fp1.y]){
            const prev = fp1.id;
            ptr++;
            fp1.id = ptr;
            fp1.y += 1;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp1;
    }
    while(fp[delta + offset].y < N){
        p = p + 1;
        for(let k = -p; k < delta; ++k){
            fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
        }
        for(let k1 = delta + p; k1 > delta; --k1){
            fp[k1 + offset] = snake(k1, fp[k1 - 1 + offset], fp[k1 + 1 + offset], offset, A, B);
        }
        fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
    }
    return [
        ...prefixCommon.map((c)=>({
                type: DiffType.common,
                value: c
            })
        ),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c)=>({
                type: DiffType.common,
                value: c
            })
        ), 
    ];
}
const CAN_NOT_DISPLAY = "[Cannot display]";
function _format(v) {
    let string = globalThis.Deno ? Deno.inspect(v, {
        depth: Infinity,
        sorted: true,
        trailingComma: true,
        compact: false,
        iterableLimit: Infinity
    }) : String(v);
    if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
    }
    return string;
}
function createColor(diffType) {
    switch(diffType){
        case DiffType.added:
            return (s)=>green(bold(s))
            ;
        case DiffType.removed:
            return (s)=>red(bold(s))
            ;
        default:
            return white;
    }
}
function createSign(diffType) {
    switch(diffType){
        case DiffType.added:
            return "+   ";
        case DiffType.removed:
            return "-   ";
        default:
            return "    ";
    }
}
function buildMessage(diffResult) {
    const messages = [];
    messages.push("");
    messages.push("");
    messages.push(`    ${gray(bold("[Diff]"))} ${red(bold("Actual"))} / ${green(bold("Expected"))}`);
    messages.push("");
    messages.push("");
    diffResult.forEach((result)=>{
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
    });
    messages.push("");
    return messages;
}
function isKeyedCollection(x) {
    return [
        Symbol.iterator,
        "size"
    ].every((k)=>k in x
    );
}
function equal(c, d) {
    const seen = new Map();
    return (function compare(a, b) {
        if (a && b && (a instanceof RegExp && b instanceof RegExp || a instanceof URL && b instanceof URL)) {
            return String(a) === String(b);
        }
        if (a instanceof Date && b instanceof Date) {
            const aTime = a.getTime();
            const bTime = b.getTime();
            if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
                return true;
            }
            return a.getTime() === b.getTime();
        }
        if (Object.is(a, b)) {
            return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
            if (seen.get(a) === b) {
                return true;
            }
            if (Object.keys(a || {
            }).length !== Object.keys(b || {
            }).length) {
                return false;
            }
            if (isKeyedCollection(a) && isKeyedCollection(b)) {
                if (a.size !== b.size) {
                    return false;
                }
                let unmatchedEntries = a.size;
                for (const [aKey, aValue] of a.entries()){
                    for (const [bKey, bValue] of b.entries()){
                        if (aKey === aValue && bKey === bValue && compare(aKey, bKey) || compare(aKey, bKey) && compare(aValue, bValue)) {
                            unmatchedEntries--;
                        }
                    }
                }
                return unmatchedEntries === 0;
            }
            const merged = {
                ...a,
                ...b
            };
            for(const key1 in merged){
                if (!compare(a && a[key1], b && b[key1])) {
                    return false;
                }
            }
            seen.set(a, b);
            return true;
        }
        return false;
    })(c, d);
}
function assert1(expr, msg = "") {
    if (!expr) {
        throw new AssertionError(msg);
    }
}
const assert2 = assert1;
function hasOwnProperty(obj, v) {
    if (obj == null) {
        return false;
    }
    return Object.prototype.hasOwnProperty.call(obj, v);
}
const DEFAULT_BUF_SIZE1 = 4096;
const MIN_BUF_SIZE = 16;
const MAX_CONSECUTIVE_EMPTY_READS = 100;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
class BufferFullError extends Error {
    name = "BufferFullError";
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
    }
}
class BufReader {
    r = 0;
    w = 0;
    eof = false;
    static create(r, size = DEFAULT_BUF_SIZE1) {
        return r instanceof BufReader ? r : new BufReader(r, size);
    }
    constructor(rd1, size1 = DEFAULT_BUF_SIZE1){
        if (size1 < MIN_BUF_SIZE) {
            size1 = MIN_BUF_SIZE;
        }
        this._reset(new Uint8Array(size1), rd1);
    }
    size() {
        return this.buf.byteLength;
    }
    buffered() {
        return this.w - this.r;
    }
    async _fill() {
        if (this.r > 0) {
            this.buf.copyWithin(0, this.r, this.w);
            this.w -= this.r;
            this.r = 0;
        }
        if (this.w >= this.buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i1 = MAX_CONSECUTIVE_EMPTY_READS; i1 > 0; i1--){
            const rr = await this.rd.read(this.buf.subarray(this.w));
            if (rr === null) {
                this.eof = true;
                return;
            }
            assert(rr >= 0, "negative read");
            this.w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
    }
    reset(r) {
        this._reset(this.buf, r);
    }
    _reset(buf, rd) {
        this.buf = buf;
        this.rd = rd;
        this.eof = false;
    }
    async read(p) {
        let rr = p.byteLength;
        if (p.byteLength === 0) return rr;
        if (this.r === this.w) {
            if (p.byteLength >= this.buf.byteLength) {
                const rr1 = await this.rd.read(p);
                const nread = rr1 ?? 0;
                assert(nread >= 0, "negative read");
                return rr1;
            }
            this.r = 0;
            this.w = 0;
            rr = await this.rd.read(this.buf);
            if (rr === 0 || rr === null) return rr;
            assert(rr >= 0, "negative read");
            this.w += rr;
        }
        const copied = copyBytes(this.buf.subarray(this.r, this.w), p, 0);
        this.r += copied;
        return copied;
    }
    async readFull(p) {
        let bytesRead = 0;
        while(bytesRead < p.length){
            try {
                const rr = await this.read(p.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                err.partial = p.subarray(0, bytesRead);
                throw err;
            }
        }
        return p;
    }
    async readByte() {
        while(this.r === this.w){
            if (this.eof) return null;
            await this._fill();
        }
        const c = this.buf[this.r];
        this.r++;
        return c;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null) return null;
        return new TextDecoder().decode(buffer);
    }
    async readLine() {
        let line;
        try {
            line = await this.readSlice(LF);
        } catch (err) {
            let { partial: partial1  } = err;
            assert(partial1 instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            if (!(err instanceof BufferFullError)) {
                throw err;
            }
            if (!this.eof && partial1.byteLength > 0 && partial1[partial1.byteLength - 1] === CR) {
                assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                this.r--;
                partial1 = partial1.subarray(0, partial1.byteLength - 1);
            }
            return {
                line: partial1,
                more: !this.eof
            };
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF) {
            let drop = 1;
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s = 0;
        let slice;
        while(true){
            let i1 = this.buf.subarray(this.r + s, this.w).indexOf(delim);
            if (i1 >= 0) {
                i1 += s;
                slice = this.buf.subarray(this.r, this.r + i1 + 1);
                this.r += i1 + 1;
                break;
            }
            if (this.eof) {
                if (this.r === this.w) {
                    return null;
                }
                slice = this.buf.subarray(this.r, this.w);
                this.r = this.w;
                break;
            }
            if (this.buffered() >= this.buf.byteLength) {
                this.r = this.w;
                const newbuf = this.buf.slice(0);
                this.buf = newbuf;
                throw new BufferFullError(oldbuf);
            }
            s = this.w - this.r;
            try {
                await this._fill();
            } catch (err) {
                err.partial = slice;
                throw err;
            }
        }
        return slice;
    }
    async peek(n) {
        if (n < 0) {
            throw Error("negative count");
        }
        let avail = this.w - this.r;
        while(avail < n && avail < this.buf.byteLength && !this.eof){
            try {
                await this._fill();
            } catch (err) {
                err.partial = this.buf.subarray(this.r, this.w);
                throw err;
            }
            avail = this.w - this.r;
        }
        if (avail === 0 && this.eof) {
            return null;
        } else if (avail < n && this.eof) {
            return this.buf.subarray(this.r, this.r + avail);
        } else if (avail < n) {
            throw new BufferFullError(this.buf.subarray(this.r, this.w));
        }
        return this.buf.subarray(this.r, this.r + n);
    }
}
class AbstractBufBase {
    usedBufferBytes = 0;
    err = null;
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter extends AbstractBufBase {
    static create(writer, size = DEFAULT_BUF_SIZE1) {
        return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    constructor(writer1, size2 = DEFAULT_BUF_SIZE1){
        super();
        this.writer = writer1;
        if (size2 <= 0) {
            size2 = DEFAULT_BUF_SIZE1;
        }
        this.buf = new Uint8Array(size2);
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.writer = w;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            await Deno.writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
        } catch (e) {
            this.err = e;
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.writer.write(data);
                } catch (e) {
                    this.err = e;
                    throw e;
                }
            } else {
                numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class BufWriterSync extends AbstractBufBase {
    static create(writer, size = DEFAULT_BUF_SIZE1) {
        return writer instanceof BufWriterSync ? writer : new BufWriterSync(writer, size);
    }
    constructor(writer2, size3 = DEFAULT_BUF_SIZE1){
        super();
        this.writer = writer2;
        if (size3 <= 0) {
            size3 = DEFAULT_BUF_SIZE1;
        }
        this.buf = new Uint8Array(size3);
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.writer = w;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            Deno.writeAllSync(this.writer, this.buf.subarray(0, this.usedBufferBytes));
        } catch (e) {
            this.err = e;
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.writer.writeSync(data);
                } catch (e) {
                    this.err = e;
                    throw e;
                }
            } else {
                numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copyBytes(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
function createLPS(pat) {
    const lps = new Uint8Array(pat.length);
    lps[0] = 0;
    let prefixEnd = 0;
    let i1 = 1;
    while(i1 < lps.length){
        if (pat[i1] == pat[prefixEnd]) {
            prefixEnd++;
            lps[i1] = prefixEnd;
            i1++;
        } else if (prefixEnd === 0) {
            lps[i1] = 0;
            i1++;
        } else {
            prefixEnd = pat[prefixEnd - 1];
        }
    }
    return lps;
}
async function* readDelim(reader, delim) {
    const delimLen = delim.length;
    const delimLPS = createLPS(delim);
    let inputBuffer = new Deno.Buffer();
    const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
    let inspectIndex = 0;
    let matchIndex = 0;
    while(true){
        const result = await reader.read(inspectArr);
        if (result === null) {
            yield inputBuffer.bytes();
            return;
        }
        if (result < 0) {
            return;
        }
        const sliceRead = inspectArr.subarray(0, result);
        await Deno.writeAll(inputBuffer, sliceRead);
        let sliceToProcess = inputBuffer.bytes();
        while(inspectIndex < sliceToProcess.length){
            if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
                inspectIndex++;
                matchIndex++;
            } else {
                if (matchIndex === 0) {
                    inspectIndex++;
                } else {
                    matchIndex = delimLPS[matchIndex - 1];
                }
            }
        }
        inputBuffer = new Deno.Buffer(sliceToProcess);
    }
}
async function* readStringDelim(reader, delim) {
    const encoder1 = new TextEncoder();
    const decoder1 = new TextDecoder();
    for await (const chunk of readDelim(reader, encoder1.encode(delim))){
        yield decoder1.decode(chunk);
    }
}
const DEFAULT_BUFFER_SIZE = 32 * 1024;
async function readShort(buf) {
    const high = await buf.readByte();
    if (high === null) return null;
    const low = await buf.readByte();
    if (low === null) throw new Deno.errors.UnexpectedEof();
    return high << 8 | low;
}
async function readInt(buf) {
    const high = await readShort(buf);
    if (high === null) return null;
    const low = await readShort(buf);
    if (low === null) throw new Deno.errors.UnexpectedEof();
    return high << 16 | low;
}
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
async function readLong(buf) {
    const high = await readInt(buf);
    if (high === null) return null;
    const low = await readInt(buf);
    if (low === null) throw new Deno.errors.UnexpectedEof();
    const big = BigInt(high) << 32n | BigInt(low);
    if (big > MAX_SAFE_INTEGER) {
        throw new RangeError("Long value too big to be represented as a JavaScript number.");
    }
    return Number(big);
}
function sliceLongToBytes(d, dest = new Array(8)) {
    let big = BigInt(d);
    for(let i1 = 0; i1 < 8; i1++){
        dest[7 - i1] = Number(big & 255n);
        big >>= 8n;
    }
    return dest;
}
const HEX_CHARS1 = "0123456789abcdef".split("");
const EXTRA1 = [
    -2147483648,
    8388608,
    32768,
    128
];
const SHIFT1 = [
    24,
    16,
    8,
    0
];
const blocks1 = [];
class Sha1 {
    #blocks;
    #block;
    #start;
    #bytes;
    #hBytes;
    #finalized;
    #hashed;
    #h0=1732584193;
    #h1=4023233417;
    #h2=2562383102;
    #h3=271733878;
    #h4=3285377520;
    #lastByteIndex=0;
    constructor(sharedMemory3 = false){
        if (sharedMemory3) {
            blocks1[0] = blocks1[16] = blocks1[1] = blocks1[2] = blocks1[3] = blocks1[4] = blocks1[5] = blocks1[6] = blocks1[7] = blocks1[8] = blocks1[9] = blocks1[10] = blocks1[11] = blocks1[12] = blocks1[13] = blocks1[14] = blocks1[15] = 0;
            this.#blocks = blocks1;
        } else {
            this.#blocks = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        this.#h0 = 1732584193;
        this.#h1 = 4023233417;
        this.#h2 = 2562383102;
        this.#h3 = 271733878;
        this.#h4 = 3285377520;
        this.#block = this.#start = this.#bytes = this.#hBytes = 0;
        this.#finalized = this.#hashed = false;
    }
    update(message) {
        if (this.#finalized) {
            return this;
        }
        let msg;
        if (message instanceof ArrayBuffer) {
            msg = new Uint8Array(message);
        } else {
            msg = message;
        }
        let index = 0;
        const length = msg.length;
        const blocks2 = this.#blocks;
        while(index < length){
            let i1;
            if (this.#hashed) {
                this.#hashed = false;
                blocks2[0] = this.#block;
                blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
            }
            if (typeof msg !== "string") {
                for(i1 = this.#start; index < length && i1 < 64; ++index){
                    blocks2[i1 >> 2] |= msg[index] << SHIFT1[(i1++) & 3];
                }
            } else {
                for(i1 = this.#start; index < length && i1 < 64; ++index){
                    let code1 = msg.charCodeAt(index);
                    if (code1 < 128) {
                        blocks2[i1 >> 2] |= code1 << SHIFT1[(i1++) & 3];
                    } else if (code1 < 2048) {
                        blocks2[i1 >> 2] |= (192 | code1 >> 6) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code1 & 63) << SHIFT1[(i1++) & 3];
                    } else if (code1 < 55296 || code1 >= 57344) {
                        blocks2[i1 >> 2] |= (224 | code1 >> 12) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code1 >> 6 & 63) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code1 & 63) << SHIFT1[(i1++) & 3];
                    } else {
                        code1 = 65536 + ((code1 & 1023) << 10 | msg.charCodeAt(++index) & 1023);
                        blocks2[i1 >> 2] |= (240 | code1 >> 18) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code1 >> 12 & 63) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code1 >> 6 & 63) << SHIFT1[(i1++) & 3];
                        blocks2[i1 >> 2] |= (128 | code1 & 63) << SHIFT1[(i1++) & 3];
                    }
                }
            }
            this.#lastByteIndex = i1;
            this.#bytes += i1 - this.#start;
            if (i1 >= 64) {
                this.#block = blocks2[16];
                this.#start = i1 - 64;
                this.hash();
                this.#hashed = true;
            } else {
                this.#start = i1;
            }
        }
        if (this.#bytes > 4294967295) {
            this.#hBytes += this.#bytes / 4294967296 >>> 0;
            this.#bytes = this.#bytes >>> 0;
        }
        return this;
    }
    finalize() {
        if (this.#finalized) {
            return;
        }
        this.#finalized = true;
        const blocks2 = this.#blocks;
        const i1 = this.#lastByteIndex;
        blocks2[16] = this.#block;
        blocks2[i1 >> 2] |= EXTRA1[i1 & 3];
        this.#block = blocks2[16];
        if (i1 >= 56) {
            if (!this.#hashed) {
                this.hash();
            }
            blocks2[0] = this.#block;
            blocks2[16] = blocks2[1] = blocks2[2] = blocks2[3] = blocks2[4] = blocks2[5] = blocks2[6] = blocks2[7] = blocks2[8] = blocks2[9] = blocks2[10] = blocks2[11] = blocks2[12] = blocks2[13] = blocks2[14] = blocks2[15] = 0;
        }
        blocks2[14] = this.#hBytes << 3 | this.#bytes >>> 29;
        blocks2[15] = this.#bytes << 3;
        this.hash();
    }
    hash() {
        let a = this.#h0;
        let b = this.#h1;
        let c = this.#h2;
        let d = this.#h3;
        let e = this.#h4;
        let f;
        let j;
        let t;
        const blocks2 = this.#blocks;
        for(j = 16; j < 80; ++j){
            t = blocks2[j - 3] ^ blocks2[j - 8] ^ blocks2[j - 14] ^ blocks2[j - 16];
            blocks2[j] = t << 1 | t >>> 31;
        }
        for(j = 0; j < 20; j += 5){
            f = b & c | ~b & d;
            t = a << 5 | a >>> 27;
            e = t + f + e + 1518500249 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a & b | ~a & c;
            t = e << 5 | e >>> 27;
            d = t + f + d + 1518500249 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e & a | ~e & b;
            t = d << 5 | d >>> 27;
            c = t + f + c + 1518500249 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d & e | ~d & a;
            t = c << 5 | c >>> 27;
            b = t + f + b + 1518500249 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c & d | ~c & e;
            t = b << 5 | b >>> 27;
            a = t + f + a + 1518500249 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        for(; j < 40; j += 5){
            f = b ^ c ^ d;
            t = a << 5 | a >>> 27;
            e = t + f + e + 1859775393 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t = e << 5 | e >>> 27;
            d = t + f + d + 1859775393 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t = d << 5 | d >>> 27;
            c = t + f + c + 1859775393 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t = c << 5 | c >>> 27;
            b = t + f + b + 1859775393 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t = b << 5 | b >>> 27;
            a = t + f + a + 1859775393 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        for(; j < 60; j += 5){
            f = b & c | b & d | c & d;
            t = a << 5 | a >>> 27;
            e = t + f + e - 1894007588 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a & b | a & c | b & c;
            t = e << 5 | e >>> 27;
            d = t + f + d - 1894007588 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e & a | e & b | a & b;
            t = d << 5 | d >>> 27;
            c = t + f + c - 1894007588 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d & e | d & a | e & a;
            t = c << 5 | c >>> 27;
            b = t + f + b - 1894007588 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c & d | c & e | d & e;
            t = b << 5 | b >>> 27;
            a = t + f + a - 1894007588 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        for(; j < 80; j += 5){
            f = b ^ c ^ d;
            t = a << 5 | a >>> 27;
            e = t + f + e - 899497514 + blocks2[j] >>> 0;
            b = b << 30 | b >>> 2;
            f = a ^ b ^ c;
            t = e << 5 | e >>> 27;
            d = t + f + d - 899497514 + blocks2[j + 1] >>> 0;
            a = a << 30 | a >>> 2;
            f = e ^ a ^ b;
            t = d << 5 | d >>> 27;
            c = t + f + c - 899497514 + blocks2[j + 2] >>> 0;
            e = e << 30 | e >>> 2;
            f = d ^ e ^ a;
            t = c << 5 | c >>> 27;
            b = t + f + b - 899497514 + blocks2[j + 3] >>> 0;
            d = d << 30 | d >>> 2;
            f = c ^ d ^ e;
            t = b << 5 | b >>> 27;
            a = t + f + a - 899497514 + blocks2[j + 4] >>> 0;
            c = c << 30 | c >>> 2;
        }
        this.#h0 = this.#h0 + a >>> 0;
        this.#h1 = this.#h1 + b >>> 0;
        this.#h2 = this.#h2 + c >>> 0;
        this.#h3 = this.#h3 + d >>> 0;
        this.#h4 = this.#h4 + e >>> 0;
    }
    hex() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        return HEX_CHARS1[h0 >> 28 & 15] + HEX_CHARS1[h0 >> 24 & 15] + HEX_CHARS1[h0 >> 20 & 15] + HEX_CHARS1[h0 >> 16 & 15] + HEX_CHARS1[h0 >> 12 & 15] + HEX_CHARS1[h0 >> 8 & 15] + HEX_CHARS1[h0 >> 4 & 15] + HEX_CHARS1[h0 & 15] + HEX_CHARS1[h1 >> 28 & 15] + HEX_CHARS1[h1 >> 24 & 15] + HEX_CHARS1[h1 >> 20 & 15] + HEX_CHARS1[h1 >> 16 & 15] + HEX_CHARS1[h1 >> 12 & 15] + HEX_CHARS1[h1 >> 8 & 15] + HEX_CHARS1[h1 >> 4 & 15] + HEX_CHARS1[h1 & 15] + HEX_CHARS1[h2 >> 28 & 15] + HEX_CHARS1[h2 >> 24 & 15] + HEX_CHARS1[h2 >> 20 & 15] + HEX_CHARS1[h2 >> 16 & 15] + HEX_CHARS1[h2 >> 12 & 15] + HEX_CHARS1[h2 >> 8 & 15] + HEX_CHARS1[h2 >> 4 & 15] + HEX_CHARS1[h2 & 15] + HEX_CHARS1[h3 >> 28 & 15] + HEX_CHARS1[h3 >> 24 & 15] + HEX_CHARS1[h3 >> 20 & 15] + HEX_CHARS1[h3 >> 16 & 15] + HEX_CHARS1[h3 >> 12 & 15] + HEX_CHARS1[h3 >> 8 & 15] + HEX_CHARS1[h3 >> 4 & 15] + HEX_CHARS1[h3 & 15] + HEX_CHARS1[h4 >> 28 & 15] + HEX_CHARS1[h4 >> 24 & 15] + HEX_CHARS1[h4 >> 20 & 15] + HEX_CHARS1[h4 >> 16 & 15] + HEX_CHARS1[h4 >> 12 & 15] + HEX_CHARS1[h4 >> 8 & 15] + HEX_CHARS1[h4 >> 4 & 15] + HEX_CHARS1[h4 & 15];
    }
    toString() {
        return this.hex();
    }
    digest() {
        this.finalize();
        const h0 = this.#h0;
        const h1 = this.#h1;
        const h2 = this.#h2;
        const h3 = this.#h3;
        const h4 = this.#h4;
        return [
            h0 >> 24 & 255,
            h0 >> 16 & 255,
            h0 >> 8 & 255,
            h0 & 255,
            h1 >> 24 & 255,
            h1 >> 16 & 255,
            h1 >> 8 & 255,
            h1 & 255,
            h2 >> 24 & 255,
            h2 >> 16 & 255,
            h2 >> 8 & 255,
            h2 & 255,
            h3 >> 24 & 255,
            h3 >> 16 & 255,
            h3 >> 8 & 255,
            h3 & 255,
            h4 >> 24 & 255,
            h4 >> 16 & 255,
            h4 >> 8 & 255,
            h4 & 255, 
        ];
    }
    array() {
        return this.digest();
    }
    arrayBuffer() {
        this.finalize();
        const buffer = new ArrayBuffer(20);
        const dataView = new DataView(buffer);
        dataView.setUint32(0, this.#h0);
        dataView.setUint32(4, this.#h1);
        dataView.setUint32(8, this.#h2);
        dataView.setUint32(12, this.#h3);
        dataView.setUint32(16, this.#h4);
        return buffer;
    }
}
function findIndex(source, pat) {
    const s = pat[0];
    for(let i1 = 0; i1 < source.length; i1++){
        if (source[i1] !== s) continue;
        const pin = i1;
        let matched = 1;
        let j = i1;
        while(matched < pat.length){
            j++;
            if (source[j] !== pat[j - pin]) {
                break;
            }
            matched++;
        }
        if (matched === pat.length) {
            return pin;
        }
    }
    return -1;
}
function equal1(source, match) {
    if (source.length !== match.length) return false;
    for(let i1 = 0; i1 < match.length; i1++){
        if (source[i1] !== match[i1]) return false;
    }
    return true;
}
function concat(origin, b) {
    const output = new Uint8Array(origin.length + b.length);
    output.set(origin, 0);
    output.set(b, origin.length);
    return output;
}
function copyBytes(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
function str(buf) {
    if (buf == null) {
        return "";
    } else {
        return decode(buf);
    }
}
function charCode(s) {
    return s.charCodeAt(0);
}
class TextProtoReader {
    constructor(r){
        this.r = r;
    }
    async readLine() {
        const s = await this.readLineSlice();
        if (s === null) return null;
        return str(s);
    }
    async readMIMEHeader() {
        const m = new Headers();
        let line;
        let buf = await this.r.peek(1);
        if (buf === null) {
            return null;
        } else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
            line = await this.readLineSlice();
        }
        buf = await this.r.peek(1);
        if (buf === null) {
            throw new Deno.errors.UnexpectedEof();
        } else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
            throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
        }
        while(true){
            const kv = await this.readLineSlice();
            if (kv === null) throw new Deno.errors.UnexpectedEof();
            if (kv.byteLength === 0) return m;
            let i1 = kv.indexOf(charCode(":"));
            if (i1 < 0) {
                throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
            }
            const key1 = str(kv.subarray(0, i1));
            if (key1 == "") {
                continue;
            }
            i1++;
            while(i1 < kv.byteLength && (kv[i1] == charCode(" ") || kv[i1] == charCode("\t"))){
                i1++;
            }
            const value2 = str(kv.subarray(i1)).replace(invalidHeaderCharRegex, encodeURI);
            try {
                m.append(key1, value2);
            } catch  {
            }
        }
    }
    async readLineSlice() {
        let line;
        while(true){
            const r1 = await this.r.readLine();
            if (r1 === null) return null;
            const { line: l , more  } = r1;
            if (!line && !more) {
                if (this.skipSpace(l) === 0) {
                    return new Uint8Array(0);
                }
                return l;
            }
            line = line ? concat(line, l) : l;
            if (!more) {
                break;
            }
        }
        return line;
    }
    skipSpace(l) {
        let n = 0;
        for(let i1 = 0; i1 < l.length; i1++){
            if (l[i1] === charCode(" ") || l[i1] === charCode("\t")) {
                continue;
            }
            n++;
        }
        return n;
    }
}
var OpCode;
(function(OpCode1) {
    OpCode1[OpCode1["Continue"] = 0] = "Continue";
    OpCode1[OpCode1["TextFrame"] = 1] = "TextFrame";
    OpCode1[OpCode1["BinaryFrame"] = 2] = "BinaryFrame";
    OpCode1[OpCode1["Close"] = 8] = "Close";
    OpCode1[OpCode1["Ping"] = 9] = "Ping";
    OpCode1[OpCode1["Pong"] = 10] = "Pong";
})(OpCode || (OpCode = {
}));
function unmask(payload, mask) {
    if (mask) {
        for(let i1 = 0, len = payload.length; i1 < len; i1++){
            payload[i1] ^= mask[i1 & 3];
        }
    }
}
async function writeFrame(frame, writer3) {
    const payloadLength = frame.payload.byteLength;
    let header;
    const hasMask = frame.mask ? 128 : 0;
    if (frame.mask && frame.mask.byteLength !== 4) {
        throw new Error("invalid mask. mask must be 4 bytes: length=" + frame.mask.byteLength);
    }
    if (payloadLength < 126) {
        header = new Uint8Array([
            128 | frame.opcode,
            hasMask | payloadLength
        ]);
    } else if (payloadLength < 65535) {
        header = new Uint8Array([
            128 | frame.opcode,
            hasMask | 126,
            payloadLength >>> 8,
            payloadLength & 255, 
        ]);
    } else {
        header = new Uint8Array([
            128 | frame.opcode,
            hasMask | 127,
            ...sliceLongToBytes(payloadLength), 
        ]);
    }
    if (frame.mask) {
        header = concat(header, frame.mask);
    }
    unmask(frame.payload, frame.mask);
    header = concat(header, frame.payload);
    const w = BufWriter.create(writer3);
    await w.write(header);
    await w.flush();
}
async function readFrame(buf) {
    let b = await buf.readByte();
    assert(b !== null);
    let isLastFrame = false;
    switch(b >>> 4){
        case 8: break;
        case 0: break;
        default:
            throw new Error("invalid signature");
    }
    const opcode = b & 15;
    b = await buf.readByte();
    assert(b !== null);
    const hasMask = b >>> 7;
    let payloadLength = b & 127;
    if (payloadLength === 126) {
        const l = await readShort(buf);
        assert(l !== null);
    } else if (payloadLength === 127) {
        const l = await readLong(buf);
        assert(l !== null);
        payloadLength = Number(l);
    }
    let mask;
    if (hasMask) {
        mask = new Uint8Array(4);
        assert(await buf.readFull(mask) !== null);
    }
    const payload = new Uint8Array(payloadLength);
    assert(await buf.readFull(payload) !== null);
    return {
        isLastFrame,
        opcode,
        mask,
        payload
    };
}
class WebSocketImpl {
    sendQueue = [];
    constructor({ conn , bufReader , bufWriter , mask  }){
        this.conn = conn;
        this.mask = mask;
        this.bufReader = bufReader || new BufReader(conn);
        this.bufWriter = bufWriter || new BufWriter(conn);
    }
    async *[Symbol.asyncIterator]() {
        let frames = [];
        let payloadsLength = 0;
        while(!this._isClosed){
            let frame;
            try {
                frame = await readFrame(this.bufReader);
            } catch (e) {
                this.ensureSocketClosed();
                break;
            }
            unmask(frame.payload, frame.mask);
            switch(frame.opcode){
                case OpCode.TextFrame:
                case OpCode.BinaryFrame:
                case OpCode.Continue:
                    frames.push(frame);
                    payloadsLength += frame.payload.length;
                    if (frame.isLastFrame) {
                        const concat1 = new Uint8Array(payloadsLength);
                        let offs = 0;
                        for (const frame1 of frames){
                            concat1.set(frame1.payload, offs);
                            offs += frame1.payload.length;
                        }
                        if (frames[0].opcode === OpCode.TextFrame) {
                            yield decode(concat1);
                        } else {
                            yield concat1;
                        }
                        frames = [];
                        payloadsLength = 0;
                    }
                    break;
                case OpCode.Close:
                    {
                        const code1 = frame.payload[0] << 8 | frame.payload[1];
                        const reason = decode(frame.payload.subarray(2, frame.payload.length));
                        await this.close(code1, reason);
                        yield {
                            code: code1,
                            reason
                        };
                        return;
                    }
                case OpCode.Ping:
                    await this.enqueue({
                        opcode: OpCode.Pong,
                        payload: frame.payload,
                        isLastFrame: true
                    });
                    yield [
                        "ping",
                        frame.payload
                    ];
                    break;
                case OpCode.Pong:
                    yield [
                        "pong",
                        frame.payload
                    ];
                    break;
                default:
            }
        }
    }
    dequeue() {
        const [entry] = this.sendQueue;
        if (!entry) return;
        if (this._isClosed) return;
        const { d , frame  } = entry;
        writeFrame(frame, this.bufWriter).then(()=>d.resolve()
        ).catch((e)=>d.reject(e)
        ).finally(()=>{
            this.sendQueue.shift();
            this.dequeue();
        });
    }
    enqueue(frame) {
        if (this._isClosed) {
            throw new Deno.errors.ConnectionReset("Socket has already been closed");
        }
        const d = deferred1();
        this.sendQueue.push({
            d,
            frame
        });
        if (this.sendQueue.length === 1) {
            this.dequeue();
        }
        return d;
    }
    send(data) {
        const opcode = typeof data === "string" ? OpCode.TextFrame : OpCode.BinaryFrame;
        const payload = typeof data === "string" ? encode(data) : data;
        const isLastFrame = true;
        const frame = {
            isLastFrame,
            opcode,
            payload,
            mask: this.mask
        };
        return this.enqueue(frame);
    }
    ping(data = "") {
        const payload = typeof data === "string" ? encode(data) : data;
        const frame = {
            isLastFrame: true,
            opcode: OpCode.Ping,
            mask: this.mask,
            payload
        };
        return this.enqueue(frame);
    }
    _isClosed = false;
    get isClosed() {
        return this._isClosed;
    }
    async close(code = 1000, reason) {
        try {
            const header = [
                code >>> 8,
                code & 255
            ];
            let payload;
            if (reason) {
                const reasonBytes = encode(reason);
                payload = new Uint8Array(2 + reasonBytes.byteLength);
                payload.set(header);
                payload.set(reasonBytes, 2);
            } else {
                payload = new Uint8Array(header);
            }
            await this.enqueue({
                isLastFrame: true,
                opcode: OpCode.Close,
                mask: this.mask,
                payload
            });
        } catch (e) {
            throw e;
        } finally{
            this.ensureSocketClosed();
        }
    }
    closeForce() {
        this.ensureSocketClosed();
    }
    ensureSocketClosed() {
        if (this.isClosed) return;
        try {
            this.conn.close();
        } catch (e) {
            console.error(e);
        } finally{
            this._isClosed = true;
            const rest = this.sendQueue;
            this.sendQueue = [];
            rest.forEach((e)=>e.d.reject(new Deno.errors.ConnectionReset("Socket has already been closed"))
            );
        }
    }
}
function acceptable(req) {
    const upgrade = req.headers.get("upgrade");
    if (!upgrade || upgrade.toLowerCase() !== "websocket") {
        return false;
    }
    const secKey = req.headers.get("sec-websocket-key");
    return req.headers.has("sec-websocket-key") && typeof secKey === "string" && secKey.length > 0;
}
const kGUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
function createSecAccept(nonce) {
    const sha1 = new Sha1();
    sha1.update(nonce + kGUID);
    const bytes = sha1.digest();
    return btoa(String.fromCharCode(...bytes));
}
async function acceptWebSocket(req) {
    const { conn: conn1 , headers , bufReader: bufReader1 , bufWriter: bufWriter1  } = req;
    if (acceptable(req)) {
        const sock = new WebSocketImpl({
            conn: conn1,
            bufReader: bufReader1,
            bufWriter: bufWriter1
        });
        const secKey = headers.get("sec-websocket-key");
        if (typeof secKey !== "string") {
            throw new Error("sec-websocket-key is not provided");
        }
        const secAccept = createSecAccept(secKey);
        await writeResponse(bufWriter1, {
            status: 101,
            headers: new Headers({
                Upgrade: "websocket",
                Connection: "Upgrade",
                "Sec-WebSocket-Accept": secAccept
            })
        });
        return sock;
    }
    throw new Error("request is not acceptable");
}
const kSecChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.~_";
function createSecKey() {
    let key1 = "";
    for(let i1 = 0; i1 < 16; i1++){
        const j = Math.floor(Math.random() * kSecChars.length);
        key1 += kSecChars[j];
    }
    return btoa(key1);
}
const acceptable1 = acceptable, acceptWebSocket1 = acceptWebSocket;
const db = {
    "application/1d-interleaved-parityfec": {
        source: "iana"
    },
    "application/3gpdash-qoe-report+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/3gpp-ims+xml": {
        source: "iana",
        compressible: true
    },
    "application/a2l": {
        source: "iana"
    },
    "application/activemessage": {
        source: "iana"
    },
    "application/activity+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-costmap+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-costmapfilter+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-directory+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-endpointcost+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-endpointcostparams+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-endpointprop+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-endpointpropparams+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-error+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-networkmap+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-networkmapfilter+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-updatestreamcontrol+json": {
        source: "iana",
        compressible: true
    },
    "application/alto-updatestreamparams+json": {
        source: "iana",
        compressible: true
    },
    "application/aml": {
        source: "iana"
    },
    "application/andrew-inset": {
        source: "iana",
        extensions: [
            "ez"
        ]
    },
    "application/applefile": {
        source: "iana"
    },
    "application/applixware": {
        source: "apache",
        extensions: [
            "aw"
        ]
    },
    "application/atf": {
        source: "iana"
    },
    "application/atfx": {
        source: "iana"
    },
    "application/atom+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "atom"
        ]
    },
    "application/atomcat+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "atomcat"
        ]
    },
    "application/atomdeleted+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "atomdeleted"
        ]
    },
    "application/atomicmail": {
        source: "iana"
    },
    "application/atomsvc+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "atomsvc"
        ]
    },
    "application/atsc-dwd+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "dwd"
        ]
    },
    "application/atsc-dynamic-event-message": {
        source: "iana"
    },
    "application/atsc-held+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "held"
        ]
    },
    "application/atsc-rdt+json": {
        source: "iana",
        compressible: true
    },
    "application/atsc-rsat+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rsat"
        ]
    },
    "application/atxml": {
        source: "iana"
    },
    "application/auth-policy+xml": {
        source: "iana",
        compressible: true
    },
    "application/bacnet-xdd+zip": {
        source: "iana",
        compressible: false
    },
    "application/batch-smtp": {
        source: "iana"
    },
    "application/bdoc": {
        compressible: false,
        extensions: [
            "bdoc"
        ]
    },
    "application/beep+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/calendar+json": {
        source: "iana",
        compressible: true
    },
    "application/calendar+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xcs"
        ]
    },
    "application/call-completion": {
        source: "iana"
    },
    "application/cals-1840": {
        source: "iana"
    },
    "application/cap+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/cbor": {
        source: "iana"
    },
    "application/cbor-seq": {
        source: "iana"
    },
    "application/cccex": {
        source: "iana"
    },
    "application/ccmp+xml": {
        source: "iana",
        compressible: true
    },
    "application/ccxml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "ccxml"
        ]
    },
    "application/cdfx+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "cdfx"
        ]
    },
    "application/cdmi-capability": {
        source: "iana",
        extensions: [
            "cdmia"
        ]
    },
    "application/cdmi-container": {
        source: "iana",
        extensions: [
            "cdmic"
        ]
    },
    "application/cdmi-domain": {
        source: "iana",
        extensions: [
            "cdmid"
        ]
    },
    "application/cdmi-object": {
        source: "iana",
        extensions: [
            "cdmio"
        ]
    },
    "application/cdmi-queue": {
        source: "iana",
        extensions: [
            "cdmiq"
        ]
    },
    "application/cdni": {
        source: "iana"
    },
    "application/cea": {
        source: "iana"
    },
    "application/cea-2018+xml": {
        source: "iana",
        compressible: true
    },
    "application/cellml+xml": {
        source: "iana",
        compressible: true
    },
    "application/cfw": {
        source: "iana"
    },
    "application/clue+xml": {
        source: "iana",
        compressible: true
    },
    "application/clue_info+xml": {
        source: "iana",
        compressible: true
    },
    "application/cms": {
        source: "iana"
    },
    "application/cnrp+xml": {
        source: "iana",
        compressible: true
    },
    "application/coap-group+json": {
        source: "iana",
        compressible: true
    },
    "application/coap-payload": {
        source: "iana"
    },
    "application/commonground": {
        source: "iana"
    },
    "application/conference-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/cose": {
        source: "iana"
    },
    "application/cose-key": {
        source: "iana"
    },
    "application/cose-key-set": {
        source: "iana"
    },
    "application/cpl+xml": {
        source: "iana",
        compressible: true
    },
    "application/csrattrs": {
        source: "iana"
    },
    "application/csta+xml": {
        source: "iana",
        compressible: true
    },
    "application/cstadata+xml": {
        source: "iana",
        compressible: true
    },
    "application/csvm+json": {
        source: "iana",
        compressible: true
    },
    "application/cu-seeme": {
        source: "apache",
        extensions: [
            "cu"
        ]
    },
    "application/cwt": {
        source: "iana"
    },
    "application/cybercash": {
        source: "iana"
    },
    "application/dart": {
        compressible: true
    },
    "application/dash+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mpd"
        ]
    },
    "application/dashdelta": {
        source: "iana"
    },
    "application/davmount+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "davmount"
        ]
    },
    "application/dca-rft": {
        source: "iana"
    },
    "application/dcd": {
        source: "iana"
    },
    "application/dec-dx": {
        source: "iana"
    },
    "application/dialog-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/dicom": {
        source: "iana"
    },
    "application/dicom+json": {
        source: "iana",
        compressible: true
    },
    "application/dicom+xml": {
        source: "iana",
        compressible: true
    },
    "application/dii": {
        source: "iana"
    },
    "application/dit": {
        source: "iana"
    },
    "application/dns": {
        source: "iana"
    },
    "application/dns+json": {
        source: "iana",
        compressible: true
    },
    "application/dns-message": {
        source: "iana"
    },
    "application/docbook+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "dbk"
        ]
    },
    "application/dots+cbor": {
        source: "iana"
    },
    "application/dskpp+xml": {
        source: "iana",
        compressible: true
    },
    "application/dssc+der": {
        source: "iana",
        extensions: [
            "dssc"
        ]
    },
    "application/dssc+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xdssc"
        ]
    },
    "application/dvcs": {
        source: "iana"
    },
    "application/ecmascript": {
        source: "iana",
        compressible: true,
        extensions: [
            "ecma",
            "es"
        ]
    },
    "application/edi-consent": {
        source: "iana"
    },
    "application/edi-x12": {
        source: "iana",
        compressible: false
    },
    "application/edifact": {
        source: "iana",
        compressible: false
    },
    "application/efi": {
        source: "iana"
    },
    "application/emergencycalldata.comment+xml": {
        source: "iana",
        compressible: true
    },
    "application/emergencycalldata.control+xml": {
        source: "iana",
        compressible: true
    },
    "application/emergencycalldata.deviceinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/emergencycalldata.ecall.msd": {
        source: "iana"
    },
    "application/emergencycalldata.providerinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/emergencycalldata.serviceinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/emergencycalldata.subscriberinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/emergencycalldata.veds+xml": {
        source: "iana",
        compressible: true
    },
    "application/emma+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "emma"
        ]
    },
    "application/emotionml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "emotionml"
        ]
    },
    "application/encaprtp": {
        source: "iana"
    },
    "application/epp+xml": {
        source: "iana",
        compressible: true
    },
    "application/epub+zip": {
        source: "iana",
        compressible: false,
        extensions: [
            "epub"
        ]
    },
    "application/eshop": {
        source: "iana"
    },
    "application/exi": {
        source: "iana",
        extensions: [
            "exi"
        ]
    },
    "application/expect-ct-report+json": {
        source: "iana",
        compressible: true
    },
    "application/fastinfoset": {
        source: "iana"
    },
    "application/fastsoap": {
        source: "iana"
    },
    "application/fdt+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "fdt"
        ]
    },
    "application/fhir+json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/fhir+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/fido.trusted-apps+json": {
        compressible: true
    },
    "application/fits": {
        source: "iana"
    },
    "application/flexfec": {
        source: "iana"
    },
    "application/font-sfnt": {
        source: "iana"
    },
    "application/font-tdpfr": {
        source: "iana",
        extensions: [
            "pfr"
        ]
    },
    "application/font-woff": {
        source: "iana",
        compressible: false
    },
    "application/framework-attributes+xml": {
        source: "iana",
        compressible: true
    },
    "application/geo+json": {
        source: "iana",
        compressible: true,
        extensions: [
            "geojson"
        ]
    },
    "application/geo+json-seq": {
        source: "iana"
    },
    "application/geopackage+sqlite3": {
        source: "iana"
    },
    "application/geoxacml+xml": {
        source: "iana",
        compressible: true
    },
    "application/gltf-buffer": {
        source: "iana"
    },
    "application/gml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "gml"
        ]
    },
    "application/gpx+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "gpx"
        ]
    },
    "application/gxf": {
        source: "apache",
        extensions: [
            "gxf"
        ]
    },
    "application/gzip": {
        source: "iana",
        compressible: false,
        extensions: [
            "gz"
        ]
    },
    "application/h224": {
        source: "iana"
    },
    "application/held+xml": {
        source: "iana",
        compressible: true
    },
    "application/hjson": {
        extensions: [
            "hjson"
        ]
    },
    "application/http": {
        source: "iana"
    },
    "application/hyperstudio": {
        source: "iana",
        extensions: [
            "stk"
        ]
    },
    "application/ibe-key-request+xml": {
        source: "iana",
        compressible: true
    },
    "application/ibe-pkg-reply+xml": {
        source: "iana",
        compressible: true
    },
    "application/ibe-pp-data": {
        source: "iana"
    },
    "application/iges": {
        source: "iana"
    },
    "application/im-iscomposing+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/index": {
        source: "iana"
    },
    "application/index.cmd": {
        source: "iana"
    },
    "application/index.obj": {
        source: "iana"
    },
    "application/index.response": {
        source: "iana"
    },
    "application/index.vnd": {
        source: "iana"
    },
    "application/inkml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "ink",
            "inkml"
        ]
    },
    "application/iotp": {
        source: "iana"
    },
    "application/ipfix": {
        source: "iana",
        extensions: [
            "ipfix"
        ]
    },
    "application/ipp": {
        source: "iana"
    },
    "application/isup": {
        source: "iana"
    },
    "application/its+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "its"
        ]
    },
    "application/java-archive": {
        source: "apache",
        compressible: false,
        extensions: [
            "jar",
            "war",
            "ear"
        ]
    },
    "application/java-serialized-object": {
        source: "apache",
        compressible: false,
        extensions: [
            "ser"
        ]
    },
    "application/java-vm": {
        source: "apache",
        compressible: false,
        extensions: [
            "class"
        ]
    },
    "application/javascript": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "js",
            "mjs"
        ]
    },
    "application/jf2feed+json": {
        source: "iana",
        compressible: true
    },
    "application/jose": {
        source: "iana"
    },
    "application/jose+json": {
        source: "iana",
        compressible: true
    },
    "application/jrd+json": {
        source: "iana",
        compressible: true
    },
    "application/json": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "json",
            "map"
        ]
    },
    "application/json-patch+json": {
        source: "iana",
        compressible: true
    },
    "application/json-seq": {
        source: "iana"
    },
    "application/json5": {
        extensions: [
            "json5"
        ]
    },
    "application/jsonml+json": {
        source: "apache",
        compressible: true,
        extensions: [
            "jsonml"
        ]
    },
    "application/jwk+json": {
        source: "iana",
        compressible: true
    },
    "application/jwk-set+json": {
        source: "iana",
        compressible: true
    },
    "application/jwt": {
        source: "iana"
    },
    "application/kpml-request+xml": {
        source: "iana",
        compressible: true
    },
    "application/kpml-response+xml": {
        source: "iana",
        compressible: true
    },
    "application/ld+json": {
        source: "iana",
        compressible: true,
        extensions: [
            "jsonld"
        ]
    },
    "application/lgr+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "lgr"
        ]
    },
    "application/link-format": {
        source: "iana"
    },
    "application/load-control+xml": {
        source: "iana",
        compressible: true
    },
    "application/lost+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "lostxml"
        ]
    },
    "application/lostsync+xml": {
        source: "iana",
        compressible: true
    },
    "application/lpf+zip": {
        source: "iana",
        compressible: false
    },
    "application/lxf": {
        source: "iana"
    },
    "application/mac-binhex40": {
        source: "iana",
        extensions: [
            "hqx"
        ]
    },
    "application/mac-compactpro": {
        source: "apache",
        extensions: [
            "cpt"
        ]
    },
    "application/macwriteii": {
        source: "iana"
    },
    "application/mads+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mads"
        ]
    },
    "application/manifest+json": {
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "webmanifest"
        ]
    },
    "application/marc": {
        source: "iana",
        extensions: [
            "mrc"
        ]
    },
    "application/marcxml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mrcx"
        ]
    },
    "application/mathematica": {
        source: "iana",
        extensions: [
            "ma",
            "nb",
            "mb"
        ]
    },
    "application/mathml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mathml"
        ]
    },
    "application/mathml-content+xml": {
        source: "iana",
        compressible: true
    },
    "application/mathml-presentation+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-associated-procedure-description+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-deregister+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-envelope+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-msk+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-msk-response+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-protection-description+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-reception-report+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-register+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-register-response+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-schedule+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbms-user-service-description+xml": {
        source: "iana",
        compressible: true
    },
    "application/mbox": {
        source: "iana",
        extensions: [
            "mbox"
        ]
    },
    "application/media-policy-dataset+xml": {
        source: "iana",
        compressible: true
    },
    "application/media_control+xml": {
        source: "iana",
        compressible: true
    },
    "application/mediaservercontrol+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mscml"
        ]
    },
    "application/merge-patch+json": {
        source: "iana",
        compressible: true
    },
    "application/metalink+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "metalink"
        ]
    },
    "application/metalink4+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "meta4"
        ]
    },
    "application/mets+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mets"
        ]
    },
    "application/mf4": {
        source: "iana"
    },
    "application/mikey": {
        source: "iana"
    },
    "application/mipc": {
        source: "iana"
    },
    "application/mmt-aei+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "maei"
        ]
    },
    "application/mmt-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "musd"
        ]
    },
    "application/mods+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mods"
        ]
    },
    "application/moss-keys": {
        source: "iana"
    },
    "application/moss-signature": {
        source: "iana"
    },
    "application/mosskey-data": {
        source: "iana"
    },
    "application/mosskey-request": {
        source: "iana"
    },
    "application/mp21": {
        source: "iana",
        extensions: [
            "m21",
            "mp21"
        ]
    },
    "application/mp4": {
        source: "iana",
        extensions: [
            "mp4s",
            "m4p"
        ]
    },
    "application/mpeg4-generic": {
        source: "iana"
    },
    "application/mpeg4-iod": {
        source: "iana"
    },
    "application/mpeg4-iod-xmt": {
        source: "iana"
    },
    "application/mrb-consumer+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xdf"
        ]
    },
    "application/mrb-publish+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xdf"
        ]
    },
    "application/msc-ivr+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/msc-mixer+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/msword": {
        source: "iana",
        compressible: false,
        extensions: [
            "doc",
            "dot"
        ]
    },
    "application/mud+json": {
        source: "iana",
        compressible: true
    },
    "application/multipart-core": {
        source: "iana"
    },
    "application/mxf": {
        source: "iana",
        extensions: [
            "mxf"
        ]
    },
    "application/n-quads": {
        source: "iana",
        extensions: [
            "nq"
        ]
    },
    "application/n-triples": {
        source: "iana",
        extensions: [
            "nt"
        ]
    },
    "application/nasdata": {
        source: "iana"
    },
    "application/news-checkgroups": {
        source: "iana",
        charset: "US-ASCII"
    },
    "application/news-groupinfo": {
        source: "iana",
        charset: "US-ASCII"
    },
    "application/news-transmission": {
        source: "iana"
    },
    "application/nlsml+xml": {
        source: "iana",
        compressible: true
    },
    "application/node": {
        source: "iana",
        extensions: [
            "cjs"
        ]
    },
    "application/nss": {
        source: "iana"
    },
    "application/ocsp-request": {
        source: "iana"
    },
    "application/ocsp-response": {
        source: "iana"
    },
    "application/octet-stream": {
        source: "iana",
        compressible: false,
        extensions: [
            "bin",
            "dms",
            "lrf",
            "mar",
            "so",
            "dist",
            "distz",
            "pkg",
            "bpk",
            "dump",
            "elc",
            "deploy",
            "exe",
            "dll",
            "deb",
            "dmg",
            "iso",
            "img",
            "msi",
            "msp",
            "msm",
            "buffer", 
        ]
    },
    "application/oda": {
        source: "iana",
        extensions: [
            "oda"
        ]
    },
    "application/odm+xml": {
        source: "iana",
        compressible: true
    },
    "application/odx": {
        source: "iana"
    },
    "application/oebps-package+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "opf"
        ]
    },
    "application/ogg": {
        source: "iana",
        compressible: false,
        extensions: [
            "ogx"
        ]
    },
    "application/omdoc+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "omdoc"
        ]
    },
    "application/onenote": {
        source: "apache",
        extensions: [
            "onetoc",
            "onetoc2",
            "onetmp",
            "onepkg"
        ]
    },
    "application/oscore": {
        source: "iana"
    },
    "application/oxps": {
        source: "iana",
        extensions: [
            "oxps"
        ]
    },
    "application/p2p-overlay+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "relo"
        ]
    },
    "application/parityfec": {
        source: "iana"
    },
    "application/passport": {
        source: "iana"
    },
    "application/patch-ops-error+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xer"
        ]
    },
    "application/pdf": {
        source: "iana",
        compressible: false,
        extensions: [
            "pdf"
        ]
    },
    "application/pdx": {
        source: "iana"
    },
    "application/pem-certificate-chain": {
        source: "iana"
    },
    "application/pgp-encrypted": {
        source: "iana",
        compressible: false,
        extensions: [
            "pgp"
        ]
    },
    "application/pgp-keys": {
        source: "iana"
    },
    "application/pgp-signature": {
        source: "iana",
        extensions: [
            "asc",
            "sig"
        ]
    },
    "application/pics-rules": {
        source: "apache",
        extensions: [
            "prf"
        ]
    },
    "application/pidf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/pidf-diff+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/pkcs10": {
        source: "iana",
        extensions: [
            "p10"
        ]
    },
    "application/pkcs12": {
        source: "iana"
    },
    "application/pkcs7-mime": {
        source: "iana",
        extensions: [
            "p7m",
            "p7c"
        ]
    },
    "application/pkcs7-signature": {
        source: "iana",
        extensions: [
            "p7s"
        ]
    },
    "application/pkcs8": {
        source: "iana",
        extensions: [
            "p8"
        ]
    },
    "application/pkcs8-encrypted": {
        source: "iana"
    },
    "application/pkix-attr-cert": {
        source: "iana",
        extensions: [
            "ac"
        ]
    },
    "application/pkix-cert": {
        source: "iana",
        extensions: [
            "cer"
        ]
    },
    "application/pkix-crl": {
        source: "iana",
        extensions: [
            "crl"
        ]
    },
    "application/pkix-pkipath": {
        source: "iana",
        extensions: [
            "pkipath"
        ]
    },
    "application/pkixcmp": {
        source: "iana",
        extensions: [
            "pki"
        ]
    },
    "application/pls+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "pls"
        ]
    },
    "application/poc-settings+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/postscript": {
        source: "iana",
        compressible: true,
        extensions: [
            "ai",
            "eps",
            "ps"
        ]
    },
    "application/ppsp-tracker+json": {
        source: "iana",
        compressible: true
    },
    "application/problem+json": {
        source: "iana",
        compressible: true
    },
    "application/problem+xml": {
        source: "iana",
        compressible: true
    },
    "application/provenance+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "provx"
        ]
    },
    "application/prs.alvestrand.titrax-sheet": {
        source: "iana"
    },
    "application/prs.cww": {
        source: "iana",
        extensions: [
            "cww"
        ]
    },
    "application/prs.hpub+zip": {
        source: "iana",
        compressible: false
    },
    "application/prs.nprend": {
        source: "iana"
    },
    "application/prs.plucker": {
        source: "iana"
    },
    "application/prs.rdf-xml-crypt": {
        source: "iana"
    },
    "application/prs.xsf+xml": {
        source: "iana",
        compressible: true
    },
    "application/pskc+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "pskcxml"
        ]
    },
    "application/pvd+json": {
        source: "iana",
        compressible: true
    },
    "application/qsig": {
        source: "iana"
    },
    "application/raml+yaml": {
        compressible: true,
        extensions: [
            "raml"
        ]
    },
    "application/raptorfec": {
        source: "iana"
    },
    "application/rdap+json": {
        source: "iana",
        compressible: true
    },
    "application/rdf+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rdf",
            "owl"
        ]
    },
    "application/reginfo+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rif"
        ]
    },
    "application/relax-ng-compact-syntax": {
        source: "iana",
        extensions: [
            "rnc"
        ]
    },
    "application/remote-printing": {
        source: "iana"
    },
    "application/reputon+json": {
        source: "iana",
        compressible: true
    },
    "application/resource-lists+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rl"
        ]
    },
    "application/resource-lists-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rld"
        ]
    },
    "application/rfc+xml": {
        source: "iana",
        compressible: true
    },
    "application/riscos": {
        source: "iana"
    },
    "application/rlmi+xml": {
        source: "iana",
        compressible: true
    },
    "application/rls-services+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rs"
        ]
    },
    "application/route-apd+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rapd"
        ]
    },
    "application/route-s-tsid+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "sls"
        ]
    },
    "application/route-usd+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rusd"
        ]
    },
    "application/rpki-ghostbusters": {
        source: "iana",
        extensions: [
            "gbr"
        ]
    },
    "application/rpki-manifest": {
        source: "iana",
        extensions: [
            "mft"
        ]
    },
    "application/rpki-publication": {
        source: "iana"
    },
    "application/rpki-roa": {
        source: "iana",
        extensions: [
            "roa"
        ]
    },
    "application/rpki-updown": {
        source: "iana"
    },
    "application/rsd+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "rsd"
        ]
    },
    "application/rss+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "rss"
        ]
    },
    "application/rtf": {
        source: "iana",
        compressible: true,
        extensions: [
            "rtf"
        ]
    },
    "application/rtploopback": {
        source: "iana"
    },
    "application/rtx": {
        source: "iana"
    },
    "application/samlassertion+xml": {
        source: "iana",
        compressible: true
    },
    "application/samlmetadata+xml": {
        source: "iana",
        compressible: true
    },
    "application/sbe": {
        source: "iana"
    },
    "application/sbml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "sbml"
        ]
    },
    "application/scaip+xml": {
        source: "iana",
        compressible: true
    },
    "application/scim+json": {
        source: "iana",
        compressible: true
    },
    "application/scvp-cv-request": {
        source: "iana",
        extensions: [
            "scq"
        ]
    },
    "application/scvp-cv-response": {
        source: "iana",
        extensions: [
            "scs"
        ]
    },
    "application/scvp-vp-request": {
        source: "iana",
        extensions: [
            "spq"
        ]
    },
    "application/scvp-vp-response": {
        source: "iana",
        extensions: [
            "spp"
        ]
    },
    "application/sdp": {
        source: "iana",
        extensions: [
            "sdp"
        ]
    },
    "application/secevent+jwt": {
        source: "iana"
    },
    "application/senml+cbor": {
        source: "iana"
    },
    "application/senml+json": {
        source: "iana",
        compressible: true
    },
    "application/senml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "senmlx"
        ]
    },
    "application/senml-etch+cbor": {
        source: "iana"
    },
    "application/senml-etch+json": {
        source: "iana",
        compressible: true
    },
    "application/senml-exi": {
        source: "iana"
    },
    "application/sensml+cbor": {
        source: "iana"
    },
    "application/sensml+json": {
        source: "iana",
        compressible: true
    },
    "application/sensml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "sensmlx"
        ]
    },
    "application/sensml-exi": {
        source: "iana"
    },
    "application/sep+xml": {
        source: "iana",
        compressible: true
    },
    "application/sep-exi": {
        source: "iana"
    },
    "application/session-info": {
        source: "iana"
    },
    "application/set-payment": {
        source: "iana"
    },
    "application/set-payment-initiation": {
        source: "iana",
        extensions: [
            "setpay"
        ]
    },
    "application/set-registration": {
        source: "iana"
    },
    "application/set-registration-initiation": {
        source: "iana",
        extensions: [
            "setreg"
        ]
    },
    "application/sgml": {
        source: "iana"
    },
    "application/sgml-open-catalog": {
        source: "iana"
    },
    "application/shf+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "shf"
        ]
    },
    "application/sieve": {
        source: "iana",
        extensions: [
            "siv",
            "sieve"
        ]
    },
    "application/simple-filter+xml": {
        source: "iana",
        compressible: true
    },
    "application/simple-message-summary": {
        source: "iana"
    },
    "application/simplesymbolcontainer": {
        source: "iana"
    },
    "application/sipc": {
        source: "iana"
    },
    "application/slate": {
        source: "iana"
    },
    "application/smil": {
        source: "iana"
    },
    "application/smil+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "smi",
            "smil"
        ]
    },
    "application/smpte336m": {
        source: "iana"
    },
    "application/soap+fastinfoset": {
        source: "iana"
    },
    "application/soap+xml": {
        source: "iana",
        compressible: true
    },
    "application/sparql-query": {
        source: "iana",
        extensions: [
            "rq"
        ]
    },
    "application/sparql-results+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "srx"
        ]
    },
    "application/spirits-event+xml": {
        source: "iana",
        compressible: true
    },
    "application/sql": {
        source: "iana"
    },
    "application/srgs": {
        source: "iana",
        extensions: [
            "gram"
        ]
    },
    "application/srgs+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "grxml"
        ]
    },
    "application/sru+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "sru"
        ]
    },
    "application/ssdl+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "ssdl"
        ]
    },
    "application/ssml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "ssml"
        ]
    },
    "application/stix+json": {
        source: "iana",
        compressible: true
    },
    "application/swid+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "swidtag"
        ]
    },
    "application/tamp-apex-update": {
        source: "iana"
    },
    "application/tamp-apex-update-confirm": {
        source: "iana"
    },
    "application/tamp-community-update": {
        source: "iana"
    },
    "application/tamp-community-update-confirm": {
        source: "iana"
    },
    "application/tamp-error": {
        source: "iana"
    },
    "application/tamp-sequence-adjust": {
        source: "iana"
    },
    "application/tamp-sequence-adjust-confirm": {
        source: "iana"
    },
    "application/tamp-status-query": {
        source: "iana"
    },
    "application/tamp-status-response": {
        source: "iana"
    },
    "application/tamp-update": {
        source: "iana"
    },
    "application/tamp-update-confirm": {
        source: "iana"
    },
    "application/tar": {
        compressible: true
    },
    "application/taxii+json": {
        source: "iana",
        compressible: true
    },
    "application/td+json": {
        source: "iana",
        compressible: true
    },
    "application/tei+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "tei",
            "teicorpus"
        ]
    },
    "application/tetra_isi": {
        source: "iana"
    },
    "application/thraud+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "tfi"
        ]
    },
    "application/timestamp-query": {
        source: "iana"
    },
    "application/timestamp-reply": {
        source: "iana"
    },
    "application/timestamped-data": {
        source: "iana",
        extensions: [
            "tsd"
        ]
    },
    "application/tlsrpt+gzip": {
        source: "iana"
    },
    "application/tlsrpt+json": {
        source: "iana",
        compressible: true
    },
    "application/tnauthlist": {
        source: "iana"
    },
    "application/toml": {
        compressible: true,
        extensions: [
            "toml"
        ]
    },
    "application/trickle-ice-sdpfrag": {
        source: "iana"
    },
    "application/trig": {
        source: "iana"
    },
    "application/ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "ttml"
        ]
    },
    "application/tve-trigger": {
        source: "iana"
    },
    "application/tzif": {
        source: "iana"
    },
    "application/tzif-leap": {
        source: "iana"
    },
    "application/ulpfec": {
        source: "iana"
    },
    "application/urc-grpsheet+xml": {
        source: "iana",
        compressible: true
    },
    "application/urc-ressheet+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "rsheet"
        ]
    },
    "application/urc-targetdesc+xml": {
        source: "iana",
        compressible: true
    },
    "application/urc-uisocketdesc+xml": {
        source: "iana",
        compressible: true
    },
    "application/vcard+json": {
        source: "iana",
        compressible: true
    },
    "application/vcard+xml": {
        source: "iana",
        compressible: true
    },
    "application/vemmi": {
        source: "iana"
    },
    "application/vividence.scriptfile": {
        source: "apache"
    },
    "application/vnd.1000minds.decision-model+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "1km"
        ]
    },
    "application/vnd.3gpp-prose+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp-prose-pc3ch+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp-v2x-local-service-information": {
        source: "iana"
    },
    "application/vnd.3gpp.access-transfer-events+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.bsf+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.gmop+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mc-signalling-ear": {
        source: "iana"
    },
    "application/vnd.3gpp.mcdata-affiliation-command+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcdata-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcdata-payload": {
        source: "iana"
    },
    "application/vnd.3gpp.mcdata-service-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcdata-signalling": {
        source: "iana"
    },
    "application/vnd.3gpp.mcdata-ue-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcdata-user-profile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-affiliation-command+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-floor-request+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-location-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-service-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-signed+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-ue-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-ue-init-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcptt-user-profile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-affiliation-command+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-affiliation-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-location-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-mbms-usage-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-service-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-transmission-request+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-ue-config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mcvideo-user-profile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.mid-call+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.pic-bw-large": {
        source: "iana",
        extensions: [
            "plb"
        ]
    },
    "application/vnd.3gpp.pic-bw-small": {
        source: "iana",
        extensions: [
            "psb"
        ]
    },
    "application/vnd.3gpp.pic-bw-var": {
        source: "iana",
        extensions: [
            "pvb"
        ]
    },
    "application/vnd.3gpp.sms": {
        source: "iana"
    },
    "application/vnd.3gpp.sms+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.srvcc-ext+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.srvcc-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.state-and-event-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp.ussd+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp2.bcmcsinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.3gpp2.sms": {
        source: "iana"
    },
    "application/vnd.3gpp2.tcap": {
        source: "iana",
        extensions: [
            "tcap"
        ]
    },
    "application/vnd.3lightssoftware.imagescal": {
        source: "iana"
    },
    "application/vnd.3m.post-it-notes": {
        source: "iana",
        extensions: [
            "pwn"
        ]
    },
    "application/vnd.accpac.simply.aso": {
        source: "iana",
        extensions: [
            "aso"
        ]
    },
    "application/vnd.accpac.simply.imp": {
        source: "iana",
        extensions: [
            "imp"
        ]
    },
    "application/vnd.acucobol": {
        source: "iana",
        extensions: [
            "acu"
        ]
    },
    "application/vnd.acucorp": {
        source: "iana",
        extensions: [
            "atc",
            "acutc"
        ]
    },
    "application/vnd.adobe.air-application-installer-package+zip": {
        source: "apache",
        compressible: false,
        extensions: [
            "air"
        ]
    },
    "application/vnd.adobe.flash.movie": {
        source: "iana"
    },
    "application/vnd.adobe.formscentral.fcdt": {
        source: "iana",
        extensions: [
            "fcdt"
        ]
    },
    "application/vnd.adobe.fxp": {
        source: "iana",
        extensions: [
            "fxp",
            "fxpl"
        ]
    },
    "application/vnd.adobe.partial-upload": {
        source: "iana"
    },
    "application/vnd.adobe.xdp+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xdp"
        ]
    },
    "application/vnd.adobe.xfdf": {
        source: "iana",
        extensions: [
            "xfdf"
        ]
    },
    "application/vnd.aether.imp": {
        source: "iana"
    },
    "application/vnd.afpc.afplinedata": {
        source: "iana"
    },
    "application/vnd.afpc.afplinedata-pagedef": {
        source: "iana"
    },
    "application/vnd.afpc.foca-charset": {
        source: "iana"
    },
    "application/vnd.afpc.foca-codedfont": {
        source: "iana"
    },
    "application/vnd.afpc.foca-codepage": {
        source: "iana"
    },
    "application/vnd.afpc.modca": {
        source: "iana"
    },
    "application/vnd.afpc.modca-formdef": {
        source: "iana"
    },
    "application/vnd.afpc.modca-mediummap": {
        source: "iana"
    },
    "application/vnd.afpc.modca-objectcontainer": {
        source: "iana"
    },
    "application/vnd.afpc.modca-overlay": {
        source: "iana"
    },
    "application/vnd.afpc.modca-pagesegment": {
        source: "iana"
    },
    "application/vnd.ah-barcode": {
        source: "iana"
    },
    "application/vnd.ahead.space": {
        source: "iana",
        extensions: [
            "ahead"
        ]
    },
    "application/vnd.airzip.filesecure.azf": {
        source: "iana",
        extensions: [
            "azf"
        ]
    },
    "application/vnd.airzip.filesecure.azs": {
        source: "iana",
        extensions: [
            "azs"
        ]
    },
    "application/vnd.amadeus+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.amazon.ebook": {
        source: "apache",
        extensions: [
            "azw"
        ]
    },
    "application/vnd.amazon.mobi8-ebook": {
        source: "iana"
    },
    "application/vnd.americandynamics.acc": {
        source: "iana",
        extensions: [
            "acc"
        ]
    },
    "application/vnd.amiga.ami": {
        source: "iana",
        extensions: [
            "ami"
        ]
    },
    "application/vnd.amundsen.maze+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.android.ota": {
        source: "iana"
    },
    "application/vnd.android.package-archive": {
        source: "apache",
        compressible: false,
        extensions: [
            "apk"
        ]
    },
    "application/vnd.anki": {
        source: "iana"
    },
    "application/vnd.anser-web-certificate-issue-initiation": {
        source: "iana",
        extensions: [
            "cii"
        ]
    },
    "application/vnd.anser-web-funds-transfer-initiation": {
        source: "apache",
        extensions: [
            "fti"
        ]
    },
    "application/vnd.antix.game-component": {
        source: "iana",
        extensions: [
            "atx"
        ]
    },
    "application/vnd.apache.thrift.binary": {
        source: "iana"
    },
    "application/vnd.apache.thrift.compact": {
        source: "iana"
    },
    "application/vnd.apache.thrift.json": {
        source: "iana"
    },
    "application/vnd.api+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.aplextor.warrp+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.apothekende.reservation+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.apple.installer+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mpkg"
        ]
    },
    "application/vnd.apple.keynote": {
        source: "iana",
        extensions: [
            "keynote"
        ]
    },
    "application/vnd.apple.mpegurl": {
        source: "iana",
        extensions: [
            "m3u8"
        ]
    },
    "application/vnd.apple.numbers": {
        source: "iana",
        extensions: [
            "numbers"
        ]
    },
    "application/vnd.apple.pages": {
        source: "iana",
        extensions: [
            "pages"
        ]
    },
    "application/vnd.apple.pkpass": {
        compressible: false,
        extensions: [
            "pkpass"
        ]
    },
    "application/vnd.arastra.swi": {
        source: "iana"
    },
    "application/vnd.aristanetworks.swi": {
        source: "iana",
        extensions: [
            "swi"
        ]
    },
    "application/vnd.artisan+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.artsquare": {
        source: "iana"
    },
    "application/vnd.astraea-software.iota": {
        source: "iana",
        extensions: [
            "iota"
        ]
    },
    "application/vnd.audiograph": {
        source: "iana",
        extensions: [
            "aep"
        ]
    },
    "application/vnd.autopackage": {
        source: "iana"
    },
    "application/vnd.avalon+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.avistar+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.balsamiq.bmml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "bmml"
        ]
    },
    "application/vnd.balsamiq.bmpr": {
        source: "iana"
    },
    "application/vnd.banana-accounting": {
        source: "iana"
    },
    "application/vnd.bbf.usp.error": {
        source: "iana"
    },
    "application/vnd.bbf.usp.msg": {
        source: "iana"
    },
    "application/vnd.bbf.usp.msg+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.bekitzur-stech+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.bint.med-content": {
        source: "iana"
    },
    "application/vnd.biopax.rdf+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.blink-idb-value-wrapper": {
        source: "iana"
    },
    "application/vnd.blueice.multipass": {
        source: "iana",
        extensions: [
            "mpm"
        ]
    },
    "application/vnd.bluetooth.ep.oob": {
        source: "iana"
    },
    "application/vnd.bluetooth.le.oob": {
        source: "iana"
    },
    "application/vnd.bmi": {
        source: "iana",
        extensions: [
            "bmi"
        ]
    },
    "application/vnd.bpf": {
        source: "iana"
    },
    "application/vnd.bpf3": {
        source: "iana"
    },
    "application/vnd.businessobjects": {
        source: "iana",
        extensions: [
            "rep"
        ]
    },
    "application/vnd.byu.uapi+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.cab-jscript": {
        source: "iana"
    },
    "application/vnd.canon-cpdl": {
        source: "iana"
    },
    "application/vnd.canon-lips": {
        source: "iana"
    },
    "application/vnd.capasystems-pg+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.cendio.thinlinc.clientconf": {
        source: "iana"
    },
    "application/vnd.century-systems.tcp_stream": {
        source: "iana"
    },
    "application/vnd.chemdraw+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "cdxml"
        ]
    },
    "application/vnd.chess-pgn": {
        source: "iana"
    },
    "application/vnd.chipnuts.karaoke-mmd": {
        source: "iana",
        extensions: [
            "mmd"
        ]
    },
    "application/vnd.ciedi": {
        source: "iana"
    },
    "application/vnd.cinderella": {
        source: "iana",
        extensions: [
            "cdy"
        ]
    },
    "application/vnd.cirpack.isdn-ext": {
        source: "iana"
    },
    "application/vnd.citationstyles.style+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "csl"
        ]
    },
    "application/vnd.claymore": {
        source: "iana",
        extensions: [
            "cla"
        ]
    },
    "application/vnd.cloanto.rp9": {
        source: "iana",
        extensions: [
            "rp9"
        ]
    },
    "application/vnd.clonk.c4group": {
        source: "iana",
        extensions: [
            "c4g",
            "c4d",
            "c4f",
            "c4p",
            "c4u"
        ]
    },
    "application/vnd.cluetrust.cartomobile-config": {
        source: "iana",
        extensions: [
            "c11amc"
        ]
    },
    "application/vnd.cluetrust.cartomobile-config-pkg": {
        source: "iana",
        extensions: [
            "c11amz"
        ]
    },
    "application/vnd.coffeescript": {
        source: "iana"
    },
    "application/vnd.collabio.xodocuments.document": {
        source: "iana"
    },
    "application/vnd.collabio.xodocuments.document-template": {
        source: "iana"
    },
    "application/vnd.collabio.xodocuments.presentation": {
        source: "iana"
    },
    "application/vnd.collabio.xodocuments.presentation-template": {
        source: "iana"
    },
    "application/vnd.collabio.xodocuments.spreadsheet": {
        source: "iana"
    },
    "application/vnd.collabio.xodocuments.spreadsheet-template": {
        source: "iana"
    },
    "application/vnd.collection+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.collection.doc+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.collection.next+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.comicbook+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.comicbook-rar": {
        source: "iana"
    },
    "application/vnd.commerce-battelle": {
        source: "iana"
    },
    "application/vnd.commonspace": {
        source: "iana",
        extensions: [
            "csp"
        ]
    },
    "application/vnd.contact.cmsg": {
        source: "iana",
        extensions: [
            "cdbcmsg"
        ]
    },
    "application/vnd.coreos.ignition+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.cosmocaller": {
        source: "iana",
        extensions: [
            "cmc"
        ]
    },
    "application/vnd.crick.clicker": {
        source: "iana",
        extensions: [
            "clkx"
        ]
    },
    "application/vnd.crick.clicker.keyboard": {
        source: "iana",
        extensions: [
            "clkk"
        ]
    },
    "application/vnd.crick.clicker.palette": {
        source: "iana",
        extensions: [
            "clkp"
        ]
    },
    "application/vnd.crick.clicker.template": {
        source: "iana",
        extensions: [
            "clkt"
        ]
    },
    "application/vnd.crick.clicker.wordbank": {
        source: "iana",
        extensions: [
            "clkw"
        ]
    },
    "application/vnd.criticaltools.wbs+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "wbs"
        ]
    },
    "application/vnd.cryptii.pipe+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.crypto-shade-file": {
        source: "iana"
    },
    "application/vnd.ctc-posml": {
        source: "iana",
        extensions: [
            "pml"
        ]
    },
    "application/vnd.ctct.ws+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.cups-pdf": {
        source: "iana"
    },
    "application/vnd.cups-postscript": {
        source: "iana"
    },
    "application/vnd.cups-ppd": {
        source: "iana",
        extensions: [
            "ppd"
        ]
    },
    "application/vnd.cups-raster": {
        source: "iana"
    },
    "application/vnd.cups-raw": {
        source: "iana"
    },
    "application/vnd.curl": {
        source: "iana"
    },
    "application/vnd.curl.car": {
        source: "apache",
        extensions: [
            "car"
        ]
    },
    "application/vnd.curl.pcurl": {
        source: "apache",
        extensions: [
            "pcurl"
        ]
    },
    "application/vnd.cyan.dean.root+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.cybank": {
        source: "iana"
    },
    "application/vnd.d2l.coursepackage1p0+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.dart": {
        source: "iana",
        compressible: true,
        extensions: [
            "dart"
        ]
    },
    "application/vnd.data-vision.rdz": {
        source: "iana",
        extensions: [
            "rdz"
        ]
    },
    "application/vnd.datapackage+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dataresource+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dbf": {
        source: "iana"
    },
    "application/vnd.debian.binary-package": {
        source: "iana"
    },
    "application/vnd.dece.data": {
        source: "iana",
        extensions: [
            "uvf",
            "uvvf",
            "uvd",
            "uvvd"
        ]
    },
    "application/vnd.dece.ttml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "uvt",
            "uvvt"
        ]
    },
    "application/vnd.dece.unspecified": {
        source: "iana",
        extensions: [
            "uvx",
            "uvvx"
        ]
    },
    "application/vnd.dece.zip": {
        source: "iana",
        extensions: [
            "uvz",
            "uvvz"
        ]
    },
    "application/vnd.denovo.fcselayout-link": {
        source: "iana",
        extensions: [
            "fe_launch"
        ]
    },
    "application/vnd.desmume.movie": {
        source: "iana"
    },
    "application/vnd.dir-bi.plate-dl-nosuffix": {
        source: "iana"
    },
    "application/vnd.dm.delegation+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dna": {
        source: "iana",
        extensions: [
            "dna"
        ]
    },
    "application/vnd.document+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dolby.mlp": {
        source: "apache",
        extensions: [
            "mlp"
        ]
    },
    "application/vnd.dolby.mobile.1": {
        source: "iana"
    },
    "application/vnd.dolby.mobile.2": {
        source: "iana"
    },
    "application/vnd.doremir.scorecloud-binary-document": {
        source: "iana"
    },
    "application/vnd.dpgraph": {
        source: "iana",
        extensions: [
            "dpg"
        ]
    },
    "application/vnd.dreamfactory": {
        source: "iana",
        extensions: [
            "dfac"
        ]
    },
    "application/vnd.drive+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ds-keypoint": {
        source: "apache",
        extensions: [
            "kpxx"
        ]
    },
    "application/vnd.dtg.local": {
        source: "iana"
    },
    "application/vnd.dtg.local.flash": {
        source: "iana"
    },
    "application/vnd.dtg.local.html": {
        source: "iana"
    },
    "application/vnd.dvb.ait": {
        source: "iana",
        extensions: [
            "ait"
        ]
    },
    "application/vnd.dvb.dvbisl+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.dvbj": {
        source: "iana"
    },
    "application/vnd.dvb.esgcontainer": {
        source: "iana"
    },
    "application/vnd.dvb.ipdcdftnotifaccess": {
        source: "iana"
    },
    "application/vnd.dvb.ipdcesgaccess": {
        source: "iana"
    },
    "application/vnd.dvb.ipdcesgaccess2": {
        source: "iana"
    },
    "application/vnd.dvb.ipdcesgpdd": {
        source: "iana"
    },
    "application/vnd.dvb.ipdcroaming": {
        source: "iana"
    },
    "application/vnd.dvb.iptv.alfec-base": {
        source: "iana"
    },
    "application/vnd.dvb.iptv.alfec-enhancement": {
        source: "iana"
    },
    "application/vnd.dvb.notif-aggregate-root+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.notif-container+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.notif-generic+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.notif-ia-msglist+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.notif-ia-registration-request+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.notif-ia-registration-response+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.notif-init+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.dvb.pfr": {
        source: "iana"
    },
    "application/vnd.dvb.service": {
        source: "iana",
        extensions: [
            "svc"
        ]
    },
    "application/vnd.dxr": {
        source: "iana"
    },
    "application/vnd.dynageo": {
        source: "iana",
        extensions: [
            "geo"
        ]
    },
    "application/vnd.dzr": {
        source: "iana"
    },
    "application/vnd.easykaraoke.cdgdownload": {
        source: "iana"
    },
    "application/vnd.ecdis-update": {
        source: "iana"
    },
    "application/vnd.ecip.rlp": {
        source: "iana"
    },
    "application/vnd.ecowin.chart": {
        source: "iana",
        extensions: [
            "mag"
        ]
    },
    "application/vnd.ecowin.filerequest": {
        source: "iana"
    },
    "application/vnd.ecowin.fileupdate": {
        source: "iana"
    },
    "application/vnd.ecowin.series": {
        source: "iana"
    },
    "application/vnd.ecowin.seriesrequest": {
        source: "iana"
    },
    "application/vnd.ecowin.seriesupdate": {
        source: "iana"
    },
    "application/vnd.efi.img": {
        source: "iana"
    },
    "application/vnd.efi.iso": {
        source: "iana"
    },
    "application/vnd.emclient.accessrequest+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.enliven": {
        source: "iana",
        extensions: [
            "nml"
        ]
    },
    "application/vnd.enphase.envoy": {
        source: "iana"
    },
    "application/vnd.eprints.data+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.epson.esf": {
        source: "iana",
        extensions: [
            "esf"
        ]
    },
    "application/vnd.epson.msf": {
        source: "iana",
        extensions: [
            "msf"
        ]
    },
    "application/vnd.epson.quickanime": {
        source: "iana",
        extensions: [
            "qam"
        ]
    },
    "application/vnd.epson.salt": {
        source: "iana",
        extensions: [
            "slt"
        ]
    },
    "application/vnd.epson.ssf": {
        source: "iana",
        extensions: [
            "ssf"
        ]
    },
    "application/vnd.ericsson.quickcall": {
        source: "iana"
    },
    "application/vnd.espass-espass+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.eszigno3+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "es3",
            "et3"
        ]
    },
    "application/vnd.etsi.aoc+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.asic-e+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.etsi.asic-s+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.etsi.cug+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvcommand+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvdiscovery+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvprofile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvsad-bc+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvsad-cod+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvsad-npvr+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvservice+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvsync+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.iptvueprofile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.mcid+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.mheg5": {
        source: "iana"
    },
    "application/vnd.etsi.overload-control-policy-dataset+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.pstn+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.sci+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.simservs+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.timestamp-token": {
        source: "iana"
    },
    "application/vnd.etsi.tsl+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.etsi.tsl.der": {
        source: "iana"
    },
    "application/vnd.eudora.data": {
        source: "iana"
    },
    "application/vnd.evolv.ecig.profile": {
        source: "iana"
    },
    "application/vnd.evolv.ecig.settings": {
        source: "iana"
    },
    "application/vnd.evolv.ecig.theme": {
        source: "iana"
    },
    "application/vnd.exstream-empower+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.exstream-package": {
        source: "iana"
    },
    "application/vnd.ezpix-album": {
        source: "iana",
        extensions: [
            "ez2"
        ]
    },
    "application/vnd.ezpix-package": {
        source: "iana",
        extensions: [
            "ez3"
        ]
    },
    "application/vnd.f-secure.mobile": {
        source: "iana"
    },
    "application/vnd.fastcopy-disk-image": {
        source: "iana"
    },
    "application/vnd.fdf": {
        source: "iana",
        extensions: [
            "fdf"
        ]
    },
    "application/vnd.fdsn.mseed": {
        source: "iana",
        extensions: [
            "mseed"
        ]
    },
    "application/vnd.fdsn.seed": {
        source: "iana",
        extensions: [
            "seed",
            "dataless"
        ]
    },
    "application/vnd.ffsns": {
        source: "iana"
    },
    "application/vnd.ficlab.flb+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.filmit.zfc": {
        source: "iana"
    },
    "application/vnd.fints": {
        source: "iana"
    },
    "application/vnd.firemonkeys.cloudcell": {
        source: "iana"
    },
    "application/vnd.flographit": {
        source: "iana",
        extensions: [
            "gph"
        ]
    },
    "application/vnd.fluxtime.clip": {
        source: "iana",
        extensions: [
            "ftc"
        ]
    },
    "application/vnd.font-fontforge-sfd": {
        source: "iana"
    },
    "application/vnd.framemaker": {
        source: "iana",
        extensions: [
            "fm",
            "frame",
            "maker",
            "book"
        ]
    },
    "application/vnd.frogans.fnc": {
        source: "iana",
        extensions: [
            "fnc"
        ]
    },
    "application/vnd.frogans.ltf": {
        source: "iana",
        extensions: [
            "ltf"
        ]
    },
    "application/vnd.fsc.weblaunch": {
        source: "iana",
        extensions: [
            "fsc"
        ]
    },
    "application/vnd.fujitsu.oasys": {
        source: "iana",
        extensions: [
            "oas"
        ]
    },
    "application/vnd.fujitsu.oasys2": {
        source: "iana",
        extensions: [
            "oa2"
        ]
    },
    "application/vnd.fujitsu.oasys3": {
        source: "iana",
        extensions: [
            "oa3"
        ]
    },
    "application/vnd.fujitsu.oasysgp": {
        source: "iana",
        extensions: [
            "fg5"
        ]
    },
    "application/vnd.fujitsu.oasysprs": {
        source: "iana",
        extensions: [
            "bh2"
        ]
    },
    "application/vnd.fujixerox.art-ex": {
        source: "iana"
    },
    "application/vnd.fujixerox.art4": {
        source: "iana"
    },
    "application/vnd.fujixerox.ddd": {
        source: "iana",
        extensions: [
            "ddd"
        ]
    },
    "application/vnd.fujixerox.docuworks": {
        source: "iana",
        extensions: [
            "xdw"
        ]
    },
    "application/vnd.fujixerox.docuworks.binder": {
        source: "iana",
        extensions: [
            "xbd"
        ]
    },
    "application/vnd.fujixerox.docuworks.container": {
        source: "iana"
    },
    "application/vnd.fujixerox.hbpl": {
        source: "iana"
    },
    "application/vnd.fut-misnet": {
        source: "iana"
    },
    "application/vnd.futoin+cbor": {
        source: "iana"
    },
    "application/vnd.futoin+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.fuzzysheet": {
        source: "iana",
        extensions: [
            "fzs"
        ]
    },
    "application/vnd.genomatix.tuxedo": {
        source: "iana",
        extensions: [
            "txd"
        ]
    },
    "application/vnd.gentics.grd+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.geo+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.geocube+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.geogebra.file": {
        source: "iana",
        extensions: [
            "ggb"
        ]
    },
    "application/vnd.geogebra.tool": {
        source: "iana",
        extensions: [
            "ggt"
        ]
    },
    "application/vnd.geometry-explorer": {
        source: "iana",
        extensions: [
            "gex",
            "gre"
        ]
    },
    "application/vnd.geonext": {
        source: "iana",
        extensions: [
            "gxt"
        ]
    },
    "application/vnd.geoplan": {
        source: "iana",
        extensions: [
            "g2w"
        ]
    },
    "application/vnd.geospace": {
        source: "iana",
        extensions: [
            "g3w"
        ]
    },
    "application/vnd.gerber": {
        source: "iana"
    },
    "application/vnd.globalplatform.card-content-mgt": {
        source: "iana"
    },
    "application/vnd.globalplatform.card-content-mgt-response": {
        source: "iana"
    },
    "application/vnd.gmx": {
        source: "iana",
        extensions: [
            "gmx"
        ]
    },
    "application/vnd.google-apps.document": {
        compressible: false,
        extensions: [
            "gdoc"
        ]
    },
    "application/vnd.google-apps.presentation": {
        compressible: false,
        extensions: [
            "gslides"
        ]
    },
    "application/vnd.google-apps.spreadsheet": {
        compressible: false,
        extensions: [
            "gsheet"
        ]
    },
    "application/vnd.google-earth.kml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "kml"
        ]
    },
    "application/vnd.google-earth.kmz": {
        source: "iana",
        compressible: false,
        extensions: [
            "kmz"
        ]
    },
    "application/vnd.gov.sk.e-form+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.gov.sk.e-form+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.gov.sk.xmldatacontainer+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.grafeq": {
        source: "iana",
        extensions: [
            "gqf",
            "gqs"
        ]
    },
    "application/vnd.gridmp": {
        source: "iana"
    },
    "application/vnd.groove-account": {
        source: "iana",
        extensions: [
            "gac"
        ]
    },
    "application/vnd.groove-help": {
        source: "iana",
        extensions: [
            "ghf"
        ]
    },
    "application/vnd.groove-identity-message": {
        source: "iana",
        extensions: [
            "gim"
        ]
    },
    "application/vnd.groove-injector": {
        source: "iana",
        extensions: [
            "grv"
        ]
    },
    "application/vnd.groove-tool-message": {
        source: "iana",
        extensions: [
            "gtm"
        ]
    },
    "application/vnd.groove-tool-template": {
        source: "iana",
        extensions: [
            "tpl"
        ]
    },
    "application/vnd.groove-vcard": {
        source: "iana",
        extensions: [
            "vcg"
        ]
    },
    "application/vnd.hal+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.hal+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "hal"
        ]
    },
    "application/vnd.handheld-entertainment+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "zmm"
        ]
    },
    "application/vnd.hbci": {
        source: "iana",
        extensions: [
            "hbci"
        ]
    },
    "application/vnd.hc+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.hcl-bireports": {
        source: "iana"
    },
    "application/vnd.hdt": {
        source: "iana"
    },
    "application/vnd.heroku+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.hhe.lesson-player": {
        source: "iana",
        extensions: [
            "les"
        ]
    },
    "application/vnd.hp-hpgl": {
        source: "iana",
        extensions: [
            "hpgl"
        ]
    },
    "application/vnd.hp-hpid": {
        source: "iana",
        extensions: [
            "hpid"
        ]
    },
    "application/vnd.hp-hps": {
        source: "iana",
        extensions: [
            "hps"
        ]
    },
    "application/vnd.hp-jlyt": {
        source: "iana",
        extensions: [
            "jlt"
        ]
    },
    "application/vnd.hp-pcl": {
        source: "iana",
        extensions: [
            "pcl"
        ]
    },
    "application/vnd.hp-pclxl": {
        source: "iana",
        extensions: [
            "pclxl"
        ]
    },
    "application/vnd.httphone": {
        source: "iana"
    },
    "application/vnd.hydrostatix.sof-data": {
        source: "iana",
        extensions: [
            "sfd-hdstx"
        ]
    },
    "application/vnd.hyper+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.hyper-item+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.hyperdrive+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.hzn-3d-crossword": {
        source: "iana"
    },
    "application/vnd.ibm.afplinedata": {
        source: "iana"
    },
    "application/vnd.ibm.electronic-media": {
        source: "iana"
    },
    "application/vnd.ibm.minipay": {
        source: "iana",
        extensions: [
            "mpy"
        ]
    },
    "application/vnd.ibm.modcap": {
        source: "iana",
        extensions: [
            "afp",
            "listafp",
            "list3820"
        ]
    },
    "application/vnd.ibm.rights-management": {
        source: "iana",
        extensions: [
            "irm"
        ]
    },
    "application/vnd.ibm.secure-container": {
        source: "iana",
        extensions: [
            "sc"
        ]
    },
    "application/vnd.iccprofile": {
        source: "iana",
        extensions: [
            "icc",
            "icm"
        ]
    },
    "application/vnd.ieee.1905": {
        source: "iana"
    },
    "application/vnd.igloader": {
        source: "iana",
        extensions: [
            "igl"
        ]
    },
    "application/vnd.imagemeter.folder+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.imagemeter.image+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.immervision-ivp": {
        source: "iana",
        extensions: [
            "ivp"
        ]
    },
    "application/vnd.immervision-ivu": {
        source: "iana",
        extensions: [
            "ivu"
        ]
    },
    "application/vnd.ims.imsccv1p1": {
        source: "iana"
    },
    "application/vnd.ims.imsccv1p2": {
        source: "iana"
    },
    "application/vnd.ims.imsccv1p3": {
        source: "iana"
    },
    "application/vnd.ims.lis.v2.result+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ims.lti.v2.toolconsumerprofile+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ims.lti.v2.toolproxy+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ims.lti.v2.toolproxy.id+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ims.lti.v2.toolsettings+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ims.lti.v2.toolsettings.simple+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.informedcontrol.rms+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.informix-visionary": {
        source: "iana"
    },
    "application/vnd.infotech.project": {
        source: "iana"
    },
    "application/vnd.infotech.project+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.innopath.wamp.notification": {
        source: "iana"
    },
    "application/vnd.insors.igm": {
        source: "iana",
        extensions: [
            "igm"
        ]
    },
    "application/vnd.intercon.formnet": {
        source: "iana",
        extensions: [
            "xpw",
            "xpx"
        ]
    },
    "application/vnd.intergeo": {
        source: "iana",
        extensions: [
            "i2g"
        ]
    },
    "application/vnd.intertrust.digibox": {
        source: "iana"
    },
    "application/vnd.intertrust.nncp": {
        source: "iana"
    },
    "application/vnd.intu.qbo": {
        source: "iana",
        extensions: [
            "qbo"
        ]
    },
    "application/vnd.intu.qfx": {
        source: "iana",
        extensions: [
            "qfx"
        ]
    },
    "application/vnd.iptc.g2.catalogitem+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.iptc.g2.conceptitem+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.iptc.g2.knowledgeitem+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.iptc.g2.newsitem+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.iptc.g2.newsmessage+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.iptc.g2.packageitem+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.iptc.g2.planningitem+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ipunplugged.rcprofile": {
        source: "iana",
        extensions: [
            "rcprofile"
        ]
    },
    "application/vnd.irepository.package+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "irp"
        ]
    },
    "application/vnd.is-xpr": {
        source: "iana",
        extensions: [
            "xpr"
        ]
    },
    "application/vnd.isac.fcs": {
        source: "iana",
        extensions: [
            "fcs"
        ]
    },
    "application/vnd.iso11783-10+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.jam": {
        source: "iana",
        extensions: [
            "jam"
        ]
    },
    "application/vnd.japannet-directory-service": {
        source: "iana"
    },
    "application/vnd.japannet-jpnstore-wakeup": {
        source: "iana"
    },
    "application/vnd.japannet-payment-wakeup": {
        source: "iana"
    },
    "application/vnd.japannet-registration": {
        source: "iana"
    },
    "application/vnd.japannet-registration-wakeup": {
        source: "iana"
    },
    "application/vnd.japannet-setstore-wakeup": {
        source: "iana"
    },
    "application/vnd.japannet-verification": {
        source: "iana"
    },
    "application/vnd.japannet-verification-wakeup": {
        source: "iana"
    },
    "application/vnd.jcp.javame.midlet-rms": {
        source: "iana",
        extensions: [
            "rms"
        ]
    },
    "application/vnd.jisp": {
        source: "iana",
        extensions: [
            "jisp"
        ]
    },
    "application/vnd.joost.joda-archive": {
        source: "iana",
        extensions: [
            "joda"
        ]
    },
    "application/vnd.jsk.isdn-ngn": {
        source: "iana"
    },
    "application/vnd.kahootz": {
        source: "iana",
        extensions: [
            "ktz",
            "ktr"
        ]
    },
    "application/vnd.kde.karbon": {
        source: "iana",
        extensions: [
            "karbon"
        ]
    },
    "application/vnd.kde.kchart": {
        source: "iana",
        extensions: [
            "chrt"
        ]
    },
    "application/vnd.kde.kformula": {
        source: "iana",
        extensions: [
            "kfo"
        ]
    },
    "application/vnd.kde.kivio": {
        source: "iana",
        extensions: [
            "flw"
        ]
    },
    "application/vnd.kde.kontour": {
        source: "iana",
        extensions: [
            "kon"
        ]
    },
    "application/vnd.kde.kpresenter": {
        source: "iana",
        extensions: [
            "kpr",
            "kpt"
        ]
    },
    "application/vnd.kde.kspread": {
        source: "iana",
        extensions: [
            "ksp"
        ]
    },
    "application/vnd.kde.kword": {
        source: "iana",
        extensions: [
            "kwd",
            "kwt"
        ]
    },
    "application/vnd.kenameaapp": {
        source: "iana",
        extensions: [
            "htke"
        ]
    },
    "application/vnd.kidspiration": {
        source: "iana",
        extensions: [
            "kia"
        ]
    },
    "application/vnd.kinar": {
        source: "iana",
        extensions: [
            "kne",
            "knp"
        ]
    },
    "application/vnd.koan": {
        source: "iana",
        extensions: [
            "skp",
            "skd",
            "skt",
            "skm"
        ]
    },
    "application/vnd.kodak-descriptor": {
        source: "iana",
        extensions: [
            "sse"
        ]
    },
    "application/vnd.las": {
        source: "iana"
    },
    "application/vnd.las.las+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.las.las+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "lasxml"
        ]
    },
    "application/vnd.laszip": {
        source: "iana"
    },
    "application/vnd.leap+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.liberty-request+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.llamagraphics.life-balance.desktop": {
        source: "iana",
        extensions: [
            "lbd"
        ]
    },
    "application/vnd.llamagraphics.life-balance.exchange+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "lbe"
        ]
    },
    "application/vnd.logipipe.circuit+zip": {
        source: "iana",
        compressible: false
    },
    "application/vnd.loom": {
        source: "iana"
    },
    "application/vnd.lotus-1-2-3": {
        source: "iana",
        extensions: [
            "123"
        ]
    },
    "application/vnd.lotus-approach": {
        source: "iana",
        extensions: [
            "apr"
        ]
    },
    "application/vnd.lotus-freelance": {
        source: "iana",
        extensions: [
            "pre"
        ]
    },
    "application/vnd.lotus-notes": {
        source: "iana",
        extensions: [
            "nsf"
        ]
    },
    "application/vnd.lotus-organizer": {
        source: "iana",
        extensions: [
            "org"
        ]
    },
    "application/vnd.lotus-screencam": {
        source: "iana",
        extensions: [
            "scm"
        ]
    },
    "application/vnd.lotus-wordpro": {
        source: "iana",
        extensions: [
            "lwp"
        ]
    },
    "application/vnd.macports.portpkg": {
        source: "iana",
        extensions: [
            "portpkg"
        ]
    },
    "application/vnd.mapbox-vector-tile": {
        source: "iana"
    },
    "application/vnd.marlin.drm.actiontoken+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.marlin.drm.conftoken+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.marlin.drm.license+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.marlin.drm.mdcf": {
        source: "iana"
    },
    "application/vnd.mason+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.maxmind.maxmind-db": {
        source: "iana"
    },
    "application/vnd.mcd": {
        source: "iana",
        extensions: [
            "mcd"
        ]
    },
    "application/vnd.medcalcdata": {
        source: "iana",
        extensions: [
            "mc1"
        ]
    },
    "application/vnd.mediastation.cdkey": {
        source: "iana",
        extensions: [
            "cdkey"
        ]
    },
    "application/vnd.meridian-slingshot": {
        source: "iana"
    },
    "application/vnd.mfer": {
        source: "iana",
        extensions: [
            "mwf"
        ]
    },
    "application/vnd.mfmp": {
        source: "iana",
        extensions: [
            "mfm"
        ]
    },
    "application/vnd.micro+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.micrografx.flo": {
        source: "iana",
        extensions: [
            "flo"
        ]
    },
    "application/vnd.micrografx.igx": {
        source: "iana",
        extensions: [
            "igx"
        ]
    },
    "application/vnd.microsoft.portable-executable": {
        source: "iana"
    },
    "application/vnd.microsoft.windows.thumbnail-cache": {
        source: "iana"
    },
    "application/vnd.miele+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.mif": {
        source: "iana",
        extensions: [
            "mif"
        ]
    },
    "application/vnd.minisoft-hp3000-save": {
        source: "iana"
    },
    "application/vnd.mitsubishi.misty-guard.trustweb": {
        source: "iana"
    },
    "application/vnd.mobius.daf": {
        source: "iana",
        extensions: [
            "daf"
        ]
    },
    "application/vnd.mobius.dis": {
        source: "iana",
        extensions: [
            "dis"
        ]
    },
    "application/vnd.mobius.mbk": {
        source: "iana",
        extensions: [
            "mbk"
        ]
    },
    "application/vnd.mobius.mqy": {
        source: "iana",
        extensions: [
            "mqy"
        ]
    },
    "application/vnd.mobius.msl": {
        source: "iana",
        extensions: [
            "msl"
        ]
    },
    "application/vnd.mobius.plc": {
        source: "iana",
        extensions: [
            "plc"
        ]
    },
    "application/vnd.mobius.txf": {
        source: "iana",
        extensions: [
            "txf"
        ]
    },
    "application/vnd.mophun.application": {
        source: "iana",
        extensions: [
            "mpn"
        ]
    },
    "application/vnd.mophun.certificate": {
        source: "iana",
        extensions: [
            "mpc"
        ]
    },
    "application/vnd.motorola.flexsuite": {
        source: "iana"
    },
    "application/vnd.motorola.flexsuite.adsi": {
        source: "iana"
    },
    "application/vnd.motorola.flexsuite.fis": {
        source: "iana"
    },
    "application/vnd.motorola.flexsuite.gotap": {
        source: "iana"
    },
    "application/vnd.motorola.flexsuite.kmr": {
        source: "iana"
    },
    "application/vnd.motorola.flexsuite.ttc": {
        source: "iana"
    },
    "application/vnd.motorola.flexsuite.wem": {
        source: "iana"
    },
    "application/vnd.motorola.iprm": {
        source: "iana"
    },
    "application/vnd.mozilla.xul+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xul"
        ]
    },
    "application/vnd.ms-3mfdocument": {
        source: "iana"
    },
    "application/vnd.ms-artgalry": {
        source: "iana",
        extensions: [
            "cil"
        ]
    },
    "application/vnd.ms-asf": {
        source: "iana"
    },
    "application/vnd.ms-cab-compressed": {
        source: "iana",
        extensions: [
            "cab"
        ]
    },
    "application/vnd.ms-color.iccprofile": {
        source: "apache"
    },
    "application/vnd.ms-excel": {
        source: "iana",
        compressible: false,
        extensions: [
            "xls",
            "xlm",
            "xla",
            "xlc",
            "xlt",
            "xlw"
        ]
    },
    "application/vnd.ms-excel.addin.macroenabled.12": {
        source: "iana",
        extensions: [
            "xlam"
        ]
    },
    "application/vnd.ms-excel.sheet.binary.macroenabled.12": {
        source: "iana",
        extensions: [
            "xlsb"
        ]
    },
    "application/vnd.ms-excel.sheet.macroenabled.12": {
        source: "iana",
        extensions: [
            "xlsm"
        ]
    },
    "application/vnd.ms-excel.template.macroenabled.12": {
        source: "iana",
        extensions: [
            "xltm"
        ]
    },
    "application/vnd.ms-fontobject": {
        source: "iana",
        compressible: true,
        extensions: [
            "eot"
        ]
    },
    "application/vnd.ms-htmlhelp": {
        source: "iana",
        extensions: [
            "chm"
        ]
    },
    "application/vnd.ms-ims": {
        source: "iana",
        extensions: [
            "ims"
        ]
    },
    "application/vnd.ms-lrm": {
        source: "iana",
        extensions: [
            "lrm"
        ]
    },
    "application/vnd.ms-office.activex+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ms-officetheme": {
        source: "iana",
        extensions: [
            "thmx"
        ]
    },
    "application/vnd.ms-opentype": {
        source: "apache",
        compressible: true
    },
    "application/vnd.ms-outlook": {
        compressible: false,
        extensions: [
            "msg"
        ]
    },
    "application/vnd.ms-package.obfuscated-opentype": {
        source: "apache"
    },
    "application/vnd.ms-pki.seccat": {
        source: "apache",
        extensions: [
            "cat"
        ]
    },
    "application/vnd.ms-pki.stl": {
        source: "apache",
        extensions: [
            "stl"
        ]
    },
    "application/vnd.ms-playready.initiator+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ms-powerpoint": {
        source: "iana",
        compressible: false,
        extensions: [
            "ppt",
            "pps",
            "pot"
        ]
    },
    "application/vnd.ms-powerpoint.addin.macroenabled.12": {
        source: "iana",
        extensions: [
            "ppam"
        ]
    },
    "application/vnd.ms-powerpoint.presentation.macroenabled.12": {
        source: "iana",
        extensions: [
            "pptm"
        ]
    },
    "application/vnd.ms-powerpoint.slide.macroenabled.12": {
        source: "iana",
        extensions: [
            "sldm"
        ]
    },
    "application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
        source: "iana",
        extensions: [
            "ppsm"
        ]
    },
    "application/vnd.ms-powerpoint.template.macroenabled.12": {
        source: "iana",
        extensions: [
            "potm"
        ]
    },
    "application/vnd.ms-printdevicecapabilities+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ms-printing.printticket+xml": {
        source: "apache",
        compressible: true
    },
    "application/vnd.ms-printschematicket+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.ms-project": {
        source: "iana",
        extensions: [
            "mpp",
            "mpt"
        ]
    },
    "application/vnd.ms-tnef": {
        source: "iana"
    },
    "application/vnd.ms-windows.devicepairing": {
        source: "iana"
    },
    "application/vnd.ms-windows.nwprinting.oob": {
        source: "iana"
    },
    "application/vnd.ms-windows.printerpairing": {
        source: "iana"
    },
    "application/vnd.ms-windows.wsd.oob": {
        source: "iana"
    },
    "application/vnd.ms-wmdrm.lic-chlg-req": {
        source: "iana"
    },
    "application/vnd.ms-wmdrm.lic-resp": {
        source: "iana"
    },
    "application/vnd.ms-wmdrm.meter-chlg-req": {
        source: "iana"
    },
    "application/vnd.ms-wmdrm.meter-resp": {
        source: "iana"
    },
    "application/vnd.ms-word.document.macroenabled.12": {
        source: "iana",
        extensions: [
            "docm"
        ]
    },
    "application/vnd.ms-word.template.macroenabled.12": {
        source: "iana",
        extensions: [
            "dotm"
        ]
    },
    "application/vnd.ms-works": {
        source: "iana",
        extensions: [
            "wps",
            "wks",
            "wcm",
            "wdb"
        ]
    },
    "application/vnd.ms-wpl": {
        source: "iana",
        extensions: [
            "wpl"
        ]
    },
    "application/vnd.ms-xpsdocument": {
        source: "iana",
        compressible: false,
        extensions: [
            "xps"
        ]
    },
    "application/vnd.msa-disk-image": {
        source: "iana"
    },
    "application/vnd.mseq": {
        source: "iana",
        extensions: [
            "mseq"
        ]
    },
    "application/vnd.msign": {
        source: "iana"
    },
    "application/vnd.multiad.creator": {
        source: "iana"
    },
    "application/vnd.multiad.creator.cif": {
        source: "iana"
    },
    "application/vnd.music-niff": {
        source: "iana"
    },
    "application/vnd.musician": {
        source: "iana",
        extensions: [
            "mus"
        ]
    },
    "application/vnd.muvee.style": {
        source: "iana",
        extensions: [
            "msty"
        ]
    },
    "application/vnd.mynfc": {
        source: "iana",
        extensions: [
            "taglet"
        ]
    },
    "application/vnd.ncd.control": {
        source: "iana"
    },
    "application/vnd.ncd.reference": {
        source: "iana"
    },
    "application/vnd.nearst.inv+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.nervana": {
        source: "iana"
    },
    "application/vnd.netfpx": {
        source: "iana"
    },
    "application/vnd.neurolanguage.nlu": {
        source: "iana",
        extensions: [
            "nlu"
        ]
    },
    "application/vnd.nimn": {
        source: "iana"
    },
    "application/vnd.nintendo.nitro.rom": {
        source: "iana"
    },
    "application/vnd.nintendo.snes.rom": {
        source: "iana"
    },
    "application/vnd.nitf": {
        source: "iana",
        extensions: [
            "ntf",
            "nitf"
        ]
    },
    "application/vnd.noblenet-directory": {
        source: "iana",
        extensions: [
            "nnd"
        ]
    },
    "application/vnd.noblenet-sealer": {
        source: "iana",
        extensions: [
            "nns"
        ]
    },
    "application/vnd.noblenet-web": {
        source: "iana",
        extensions: [
            "nnw"
        ]
    },
    "application/vnd.nokia.catalogs": {
        source: "iana"
    },
    "application/vnd.nokia.conml+wbxml": {
        source: "iana"
    },
    "application/vnd.nokia.conml+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.nokia.iptv.config+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.nokia.isds-radio-presets": {
        source: "iana"
    },
    "application/vnd.nokia.landmark+wbxml": {
        source: "iana"
    },
    "application/vnd.nokia.landmark+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.nokia.landmarkcollection+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.nokia.n-gage.ac+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "ac"
        ]
    },
    "application/vnd.nokia.n-gage.data": {
        source: "iana",
        extensions: [
            "ngdat"
        ]
    },
    "application/vnd.nokia.n-gage.symbian.install": {
        source: "iana",
        extensions: [
            "n-gage"
        ]
    },
    "application/vnd.nokia.ncd": {
        source: "iana"
    },
    "application/vnd.nokia.pcd+wbxml": {
        source: "iana"
    },
    "application/vnd.nokia.pcd+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.nokia.radio-preset": {
        source: "iana",
        extensions: [
            "rpst"
        ]
    },
    "application/vnd.nokia.radio-presets": {
        source: "iana",
        extensions: [
            "rpss"
        ]
    },
    "application/vnd.novadigm.edm": {
        source: "iana",
        extensions: [
            "edm"
        ]
    },
    "application/vnd.novadigm.edx": {
        source: "iana",
        extensions: [
            "edx"
        ]
    },
    "application/vnd.novadigm.ext": {
        source: "iana",
        extensions: [
            "ext"
        ]
    },
    "application/vnd.ntt-local.content-share": {
        source: "iana"
    },
    "application/vnd.ntt-local.file-transfer": {
        source: "iana"
    },
    "application/vnd.ntt-local.ogw_remote-access": {
        source: "iana"
    },
    "application/vnd.ntt-local.sip-ta_remote": {
        source: "iana"
    },
    "application/vnd.ntt-local.sip-ta_tcp_stream": {
        source: "iana"
    },
    "application/vnd.oasis.opendocument.chart": {
        source: "iana",
        extensions: [
            "odc"
        ]
    },
    "application/vnd.oasis.opendocument.chart-template": {
        source: "iana",
        extensions: [
            "otc"
        ]
    },
    "application/vnd.oasis.opendocument.database": {
        source: "iana",
        extensions: [
            "odb"
        ]
    },
    "application/vnd.oasis.opendocument.formula": {
        source: "iana",
        extensions: [
            "odf"
        ]
    },
    "application/vnd.oasis.opendocument.formula-template": {
        source: "iana",
        extensions: [
            "odft"
        ]
    },
    "application/vnd.oasis.opendocument.graphics": {
        source: "iana",
        compressible: false,
        extensions: [
            "odg"
        ]
    },
    "application/vnd.oasis.opendocument.graphics-template": {
        source: "iana",
        extensions: [
            "otg"
        ]
    },
    "application/vnd.oasis.opendocument.image": {
        source: "iana",
        extensions: [
            "odi"
        ]
    },
    "application/vnd.oasis.opendocument.image-template": {
        source: "iana",
        extensions: [
            "oti"
        ]
    },
    "application/vnd.oasis.opendocument.presentation": {
        source: "iana",
        compressible: false,
        extensions: [
            "odp"
        ]
    },
    "application/vnd.oasis.opendocument.presentation-template": {
        source: "iana",
        extensions: [
            "otp"
        ]
    },
    "application/vnd.oasis.opendocument.spreadsheet": {
        source: "iana",
        compressible: false,
        extensions: [
            "ods"
        ]
    },
    "application/vnd.oasis.opendocument.spreadsheet-template": {
        source: "iana",
        extensions: [
            "ots"
        ]
    },
    "application/vnd.oasis.opendocument.text": {
        source: "iana",
        compressible: false,
        extensions: [
            "odt"
        ]
    },
    "application/vnd.oasis.opendocument.text-master": {
        source: "iana",
        extensions: [
            "odm"
        ]
    },
    "application/vnd.oasis.opendocument.text-template": {
        source: "iana",
        extensions: [
            "ott"
        ]
    },
    "application/vnd.oasis.opendocument.text-web": {
        source: "iana",
        extensions: [
            "oth"
        ]
    },
    "application/vnd.obn": {
        source: "iana"
    },
    "application/vnd.ocf+cbor": {
        source: "iana"
    },
    "application/vnd.oci.image.manifest.v1+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oftn.l10n+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.contentaccessdownload+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.contentaccessstreaming+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.cspg-hexbinary": {
        source: "iana"
    },
    "application/vnd.oipf.dae.svg+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.dae.xhtml+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.mippvcontrolmessage+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.pae.gem": {
        source: "iana"
    },
    "application/vnd.oipf.spdiscovery+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.spdlist+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.ueprofile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oipf.userprofile+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.olpc-sugar": {
        source: "iana",
        extensions: [
            "xo"
        ]
    },
    "application/vnd.oma-scws-config": {
        source: "iana"
    },
    "application/vnd.oma-scws-http-request": {
        source: "iana"
    },
    "application/vnd.oma-scws-http-response": {
        source: "iana"
    },
    "application/vnd.oma.bcast.associated-procedure-parameter+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.drm-trigger+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.imd+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.ltkm": {
        source: "iana"
    },
    "application/vnd.oma.bcast.notification+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.provisioningtrigger": {
        source: "iana"
    },
    "application/vnd.oma.bcast.sgboot": {
        source: "iana"
    },
    "application/vnd.oma.bcast.sgdd+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.sgdu": {
        source: "iana"
    },
    "application/vnd.oma.bcast.simple-symbol-container": {
        source: "iana"
    },
    "application/vnd.oma.bcast.smartcard-trigger+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.sprov+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.bcast.stkm": {
        source: "iana"
    },
    "application/vnd.oma.cab-address-book+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.cab-feature-handler+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.cab-pcc+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.cab-subs-invite+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.cab-user-prefs+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.dcd": {
        source: "iana"
    },
    "application/vnd.oma.dcdc": {
        source: "iana"
    },
    "application/vnd.oma.dd2+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "dd2"
        ]
    },
    "application/vnd.oma.drm.risd+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.group-usage-list+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.lwm2m+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.lwm2m+tlv": {
        source: "iana"
    },
    "application/vnd.oma.pal+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.poc.detailed-progress-report+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.poc.final-report+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.poc.groups+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.poc.invocation-descriptor+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.poc.optimized-progress-report+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.push": {
        source: "iana"
    },
    "application/vnd.oma.scidm.messages+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oma.xcap-directory+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.omads-email+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/vnd.omads-file+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/vnd.omads-folder+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/vnd.omaloc-supl-init": {
        source: "iana"
    },
    "application/vnd.onepager": {
        source: "iana"
    },
    "application/vnd.onepagertamp": {
        source: "iana"
    },
    "application/vnd.onepagertamx": {
        source: "iana"
    },
    "application/vnd.onepagertat": {
        source: "iana"
    },
    "application/vnd.onepagertatp": {
        source: "iana"
    },
    "application/vnd.onepagertatx": {
        source: "iana"
    },
    "application/vnd.openblox.game+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "obgx"
        ]
    },
    "application/vnd.openblox.game-binary": {
        source: "iana"
    },
    "application/vnd.openeye.oeb": {
        source: "iana"
    },
    "application/vnd.openofficeorg.extension": {
        source: "apache",
        extensions: [
            "oxt"
        ]
    },
    "application/vnd.openstreetmap.data+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "osm"
        ]
    },
    "application/vnd.openxmlformats-officedocument.custom-properties+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.customxmlproperties+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawing+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.extended-properties+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.comments+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
        source: "iana",
        compressible: false,
        extensions: [
            "pptx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.presprops+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slide": {
        source: "iana",
        extensions: [
            "sldx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slide+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
        source: "iana",
        extensions: [
            "ppsx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.tags+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.template": {
        source: "iana",
        extensions: [
            "potx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
        source: "iana",
        compressible: false,
        extensions: [
            "xlsx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
        source: "iana",
        extensions: [
            "xltx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.theme+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.themeoverride+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.vmldrawing": {
        source: "iana"
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        source: "iana",
        compressible: false,
        extensions: [
            "docx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
        source: "iana",
        extensions: [
            "dotx"
        ]
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-package.core-properties+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.openxmlformats-package.relationships+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oracle.resource+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.orange.indata": {
        source: "iana"
    },
    "application/vnd.osa.netdeploy": {
        source: "iana"
    },
    "application/vnd.osgeo.mapguide.package": {
        source: "iana",
        extensions: [
            "mgp"
        ]
    },
    "application/vnd.osgi.bundle": {
        source: "iana"
    },
    "application/vnd.osgi.dp": {
        source: "iana",
        extensions: [
            "dp"
        ]
    },
    "application/vnd.osgi.subsystem": {
        source: "iana",
        extensions: [
            "esa"
        ]
    },
    "application/vnd.otps.ct-kip+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.oxli.countgraph": {
        source: "iana"
    },
    "application/vnd.pagerduty+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.palm": {
        source: "iana",
        extensions: [
            "pdb",
            "pqa",
            "oprc"
        ]
    },
    "application/vnd.panoply": {
        source: "iana"
    },
    "application/vnd.paos.xml": {
        source: "iana"
    },
    "application/vnd.patentdive": {
        source: "iana"
    },
    "application/vnd.patientecommsdoc": {
        source: "iana"
    },
    "application/vnd.pawaafile": {
        source: "iana",
        extensions: [
            "paw"
        ]
    },
    "application/vnd.pcos": {
        source: "iana"
    },
    "application/vnd.pg.format": {
        source: "iana",
        extensions: [
            "str"
        ]
    },
    "application/vnd.pg.osasli": {
        source: "iana",
        extensions: [
            "ei6"
        ]
    },
    "application/vnd.piaccess.application-licence": {
        source: "iana"
    },
    "application/vnd.picsel": {
        source: "iana",
        extensions: [
            "efif"
        ]
    },
    "application/vnd.pmi.widget": {
        source: "iana",
        extensions: [
            "wg"
        ]
    },
    "application/vnd.poc.group-advertisement+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.pocketlearn": {
        source: "iana",
        extensions: [
            "plf"
        ]
    },
    "application/vnd.powerbuilder6": {
        source: "iana",
        extensions: [
            "pbd"
        ]
    },
    "application/vnd.powerbuilder6-s": {
        source: "iana"
    },
    "application/vnd.powerbuilder7": {
        source: "iana"
    },
    "application/vnd.powerbuilder7-s": {
        source: "iana"
    },
    "application/vnd.powerbuilder75": {
        source: "iana"
    },
    "application/vnd.powerbuilder75-s": {
        source: "iana"
    },
    "application/vnd.preminet": {
        source: "iana"
    },
    "application/vnd.previewsystems.box": {
        source: "iana",
        extensions: [
            "box"
        ]
    },
    "application/vnd.proteus.magazine": {
        source: "iana",
        extensions: [
            "mgz"
        ]
    },
    "application/vnd.psfs": {
        source: "iana"
    },
    "application/vnd.publishare-delta-tree": {
        source: "iana",
        extensions: [
            "qps"
        ]
    },
    "application/vnd.pvi.ptid1": {
        source: "iana",
        extensions: [
            "ptid"
        ]
    },
    "application/vnd.pwg-multiplexed": {
        source: "iana"
    },
    "application/vnd.pwg-xhtml-print+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.qualcomm.brew-app-res": {
        source: "iana"
    },
    "application/vnd.quarantainenet": {
        source: "iana"
    },
    "application/vnd.quark.quarkxpress": {
        source: "iana",
        extensions: [
            "qxd",
            "qxt",
            "qwd",
            "qwt",
            "qxl",
            "qxb"
        ]
    },
    "application/vnd.quobject-quoxdocument": {
        source: "iana"
    },
    "application/vnd.radisys.moml+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-audit+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-audit-conf+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-audit-conn+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-audit-dialog+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-audit-stream+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-conf+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog-base+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog-fax-detect+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog-fax-sendrecv+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog-group+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog-speech+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.radisys.msml-dialog-transform+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.rainstor.data": {
        source: "iana"
    },
    "application/vnd.rapid": {
        source: "iana"
    },
    "application/vnd.rar": {
        source: "iana"
    },
    "application/vnd.realvnc.bed": {
        source: "iana",
        extensions: [
            "bed"
        ]
    },
    "application/vnd.recordare.musicxml": {
        source: "iana",
        extensions: [
            "mxl"
        ]
    },
    "application/vnd.recordare.musicxml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "musicxml"
        ]
    },
    "application/vnd.renlearn.rlprint": {
        source: "iana"
    },
    "application/vnd.restful+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.rig.cryptonote": {
        source: "iana",
        extensions: [
            "cryptonote"
        ]
    },
    "application/vnd.rim.cod": {
        source: "apache",
        extensions: [
            "cod"
        ]
    },
    "application/vnd.rn-realmedia": {
        source: "apache",
        extensions: [
            "rm"
        ]
    },
    "application/vnd.rn-realmedia-vbr": {
        source: "apache",
        extensions: [
            "rmvb"
        ]
    },
    "application/vnd.route66.link66+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "link66"
        ]
    },
    "application/vnd.rs-274x": {
        source: "iana"
    },
    "application/vnd.ruckus.download": {
        source: "iana"
    },
    "application/vnd.s3sms": {
        source: "iana"
    },
    "application/vnd.sailingtracker.track": {
        source: "iana",
        extensions: [
            "st"
        ]
    },
    "application/vnd.sar": {
        source: "iana"
    },
    "application/vnd.sbm.cid": {
        source: "iana"
    },
    "application/vnd.sbm.mid2": {
        source: "iana"
    },
    "application/vnd.scribus": {
        source: "iana"
    },
    "application/vnd.sealed.3df": {
        source: "iana"
    },
    "application/vnd.sealed.csf": {
        source: "iana"
    },
    "application/vnd.sealed.doc": {
        source: "iana"
    },
    "application/vnd.sealed.eml": {
        source: "iana"
    },
    "application/vnd.sealed.mht": {
        source: "iana"
    },
    "application/vnd.sealed.net": {
        source: "iana"
    },
    "application/vnd.sealed.ppt": {
        source: "iana"
    },
    "application/vnd.sealed.tiff": {
        source: "iana"
    },
    "application/vnd.sealed.xls": {
        source: "iana"
    },
    "application/vnd.sealedmedia.softseal.html": {
        source: "iana"
    },
    "application/vnd.sealedmedia.softseal.pdf": {
        source: "iana"
    },
    "application/vnd.seemail": {
        source: "iana",
        extensions: [
            "see"
        ]
    },
    "application/vnd.sema": {
        source: "iana",
        extensions: [
            "sema"
        ]
    },
    "application/vnd.semd": {
        source: "iana",
        extensions: [
            "semd"
        ]
    },
    "application/vnd.semf": {
        source: "iana",
        extensions: [
            "semf"
        ]
    },
    "application/vnd.shade-save-file": {
        source: "iana"
    },
    "application/vnd.shana.informed.formdata": {
        source: "iana",
        extensions: [
            "ifm"
        ]
    },
    "application/vnd.shana.informed.formtemplate": {
        source: "iana",
        extensions: [
            "itp"
        ]
    },
    "application/vnd.shana.informed.interchange": {
        source: "iana",
        extensions: [
            "iif"
        ]
    },
    "application/vnd.shana.informed.package": {
        source: "iana",
        extensions: [
            "ipk"
        ]
    },
    "application/vnd.shootproof+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.shopkick+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.shp": {
        source: "iana"
    },
    "application/vnd.shx": {
        source: "iana"
    },
    "application/vnd.sigrok.session": {
        source: "iana"
    },
    "application/vnd.simtech-mindmapper": {
        source: "iana",
        extensions: [
            "twd",
            "twds"
        ]
    },
    "application/vnd.siren+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.smaf": {
        source: "iana",
        extensions: [
            "mmf"
        ]
    },
    "application/vnd.smart.notebook": {
        source: "iana"
    },
    "application/vnd.smart.teacher": {
        source: "iana",
        extensions: [
            "teacher"
        ]
    },
    "application/vnd.snesdev-page-table": {
        source: "iana"
    },
    "application/vnd.software602.filler.form+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "fo"
        ]
    },
    "application/vnd.software602.filler.form-xml-zip": {
        source: "iana"
    },
    "application/vnd.solent.sdkm+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "sdkm",
            "sdkd"
        ]
    },
    "application/vnd.spotfire.dxp": {
        source: "iana",
        extensions: [
            "dxp"
        ]
    },
    "application/vnd.spotfire.sfs": {
        source: "iana",
        extensions: [
            "sfs"
        ]
    },
    "application/vnd.sqlite3": {
        source: "iana"
    },
    "application/vnd.sss-cod": {
        source: "iana"
    },
    "application/vnd.sss-dtf": {
        source: "iana"
    },
    "application/vnd.sss-ntf": {
        source: "iana"
    },
    "application/vnd.stardivision.calc": {
        source: "apache",
        extensions: [
            "sdc"
        ]
    },
    "application/vnd.stardivision.draw": {
        source: "apache",
        extensions: [
            "sda"
        ]
    },
    "application/vnd.stardivision.impress": {
        source: "apache",
        extensions: [
            "sdd"
        ]
    },
    "application/vnd.stardivision.math": {
        source: "apache",
        extensions: [
            "smf"
        ]
    },
    "application/vnd.stardivision.writer": {
        source: "apache",
        extensions: [
            "sdw",
            "vor"
        ]
    },
    "application/vnd.stardivision.writer-global": {
        source: "apache",
        extensions: [
            "sgl"
        ]
    },
    "application/vnd.stepmania.package": {
        source: "iana",
        extensions: [
            "smzip"
        ]
    },
    "application/vnd.stepmania.stepchart": {
        source: "iana",
        extensions: [
            "sm"
        ]
    },
    "application/vnd.street-stream": {
        source: "iana"
    },
    "application/vnd.sun.wadl+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "wadl"
        ]
    },
    "application/vnd.sun.xml.calc": {
        source: "apache",
        extensions: [
            "sxc"
        ]
    },
    "application/vnd.sun.xml.calc.template": {
        source: "apache",
        extensions: [
            "stc"
        ]
    },
    "application/vnd.sun.xml.draw": {
        source: "apache",
        extensions: [
            "sxd"
        ]
    },
    "application/vnd.sun.xml.draw.template": {
        source: "apache",
        extensions: [
            "std"
        ]
    },
    "application/vnd.sun.xml.impress": {
        source: "apache",
        extensions: [
            "sxi"
        ]
    },
    "application/vnd.sun.xml.impress.template": {
        source: "apache",
        extensions: [
            "sti"
        ]
    },
    "application/vnd.sun.xml.math": {
        source: "apache",
        extensions: [
            "sxm"
        ]
    },
    "application/vnd.sun.xml.writer": {
        source: "apache",
        extensions: [
            "sxw"
        ]
    },
    "application/vnd.sun.xml.writer.global": {
        source: "apache",
        extensions: [
            "sxg"
        ]
    },
    "application/vnd.sun.xml.writer.template": {
        source: "apache",
        extensions: [
            "stw"
        ]
    },
    "application/vnd.sus-calendar": {
        source: "iana",
        extensions: [
            "sus",
            "susp"
        ]
    },
    "application/vnd.svd": {
        source: "iana",
        extensions: [
            "svd"
        ]
    },
    "application/vnd.swiftview-ics": {
        source: "iana"
    },
    "application/vnd.symbian.install": {
        source: "apache",
        extensions: [
            "sis",
            "sisx"
        ]
    },
    "application/vnd.syncml+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "xsm"
        ]
    },
    "application/vnd.syncml.dm+wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: [
            "bdm"
        ]
    },
    "application/vnd.syncml.dm+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "xdm"
        ]
    },
    "application/vnd.syncml.dm.notification": {
        source: "iana"
    },
    "application/vnd.syncml.dmddf+wbxml": {
        source: "iana"
    },
    "application/vnd.syncml.dmddf+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "ddf"
        ]
    },
    "application/vnd.syncml.dmtnds+wbxml": {
        source: "iana"
    },
    "application/vnd.syncml.dmtnds+xml": {
        source: "iana",
        charset: "UTF-8",
        compressible: true
    },
    "application/vnd.syncml.ds.notification": {
        source: "iana"
    },
    "application/vnd.tableschema+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.tao.intent-module-archive": {
        source: "iana",
        extensions: [
            "tao"
        ]
    },
    "application/vnd.tcpdump.pcap": {
        source: "iana",
        extensions: [
            "pcap",
            "cap",
            "dmp"
        ]
    },
    "application/vnd.think-cell.ppttc+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.tmd.mediaflex.api+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.tml": {
        source: "iana"
    },
    "application/vnd.tmobile-livetv": {
        source: "iana",
        extensions: [
            "tmo"
        ]
    },
    "application/vnd.tri.onesource": {
        source: "iana"
    },
    "application/vnd.trid.tpt": {
        source: "iana",
        extensions: [
            "tpt"
        ]
    },
    "application/vnd.triscape.mxs": {
        source: "iana",
        extensions: [
            "mxs"
        ]
    },
    "application/vnd.trueapp": {
        source: "iana",
        extensions: [
            "tra"
        ]
    },
    "application/vnd.truedoc": {
        source: "iana"
    },
    "application/vnd.ubisoft.webplayer": {
        source: "iana"
    },
    "application/vnd.ufdl": {
        source: "iana",
        extensions: [
            "ufd",
            "ufdl"
        ]
    },
    "application/vnd.uiq.theme": {
        source: "iana",
        extensions: [
            "utz"
        ]
    },
    "application/vnd.umajin": {
        source: "iana",
        extensions: [
            "umj"
        ]
    },
    "application/vnd.unity": {
        source: "iana",
        extensions: [
            "unityweb"
        ]
    },
    "application/vnd.uoml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "uoml"
        ]
    },
    "application/vnd.uplanet.alert": {
        source: "iana"
    },
    "application/vnd.uplanet.alert-wbxml": {
        source: "iana"
    },
    "application/vnd.uplanet.bearer-choice": {
        source: "iana"
    },
    "application/vnd.uplanet.bearer-choice-wbxml": {
        source: "iana"
    },
    "application/vnd.uplanet.cacheop": {
        source: "iana"
    },
    "application/vnd.uplanet.cacheop-wbxml": {
        source: "iana"
    },
    "application/vnd.uplanet.channel": {
        source: "iana"
    },
    "application/vnd.uplanet.channel-wbxml": {
        source: "iana"
    },
    "application/vnd.uplanet.list": {
        source: "iana"
    },
    "application/vnd.uplanet.list-wbxml": {
        source: "iana"
    },
    "application/vnd.uplanet.listcmd": {
        source: "iana"
    },
    "application/vnd.uplanet.listcmd-wbxml": {
        source: "iana"
    },
    "application/vnd.uplanet.signal": {
        source: "iana"
    },
    "application/vnd.uri-map": {
        source: "iana"
    },
    "application/vnd.valve.source.material": {
        source: "iana"
    },
    "application/vnd.vcx": {
        source: "iana",
        extensions: [
            "vcx"
        ]
    },
    "application/vnd.vd-study": {
        source: "iana"
    },
    "application/vnd.vectorworks": {
        source: "iana"
    },
    "application/vnd.vel+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.verimatrix.vcas": {
        source: "iana"
    },
    "application/vnd.veryant.thin": {
        source: "iana"
    },
    "application/vnd.ves.encrypted": {
        source: "iana"
    },
    "application/vnd.vidsoft.vidconference": {
        source: "iana"
    },
    "application/vnd.visio": {
        source: "iana",
        extensions: [
            "vsd",
            "vst",
            "vss",
            "vsw"
        ]
    },
    "application/vnd.visionary": {
        source: "iana",
        extensions: [
            "vis"
        ]
    },
    "application/vnd.vividence.scriptfile": {
        source: "iana"
    },
    "application/vnd.vsf": {
        source: "iana",
        extensions: [
            "vsf"
        ]
    },
    "application/vnd.wap.sic": {
        source: "iana"
    },
    "application/vnd.wap.slc": {
        source: "iana"
    },
    "application/vnd.wap.wbxml": {
        source: "iana",
        charset: "UTF-8",
        extensions: [
            "wbxml"
        ]
    },
    "application/vnd.wap.wmlc": {
        source: "iana",
        extensions: [
            "wmlc"
        ]
    },
    "application/vnd.wap.wmlscriptc": {
        source: "iana",
        extensions: [
            "wmlsc"
        ]
    },
    "application/vnd.webturbo": {
        source: "iana",
        extensions: [
            "wtb"
        ]
    },
    "application/vnd.wfa.p2p": {
        source: "iana"
    },
    "application/vnd.wfa.wsc": {
        source: "iana"
    },
    "application/vnd.windows.devicepairing": {
        source: "iana"
    },
    "application/vnd.wmc": {
        source: "iana"
    },
    "application/vnd.wmf.bootstrap": {
        source: "iana"
    },
    "application/vnd.wolfram.mathematica": {
        source: "iana"
    },
    "application/vnd.wolfram.mathematica.package": {
        source: "iana"
    },
    "application/vnd.wolfram.player": {
        source: "iana",
        extensions: [
            "nbp"
        ]
    },
    "application/vnd.wordperfect": {
        source: "iana",
        extensions: [
            "wpd"
        ]
    },
    "application/vnd.wqd": {
        source: "iana",
        extensions: [
            "wqd"
        ]
    },
    "application/vnd.wrq-hp3000-labelled": {
        source: "iana"
    },
    "application/vnd.wt.stf": {
        source: "iana",
        extensions: [
            "stf"
        ]
    },
    "application/vnd.wv.csp+wbxml": {
        source: "iana"
    },
    "application/vnd.wv.csp+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.wv.ssp+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.xacml+json": {
        source: "iana",
        compressible: true
    },
    "application/vnd.xara": {
        source: "iana",
        extensions: [
            "xar"
        ]
    },
    "application/vnd.xfdl": {
        source: "iana",
        extensions: [
            "xfdl"
        ]
    },
    "application/vnd.xfdl.webform": {
        source: "iana"
    },
    "application/vnd.xmi+xml": {
        source: "iana",
        compressible: true
    },
    "application/vnd.xmpie.cpkg": {
        source: "iana"
    },
    "application/vnd.xmpie.dpkg": {
        source: "iana"
    },
    "application/vnd.xmpie.plan": {
        source: "iana"
    },
    "application/vnd.xmpie.ppkg": {
        source: "iana"
    },
    "application/vnd.xmpie.xlim": {
        source: "iana"
    },
    "application/vnd.yamaha.hv-dic": {
        source: "iana",
        extensions: [
            "hvd"
        ]
    },
    "application/vnd.yamaha.hv-script": {
        source: "iana",
        extensions: [
            "hvs"
        ]
    },
    "application/vnd.yamaha.hv-voice": {
        source: "iana",
        extensions: [
            "hvp"
        ]
    },
    "application/vnd.yamaha.openscoreformat": {
        source: "iana",
        extensions: [
            "osf"
        ]
    },
    "application/vnd.yamaha.openscoreformat.osfpvg+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "osfpvg"
        ]
    },
    "application/vnd.yamaha.remote-setup": {
        source: "iana"
    },
    "application/vnd.yamaha.smaf-audio": {
        source: "iana",
        extensions: [
            "saf"
        ]
    },
    "application/vnd.yamaha.smaf-phrase": {
        source: "iana",
        extensions: [
            "spf"
        ]
    },
    "application/vnd.yamaha.through-ngn": {
        source: "iana"
    },
    "application/vnd.yamaha.tunnel-udpencap": {
        source: "iana"
    },
    "application/vnd.yaoweme": {
        source: "iana"
    },
    "application/vnd.yellowriver-custom-menu": {
        source: "iana",
        extensions: [
            "cmp"
        ]
    },
    "application/vnd.youtube.yt": {
        source: "iana"
    },
    "application/vnd.zul": {
        source: "iana",
        extensions: [
            "zir",
            "zirz"
        ]
    },
    "application/vnd.zzazz.deck+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "zaz"
        ]
    },
    "application/voicexml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "vxml"
        ]
    },
    "application/voucher-cms+json": {
        source: "iana",
        compressible: true
    },
    "application/vq-rtcpxr": {
        source: "iana"
    },
    "application/wasm": {
        compressible: true,
        extensions: [
            "wasm"
        ]
    },
    "application/watcherinfo+xml": {
        source: "iana",
        compressible: true
    },
    "application/webpush-options+json": {
        source: "iana",
        compressible: true
    },
    "application/whoispp-query": {
        source: "iana"
    },
    "application/whoispp-response": {
        source: "iana"
    },
    "application/widget": {
        source: "iana",
        extensions: [
            "wgt"
        ]
    },
    "application/winhlp": {
        source: "apache",
        extensions: [
            "hlp"
        ]
    },
    "application/wita": {
        source: "iana"
    },
    "application/wordperfect5.1": {
        source: "iana"
    },
    "application/wsdl+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "wsdl"
        ]
    },
    "application/wspolicy+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "wspolicy"
        ]
    },
    "application/x-7z-compressed": {
        source: "apache",
        compressible: false,
        extensions: [
            "7z"
        ]
    },
    "application/x-abiword": {
        source: "apache",
        extensions: [
            "abw"
        ]
    },
    "application/x-ace-compressed": {
        source: "apache",
        extensions: [
            "ace"
        ]
    },
    "application/x-amf": {
        source: "apache"
    },
    "application/x-apple-diskimage": {
        source: "apache",
        extensions: [
            "dmg"
        ]
    },
    "application/x-arj": {
        compressible: false,
        extensions: [
            "arj"
        ]
    },
    "application/x-authorware-bin": {
        source: "apache",
        extensions: [
            "aab",
            "x32",
            "u32",
            "vox"
        ]
    },
    "application/x-authorware-map": {
        source: "apache",
        extensions: [
            "aam"
        ]
    },
    "application/x-authorware-seg": {
        source: "apache",
        extensions: [
            "aas"
        ]
    },
    "application/x-bcpio": {
        source: "apache",
        extensions: [
            "bcpio"
        ]
    },
    "application/x-bdoc": {
        compressible: false,
        extensions: [
            "bdoc"
        ]
    },
    "application/x-bittorrent": {
        source: "apache",
        extensions: [
            "torrent"
        ]
    },
    "application/x-blorb": {
        source: "apache",
        extensions: [
            "blb",
            "blorb"
        ]
    },
    "application/x-bzip": {
        source: "apache",
        compressible: false,
        extensions: [
            "bz"
        ]
    },
    "application/x-bzip2": {
        source: "apache",
        compressible: false,
        extensions: [
            "bz2",
            "boz"
        ]
    },
    "application/x-cbr": {
        source: "apache",
        extensions: [
            "cbr",
            "cba",
            "cbt",
            "cbz",
            "cb7"
        ]
    },
    "application/x-cdlink": {
        source: "apache",
        extensions: [
            "vcd"
        ]
    },
    "application/x-cfs-compressed": {
        source: "apache",
        extensions: [
            "cfs"
        ]
    },
    "application/x-chat": {
        source: "apache",
        extensions: [
            "chat"
        ]
    },
    "application/x-chess-pgn": {
        source: "apache",
        extensions: [
            "pgn"
        ]
    },
    "application/x-chrome-extension": {
        extensions: [
            "crx"
        ]
    },
    "application/x-cocoa": {
        source: "nginx",
        extensions: [
            "cco"
        ]
    },
    "application/x-compress": {
        source: "apache"
    },
    "application/x-conference": {
        source: "apache",
        extensions: [
            "nsc"
        ]
    },
    "application/x-cpio": {
        source: "apache",
        extensions: [
            "cpio"
        ]
    },
    "application/x-csh": {
        source: "apache",
        extensions: [
            "csh"
        ]
    },
    "application/x-deb": {
        compressible: false
    },
    "application/x-debian-package": {
        source: "apache",
        extensions: [
            "deb",
            "udeb"
        ]
    },
    "application/x-dgc-compressed": {
        source: "apache",
        extensions: [
            "dgc"
        ]
    },
    "application/x-director": {
        source: "apache",
        extensions: [
            "dir",
            "dcr",
            "dxr",
            "cst",
            "cct",
            "cxt",
            "w3d",
            "fgd",
            "swa"
        ]
    },
    "application/x-doom": {
        source: "apache",
        extensions: [
            "wad"
        ]
    },
    "application/x-dtbncx+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "ncx"
        ]
    },
    "application/x-dtbook+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "dtb"
        ]
    },
    "application/x-dtbresource+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "res"
        ]
    },
    "application/x-dvi": {
        source: "apache",
        compressible: false,
        extensions: [
            "dvi"
        ]
    },
    "application/x-envoy": {
        source: "apache",
        extensions: [
            "evy"
        ]
    },
    "application/x-eva": {
        source: "apache",
        extensions: [
            "eva"
        ]
    },
    "application/x-font-bdf": {
        source: "apache",
        extensions: [
            "bdf"
        ]
    },
    "application/x-font-dos": {
        source: "apache"
    },
    "application/x-font-framemaker": {
        source: "apache"
    },
    "application/x-font-ghostscript": {
        source: "apache",
        extensions: [
            "gsf"
        ]
    },
    "application/x-font-libgrx": {
        source: "apache"
    },
    "application/x-font-linux-psf": {
        source: "apache",
        extensions: [
            "psf"
        ]
    },
    "application/x-font-pcf": {
        source: "apache",
        extensions: [
            "pcf"
        ]
    },
    "application/x-font-snf": {
        source: "apache",
        extensions: [
            "snf"
        ]
    },
    "application/x-font-speedo": {
        source: "apache"
    },
    "application/x-font-sunos-news": {
        source: "apache"
    },
    "application/x-font-type1": {
        source: "apache",
        extensions: [
            "pfa",
            "pfb",
            "pfm",
            "afm"
        ]
    },
    "application/x-font-vfont": {
        source: "apache"
    },
    "application/x-freearc": {
        source: "apache",
        extensions: [
            "arc"
        ]
    },
    "application/x-futuresplash": {
        source: "apache",
        extensions: [
            "spl"
        ]
    },
    "application/x-gca-compressed": {
        source: "apache",
        extensions: [
            "gca"
        ]
    },
    "application/x-glulx": {
        source: "apache",
        extensions: [
            "ulx"
        ]
    },
    "application/x-gnumeric": {
        source: "apache",
        extensions: [
            "gnumeric"
        ]
    },
    "application/x-gramps-xml": {
        source: "apache",
        extensions: [
            "gramps"
        ]
    },
    "application/x-gtar": {
        source: "apache",
        extensions: [
            "gtar"
        ]
    },
    "application/x-gzip": {
        source: "apache"
    },
    "application/x-hdf": {
        source: "apache",
        extensions: [
            "hdf"
        ]
    },
    "application/x-httpd-php": {
        compressible: true,
        extensions: [
            "php"
        ]
    },
    "application/x-install-instructions": {
        source: "apache",
        extensions: [
            "install"
        ]
    },
    "application/x-iso9660-image": {
        source: "apache",
        extensions: [
            "iso"
        ]
    },
    "application/x-java-archive-diff": {
        source: "nginx",
        extensions: [
            "jardiff"
        ]
    },
    "application/x-java-jnlp-file": {
        source: "apache",
        compressible: false,
        extensions: [
            "jnlp"
        ]
    },
    "application/x-javascript": {
        compressible: true
    },
    "application/x-keepass2": {
        extensions: [
            "kdbx"
        ]
    },
    "application/x-latex": {
        source: "apache",
        compressible: false,
        extensions: [
            "latex"
        ]
    },
    "application/x-lua-bytecode": {
        extensions: [
            "luac"
        ]
    },
    "application/x-lzh-compressed": {
        source: "apache",
        extensions: [
            "lzh",
            "lha"
        ]
    },
    "application/x-makeself": {
        source: "nginx",
        extensions: [
            "run"
        ]
    },
    "application/x-mie": {
        source: "apache",
        extensions: [
            "mie"
        ]
    },
    "application/x-mobipocket-ebook": {
        source: "apache",
        extensions: [
            "prc",
            "mobi"
        ]
    },
    "application/x-mpegurl": {
        compressible: false
    },
    "application/x-ms-application": {
        source: "apache",
        extensions: [
            "application"
        ]
    },
    "application/x-ms-shortcut": {
        source: "apache",
        extensions: [
            "lnk"
        ]
    },
    "application/x-ms-wmd": {
        source: "apache",
        extensions: [
            "wmd"
        ]
    },
    "application/x-ms-wmz": {
        source: "apache",
        extensions: [
            "wmz"
        ]
    },
    "application/x-ms-xbap": {
        source: "apache",
        extensions: [
            "xbap"
        ]
    },
    "application/x-msaccess": {
        source: "apache",
        extensions: [
            "mdb"
        ]
    },
    "application/x-msbinder": {
        source: "apache",
        extensions: [
            "obd"
        ]
    },
    "application/x-mscardfile": {
        source: "apache",
        extensions: [
            "crd"
        ]
    },
    "application/x-msclip": {
        source: "apache",
        extensions: [
            "clp"
        ]
    },
    "application/x-msdos-program": {
        extensions: [
            "exe"
        ]
    },
    "application/x-msdownload": {
        source: "apache",
        extensions: [
            "exe",
            "dll",
            "com",
            "bat",
            "msi"
        ]
    },
    "application/x-msmediaview": {
        source: "apache",
        extensions: [
            "mvb",
            "m13",
            "m14"
        ]
    },
    "application/x-msmetafile": {
        source: "apache",
        extensions: [
            "wmf",
            "wmz",
            "emf",
            "emz"
        ]
    },
    "application/x-msmoney": {
        source: "apache",
        extensions: [
            "mny"
        ]
    },
    "application/x-mspublisher": {
        source: "apache",
        extensions: [
            "pub"
        ]
    },
    "application/x-msschedule": {
        source: "apache",
        extensions: [
            "scd"
        ]
    },
    "application/x-msterminal": {
        source: "apache",
        extensions: [
            "trm"
        ]
    },
    "application/x-mswrite": {
        source: "apache",
        extensions: [
            "wri"
        ]
    },
    "application/x-netcdf": {
        source: "apache",
        extensions: [
            "nc",
            "cdf"
        ]
    },
    "application/x-ns-proxy-autoconfig": {
        compressible: true,
        extensions: [
            "pac"
        ]
    },
    "application/x-nzb": {
        source: "apache",
        extensions: [
            "nzb"
        ]
    },
    "application/x-perl": {
        source: "nginx",
        extensions: [
            "pl",
            "pm"
        ]
    },
    "application/x-pilot": {
        source: "nginx",
        extensions: [
            "prc",
            "pdb"
        ]
    },
    "application/x-pkcs12": {
        source: "apache",
        compressible: false,
        extensions: [
            "p12",
            "pfx"
        ]
    },
    "application/x-pkcs7-certificates": {
        source: "apache",
        extensions: [
            "p7b",
            "spc"
        ]
    },
    "application/x-pkcs7-certreqresp": {
        source: "apache",
        extensions: [
            "p7r"
        ]
    },
    "application/x-pki-message": {
        source: "iana"
    },
    "application/x-rar-compressed": {
        source: "apache",
        compressible: false,
        extensions: [
            "rar"
        ]
    },
    "application/x-redhat-package-manager": {
        source: "nginx",
        extensions: [
            "rpm"
        ]
    },
    "application/x-research-info-systems": {
        source: "apache",
        extensions: [
            "ris"
        ]
    },
    "application/x-sea": {
        source: "nginx",
        extensions: [
            "sea"
        ]
    },
    "application/x-sh": {
        source: "apache",
        compressible: true,
        extensions: [
            "sh"
        ]
    },
    "application/x-shar": {
        source: "apache",
        extensions: [
            "shar"
        ]
    },
    "application/x-shockwave-flash": {
        source: "apache",
        compressible: false,
        extensions: [
            "swf"
        ]
    },
    "application/x-silverlight-app": {
        source: "apache",
        extensions: [
            "xap"
        ]
    },
    "application/x-sql": {
        source: "apache",
        extensions: [
            "sql"
        ]
    },
    "application/x-stuffit": {
        source: "apache",
        compressible: false,
        extensions: [
            "sit"
        ]
    },
    "application/x-stuffitx": {
        source: "apache",
        extensions: [
            "sitx"
        ]
    },
    "application/x-subrip": {
        source: "apache",
        extensions: [
            "srt"
        ]
    },
    "application/x-sv4cpio": {
        source: "apache",
        extensions: [
            "sv4cpio"
        ]
    },
    "application/x-sv4crc": {
        source: "apache",
        extensions: [
            "sv4crc"
        ]
    },
    "application/x-t3vm-image": {
        source: "apache",
        extensions: [
            "t3"
        ]
    },
    "application/x-tads": {
        source: "apache",
        extensions: [
            "gam"
        ]
    },
    "application/x-tar": {
        source: "apache",
        compressible: true,
        extensions: [
            "tar"
        ]
    },
    "application/x-tcl": {
        source: "apache",
        extensions: [
            "tcl",
            "tk"
        ]
    },
    "application/x-tex": {
        source: "apache",
        extensions: [
            "tex"
        ]
    },
    "application/x-tex-tfm": {
        source: "apache",
        extensions: [
            "tfm"
        ]
    },
    "application/x-texinfo": {
        source: "apache",
        extensions: [
            "texinfo",
            "texi"
        ]
    },
    "application/x-tgif": {
        source: "apache",
        extensions: [
            "obj"
        ]
    },
    "application/x-ustar": {
        source: "apache",
        extensions: [
            "ustar"
        ]
    },
    "application/x-virtualbox-hdd": {
        compressible: true,
        extensions: [
            "hdd"
        ]
    },
    "application/x-virtualbox-ova": {
        compressible: true,
        extensions: [
            "ova"
        ]
    },
    "application/x-virtualbox-ovf": {
        compressible: true,
        extensions: [
            "ovf"
        ]
    },
    "application/x-virtualbox-vbox": {
        compressible: true,
        extensions: [
            "vbox"
        ]
    },
    "application/x-virtualbox-vbox-extpack": {
        compressible: false,
        extensions: [
            "vbox-extpack"
        ]
    },
    "application/x-virtualbox-vdi": {
        compressible: true,
        extensions: [
            "vdi"
        ]
    },
    "application/x-virtualbox-vhd": {
        compressible: true,
        extensions: [
            "vhd"
        ]
    },
    "application/x-virtualbox-vmdk": {
        compressible: true,
        extensions: [
            "vmdk"
        ]
    },
    "application/x-wais-source": {
        source: "apache",
        extensions: [
            "src"
        ]
    },
    "application/x-web-app-manifest+json": {
        compressible: true,
        extensions: [
            "webapp"
        ]
    },
    "application/x-www-form-urlencoded": {
        source: "iana",
        compressible: true
    },
    "application/x-x509-ca-cert": {
        source: "iana",
        extensions: [
            "der",
            "crt",
            "pem"
        ]
    },
    "application/x-x509-ca-ra-cert": {
        source: "iana"
    },
    "application/x-x509-next-ca-cert": {
        source: "iana"
    },
    "application/x-xfig": {
        source: "apache",
        extensions: [
            "fig"
        ]
    },
    "application/x-xliff+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "xlf"
        ]
    },
    "application/x-xpinstall": {
        source: "apache",
        compressible: false,
        extensions: [
            "xpi"
        ]
    },
    "application/x-xz": {
        source: "apache",
        extensions: [
            "xz"
        ]
    },
    "application/x-zmachine": {
        source: "apache",
        extensions: [
            "z1",
            "z2",
            "z3",
            "z4",
            "z5",
            "z6",
            "z7",
            "z8"
        ]
    },
    "application/x400-bp": {
        source: "iana"
    },
    "application/xacml+xml": {
        source: "iana",
        compressible: true
    },
    "application/xaml+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "xaml"
        ]
    },
    "application/xcap-att+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xav"
        ]
    },
    "application/xcap-caps+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xca"
        ]
    },
    "application/xcap-diff+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xdf"
        ]
    },
    "application/xcap-el+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xel"
        ]
    },
    "application/xcap-error+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xer"
        ]
    },
    "application/xcap-ns+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xns"
        ]
    },
    "application/xcon-conference-info+xml": {
        source: "iana",
        compressible: true
    },
    "application/xcon-conference-info-diff+xml": {
        source: "iana",
        compressible: true
    },
    "application/xenc+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xenc"
        ]
    },
    "application/xhtml+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xhtml",
            "xht"
        ]
    },
    "application/xhtml-voice+xml": {
        source: "apache",
        compressible: true
    },
    "application/xliff+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xlf"
        ]
    },
    "application/xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xml",
            "xsl",
            "xsd",
            "rng"
        ]
    },
    "application/xml-dtd": {
        source: "iana",
        compressible: true,
        extensions: [
            "dtd"
        ]
    },
    "application/xml-external-parsed-entity": {
        source: "iana"
    },
    "application/xml-patch+xml": {
        source: "iana",
        compressible: true
    },
    "application/xmpp+xml": {
        source: "iana",
        compressible: true
    },
    "application/xop+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xop"
        ]
    },
    "application/xproc+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "xpl"
        ]
    },
    "application/xslt+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xslt"
        ]
    },
    "application/xspf+xml": {
        source: "apache",
        compressible: true,
        extensions: [
            "xspf"
        ]
    },
    "application/xv+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "mxml",
            "xhvml",
            "xvml",
            "xvm"
        ]
    },
    "application/yang": {
        source: "iana",
        extensions: [
            "yang"
        ]
    },
    "application/yang-data+json": {
        source: "iana",
        compressible: true
    },
    "application/yang-data+xml": {
        source: "iana",
        compressible: true
    },
    "application/yang-patch+json": {
        source: "iana",
        compressible: true
    },
    "application/yang-patch+xml": {
        source: "iana",
        compressible: true
    },
    "application/yin+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "yin"
        ]
    },
    "application/zip": {
        source: "iana",
        compressible: false,
        extensions: [
            "zip"
        ]
    },
    "application/zlib": {
        source: "iana"
    },
    "application/zstd": {
        source: "iana"
    },
    "audio/1d-interleaved-parityfec": {
        source: "iana"
    },
    "audio/32kadpcm": {
        source: "iana"
    },
    "audio/3gpp": {
        source: "iana",
        compressible: false,
        extensions: [
            "3gpp"
        ]
    },
    "audio/3gpp2": {
        source: "iana"
    },
    "audio/aac": {
        source: "iana"
    },
    "audio/ac3": {
        source: "iana"
    },
    "audio/adpcm": {
        source: "apache",
        extensions: [
            "adp"
        ]
    },
    "audio/amr": {
        source: "iana"
    },
    "audio/amr-wb": {
        source: "iana"
    },
    "audio/amr-wb+": {
        source: "iana"
    },
    "audio/aptx": {
        source: "iana"
    },
    "audio/asc": {
        source: "iana"
    },
    "audio/atrac-advanced-lossless": {
        source: "iana"
    },
    "audio/atrac-x": {
        source: "iana"
    },
    "audio/atrac3": {
        source: "iana"
    },
    "audio/basic": {
        source: "iana",
        compressible: false,
        extensions: [
            "au",
            "snd"
        ]
    },
    "audio/bv16": {
        source: "iana"
    },
    "audio/bv32": {
        source: "iana"
    },
    "audio/clearmode": {
        source: "iana"
    },
    "audio/cn": {
        source: "iana"
    },
    "audio/dat12": {
        source: "iana"
    },
    "audio/dls": {
        source: "iana"
    },
    "audio/dsr-es201108": {
        source: "iana"
    },
    "audio/dsr-es202050": {
        source: "iana"
    },
    "audio/dsr-es202211": {
        source: "iana"
    },
    "audio/dsr-es202212": {
        source: "iana"
    },
    "audio/dv": {
        source: "iana"
    },
    "audio/dvi4": {
        source: "iana"
    },
    "audio/eac3": {
        source: "iana"
    },
    "audio/encaprtp": {
        source: "iana"
    },
    "audio/evrc": {
        source: "iana"
    },
    "audio/evrc-qcp": {
        source: "iana"
    },
    "audio/evrc0": {
        source: "iana"
    },
    "audio/evrc1": {
        source: "iana"
    },
    "audio/evrcb": {
        source: "iana"
    },
    "audio/evrcb0": {
        source: "iana"
    },
    "audio/evrcb1": {
        source: "iana"
    },
    "audio/evrcnw": {
        source: "iana"
    },
    "audio/evrcnw0": {
        source: "iana"
    },
    "audio/evrcnw1": {
        source: "iana"
    },
    "audio/evrcwb": {
        source: "iana"
    },
    "audio/evrcwb0": {
        source: "iana"
    },
    "audio/evrcwb1": {
        source: "iana"
    },
    "audio/evs": {
        source: "iana"
    },
    "audio/flexfec": {
        source: "iana"
    },
    "audio/fwdred": {
        source: "iana"
    },
    "audio/g711-0": {
        source: "iana"
    },
    "audio/g719": {
        source: "iana"
    },
    "audio/g722": {
        source: "iana"
    },
    "audio/g7221": {
        source: "iana"
    },
    "audio/g723": {
        source: "iana"
    },
    "audio/g726-16": {
        source: "iana"
    },
    "audio/g726-24": {
        source: "iana"
    },
    "audio/g726-32": {
        source: "iana"
    },
    "audio/g726-40": {
        source: "iana"
    },
    "audio/g728": {
        source: "iana"
    },
    "audio/g729": {
        source: "iana"
    },
    "audio/g7291": {
        source: "iana"
    },
    "audio/g729d": {
        source: "iana"
    },
    "audio/g729e": {
        source: "iana"
    },
    "audio/gsm": {
        source: "iana"
    },
    "audio/gsm-efr": {
        source: "iana"
    },
    "audio/gsm-hr-08": {
        source: "iana"
    },
    "audio/ilbc": {
        source: "iana"
    },
    "audio/ip-mr_v2.5": {
        source: "iana"
    },
    "audio/isac": {
        source: "apache"
    },
    "audio/l16": {
        source: "iana"
    },
    "audio/l20": {
        source: "iana"
    },
    "audio/l24": {
        source: "iana",
        compressible: false
    },
    "audio/l8": {
        source: "iana"
    },
    "audio/lpc": {
        source: "iana"
    },
    "audio/melp": {
        source: "iana"
    },
    "audio/melp1200": {
        source: "iana"
    },
    "audio/melp2400": {
        source: "iana"
    },
    "audio/melp600": {
        source: "iana"
    },
    "audio/mhas": {
        source: "iana"
    },
    "audio/midi": {
        source: "apache",
        extensions: [
            "mid",
            "midi",
            "kar",
            "rmi"
        ]
    },
    "audio/mobile-xmf": {
        source: "iana",
        extensions: [
            "mxmf"
        ]
    },
    "audio/mp3": {
        compressible: false,
        extensions: [
            "mp3"
        ]
    },
    "audio/mp4": {
        source: "iana",
        compressible: false,
        extensions: [
            "m4a",
            "mp4a"
        ]
    },
    "audio/mp4a-latm": {
        source: "iana"
    },
    "audio/mpa": {
        source: "iana"
    },
    "audio/mpa-robust": {
        source: "iana"
    },
    "audio/mpeg": {
        source: "iana",
        compressible: false,
        extensions: [
            "mpga",
            "mp2",
            "mp2a",
            "mp3",
            "m2a",
            "m3a"
        ]
    },
    "audio/mpeg4-generic": {
        source: "iana"
    },
    "audio/musepack": {
        source: "apache"
    },
    "audio/ogg": {
        source: "iana",
        compressible: false,
        extensions: [
            "oga",
            "ogg",
            "spx"
        ]
    },
    "audio/opus": {
        source: "iana"
    },
    "audio/parityfec": {
        source: "iana"
    },
    "audio/pcma": {
        source: "iana"
    },
    "audio/pcma-wb": {
        source: "iana"
    },
    "audio/pcmu": {
        source: "iana"
    },
    "audio/pcmu-wb": {
        source: "iana"
    },
    "audio/prs.sid": {
        source: "iana"
    },
    "audio/qcelp": {
        source: "iana"
    },
    "audio/raptorfec": {
        source: "iana"
    },
    "audio/red": {
        source: "iana"
    },
    "audio/rtp-enc-aescm128": {
        source: "iana"
    },
    "audio/rtp-midi": {
        source: "iana"
    },
    "audio/rtploopback": {
        source: "iana"
    },
    "audio/rtx": {
        source: "iana"
    },
    "audio/s3m": {
        source: "apache",
        extensions: [
            "s3m"
        ]
    },
    "audio/silk": {
        source: "apache",
        extensions: [
            "sil"
        ]
    },
    "audio/smv": {
        source: "iana"
    },
    "audio/smv-qcp": {
        source: "iana"
    },
    "audio/smv0": {
        source: "iana"
    },
    "audio/sp-midi": {
        source: "iana"
    },
    "audio/speex": {
        source: "iana"
    },
    "audio/t140c": {
        source: "iana"
    },
    "audio/t38": {
        source: "iana"
    },
    "audio/telephone-event": {
        source: "iana"
    },
    "audio/tetra_acelp": {
        source: "iana"
    },
    "audio/tetra_acelp_bb": {
        source: "iana"
    },
    "audio/tone": {
        source: "iana"
    },
    "audio/uemclip": {
        source: "iana"
    },
    "audio/ulpfec": {
        source: "iana"
    },
    "audio/usac": {
        source: "iana"
    },
    "audio/vdvi": {
        source: "iana"
    },
    "audio/vmr-wb": {
        source: "iana"
    },
    "audio/vnd.3gpp.iufp": {
        source: "iana"
    },
    "audio/vnd.4sb": {
        source: "iana"
    },
    "audio/vnd.audiokoz": {
        source: "iana"
    },
    "audio/vnd.celp": {
        source: "iana"
    },
    "audio/vnd.cisco.nse": {
        source: "iana"
    },
    "audio/vnd.cmles.radio-events": {
        source: "iana"
    },
    "audio/vnd.cns.anp1": {
        source: "iana"
    },
    "audio/vnd.cns.inf1": {
        source: "iana"
    },
    "audio/vnd.dece.audio": {
        source: "iana",
        extensions: [
            "uva",
            "uvva"
        ]
    },
    "audio/vnd.digital-winds": {
        source: "iana",
        extensions: [
            "eol"
        ]
    },
    "audio/vnd.dlna.adts": {
        source: "iana"
    },
    "audio/vnd.dolby.heaac.1": {
        source: "iana"
    },
    "audio/vnd.dolby.heaac.2": {
        source: "iana"
    },
    "audio/vnd.dolby.mlp": {
        source: "iana"
    },
    "audio/vnd.dolby.mps": {
        source: "iana"
    },
    "audio/vnd.dolby.pl2": {
        source: "iana"
    },
    "audio/vnd.dolby.pl2x": {
        source: "iana"
    },
    "audio/vnd.dolby.pl2z": {
        source: "iana"
    },
    "audio/vnd.dolby.pulse.1": {
        source: "iana"
    },
    "audio/vnd.dra": {
        source: "iana",
        extensions: [
            "dra"
        ]
    },
    "audio/vnd.dts": {
        source: "iana",
        extensions: [
            "dts"
        ]
    },
    "audio/vnd.dts.hd": {
        source: "iana",
        extensions: [
            "dtshd"
        ]
    },
    "audio/vnd.dts.uhd": {
        source: "iana"
    },
    "audio/vnd.dvb.file": {
        source: "iana"
    },
    "audio/vnd.everad.plj": {
        source: "iana"
    },
    "audio/vnd.hns.audio": {
        source: "iana"
    },
    "audio/vnd.lucent.voice": {
        source: "iana",
        extensions: [
            "lvp"
        ]
    },
    "audio/vnd.ms-playready.media.pya": {
        source: "iana",
        extensions: [
            "pya"
        ]
    },
    "audio/vnd.nokia.mobile-xmf": {
        source: "iana"
    },
    "audio/vnd.nortel.vbk": {
        source: "iana"
    },
    "audio/vnd.nuera.ecelp4800": {
        source: "iana",
        extensions: [
            "ecelp4800"
        ]
    },
    "audio/vnd.nuera.ecelp7470": {
        source: "iana",
        extensions: [
            "ecelp7470"
        ]
    },
    "audio/vnd.nuera.ecelp9600": {
        source: "iana",
        extensions: [
            "ecelp9600"
        ]
    },
    "audio/vnd.octel.sbc": {
        source: "iana"
    },
    "audio/vnd.presonus.multitrack": {
        source: "iana"
    },
    "audio/vnd.qcelp": {
        source: "iana"
    },
    "audio/vnd.rhetorex.32kadpcm": {
        source: "iana"
    },
    "audio/vnd.rip": {
        source: "iana",
        extensions: [
            "rip"
        ]
    },
    "audio/vnd.rn-realaudio": {
        compressible: false
    },
    "audio/vnd.sealedmedia.softseal.mpeg": {
        source: "iana"
    },
    "audio/vnd.vmx.cvsd": {
        source: "iana"
    },
    "audio/vnd.wave": {
        compressible: false
    },
    "audio/vorbis": {
        source: "iana",
        compressible: false
    },
    "audio/vorbis-config": {
        source: "iana"
    },
    "audio/wav": {
        compressible: false,
        extensions: [
            "wav"
        ]
    },
    "audio/wave": {
        compressible: false,
        extensions: [
            "wav"
        ]
    },
    "audio/webm": {
        source: "apache",
        compressible: false,
        extensions: [
            "weba"
        ]
    },
    "audio/x-aac": {
        source: "apache",
        compressible: false,
        extensions: [
            "aac"
        ]
    },
    "audio/x-aiff": {
        source: "apache",
        extensions: [
            "aif",
            "aiff",
            "aifc"
        ]
    },
    "audio/x-caf": {
        source: "apache",
        compressible: false,
        extensions: [
            "caf"
        ]
    },
    "audio/x-flac": {
        source: "apache",
        extensions: [
            "flac"
        ]
    },
    "audio/x-m4a": {
        source: "nginx",
        extensions: [
            "m4a"
        ]
    },
    "audio/x-matroska": {
        source: "apache",
        extensions: [
            "mka"
        ]
    },
    "audio/x-mpegurl": {
        source: "apache",
        extensions: [
            "m3u"
        ]
    },
    "audio/x-ms-wax": {
        source: "apache",
        extensions: [
            "wax"
        ]
    },
    "audio/x-ms-wma": {
        source: "apache",
        extensions: [
            "wma"
        ]
    },
    "audio/x-pn-realaudio": {
        source: "apache",
        extensions: [
            "ram",
            "ra"
        ]
    },
    "audio/x-pn-realaudio-plugin": {
        source: "apache",
        extensions: [
            "rmp"
        ]
    },
    "audio/x-realaudio": {
        source: "nginx",
        extensions: [
            "ra"
        ]
    },
    "audio/x-tta": {
        source: "apache"
    },
    "audio/x-wav": {
        source: "apache",
        extensions: [
            "wav"
        ]
    },
    "audio/xm": {
        source: "apache",
        extensions: [
            "xm"
        ]
    },
    "chemical/x-cdx": {
        source: "apache",
        extensions: [
            "cdx"
        ]
    },
    "chemical/x-cif": {
        source: "apache",
        extensions: [
            "cif"
        ]
    },
    "chemical/x-cmdf": {
        source: "apache",
        extensions: [
            "cmdf"
        ]
    },
    "chemical/x-cml": {
        source: "apache",
        extensions: [
            "cml"
        ]
    },
    "chemical/x-csml": {
        source: "apache",
        extensions: [
            "csml"
        ]
    },
    "chemical/x-pdb": {
        source: "apache"
    },
    "chemical/x-xyz": {
        source: "apache",
        extensions: [
            "xyz"
        ]
    },
    "font/collection": {
        source: "iana",
        extensions: [
            "ttc"
        ]
    },
    "font/otf": {
        source: "iana",
        compressible: true,
        extensions: [
            "otf"
        ]
    },
    "font/sfnt": {
        source: "iana"
    },
    "font/ttf": {
        source: "iana",
        compressible: true,
        extensions: [
            "ttf"
        ]
    },
    "font/woff": {
        source: "iana",
        extensions: [
            "woff"
        ]
    },
    "font/woff2": {
        source: "iana",
        extensions: [
            "woff2"
        ]
    },
    "image/aces": {
        source: "iana",
        extensions: [
            "exr"
        ]
    },
    "image/apng": {
        compressible: false,
        extensions: [
            "apng"
        ]
    },
    "image/avci": {
        source: "iana"
    },
    "image/avcs": {
        source: "iana"
    },
    "image/bmp": {
        source: "iana",
        compressible: true,
        extensions: [
            "bmp"
        ]
    },
    "image/cgm": {
        source: "iana",
        extensions: [
            "cgm"
        ]
    },
    "image/dicom-rle": {
        source: "iana",
        extensions: [
            "drle"
        ]
    },
    "image/emf": {
        source: "iana",
        extensions: [
            "emf"
        ]
    },
    "image/fits": {
        source: "iana",
        extensions: [
            "fits"
        ]
    },
    "image/g3fax": {
        source: "iana",
        extensions: [
            "g3"
        ]
    },
    "image/gif": {
        source: "iana",
        compressible: false,
        extensions: [
            "gif"
        ]
    },
    "image/heic": {
        source: "iana",
        extensions: [
            "heic"
        ]
    },
    "image/heic-sequence": {
        source: "iana",
        extensions: [
            "heics"
        ]
    },
    "image/heif": {
        source: "iana",
        extensions: [
            "heif"
        ]
    },
    "image/heif-sequence": {
        source: "iana",
        extensions: [
            "heifs"
        ]
    },
    "image/hej2k": {
        source: "iana",
        extensions: [
            "hej2"
        ]
    },
    "image/hsj2": {
        source: "iana",
        extensions: [
            "hsj2"
        ]
    },
    "image/ief": {
        source: "iana",
        extensions: [
            "ief"
        ]
    },
    "image/jls": {
        source: "iana",
        extensions: [
            "jls"
        ]
    },
    "image/jp2": {
        source: "iana",
        compressible: false,
        extensions: [
            "jp2",
            "jpg2"
        ]
    },
    "image/jpeg": {
        source: "iana",
        compressible: false,
        extensions: [
            "jpeg",
            "jpg",
            "jpe"
        ]
    },
    "image/jph": {
        source: "iana",
        extensions: [
            "jph"
        ]
    },
    "image/jphc": {
        source: "iana",
        extensions: [
            "jhc"
        ]
    },
    "image/jpm": {
        source: "iana",
        compressible: false,
        extensions: [
            "jpm"
        ]
    },
    "image/jpx": {
        source: "iana",
        compressible: false,
        extensions: [
            "jpx",
            "jpf"
        ]
    },
    "image/jxr": {
        source: "iana",
        extensions: [
            "jxr"
        ]
    },
    "image/jxra": {
        source: "iana",
        extensions: [
            "jxra"
        ]
    },
    "image/jxrs": {
        source: "iana",
        extensions: [
            "jxrs"
        ]
    },
    "image/jxs": {
        source: "iana",
        extensions: [
            "jxs"
        ]
    },
    "image/jxsc": {
        source: "iana",
        extensions: [
            "jxsc"
        ]
    },
    "image/jxsi": {
        source: "iana",
        extensions: [
            "jxsi"
        ]
    },
    "image/jxss": {
        source: "iana",
        extensions: [
            "jxss"
        ]
    },
    "image/ktx": {
        source: "iana",
        extensions: [
            "ktx"
        ]
    },
    "image/naplps": {
        source: "iana"
    },
    "image/pjpeg": {
        compressible: false
    },
    "image/png": {
        source: "iana",
        compressible: false,
        extensions: [
            "png"
        ]
    },
    "image/prs.btif": {
        source: "iana",
        extensions: [
            "btif"
        ]
    },
    "image/prs.pti": {
        source: "iana",
        extensions: [
            "pti"
        ]
    },
    "image/pwg-raster": {
        source: "iana"
    },
    "image/sgi": {
        source: "apache",
        extensions: [
            "sgi"
        ]
    },
    "image/svg+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "svg",
            "svgz"
        ]
    },
    "image/t38": {
        source: "iana",
        extensions: [
            "t38"
        ]
    },
    "image/tiff": {
        source: "iana",
        compressible: false,
        extensions: [
            "tif",
            "tiff"
        ]
    },
    "image/tiff-fx": {
        source: "iana",
        extensions: [
            "tfx"
        ]
    },
    "image/vnd.adobe.photoshop": {
        source: "iana",
        compressible: true,
        extensions: [
            "psd"
        ]
    },
    "image/vnd.airzip.accelerator.azv": {
        source: "iana",
        extensions: [
            "azv"
        ]
    },
    "image/vnd.cns.inf2": {
        source: "iana"
    },
    "image/vnd.dece.graphic": {
        source: "iana",
        extensions: [
            "uvi",
            "uvvi",
            "uvg",
            "uvvg"
        ]
    },
    "image/vnd.djvu": {
        source: "iana",
        extensions: [
            "djvu",
            "djv"
        ]
    },
    "image/vnd.dvb.subtitle": {
        source: "iana",
        extensions: [
            "sub"
        ]
    },
    "image/vnd.dwg": {
        source: "iana",
        extensions: [
            "dwg"
        ]
    },
    "image/vnd.dxf": {
        source: "iana",
        extensions: [
            "dxf"
        ]
    },
    "image/vnd.fastbidsheet": {
        source: "iana",
        extensions: [
            "fbs"
        ]
    },
    "image/vnd.fpx": {
        source: "iana",
        extensions: [
            "fpx"
        ]
    },
    "image/vnd.fst": {
        source: "iana",
        extensions: [
            "fst"
        ]
    },
    "image/vnd.fujixerox.edmics-mmr": {
        source: "iana",
        extensions: [
            "mmr"
        ]
    },
    "image/vnd.fujixerox.edmics-rlc": {
        source: "iana",
        extensions: [
            "rlc"
        ]
    },
    "image/vnd.globalgraphics.pgb": {
        source: "iana"
    },
    "image/vnd.microsoft.icon": {
        source: "iana",
        extensions: [
            "ico"
        ]
    },
    "image/vnd.mix": {
        source: "iana"
    },
    "image/vnd.mozilla.apng": {
        source: "iana"
    },
    "image/vnd.ms-dds": {
        extensions: [
            "dds"
        ]
    },
    "image/vnd.ms-modi": {
        source: "iana",
        extensions: [
            "mdi"
        ]
    },
    "image/vnd.ms-photo": {
        source: "apache",
        extensions: [
            "wdp"
        ]
    },
    "image/vnd.net-fpx": {
        source: "iana",
        extensions: [
            "npx"
        ]
    },
    "image/vnd.radiance": {
        source: "iana"
    },
    "image/vnd.sealed.png": {
        source: "iana"
    },
    "image/vnd.sealedmedia.softseal.gif": {
        source: "iana"
    },
    "image/vnd.sealedmedia.softseal.jpg": {
        source: "iana"
    },
    "image/vnd.svf": {
        source: "iana"
    },
    "image/vnd.tencent.tap": {
        source: "iana",
        extensions: [
            "tap"
        ]
    },
    "image/vnd.valve.source.texture": {
        source: "iana",
        extensions: [
            "vtf"
        ]
    },
    "image/vnd.wap.wbmp": {
        source: "iana",
        extensions: [
            "wbmp"
        ]
    },
    "image/vnd.xiff": {
        source: "iana",
        extensions: [
            "xif"
        ]
    },
    "image/vnd.zbrush.pcx": {
        source: "iana",
        extensions: [
            "pcx"
        ]
    },
    "image/webp": {
        source: "apache",
        extensions: [
            "webp"
        ]
    },
    "image/wmf": {
        source: "iana",
        extensions: [
            "wmf"
        ]
    },
    "image/x-3ds": {
        source: "apache",
        extensions: [
            "3ds"
        ]
    },
    "image/x-cmu-raster": {
        source: "apache",
        extensions: [
            "ras"
        ]
    },
    "image/x-cmx": {
        source: "apache",
        extensions: [
            "cmx"
        ]
    },
    "image/x-freehand": {
        source: "apache",
        extensions: [
            "fh",
            "fhc",
            "fh4",
            "fh5",
            "fh7"
        ]
    },
    "image/x-icon": {
        source: "apache",
        compressible: true,
        extensions: [
            "ico"
        ]
    },
    "image/x-jng": {
        source: "nginx",
        extensions: [
            "jng"
        ]
    },
    "image/x-mrsid-image": {
        source: "apache",
        extensions: [
            "sid"
        ]
    },
    "image/x-ms-bmp": {
        source: "nginx",
        compressible: true,
        extensions: [
            "bmp"
        ]
    },
    "image/x-pcx": {
        source: "apache",
        extensions: [
            "pcx"
        ]
    },
    "image/x-pict": {
        source: "apache",
        extensions: [
            "pic",
            "pct"
        ]
    },
    "image/x-portable-anymap": {
        source: "apache",
        extensions: [
            "pnm"
        ]
    },
    "image/x-portable-bitmap": {
        source: "apache",
        extensions: [
            "pbm"
        ]
    },
    "image/x-portable-graymap": {
        source: "apache",
        extensions: [
            "pgm"
        ]
    },
    "image/x-portable-pixmap": {
        source: "apache",
        extensions: [
            "ppm"
        ]
    },
    "image/x-rgb": {
        source: "apache",
        extensions: [
            "rgb"
        ]
    },
    "image/x-tga": {
        source: "apache",
        extensions: [
            "tga"
        ]
    },
    "image/x-xbitmap": {
        source: "apache",
        extensions: [
            "xbm"
        ]
    },
    "image/x-xcf": {
        compressible: false
    },
    "image/x-xpixmap": {
        source: "apache",
        extensions: [
            "xpm"
        ]
    },
    "image/x-xwindowdump": {
        source: "apache",
        extensions: [
            "xwd"
        ]
    },
    "message/cpim": {
        source: "iana"
    },
    "message/delivery-status": {
        source: "iana"
    },
    "message/disposition-notification": {
        source: "iana",
        extensions: [
            "disposition-notification"
        ]
    },
    "message/external-body": {
        source: "iana"
    },
    "message/feedback-report": {
        source: "iana"
    },
    "message/global": {
        source: "iana",
        extensions: [
            "u8msg"
        ]
    },
    "message/global-delivery-status": {
        source: "iana",
        extensions: [
            "u8dsn"
        ]
    },
    "message/global-disposition-notification": {
        source: "iana",
        extensions: [
            "u8mdn"
        ]
    },
    "message/global-headers": {
        source: "iana",
        extensions: [
            "u8hdr"
        ]
    },
    "message/http": {
        source: "iana",
        compressible: false
    },
    "message/imdn+xml": {
        source: "iana",
        compressible: true
    },
    "message/news": {
        source: "iana"
    },
    "message/partial": {
        source: "iana",
        compressible: false
    },
    "message/rfc822": {
        source: "iana",
        compressible: true,
        extensions: [
            "eml",
            "mime"
        ]
    },
    "message/s-http": {
        source: "iana"
    },
    "message/sip": {
        source: "iana"
    },
    "message/sipfrag": {
        source: "iana"
    },
    "message/tracking-status": {
        source: "iana"
    },
    "message/vnd.si.simp": {
        source: "iana"
    },
    "message/vnd.wfa.wsc": {
        source: "iana",
        extensions: [
            "wsc"
        ]
    },
    "model/3mf": {
        source: "iana",
        extensions: [
            "3mf"
        ]
    },
    "model/gltf+json": {
        source: "iana",
        compressible: true,
        extensions: [
            "gltf"
        ]
    },
    "model/gltf-binary": {
        source: "iana",
        compressible: true,
        extensions: [
            "glb"
        ]
    },
    "model/iges": {
        source: "iana",
        compressible: false,
        extensions: [
            "igs",
            "iges"
        ]
    },
    "model/mesh": {
        source: "iana",
        compressible: false,
        extensions: [
            "msh",
            "mesh",
            "silo"
        ]
    },
    "model/mtl": {
        source: "iana",
        extensions: [
            "mtl"
        ]
    },
    "model/obj": {
        source: "iana",
        extensions: [
            "obj"
        ]
    },
    "model/stl": {
        source: "iana",
        extensions: [
            "stl"
        ]
    },
    "model/vnd.collada+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "dae"
        ]
    },
    "model/vnd.dwf": {
        source: "iana",
        extensions: [
            "dwf"
        ]
    },
    "model/vnd.flatland.3dml": {
        source: "iana"
    },
    "model/vnd.gdl": {
        source: "iana",
        extensions: [
            "gdl"
        ]
    },
    "model/vnd.gs-gdl": {
        source: "apache"
    },
    "model/vnd.gs.gdl": {
        source: "iana"
    },
    "model/vnd.gtw": {
        source: "iana",
        extensions: [
            "gtw"
        ]
    },
    "model/vnd.moml+xml": {
        source: "iana",
        compressible: true
    },
    "model/vnd.mts": {
        source: "iana",
        extensions: [
            "mts"
        ]
    },
    "model/vnd.opengex": {
        source: "iana",
        extensions: [
            "ogex"
        ]
    },
    "model/vnd.parasolid.transmit.binary": {
        source: "iana",
        extensions: [
            "x_b"
        ]
    },
    "model/vnd.parasolid.transmit.text": {
        source: "iana",
        extensions: [
            "x_t"
        ]
    },
    "model/vnd.rosette.annotated-data-model": {
        source: "iana"
    },
    "model/vnd.usdz+zip": {
        source: "iana",
        compressible: false,
        extensions: [
            "usdz"
        ]
    },
    "model/vnd.valve.source.compiled-map": {
        source: "iana",
        extensions: [
            "bsp"
        ]
    },
    "model/vnd.vtu": {
        source: "iana",
        extensions: [
            "vtu"
        ]
    },
    "model/vrml": {
        source: "iana",
        compressible: false,
        extensions: [
            "wrl",
            "vrml"
        ]
    },
    "model/x3d+binary": {
        source: "apache",
        compressible: false,
        extensions: [
            "x3db",
            "x3dbz"
        ]
    },
    "model/x3d+fastinfoset": {
        source: "iana",
        extensions: [
            "x3db"
        ]
    },
    "model/x3d+vrml": {
        source: "apache",
        compressible: false,
        extensions: [
            "x3dv",
            "x3dvz"
        ]
    },
    "model/x3d+xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "x3d",
            "x3dz"
        ]
    },
    "model/x3d-vrml": {
        source: "iana",
        extensions: [
            "x3dv"
        ]
    },
    "multipart/alternative": {
        source: "iana",
        compressible: false
    },
    "multipart/appledouble": {
        source: "iana"
    },
    "multipart/byteranges": {
        source: "iana"
    },
    "multipart/digest": {
        source: "iana"
    },
    "multipart/encrypted": {
        source: "iana",
        compressible: false
    },
    "multipart/form-data": {
        source: "iana",
        compressible: false
    },
    "multipart/header-set": {
        source: "iana"
    },
    "multipart/mixed": {
        source: "iana"
    },
    "multipart/multilingual": {
        source: "iana"
    },
    "multipart/parallel": {
        source: "iana"
    },
    "multipart/related": {
        source: "iana",
        compressible: false
    },
    "multipart/report": {
        source: "iana"
    },
    "multipart/signed": {
        source: "iana",
        compressible: false
    },
    "multipart/vnd.bint.med-plus": {
        source: "iana"
    },
    "multipart/voice-message": {
        source: "iana"
    },
    "multipart/x-mixed-replace": {
        source: "iana"
    },
    "text/1d-interleaved-parityfec": {
        source: "iana"
    },
    "text/cache-manifest": {
        source: "iana",
        compressible: true,
        extensions: [
            "appcache",
            "manifest"
        ]
    },
    "text/calendar": {
        source: "iana",
        extensions: [
            "ics",
            "ifb"
        ]
    },
    "text/calender": {
        compressible: true
    },
    "text/cmd": {
        compressible: true
    },
    "text/coffeescript": {
        extensions: [
            "coffee",
            "litcoffee"
        ]
    },
    "text/css": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "css"
        ]
    },
    "text/csv": {
        source: "iana",
        compressible: true,
        extensions: [
            "csv"
        ]
    },
    "text/csv-schema": {
        source: "iana"
    },
    "text/directory": {
        source: "iana"
    },
    "text/dns": {
        source: "iana"
    },
    "text/ecmascript": {
        source: "iana"
    },
    "text/encaprtp": {
        source: "iana"
    },
    "text/enriched": {
        source: "iana"
    },
    "text/flexfec": {
        source: "iana"
    },
    "text/fwdred": {
        source: "iana"
    },
    "text/grammar-ref-list": {
        source: "iana"
    },
    "text/html": {
        source: "iana",
        compressible: true,
        extensions: [
            "html",
            "htm",
            "shtml"
        ]
    },
    "text/jade": {
        extensions: [
            "jade"
        ]
    },
    "text/javascript": {
        source: "iana",
        compressible: true
    },
    "text/jcr-cnd": {
        source: "iana"
    },
    "text/jsx": {
        compressible: true,
        extensions: [
            "jsx"
        ]
    },
    "text/less": {
        compressible: true,
        extensions: [
            "less"
        ]
    },
    "text/markdown": {
        source: "iana",
        compressible: true,
        extensions: [
            "markdown",
            "md"
        ]
    },
    "text/mathml": {
        source: "nginx",
        extensions: [
            "mml"
        ]
    },
    "text/mdx": {
        compressible: true,
        extensions: [
            "mdx"
        ]
    },
    "text/mizar": {
        source: "iana"
    },
    "text/n3": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "n3"
        ]
    },
    "text/parameters": {
        source: "iana",
        charset: "UTF-8"
    },
    "text/parityfec": {
        source: "iana"
    },
    "text/plain": {
        source: "iana",
        compressible: true,
        extensions: [
            "txt",
            "text",
            "conf",
            "def",
            "list",
            "log",
            "in",
            "ini"
        ]
    },
    "text/provenance-notation": {
        source: "iana",
        charset: "UTF-8"
    },
    "text/prs.fallenstein.rst": {
        source: "iana"
    },
    "text/prs.lines.tag": {
        source: "iana",
        extensions: [
            "dsc"
        ]
    },
    "text/prs.prop.logic": {
        source: "iana"
    },
    "text/raptorfec": {
        source: "iana"
    },
    "text/red": {
        source: "iana"
    },
    "text/rfc822-headers": {
        source: "iana"
    },
    "text/richtext": {
        source: "iana",
        compressible: true,
        extensions: [
            "rtx"
        ]
    },
    "text/rtf": {
        source: "iana",
        compressible: true,
        extensions: [
            "rtf"
        ]
    },
    "text/rtp-enc-aescm128": {
        source: "iana"
    },
    "text/rtploopback": {
        source: "iana"
    },
    "text/rtx": {
        source: "iana"
    },
    "text/sgml": {
        source: "iana",
        extensions: [
            "sgml",
            "sgm"
        ]
    },
    "text/shex": {
        extensions: [
            "shex"
        ]
    },
    "text/slim": {
        extensions: [
            "slim",
            "slm"
        ]
    },
    "text/strings": {
        source: "iana"
    },
    "text/stylus": {
        extensions: [
            "stylus",
            "styl"
        ]
    },
    "text/t140": {
        source: "iana"
    },
    "text/tab-separated-values": {
        source: "iana",
        compressible: true,
        extensions: [
            "tsv"
        ]
    },
    "text/troff": {
        source: "iana",
        extensions: [
            "t",
            "tr",
            "roff",
            "man",
            "me",
            "ms"
        ]
    },
    "text/turtle": {
        source: "iana",
        charset: "UTF-8",
        extensions: [
            "ttl"
        ]
    },
    "text/ulpfec": {
        source: "iana"
    },
    "text/uri-list": {
        source: "iana",
        compressible: true,
        extensions: [
            "uri",
            "uris",
            "urls"
        ]
    },
    "text/vcard": {
        source: "iana",
        compressible: true,
        extensions: [
            "vcard"
        ]
    },
    "text/vnd.a": {
        source: "iana"
    },
    "text/vnd.abc": {
        source: "iana"
    },
    "text/vnd.ascii-art": {
        source: "iana"
    },
    "text/vnd.curl": {
        source: "iana",
        extensions: [
            "curl"
        ]
    },
    "text/vnd.curl.dcurl": {
        source: "apache",
        extensions: [
            "dcurl"
        ]
    },
    "text/vnd.curl.mcurl": {
        source: "apache",
        extensions: [
            "mcurl"
        ]
    },
    "text/vnd.curl.scurl": {
        source: "apache",
        extensions: [
            "scurl"
        ]
    },
    "text/vnd.debian.copyright": {
        source: "iana",
        charset: "UTF-8"
    },
    "text/vnd.dmclientscript": {
        source: "iana"
    },
    "text/vnd.dvb.subtitle": {
        source: "iana",
        extensions: [
            "sub"
        ]
    },
    "text/vnd.esmertec.theme-descriptor": {
        source: "iana",
        charset: "UTF-8"
    },
    "text/vnd.ficlab.flt": {
        source: "iana"
    },
    "text/vnd.fly": {
        source: "iana",
        extensions: [
            "fly"
        ]
    },
    "text/vnd.fmi.flexstor": {
        source: "iana",
        extensions: [
            "flx"
        ]
    },
    "text/vnd.gml": {
        source: "iana"
    },
    "text/vnd.graphviz": {
        source: "iana",
        extensions: [
            "gv"
        ]
    },
    "text/vnd.hgl": {
        source: "iana"
    },
    "text/vnd.in3d.3dml": {
        source: "iana",
        extensions: [
            "3dml"
        ]
    },
    "text/vnd.in3d.spot": {
        source: "iana",
        extensions: [
            "spot"
        ]
    },
    "text/vnd.iptc.newsml": {
        source: "iana"
    },
    "text/vnd.iptc.nitf": {
        source: "iana"
    },
    "text/vnd.latex-z": {
        source: "iana"
    },
    "text/vnd.motorola.reflex": {
        source: "iana"
    },
    "text/vnd.ms-mediapackage": {
        source: "iana"
    },
    "text/vnd.net2phone.commcenter.command": {
        source: "iana"
    },
    "text/vnd.radisys.msml-basic-layout": {
        source: "iana"
    },
    "text/vnd.senx.warpscript": {
        source: "iana"
    },
    "text/vnd.si.uricatalogue": {
        source: "iana"
    },
    "text/vnd.sosi": {
        source: "iana"
    },
    "text/vnd.sun.j2me.app-descriptor": {
        source: "iana",
        charset: "UTF-8",
        extensions: [
            "jad"
        ]
    },
    "text/vnd.trolltech.linguist": {
        source: "iana",
        charset: "UTF-8"
    },
    "text/vnd.wap.si": {
        source: "iana"
    },
    "text/vnd.wap.sl": {
        source: "iana"
    },
    "text/vnd.wap.wml": {
        source: "iana",
        extensions: [
            "wml"
        ]
    },
    "text/vnd.wap.wmlscript": {
        source: "iana",
        extensions: [
            "wmls"
        ]
    },
    "text/vtt": {
        source: "iana",
        charset: "UTF-8",
        compressible: true,
        extensions: [
            "vtt"
        ]
    },
    "text/x-asm": {
        source: "apache",
        extensions: [
            "s",
            "asm"
        ]
    },
    "text/x-c": {
        source: "apache",
        extensions: [
            "c",
            "cc",
            "cxx",
            "cpp",
            "h",
            "hh",
            "dic"
        ]
    },
    "text/x-component": {
        source: "nginx",
        extensions: [
            "htc"
        ]
    },
    "text/x-fortran": {
        source: "apache",
        extensions: [
            "f",
            "for",
            "f77",
            "f90"
        ]
    },
    "text/x-gwt-rpc": {
        compressible: true
    },
    "text/x-handlebars-template": {
        extensions: [
            "hbs"
        ]
    },
    "text/x-java-source": {
        source: "apache",
        extensions: [
            "java"
        ]
    },
    "text/x-jquery-tmpl": {
        compressible: true
    },
    "text/x-lua": {
        extensions: [
            "lua"
        ]
    },
    "text/x-markdown": {
        compressible: true,
        extensions: [
            "mkd"
        ]
    },
    "text/x-nfo": {
        source: "apache",
        extensions: [
            "nfo"
        ]
    },
    "text/x-opml": {
        source: "apache",
        extensions: [
            "opml"
        ]
    },
    "text/x-org": {
        compressible: true,
        extensions: [
            "org"
        ]
    },
    "text/x-pascal": {
        source: "apache",
        extensions: [
            "p",
            "pas"
        ]
    },
    "text/x-processing": {
        compressible: true,
        extensions: [
            "pde"
        ]
    },
    "text/x-sass": {
        extensions: [
            "sass"
        ]
    },
    "text/x-scss": {
        extensions: [
            "scss"
        ]
    },
    "text/x-setext": {
        source: "apache",
        extensions: [
            "etx"
        ]
    },
    "text/x-sfv": {
        source: "apache",
        extensions: [
            "sfv"
        ]
    },
    "text/x-suse-ymp": {
        compressible: true,
        extensions: [
            "ymp"
        ]
    },
    "text/x-uuencode": {
        source: "apache",
        extensions: [
            "uu"
        ]
    },
    "text/x-vcalendar": {
        source: "apache",
        extensions: [
            "vcs"
        ]
    },
    "text/x-vcard": {
        source: "apache",
        extensions: [
            "vcf"
        ]
    },
    "text/xml": {
        source: "iana",
        compressible: true,
        extensions: [
            "xml"
        ]
    },
    "text/xml-external-parsed-entity": {
        source: "iana"
    },
    "text/yaml": {
        extensions: [
            "yaml",
            "yml"
        ]
    },
    "video/1d-interleaved-parityfec": {
        source: "iana"
    },
    "video/3gpp": {
        source: "iana",
        extensions: [
            "3gp",
            "3gpp"
        ]
    },
    "video/3gpp-tt": {
        source: "iana"
    },
    "video/3gpp2": {
        source: "iana",
        extensions: [
            "3g2"
        ]
    },
    "video/bmpeg": {
        source: "iana"
    },
    "video/bt656": {
        source: "iana"
    },
    "video/celb": {
        source: "iana"
    },
    "video/dv": {
        source: "iana"
    },
    "video/encaprtp": {
        source: "iana"
    },
    "video/flexfec": {
        source: "iana"
    },
    "video/h261": {
        source: "iana",
        extensions: [
            "h261"
        ]
    },
    "video/h263": {
        source: "iana",
        extensions: [
            "h263"
        ]
    },
    "video/h263-1998": {
        source: "iana"
    },
    "video/h263-2000": {
        source: "iana"
    },
    "video/h264": {
        source: "iana",
        extensions: [
            "h264"
        ]
    },
    "video/h264-rcdo": {
        source: "iana"
    },
    "video/h264-svc": {
        source: "iana"
    },
    "video/h265": {
        source: "iana"
    },
    "video/iso.segment": {
        source: "iana"
    },
    "video/jpeg": {
        source: "iana",
        extensions: [
            "jpgv"
        ]
    },
    "video/jpeg2000": {
        source: "iana"
    },
    "video/jpm": {
        source: "apache",
        extensions: [
            "jpm",
            "jpgm"
        ]
    },
    "video/mj2": {
        source: "iana",
        extensions: [
            "mj2",
            "mjp2"
        ]
    },
    "video/mp1s": {
        source: "iana"
    },
    "video/mp2p": {
        source: "iana"
    },
    "video/mp2t": {
        source: "iana",
        extensions: [
            "ts"
        ]
    },
    "video/mp4": {
        source: "iana",
        compressible: false,
        extensions: [
            "mp4",
            "mp4v",
            "mpg4"
        ]
    },
    "video/mp4v-es": {
        source: "iana"
    },
    "video/mpeg": {
        source: "iana",
        compressible: false,
        extensions: [
            "mpeg",
            "mpg",
            "mpe",
            "m1v",
            "m2v"
        ]
    },
    "video/mpeg4-generic": {
        source: "iana"
    },
    "video/mpv": {
        source: "iana"
    },
    "video/nv": {
        source: "iana"
    },
    "video/ogg": {
        source: "iana",
        compressible: false,
        extensions: [
            "ogv"
        ]
    },
    "video/parityfec": {
        source: "iana"
    },
    "video/pointer": {
        source: "iana"
    },
    "video/quicktime": {
        source: "iana",
        compressible: false,
        extensions: [
            "qt",
            "mov"
        ]
    },
    "video/raptorfec": {
        source: "iana"
    },
    "video/raw": {
        source: "iana"
    },
    "video/rtp-enc-aescm128": {
        source: "iana"
    },
    "video/rtploopback": {
        source: "iana"
    },
    "video/rtx": {
        source: "iana"
    },
    "video/smpte291": {
        source: "iana"
    },
    "video/smpte292m": {
        source: "iana"
    },
    "video/ulpfec": {
        source: "iana"
    },
    "video/vc1": {
        source: "iana"
    },
    "video/vc2": {
        source: "iana"
    },
    "video/vnd.cctv": {
        source: "iana"
    },
    "video/vnd.dece.hd": {
        source: "iana",
        extensions: [
            "uvh",
            "uvvh"
        ]
    },
    "video/vnd.dece.mobile": {
        source: "iana",
        extensions: [
            "uvm",
            "uvvm"
        ]
    },
    "video/vnd.dece.mp4": {
        source: "iana"
    },
    "video/vnd.dece.pd": {
        source: "iana",
        extensions: [
            "uvp",
            "uvvp"
        ]
    },
    "video/vnd.dece.sd": {
        source: "iana",
        extensions: [
            "uvs",
            "uvvs"
        ]
    },
    "video/vnd.dece.video": {
        source: "iana",
        extensions: [
            "uvv",
            "uvvv"
        ]
    },
    "video/vnd.directv.mpeg": {
        source: "iana"
    },
    "video/vnd.directv.mpeg-tts": {
        source: "iana"
    },
    "video/vnd.dlna.mpeg-tts": {
        source: "iana"
    },
    "video/vnd.dvb.file": {
        source: "iana",
        extensions: [
            "dvb"
        ]
    },
    "video/vnd.fvt": {
        source: "iana",
        extensions: [
            "fvt"
        ]
    },
    "video/vnd.hns.video": {
        source: "iana"
    },
    "video/vnd.iptvforum.1dparityfec-1010": {
        source: "iana"
    },
    "video/vnd.iptvforum.1dparityfec-2005": {
        source: "iana"
    },
    "video/vnd.iptvforum.2dparityfec-1010": {
        source: "iana"
    },
    "video/vnd.iptvforum.2dparityfec-2005": {
        source: "iana"
    },
    "video/vnd.iptvforum.ttsavc": {
        source: "iana"
    },
    "video/vnd.iptvforum.ttsmpeg2": {
        source: "iana"
    },
    "video/vnd.motorola.video": {
        source: "iana"
    },
    "video/vnd.motorola.videop": {
        source: "iana"
    },
    "video/vnd.mpegurl": {
        source: "iana",
        extensions: [
            "mxu",
            "m4u"
        ]
    },
    "video/vnd.ms-playready.media.pyv": {
        source: "iana",
        extensions: [
            "pyv"
        ]
    },
    "video/vnd.nokia.interleaved-multimedia": {
        source: "iana"
    },
    "video/vnd.nokia.mp4vr": {
        source: "iana"
    },
    "video/vnd.nokia.videovoip": {
        source: "iana"
    },
    "video/vnd.objectvideo": {
        source: "iana"
    },
    "video/vnd.radgamettools.bink": {
        source: "iana"
    },
    "video/vnd.radgamettools.smacker": {
        source: "iana"
    },
    "video/vnd.sealed.mpeg1": {
        source: "iana"
    },
    "video/vnd.sealed.mpeg4": {
        source: "iana"
    },
    "video/vnd.sealed.swf": {
        source: "iana"
    },
    "video/vnd.sealedmedia.softseal.mov": {
        source: "iana"
    },
    "video/vnd.uvvu.mp4": {
        source: "iana",
        extensions: [
            "uvu",
            "uvvu"
        ]
    },
    "video/vnd.vivo": {
        source: "iana",
        extensions: [
            "viv"
        ]
    },
    "video/vnd.youtube.yt": {
        source: "iana"
    },
    "video/vp8": {
        source: "iana"
    },
    "video/webm": {
        source: "apache",
        compressible: false,
        extensions: [
            "webm"
        ]
    },
    "video/x-f4v": {
        source: "apache",
        extensions: [
            "f4v"
        ]
    },
    "video/x-fli": {
        source: "apache",
        extensions: [
            "fli"
        ]
    },
    "video/x-flv": {
        source: "apache",
        compressible: false,
        extensions: [
            "flv"
        ]
    },
    "video/x-m4v": {
        source: "apache",
        extensions: [
            "m4v"
        ]
    },
    "video/x-matroska": {
        source: "apache",
        compressible: false,
        extensions: [
            "mkv",
            "mk3d",
            "mks"
        ]
    },
    "video/x-mng": {
        source: "apache",
        extensions: [
            "mng"
        ]
    },
    "video/x-ms-asf": {
        source: "apache",
        extensions: [
            "asf",
            "asx"
        ]
    },
    "video/x-ms-vob": {
        source: "apache",
        extensions: [
            "vob"
        ]
    },
    "video/x-ms-wm": {
        source: "apache",
        extensions: [
            "wm"
        ]
    },
    "video/x-ms-wmv": {
        source: "apache",
        compressible: false,
        extensions: [
            "wmv"
        ]
    },
    "video/x-ms-wmx": {
        source: "apache",
        extensions: [
            "wmx"
        ]
    },
    "video/x-ms-wvx": {
        source: "apache",
        extensions: [
            "wvx"
        ]
    },
    "video/x-msvideo": {
        source: "apache",
        extensions: [
            "avi"
        ]
    },
    "video/x-sgi-movie": {
        source: "apache",
        extensions: [
            "movie"
        ]
    },
    "video/x-smv": {
        source: "apache",
        extensions: [
            "smv"
        ]
    },
    "x-conference/x-cooltalk": {
        source: "apache",
        extensions: [
            "ice"
        ]
    },
    "x-shader/x-fragment": {
        compressible: true
    },
    "x-shader/x-vertex": {
        compressible: true
    }
};
const EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
const TEXT_TYPE_REGEXP = /^text\//i;
const extensions = new Map();
const types1 = new Map();
function populateMaps(extensions1, types1) {
    const preference = [
        "nginx",
        "apache",
        undefined,
        "iana"
    ];
    for (const type of Object.keys(db)){
        const mime = db[type];
        const exts = mime.extensions;
        if (!exts || !exts.length) {
            continue;
        }
        extensions1.set(type, exts);
        for (const ext of exts){
            const current = types1.get(ext);
            if (current) {
                const from = preference.indexOf(db[current].source);
                const to = preference.indexOf(mime.source);
                if (current !== "application/octet-stream" && (from > to || from === to && current.substr(0, 12) === "application/")) {
                    continue;
                }
            }
            types1.set(ext, type);
        }
    }
}
populateMaps(extensions, types1);
function charset(type) {
    const m = EXTRACT_TYPE_REGEXP.exec(type);
    if (!m) {
        return;
    }
    const [match] = m;
    const mime = db[match.toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    if (TEXT_TYPE_REGEXP.test(match)) {
        return "UTF-8";
    }
}
function lookup(path2) {
    const extension = extname("x." + path2).toLowerCase().substr(1);
    return types1.get(extension);
}
function contentType(str1) {
    let mime = str1.includes("/") ? str1 : lookup(str1);
    if (!mime) {
        return;
    }
    if (!mime.includes("charset")) {
        const cs = charset(mime);
        if (cs) {
            mime += `; charset=${cs.toLowerCase()}`;
        }
    }
    return mime;
}
function extension(type) {
    const match = EXTRACT_TYPE_REGEXP.exec(type);
    if (!match) {
        return;
    }
    const exts = extensions.get(match[1].toLowerCase());
    if (!exts || !exts.length) {
        return;
    }
    return exts[0];
}
const contentType1 = contentType, extension1 = extension, lookup1 = lookup;
function lexer(str1) {
    const tokens = [];
    let i1 = 0;
    while(i1 < str1.length){
        const char = str1[i1];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({
                type: "MODIFIER",
                index: i1,
                value: str1[i1++]
            });
            continue;
        }
        if (char === "\\") {
            tokens.push({
                type: "ESCAPED_CHAR",
                index: i1++,
                value: str1[i1++]
            });
            continue;
        }
        if (char === "{") {
            tokens.push({
                type: "OPEN",
                index: i1,
                value: str1[i1++]
            });
            continue;
        }
        if (char === "}") {
            tokens.push({
                type: "CLOSE",
                index: i1,
                value: str1[i1++]
            });
            continue;
        }
        if (char === ":") {
            let name2 = "";
            let j = i1 + 1;
            while(j < str1.length){
                const code2 = str1.charCodeAt(j);
                if (code2 >= 48 && code2 <= 57 || code2 >= 65 && code2 <= 90 || code2 >= 97 && code2 <= 122 || code2 === 95) {
                    name2 += str1[j++];
                    continue;
                }
                break;
            }
            if (!name2) throw new TypeError(`Missing parameter name at ${i1}`);
            tokens.push({
                type: "NAME",
                index: i1,
                value: name2
            });
            i1 = j;
            continue;
        }
        if (char === "(") {
            let count = 1;
            let pattern = "";
            let j = i1 + 1;
            if (str1[j] === "?") {
                throw new TypeError(`Pattern cannot start with "?" at ${j}`);
            }
            while(j < str1.length){
                if (str1[j] === "\\") {
                    pattern += str1[j++] + str1[j++];
                    continue;
                }
                if (str1[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                } else if (str1[j] === "(") {
                    count++;
                    if (str1[j + 1] !== "?") {
                        throw new TypeError(`Capturing groups are not allowed at ${j}`);
                    }
                }
                pattern += str1[j++];
            }
            if (count) throw new TypeError(`Unbalanced pattern at ${i1}`);
            if (!pattern) throw new TypeError(`Missing pattern at ${i1}`);
            tokens.push({
                type: "PATTERN",
                index: i1,
                value: pattern
            });
            i1 = j;
            continue;
        }
        tokens.push({
            type: "CHAR",
            index: i1,
            value: str1[i1++]
        });
    }
    tokens.push({
        type: "END",
        index: i1,
        value: ""
    });
    return tokens;
}
function parse1(str1, options2 = {
}) {
    const tokens = lexer(str1);
    const defaultPattern = `[^${escapeString(options2.delimiter || "/#?")}]+?`;
    const result = [];
    let key1 = 0;
    let i1 = 0;
    let path2 = "";
    const tryConsume = (type)=>{
        if (i1 < tokens.length && tokens[i1].type === type) return tokens[i1++].value;
    };
    const mustConsume = (type)=>{
        const value2 = tryConsume(type);
        if (value2 !== undefined) return value2;
        const { type: nextType , index  } = tokens[i1];
        throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`);
    };
    const consumeText = ()=>{
        let result1 = "";
        return result1;
    };
    while(i1 < tokens.length){
        const char = tryConsume("CHAR");
        const name2 = tryConsume("NAME");
        const pattern = tryConsume("PATTERN");
        if (name2 || pattern) {
            let prefix = char || "";
            if (path2) {
                result.push(path2);
                path2 = "";
            }
            result.push({
                name: name2 || key1++,
                prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        const value2 = char || tryConsume("ESCAPED_CHAR");
        if (value2) {
            path2 += value2;
            continue;
        }
        if (path2) {
            result.push(path2);
            path2 = "";
        }
        const open = tryConsume("OPEN");
        if (open) {
            const prefix = consumeText();
            const name3 = tryConsume("NAME") || "";
            const pattern1 = tryConsume("PATTERN") || "";
            const suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name3 || (pattern1 ? key1++ : ""),
                pattern: name3 && !pattern1 ? defaultPattern : pattern1,
                prefix,
                suffix,
                modifier: tryConsume("MODIFIER") || ""
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
function compile(str1, options2) {
    return tokensToFunction(parse1(str1, options2), options2);
}
function tokensToFunction(tokens, options2 = {
}) {
    const reFlags = flags(options2);
    const { encode: encode1 , validate =true  } = options2;
    const matches = tokens.map((token)=>{
        if (typeof token === "object") {
            return new RegExp(`^(?:${token.pattern})$`, reFlags);
        }
    });
    return (data)=>{
        let path2 = "";
        for(let i1 = 0; i1 < tokens.length; i1++){
            const token = tokens[i1];
            if (typeof token === "string") {
                path2 += token;
                continue;
            }
            const value2 = data ? data[token.name] : undefined;
            const optional = token.modifier === "?" || token.modifier === "*";
            const repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value2)) {
                if (!repeat) {
                    throw new TypeError(`Expected "${token.name}" to not repeat, but got an array`);
                }
                if (value2.length === 0) {
                    if (optional) continue;
                    throw new TypeError(`Expected "${token.name}" to not be empty`);
                }
                for(let j = 0; j < value2.length; j++){
                    const segment = encode1(value2[j], token);
                    if (validate && !matches[i1].test(segment)) {
                        throw new TypeError(`Expected all "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                    }
                    path2 += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value2 === "string" || typeof value2 === "number") {
                const segment = encode1(String(value2), token);
                if (validate && !matches[i1].test(segment)) {
                    throw new TypeError(`Expected "${token.name}" to match "${token.pattern}", but got "${segment}"`);
                }
                path2 += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional) continue;
            const typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError(`Expected "${token.name}" to be ${typeOfMessage}`);
        }
        return path2;
    };
}
function regexpToFunction(re, keys1, options2 = {
}) {
    const { decode: decode1  } = options2;
    return function(pathname) {
        const m = re.exec(pathname);
        if (!m) return false;
        const { 0: path2 , index  } = m;
        const params = Object.create(null);
        for(let i1 = 1; i1 < m.length; i1++){
            if (m[i1] === undefined) continue;
            const key1 = keys1[i1 - 1];
            if (key1.modifier === "*" || key1.modifier === "+") {
                params[key1.name] = m[i1].split(key1.prefix + key1.suffix).map((value2)=>{
                    return decode1(value2, key1);
                });
            } else {
                params[key1.name] = decode1(m[i1], key1);
            }
        }
        return {
            path: path2,
            index,
            params
        };
    };
}
function escapeString(str1) {
    return str1.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options2) {
    return options2 && options2.sensitive ? "" : "i";
}
function regexpToRegexp(path2, keys1) {
    if (!keys1) return path2;
    const groups = path2.source.match(/\((?!\?)/g);
    if (groups) {
        for(let i1 = 0; i1 < groups.length; i1++){
            keys1.push({
                name: i1,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
        }
    }
    return path2;
}
function arrayToRegexp(paths, keys1, options2) {
    const parts = paths.map((path2)=>pathToRegexp(path2, keys1, options2).source
    );
    return new RegExp(`(?:${parts.join("|")})`, flags(options2));
}
function stringToRegexp(path2, keys1, options2) {
    return tokensToRegexp(parse1(path2, options2), keys1, options2);
}
function tokensToRegexp(tokens, keys1, options2 = {
}) {
    const { strict =false , start =true , end =true , encode: encode1  } = options2;
    const endsWith = `[${escapeString(options2.endsWith || "")}]|$`;
    const delimiter1 = `[${escapeString(options2.delimiter || "/#?")}]`;
    let route = start ? "^" : "";
    for (const token of tokens){
        if (typeof token === "string") {
            route += escapeString(encode1(token));
        } else {
            const prefix = escapeString(encode1(token.prefix));
            const suffix = escapeString(encode1(token.suffix));
            if (token.pattern) {
                if (keys1) keys1.push(token);
                if (prefix || suffix) {
                    if (token.modifier === "+" || token.modifier === "*") {
                        const mod = token.modifier === "*" ? "?" : "";
                        route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`;
                    } else {
                        route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`;
                    }
                } else {
                    route += `(${token.pattern})${token.modifier}`;
                }
            } else {
                route += `(?:${prefix}${suffix})${token.modifier}`;
            }
        }
    }
    if (end) {
        if (!strict) route += `${delimiter1}?`;
        route += !options2.endsWith ? "$" : `(?=${endsWith})`;
    } else {
        const endToken = tokens[tokens.length - 1];
        const isEndDelimited = typeof endToken === "string" ? delimiter1.indexOf(endToken[endToken.length - 1]) > -1 : endToken === undefined;
        if (!strict) {
            route += `(?:${delimiter1}(?=${endsWith}))?`;
        }
        if (!isEndDelimited) {
            route += `(?=${delimiter1}|${endsWith})`;
        }
    }
    return new RegExp(route, flags(options2));
}
function pathToRegexp(path2, keys1, options2) {
    if (path2 instanceof RegExp) return regexpToRegexp(path2, keys1);
    if (Array.isArray(path2)) return arrayToRegexp(path2, keys1, options2);
    return stringToRegexp(path2, keys1, options2);
}
const compile1 = compile, pathToRegexp1 = pathToRegexp;
const Sha11 = Sha1, basename1 = basename, extname2 = extname1, join1 = join, isAbsolute1 = isAbsolute, normalize1 = normalize, parse2 = parse, sep1 = sep, equal2 = equal1, Status1 = Status, STATUS_TEXT1 = STATUS_TEXT;
const errorStatusMap = {
    "BadRequest": 400,
    "Unauthorized": 401,
    "PaymentRequired": 402,
    "Forbidden": 403,
    "NotFound": 404,
    "MethodNotAllowed": 405,
    "NotAcceptable": 406,
    "ProxyAuthRequired": 407,
    "RequestTimeout": 408,
    "Conflict": 409,
    "Gone": 410,
    "LengthRequired": 411,
    "PreconditionFailed": 412,
    "RequestEntityTooLarge": 413,
    "RequestURITooLong": 414,
    "UnsupportedMediaType": 415,
    "RequestedRangeNotSatisfiable": 416,
    "ExpectationFailed": 417,
    "Teapot": 418,
    "MisdirectedRequest": 421,
    "UnprocessableEntity": 422,
    "Locked": 423,
    "FailedDependency": 424,
    "UpgradeRequired": 426,
    "PreconditionRequired": 428,
    "TooManyRequests": 429,
    "RequestHeaderFieldsTooLarge": 431,
    "UnavailableForLegalReasons": 451,
    "InternalServerError": 500,
    "NotImplemented": 501,
    "BadGateway": 502,
    "ServiceUnavailable": 503,
    "GatewayTimeout": 504,
    "HTTPVersionNotSupported": 505,
    "VariantAlsoNegotiates": 506,
    "InsufficientStorage": 507,
    "LoopDetected": 508,
    "NotExtended": 510,
    "NetworkAuthenticationRequired": 511
};
class HttpError extends Error {
    expose = false;
    status = Status1.InternalServerError;
}
function createHttpErrorConstructor(status) {
    const name2 = `${Status1[status]}Error`;
    const Ctor = class extends HttpError {
        constructor(message){
            super();
            this.message = message || STATUS_TEXT1.get(status);
            this.status = status;
            this.expose = status >= 400 && status < 500 ? true : false;
            Object.defineProperty(this, "name", {
                configurable: true,
                enumerable: false,
                value: name2,
                writable: true
            });
        }
    };
    return Ctor;
}
const httpErrors = {
};
for (const [key1, value2] of Object.entries(errorStatusMap)){
    httpErrors[key1] = createHttpErrorConstructor(value2);
}
function createHttpError(status = 500, message) {
    return new httpErrors[Status1[status]](message);
}
function isHttpError(value3) {
    return value3 instanceof HttpError;
}
const SUBTYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_.-]{0,126}$/;
const TYPE_NAME_REGEXP = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}$/;
const TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
class MediaType {
    constructor(type1, subtype, suffix){
        this.type = type1;
        this.subtype = subtype;
        this.suffix = suffix;
    }
}
function format1(obj) {
    const { subtype: subtype1 , suffix: suffix1 , type: type1  } = obj;
    if (!TYPE_NAME_REGEXP.test(type1)) {
        throw new TypeError("Invalid type.");
    }
    if (!SUBTYPE_NAME_REGEXP.test(subtype1)) {
        throw new TypeError("Invalid subtype.");
    }
    let str1 = `${type1}/${subtype1}`;
    if (suffix1) {
        if (!TYPE_NAME_REGEXP.test(suffix1)) {
            throw new TypeError("Invalid suffix.");
        }
        str1 += `+${suffix1}`;
    }
    return str1;
}
function parse3(str1) {
    const match = TYPE_REGEXP.exec(str1.toLowerCase());
    if (!match) {
        throw new TypeError("Invalid media type.");
    }
    let [, type1, subtype1] = match;
    let suffix1;
    const idx = subtype1.lastIndexOf("+");
    if (idx !== -1) {
        suffix1 = subtype1.substr(idx + 1);
        subtype1 = subtype1.substr(0, idx);
    }
    return new MediaType(type1, subtype1, suffix1);
}
function mimeMatch(expected, actual) {
    if (expected === undefined) {
        return false;
    }
    const actualParts = actual.split("/");
    const expectedParts = expected.split("/");
    if (actualParts.length !== 2 || expectedParts.length !== 2) {
        return false;
    }
    const [actualType, actualSubtype] = actualParts;
    const [expectedType, expectedSubtype] = expectedParts;
    if (expectedType !== "*" && expectedType !== actualType) {
        return false;
    }
    if (expectedSubtype.substr(0, 2) === "*+") {
        return expectedSubtype.length <= actualSubtype.length + 1 && expectedSubtype.substr(1) === actualSubtype.substr(1 - expectedSubtype.length);
    }
    if (expectedSubtype !== "*" && expectedSubtype !== actualSubtype) {
        return false;
    }
    return true;
}
function normalize2(type1) {
    if (type1 === "urlencoded") {
        return "application/x-www-form-urlencoded";
    } else if (type1 === "multipart") {
        return "multipart/*";
    } else if (type1[0] === "+") {
        return `*/*${type1}`;
    }
    return type1.includes("/") ? type1 : lookup1(type1);
}
function normalizeType(value3) {
    try {
        const val = value3.split(";");
        const type1 = parse3(val[0]);
        return format1(type1);
    } catch  {
        return;
    }
}
function isMediaType(value3, types1) {
    const val = normalizeType(value3);
    if (!val) {
        return false;
    }
    if (!types1.length) {
        return val;
    }
    for (const type1 of types1){
        if (mimeMatch(normalize2(type1), val)) {
            return type1[0] === "+" || type1.includes("*") ? val : type1;
        }
    }
    return false;
}
const ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;
const HTAB = "\t".charCodeAt(0);
const SPACE = " ".charCodeAt(0);
const LF1 = "\n".charCodeAt(0);
const UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;
const UNMATCHED_SURROGATE_PAIR_REPLACE = "$1�$2";
function decodeComponent(text) {
    try {
        return decodeURIComponent(text);
    } catch  {
        return text;
    }
}
function encodeUrl(url) {
    return String(url).replace(UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE).replace(ENCODE_CHARS_REGEXP, encodeURI);
}
function getRandomFilename(prefix = "", extension2 = "") {
    return `${prefix}${new Sha11().update(crypto.getRandomValues(new Uint8Array(256))).hex()}${extension2 ? `.${extension2}` : ""}`;
}
function isErrorStatus(value3) {
    return [
        Status1.BadRequest,
        Status1.Unauthorized,
        Status1.PaymentRequired,
        Status1.Forbidden,
        Status1.NotFound,
        Status1.MethodNotAllowed,
        Status1.NotAcceptable,
        Status1.ProxyAuthRequired,
        Status1.RequestTimeout,
        Status1.Conflict,
        Status1.Gone,
        Status1.LengthRequired,
        Status1.PreconditionFailed,
        Status1.RequestEntityTooLarge,
        Status1.RequestURITooLong,
        Status1.UnsupportedMediaType,
        Status1.RequestedRangeNotSatisfiable,
        Status1.ExpectationFailed,
        Status1.Teapot,
        Status1.MisdirectedRequest,
        Status1.UnprocessableEntity,
        Status1.Locked,
        Status1.FailedDependency,
        Status1.UpgradeRequired,
        Status1.PreconditionRequired,
        Status1.TooManyRequests,
        Status1.RequestHeaderFieldsTooLarge,
        Status1.UnavailableForLegalReasons,
        Status1.InternalServerError,
        Status1.NotImplemented,
        Status1.BadGateway,
        Status1.ServiceUnavailable,
        Status1.GatewayTimeout,
        Status1.HTTPVersionNotSupported,
        Status1.VariantAlsoNegotiates,
        Status1.InsufficientStorage,
        Status1.LoopDetected,
        Status1.NotExtended,
        Status1.NetworkAuthenticationRequired, 
    ].includes(value3);
}
function isRedirectStatus(value3) {
    return [
        Status1.MultipleChoices,
        Status1.MovedPermanently,
        Status1.Found,
        Status1.SeeOther,
        Status1.UseProxy,
        Status1.TemporaryRedirect,
        Status1.PermanentRedirect, 
    ].includes(value3);
}
function isHtml(value3) {
    return /^\s*<(?:!DOCTYPE|html|body)/i.test(value3);
}
function skipLWSPChar(u8) {
    const result = new Uint8Array(u8.length);
    let j = 0;
    for(let i1 = 0; i1 < u8.length; i1++){
        if (u8[i1] === SPACE || u8[i1] === HTAB) continue;
        result[j++] = u8[i1];
    }
    return result.slice(0, j);
}
function stripEol(value3) {
    if (value3[value3.byteLength - 1] == LF1) {
        let drop = 1;
        return value3.subarray(0, value3.byteLength - drop);
    }
    return value3;
}
const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
function resolvePath(rootPath, relativePath) {
    let path2 = relativePath;
    let root = rootPath;
    if (relativePath === undefined) {
        path2 = rootPath;
        root = ".";
    }
    if (path2 == null) {
        throw new TypeError("Argument relativePath is required.");
    }
    if (path2.includes("\0")) {
        throw createHttpError(400, "Malicious Path");
    }
    if (isAbsolute1(path2)) {
        throw createHttpError(400, "Malicious Path");
    }
    if (UP_PATH_REGEXP.test(normalize1("." + sep1 + path2))) {
        throw createHttpError(403);
    }
    return normalize1(join1(root, path2));
}
const MIN_BUF_SIZE1 = 16;
const MAX_CONSECUTIVE_EMPTY_READS1 = 100;
const CR1 = "\r".charCodeAt(0);
const LF2 = "\n".charCodeAt(0);
class BufferFullError1 extends Error {
    name = "BufferFullError";
    constructor(partial1){
        super("Buffer full");
        this.partial = partial1;
    }
}
class BufReader1 {
    #buffer;
    #reader;
    #posRead=0;
    #posWrite=0;
    #eof=false;
    #fill=async ()=>{
        if (this.#posRead > 0) {
            this.#buffer.copyWithin(0, this.#posRead, this.#posWrite);
            this.#posWrite -= this.#posRead;
            this.#posRead = 0;
        }
        if (this.#posWrite >= this.#buffer.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i1 = MAX_CONSECUTIVE_EMPTY_READS1; i1 > 0; i1--){
            const rr = await this.#reader.read(this.#buffer.subarray(this.#posWrite));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert2(rr >= 0, "negative read");
            this.#posWrite += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS1} read() calls`);
    };
    #reset=(buffer, reader)=>{
        this.#buffer = buffer;
        this.#reader = reader;
        this.#eof = false;
    };
    constructor(rd2, size4 = DEFAULT_BUF_SIZE){
        if (size4 < MIN_BUF_SIZE1) {
            size4 = MIN_BUF_SIZE1;
        }
        this.#reset(new Uint8Array(size4), rd2);
    }
    buffered() {
        return this.#posWrite - this.#posRead;
    }
    async readLine(strip = true) {
        let line;
        try {
            line = await this.readSlice(LF2);
        } catch (err) {
            let { partial: partial2  } = err;
            assert2(partial2 instanceof Uint8Array, "Caught error from `readSlice()` without `partial` property");
            if (!(err instanceof BufferFullError1)) {
                throw err;
            }
            if (!this.#eof && partial2.byteLength > 0 && partial2[partial2.byteLength - 1] === CR1) {
                assert2(this.#posRead > 0, "Tried to rewind past start of buffer");
                this.#posRead--;
                partial2 = partial2.subarray(0, partial2.byteLength - 1);
            }
            return {
                bytes: partial2,
                eol: this.#eof
            };
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                bytes: line,
                eol: true
            };
        }
        if (strip) {
            line = stripEol(line);
        }
        return {
            bytes: line,
            eol: true
        };
    }
    async readSlice(delim) {
        let s = 0;
        let slice;
        while(true){
            let i1 = this.#buffer.subarray(this.#posRead + s, this.#posWrite).indexOf(delim);
            if (i1 >= 0) {
                i1 += s;
                slice = this.#buffer.subarray(this.#posRead, this.#posRead + i1 + 1);
                this.#posRead += i1 + 1;
                break;
            }
            if (this.#eof) {
                if (this.#posRead === this.#posWrite) {
                    return null;
                }
                slice = this.#buffer.subarray(this.#posRead, this.#posWrite);
                this.#posRead = this.#posWrite;
                break;
            }
            if (this.buffered() >= this.#buffer.byteLength) {
                this.#posRead = this.#posWrite;
                const newbuf = this.#buffer.slice(0);
                this.#buffer = newbuf;
                throw new BufferFullError1(oldbuf);
            }
            s = this.#posWrite - this.#posRead;
            try {
                await this.#fill();
            } catch (err) {
                err.partial = slice;
                throw err;
            }
        }
        return slice;
    }
}
const COLON = ":".charCodeAt(0);
const HTAB1 = "\t".charCodeAt(0);
const SPACE1 = " ".charCodeAt(0);
const decoder1 = new TextDecoder();
function toParamRegExp(attributePattern, flags1) {
    return new RegExp(`(?:^|;)\\s*${attributePattern}\\s*=\\s*` + `(` + `[^";\\s][^;\\s]*` + `|` + `"(?:[^"\\\\]|\\\\"?)+"?` + `)`, flags1);
}
async function readHeaders(body) {
    const headers = {
    };
    let readResult = await body.readLine();
    while(readResult){
        const { bytes  } = readResult;
        if (!bytes.length) {
            return headers;
        }
        let i1 = bytes.indexOf(COLON);
        if (i1 === -1) {
            throw new httpErrors.BadRequest(`Malformed header: ${decoder1.decode(bytes)}`);
        }
        const key2 = decoder1.decode(bytes.subarray(0, i1)).trim().toLowerCase();
        if (key2 === "") {
            throw new httpErrors.BadRequest("Invalid header key.");
        }
        i1++;
        while(i1 < bytes.byteLength && (bytes[i1] === SPACE1 || bytes[i1] === HTAB1)){
            i1++;
        }
        const value3 = decoder1.decode(bytes.subarray(i1)).trim();
        headers[key2] = value3;
        readResult = await body.readLine();
    }
    throw new httpErrors.BadRequest("Unexpected end of body reached.");
}
function unquote(value3) {
    if (value3.startsWith(`"`)) {
        const parts = value3.slice(1).split(`\\"`);
        for(let i1 = 0; i1 < parts.length; ++i1){
            const quoteIndex = parts[i1].indexOf(`"`);
            if (quoteIndex !== -1) {
                parts[i1] = parts[i1].slice(0, quoteIndex);
                parts.length = i1 + 1;
            }
            parts[i1] = parts[i1].replace(/\\(.)/g, "$1");
        }
        value3 = parts.join(`"`);
    }
    return value3;
}
let needsEncodingFixup = false;
function fixupEncoding(value3) {
    if (needsEncodingFixup && /[\x80-\xff]/.test(value3)) {
        value3 = textDecode("utf-8", value3);
        if (needsEncodingFixup) {
            value3 = textDecode("iso-8859-1", value3);
        }
    }
    return value3;
}
const FILENAME_STAR_REGEX = toParamRegExp("filename\\*", "i");
const FILENAME_START_ITER_REGEX = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
const FILENAME_REGEX = toParamRegExp("filename", "i");
function rfc2047decode(value3) {
    if (!value3.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(value3)) {
        return value3;
    }
    return value3.replace(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, (_, charset1, encoding, text)=>{
        if (encoding === "q" || encoding === "Q") {
            text = text.replace(/_/g, " ");
            text = text.replace(/=([0-9a-fA-F]{2})/g, (_1, hex)=>String.fromCharCode(parseInt(hex, 16))
            );
            return textDecode(charset1, text);
        }
        try {
            text = atob(text);
        } catch  {
        }
        return textDecode(charset1, text);
    });
}
function rfc2231getParam(header) {
    const matches = [];
    let match;
    while(match = FILENAME_START_ITER_REGEX.exec(header)){
        const [, ns, quote, part] = match;
        const n = parseInt(ns, 10);
        if (n in matches) {
            if (n === 0) {
                break;
            }
            continue;
        }
        matches[n] = [
            quote,
            part
        ];
    }
    const parts = [];
    for(let n = 0; n < matches.length; ++n){
        if (!(n in matches)) {
            break;
        }
        let [quote, part] = matches[n];
        part = unquote(part);
        if (quote) {
            part = unescape(part);
            if (n === 0) {
                part = rfc5987decode(part);
            }
        }
        parts.push(part);
    }
    return parts.join("");
}
function rfc5987decode(value3) {
    const encodingEnd = value3.indexOf(`'`);
    if (encodingEnd === -1) {
        return value3;
    }
    const encoding = value3.slice(0, encodingEnd);
    const langValue = value3.slice(encodingEnd + 1);
    return textDecode(encoding, langValue.replace(/^[^']*'/, ""));
}
function textDecode(encoding, value3) {
    if (encoding) {
        try {
            const decoder2 = new TextDecoder(encoding, {
                fatal: true
            });
            const bytes = Array.from(value3, (c)=>c.charCodeAt(0)
            );
            if (bytes.every((code2)=>code2 <= 255
            )) {
                value3 = decoder2.decode(new Uint8Array(bytes));
                needsEncodingFixup = false;
            }
        } catch  {
        }
    }
    return value3;
}
function getFilename(header) {
    needsEncodingFixup = true;
    let matches = FILENAME_STAR_REGEX.exec(header);
    if (matches) {
        const [, filename] = matches;
        return fixupEncoding(rfc2047decode(rfc5987decode(unescape(unquote(filename)))));
    }
    const filename = rfc2231getParam(header);
    if (filename) {
        return fixupEncoding(rfc2047decode(filename));
    }
    matches = FILENAME_REGEX.exec(header);
    if (matches) {
        const [, filename1] = matches;
        return fixupEncoding(rfc2047decode(unquote(filename1)));
    }
    return "";
}
const decoder2 = new TextDecoder();
const encoder1 = new TextEncoder();
const BOUNDARY_PARAM_REGEX = toParamRegExp("boundary", "i");
const DEFAULT_BUFFER_SIZE1 = 1048576;
const DEFAULT_MAX_FILE_SIZE = 10485760;
const DEFAULT_MAX_SIZE = 0;
const NAME_PARAM_REGEX = toParamRegExp("name", "i");
function append(a, b) {
    const ab = new Uint8Array(a.length + b.length);
    ab.set(a, 0);
    ab.set(b, a.length);
    return ab;
}
function isEqual(a, b) {
    return equal2(skipLWSPChar(a), b);
}
async function readToStartOrEnd(body, start, end) {
    let lineResult;
    while(lineResult = await body.readLine()){
        if (isEqual(lineResult.bytes, start)) {
            return true;
        }
        if (isEqual(lineResult.bytes, end)) {
            return false;
        }
    }
    throw new httpErrors.BadRequest("Unable to find multi-part boundary.");
}
async function* parts({ body , final , part , maxFileSize , maxSize , outPath , prefix  }) {
    async function getFile(contentType2) {
        const ext = extension1(contentType2);
        if (!ext) {
            throw new httpErrors.BadRequest(`Invalid media type for part: ${ext}`);
        }
        if (!outPath) {
            outPath = await Deno.makeTempDir();
        }
        const filename = `${outPath}/${getRandomFilename(prefix, ext)}`;
        const file = await Deno.open(filename, {
            write: true,
            createNew: true
        });
        return [
            filename,
            file
        ];
    }
    while(true){
        const headers = await readHeaders(body);
        const contentType2 = headers["content-type"];
        const contentDisposition = headers["content-disposition"];
        if (!contentDisposition) {
            throw new httpErrors.BadRequest("Form data part missing content-disposition header");
        }
        if (!contentDisposition.match(/^form-data;/i)) {
            throw new httpErrors.BadRequest(`Unexpected content-disposition header: "${contentDisposition}"`);
        }
        const matches = NAME_PARAM_REGEX.exec(contentDisposition);
        if (!matches) {
            throw new httpErrors.BadRequest(`Unable to determine name of form body part`);
        }
        let [, name2] = matches;
        name2 = unquote(name2);
        if (contentType2) {
            const originalName = getFilename(contentDisposition);
            let byteLength = 0;
            let file;
            let filename;
            let buf;
            if (maxSize) {
                buf = new Uint8Array();
            } else {
                const result = await getFile(contentType2);
                filename = result[0];
                file = result[1];
            }
            while(true){
                const readResult = await body.readLine(false);
                if (!readResult) {
                    throw new httpErrors.BadRequest("Unexpected EOF reached");
                }
                let { bytes  } = readResult;
                const strippedBytes = stripEol(bytes);
                if (isEqual(strippedBytes, part) || isEqual(strippedBytes, final)) {
                    if (file) {
                        file.close();
                    }
                    yield [
                        name2,
                        {
                            content: buf,
                            contentType: contentType2,
                            name: name2,
                            filename,
                            originalName
                        }, 
                    ];
                    if (isEqual(strippedBytes, final)) {
                        return;
                    }
                    break;
                }
                byteLength += bytes.byteLength;
                if (byteLength > maxFileSize) {
                    if (file) {
                        file.close();
                    }
                    throw new httpErrors.RequestEntityTooLarge(`File size exceeds limit of ${maxFileSize} bytes.`);
                }
                if (buf) {
                    if (byteLength > maxSize) {
                        const result = await getFile(contentType2);
                        filename = result[0];
                        file = result[1];
                        await Deno.writeAll(file, buf);
                        buf = undefined;
                    } else {
                        buf = append(buf, bytes);
                    }
                }
                if (file) {
                    await Deno.writeAll(file, bytes);
                }
            }
        } else {
            const lines = [];
            while(true){
                const readResult = await body.readLine();
                if (!readResult) {
                    throw new httpErrors.BadRequest("Unexpected EOF reached");
                }
                const { bytes  } = readResult;
                if (isEqual(bytes, part) || isEqual(bytes, final)) {
                    yield [
                        name2,
                        lines.join("\n")
                    ];
                    if (isEqual(bytes, final)) {
                        return;
                    }
                    break;
                }
                lines.push(decoder2.decode(bytes));
            }
        }
    }
}
class FormDataReader {
    #body;
    #boundaryFinal;
    #boundaryPart;
    #reading=false;
    constructor(contentType2, body){
        const matches = contentType2.match(BOUNDARY_PARAM_REGEX);
        if (!matches) {
            throw new httpErrors.BadRequest(`Content type "${contentType2}" does not contain a valid boundary.`);
        }
        let [, boundary] = matches;
        boundary = unquote(boundary);
        this.#boundaryPart = encoder1.encode(`--${boundary}`);
        this.#boundaryFinal = encoder1.encode(`--${boundary}--`);
        this.#body = body;
    }
    async read(options = {
    }) {
        if (this.#reading) {
            throw new Error("Body is already being read.");
        }
        this.#reading = true;
        const { outPath , maxFileSize =DEFAULT_MAX_FILE_SIZE , maxSize =DEFAULT_MAX_SIZE , bufferSize =DEFAULT_BUFFER_SIZE1 ,  } = options;
        const body1 = new BufReader1(this.#body, bufferSize);
        const result = {
            fields: {
            }
        };
        if (!await readToStartOrEnd(body1, this.#boundaryPart, this.#boundaryFinal)) {
            return result;
        }
        try {
            for await (const part of parts({
                body: body1,
                part: this.#boundaryPart,
                final: this.#boundaryFinal,
                maxFileSize,
                maxSize,
                outPath
            })){
                const [key2, value3] = part;
                if (typeof value3 === "string") {
                    result.fields[key2] = value3;
                } else {
                    if (!result.files) {
                        result.files = [];
                    }
                    result.files.push(value3);
                }
            }
        } catch (err) {
            if (err instanceof Deno.errors.PermissionDenied) {
                console.error(err.stack ? err.stack : `${err.name}: ${err.message}`);
            } else {
                throw err;
            }
        }
        return result;
    }
    async *stream(options = {
    }) {
        if (this.#reading) {
            throw new Error("Body is already being read.");
        }
        this.#reading = true;
        const { outPath , maxFileSize =DEFAULT_MAX_FILE_SIZE , maxSize =DEFAULT_MAX_SIZE , bufferSize =32000 ,  } = options;
        const body1 = new BufReader1(this.#body, bufferSize);
        if (!await readToStartOrEnd(body1, this.#boundaryPart, this.#boundaryFinal)) {
            return;
        }
    }
}
const defaultBodyContentTypes = {
    json: [
        "json",
        "application/*+json",
        "application/csp-report"
    ],
    form: [
        "urlencoded"
    ],
    formData: [
        "multipart"
    ],
    text: [
        "text"
    ]
};
const decoder3 = new TextDecoder();
class RequestBody {
    #body;
    #formDataReader;
    #has;
    #headers;
    #readAllBody;
    #type;
    #valuePromise=()=>{
        return this.#readAllBody ?? (this.#readAllBody = Deno.readAll(this.#body));
    };
    constructor(request1){
        const { body: body1 , headers  } = request1;
        this.#body = body1;
        this.#headers = headers;
    }
    get({ type , contentTypes  }) {
        if (type === "reader" && this.#type && this.#type !== "reader") {
            throw new TypeError("Body already consumed and cannot be returned as a reader.");
        }
        if (type === "form-data" && this.#type && this.#type !== "form-data") {
            throw new TypeError("Body already consumed and cannot be returned as form data.");
        }
        if (this.#type === "reader" && type !== "reader") {
            throw new TypeError("Body already consumed as a reader and can only be returned as a reader.");
        }
        if (this.#type === "form-data" && type !== "form-data") {
            throw new TypeError("Body already consumed as form data and can only be returned as form data.");
        }
        if (type && contentTypes) {
            throw new TypeError(`"type" and "contentTypes" cannot be specified at the same time`);
        }
        if (type === "reader") {
            this.#type = "reader";
            return {
                type,
                value: this.#body
            };
        }
        if (!this.has()) {
            this.#type = "undefined";
        } else if (!this.#type) {
            const encoding = this.#headers.get("content-encoding") ?? "identity";
            if (encoding !== "identity") {
                throw new httpErrors.UnsupportedMediaType(`Unsupported content-encoding: ${encoding}`);
            }
        }
        if (this.#type === "undefined") {
            if (type) {
                throw new TypeError(`Body is undefined and cannot be returned as "${type}".`);
            }
            return {
                type: "undefined",
                value: undefined
            };
        }
        if (!type) {
            const contentType3 = this.#headers.get("content-type");
            assert2(contentType3);
            contentTypes = contentTypes ?? {
            };
            const contentTypesJson = [
                ...defaultBodyContentTypes.json,
                ...contentTypes.json ?? [], 
            ];
            const contentTypesForm = [
                ...defaultBodyContentTypes.form,
                ...contentTypes.form ?? [], 
            ];
            const contentTypesFormData = [
                ...defaultBodyContentTypes.formData,
                ...contentTypes.formData ?? [], 
            ];
            const contentTypesText = [
                ...defaultBodyContentTypes.text,
                ...contentTypes.text ?? [], 
            ];
            if (contentTypes.raw && isMediaType(contentType3, contentTypes.raw)) {
                type = "raw";
            } else if (isMediaType(contentType3, contentTypesJson)) {
                type = "json";
            } else if (isMediaType(contentType3, contentTypesForm)) {
                type = "form";
            } else if (isMediaType(contentType3, contentTypesFormData)) {
                type = "form-data";
            } else if (isMediaType(contentType3, contentTypesText)) {
                type = "text";
            } else {
                type = "raw";
            }
        }
        assert2(type);
        let value3;
        switch(type){
            case "form":
                this.#type = "raw";
                value3 = async ()=>new URLSearchParams(decoder3.decode(await this.#valuePromise()).replace(/\+/g, " "))
                ;
                break;
            case "form-data":
                this.#type = "form-data";
                value3 = ()=>{
                    const contentType3 = this.#headers.get("content-type");
                    assert2(contentType3);
                    return this.#formDataReader ?? (this.#formDataReader = new FormDataReader(contentType3, this.#body));
                };
                break;
            case "json":
                this.#type = "raw";
                value3 = async ()=>JSON.parse(decoder3.decode(await this.#valuePromise()))
                ;
                break;
            case "raw":
                this.#type = "raw";
                value3 = ()=>this.#valuePromise()
                ;
                break;
            case "text":
                this.#type = "raw";
                value3 = async ()=>decoder3.decode(await this.#valuePromise())
                ;
                break;
            default:
                throw new TypeError(`Invalid body type: "${type}"`);
        }
        return {
            type,
            get value () {
                return value3();
            }
        };
    }
    has() {
        return this.#has !== undefined ? this.#has : this.#has = this.#headers.get("transfer-encoding") !== null || !!parseInt(this.#headers.get("content-length") ?? "", 10);
    }
}
function compareSpecs(a, b) {
    return b.q - a.q || (b.s ?? 0) - (a.s ?? 0) || (a.o ?? 0) - (b.o ?? 0) || a.i - b.i || 0;
}
function isQuality(spec) {
    return spec.q > 0;
}
const SIMPLE_CHARSET_REGEXP = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
function parseCharset(str1, i1) {
    const match = SIMPLE_CHARSET_REGEXP.exec(str1);
    if (!match) {
        return;
    }
    const [, charset1] = match;
    let q = 1;
    if (match[2]) {
        const params = match[2].split(";");
        for (const param of params){
            const [key2, value3] = param.trim().split("=");
            if (key2 === "q") {
                q = parseFloat(value3);
                break;
            }
        }
    }
    return {
        charset: charset1,
        q,
        i: i1
    };
}
function parseAcceptCharset(accept) {
    const accepts = accept.split(",");
    const result = [];
    for(let i1 = 0; i1 < accepts.length; i1++){
        const charset1 = parseCharset(accepts[i1].trim(), i1);
        if (charset1) {
            result.push(charset1);
        }
    }
    return result;
}
function getCharsetPriority(charset1, accepted, index) {
    let priority = {
        i: -1,
        o: -1,
        q: 0,
        s: 0
    };
    return priority;
}
function preferredCharsets(accept = "*", provided) {
    const accepts = parseAcceptCharset(accept);
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map((spec)=>spec.charset
        );
    }
    const priorities = provided.map((type2, index)=>getCharsetPriority(type2, accepts, index)
    );
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]
    );
}
const simpleEncodingRegExp = /^\s*([^\s;]+)\s*(?:;(.*))?$/;
function parseEncoding(str1, i1) {
    const match = simpleEncodingRegExp.exec(str1);
    if (!match) {
        return undefined;
    }
    const encoding = match[1];
    let q = 1;
    if (match[2]) {
        const params = match[2].split(";");
        for (const param of params){
            const p = param.trim().split("=");
            if (p[0] === "q") {
                q = parseFloat(p[1]);
                break;
            }
        }
    }
    return {
        encoding,
        q,
        i: i1
    };
}
function specify(encoding, spec, i1 = -1) {
    if (!spec.encoding) {
        return;
    }
    let s = 0;
    if (spec.encoding.toLocaleLowerCase() === encoding.toLocaleLowerCase()) {
    } else if (spec.encoding !== "*") {
        return;
    }
    return {
        i: i1,
        o: spec.i,
        q: spec.q,
        s
    };
}
function parseAcceptEncoding(accept) {
    const accepts = accept.split(",");
    const parsedAccepts = [];
    let hasIdentity = false;
    let minQuality = 1;
    for(let i1 = 0; i1 < accepts.length; i1++){
        const encoding = parseEncoding(accepts[i1].trim(), i1);
        if (encoding) {
            parsedAccepts.push(encoding);
            hasIdentity = hasIdentity || !!specify("identity", encoding);
        }
    }
    if (!hasIdentity) {
        parsedAccepts.push({
            encoding: "identity",
            q: minQuality,
            i: accepts.length - 1
        });
    }
    return parsedAccepts;
}
function getEncodingPriority(encoding, accepted, index) {
    let priority = {
        o: -1,
        q: 0,
        s: 0,
        i: 0
    };
    return priority;
}
function preferredEncodings(accept, provided) {
    const accepts = parseAcceptEncoding(accept);
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map((spec)=>spec.encoding
        );
    }
    const priorities = provided.map((type2, index)=>getEncodingPriority(type2, accepts, index)
    );
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]
    );
}
const SIMPLE_LANGUAGE_REGEXP = /^\s*([^\s\-;]+)(?:-([^\s;]+))?\s*(?:;(.*))?$/;
function parseLanguage(str1, i1) {
    const match = SIMPLE_LANGUAGE_REGEXP.exec(str1);
    if (!match) {
        return undefined;
    }
    const [, prefix, suffix1] = match;
    const full = suffix1 ? `${prefix}-${suffix1}` : prefix;
    let q = 1;
    if (match[3]) {
        const params = match[3].split(";");
        for (const param of params){
            const [key2, value3] = param.trim().split("=");
            if (key2 === "q") {
                q = parseFloat(value3);
                break;
            }
        }
    }
    return {
        prefix,
        suffix: suffix1,
        full,
        q,
        i: i1
    };
}
function parseAcceptLanguage(accept) {
    const accepts = accept.split(",");
    const result = [];
    for(let i1 = 0; i1 < accepts.length; i1++){
        const language = parseLanguage(accepts[i1].trim(), i1);
        if (language) {
            result.push(language);
        }
    }
    return result;
}
function getLanguagePriority(language, accepted, index) {
    let priority = {
        i: -1,
        o: -1,
        q: 0,
        s: 0
    };
    return priority;
}
function preferredLanguages(accept = "*", provided) {
    const accepts = parseAcceptLanguage(accept);
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map((spec)=>spec.full
        );
    }
    const priorities = provided.map((type2, index)=>getLanguagePriority(type2, accepts, index)
    );
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]
    );
}
const simpleMediaTypeRegExp = /^\s*([^\s\/;]+)\/([^;\s]+)\s*(?:;(.*))?$/;
function quoteCount(str1) {
    let count = 0;
    let index = 0;
    while((index = str1.indexOf(`"`, index)) !== -1){
        count++;
        index++;
    }
    return count;
}
function splitMediaTypes(accept) {
    const accepts = accept.split(",");
    let j = 0;
    for(let i1 = 1; i1 < accepts.length; i1++){
        if (quoteCount(accepts[j]) % 2 === 0) {
            accepts[++j] = accepts[i1];
        } else {
            accepts[j] += `,${accepts[i1]}`;
        }
    }
    accepts.length = j + 1;
    return accepts;
}
function splitParameters(str1) {
    const parameters = str1.split(";");
    let j = 0;
    for(let i1 = 1; i1 < parameters.length; i1++){
        if (quoteCount(parameters[j]) % 2 === 0) {
            parameters[++j] = parameters[i1];
        } else {
            parameters[j] += `;${parameters[i1]}`;
        }
    }
    parameters.length = j + 1;
    return parameters.map((p)=>p.trim()
    );
}
function splitKeyValuePair(str1) {
    const [key2, value3] = str1.split("=");
    return [
        key2.toLowerCase(),
        value3
    ];
}
function parseMediaType(str1, i1) {
    const match = simpleMediaTypeRegExp.exec(str1);
    if (!match) {
        return;
    }
    const params = Object.create(null);
    let q = 1;
    const [, type2, subtype1, parameters] = match;
    if (parameters) {
        const kvps = splitParameters(parameters).map(splitKeyValuePair);
        for (const [key2, val] of kvps){
            const value3 = val && val[0] === `"` && val[val.length - 1] === `"` ? val.substr(1, val.length - 2) : val;
            if (key2 === "q" && value3) {
                q = parseFloat(value3);
                break;
            }
            params[key2] = value3;
        }
    }
    return {
        type: type2,
        subtype: subtype1,
        params,
        q,
        i: i1
    };
}
function parseAccept(accept) {
    const accepts = splitMediaTypes(accept);
    const mediaTypes = [];
    for(let i1 = 0; i1 < accepts.length; i1++){
        const mediaType = parseMediaType(accepts[i1].trim(), i1);
        if (mediaType) {
            mediaTypes.push(mediaType);
        }
    }
    return mediaTypes;
}
function getFullType(spec) {
    return `${spec.type}/${spec.subtype}`;
}
function getMediaTypePriority(type2, accepted, index) {
    let priority = {
        o: -1,
        q: 0,
        s: 0,
        i: index
    };
    return priority;
}
function preferredMediaTypes(accept, provided) {
    const accepts = parseAccept(accept === undefined ? "*/*" : accept || "");
    if (!provided) {
        return accepts.filter(isQuality).sort(compareSpecs).map(getFullType);
    }
    const priorities = provided.map((type2, index)=>{
        return getMediaTypePriority(type2, accepts, index);
    });
    return priorities.filter(isQuality).sort(compareSpecs).map((priority)=>provided[priorities.indexOf(priority)]
    );
}
class Request1 {
    #body;
    #proxy;
    #secure;
    #serverRequest;
    #url;
    get hasBody() {
        return this.#body.has();
    }
    get headers() {
        return this.#serverRequest.headers;
    }
    get ip() {
        return this.#proxy ? this.ips[0] : this.#serverRequest.conn.remoteAddr.hostname;
    }
    get ips() {
        return this.#proxy ? (this.#serverRequest.headers.get("x-forwarded-for") ?? this.#serverRequest.conn.remoteAddr.hostname).split(/\s*,\s*/) : [];
    }
    get method() {
        return this.#serverRequest.method;
    }
    get secure() {
        return this.#secure;
    }
    get serverRequest() {
        return this.#serverRequest;
    }
    get url() {
        if (!this.#url) {
            const serverRequest = this.#serverRequest;
            let proto;
            let host;
            if (this.#proxy) {
                proto = serverRequest.headers.get("x-forwarded-proto")?.split(/\s*,\s*/, 1)[0] ?? "http";
                host = serverRequest.headers.get("x-forwarded-host") ?? serverRequest.headers.get("host") ?? "";
            } else {
                proto = this.#secure ? "https" : "http";
                host = serverRequest.headers.get("host") ?? "";
            }
            this.#url = new URL(`${proto}://${host}${serverRequest.url}`);
        }
        return this.#url;
    }
    constructor(serverRequest, proxy = false, secure1 = false){
        this.#proxy = proxy;
        this.#secure = secure1;
        this.#serverRequest = serverRequest;
        this.#body = new RequestBody(serverRequest);
    }
    accepts(...types) {
        const acceptValue = this.#serverRequest.headers.get("Accept");
        if (!acceptValue) {
            return;
        }
        if (types.length) {
            return preferredMediaTypes(acceptValue, types)[0];
        }
        return preferredMediaTypes(acceptValue);
    }
    acceptsCharsets(...charsets) {
        const acceptCharsetValue = this.#serverRequest.headers.get("Accept-Charset");
        if (!acceptCharsetValue) {
            return;
        }
        if (charsets.length) {
            return preferredCharsets(acceptCharsetValue, charsets)[0];
        }
        return preferredCharsets(acceptCharsetValue);
    }
    acceptsEncodings(...encodings) {
        const acceptEncodingValue = this.#serverRequest.headers.get("Accept-Encoding");
        if (!acceptEncodingValue) {
            return;
        }
        if (encodings.length) {
            return preferredEncodings(acceptEncodingValue, encodings)[0];
        }
        return preferredEncodings(acceptEncodingValue);
    }
    acceptsLanguages(...langs) {
        const acceptLanguageValue = this.#serverRequest.headers.get("Accept-Language");
        if (!acceptLanguageValue) {
            return;
        }
        if (langs.length) {
            return preferredLanguages(acceptLanguageValue, langs)[0];
        }
        return preferredLanguages(acceptLanguageValue);
    }
    body(options = {
    }) {
        return this.#body.get(options);
    }
}
const REDIRECT_BACK = Symbol("redirect backwards");
const BODY_TYPES = [
    "string",
    "number",
    "bigint",
    "boolean",
    "symbol"
];
const encoder2 = new TextEncoder();
function isReader(value3) {
    return value3 && typeof value3 === "object" && "read" in value3 && typeof value3.read === "function";
}
async function convertBody(body2, type2) {
    let result;
    if (BODY_TYPES.includes(typeof body2)) {
        const bodyText = String(body2);
        result = encoder2.encode(bodyText);
        type2 = type2 ?? (isHtml(bodyText) ? "html" : "text/plain");
    } else if (body2 instanceof Uint8Array || isReader(body2)) {
        result = body2;
    } else if (body2 && typeof body2 === "object") {
        result = encoder2.encode(JSON.stringify(body2));
        type2 = type2 ?? "json";
    } else if (typeof body2 === "function") {
        const result1 = body2.call(null);
        return convertBody(await result1, type2);
    } else if (body2) {
        throw new TypeError("Response body was set but could not convert.");
    }
    return [
        result,
        type2
    ];
}
class Response1 {
    #body;
    #headers=new Headers();
    #request;
    #resources=[];
    #serverResponse;
    #status;
    #type;
    #writable=true;
    #getBody=async ()=>{
        const [body2, type2] = await convertBody(this.body, this.type);
        this.type = type2;
        return body2;
    };
    #setContentType=()=>{
        if (this.type) {
            const contentTypeString = contentType1(this.type);
            if (contentTypeString && !this.headers.has("Content-Type")) {
                this.headers.append("Content-Type", contentTypeString);
            }
        }
    };
    get body() {
        return this.#body;
    }
    set body(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#body = value;
    }
    get headers() {
        return this.#headers;
    }
    set headers(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#headers = value;
    }
    get status() {
        if (this.#status) {
            return this.#status;
        }
        const typeofbody = typeof this.body;
        return this.body && (BODY_TYPES.includes(typeofbody) || typeofbody === "object") ? Status1.OK : Status1.NotFound;
    }
    set status(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#status = value;
    }
    get type() {
        return this.#type;
    }
    set type(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#type = value;
    }
    get writable() {
        return this.#writable;
    }
    constructor(request2){
        this.#request = request2;
    }
    addResource(rid) {
        this.#resources.push(rid);
    }
    destroy() {
        this.#writable = false;
        this.#body = undefined;
        this.#serverResponse = undefined;
        for (const rid of this.#resources){
            Deno.close(rid);
        }
    }
    redirect(url, alt = "/") {
        if (url === REDIRECT_BACK) {
            url = this.#request.headers.get("Referrer") ?? String(alt);
        } else if (typeof url === "object") {
            url = String(url);
        }
        this.headers.set("Location", encodeUrl(url));
        if (!this.status || !isRedirectStatus(this.status)) {
            this.status = Status1.Found;
        }
        if (this.#request.accepts("html")) {
            url = encodeURI(url);
            this.type = "text/html; charset=utf-8";
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        this.type = "text/plain; charset=utf-8";
        this.body = `Redirecting to ${url}.`;
    }
    async toServerResponse() {
        if (this.#serverResponse) {
            return this.#serverResponse;
        }
        const body2 = await this.#getBody();
        this.#setContentType();
        const { headers: headers1  } = this;
        if (!(body2 || headers1.has("Content-Type") || headers1.has("Content-Length"))) {
            headers1.append("Content-Length", "0");
        }
        this.#writable = false;
        return this.#serverResponse = {
            status: this.#status ?? (body2 ? Status1.OK : Status1.NotFound),
            body: body2,
            headers: headers1
        };
    }
}
function isHidden(path2) {
    const pathArr = path2.split("/");
    for (const segment of pathArr){
        if (segment[0] === "." && segment !== "." && segment !== "..") {
            return true;
        }
        return false;
    }
}
async function exists(path2) {
    try {
        return (await Deno.stat(path2)).isFile;
    } catch  {
        return false;
    }
}
async function send({ request: request3 , response: response1  }, path2, options2 = {
    root: ""
}) {
    const { brotli =true , extensions: extensions1 , format: format2 , gzip =true , hidden =false , immutable =false , index , maxage =0 , root ,  } = options2;
    const trailingSlash = path2[path2.length - 1] === "/";
    path2 = decodeComponent(path2.substr(parse2(path2).root.length));
    if (index && trailingSlash) {
        path2 += index;
    }
    if (!hidden && isHidden(path2)) {
        throw createHttpError(403);
    }
    path2 = resolvePath(root, path2);
    let encodingExt = "";
    if (brotli && request3.acceptsEncodings("br", "identity") === "br" && await exists(`${path2}.br`)) {
        path2 = `${path2}.br`;
        response1.headers.set("Content-Encoding", "br");
        response1.headers.delete("Content-Length");
    } else if (gzip && request3.acceptsEncodings("gzip", "identity") === "gzip" && await exists(`${path2}.gz`)) {
        path2 = `${path2}.gz`;
        response1.headers.set("Content-Encoding", "gzip");
        response1.headers.delete("Content-Length");
    }
    if (extensions1 && !/\.[^/]*$/.exec(path2)) {
        for (let ext of extensions1){
            if (await exists(`${path2}${ext}`)) {
                path2 += ext;
                break;
            }
        }
    }
    let stats;
    try {
        stats = await Deno.stat(path2);
        if (stats.isDirectory) {
            if (format2 && index) {
                path2 += `/${index}`;
                stats = await Deno.stat(path2);
            } else {
                return;
            }
        }
    } catch (err) {
        if (err instanceof Deno.errors.NotFound) {
            throw createHttpError(404, err.message);
        }
        throw createHttpError(500, err.message);
    }
    response1.headers.set("Content-Length", String(stats.size));
    if (!response1.headers.has("Last-Modified") && stats.mtime) {
        response1.headers.set("Last-Modified", stats.mtime.toUTCString());
    }
    if (!response1.headers.has("Cache-Control")) {
        const directives = [
            `max-age=${maxage / 1000 | 0}`
        ];
        if (immutable) {
            directives.push("immutable");
        }
        response1.headers.set("Cache-Control", directives.join(","));
    }
    if (!response1.type) {
        response1.type = encodingExt !== "" ? extname2(basename1(path2, encodingExt)) : extname2(path2);
    }
    const file = await Deno.open(path2, {
        read: true
    });
    response1.addResource(file.rid);
    response1.body = file;
    return path2;
}
const encoder3 = new TextEncoder();
class CloseEvent1 extends Event {
    constructor(eventInit){
        super("close", eventInit);
    }
}
class ServerSentEvent extends Event {
    #data;
    #id;
    #type;
    constructor(type2, data1, { replacer , space , ...eventInit1 } = {
    }){
        super(type2, eventInit1);
        this.#type = type2;
        try {
            this.#data = typeof data1 === "string" ? data1 : JSON.stringify(data1, replacer, space);
        } catch (e) {
            assert2(e instanceof Error);
            throw new TypeError(`data could not be coerced into a serialized string.\n  ${e.message}`);
        }
        const { id  } = eventInit1;
        this.#id = id;
    }
    get data() {
        return this.#data;
    }
    get id() {
        return this.#id;
    }
    toString() {
        const data1 = `data: ${this.#data.split("\n").join("\ndata: ")}\n`;
        return `${this.#type === "__message" ? "" : `event: ${this.#type}\n`}${this.#id ? `id: ${String(this.#id)}\n` : ""}${data1}\n`;
    }
}
const response1 = `HTTP/1.1 200 OK\n`;
const responseHeaders = new Headers([
    [
        "Connection",
        "Keep-Alive"
    ],
    [
        "Content-Type",
        "text/event-stream"
    ],
    [
        "Cache-Control",
        "no-cache"
    ],
    [
        "Keep-Alive",
        `timeout=${Number.MAX_SAFE_INTEGER}`
    ], 
]);
class ServerSentEventTarget extends EventTarget {
    #app;
    #closed=false;
    #prev=Promise.resolve();
    #ready;
    #serverRequest;
    #writer;
    #send=async (payload, prev)=>{
        if (this.#closed) {
            return;
        }
        if (this.#ready !== true) {
            await this.#ready;
            this.#ready = true;
        }
        try {
            await this.#writer.write(encoder3.encode(payload));
            await this.#writer.flush();
        } catch (error) {
            this.dispatchEvent(new CloseEvent1({
                cancelable: false
            }));
            const errorEvent = new ErrorEvent("error", {
                error
            });
            this.dispatchEvent(errorEvent);
            this.#app.dispatchEvent(errorEvent);
        }
    };
    #setup=async (overrideHeaders)=>{
        const headers1 = new Headers(responseHeaders);
        if (overrideHeaders) {
            for (const [key2, value3] of overrideHeaders){
                headers1.set(key2, value3);
            }
        }
        let payload = response1;
        payload += `\n`;
        try {
            await this.#writer.write(encoder3.encode(payload));
            await this.#writer.flush();
        } catch (error) {
            this.dispatchEvent(new CloseEvent1({
                cancelable: false
            }));
            const errorEvent = new ErrorEvent("error", {
                error
            });
            this.dispatchEvent(errorEvent);
            this.#app.dispatchEvent(errorEvent);
            throw error;
        }
    };
    get closed() {
        return this.#closed;
    }
    constructor(app, serverRequest1, { headers: headers1  } = {
    }){
        super();
        this.#app = app;
        this.#serverRequest = serverRequest1;
        this.#writer = this.#serverRequest.w;
        this.addEventListener("close", ()=>{
            this.#closed = true;
            try {
                this.#serverRequest.conn.close();
            } catch (error) {
                if (!(error instanceof Deno.errors.BadResource)) {
                    const errorEvent = new ErrorEvent("error", {
                        error
                    });
                    this.dispatchEvent(errorEvent);
                    this.#app.dispatchEvent(errorEvent);
                }
            }
        });
        this.#ready = this.#setup(headers1);
    }
    async close() {
        if (this.#ready !== true) {
            await this.#ready;
        }
        await this.#prev;
        this.dispatchEvent(new CloseEvent1({
            cancelable: false
        }));
    }
    dispatchComment(comment) {
        this.#prev = this.#send(`: ${comment.split("\n").join("\n: ")}\n\n`, this.#prev);
        return true;
    }
    dispatchMessage(data) {
        const event = new ServerSentEvent("__message", data);
        return this.dispatchEvent(event);
    }
    dispatchEvent(event) {
        let dispatched = super.dispatchEvent(event);
        if (dispatched && event instanceof ServerSentEvent) {
            this.#prev = this.#send(String(event), this.#prev);
        }
        return dispatched;
    }
}
class Context {
    #socket;
    #sse;
    get isUpgradable() {
        return acceptable1(this.request);
    }
    get socket() {
        return this.#socket;
    }
    constructor(app1, serverRequest2, secure2 = false){
        this.app = app1;
        this.state = app1.state;
        this.request = new Request1(serverRequest2, app1.proxy, secure2);
        this.respond = true;
        this.response = new Response1(this.request);
        this.cookies = new Cookies(this.request, this.response, {
            keys: this.app.keys,
            secure: this.request.secure
        });
    }
    assert(condition, errorStatus = 500, message, props) {
        if (condition) {
            return;
        }
        const err = createHttpError(errorStatus, message);
        if (props) {
            Object.assign(err, props);
        }
        throw err;
    }
    send(options) {
        const { path: path2 , ...sendOptions } = options;
        return send(this, path2, sendOptions);
    }
    sendEvents(options) {
        if (this.#sse) {
            return this.#sse;
        }
        this.respond = false;
        return this.#sse = new ServerSentEventTarget(this.app, this.request.serverRequest, options);
    }
    throw(errorStatus, message, props) {
        const err = createHttpError(errorStatus, message);
        if (props) {
            Object.assign(err, props);
        }
        throw err;
    }
    async upgrade() {
        if (this.#socket) {
            return this.#socket;
        }
        const { conn: conn1 , r: bufReader1 , w: bufWriter1 , headers: headers2  } = this.request.serverRequest;
        this.#socket = await acceptWebSocket1({
            conn: conn1,
            bufReader: bufReader1,
            bufWriter: bufWriter1,
            headers: headers2
        });
        this.respond = false;
        return this.#socket;
    }
}
function compareArrayBuffer(a, b) {
    assert2(a.byteLength === b.byteLength, "ArrayBuffer lengths must match.");
    const va = new DataView(a);
    const vb = new DataView(b);
    const length = va.byteLength;
    let out = 0;
    let i1 = -1;
    while((++i1) < length){
        out |= va.getUint8(i1) ^ vb.getUint8(i1);
    }
    return out === 0;
}
function compare(a, b) {
    const key2 = new Uint8Array(32);
    globalThis.crypto.getRandomValues(key2);
    const ah = new HmacSha2561(key2).update(a).arrayBuffer();
    const bh = new HmacSha2561(key2).update(b).arrayBuffer();
    return compareArrayBuffer(ah, bh);
}
const replacements = {
    "/": "_",
    "+": "-",
    "=": ""
};
class KeyStack {
    #keys;
    constructor(keys1){
        if (!(0 in keys1)) {
            throw new TypeError("keys must contain at least one value");
        }
        this.#keys = keys1;
    }
    #sign=(data2, key2)=>{
        return btoa(String.fromCharCode.apply(undefined, new Uint8Array(new HmacSha2561(key2).update(data2).arrayBuffer()))).replace(/\/|\+|=/g, (c)=>replacements[c]
        );
    };
    sign(data) {
        return this.#sign(data, this.#keys[0]);
    }
    verify(data, digest) {
        return this.indexOf(data, digest) > -1;
    }
    indexOf(data, digest) {
        for(let i1 = 0; i1 < this.#keys.length; i1++){
            if (compare(digest, this.#sign(data, this.#keys[i1]))) {
                return i1;
            }
        }
        return -1;
    }
}
function compose(middleware) {
    return function composedMiddleware(context, next) {
        let index = -1;
        async function dispatch(i1) {
            if (i1 <= index) {
                throw new Error("next() called multiple times.");
            }
            index = i1;
            let fn = middleware[i1];
            if (i1 === middleware.length) {
                fn = next;
            }
            if (!fn) {
                return;
            }
            await fn(context, dispatch.bind(null, i1 + 1));
        }
        return dispatch(0);
    };
}
function assertPath(path2) {
    if (typeof path2 !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path2)}`);
    }
}
function isPosixPathSeparator(code2) {
    return code2 === CHAR_FORWARD_SLASH;
}
function isPathSeparator(code2) {
    return isPosixPathSeparator(code2) || code2 === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code2) {
    return code2 >= CHAR_LOWERCASE_A && code2 <= CHAR_LOWERCASE_Z || code2 >= CHAR_UPPERCASE_A && code2 <= CHAR_UPPERCASE_Z;
}
function normalizeString(path2, allowAboveRoot, separator, isPathSeparator1) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code2;
    for(let i1 = 0, len = path2.length; i1 <= len; ++i1){
        if (i1 < len) code2 = path2.charCodeAt(i1);
        else if (isPathSeparator1(code2)) break;
        else code2 = CHAR_FORWARD_SLASH;
        if (isPathSeparator1(code2)) {
            if (lastSlash === i1 - 1 || dots === 1) {
            } else if (lastSlash !== i1 - 1 && dots === 2) {
                if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        } else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i1;
                        dots = 0;
                        continue;
                    } else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i1;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0) res += `${separator}..`;
                    else res = "..";
                    lastSegmentLength = 2;
                }
            } else {
                if (res.length > 0) res += separator + path2.slice(lastSlash + 1, i1);
                else res = path2.slice(lastSlash + 1, i1);
                lastSegmentLength = i1 - lastSlash - 1;
            }
            lastSlash = i1;
            dots = 0;
        } else if (code2 === CHAR_DOT && dots !== -1) {
            ++dots;
        } else {
            dots = -1;
        }
    }
    return res;
}
function _format1(sep2, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir) return base;
    if (dir === pathObject.root) return dir + base;
    return dir + sep2 + base;
}
function resolve1(...pathSegments) {
    let resolvedDevice = "";
    let resolvedTail = "";
    let resolvedAbsolute = false;
    for(let i1 = pathSegments.length - 1; i1 >= -1; i1--){
        let path2;
        if (i1 >= 0) {
            path2 = pathSegments[i1];
        } else if (!resolvedDevice) {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a drive-letter-less path without a CWD.");
            }
            path2 = Deno.cwd();
        } else {
            if (globalThis.Deno == null) {
                throw new TypeError("Resolved a relative path without a CWD.");
            }
            path2 = Deno.env.get(`=${resolvedDevice}`) || Deno.cwd();
            if (path2 === undefined || path2.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                path2 = `${resolvedDevice}\\`;
            }
        }
        assertPath(path2);
        const len = path2.length;
        if (len === 0) continue;
        let rootEnd = 0;
        let device = "";
        const code2 = path2.charCodeAt(0);
        if (len > 1) {
            if (isPathSeparator(code2)) {
                if (isPathSeparator(path2.charCodeAt(1))) {
                    let j = 2;
                    let last = j;
                    for(; j < len; ++j){
                        if (isPathSeparator(path2.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path2.slice(last, j);
                        last = j;
                        for(; j < len; ++j){
                            if (!isPathSeparator(path2.charCodeAt(j))) break;
                        }
                        if (j < len && j !== last) {
                            last = j;
                            for(; j < len; ++j){
                                if (isPathSeparator(path2.charCodeAt(j))) break;
                            }
                            if (j === len) {
                                device = `\\\\${firstPart}\\${path2.slice(last)}`;
                            } else if (j !== last) {
                                device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
                            }
                        }
                    }
                } else {
                }
            } else if (isWindowsDeviceRoot(code2)) {
                if (path2.charCodeAt(1) === CHAR_COLON) {
                    device = path2.slice(0, 2);
                }
            }
        } else if (isPathSeparator(code2)) {
        }
        if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
            continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
            resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
            resolvedTail = `${path2.slice(rootEnd)}\\${resolvedTail}`;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) break;
    }
    resolvedTail = normalizeString(resolvedTail, !resolvedAbsolute, "\\", isPathSeparator);
    return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}
function normalize3(path2) {
    assertPath(path2);
    const len = path2.length;
    if (len === 0) return ".";
    let rootEnd = 0;
    let device;
    let isAbsolute2 = false;
    const code2 = path2.charCodeAt(0);
    if (len > 1) {
        if (isPathSeparator(code2)) {
            if (isPathSeparator(path2.charCodeAt(1))) {
                let j = 2;
                let last = j;
                for(; j < len; ++j){
                    if (isPathSeparator(path2.charCodeAt(j))) break;
                }
                if (j < len && j !== last) {
                    const firstPart = path2.slice(last, j);
                    last = j;
                    for(; j < len; ++j){
                        if (!isPathSeparator(path2.charCodeAt(j))) break;
                    }
                    if (j < len && j !== last) {
                        last = j;
                        for(; j < len; ++j){
                            if (isPathSeparator(path2.charCodeAt(j))) break;
                        }
                        if (j === len) {
                            return `\\\\${firstPart}\\${path2.slice(last)}\\`;
                        } else if (j !== last) {
                            device = `\\\\${firstPart}\\${path2.slice(last, j)}`;
                        }
                    }
                }
            } else {
            }
        } else if (isWindowsDeviceRoot(code2)) {
            if (path2.charCodeAt(1) === CHAR_COLON) {
                device = path2.slice(0, 2);
            }
        }
    } else if (isPathSeparator(code2)) {
        return "\\";
    }
    let tail;
    if (rootEnd < len) {
        tail = normalizeString(path2.slice(rootEnd), !isAbsolute2, "\\", isPathSeparator);
    } else {
        tail = "";
    }
    if (tail.length === 0 && !isAbsolute2) tail = ".";
    if (tail.length > 0 && isPathSeparator(path2.charCodeAt(len - 1))) {
        tail += "\\";
    }
    if (device === undefined) {
        if (isAbsolute2) {
            if (tail.length > 0) return `\\${tail}`;
            else return "\\";
        } else if (tail.length > 0) {
            return tail;
        } else {
            return "";
        }
    } else if (isAbsolute2) {
        if (tail.length > 0) return `${device}\\${tail}`;
        else return `${device}\\`;
    } else if (tail.length > 0) {
        return device + tail;
    } else {
        return device;
    }
}
function isOptionsTls(options2) {
    return options2.secure === true;
}
const ADDR_REGEXP = /^\[?([^\]]*)\]?:([0-9]{1,5})$/;
class ApplicationErrorEvent extends ErrorEvent {
    constructor(eventInitDict){
        super("error", eventInitDict);
        this.context = eventInitDict.context;
    }
}
class ApplicationListenEvent extends Event {
    constructor(eventInitDict1){
        super("listen", eventInitDict1);
        this.hostname = eventInitDict1.hostname;
        this.port = eventInitDict1.port;
        this.secure = eventInitDict1.secure;
    }
}
export class Application extends EventTarget {
    #composedMiddleware;
    #keys;
    #middleware=[];
    #serve;
    #serveTls;
    get keys() {
        return this.#keys;
    }
    set keys(keys) {
        if (!keys) {
            this.#keys = undefined;
            return;
        } else if (Array.isArray(keys)) {
            this.#keys = new KeyStack(keys);
        } else {
            this.#keys = keys;
        }
    }
    constructor(options2 = {
    }){
        super();
        const { state , keys: keys3 , proxy: proxy1 , serve: serve1 , serveTls =defaultServeTls ,  } = options2;
        this.proxy = proxy1 ?? false;
        this.keys = keys3;
        this.state = state ?? {
        };
        this.#serve = serve1;
        this.#serveTls = serveTls;
    }
    #getComposed=()=>{
        if (!this.#composedMiddleware) {
            this.#composedMiddleware = compose(this.#middleware);
        }
        return this.#composedMiddleware;
    };
    #handleError=(context, error)=>{
        if (!(error instanceof Error)) {
            error = new Error(`non-error thrown: ${JSON.stringify(error)}`);
        }
        const { message  } = error;
        this.dispatchEvent(new ApplicationErrorEvent({
            context,
            message,
            error
        }));
        if (!context.response.writable) {
            return;
        }
        for (const key2 of context.response.headers.keys()){
            context.response.headers.delete(key2);
        }
        if (error.headers && error.headers instanceof Headers) {
            for (const [key3, value3] of error.headers){
                context.response.headers.set(key3, value3);
            }
        }
        context.response.type = "text";
        const status = context.response.status = error instanceof Deno.errors.NotFound ? 404 : error.status && typeof error.status === "number" ? error.status : 500;
        context.response.body = error.expose ? error.message : STATUS_TEXT1.get(status);
    };
    #handleRequest=async (request3, secure3, state1)=>{
        const context = new Context(this, request3, secure3);
        let resolve2;
        const handlingPromise = new Promise((res)=>resolve2 = res
        );
        state1.handling.add(handlingPromise);
        if (!state1.closing && !state1.closed) {
            try {
                await this.#getComposed()(context);
            } catch (err) {
                this.#handleError(context, err);
            }
        }
        if (context.respond === false) {
            context.response.destroy();
            resolve2();
            state1.handling.delete(handlingPromise);
            return;
        }
        try {
            await request3.respond(await context.response.toServerResponse());
            if (state1.closing) {
                state1.server.close();
                state1.closed = true;
            }
        } catch (err) {
            this.#handleError(context, err);
        } finally{
            context.response.destroy();
            resolve2();
            state1.handling.delete(handlingPromise);
        }
    };
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
    handle = async (request3, secure3 = false)=>{
        if (!this.#middleware.length) {
            throw new TypeError("There is no middleware to process requests.");
        }
        const context = new Context(this, request3, secure3);
        try {
            await this.#getComposed()(context);
        } catch (err) {
            this.#handleError(context, err);
        }
        if (context.respond === false) {
            context.response.destroy();
            return;
        }
        try {
            const response2 = await context.response.toServerResponse();
            context.response.destroy();
            return response2;
        } catch (err) {
            this.#handleError(context, err);
            throw err;
        }
    };
    async listen(options) {
        if (!this.#middleware.length) {
            throw new TypeError("There is no middleware to process requests.");
        }
        if (typeof options === "string") {
            const match = ADDR_REGEXP.exec(options);
            if (!match) {
                throw TypeError(`Invalid address passed: "${options}"`);
            }
            const [, hostname, portStr] = match;
            options = {
                hostname,
                port: parseInt(portStr, 10)
            };
        }
        const server = isOptionsTls(options) ? this.#serveTls(options) : this.#serve(options);
        const { signal  } = options;
        const state1 = {
            closed: false,
            closing: false,
            handling: new Set(),
            server
        };
        if (signal) {
            signal.addEventListener("abort", ()=>{
                if (!state1.handling.size) {
                    server.close();
                    state1.closed = true;
                }
                state1.closing = true;
            });
        }
        const { hostname , port , secure: secure3  } = options;
        this.dispatchEvent(new ApplicationListenEvent({
            hostname,
            port,
            secure: secure3
        }));
        try {
            for await (const request3 of server){
                this.#handleRequest(request3, secure3, state1);
            }
            await Promise.all(state1.handling);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Application Error";
            this.dispatchEvent(new ApplicationErrorEvent({
                message,
                error
            }));
        }
    }
    use(...middleware) {
        this.#middleware.push(...middleware);
        this.#composedMiddleware = undefined;
        return this;
    }
}
export { Application };
export { Context };
function isRouterContext(value3) {
    return "params" in value3;
}
// export * as helpers;
export { Cookies };
export { HttpError, httpErrors, isHttpError };
export { compose as composeMiddleware };
export { FormDataReader };
export { Request1 as Request };
export { Response1 as Response, REDIRECT_BACK };
function toUrl(url, params = {
}, options3) {
    let replace = {
    };
    const toPath = compile1(url, options3);
    let replaced = toPath(replace);
    if (options3 && options3.query) {
        const url1 = new URL(replaced, "http://oak");
        if (typeof options3.query === "string") {
            url1.search = options3.query;
        } else {
            url1.search = String(options3.query instanceof URLSearchParams ? options3.query : new URLSearchParams(options3.query));
        }
        return `${url1.pathname}${url1.search}${url1.hash}`;
    }
    return replaced;
}
class Layer {
    #opts;
    #paramNames=[];
    #regexp;
    constructor(path2, methods, middleware1, { name: name2 , ...opts } = {
    }){
        this.#opts = opts;
        this.name = name2;
        this.methods = [
            ...methods
        ];
        if (this.methods.includes("GET")) {
            this.methods.unshift("HEAD");
        }
        this.stack = Array.isArray(middleware1) ? middleware1 : [
            middleware1
        ];
        this.path = path2;
        this.#regexp = pathToRegexp1(path2, this.#paramNames, this.#opts);
    }
    match(path) {
        return this.#regexp.test(path);
    }
    params(captures, existingParams = {
    }) {
        const params = existingParams;
        for(let i1 = 0; i1 < captures.length; i1++){
            if (this.#paramNames[i1]) {
                const c = captures[i1];
                params[this.#paramNames[i1].name] = c ? decodeComponent(c) : c;
            }
        }
        return params;
    }
    captures(path) {
        if (this.#opts.ignoreCaptures) {
            return [];
        }
        return path.match(this.#regexp)?.slice(1) ?? [];
    }
    url(params = {
    }, options) {
        const url = this.path.replace(/\(\.\*\)/g, "");
        return toUrl(url, params, options);
    }
    param(param, fn) {
        const stack = this.stack;
        const params = this.#paramNames;
        const middleware1 = function(ctx, next) {
            const p = ctx.params[param];
            assert2(p);
            return fn.call(this, p, ctx, next);
        };
        middleware1.param = param;
        const names = params.map((p)=>p.name
        );
        const x = names.indexOf(param);
        if (x >= 0) {
            for(let i1 = 0; i1 < stack.length; i1++){
                const fn = stack[i1];
                if (!fn.param || names.indexOf(fn.param) > x) {
                    stack.splice(i1, 0, middleware1);
                    break;
                }
            }
        }
        return this;
    }
    setPrefix(prefix) {
        if (this.path) {
            this.path = this.path !== "/" || this.#opts.strict === true ? `${prefix}${this.path}` : prefix;
            this.#paramNames = [];
            this.#regexp = pathToRegexp1(this.path, this.#paramNames, this.#opts);
        }
        return this;
    }
    toJSON() {
        return {
            methods: [
                ...this.methods
            ],
            middleware: [
                ...this.stack
            ],
            paramNames: this.#paramNames.map((key2)=>key2.name
            ),
            path: this.path,
            regexp: this.#regexp,
            options: {
                ...this.#opts
            }
        };
    }
}
export class Router {
    #opts;
    #methods;
    #params={
    };
    #stack=[];
    #match=(path3, method)=>{
        const matches1 = {
            path: [],
            pathAndMethod: [],
            route: false
        };
        for (const route of this.#stack){
            if (route.match(path3)) {
                matches1.path.push(route);
                if (route.methods.length === 0 || route.methods.includes(method)) {
                    matches1.pathAndMethod.push(route);
                    if (route.methods.length) {
                        matches1.route = true;
                    }
                }
            }
        }
        return matches1;
    };
    #register=(path3, middleware1, methods1, options3 = {
    })=>{
        if (Array.isArray(path3)) {
            for (const p of path3){
                this.#register(p, middleware1, methods1, options3);
            }
            return;
        }
        const { end , name: name3 , sensitive , strict , ignoreCaptures  } = options3;
        const route = new Layer(path3, methods1, middleware1, {
            end: end === false ? end : true,
            name: name3,
            sensitive: sensitive ?? this.#opts.sensitive ?? false,
            strict: strict ?? this.#opts.strict ?? false,
            ignoreCaptures
        });
        if (this.#opts.prefix) {
            route.setPrefix(this.#opts.prefix);
        }
        for (const [param, mw] of Object.entries(this.#params)){
            route.param(param, mw);
        }
        this.#stack.push(route);
    };
    #route=(name3)=>{
        for (const route of this.#stack){
            if (route.name === name3) {
                return route;
            }
        }
    };
    #useVerb=(nameOrPath, pathOrMiddleware, middleware1, methods1)=>{
        let name3 = undefined;
        let path3;
        if (typeof pathOrMiddleware === "string") {
            name3 = nameOrPath;
            path3 = pathOrMiddleware;
        } else {
            path3 = nameOrPath;
            middleware1.unshift(pathOrMiddleware);
        }
        this.#register(path3, middleware1, methods1, {
            name: name3
        });
    };
    constructor(opts1 = {
    }){
        this.#opts = opts1;
        this.#methods = opts1.methods ?? [
            "DELETE",
            "GET",
            "HEAD",
            "OPTIONS",
            "PATCH",
            "POST",
            "PUT", 
        ];
    }
    all(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "DELETE",
            "GET",
            "POST",
            "PUT"
        ]);
        return this;
    }
    allowedMethods(options = {
    }) {
        const implemented = this.#methods;
        const allowedMethods = async (context, next)=>{
            const ctx = context;
            await next();
            if (!ctx.response.status || ctx.response.status === Status1.NotFound) {
                assert2(ctx.matched);
                const allowed = new Set();
                for (const route of ctx.matched){
                    for (const method of route.methods){
                        allowed.add(method);
                    }
                }
                const allowedStr = [
                    ...allowed
                ].join(", ");
                if (!implemented.includes(ctx.request.method)) {
                    if (options.throw) {
                        throw options.notImplemented ? options.notImplemented() : new httpErrors.NotImplemented();
                    } else {
                        ctx.response.status = Status1.NotImplemented;
                        ctx.response.headers.set("Allowed", allowedStr);
                    }
                } else if (allowed.size) {
                    if (ctx.request.method === "OPTIONS") {
                        ctx.response.status = Status1.OK;
                        ctx.response.headers.set("Allowed", allowedStr);
                    } else if (!allowed.has(ctx.request.method)) {
                        if (options.throw) {
                            throw options.methodNotAllowed ? options.methodNotAllowed() : new httpErrors.MethodNotAllowed();
                        } else {
                            ctx.response.status = Status1.MethodNotAllowed;
                            ctx.response.headers.set("Allowed", allowedStr);
                        }
                    }
                }
            }
        };
        return allowedMethods;
    }
    delete(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "DELETE"
        ]);
        return this;
    }
    *entries() {
        for (const route of this.#stack){
            const value3 = route.toJSON();
            yield [
                value3,
                value3
            ];
        }
    }
    forEach(callback, thisArg = null) {
        for (const route of this.#stack){
            const value3 = route.toJSON();
            callback.call(thisArg, value3, value3, this);
        }
    }
    get(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "GET"
        ]);
        return this;
    }
    head(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "HEAD"
        ]);
        return this;
    }
    *keys() {
        for (const route of this.#stack){
            yield route.toJSON();
        }
    }
    options(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "OPTIONS"
        ]);
        return this;
    }
    param(param, middleware) {
        this.#params[param] = middleware;
        for (const route of this.#stack){
            route.param(param, middleware);
        }
        return this;
    }
    patch(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "PATCH"
        ]);
        return this;
    }
    post(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "POST"
        ]);
        return this;
    }
    prefix(prefix) {
        prefix = prefix.replace(/\/$/, "");
        this.#opts.prefix = prefix;
        for (const route of this.#stack){
            route.setPrefix(prefix);
        }
        return this;
    }
    put(nameOrPath, pathOrMiddleware, ...middleware) {
        this.#useVerb(nameOrPath, pathOrMiddleware, middleware, [
            "PUT"
        ]);
        return this;
    }
    redirect(source, destination, status = Status1.Found) {
        if (source[0] !== "/") {
            const s = this.url(source);
            if (!s) {
                throw new RangeError(`Could not resolve named route: "${source}"`);
            }
            source = s;
        }
        if (destination[0] !== "/") {
            const d = this.url(destination);
            if (!d) {
                throw new RangeError(`Could not resolve named route: "${source}"`);
            }
            destination = d;
        }
        this.all(source, (ctx)=>{
            ctx.response.redirect(destination);
            ctx.response.status = status;
        });
        return this;
    }
    routes() {
        const dispatch = (context, next)=>{
            const ctx = context;
            const { url: { pathname  } , method  } = ctx.request;
            const path3 = this.#opts.routerPath ?? ctx.routerPath ?? decodeURIComponent(pathname);
            const matches1 = this.#match(path3, method);
            if (ctx.matched) {
                ctx.matched.push(...matches1.path);
            } else {
                ctx.matched = [
                    ...matches1.path
                ];
            }
            ctx.router = this;
            if (!matches1.route) return next();
            const { pathAndMethod: matchedRoutes  } = matches1;
            const chain = matchedRoutes.reduce((prev, route)=>[
                    ...prev,
                    (ctx1, next1)=>{
                        ctx1.captures = route.captures(path3);
                        ctx1.params = route.params(ctx1.captures, ctx1.params);
                        ctx1.routeName = route.name;
                        return next1();
                    },
                    ...route.stack, 
                ]
            , []);
            return compose(chain)(ctx, next);
        };
        dispatch.router = this;
        return dispatch;
    }
    url(name, params, options) {
        const route = this.#route(name);
        if (route) {
            return route.url(params, options);
        }
    }
    use(pathOrMiddleware, ...middleware) {
        let path3;
        if (typeof pathOrMiddleware === "string" || Array.isArray(pathOrMiddleware)) {
            path3 = pathOrMiddleware;
        } else {
            middleware.unshift(pathOrMiddleware);
        }
        this.#register(path3 ?? "(.*)", middleware, [], {
            end: false,
            ignoreCaptures: !path3
        });
        return this;
    }
    *values() {
        for (const route of this.#stack){
            yield route.toJSON();
        }
    }
    *[Symbol.iterator]() {
        for (const route of this.#stack){
            yield route.toJSON();
        }
    }
    static url(path, params, options) {
        return toUrl(path, params, options);
    }
}
export { Router };
export { send };
export { ServerSentEvent, ServerSentEventTarget };
export { isErrorStatus, isRedirectStatus };
export { Status1 as Status, STATUS_TEXT1 as STATUS_TEXT };
const composeMiddleware = compose;

"#,
    ""
);
