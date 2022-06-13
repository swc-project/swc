use std::{
    cell::{Ref, RefMut},
    collections::hash_map::Entry,
    iter,
};

use indexmap::{IndexMap, IndexSet};
use inflector::Inflector;
use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_cached::regex::CachedRegex;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    Span, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, undefined, DestructuringFinder, ExprFactory,
};
use swc_ecma_visit::{Fold, FoldWith, VisitWith};

use crate::path::Resolver;

pub(super) trait ModulePass: Fold {
    fn config(&self) -> &Config;
    fn scope(&self) -> Ref<Scope>;
    fn scope_mut(&mut self) -> RefMut<Scope>;

    fn resolver(&self) -> &Resolver;
    fn make_dynamic_import(&mut self, span: Span, args: Vec<ExprOrSpread>) -> Expr;

    fn vars(&mut self) -> Ref<Vec<VarDeclarator>>;
    fn vars_mut(&mut self) -> RefMut<Vec<VarDeclarator>>;
    fn vars_take(&mut self) -> Vec<VarDeclarator>;
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
    #[serde(default)]
    pub ignore_dynamic: bool,
    #[serde(default)]
    pub preserve_import_meta: bool,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            strict: false,
            strict_mode: default_strict_mode(),
            lazy: Lazy::default(),
            no_interop: false,
            ignore_dynamic: false,
            preserve_import_meta: false,
        }
    }
}

