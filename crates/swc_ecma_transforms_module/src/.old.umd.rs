use std::cell::{Ref, RefCell, RefMut};

use indexmap::IndexSet;
use swc_atoms::js_word;
use swc_common::{sync::Lrc, FileName, Mark, SourceMap, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    member_expr, prepend_stmts, private_ident, quote_ident, quote_str, var::VarCollector,
    DestructuringFinder, ExprFactory,
};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, VisitWith};

use self::config::BuiltConfig;
pub use self::config::Config;
use super::util::{
    self, define_es_module, has_use_strict, initialize_to_undefined, local_name_for_src,
    make_descriptor, use_strict, Exports, ModulePass, Scope,
};
use crate::{
    path::{ImportResolver, Resolver},
    util::object_define_property,
};

mod config;

pub fn umd(cm: Lrc<SourceMap>, unresolved_mark: Mark, config: Config) -> impl Fold {
    Umd {
        config: config.build(cm.clone()),
        unresolved_mark,
        cm,

        in_top_level: Default::default(),
        scope: RefCell::new(Default::default()),
        exports: Default::default(),

        resolver: Resolver::Default,
        vars: Default::default(),
    }
}

pub fn umd_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    cm: Lrc<SourceMap>,
    unresolved_mark: Mark,
    config: Config,
) -> impl Fold {
    Umd {
        config: config.build(cm.clone()),
        unresolved_mark,
        cm,

        in_top_level: Default::default(),
        scope: Default::default(),
        exports: Default::default(),

        resolver: Resolver::Real { base, resolver },
        vars: Default::default(),
    }
}

struct Umd {
    cm: Lrc<SourceMap>,
    unresolved_mark: Mark,
    in_top_level: bool,
    config: BuiltConfig,
    scope: RefCell<Scope>,
    exports: Exports,

    resolver: Resolver,
    vars: RefCell<Vec<VarDeclarator>>,
}

/// TODO: VisitMut
impl Fold for Umd {
    noop_fold_type!();

    mark_as_nested!();

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
        let mut stmts = Vec::with_capacity(items.len() + 3);
        if self.config.config.strict_mode && !has_use_strict(&items) {
            stmts.push(use_strict());
        }

        let mut exports = vec![];
        let mut initialized = IndexSet::default();
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
                ModuleDecl::Import(import) => self.scope.borrow_mut().insert_import(import),

