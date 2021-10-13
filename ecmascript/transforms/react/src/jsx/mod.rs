use self::static_check::should_use_create_element;
use crate::refresh::options::{deserialize_refresh, RefreshOptions};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::{iter, iter::once, mem};
use string_enum::StringEnum;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    iter::IdentifyLast,
    sync::Lrc,
    util::take::Take,
    FileName, Mark, SourceMap, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    drop_span, member_expr, prepend, private_ident, quote_ident, ExprFactory, HANDLER,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

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

#[derive(Debug, Clone, Serialize, Deserialize, Eq, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct Options {
    /// If this is `true`, swc will behave just like babel 8 with
    /// `BABEL_8_BREAKING: true`.
    #[serde(skip, default)]
    pub next: bool,

    #[serde(default)]
    pub runtime: Option<Runtime>,

    /// For automatic runtime
    #[serde(default = "default_import_source")]
    pub import_source: String,

    #[serde(default = "default_pragma")]
    pub pragma: String,
    #[serde(default = "default_pragma_frag")]
    pub pragma_frag: String,

    #[serde(default = "default_throw_if_namespace")]
    pub throw_if_namespace: bool,

    #[serde(default)]
    pub development: bool,

    /// TODO: Remove this field.
    #[serde(default, alias = "useBuiltIns")]
    pub use_builtins: bool,

    #[serde(default)]
    pub use_spread: bool,

    #[serde(default, deserialize_with = "deserialize_refresh")]
    // default to disabled since this is still considered as experimental by now
    pub refresh: Option<RefreshOptions>,
}

impl Default for Options {
    fn default() -> Self {
        Options {
            next: false,
            runtime: Default::default(),
            import_source: default_import_source(),
            pragma: default_pragma(),
            pragma_frag: default_pragma_frag(),
            throw_if_namespace: default_throw_if_namespace(),
            development: false,
            use_builtins: false,
            use_spread: false,
            // since this is considered experimental, we disable it by default
            refresh: None,
        }
    }
}

