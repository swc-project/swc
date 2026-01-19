//! JSX `__source` attribute transform.
//!
//! Adds `__source={{ fileName, lineNumber, columnNumber }}` attribute to JSX
//! elements in development mode. This helps React provide better error
//! messages.

use swc_common::{sync::Lrc, SourceMap, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

/// Creates a JSX source transform hook.
pub fn hook(dev: bool, cm: Lrc<SourceMap>) -> impl VisitMutHook<()> {
    JsxSrc { enabled: dev, cm }
}

struct JsxSrc {
    enabled: bool,
    cm: Lrc<SourceMap>,
}

impl VisitMutHook<()> for JsxSrc {
    fn enter_jsx_opening_element(&mut self, el: &mut JSXOpeningElement, _ctx: &mut ()) {
        if !self.enabled {
            return;
        }

        // Check if __source already exists
        let has_source = el.attrs.iter().any(|attr| {
            if let JSXAttrOrSpread::JSXAttr(attr) = attr {
                if let JSXAttrName::Ident(ident) = &attr.name {
                    return &*ident.sym == "__source";
                }
            }
            false
        });

        if has_source {
            return;
        }

        // Get source location
        let span = el.span();
        let loc = self.cm.lookup_char_pos(span.lo);

        let file_name = loc.file.name.to_string();
        let line_number = loc.line as u32;
        let column_number = loc.col_display as u32 + 1; // 1-based

        // Create __source={{ fileName: "...", lineNumber: N, columnNumber: N }}
        let source_obj = Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props: vec![
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName::new("fileName".into(), DUMMY_SP)),
                    value: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: file_name.into(),
                        raw: None,
                    }))),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName::new("lineNumber".into(), DUMMY_SP)),
                    value: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: line_number as f64,
                        raw: None,
                    }))),
                }))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName::new("columnNumber".into(), DUMMY_SP)),
                    value: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: column_number as f64,
                        raw: None,
                    }))),
                }))),
            ],
        });

        el.attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(IdentName::new("__source".into(), DUMMY_SP)),
            value: Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: DUMMY_SP,
                expr: JSXExpr::Expr(Box::new(source_obj)),
            })),
        }));
    }
}
