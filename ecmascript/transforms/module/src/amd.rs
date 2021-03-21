use super::util::{
    self, define_es_module, define_property, has_use_strict, initialize_to_undefined,
    local_name_for_src, make_descriptor, use_strict, Exports, ModulePass, Scope,
};
use fxhash::FxHashSet;
use serde::{Deserialize, Serialize};
use std::iter;
use swc_atoms::js_word;
use swc_common::{Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::quote_str;
use swc_ecma_utils::var::VarCollector;
use swc_ecma_utils::DestructuringFinder;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, VisitWith};

pub fn amd(config: Config) -> impl Fold {
    Amd {
        config,
        in_top_level: Default::default(),
        scope: Default::default(),
        exports: Default::default(),
    }
}

struct Amd {
    config: Config,
    in_top_level: bool,
    scope: Scope,
    exports: Exports,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: util::Config,
}

impl Fold for Amd {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let top_level = self.in_top_level;

        Scope::fold_expr(self, self.exports.0.clone(), top_level, expr)
    }

    fn fold_module(&mut self, module: Module) -> Module {
        let items = module.body;
        self.in_top_level = true;

        // Inserted after initializing exported names to undefined.
        let mut extra_stmts = vec![];
        let mut stmts = Vec::with_capacity(items.len() + 2);
        if self.config.config.strict_mode && !has_use_strict(&items) {
            stmts.push(use_strict());
        }

        let mut exports = vec![];
        let mut initialized = FxHashSet::default();
        let mut export_alls = vec![];
        let mut emitted_esmodule = false;
        let mut has_export = false;
        let exports_ident = self.exports.0.clone();

        // Process items
        for item in items {
            let decl = match item {
                ModuleItem::Stmt(stmt) => {
                    extra_stmts.push(stmt.fold_with(self));
                    continue;
                }
                ModuleItem::ModuleDecl(decl) => decl,
            };

            match decl {
                ModuleDecl::Import(import) => self.scope.insert_import(import),

                ModuleDecl::ExportAll(..)
                | ModuleDecl::ExportDecl(..)
                | ModuleDecl::ExportDefaultDecl(..)
                | ModuleDecl::ExportDefaultExpr(..)
                | ModuleDecl::ExportNamed(..) => {
                    has_export = true;
                    if !self.config.config.strict && !emitted_esmodule {
                        emitted_esmodule = true;
                        stmts.push(define_es_module(exports_ident.clone()));
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
                    match decl {
                        // Function declaration cannot throw an error.
                        ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                            decl: DefaultDecl::Fn(..),
                            ..
                        }) => {
                            // initialized.insert(js_word!("default"));
                        }

                        ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                            decl: DefaultDecl::TsInterfaceDecl(..),
                            ..
                        }) => {}

                        ModuleDecl::ExportAll(ref export) => {
                            self.scope
                                .import_types
                                .entry(export.src.value.clone())
                                .and_modify(|v| *v = true);
                        }

                        ModuleDecl::ExportDefaultDecl(..) | ModuleDecl::ExportDefaultExpr(..) => {
                            // TODO: Optimization (when expr cannot throw, `exports.default =
                            // void 0` is not required)
                            init_export!("default")
                        }
                        _ => {}
                    }

                    match decl {
                        ModuleDecl::ExportAll(export) => export_alls.push(export),
                        ModuleDecl::ExportDecl(ExportDecl {
                            decl: decl @ Decl::Class(..),
                            ..
                        })
                        | ModuleDecl::ExportDecl(ExportDecl {
                            decl: decl @ Decl::Fn(..),
                            ..
                        }) => {
                            let (ident, is_class) = match decl {
                                Decl::Class(ref c) => (c.ident.clone(), true),
                                Decl::Fn(ref f) => (f.ident.clone(), false),
                                _ => unreachable!(),
                            };

                            //
                            extra_stmts.push(Stmt::Decl(decl.fold_with(self)));

                            let append_to: &mut Vec<_> = if is_class {
                                &mut extra_stmts
                            } else {
                                // Function declaration cannot throw
                                &mut stmts
                            };

                            append_to.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(Box::new(
                                        exports_ident.clone().make_member(ident.clone()),
                                    )),
                                    op: op!("="),
                                    right: Box::new(ident.into()),
                                }
                                .into_stmt(),
                            );
                        }
                        ModuleDecl::ExportDecl(ExportDecl {
                            decl: Decl::Var(var),
                            ..
                        }) => {
                            extra_stmts.push(Stmt::Decl(Decl::Var(var.clone().fold_with(self))));

                            var.decls.visit_with(
                                &Invalid { span: DUMMY_SP } as _,
                                &mut VarCollector {
                                    to: &mut self.scope.declared_vars,
                                },
                            );

                            let mut found: Vec<Ident> = vec![];
                            for decl in var.decls {
                                let mut v = DestructuringFinder { found: &mut found };
                                decl.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);

                                for ident in found.drain(..) {
                                    self.scope
                                        .exported_vars
                                        .entry((ident.sym.clone(), ident.span.ctxt()))
                                        .or_default()
                                        .push((ident.sym.clone(), ident.span.ctxt()));
                                    init_export!(ident.sym);

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(Box::new(
                                                exports_ident.clone().make_member(ident.clone()),
                                            )),
                                            op: op!("="),
                                            right: Box::new(ident.into()),
                                        }
                                        .into_stmt(),
                                    );
                                }
                            }
                        }
                        ModuleDecl::ExportDefaultDecl(decl) => match decl {
                            ExportDefaultDecl {
                                decl: DefaultDecl::Class(ClassExpr { ident, class }),
                                ..
                            } => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(Stmt::Decl(Decl::Class(ClassDecl {
                                    ident: ident.clone(),
                                    class,
                                    declare: false,
                                })));

                                extra_stmts.push(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(Box::new(
                                            exports_ident
                                                .clone()
                                                .make_member(quote_ident!("default")),
                                        )),
                                        op: op!("="),
                                        right: Box::new(ident.into()),
                                    }
                                    .into_stmt(),
                                );
                            }
                            ExportDefaultDecl {
                                decl: DefaultDecl::Fn(FnExpr { ident, function }),
                                ..
                            } => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        left: PatOrExpr::Expr(Box::new(
                                            exports_ident
                                                .clone()
                                                .make_member(quote_ident!("default")),
                                        )),
                                        op: op!("="),
                                        right: Box::new(ident.clone().into()),
                                    }
                                    .into_stmt(),
                                );

                                extra_stmts.push(Stmt::Decl(Decl::Fn(
                                    FnDecl {
                                        ident,
                                        function,
                                        declare: false,
                                    }
                                    .fold_with(self),
                                )));
                            }
                            _ => {}
                        },

                        ModuleDecl::ExportDefaultExpr(ExportDefaultExpr { expr, .. }) => {
                            let ident = private_ident!("_default");

                            // We use extra statements because of the initialization
                            extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident.clone().into()),
                                    init: Some(expr.fold_with(self)),
                                    definite: false,
                                }],
                                declare: false,
                            })));
                            extra_stmts.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(Box::new(
                                        exports_ident.clone().make_member(quote_ident!("default")),
                                    )),
                                    op: op!("="),
                                    right: Box::new(ident.into()),
                                }
                                .into_stmt(),
                            );
                        }

                        // export { foo } from 'foo';
                        ModuleDecl::ExportNamed(export) => {
                            let imported = export.src.clone().map(|src| {
                                self.scope
                                    .import_to_export(&src, !export.specifiers.is_empty())
                            });

                            stmts.reserve(export.specifiers.len());

                            for ExportNamedSpecifier { orig, exported, .. } in
                                export.specifiers.into_iter().map(|e| match e {
                                    ExportSpecifier::Named(e) => e,
                                    ExportSpecifier::Default(..) => unreachable!(
                                        "export default from 'foo'; should be removed by previous \
                                         pass"
                                    ),
                                    ExportSpecifier::Namespace(..) => unreachable!(
                                        "export * as Foo from 'foo'; should be removed by \
                                         previous pass"
                                    ),
                                })
                            {
                                let is_import_default = orig.sym == js_word!("default");

                                let key = (orig.sym.clone(), orig.span.ctxt());
                                if self.scope.declared_vars.contains(&key) {
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

                                let value = match imported {
                                    Some(ref imported) => Box::new(
                                        imported.clone().unwrap().make_member(orig.clone()),
                                    ),
                                    None => Box::new(Expr::Ident(orig.clone()).fold_with(self)),
                                };

                                // True if we are exporting our own stuff.
                                let is_value_ident = match *value {
                                    Expr::Ident(..) => true,
                                    _ => false,
                                };

                                if is_value_ident {
                                    let exported_symbol = exported
                                        .as_ref()
                                        .map(|e| e.sym.clone())
                                        .unwrap_or_else(|| orig.sym.clone());
                                    init_export!(exported_symbol);

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(Box::new(
                                                exports_ident
                                                    .clone()
                                                    .make_member(exported.unwrap_or(orig)),
                                            )),
                                            op: op!("="),
                                            right: value,
                                        }
                                        .into_stmt(),
                                    );
                                } else {
                                    stmts.push(
                                        define_property(vec![
                                            exports_ident.clone().as_arg(),
                                            {
                                                // export { foo }
                                                //  -> 'foo'

                                                // export { foo as bar }
                                                //  -> 'bar'
                                                let i = exported.unwrap_or_else(|| orig);
                                                Lit::Str(quote_str!(i.span, i.sym)).as_arg()
                                            },
                                            make_descriptor(value).as_arg(),
                                        ])
                                        .into_stmt(),
                                    );
                                }
                            }
                        }

                        _ => {}
                    }
                }

                ModuleDecl::TsImportEquals(..)
                | ModuleDecl::TsExportAssignment(..)
                | ModuleDecl::TsNamespaceExport(..) => {}
            }
        }

        // ====================
        //  Handle imports
        // ====================

        // Prepended to statements.
        let mut import_stmts = vec![];
        let mut define_deps_arg = ArrayLit {
            span: DUMMY_SP,
            elems: vec![],
        };

        let mut factory_params = Vec::with_capacity(self.scope.imports.len() + 1);
        if has_export {
            define_deps_arg
                .elems
                .push(Some(Lit::Str(quote_str!("exports")).as_arg()));
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: Pat::Ident(exports_ident.clone().into()),
            });
        }

        // Used only if export * exists
        let exported_names = {
            if !export_alls.is_empty() && !exports.is_empty() {
                let exported_names = private_ident!("_exportNames");
                stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(exported_names.clone().into()),
                        init: Some(Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: exports
                                .into_iter()
                                .filter_map(|export| {
                                    if export == js_word!("default") {
                                        return None;
                                    }

                                    Some(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                        KeyValueProp {
                                            key: PropName::Ident(Ident::new(export, DUMMY_SP)),
                                            value: Box::new(Expr::Lit(Lit::Bool(Bool {
                                                span: DUMMY_SP,
                                                value: true,
                                            }))),
                                        },
                                    ))))
                                })
                                .collect(),
                        }))),
                        definite: false,
                    }],
                    declare: false,
                })));

                Some(exported_names)
            } else {
                None
            }
        };

        for export in export_alls {
            stmts.push(self.scope.handle_export_all(
                exports_ident.clone(),
                exported_names.clone(),
                export,
            ));
        }

        if !initialized.is_empty() {
            stmts.push(initialize_to_undefined(exports_ident, initialized).into_stmt());
        }

        for (src, import) in self.scope.imports.drain(..) {
            let import = import.unwrap_or_else(|| {
                (
                    local_name_for_src(&src),
                    DUMMY_SP.apply_mark(Mark::fresh(Mark::root())),
                )
            });
            let ident = Ident::new(import.0.clone(), import.1);

            define_deps_arg
                .elems
                .push(Some(Lit::Str(quote_str!(src.clone())).as_arg()));
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: Pat::Ident(ident.clone().into()),
            });

            {
                // handle interop
                let ty = self.scope.import_types.get(&src);

                if let Some(&wildcard) = ty {
                    if !self.config.config.no_interop {
                        let imported = ident.clone();
                        let right = Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: if wildcard {
                                helper!(interop_require_wildcard, "interopRequireWildcard")
                            } else {
                                helper!(interop_require_default, "interopRequireDefault")
                            },
                            args: vec![imported.as_arg()],
                            type_args: Default::default(),
                        }));
                        import_stmts.push(
                            AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(ident.clone().into()))),
                                op: op!("="),
                                right,
                            }
                            .into_stmt(),
                        );
                    }
                }
            }
        }

        prepend_stmts(&mut stmts, import_stmts.into_iter());
        stmts.append(&mut extra_stmts);

        // ====================
        //  Emit
        // ====================

        Module {
            body: vec![CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!("define").as_callee(),
                args: self
                    .config
                    .module_id
                    .clone()
                    .map(|s| quote_str!(s).as_arg())
                    .into_iter()
                    .chain(iter::once(define_deps_arg.as_arg()))
                    .chain(iter::once(
                        FnExpr {
                            ident: None,
                            function: Function {
                                span: DUMMY_SP,
                                is_async: false,
                                is_generator: false,
                                decorators: Default::default(),
                                params: factory_params,
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts,
                                }),
                                type_params: Default::default(),
                                return_type: Default::default(),
                            },
                        }
                        .as_arg(),
                    ))
                    .collect(),
                type_args: Default::default(),
            }
            .into_stmt()
            .into()],
            ..module
        }
    }

    fn fold_prop(&mut self, p: Prop) -> Prop {
        match p {
            Prop::Shorthand(ident) => {
                let top_level = self.in_top_level;
                Scope::fold_shorthand_prop(self, top_level, ident)
            }

            _ => p.fold_children_with(self),
        }
    }

    ///
    /// - collects all declared variables for let and var.
    fn fold_var_decl(&mut self, var: VarDecl) -> VarDecl {
        if var.kind != VarDeclKind::Const {
            var.decls.visit_with(
                &Invalid { span: DUMMY_SP } as _,
                &mut VarCollector {
                    to: &mut self.scope.declared_vars,
                },
            );
        }

        VarDecl {
            decls: var.decls.fold_with(self),
            ..var
        }
    }

    mark_as_nested!();
}

