#![allow(clippy::redundant_allocation)]

use std::{borrow::Cow, iter::once};

use swc_atoms::Atom;
use swc_common::{
    errors::HANDLER, iter::IdentifyLast, source_map::PURE_SP, util::take::Take, Mark, Spanned,
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmt, private_ident, quote_ident, ExprFactory, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::{jsx::should_use_create_element, AutomaticConfig};

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
pub fn automatic(options: AutomaticConfig, unresolved_mark: Mark) -> impl Pass + VisitMut {
    visit_mut_pass(Automatic {
        unresolved_mark,
        import_source: options.import_source,
        import_jsx: None,
        import_jsxs: None,
        import_fragment: None,
        import_create_element: None,

        development: options.common.development,
        throw_if_namespace: options.common.throw_if_namespace.into_bool(),
    })
}

struct Automatic {
    unresolved_mark: Mark,

    import_source: Atom,
    import_jsx: Option<Ident>,
    import_jsxs: Option<Ident>,
    import_create_element: Option<Ident>,
    import_fragment: Option<Ident>,

    development: bool,
    throw_if_namespace: bool,
}

impl Automatic {
    fn inject_runtime<T, F>(&mut self, body: &mut Vec<T>, inject: F)
    where
        T: StmtLike,
        // Fn(Vec<(local, imported)>, src, body)
        F: Fn(Vec<(Ident, IdentName)>, &str, &mut Vec<T>),
    {
        if let Some(local) = self.import_create_element.take() {
            inject(
                vec![(local, quote_ident!("createElement"))],
                &self.import_source,
                body,
            );
        }

        let imports = self.import_jsx.take();
        let imports = if self.development {
            imports
                .map(|local| (local, quote_ident!("jsxDEV")))
                .into_iter()
                .chain(
                    self.import_fragment
                        .take()
                        .map(|local| (local, quote_ident!("Fragment"))),
                )
                .collect::<Vec<_>>()
        } else {
            imports
                .map(|local| (local, quote_ident!("jsx")))
                .into_iter()
                .chain(
                    self.import_jsxs
                        .take()
                        .map(|local| (local, quote_ident!("jsxs"))),
                )
                .chain(
                    self.import_fragment
                        .take()
                        .map(|local| (local, quote_ident!("Fragment"))),
                )
                .collect::<Vec<_>>()
        };

        if !imports.is_empty() {
            let jsx_runtime = if self.development {
                "jsx-dev-runtime"
            } else {
                "jsx-runtime"
            };

            let value = format!("{}/{}", self.import_source, jsx_runtime);
            inject(imports, &value, body)
        }
    }

    fn jsx_frag_to_expr(&mut self, el: JSXFragment) -> Expr {
        let span = el.span();

        let count = count_children(&el.children);
        let use_jsxs = count > 1
            || (count == 1 && matches!(&el.children[0], JSXElementChild::JSXSpreadChild(..)));

        let mut jsx = if use_jsxs && !self.development {
            self.import_jsxs
                .get_or_insert_with(|| private_ident!("_jsxs"))
                .clone()
        } else {
            let jsx = if self.development { "_jsxDEV" } else { "_jsx" };
            self.import_jsx
                .get_or_insert_with(|| private_ident!(jsx))
                .clone()
        };

        jsx.span = PURE_SP;

        let fragment = self
            .import_fragment
            .get_or_insert_with(|| private_ident!("_Fragment"))
            .clone();

        let mut props_obj = ObjectLit {
            span: DUMMY_SP,
            props: Vec::new(),
        };

        let children = el
            .children
            .into_iter()
            .filter_map(|child| self.jsx_elem_child_to_expr(child))
            .map(Some)
            .collect::<Vec<_>>();

        match (children.len(), use_jsxs) {
            (0, _) => {}
            (1, false) => {
                props_obj
                    .props
                    .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(quote_ident!("children")),
                        value: children.into_iter().next().flatten().unwrap().expr,
                    }))));
            }
            _ => {
                props_obj
                    .props
                    .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(quote_ident!("children")),
                        value: ArrayLit {
                            span: DUMMY_SP,
                            elems: children,
                        }
                        .into(),
                    }))));
            }
        }

        let args = once(fragment.as_arg()).chain(once(props_obj.as_arg()));

        let args = if self.development {
            args.chain(once(Expr::undefined(DUMMY_SP).as_arg()))
                .chain(once(use_jsxs.as_arg()))
                .collect()
        } else {
            args.collect()
        };

        CallExpr {
            span,
            callee: jsx.as_callee(),
            args,
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
        let use_create_element = should_use_create_element(&el.opening.attrs);

        let name = self.jsx_name(el.opening.name);

        let count = count_children(&el.children);
        let use_jsxs = count > 1
            || (count == 1 && matches!(&el.children[0], JSXElementChild::JSXSpreadChild(..)));

        let mut jsx = if use_create_element {
            self.import_create_element
                .get_or_insert_with(|| private_ident!("_createElement"))
                .clone()
        } else if use_jsxs && !self.development {
            self.import_jsxs
                .get_or_insert_with(|| private_ident!("_jsxs"))
                .clone()
        } else {
            let jsx = if self.development { "_jsxDEV" } else { "_jsx" };
            self.import_jsx
                .get_or_insert_with(|| private_ident!(jsx))
                .clone()
        };
        jsx.span = PURE_SP;

        let mut props_obj = ObjectLit {
            span: DUMMY_SP,
            props: Vec::new(),
        };

        let mut key = None;
        let mut source_props = None;
        let mut self_props = None;

        for attr in el.opening.attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(attr) => {
                    //
                    match attr.name {
                        JSXAttrName::Ident(i) => {
                            //
                            if !use_create_element && i.sym == "key" {
                                key = attr
                                    .value
                                    .and_then(jsx_attr_value_to_expr)
                                    .map(|expr| expr.as_arg());

                                if key.is_none() {
                                    HANDLER.with(|handler| {
                                        handler
                                            .struct_span_err(
                                                i.span,
                                                "The value of property 'key' should not be empty",
                                            )
                                            .emit();
                                    });
                                }
                                continue;
                            }

                            if !use_create_element && *i.sym == *"__source" && self.development {
                                if source_props.is_some() {
                                    panic!("Duplicate __source is found");
                                }
                                source_props = attr
                                    .value
                                    .and_then(jsx_attr_value_to_expr)
                                    .map(|expr| expr.as_arg());
                                assert_ne!(
                                    source_props, None,
                                    "value of property '__source' should not be empty"
                                );
                                continue;
                            }

                            if !use_create_element && *i.sym == *"__self" && self.development {
                                if self_props.is_some() {
                                    panic!("Duplicate __self is found");
                                }
                                self_props = attr
                                    .value
                                    .and_then(jsx_attr_value_to_expr)
                                    .map(|expr| expr.as_arg());
                                assert_ne!(
                                    self_props, None,
                                    "value of property '__self' should not be empty"
                                );
                                continue;
                            }

                            let value = match attr.value {
                                Some(v) => {
                                    jsx_attr_value_to_expr(v).expect("empty expression container?")
                                }
                                None => true.into(),
                            };

                            // TODO: Check if `i` is a valid identifier.
                            let key = if i.sym.contains('-') {
                                PropName::Str(Str {
                                    span: i.span,
                                    raw: None,
                                    value: i.sym,
                                })
                            } else {
                                PropName::Ident(i)
                            };
                            props_obj
                                .props
                                .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key,
                                    value,
                                }))));
                        }
                        JSXAttrName::JSXNamespacedName(JSXNamespacedName { ns, name, .. }) => {
                            if self.throw_if_namespace {
                                HANDLER.with(|handler| {
                                    handler
                                        .struct_span_err(
                                            span,
                                            "JSX Namespace is disabled by default because react \
                                             does not support it yet. You can specify \
                                             jsc.transform.react.throwIfNamespace to false to \
                                             override default behavior",
                                        )
                                        .emit()
                                });
                            }

                            let value = match attr.value {
                                Some(v) => {
                                    jsx_attr_value_to_expr(v).expect("empty expression container?")
                                }
                                None => true.into(),
                            };

                            let str_value = format!("{}:{}", ns.sym, name.sym);
                            let key = Str {
                                span,
                                raw: None,
                                value: str_value.into(),
                            };
                            let key = PropName::Str(key);

                            props_obj
                                .props
                                .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                    key,
                                    value,
                                }))));
                        }
                    }
                }
                JSXAttrOrSpread::SpreadElement(attr) => match *attr.expr {
                    Expr::Object(obj) => {
                        props_obj.props.extend(obj.props);
                    }
                    _ => {
                        props_obj.props.push(PropOrSpread::Spread(attr));
                    }
                },
            }
        }

        let mut children = el
            .children
            .into_iter()
            .filter_map(|child| self.jsx_elem_child_to_expr(child))
            .map(Some)
            .collect::<Vec<_>>();

        match children.len() {
            0 => {}
            1 if children[0].as_ref().unwrap().spread.is_none() => {
                if !use_create_element {
                    props_obj
                        .props
                        .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(quote_ident!("children")),
                            value: children.take().into_iter().next().flatten().unwrap().expr,
                        }))));
                }
            }
            _ => {
                props_obj
                    .props
                    .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: PropName::Ident(quote_ident!("children")),
                        value: ArrayLit {
                            span: DUMMY_SP,
                            elems: children.take(),
                        }
                        .into(),
                    }))));
            }
        }

        let args = once(name.as_arg()).chain(once(props_obj.as_arg()));
        let args = if use_create_element {
            args.chain(children.into_iter().flatten()).collect()
        } else if self.development {
            // set undefined literal to key if key is None
            let key = match key {
                Some(key) => key,
                None => Expr::undefined(DUMMY_SP).as_arg(),
            };

            // set undefined literal to __source if __source is None
            let source_props = match source_props {
                Some(source_props) => source_props,
                None => Expr::undefined(DUMMY_SP).as_arg(),
            };

            // set undefined literal to __self if __self is None
            let self_props = match self_props {
                Some(self_props) => self_props,
                None => Expr::undefined(DUMMY_SP).as_arg(),
            };
            args.chain(once(key))
                .chain(once(use_jsxs.as_arg()))
                .chain(once(source_props))
                .chain(once(self_props))
                .collect()
        } else {
            args.chain(key).collect()
        };
        CallExpr {
            span,
            callee: jsx.as_callee(),
            args,
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
}

