use ast::Module;
use swc_common::Fold;

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-self`
///
/// Add a __self prop to all JSX Elements
pub fn jsx_self(dev: bool) -> impl Fold<Module> {
    JsxSelf { dev }
}

struct JsxSelf {
    dev: bool,
}