                ModuleDecl::ExportAll(..)
                | ModuleDecl::ExportDecl(..)
                | ModuleDecl::ExportDefaultDecl(..)
                | ModuleDecl::ExportDefaultExpr(..)
                | ModuleDecl::ExportNamed(..) => {
                    let mut scope_ref_mut = self.scope.borrow_mut();
                    let scope = &mut *scope_ref_mut;
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
                            scope
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
                    drop(scope_ref_mut);

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

                            let scope = &mut *self.scope.borrow_mut();
                            var.decls.visit_with(&mut VarCollector {
                                to: &mut scope.declared_vars,
                            });

                            let mut found: Vec<Ident> = vec![];
                            for decl in var.decls {
                                let mut v = DestructuringFinder { found: &mut found };
                                decl.visit_with(&mut v);

                                for ident in found.drain(..) {
                                    scope
                                        .exported_bindings
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
                                    name: ident.clone().into(),
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
                            let mut scope_ref_mut = self.scope.borrow_mut();
                            let scope = &mut *scope_ref_mut;
                            let imported = export.src.clone().map(|src| {
                                scope.import_to_export(&src, !export.specifiers.is_empty())
                            });
                            drop(scope_ref_mut);

                            stmts.reserve(export.specifiers.len());

                            for ExportNamedSpecifier { orig, exported, .. } in export
                                .specifiers
                                .into_iter()
                                .map(|e| match e {
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
                                .filter(|e| !e.is_type_only)
                            {
                                let orig = match orig {
                                    ModuleExportName::Ident(ident) => ident,
                                    _ => unimplemented!("module string names unimplemented"),
                                };
                                let exported = match exported {
                                    Some(ModuleExportName::Ident(ident)) => Some(ident),
                                    Some(ModuleExportName::Str(..)) => {
                                        unimplemented!("module string names unimplemented")
                                    }
                                    _ => None,
                                };

                                let is_import_default = orig.sym == js_word!("default");

                                let key = (orig.sym.clone(), orig.span.ctxt());
                                let mut scope_ref_mut = self.scope.borrow_mut();
                                let scope = &mut *scope_ref_mut;
                                if scope.declared_vars.contains(&key) {
                                    scope
                                        .exported_bindings
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
                                        scope
                                            .import_types
                                            .entry(src.value.clone())
                                            .or_insert(false);
                                    }
                                }
                                drop(scope_ref_mut);

                                let value = match imported {
                                    Some(ref imported) => Box::new(
                                        imported.clone().unwrap().make_member(orig.clone()),
                                    ),
                                    None => Box::new(Expr::Ident(orig.clone()).fold_with(self)),
                                };

                                // True if we are exporting our own stuff.
                                let is_value_ident = matches!(*value, Expr::Ident(..));

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
                                        object_define_property(
                                            exports_ident.clone().as_arg(),
                                            {
                                                // export { foo }
                                                //  -> 'foo'

                                                // export { foo as bar }
                                                //  -> 'bar'
                                                let i = exported.unwrap_or(orig);
                                                quote_str!(i.span, i.sym).as_arg()
                                            },
                                            make_descriptor(value).as_arg(),
                                        )
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

        let vars = self.vars_take();

        if !vars.is_empty() {
            let var_stmt = Stmt::Decl(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vars,
                }
                .into(),
            );

            stmts.push(var_stmt);
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

        let scope = &mut *self.scope.borrow_mut();
        let mut factory_params = Vec::with_capacity(scope.imports.len() + 1);
        let mut factory_args = Vec::with_capacity(factory_params.capacity());
        let mut global_factory_args = Vec::with_capacity(factory_params.capacity());
        if has_export {
            define_deps_arg
                .elems
                .push(Some(Lit::Str(quote_str!("exports")).as_arg()));
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: exports_ident.clone().into(),
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
                        name: exported_names.clone().into(),
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
                                            value: true.into(),
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
            let span = export.span;
            let export = scope
                .import_to_export(&export.src, true)
                .expect("Export should exists");
            stmts.push(Scope::handle_export_all(
                span,
                exports_ident.clone(),
                exported_names.clone(),
                export,
            ));
        }

        if !initialized.is_empty() {
            stmts.extend(initialize_to_undefined(exports_ident, initialized));
        }

        for (src, (src_span, import)) in scope.imports.drain(..) {
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
                pat: ident.clone().into(),
            });
            factory_args.push(
                self.resolver
                    .make_require_call(self.unresolved_mark, src.clone(), src_span)
                    .as_arg(),
            );
            global_factory_args.push(quote_ident!("global").make_member(global_ident).as_arg());

            {
                // handle interop
                let ty = scope.import_types.get(&src);

                if let Some(&wildcard) = ty {
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
                                left: PatOrExpr::Pat(ident.clone().into()),
                                op: op!("="),
                                right,
                            }
                            .into_stmt(),
                        );
                    }
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
                    pat: quote_ident!("global").into(),
                },
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: quote_ident!("factory").into(),
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
                                            name: quote_ident!("mod").into(),
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
            Prop::Shorthand(ident) => Scope::fold_shorthand_prop(self, ident),

            _ => p.fold_children_with(self),
        }
    }

    ///
    /// - collects all declared variables for let and var.
    fn fold_var_decl(&mut self, var: VarDecl) -> VarDecl {
        if var.kind != VarDeclKind::Const {
            var.decls.visit_with(&mut VarCollector {
                to: &mut self.scope.borrow_mut().declared_vars,
            });
        }

        VarDecl {
            decls: var.decls.fold_with(self),
            ..var
        }
    }
}

impl ModulePass for Umd {
    fn config(&self) -> &util::Config {
        &self.config.config
    }

