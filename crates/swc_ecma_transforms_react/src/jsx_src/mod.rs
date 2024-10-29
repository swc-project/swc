use swc_common::{sync::Lrc, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::quote_ident;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-source`
pub fn jsx_src(dev: bool, cm: Lrc<SourceMap>) -> impl Pass {
    visit_mut_pass(JsxSrc { cm, dev })
}

#[derive(Clone)]
struct JsxSrc {
    cm: Lrc<SourceMap>,
    dev: bool,
}

impl Parallel for JsxSrc {
    fn create(&self) -> Self {
        self.clone()
    }

    fn merge(&mut self, _: Self) {}
}

impl VisitMut for JsxSrc {
    noop_visit_mut_type!();

    fn visit_mut_jsx_opening_element(&mut self, e: &mut JSXOpeningElement) {
        if !self.dev || e.span == DUMMY_SP {
            return;
        }

        e.visit_mut_children_with(self);

        let loc = self.cm.lookup_char_pos(e.span.lo);
        let file_name = loc.file.name.to_string();

        e.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(quote_ident!("__source")),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(
                    ObjectLit {
                        span: DUMMY_SP,
                        props: vec![
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("fileName")),
                                value: Box::new(Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    raw: None,
                                    value: file_name.into(),
                                }))),
                            }))),
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("lineNumber")),
                                value: loc.line.into(),
                            }))),
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("columnNumber")),
                                value: (loc.col.0 + 1).into(),
                            }))),
                        ],
                    }
                    .into(),
                )),
            })),
        }));
    }
}