fn default_import_source() -> String {
    "react".into()
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

fn parse_classic_option(
    cm: &SourceMap,
    name: &str,
    src: String,
    top_level_mark: Mark,
) -> Box<Expr> {
    static CACHE: Lazy<DashMap<(String, Mark), Box<Expr>, ahash::RandomState>> =
        Lazy::new(|| DashMap::with_capacity_and_hasher(2, Default::default()));

    let fm = cm.new_source_file(FileName::Custom(format!("<jsx-config-{}.js>", name)), src);
    if let Some(expr) = CACHE.get(&((*fm.src).clone(), top_level_mark)) {
        return expr.clone();
    }

    let mut expr = Parser::new(Syntax::default(), StringInput::from(&*fm), None)
        .parse_expr()
        .map_err(|e| {
            if HANDLER.is_set() {
                HANDLER.with(|h| e.into_diagnostic(h).emit())
            }
        })
        .map(drop_span)
        .unwrap_or_else(|()| {
            panic!(
                "failed to parse jsx option {}: '{}' is not an expression",
                name, fm.src,
            )
        });

    apply_mark(&mut expr, top_level_mark);
    CACHE.insert(((*fm.src).clone(), top_level_mark), expr.clone());

    expr
}

fn apply_mark(e: &mut Expr, mark: Mark) {
    match e {
        Expr::Ident(i) => {
            i.span = i.span.apply_mark(mark);
        }
        Expr::Member(MemberExpr {
            obj: ExprOrSuper::Expr(obj),
            ..
        }) => {
            apply_mark(&mut **obj, mark);
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
pub fn jsx<C>(
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    options: Options,
    top_level_mark: Mark,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    as_folder(Jsx {
        cm: cm.clone(),
        top_level_mark,
        next: options.next,
        runtime: options.runtime.unwrap_or_default(),
        import_source: options.import_source.into(),
        import_jsx: None,
        import_jsxs: None,
        import_fragment: None,
        import_create_element: None,

        pragma: ExprOrSuper::Expr(parse_classic_option(
            &cm,
            "pragma",
            options.pragma,
            top_level_mark,
        )),
        comments,
        pragma_frag: ExprOrSpread {
            spread: None,
            expr: parse_classic_option(&cm, "pragmaFrag", options.pragma_frag, top_level_mark),
        },
        use_builtins: options.use_builtins,
        use_spread: options.use_spread,
        throw_if_namespace: options.throw_if_namespace,
        top_level_node: true,
    })
}

struct Jsx<C>
where
    C: Comments,
{
    cm: Lrc<SourceMap>,

    top_level_mark: Mark,

    next: bool,
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

    pragma: ExprOrSuper,
    comments: Option<C>,
    pragma_frag: ExprOrSpread,
    use_builtins: bool,
    use_spread: bool,
    throw_if_namespace: bool,
}

impl<C> Jsx<C>
where
    C: Comments,
{
    fn jsx_frag_to_expr(&mut self, el: JSXFragment) -> Expr {
        let span = el.span();

        let use_jsxs = count_children(&el.children) > 1;

        if let Some(comments) = &self.comments {
            comments.add_pure_comment(span.lo);
        }

        match self.runtime {
            Runtime::Automatic => {
                let jsx = if use_jsxs {
                    self.import_jsxs
                        .get_or_insert_with(|| private_ident!("_jsxs"))
                        .clone()
                } else {
                    self.import_jsx
                        .get_or_insert_with(|| private_ident!("_jsx"))
                        .clone()
                };

                let fragment = self
                    .import_fragment
                    .get_or_insert_with(|| private_ident!("_Fragment"))
                    .clone();

                let mut props_obj = ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                };

                let children = el
                    .children
                    .into_iter()
                    .filter_map(|child| self.jsx_elem_child_to_expr(child))
                    .map(Some)
                    .collect::<Vec<_>>();

                match children.len() {
                    0 => {}
                    1 if children[0].as_ref().unwrap().spread.is_none() => {
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
                                value: Box::new(Expr::Array(ArrayLit {
                                    span: DUMMY_SP,
                                    elems: children,
                                })),
                            }))));
                    }
                }

                Expr::Call(CallExpr {
                    span,
                    callee: jsx.as_callee(),
                    args: vec![fragment.as_arg(), props_obj.as_arg()],
                    type_args: None,
                })
            }
            Runtime::Classic => {
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
        }
    }

    /// # Automatic
    ///
    ///
    ///
    /// # Classic
    ///
    /// <div></div> => React.createElement('div', null);
    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let top_level_node = self.top_level_node;
        let span = el.span();
        let use_create_element = should_use_create_element(&el.opening.attrs);
        self.top_level_node = false;

        let name = self.jsx_name(el.opening.name);

        if let Some(comments) = &self.comments {
            comments.add_pure_comment(span.lo);
        }

        match self.runtime {
            Runtime::Automatic => {
                // function jsx(tagName: string, props: { children: Node[], ... }, key: string)

                let use_jsxs = count_children(&el.children) > 1;

                let jsx = if use_create_element {
                    self.import_create_element
                        .get_or_insert_with(|| private_ident!("_createElement"))
                        .clone()
                } else if use_jsxs {
                    self.import_jsxs
                        .get_or_insert_with(|| private_ident!("_jsxs"))
                        .clone()
                } else {
                    self.import_jsx
                        .get_or_insert_with(|| private_ident!("_jsx"))
                        .clone()
                };

                let mut props_obj = ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                };

                let mut key = None;

                for attr in el.opening.attrs {
                    match attr {
                        JSXAttrOrSpread::JSXAttr(attr) => {
                            //
                            match attr.name {
                                JSXAttrName::Ident(i) => {
                                    //
                                    if !use_create_element && i.sym == js_word!("key") {
                                        key = attr
                                            .value
                                            .map(jsx_attr_value_to_expr)
                                            .flatten()
                                            .map(|expr| ExprOrSpread { expr, spread: None });
                                        assert_ne!(
                                            key, None,
                                            "value of property 'key' should not be empty"
                                        );
                                        continue;
                                    }

                                    let value = match attr.value {
                                        Some(v) => jsx_attr_value_to_expr(v)
                                            .expect("empty expression container?"),
                                        None => Box::new(Expr::Lit(Lit::Bool(Bool {
                                            span: DUMMY_SP,
                                            value: true,
                                        }))),
                                    };

                                    // TODO: Check if `i` is a valid identifier.
                                    let key = if i.sym.contains("-") {
                                        PropName::Str(Str {
                                            span: i.span,
                                            value: i.sym,
                                            has_escape: false,
                                            kind: StrKind::Normal {
                                                contains_quote: false,
                                            },
                                        })
                                    } else {
                                        PropName::Ident(i)
                                    };
                                    props_obj.props.push(PropOrSpread::Prop(Box::new(
                                        Prop::KeyValue(KeyValueProp { key, value }),
                                    )));
                                }
                                JSXAttrName::JSXNamespacedName(JSXNamespacedName { ns, name }) => {
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
                                        None => Box::new(Expr::Lit(Lit::Bool(Bool {
                                            span: DUMMY_SP,
                                            value: true,
                                        }))),
                                    };

                                    let key = Str {
                                        span,
                                        value: format!("{}:{}", ns.sym, name.sym).into(),
                                        has_escape: false,
                                        kind: Default::default(),
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

                let children = el
                    .children
                    .into_iter()
                    .filter_map(|child| self.jsx_elem_child_to_expr(child))
                    .map(Some)
                    .collect::<Vec<_>>();

                match children.len() {
                    0 => {}
                    1 if children[0].as_ref().unwrap().spread.is_none() => {
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
                                value: Box::new(Expr::Array(ArrayLit {
                                    span: DUMMY_SP,
                                    elems: children,
                                })),
                            }))));
                    }
                }

                self.top_level_node = top_level_node;

                Expr::Call(CallExpr {
                    span,
                    callee: jsx.as_callee(),
                    args: once(name.as_arg())
                        .chain(once(props_obj.as_arg()))
                        .chain(key)
                        .collect(),
                    type_args: Default::default(),
                })
            }
            Runtime::Classic => {
                Expr::Call(CallExpr {
                    span,
                    callee: self.pragma.clone(),
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
                    type_args: Default::default(),
                })
            }
        }
    }

    fn jsx_elem_child_to_expr(&mut self, c: JSXElementChild) -> Option<ExprOrSpread> {
        self.top_level_node = false;

        Some(match c {
            JSXElementChild::JSXText(text) => {
                // TODO(kdy1): Optimize
                let s = Str {
                    span: text.span,
                    has_escape: text.raw != text.value,
                    value: jsx_text_to_str(text.value),
                    kind: Default::default(),
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
            JSXElementChild::JSXSpreadChild(JSXSpreadChild { span, .. }) => {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(span, "Spread children are not supported in React.")
                        .emit();
                });
                return None;
            }
        })
    }

    fn fold_attrs_for_classic(&mut self, attrs: Vec<JSXAttrOrSpread>) -> Box<Expr> {
        if self.next {
            self.fold_attrs_for_next_classic(attrs)
        } else {
            self.fold_attrs_for_old_classic(attrs)
        }
    }

    /// Runtiem; `classic`
    fn fold_attrs_for_next_classic(&mut self, attrs: Vec<JSXAttrOrSpread>) -> Box<Expr> {
        if attrs.is_empty() {
            return Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP })));
        }
        let attr_cnt = attrs.len();

        let mut props = vec![];
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

        Box::new(Expr::Object(obj))
    }

    /// Runtime: `automatic`
    fn fold_attrs_for_old_classic(&mut self, attrs: Vec<JSXAttrOrSpread>) -> Box<Expr> {
        if attrs.is_empty() {
            return Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP })));
        }

        if self.use_spread {
            return self.fold_attrs_for_next_classic(attrs);
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
                        cur_obj_props.push(PropOrSpread::Prop(Box::new(self.attr_to_prop(a))))
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
                    .map(|attr| {
                        let mut v = self.attr_to_prop(attr);
                        v.visit_mut_with(self);
                        v
                    })
                    .map(Box::new)
                    .map(PropOrSpread::Prop)
                    .collect(),
            }))
        }
    }

    fn attr_to_prop(&mut self, a: JSXAttr) -> Prop {
        let key = to_prop_name(a.name);
        let value = a
            .value
            .map(|v| match v {
                JSXAttrValue::Lit(Lit::Str(s)) => Box::new(Expr::Lit(Lit::Str(Str {
                    span: s.span,
                    value: transform_jsx_attr_str(&s.value).into(),
                    has_escape: false,
                    kind: Default::default(),
                }))),
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
                Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: key.span(),
                    value: true,
                })))
            });
        Prop::KeyValue(KeyValueProp { key, value })
    }
}

