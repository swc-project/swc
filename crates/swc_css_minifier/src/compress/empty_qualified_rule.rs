use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_empty_qualified_rule() -> impl VisitMut {
    CompressEmptyQualifiedRule {}
}

struct CompressEmptyQualifiedRule {}

impl VisitMut for CompressEmptyQualifiedRule {
    fn visit_mut_stylesheet(&mut self, stylesheet: &mut Stylesheet) {
        stylesheet.visit_mut_children_with(self);

        stylesheet.rules.retain(|rule| {
            if let Rule::QualifiedRule(QualifiedRule { block, .. }) = rule {
                if block.value.is_empty() {
                    return false;
                }
            }

            true
        });
    }
}
