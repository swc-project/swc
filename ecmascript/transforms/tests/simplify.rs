extern crate swc_common;
extern crate swc_ecma_ast as ast;
extern crate swc_ecma_parser;
extern crate swc_ecma_transforms as transforms;
#[macro_use]
extern crate testing;

use swc_common::fold::Folder;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::parser::Parser;
use testing::logger;
use transforms::simplify::Simplify;

macro_rules! parse {
    ($s:expr) => {{
        let l = logger();
        Parser::new_for_module(l.clone(), Lexer::new_from_str(l, $s))
            .parse_module()
            .unwrap_or_else(|err| panic!("failed to parse module: {:?}", err))
    }};
}

macro_rules! test {
    ($l:expr, $r:expr) => {{
        assert_eq_ignore_span!(fold(parse!($l), Simplify), parse!($r))
    }};
}

macro_rules! test_expr {
    ($l:expr, $r:expr) => {{
        test!(&format!("used(({}))", $l), &format!("used(({}))", $r));
    }};
}

/// Should not modify expression.
macro_rules! same_expr {
    ($l:expr) => {{
        test_expr!(&format!("{}", $l), &format!("{}", $l));
    }};
}

fn fold<T, F>(t: T, mut f: F) -> T
where
    F: Folder<T>,
{
    f.fold(t)
}

#[test]
fn add_simple() {
    test_expr!("3 + 6", "9");
}

#[test]
fn cond_simple() {
    test_expr!("true ? 3 : 6", "3");
    test_expr!("false ? 3 : 6", "6");
}

#[test]
fn cond_side_effect() {
    test!("new UnknownClass() ? 3 : 6", "new UnknownClass(), 3");
    test!("(void fn()) ? 3 : 6", "(void fn()), 6");
}

#[test]
fn oror_non_bool() {
    test_expr!("5 || 50", "5")
}

// --------------------------------------------------
// Tests ported from google closure compiler (which is licensed Apache 2.0)
// See https://github.com/google/closure-compiler
// --------------------------------------------------

#[test]
fn undefined_cmp_1() {
    test_expr!("undefined == undefined", "true");
    test_expr!("undefined == null", "true");
    test_expr!("undefined == void 0", "true");

    test_expr!("undefined == 0", "false");
    test_expr!("undefined == 1", "false");
    test_expr!("undefined == 'hi'", "false");
    test_expr!("undefined == true", "false");
    test_expr!("undefined == false", "false");

    test_expr!("undefined === undefined", "true");
    test_expr!("undefined === null", "false");
    test_expr!("undefined === void 0", "true");

    same_expr!("undefined == this");
    same_expr!("undefined == x");

    test_expr!("undefined != undefined", "false");
    test_expr!("undefined != null", "false");
    test_expr!("undefined != void 0", "false");

    test_expr!("undefined != 0", "true");
    test_expr!("undefined != 1", "true");
    test_expr!("undefined != 'hi'", "true");
    test_expr!("undefined != true", "true");
    test_expr!("undefined != false", "true");

    test_expr!("undefined !== undefined", "false");
    test_expr!("undefined !== void 0", "false");
    test_expr!("undefined !== null", "true");

    same_expr!("undefined != this");
    same_expr!("undefined != x");

    test_expr!("undefined < undefined", "false");
    test_expr!("undefined > undefined", "false");
    test_expr!("undefined >= undefined", "false");
    test_expr!("undefined <= undefined", "false");

    test_expr!("0 < undefined", "false");
    test_expr!("true > undefined", "false");
    test_expr!("'hi' >= undefined", "false");
    test_expr!("null <= undefined", "false");

    test_expr!("undefined < 0", "false");
    test_expr!("undefined > true", "false");
    test_expr!("undefined >= 'hi'", "false");
    test_expr!("undefined <= null", "false");

    test_expr!("null == undefined", "true");
    test_expr!("0 == undefined", "false");
    test_expr!("1 == undefined", "false");
    test_expr!("'hi' == undefined", "false");
    test_expr!("true == undefined", "false");
    test_expr!("false == undefined", "false");
    test_expr!("null === undefined", "false");
    test_expr!("void 0 === undefined", "true");

    test_expr!("undefined == NaN", "false");
    test_expr!("NaN == undefined", "false");
    test_expr!("undefined == Infinity", "false");
    test_expr!("Infinity == undefined", "false");
    test_expr!("undefined == -Infinity", "false");
    test_expr!("-Infinity == undefined", "false");
    test_expr!("({}) == undefined", "false");
    test_expr!("undefined == ({})", "false");
    test_expr!("([]) == undefined", "false");
    test_expr!("undefined == ([])", "false");
    test_expr!("(/a/g) == undefined", "false");
    test_expr!("undefined == (/a/g)", "false");
    test_expr!("(function(){}) == undefined", "false");
    test_expr!("undefined == (function(){})", "false");

    test_expr!("undefined != NaN", "true");
    test_expr!("NaN != undefined", "true");
    test_expr!("undefined != Infinity", "true");
    test_expr!("Infinity != undefined", "true");
    test_expr!("undefined != -Infinity", "true");
    test_expr!("-Infinity != undefined", "true");
    test_expr!("({}) != undefined", "true");
    test_expr!("undefined != ({})", "true");
    test_expr!("([]) != undefined", "true");
    test_expr!("undefined != ([])", "true");
    test_expr!("(/a/g) != undefined", "true");
    test_expr!("undefined != (/a/g)", "true");
    test_expr!("(function(){}) != undefined", "true");
    test_expr!("undefined != (function(){})", "true");

    same_expr!("this == undefined");
    same_expr!("x == undefined");
}

