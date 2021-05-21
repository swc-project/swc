use crate::compress::optimize::Optimizer;
use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::prop_name_eq;

impl Optimizer<'_> {
    /// Converts `{ a: 1 }.a` into `1`.
    pub(super) fn handle_property_access(&mut self, e: &mut Expr) {
        if !self.options.props {
            return;
        }

        let me = match e {
            Expr::Member(m) => m,
            _ => return,
        };
        if me.computed {
            return;
        }

        let key = match &*me.prop {
            Expr::Ident(prop) => prop,
            _ => return,
        };

        let obj = match &mut me.obj {
            ExprOrSuper::Expr(e) => &mut **e,
            _ => return,
        };

        let obj = match obj {
            Expr::Object(o) => o,
            _ => return,
        };

        for prop in &obj.props {
            match prop {
                PropOrSpread::Spread(_) => {}
                PropOrSpread::Prop(p) => match &**p {
                    Prop::Shorthand(_) => {}
                    Prop::KeyValue(p) => {
                        if prop_name_eq(&p.key, &key.sym) {
                            match &*p.value {
                                Expr::Lit(..) => {}
                                _ => return,
                            }
                            self.changed = true;
                            *e = *p.value.clone();
                            return;
                        }
                    }
                    Prop::Assign(_) => {}
                    Prop::Getter(_) => {}
                    Prop::Setter(_) => {}
                    Prop::Method(_) => {}
                },
            }
        }
    }

    pub(super) fn handle_known_computed_member_expr(&mut self, e: &mut MemberExpr) {
        if !self.options.props || !self.options.evaluate {
            return;
        }

        if !e.computed {
            return;
        }

        match &*e.prop {
            Expr::Lit(Lit::Str(s)) => {
                if s.value == js_word!("") || s.value.starts_with(|c: char| c.is_digit(10)) {
                    return;
                }

                self.changed = true;

                e.computed = false;
                e.prop = Box::new(Expr::Ident(Ident::new(
                    s.value.clone(),
                    s.span.with_ctxt(SyntaxContext::empty()),
                )));
            }
            _ => {}
        }
    }
}
