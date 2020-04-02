use crate::util::{undefined, DestructuringFinder, ExprFactory};
use fxhash::FxHashSet;
use indexmap::IndexMap;
use inflector::Inflector;
use serde::{Deserialize, Serialize};
use std::{
    collections::{hash_map::Entry, HashMap, HashSet},
    iter,
};
use swc_atoms::{js_word, JsWord};
use swc_common::{FoldWith, Mark, Span, SyntaxContext, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

pub(super) trait ModulePass {
    fn config(&self) -> &Config;
    fn scope(&self) -> &Scope;
    fn scope_mut(&mut self) -> &mut Scope;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub strict: bool,
    #[serde(default = "default_strict_mode")]
    pub strict_mode: bool,
    #[serde(default)]
    pub lazy: Lazy,
    #[serde(default)]
    pub no_interop: bool,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            strict: false,
            strict_mode: default_strict_mode(),
            lazy: Lazy::default(),
            no_interop: false,
        }
    }
}

const fn default_strict_mode() -> bool {
    true
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged, deny_unknown_fields, rename_all = "camelCase")]
pub enum Lazy {
    Bool(bool),
    List(Vec<JsWord>),
}

impl Lazy {
    pub fn is_lazy(&self, src: &JsWord) -> bool {
        match *self {
            Lazy::Bool(false) => false,
            Lazy::Bool(true) => !src.starts_with('.'),
            Lazy::List(ref srcs) => srcs.contains(&src),
        }
    }
}

