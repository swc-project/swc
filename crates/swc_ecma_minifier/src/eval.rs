use std::sync::Arc;

use parking_lot::Mutex;
use swc_atoms::js_word;
use swc_common::{collections::AHashMap, util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_optimization::simplify::{expr_simplifier, ExprSimplifierConfig};
use swc_ecma_utils::{ident::IdentLike, undefined, ExprExt, Id};
use swc_ecma_visit::{FoldWith, VisitMutWith};

use crate::{
    compress::{compressor, pure_optimizer, PureOptimizerConfig},
    marks::Marks,
    mode::Mode,
};

pub struct Evaluator {
    module: Module,
    marks: Marks,
    data: Eval,
    /// We run minification only once.
    done: bool,
}

impl Evaluator {
    pub fn new(module: Module, marks: Marks) -> Self {
        Evaluator {
            module,
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
    cache: AHashMap<Id, Box<Expr>>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum EvalResult {
    Lit(Lit),
    Undefined,
}

impl Mode for Eval {
    fn store(&self, id: Id, value: &Expr) {
        let mut w = self.store.lock();
        w.cache.insert(id, Box::new(value.clone()));
    }

    fn force_str_for_tpl() -> bool {
        true
    }
}

impl Evaluator {
    fn run(&mut self) {
        if !self.done {
            self.done = true;

            let marks = self.marks;
            let data = self.data.clone();
            self.module.map_with_mut(|m| {
                //
                swc_common::GLOBALS.with(|globals| {
                    //
                    m.fold_with(&mut compressor(
                        globals,
                        marks,
                        &serde_json::from_str("{ \"hoist_props\": true }").unwrap(),
                        &data,
                    ))
                })
            });
        }
    }

    pub fn eval(&mut self, e: &Expr) -> Option<EvalResult> {
        match e {
            Expr::Seq(s) => return self.eval(s.exprs.last()?),

            Expr::Lit(l @ Lit::Null(..))
            | Expr::Lit(l @ Lit::Num(..) | l @ Lit::Str(..) | l @ Lit::BigInt(..)) => {
                return Some(EvalResult::Lit(l.clone()))
            }

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
                    }) if tag_obj.is_ident_ref_to("String".into()) && prop.sym == *"raw" => {
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
            Expr::Member(MemberExpr {
                obj,
                prop:
                    MemberProp::Ident(Ident {
                        sym: js_word!("length"),
                        ..
                    }),
                ..
            }) if obj.is_lit() => {}

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

    fn eval_as_expr(&mut self, e: &Expr) -> Option<Box<Expr>> {
        match e {
            Expr::Ident(i) => {
                self.run();

                let lock = self.data.store.lock();
                let val = lock.cache.get(&i.to_id())?;

                return Some(val.clone());
            }

            Expr::Member(MemberExpr {
                span, obj, prop, ..
            }) if !prop.is_computed() => {
                let obj = self.eval_as_expr(obj)?;

                let mut e = Expr::Member(MemberExpr {
                    span: *span,
                    obj,
                    prop: prop.clone(),
                });

                e.visit_mut_with(&mut expr_simplifier(
                    self.marks.unresolved_mark,
                    ExprSimplifierConfig {},
                ));
                return Some(Box::new(e));
            }
            _ => {}
        }

        None
    }

    pub fn eval_tpl(&mut self, q: &Tpl) -> Option<EvalResult> {
        self.run();

        let mut exprs = vec![];

        for expr in &q.exprs {
            let res = self.eval(expr)?;
            exprs.push(match res {
                EvalResult::Lit(v) => Box::new(Expr::Lit(v)),
                EvalResult::Undefined => undefined(DUMMY_SP),
            });
        }

        let mut e = Expr::Tpl(Tpl {
            span: q.span,
            exprs,
            quasis: q.quasis.clone(),
        });

        {
            e.visit_mut_with(&mut pure_optimizer(
                &serde_json::from_str("{}").unwrap(),
                None,
                self.marks,
                PureOptimizerConfig {
                    enable_join_vars: false,
                    force_str_for_tpl: Eval::force_str_for_tpl(),
                    debug_infinite_loop: false,
                },
            ));
        }

        Some(EvalResult::Lit(e.lit()?))
    }
}

fn is_truthy(lit: &EvalResult) -> Option<bool> {
    match lit {
        EvalResult::Lit(v) => match v {
            Lit::Str(v) => Some(v.value != js_word!("")),
            Lit::Bool(v) => Some(v.value),
            Lit::Null(_) => Some(false),
            Lit::Num(v) => Some(v.value != 0.0 && v.value != -0.0),
            _ => None,
        },
        EvalResult::Undefined => Some(false),
    }
}
