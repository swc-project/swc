pub mod css_modules;
mod sel;

use sel::SelVisitor;
use swc_css_ast::Stylesheet;
use swc_css_visit::{FoldWith, VisitMutWith};

use crate::css_modules::CssModuleComponent;

pub fn transform_with_css_modules(mut stylesheet: Stylesheet, filepath: &str) -> Stylesheet {
    stylesheet.visit_mut_with(&mut SelVisitor {});

    // let mut visitor = CssModuleComponent::new(filepath);
    // stylesheet.fold_with(&mut visitor)
    stylesheet
}