impl Default for Lazy {
    fn default() -> Self {
        Lazy::Bool(false)
    }
}

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
    pub import_types: HashMap<JsWord, bool>,

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    pub idents: HashMap<(JsWord, SyntaxContext), (JsWord, JsWord)>,

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
    pub exported_vars: HashMap<(JsWord, SyntaxContext), Vec<(JsWord, SyntaxContext)>>,

    /// This is required to handle
    /// `export * from 'foo';`
    pub lazy_blacklist: HashSet<JsWord>,
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
                .chain(iter::once(
                    define_property(vec![
                        exports.as_arg(),
                        key_ident.clone().as_arg(),
                        make_descriptor(box imported.clone().computed_member(key_ident)).as_arg(),
                    ])
                    .into_stmt(),
                ))
                .collect(),
            }),
            return_type: Default::default(),
            type_params: Default::default(),
        };

        CallExpr {
            span: DUMMY_SP,
            // Object.keys(_foo).forEach
            callee: CallExpr {
                span: DUMMY_SP,
                callee: member_expr!(DUMMY_SP, Object.keys).as_callee(),
                args: vec![imported.as_arg()],
                type_args: Default::default(),
            }
            .member(quote_ident!("forEach"))
            .as_callee(),
            args: vec![FnExpr {
                ident: None,
                function,
            }
            .as_arg()],
            type_args: Default::default(),
        }
        .into_stmt()
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

            if &*import.src.value != "@swc/helpers" {
                self.import_types.insert(import.src.value, true);
            }
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

    pub(super) fn fold_shorthand_prop(
        folder: &mut impl ModulePass,
        top_level: bool,
        prop: Ident,
    ) -> Prop {
        let key = prop.clone();
        let value = Scope::fold_ident(folder, top_level, prop);
        match value {
            Ok(value) => Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(key),
                value: box value,
            }),
            Err(ident) => Prop::Shorthand(ident),
        }
    }

    fn fold_ident(folder: &mut impl ModulePass, top_level: bool, i: Ident) -> Result<Expr, Ident> {
        let v = {
            let v = folder.scope().idents.get(&(i.sym.clone(), i.span.ctxt()));
            v.cloned()
        };
        match v {
            None => Err(i),
            Some((src, prop)) => {
                if top_level {
                    folder.scope_mut().lazy_blacklist.insert(src.clone());
                }

                let lazy = if folder.scope().lazy_blacklist.contains(&src) {
                    false
                } else {
                    folder.config().lazy.is_lazy(&src)
                };

                let (ident, span) = folder
                    .scope()
                    .imports
                    .get(&src)
                    .as_ref()
                    .unwrap()
                    .as_ref()
                    .unwrap();

                let obj = {
                    let ident = Ident::new(ident.clone(), *span);

                    if lazy {
                        Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: ident.as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        })
                    } else {
                        Expr::Ident(ident)
                    }
                };

                if *prop == js_word!("") {
                    // import * as foo from 'foo';
                    Ok(obj)
                } else {
                    Ok(obj.member(Ident::new(prop, DUMMY_SP)))
                }
            }
        }
    }

    pub(super) fn fold_expr(
        folder: &mut impl ModulePass,
        exports: Ident,
        top_level: bool,
        expr: Expr,
    ) -> Expr {
        macro_rules! entry {
            ($i:expr) => {
                folder
                    .scope_mut()
                    .exported_vars
                    .entry(($i.sym.clone(), $i.span.ctxt()))
            };
        }

        macro_rules! chain_assign {
            ($entry:expr, $e:expr) => {{
                let mut e = $e;
                for i in $entry.get() {
                    e = box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Expr(
                            box exports
                                .clone()
                                .member(Ident::new(i.0.clone(), DUMMY_SP.with_ctxt(i.1))),
                        ),
                        op: op!("="),
                        right: e,
                    });
                }
                e
            }};
        }

        match expr {
            Expr::This(ThisExpr { span }) if top_level => *undefined(span),
            Expr::Ident(i) => match Self::fold_ident(folder, top_level, i) {
                Ok(expr) => expr,
                Err(ident) => Expr::Ident(ident),
            },
            Expr::Member(e) => {
                if e.computed {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(folder),
                        prop: e.prop.fold_with(folder),
                        ..e
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(folder),
                        ..e
                    })
                }
            }

            Expr::Update(UpdateExpr {
                span,
                arg: box Expr::Ident(arg),
                op,
                prefix,
            }) => {
                let entry = entry!(arg);

                match entry {
                    Entry::Occupied(entry) => {
                        let e = chain_assign!(
                            entry,
                            box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(arg.clone())),
                                op: op!("="),
                                right: box Expr::Bin(BinExpr {
                                    span: DUMMY_SP,
                                    left: box Expr::Unary(UnaryExpr {
                                        span: DUMMY_SP,
                                        op: op!(unary, "+"),
                                        arg: box Expr::Ident(arg)
                                    }),
                                    op: match op {
                                        op!("++") => op!(bin, "+"),
                                        op!("--") => op!(bin, "-"),
                                    },
                                    right: box Expr::Lit(Lit::Num(Number {
                                        span: DUMMY_SP,
                                        value: 1.0,
                                    })),
                                }),
                            })
                        );

                        *e
                    }
                    _ => Expr::Update(UpdateExpr {
                        span,
                        arg: box Expr::Ident(arg),
                        op,
                        prefix,
                    }),
                }
            }

            Expr::Assign(mut expr) => {
                expr.left = expr.left.fold_with(folder);
                expr.right = expr.right.fold_with(folder);

                let mut found: Vec<(JsWord, Span)> = vec![];
                let mut v = DestructuringFinder { found: &mut found };
                expr.left.visit_with(&mut v);
                if v.found.is_empty() {
                    return Expr::Assign(AssignExpr {
                        left: expr.left,
                        ..expr
                    });
                }

                // imports are read-only
                for i in &found {
                    let i = Ident::new(i.0.clone(), i.1);
                    if folder
                        .scope()
                        .idents
                        .get(&(i.sym.clone(), i.span.ctxt()))
                        .is_some()
                    {
                        let throw = Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: FnExpr {
                                ident: None,
                                function: Function {
                                    span: DUMMY_SP,
                                    is_async: false,
                                    is_generator: false,
                                    decorators: Default::default(),
                                    params: vec![],
                                    body: Some(BlockStmt {
                                        span: DUMMY_SP,
                                        stmts: vec![
                                            // throw new Error('"' + "Foo" + '" is read-only.')
                                            Stmt::Throw(ThrowStmt {
                                                span: DUMMY_SP,
                                                arg: box Expr::New(NewExpr {
                                                    span: DUMMY_SP,
                                                    callee: box Expr::Ident(quote_ident!("Error")),
                                                    args: Some(vec![quote_str!("\"")
                                                        .make_bin(
                                                            op!(bin, "+"),
                                                            quote_str!(i.span, i.sym),
                                                        )
                                                        .make_bin(
                                                            op!(bin, "+"),
                                                            quote_str!("\" is read-only."),
                                                        )
                                                        .as_arg()]),
                                                    type_args: Default::default(),
                                                }),
                                            }),
                                        ],
                                    }),
                                    return_type: Default::default(),
                                    type_params: Default::default(),
                                },
                            }
                            .as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        });
                        return Expr::Assign(AssignExpr {
                            right: box Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![expr.right, box throw],
                            }),
                            ..expr
                        });
                    }
                }

                match expr.left {
                    PatOrExpr::Pat(box Pat::Ident(ref i)) => {
                        let entry = entry!(i);

                        match entry {
                            Entry::Occupied(entry) => {
                                let e = chain_assign!(entry, box Expr::Assign(expr));

                                *e
                            }
                            _ => Expr::Assign(AssignExpr {
                                left: expr.left,
                                ..expr
                            }),
                        }
                    }
                    _ => {
                        let mut exprs = iter::once(box Expr::Assign(expr))
                            .chain(
                                found
                                    .into_iter()
                                    .map(|var| Ident::new(var.0, var.1))
                                    .filter_map(|i| {
                                        let entry = match entry!(i) {
                                            Entry::Occupied(entry) => entry,
                                            _ => {
                                                return None;
                                            }
                                        };
                                        let e = chain_assign!(entry, box Expr::Ident(i));

                                        // exports.name = x
                                        Some(e)
                                    }),
                            )
                            .collect::<Vec<_>>();
                        if exprs.len() == 1 {
                            return *exprs.pop().unwrap();
                        }

                        Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        })
                    }
                }
            }
            _ => expr.fold_children(folder),
        }
    }
}

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
    if !src.contains('/') {
        return format!("_{}", src.to_camel_case()).into();
    }

    format!("_{}", src.split('/').last().unwrap().to_camel_case()).into()
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
    define_property(vec![
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
    ])
    .into_stmt()
}

