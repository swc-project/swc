use std::mem::take;

use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    contains_this_expr, prepend, private_ident, quote_ident, quote_str, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

use self::{case::CaseHandler, hoist::hoist};

mod case;
mod hoist;
mod leap;

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]

pub struct Config {
    /// Import path used instead of `regenerator-runtime`
    #[serde(default)]
    pub import_path: Option<JsWord>,
}

/// # Paramters
///
/// ## `unresolved_mark`
///
/// `unresolved_mark` is used to generate `require` call, as the generated
/// `require` should not be shadowed by other `require` declaration in the
/// file.
#[tracing::instrument(level = "info", skip_all)]
pub fn regenerator(config: Config, unresolved_mark: Mark) -> impl Fold + VisitMut {
    as_folder(Regenerator {
        config,
        unresolved_mark,
        regenerator_runtime: Default::default(),
        top_level_vars: Default::default(),
    })
}

#[derive(Debug)]
struct Regenerator {
    config: Config,
    unresolved_mark: Mark,
    /// [Some] if used.
    regenerator_runtime: Option<Ident>,
    /// mark
    top_level_vars: Vec<VarDeclarator>,
}

fn require_rt(unresolved_mark: Mark, rt: Ident, src: Option<JsWord>) -> Stmt {
    Stmt::Decl(Decl::Var(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: rt.into(),
            init: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!(DUMMY_SP.apply_mark(unresolved_mark), "require").as_callee(),
                args: vec![src.unwrap_or_else(|| "regenerator-runtime".into()).as_arg()],
                type_args: Default::default(),
            }))),
            definite: false,
        }],
    }))
}

#[swc_trace]
impl Regenerator {
    fn visit_mut_stmt_like<T>(&mut self, items: &mut Vec<T>)
    where
        T: VisitMutWith<Self> + StmtLike,
        Vec<T>: VisitMutWith<Self> + VisitWith<Finder>,
    {
        if !Finder::find(items) {
            return;
        }

        let mut new = Vec::with_capacity(items.len() + 2);

        for mut item in items.drain(..) {
            item.visit_mut_children_with(self);

            if !self.top_level_vars.is_empty() {
                prepend(
                    &mut new,
                    T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: take(&mut self.top_level_vars),
                    }))),
                );
            }

            new.push(item);
        }

        *items = new;
    }
}

#[swc_trace]
impl VisitMut for Regenerator {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        if !Finder::find(e) {
            return;
        }

        e.visit_mut_children_with(self);