    fn scope(&self) -> Ref<Scope> {
        self.scope.borrow()
    }

    fn scope_mut(&mut self) -> RefMut<Scope> {
        self.scope.borrow_mut()
    }

    fn resolver(&self) -> &Resolver {
        &self.resolver
    }

    /// ```js
    ///  exports === undefined ? (try_amd) : (try_common_js)
    /// ```
    fn make_dynamic_import(&mut self, span: swc_common::Span, args: Vec<ExprOrSpread>) -> Expr {
        Expr::Cond(CondExpr {
            span,
            test: Box::new(quote_ident!("exports").make_eq(quote_ident!("undefined"))),
            cons: Box::new(amd_handle_dynamic_import(span, args.clone())),
            alt: Box::new(cjs_handle_dynamic_import(
                span,
                args,
                !self.config.config.no_interop,
            )),
        })
    }

    fn vars(&mut self) -> Ref<Vec<VarDeclarator>> {
        self.vars.borrow()
    }

    fn vars_mut(&mut self) -> RefMut<Vec<VarDeclarator>> {
        self.vars.borrow_mut()
    }

    fn vars_take(&mut self) -> Vec<VarDeclarator> {
        self.vars.take()
    }
}

fn cjs_handle_dynamic_import(
    span: Span,
    mut args: Vec<ExprOrSpread>,
    es_module_interop: bool,
) -> Expr {
    // there's a evalution order problem here
    let (resolve_arg, then_arg, require_arg) = if let Expr::Lit(Lit::Str(_)) = &*args[0].expr {
        (Vec::new(), Vec::new(), args)
    } else {
        let arg = private_ident!("s");
        let rest = args.split_off(1);
        let import = args.into_iter().next().unwrap();
        (
            vec![ExprOrSpread {
                spread: None,
                expr: if import.expr.is_tpl() {
                    import.expr
                } else {
                    Box::new(Expr::Tpl(Tpl {
                        span: DUMMY_SP,
                        exprs: vec![import.expr],
                        quasis: vec![
                            TplElement {
                                span: DUMMY_SP,
                                tail: true,
                                cooked: None,
                                raw: "".into(),
                            },
                            TplElement {
                                span: DUMMY_SP,
                                tail: true,
                                cooked: None,
                                raw: "".into(),
                            },
                        ],
                    }))
                },
            }],
            vec![arg.clone().into()],
            {
                let mut require_arg = vec![arg.as_arg()];
                require_arg.extend(rest);
                require_arg
            },
        )
    };

    let resolve_call = CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, Promise.resolve).as_callee(),
        args: resolve_arg,
        type_args: Default::default(),
    };
    // Promise.resolve().then
    let then = resolve_call.make_member(quote_ident!("then"));

    Expr::Call(CallExpr {
        span,
        callee: then.as_callee(),
        args: vec![
            // function () { return require('./foo'); }
            FnExpr {
                ident: None,
                function: Function {
                    span: DUMMY_SP,
                    params: then_arg,
                    is_generator: false,
                    is_async: false,
                    type_params: Default::default(),
                    return_type: Default::default(),
                    decorators: Default::default(),
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some({
                                let mut expr = Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: quote_ident!("require").as_callee(),
                                    args: require_arg,
                                    type_args: Default::default(),
                                }));

                                if es_module_interop {
                                    expr = Box::new(Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(
                                            interop_require_wildcard,
                                            "interopRequireWildcard"
                                        ),
                                        args: vec![expr.as_arg()],
                                        type_args: Default::default(),
                                    }));
                                }

                                expr
                            }),
                        })],
                    }),
                },
            }
            .as_arg(),
        ],
        type_args: Default::default(),
    })
}

fn amd_handle_dynamic_import(span: Span, args: Vec<ExprOrSpread>) -> Expr {
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
                        pat: quote_ident!("resolve").into(),
                    },
                    // reject
                    Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: quote_ident!("reject").into(),
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
                                                pat: quote_ident!("dep").into(),
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
                                                pat: quote_ident!("err").into(),
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
