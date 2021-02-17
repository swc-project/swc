use crate::{
    ext::MapWithMut,
    util::{drop_span, ExprFactory, HANDLER},
};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{iter, iter::once, mem};
use string_enum::StringEnum;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    comments::{CommentKind, Comments},
    iter::IdentifyLast,
    sync::Lrc,
    FileName, SourceMap, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_utils::prepend;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
    VisitWith,
};

impl<C> Jsx<C>
where
    C: Comments,
{
    fn jsx_name(&self, name: JSXElementName) -> Box<Expr> {
        let span = name.span();
        match name {
            JSXElementName::Ident(i) => {
                // If it starts with lowercase digit
                let c = i.sym.chars().next().unwrap();

                if i.sym == js_word!("this") {
                    return Box::new(Expr::This(ThisExpr { span }));
                }

                if c.is_ascii_lowercase() {
                    Box::new(Expr::Lit(Lit::Str(Str {
                        span,
                        value: i.sym,
                        has_escape: false,
                    })))
                } else {
                    Box::new(Expr::Ident(i))
                }
            }
            JSXElementName::JSXNamespacedName(JSXNamespacedName { ref ns, ref name }) => {
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
                Box::new(Expr::Lit(Lit::Str(Str {
                    span,
                    value: format!("{}:{}", ns.sym, name.sym).into(),
                    has_escape: false,
                })))
            }
            JSXElementName::JSXMemberExpr(JSXMemberExpr { obj, prop }) => {
                fn convert_obj(obj: JSXObject) -> ExprOrSuper {
                    let span = obj.span();

                    match obj {
                        JSXObject::Ident(i) => {
                            if i.sym == js_word!("this") {
                                return ExprOrSuper::Expr(Box::new(Expr::This(ThisExpr { span })));
                            }
                            i.as_obj()
                        }
                        JSXObject::JSXMemberExpr(e) => {
                            let e = *e;
                            MemberExpr {
                                span,
                                obj: convert_obj(e.obj),
                                prop: Box::new(Expr::Ident(e.prop)),
                                computed: false,
                            }
                            .as_obj()
                        }
                    }
                }
                Box::new(Expr::Member(MemberExpr {
                    span,
                    obj: convert_obj(obj),
                    prop: Box::new(Expr::Ident(prop)),
                    computed: false,
                }))
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
                    value: i.sym,
                    has_escape: false,
                })
            } else {
                PropName::Ident(i)
            }
        }
        JSXAttrName::JSXNamespacedName(JSXNamespacedName { ns, name }) => PropName::Str(Str {
            span,
            value: format!("{}:{}", ns.sym, name.sym).into(),
            has_escape: false,
        }),
    }
}

fn jsx_text_to_str(t: JsWord) -> JsWord {
    static SPACE_NL_START: Lazy<Regex> = Lazy::new(|| Regex::new("^\\s*\n\\s*").unwrap());
    static SPACE_NL_END: Lazy<Regex> = Lazy::new(|| Regex::new("\\s*\n\\s*$").unwrap());

    if t == *" " {
        return t;
    }
    if !t.contains(' ') && !t.contains('\n') {
        return t;
    }

    let s = SPACE_NL_START.replace_all(&t, "");
    let s = SPACE_NL_END.replace_all(&s, "");
    let need_leading_space = s.starts_with(' ');
    let need_trailing_space = s.ends_with(' ');

    let mut buf = String::from(if need_leading_space { " " } else { "" });

    for (last, s) in s.split_ascii_whitespace().identify_last() {
        buf.push_str(s);
        if !last {
            buf.push(' ');
        }
    }

    if need_trailing_space && !buf.ends_with(' ') {
        buf.push(' ');
    }

    buf.into()
}

fn jsx_attr_value_to_expr(v: JSXAttrValue) -> Option<Box<Expr>> {
    Some(match v {
        JSXAttrValue::Lit(lit) => Box::new(lit.into()),
        JSXAttrValue::JSXExprContainer(e) => match e.expr {
            JSXExpr::JSXEmptyExpr(_) => None?,
            JSXExpr::Expr(e) => e,
        },
        JSXAttrValue::JSXElement(e) => Box::new(Expr::JSXElement(e)),
        JSXAttrValue::JSXFragment(f) => Box::new(Expr::JSXFragment(f)),
    })
}

fn is_static<T>(node: &T) -> bool
where
    T: VisitWith<StaticVisitor>,
{
    let mut v = StaticVisitor::default();
    node.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    !v.dynamic
}

#[derive(Default)]
struct StaticVisitor {
    dynamic: bool,
}

impl Visit for StaticVisitor {
    noop_visit_type!();

    fn visit_member_expr(&mut self, e: &MemberExpr, _: &dyn Node) {
        e.obj.visit_with(e, self);
        if e.computed {
            e.prop.visit_with(e, self);
        }
    }

    fn visit_expr(&mut self, e: &Expr, _: &dyn Node) {
        e.visit_children_with(self);

        match e {
            Expr::Lit(..) | Expr::JSXElement(..) | Expr::JSXFragment(..) | Expr::Array(..) => {
                return
            }
            _ => {
                self.dynamic = true;
            }
        }
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        if i.sym == js_word!("this") {
            self.dynamic = true;
        }
    }
}

/// We want to use React.createElement, even in the case of
/// jsx, for <div {...props} key={key} /> to distinguish it
/// from <div key={key} {...props} />. This is an intermediary
/// step while we deprecate key spread from props. Afterwards,
/// we will stop using createElement in the transform.
fn should_use_create_element(attrs: &[JSXAttrOrSpread]) -> bool {
    let mut seen_prop_spread = false;
    for attr in attrs {
        if seen_prop_spread
            && match attr {
                JSXAttrOrSpread::JSXAttr(attr) => match &attr.name {
                    JSXAttrName::Ident(i) => i.sym == js_word!("key"),
                    JSXAttrName::JSXNamespacedName(_) => false,
                },
                _ => false,
            }
        {
            return true;
        }

        match attr {
            JSXAttrOrSpread::SpreadElement(_) => {
                seen_prop_spread = true;
            }
            _ => {}
        }
    }

    false
}
