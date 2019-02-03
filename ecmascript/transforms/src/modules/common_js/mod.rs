use super::util::{define_property, local_name_for_src, make_require_call};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{undefined, DestructuringFinder, ExprFactory, State},
};
use ast::*;
use fxhash::{FxHashMap, FxHashSet};
use serde::{Deserialize, Serialize};
use std::{collections::hash_map::Entry, iter, sync::Arc};
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Span, SyntaxContext, Visit, VisitWith, DUMMY_SP};

type IndexMap<K, V> = indexmap::IndexMap<K, V, fxhash::FxBuildHasher>;

#[cfg(test)]
mod tests;

#[derive(Default, Clone, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub strict: bool,
    #[serde(default)]
    pub lazy: Lazy,
    #[serde(default)]
    pub no_interop: bool,
}

#[derive(Clone, Serialize, Deserialize)]
#[serde(untagged, deny_unknown_fields, rename_all = "camelCase")]
pub enum Lazy {
    Bool(bool),
    List(Vec<JsWord>),
}

impl Lazy {
    fn is_lazy(&self, src: &JsWord) -> bool {
        match *self {
            Lazy::Bool(b) => b,
            Lazy::List(ref srcs) => srcs.contains(&src),
        }
    }
}

impl Default for Lazy {
    fn default() -> Self {
        Lazy::Bool(false)
    }
}

pub fn common_js(helpers: Arc<Helpers>, config: Config) -> impl Pass + Clone {
    CommonJs {
        helpers,
        config,
        scope: Default::default(),
        in_top_level: Default::default(),
    }
}

#[derive(Clone)]
struct CommonJs {
    helpers: Arc<Helpers>,
    config: Config,
    scope: State<Scope>,
    in_top_level: State<bool>,
}

#[derive(Clone, Default)]
struct Scope {
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
    imports: IndexMap<JsWord, Option<(JsWord, Span)>>,
    ///
    /// - `true` is wildcard (`_interopRequireWildcard`)
    /// - `false` is default (`_interopRequireDefault`)
    import_types: FxHashMap<JsWord, bool>,

    /// Map from imported ident to (source file, property name).
    ///
    /// e.g.
    ///  - `import { foo } from 'bar';`
    ///   -> `{foo: ('bar', foo)}`
    ///
    ///  - `import foo from 'bar';`
    ///   -> `{foo: ('bar', default)}`
    idents: FxHashMap<(JsWord, SyntaxContext), (JsWord, JsWord)>,

    /// Declared variables except const.
    declared_vars: Vec<(JsWord, SyntaxContext)>,

    /// Maps of exported variables.
    ///
    ///
    /// e.g.
    ///  - `export { a }`
    ///   -> `{ a: [a] }`
    ///
    ///  - `export { a as b }`
    ///   -> `{ a: [b] }`
    exported_vars: FxHashMap<(JsWord, SyntaxContext), Vec<(JsWord, SyntaxContext)>>,

    /// This is required to handle
    /// `export * from 'foo';`
    lazy_blacklist: FxHashSet<JsWord>,
}

impl Fold<Vec<ModuleItem>> for CommonJs {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        /// Import src to export fomr it.
        macro_rules! import {
            ($src:expr, $init:expr) => {{
                let entry = self
                    .scope
                    .value
                    .imports
                    .entry($src.value.clone())
                    .and_modify(|v| {
                        if $init && v.is_none() {
                            *v = {
                                let ident = private_ident!(local_name_for_src(&$src));
                                Some((ident.sym, ident.span))
                            }
                        }
                    })
                    .or_insert_with(|| {
                        if $init {
                            let ident = private_ident!(local_name_for_src(&$src));
                            Some((ident.sym, ident.span))
                        } else {
                            None
                        }
                    });
                if $init {
                    let entry = entry.as_ref().unwrap();
                    let ident = Ident::new(entry.0.clone(), entry.1);

                    Some(ident)
                } else {
                    None
                }
            }};
        }

        let mut emitted_esmodule = false;
        let mut stmts = Vec::with_capacity(items.len() + 4);
        let mut extra_stmts = Vec::with_capacity(items.len());

        stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Lit(Lit::Str(
            quote_str!("use strict"),
        )))));

        let mut exports = vec![];
        let mut initialized = FxHashSet::default();
        let mut export_alls = vec![];

        for item in items {
            self.in_top_level = true.into();

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(mut import)) => {
                    if import.specifiers.is_empty() {
                        // import 'foo';
                        //   -> require('foo');
                        self.scope
                            .imports
                            .entry(import.src.value.clone())
                            .or_insert(None);
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

                        self.scope.value.idents.insert(
                            (specifier.local.sym.clone(), specifier.local.span.ctxt()),
                            (import.src.value.clone(), "".into()),
                        );

                        // Override symbol if one exists
                        self.scope
                            .value
                            .imports
                            .entry(import.src.value.clone())
                            .and_modify(|v| match *v {
                                Some(ref mut v) => v.0 = specifier.local.sym.clone(),
                                None => {
                                    *v = Some((specifier.local.sym.clone(), specifier.local.span))
                                }
                            })
                            .or_insert_with(|| {
                                Some((specifier.local.sym.clone(), specifier.local.span))
                            });

                        self.scope.import_types.insert(import.src.value, true);
                    } else {
                        self.scope
                            .value
                            .imports
                            .entry(import.src.value.clone())
                            .or_insert_with(|| {
                                Some((local_name_for_src(&import.src), import.src.span))
                            });

                        for s in import.specifiers {
                            match s {
                                ImportSpecifier::Namespace(..) => unreachable!(
                                    "import * as foo cannot be used with other type of import \
                                     specifiers"
                                ),
                                ImportSpecifier::Default(i) => {
                                    self.scope.idents.insert(
                                        (i.local.sym.clone(), i.local.span.ctxt()),
                                        (import.src.value.clone(), js_word!("default")),
                                    );
                                    self.scope
                                        .import_types
                                        .entry(import.src.value.clone())
                                        .or_insert(false);
                                }
                                ImportSpecifier::Specific(i) => {
                                    let ImportSpecific {
                                        local, imported, ..
                                    } = i;
                                    let name = imported
                                        .map(|i| i.sym)
                                        .unwrap_or_else(|| local.sym.clone());
                                    let is_default = name == js_word!("default");

                                    self.scope.idents.insert(
                                        (local.sym.clone(), local.span.ctxt()),
                                        (import.src.value.clone(), name),
                                    );

                                    if is_default {
                                        self.scope
                                            .import_types
                                            .entry(import.src.value.clone())
                                            .or_insert(false);
                                    } else {
                                        self.scope
                                            .import_types
                                            .entry(import.src.value.clone())
                                            .and_modify(|v| *v = true);
                                    }
                                }
                            }
                        }
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(..)) => {
                    if !self.config.strict && !emitted_esmodule {
                        emitted_esmodule = true;
                        //  Object.defineProperty(exports, '__esModule', {
                        //       value: true
                        //  });
                        stmts.push(ModuleItem::Stmt(Stmt::Expr(box define_property(vec![
                            quote_ident!("exports").as_arg(),
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
                        ]))));
                    }

                    macro_rules! init_export {
                        ("default") => {{
                            init_export!(js_word!("default"))
                        }};
                        ($name:expr) => {{
                            exports.push($name.clone());
                            initialized.insert($name.clone());
                        }};
                    }
                    match item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl::Fn(..),
                        )) => {
                            // initialized.insert(js_word!("default"));
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl::TsInterfaceDecl(..),
                        )) => {}

                        ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export)) => {
                            self.scope
                                .value
                                .import_types
                                .entry(export.src.value.clone())
                                .and_modify(|v| *v = true);
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..)) => {
                            init_export!("default")
                        }
                        _ => {}
                    }

                    match item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export)) => {
                            self.scope
                                .value
                                .lazy_blacklist
                                .insert(export.src.value.clone());

                            export_alls.push(export);
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl @ Decl::Class(..)))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl @ Decl::Fn(..))) => {
                            let (ident, is_class) = match decl {
                                Decl::Class(ref c) => (c.ident.clone(), true),
                                Decl::Fn(ref f) => (f.ident.clone(), false),
                                _ => unreachable!(),
                            };

                            //
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(decl.fold_with(self))));

                            let append_to: &mut Vec<_> = if is_class {
                                &mut extra_stmts
                            } else {
                                // Function declaration cannot throw
                                &mut stmts
                            };

                            append_to.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: quote_ident!("exports").as_obj(),
                                        computed: false,
                                        prop: box Expr::Ident(ident.clone()),
                                    })),
                                    op: op!("="),
                                    right: box ident.into(),
                                },
                            ))));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Decl::Var(var))) => {
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(
                                var.clone().fold_with(self),
                            ))));

                            var.decls.visit_with(&mut VarCollector {
                                to: &mut self.scope.value.declared_vars,
                            });

                            let mut found = vec![];
                            for decl in var.decls {
                                let mut v = DestructuringFinder { found: &mut found };
                                decl.visit_with(&mut v);

                                for ident in found.drain(..).map(|v| Ident::new(v.0, v.1)) {
                                    self.scope
                                        .exported_vars
                                        .entry((ident.sym.clone(), ident.span.ctxt()))
                                        .or_default()
                                        .push((ident.sym.clone(), ident.span.ctxt()));
                                    init_export!(ident.sym);

                                    extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(
                                        box Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: quote_ident!("exports").as_obj(),
                                                computed: false,
                                                prop: box Expr::Ident(ident.clone()),
                                            })),
                                            op: op!("="),
                                            right: box ident.into(),
                                        }),
                                    )));
                                }
                            }
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..)) => {
                            //
                            extra_stmts.push(item.fold_with(self));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl)) => match decl {
                            ExportDefaultDecl::Class(ClassExpr { ident, class }) => {
                                init_export!("default");

                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(
                                    ClassDecl {
                                        ident: ident.clone(),
                                        class,
                                        declare: false,
                                    },
                                ))));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(member_expr!(
                                            DUMMY_SP,
                                            exports.default
                                        )),
                                        op: op!("="),
                                        right: box ident.into(),
                                    },
                                ))));
                            }
                            ExportDefaultDecl::Fn(FnExpr { ident, function }) => {
                                // init_export!("default");

                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(
                                    FnDecl {
                                        ident: ident.clone(),
                                        function,
                                        declare: false,
                                    }
                                    .fold_with(self),
                                ))));

                                extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(member_expr!(
                                            DUMMY_SP,
                                            exports.default
                                        )),
                                        op: op!("="),
                                        right: box ident.into(),
                                    },
                                ))));
                            }
                            _ => extra_stmts.push(
                                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl))
                                    .fold_with(self),
                            ),
                        },

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(expr)) => {
                            let ident = private_ident!("_default");

                            // TODO: Optimization (when expr cannot throw, `exports.default =
                            // void 0` is not required)

                            // We use extra statements because of the initialzation
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident.clone()),
                                    init: Some(expr.fold_with(self)),
                                    definite: false,
                                }],
                                declare: false,
                            }))));
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Assign(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(member_expr!(DUMMY_SP, exports.default)),
                                    op: op!("="),
                                    right: box ident.into(),
                                },
                            ))));
                        }

                        // export { foo } from 'foo';
                        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                            let imported = export
                                .src
                                .clone()
                                .map(|src| import!(src, !export.specifiers.is_empty()));

                            stmts.reserve(export.specifiers.len());

                            for ExportSpecifier { orig, exported, .. } in export.specifiers {
                                let is_import_default = orig.sym == js_word!("default");

                                let key = (orig.sym.clone(), orig.span.ctxt());
                                if self.scope.value.declared_vars.contains(&key) {
                                    self.scope
                                        .exported_vars
                                        .entry(key.clone())
                                        .or_default()
                                        .push(
                                            exported
                                                .clone()
                                                .map(|i| (i.sym.clone(), i.span.ctxt()))
                                                .unwrap_or_else(|| {
                                                    (orig.sym.clone(), orig.span.ctxt())
                                                }),
                                        );
                                }

                                if let Some(ref src) = export.src {
                                    if is_import_default {
                                        self.scope
                                            .import_types
                                            .entry(src.value.clone())
                                            .or_insert(false);
                                    }
                                }

                                let lazy = if let Some(ref src) = export.src {
                                    if self.scope.value.lazy_blacklist.contains(&src.value) {
                                        false
                                    } else {
                                        self.config.lazy.is_lazy(&src.value)
                                    }
                                } else {
                                    match self
                                        .scope
                                        .value
                                        .idents
                                        .get(&(orig.sym.clone(), orig.span.ctxt()))
                                    {
                                        Some((ref src, _)) => {
                                            if self.scope.value.lazy_blacklist.contains(src) {
                                                false
                                            } else {
                                                self.config.lazy.is_lazy(src)
                                            }
                                        }
                                        None => false,
                                    }
                                };

                                let is_reexport = export.src.is_some()
                                    || self
                                        .scope
                                        .value
                                        .idents
                                        .contains_key(&(orig.sym.clone(), orig.span.ctxt()));

                                let old = self.in_top_level;

                                // When we are in top level we make import not lazy.
                                let is_top_level = if lazy { !is_reexport } else { true };
                                self.in_top_level = is_top_level.into();

                                if is_top_level {
                                    eprintln!("is_top_level");
                                }

                                let value = match imported {
                                    Some(ref imported) => box Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        // unwrap is safe because `exports.specifiers.len() != 0`
                                        obj: imported.clone().unwrap().as_obj(),
                                        computed: false,
                                        prop: box Expr::Ident(orig.clone()),
                                    }),
                                    None => box Expr::Ident(orig.clone()).fold_with(self),
                                };

                                // True if we are exporting our own stuff.
                                let is_value_ident = match *value {
                                    Expr::Ident(..) => true,
                                    _ => false,
                                };
                                if is_value_ident {
                                    eprintln!("is_value_ident");
                                }

                                self.in_top_level = old;

                                if is_value_ident {
                                    let exported_symbol = exported
                                        .as_ref()
                                        .map(|e| e.sym.clone())
                                        .unwrap_or_else(|| orig.sym.clone());
                                    init_export!(exported_symbol);

                                    extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(
                                        box Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: quote_ident!("exports").as_callee(),
                                                computed: false,
                                                prop: box Expr::Ident(exported.unwrap_or(orig)),
                                            })),
                                            op: op!("="),
                                            right: value,
                                        }),
                                    )));
                                } else {
                                    stmts.push(ModuleItem::Stmt(Stmt::Expr(box define_property(
                                        vec![
                                            quote_ident!("exports").as_arg(),
                                            {
                                                // export { foo }
                                                //  -> 'foo'

                                                // export { foo as bar }
                                                //  -> 'bar'
                                                let i = exported.unwrap_or_else(|| orig);
                                                Lit::Str(quote_str!(i.span, i.sym)).as_arg()
                                            },
                                            make_descriptor(value).as_arg(),
                                        ],
                                    ))));
                                }
                            }
                        }

                        _ => unreachable!(),
                    }
                }
                _ => extra_stmts.push(item.fold_with(self)),
            }
        }

        let has_export = !exports.is_empty();

        // Used only if export * exists
        let export_names = {
            let export_names = private_ident!("_exportNames");
            if !export_alls.is_empty() && has_export {
                stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(export_names.clone()),
                        init: Some(box Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: exports
                                .into_iter()
                                .filter_map(|export| {
                                    if export == js_word!("default") {
                                        return None;
                                    }

                                    Some(PropOrSpread::Prop(box Prop::KeyValue(KeyValueProp {
                                        key: PropName::Ident(Ident::new(export, DUMMY_SP)),
                                        value: box Expr::Lit(Lit::Bool(Bool {
                                            span: DUMMY_SP,
                                            value: true,
                                        })),
                                    })))
                                })
                                .collect(),
                        })),
                        definite: false,
                    }],
                    declare: false,
                }))));
            }

            export_names
        };

        for export in export_alls {
            let imported = import!(export.src, true).unwrap();
            // Object.keys(_foo).forEach(function (key) {
            //   if (key === "default" || key === "__esModule") return;
            //   Object.defineProperty(exports, key, {
            //     enumerable: true,
            //     get: function () {
            //       return _foo[key];
            //     }
            //   });
            // })

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
                        if has_export {
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
                                    args: vec![
                                        export_names.clone().as_arg(),
                                        key_ident.clone().as_arg(),
                                    ],
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
                        quote_ident!("exports").as_arg(),
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

            // We use extra_stmts because it should be placed *after* import
            // statements.
            extra_stmts.push(ModuleItem::Stmt(Stmt::Expr(box Expr::Call(CallExpr {
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
            }))));
        }

        if !initialized.is_empty() {
            // Inject `exports.default = exports.foo = void 0`;

            let mut rhs = undefined(DUMMY_SP);

            for name in initialized.into_iter() {
                rhs = box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                        span: DUMMY_SP,
                        obj: quote_ident!("exports").as_callee(),
                        computed: false,
                        prop: box Expr::Ident(Ident::new(name, DUMMY_SP)),
                    })),
                    op: op!("="),
                    right: rhs,
                });
            }

            stmts.push(ModuleItem::Stmt(Stmt::Expr(rhs)));
        }

        for (src, import) in self.scope.value.imports.drain(..) {
            let lazy = if self.scope.value.lazy_blacklist.contains(&src) {
                false
            } else {
                self.config.lazy.is_lazy(&src)
            };

            let require = make_require_call(src.clone());

            match import {
                Some(import) => {
                    let ty = self.scope.value.import_types.get(&src);

                    let rhs = match ty {
                        Some(true) if !self.config.no_interop => {
                            self.helpers.interop_require_wildcard();
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("_interopRequireWildcard").as_callee(),
                                args: vec![require.as_arg()],
                                type_args: Default::default(),
                            })
                        }
                        Some(false) if !self.config.no_interop => {
                            self.helpers.interop_require_default();
                            box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("_interopRequireDefault").as_callee(),
                                args: vec![require.as_arg()],
                                type_args: Default::default(),
                            })
                        }
                        _ => box require,
                    };

                    let ident = Ident::new(import.0, import.1);

                    if lazy {
                        let return_data = Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(box quote_ident!("data").into()),
                        });

                        stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                            ident: ident.clone(),
                            function: Function {
                                span: DUMMY_SP,
                                is_async: false,
                                is_generator: false,
                                decorators: Default::default(),
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![
                                        // const data = require();
                                        Stmt::Decl(Decl::Var(VarDecl {
                                            span: DUMMY_SP,
                                            kind: VarDeclKind::Const,
                                            decls: vec![VarDeclarator {
                                                span: DUMMY_SP,
                                                name: Pat::Ident(quote_ident!("data")),
                                                init: Some(rhs),
                                                definite: false,
                                            }],
                                            declare: false,
                                        })),
                                        // foo = function() { return data; };
                                        Stmt::Expr(box Expr::Assign(AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Pat(box Pat::Ident(ident)),
                                            op: op!("="),
                                            right: box FnExpr {
                                                ident: None,
                                                function: Function {
                                                    span: DUMMY_SP,
                                                    is_async: false,
                                                    is_generator: false,
                                                    decorators: Default::default(),
                                                    body: Some(BlockStmt {
                                                        span: DUMMY_SP,
                                                        stmts: vec![return_data.clone()],
                                                    }),
                                                    params: vec![],
                                                    type_params: Default::default(),
                                                    return_type: Default::default(),
                                                },
                                            }
                                            .into(),
                                        })),
                                        // return data
                                        return_data,
                                    ],
                                }),
                                params: vec![],
                                type_params: Default::default(),
                                return_type: Default::default(),
                            },
                            declare: false,
                        }))));
                    } else {
                        stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: import.1,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(ident),
                                init: Some(rhs),
                                definite: false,
                            }],
                            declare: false,
                        }))));
                    }
                }
                None => {
                    stmts.push(ModuleItem::Stmt(Stmt::Expr(box require)));
                }
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }
}

