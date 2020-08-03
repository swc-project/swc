use crate::util::{drop_span, ExprFactory, HANDLER};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{iter, mem};
use swc_atoms::{js_word, JsWord};
use swc_common::{iter::IdentifyLast, sync::Lrc, FileName, SourceMap, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_visit::{Fold, FoldWith};

#[cfg(test)]
mod tests;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Options {
    #[serde(default = "default_pragma")]
    pub pragma: String,
    #[serde(default = "default_pragma_frag")]
    pub pragma_frag: String,

    #[serde(default = "default_throw_if_namespace")]
    pub throw_if_namespace: bool,

    #[serde(default)]
    pub development: bool,

    #[serde(default)]
    pub use_builtins: bool,
}

impl Default for Options {
    fn default() -> Self {
        Options {
            pragma: default_pragma(),
            pragma_frag: default_pragma_frag(),
            throw_if_namespace: default_throw_if_namespace(),
            development: false,
            use_builtins: false,
        }
    }
}

fn default_pragma() -> String {
    "React.createElement".into()
}

fn default_pragma_frag() -> String {
    "React.Fragment".into()
}

fn default_throw_if_namespace() -> bool {
    true
}

fn parse_option(cm: &SourceMap, name: &str, src: String) -> Box<Expr> {
    static CACHE: Lazy<DashMap<String, Box<Expr>>> = Lazy::new(|| DashMap::with_capacity(2));

    let fm = cm.new_source_file(FileName::Custom(format!("<jsx-config-{}.js>", name)), src);
    if let Some(expr) = CACHE.get(&**fm.src) {
        return expr.clone();
    }

    let expr = Parser::new(Syntax::default(), StringInput::from(&*fm), None)
        .parse_expr()
        .map_err(|e| {
            if HANDLER.is_set() {
                HANDLER.with(|h| e.into_diagnostic(h).emit())
            }
        })
        .map(drop_span)
        .unwrap_or_else(|()| {
            panic!(
                "faield to parse jsx option {}: '{}' is not an expression",
                name, fm.src,
            )
        });

    CACHE.insert((*fm.src).clone(), expr.clone());

    expr
}

/// `@babel/plugin-transform-react-jsx`
///
/// Turn JSX into React function calls
pub fn jsx(cm: Lrc<SourceMap>, options: Options) -> impl Fold {
    Jsx {
        pragma: ExprOrSuper::Expr(parse_option(&cm, "pragma", options.pragma)),
        pragma_frag: ExprOrSpread {
            spread: None,
            expr: parse_option(&cm, "pragmaFrag", options.pragma_frag),
        },
        use_builtins: options.use_builtins,
        throw_if_namespace: options.throw_if_namespace,
    }
}

struct Jsx {
    pragma: ExprOrSuper,
    pragma_frag: ExprOrSpread,
    use_builtins: bool,
    throw_if_namespace: bool,
}

noop_fold_type!(Jsx);

impl Jsx {
    fn jsx_frag_to_expr(&mut self, el: JSXFragment) -> Expr {
        let span = el.span();

        Expr::Call(CallExpr {
            span,
            callee: self.pragma.clone(),
            args: iter::once(self.pragma_frag.clone())
                // attribute: null
                .chain(iter::once(Lit::Null(Null { span: DUMMY_SP }).as_arg()))
                .chain({
                    // Children
                    el.children
                        .into_iter()
                        .filter_map(|c| self.jsx_elem_child_to_expr(c))
                })
                .collect(),
            type_args: None,
        })
    }

    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let span = el.span();

        let name = self.jsx_name(el.opening.name);

        Expr::Call(CallExpr {
            span,
            callee: self.pragma.clone(),
            args: iter::once(name.as_arg())
                .chain(iter::once({
                    // Attributes
                    self.fold_attrs(el.opening.attrs).as_arg()
                }))
                .chain({
                    // Children
                    el.children
                        .into_iter()
                        .filter_map(|c| self.jsx_elem_child_to_expr(c))
                })
                .collect(),
            type_args: Default::default(),
        })
    }

    fn jsx_elem_child_to_expr(&mut self, c: JSXElementChild) -> Option<ExprOrSpread> {
        Some(match c {
            JSXElementChild::JSXText(text) => {
                // TODO(kdy1): Optimize
                let s = Str {
                    span: text.span,
                    has_escape: text.raw != text.value,
                    value: jsx_text_to_str(text.value),
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
            JSXElementChild::JSXSpreadChild(JSXSpreadChild { .. }) => {
                unimplemented!("jsx sperad child")
            }
        })
    }

    fn fold_attrs(&mut self, attrs: Vec<JSXAttrOrSpread>) -> Box<Expr> {
        if attrs.is_empty() {
            return Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP })));
        }

        let is_complex = attrs.iter().any(|a| match *a {
            JSXAttrOrSpread::SpreadElement(..) => true,
            _ => false,
        });

        if is_complex {
            let mut args = vec![];
            let mut cur_obj_props = vec![];
            macro_rules! check {
                () => {{
                    if args.is_empty() || !cur_obj_props.is_empty() {
                        args.push(
                            ObjectLit {
                                span: DUMMY_SP,
                                props: mem::replace(&mut cur_obj_props, vec![]),
                            }
                            .as_arg(),
                        )
                    }
                }};
            }
            for attr in attrs {
                match attr {
                    JSXAttrOrSpread::JSXAttr(a) => {
                        cur_obj_props.push(PropOrSpread::Prop(Box::new(attr_to_prop(a))))
                    }
                    JSXAttrOrSpread::SpreadElement(e) => {
                        check!();
                        args.push(e.expr.as_arg());
                    }
                }
            }
            check!();

            // calls `_extends` or `Object.assign`
            Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: {
                    if self.use_builtins {
                        member_expr!(DUMMY_SP, Object.assign).as_callee()
                    } else {
                        helper!(extends, "extends")
                    }
                },
                args,
                type_args: None,
            }))
        } else {
            Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: attrs
                    .into_iter()
                    .map(|a| match a {
                        JSXAttrOrSpread::JSXAttr(a) => a,
                        _ => unreachable!(),
                    })
                    .map(attr_to_prop)
                    .map(|v| v.fold_with(self))
                    .map(Box::new)
                    .map(PropOrSpread::Prop)
                    .collect(),
            }))
        }
    }
}

