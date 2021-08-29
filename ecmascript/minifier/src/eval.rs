use crate::{compress::compressor, marks::Marks, mode::Mode};
use fxhash::FxHashMap;
use std::sync::{Arc, Mutex};
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Id};
use swc_ecma_visit::FoldWith;

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
    cache: FxHashMap<Id, Lit>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum EvalResult {
    Lit(Lit),
    Undefined,
}

impl Mode for Eval {
    fn store(&self, id: Id, value: &Lit) {
        let mut w = self.store.lock().unwrap();
        w.cache.insert(id, value.clone());
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
                        &globals,
                        marks,
                        &serde_json::from_str("{}").unwrap(),
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
                return self.eval_quasis(&t);
            }

            Expr::TaggedTpl(t) => {
                // Handle `String.raw`

                match &*t.tag {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(tag_obj),
                        prop,
                        computed: false,
                        ..
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
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed: false,
                ..
            }) if obj.is_lit() && prop.is_ident_ref_to("length".into()) => {}

            _ => {}
        }

        match e {
            Expr::Ident(i) => {
                self.run();

                let lock = self.data.store.lock().ok()?;
                dbg!(&lock.cache);
                let val = lock.cache.get(&i.to_id())?;

                return Some(EvalResult::Lit(val.clone()));
            }

            _ => {}
        }

        match e {
            Expr::Unary(UnaryExpr {
                op: op!("void"), ..
            }) => return Some(EvalResult::Undefined),

            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => {
                let arg = self.eval(&arg)?;

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

        None
    }

    fn eval_quasis(&mut self, q: &Tpl) -> Option<EvalResult> {
        if q.exprs.is_empty() {}
        // TODO
        None
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
