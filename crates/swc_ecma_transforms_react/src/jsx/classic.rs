#![allow(clippy::redundant_allocation)]

use std::{
    iter::{self},
    sync::RwLock,
};

use bytes_str::BytesStr;
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
use swc_common::{
    comments::Comments, errors::HANDLER, sync::Lrc, util::take::Take, BytePos, FileName, Mark,
    SourceMap, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_expr, Syntax};
use swc_ecma_utils::{drop_span, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::{
    jsx::development::{visit_mut_development, DevelopmentContext, JsxDev},
    jsx_name, jsx_text_to_str, transform_jsx_attr_str, ClassicConfig, CommonConfig,
};

/// Parse `src` to use as a `pragma` or `pragmaFrag` in jsx.
pub fn parse_expr_for_jsx(
    cm: &SourceMap,
    name: &str,
    src: BytesStr,
    top_level_mark: Mark,
) -> Box<Expr> {
    let fm = cm.new_source_file(cache_filename(name), src);

    parse_file_as_expr(
        &fm,
        Syntax::default(),
        Default::default(),
        None,
        &mut Vec::new(),
    )
    .map_err(|e| {
        if HANDLER.is_set() {
            HANDLER.with(|h| {
                e.into_diagnostic(h)
                    .note("Failed to parse jsx pragma")
                    .emit()
            })
        }
    })
    .map(drop_span)
    .map(|mut expr| {
        apply_mark(&mut expr, top_level_mark);
        expr
    })
    .unwrap_or_else(|()| {
        panic!(
            "failed to parse jsx option {}: '{}' is not an expression",
            name, fm.src,
        )
    })
}

fn apply_mark(e: &mut Expr, mark: Mark) {
    match e {
        Expr::Ident(i) => {
            i.ctxt = i.ctxt.apply_mark(mark);
        }
        Expr::Member(MemberExpr { obj, .. }) => {
            apply_mark(obj, mark);
        }
        _ => {}
    }
}

/// `@babel/plugin-transform-react-jsx`
///
/// # Parameters
///
/// ## `pragma_mark`
///
/// This is used to reference `React` defined by the user.
///
/// e.g.
///
/// ```js
/// import React from 'react';
/// ```
pub fn classic<C>(
    options: ClassicConfig,
    common: CommonConfig,
    pragma_mark: Mark,
    comments: Option<C>,
    cm: Lrc<SourceMap>,
) -> impl Pass + VisitMut
where
    C: Comments + 'static,
{
    let add_pure_comment: Lrc<dyn Fn(BytePos)> = match comments {
        Some(c) => Lrc::new(move |pos: BytePos| {
            c.add_pure_comment(pos);
        }),
        None => Lrc::new(|_pos| {}),
    };

    let pragma = parse_expr_for_jsx(&cm, "pragma", options.pragma, pragma_mark);
    let pragma = Lrc::new(pragma);

    let pragma_frag = parse_expr_for_jsx(&cm, "pragmaFrag", options.pragma_frag, pragma_mark);
    let pragma_frag = Lrc::new(pragma_frag);

    visit_mut_pass(Classic {
        pragma,
        pragma_frag,

        throw_if_namespace: common.throw_if_namespace.into_bool(),

        development: common.development.into_bool(),
        development_ctx: DevelopmentContext::default(),

        add_pure_comment,
        cm,
    })
}

struct Classic {
    pragma: Lrc<Box<Expr>>,
    pragma_frag: Lrc<Box<Expr>>,

    throw_if_namespace: bool,

    development: bool,
    development_ctx: DevelopmentContext,

    add_pure_comment: Lrc<dyn Fn(BytePos)>,
    cm: Lrc<SourceMap>,
}

#[cfg(feature = "concurrent")]
fn cache_filename(name: &str) -> Lrc<FileName> {
    static FILENAME_CACHE: Lazy<RwLock<FxHashMap<String, Lrc<FileName>>>> =
        Lazy::new(|| RwLock::new(FxHashMap::default()));

    {
        let cache = FILENAME_CACHE
            .read()
            .expect("Failed to read FILENAME_CACHE");
        if let Some(f) = cache.get(name) {
            return f.clone();
        }
    }

    let file = Lrc::new(FileName::Internal(format!("jsx-config-{name}.js")));

    {
        let mut cache = FILENAME_CACHE
            .write()
            .expect("Failed to write FILENAME_CACHE");
        cache.insert(name.to_string(), file.clone());
    }

    file
}

#[cfg(not(feature = "concurrent"))]
fn cache_filename(name: &str) -> Lrc<FileName> {
    Lrc::new(FileName::Internal(format!("jsx-config-{name}.js")))
}

impl Classic {
    fn jsx_frag_to_expr(&mut self, el: JSXFragment) -> Expr {
        let mut span = el.span();

        if span.lo.is_dummy() {
            span.lo = swc_common::Span::dummy_with_cmt().lo;
        }
        (*self.add_pure_comment)(span.lo);

        CallExpr {
            span,
            callee: (*self.pragma).clone().as_callee(),
            args: iter::once((*self.pragma_frag).clone().as_arg())
                // attribute: null
                .chain(iter::once(Lit::Null(Null { span: DUMMY_SP }).as_arg()))
                .chain({
                    // Children
                    el.children
                        .into_iter()
                        .filter_map(|c| self.jsx_elem_child_to_expr(c))
                })
                .collect(),
            ..Default::default()
        }
        .into()
    }

    /// <div></div> => React.createElement('div', null);
    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let mut span = el.span();

        if span.lo.is_dummy() {
            span.lo = swc_common::Span::dummy_with_cmt().lo;
        }
        (*self.add_pure_comment)(span.lo);

        let name = jsx_name(el.opening.name, self.throw_if_namespace);

        CallExpr {
            span,
            callee: (*self.pragma).clone().as_callee(),
            args: iter::once(name.as_arg())
                .chain(iter::once({
                    // Attributes
                    self.fold_attrs_for_classic(el.opening.attrs).as_arg()
                }))
                .chain({
                    // Children
                    el.children
                        .into_iter()
                        .filter_map(|c| self.jsx_elem_child_to_expr(c))
                })
                .collect(),
            ..Default::default()
        }
        .into()
    }

    fn jsx_elem_child_to_expr(&mut self, c: JSXElementChild) -> Option<ExprOrSpread> {
        Some(match c {
            JSXElementChild::JSXText(text) => {
                // TODO(kdy1): Optimize
                let value = jsx_text_to_str(text.value);
                let s = Str {
                    span: text.span,
                    raw: None,
                    value,
                };

                if s.value.is_empty() {
                    return None;
                }

                Lit::Str(s).as_arg()
            }
            JSXElementChild::JSXExprContainer(JSXExprContainer {
                expr: JSXExpr::Expr(e),
                ..
            }) => e.as_arg(),
            JSXElementChild::JSXExprContainer(JSXExprContainer {
                expr: JSXExpr::JSXEmptyExpr(..),
                ..
            }) => return None,
            JSXElementChild::JSXElement(el) => self.jsx_elem_to_expr(*el).as_arg(),
            JSXElementChild::JSXFragment(el) => self.jsx_frag_to_expr(el).as_arg(),
            JSXElementChild::JSXSpreadChild(JSXSpreadChild { span, expr, .. }) => ExprOrSpread {
                spread: Some(span),
                expr,
            },
        })
    }

    fn fold_attrs_for_classic(&mut self, attrs: Vec<JSXAttrOrSpread>) -> Box<Expr> {
        if attrs.is_empty() {
            return Lit::Null(Null { span: DUMMY_SP }).into();
        }
        let attr_cnt = attrs.len();

        let mut props = Vec::new();
        for attr in attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(attr) => {
                    props.push(PropOrSpread::Prop(Box::new(self.attr_to_prop(attr))))
                }
                JSXAttrOrSpread::SpreadElement(spread) => {
                    if attr_cnt == 1 {
                        return spread.expr;
                    }
                    // babel does some optimizations
                    match *spread.expr {
                        Expr::Object(obj) => props.extend(obj.props),
                        _ => props.push(PropOrSpread::Spread(spread)),
                    }
                }
            }
        }

        let obj = ObjectLit {
            span: DUMMY_SP,
            props,
        };

        obj.into()
    }

    fn attr_to_prop(&mut self, a: JSXAttr) -> Prop {
        let key = to_prop_name(a.name);
        let value = a
            .value
            .map(|v| match v {
                JSXAttrValue::Lit(Lit::Str(s)) => {
                    let value = transform_jsx_attr_str(&s.value);

                    Lit::Str(Str {
                        span: s.span,
                        raw: None,
                        value: value.into(),
                    })
                    .into()
                }
                JSXAttrValue::JSXExprContainer(JSXExprContainer {
                    expr: JSXExpr::Expr(e),
                    ..
                }) => e,
                JSXAttrValue::JSXElement(element) => Box::new(self.jsx_elem_to_expr(*element)),
                JSXAttrValue::JSXFragment(fragment) => Box::new(self.jsx_frag_to_expr(fragment)),
                JSXAttrValue::Lit(lit) => Box::new(lit.into()),
                JSXAttrValue::JSXExprContainer(JSXExprContainer {
                    span: _,
                    expr: JSXExpr::JSXEmptyExpr(_),
                }) => unreachable!("attr_to_prop(JSXEmptyExpr)"),
            })
            .unwrap_or_else(|| {
                Lit::Bool(Bool {
                    span: key.span(),
                    value: true,
                })
                .into()
            });
        Prop::KeyValue(KeyValueProp { key, value })
    }
}

