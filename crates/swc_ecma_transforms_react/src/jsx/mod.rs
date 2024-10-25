#![allow(clippy::redundant_allocation)]

use std::{borrow::Cow, iter, iter::once, sync::Arc};

use serde::{Deserialize, Serialize};
use string_enum::StringEnum;
use swc_atoms::{Atom, JsWord};
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    errors::HANDLER,
    iter::IdentifyLast,
    sync::Lrc,
    util::take::Take,
    FileName, Mark, SourceMap, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_config::merge::Merge;
use swc_ecma_ast::*;
use swc_ecma_parser::{parse_file_as_expr, Syntax};
use swc_ecma_utils::{drop_span, prepend_stmt, private_ident, quote_ident, ExprFactory, StmtLike};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use self::static_check::should_use_create_element;
use crate::refresh::options::{deserialize_refresh, RefreshOptions};

mod static_check;
#[cfg(test)]
mod tests;

/// https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#runtime
#[derive(StringEnum, PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Hash)]
pub enum Runtime {
    /// `automatic`
    Automatic,
    /// `classic`
    Classic,
}

/// Note: This will changed in v2
impl Default for Runtime {
    fn default() -> Self {
        Runtime::Classic
    }
}

#[derive(Debug, Default, Clone, Serialize, Deserialize, Eq, PartialEq, Merge)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct Options {
    /// If this is `true`, swc will behave just like babel 8 with
    /// `BABEL_8_BREAKING: true`.
    #[serde(skip, default)]
    pub next: Option<bool>,

    #[serde(default)]
    pub runtime: Option<Runtime>,

    /// For automatic runtime
    #[serde(default)]
    pub import_source: Option<String>,

    #[serde(default)]
    pub pragma: Option<String>,
    #[serde(default)]
    pub pragma_frag: Option<String>,

    #[serde(default)]
    pub throw_if_namespace: Option<bool>,

    #[serde(default)]
    pub development: Option<bool>,

    // @babel/plugin-transform-react-jsx: Since "useBuiltIns" is removed in Babel 8, you can remove
    // it from the config.
    #[deprecated(
        since = "0.167.4",
        note = r#"Since `useBuiltIns` is removed in swc, you can remove it from the config."#
    )]
    #[serde(default, alias = "useBuiltIns")]
    pub use_builtins: Option<bool>,

    // '@babel/plugin-transform-react-jsx: Since Babel 8, an inline object with spread elements is
    // always used, and the "useSpread" option is no longer available. Please remove it from your
    // config.',
    #[deprecated(
        since = "0.167.4",
        note = r#"An inline object with spread elements is always used, and the `useSpread` option is no longer available. Please remove it from your config."#
    )]
    #[serde(default)]
    pub use_spread: Option<bool>,

    #[serde(default, deserialize_with = "deserialize_refresh")]
    // default to disabled since this is still considered as experimental by now
    pub refresh: Option<RefreshOptions>,
}

pub fn default_import_source() -> String {
    "react".into()
}

pub fn default_pragma() -> String {
    "React.createElement".into()
}

pub fn default_pragma_frag() -> String {
    "React.Fragment".into()
}

fn default_throw_if_namespace() -> bool {
    true
}

