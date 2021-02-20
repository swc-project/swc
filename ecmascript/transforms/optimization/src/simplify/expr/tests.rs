use super::SimplifyExpr;
use swc_ecma_transforms_testing::test_transform;

fn fold(src: &str, expected: &str) {
    test_transform(
        ::swc_ecma_parser::Syntax::default(),
        |_| SimplifyExpr { changed: false },
        src,
        expected,
        true,
    )
}

/// Should not modify expression.
fn fold_same(s: &str) {
    fold(s, s)
}

#[test]
fn regex() {
    fold("/ab/?x=1:x=2", "x=1");
}

#[test]
fn object() {
    fold("!({a:foo()});", "foo(), false;");
}

#[test]
fn test_undefined_comparison1() {
    fold("undefined == undefined", "true");
    fold("undefined == null", "true");
    fold("undefined == void 0", "true");

    fold("undefined == 0", "false");
    fold("undefined == 1", "false");
    fold("undefined == 'hi'", "false");
    fold("undefined == true", "false");
    fold("undefined == false", "false");

    fold("undefined === undefined", "true");
    fold("undefined === null", "false");
    fold("undefined === void 0", "true");

    fold_same("undefined == this");
    fold_same("undefined == x");

    fold("undefined != undefined", "false");
    fold("undefined != null", "false");
    fold("undefined != void 0", "false");

    fold("undefined != 0", "true");
    fold("undefined != 1", "true");
    fold("undefined != 'hi'", "true");
    fold("undefined != true", "true");
    fold("undefined != false", "true");

    fold("undefined !== undefined", "false");
    fold("undefined !== void 0", "false");
    fold("undefined !== null", "true");

    fold_same("undefined != this");
    fold_same("undefined != x");

    fold("undefined < undefined", "false");
    fold("undefined > undefined", "false");
    fold("undefined >= undefined", "false");
    fold("undefined <= undefined", "false");

    fold("0 < undefined", "false");
    fold("true > undefined", "false");
    fold("'hi' >= undefined", "false");
    fold("null <= undefined", "false");

    fold("undefined < 0", "false");
    fold("undefined > true", "false");
    fold("undefined >= 'hi'", "false");
    fold("undefined <= null", "false");

    fold("null == undefined", "true");
    fold("0 == undefined", "false");
    fold("1 == undefined", "false");
    fold("'hi' == undefined", "false");
    fold("true == undefined", "false");
    fold("false == undefined", "false");
    fold("null === undefined", "false");
    fold("void 0 === undefined", "true");

    fold("undefined == NaN", "false");
    fold("NaN == undefined", "false");
    fold("undefined == Infinity", "false");
    fold("Infinity == undefined", "false");
    fold("undefined == -Infinity", "false");
    fold("-Infinity == undefined", "false");
    fold("({}) == undefined", "false");
    fold("undefined == ({})", "false");
    fold("([]) == undefined", "false");
    fold("undefined == ([])", "false");
    fold("(/a/g) == undefined", "false");
    fold("undefined == (/a/g)", "false");
    fold("(function(){}) == undefined", "false");
    fold("undefined == (function(){})", "false");

    fold("undefined != NaN", "true");
    fold("NaN != undefined", "true");
    fold("undefined != Infinity", "true");
    fold("Infinity != undefined", "true");
    fold("undefined != -Infinity", "true");
    fold("-Infinity != undefined", "true");
    fold("({}) != undefined", "true");
    fold("undefined != ({})", "true");
    fold("([]) != undefined", "true");
    fold("undefined != ([])", "true");
    fold("(/a/g) != undefined", "true");
    fold("undefined != (/a/g)", "true");
    fold("(function(){}) != undefined", "true");
    fold("undefined != (function(){})", "true");

    fold_same("this == undefined");
    fold_same("x == undefined");
}

#[test]
fn test_undefined_comparison2() {
    fold("\"123\" !== void 0", "true");
    fold("\"123\" === void 0", "false");

    fold("void 0 !== \"123\"", "true");
    fold("void 0 === \"123\"", "false");
}

#[test]
fn test_undefined_comparison3() {
    fold("\"123\" !== undefined", "true");
    fold("\"123\" === undefined", "false");

    fold("undefined !== \"123\"", "true");
    fold("undefined === \"123\"", "false");
}

#[test]
fn test_undefined_comparison4() {
    fold("1 !== void 0", "true");
    fold("1 === void 0", "false");

    fold("null !== void 0", "true");
    fold("null === void 0", "false");

    fold("undefined !== void 0", "false");
    fold("undefined === void 0", "true");
}

#[test]
fn test_null_comparison1() {
    fold("null == undefined", "true");
    fold("null == null", "true");
    fold("null == void 0", "true");

    fold("null == 0", "false");
    fold("null == 1", "false");
    fold("null == 'hi'", "false");
    fold("null == true", "false");
    fold("null == false", "false");

    fold("null === undefined", "false");
    fold("null === null", "true");
    fold("null === void 0", "false");
    fold_same("null === x");

    fold_same("null == this");
    fold_same("null == x");

    fold("null != undefined", "false");
    fold("null != null", "false");
    fold("null != void 0", "false");

    fold("null != 0", "true");
    fold("null != 1", "true");
    fold("null != 'hi'", "true");
    fold("null != true", "true");
    fold("null != false", "true");

    fold("null !== undefined", "true");
    fold("null !== void 0", "true");
    fold("null !== null", "false");

    fold_same("null != this");
    fold_same("null != x");

    fold("null < null", "false");
    fold("null > null", "false");
    fold("null >= null", "true");
    fold("null <= null", "true");

    fold("0 < null", "false");
    fold("0 > null", "false");
    fold("0 >= null", "true");
    fold("true > null", "true");
    fold("'hi' < null", "false");
    fold("'hi' >= null", "false");
    fold("null <= null", "true");

    fold("null < 0", "false");
    fold("null > true", "false");
    fold("null < 'hi'", "false");
    fold("null >= 'hi'", "false");
    fold("null <= null", "true");

    fold("null == null", "true");
    fold("0 == null", "false");
    fold("1 == null", "false");
    fold("'hi' == null", "false");
    fold("true == null", "false");
    fold("false == null", "false");
    fold("null === null", "true");
    fold("void 0 === null", "false");

    fold("null == NaN", "false");
    fold("NaN == null", "false");
    fold("null == Infinity", "false");
    fold("Infinity == null", "false");
    fold("null == -Infinity", "false");
    fold("-Infinity == null", "false");
    fold("({}) == null", "false");
    fold("null == ({})", "false");
    fold("([]) == null", "false");
    fold("null == ([])", "false");
    fold("(/a/g) == null", "false");
    fold("null == (/a/g)", "false");
    fold("(function(){}) == null", "false");
    fold("null == (function(){})", "false");

    fold("null != NaN", "true");
    fold("NaN != null", "true");
    fold("null != Infinity", "true");
    fold("Infinity != null", "true");
    fold("null != -Infinity", "true");
    fold("-Infinity != null", "true");
    fold("({}) != null", "true");
    fold("null != ({})", "true");
    fold("([]) != null", "true");
    fold("null != ([])", "true");
    fold("(/a/g) != null", "true");
    fold("null != (/a/g)", "true");
    fold("(function(){}) != null", "true");
    fold("null != (function(){})", "true");

    fold("({a:f()}) == null", "f(), false;");
    fold("null == ({a:f()})", "f(), false");
    fold("([f()]) == null", "f(), false");
    fold("null == ([f()])", "f(), false");

    fold_same("this == null");
    fold_same("x == null");
}