impl JsxDev for Classic {
    fn development_ctxt(&mut self) -> &mut DevelopmentContext {
        &mut self.development_ctx
    }
}

impl VisitMut for Classic {
    noop_visit_mut_type!();

    visit_mut_development!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::JSXElement(el) = expr {
            // <div></div> => React.createElement('div', null);
            *expr = self.jsx_elem_to_expr(*el.take());
        } else if let Expr::JSXFragment(frag) = expr {
            // <></> => React.createElement(React.Fragment, null);

            *expr = self.jsx_frag_to_expr(frag.take());
        } else if let Expr::Paren(ParenExpr {
            expr: inner_expr, ..
        }) = expr
        {
            if let Expr::JSXElement(el) = &mut **inner_expr {
                *expr = self.jsx_elem_to_expr(*el.take());
            } else if let Expr::JSXFragment(frag) = &mut **inner_expr {
                // <></> => React.createElement(React.Fragment, null);

                *expr = self.jsx_frag_to_expr(frag.take());
            }
        }
    }

    fn visit_mut_jsx_opening_element(&mut self, e: &mut JSXOpeningElement) {
        e.visit_mut_children_with(self);

        if !self.development {
            return;
        }

        let loc = self.cm.lookup_char_pos(e.span.lo);
        let file_name = loc.file.name.to_string();

        e.attrs.push(
            JSXAttr {
                span: DUMMY_SP,
                name: quote_ident!("__source").into(),
                value: Some(
                    JSXExprContainer {
                        span: DUMMY_SP,
                        expr: JSXExpr::Expr(
                            ObjectLit {
                                span: DUMMY_SP,
                                props: vec![
                                    Prop::KeyValue(KeyValueProp {
                                        key: quote_ident!("fileName").into(),
                                        value: file_name.into(),
                                    })
                                    .into(),
                                    Prop::KeyValue(KeyValueProp {
                                        key: quote_ident!("lineNumber").into(),
                                        value: loc.line.into(),
                                    })
                                    .into(),
                                    Prop::KeyValue(KeyValueProp {
                                        key: quote_ident!("columnNumber").into(),
                                        value: (loc.col.0 + 1).into(),
                                    })
                                    .into(),
                                ],
                            }
                            .into(),
                        ),
                    }
                    .into(),
                ),
            }
            .into(),
        );

        e.attrs.push(
            JSXAttr {
                span: DUMMY_SP,
                name: quote_ident!("__self").into(),
                value: Some(
                    JSXExprContainer {
                        span: DUMMY_SP,
                        expr: JSXExpr::Expr(self.self_props().into()),
                    }
                    .into(),
                ),
            }
            .into(),
        );
    }
}

fn to_prop_name(n: JSXAttrName) -> PropName {
    let span = n.span();

    match n {
        JSXAttrName::Ident(i) => {
            if i.sym.contains('-') {
                PropName::Str(Str {
                    span,
                    raw: None,
                    value: i.sym,
                })
            } else {
                PropName::Ident(i)
            }
        }
        JSXAttrName::JSXNamespacedName(JSXNamespacedName { ns, name, .. }) => {
            let value = format!("{}:{}", ns.sym, name.sym);

            PropName::Str(Str {
                span,
                raw: None,
                value: value.into(),
            })
        }
    }
}
