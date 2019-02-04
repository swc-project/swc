use crate::util::{undefined, ExprFactory};
use ast::*;
use fxhash::{FxBuildHasher, FxHashMap, FxHashSet};
use inflector::Inflector;
use std::iter;
use swc_atoms::JsWord;
use swc_common::{Mark, Span, SyntaxContext, DUMMY_SP};

#[derive(Clone, Default)]
pub(super) struct Scope {
    /// Map from source file to ident
    ///
    /// e.g.
    ///
    ///  - `import 'foo'`
    ///   -> `{'foo': None}`
    ///
    ///  - `import { foo } from 'bar';`
    ///   -> `{'bar': Some(_bar)}`
    ///
    ///  - `import * as bar1 from 'bar';`
    ///   -> `{'bar': Some(bar1)}`
    pub imports: IndexMap<JsWord, Option<(JsWord, Span)>>,
    ///
    /// - `true` is wildcard (`_interopRequireWildcard`)
    /// - `false` is default (`_interopRequireDefault`)
    pub import_types: FxHashMap<JsWord, bool>,

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    pub idents: FxHashMap<(JsWord, SyntaxContext), (JsWord, JsWord)>,

    /// Declared variables except const.
    pub declared_vars: Vec<(JsWord, SyntaxContext)>,

    /// Maps of exported variables.
    ///
    ///
    /// e.g.
    ///  - `export { a }`
    ///   -> `{ a: [a] }`
    ///
    ///  - `export { a as b }`
    ///   -> `{ a: [b] }`
    pub exported_vars: FxHashMap<(JsWord, SyntaxContext), Vec<(JsWord, SyntaxContext)>>,

    /// This is required to handle
    /// `export * from 'foo';`
    pub lazy_blacklist: FxHashSet<JsWord>,
}

impl Scope {
    ///
    /// ```js
    /// Object.keys(_foo).forEach(function (key) {
    ///   if (key === "default" || key === "__esModule") return;
    ///   Object.defineProperty(exports, key, {
    ///     enumerable: true,
    ///     get: function () {
    ///       return _foo[key];
    ///     }
    ///   });
    /// })
    /// ```
    ///
    /// # Parameters
    /// - `exported_names` Ident of the object literal.
    pub fn handle_export_all(
        &mut self,
        exports: Ident,
        exported_names: Option<Ident>,
        export: ExportAll,
    ) -> Stmt {
        let imported = self.import_to_export(&export.src, true).unwrap();

        let key_ident = private_ident!("key");

        let function = Function {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            decorators: Default::default(),
            params: vec![Pat::Ident(key_ident.clone())],
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: iter::once(Stmt::If(IfStmt {
                    span: DUMMY_SP,
                    // key === "default" || key === "__esModule"
                    test: box key_ident
                        .clone()
                        .make_eq(Lit::Str(quote_str!("default")))
                        .make_bin(
                            op!("||"),
                            key_ident
                                .clone()
                                .make_eq(Lit::Str(quote_str!("__esModule"))),
                        ),
                    cons: box Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: None,
                    }),
                    alt: None,
                }))
                .chain({
                    // We should skip if the file explicitly exports
                    if let Some(exported_names) = exported_names {
                        // `if (Object.prototype.hasOwnProperty.call(_exportNames, key))
                        //      return;`
                        Some(Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: box CallExpr {
                                span: DUMMY_SP,
                                callee: member_expr!(
                                    DUMMY_SP,
                                    Object.prototype.hasOwnProperty.call
                                )
                                .as_callee(),
                                args: vec![exported_names.as_arg(), key_ident.clone().as_arg()],
                                type_args: Default::default(),
                            }
                            .into(),
                            cons: box Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: None,
                            }),
                            alt: None,
                        }))
                    } else {
                        None
                    }
                })
                .chain(iter::once(Stmt::Expr(box define_property(vec![
                    exports.as_arg(),
                    key_ident.clone().as_arg(),
                    make_descriptor(box Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: imported.clone().as_obj(),
                        prop: box key_ident.into(),
                        computed: true,
                    }))
                    .as_arg(),
                ]))))
                .collect(),
            }),
            return_type: Default::default(),
            type_params: Default::default(),
        };

        Stmt::Expr(box Expr::Call(CallExpr {
            span: DUMMY_SP,
            // Object.keys(_foo).forEach
            callee: MemberExpr {
                span: DUMMY_SP,
                obj: CallExpr {
                    span: DUMMY_SP,
                    callee: member_expr!(DUMMY_SP, Object.keys).as_callee(),
                    args: vec![imported.as_arg()],
                    type_args: Default::default(),
                }
                .as_obj(),
                computed: false,
                prop: box Expr::Ident(quote_ident!("forEach")),
            }
            .as_callee(),
            args: vec![FnExpr {
                ident: None,
                function,
            }
            .as_arg()],
            type_args: Default::default(),
        }))
    }

    /// Import src to export fomr it.
    pub fn import_to_export(&mut self, src: &Str, init: bool) -> Option<Ident> {
        let entry = self
            .imports
            .entry(src.value.clone())
            .and_modify(|v| {
                if init && v.is_none() {
                    *v = {
                        let ident = private_ident!(local_name_for_src(&src.value));
                        Some((ident.sym, ident.span))
                    }
                }
            })
            .or_insert_with(|| {
                if init {
                    let ident = private_ident!(local_name_for_src(&src.value));
                    Some((ident.sym, ident.span))
                } else {
                    None
                }
            });
        if init {
            let entry = entry.as_ref().unwrap();
            let ident = Ident::new(entry.0.clone(), entry.1);

            Some(ident)
        } else {
            None
        }
    }

    pub fn insert_import(&mut self, mut import: ImportDecl) {
        if import.specifiers.is_empty() {
            // import 'foo';
            //   -> require('foo');
            self.imports.entry(import.src.value.clone()).or_insert(None);
        } else if import.specifiers.len() == 1
            && match import.specifiers[0] {
                ImportSpecifier::Namespace(..) => true,
                _ => false,
            }
        {
            // import * as foo from 'src';
            let specifier = match import.specifiers.pop().unwrap() {
                ImportSpecifier::Namespace(ns) => ns,
                _ => unreachable!(),
            };

            self.idents.insert(
                (specifier.local.sym.clone(), specifier.local.span.ctxt()),
                (import.src.value.clone(), "".into()),
            );

            // Override symbol if one exists
            self.imports
                .entry(import.src.value.clone())
                .and_modify(|v| match *v {
                    Some(ref mut v) => v.0 = specifier.local.sym.clone(),
                    None => *v = Some((specifier.local.sym.clone(), specifier.local.span)),
                })
                .or_insert_with(|| Some((specifier.local.sym.clone(), specifier.local.span)));

            self.import_types.insert(import.src.value, true);
        } else {
            self.imports
                .entry(import.src.value.clone())
                .or_insert_with(|| {
                    Some((
                        local_name_for_src(&import.src.value),
                        import.src.span.apply_mark(Mark::fresh(Mark::root())),
                    ))
                });

            for s in import.specifiers {
                match s {
                    ImportSpecifier::Namespace(..) => unreachable!(
                        "import * as foo cannot be used with other type of import specifiers"
                    ),
                    ImportSpecifier::Default(i) => {
                        self.idents.insert(
                            (i.local.sym.clone(), i.local.span.ctxt()),
                            (import.src.value.clone(), js_word!("default")),
                        );
                        self.import_types
                            .entry(import.src.value.clone())
                            .or_insert(false);
                    }
                    ImportSpecifier::Specific(i) => {
                        let ImportSpecific {
                            local, imported, ..
                        } = i;
                        let name = imported.map(|i| i.sym).unwrap_or_else(|| local.sym.clone());
                        let is_default = name == js_word!("default");

                        self.idents.insert(
                            (local.sym.clone(), local.span.ctxt()),
                            (import.src.value.clone(), name),
                        );

                        if is_default {
                            self.import_types
                                .entry(import.src.value.clone())
                                .or_insert(false);
                        } else {
                            self.import_types
                                .entry(import.src.value.clone())
                                .and_modify(|v| *v = true);
                        }
                    }
                }
            }
        }
    }
}