#[test]
fn test_boolean_boolean_comparison() {
    fold_same("!x == !y");
    fold_same("!x < !y");
    fold_same("!x !== !y");

    fold_same("!x == !x"); // foldable
    fold_same("!x < !x"); // foldable
    fold_same("!x !== !x"); // foldable
}

#[test]
fn test_boolean_number_comparison() {
    fold_same("!x == +y");
    fold_same("!x <= +y");
    fold("!x !== +y", "true");
}

#[test]
fn test_number_boolean_comparison() {
    fold_same("+x == !y");
    fold_same("+x <= !y");
    fold("+x === !y", "false");
}

#[test]
fn test_boolean_string_comparison() {
    fold_same("!x == '' + y");
    fold_same("!x <= '' + y");
    fold("!x !== '' + y", "true");
}

#[test]
fn test_string_boolean_comparison() {
    fold_same("'' + x == !y");
    fold_same("'' + x <= !y");
    fold("'' + x === !y", "false");
}

#[test]
fn test_number_number_comparison() {
    fold("1 > 1", "false");
    fold("2 == 3", "false");
    fold("3.6 === 3.6", "true");
    fold_same("+x > +y");
    fold_same("+x == +y");
    fold_same("+x === +y");
    fold_same("+x == +x");
    fold_same("+x === +x");

    fold_same("+x > +x"); // foldable
}

#[test]
fn test_string_string_comparison() {
    fold("'a' < 'b'", "true");
    fold("'a' <= 'b'", "true");
    fold("'a' > 'b'", "false");
    fold("'a' >= 'b'", "false");
    fold("+'a' < +'b'", "false");
    fold_same("typeof a < 'a'");
    fold_same("'a' >= typeof a");
    fold("typeof a < typeof a", "false");
    fold("typeof a >= typeof a", "true");
    fold("typeof 3 > typeof 4", "false");
    fold("typeof function() {} < typeof function() {}", "false");
    fold("'a' == 'a'", "true");
    fold("'b' != 'a'", "true");
    fold_same("'undefined' == typeof a");
    fold_same("typeof a != 'number'");
    fold_same("'undefined' == typeof a");
    fold_same("'undefined' == typeof a");
    fold("typeof a == typeof a", "true");
    fold("'a' === 'a'", "true");
    fold("'b' !== 'a'", "true");
    fold("typeof a === typeof a", "true");
    fold("typeof a !== typeof a", "false");
    fold_same("'' + x <= '' + y");
    fold_same("'' + x != '' + y");
    fold_same("'' + x === '' + y");

    fold_same("'' + x <= '' + x"); // potentially foldable
    fold_same("'' + x != '' + x"); // potentially foldable
    fold_same("'' + x === '' + x"); // potentially foldable
}

#[test]
fn test_number_string_comparison() {
    fold("1 < '2'", "true");
    fold("2 > '1'", "true");
    fold("123 > '34'", "true");
    fold("NaN >= 'NaN'", "false");
    fold("1 == '2'", "false");
    fold("1 != '1'", "false");
    fold("NaN == 'NaN'", "false");
    fold("1 === '1'", "false");
    fold("1 !== '1'", "true");
    fold_same("+x > '' + y");
    fold_same("+x == '' + y");
    fold("+x !== '' + y", "true");
}

#[test]
fn test_string_number_comparison() {
    fold("'1' < 2", "true");
    fold("'2' > 1", "true");
    fold("'123' > 34", "true");
    fold("'NaN' < NaN", "false");
    fold("'1' == 2", "false");
    fold("'1' != 1", "false");
    fold("'NaN' == NaN", "false");
    fold("'1' === 1", "false");
    fold("'1' !== 1", "true");
    fold_same("'' + x < +y");
    fold_same("'' + x == +y");
    fold("'' + x === +y", "false");
}

#[test]
fn test_na_ncomparison() {
    fold("NaN < NaN", "false");
    fold("NaN >= NaN", "false");
    fold("NaN == NaN", "false");
    fold("NaN === NaN", "false");

    fold("NaN < null", "false");
    fold("null >= NaN", "false");
    fold("NaN == null", "false");
    fold("null != NaN", "true");
    fold("null === NaN", "false");

    fold("NaN < undefined", "false");
    fold("undefined >= NaN", "false");
    fold("NaN == undefined", "false");
    fold("undefined != NaN", "true");
    fold("undefined === NaN", "false");

    fold_same("NaN < x");
    fold_same("x >= NaN");
    fold_same("NaN == x");
    fold_same("x != NaN");
    fold("NaN === x", "false");
    fold("x !== NaN", "true");
    fold_same("NaN == foo()");
}

#[test]
fn test_object_comparison1() {
    fold("!new Date()", "false");
    fold("!!new Date()", "true");

    fold("new Date() == null", "false");
    fold("new Date() == undefined", "false");
    fold("new Date() != null", "true");
    fold("new Date() != undefined", "true");
    fold("null == new Date()", "false");
    fold("undefined == new Date()", "false");
    fold("null != new Date()", "true");
    fold("undefined != new Date()", "true");
}

#[test]
fn test_unary_ops_1() {
    // These cases are handled by PeepholeRemoveDeadCode.
    fold_same("!foo()");
    fold_same("~foo()");
    fold_same("-foo()");

    // These cases are handled here.
    fold("a=!true", "a=false");
    fold("a=!10", "a=false");
    fold("a=!false", "a=true");
    fold_same("a=!foo()");
    //fold("a=-0", "a=-0.0");
    //fold("a=-(0)", "a=-0.0");
    fold_same("a=-Infinity");
    fold("a=-NaN", "a=NaN");
    fold_same("a=-foo()");
    fold("a=~~0", "a=0");
    fold("a=~~10", "a=10");
    fold("a=~-7", "a=6");

    fold("a=+true", "a=1");
    fold("a=+10", "a=10");
    fold("a=+false", "a=0");
    fold_same("a=+foo()");
    fold_same("a=+f");
    //    fold("a=+(f?true:false)", "a=+(f?1:0)"); // TODO(johnlenz): foldable
}

