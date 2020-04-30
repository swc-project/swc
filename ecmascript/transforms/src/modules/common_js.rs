pub use super::util::Config;
use super::util::{
    define_es_module, define_property, has_use_strict, initialize_to_undefined, make_descriptor,
    make_require_call, use_strict, ModulePass, Scope,
};
use crate::{
    pass::Pass,
    util::{var::VarCollector, DestructuringFinder, ExprFactory},
};
use fxhash::FxHashSet;
use swc_atoms::js_word;
use swc_common::{Fold, FoldWith, Mark, VisitWith, DUMMY_SP};
use swc_ecma_ast::*;

pub fn common_js(root_mark: Mark, config: Config) -> impl Pass {
    CommonJs {
        root_mark,
        config,
        scope: Default::default(),
        in_top_level: Default::default(),
    }
}

struct CommonJs {
    root_mark: Mark,
    config: Config,
    scope: Scope,
    in_top_level: bool,
}

noop_fold_type!(CommonJs);

impl Fold<Vec<ModuleItem>> for CommonJs {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut emitted_esmodule = false;
        let mut stmts = Vec::with_capacity(items.len() + 4);
        let mut extra_stmts = Vec::with_capacity(items.len());

        if self.config.strict_mode && !has_use_strict(&items) {
            stmts.push(ModuleItem::Stmt(use_strict()));
        }

        let mut exports = vec![];
        let mut initialized = FxHashSet::default();
        let mut export_alls = vec![];

