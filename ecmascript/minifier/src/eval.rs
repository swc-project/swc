use crate::mode::Mode;
use fxhash::FxHashMap;
use std::sync::{Arc, Mutex};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Id};

pub struct Evaluator {
    module: Module,
    data: Eval,
}

#[derive(Default)]
struct Eval {
    store: Arc<Mutex<EvalStore>>,
}

#[derive(Default)]
struct EvalStore {
    cache: FxHashMap<Id, Lit>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum EvalResult {
    Lit(Lit),
    Undefined,
}

impl Mode for Eval {
    fn store(&self, id: Id, value: &Lit) {
        let w = self.store.lock().unwrap();
        w.cache.insert(id, value.clone());
    }
}

impl Evaluator {
    pub fn eval(&mut self, e: &Expr) -> Option<EvalResult> {
        match e {
            Expr::Seq(s) => return self.eval(s.exprs.last()?),

            Expr::Lit(l @ Lit::Null(..))
            | Expr::Lit(l @ Lit::Num(..) | l @ Lit::Str(..) | l @ Lit::BigInt(..)) => {
                return Some(EvalResult::Lit(l.clone()))
            }

            Expr::Tpl(t) => {
                return self.eval_quasis(&t);
            }

            Expr::TaggedTpl(t) => {
                // Handle `String.raw`

                match &*t.tag {
                    Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(tag_obj),
                        prop,
                        computed: false,
                    }) if tag_obj.is_ident_ref_to("String".into())
                        && prop.is_ident_ref_to("raw".into()) =>
                    {
                        return self.eval_quasis(&t.tpl);
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
                span,
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed: false,
                ..
            }) if obj.is_lit() && prop.is_ident_ref_to("length".into()) => {}

            _ => {}
        }

        match e {
            Expr::Ident(i) => {}

            _ => {}
        }

        match e {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("void"),
                arg,
            }) => return Some(EvalResult::Undefined),

            _ => {}
        }

        None
    }

    fn eval_quasis(&mut self, q: &Tpl) -> Option<EvalResult> {}
}

fn is_truthy(lit: &EvalResult) -> Option<bool> {}