#[test]
fn test_unary_ops_2() {
    fold("a=+0", "a=0");
    fold("a=+Infinity", "a=Infinity");
    fold("a=+NaN", "a=NaN");
    fold("a=+-7", "a=-7");
    fold("a=+.5", "a=.5");
}

#[test]
fn test_unary_ops_3() {
    fold("a=~0xffffffff", "a=0");
}

#[test]
fn test_unary_ops_4() {
    fold("a=~~0xffffffff", "a=-1");
}

#[test]
fn test_unary_ops_string_compare() {
    fold_same("a = -1");
    fold("a = ~0", "a = -1");
    fold("a = ~1", "a = -2");
    fold("a = ~101", "a = -102");
}

#[test]
fn test_fold_logical_op_1() {
    fold("x = true && x", "x = x");
    fold("x = [foo()] && x", "x = (foo(),x)");

    fold("x = false && x", "x = false");
    fold("x = true || x", "x = true");
    fold("x = false || x", "x = x");
    fold("x = 0 && x", "x = 0");
    fold("x = 3 || x", "x = 3");
    fold("x = false || 0", "x = 0");

    // unfoldable, because the right-side may be the result
    fold("a = x && true", "a=x && true");
    fold("a = x && false", "a=x && false");
    fold("a = x || 3", "a=x || 3");
    fold("a = x || false", "a=x || false");
    fold("a = b ? c : x || false", "a=b ? c:x || false");
    fold("a = b ? x || false : c", "a=b ? x || false:c");
    fold("a = b ? c : x && true", "a=b ? c:x && true");
    fold("a = b ? x && true : c", "a=b ? x && true:c");

    // folded, but not here.
    fold_same("a = x || false ? b : c");
    fold_same("a = x && true ? b : c");
}

#[test]
#[ignore]
fn test_fold_logical_op_2() {
    fold("x = foo() || true || bar()", "x = foo() || true");
    fold("x = foo() || true && bar()", "x = foo() || bar()");
    fold("x = foo() || false && bar()", "x = foo() || false");
    fold("x = foo() && false && bar()", "x = foo() && false");
    fold("x = foo() && false || bar()", "x = (foo() && false,bar())");
    fold("x = foo() || false || bar()", "x = foo() || bar()");
    fold("x = foo() && true && bar()", "x = foo() && bar()");
    fold("x = foo() || true || bar()", "x = foo() || true");
    fold("x = foo() && false && bar()", "x = foo() && false");
    fold("x = foo() && 0 && bar()", "x = foo() && 0");
    fold("x = foo() && 1 && bar()", "x = foo() && bar()");
    fold("x = foo() || 0 || bar()", "x = foo() || bar()");
    fold("x = foo() || 1 || bar()", "x = foo() || 1");
    fold_same("x = foo() || bar() || baz()");
    fold_same("x = foo() && bar() && baz()");

    fold("0 || b()", "b()");
    fold("1 && b()", "b()");
    fold("a() && (1 && b())", "a() && b()");
    fold("(a() && 1) && b()", "a() && b()");

    fold("(x || '') || y;", "x || y");
    fold("false || (x || '');", "x || ''");
    fold("(x && 1) && y;", "x && y");
    fold("true && (x && 1);", "x && 1");

    // Really not foldable, because it would change the type of the
    // expression if foo() returns something truthy but not true.
    // Cf. FoldConstants.tryFoldAndOr().
    // An example would be if foo() is 1 (truthy) and bar() is 0 (falsey):
    // (1 && true) || 0 == true
    // 1 || 0 == 1, but true =/= 1
    fold_same("x = foo() && true || bar()");
    fold_same("foo() && true || bar()");
}

#[test]
fn test_fold_logical_op2() {
    fold("x = function(){} && x", "x = x");
    fold("x = true && function(){}", "x = function(){}");
    fold(
        "x = [(function(){alert(x)})()] && x",
        "x = ((function() { alert(x); })(), x);",
    );
}

#[test]
fn test_fold_bitwise_op() {
    fold("x = 1 & 1", "x = 1");
    fold("x = 1 & 2", "x = 0");
    fold("x = 3 & 1", "x = 1");
    fold("x = 3 & 3", "x = 3");

    fold("x = 1 | 1", "x = 1");
    fold("x = 1 | 2", "x = 3");
    fold("x = 3 | 1", "x = 3");
    fold("x = 3 | 3", "x = 3");

    fold("x = 1 ^ 1", "x = 0");
    fold("x = 1 ^ 2", "x = 3");
    fold("x = 3 ^ 1", "x = 2");
    fold("x = 3 ^ 3", "x = 0");

    fold("x = -1 & 0", "x = 0");
    fold("x = 0 & -1", "x = 0");
    fold("x = 1 & 4", "x = 0");
    fold("x = 2 & 3", "x = 2");

    // make sure we fold only when we are supposed to -- not when doing so would
    // lose information or when it is performed on nonsensical arguments.
    fold("x = 1 & 1.1", "x = 1");
    fold("x = 1.1 & 1", "x = 1");
    fold("x = 1 & 3000000000", "x = 0");
    fold("x = 3000000000 & 1", "x = 0");

    // Try some cases with | as well
    fold("x = 1 | 4", "x = 5");
    fold("x = 1 | 3", "x = 3");
    fold("x = 1 | 1.1", "x = 1");
    fold_same("x = 1 | 3E9");
    fold("x = 1 | 3000000001", "x = -1294967295");
    fold("x = 4294967295 | 0", "x = -1");
}

#[test]
#[ignore]
fn test_fold_bitwise_op2() {
    fold("x = y & 1 & 1", "x = y & 1");
    fold("x = y & 1 & 2", "x = y & 0");
    fold("x = y & 3 & 1", "x = y & 1");
    fold("x = 3 & y & 1", "x = y & 1");
    fold("x = y & 3 & 3", "x = y & 3");
    fold("x = 3 & y & 3", "x = y & 3");

    fold("x = y | 1 | 1", "x = y | 1");
    fold("x = y | 1 | 2", "x = y | 3");
    fold("x = y | 3 | 1", "x = y | 3");
    fold("x = 3 | y | 1", "x = y | 3");
    fold("x = y | 3 | 3", "x = y | 3");
    fold("x = 3 | y | 3", "x = y | 3");

    fold("x = y ^ 1 ^ 1", "x = y ^ 0");
    fold("x = y ^ 1 ^ 2", "x = y ^ 3");
    fold("x = y ^ 3 ^ 1", "x = y ^ 2");
    fold("x = 3 ^ y ^ 1", "x = y ^ 2");
    fold("x = y ^ 3 ^ 3", "x = y ^ 0");
    fold("x = 3 ^ y ^ 3", "x = y ^ 0");

    fold("x = Infinity | NaN", "x=0");
    fold("x = 12 | NaN", "x=12");
}

