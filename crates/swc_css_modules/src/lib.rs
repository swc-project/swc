pub mod css_modules;
pub mod hash;

use swc_css_ast::Stylesheet;
use swc_css_visit::FoldWith;

use crate::css_modules::CssModuleComponent;

pub fn transform_with_css_modules(
    stylesheet: Stylesheet,
    filepath: &str,
    content: &str,
) -> Stylesheet {
    let mut visitor = CssModuleComponent::new(filepath, content);
    stylesheet.fold_with(&mut visitor)
}
