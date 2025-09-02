#[allow(clippy::module_inception)]
mod fixer;
mod paren_remover;

pub use fixer::fixer;
pub use paren_remover::paren_remover;

#[cfg(test)]
mod tests {
    use swc_ecma_ast::noop_pass;

    fn run_test(from: &str, to: &str) {
        crate::tests::test_transform(
            Default::default(),
            // test_transform has alreay included fixer
            |_| noop_pass(),
            from,
            to,
            true,
            Default::default,
        );
    }

    macro_rules! test_fixer {
        ($name:ident, $from:literal, $to:literal) => {
            #[test]
            fn $name() {
                run_test($from, $to);
            }
        };
    }

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test_fixer!($name, $src, $src);
        };
    }

    identical!(fn_expr_position, r#"foo(function(){}())"#);

    identical!(fn_decl, r#"function foo(){}"#);

    identical!(iife, r#"(function(){})()"#);

    identical!(paren_seq_arg, "foo(( _temp = _this = init(), _temp));");

    identical!(
        regression_01,
        "_set(_get_prototype_of(Obj.prototype), _ref = proper.prop, (_superRef = \
         +_get(_get_prototype_of(Obj.prototype), _ref, this)) + 1, this, true), _superRef;"
    );

    identical!(
        regression_02,
        "var obj = (_obj = {}, _define_property(_obj, 'first', 'first'), _define_property(_obj, \
         'second', 'second'), _obj);"
    );

    identical!(
        regression_03,
        "_iteratorNormalCompletion = (_step = _iterator.next()).done"
    );

    identical!(
        regression_04,
        "var _tmp;
const _ref = {}, { c =( _tmp = {}, d = _extends({}, _tmp), _tmp)  } = _ref;"
    );

    identical!(
        regression_05,
        "for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step \
         = _iterator.next()).done); _iteratorNormalCompletion = true) {
    i = _step.value;
}"
    );

    identical!(
        regression_06,
        "
        var _tmp;
        const { [( _tmp = {}, d = _extends({}, _tmp), _tmp)]: c  } = _ref;
        "
    );

    identical!(
        regression_07,
        "( _temp = super(), _initialize(this), _temp).method();"
    );

    identical!(regression_08, "exports.bar = exports.default = void 0;");

    identical!(regression_09, "({x} = { x: 1 });");

    identical!(regression_10, "({x} = { x: 1 }), exports.x = x;");

    identical!(regression_11, "(void 0).foo();");

    identical!(regression_12, "(function(){})()");

    identical!(regression_13, "a || (a = 1);");

    identical!(issue_192, "a === true && (a = true)");

    identical!(issue_199, "(i - 1).toString()");

    identical!(
        issue_201_01,
        "outer = {
    inner: (_obj = {}, _define_property(_obj, ns.EXPORT1, true), _define_property(_obj, \
         ns.EXPORT2, true), _obj)
};"
    );

    identical!(issue_207, "a => ({x: 'xxx', y: {a}});");

    test_fixer!(
        fixer_01,
        "var a, b, c, d, e, f;
((a, b), (c())) + ((d, e), (f()));
",
        "var a, b, c, d, e, f;
(a, b, c()) + (d, e, f())"
    );

    test_fixer!(fixer_02, "(b, c), d;", "b, c, d;");

    test_fixer!(fixer_03, "((a, b), (c && d)) && e;", "(a, b, c && d) && e;");

    test_fixer!(fixer_04, "for ((a, b), c;;) ;", "for(a, b, c;;);");

    test_fixer!(
        fixer_05,
        "var a, b, c = (1), d, e, f = (2);
((a, b), c) + ((d, e), f);",
        "var a, b, c = 1, d, e, f = 2;
(a, b, c) + (d, e, f);"
    );

    test_fixer!(
        fixer_06,
        "var a, b, c, d;
a = ((b, c), d);",
        "var a, b, c, d;
a = (b, c, d);"
    );

    test_fixer!(
        fixer_07,
        "a => ((b, c) => ((a, b), c));",
        "(a)=>(b, c)=>(a, b, c);"
    );

    test_fixer!(fixer_08, "typeof (((1), a), (2));", "typeof (a, 2)");

    test_fixer!(
        fixer_09,
        "(((a, b), c), d) ? e : f;",
        "(a, b, c, d) ? e : f;"
    );

    test_fixer!(
        fixer_10,
        "
function a() {
  return (((void (1)), (void (2))), a), (void (3));
}
",
        "
function a() {
  return a, void 3;
}
"
    );

    test_fixer!(fixer_11, "c && ((((2), (3)), d), b);", "c && (d, b)");

    test_fixer!(fixer_12, "(((a, b), c), d) + e;", "(a, b, c, d) + e;");

    test_fixer!(fixer_13, "delete (((1), a), (2));", "delete (a, 2)");

    test_fixer!(fixer_14, "(1, 2, a)", "1, a");

    identical!(issue_231, "'' + (truthy && '?') + truthy;");

    identical!(issue_252, "!!(a && b);");

    identical!(issue_255, "b < 0 ? (t = b, b = 1) : (t = -b, b = 0);");

    identical!(
        issue_266_1,
        "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);"
    );

    test_fixer!(
        issue_266_2,
        "'Q' + (+x1) + ',' + (+y1) + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);",
        "'Q' + +x1 + ',' + +y1 + ',' + (this._x1 = +x) + ',' + (this._y1 = +y);"
    );

    identical!(
        issue_280,
        "e.hasOwnProperty(a) && (t = e[a] ? this[a] = t(n) : 'target' === a ? this.target = r : \
         this[a] = n[a]);"
    );

    identical!(
        issue_282,
        "!(A = [], B = (function () { return classNames; }).apply(exports, A), B !== undefined && \
         (module.exports = B));"
    );

    identical!(
        issue_286,
        "var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(39) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});"
    );

    identical!(
        issue_293_1,
        "for (var e in a) a.hasOwnProperty(e) && ((b = a[e]) ? this[e] = b(c) : 'target' === e ? \
         this.target = d : this[e] = c[e]);"
    );

    identical!(
        issue_293_2,
        "(a = rb ? zb(a, c) : Ab(a, c)) ? (b = nb.getPooled(ub.beforeInput, b, c, d), b.data = a, \
         Ra(b)) : b = null;"
    );

    identical!(member_object_lit, "({}).foo");

    identical!(member_cond_expr, "(foo ? 1 : 2).foo");

    identical!(member_new_exp_1, "(new Foo).foo");

    identical!(member_new_exp_2, "new ctor().property");

    identical!(member_tagged_tpl, "tag``.foo");

    identical!(member_arrow_expr_1, "(a => a).foo");

    identical!(member_arrow_expr_2, "((a) => a).foo");

    identical!(member_class, "(class Foo{}).foo");

    identical!(member_yield, "function* foo(){ (yield bar).baz }");

    identical!(member_await, "async function foo(){ (await bar).baz }");

    identical!(bin_yield_expr_1, "function* foo(){ (yield foo) && bar }");

    identical!(bin_yield_expr_2, "function* foo(){ bar && (yield foo) }");

    identical!(bin_seq_expr_1, "(foo(), op) || (seq(), foo)");

    identical!(bin_seq_expr_2, "(foo, op) || (seq, foo)");

    identical!(cond_object_1, "let foo = {} ? 1 : 2;");

    identical!(cond_object_2, "({}) ? 1 : 2;");

    identical!(cond_in_cond, "(foo ? 1 : 2) ? 3 : 4");

    identical!(arrow_in_cond, "(() => {}) ? 3 : 4");

    identical!(unary_cond_arg, "void (foo ? 1 : 2)");

    identical!(unary_arrow_arg, "void ((foo) => foo)");

    identical!(unary_yield_arg, "(function* foo() { void (yield foo); })()");

    identical!(
        issue_365,
        "const foo = (() => {
  return 1
})();"
    );

    identical!(
        issue_382_1,
        "const myFilter = (arr, filter) => arr.filter(((x) => x) || filter);"
    );

    identical!(
        issue_382_2,
        "const myFilter = (arr, filter) => arr.filter(filter || ((x) => x));"
    );

    identical!(issue_418, "const a = 1 - (1 - 1)");

    test_fixer!(
        issue_439,
        "() => {
  return (
    Promise.resolve('foo')
      // Interfering comment
      .then(() => {})
  );
};",
        "() => {
  return Promise.resolve('foo')
      // Interfering comment
      .then(() => {})
  ;
};"
    );

    test_fixer!(
        issue_451,
        "const instance = new (
  function() {
    function klass(opts) {
      this.options = opts;
    }
    return (Object.assign(klass.prototype, {
      method() {}
    }), klass);
  }()
)({ foo: 1 });",
        "const instance = new (function() {
    function klass(opts) {
        this.options = opts;
    }
    return Object.assign(klass.prototype, {
        method () {
        }
    }), klass;
}())({
    foo: 1
});"
    );

    test_fixer!(void_and_bin, "(void 0) * 2", "(void 0) * 2");

    test_fixer!(new_cond, "new (a ? B : C)()", "new (a ? B : C)()");

    identical!(issue_931, "new (eval('Date'))();");

    identical!(issue_1002, "new (P || (P = Promise))");

    identical!(
        issue_1050,
        "
        (a) => (set) => (elemE(a, set) ? removeE : insertE)(a)(set)
        "
    );

    identical!(
        deno_001,
        "
    var Status;
    (function init(Status1) {
    })(Status || (Status = {
    }));
"
    );

    identical!(issue_1093, "const x = (fnA || fnB)();");

    identical!(
        issue_1133,
        "async function foo() {
            const item = await (data === null || data === void 0 ? void 0 : data.foo());
        }"
    );

    identical!(deno_8722, "console.log((true || false) ?? true);");

    identical!(
        deno_8597,
        "
        biasInitializer = new (_a = class CustomInit extends Initializer {})();
        "
    );

    test_fixer!(
        minifier_001,
        "var bitsLength = 3, bitsOffset = 3, what = (len = 0)",
        "var bitsLength = 3, bitsOffset = 3, what = len = 0"
    );

    test_fixer!(minifier_002, "!(function(){})()", "!function(){}()");

    identical!(
        issue_1397,
        "const main = async () => await (await server)()"
    );

    identical!(deno_9810, "await (bar = Promise.resolve(2));");

    identical!(issue_1493, "('a' ?? 'b') || ''");
    identical!(call_seq, "let x = ({}, () => 2)();");

    test_fixer!(
        call_seq_with_padding,
        "let x = ({}, (1, 2), () => 2)();",
        "let x = ({}, () => 2)();"
    );

    identical!(
        param_seq,
        "function t(x = ({}, 2)) {
            return x;
        }"
    );

    identical!(
        yield_expr_cond,
        "function *test1(foo) {
            return (yield foo) ? 'bar' : 'baz';
        }"
    );

    identical!(
        deno_10487_1,
        "var generator = class MultiVector extends (options.baseType||Float32Array) {}"
    );

    identical!(
        deno_10487_2,
        "class MultiVector extends (options.baseType||Float32Array) {}"
    );

    identical!(
        extends_nullish_coalescing,
        "class Foo extends (Bar ?? class{}) {}"
    );

    identical!(extends_assign, "class Foo extends (Bar = class{}) {}");

    identical!(
        extends_logical_or_assin,
        "class Foo extends (Bar ||= class{}) {}"
    );

    identical!(
        extends_logical_and_assin,
        "class Foo extends (Bar &&= class{}) {}"
    );

    identical!(
        extends_logical_nullish_assin,
        "class Foo extends (Bar ??= class{}) {}"
    );

    identical!(extends_cond, "class Foo extends (true ? Bar : Baz) {}");

    identical!(
        extends_await_yield,
        "
        async function* func() {
            class A extends (await p) {}
            class B extends (yield p) {}
        }
        "
    );

    identical!(deno_10668_1, "console.log(null ?? (undefined && true))");

    identical!(deno_10668_2, "console.log(null && (undefined ?? true))");

    identical!(minifier_003, "(four ** one) ** two");

    identical!(minifier_004, "(void 0)(0)");

    identical!(issue_1781, "const n = ~~(Math.PI * 10)");

    identical!(issue_1789, "+(+1 / 4)");

    identical!(new_member_call_1, "new (getObj()).ctor()");
    test_fixer!(
        new_member_call_2,
        "new (getObj().ctor)()",
        "new (getObj()).ctor()"
    );
    test_fixer!(
        new_member_call_3,
        "new (x.getObj().ctor)()",
        "new (x.getObj()).ctor()"
    );
    identical!(new_call, "new (getCtor())");
    test_fixer!(new_member_1, "new obj.ctor()", "new obj.ctor()");
    test_fixer!(new_member_2, "new (obj.ctor)", "new obj.ctor");

    identical!(
        new_await_1,
        "async function foo() { new (await getServerImpl())(options) }"
    );
    test_fixer!(minifier_005, "-(1/0)", "-1/0");

    test_fixer!(minifier_006, "-('s'/'b')", "-('s'/'b')");

    test_fixer!(minifier_007, "(void 0) === value", "void 0 === value");
    test_fixer!(minifier_008, "(size--) && (b = (c))", "size-- && (b = c)");

    test_fixer!(
        minifier_009,
        "(--remaining) || deferred.resolveWith()",
        "--remaining || deferred.resolveWith()"
    );

    test_fixer!(minifier_010, "(--remaining) + ''", "--remaining + ''");

    identical!(
        if_stmt_001,
        "
        export const obj = {
            each: function (obj, callback, args) {
                var i = 0, length = obj.length, isArray = isArraylike(obj);
                if (args) {
                    if (isArray)
                        for (; i < length && !1 !== callback.apply(obj[i], args); i++);
                    else
                        for (i in obj)
                            if (!1 === callback.apply(obj[i], args))
                                break
                } else if (isArray)
                    for (; i < length && !1 !== callback.call(obj[i], i, obj[i]); i++);
                else
                    for (i in obj)
                        if (!1 === callback.call(obj[i], i, obj[i]))
                            break;
                return obj
            }
        };
        "
    );

    identical!(
        issue_2155,
        "
        async function main() {
            let promise;
            await (promise || (promise = Promise.resolve('this is a string')));
        }
        "
    );

    identical!(issue_2163_1, "() => ({foo} = bar());");

    identical!(issue_2163_2, "() => ([foo] = bar());");

    identical!(issue_2191, "(-1) ** h");

    identical!(
        minifier_011,
        "
        function ItemsList() {
            var _ref;

            var _temp, _this, _ret;

            _class_call_check(this, ItemsList);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possible_constructor_return(this, (_ref = \
         ItemsList.__proto__ || Object.getPrototypeOf(ItemsList)).call.apply(_ref, \
         [this].concat(args))), _this), _this.storeHighlightedItemReference = function \
         (highlightedItem) {
              _this.props.onHighlightedItemChange(highlightedItem === null ? null : \
         highlightedItem.item);
            }, _temp), _possible_constructor_return(_this, _ret);
          }
        "
    );

    identical!(
        minifier_012,
        "
        function ItemsList() {
            for(var _ref, _temp, _this, _len = arguments.length, args = Array(_len), _key = 0; \
         _key < _len; _key++)args[_key] = arguments[_key];
            return _possible_constructor_return(_this, (_temp = (_this = \
         _possible_constructor_return(this, (_ref = ItemsList.__proto__ || \
         Object.getPrototypeOf(ItemsList)).call.apply(_ref, [
                this
            ].concat(args))), _this), _this.storeHighlightedItemReference = \
         function(highlightedItem) {
                _this.props.onHighlightedItemChange(null === highlightedItem ? null : \
         highlightedItem.item);
            }, _temp));
        }
        "
    );

    test_fixer!(issue_2550_1, "(1 && { a: 1 })", "1 && { a:1 }");

    identical!(issue_2550_2, "({ isNewPrefsActive }) && { a: 1 }");

    test_fixer!(paren_of_bin_left_1, "({} && 1)", "({}) && 1");
    identical!(paren_of_bin_left_2, "({}) && 1");
    test_fixer!(
        paren_of_bin_left_3,
        "(function () {} || 2)",
        "(function () {}) || 2"
    );
    identical!(paren_of_bin_left_4, "(function () {}) || 2");

    test_fixer!(paren_of_bin_left_5, "(class{} ?? 3)", "(class{}) ?? 3");
    identical!(paren_of_bin_left_6, "(class{}) ?? 3");

    identical!(issue_4761, "x = { ...(0, foo) }");

    identical!(issue_4914, "(a ?? b)?.()");

    identical!(issue_5109_1, "(0, b)?.()");
    identical!(issue_5109_2, "1 + (0, b)?.()");
    identical!(issue_5109_3, "(0, a)() ? undefined : (0, b)?.()");

    identical!(
        issue_5313,
        "
        async function* foo() {
            (await a)();
            (yield b)();
        }
        "
    );

    identical!(issue_5417, "console.log(a ?? b ?? c)");

    identical!(bin_and_unary, "console.log(a++ && b--)");
}
