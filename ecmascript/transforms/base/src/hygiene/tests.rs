use super::*;
use crate::tests::HygieneVisualizer;
use crate::tests::Tester;
use std::collections::HashMap;
use swc_common::{hygiene::*, DUMMY_SP};
use swc_ecma_parser::Syntax;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{Fold, FoldWith};

struct Marker {
    map: HashMap<JsWord, Mark>,
}

fn marker(markers: &[(&str, Mark)]) -> Marker {
    Marker {
        map: markers.iter().map(|(k, v)| ((*k).into(), *v)).collect(),
    }
}

impl Fold for Marker {
    fn fold_ident(&mut self, mut ident: Ident) -> Ident {
        if let Some(mark) = self.map.get(&ident.sym) {
            ident.span = ident.span.apply_mark(*mark);
        }

        ident
    }
}

struct OnceMarker {
    map: HashMap<JsWord, Vec<Mark>>,
}

impl OnceMarker {
    fn new(markers: &[(&str, &[Mark])]) -> OnceMarker {
        OnceMarker {
            map: markers
                .iter()
                .map(|(k, v)| ((*k).into(), (*v).into()))
                .collect(),
        }
    }
}

impl Fold for OnceMarker {
    fn fold_ident(&mut self, mut ident: Ident) -> Ident {
        if let Some(marks) = self.map.get_mut(&ident.sym) {
            ident.span = ident.span.apply_mark(marks.remove(0));
        }

        ident
    }
}

fn test<F>(op: F, expected: &str)
where
    F: FnOnce(&mut Tester<'_>) -> Result<Vec<Stmt>, ()>,
{
    test_module(
        |tester| {
            Ok(Module {
                span: DUMMY_SP,
                body: op(tester)?.into_iter().map(ModuleItem::Stmt).collect(),
                shebang: None,
            })
        },
        expected,
        Default::default(),
    )
}

fn test_module<F>(op: F, expected: &str, config: Config)
where
    F: FnOnce(&mut crate::tests::Tester<'_>) -> Result<Module, ()>,
{
    crate::tests::Tester::run(|tester| {
        let module = op(tester)?;

        match ::std::env::var("PRINT_HYGIENE") {
            Ok(ref s) if s == "1" => {
                let hygiene_src = tester.print(&module.clone().fold_with(&mut HygieneVisualizer));
                println!("----- Hygiene -----\n{}", hygiene_src);
            }
            _ => {}
        }

        let module = module.fold_with(&mut hygiene_with_config(config));

        let actual = tester.print(&module);

        let expected = {
            let expected = tester.with_parser("expected.js", Syntax::default(), expected, |p| {
                p.parse_module()
            })?;
            tester.print(&expected)
        };

        if actual != expected {
            panic!(
                "\n>>>>> Actual <<<<<\n{}\n>>>>> Expected <<<<<\n{}",
                actual, expected
            );
        }

        Ok(())
    })
}

#[test]
fn simple() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "var foo = 1;")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
                tester
                    .parse_stmt("actual2.js", "var foo = 2;")?
                    .fold_with(&mut marker(&[("foo", mark2)])),
                tester
                    .parse_stmt("actual3.js", "use(foo)")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
            ])
        },
        "
        var foo = 1;
        var foo1 = 2;
        use(foo);
        ",
    );
}

#[test]
fn block_scoping_with_usage() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            let stmts = vec![
                tester
                    .parse_stmt("actual1.js", "var foo = 1;")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
                tester
                    .parse_stmt("actual2.js", "{ let foo = 2; use(foo); }")?
                    .fold_with(&mut marker(&[("foo", mark2)])),
                tester
                    .parse_stmt("actual3.js", "use(foo)")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
            ];
            Ok(stmts)
        },
        "
        var foo = 1;
        {
            let foo1 = 2;
            use(foo1);
        }
        use(foo);",
    );
}

#[test]
fn block_scoping_no_usage() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);

            let stmts = vec![
                tester
                    .parse_stmt("actual1.js", "let foo;")?
                    .fold_with(&mut marker(&[("foo", mark1)])),
                tester
                    .parse_stmt("actual2.js", "{ let foo }")?
                    .fold_with(&mut marker(&[("foo", mark2)])),
            ];
            Ok(stmts)
        },
        "
        let foo;
        {
            let foo1;
        }
        ",
    );
}

