use super::util::{define_es_module, use_strict, Scope};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{ExprFactory, State},
};
use ast::*;
use std::sync::Arc;
use swc_common::{Fold, FoldWith, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn umd(helpers: Arc<Helpers>) -> impl Pass + Clone {
    Umd {
        helpers,
        scope: Default::default(),
    }
}

#[derive(Clone)]
struct Umd {
    helpers: Arc<Helpers>,
    scope: State<Scope>,
}

impl Fold<Vec<ModuleItem>> for Umd {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(items.len() + 2);
        stmts.push(use_strict());

        let mut emitted_esmodule = false;
        let exports = private_ident!("_exports");

        // Process items
        for item in items {
            let decl = match item {
                ModuleItem::Stmt(stmt) => {
                    stmts.push(stmt.fold_with(self));
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
                    if !emitted_esmodule {
                        emitted_esmodule = true;
                        stmts.push(define_es_module(exports.clone()));
                    }
                }

                ModuleDecl::TsImportEqualsDecl(..)
                | ModuleDecl::TsExportAssignment(..)
                | ModuleDecl::TsNamespaceExportDecl(..) => {}
            }
        }

        // ====================
        //  Handle imports
        // ====================

        let mut define_deps_arg = ArrayLit {
            span: DUMMY_SP,
            elems: vec![],
        };
        let mut factory_params = Vec::with_capacity(self.scope.imports.len() + 1);
        let mut factory_args = Vec::with_capacity(factory_params.capacity());
        if emitted_esmodule {
            define_deps_arg
                .elems
                .push(Some(Lit::Str(quote_str!("exports")).as_arg()));
            factory_params.push(Pat::Ident(exports.clone()));
            factory_args.push(quote_ident!("exports").as_arg());
        }

        for import in self.scope.value.imports.drain(..) {}

        // ====================
        //  Emit
        // ====================

        let helper_fn = Function {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            decorators: Default::default(),
            params: vec![
                Pat::Ident(quote_ident!("global")),
                Pat::Ident(quote_ident!("factory")),
            ],
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: {
                    // typeof define === 'function' && define.amd
                    let is_amd = box UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("typeof"),
                        arg: box Expr::Ident(quote_ident!("define")),
                    }
                    .make_eq(Lit::Str(quote_str!("function")))
                    .make_bin(op!("&&"), *member_expr!(DUMMY_SP, define.amd));

                    let is_common_js = box UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("typeof"),
                        arg: box Expr::Ident(quote_ident!("exports")),
                    }
                    .make_bin(op!("!=="), Lit::Str(quote_str!("undefined")));

                    vec![Stmt::If(IfStmt {
                        span: DUMMY_SP,
                        test: is_amd,
                        cons: box Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![],
                        }),
                        alt: Some(box Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: is_common_js,
                            cons: box Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![],
                            }),
                            alt: Some(box Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![],
                            })),
                        })),
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

        vec![ModuleItem::Stmt(Stmt::Expr(box Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: FnExpr {
                ident: None,
                function: helper_fn,
            }
            .as_callee(),
            args: vec![ThisExpr { span: DUMMY_SP }.as_arg(), factory_arg],
            type_args: Default::default(),
        })))]
    }
}
