use self::config::BuiltConfig;
pub use self::config::Config;
use super::util::{
    self, define_es_module, define_property, has_use_strict, initialize_to_undefined,
    local_name_for_src, make_descriptor, make_require_call, use_strict, Exports, ModulePass, Scope,
};
use fxhash::FxHashSet;
use swc_atoms::js_word;
use swc_common::{sync::Lrc, Mark, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::quote_str;
use swc_ecma_utils::{prepend_stmts, var::VarCollector, DestructuringFinder, ExprFactory};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, VisitWith};

mod config;

pub fn umd(cm: Lrc<SourceMap>, root_mark: Mark, config: Config) -> impl Fold {
    Umd {
        config: config.build(cm.clone()),
        root_mark,
        cm,

        in_top_level: Default::default(),
        scope: Default::default(),
        exports: Default::default(),
    }
}

struct Umd {
    cm: Lrc<SourceMap>,
    root_mark: Mark,
    in_top_level: bool,
    config: BuiltConfig,
    scope: Scope,
    exports: Exports,
}

impl Fold for Umd {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let exports = self.exports.0.clone();
        let top_level = self.in_top_level;

        Scope::fold_expr(self, exports, top_level, expr)
    }

    fn fold_module(&mut self, module: Module) -> Module {
        self.in_top_level = true;

        let filename = self.cm.span_to_filename(module.span);

        let items = module.body;

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
                        ModuleDecl::ExportDefaultDecl(decl) => match decl.decl {
                            DefaultDecl::Class(ClassExpr { ident, class }) => {
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
                            DefaultDecl::Fn(FnExpr { ident, function }) => {
                                let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                extra_stmts.push(Stmt::Decl(Decl::Fn(
                                    FnDecl {
                                        ident: ident.clone(),
                                        function,
                                        declare: false,
                                    }
                                    .fold_with(self),
                                )));

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
                            _ => {}
                        },

                        ModuleDecl::ExportDefaultExpr(expr) => {
                            let ident = private_ident!("_default");

                            // We use extra statements because of the initialization
                            extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(ident.clone().into()),
                                    init: Some(expr.expr.fold_with(self)),
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
        let mut factory_args = Vec::with_capacity(factory_params.capacity());
        let mut global_factory_args = Vec::with_capacity(factory_params.capacity());
        if has_export {
            define_deps_arg
                .elems
                .push(Some(Lit::Str(quote_str!("exports")).as_arg()));
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: Pat::Ident(exports_ident.clone().into()),
            });
            factory_args.push(quote_ident!("exports").as_arg());
            global_factory_args.push(member_expr!(DUMMY_SP, mod.exports).as_arg());
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
            let global_ident = Ident::new(self.config.global_name(&src), DUMMY_SP);
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
            factory_args.push(make_require_call(self.root_mark, src.clone()).as_arg());
            global_factory_args.push(quote_ident!("global").make_member(global_ident).as_arg());

            {
                // handle interop
                let ty = self.scope.import_types.get(&src);

                match ty {
                    Some(&wildcard) => {
                        let imported = ident.clone();

                        if !self.config.config.no_interop {
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
                                    left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                        ident.clone().into(),
                                    ))),
                                    op: op!("="),
                                    right,
                                }
                                .into_stmt(),
                            );
                        }
                    }
                    _ => {}
                };
            }
        }

        prepend_stmts(&mut stmts, import_stmts.into_iter());
        stmts.append(&mut extra_stmts);

        // ====================
        //  Emit
        // ====================

        let helper_fn = Function {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            decorators: Default::default(),
            params: vec![
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(quote_ident!("global").into()),
                },
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(quote_ident!("factory").into()),
                },
            ],
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: {
                    // typeof define === 'function' && define.amd
                    let is_amd = Box::new(
                        UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("typeof"),
                            arg: Box::new(Expr::Ident(quote_ident!("define"))),
                        }
                        .make_eq(Lit::Str(quote_str!("function")))
                        .make_bin(op!("&&"), *member_expr!(DUMMY_SP, define.amd)),
                    );

                    let is_common_js = Box::new(
                        UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("typeof"),
                            arg: Box::new(Expr::Ident(quote_ident!("exports"))),
                        }
                        .make_bin(op!("!=="), Lit::Str(quote_str!("undefined"))),
                    );

                    vec![Stmt::If(IfStmt {
                        span: DUMMY_SP,
                        test: is_amd,
                        cons: Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![
                                // define(['foo'], factory)
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: quote_ident!("define").as_callee(),
                                    args: vec![
                                        define_deps_arg.as_arg(),
                                        quote_ident!("factory").as_arg(),
                                    ],
                                    type_args: Default::default(),
                                }
                                .into_stmt(),
                            ],
                        })),
                        alt: Some(Box::new(Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: is_common_js,
                            cons: Box::new(Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![
                                    // factory(require('foo'))
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: quote_ident!("factory").as_callee(),
                                        args: factory_args,
                                        type_args: Default::default(),
                                    }
                                    .into_stmt(),
                                ],
                            })),
                            alt: Some(Box::new(Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![
                                    Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        decls: vec![VarDeclarator {
                                            span: DUMMY_SP,
                                            name: Pat::Ident(quote_ident!("mod").into()),
                                            init: Some(Box::new(Expr::Object(ObjectLit {
                                                span: DUMMY_SP,
                                                props: vec![PropOrSpread::Prop(Box::new(
                                                    Prop::KeyValue(KeyValueProp {
                                                        key: PropName::Ident(quote_ident!(
                                                            "exports"
                                                        )),
                                                        value: Box::new(Expr::Object(ObjectLit {
                                                            span: DUMMY_SP,
                                                            props: vec![],
                                                        })),
                                                    }),
                                                ))],
                                            }))),
                                            definite: false,
                                        }],
                                        declare: false,
                                    })),
                                    CallExpr {
                                        span: DUMMY_SP,
                                        callee: quote_ident!("factory").as_callee(),
                                        args: global_factory_args,
                                        type_args: Default::default(),
                                    }
                                    .into_stmt(),
                                    {
                                        let exported_name =
                                            self.config.determine_export_name(filename);

                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(Box::new(
                                                quote_ident!("global").make_member(exported_name),
                                            )),
                                            op: op!("="),
                                            right: member_expr!(DUMMY_SP,mod.exports),
                                        }
                                        .into_stmt()
                                    },
                                ],
                            }))),
                        }))),
                    })]
                },
            }),

            return_type: Default::default(),
            type_params: Default::default(),
        };

        let factory_arg = FnExpr {
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

                return_type: Default::default(),
                type_params: Default::default(),
            },
        }
        .as_arg();

        Module {
            body: vec![CallExpr {
                span: DUMMY_SP,
                callee: FnExpr {
                    ident: None,
                    function: helper_fn,
                }
                .wrap_with_paren()
                .as_callee(),
                args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), factory_arg],
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

impl ModulePass for Umd {
    fn config(&self) -> &util::Config {
        &self.config.config
    }

    fn scope(&self) -> &Scope {
        &self.scope
    }

    fn scope_mut(&mut self) -> &mut Scope {
        &mut self.scope
    }

    /// ```js
    ///  exports === undefined ? (try_amd) : (try_common_js)
    /// ```
    fn make_dynamic_import(&mut self, span: swc_common::Span, args: Vec<ExprOrSpread>) -> Expr {
        Expr::Cond(CondExpr {
            span,
            test: Box::new(quote_ident!("exports").make_eq(quote_ident!("undefined"))),
            cons: Box::new(super::amd::handle_dynamic_import(span, args.clone())),
            alt: Box::new(super::common_js::handle_dynamic_import(
                span,
                args,
                !self.config.config.no_interop,
            )),
        })
    }
}
