use self::{case::CaseHandler, hoist::hoist};
use std::mem::replace;
use swc_atoms::js_word;
use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::contains_this_expr;
use swc_ecma_utils::prepend;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::quote_str;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

mod case;
mod hoist;
mod leap;

pub fn regenerator(global_mark: Mark) -> impl Fold {
    Regenerator {
        global_mark,
        regenerator_runtime: Default::default(),
        outer_fn_vars: Default::default(),
        top_level_vars: Default::default(),
    }
}

#[derive(Debug)]
struct Regenerator {
    global_mark: Mark,
    /// [Some] if used.
    regenerator_runtime: Option<Ident>,
    /// Variables declared in outer function.
    outer_fn_vars: Vec<VarDeclarator>,
    /// mark
    top_level_vars: Vec<VarDeclarator>,
}

fn rt(global_mark: Mark, rt: Ident) -> Stmt {
    Stmt::Decl(Decl::Var(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(rt.into()),
            init: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: quote_ident!(DUMMY_SP.apply_mark(global_mark), "require").as_callee(),
                args: vec![quote_str!("regenerator-runtime").as_arg()],
                type_args: Default::default(),
            }))),
            definite: false,
        }],
    }))
}

impl Regenerator {
    fn fold_stmt_like<T>(&mut self, items: Vec<T>) -> Vec<T>
    where
        T: FoldWith<Self> + StmtLike,
        Vec<T>: FoldWith<Self> + VisitWith<Finder>,
    {
        if !Finder::find(&items) {
            return items;
        }

        let mut new = Vec::with_capacity(items.len() + 2);

        for item in items {
            let item = item.fold_with(self);

            if !self.top_level_vars.is_empty() {
                prepend(
                    &mut new,
                    T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: replace(&mut self.top_level_vars, Default::default()),
                    }))),
                );
            }

            new.push(item);
        }

        new
    }
}

impl Fold for Regenerator {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        if !Finder::find(&e) {
            return e;
        }

        let e: Expr = e.fold_children_with(self);

