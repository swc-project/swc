use super::util::{define_es_module, local_name_for_src, make_require_call, use_strict, Scope};
use crate::{
    helpers::Helpers,
    pass::Pass,
    util::{prepend_stmts, DestructuringFinder, ExprFactory, State},
};
use ast::*;
use std::{collections::hash_map::Entry, iter, sync::Arc};
use swc_common::{Fold, FoldWith, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn umd(helpers: Arc<Helpers>) -> impl Pass + Clone {
    Umd {
        helpers,
        scope: Default::default(),
        exports: Default::default(),
    }
}

#[derive(Clone)]
struct Umd {
    helpers: Arc<Helpers>,
    scope: State<Scope>,
    exports: State<Exports>,
}

struct Exports(Ident);

impl Default for Exports {
    fn default() -> Self {
        Exports(private_ident!("_exports"))
    }
}

impl Fold<Vec<ModuleItem>> for Umd {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(items.len() + 2);
        stmts.push(use_strict());

        let mut emitted_esmodule = false;
        let exports = self.exports.value.0.clone();

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

        // Prepended to statements.
        let mut import_stmts = vec![];
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

        for (src, import) in self.scope.value.imports.drain(..) {
            let import = import.unwrap_or_else(|| (local_name_for_src(&src), DUMMY_SP));
            let ident = Ident::new(import.0.clone(), import.1);

            define_deps_arg
                .elems
                .push(Some(Lit::Str(quote_str!(src.clone())).as_arg()));
            factory_params.push(Pat::Ident(ident.clone()));
            factory_args.push(make_require_call(src.clone()).as_arg());

            import_stmts.push(Stmt::Expr({
                // handle interop
                let ty = self.scope.value.import_types.get(&src);
                let var = Expr::Ident(ident);

                match ty {
                    Some(true) => {
                        self.helpers.interop_require_wildcard();
                        box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: quote_ident!("_interopRequireWildcard").as_callee(),
                            args: vec![var.as_arg()],
                            type_args: Default::default(),
                        })
                    }
                    Some(false) => {
                        self.helpers.interop_require_default();
                        box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: quote_ident!("_interopRequireDefault").as_callee(),
                            args: vec![var.as_arg()],
                            type_args: Default::default(),
                        })
                    }
                    _ => box var,
                }
            }));
        }

        prepend_stmts(&mut stmts, import_stmts.into_iter());

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
                            stmts: vec![
                                // define(['foo'], factory)
                                Stmt::Expr(box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: quote_ident!("define").as_callee(),
                                    args: vec![
                                        define_deps_arg.as_arg(),
                                        quote_ident!("factory").as_arg(),
                                    ],
                                    type_args: Default::default(),
                                })),
                            ],
                        }),
                        alt: Some(box Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: is_common_js,
                            cons: box Stmt::Block(BlockStmt {
                                span: DUMMY_SP,
                                stmts: vec![
                                    // factory(require('foo'))
                                    Stmt::Expr(box Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        callee: quote_ident!("factory").as_callee(),
                                        args: factory_args,
                                        type_args: Default::default(),
                                    })),
                                ],
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

impl Fold<Expr> for Umd {
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

                            Expr::Ident(ident)
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