#[test]
fn fn_binding_ident() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "var foo = function baz(){}")?
                    .fold_with(&mut marker(&[("baz", mark1)])),
                tester
                    .parse_stmt("actual2.js", "var bar = function baz(){};")?
                    .fold_with(&mut marker(&[("baz", mark2)])),
                tester
                    .parse_stmt("actual3.js", "use(baz)")?
                    .fold_with(&mut marker(&[("baz", mark1)])),
            ])
        },
        "var foo = function baz(){};
            var bar = function baz1(){};
            use(baz);",
    );
}

#[test]
fn fn_binding_ident_in_call() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);
            let mark3 = Mark::fresh(mark1);

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "var foo = use(function baz(){})")?
                    .fold_with(&mut marker(&[("baz", mark1)])),
                tester
                    .parse_stmt("actual2.js", "var bar1 = use(function baz(){})")?
                    .fold_with(&mut marker(&[("baz", mark2)])),
                tester
                    .parse_stmt("actual3.js", "var bar2 = use(function baz(){})")?
                    .fold_with(&mut marker(&[("baz", mark3)])),
                tester
                    .parse_stmt("actual4.js", "use(baz)")?
                    .fold_with(&mut marker(&[("baz", mark1)])),
            ])
        },
        "var foo = use(function baz(){});
            var bar1 = use(function baz1(){});
            var bar2 = use(function baz2(){});
            use(baz);",
    );
}

#[test]
fn member_expr() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "let a;")?
                    .fold_with(&mut marker(&[("a", mark1)])),
                tester
                    .parse_stmt("actual2.js", "foo.a = init")?
                    .fold_with(&mut marker(&[("a", mark2)])),
            ])
        },
        "let a;
            foo.a = init",
    );
}

#[test]
fn const_then_fn_param() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "const a = 1;")?
                    .fold_with(&mut marker(&[("a", mark1)])),
                tester
                    .parse_stmt("actual2.js", "function foo(a) {use(a);}")?
                    .fold_with(&mut marker(&[("a", mark2)])),
            ])
        },
        "const a = 1;
            function foo(a1) {
                use(a1);
            }",
    );
}

#[test]
fn for_loop() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);
            let mark3 = Mark::fresh(mark1);

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "for(var a=1;;) {}")?
                    .fold_with(&mut marker(&[("a", mark1)])),
                tester
                    .parse_stmt("actual2.js", "for(var a of foo) {}")?
                    .fold_with(&mut marker(&[("a", mark2)])),
                tester
                    .parse_stmt("actual3.js", "for(var a=3;;) {}")?
                    .fold_with(&mut marker(&[("a", mark3)])),
            ])
        },
        "
            for(var a=1;;) {}
            for(var a1 of foo) {}
            for(var a2 = 3;;) {}
            ",
    );
}

#[test]
fn try_for_loop() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);
            let mark3 = Mark::fresh(mark1);

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "try { for(var a=1;;) {} } finally {}")?
                    .fold_with(&mut marker(&[("a", mark1)])),
                tester
                    .parse_stmt("actual2.js", "for(var a of foo) {}")?
                    .fold_with(&mut marker(&[("a", mark2)])),
                tester
                    .parse_stmt("actual3.js", "for(var a=3;;) {}")?
                    .fold_with(&mut marker(&[("a", mark3)])),
            ])
        },
        "
            try {
                for(var a=1;;) {}
            } finally {
            }
            for(var a1 of foo) {}
            for(var a2 = 3;;) {}
            ",
    );
}

#[test]
fn shorthand() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "let a = 1;")?
                    .fold_with(&mut marker(&[("a", mark1)])),
                tester
                    .parse_stmt(
                        "actual2.js",
                        "function foo() {
                                let a = 2;
                                use({ a })
                            }",
                    )?
                    .fold_with(&mut marker(&[("a", mark2)])),
            ])
        },
        "
            let a = 1;
            function foo() {
                let a1 = 2;
                use({ a: a1 })
            }
            ",
    );
}

