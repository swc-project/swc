use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_fold_type, Fold};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-self`
///
/// Add a __self prop to all JSX Elements
pub fn jsx_self(dev: bool) -> impl Fold {
    JsxSelf { dev }
}
struct JsxSelf {
    dev: bool,
}

impl Fold for JsxSelf {
    noop_fold_type!();

    fn fold_jsx_opening_element(&mut self, mut n: JSXOpeningElement) -> JSXOpeningElement {
        if !self.dev {
            return n;
        }

        n.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(quote_ident!("__self")),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(ThisExpr { span: DUMMY_SP }.into())),
            })),
        }));
        n
    }
}