impl VisitMut for Automatic {
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

    fn visit_mut_module(&mut self, module: &mut Module) {
        module.visit_mut_children_with(self);

        self.inject_runtime(&mut module.body, |imports, src, stmts| {
            let specifiers = imports
                .into_iter()
                .map(|(local, imported)| {
                    ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local,
                        imported: Some(ModuleExportName::Ident(imported.into())),
                        is_type_only: false,
                    })
                })
                .collect();

            prepend_stmt(
                stmts,
                ImportDecl {
                    span: DUMMY_SP,
                    specifiers,
                    src: Str {
                        span: DUMMY_SP,
                        raw: None,
                        value: src.into(),
                    }
                    .into(),
                    type_only: Default::default(),
                    with: Default::default(),
                    phase: Default::default(),
                }
                .into(),
            )
        });
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        script.visit_mut_children_with(self);

        let mark = self.unresolved_mark;
        self.inject_runtime(&mut script.body, |imports, src, stmts| {
            prepend_stmt(stmts, add_require(imports, src, mark))
        });
    }
}

// const { createElement } = require('react')
// const { jsx: jsx } = require('react/jsx-runtime')
fn add_require(imports: Vec<(Ident, IdentName)>, src: &str, unresolved_mark: Mark) -> Stmt {
    VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Const,
        declare: false,
        decls: vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Object(ObjectPat {
                span: DUMMY_SP,
                props: imports
                    .into_iter()
                    .map(|(local, imported)| {
                        if imported.sym != local.sym {
                            ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: PropName::Ident(imported),
                                value: Box::new(Pat::Ident(local.into())),
                            })
                        } else {
                            ObjectPatProp::Assign(AssignPatProp {
                                span: DUMMY_SP,
                                key: local.into(),
                                value: None,
                            })
                        }
                    })
                    .collect(),
                optional: false,
                type_ann: None,
            }),
            // require('react')
            init: Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Callee::Expr(Box::new(Expr::Ident(Ident {
                    ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
                    sym: "require".into(),
                    optional: false,
                    ..Default::default()
                }))),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: src.into(),
                        raw: None,
                    }))),
                }],
                ..Default::default()
            }))),
            definite: false,
        }],
        ..Default::default()
    }
    .into()
}

