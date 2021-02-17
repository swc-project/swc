use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

pub(super) fn is_static<T>(node: &T) -> bool
where
    T: VisitWith<StaticVisitor>,
{
    let mut v = StaticVisitor::default();
    node.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    !v.dynamic
}

#[derive(Default)]
pub(super) struct StaticVisitor {
    dynamic: bool,
}

impl Visit for StaticVisitor {
    noop_visit_type!();

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);
        if e.computed {
            e.prop.visit_with(e, self);
        }
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Lit(..) | Expr::JSXElement(..) | Expr::JSXFragment(..) | Expr::Array(..) => {
                return
            }
            _ => {
                self.dynamic = true;
            }
        }
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if i.sym == js_word!("this") {
            self.dynamic = true;
        }
    }
}

/// We want to use React.createElement, even in the case of
/// jsx, for <div {...props} key={key} /> to distinguish it
/// from <div key={key} {...props} />. This is an intermediary
/// step while we deprecate key spread from props. Afterwards,
/// we will stop using createElement in the transform.
pub(super) fn should_use_create_element(attrs: &[JSXAttrOrSpread]) -> bool {
    let mut seen_prop_spread = false;
    for attr in attrs {
        if seen_prop_spread
            && match attr {
                JSXAttrOrSpread::JSXAttr(attr) => match &attr.name {
                    JSXAttrName::Ident(i) => i.sym == js_word!("key"),
                    JSXAttrName::JSXNamespacedName(_) => false,
                },
                _ => false,
            }
        {
            return true;
        }

        match attr {
            JSXAttrOrSpread::SpreadElement(_) => {
                seen_prop_spread = true;
            }
            _ => {}
        }
    }

    false
}