pub(super) fn has_use_strict(stmts: &[ModuleItem]) -> bool {
    if stmts.is_empty() {
        return false;
    }
    match *stmts.first().unwrap() {
        ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            expr: box Expr::Lit(Lit::Str(Str { ref value, .. })),
            ..
        })) => &*value == "use strict",
        _ => false,
    }
}

pub(super) fn use_strict() -> Stmt {
    Lit::Str(quote_str!("use strict")).into_stmt()
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
            left: PatOrExpr::Expr(box exports.clone().member(Ident::new(name, DUMMY_SP))),
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

/// Private `_exports` ident.
pub(super) struct Exports(pub Ident);

impl Default for Exports {
    fn default() -> Self {
        Exports(private_ident!("_exports"))
    }
}

macro_rules! mark_as_nested {
    ($P:tt) => {
        mark_as_nested!(Function, $P);
        mark_as_nested!(Constructor, $P);
        mark_as_nested!(SetterProp, $P);
        mark_as_nested!(GetterProp, $P);
    };

    ($T:tt, $P:tt) => {
        impl Fold<$T> for $P {
            fn fold(&mut self, f: $T) -> $T {
                let old = self.in_top_level;
                self.in_top_level = false.into();
                let f = f.fold_children(self);
                self.in_top_level = old;

                f
            }
        }
    };
}
