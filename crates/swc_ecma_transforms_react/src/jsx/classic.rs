#![allow(clippy::redundant_allocation)]

use std::{
    borrow::Cow,
    iter::{self},
    sync::RwLock,
};

use bytes_str::BytesStr;
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{
    errors::HANDLER, iter::IdentifyLast, source_map::PURE_SP, sync::Lrc, util::take::Take,
    FileName, Mark, SourceMap, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_expr, Syntax};
use swc_ecma_utils::{drop_span, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::ClassicConfig;

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
/// Turn JSX into React function calls
///
///
/// `top_level_mark` should be [Mark] passed to
/// [swc_ecma_transforms_base::resolver::resolver_with_mark].
///
///
/// # Parameters
///
/// ## `top_level_ctxt`
///
/// This is used to reference `React` defined by the user.
///
/// e.g.
///
/// ```js
/// import React from 'react';
/// ```
pub fn classic(
    cm: Lrc<SourceMap>,
    options: ClassicConfig,
    pragma_mark: Mark,
) -> impl Pass + VisitMut {
    let mut pragma = parse_expr_for_jsx(&cm, "pragma", options.pragma, pragma_mark);

    pragma.set_span(PURE_SP);
    let pragma = Lrc::new(pragma);

    let pragma_frag = parse_expr_for_jsx(&cm, "pragmaFrag", options.pragma_frag, pragma_mark);
    let pragma_frag = Lrc::new(pragma_frag);

    visit_mut_pass(Classic {
        pragma,

        pragma_frag,
        throw_if_namespace: options.common.throw_if_namespace.into_bool(),
    })
}

struct Classic {
    pragma: Lrc<Box<Expr>>,

    pragma_frag: Lrc<Box<Expr>>,
    throw_if_namespace: bool,
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
        let span = el.span();

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

    /// # Automatic
    ///
    /// <div></div> => jsx('div', null);
    ///
    /// # Classic
    ///
    /// <div></div> => React.createElement('div', null);
    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let span = el.span();

        let name = self.jsx_name(el.opening.name);

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

impl VisitMut for Classic {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
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

        expr.visit_mut_children_with(self);
    }
}

impl Classic {
    fn jsx_name(&self, name: JSXElementName) -> Box<Expr> {
        let span = name.span();
        match name {
            JSXElementName::Ident(i) => {
                if i.sym == "this" {
                    return ThisExpr { span }.into();
                }

                // If it starts with lowercase
                if i.as_ref().starts_with(|c: char| c.is_ascii_lowercase()) {
                    Lit::Str(Str {
                        span,
                        raw: None,
                        value: i.sym,
                    })
                    .into()
                } else {
                    i.into()
                }
            }
            JSXElementName::JSXNamespacedName(JSXNamespacedName {
                ref ns, ref name, ..
            }) => {
                if self.throw_if_namespace {
                    HANDLER.with(|handler| {
                        handler
                            .struct_span_err(
                                span,
                                "JSX Namespace is disabled by default because react does not \
                                 support it yet. You can specify \
                                 jsc.transform.react.throwIfNamespace to false to override \
                                 default behavior",
                            )
                            .emit()
                    });
                }

                let value = format!("{}:{}", ns.sym, name.sym);

                Lit::Str(Str {
                    span,
                    raw: None,
                    value: value.into(),
                })
                .into()
            }
            JSXElementName::JSXMemberExpr(JSXMemberExpr { obj, prop, .. }) => {
                fn convert_obj(obj: JSXObject) -> Box<Expr> {
                    let span = obj.span();

                    (match obj {
                        JSXObject::Ident(i) => {
                            if i.sym == "this" {
                                Expr::This(ThisExpr { span })
                            } else {
                                i.into()
                            }
                        }
                        JSXObject::JSXMemberExpr(e) => MemberExpr {
                            span,
                            obj: convert_obj(e.obj),
                            prop: MemberProp::Ident(e.prop),
                        }
                        .into(),
                    })
                    .into()
                }
                MemberExpr {
                    span,
                    obj: convert_obj(obj),
                    prop: MemberProp::Ident(prop),
                }
                .into()
            }
        }
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

#[inline]
fn jsx_text_to_str(t: Atom) -> Atom {
    let mut buf = String::new();
    let replaced = t.replace('\t', " ");

    for (is_last, (i, line)) in replaced.lines().enumerate().identify_last() {
        if line.is_empty() {
            continue;
        }
        let line = Cow::from(line);
        let line = if i != 0 {
            Cow::Borrowed(line.trim_start_matches(' '))
        } else {
            line
        };
        let line = if is_last {
            line
        } else {
            Cow::Borrowed(line.trim_end_matches(' '))
        };
        if line.is_empty() {
            continue;
        }
        if i != 0 && !buf.is_empty() {
            buf.push(' ')
        }
        buf.push_str(&line);
    }
    buf.into()
}

fn transform_jsx_attr_str(v: &str) -> String {
    let single_quote = false;
    let mut buf = String::with_capacity(v.len());
    let mut iter = v.chars().peekable();

    while let Some(c) = iter.next() {
        match c {
            '\u{0008}' => buf.push_str("\\b"),
            '\u{000c}' => buf.push_str("\\f"),
            ' ' => buf.push(' '),

            '\n' | '\r' | '\t' => {
                buf.push(' ');

                while let Some(' ') = iter.peek() {
                    iter.next();
                }
            }
            '\u{000b}' => buf.push_str("\\v"),
            '\0' => buf.push_str("\\x00"),

            '\'' if single_quote => buf.push_str("\\'"),
            '"' if !single_quote => buf.push('\"'),

            '\x01'..='\x0f' | '\x10'..='\x1f' => {
                buf.push(c);
            }

            '\x20'..='\x7e' => {
                //
                buf.push(c);
            }
            '\u{7f}'..='\u{ff}' => {
                buf.push(c);
            }

            _ => {
                buf.push(c);
            }
        }
    }

    buf
}
