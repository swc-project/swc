use std::sync::Arc;

use parking_lot::Mutex;
use rustc_hash::FxHashMap;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_utils::{ExprCtx, ExprExt};
use swc_ecma_visit::VisitMutWith;

use crate::{
    compress::{compressor, pure_optimizer, PureOptimizerConfig},
    mode::Mode,
    option::{CompressOptions, TopLevelOptions},
};

pub struct Evaluator {
    expr_ctx: ExprCtx,

    program: Program,
    marks: Marks,
    data: Eval,
    /// We run minification only once.
    done: bool,
}

impl Evaluator {
    pub fn new(module: Module, marks: Marks) -> Self {
        Evaluator {
            expr_ctx: ExprCtx {
                unresolved_ctxt: SyntaxContext::empty().apply_mark(marks.unresolved_mark),
                is_unresolved_ref_safe: false,
                in_strict: true,
                remaining_depth: 3,
            },

            program: Program::Module(module),
            marks,
            data: Default::default(),
            done: Default::default(),
        }
    }
}

#[derive(Default, Clone)]
struct Eval {
    store: Arc<Mutex<EvalStore>>,
}

#[derive(Default)]
struct EvalStore {
    cache: FxHashMap<Id, Box<Expr>>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum EvalResult {
    Lit(Lit),
    Undefined,
}

impl Mode for Eval {
    fn store(&self, id: Id, value: &Expr) {
        let mut w = self.store.lock();
        w.cache.insert(id, Box::new(value.clone()));
    }

    fn preserve_vars(&self) -> bool {
        true
    }

    fn should_be_very_correct(&self) -> bool {
        false
    }
}

impl Evaluator {
    #[tracing::instrument(name = "Evaluator::run", level = "debug", skip_all)]
    fn run(&mut self) {
        if !self.done {
            self.done = true;

            let marks = self.marks;
            let data = self.data.clone();
            //
            self.program.mutate(&mut compressor(
                marks,
                &CompressOptions {
                    // We should not drop unused variables.
                    unused: false,
                    top_level: Some(TopLevelOptions { functions: true }),
                    ..Default::default()
                },
                None,
                &data,
            ));
        }
    }

    pub fn store(&self, id: Id, value: &Expr) {
        self.data.store(id, value);
    }

    pub fn resolve_identifier(&mut self, ident: &Ident) -> Option<Box<Expr>> {
        self.run();

        let lock = self.data.store.lock();
        let val = lock.cache.get(&ident.to_id())?;

        Some(val.clone())
    }

    pub fn eval(&mut self, e: &Expr) -> Option<EvalResult> {
        match e {
            Expr::Seq(s) => return self.eval(s.exprs.last()?),

            Expr::Lit(
                l @ Lit::Num(..)
                | l @ Lit::Str(..)
                | l @ Lit::BigInt(..)
                | l @ Lit::Bool(..)
                | l @ Lit::Null(..),
            ) => return Some(EvalResult::Lit(l.clone())),

            Expr::Tpl(t) => {
                return self.eval_tpl(t);
            }

            Expr::TaggedTpl(t) => {
                // Handle `String.raw`

                match &*t.tag {
                    Expr::Member(MemberExpr {
                        obj: tag_obj,
                        prop: MemberProp::Ident(prop),
                        ..
                    }) if tag_obj.is_global_ref_to(self.expr_ctx, "String")
                        && prop.sym == *"raw" =>
                    {
                        return self.eval_tpl(&t.tpl);
                    }

                    _ => {}
                }
            }

            Expr::Cond(c) => {
                let test = self.eval(&c.test)?;

                if is_truthy(&test)? {
                    return self.eval(&c.cons);
                } else {
                    return self.eval(&c.alt);
                }
            }

            // TypeCastExpression, ExpressionStatement etc
            Expr::TsTypeAssertion(e) => {
                return self.eval(&e.expr);
            }

            Expr::TsConstAssertion(e) => {
                return self.eval(&e.expr);
            }

            // "foo".length
            Expr::Member(MemberExpr { obj, prop, .. })
                if obj.is_lit() && prop.is_ident_with("length") => {}

            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => return Some(EvalResult::Undefined),

            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => {
                let arg = self.eval(arg)?;

                if is_truthy(&arg)? {
                    return Some(EvalResult::Lit(Lit::Bool(Bool {
                        span: DUMMY_SP,
                        value: false,
                    })));
                } else {
                    return Some(EvalResult::Lit(Lit::Bool(Bool {
                        span: DUMMY_SP,
                        value: true,
                    })));
                }
            }

            _ => {}
        }

        Some(EvalResult::Lit(self.eval_as_expr(e)?.lit()?))
    }

    pub fn eval_as_expr(&mut self, e: &Expr) -> Option<Box<Expr>> {
        match e {
            Expr::Bin(BinExpr {
                span,
                op,
                left,
                right,
            }) => {
                let l = if left.is_lit() || left.is_tpl() {
                    left.clone()
                } else {
                    self.eval_as_expr(left)?
                };
                let r = if right.is_lit() || right.is_tpl() {
                    right.clone()
                } else {
                    self.eval_as_expr(right)?
                };

                let mut e: Expr = BinExpr {
                    span: *span,
                    op: *op,
                    left: l,
                    right: r,
                }
                .into();

                e.visit_mut_with(&mut pure_optimizer(
                    &Default::default(),
                    self.marks,
                    PureOptimizerConfig {
                        enable_join_vars: true,
                    },
                ));
                return Some(Box::new(e));
            }

            Expr::Ident(i) => return self.resolve_identifier(i),

            Expr::Member(MemberExpr {
                span, obj, prop, ..
            }) if !prop.is_computed() => {
                let obj = self.eval_as_expr(obj)?;

                let mut e: Expr = MemberExpr {
                    span: *span,
                    obj,
                    prop: prop.clone(),
                }
                .into();

                e.visit_mut_with(&mut pure_optimizer(
                    &Default::default(),
                    self.marks,
                    PureOptimizerConfig {
                        enable_join_vars: false,
                    },
                ));
                return Some(Box::new(e));
            }
            _ => {}
        }

        None
    }

    pub fn eval_tpl(&mut self, q: &Tpl) -> Option<EvalResult> {
        self.run();

        let mut exprs = Vec::new();

        for expr in &q.exprs {
            let res = self.eval(expr)?;
            exprs.push(match res {
                EvalResult::Lit(v) => v.into(),
                EvalResult::Undefined => Expr::undefined(DUMMY_SP),
            });
        }

        let mut e: Box<Expr> = Tpl {
            span: q.span,
            exprs,
            quasis: q.quasis.clone(),
        }
        .into();

        {
            e.visit_mut_with(&mut pure_optimizer(
                &Default::default(),
                self.marks,
                PureOptimizerConfig {
                    enable_join_vars: false,
                },
            ));
        }

        Some(EvalResult::Lit(e.lit()?))
    }
}

fn is_truthy(lit: &EvalResult) -> Option<bool> {
    match lit {
        EvalResult::Lit(v) => match v {
            Lit::Str(v) => Some(!v.value.is_empty()),
            Lit::Bool(v) => Some(v.value),
            Lit::Null(_) => Some(false),
            Lit::Num(v) => Some(v.value != 0.0 && v.value != -0.0),
            _ => None,
        },
        EvalResult::Undefined => Some(false),
    }
}