#[test]
fn same_mark() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "var a = 1;")?
                    .fold_with(&mut marker(&[("a", mark1)])),
                tester
                    .parse_stmt("actual2.js", "var a = 1;")?
                    .fold_with(&mut marker(&[("a", mark1)])),
            ])
        },
        "
            var a = 1;
            var a = 1;
            ",
    );
}

#[test]
fn mark_root() {
    test(
        |tester| {
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![
                tester.parse_stmt("actual1.js", "var foo = 'bar';")?,
                Stmt::Decl(Decl::Fn(FnDecl {
                    ident: quote_ident!("Foo"),
                    function: Function {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        decorators: vec![],
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![
                                tester
                                    .parse_stmt("actual2.js", "var foo = 'foo';")?
                                    .fold_with(&mut marker(&[("foo", mark2)])),
                                tester.parse_stmt(
                                    "actual3.js",
                                    "_defineProperty(this, 'bar', foo);",
                                )?,
                            ],
                        }),
                        params: vec![],
                        type_params: Default::default(),
                        return_type: Default::default(),
                    },

                    declare: false,
                })),
            ])
        },
        "
var foo = 'bar';
function Foo() {
    var foo1 = 'foo';
    _defineProperty(this, 'bar', foo);
}
            ",
    );
}

#[test]
fn var_class_decl() {
    test(
        |tester| {
            Ok(vec![
                tester.parse_stmt("actual1.js", "var Foo = function Foo(){}")?
            ])
        },
        "var Foo = function Foo(){}",
    );
}

#[test]
fn var_class_decl_2() {
    test(
        |tester| {
            Ok(vec![tester
                .parse_stmt(
                    "actual1.js",
                    "
                var Foo = (function() {
                    function Foo() {}
                    return Foo;
                }())
                ",
                )?
                .fold_with(&mut marker(&[(
                    "Foo",
                    Mark::fresh(Mark::root()),
                )]))])
        },
        "
        var Foo = (function(){
            function Foo(){

            }
            return Foo;
        }())
        ",
    );
}

#[test]
fn fn_args() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());

            Ok(vec![Stmt::Decl(Decl::Fn(FnDecl {
                ident: quote_ident!("Foo"),
                function: Function {
                    span: DUMMY_SP,
                    is_async: false,
                    is_generator: false,
                    decorators: vec![],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![tester
                            .parse_stmt("actual1.js", "_defineProperty(this, 'force', force);")?],
                    }),
                    params: vec![Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat: Pat::Ident(quote_ident!("force").into()),
                    }
                    .fold_with(&mut marker(&[("force", mark1)]))],
                    type_params: Default::default(),
                    return_type: Default::default(),
                },

                declare: false,
            }))])
        },
        "
        function Foo(force1) {
            _defineProperty(this, 'force', force);
        }
        ",
    );
}

#[test]
fn block_in_fn() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);

            Ok(vec![Stmt::Decl(Decl::Fn(FnDecl {
                ident: quote_ident!("Foo"),
                function: Function {
                    span: DUMMY_SP,
                    is_async: false,
                    is_generator: false,
                    decorators: vec![],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            tester
                                .parse_stmt("actual1.js", "var bar;")?
                                .fold_with(&mut marker(&[("bar", mark1)])),
                            tester
                                .parse_stmt("actual2.js", "{ var bar; }")?
                                .fold_with(&mut marker(&[("bar", mark2)])),
                        ],
                    }),
                    params: vec![],
                    type_params: Default::default(),
                    return_type: Default::default(),
                },

                declare: false,
            }))])
        },
        "
        function Foo() {
            var bar;
            {
                var bar1;
            }
        }
        ",
    );
}

#[test]
fn flat_in_fn() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);

            Ok(vec![Stmt::Decl(Decl::Fn(FnDecl {
                ident: quote_ident!("Foo"),
                function: Function {
                    span: DUMMY_SP,
                    is_async: false,
                    is_generator: false,
                    decorators: vec![],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            tester
                                .parse_stmt("actual1.js", "var bar;")?
                                .fold_with(&mut marker(&[("bar", mark1)])),
                            tester
                                .parse_stmt("actual2.js", "var bar;")?
                                .fold_with(&mut marker(&[("bar", mark2)])),
                        ],
                    }),
                    params: vec![],
                    type_params: Default::default(),
                    return_type: Default::default(),
                },

                declare: false,
            }))])
        },
        "
        function Foo() {
            var bar;
            var bar1;
        }
        ",
    );
}

