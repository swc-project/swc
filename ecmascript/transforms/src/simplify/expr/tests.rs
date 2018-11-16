use super::SimplifyExpr;

macro_rules! test_expr {
    ($l:expr, $r:expr) => {{
        test_transform!(SimplifyExpr, $l, $r, true)
    }};
    ($l:expr, $r:expr,) => {
        test_expr!($l, $r);
    };
}

/// Should not modify expression.
macro_rules! same_expr {
    ($l:expr) => {
        test_expr!($l, $l)
    };
}

#[test]
fn used_value() {
    test_expr!("use(8 + 8)", "use(16)");
}

#[test]
fn cond_simple() {
    test_expr!("true ? 3 : 6", "3");
    test_expr!("false ? 3 : 6", "6");
}

#[test]
fn cond_side_effect() {
    test_expr!("new UnknownClass() ? 3 : 6", "new UnknownClass(), 3");
    test_expr!("(void fn()) ? 3 : 6", "void fn(), 6");
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
fn undefined_cmp_1_split_1() {
    test_expr!("undefined == undefined", "true");
    test_expr!("undefined == null", "true");
    test_expr!("undefined == void 0", "true");

    test_expr!("undefined == 0", "false");
    test_expr!("undefined == 1", "false");
    test_expr!("undefined == 'hi'", "false");
    test_expr!("undefined == true", "false");
    test_expr!("undefined == false", "false");
}

#[test]
fn undefined_cmp_1_split_2() {
    test_expr!("undefined === undefined", "true");
    test_expr!("undefined === null", "false");
    test_expr!("undefined === void 0", "true");

    same_expr!("undefined == this");
    same_expr!("undefined == x");

    test_expr!("undefined != undefined", "false");
    test_expr!("undefined != null", "false");
    test_expr!("undefined != void 0", "false");
}

#[test]
fn undefined_cmp_1_split_3() {
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
}

#[test]
fn undefined_cmp_1_split_4() {
    test_expr!("undefined < undefined", "false");
    test_expr!("undefined > undefined", "false");
    test_expr!("undefined >= undefined", "false");
    test_expr!("undefined <= undefined", "false");

    test_expr!("0 < undefined", "false");
    test_expr!("true > undefined", "false");
    test_expr!("'hi' >= undefined", "false");
    test_expr!("null <= undefined", "false");
}

#[test]
fn undefined_cmp_1_split_5() {
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
}

#[test]
fn undefined_cmp_1_split_6() {
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
}

#[test]
fn undefined_cmp_1_split_7() {
    test_expr!("undefined != NaN", "true");
    test_expr!("NaN != undefined", "true");
    test_expr!("undefined != Infinity", "true");
    test_expr!("Infinity != undefined", "true");
    test_expr!("undefined != -Infinity", "true");
    test_expr!("-Infinity != undefined", "true");
    test_expr!("({}) != undefined", "true");
}

#[test]
fn undefined_cmp_1_split_8() {
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
}

#[test]
fn null_cmp_2() {
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
}

#[test]
fn null_cmp_3() {
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
}

#[test]
fn null_cmp_4() {
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

    test_expr!("({a:f()}) == null", "f(), false");
    test_expr!("null == ({a:f()})", "f(), false");
    test_expr!("([f()]) == null", "f(), false");
    test_expr!("null == ([f()])", "f(), false");

    same_expr!("this == null");
    same_expr!("x == null");
}

/// Currently ignored because our parser does not
/// accept `await` if it's not in async function.
#[test]
fn eq_cmp_side_effects() {
    // can remove ''. not implemented yet.
    test_expr!(
        "[{a:foo()}, bar(), await ('', other())] == null",
        "(foo(), bar(), await ('', other()))"
    )
}

#[test]
fn bool_bool_cmp() {
    same_expr!("!x == !y");
    same_expr!("!x < !y");
    same_expr!("!x !== !y");

    same_expr!("!x == !x"); // foldable
    same_expr!("!x < !x"); // foldable
    same_expr!("!x !== !x"); // foldable
}

#[test]
fn bool_num_cmp() {
    same_expr!("!x == !y");
    same_expr!("!x < !y");
    same_expr!("!x !== !y");

    same_expr!("!x == !x"); // foldable
    same_expr!("!x < !x"); // foldable
    same_expr!("!x !== !x"); // foldable
}

#[test]
fn num_bool_cmp() {
    same_expr!("+x == !y");
    same_expr!("+x <= !y");
    test_expr!("+x === !y", "false");
}

#[test]
fn bool_str_cmp() {
    same_expr!("!x == '' + y");
    same_expr!("!x <= '' + y");
    test_expr!("!x !== '' + y", "true");
}

#[test]
fn str_bool_cmp() {
    same_expr!("'' + x == !y");
    same_expr!("'' + x <= !y");
    test_expr!("'' + x === !y", "false");
}

#[test]
fn num_num_cmp() {
    test_expr!("1 > 1", "false");
    test_expr!("2 == 3", "false");
    test_expr!("3.6 === 3.6", "true");
    same_expr!("+x > +y");
    same_expr!("+x == +y");
    same_expr!("+x === +y");
    same_expr!("+x == +x");
    same_expr!("+x === +x");

    same_expr!("+x > +x"); // foldable
}

#[test]
fn str_str_cmp() {
    test_expr!("'a' < 'b'", "true");
    test_expr!("'a' <= 'b'", "true");
    test_expr!("'a' > 'b'", "false");
    test_expr!("'a' >= 'b'", "false");
    test_expr!("+'a' < +'b'", "false");
    same_expr!("typeof a < 'a'");
    same_expr!("'a' >= typeof a");
    test_expr!("typeof a < typeof a", "false");
    test_expr!("typeof a >= typeof a", "true");
    test_expr!("typeof 3 > typeof 4", "false");
    test_expr!("typeof function() {} < typeof function() {}", "false");
    test_expr!("'a' == 'a'", "true");
    test_expr!("'b' != 'a'", "true");
    same_expr!("'undefined' == typeof a");
    same_expr!("typeof a != 'number'");
    same_expr!("'undefined' == typeof a");
    same_expr!("'undefined' == typeof a");
    test_expr!("typeof a == typeof a", "true");
    test_expr!("'a' === 'a'", "true");
    test_expr!("'b' !== 'a'", "true");
    test_expr!("typeof a === typeof a", "true");
    test_expr!("typeof a !== typeof a", "false");
    same_expr!("'' + x <= '' + y");
    same_expr!("'' + x != '' + y");
    same_expr!("'' + x === '' + y");

    same_expr!("'' + x <= '' + x"); // potentially foldable
    same_expr!("'' + x != '' + x"); // potentially foldable
    same_expr!("'' + x === '' + x"); // potentially foldable
}

#[test]
fn num_str_cmp() {
    test_expr!("1 < '2'", "true");
    test_expr!("2 > '1'", "true");
    test_expr!("123 > '34'", "true");
    test_expr!("NaN >= 'NaN'", "false");
    test_expr!("1 == '2'", "false");
    test_expr!("1 != '1'", "false");
    test_expr!("NaN == 'NaN'", "false");
    test_expr!("1 === '1'", "false");
    test_expr!("1 !== '1'", "true");
    same_expr!("+x > '' + y");
    same_expr!("+x == '' + y");
    test_expr!("+x !== '' + y", "true");
}

#[test]
fn str_num_cmp() {
    test_expr!("'1' < 2", "true");
    test_expr!("'2' > 1", "true");
    test_expr!("'123' > 34", "true");
    test_expr!("'NaN' < NaN", "false");
    test_expr!("'1' == 2", "false");
    test_expr!("'1' != 1", "false");
    test_expr!("'NaN' == NaN", "false");
    test_expr!("'1' === 1", "false");
    test_expr!("'1' !== 1", "true");
    same_expr!("'' + x < +y");
    same_expr!("'' + x == +y");
    test_expr!("'' + x === +y", "false");
}

#[test]
fn nan_cmp() {
    test_expr!("NaN < NaN", "false");
    test_expr!("NaN >= NaN", "false");
    test_expr!("NaN == NaN", "false");
    test_expr!("NaN === NaN", "false");

    test_expr!("NaN < null", "false");
    test_expr!("null >= NaN", "false");
    test_expr!("NaN == null", "false");
    test_expr!("null != NaN", "true");
    test_expr!("null === NaN", "false");

    test_expr!("NaN < undefined", "false");
    test_expr!("undefined >= NaN", "false");
    test_expr!("NaN == undefined", "false");
    test_expr!("undefined != NaN", "true");
    test_expr!("undefined === NaN", "false");

    same_expr!("NaN < x");
    same_expr!("x >= NaN");
    same_expr!("NaN == x");
    same_expr!("x != NaN");
    test_expr!("NaN === x", "false");
    test_expr!("x !== NaN", "true");
    same_expr!("NaN == foo()");
}

#[test]
fn obj_cmp() {
    test_expr!("!new Date()", "false");
    test_expr!("!!new Date()", "true");

    test_expr!("new Date() == null", "false");
    test_expr!("new Date() == undefined", "false");
    test_expr!("new Date() != null", "true");
    test_expr!("new Date() != undefined", "true");
    test_expr!("null == new Date()", "false");
    test_expr!("undefined == new Date()", "false");
    test_expr!("null != new Date()", "true");
    test_expr!("undefined != new Date()", "true");
}

#[test]
#[ignore]
fn unary_ops() {
    // These cases are handled by PeepholeRemoveDeadCode.
    same_expr!("!foo()");
    same_expr!("~foo()");
    same_expr!("-foo()");

    // These cases are handled here.
    test_expr!("a=!true", "a=false");
    test_expr!("a=!10", "a=false");
    test_expr!("a=!false", "a=true");
    same_expr!("a=!foo()");
    same_expr!("a=-Infinity");
    test_expr!("a=-NaN", "a=NaN");
    same_expr!("a=-foo()");
    test_expr!("a=~~0", "a=0");
    test_expr!("a=~~10", "a=10");
    test_expr!("a=~-7", "a=6");

    test_expr!("a=+true", "a=1");
    test_expr!("a=+10", "a=10");
    test_expr!("a=+false", "a=0");
    same_expr!("a=+foo()");
    same_expr!("a=+f");
    test_expr!("a=+(f?true:false)", "a=+(f?1:0)"); // TODO(johnlenz): foldable
    test_expr!("a=+0", "a=0");
    test_expr!("a=+Infinity", "a=Infinity");
    test_expr!("a=+NaN", "a=NaN");
    test_expr!("a=+-7", "a=-7");
    test_expr!("a=+.5", "a=.5");

    test_expr!("a=~0xffffffff", "a=0");
    test_expr!("a=~~0xffffffff", "a=-1");
    // same_expr!("a=~.5", PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND);
}

#[test]
#[ignore]
fn unary_ops_str_cmp() {
    same_expr!("a = -1");
    test_expr!("a = ~0", "a = -1");
    test_expr!("a = ~1", "a = -2");
    test_expr!("a = ~101", "a = -102");
}

#[test]
fn seq_expr_array() {
    test_expr!("([foo()], x)", "(foo(), x)");
}

#[test]
fn logical_ops() {
    test_expr!("true && x", "x");
    test_expr!("[foo()] && x", "(foo(), x)");

    test_expr!("false && x", "false");
    test_expr!("true || x", "true");
    test_expr!("false || x", "x");
    test_expr!("0 && x", "0");
    test_expr!("3 || x", "3");
    test_expr!("false || 0", "0");

    // unfoldable, because the right-side may be the result
    test_expr!("a = x && true", "a=x && true");
    test_expr!("a = x && false", "a=x && false");
    test_expr!("a = x || 3", "a=x || 3");
    test_expr!("a = x || false", "a=x || false");
    test_expr!("a = b ? c : x || false", "a=b ? c:x || false");
    test_expr!("a = b ? x || false : c", "a=b ? x || false:c");
    test_expr!("a = b ? c : x && true", "a=b ? c:x && true");
    test_expr!("a = b ? x && true : c", "a=b ? x && true:c");

    // folded, but not here.
    same_expr!("a = x || false ? b : c");
    same_expr!("a = x && true ? b : c");

    test_expr!("foo() || true || bar()", "foo() || true");
    test_expr!("foo() || true && bar()", "foo() || bar()");
    test_expr!("foo() || false && bar()", "foo() || false");
    test_expr!("foo() && false && bar()", "foo() && false");
    test_expr!("foo() && false || bar()", "(foo() && false,bar())");
    test_expr!("foo() || false || bar()", "foo() || bar()");
    test_expr!("foo() && true && bar()", "foo() && bar()");
    test_expr!("foo() || true || bar()", "foo() || true");
    test_expr!("foo() && false && bar()", "foo() && false");
    test_expr!("foo() && 0 && bar()", "foo() && 0");
    test_expr!("foo() && 1 && bar()", "foo() && bar()");
    test_expr!("foo() || 0 || bar()", "foo() || bar()");
    test_expr!("foo() || 1 || bar()", "foo() || 1");
    same_expr!("foo() || bar() || baz()");
    same_expr!("foo() && bar() && baz()");

    test_expr!("0 || b()", "b()");
    test_expr!("1 && b()", "b()");
    test_expr!("a() && (1 && b())", "a() && b()");
    test_expr!("(a() && 1) && b()", "a() && b()");

    test_expr!("(x || '') || y;", "x || y");
    test_expr!("false || (x || '');", "x || ''");
    test_expr!("(x && 1) && y;", "x && y");
    test_expr!("true && (x && 1);", "x && 1");

    // Really not foldable, because it would change the type of the
    // expression if foo() returns something truthy but not true.
    // Cf. FoldConstants.tryFoldAndOr().
    // An example would be if foo() is 1 (truthy) and bar() is 0 (falsey):
    // (1 && true) || 0 == true
    // 1 || 0 == 1, but true =/= 1
    same_expr!("foo() && true || bar()");
    same_expr!("foo() && true || bar()");
}

#[test]
fn logical_ops_2() {
    test_expr!("x = function(){} && x", "x = x");
    test_expr!("x = true && function(){}", "x = function(){}");
    test_expr!(
        "[(function(){alert(x)})()] && x",
        "((function(){alert(x)})(),x)",
    );
}

#[test]
#[ignore]
fn bit_ops() {
    test_expr!("1 & 1", "1");
    test_expr!("1 & 2", "0");
    test_expr!("3 & 1", "1");
    test_expr!("3 & 3", "3");

    test_expr!("1 | 1", "1");
    test_expr!("1 | 2", "3");
    test_expr!("3 | 1", "3");
    test_expr!("3 | 3", "3");

    test_expr!("1 ^ 1", "0");
    test_expr!("1 ^ 2", "3");
    test_expr!("3 ^ 1", "2");
    test_expr!("3 ^ 3", "0");

    test_expr!("-1 & 0", "0");
    test_expr!("0 & -1", "0");
    test_expr!("1 & 4", "0");
    test_expr!("2 & 3", "2");

    // make sure we fold only when we are supposed to -- not when doing so would
    // lose information or when it is performed on nonsensical arguments.
    test_expr!("1 & 1.1", "1");
    test_expr!("1.1 & 1", "1");
    test_expr!("1 & 3000000000", "0");
    test_expr!("3000000000 & 1", "0");

    // Try some cases with | as well
    test_expr!("1 | 4", "5");
    test_expr!("1 | 3", "3");
    test_expr!("1 | 1.1", "1");
    same_expr!("1 | 3E9");
    test_expr!("1 | 3000000001", "-1294967295");
    test_expr!("4294967295 | 0", "-1");
}

#[test]
#[ignore]
fn bit_ops_2() {
    test_expr!("y & 1 & 1", "y & 1");
    test_expr!("y & 1 & 2", "y & 0");
    test_expr!("y & 3 & 1", "y & 1");
    test_expr!("3 & y & 1", "y & 1");
    test_expr!("y & 3 & 3", "y & 3");
    test_expr!("3 & y & 3", "y & 3");

    test_expr!("y | 1 | 1", "y | 1");
    test_expr!("y | 1 | 2", "y | 3");
    test_expr!("y | 3 | 1", "y | 3");
    test_expr!("3 | y | 1", "y | 3");
    test_expr!("y | 3 | 3", "y | 3");
    test_expr!("3 | y | 3", "y | 3");

    test_expr!("y ^ 1 ^ 1", "y ^ 0");
    test_expr!("y ^ 1 ^ 2", "y ^ 3");
    test_expr!("y ^ 3 ^ 1", "y ^ 2");
    test_expr!("3 ^ y ^ 1", "y ^ 2");
    test_expr!("y ^ 3 ^ 3", "y ^ 0");
    test_expr!("3 ^ y ^ 3", "y ^ 0");

    test_expr!("Infinity | NaN", "0");
    test_expr!("12 | NaN", "12");
}

#[test]
#[ignore]
fn add_1() {
    test_expr!("null + true", "1");
    same_expr!("a + true");
    test_expr!("'' + {}", "'[object Object]'");
    test_expr!("[] + {}", "'[object Object]'");
    test_expr!("{} + []", "'[object Object]'");
    test_expr!("{} + ''", "'[object Object]'");
}

#[test]
#[ignore]
fn add_2() {
    test_expr!("false + []", "'false'");
    test_expr!("[] + true", "'true'");
    test_expr!("NaN + []", "'NaN'");
}

#[test]
fn bit_op_str_cmp() {
    test_expr!("-1 | 0", "-1");
}

#[test]
fn bit_shifts() {
    test_expr!("1 << 0", "1");
    test_expr!("-1 << 0", "-1");
    test_expr!("1 << 1", "2");
    test_expr!("3 << 1", "6");
    test_expr!("1 << 8", "256");

    test_expr!("1 >> 0", "1");
    test_expr!("-1 >> 0", "-1");
    test_expr!("1 >> 1", "0");
    test_expr!("2 >> 1", "1");
    test_expr!("5 >> 1", "2");
    test_expr!("127 >> 3", "15");
    test_expr!("3 >> 1", "1");
    test_expr!("3 >> 2", "0");
    test_expr!("10 >> 1", "5");
    test_expr!("10 >> 2", "2");
    test_expr!("10 >> 5", "0");

    test_expr!("10 >>> 1", "5");
    test_expr!("10 >>> 2", "2");
    test_expr!("10 >>> 5", "0");
    test_expr!("-1 >>> 1", "2147483647"); // 0x7fffffff
    test_expr!("-1 >>> 0", "4294967295"); // 0xffffffff
    test_expr!("-2 >>> 0", "4294967294"); // 0xfffffffe
    test_expr!("0x90000000 >>> 28", "9");

    test_expr!("0xffffffff << 0", "-1");
    test_expr!("0xffffffff << 4", "-16");
    same_expr!("1 << 32");
    same_expr!("1 << -1");
    same_expr!("1 >> 32");
    // same_expr!("1.5 << 0", PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND);
    // same_expr!("1 << .5", PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND);
    // same_expr!(
    //     "1.5 >>> 0",
    //     PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND,
    // );
    // same_expr!("1 >>> .5", PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND);
    // same_expr!("1.5 >> 0", PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND);
    // same_expr!("1 >> .5", PeepholeFoldConstants.FRACTIONAL_BITWISE_OPERAND);
}

#[test]
fn bit_shifts_str_cmp() {
    test_expr!("-1 << 1", "-2");
    test_expr!("-1 << 8", "-256");
    test_expr!("-1 >> 1", "-1");
    test_expr!("-2 >> 1", "-1");
    test_expr!("-1 >> 0", "-1");
}

#[test]
fn str_add() {
    test_expr!("'a' + \"bc\"", "\"abc\"");
    test_expr!("'a' + 5", "\"a5\"");
    test_expr!("5 + 'a'", "\"5a\"");
    test_expr!("'a' + ''", "\"a\"");
    test_expr!("\"a\" + foo()", "\"a\"+foo()");
    test_expr!("foo() + 'a' + 'b'", "foo()+\"ab\"");
    test_expr!("(foo() + 'a') + 'b'", "foo()+\"ab\""); // believe it!
    test_expr!("foo() + 'a' + 'b' + 'cd' + bar()", "foo()+\"abcd\"+bar()");
    test_expr!("foo() + 2 + 'b'", "foo()+2+\"b\""); // don't fold!
    test_expr!("foo() + 'a' + 2", "foo()+\"a2\"");
    test_expr!("'' + null", "\"null\"");
    test_expr!("true + '' + false", "\"truefalse\"");
    test_expr!("'' + []", "''"); // cannot fold (but nice if we can)
}

#[test]
fn issue821() {
    same_expr!("var a =(Math.random()>0.5? '1' : 2 ) + 3 + 4;");
    same_expr!("var a = ((Math.random() ? 0 : 1) || (Math.random()>0.5? '1' : 2 )) + 3 + 4;");
}

#[test]
fn constructor() {
    test_expr!("this[new String('a')]", "this['a']");
    test_expr!("ob[new String(12)]", "ob['12']");
    test_expr!("ob[new String(false)]", "ob['false']");
    test_expr!("ob[new String(null)]", "ob['null']");
    test_expr!("'a' + new String('b')", "'ab'");
    test_expr!("'a' + new String(23)", "'a23'");
    test_expr!("2 + new String(1)", "'21'");
    same_expr!("ob[new String(a)]");
    same_expr!("new String('a')");
    same_expr!("(new String('a'))[3]");
}

#[test]
fn arithmetic() {
    test_expr!("10 + 20", "30");
    test_expr!("2 / 4", "0.5");
    test_expr!("2.25 * 3", "6.75");
    same_expr!("z = x * y");
    same_expr!("y * 5");
    same_expr!("1 / 0");
    test_expr!("3 % 2", "1");
    test_expr!("3 % -2", "1");
    test_expr!("-1 % 3", "-1");
    same_expr!("1 % 0");
}

#[test]
fn arithmetic_2() {
    same_expr!("y + 10 + 20");
    same_expr!("y / 2 / 4");
    test_expr!("y * 2.25 * 3", "y * 6.75");
    same_expr!("z = x * y");
    same_expr!("y * 5");
    test_expr!("y + (z * 24 * 60 * 60 * 1000)", "y + z * 864E5");
}

#[test]
fn arithmetic_3() {
    test_expr!("null * undefined", "NaN");
    test_expr!("null * 1", "0");
    test_expr!("(null - 1) * 2", "-2");
    test_expr!("(null + 1) * 2", "2");
}

#[test]
fn arithmetic_inf() {
    test_expr!("-Infinity-2", "-Infinity");
    test_expr!("Infinity-2", "Infinity");
    test_expr!("Infinity*5", "Infinity");
}

#[test]
fn arithmetic_str_cmp() {
    test_expr!("10 - 20", "-10");
}

#[test]
fn cmp() {
    test_expr!("0 == 0", "true");
    test_expr!("1 == 2", "false");
    test_expr!("'abc' == 'def'", "false");
    test_expr!("'abc' == 'abc'", "true");
    test_expr!("\"\" == ''", "true");
    test_expr!("foo() == bar()", "foo()==bar()");

    test_expr!("1 != 0", "true");
    test_expr!("'abc' != 'def'", "true");
    test_expr!("'a' != 'a'", "false");

    test_expr!("1 < 20", "true");
    test_expr!("3 < 3", "false");
    test_expr!("10 > 1.0", "true");
    test_expr!("10 > 10.25", "false");
    test_expr!("y == y", "y==y"); // Maybe foldable given type information
    test_expr!("y < y", "false");
    test_expr!("y > y", "false");
    test_expr!("1 <= 1", "true");
    test_expr!("1 <= 0", "false");
    test_expr!("0 >= 0", "true");
    test_expr!("-1 >= 9", "false");

    test_expr!("true == true", "true");
    test_expr!("false == false", "true");
    test_expr!("false == null", "false");
    test_expr!("false == true", "false");
    test_expr!("true == null", "false");

    test_expr!("0 == 0", "true");
    test_expr!("1 == 2", "false");
    test_expr!("'abc' == 'def'", "false");
    test_expr!("'abc' == 'abc'", "true");
    test_expr!("\"\" == ''", "true");
    same_expr!("foo() == bar()");

    test_expr!("1 != 0", "true");
    test_expr!("'abc' != 'def'", "true");
    test_expr!("'a' != 'a'", "false");

    test_expr!("1 < 20", "true");
    test_expr!("3 < 3", "false");
    test_expr!("10 > 1.0", "true");
    test_expr!("10 > 10.25", "false");
    same_expr!("x == x");
    test_expr!("x < x", "false");
    test_expr!("x > x", "false");
    test_expr!("1 <= 1", "true");
    test_expr!("1 <= 0", "false");
    test_expr!("0 >= 0", "true");
    test_expr!("-1 >= 9", "false");

    test_expr!("true == true", "true");
    test_expr!("false == null", "false");
    test_expr!("false == true", "false");
    test_expr!("true == null", "false");
}

/// ===, !== tests
#[test]
fn strict_eq_cmp() {
    test_expr!("0 === 0", "true");
    test_expr!("1 === 2", "false");
    test_expr!("'abc' === 'def'", "false");
    test_expr!("'abc' === 'abc'", "true");
    test_expr!("\"\" === ''", "true");
    test_expr!("foo() === bar()", "foo()===bar()");

    test_expr!("1 !== 0", "true");
    test_expr!("'abc' !== 'def'", "true");
    test_expr!("'a' !== 'a'", "false");

    test_expr!("y === y", "y===y");

    test_expr!("true === true", "true");
    test_expr!("false === false", "true");
    test_expr!("false === null", "false");
    test_expr!("false === true", "false");
    test_expr!("true === null", "false");

    test_expr!("0 === 0", "true");
    test_expr!("1 === 2", "false");
    test_expr!("'abc' === 'def'", "false");
    test_expr!("'abc' === 'abc'", "true");
    test_expr!("\"\" === ''", "true");
    same_expr!("foo() === bar()");

    test_expr!("1 === '1'", "false");
    test_expr!("1 === true", "false");
    test_expr!("1 !== '1'", "true");
    test_expr!("1 !== true", "true");

    test_expr!("1 !== 0", "true");
    test_expr!("'abc' !== 'def'", "true");
    test_expr!("'a' !== 'a'", "false");

    same_expr!("x === x");

    test_expr!("true === true", "true");
    test_expr!("false === null", "false");
    test_expr!("false === true", "false");
    test_expr!("true === null", "false");
}

#[test]
fn cmp_not_expr() {
    test_expr!("!1 == !0", "false");

    test_expr!("!0 == !0", "true");
    test_expr!("!1 == !1", "true");
    test_expr!("!1 == null", "false");
    test_expr!("!1 == !0", "false");
    test_expr!("!0 == null", "false");

    test_expr!("!0 == !0", "true");
    test_expr!("!1 == null", "false");
    test_expr!("!1 == !0", "false");
    test_expr!("!0 == null", "false");

    test_expr!("!0 === !0", "true");
    test_expr!("!1 === !1", "true");
    test_expr!("!1 === null", "false");
    test_expr!("!1 === !0", "false");
    test_expr!("!0 === null", "false");

    test_expr!("!0 === !0", "true");
    test_expr!("!1 === null", "false");
    test_expr!("!1 === !0", "false");
    test_expr!("!0 === null", "false");
}

#[test]
#[ignore]
fn cmp_4() {
    same_expr!("[] == false"); // true
    same_expr!("[] == true"); // false
    same_expr!("[0] == false"); // true
    same_expr!("[0] == true"); // false
    same_expr!("[1] == false"); // false
    same_expr!("[1] == true"); // true
    same_expr!("({}) == false"); // false
    same_expr!("({}) == true"); // true
}

#[test]
fn member_1() {
    test_expr!("[,10][0]", "void 0");
    test_expr!("[10, 20][0]", "10");
    test_expr!("[10, 20][1]", "20");

    // same_expr!(
    //     "[10, 20][0.5]",
    //     PeepholeFoldConstants.INVALID_GETELEM_INDEX_ERROR,
    // );
    // same_expr!(
    //     "[10, 20][-1]",
    //     PeepholeFoldConstants.INDEX_OUT_OF_BOUNDS_ERROR,
    // );
    // same_expr!(
    //     "[10, 20][2]",
    //     PeepholeFoldConstants.INDEX_OUT_OF_BOUNDS_ERROR,
    // );

    same_expr!("[foo(), 0][1]");
    test_expr!("[0, foo()][1]", "foo()");
    same_expr!("[0, foo()][0]");
    same_expr!("for([1][0] in {});");
}

#[test]
fn member_2() {
    test_expr!("'string'[5]", "'g'");
    test_expr!("'string'[0]", "'s'");
    test_expr!("'s'[0]", "'s'");
    same_expr!(r#"'\uD83D\uDCA9'[0]"#);

    // same_expr!(
    //     "'string'[0.5]",
    //     PeepholeFoldConstants.INVALID_GETELEM_INDEX_ERROR,
    // );
    // same_expr!(
    //     "'string'[-1]",
    //     PeepholeFoldConstants.INDEX_OUT_OF_BOUNDS_ERROR,
    // );
    // same_expr!(
    //     "'string'[6]",
    //     PeepholeFoldConstants.INDEX_OUT_OF_BOUNDS_ERROR,
    // );
}

#[test]
fn complex() {
    test_expr!("(3 / 1.0) + (1 * 2)", "5");
    test_expr!("(1 == 1.0) && foo() && true", "foo() && true");
    test_expr!("'abc' + 5 + 10", "'abc510'");
}

#[test]
#[ignore]
fn left() {
    same_expr!("(+x - 1) + 2"); // not yet
    test_expr!("(+x + 1) + 2", "+x + 3");
}

#[test]
fn array_length() {
    // Can fold
    test_expr!("[].length", "0");
    test_expr!("[1,2,3].length", "3");
    test_expr!("[a,b].length", "2");

    // Not handled yet
    test_expr!("[,,1].length", "3");

    // Cannot fold
    test_expr!("[foo(), 0].length", "[foo(),0].length");
    same_expr!("y.length");
}

#[test]
fn str_length() {
    // Can fold basic strings.
    test_expr!("''.length", "0");
    test_expr!("'123'.length", "3");

    // Test Unicode escapes are accounted for.
    test_expr!(r#"'123\u01dc'.length"#, "4");
}

#[test]
fn type_of() {
    test_expr!("typeof 1", "\"number\"");
    test_expr!("typeof 'foo'", "\"string\"");
    test_expr!("typeof true", "\"boolean\"");
    test_expr!("typeof false", "\"boolean\"");
    test_expr!("typeof null", "\"object\"");
    test_expr!("typeof undefined", "\"undefined\"");
    test_expr!("typeof void 0", "\"undefined\"");
    test_expr!("typeof []", "\"object\"");
    test_expr!("typeof [1]", "\"object\"");
    test_expr!("typeof [1,[]]", "\"object\"");
    test_expr!("typeof {}", "\"object\"");
    test_expr!("typeof function() {}", "'function'");

    same_expr!("typeof[1, [foo()]]");
    same_expr!("typeof{bathwater:baby()}");
}

#[test]
fn instance_of() {
    // Non object types are never instances of anything.
    test_expr!("64 instanceof Object", "false");
    test_expr!("64 instanceof Number", "false");
    test_expr!("'' instanceof Object", "false");
    test_expr!("'' instanceof String", "false");
    test_expr!("true instanceof Object", "false");
    test_expr!("true instanceof Boolean", "false");
    test_expr!("!0 instanceof Object", "false");
    test_expr!("!0 instanceof Boolean", "false");
    test_expr!("false instanceof Object", "false");
    test_expr!("null instanceof Object", "false");
    test_expr!("undefined instanceof Object", "false");
    test_expr!("NaN instanceof Object", "false");
    test_expr!("Infinity instanceof Object", "false");

    // Array and object literals are known to be objects.
    test_expr!("[] instanceof Object", "true");
    test_expr!("({}) instanceof Object", "true");

    test_expr!("new Foo() instanceof Object", "new Foo(), true");
    // These would require type information to fold.
    same_expr!("[] instanceof Foo");
    same_expr!("({}) instanceof Foo");

    test_expr!("(function() {}) instanceof Object", "true");

    // An unknown value should never be folded.
    same_expr!("x instanceof Foo");
}

#[test]
fn div() {
    // Make sure the 1/3 does not expand to 0.333333
    same_expr!("print(1/3)");

    // Decimal form is preferable to fraction form when strings are the
    // same length.
    test_expr!("print(1/2)", "print(0.5)");
}

#[test]
fn assign_ops() {
    same_expr!("x = x+y");
    same_expr!("x = y+x");
    same_expr!("x = x*y");
    same_expr!("x = y*x");
    same_expr!("x.y=x.y+z");
    same_expr!("next().x = next().x + 1");

    same_expr!("x = x-y");
    same_expr!("x = y-x");
    same_expr!("x = x|y");
    same_expr!("x = y|x");
    same_expr!("x = x*y");
    same_expr!("x = y*x");
    same_expr!("x.y=x.y+z");
    same_expr!("next().x = next().x + 1");
}

#[test]
fn assign_ops_complex() {
    // This is OK, really.
    test_expr!("({a:1}).a = ({a:1}).a + 1", "({a:1}).a = 2");
}

#[test]
fn bool_num_add_1() {
    test_expr!("false+1", "1");
    test_expr!("true+1", "2");
    test_expr!("1+false", "1");
    test_expr!("1+true", "2");
}

#[test]
fn lit_names() {
    test_expr!("NaN == NaN", "false");
    test_expr!("Infinity == Infinity", "true");
    test_expr!("Infinity == NaN", "false");
    test_expr!("undefined == NaN", "false");
    test_expr!("undefined == Infinity", "false");

    test_expr!("Infinity >= Infinity", "true");
    test_expr!("NaN >= NaN", "false");
}

#[test]
fn lit_type_mismatches() {
    test_expr!("true == true", "true");
    test_expr!("true == false", "false");
    test_expr!("true == null", "false");
    test_expr!("false == null", "false");

    // relational operators convert its operands
    test_expr!("null <= null", "true"); // 0 = 0
    test_expr!("null >= null", "true");
    test_expr!("null > null", "false");
    test_expr!("null < null", "false");

    test_expr!("false >= null", "true"); // 0 = 0
    test_expr!("false <= null", "true");
    test_expr!("false > null", "false");
    test_expr!("false < null", "false");

    test_expr!("true >= null", "true"); // 1 > 0
    test_expr!("true <= null", "false");
    test_expr!("true > null", "true");
    test_expr!("true < null", "false");

    test_expr!("true >= false", "true"); // 1 > 0
    test_expr!("true <= false", "false");
    test_expr!("true > false", "true");
    test_expr!("true < false", "false");
}

#[test]
fn left_child_concat() {
    same_expr!("x +5 + \"1\"");
    test_expr!("x+\"5\" + \"1\"", "x + \"51\"");
    test_expr!("\"a\"+(c+\"b\")", "\"a\"+c+\"b\"");
    test_expr!("\"a\"+(\"b\"+c)", "\"ab\"+c");
}

#[test]
fn left_child_op() {
    test_expr!("x * Infinity * 2", "x * Infinity");
    same_expr!("x - Infinity - 2"); // want "x-Infinity"
    same_expr!("x - 1 + Infinity");
    same_expr!("x - 2 + 1");
    same_expr!("x - 2 + 3");
    same_expr!("1 + x - 2 + 1");
    same_expr!("1 + x - 2 + 3");
    same_expr!("1 + x - 2 + 3 - 1");
    same_expr!("f(x)-0");
    test_expr!("x-0-0", "x-0");
    same_expr!("x+2-2+2");
    same_expr!("x+2-2+2-2");
    same_expr!("x-2+2");
    same_expr!("x-2+2-2");
    same_expr!("x-2+2-2+2");

    same_expr!("1+x-0-NaN");
    same_expr!("1+f(x)-0-NaN");
    same_expr!("1+x-0+NaN");
    same_expr!("1+f(x)-0+NaN");

    same_expr!("1+x+NaN"); // unfoldable
    same_expr!("x+2-2"); // unfoldable
    same_expr!("x+2"); // nothing to do
    same_expr!("x-2"); // nothing to do
}

#[test]
fn simple_arithmetic_op() {
    same_expr!("x*NaN");
    same_expr!("NaN/y");
    same_expr!("f(x)-0");
    same_expr!("f(x)*1");
    same_expr!("1*f(x)");
    same_expr!("0+a+b");
    same_expr!("0-a-b");
    same_expr!("a+b-0");
    same_expr!("(1+x)*NaN");

    same_expr!("(1+f(x))*NaN"); // don't fold side-effects
}

#[test]
fn lits_as_nums() {
    test_expr!("x/'12'", "x/12");
    test_expr!("x/('12'+'6')", "x/126");
    test_expr!("true*x", "1*x");
    test_expr!("x/false", "x/0"); // should we add an error check? :)
}

#[test]
fn bang_constants() {
    test_expr!("1 + !0", "2");
    test_expr!("1 + !1", "1");
    test_expr!("'a ' + !1", "'a false'");
    test_expr!("'a ' + !0", "'a true'");
}

#[test]
fn mixed() {
    test_expr!("''+[1]", "'1'");
    test_expr!("false+[]", "\"false\"");
}

#[test]
fn void() {
    same_expr!("void 0");
    test_expr!("void 1", "void 0");
    test_expr!("void x", "void 0");
    same_expr!("void x()");
}

#[test]
fn obj_lit() {
    test_expr!("(!{})", "false");
    test_expr!("(!{a:1})", "false");
    test_expr!("(!{a:foo()})", "foo(), false");
    test_expr!("(!{[a()]: foo()})", "a(), foo(), false");

    // Computed property name may have side effects.
    test_expr!("(!{ [a()] (){} })", "a(), false");
    test_expr!("(!{'a':foo()})", "foo(), false");
}

#[test]
fn array_lit() {
    test_expr!("(![])", "false");
    test_expr!("(![1])", "false");
    test_expr!("(![a])", "false");
    test_expr!("(![foo()])", "foo(), false");
}

#[test]
fn issue_601() {
    same_expr!("'\\v' == 'v'");
    same_expr!("'v' == '\\v'");
    same_expr!("'\\u000B' == '\\v'");
}

#[test]
#[ignore]
fn obj_lit_ref_1() {
    // Leave extra side-effects in place
    same_expr!("({a:foo(),b:bar()}).a");
    same_expr!("({a:1,b:bar()}).a");
    same_expr!("(function f() { return {b:foo(), a:2}.a; })");

    // on the LHS the object act as a temporary leave it in place.
    same_expr!("({a:x}).a = 1");
    test_expr!("({a:x}).a += 1", "({a:x}).a = x + 1");
    same_expr!("({a:x}).a ++");
    same_expr!("({a:x}).a --");

    // functions can't reference the object through 'this'.
    same_expr!("({a:function(){return this}}).a");
    same_expr!("({get a() {return this}}).a");
    same_expr!("({set a(b) {return this}}).a");

    // Leave unknown props alone, the might be on the prototype
    same_expr!("({}).a");

    // setters by themselves don't provide a definition
    same_expr!("({}).a");
    same_expr!("({set a(b) {}}).a");
    // sets don't hide other definitions.
    test_expr!("({a:1,set a(b) {}}).a", "1");

    // get is transformed to a call (gets don't have self referential names)
    test_expr!("({get a() {}}).a", "(function (){})()");
    // sets don't hide other definitions.
    test_expr!("({get a() {},set a(b) {}}).a", "(function (){})()");

    // a function remains a function not a call.
    test_expr!("({a:function(){return 1}}).a", "(function(){return 1})",);

    test_expr!("({a:1}).a", "1");
    test_expr!("({a:1, a:2}).a", "2");
    test_expr!("({a:1, a:foo()}).a", "foo()");
    test_expr!("({a:foo()}).a", "foo()");

    test_expr!(
        "(function f() { return {a:1, b:2}.a; })",
        "(function f() { return 1; })",
    );

    // GETELEM is handled the same way.
    test_expr!("({'a':1})['a']", "1");
}

#[test]
#[ignore]
fn obj_lit_ref_2() {
    test_expr!("({a:x}).a += 1", "({a:x}).a = x + 1");
}

#[test]
fn ie_str() {
    same_expr!("!+'\\v1'");
}

#[test]
fn issue_522() {
    same_expr!("[][1] = 1;");
}

#[test]
fn fold_object_define_properties_1() {
    test_expr!("Object.defineProperties({}, {})", "{}");
    test_expr!("Object.defineProperties(a, {})", "a");
    same_expr!("Object.defineProperties(a, {anything:1})");
}

#[test]
fn es6_features() {
    test_expr!("{[undefined != true] : 1};", "{[true] : 1};");
    test_expr!("let x = false && y;", "let x = false;");
    test_expr!("const x = null == undefined", "const x = true");
    test_expr!(
        "var [a, , b] = [false+1, true+1, ![]]",
        "var [a, , b] = [1, 2, false]"
    );
    test_expr!("() =>  true || x;", "() => true;");
    test_expr!(
        "(function foo(x = (1 !== void 0), y) {return x+y;})",
        "(function foo(x = true, y) {return x+y;})",
    );
    test_expr!(
        "class Foo {
            constructor() {this.x = null <= null;}
        }",
        "class Foo {
            constructor() {this.x = true;}
        }",
    );
    test_expr!(
        "(function foo() {return `${false && y}`})",
        "(function foo() {return `${false}`})",
    );
}