#[test]
#[ignore]
fn test_folding_mix_types_early() {
    fold_same("x = x + '2'");
    fold("x = +x + +'2'", "x = +x + 2");
    fold("x = x - '2'", "x = x - 2");
    fold("x = x ^ '2'", "x = x ^ 2");
    fold("x = '2' ^ x", "x = 2 ^ x");
    fold("x = '2' & x", "x = 2 & x");
    fold("x = '2' | x", "x = 2 | x");

    fold("x = '2' | y", "x=2|y");
    fold("x = y | '2'", "x=y|2");
    fold("x = y | (a && '2')", "x=y|(a&&2)");
    fold("x = y | (a,'2')", "x=y|(a,2)");
    fold("x = y | (a?'1':'2')", "x=y|(a?1:2)");
    fold("x = y | ('x'?'1':'2')", "x=y|('x'?1:2)");
}

#[test]
fn test_folding_add1() {
    fold("x = null + true", "x=1");
    fold_same("x = a + true");
    fold("x = '' + {}", "x = '[object Object]'");
    fold("x = [] + {}", "x = '[object Object]'");
    fold("x = {} + []", "x = '[object Object]'");
    fold("x = {} + ''", "x = '[object Object]'");
}

#[test]
fn test_folding_add2() {
    fold("x = false + []", "x='false'");
    fold("x = [] + true", "x='true'");
    fold("NaN + []", "'NaN'");
}

#[test]
fn test_fold_bitwise_op_string_compare() {
    fold("x = -1 | 0", "x = -1");
}

#[test]
fn test_fold_bit_shifts() {
    fold("x = 1 << 0", "x = 1");
    fold("x = -1 << 0", "x = -1");
    fold("x = 1 << 1", "x = 2");
    fold("x = 3 << 1", "x = 6");
    fold("x = 1 << 8", "x = 256");

    fold("x = 1 >> 0", "x = 1");
    fold("x = -1 >> 0", "x = -1");
    fold("x = 1 >> 1", "x = 0");
    fold("x = 2 >> 1", "x = 1");
    fold("x = 5 >> 1", "x = 2");
    fold("x = 127 >> 3", "x = 15");
    fold("x = 3 >> 1", "x = 1");
    fold("x = 3 >> 2", "x = 0");
    fold("x = 10 >> 1", "x = 5");
    fold("x = 10 >> 2", "x = 2");
    fold("x = 10 >> 5", "x = 0");

    fold("x = 10 >>> 1", "x = 5");
    fold("x = 10 >>> 2", "x = 2");
    fold("x = 10 >>> 5", "x = 0");
    fold("x = -1 >>> 1", "x = 2147483647"); // 0x7fffffff
    fold("x = -1 >>> 0", "x = 4294967295"); // 0xffffffff
    fold("x = -2 >>> 0", "x = 4294967294"); // 0xfffffffe
    fold("x = 0x90000000 >>> 28", "x = 9");

    fold("x = 0xffffffff << 0", "x = -1");
    fold("x = 0xffffffff << 4", "x = -16");
    fold_same("1 << 32");
    fold_same("1 << -1");
    fold_same("1 >> 32");
}

#[test]
fn test_fold_bit_shifts_string_compare() {
    fold("x = -1 << 1", "x = -2");
    fold("x = -1 << 8", "x = -256");
    fold("x = -1 >> 1", "x = -1");
    fold("x = -2 >> 1", "x = -1");
    fold("x = -1 >> 0", "x = -1");
}

#[test]
#[ignore]
fn test_string_add() {
    fold("x = 'a' + 'bc'", "x = 'abc'");
    fold("x = 'a' + 5", "x = 'a5'");
    fold("x = 5 + 'a'", "x = '5a'");
    fold("x = 'a' + ''", "x = 'a'");
    fold("x = 'a' + foo()", "x = 'a'+foo()");
    fold("x = foo() + 'a' + 'b'", "x = foo()+'ab'");
    fold("x = (foo() + 'a') + 'b'", "x = foo()+'ab'"); // believe it!
    fold(
        "x = foo() + 'a' + 'b' + 'cd' + bar()",
        "x = foo()+'abcd'+bar()",
    );
    fold("x = foo() + 2 + 'b'", "x = foo()+2+\"b\""); // don't fold!
    fold("x = foo() + 'a' + 2", "x = foo()+\"a2\"");
    fold("x = '' + null", "x = 'null'");
    fold("x = true + '' + false", "x = 'truefalse'");
    fold("x = '' + []", "x = ''");
    fold("x = foo() + 'a' + 1 + 1", "x = foo() + 'a11'");
    fold("x = 1 + 1 + 'a'", "x = '2a'");
    fold("x = 1 + 1 + 'a'", "x = '2a'");
    fold("x = 'a' + (1 + 1)", "x = 'a2'");
    fold("x = '_' + p1 + '_' + ('' + p2)", "x = '_' + p1 + '_' + p2");
    fold("x = 'a' + ('_' + 1 + 1)", "x = 'a_11'");
    fold("x = 'a' + ('_' + 1) + 1", "x = 'a_11'");
    fold("x = 1 + (p1 + '_') + ('' + p2)", "x = 1 + (p1 + '_') + p2");
    fold("x = 1 + p1 + '_' + ('' + p2)", "x = 1 + p1 + '_' + p2");
    fold("x = 1 + 'a' + p1", "x = '1a' + p1");
    fold("x = (p1 + (p2 + 'a')) + 'b'", "x = (p1 + (p2 + 'ab'))");
    fold("'a' + ('b' + p1) + 1", "'ab' + p1 + 1");
    fold("x = 'a' + ('b' + p1 + 'c')", "x = 'ab' + (p1 + 'c')");
    fold_same("x = 'a' + (4 + p1 + 'a')");
    fold_same("x = p1 / 3 + 4");
    fold_same("foo() + 3 + 'a' + foo()");
    fold_same("x = 'a' + ('b' + p1 + p2)");
    fold_same("x = 1 + ('a' + p1)");
    fold_same("x = p1 + '' + p2");
    fold_same("x = 'a' + (1 + p1)");
    fold_same("x = (p2 + 'a') + (1 + p1)");
    fold_same("x = (p2 + 'a') + (1 + p1 + p2)");
    fold_same("x = (p2 + 'a') + (1 + (p1 + p2))");
}