#[test]
fn params_in_fn() {
    test(
        |_tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![Stmt::Decl(Decl::Fn(FnDecl {
                ident: quote_ident!("Foo"),
                function: Function {
                    span: DUMMY_SP,
                    is_async: false,
                    is_generator: false,
                    decorators: vec![],
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![],
                    }),
                    params: vec![
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(
                                Ident::new("param".into(), DUMMY_SP.apply_mark(mark1)).into(),
                            ),
                        },
                        Param {
                            span: DUMMY_SP,
                            decorators: Default::default(),
                            pat: Pat::Ident(
                                Ident::new("param".into(), DUMMY_SP.apply_mark(mark2)).into(),
                            ),
                        },
                    ],
                    type_params: Default::default(),
                    return_type: Default::default(),
                },

                declare: false,
            }))])
        },
        "function Foo(param, param1) {}",
    );
}

#[test]
fn next_fn() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![
                tester
                    .parse_stmt("actual1.js", "function foo(param){}")?
                    .fold_with(&mut marker(&[("param", mark1)])),
                tester
                    .parse_stmt("actual2.js", "function bar(param){}")?
                    .fold_with(&mut marker(&[("param", mark2)])),
            ])
        },
        "
        function foo(param) {}
        function bar(param) {}
        ",
    );
}

#[test]
fn for_x() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(mark1);
            let mark3 = Mark::fresh(mark1);
            let mark4 = Mark::fresh(mark3);

            Ok(vec![
                tester
                    .parse_stmt(
                        "actual1.js",
                        "for (var _ref of []){
                            var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);
                        }",
                    )?
                    .fold_with(&mut marker(&[("_ref", mark1)])),
                tester
                    .parse_stmt(
                        "actual2.js",
                        "for (var _ref of []){
                            var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);
                        }",
                    )?
                    .fold_with(&mut marker(&[("_ref", mark2)])),
                tester
                    .parse_stmt(
                        "actual3.js",
                        "async function a() {
                            for await (var _ref of []){
                                var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);
                            }
                        }",
                    )?
                    .fold_with(&mut marker(&[("_ref", mark4)])),
            ])
        },
        "
        for (var _ref of []){
            var { a } = _ref, b = _objectWithoutProperties(_ref, ['a']);
        }

        for (var _ref1 of []){
            var { a } = _ref1, b = _objectWithoutProperties(_ref1, ['a']);
        }
        async function a() {
            for await (var _ref2 of []){
                var { a } = _ref2, b = _objectWithoutProperties(_ref2, ['a']);
            }
        }
        ",
    );
}

#[test]
fn fn_param_same_name() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![tester
                .parse_stmt("actual1.js", "function foo(param, param){}")?
                .fold_with(&mut OnceMarker::new(&[(
                    "param",
                    &[mark1, mark2],
                )]))])
        },
        "function foo(param, param1){}",
    );
}

#[test]
fn fn_param_same_name_in_arg() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![tester
                .parse_stmt("actual1.js", "use(function (param, param){})")?
                .fold_with(&mut OnceMarker::new(&[(
                    "param",
                    &[mark1, mark2],
                )]))])
        },
        "use(function (param, param1){})",
    );
}

#[test]
fn nested_fn_param_with_same_name() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![tester
                .parse_stmt(
                    "actual1.js",
                    "
                    function _three() {
                        _three = _asyncToGenerator(function*(a, param, c, param) {
                        });
                        return _three.apply(this, arguments);
                    }
                    ",
                )?
                .fold_with(&mut OnceMarker::new(&[(
                    "param",
                    &[mark1, mark2],
                )]))])
        },
        "
        function _three() {
            _three = _asyncToGenerator(function*(a, param, c, param1) {
            });
            return _three.apply(this, arguments);
        }
        ",
    );
}