impl ModulePass for Amd {
    fn config(&self) -> &util::Config {
        &self.config.config
    }

    fn scope(&self) -> &Scope {
        &self.scope
    }

    fn scope_mut(&mut self) -> &mut Scope {
        &mut self.scope
    }

    fn make_dynamic_import(&mut self, span: Span, args: Vec<ExprOrSpread>) -> Expr {
        handle_dynamic_import(span, args)
    }
}

/// ```js
/// 
/// new Promise(function(resolve, reject) {
///     require([
///           'js/foo'
///     ], function (foo) {
///           resolve(foo)
///     }, function (err) {
//          reject(err);
///     });
/// });
///
/// ```
pub(super) fn handle_dynamic_import(span: Span, args: Vec<ExprOrSpread>) -> Expr {
    Expr::New(NewExpr {
        span,
        callee: Box::new(Expr::Ident(quote_ident!("Promise"))),
        args: Some(vec![FnExpr {
            ident: None,
            function: Function {
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                decorators: Default::default(),
                type_params: Default::default(),
                return_type: Default::default(),
                params: vec![
                    // resolve
                    Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: Pat::Ident(quote_ident!("resolve").into()),
                    },
                    // reject
                    Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: Pat::Ident(quote_ident!("reject").into()),
                    },
                ],

                // require([
                //         'js/foo'
                // ], function (foo) {
                //         resolve(foo)
                // }, function (err) {
                //         reject(err);
                // });
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: quote_ident!("require").as_callee(),
                                args: vec![
                                    ArrayLit {
                                        span: DUMMY_SP,
                                        elems: args.into_iter().map(Some).collect(),
                                    }
                                    .as_arg(),
                                    // function (foo) {
                                    //     resolve(foo)
                                    // }
                                    FnExpr {
                                        ident: None,

                                        function: Function {
                                            span: DUMMY_SP,
                                            decorators: Default::default(),
                                            is_async: false,
                                            is_generator: false,
                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                            params: vec![Param {
                                                span: DUMMY_SP,
                                                decorators: Default::default(),
                                                pat: Pat::Ident(quote_ident!("dep").into()),
                                            }],
                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![CallExpr {
                                                    span: DUMMY_SP,
                                                    callee: quote_ident!("resolve").as_callee(),
                                                    args: vec![quote_ident!("dep").as_arg()],
                                                    type_args: Default::default(),
                                                }
                                                .into_stmt()],
                                            }),
                                        },
                                    }
                                    .as_arg(),
                                    // function (err) {
                                    //         reject(err);
                                    // };
                                    FnExpr {
                                        ident: None,
                                        function: Function {
                                            span: DUMMY_SP,
                                            decorators: Default::default(),
                                            is_async: false,
                                            is_generator: false,
                                            type_params: Default::default(),
                                            return_type: Default::default(),
                                            params: vec![Param {
                                                span: DUMMY_SP,
                                                decorators: Default::default(),
                                                pat: Pat::Ident(quote_ident!("err").into()),
                                            }],
                                            body: Some(BlockStmt {
                                                span: DUMMY_SP,
                                                stmts: vec![CallExpr {
                                                    span: DUMMY_SP,
                                                    callee: quote_ident!("reject").as_callee(),
                                                    args: vec![quote_ident!("err").as_arg()],
                                                    type_args: Default::default(),
                                                }
                                                .into_stmt()],
                                            }),
                                        },
                                    }
                                    .as_arg(),
                                ],
                                type_args: Default::default(),
                            }
                            .into(),
                        ),
                    })],
                }),
            },
        }
        .as_arg()]),
        type_args: Default::default(),
    })
}