impl Fold for Jsx {
    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let mut expr = expr.fold_children_with(self);

        if let Expr::JSXElement(el) = expr {
            // <div></div> => React.createElement('div', null);
            return self.jsx_elem_to_expr(*el);
        }
        if let Expr::JSXFragment(frag) = expr {
            // <></> => React.createElement(React.Fragment, null);
            return self.jsx_frag_to_expr(frag);
        }

        if let Expr::Paren(ParenExpr {
            span,
            expr: inner_expr,
            ..
        }) = expr
        {
            if let Expr::JSXElement(el) = *inner_expr {
                return self.jsx_elem_to_expr(*el);
            }
            if let Expr::JSXFragment(frag) = *inner_expr {
                // <></> => React.createElement(React.Fragment, null);
                return self.jsx_frag_to_expr(frag);
            }
            expr = Expr::Paren(ParenExpr {
                span,
                expr: inner_expr,
            });
        }

        expr
    }
}

impl Jsx {
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

fn attr_to_prop(a: JSXAttr) -> Prop {
    let key = to_prop_name(a.name);
    let value = a
        .value
        .map(|v| match v {
            JSXAttrValue::JSXExprContainer(JSXExprContainer {
                expr: JSXExpr::Expr(e),
                ..
            }) => e,
            JSXAttrValue::JSXElement(e) => Box::new(Expr::JSXElement(e)),
            JSXAttrValue::JSXFragment(e) => Box::new(Expr::JSXFragment(e)),
            JSXAttrValue::Lit(lit) => Box::new(lit.into()),
            JSXAttrValue::JSXExprContainer(JSXExprContainer {
                span: _,
                expr: JSXExpr::JSXEmptyExpr(_),
            }) => unreachable!("attr_to_prop(JSXEmptyExpr)"),
        })
        .unwrap_or_else(|| {
            Box::new(Expr::Lit(Lit::Bool(Bool {
                span: key.span(),
                value: true,
            })))
        });
    Prop::KeyValue(KeyValueProp { key, value })
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