#[test]
fn test_issue821() {
    fold_same("var a =(Math.random()>0.5? '1' : 2 ) + 3 + 4;");
    fold_same("var a = ((Math.random() ? 0 : 1) || (Math.random()>0.5? '1' : 2 )) + 3 + 4;");
}

#[test]
fn test_fold_constructor() {
    fold("x = this[new String('a')]", "x = this['a']");
    fold("x = ob[new String(12)]", "x = ob['12']");
    fold("x = ob[new String(false)]", "x = ob['false']");
    fold("x = ob[new String(null)]", "x = ob['null']");
    fold("x = 'a' + new String('b')", "x = 'ab'");
    fold("x = 'a' + new String(23)", "x = 'a23'");
    fold("x = 2 + new String(1)", "x = '21'");
    fold_same("x = ob[new String(a)]");
    fold_same("x = 'a'");
    fold_same("x = 'a'[3]");
}

#[test]
fn test_fold_arithmetic() {
    fold("x = 10 + 20", "x = 30");
    fold("x = 2 / 4", "x = 0.5");
    fold("x = 2.25 * 3", "x = 6.75");
    fold_same("z = x * y");
    fold_same("x = y * 5");
    fold_same("x = 1 / 0");
    fold("x = 3 % 2", "x = 1");
    fold("x = 3 % -2", "x = 1");
    fold("x = -1 % 3", "x = -1");
    fold_same("x = 1 % 0");
    fold("x = 2 ** 3", "x = 8");
    fold("x = 2 ** -3", "x = 0.125");
    fold_same("x = 2 ** 55"); // backs off folding because 2 ** 55 is too large
    fold_same("x = 3 ** -1"); // backs off because 3**-1 is shorter than
                              // 0.3333333333333333
}

#[test]
fn test_fold_arithmetic2() {
    fold_same("x = y + 10 + 20");
    fold_same("x = y / 2 / 4");
    fold("x = y * 2.25 * 3", "x = y * 6.75");
    fold_same("z = x * y");
    fold_same("x = y * 5");
    fold("x = y + (z * 24 * 60 * 60 * 1000)", "x = y + z * 864E5");
}

#[test]
fn test_fold_arithmetic3() {
    fold("x = null * undefined", "x = NaN");
    fold("x = null * 1", "x = 0");
    fold("x = (null - 1) * 2", "x = -2");
    fold("x = (null + 1) * 2", "x = 2");
    fold("x = null ** 0", "x = 1");
}

#[test]
#[ignore]
fn test_fold_arithmetic3_2() {
    fold("x = (-0) ** 3", "x = -0.0");
}

#[test]
fn test_fold_arithmetic_infinity() {
    fold("x=-Infinity-2", "x=-Infinity");
    fold("x=Infinity-2", "x=Infinity");
    fold("x=Infinity*5", "x=Infinity");
    fold("x = Infinity ** 2", "x = Infinity");
    fold("x = Infinity ** -2", "x = 0");
}

#[test]
fn test_fold_arithmetic_string_comp() {
    fold("x = 10 - 20", "x = -10");
}

#[test]
fn test_fold_comparison() {
    fold("x = 0 == 0", "x = true");
    fold("x = 1 == 2", "x = false");
    fold("x = 'abc' == 'def'", "x = false");
    fold("x = 'abc' == 'abc'", "x = true");
    fold("x = \"\" == ''", "x = true");
    fold("x = foo() == bar()", "x = foo()==bar()");

    fold("x = 1 != 0", "x = true");
    fold("x = 'abc' != 'def'", "x = true");
    fold("x = 'a' != 'a'", "x = false");

    fold("x = 1 < 20", "x = true");
    fold("x = 3 < 3", "x = false");
    fold("x = 10 > 1.0", "x = true");
    fold("x = 10 > 10.25", "x = false");
    fold("x = y == y", "x = y==y"); // Maybe foldable given type information
    fold("x = y < y", "x = false");
    fold("x = y > y", "x = false");
    fold("x = 1 <= 1", "x = true");
    fold("x = 1 <= 0", "x = false");
    fold("x = 0 >= 0", "x = true");
    fold("x = -1 >= 9", "x = false");

    fold("x = true == true", "x = true");
    fold("x = false == false", "x = true");
    fold("x = false == null", "x = false");
    fold("x = false == true", "x = false");
    fold("x = true == null", "x = false");

    fold("0 == 0", "true");
    fold("1 == 2", "false");
    fold("'abc' == 'def'", "false");
    fold("'abc' == 'abc'", "true");
    fold("\"\" == ''", "true");
    fold_same("foo() == bar()");

    fold("1 != 0", "true");
    fold("'abc' != 'def'", "true");
    fold("'a' != 'a'", "false");

    fold("1 < 20", "true");
    fold("3 < 3", "false");
    fold("10 > 1.0", "true");
    fold("10 > 10.25", "false");
    fold_same("x == x");
    fold("x < x", "false");
    fold("x > x", "false");
    fold("1 <= 1", "true");
    fold("1 <= 0", "false");
    fold("0 >= 0", "true");
    fold("-1 >= 9", "false");

    fold("true == true", "true");
    fold("false == null", "false");
    fold("false == true", "false");
    fold("true == null", "false");
}

// ===, !== comparison tests
#[test]
fn test_fold_comparison2() {
    fold("x = 0 === 0", "x = true");
    fold("x = 1 === 2", "x = false");
    fold("x = 'abc' === 'def'", "x = false");
    fold("x = 'abc' === 'abc'", "x = true");
    fold("x = \"\" === ''", "x = true");
    fold("x = foo() === bar()", "x = foo()===bar()");

    fold("x = 1 !== 0", "x = true");
    fold("x = 'abc' !== 'def'", "x = true");
    fold("x = 'a' !== 'a'", "x = false");

    fold("x = y === y", "x = y===y");

    fold("x = true === true", "x = true");
    fold("x = false === false", "x = true");
    fold("x = false === null", "x = false");
    fold("x = false === true", "x = false");
    fold("x = true === null", "x = false");

    fold("0 === 0", "true");
    fold("1 === 2", "false");
    fold("'abc' === 'def'", "false");
    fold("'abc' === 'abc'", "true");
    fold("\"\" === ''", "true");
    fold_same("foo() === bar()");

    fold("1 === '1'", "false");
    fold("1 === true", "false");
    fold("1 !== '1'", "true");
    fold("1 !== true", "true");

    fold("1 !== 0", "true");
    fold("'abc' !== 'def'", "true");
    fold("'a' !== 'a'", "false");

    fold_same("x === x");

    fold("true === true", "true");
    fold("false === null", "false");
    fold("false === true", "false");
    fold("true === null", "false");
}