        match e {
            Expr::Fn(FnExpr {
                ident, function, ..
            }) if function.is_generator => {
                let marked = ident.clone().unwrap_or_else(|| private_ident!("_callee"));
                let (ident, function) = self.fold_fn(
                    Some(ident.unwrap_or_else(|| marked.clone())),
                    marked,
                    function,
                );
                return Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: self
                        .regenerator_runtime
                        .clone()
                        .unwrap()
                        .make_member(quote_ident!("mark"))
                        .as_callee(),
                    args: vec![FnExpr { ident, function }.as_arg()],
                    type_args: None,
                });
            }

            _ => {}
        }

        e
    }

    fn fold_fn_decl(&mut self, f: FnDecl) -> FnDecl {
        if !Finder::find(&f) {
            return f;
        }

        if self.regenerator_runtime.is_none() {
            self.regenerator_runtime = Some(private_ident!("regeneratorRuntime"));
        }

        let f = f.fold_children_with(self);

        let marked = private_ident!("_marked");

        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(marked.clone().into()),
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

        let (i, function) = self.fold_fn(Some(f.ident), marked, f.function);

        FnDecl {
            ident: i.unwrap(),
            function,
            ..f
        }
    }

    fn fold_module(&mut self, m: Module) -> Module {
        let mut m: Module = m.fold_children_with(self);
        if let Some(rt_ident) = self.regenerator_runtime.take() {
            prepend(&mut m.body, rt(self.global_mark, rt_ident).into());
        }
        m
    }

    fn fold_module_decl(&mut self, i: ModuleDecl) -> ModuleDecl {
        if !Finder::find(&i) {
            return i;
        }

        let i = i.fold_children_with(self);

        match i {
            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span,
                decl:
                    DefaultDecl::Fn(FnExpr {
                        ident, function, ..
                    }),
            }) => {
                let marked = ident.clone().unwrap_or_else(|| private_ident!("_callee"));
                let (ident, function) = self.fold_fn(
                    Some(ident.unwrap_or_else(|| marked.clone())),
                    marked,
                    function,
                );

                return ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span,
                    expr: Box::new(FnExpr { ident, function }.into()),
                });
            }

            _ => {}
        }

        i
    }

    fn fold_prop(&mut self, p: Prop) -> Prop {
        let p = p.fold_children_with(self);

        match p {
            Prop::Method(p) if p.function.is_generator => {
                //
                let marked = private_ident!("_callee");
                let (ident, function) = self.fold_fn(Some(marked.clone()), marked, p.function);
                let mark_expr = Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: self
                        .regenerator_runtime
                        .clone()
                        .unwrap()
                        .make_member(quote_ident!("mark"))
                        .as_callee(),
                    args: vec![FnExpr { ident, function }.as_arg()],
                    type_args: None,
                });
                return Prop::Method(MethodProp {
                    function: Function {
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
                    },
                    ..p
                });
            }

            _ => {}
        }

        p
    }

    /// Injects `var _regeneratorRuntime = require('regenerator-runtime');`
    fn fold_script(&mut self, s: Script) -> Script {
        let mut s: Script = s.fold_children_with(self);
        if let Some(rt_ident) = self.regenerator_runtime.take() {
            prepend(&mut s.body, rt(self.global_mark, rt_ident).into());
        }
        s
    }

    /// Injects `var _regeneratorRuntime = require('regenerator-runtime');`
    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl Regenerator {
    fn fold_fn(
        &mut self,
        i: Option<Ident>,
        marked_ident: Ident,
        mut f: Function,
    ) -> (Option<Ident>, Function) {
        if !f.is_generator || f.body.is_none() {
            return (i, f);
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

        f.body = f.body.fold_with(&mut FnSentVisitor { ctx: ctx.clone() });
        let uses_this = contains_this_expr(&f.body);
        let (body, hoister) = hoist(f.body.unwrap());
        self.outer_fn_vars
            .extend(hoister.vars.into_iter().map(|id| VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(id.into()),
                init: None,
                definite: false,
            }));
        self.outer_fn_vars
            .extend(hoister.arguments.into_iter().map(|id| {
                VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(id.clone().into()),
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

        handler.explode_stmts(body.stmts);

        let mut cases = vec![];

        handler.extend_cases(&mut cases);

        let try_locs_list = handler.get_try_locs_list();

        // Intentionally fall through to the "end" case...
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some(Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: handler.final_loc() as _,
            })))),
            // fallthrough
            cons: vec![],
        });
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some(Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: "end".into(),
                has_escape: false,
                kind: Default::default(),
            })))),
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
            test: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 1.0,
            }))),
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

        (
            i,
            Function {
                is_generator: false,
                body: Some(BlockStmt {
                    span: body_span,
                    stmts: {
                        let mut buf = vec![];
                        if !self.outer_fn_vars.is_empty() {
                            buf.push(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: replace(&mut self.outer_fn_vars, Default::default()),
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
                                        let mut args = vec![Expr::Fn(FnExpr {
                                            ident: Some(inner_name),
                                            function: Function {
                                                params: vec![Param {
                                                    span: DUMMY_SP,
                                                    decorators: Default::default(),
                                                    pat: Pat::Ident(ctx.clone().into()),
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
                                        })
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
                                            args.push(Lit::Null(Null { span: DUMMY_SP }).as_arg());
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
                }),
                ..f
            },
        )
    }
}

struct FnSentVisitor {
    ctx: Ident,
}

impl Fold for FnSentVisitor {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children_with(self);

        match e {
            Expr::MetaProp(MetaPropExpr { meta, prop })
                if meta.sym == *"function" && prop.sym == *"sent" =>
            {
                return self.ctx.clone().make_member(quote_ident!("_sent"));
            }

            _ => {}
        }

        e
    }
}

/// Finds a generator function
struct Finder {
    found: bool,
}

impl Finder {
    fn find<T: VisitWith<Self>>(node: &T) -> bool {
        let mut v = Finder { found: false };
        node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
        v.found
    }
}

impl Visit for Finder {
    noop_visit_type!();

    fn visit_function(&mut self, node: &Function, _: &dyn Node) {
        if node.is_generator {
            self.found = true;
            return;
        }
        node.visit_children_with(self);
    }
}