const fn default_strict_mode() -> bool {
    true
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct LazyObjectConfig {
    pub patterns: Vec<CachedRegex>,
}

impl LazyObjectConfig {
    pub fn is_lazy(&self, src: &JsWord) -> bool {
        self.patterns.iter().any(|pat| pat.is_match(src))
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged, deny_unknown_fields, rename_all = "camelCase")]
pub enum Lazy {
    Bool(bool),
    List(Vec<JsWord>),
    Object(LazyObjectConfig),
}

impl Lazy {
    pub fn is_lazy(&self, src: &JsWord) -> bool {
        match *self {
            Lazy::Bool(false) => false,
            Lazy::Bool(true) => !src.starts_with('.'),
            Lazy::List(ref srcs) => srcs.contains(src),
            Lazy::Object(ref object) => object.is_lazy(src),
        }
    }
}

impl Default for Lazy {
    fn default() -> Self {
        Lazy::Bool(false)
    }
}

#[derive(Clone, Default)]
pub struct Scope {
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
    pub(crate) imports: IndexMap<JsWord, (Span, Option<(JsWord, Span)>), ahash::RandomState>,
    ///
    /// - `true` is wildcard (`_interopRequireWildcard`)
    /// - `false` is default (`_interopRequireDefault`)
    pub(crate) import_types: AHashMap<JsWord, bool>,

    /// This fields tracks if a helper should be injected.
    ///
    /// `(need_wildcard, need_default)`
    pub(crate) unknown_imports: (bool, bool),

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    pub(crate) idents: AHashMap<Id, (JsWord, JsWord)>,

    /// Declared variables except const.
    pub(crate) declared_vars: Vec<Id>,

    /// Maps of exported bindings.
    ///
    ///
    /// e.g.
    ///  - `export { a }`
    ///   -> `{ a: [a] }`
    ///
    ///  - `export { a as b }`
    ///   -> `{ a: [b] }`
    pub(crate) exported_bindings: AHashMap<Id, Vec<Id>>,

    /// This is required to handle
    /// `export * from 'foo';`
    pub(crate) lazy_denylist: AHashSet<JsWord>,
}

impl Scope {
    /// insert exported bindings without duplication
    pub(crate) fn insert_exported_bindings(&mut self, id: Id) {
        let bindings = self.exported_bindings.entry(id.clone()).or_default();

        if !bindings.contains(&id) {
            bindings.push(id);
        }
    }

    ///
    /// ```js
    /// Object.keys(_foo).forEach(function (key) {
    ///   if (key === "default" || key === "__esModule") return;
    ///   if (key in exports && exports[key] === _foo[key]) return;
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
    pub(crate) fn handle_export_all(
        span: Span,
        exports: Ident,
        exported_names: Option<Ident>,
        imported: Ident,
    ) -> Stmt {
        let key_ident = private_ident!("key");

        let function = Function {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            decorators: Default::default(),
            params: vec![Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: key_ident.clone().into(),
            }],
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: iter::once(Stmt::If(IfStmt {
                    span: DUMMY_SP,
                    // key === "default" || key === "__esModule"
                    test: Box::new(
                        key_ident
                            .clone()
                            .make_eq(Lit::Str(quote_str!("default")))
                            .make_bin(
                                op!("||"),
                                key_ident
                                    .clone()
                                    .make_eq(Lit::Str(quote_str!("__esModule"))),
                            ),
                    ),
                    cons: Box::new(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: None,
                    })),
                    alt: None,
                }))
                .chain({
                    // We should skip if the file explicitly exports
                    exported_names.map(|exported_names| {
                        Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: Box::new(
                                CallExpr {
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
                            ),
                            cons: Box::new(Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: None,
                            })),
                            alt: None,
                        })
                    })
                })
                .chain({
                    Some(Stmt::If(IfStmt {
                        span: DUMMY_SP,
                        test: Box::new(
                            key_ident
                                .clone()
                                .make_bin(op!("in"), exports.clone())
                                .make_bin(
                                    op!("&&"),
                                    exports.clone().computed_member(key_ident.clone()).make_eq(
                                        imported.clone().computed_member(key_ident.clone()),
                                    ),
                                ),
                        ),
                        cons: Box::new(Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: None,
                        })),
                        alt: None,
                    }))
                })
                .chain(iter::once(
                    define_property(vec![
                        exports.as_arg(),
                        key_ident.clone().as_arg(),
                        make_descriptor(Box::new(imported.clone().computed_member(key_ident)))
                            .as_arg(),
                    ])
                    .into_stmt(),
                ))
                .collect(),
            }),
            return_type: Default::default(),
            type_params: Default::default(),
        };

        Stmt::Expr(ExprStmt {
            span,
            expr: Box::new(Expr::Call(CallExpr {
                span,
                // Object.keys(_foo).forEach
                callee: CallExpr {
                    span: DUMMY_SP,
                    callee: member_expr!(DUMMY_SP, Object.keys).as_callee(),
                    args: vec![imported.as_arg()],
                    type_args: Default::default(),
                }
                .make_member(quote_ident!("forEach"))
                .as_callee(),
                args: vec![FnExpr {
                    ident: None,
                    function,
                }
                .as_arg()],
                type_args: Default::default(),
            })),
        })
    }

    /// Import src to export from it.
    pub fn import_to_export(&mut self, src: &Str, init: bool) -> Option<Ident> {
        let entry = self
            .imports
            .entry(src.value.clone())
            .and_modify(|(span, v)| {
                if init && v.is_none() {
                    *span = src.span;
                    *v = {
                        let ident = private_ident!(local_name_for_src(&src.value));
                        Some((ident.sym, ident.span))
                    }
                }
            })
            .or_insert_with(|| {
                let v = if init {
                    let ident = private_ident!(local_name_for_src(&src.value));
                    Some((ident.sym, ident.span))
                } else {
                    None
                };

                (src.span, v)
            });
        if init {
            let entry = entry.1.as_ref().unwrap();
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
            self.imports
                .entry(import.src.value.clone())
                .or_insert((import.src.span, None));
        } else if import.specifiers.len() == 1
            && matches!(import.specifiers[0], ImportSpecifier::Namespace(..))
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
                .and_modify(|(span, v)| {
                    *span = import.src.span;
                    match *v {
                        Some(ref mut v) => v.0 = specifier.local.sym.clone(),
                        None => *v = Some((specifier.local.sym.clone(), specifier.local.span)),
                    }
                })
                .or_insert_with(|| {
                    (
                        import.src.span,
                        Some((specifier.local.sym.clone(), specifier.local.span)),
                    )
                });

            self.import_types.insert(import.src.value, true);
        } else {
            let mut has_non_default = false;
            for s in import.specifiers {
                match s {
                    ImportSpecifier::Namespace(ref ns) => {
                        self.idents.insert(
                            (ns.local.sym.clone(), ns.local.span.ctxt()),
                            (import.src.value.clone(), "".into()),
                        );

                        // Override symbol if one exists
                        self.imports
                            .entry(import.src.value.clone())
                            .and_modify(|(span, v)| {
                                *span = import.src.span;
                                match *v {
                                    Some(ref mut v) => v.0 = ns.local.sym.clone(),
                                    None => *v = Some((ns.local.sym.clone(), ns.local.span)),
                                }
                            })
                            .or_insert_with(|| {
                                (import.src.span, Some((ns.local.sym.clone(), ns.local.span)))
                            });

                        self.import_types.insert(import.src.value.clone(), true);
                    }
                    ImportSpecifier::Default(i) => {
                        // Helpers are special.
                        if import.src.value.starts_with("@swc/helpers/src/") {
                            let ident = i.local.clone();

                            self.imports
                                .entry(import.src.value.clone())
                                .and_modify(|(span, opt)| {
                                    if opt.is_none() {
                                        *span = import.src.span;

                                        *opt = Some((ident.sym.clone(), ident.span));
                                    }
                                })
                                .or_insert_with(|| {
                                    (import.src.span, Some((ident.sym, ident.span)))
                                });
                        } else {
                            self.idents.insert(
                                i.local.to_id(),
                                (import.src.value.clone(), js_word!("default")),
                            );
                            self.import_types
                                .entry(import.src.value.clone())
                                .or_insert(false);
                        }
                    }
                    ImportSpecifier::Named(i) => {
                        let ImportNamedSpecifier {
                            local, imported, ..
                        } = i;
                        let imported_ident = match imported {
                            Some(ModuleExportName::Ident(ident)) => Some(ident),
                            _ => None,
                        };
                        let name = imported_ident
                            .map(|i| i.sym)
                            .unwrap_or_else(|| local.sym.clone());
                        let is_default = name == js_word!("default");

                        self.idents
                            .insert(local.to_id(), (import.src.value.clone(), name));

                        if is_default {
                            self.import_types
                                .entry(import.src.value.clone())
                                .or_insert(has_non_default);
                        } else {
                            has_non_default = true;
                            self.import_types
                                .entry(import.src.value.clone())
                                .and_modify(|v| *v = true);
                        }
                    }
                }
            }

            self.imports
                .entry(import.src.value.clone())
                .and_modify(|(span, opt)| {
                    if opt.is_none() {
                        *span = import.src.span;

                        let ident =
                            private_ident!(import.src.span, local_name_for_src(&import.src.value));
                        *opt = Some((ident.sym, ident.span));
                    }
                })
                .or_insert_with(|| {
                    let ident =
                        private_ident!(import.src.span, local_name_for_src(&import.src.value));
                    (import.src.span, Some((ident.sym, ident.span)))
                });
        }
    }

    pub(super) fn fold_shorthand_prop(folder: &mut impl ModulePass, prop: Ident) -> Prop {
        let key = prop.clone();
        let value = Scope::fold_ident(folder, prop);
        match value {
            Ok(value) => Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(key),
                value: Box::new(value),
            }),
            Err(ident) => Prop::Shorthand(ident),
        }
    }

    fn fold_ident(folder: &mut impl ModulePass, i: Ident) -> Result<Expr, Ident> {
        let orig_span = i.span;
        let v = folder.scope().idents.get(&i.to_id()).cloned();
        match v {
            None => Err(i),
            Some((src, prop)) => {
                let lazy = if folder.scope().lazy_denylist.contains(&src) {
                    false
                } else {
                    folder.config().lazy.is_lazy(&src)
                };

                let scope = folder.scope();
                let (ident, span) = scope
                    .imports
                    .get(&src)
                    .as_ref()
                    .unwrap()
                    .1
                    .as_ref()
                    .unwrap();

                let obj = {
                    let ident = Ident::new(ident.clone(), orig_span.with_ctxt(span.ctxt));

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
                    Ok(Expr::Member(MemberExpr {
                        obj: Box::new(obj),
                        span: orig_span,
                        prop: Ident::new(prop, DUMMY_SP).into(),
                    }))
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
        macro_rules! chain_assign {
            ($entry:expr, $e:expr) => {{
                let mut e = $e;
                for i in $entry.get() {
                    e = Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Expr(Box::new(
                            exports
                                .clone()
                                .make_member(Ident::new(i.0.clone(), DUMMY_SP.with_ctxt(i.1))),
                        )),
                        op: op!("="),
                        right: e,
                    }));
                }
                e
            }};
        }

        match expr {
            // In a JavaScript module, this is undefined at the top level (i.e., outside functions).
            Expr::This(ThisExpr { span }) if top_level => *undefined(span),
            Expr::Ident(i) => match Self::fold_ident(folder, i) {
                Ok(expr) => expr,
                Err(ident) => Expr::Ident(ident),
            },

            // Handle dynamic imports.
            // See https://github.com/swc-project/swc/issues/1018
            Expr::Call(CallExpr {
                span,
                callee: Callee::Import(_),
                mut args,
                ..
            }) if !folder.config().ignore_dynamic
                // TODO: import assertion
                && args.len() == 1 =>
            {
                let mut expr = args.pop().unwrap().expr.fold_with(folder);
                let expr = match &mut *expr {
                    Expr::Lit(Lit::Str(s)) => {
                        let src = folder.resolver().resolve(s.value.clone());

                        Box::new(Expr::Lit(Lit::Str(Str {
                            raw: None,
                            value: src,
                            ..s.clone()
                        })))
                    }
                    Expr::Ident(ident) => Box::new(match Self::fold_ident(folder, ident.take()) {
                        Ok(expr) => expr,
                        Err(ident) => Expr::Ident(ident),
                    }),
                    _ => expr,
                };

                folder.make_dynamic_import(span, vec![expr.as_arg()])
            }

            Expr::Call(CallExpr {
                span,
                callee,
                args,
                type_args,
            }) => {
                let callee = if let Callee::Expr(expr) = callee {
                    let callee = if let Expr::Ident(ident) = *expr {
                        match Self::fold_ident(folder, ident) {
                            Ok(mut expr) => {
                                if let Expr::Member(member) = &mut expr {
                                    if let Expr::Ident(ident) = member.obj.as_mut() {
                                        member.obj = Box::new(Expr::Paren(ParenExpr {
                                            expr: Box::new(Expr::Seq(SeqExpr {
                                                span,
                                                exprs: vec![
                                                    Box::new(0_f64.into()),
                                                    Box::new(ident.take().into()),
                                                ],
                                            })),
                                            span,
                                        }))
                                    }
                                };
                                expr
                            }
                            Err(ident) => Expr::Ident(ident),
                        }
                    } else {
                        *expr.fold_with(folder)
                    };
                    callee.as_callee()
                } else {
                    callee.fold_with(folder)
                };
                Expr::Call(CallExpr {
                    span,
                    callee,
                    args: args.fold_with(folder),
                    type_args,
                })
            }

            Expr::Member(e) => Expr::Member(MemberExpr {
                obj: e.obj.fold_with(folder),
                prop: if let MemberProp::Computed(c) = e.prop {
                    MemberProp::Computed(c.fold_with(folder))
                } else {
                    e.prop
                },
                ..e
            }),

            Expr::SuperProp(e) => Expr::SuperProp(SuperPropExpr {
                prop: if let SuperProp::Computed(c) = e.prop {
                    SuperProp::Computed(c.fold_with(folder))
                } else {
                    e.prop
                },
                ..e
            }),

            Expr::Update(update) if update.arg.is_ident() => {
                let arg = update.arg.clone().expect_ident();

                let mut var = Default::default();

                let expr = {
                    let mut scope = folder.scope_mut();
                    let entry = scope
                        .exported_bindings
                        .entry((arg.sym.clone(), arg.span.ctxt()));

                    match entry {
                        Entry::Occupied(entry) => {
                            if update.prefix {
                                // ++i
                                // => exports.i = ++i
                                *chain_assign!(entry, Box::new(update.into()))
                            } else {
                                // i++
                                // (ref = i++, exports.i = i, ref)

                                // TODO: optimize to `exports.i = ++i` if return value is not used.

                                let ref_ident = private_ident!("ref");
                                var = Some(ref_ident.clone());

                                Expr::Seq(SeqExpr {
                                    span: update.span,
                                    exprs: vec![
                                        Box::new(
                                            AssignExpr {
                                                span: DUMMY_SP,
                                                op: op!("="),
                                                left: PatOrExpr::Pat(ref_ident.clone().into()),
                                                right: Box::new(update.into()),
                                            }
                                            .into(),
                                        ),
                                        chain_assign!(entry, Box::new(arg.into())),
                                        Box::new(ref_ident.into()),
                                    ],
                                })
                            }
                        }
                        _ => update.into(),
                    }
                };

                if let Some(ref_ident) = var {
                    folder.vars_mut().push(VarDeclarator {
                        span: DUMMY_SP,
                        name: ref_ident.into(),
                        init: None,
                        definite: false,
                    });
                };

                expr
            }

            Expr::Assign(mut expr) => {
                expr.left = expr.left.fold_with(folder);
                expr.right = expr.right.fold_with(folder);

                let mut found: Vec<(JsWord, Span)> = vec![];
                let mut v = DestructuringFinder { found: &mut found };

                if let PatOrExpr::Expr(e) = &expr.left {
                    e.visit_children_with(&mut v);
                } else {
                    expr.left.visit_with(&mut v);
                }

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
                                                arg: Box::new(Expr::New(NewExpr {
                                                    span: DUMMY_SP,
                                                    callee: Box::new(Expr::Ident(quote_ident!(
                                                        "Error"
                                                    ))),
                                                    args: Some(vec![quote_str!("'")
                                                        .make_bin(
                                                            op!(bin, "+"),
                                                            quote_str!(i.span, i.sym),
                                                        )
                                                        .make_bin(
                                                            op!(bin, "+"),
                                                            quote_str!("' is read-only."),
                                                        )
                                                        .as_arg()]),
                                                    type_args: Default::default(),
                                                })),
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

                        let left = if let PatOrExpr::Pat(ref left_pat) = expr.left {
                            if let Pat::Ident(BindingIdent { ref id, .. }) = **left_pat {
                                let expr = match Self::fold_ident(folder, id.clone()) {
                                    Ok(expr) => expr,
                                    Err(ident) => Expr::Ident(ident),
                                };
                                PatOrExpr::Expr(Box::new(expr))
                            } else {
                                expr.left
                            }
                        } else {
                            expr.left
                        };

                        return Expr::Assign(AssignExpr {
                            right: Box::new(Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![expr.right, Box::new(throw)],
                            })),
                            left,
                            ..expr
                        });
                    }
                }

                if let Some(ident) = expr.left.as_ident() {
                    let mut scope = folder.scope_mut();
                    let entry = scope
                        .exported_bindings
                        .entry((ident.sym.clone(), ident.span.ctxt()));

                    match entry {
                        Entry::Occupied(entry) => {
                            let expr = Expr::Assign(expr);

                            *chain_assign!(entry, Box::new(expr))
                        }
                        _ => expr.into(),
                    }
                } else {
                    let mut exprs = iter::once(Box::new(Expr::Assign(expr)))
                        .chain(
                            found
                                .into_iter()
                                .map(|var| Ident::new(var.0, var.1))
                                .filter_map(|i| {
                                    let mut scope = folder.scope_mut();
                                    let entry = match scope
                                        .exported_bindings
                                        .entry((i.sym.clone(), i.span.ctxt()))
                                    {
                                        Entry::Occupied(entry) => entry,
                                        _ => {
                                            return None;
                                        }
                                    };
                                    let e = chain_assign!(entry, Box::new(Expr::Ident(i)));

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
            _ => expr.fold_children_with(folder),
        }
    }
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
            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("value")),
                value: true.into(),
            })))],
        }
        .as_arg(),
    ])
    .into_stmt()
}

