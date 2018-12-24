use crate::{compat::helpers::Helpers, util::ExprFactory};
use ast::*;
use std::{
    mem,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Visit, VisitWith, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn object_rest_spread(helpers: Arc<Helpers>) -> impl Fold<Module> {
    chain!(
        ObjectRest {
            helpers: helpers.clone(),
        },
        ObjectSpread { helpers }
    )
}

struct ObjectRest {
    helpers: Arc<Helpers>,
}

struct RestVisitor {
    found: bool,
}

impl Visit<RestPat> for RestVisitor {
    fn visit(&mut self, _: &RestPat) {
        self.found = true;
    }
}

fn contains_rest<N>(node: &N) -> bool
where
    N: VisitWith<RestVisitor>,
{
    let mut v = RestVisitor { found: false };
    node.visit_with(&mut v);
    v.found
}

struct ObjectSpread {
    helpers: Arc<Helpers>,
}

impl Fold<Expr> for ObjectSpread {
    fn fold(&mut self, expr: Expr) -> Expr {
        // fast-path
        if !contains_spread(&expr) {
            return expr;
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Object(ObjectLit { span, props }) => {
                let has_spread = props.iter().any(|p| match p {
                    PropOrSpread::Spread(..) => true,
                    _ => false,
                });
                if !has_spread {
                    return Expr::Object(ObjectLit { span, props });
                }

                let mut first = true;

                // { foo, ...x } => ({ foo }, x)
                let args = {
                    let mut buf = vec![];
                    let mut obj = ObjectLit {
                        span: DUMMY_SP,
                        props: vec![],
                    };
                    for prop in props {
                        match prop {
                            PropOrSpread::Prop(..) => obj.props.push(prop),
                            PropOrSpread::Spread(SpreadElement {
                                dot3_token: _,
                                expr,
                            }) => {
                                // Push object if it's not empty
                                if first || !obj.props.is_empty() {
                                    let obj = mem::replace(
                                        &mut obj,
                                        ObjectLit {
                                            span: DUMMY_SP,
                                            props: vec![],
                                        },
                                    );
                                    buf.push(obj.as_arg());
                                    first = false;
                                }

                                buf.push(expr.as_arg());
                            }
                        }
                    }

                    if !obj.props.is_empty() {
                        buf.push(obj.as_arg());
                    }

                    buf
                };

                self.helpers.define_property.store(true, Ordering::Relaxed);
                self.helpers.object_spread.store(true, Ordering::Relaxed);
                Expr::Call(CallExpr {
                    span,
                    callee: quote_ident!("_objectSpread").as_callee(),
                    args,
                })
            }
            _ => expr,
        }
    }
}

fn contains_spread(expr: &Expr) -> bool {
    struct Visitor {
        found: bool,
    }

    impl Visit<SpreadElement> for Visitor {
        fn visit(&mut self, _: &SpreadElement) {
            self.found = true;
        }
    }

    let mut v = Visitor { found: false };
    expr.visit_with(&mut v);
    v.found
}