#[test]
fn test_fold_comparison3() {
    fold("x = !1 == !0", "x = false");

    fold("x = !0 == !0", "x = true");
    fold("x = !1 == !1", "x = true");
    fold("x = !1 == null", "x = false");
    fold("x = !1 == !0", "x = false");
    fold("x = !0 == null", "x = false");

    fold("!0 == !0", "true");
    fold("!1 == null", "false");
    fold("!1 == !0", "false");
    fold("!0 == null", "false");

    fold("x = !0 === !0", "x = true");
    fold("x = !1 === !1", "x = true");
    fold("x = !1 === null", "x = false");
    fold("x = !1 === !0", "x = false");
    fold("x = !0 === null", "x = false");

    fold("!0 === !0", "true");
    fold("!1 === null", "false");
    fold("!1 === !0", "false");
    fold("!0 === null", "false");
}

#[test]
fn test_fold_comparison4() {
    fold_same("[] == false"); // true
    fold_same("[] == true"); // false
    fold_same("[0] == false"); // true
    fold_same("[0] == true"); // false
    fold_same("[1] == false"); // false
    fold_same("[1] == true"); // true
    fold_same("({}) == false"); // false
    fold_same("({}) == true"); // true
}

#[test]
fn test_fold_get_elem1() {
    fold("x = [,10][0]", "x = void 0");
    fold("x = [10, 20][0]", "x = 10");
    fold("x = [10, 20][1]", "x = 20");

    fold("x = [10, 20][-1]", "x = void 0;");
    fold("x = [10, 20][2]", "x = void 0;");

    fold("x = [foo(), 0][1]", "x = (foo(), 0);");
    fold("x = [0, foo()][1]", "x = foo()");
    fold("x = [0, foo()][0]", "x = (foo(), 0)");
    fold_same("for([1][0] in {});");
}

#[test]
fn test_fold_get_elem2_1() {
    fold("x = 'string'[5]", "x = 'g'");
    fold("x = 'string'[0]", "x = 's'");
    fold("x = 's'[0]", "x = 's'");
    fold("x = '\\uD83D\\uDCA9'[0]", "x = '\\uD83D'");
}

#[test]
#[ignore]
fn test_fold_get_elem2_2() {
    fold("x = 'string'[-1]", "x = void 0;");
    fold("x = 'string'[6]", "x = void 0;");
}

#[test]
fn test_fold_array_lit_spread_get_elem() {
    fold("x = [...[0    ]][0]", "x = 0;");
    fold("x = [0, 1, ...[2, 3, 4]][3]", "x = 3;");
    fold("x = [...[0, 1], 2, ...[3, 4]][3]", "x = 3;");
    fold("x = [...[...[0, 1], 2, 3], 4][0]", "x = 0");
    fold("x = [...[...[0, 1], 2, 3], 4][3]", "x = 3");
    fold("x = [...[]][100]", "x = void 0;");
    fold("x = [...[0]][100]", "x = void 0;");
}

#[test]
fn test_dont_fold_non_literal_spread_get_elem() {
    fold_same("x = [...iter][0];");
    fold_same("x = [0, 1, ...iter][2];");
    //  `...iter` could have side effects, so don't replace `x` with `0`
    fold_same("x = [0, 1, ...iter][0];");
}

#[test]
fn test_fold_array_spread() {
    fold("x = [...[]]", "x = []");
    fold("x = [0, ...[], 1]", "x = [0, 1]");
    fold("x = [...[0, 1], 2, ...[3, 4]]", "x = [0, 1, 2, 3, 4]");
    fold("x = [...[...[0], 1], 2]", "x = [0, 1, 2]");
    fold_same("[...[x]] = arr");
}

#[test]
#[ignore]
fn test_fold_object_lit_spread_get_prop() {
    fold("x = {...{a}}.a", "x = a;");
    fold("x = {a, b, ...{c, d, e}}.d", "x = d;");
    fold("x = {...{a, b}, c, ...{d, e}}.d", "x = d;");
    fold("x = {...{...{a, b}, c, d}, e}.a", "x = a");
    fold("x = {...{...{a, b}, c, d}, e}.d", "x = d");
}

#[test]
#[ignore]
fn test_dont_fold_non_literal_object_spread_get_prop_getters_impure() {
    fold_same("x = {...obj}.a;");
    fold_same("x = {a, ...obj, c}.a;");
    fold_same("x = {a, ...obj, c}.c;");
}

#[test]
fn test_fold_object_spread() {
    fold("x = {...{}}", "x = {}");
    fold("x = {a, ...{}, b}", "x = {a, b}");
    fold("x = {...{a, b}, c, ...{d, e}}", "x = {a, b, c, d, e}");
    fold("x = {...{...{a}, b}, c}", "x = {a, b, c}");
    fold_same("({...{x}} = obj)");
}

#[test]
#[ignore]
fn test_dont_fold_mixed_object_and_array_spread() {
    fold_same("x = [...{}]");
    fold_same("x = {...[]}");
    fold("x = [a, ...[...{}]]", "x = [a, ...{}]");
    fold("x = {a, ...{...[]}}", "x = {a, ...[]}");
}

#[test]
fn test_fold_complex() {
    fold("x = (3 / 1.0) + (1 * 2)", "x = 5");
    fold("x = (1 == 1.0) && foo() && true", "x = foo()&&true");
    fold("x = 'abc' + 5 + 10", "x = \"abc510\"");
}

#[test]
#[ignore]
fn test_fold_left() {
    fold_same("(+x - 1) + 2"); // not yet
    fold("(+x + 1) + 2", "+x + 3");
}

#[test]
fn test_fold_array_length() {
    // Can fold
    fold("x = [].length", "x = 0");
    fold("x = [1,2,3].length", "x = 3");
    fold("x = [a,b].length", "x = 2");

    // Not handled yet
    fold("x = [,,1].length", "x = 3");

    // Cannot fold
    fold("x = [foo(), 0].length", "x = [foo(),0].length");
    fold_same("x = y.length");
}

#[test]
fn test_fold_string_length() {
    // Can fold basic strings.
    fold("x = ''.length", "x = 0");
    fold("x = '123'.length", "x = 3");

    // Test Unicode escapes are accounted for.
    fold("x = '123\\u01dc'.length", "x = 4");
}

#[test]
fn test_fold_typeof() {
    fold("x = typeof 1", "x = \"number\"");
    fold("x = typeof 'foo'", "x = \"string\"");
    fold("x = typeof true", "x = \"boolean\"");
    fold("x = typeof false", "x = \"boolean\"");
    fold("x = typeof null", "x = \"object\"");
    fold("x = typeof undefined", "x = \"undefined\"");
    fold("x = typeof void 0", "x = \"undefined\"");
    fold("x = typeof []", "x = \"object\"");
    fold("x = typeof [1]", "x = \"object\"");
    fold("x = typeof [1,[]]", "x = \"object\"");
    fold("x = typeof {}", "x = \"object\"");
    fold("x = typeof function() {}", "x = 'function'");

    fold_same("x = typeof[1,[foo()]]");
    fold_same("x = typeof{bathwater:baby()}");
}

