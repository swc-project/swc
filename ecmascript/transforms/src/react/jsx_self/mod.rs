use crate::pass::Pass;
use ast::*;
use swc_common::{Fold, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-self`
///
/// Add a __self prop to all JSX Elements
pub fn jsx_self(dev: bool) -> impl Pass + Clone + Copy {
    JsxSelf { dev }
}
#[derive(Clone, Copy)]
struct JsxSelf {
    dev: bool,
}
pass_clone!(JsxSelf);

impl Fold<JSXOpeningElement> for JsxSelf {
    fn fold(&mut self, mut n: JSXOpeningElement) -> JSXOpeningElement {
        if !self.dev {
            return n;
        }

        n.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(quote_ident!("__self")),
            value: Some(box ThisExpr { span: DUMMY_SP }.into()),
        }));
        n
    }
}
