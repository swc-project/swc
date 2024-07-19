use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Parallel};
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

use super::object_rest_spread::Config;

#[derive(Clone, Copy)]
pub(super) struct ObjectSpread {
    pub config: Config,
}

impl Parallel for ObjectSpread {
    fn create(&self) -> Self {
        ObjectSpread {
            config: self.config,
        }
    }

    fn merge(&mut self, _: Self) {}
}

#[swc_trace]
impl VisitMut for ObjectSpread {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Object(ObjectLit { span, props }) = expr {
            let has_spread = props.iter().any(|p| matches!(p, PropOrSpread::Spread(..)));
            if !has_spread {
                return;
            }

            let mut callee = if self.config.set_property {
                helper!(extends)
            } else {
                helper!(object_spread)
            };

            // { foo, ...x } => ({ foo }, x)
            let args = {
                let mut buf = Vec::new();
                let mut obj = ObjectLit {
                    span: DUMMY_SP,
                    props: Vec::new(),
                };
                let mut first = true;
                for prop in props.take() {
                    match prop {
                        PropOrSpread::Prop(..) => {
                            // before is spread element
                            if !first && obj.props.is_empty() && !self.config.pure_getters {
                                buf = vec![Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: callee.clone(),
                                    args: buf.take(),
                                    ..Default::default()
                                })
                                .as_arg()];
                            }
                            obj.props.push(prop)
                        }
                        PropOrSpread::Spread(SpreadElement { expr, .. }) => {
                            // Push object if it's not empty
                            if first || !obj.props.is_empty() {
                                buf.push(obj.take().as_arg());
                                if !first && !self.config.pure_getters {
                                    buf = vec![Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(object_spread_props),
                                        args: buf.take(),
                                        ..Default::default()
                                    })
                                    .as_arg()];
                                }
                                first = false;
                            }

                            buf.push(expr.as_arg());
                        }
                    }
                }

                if !obj.props.is_empty() {
                    if !self.config.pure_getters {
                        callee = helper!(object_spread_props);
                    }
                    buf.push(obj.as_arg());
                }

                buf
            };

            *expr = CallExpr {
                span: *span,
                callee,
                args,
                ..Default::default()
            }
            .into();
        }
    }
}