        for item in items {
            self.in_top_level = true;

            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    self.scope.insert_import(import)
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(..)) => {
                    if !self.config.strict && !emitted_esmodule {
                        emitted_esmodule = true;

                        stmts.push(ModuleItem::Stmt(define_es_module(quote_ident!("exports"))));
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
                            ExportDefaultDecl {
                                decl: DefaultDecl::Fn(..),
                                ..
                            },
                        )) => {
                            // initialized.insert(js_word!("default"));
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl {
                                decl: DefaultDecl::TsInterfaceDecl(..),
                                ..
                            },
                        )) => {}

                        ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export)) => {
                            self.scope
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
                            self.scope.lazy_blacklist.insert(export.src.value.clone());

                            export_alls.push(export);
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: decl @ Decl::Class(..),
                            ..
                        }))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: decl @ Decl::Fn(..),
                            ..
                        })) => {
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

                            append_to.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(
                                        box quote_ident!("exports").member(ident.clone()),
                                    ),
                                    op: op!("="),
                                    right: box ident.into(),
                                }
                                .into_stmt()
                                .into(),
                            );
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: Decl::Var(var),
                            ..
                        })) => {
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(
                                var.clone().fold_with(self),
                            ))));

                            var.decls.visit_with(&mut VarCollector {
                                to: &mut self.scope.declared_vars,
                            });

                            let mut found: Vec<Ident> = vec![];
                            for decl in var.decls {
                                let mut v = DestructuringFinder { found: &mut found };
                                decl.visit_with(&mut v);

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
                                            left: PatOrExpr::Expr(
                                                box quote_ident!("exports").member(ident.clone()),
                                            ),
                                            op: op!("="),
                                            right: box ident.into(),
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                            }
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..)) => {
                            //
                            extra_stmts.push(item.fold_with(self));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl)) => {
                            match decl.decl {
                                DefaultDecl::Class(ClassExpr { ident, class }) => {
                                    init_export!("default");

                                    let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                    extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(
                                        ClassDecl {
                                            ident: ident.clone(),
                                            class,
                                            declare: false,
                                        },
                                    ))));

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(member_expr!(
                                                DUMMY_SP,
                                                exports.default
                                            )),
                                            op: op!("="),
                                            right: box ident.into(),
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                                DefaultDecl::Fn(FnExpr { ident, function }) => {
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

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(member_expr!(
                                                DUMMY_SP,
                                                exports.default
                                            )),
                                            op: op!("="),
                                            right: box ident.into(),
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                                _ => extra_stmts.push(
                                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl))
                                        .fold_with(self),
                                ),
                            }
                        }

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
                                    init: Some(expr.expr.fold_with(self)),
                                    definite: false,
                                }],
                                declare: false,
                            }))));
                            extra_stmts.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(member_expr!(DUMMY_SP, exports.default)),
                                    op: op!("="),
                                    right: box ident.into(),
                                }
                                .into_stmt()
                                .into(),
                            );
                        }

                        // export { foo } from 'foo';
                        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                            let imported = export.src.clone().map(|src| {
                                self.scope
                                    .import_to_export(&src, !export.specifiers.is_empty())
                            });

                            stmts.reserve(export.specifiers.len());

                            for NamedExportSpecifier { orig, exported, .. } in
                                export.specifiers.into_iter().map(|e| match e {
                                    ExportSpecifier::Named(e) => e,
                                    _ => unreachable!(
                                        "export default from 'foo'; should be removed by previous \
                                         pass"
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

                                let lazy = if let Some(ref src) = export.src {
                                    if self.scope.lazy_blacklist.contains(&src.value) {
                                        false
                                    } else {
                                        self.config.lazy.is_lazy(&src.value)
                                    }
                                } else {
                                    match self
                                        .scope
                                        .idents
                                        .get(&(orig.sym.clone(), orig.span.ctxt()))
                                    {
                                        Some((ref src, _)) => {
                                            if self.scope.lazy_blacklist.contains(src) {
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
                                        .idents
                                        .contains_key(&(orig.sym.clone(), orig.span.ctxt()));

                                let old = self.in_top_level;

                                // When we are in top level we make import not lazy.
                                let is_top_level = if lazy { !is_reexport } else { true };
                                self.in_top_level = is_top_level;

                                let value = match imported {
                                    Some(ref imported) => {
                                        box imported.clone().unwrap().member(orig.clone())
                                    }
                                    None => box Expr::Ident(orig.clone()).fold_with(self),
                                };

                                // True if we are exporting our own stuff.
                                let is_value_ident = match *value {
                                    Expr::Ident(..) => true,
                                    _ => false,
                                };

                                self.in_top_level = old;

                                if is_value_ident {
                                    let exported_symbol = exported
                                        .as_ref()
                                        .map(|e| e.sym.clone())
                                        .unwrap_or_else(|| orig.sym.clone());
                                    init_export!(exported_symbol);

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(
                                                box quote_ident!("exports")
                                                    .member(exported.unwrap_or(orig)),
                                            ),
                                            op: op!("="),
                                            right: value,
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                } else {
                                    stmts.push(
                                        define_property(vec![
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
                                        ])
                                        .into_stmt()
                                        .into(),
                                    );
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
        let exported_names = {
            if !export_alls.is_empty() && has_export {
                let exported_names = private_ident!("_exportNames");
                stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(exported_names.clone()),
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

                Some(exported_names)
            } else {
                None
            }
        };

        for export in export_alls {
            // We use extra_stmts because it should be placed *after* import
            // statements.
            extra_stmts.push(ModuleItem::Stmt(self.scope.handle_export_all(
                quote_ident!("exports"),
                exported_names.clone(),
                export,
            )));
        }

        if !initialized.is_empty() {
            stmts.push(
                initialize_to_undefined(quote_ident!("exports"), initialized)
                    .into_stmt()
                    .into(),
            );
        }

        for (src, import) in self.scope.imports.drain(..) {
            let lazy = if self.scope.lazy_blacklist.contains(&src) {
                false
            } else {
                self.config.lazy.is_lazy(&src)
            };

            let require = make_require_call(self.root_mark, src.clone());

            match import {
                Some(import) => {
                    let ty = self.scope.import_types.get(&src);

                    let rhs = match ty {
                        Some(true) if !self.config.no_interop => box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(interop_require_wildcard, "interopRequireWildcard"),
                            args: vec![require.as_arg()],
                            type_args: Default::default(),
                        }),
                        Some(false) if !self.config.no_interop => box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(interop_require_default, "interopRequireDefault"),
                            args: vec![require.as_arg()],
                            type_args: Default::default(),
                        }),
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
                                        AssignExpr {
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
                                        }
                                        .into_stmt(),
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
                    stmts.push(require.into_stmt().into());
                }
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }
}

impl Fold<Expr> for CommonJs {
    fn fold(&mut self, expr: Expr) -> Expr {
        let top_level = self.in_top_level;
        Scope::fold_expr(self, quote_ident!("exports"), top_level, expr)
    }
}

impl Fold<Prop> for CommonJs {
    fn fold(&mut self, p: Prop) -> Prop {
        match p {
            Prop::Shorthand(ident) => {
                let top_level = self.in_top_level;
                Scope::fold_shorthand_prop(self, top_level, ident)
            }

            _ => p.fold_children(self),
        }
    }
}

impl Fold<VarDecl> for CommonJs {
    ///
    /// - collects all declared variables for let and var.
    fn fold(&mut self, var: VarDecl) -> VarDecl {
        if var.kind != VarDeclKind::Const {
            var.decls.visit_with(&mut VarCollector {
                to: &mut self.scope.declared_vars,
            });
        }

        VarDecl {
            decls: var.decls.fold_with(self),
            ..var
        }
    }
}

impl Fold<FnDecl> for CommonJs {
    fn fold(&mut self, node: FnDecl) -> FnDecl {
        self.scope
            .declared_vars
            .push((node.ident.sym.clone(), node.ident.span.ctxt()));

        node.fold_children(self)
    }
}

impl ModulePass for CommonJs {
    fn config(&self) -> &Config {
        &self.config
    }

    fn scope(&self) -> &Scope {
        &self.scope
    }

    fn scope_mut(&mut self) -> &mut Scope {
        &mut self.scope
    }
}

mark_as_nested!(CommonJs);
