use ast::*;
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

impl Fold<JSXOpeningElement> for JsxSelf {
    fn fold(&mut self, mut n: JSXOpeningElement) -> JSXOpeningElement {
        if !self.dev {
            return n;
        }

        n.attrs.push(Either::Left(JSXAttr {}));
        n
    }
}
