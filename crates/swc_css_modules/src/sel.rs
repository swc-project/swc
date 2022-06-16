use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub struct SelVisitor {}

impl VisitMut for SelVisitor {
    fn visit_mut_rule(&mut self, rule: &mut Rule) {
        rule.visit_mut_children_with(self);

        dbg!(&*rule);
    }
}