impl<C> Jsx<C>
where
    C: Comments,
{
    fn parse_directives(&mut self, span: Span) -> bool {
        let mut found = false;

        let leading = if let Some(comments) = &self.comments {
            let leading = comments.take_leading(span.lo);

            if let Some(leading) = &leading {
                found |= self.parse_comment_contents(span, &leading);
            }

            leading
        } else {
            None
        };

        if let Some(leading) = leading {
            if let Some(comments) = &self.comments {
                comments.add_leading_comments(span.lo, leading);
            }
        }

        found
    }

    /// If we found required jsx directives, we returns true.
    fn parse_comment_contents(&mut self, span: Span, leading: &[Comment]) -> bool {
        let mut found = false;

        for cmt in leading {
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

                if line.starts_with("@jsxRuntime ") {
                    let src = line.replace("@jsxRuntime ", "").trim().to_string();
                    found = true;
                    if src == "classic" {
                        self.runtime = Runtime::Classic;
                    } else if src == "automatic" {
                        self.runtime = Runtime::Automatic;
                    } else {
                        todo!("proper error reporting for wrong `@jsxRuntime`")
                    }
                    continue;
                }

                if line.starts_with("@jsxImportSource") {
                    let src = line.replace("@jsxImportSource", "").trim().to_string();
                    self.runtime = Runtime::Automatic;
                    self.import_source = src.into();
                    found = true;
                }

                if line.starts_with("@jsxFrag") {
                    found = true;

                    if self.runtime == Runtime::Automatic {
                        HANDLER.with(|handler| {
                            handler
                                .struct_span_err(
                                    span,
                                    "pragma and pragmaFrag cannot be set when runtime is automatic",
                                )
                                .emit()
                        });
                    }

                    let src = line.replace("@jsxFrag", "").trim().to_string();
                    self.pragma_frag = ExprOrSpread {
                        expr: parse_classic_option(
                            &self.cm,
                            "module-jsx-pragma-frag",
                            src,
                            self.top_level_mark,
                        ),
                        spread: None,
                    };
                } else if line.starts_with("@jsx ") {
                    found = true;

                    if self.runtime == Runtime::Automatic {
                        HANDLER.with(|handler| {
                            handler
                                .struct_span_err(
                                    span,
                                    "pragma and pragmaFrag cannot be set when runtime is automatic",
                                )
                                .emit()
                        });
                    }

                    let src = line.replace("@jsx", "").trim().to_string();

                    self.pragma = ExprOrSuper::Expr(parse_classic_option(
                        &self.cm,
                        "module-jsx-pragma",
                        src,
                        self.top_level_mark,
                    ));
                }
            }
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

    fn visit_mut_member_expr(&mut self, e: &mut MemberExpr) {
        e.obj.visit_mut_with(self);
        if e.computed {
            e.prop.visit_mut_with(self);
        }
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
            if let Some(local) = self.import_create_element.take() {
                let specifier = ImportSpecifier::Named(ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local,
                    imported: Some(Ident::new("createElement".into(), DUMMY_SP)),
                    is_type_only: false,
                });
                prepend(
                    &mut module.body,
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span: DUMMY_SP,
                        specifiers: vec![specifier],
                        src: Str {
                            span: DUMMY_SP,
                            value: "react".into(),
                            has_escape: false,
                            kind: Default::default(),
                        },
                        type_only: Default::default(),
                        asserts: Default::default(),
                    })),
                );
            }

            let imports = self
                .import_jsx
                .take()
                .map(|local| ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local,
                    imported: Some(quote_ident!("jsx")),
                    is_type_only: false,
                })
                .into_iter()
                .chain(self.import_jsxs.take().map(|local| ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local,
                    imported: Some(quote_ident!("jsxs")),
                    is_type_only: false,
                }))
                .chain(
                    self.import_fragment
                        .take()
                        .map(|local| ImportNamedSpecifier {
                            span: DUMMY_SP,
                            local,
                            imported: Some(quote_ident!("Fragment")),
                            is_type_only: false,
                        }),
                )
                .map(ImportSpecifier::Named)
                .collect::<Vec<_>>();

            if !imports.is_empty() {
                prepend(
                    &mut module.body,
                    ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span: DUMMY_SP,
                        specifiers: imports,
                        src: Str {
                            span: DUMMY_SP,
                            value: format!("{}/jsx-runtime", self.import_source).into(),
                            has_escape: false,
                            kind: Default::default(),
                        },
                        type_only: Default::default(),
                        asserts: Default::default(),
                    })),
                );
            }
        }
    }
}