#[test]
fn regression_001() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![tester
                .parse_stmt(
                    "actual1.js",
                    "var Foo = function() {
    function Foo() {
        _classCallCheck(this, Foo);
        foo.set(this, {
             writable: true, value: 0 
        });
    }
    _createClass(Foo, [{
             key: 'test', value: function test(other) {
                    var old, _obj, old, _obj;
                     _classPrivateFieldSet(this, foo, (old = +_classPrivateFieldGet(this, foo)) + \
                     1), old;
                     _classPrivateFieldSet(_obj = other.obj, foo, (old = \
                     +_classPrivateFieldGet(_obj, foo)) + 1), old;
                } 
        }]);
    return Foo;
}();
                    ",
                )?
                .fold_with(&mut OnceMarker::new(&[(
                    "old",
                    &[mark1, mark2, mark1, mark1, mark2, mark2],
                )]))])
        },
        "var Foo = function() {
    function Foo() {
        _classCallCheck(this, Foo);
        foo.set(this, {
             writable: true, value: 0 
        });
    }
    _createClass(Foo, [{
             key: 'test', value: function test(other) {
                    var old, _obj, old1, _obj;
                     _classPrivateFieldSet(this, foo, (old = +_classPrivateFieldGet(this, foo)) + \
         1), old;
                     _classPrivateFieldSet(_obj = other.obj, foo, (old1 = \
         +_classPrivateFieldGet(_obj, foo)) + 1), old1;
                } 
        }]);
    return Foo;
}();
        ",
    );
}

#[test]
fn regression_002() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(vec![tester
                .parse_stmt(
                    "actual1.js",
                    "_createClass(Foo, [{
             key: 'test', value: function test(other) {
                    var old, _obj, old, _obj;
                     _classPrivateFieldSet(this, foo, (old = +_classPrivateFieldGet(this, foo)) + \
                     1), old;
                     _classPrivateFieldSet(_obj = other.obj, foo, (old = \
                     +_classPrivateFieldGet(_obj, foo)) + 1), old;
                } 
        }])",
                )?
                .fold_with(&mut OnceMarker::new(&[(
                    "old",
                    &[mark1, mark2, mark1, mark1, mark2, mark2],
                )]))])
        },
        "_createClass(Foo, [{
             key: 'test', value: function test(other) {
                    var old, _obj, old1, _obj;
                     _classPrivateFieldSet(this, foo, (old = +_classPrivateFieldGet(this, foo)) + \
         1), old;
                     _classPrivateFieldSet(_obj = other.obj, foo, (old1 = \
         +_classPrivateFieldGet(_obj, foo)) + 1), old1;
                } 
        }]);",
    );
}

#[test]
fn regression_003() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_stmts(
                    "actual1.js",
                    "var old, _obj, old, _obj;
                     _classPrivateFieldSet(this, foo, (old = +_classPrivateFieldGet(this, foo)) + \
                     1), old;
                     _classPrivateFieldSet(_obj = other.obj, foo, (old = \
                     +_classPrivateFieldGet(_obj, foo)) + 1), old;",
                )?
                .fold_with(&mut OnceMarker::new(&[(
                    "old",
                    &[mark1, mark2, mark1, mark1, mark2, mark2],
                )])))
        },
        "var old, _obj, old1, _obj;
                     _classPrivateFieldSet(this, foo, (old = +_classPrivateFieldGet(this, foo)) + \
         1), old;
                     _classPrivateFieldSet(_obj = other.obj, foo, (old1 = \
         +_classPrivateFieldGet(_obj, foo)) + 1), old1;",
    );
}

#[test]
fn regression_004() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_stmts(
                    "actual1.js",
                    "function foo(...args){}
                    function bar(...args){}",
                )?
                .fold_with(&mut OnceMarker::new(&[("args", &[mark1, mark2])])))
        },
        "function foo(...args){}
        function bar(...args){}",
    );
}

#[test]
fn regression_005() {
    test(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_stmts(
                    "actual1.js",
                    "var foo = (...args)=>{}
                    var bar = (...args)=>{}",
                )?
                .fold_with(&mut OnceMarker::new(&[("args", &[mark1, mark2])])))
        },
        "var foo = (...args)=>{}
        var bar = (...args)=>{}",
    );
}