#[test]
fn test_fold_instance_of() {
    // Non object types are never instances of anything.
    fold("64 instanceof Object", "false");
    fold("64 instanceof Number", "false");
    fold("'' instanceof Object", "false");
    fold("'' instanceof String", "false");
    fold("true instanceof Object", "false");
    fold("true instanceof Boolean", "false");
    fold("!0 instanceof Object", "false");
    fold("!0 instanceof Boolean", "false");
    fold("false instanceof Object", "false");
    fold("null instanceof Object", "false");
    fold("undefined instanceof Object", "false");
    fold("NaN instanceof Object", "false");
    fold("Infinity instanceof Object", "false");

    // Array and object literals are known to be objects.
    fold("[] instanceof Object", "true");
    fold("({}) instanceof Object", "true");

    // These cases is foldable, but no handled currently.
    fold("new Foo() instanceof Object", "new Foo(), true;");
    // These would require type information to fold.
    fold_same("[] instanceof Foo");
    fold_same("({}) instanceof Foo");

    fold("(function() {}) instanceof Object", "true");

    // An unknown value should never be folded.
    fold_same("x instanceof Foo");
}

#[test]
fn test_division() {
    // Make sure the 1/3 does not expand to 0.333333
    fold_same("print(1/3)");

    // Decimal form is preferable to fraction form when strings are the
    // same length.
    fold("print(1/2)", "print(0.5)");
}

#[test]
fn test_assign_ops_early() {
    fold_same("x=x+y");
    fold_same("x=y+x");
    fold_same("x=x*y");
    fold_same("x=y*x");
    fold_same("x.y=x.y+z");
    fold_same("next().x = next().x + 1");

    fold_same("x=x-y");
    fold_same("x=y-x");
    fold_same("x=x|y");
    fold_same("x=y|x");
    fold_same("x=x*y");
    fold_same("x=y*x");
    fold_same("x=x**y");
    fold_same("x=y**2");
    fold_same("x.y=x.y+z");
    fold_same("next().x = next().x + 1");
}

#[test]
#[ignore]
fn test_assign_ops_early_2() {
    // This is OK, really.
    fold("({a:1}).a = ({a:1}).a + 1", "({a:1}).a = 2");
}

#[test]
fn test_fold_add1() {
    fold("x=false+1", "x=1");
    fold("x=true+1", "x=2");
    fold("x=1+false", "x=1");
    fold("x=1+true", "x=2");
}

#[test]
fn test_fold_literal_names() {
    fold("NaN == NaN", "false");
    fold("Infinity == Infinity", "true");
    fold("Infinity == NaN", "false");
    fold("undefined == NaN", "false");
    fold("undefined == Infinity", "false");

    fold("Infinity >= Infinity", "true");
    fold("NaN >= NaN", "false");
}

#[test]
fn test_fold_literals_type_mismatches() {
    fold("true == true", "true");
    fold("true == false", "false");
    fold("true == null", "false");
    fold("false == null", "false");

    // relational operators convert its operands
    fold("null <= null", "true"); // 0 = 0
    fold("null >= null", "true");
    fold("null > null", "false");
    fold("null < null", "false");

    fold("false >= null", "true"); // 0 = 0
    fold("false <= null", "true");
    fold("false > null", "false");
    fold("false < null", "false");

    fold("true >= null", "true"); // 1 > 0
    fold("true <= null", "false");
    fold("true > null", "true");
    fold("true < null", "false");

    fold("true >= false", "true"); // 1 > 0
    fold("true <= false", "false");
    fold("true > false", "true");
    fold("true < false", "false");
}

#[test]
#[ignore]
fn test_fold_left_child_concat() {
    fold_same("x +5 + \"1\"");
    fold("x+\"5\" + \"1\"", "x + \"51\"");
    // fold("\"a\"+(c+\"b\")", "\"a\"+c+\"b\"");
    fold("\"a\"+(\"b\"+c)", "\"ab\"+c");
}

#[test]
#[ignore]
fn test_fold_left_child_op() {
    fold("x * Infinity * 2", "x * Infinity");
    fold_same("x - Infinity - 2"); // want "x-Infinity"
    fold_same("x - 1 + Infinity");
    fold_same("x - 2 + 1");
    fold_same("x - 2 + 3");
    fold_same("1 + x - 2 + 1");
    fold_same("1 + x - 2 + 3");
    fold_same("1 + x - 2 + 3 - 1");
    fold_same("f(x)-0");
    fold("x-0-0", "x-0");
    fold_same("x+2-2+2");
    fold_same("x+2-2+2-2");
    fold_same("x-2+2");
    fold_same("x-2+2-2");
    fold_same("x-2+2-2+2");

    fold_same("1+x-0-NaN");
    fold_same("1+f(x)-0-NaN");
    fold_same("1+x-0+NaN");
    fold_same("1+f(x)-0+NaN");

    fold_same("1+x+NaN"); // unfoldable
    fold_same("x+2-2"); // unfoldable
    fold_same("x+2"); // nothing to do
    fold_same("x-2"); // nothing to do
}

#[test]
fn test_fold_simple_arithmetic_op() {
    fold_same("x*NaN");
    fold_same("NaN/y");
    fold_same("f(x)-0");
    fold_same("f(x)*1");
    fold_same("1*f(x)");
    fold_same("0+a+b");
    fold_same("0-a-b");
    fold_same("a+b-0");
    fold_same("(1+x)*NaN");

    fold_same("(1+f(x))*NaN"); // don't fold side-effects
}

#[test]
#[ignore]
fn test_fold_literals_as_numbers() {
    fold("x/'12'", "x/12");
    fold("x/('12'+'6')", "x/126");
    fold("true*x", "1*x");
    fold("x/false", "x/0"); // should we add an error check? :)
}

#[test]
fn test_not_fold_back_to_true_false() {
    fold("!0", "true");
    fold("!1", "false");
    fold("!3", "false");
}

#[test]
fn test_fold_bang_constants() {
    fold("1 + !0", "2");
    fold("1 + !1", "1");
    fold("'a ' + !1", "'a false'");
    fold("'a ' + !0", "'a true'");
}

#[test]
fn test_fold_mixed() {
    fold("''+[1]", "'1'");
    fold("false+[]", "\"false\"");
}