        if let Expr::Fn(FnExpr {
            ident,
            function: function @ Function {
                is_generator: true, ..
            },
            ..
        }) = e
        {
            let marked = ident.clone().unwrap_or_else(|| private_ident!("_callee"));
            let ident = self.visit_mut_fn(
                Some(ident.take().unwrap_or_else(|| marked.clone())),
                marked,
                function,
            );

            *e = Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: self
                    .regenerator_runtime
                    .clone()
                    .unwrap()
                    .make_member(quote_ident!("mark"))
                    .as_callee(),
                args: vec![FnExpr {
                    ident,
                    function: function.take(),
                }
                .as_arg()],
                type_args: None,
            });
        }
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        if !Finder::find(f) {
            return;
        }

        if self.regenerator_runtime.is_none() {
            self.regenerator_runtime = Some(private_ident!("regeneratorRuntime"));
        }

        f.visit_mut_children_with(self);

        if f.function.is_generator {
            let marked = private_ident!("_marked");

            self.top_level_vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: marked.clone().into(),
                init: Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: self
                        .regenerator_runtime
                        .clone()
                        .unwrap()
                        .make_member(quote_ident!("mark"))
                        .as_callee(),
                    args: vec![f.ident.clone().as_arg()],
                    type_args: None,
                }))),
                definite: false,
            });

            let i = self.visit_mut_fn(Some(f.ident.take()), marked, &mut f.function);

            f.ident = i.unwrap();
        }
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        m.visit_mut_children_with(self);

        if let Some(rt_ident) = self.regenerator_runtime.take() {
            let specifier = ImportSpecifier::Default(ImportDefaultSpecifier {
                span: DUMMY_SP,
                local: rt_ident,
            });
            prepend(
                &mut m.body,
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    specifiers: vec![specifier],
                    src: quote_str!(self
                        .config
                        .import_path
                        .clone()
                        .unwrap_or_else(|| "regenerator-runtime".into())),
                    type_only: Default::default(),
                    asserts: Default::default(),
                })),
            );
        }
    }

    fn visit_mut_module_decl(&mut self, i: &mut ModuleDecl) {
        if !Finder::find(i) {
            return;
        }

        i.visit_mut_children_with(self);

        if let ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
            span,
            decl: DefaultDecl::Fn(FnExpr {
                ident, function, ..
            }),
        }) = i
        {
            let marked = ident.clone().unwrap_or_else(|| private_ident!("_callee"));

            let ident = self.visit_mut_fn(
                Some(ident.take().unwrap_or_else(|| marked.clone())),
                marked,
                function,
            );

            *i = ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: *span,
                decl: DefaultDecl::Fn(FnExpr {
                    ident,
                    function: function.take(),
                }),
            });
        }
    }

    fn visit_mut_prop(&mut self, p: &mut Prop) {
        p.visit_mut_children_with(self);

        if let Prop::Method(p) = p {
            if !p.function.is_generator {
                return;
            }

            let marked = private_ident!("_callee");
            let ident = self.visit_mut_fn(Some(marked.clone()), marked, &mut p.function);

            let mark_expr = Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: self
                    .regenerator_runtime
                    .clone()
                    .unwrap()
                    .make_member(quote_ident!("mark"))
                    .as_callee(),
                args: vec![FnExpr {
                    ident,
                    function: p.function.take(),
                }
                .as_arg()],
                type_args: None,
            });

            p.function = Function {
                span: DUMMY_SP,
                params: vec![],
                decorators: vec![],
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: mark_expr.as_callee(),
                                args: vec![],
                                type_args: Default::default(),
                            }
                            .into(),
                        )),
                    }
                    .into()],
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            };
        }
    }

    /// Injects `var _regeneratorRuntime = require('regenerator-runtime');`
    fn visit_mut_script(&mut self, s: &mut Script) {
        s.visit_mut_children_with(self);

        if let Some(rt_ident) = self.regenerator_runtime.take() {
            prepend(
                &mut s.body,
                require_rt(
                    self.unresolved_mark,
                    rt_ident,
                    self.config.import_path.clone(),
                ),
            );
        }
    }

    /// Injects `var _regeneratorRuntime = require('regenerator-runtime');`
    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }
}