/// Parse `src` to use as a `pragma` or `pragmaFrag` in jsx.
pub fn parse_expr_for_jsx(
    cm: &SourceMap,
    name: &str,
    src: String,
    top_level_mark: Mark,
) -> Arc<Box<Expr>> {
    let fm = cm.new_source_file(
        FileName::Internal(format!("jsx-config-{}.js", name)).into(),
        src,
    );

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
    .map(Arc::new)
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
pub fn jsx<C>(
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    options: Options,
    top_level_mark: Mark,
    unresolved_mark: Mark,
) -> impl Pass + VisitMut
where
    C: Comments,
{
    visit_mut_pass(Jsx {
        cm: cm.clone(),
        top_level_mark,
        unresolved_mark,
        runtime: options.runtime.unwrap_or_default(),
        import_source: options
            .import_source
            .unwrap_or_else(default_import_source)
            .into(),
        import_jsx: None,
        import_jsxs: None,
        import_fragment: None,
        import_create_element: None,

        pragma: parse_expr_for_jsx(
            &cm,
            "pragma",
            options.pragma.unwrap_or_else(default_pragma),
            top_level_mark,
        ),
        comments,
        pragma_frag: parse_expr_for_jsx(
            &cm,
            "pragmaFrag",
            options.pragma_frag.unwrap_or_else(default_pragma_frag),
            top_level_mark,
        ),
        development: options.development.unwrap_or_default(),
        throw_if_namespace: options
            .throw_if_namespace
            .unwrap_or_else(default_throw_if_namespace),
        top_level_node: true,
    })
}

struct Jsx<C>
where
    C: Comments,
{
    cm: Lrc<SourceMap>,

    top_level_mark: Mark,
    unresolved_mark: Mark,

    runtime: Runtime,
    /// For automatic runtime.
    import_source: JsWord,
    /// For automatic runtime.
    import_jsx: Option<Ident>,
    /// For automatic runtime.
    import_jsxs: Option<Ident>,
    /// For automatic runtime.
    import_create_element: Option<Ident>,
    /// For automatic runtime.
    import_fragment: Option<Ident>,
    top_level_node: bool,

    pragma: Arc<Box<Expr>>,
    comments: Option<C>,
    pragma_frag: Arc<Box<Expr>>,
    development: bool,
    throw_if_namespace: bool,
}

#[derive(Debug, Default, Clone, PartialEq, Eq)]
pub struct JsxDirectives {
    pub runtime: Option<Runtime>,

    /// For automatic runtime.
    pub import_source: Option<JsWord>,

    /// Parsed from `@jsx`
    pub pragma: Option<Arc<Box<Expr>>>,

    /// Parsed from `@jsxFrag`
    pub pragma_frag: Option<Arc<Box<Expr>>>,
}

fn respan(e: &mut Expr, span: Span) {
    match e {
        Expr::Ident(i) => {
            i.span.lo = span.lo;
            i.span.hi = span.hi;
        }
        Expr::Member(e) => {
            e.span = span;
        }
        _ => {}
    }
}

impl JsxDirectives {
    pub fn from_comments(
        cm: &SourceMap,
        _: Span,
        comments: &[Comment],
        top_level_mark: Mark,
    ) -> Self {
        let mut res = JsxDirectives::default();

        for cmt in comments {
            if cmt.kind != CommentKind::Block {
                continue;
            }

            for line in cmt.text.lines() {
                let mut line = line.trim();
                if line.starts_with('*') {
                    line = line[1..].trim();
                }

                if !line.starts_with("@jsx") {
                    continue;
                }

                let mut words = line.split_whitespace();
                loop {
                    let pragma = words.next();
                    if pragma.is_none() {
                        break;
                    }
                    let val = words.next();

                    match pragma {
                        Some("@jsxRuntime") => match val {
                            Some("classic") => res.runtime = Some(Runtime::Classic),
                            Some("automatic") => res.runtime = Some(Runtime::Automatic),
                            None => {}
                            _ => {
                                HANDLER.with(|handler| {
                                    handler
                                        .struct_span_err(
                                            cmt.span,
                                            "Runtime must be either `classic` or `automatic`.",
                                        )
                                        .emit()
                                });
                            }
                        },
                        Some("@jsxImportSource") => {
                            if let Some(src) = val {
                                res.runtime = Some(Runtime::Automatic);
                                res.import_source = Some(src.into());
                            }
                        }
                        Some("@jsxFrag") => {
                            if let Some(src) = val {
                                if is_valid_for_pragma(src) {
                                    // TODO: Optimize
                                    let mut e = (*parse_expr_for_jsx(
                                        cm,
                                        "module-jsx-pragma-frag",
                                        src.to_string(),
                                        top_level_mark,
                                    ))
                                    .clone();
                                    respan(&mut e, cmt.span);
                                    res.pragma_frag = Some(e.into())
                                }
                            }
                        }
                        Some("@jsx") => {
                            if let Some(src) = val {
                                if is_valid_for_pragma(src) {
                                    // TODO: Optimize
                                    let mut e = (*parse_expr_for_jsx(
                                        cm,
                                        "module-jsx-pragma",
                                        src.to_string(),
                                        top_level_mark,
                                    ))
                                    .clone();
                                    respan(&mut e, cmt.span);
                                    res.pragma = Some(e.into());
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }
        }

        res
    }
}

fn is_valid_for_pragma(s: &str) -> bool {
    if s.is_empty() {
        return false;
    }

    if !s.starts_with(|c: char| Ident::is_valid_start(c)) {
        return false;
    }

    for c in s.chars() {
        if !Ident::is_valid_continue(c) && c != '.' {
            return false;
        }
    }

    true
}

impl<C> Jsx<C>
where
    C: Comments,
{
    fn inject_runtime<T, F>(&mut self, body: &mut Vec<T>, inject: F)
    where
        T: StmtLike,
        // Fn(Vec<(local, imported)>, src, body)
        F: Fn(Vec<(Ident, IdentName)>, &str, &mut Vec<T>),
    {
        if self.runtime == Runtime::Automatic {
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
    }

    fn jsx_frag_to_expr(&mut self, el: JSXFragment) -> Expr {
        let mut span = el.span();

        let count = count_children(&el.children);
        let use_jsxs = count > 1
            || (count == 1 && matches!(&el.children[0], JSXElementChild::JSXSpreadChild(..)));

        if let Some(comments) = &self.comments {
            if span.lo.is_dummy() {
                span.lo = Span::dummy_with_cmt().lo;
            }

            comments.add_pure_comment(span.lo);
        }

        match self.runtime {
            Runtime::Automatic => {
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
            Runtime::Classic => {
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
        }
    }

    /// # Automatic
    ///
    /// <div></div> => jsx('div', null);
    ///
    /// # Classic
    ///
    /// <div></div> => React.createElement('div', null);
    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let top_level_node = self.top_level_node;
        let mut span = el.span();
        let use_create_element = should_use_create_element(&el.opening.attrs);
        self.top_level_node = false;

        let name = self.jsx_name(el.opening.name);

        if let Some(comments) = &self.comments {
            if span.lo.is_dummy() {
                span.lo = Span::dummy_with_cmt().lo;
            }

            comments.add_pure_comment(span.lo);
        }

        match self.runtime {
            Runtime::Automatic => {
                // function jsx(tagName: string, props: { children: Node[], ... }, key: string)

                let count = count_children(&el.children);
                let use_jsxs = count > 1
                    || (count == 1
                        && matches!(&el.children[0], JSXElementChild::JSXSpreadChild(..)));

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
                                                        "The value of property 'key' should not \
                                                         be empty",
                                                    )
                                                    .emit();
                                            });
                                        }
                                        continue;
                                    }

                                    if !use_create_element
                                        && *i.sym == *"__source"
                                        && self.development
                                    {
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

                                    if !use_create_element
                                        && *i.sym == *"__self"
                                        && self.development
                                    {
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
                                        Some(v) => jsx_attr_value_to_expr(v)
                                            .expect("empty expression container?"),
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
                                    props_obj.props.push(PropOrSpread::Prop(Box::new(
                                        Prop::KeyValue(KeyValueProp { key, value }),
                                    )));
                                }
                                JSXAttrName::JSXNamespacedName(JSXNamespacedName {
                                    ns,
                                    name,
                                    ..
                                }) => {
                                    if self.throw_if_namespace {
                                        HANDLER.with(|handler| {
                                            handler
                                                .struct_span_err(
                                                    span,
                                                    "JSX Namespace is disabled by default because \
                                                     react does not support it yet. You can \
                                                     specify jsc.transform.react.throwIfNamespace \
                                                     to false to override default behavior",
                                                )
                                                .emit()
                                        });
                                    }

                                    let value = match attr.value {
                                        Some(v) => jsx_attr_value_to_expr(v)
                                            .expect("empty expression container?"),
                                        None => true.into(),
                                    };

                                    let str_value = format!("{}:{}", ns.sym, name.sym);
                                    let key = Str {
                                        span,
                                        raw: None,
                                        value: str_value.into(),
                                    };
                                    let key = PropName::Str(key);

                                    props_obj.props.push(PropOrSpread::Prop(Box::new(
                                        Prop::KeyValue(KeyValueProp { key, value }),
                                    )));
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
                                    value: children
                                        .take()
                                        .into_iter()
                                        .next()
                                        .flatten()
                                        .unwrap()
                                        .expr,
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

                self.top_level_node = top_level_node;

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
            Runtime::Classic => {
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
        }
    }

    fn jsx_elem_child_to_expr(&mut self, c: JSXElementChild) -> Option<ExprOrSpread> {
        self.top_level_node = false;

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

impl<C> Jsx<C>
where
    C: Comments,
{
    /// If we found required jsx directives, we returns true.
    fn parse_directives(&mut self, span: Span) -> bool {
        let mut found = false;

        let directives = self.comments.with_leading(span.lo, |comments| {
            JsxDirectives::from_comments(&self.cm, span, comments, self.top_level_mark)
        });

        let JsxDirectives {
            runtime,
            import_source,
            pragma,
            pragma_frag,
        } = directives;

        if let Some(runtime) = runtime {
            found = true;
            self.runtime = runtime;
        }

        if let Some(import_source) = import_source {
            found = true;
            self.import_source = import_source;
        }

        if let Some(pragma) = pragma {
            if let Runtime::Automatic = self.runtime {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            pragma.span(),
                            "pragma cannot be set when runtime is automatic",
                        )
                        .emit()
                });
            }

            found = true;
            self.pragma = pragma;
        }

        if let Some(pragma_frag) = pragma_frag {
            if let Runtime::Automatic = self.runtime {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            pragma_frag.span(),
                            "pragmaFrag cannot be set when runtime is automatic",
                        )
                        .emit()
                });
            }

            found = true;
            self.pragma_frag = pragma_frag;
        }

        found
    }
}

impl<C> VisitMut for Jsx<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        let top_level_node = self.top_level_node;
        let mut did_work = false;

        if let Expr::JSXElement(el) = expr {
            did_work = true;
            // <div></div> => React.createElement('div', null);
            *expr = self.jsx_elem_to_expr(*el.take());
        } else if let Expr::JSXFragment(frag) = expr {
            // <></> => React.createElement(React.Fragment, null);
            did_work = true;
            *expr = self.jsx_frag_to_expr(frag.take());
        } else if let Expr::Paren(ParenExpr {
            expr: inner_expr, ..
        }) = expr
        {
            if let Expr::JSXElement(el) = &mut **inner_expr {
                did_work = true;
                *expr = self.jsx_elem_to_expr(*el.take());
            } else if let Expr::JSXFragment(frag) = &mut **inner_expr {
                // <></> => React.createElement(React.Fragment, null);
                did_work = true;
                *expr = self.jsx_frag_to_expr(frag.take());
            }
        }

        if did_work {
            self.top_level_node = false;
        }

        expr.visit_mut_children_with(self);

        self.top_level_node = top_level_node;
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        self.parse_directives(module.span);

        for item in &module.body {
            let span = item.span();
            if self.parse_directives(span) {
                break;
            }
        }

        module.visit_mut_children_with(self);

        if self.runtime == Runtime::Automatic {
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
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        self.parse_directives(script.span);

        for item in &script.body {
            let span = item.span();
            if self.parse_directives(span) {
                break;
            }
        }

        script.visit_mut_children_with(self);

        if self.runtime == Runtime::Automatic {
            let mark = self.unresolved_mark;
            self.inject_runtime(&mut script.body, |imports, src, stmts| {
                prepend_stmt(stmts, add_require(imports, src, mark))
            });
        }
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

impl<C> Jsx<C>
where
    C: Comments,
{
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
fn jsx_text_to_str(t: Atom) -> JsWord {
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
        if line.len() == 0 {
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
