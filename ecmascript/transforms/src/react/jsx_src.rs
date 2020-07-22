use std::sync::Arc;
use swc_common::{FileName, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::Fold;

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-react-jsx-source`
pub fn jsx_src(dev: bool, cm: Arc<SourceMap>) -> impl Fold {
    JsxSrc { cm, dev }
}

struct JsxSrc {
    cm: Arc<SourceMap>,
    dev: bool,
}

noop_fold_type!(JsxSrc);

impl Fold for JsxSrc {
    fn fold_jsx_opening_element(&mut self, mut e: JSXOpeningElement) -> JSXOpeningElement {
        if !self.dev || e.span == DUMMY_SP {
            return e;
        }

        let file_lines = match self.cm.span_to_lines(e.span) {
            Ok(v) => v,
            _ => return e,
        };

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
                                    value: match file_lines.file.name {
                                        FileName::Real(ref p) => p.display().to_string().into(),
                                        _ => unimplemented!("file name for other than real files"),
                                    },
                                    has_escape: false,
                                }))),
                            }))),
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(quote_ident!("lineNumber")),
                                value: Box::new(Expr::Lit(Lit::Num(Number {
                                    span: DUMMY_SP,
                                    value: (file_lines.lines[0].line_index + 1) as _,
                                }))),
                            }))),
                        ],
                    }
                    .into(),
                )),
            })),
        }));

        e
    }
}
