use ast::Module;
use swc_common::Fold;

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-source`
pub fn jsx_src(dev: bool) -> impl Fold<Module> {
    JsxSrc { dev }
}

struct JsxSrc {
    dev: bool,
}