#[test]
fn undefined_cmp_2() {
    test_expr!("\"123\" !== void 0", "true");
    test_expr!("\"123\" === void 0", "false");

    test_expr!("void 0 !== \"123\"", "true");
    test_expr!("void 0 === \"123\"", "false");
}

#[test]
fn undefined_cmp_3() {
    test_expr!("\"123\" !== undefined", "true");
    test_expr!("\"123\" === undefined", "false");

    test_expr!("undefined !== \"123\"", "true");
    test_expr!("undefined === \"123\"", "false");
}

#[test]
fn undefined_cmp_4() {
    test_expr!("1 !== void 0", "true");
    test_expr!("1 === void 0", "false");

    test_expr!("null !== void 0", "true");
    test_expr!("null === void 0", "false");

    test_expr!("undefined !== void 0", "false");
    test_expr!("undefined === void 0", "true");
}

#[test]
fn null_cmp_1() {
    test_expr!("null == undefined", "true");
    test_expr!("null == null", "true");
    test_expr!("null == void 0", "true");

    test_expr!("null == 0", "false");
    test_expr!("null == 1", "false");
    test_expr!("null == 'hi'", "false");
    test_expr!("null == true", "false");
    test_expr!("null == false", "false");

    test_expr!("null === undefined", "false");
    test_expr!("null === null", "true");
    test_expr!("null === void 0", "false");
    same_expr!("null === x");

    same_expr!("null == this");
    same_expr!("null == x");

    test_expr!("null != undefined", "false");
    test_expr!("null != null", "false");
    test_expr!("null != void 0", "false");

    test_expr!("null != 0", "true");
    test_expr!("null != 1", "true");
    test_expr!("null != 'hi'", "true");
    test_expr!("null != true", "true");
    test_expr!("null != false", "true");

    test_expr!("null !== undefined", "true");
    test_expr!("null !== void 0", "true");
    test_expr!("null !== null", "false");

    same_expr!("null != this");
    same_expr!("null != x");

    test_expr!("null < null", "false");
    test_expr!("null > null", "false");
    test_expr!("null >= null", "true");
    test_expr!("null <= null", "true");

    test_expr!("0 < null", "false");
    test_expr!("0 > null", "false");
    test_expr!("0 >= null", "true");
    test_expr!("true > null", "true");
    test_expr!("'hi' < null", "false");
    test_expr!("'hi' >= null", "false");
    test_expr!("null <= null", "true");

    test_expr!("null < 0", "false");
    test_expr!("null > true", "false");
    test_expr!("null < 'hi'", "false");
    test_expr!("null >= 'hi'", "false");
    test_expr!("null <= null", "true");

    test_expr!("null == null", "true");
    test_expr!("0 == null", "false");
    test_expr!("1 == null", "false");
    test_expr!("'hi' == null", "false");
    test_expr!("true == null", "false");
    test_expr!("false == null", "false");
    test_expr!("null === null", "true");
    test_expr!("void 0 === null", "false");

    test_expr!("null == NaN", "false");
    test_expr!("NaN == null", "false");
    test_expr!("null == Infinity", "false");
    test_expr!("Infinity == null", "false");
    test_expr!("null == -Infinity", "false");
    test_expr!("-Infinity == null", "false");
    test_expr!("({}) == null", "false");
    test_expr!("null == ({})", "false");
    test_expr!("([]) == null", "false");
    test_expr!("null == ([])", "false");
    test_expr!("(/a/g) == null", "false");
    test_expr!("null == (/a/g)", "false");
    test_expr!("(function(){}) == null", "false");
    test_expr!("null == (function(){})", "false");

    test_expr!("null != NaN", "true");
    test_expr!("NaN != null", "true");
    test_expr!("null != Infinity", "true");
    test_expr!("Infinity != null", "true");
    test_expr!("null != -Infinity", "true");
    test_expr!("-Infinity != null", "true");
    test_expr!("({}) != null", "true");
    test_expr!("null != ({})", "true");
    test_expr!("([]) != null", "true");
    test_expr!("null != ([])", "true");
    test_expr!("(/a/g) != null", "true");
    test_expr!("null != (/a/g)", "true");
    test_expr!("(function(){}) != null", "true");
    test_expr!("null != (function(){})", "true");

    same_expr!("({a:f()}) == null");
    same_expr!("null == ({a:f()})");
    same_expr!("([f()]) == null");
    same_expr!("null == ([f()])");

    same_expr!("this == null");
    same_expr!("x == null");
}