pub(super) type IndexMap<K, V> = indexmap::IndexMap<K, V, FxBuildHasher>;

pub(super) fn make_require_call(src: JsWord) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: quote_ident!("require").as_callee(),
        args: vec![Lit::Str(Str {
            span: DUMMY_SP,
            value: src,
            has_escape: false,
        })
        .as_arg()],

        type_args: Default::default(),
    })
}

pub(super) fn local_name_for_src(src: &JsWord) -> JsWord {
    if !src.contains("/") {
        return format!("_{}", src.to_camel_case()).into();
    }

    return format!("_{}", src.split("/").last().unwrap().to_camel_case()).into();
}

pub(super) fn define_property(args: Vec<ExprOrSpread>) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, Object.defineProperty).as_callee(),
        args,

        type_args: Default::default(),
    })
}

/// Creates
///
///```js
/// 
///  Object.defineProperty(exports, '__esModule', {
///       value: true
///  });
/// ```
pub(super) fn define_es_module(exports: Ident) -> Stmt {
    Stmt::Expr(box define_property(vec![
        exports.as_arg(),
        Lit::Str(quote_str!("__esModule")).as_arg(),
        ObjectLit {
            span: DUMMY_SP,
            props: vec![PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("value")),
                value: box Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .into(),
            }))],
        }
        .as_arg(),
    ]))
}

pub(super) fn use_strict() -> Stmt {
    Stmt::Expr(box Expr::Lit(Lit::Str(quote_str!("use strict"))))
}

/// Creates
///
/// ```js
/// exports.default = exports.foo = void 0;
/// ```
pub(super) fn initialize_to_undefined(exports: Ident, initialized: FxHashSet<JsWord>) -> Box<Expr> {
    let mut rhs = undefined(DUMMY_SP);

    for name in initialized.into_iter() {
        rhs = box Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: exports.clone().as_callee(),
                computed: false,
                prop: box Expr::Ident(Ident::new(name, DUMMY_SP)),
            })),
            op: op!("="),
            right: rhs,
        });
    }

    rhs
}

pub(super) fn make_descriptor(get_expr: Box<Expr>) -> ObjectLit {
    let get_fn_body = Some(BlockStmt {
        span: DUMMY_SP,
        stmts: vec![Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(get_expr),
        })],
    });

    ObjectLit {
        span: DUMMY_SP,
        props: vec![
            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("enumerable")),
                value: box Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .into(),
            })),
            PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("get")),
                value: box FnExpr {
                    ident: None,
                    function: Function {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        decorators: Default::default(),
                        params: vec![],
                        body: get_fn_body,
                        return_type: Default::default(),
                        type_params: Default::default(),
                    },
                }
                .into(),
            })),
        ],
    }
}