#[swc_trace]
impl Regenerator {
    fn visit_mut_fn(
        &mut self,
        i: Option<Ident>,
        marked_ident: Ident,
        f: &mut Function,
    ) -> Option<Ident> {
        if !f.is_generator || f.body.is_none() {
            return i;
        }
        if self.regenerator_runtime.is_none() {
            self.regenerator_runtime = Some(private_ident!("regeneratorRuntime"));
        }

        let body_span = f.body.span();

        let inner_name = i
            .as_ref()
            .map(|i| Ident::new(format!("{}$", i.sym).into(), i.span))
            .unwrap_or_else(|| private_ident!("ref$"));
        let ctx = private_ident!("_ctx");
        let mut handler = CaseHandler::new(&ctx);

        // f.body
        //     .visit_mut_with(&mut FnSentVisitor { ctx: ctx.clone() });
        let uses_this = contains_this_expr(&f.body);
        let (body, hoister) = hoist(f.body.take().unwrap());
        let mut outer_fn_vars = vec![];
        outer_fn_vars.extend(hoister.vars.into_iter().map(|id| VarDeclarator {
            span: DUMMY_SP,
            name: id.into(),
            init: None,
            definite: false,
        }));
        outer_fn_vars.extend(hoister.arguments.into_iter().map(|id| {
            VarDeclarator {
                span: DUMMY_SP,
                name: id.clone().into(),
                init: Some(Box::new(
                    Ident {
                        sym: js_word!("arguments"),
                        ..id
                    }
                    .into(),
                )),
                definite: false,
            }
        }));

        handler.explode_stmts(hoister.functions);

        handler.explode_stmts(body.stmts);

        let mut cases = vec![];

        handler.extend_cases(&mut cases);

        let try_locs_list = handler.get_try_locs_list();

        // Intentionally fall through to the "end" case...
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some(handler.final_loc().into()),
            // fallthrough
            cons: vec![],
        });
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some("end".into()),
            cons: vec![ReturnStmt {
                span: DUMMY_SP,
                // _ctx.stop()
                arg: Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: ctx.clone().make_member(quote_ident!("stop")).as_callee(),
                    args: vec![],
                    type_args: Default::default(),
                }))),
            }
            .into()],
        });

        let stmts = vec![Stmt::While(WhileStmt {
            span: DUMMY_SP,
            test: 1.0.into(),
            body: Box::new(
                SwitchStmt {
                    span: DUMMY_SP,
                    // _ctx.prev = _ctx.next
                    discriminant: Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: PatOrExpr::Expr(Box::new(
                                ctx.clone().make_member(quote_ident!("prev")),
                            )),
                            right: Box::new(ctx.clone().make_member(quote_ident!("next"))),
                        }
                        .into(),
                    ),
                    cases,
                }
                .into(),
            ),
        })];

        f.body = Some(BlockStmt {
            span: body_span,
            stmts: {
                let mut buf = vec![];
                if !outer_fn_vars.is_empty() {
                    buf.push(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: outer_fn_vars,
                        declare: false,
                    })));
                }

                buf.push(
                    ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: self
                                .regenerator_runtime
                                .clone()
                                .unwrap()
                                .make_member(quote_ident!("wrap"))
                                .as_callee(),
                            args: {
                                let mut args = vec![FnExpr {
                                    ident: Some(inner_name),
                                    function: Function {
                                        params: vec![Param {
                                            span: DUMMY_SP,
                                            decorators: Default::default(),
                                            pat: ctx.clone().into(),
                                        }],
                                        decorators: Default::default(),
                                        span: DUMMY_SP,
                                        body: Some(BlockStmt {
                                            span: DUMMY_SP,
                                            stmts,
                                        }),
                                        is_generator: false,
                                        is_async: false,
                                        type_params: None,
                                        return_type: None,
                                    },
                                }
                                .as_arg()];

                                if f.is_generator {
                                    args.push(marked_ident.as_arg());
                                } else if uses_this || try_locs_list.is_some() {
                                    // Async functions that are not generators
                                    // don't care about the
                                    // outer function because they don't need it
                                    // to be marked and don't
                                    // inherit from its .prototype.
                                    args.push(Lit::Null(Null { span: DUMMY_SP }).as_arg());
                                }

                                if uses_this {
                                    args.push(ThisExpr { span: DUMMY_SP }.as_arg())
                                } else if try_locs_list.is_some() {
                                    args.push(Null { span: DUMMY_SP }.as_arg());
                                }

                                if let Some(try_locs_list) = try_locs_list {
                                    args.push(try_locs_list.as_arg())
                                }

                                args
                            },
                            type_args: None,
                        }))),
                    }
                    .into(),
                );

                buf
            },
        });
        f.is_generator = false;

        i
    }
}

// function sent is still stage 2, we good
// struct FnSentVisitor {
//     ctx: Ident,
// }

// impl VisitMut for FnSentVisitor {
//     noop_visit_mut_type!();

//     fn visit_mut_expr(&mut self, e: &mut Expr) {
//         e.visit_mut_children_with(self);

//         if let Expr::MetaProp(MetaPropExpr { meta, prop }) = e {
//             if meta.sym == *"function" && prop.sym == *"sent" {
//                 *e = self.ctx.clone().make_member(quote_ident!("_sent"));
//             }
//         }
//     }
// }

/// Finds a generator function
struct Finder {
    found: bool,
}

impl Finder {
    fn find<T: VisitWith<Self>>(node: &T) -> bool {
        let mut v = Finder { found: false };
        node.visit_with(&mut v);
        v.found
    }
}

impl Visit for Finder {
    noop_visit_type!();

    fn visit_function(&mut self, node: &Function) {
        if node.is_generator {
            self.found = true;
            return;
        }
        node.visit_children_with(self);
    }
}