impl<C> Jsx<C>
where
    C: Comments,
{
    fn jsx_name(&self, name: JSXElementName) -> Box<Expr> {
        let span = name.span();
        match name {
            JSXElementName::Ident(i) => {
                if i.sym == js_word!("this") {
                    return Box::new(Expr::This(ThisExpr { span }));
                }

                // If it starts with lowercase
                if i.as_ref().starts_with(|c: char| c.is_ascii_lowercase()) {
                    Box::new(Expr::Lit(Lit::Str(Str {
                        span,
                        value: i.sym,
                        has_escape: false,
                        kind: StrKind::Normal {
                            contains_quote: false,
                        },
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
                    kind: Default::default(),
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
                    kind: StrKind::Normal {
                        contains_quote: false,
                    },
                })
            } else {
                PropName::Ident(i)
            }
        }
        JSXAttrName::JSXNamespacedName(JSXNamespacedName { ns, name }) => PropName::Str(Str {
            span,
            value: format!("{}:{}", ns.sym, name.sym).into(),
            has_escape: false,
            kind: Default::default(),
        }),
    }
}

#[inline]
fn jsx_text_to_str(t: JsWord) -> JsWord {
    static SPACE_NL_START: Lazy<Regex> =
        Lazy::new(|| Regex::new("^[\t'\n\x0C\r ]*\n[\t'\n\x0C\r ]*").unwrap());
    static SPACE_NL_END: Lazy<Regex> =
        Lazy::new(|| Regex::new("[\t'\n\x0C\r ]*\n[\t'\n\x0C\r ]*$").unwrap());

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

    for (last, s) in s
        .split(|c: char| c != '\u{a0}' && c.is_ascii_whitespace())
        .filter(|s| !s.is_empty())
        .identify_last()
    {
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
        JSXAttrValue::Lit(Lit::Str(s)) => Box::new(Expr::Lit(Lit::Str(Str {
            span: s.span,
            value: transform_jsx_attr_str(&s.value).into(),
            has_escape: false,
            kind: Default::default(),
        }))),
        JSXAttrValue::Lit(lit) => Box::new(lit.into()),
        JSXAttrValue::JSXExprContainer(e) => match e.expr {
            JSXExpr::JSXEmptyExpr(_) => None?,
            JSXExpr::Expr(e) => e,
        },
        JSXAttrValue::JSXElement(e) => Box::new(Expr::JSXElement(e)),
        JSXAttrValue::JSXFragment(f) => Box::new(Expr::JSXFragment(f)),
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

    for c in v.chars() {
        match c {
            '\u{0008}' => buf.push_str("\\b"),
            '\u{000c}' => buf.push_str("\\f"),
            ' ' | '\n' | '\r' | '\t' => {
                if buf.ends_with(' ') {
                } else {
                    buf.push(' ')
                }
            }
            '\u{000b}' => buf.push_str("\\v"),
            '\0' => buf.push_str("\\x00"),

            '\\' => buf.push_str("\\\\"),

            '\'' if single_quote => buf.push_str("\\'"),
            '"' if !single_quote => buf.push_str("\""),

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