#[test]
fn test_fold_void() {
    fold_same("void 0");
    fold("void 1", "void 0");
    fold("void x", "void 0");
    fold_same("void x()");
}

#[test]
fn test_object_literal() {
    fold("(!{})", "false");
    fold("(!{a:1})", "false");
    fold("(!{a:foo()})", "foo(), false;");
    fold("(!{'a':foo()})", "foo(), false;");
}

#[test]
fn test_array_literal() {
    fold("(![])", "false");
    fold("(![1])", "false");
    fold("(![a])", "false");
    fold_same("foo(), false;");
}

#[test]
fn test_issue601() {
    fold_same("'\\v' == 'v'");
    fold_same("'v' == '\\v'");
    fold_same("'\\u000B' == '\\v'");
}

#[test]
#[ignore]
fn test_fold_object_literal_ref1() {
    // Leave extra side-effects in place
    fold_same("var x = ({a:foo(),b:bar()}).a");
    fold_same("var x = ({a:1,b:bar()}).a");
    fold_same("function f() { return {b:foo(), a:2}.a; }");

    // on the LHS the object act as a temporary leave it in place.
    fold_same("({a:x}).a = 1");
    fold("({a:x}).a += 1", "({a:x}).a = x + 1");
    fold_same("({a:x}).a ++");
    fold_same("({a:x}).a --");

    // Getters should not be inlined.
    fold_same("({get a() {return this}}).a");

    // Except, if we can see that the getter function never references 'this'.
    fold("({get a() {return 0}}).a", "(function() {return 0})()");

    // It's okay to inline functions, as long as they're not immediately called.
    // (For tests where they are immediately called, see
    // testFoldObjectLiteralRefCall)
    fold(
        "({a:function(){return this}}).a",
        "(function(){return this})",
    );

    // It's also okay to inline functions that are immediately called, so long as we
    // know for sure the function doesn't reference 'this'.
    fold("({a:function(){return 0}}).a()", "(function(){return 0})()");

    // Don't inline setters.
    fold_same("({set a(b) {return this}}).a");
    fold_same("({set a(b) {this._a = b}}).a");

    // Don't inline if there are side-effects.
    fold_same("({[foo()]: 1,   a: 0}).a");
    fold_same("({['x']: foo(), a: 0}).a");
    fold_same("({x: foo(),     a: 0}).a");

    // Leave unknown props alone, the might be on the prototype
    fold_same("({}).a");

    // setters by themselves don't provide a definition
    fold_same("({}).a");
    fold_same("({set a(b) {}}).a");
    // sets don't hide other definitions.
    fold("({a:1,set a(b) {}}).a", "1");

    // get is transformed to a call (gets don't have self referential names)
    fold("({get a() {}}).a", "(function (){})()");
    // sets don't hide other definitions.
    fold("({get a() {},set a(b) {}}).a", "(function (){})()");

    // a function remains a function not a call.
    fold(
        "var x = ({a:function(){return 1}}).a",
        "var x = function(){return 1}",
    );

    fold("var x = ({a:1}).a", "var x = 1");
    fold("var x = ({a:1, a:2}).a", "var x = 2");
    fold("var x = ({a:1, a:foo()}).a", "var x = foo()");
    fold("var x = ({a:foo()}).a", "var x = foo()");

    fold(
        "function f() { return {a:1, b:2}.a; }",
        "function f() { return 1; }",
    );

    // GETELEM is handled the same way.
    fold("var x = ({'a':1})['a']", "var x = 1");

    // try folding string computed properties
    fold("var a = {['a']:x}['a']", "var a = x");
    fold(
        "var a = { get ['a']() { return 1; }}['a']",
        "var a = function() { return 1; }();",
    );
    fold("var a = {'a': x, ['a']: y}['a']", "var a = y;");
    fold_same("var a = {['foo']: x}.a;");
    // Note: it may be useful to fold symbols in the future.
    fold_same("var y = Symbol(); var a = {[y]: 3}[y];");

    fold("var x = {a() { 1; }}.a;", "var x = function() { 1; };");
    // Notice `a` isn't invoked, so behavior didn't change.
    fold(
        "var x = {a() { return this; }}.a;",
        "var x = function() { return this; };",
    );
    // `super` is invisibly captures the object that declared the method so we can't
    // fold.
    fold_same("var x = {a() { return super.a; }}.a;");
    fold(
        "var x = {a: 1, a() { 2; }}.a;",
        "var x = function() { 2; };",
    );
    fold("var x = {a() {}, a: 1}.a;", "var x = 1;");
    fold_same("var x = {a() {}}.b");
}

#[test]
fn test_fold_object_literal_ref2() {
    fold_same("({a:x}).a += 1");
}

// Regression test for https://github.com/google/closure-compiler/issues/2873
// It would be incorrect to fold this to "x();" because the 'this' value inside
// the function will be the global object, instead of the object {a:x} as it
// should be.
#[test]
fn test_fold_object_literal_method_call_non_literal_fn() {
    fold_same("({a:x}).a()");
}

#[test]
#[ignore]
fn test_fold_object_literal_free_method_call() {
    fold("({a() { return 1; }}).a()", "(function() { return 1; })()");
}

#[test]
#[ignore]
fn test_fold_object_literal_free_arrow_call_using_enclosing_this() {
    fold("({a: () => this }).a()", "(() => this)()");
}

#[test]
fn test_fold_object_literal_unfree_method_call_due_to_this() {
    fold_same("({a() { return this; }}).a()");
}

#[test]
fn test_fold_object_literal_unfree_method_call_due_to_super() {
    fold_same("({a() { return super.toString(); }}).a()");
}

#[test]
fn test_fold_object_literal_param_to_invocation() {
    fold("console.log({a: 1}.a)", "console.log(1)");
}

#[test]
fn test_ie_string() {
    fold_same("!+'\\v1'");
}

#[test]
fn test_issue522() {
    fold_same("[][1] = 1;");
}

#[test]
fn test_es6_features() {
    fold(
        "var x = {[undefined != true] : 1};",
        "var x = {[true] : 1};",
    );
    fold("let x = false && y;", "let x = false;");
    fold("const x = null == undefined", "const x = true");
    fold(
        "var [a, , b] = [false+1, true+1, ![]]",
        "var [a, , b] = [1, 2, false]",
    );
    fold("var x = () =>  true || x;", "var x = () => true;");
    fold(
        "function foo(x = (1 !== void 0), y) {return x+y;}",
        "function foo(x = true, y) {return x+y;}",
    );
    fold(
        "class Foo {  constructor() {this.x = null <= null;} }",
        "class Foo {  constructor() {this.x = true;}}",
    );
    fold(
        "function foo() {return `${false && y}`}",
        "function foo() {return `${false}`}",
    );
}