impl Automatic {
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

fn jsx_attr_value_to_expr(v: JSXAttrValue) -> Option<Box<Expr>> {
    Some(match v {
        JSXAttrValue::Lit(Lit::Str(s)) => {
            let value = transform_jsx_attr_str(&s.value);

            Lit::Str(Str {
                span: s.span,
                raw: None,
                value: value.into(),
            })
            .into()
        }
        JSXAttrValue::Lit(lit) => Box::new(lit.into()),
        JSXAttrValue::JSXExprContainer(e) => match e.expr {
            JSXExpr::JSXEmptyExpr(_) => None?,
            JSXExpr::Expr(e) => e,
        },
        JSXAttrValue::JSXElement(e) => e.into(),
        JSXAttrValue::JSXFragment(f) => f.into(),
    })
}

fn count_children(children: &[JSXElementChild]) -> usize {
    children
        .iter()
        .filter(|v| match v {
            JSXElementChild::JSXText(text) => {
                let text = jsx_text_to_str(text.value.clone());
                !text.is_empty()
            }
            JSXElementChild::JSXExprContainer(e) => match e.expr {
                JSXExpr::JSXEmptyExpr(_) => false,
                JSXExpr::Expr(_) => true,
            },
            JSXElementChild::JSXSpreadChild(_) => true,
            JSXElementChild::JSXElement(_) => true,
            JSXElementChild::JSXFragment(_) => true,
        })
        .count()
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
