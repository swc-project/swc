use std::{
    cell::{Ref, RefCell, RefMut},
    iter,
};

use anyhow::Context;
use indexmap::IndexSet;
use serde::{Deserialize, Serialize};
use swc_atoms::js_word;
use swc_common::{FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    prepend_stmts, private_ident, quote_ident, quote_str, var::VarCollector, DestructuringFinder,
    ExprFactory,
};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Visit, VisitWith};

use super::util::{
    self, define_es_module, define_property, has_use_strict, initialize_to_undefined,
    local_name_for_src, make_descriptor, use_strict, Exports, ModulePass, Scope,
};
use crate::path::{ImportResolver, Resolver};

pub fn amd(config: Config) -> impl Fold {
    Amd {
        config,
        in_top_level: Default::default(),
        scope: RefCell::new(Default::default()),
        exports: Default::default(),

        resolver: Resolver::Default,
        vars: Default::default(),
    }
}

pub fn amd_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    config: Config,
) -> impl Fold {
    Amd {
        config,
        in_top_level: Default::default(),
        scope: Default::default(),
        exports: Default::default(),

        resolver: Resolver::Real { base, resolver },
        vars: Default::default(),
    }
}

struct LocalScopedRequireVisitor {
    pub require_ident: Option<Ident>,
}

impl LocalScopedRequireVisitor {
    pub fn new() -> Self {
        LocalScopedRequireVisitor {
            require_ident: Default::default(),
        }
    }
}

impl Visit for LocalScopedRequireVisitor {
    fn visit_ident(&mut self, ident: &Ident) {
        if self.require_ident.is_none() && &*ident.sym == "require" {
            self.require_ident = Some(ident.clone());
        }
    }
}

struct Amd {
    config: Config,
    in_top_level: bool,
    scope: RefCell<Scope>,
    exports: Exports,

    resolver: Resolver,

    vars: RefCell<Vec<VarDeclarator>>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: util::Config,
}

/// TODO: VisitMut
impl Fold for Amd {
    noop_fold_type!();

    mark_as_nested!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let top_level = self.in_top_level;

        Scope::fold_expr(self, self.exports.0.clone(), top_level, expr)
    }

    fn fold_module(&mut self, module: Module) -> Module {
        let mut local_scoped_require_visitor = LocalScopedRequireVisitor::new();
        module.visit_with(&mut local_scoped_require_visitor);

        let items = module.body;
        self.in_top_level = true;

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
        // We'll preserve local scoped `require` ident as amd's local require ident
        // shadows global one
        let scoped_local_require_ident = local_scoped_require_visitor
            .require_ident
            .unwrap_or_else(|| private_ident!("require"));

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
                                .borrow_mut()
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

                            let mut scope_ref_mut = self.scope.borrow_mut();
                            let scope = &mut *scope_ref_mut;
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
                                    name: ident.clone().into(),
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
                                    ModuleExportName::Str(..) => {
                                        unimplemented!("module string names unimplemented")
                                    }
                                };
                                let exported = match exported {
                                    Some(ModuleExportName::Ident(ident)) => Some(ident),
                                    Some(ModuleExportName::Str(..)) => {
                                        unimplemented!("module string names unimplemented")
                                    }
                                    _ => None,
                                };
                                let mut scope_ref_mut = self.scope.borrow_mut();
                                let scope = &mut *scope_ref_mut;
                                let is_import_default = orig.sym == js_word!("default");

                                let key = (orig.sym.clone(), orig.span.ctxt());
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
                                        define_property(vec![
                                            exports_ident.clone().as_arg(),
                                            {
                                                // export { foo }
                                                //  -> 'foo'

                                                // export { foo as bar }
                                                //  -> 'bar'
                                                let i = exported.unwrap_or(orig);
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
        let mut scope_ref_mut = self.scope.borrow_mut();
        let scope = &mut *scope_ref_mut;
        let mut factory_params = Vec::with_capacity(scope.imports.len() + 1);

        // inject local scoped `require` regardless of having exports or not, as long as
        // it can be considered as module (either having import or export)
        if !scope.imports.is_empty() || has_export {
            define_deps_arg.elems.push(Some("require".as_arg()));
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: scoped_local_require_ident.into(),
            });
        }

        if has_export {
            define_deps_arg.elems.push(Some("exports".as_arg()));
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: exports_ident.clone().into(),
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

        for (src, (_, import)) in scope.imports.drain(..) {
            let import = import.unwrap_or_else(|| {
                (
                    local_name_for_src(&src),
                    DUMMY_SP.apply_mark(Mark::fresh(Mark::root())),
                )
            });
            let ident = Ident::new(import.0.clone(), import.1);

            {
                let src = match &self.resolver {
                    Resolver::Real { resolver, base } => resolver
                        .resolve_import(base, &src)
                        .with_context(|| format!("failed to resolve `{}`", src))
                        .unwrap(),
                    Resolver::Default => src.clone(),
                };

                define_deps_arg.elems.push(Some(src.as_arg()));
            }
            factory_params.push(Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: ident.clone().into(),
            });

            {
                // handle interop
                let ty = scope.import_types.get(&src);

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
                                left: PatOrExpr::Pat(ident.clone().into()),
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

impl ModulePass for Amd {
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

    fn make_dynamic_import(&mut self, span: Span, args: Vec<ExprOrSpread>) -> Expr {
        handle_dynamic_import(span, args)
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