impl Fold<Expr> for CommonJs {
    fn fold(&mut self, expr: Expr) -> Expr {
        macro_rules! entry {
            ($i:expr) => {
                self.scope
                    .value
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
                        left: PatOrExpr::Expr(box Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: quote_ident!("exports").as_obj(),
                            computed: false,
                            prop: box Expr::Ident(Ident::new(i.0.clone(), DUMMY_SP.with_ctxt(i.1))),
                        })),
                        op: op!("="),
                        right: e,
                    });
                }
                e
            }};
        }

        match expr {
            Expr::Ident(i) => {
                let v = self.scope.value.idents.get(&(i.sym.clone(), i.span.ctxt()));
                match v {
                    None => return Expr::Ident(i),
                    Some((src, prop)) => {
                        if self.in_top_level.value {
                            self.scope.value.lazy_blacklist.insert(src.clone());
                        }

                        let lazy = if self.scope.value.lazy_blacklist.contains(&src) {
                            false
                        } else {
                            self.config.lazy.is_lazy(&src)
                        };

                        let (ident, span) = self
                            .scope
                            .value
                            .imports
                            .get(src)
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
                            obj
                        } else {
                            Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: obj.as_obj(),
                                prop: box Expr::Ident(Ident::new(prop.clone(), DUMMY_SP)),
                                computed: false,
                            })
                        }
                    }
                }
            }
            Expr::Member(e) => {
                if e.computed {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
                        prop: e.prop.fold_with(self),
                        ..e
                    })
                } else {
                    Expr::Member(MemberExpr {
                        obj: e.obj.fold_with(self),
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
                    _ => {
                        return Expr::Update(UpdateExpr {
                            span,
                            arg: box Expr::Ident(arg),
                            op,
                            prefix,
                        });
                    }
                }
            }

            Expr::Assign(expr) => {
                //

                match expr.left {
                    PatOrExpr::Pat(box Pat::Ident(ref i)) => {
                        let entry = entry!(i);

                        match entry {
                            Entry::Occupied(entry) => {
                                let e = chain_assign!(entry, box Expr::Assign(expr));

                                *e
                            }
                            _ => {
                                return Expr::Assign(AssignExpr {
                                    left: expr.left,
                                    ..expr
                                });
                            }
                        }
                    }
                    _ => {
                        let mut found = vec![];
                        let mut v = DestructuringFinder { found: &mut found };
                        expr.left.visit_with(&mut v);
                        if v.found.is_empty() {
                            return Expr::Assign(AssignExpr {
                                left: expr.left,
                                ..expr
                            });
                        }

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
            _ => expr.fold_children(self),
        }
    }
}

impl Fold<VarDecl> for CommonJs {
    ///
    /// - collects all declared variables for let and var.
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        if var.kind != VarDeclKind::Const {
            var.decls.visit_with(&mut VarCollector {
                to: &mut self.scope.value.declared_vars,
            });
        }

        VarDecl {
            decls: var.decls.fold_with(self),
            ..var
        }
    }
}

macro_rules! mark_as_nested {
    ($T:tt) => {
        impl Fold<$T> for CommonJs {
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
mark_as_nested!(Function);
mark_as_nested!(Constructor);

macro_rules! noop {
    ($T:tt) => {
        impl Fold<$T> for CommonJs {
            fn fold(&mut self, n: $T) -> $T {
                n
            }
        }
    };
}

noop!(Pat);

struct VarCollector<'a> {
    pub to: &'a mut Vec<(JsWord, SyntaxContext)>,
}

impl<'a> Visit<VarDeclarator> for VarCollector<'a> {
    fn visit(&mut self, node: &VarDeclarator) {
        node.name.visit_with(self);
    }
}

impl<'a> Visit<Ident> for VarCollector<'a> {
    fn visit(&mut self, i: &Ident) {
        self.to.push((i.sym.clone(), i.span.ctxt()))
    }
}

fn make_descriptor(get_expr: Box<Expr>) -> ObjectLit {
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