#[test]
fn module_01() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "import foo from 'src1';
                    import foo from 'src2';",
                )?
                .fold_with(&mut OnceMarker::new(&[("foo", &[mark1, mark2])])))
        },
        "import foo from 'src1';
        import foo1 from 'src2';",
        Default::default(),
    );
}

#[test]
fn module_02() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "import {foo} from 'src1';
                    import {foo} from 'src2';",
                )?
                .fold_with(&mut OnceMarker::new(&[("foo", &[mark1, mark2])])))
        },
        "import {foo} from 'src1';
        import {foo as foo1} from 'src2';",
        Default::default(),
    );
}

#[test]
fn module_03() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "var foo = 1;
                    var foo = 2;
                    export {foo}",
                )?
                .fold_with(&mut OnceMarker::new(&[("foo", &[mark1, mark2, mark2])])))
        },
        "var foo = 1;
        var foo1 = 2;
        export {foo1 as foo}",
        Default::default(),
    );
}

#[test]
fn issue_281_01() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "label: {
                        break label
                    }",
                )?
                .fold_with(&mut OnceMarker::new(&[("label", &[mark1, mark1])])))
        },
        "label: {
            break label
        }",
        Default::default(),
    );
}

#[test]
fn issue_281_02() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());
            let mark3 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "function foo(e) {
                        e: {
                            try {
                            } catch (e) {
                                o = null;
                                break e
                            }
                        }
                    }",
                )?
                .fold_with(&mut OnceMarker::new(&[(
                    "e",
                    &[mark1, mark2, mark3, mark2],
                )])))
        },
        "function foo(e) {
            e: {
                try {
                } catch (e1) {
                    o = null;
                    break e
                }
            }
        }",
        Default::default(),
    );
}

#[test]
fn issue_295_01() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "export const bar = {};
                    class Foo {

                      constructor() {
                            bar;
                        }
                    }",
                )?
                .fold_with(&mut OnceMarker::new(&[("bar", &[mark1, mark1, mark1])])))
        },
        "export const bar = {};
        class Foo {

            constructor() {
                bar;
            }
        }",
        Default::default(),
    );
}

#[test]
fn issue_295_02() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "export const bar = {};
                    class Foo {

                      constructor() {
                            bar;
                        }
                    }",
                )?
                .fold_with(&mut OnceMarker::new(&[("bar", &[mark1, mark2])])))
        },
        "const bar1 = {};
        export { bar1 as bar };
        class Foo {

            constructor() {
                bar;
            }
        }",
        Default::default(),
    );
}

#[test]
fn exported_function() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "const foo = {};
                    export function foo(){}",
                )?
                .fold_with(&mut OnceMarker::new(&[("foo", &[mark1, mark2])])))
        },
        "const foo = {};
        function foo1(){}
      export { foo1 as foo };",
        Default::default(),
    );
}

#[test]
fn exported_class_1() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "var Foo = {};
                    export class Foo {}",
                )?
                .fold_with(&mut OnceMarker::new(&[("Foo", &[mark1, mark2])])))
        },
        "var Foo = {};
        class Foo1 {}
        export { Foo1 as Foo };",
        Default::default(),
    );
}

#[test]
fn issue_1279() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "class Foo {
                        method() {
                            class Foo {}
                        }
                    }",
                )?
                .fold_with(&mut OnceMarker::new(&[("Foo", &[mark1, mark2])])))
        },
        "
        let Foo = class Foo {
            method() {
                let Foo1 = class Foo {
                };
            }
        };
        ",
        Config {
            keep_class_names: true,
        },
    );
}

#[test]
fn issue_1507() {
    test_module(
        |tester| {
            let mark1 = Mark::fresh(Mark::root());
            let mark2 = Mark::fresh(Mark::root());

            Ok(tester
                .parse_module(
                    "actual1.js",
                    "class Foo {
                        method() {
                            const cls = class Foo {}
                        }
                    }",
                )?
                .fold_with(&mut OnceMarker::new(&[("Foo", &[mark1, mark2])])))
        },
        "
        let Foo = class Foo {
            method() {
                const cls = class Foo {
                };
            }
        };
        ",
        Config {
            keep_class_names: true,
        },
    );
}
