use super::jsx::Runtime;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};
#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-self`
///
/// Add a __self prop to all JSX Elements
pub fn jsx_self(dev: bool, runtime: Option<Runtime>) -> impl Fold + VisitMut {
    let runtime = runtime.unwrap_or(Runtime::Classic);
    as_folder(JsxSelf { dev, runtime })
}

#[derive(Clone, Copy)]
struct JsxSelf {
    dev: bool,
    runtime: Runtime,
}

impl Parallel for JsxSelf {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
}

#[parallel]
impl VisitMut for JsxSelf {
    noop_visit_mut_type!();

    fn visit_mut_jsx_opening_element(&mut self, n: &mut JSXOpeningElement) {
        let is_automatic = match self.runtime {
            Runtime::Automatic => true,
            Runtime::Classic => false,
        };
        if !self.dev || is_automatic {
            return;
        }

        n.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(quote_ident!("__self")),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(ThisExpr { span: DUMMY_SP }.into())),
            })),
        }));
    }
}
