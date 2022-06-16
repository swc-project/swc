pub mod css_modules;

use swc_css_ast::Stylesheet;
use swc_css_visit::FoldWith;

use crate::css_modules::CssModuleComponent;

pub fn transform_with_css_modules(stylesheet: Stylesheet, filepath: &str) -> Stylesheet {
    let mut visitor = CssModuleComponent::new(filepath);
    stylesheet.fold_with(&mut visitor)
}