pub(super) fn has_use_strict(stmts: &[ModuleItem]) -> bool {
    if stmts.is_empty() {
        return false;
    }

    if let ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) = &*stmts.first().unwrap() {
        if let Expr::Lit(Lit::Str(Str { ref value, .. })) = &**expr {
            return &*value == "use strict";
        }
    }

    false
}

pub(super) fn use_strict() -> Stmt {
    Lit::Str(quote_str!("use strict")).into_stmt()
}

/// Creates
///
/// ```js
/// exports.default = exports.foo = void 0;
/// ```
pub(super) fn initialize_to_undefined<T>(
    exports: Ident,
    initialized: IndexSet<JsWord, ahash::RandomState>,
) -> Vec<T>
where
    T: From<Stmt>,
{
    const CHUNK_SIZE: usize = 64;
    let len = initialized.len();

    let mut result = Vec::with_capacity(len / CHUNK_SIZE + 1);

    let initialized: Vec<JsWord> = initialized.into_iter().collect();

    for chunks in initialized.chunks(CHUNK_SIZE) {
        let mut rhs = undefined(DUMMY_SP);

        for name in chunks {
            rhs = Box::new(
                AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(Box::new(
                        exports
                            .clone()
                            .make_member(Ident::new(name.clone(), DUMMY_SP)),
                    )),
                    op: op!("="),
                    right: rhs,
                }
                .into(),
            );
        }

        result.push(T::from(rhs.into_stmt()));
    }

    result
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
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("enumerable")),
                value: true.into(),
            }))),
            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(quote_ident!("get")),
                value: Box::new(
                    FnExpr {
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
                ),
            }))),
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
    () => {
        mark_as_nested!(fold_function, Function);
        mark_as_nested!(fold_constructor, Constructor);
        mark_as_nested!(fold_setter_prop, SetterProp);
        mark_as_nested!(fold_getter_prop, GetterProp);
        mark_as_nested!(fold_static_block, StaticBlock);

        fn fold_class_prop(&mut self, mut n: ClassProp) -> ClassProp {
            use swc_common::util::take::Take;
            if n.key.is_computed() {
                let key = n.key.take().fold_children_with(self);

                let old = self.in_top_level;
                self.in_top_level = false;
                let mut n = n.fold_children_with(self);
                self.in_top_level = old;

                n.key = key;
                n
            } else {
                let old = self.in_top_level;
                self.in_top_level = false;
                let n = n.fold_children_with(self);
                self.in_top_level = old;
                n
            }
        }
    };

    ($name:ident, $T:tt) => {
        fn $name(&mut self, f: $T) -> $T {
            let old = self.in_top_level;
            self.in_top_level = false.into();
            let f = f.fold_children_with(self);
            self.in_top_level = old;

            f
        }
    };
}
