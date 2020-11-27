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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct Options {
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

    #[serde(default)]
    pub use_builtins: bool,

    #[serde(default)]
    pub use_spread: bool,
}

impl Default for Options {
    fn default() -> Self {
        Options {
            runtime: Default::default(),
            import_source: default_import_source(),
            pragma: default_pragma(),
            pragma_frag: default_pragma_frag(),
            throw_if_namespace: default_throw_if_namespace(),
            development: false,
            use_builtins: false,
            use_spread: false,
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

fn parse_classic_option(cm: &SourceMap, name: &str, src: String) -> Box<Expr> {
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
pub fn jsx<C>(cm: Lrc<SourceMap>, comments: Option<C>, options: Options) -> impl Fold
where
    C: Comments,
{
    as_folder(Jsx {
        cm: cm.clone(),
        next: options.runtime.is_some(),
        runtime: options.runtime.unwrap_or_default(),
        import_source: options.import_source.into(),
        import_jsx: None,
        import_jsxs: None,
        import_fragment: None,
        import_create_element: None,

        pragma: ExprOrSuper::Expr(parse_classic_option(&cm, "pragma", options.pragma)),
        comments,
        pragma_frag: ExprOrSpread {
            spread: None,
            expr: parse_classic_option(&cm, "pragmaFrag", options.pragma_frag),
        },
        use_builtins: options.use_builtins,
        throw_if_namespace: options.throw_if_namespace,
        top_level_node: true,
    })
}

struct Jsx<C>
where
    C: Comments,
{
    cm: Lrc<SourceMap>,
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
    throw_if_namespace: bool,
}

impl<C> Jsx<C>
where
    C: Comments,
{
    fn jsx_frag_to_expr(&mut self, el: JSXFragment) -> Expr {
        let span = el.span();

        match self.runtime {
            Runtime::Automatic => {
                let jsx = self
                    .import_jsx
                    .get_or_insert_with(|| private_ident!("_jsx"))
                    .clone();

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

                if !children.is_empty() {
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
        let use_jsxs = self.top_level_node && !use_create_element && is_static(&el);
        self.top_level_node = false;

        let name = self.jsx_name(el.opening.name);

        match self.runtime {
            Runtime::Automatic => {
                // function jsx(tagName: string, props: { children: Node[], ... }, key: string)

                let jsx = if use_jsxs {
                    self.import_jsxs
                        .get_or_insert_with(|| private_ident!("_jsxs"))
                        .clone()
                } else if use_create_element {
                    self.import_create_element
                        .get_or_insert_with(|| private_ident!("_createElement"))
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
                                    if i.sym == js_word!("key") {
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
                                    props_obj.props.push(PropOrSpread::Prop(Box::new(
                                        Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(i),
                                            value,
                                        }),
                                    )));
                                }
                                JSXAttrName::JSXNamespacedName(_) => {
                                    unimplemented!("automatic runtime: JSXNamespacedName")
                                }
                            }
                        }
                        JSXAttrOrSpread::SpreadElement(attr) => {
                            props_obj.props.push(PropOrSpread::Spread(attr));
                        }
                    }
                }

                let children = el
                    .children
                    .into_iter()
                    .filter_map(|child| self.jsx_elem_child_to_expr(child))
                    .map(Some)
                    .collect::<Vec<_>>();

                if !children.is_empty() {
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
                self.top_level_node = top_level_node;

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
            JSXElementChild::JSXSpreadChild(child) => {
                // This is wrong.
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(child.span, "Spread children are not supported in React")
                        .emit();
                });
                child.expr.as_arg()
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
        let props = attrs
            .into_iter()
            .map(|attr| match attr {
                JSXAttrOrSpread::JSXAttr(attr) => {
                    PropOrSpread::Prop(Box::new(self.attr_to_prop(attr)))
                }
                JSXAttrOrSpread::SpreadElement(spread) => PropOrSpread::Spread(spread),
            })
            .collect();

        let obj = ObjectLit {
            span: DUMMY_SP,
            props,
        };

        Box::new(Expr::Object(obj))
    }

    fn attr_to_prop(&mut self, a: JSXAttr) -> Prop {
        let key = to_prop_name(a.name);
        let value = a
            .value
            .map(|v| match v {
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

    /// Runtiem; `automatic`
    fn fold_attrs_for_old_classic(&mut self, attrs: Vec<JSXAttrOrSpread>) -> Box<Expr> {
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
}

impl<C> VisitMut for Jsx<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let leading = if let Some(comments) = &self.comments {
            let leading = comments.take_leading(module.span.lo);

            if let Some(leading) = &leading {
                for leading in &**leading {
                    if leading.kind != CommentKind::Block {
                        continue;
                    }

                    for line in leading.text.lines() {
                        let mut line = line.trim();
                        if line.starts_with('*') {
                            line = line[1..].trim();
                        }

                        if !line.starts_with("@jsx") {
                            continue;
                        }

                        if line.starts_with("@jsxRuntime ") {
                            let src = line.replace("@jsxRuntime ", "").trim().to_string();
                            if src == "classic" {
                                self.runtime = Runtime::Classic;
                            } else if src == "automatic" {
                                self.runtime = Runtime::Automatic;
                            } else {
                                todo!("proper error reporting for wrong `@jsxRuntime`")
                            }
                            continue;
                        }

                        if line.starts_with("@jsxFrag") {
                            let src = line.replace("@jsxFrag", "").trim().to_string();
                            self.pragma_frag = ExprOrSpread {
                                expr: parse_classic_option(&self.cm, "module-jsx-pragma-frag", src),
                                spread: None,
                            };
                        } else {
                            let src = line.replace("@jsx", "").trim().to_string();

                            self.pragma = ExprOrSuper::Expr(parse_classic_option(
                                &self.cm,
                                "module-jsx-pragma",
                                src,
                            ));
                        }
                    }
                }
            }

            leading
        } else {
            None
        };

        module.visit_mut_children_with(self);

        if let Some(leading) = leading {
            if let Some(comments) = &self.comments {
                comments.add_leading_comments(module.span.lo, leading);
            }
        }

        if self.runtime == Runtime::Automatic {
            let mut imports = vec![];
            if let Some(local) = self.import_jsx.take() {
                imports.push(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local,
                    imported: Some(quote_ident!("jsx")),
                }));
            }

            if let Some(local) = self.import_jsxs.take() {
                imports.push(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local,
                    imported: Some(quote_ident!("jsxs")),
                }));
            }

            if let Some(local) = self.import_fragment.take() {
                imports.push(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local,
                    imported: Some(quote_ident!("Fragment")),
                }));
            }

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
                        },
                        type_only: Default::default(),
                        asserts: Default::default(),
                    })),
                );
            }
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        let top_level_node = self.top_level_node;
        let mut did_work = false;
        expr.map_with_mut(|expr| {
            if let Expr::JSXElement(el) = expr {
                did_work = true;
                return self.jsx_elem_to_expr(*el);
            }
            if let Expr::JSXFragment(frag) = expr {
                did_work = true;
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
                    did_work = true;
                    return self.jsx_elem_to_expr(*el);
                }
                if let Expr::JSXFragment(frag) = *inner_expr {
                    did_work = true;
                    // <></> => React.createElement(React.Fragment, null);
                    return self.jsx_frag_to_expr(frag);
                }
                return Expr::Paren(ParenExpr {
                    span,
                    expr: inner_expr,
                });
            }

            expr
        });

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
}

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
