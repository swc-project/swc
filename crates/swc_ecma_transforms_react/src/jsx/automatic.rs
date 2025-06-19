#![allow(clippy::redundant_allocation)]

use std::iter::once;

use swc_atoms::{atom, Atom};
use swc_common::{
    comments::Comments, errors::HANDLER, sync::Lrc, util::take::Take, BytePos, Mark, SourceMap,
    Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmt, private_ident, quote_ident, ExprFactory, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::{
    jsx::{should_use_create_element, DevelopmentContext, JsxDev},
    jsx_name, jsx_text_to_str, transform_jsx_attr_str, visit_mut_development, AutomaticConfig,
    CommonConfig,
};

/// Automatic runtime JSX transformer
///
/// Transforms JSX using the automatic runtime where imports are injected
/// automatically and JSX elements are converted to jsx() and jsxs() calls.
///
/// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md
pub fn automatic<C>(
    options: AutomaticConfig,
    common: CommonConfig,
    unresolved_mark: Mark,
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

    visit_mut_pass(Automatic {
        unresolved_mark,
        import_source: options.import_source,
        import_jsx: None,
        import_jsxs: None,
        import_fragment: None,
        import_create_element: None,

        throw_if_namespace: common.throw_if_namespace.into_bool(),

        development: common.development.into_bool(),
        development_ctx: DevelopmentContext::default(),

        add_pure_comment,
        cm,
    })
}

struct Automatic {
    unresolved_mark: Mark,

    import_source: Atom,
    import_jsx: Option<Ident>,
    import_jsxs: Option<Ident>,
    import_create_element: Option<Ident>,
    import_fragment: Option<Ident>,

    throw_if_namespace: bool,

    development: bool,
    development_ctx: DevelopmentContext,

    add_pure_comment: Lrc<dyn Fn(BytePos)>,
    cm: Lrc<SourceMap>,
}

impl Automatic {
    fn inject_runtime<T, F>(&mut self, body: &mut Vec<T>, inject: F)
    where
        T: StmtLike,
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
        let mut span = el.span();

        if span.lo.is_dummy() {
            span.lo = swc_common::Span::dummy_with_cmt().lo;
        }
        (*self.add_pure_comment)(span.lo);

        let count = count_children(&el.children);
        let use_jsxs = count > 1
            || (count == 1 && matches!(&el.children[0], JSXElementChild::JSXSpreadChild(..)));

        let jsx = if use_jsxs && !self.development {
            self.import_jsxs
                .get_or_insert_with(|| private_ident!("_jsxs"))
                .clone()
        } else {
            let jsx = if self.development { "_jsxDEV" } else { "_jsx" };
            self.import_jsx
                .get_or_insert_with(|| private_ident!(jsx))
                .clone()
        };

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

    /// <div></div> => jsx('div', null);
    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let mut span = el.span();
        if span.lo.is_dummy() {
            span.lo = swc_common::Span::dummy_with_cmt().lo;
        }
        (*self.add_pure_comment)(span.lo);

        let use_create_element = should_use_create_element(&el.opening.attrs);

        let name = jsx_name(el.opening.name, self.throw_if_namespace);

        let count = count_children(&el.children);
        let use_jsxs = count > 1
            || (count == 1 && matches!(&el.children[0], JSXElementChild::JSXSpreadChild(..)));

        let jsx = if use_create_element {
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

        let mut props_obj = ObjectLit {
            span: DUMMY_SP,
            props: Vec::new(),
        };

        let mut key = None;

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

        if use_create_element && self.development {
            props_obj.props.push(
                Prop::KeyValue(KeyValueProp {
                    key: quote_ident!("__source").into(),
                    value: self.source_props(el.span.lo).into(),
                })
                .into(),
            );
            props_obj.props.push(
                Prop::KeyValue(KeyValueProp {
                    key: quote_ident!("__self").into(),
                    value: self.self_props().into(),
                })
                .into(),
            );
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

            args.chain(once(key))
                .chain(once(use_jsxs.as_arg()))
                .chain(once(self.source_props(el.span.lo).as_arg()))
                .chain(once(self.self_props().as_arg()))
                .collect()
        } else {
            args.chain(key).collect()
        };

        let mut call_expr = CallExpr {
            span,
            callee: jsx.as_callee(),
            args,
            ..Default::default()
        };

        // Add pure comment
        if call_expr.span.lo.is_dummy() {
            call_expr.span.lo = swc_common::Span::dummy_with_cmt().lo;
        }
        (*self.add_pure_comment)(call_expr.span.lo);

        call_expr.into()
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

impl Automatic {
    fn source_props(&self, pos: BytePos) -> ObjectLit {
        let loc = self.cm.lookup_char_pos(pos);

        ObjectLit {
            props: vec![
                Prop::KeyValue(KeyValueProp {
                    key: quote_ident!("fileName").into(),
                    value: loc.file.name.to_string().into(),
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
            ..Default::default()
        }
    }
}

impl JsxDev for Automatic {
    fn development_ctxt(&mut self) -> &mut DevelopmentContext {
        &mut self.development_ctx
    }
}

impl VisitMut for Automatic {
    noop_visit_mut_type!();

    visit_mut_development!();

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
                    sym: atom!("require"),
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
