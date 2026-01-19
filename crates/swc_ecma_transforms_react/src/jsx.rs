//! JSX transform implementation.
//!
//! Transforms JSX syntax into function calls.
//!
//! # Classic Runtime
//! ```jsx
//! <div foo="bar">text</div>
//! ```
//! becomes:
//! ```js
//! React.createElement("div", { foo: "bar" }, "text")
//! ```
//!
//! # Automatic Runtime
//! ```jsx
//! <div foo="bar">text</div>
//! ```
//! becomes:
//! ```js
//! import { jsx as _jsx } from "react/jsx-runtime";
//! _jsx("div", { foo: "bar", children: "text" })
//! ```

use swc_atoms::Atom;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    sync::Lrc,
    util::take::Take,
    Mark, SourceMap, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{private_ident, ExprFactory};

use crate::options::{default_pragma, default_pragma_frag, Options, Runtime};

/// Creates a JSX transform hook.
pub fn hook<C: Comments>(
    cm: Lrc<SourceMap>,
    comments: Option<C>,
    options: Options,
    top_level_mark: Mark,
    unresolved_mark: Mark,
) -> impl VisitMutHook<()> {
    let runtime = options.runtime.unwrap_or(Runtime::Classic);
    let import_source = options
        .import_source
        .map(|s| s.to_string())
        .unwrap_or_else(|| "react".to_string());
    let pragma: Atom = options
        .pragma
        .map(|s| s.to_string().into())
        .unwrap_or_else(|| default_pragma().to_string().into());
    let pragma_frag: Atom = options
        .pragma_frag
        .map(|s| s.to_string().into())
        .unwrap_or_else(|| default_pragma_frag().to_string().into());
    let development = options.development.unwrap_or(false);
    let throw_if_namespace = options.throw_if_namespace.unwrap_or(true);

    Jsx {
        cm,
        comments,
        runtime,
        import_source,
        pragma,
        pragma_frag,
        development,
        throw_if_namespace,
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),

        // Import tracking for automatic runtime
        import_jsx: None,
        import_jsxs: None,
        import_jsx_dev: None,
        import_fragment: None,
        import_create_element: None,

        // State
        top_level_node: true,
    }
}

struct Jsx<C> {
    cm: Lrc<SourceMap>,
    comments: Option<C>,

    runtime: Runtime,
    import_source: String,
    pragma: Atom,
    pragma_frag: Atom,
    development: bool,
    throw_if_namespace: bool,
    top_level_ctxt: SyntaxContext,
    unresolved_ctxt: SyntaxContext,

    // Import identifiers for automatic runtime
    import_jsx: Option<Ident>,
    import_jsxs: Option<Ident>,
    import_jsx_dev: Option<Ident>,
    import_fragment: Option<Ident>,
    import_create_element: Option<Ident>,

    // State
    top_level_node: bool,
}

impl<C: Comments> VisitMutHook<()> for Jsx<C> {
    fn enter_module(&mut self, module: &mut Module, _ctx: &mut ()) {
        // Parse pragma from comments
        // Try to get comments from the first statement, as JSX pragmas are usually
        // placed at the top of the file before the first statement
        if let Some(first) = module.body.first() {
            self.parse_pragma_from_comments(first.span());
        }
        // Also try the module span itself
        self.parse_pragma_from_comments(module.span);
    }

    fn enter_script(&mut self, script: &mut Script, _ctx: &mut ()) {
        // Parse pragma from comments
        if let Some(first) = script.body.first() {
            self.parse_pragma_from_comments(first.span());
        }
        self.parse_pragma_from_comments(script.span);
    }

    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut ()) {
        match expr {
            Expr::JSXElement(el) => {
                let el = el.take();
                let new_expr = self.jsx_elem_to_expr(*el);
                *expr = new_expr;
            }
            Expr::JSXFragment(frag) => {
                let frag = frag.take();
                let new_expr = self.jsx_frag_to_expr(frag);
                *expr = new_expr;
            }
            Expr::JSXEmpty(..) => {
                *expr = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
            }
            _ => {}
        }
    }

    fn exit_module(&mut self, module: &mut Module, _ctx: &mut ()) {
        if self.runtime == Runtime::Automatic {
            self.inject_imports_esm(&mut module.body);
        }
    }

    fn exit_script(&mut self, script: &mut Script, _ctx: &mut ()) {
        if self.runtime == Runtime::Automatic {
            self.inject_imports_cjs(&mut script.body);
        }
    }
}

impl<C: Comments> Jsx<C> {
    /// Parse `@jsx` and `@jsxFrag` pragma from leading comments.
    fn parse_pragma_from_comments(&mut self, span: Span) {
        let Some(comments) = &self.comments else {
            return;
        };

        let leading = comments.get_leading(span.lo);
        let Some(leading) = leading else {
            return;
        };

        for comment in leading {
            if comment.kind != CommentKind::Block {
                continue;
            }

            // Look for @jsx pragma
            for line in comment.text.lines() {
                // Trim whitespace and leading `*` (for JSDoc-style comments)
                let line = line.trim().trim_start_matches('*').trim();
                if let Some(pragma) = line.strip_prefix("@jsx ") {
                    self.pragma = pragma.trim().into();
                }
                if let Some(pragma_frag) = line.strip_prefix("@jsxFrag ") {
                    self.pragma_frag = pragma_frag.trim().into();
                }
                if line.contains("@jsxRuntime classic") {
                    self.runtime = Runtime::Classic;
                }
                if line.contains("@jsxRuntime automatic") {
                    self.runtime = Runtime::Automatic;
                }
                if let Some(source) = line.strip_prefix("@jsxImportSource ") {
                    self.import_source = source.trim().to_string();
                    self.runtime = Runtime::Automatic;
                }
            }
        }
    }

    /// Convert a JSX element to an expression.
    fn jsx_elem_to_expr(&mut self, el: JSXElement) -> Expr {
        let span = el.span;

        match self.runtime {
            Runtime::Classic => self.jsx_elem_to_expr_classic(el),
            Runtime::Automatic => self.jsx_elem_to_expr_automatic(el, span),
            Runtime::Preserve => {
                // Keep JSX as-is
                Expr::JSXElement(Box::new(el))
            }
        }
    }

    /// Convert a JSX fragment to an expression.
    fn jsx_frag_to_expr(&mut self, frag: JSXFragment) -> Expr {
        let span = frag.span;

        match self.runtime {
            Runtime::Classic => self.jsx_frag_to_expr_classic(frag),
            Runtime::Automatic => self.jsx_frag_to_expr_automatic(frag, span),
            Runtime::Preserve => {
                // Keep JSX as-is
                Expr::JSXFragment(frag)
            }
        }
    }

    // =========================================================================
    // Classic Runtime
    // =========================================================================

    fn jsx_elem_to_expr_classic(&mut self, el: JSXElement) -> Expr {
        let span = el.span;
        let tag = self.jsx_name_to_expr(el.opening.name);
        let attrs = el.opening.attrs;
        let children = el.children;

        let props = self.build_props_classic(&attrs, None);

        // Check if there are spread children
        let has_spread = children
            .iter()
            .any(|c| matches!(c, JSXElementChild::JSXSpreadChild(_)));

        if has_spread {
            // Use .apply() for spread children
            return self.build_call_with_spread_children_classic(
                span,
                tag,
                props,
                &children,
                &self.pragma.clone(),
            );
        }

        let children_args = self.build_children_classic(&children);

        let mut args = vec![tag.as_arg(), props.as_arg()];
        args.extend(children_args.into_iter().map(|c| c.as_arg()));

        let callee = self.create_pragma_callee(&self.pragma.clone());

        self.wrap_with_pure_comment(
            span,
            Expr::Call(CallExpr {
                span,
                callee,
                args,
                ..Default::default()
            }),
        )
    }

    fn jsx_frag_to_expr_classic(&mut self, frag: JSXFragment) -> Expr {
        let span = frag.span;
        let children = frag.children;

        let tag = self.create_pragma_callee(&self.pragma_frag.clone());
        let tag_expr = match tag {
            Callee::Expr(e) => *e,
            _ => unreachable!(),
        };

        let children_args = self.build_children_classic(&children);

        let mut args = vec![
            tag_expr.as_arg(),
            Expr::Lit(Lit::Null(Null { span })).as_arg(),
        ];
        args.extend(children_args.into_iter().map(|c| c.as_arg()));

        let callee = self.create_pragma_callee(&self.pragma.clone());

        self.wrap_with_pure_comment(
            span,
            Expr::Call(CallExpr {
                span,
                callee,
                args,
                ..Default::default()
            }),
        )
    }

    /// Build a createElement call with spread children using .apply()
    /// E.g., React.createElement.apply(React, ["div", null].concat(children))
    fn build_call_with_spread_children_classic(
        &mut self,
        span: Span,
        tag: Expr,
        props: Expr,
        children: &[JSXElementChild],
        pragma: &Atom,
    ) -> Expr {
        // Build the base args array: [tag, props]
        let base_args = Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: vec![Some(tag.as_arg()), Some(props.as_arg())],
        });

        // Build the concat expression for spread children
        let mut concat_expr = base_args;

        // Group consecutive non-spread children into arrays, spread children stay
        // separate
        let mut current_group: Vec<Expr> = vec![];

        for child in children {
            match child {
                JSXElementChild::JSXSpreadChild(spread) => {
                    // Check if spread is an empty array literal - skip if so
                    let is_empty_array =
                        matches!(&*spread.expr, Expr::Array(arr) if arr.elems.is_empty());

                    // Flush current group
                    if !current_group.is_empty() {
                        let group_array = Expr::Array(ArrayLit {
                            span: DUMMY_SP,
                            elems: current_group.drain(..).map(|e| Some(e.as_arg())).collect(),
                        });
                        concat_expr = Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(concat_expr),
                                prop: MemberProp::Ident(IdentName::new("concat".into(), DUMMY_SP)),
                            }))),
                            args: vec![group_array.as_arg()],
                            ..Default::default()
                        });
                    }

                    // Skip concat for empty array literals
                    if is_empty_array {
                        continue;
                    }

                    // Concat the spread
                    concat_expr = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(concat_expr),
                            prop: MemberProp::Ident(IdentName::new("concat".into(), DUMMY_SP)),
                        }))),
                        args: vec![spread.expr.clone().as_arg()],
                        ..Default::default()
                    });
                }
                JSXElementChild::JSXText(text) => {
                    let s = jsx_text_to_str(text);
                    if !s.is_empty() {
                        current_group.push(Expr::Lit(Lit::Str(Str {
                            span: text.span,
                            value: s.into(),
                            raw: None,
                        })));
                    }
                }
                JSXElementChild::JSXExprContainer(container) => {
                    if let JSXExpr::Expr(expr) = &container.expr {
                        current_group.push(*expr.clone());
                    }
                }
                JSXElementChild::JSXElement(el) => {
                    current_group.push(self.jsx_elem_to_expr(*el.clone()));
                }
                JSXElementChild::JSXFragment(frag) => {
                    current_group.push(self.jsx_frag_to_expr(frag.clone()));
                }
            }
        }

        // Flush remaining group
        if !current_group.is_empty() {
            let group_array = Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: current_group
                    .into_iter()
                    .map(|e| Some(e.as_arg()))
                    .collect(),
            });
            concat_expr = Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(concat_expr),
                    prop: MemberProp::Ident(IdentName::new("concat".into(), DUMMY_SP)),
                }))),
                args: vec![group_array.as_arg()],
                ..Default::default()
            });
        }

        // Build the pragma object (e.g., "React" from "React.createElement")
        let pragma_obj = self.get_pragma_object(pragma);

        // Build: React.createElement.apply(React, args)
        let callee = self.create_pragma_callee(pragma);
        let callee_expr = match callee {
            Callee::Expr(e) => *e,
            _ => unreachable!(),
        };

        self.wrap_with_pure_comment(
            span,
            Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(callee_expr),
                    prop: MemberProp::Ident(IdentName::new("apply".into(), DUMMY_SP)),
                }))),
                args: vec![pragma_obj.as_arg(), concat_expr.as_arg()],
                ..Default::default()
            }),
        )
    }

    /// Get the pragma object (e.g., "React" from "React.createElement")
    fn get_pragma_object(&self, pragma: &Atom) -> Expr {
        if let Some(idx) = pragma.find('.') {
            let obj = &pragma[..idx];
            Expr::Ident(Ident::new(obj.into(), DUMMY_SP, self.top_level_ctxt))
        } else {
            // If no dot, the pragma itself is the object
            Expr::Ident(Ident::new(pragma.clone(), DUMMY_SP, self.top_level_ctxt))
        }
    }

    fn build_props_classic(&self, attrs: &[JSXAttrOrSpread], key: Option<Expr>) -> Expr {
        // Special case: single spread with no key -> pass spread directly
        // e.g., <Foo {...props} /> => React.createElement(Foo, props)
        if key.is_none() && attrs.len() == 1 {
            if let JSXAttrOrSpread::SpreadElement(spread) = &attrs[0] {
                return *spread.expr.clone();
            }
        }

        let mut has_spread = false;
        let mut props: Vec<PropOrSpread> = vec![];

        for attr in attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(attr) => {
                    let prop = self.jsx_attr_to_prop(attr);
                    props.push(PropOrSpread::Prop(Box::new(prop)));
                }
                JSXAttrOrSpread::SpreadElement(spread) => {
                    has_spread = true;
                    props.push(PropOrSpread::Spread(spread.clone()));
                }
            }
        }

        if let Some(key_expr) = key {
            props.insert(
                0,
                PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName::new("key".into(), DUMMY_SP)),
                    value: Box::new(key_expr),
                }))),
            );
        }

        if props.is_empty() && !has_spread {
            return Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
        }

        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        })
    }

    fn build_children_classic(&mut self, children: &[JSXElementChild]) -> Vec<Expr> {
        let mut result = vec![];

        for child in children {
            match child {
                JSXElementChild::JSXText(text) => {
                    let s = jsx_text_to_str(text);
                    if !s.is_empty() {
                        result.push(Expr::Lit(Lit::Str(Str {
                            span: text.span,
                            value: s.into(),
                            raw: None,
                        })));
                    }
                }
                JSXElementChild::JSXExprContainer(container) => {
                    if let JSXExpr::Expr(expr) = &container.expr {
                        result.push(*expr.clone());
                    }
                }
                JSXElementChild::JSXElement(el) => {
                    result.push(self.jsx_elem_to_expr(*el.clone()));
                }
                JSXElementChild::JSXFragment(frag) => {
                    result.push(self.jsx_frag_to_expr(frag.clone()));
                }
                JSXElementChild::JSXSpreadChild(spread) => {
                    result.push(*spread.expr.clone());
                }
            }
        }

        result
    }

    // =========================================================================
    // Automatic Runtime
    // =========================================================================

    fn jsx_elem_to_expr_automatic(&mut self, el: JSXElement, span: Span) -> Expr {
        let tag = self.jsx_name_to_expr(el.opening.name);
        let attrs = el.opening.attrs;
        let children = el.children;

        // Check if key exists and if we need createElement
        let has_key = attrs.iter().any(|attr| {
            matches!(attr, JSXAttrOrSpread::JSXAttr(a)
                if matches!(&a.name, JSXAttrName::Ident(i) if &*i.sym == "key"))
        });

        let children_exprs = self.build_children_automatic(&children);
        let use_jsxs = children_exprs.len() > 1;

        // Check if we need createElement (spread with key)
        let needs_create_element = self.needs_create_element(&attrs, has_key);

        if needs_create_element {
            // Use createElement - keep key in original position, add __source/__self at end
            return self.jsx_elem_to_create_element(tag, &attrs, children_exprs, span);
        }

        // Extract key from attrs for jsx/jsxs/jsxDEV
        let (key, attrs_without_key): (Option<Expr>, Vec<_>) = {
            let mut key = None;
            let mut rest = vec![];
            for attr in attrs {
                if let JSXAttrOrSpread::JSXAttr(a) = &attr {
                    if let JSXAttrName::Ident(ident) = &a.name {
                        if &*ident.sym == "key" {
                            key = Some(self.jsx_attr_value_to_expr(&a.value));
                            continue;
                        }
                    }
                }
                rest.push(attr);
            }
            (key, rest)
        };

        // In development mode, extract __source and __self from attrs for jsxDEV
        let (source_attr, self_attr, attrs_for_props) = if self.development {
            let mut source = None;
            let mut self_val = None;
            let mut rest = vec![];

            for attr in attrs_without_key.iter() {
                if let JSXAttrOrSpread::JSXAttr(a) = attr {
                    if let JSXAttrName::Ident(ident) = &a.name {
                        if &*ident.sym == "__source" {
                            source = Some(self.jsx_attr_value_to_expr(&a.value));
                            continue;
                        }
                        if &*ident.sym == "__self" {
                            self_val = Some(self.jsx_attr_value_to_expr(&a.value));
                            continue;
                        }
                    }
                }
                rest.push(attr.clone());
            }

            (source, self_val, rest)
        } else {
            (None, None, attrs_without_key)
        };

        let props = self.build_props_automatic(&attrs_for_props, children_exprs);

        let jsx_fn = if self.development {
            self.import_jsx_dev
                .get_or_insert_with(|| private_ident!("_jsxDEV"))
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

        let mut args = vec![tag.as_arg(), props.as_arg()];

        if self.development {
            // jsxDEV(type, props, key, isStaticChildren, source, self)
            args.push(
                key.map(|k| k.as_arg())
                    .unwrap_or_else(|| Expr::undefined(DUMMY_SP).as_arg()),
            );
            args.push(
                Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: use_jsxs, // isStaticChildren - true when multiple static children
                }))
                .as_arg(),
            );
            args.push(
                source_attr
                    .map(|s| s.as_arg())
                    .unwrap_or_else(|| Expr::undefined(DUMMY_SP).as_arg()),
            );
            args.push(
                self_attr
                    .map(|s| s.as_arg())
                    .unwrap_or_else(|| Expr::This(ThisExpr { span: DUMMY_SP }).as_arg()),
            );
        } else {
            // Add key argument
            if let Some(key_expr) = key {
                args.push(key_expr.as_arg());
            }
        }

        self.wrap_with_pure_comment(
            span,
            Expr::Call(CallExpr {
                span,
                callee: jsx_fn.as_callee(),
                args,
                ..Default::default()
            }),
        )
    }

    fn jsx_frag_to_expr_automatic(&mut self, frag: JSXFragment, span: Span) -> Expr {
        let children = frag.children;

        let fragment = self
            .import_fragment
            .get_or_insert_with(|| private_ident!("_Fragment"))
            .clone();

        let children_exprs = self.build_children_automatic(&children);
        let use_jsxs = children_exprs.len() > 1;

        let props = self.build_props_automatic(&[], children_exprs);

        let jsx_fn = if self.development {
            self.import_jsx_dev
                .get_or_insert_with(|| private_ident!("_jsxDEV"))
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

        let mut args = vec![fragment.as_arg(), props.as_arg()];

        if self.development {
            // jsxDEV(type, props, key, isStaticChildren, source, self)
            args.push(Expr::undefined(DUMMY_SP).as_arg()); // key
            args.push(
                Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: use_jsxs, // isStaticChildren
                }))
                .as_arg(),
            );
        }

        self.wrap_with_pure_comment(
            span,
            Expr::Call(CallExpr {
                span,
                callee: jsx_fn.as_callee(),
                args,
                ..Default::default()
            }),
        )
    }

    fn needs_create_element(&self, attrs: &[JSXAttrOrSpread], has_key: bool) -> bool {
        if !has_key {
            return false;
        }

        // If key comes after a spread, we need createElement
        let mut seen_spread = false;
        for attr in attrs {
            match attr {
                JSXAttrOrSpread::SpreadElement(_) => {
                    seen_spread = true;
                }
                JSXAttrOrSpread::JSXAttr(a) => {
                    if let JSXAttrName::Ident(ident) = &a.name {
                        if &*ident.sym == "key" && seen_spread {
                            return true;
                        }
                    }
                }
            }
        }

        false
    }

    fn jsx_elem_to_create_element(
        &mut self,
        tag: Expr,
        attrs: &[JSXAttrOrSpread],
        children: Vec<Expr>,
        span: Span,
    ) -> Expr {
        let create_element = self
            .import_create_element
            .get_or_insert_with(|| private_ident!("_createElement"))
            .clone();

        // For createElement, attrs already contain key in original position
        // We need to filter out __source/__self, as they'll be added at the end
        let (source_attr, self_attr, filtered_attrs): (Option<Expr>, Option<Expr>, Vec<_>) =
            if self.development {
                let mut source = None;
                let mut self_val = None;
                let mut rest = vec![];

                for attr in attrs.iter() {
                    if let JSXAttrOrSpread::JSXAttr(a) = attr {
                        if let JSXAttrName::Ident(ident) = &a.name {
                            if &*ident.sym == "__source" {
                                source = Some(self.jsx_attr_value_to_expr(&a.value));
                                continue;
                            }
                            if &*ident.sym == "__self" {
                                self_val = Some(self.jsx_attr_value_to_expr(&a.value));
                                continue;
                            }
                        }
                    }
                    rest.push(attr.clone());
                }

                (source, self_val, rest)
            } else {
                (None, None, attrs.to_vec())
            };

        // Build props with source/self at the end for development mode
        let props =
            self.build_props_for_create_element(&filtered_attrs, source_attr, self_attr, span);
        let mut args = vec![tag.as_arg(), props.as_arg()];
        args.extend(children.into_iter().map(|c| c.as_arg()));

        self.wrap_with_pure_comment(
            span,
            Expr::Call(CallExpr {
                span,
                callee: create_element.as_callee(),
                args,
                ..Default::default()
            }),
        )
    }

    fn build_props_for_create_element(
        &self,
        attrs: &[JSXAttrOrSpread],
        source: Option<Expr>,
        self_attr: Option<Expr>,
        span: Span,
    ) -> Expr {
        let mut props: Vec<PropOrSpread> = vec![];

        for attr in attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(attr) => {
                    let prop = self.jsx_attr_to_prop(attr);
                    props.push(PropOrSpread::Prop(Box::new(prop)));
                }
                JSXAttrOrSpread::SpreadElement(spread) => {
                    props.push(PropOrSpread::Spread(spread.clone()));
                }
            }
        }

        // Add __source and __self at the end for development mode
        if let Some(source_expr) = source {
            props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(IdentName::new("__source".into(), DUMMY_SP)),
                value: Box::new(source_expr),
            }))));
        }

        if let Some(self_expr) = self_attr {
            props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(IdentName::new("__self".into(), DUMMY_SP)),
                value: Box::new(self_expr),
            }))));
        }

        if props.is_empty() {
            return Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
        }

        Expr::Object(ObjectLit { span, props })
    }

    fn build_props_automatic(&self, attrs: &[JSXAttrOrSpread], children: Vec<Expr>) -> Expr {
        let mut props: Vec<PropOrSpread> = vec![];

        for attr in attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(attr) => {
                    let prop = self.jsx_attr_to_prop(attr);
                    props.push(PropOrSpread::Prop(Box::new(prop)));
                }
                JSXAttrOrSpread::SpreadElement(spread) => {
                    props.push(PropOrSpread::Spread(spread.clone()));
                }
            }
        }

        // Add children prop
        match children.len() {
            0 => {}
            1 => {
                props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName::new("children".into(), DUMMY_SP)),
                    value: Box::new(children.into_iter().next().unwrap()),
                }))));
            }
            _ => {
                props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: PropName::Ident(IdentName::new("children".into(), DUMMY_SP)),
                    value: Box::new(Expr::Array(ArrayLit {
                        span: DUMMY_SP,
                        elems: children.into_iter().map(|c| Some(c.as_arg())).collect(),
                    })),
                }))));
            }
        }

        Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props,
        })
    }

    fn build_children_automatic(&mut self, children: &[JSXElementChild]) -> Vec<Expr> {
        let mut result = vec![];

        for child in children {
            match child {
                JSXElementChild::JSXText(text) => {
                    let s = jsx_text_to_str(text);
                    if !s.is_empty() {
                        result.push(Expr::Lit(Lit::Str(Str {
                            span: text.span,
                            value: s.into(),
                            raw: None,
                        })));
                    }
                }
                JSXElementChild::JSXExprContainer(container) => {
                    if let JSXExpr::Expr(expr) = &container.expr {
                        result.push(*expr.clone());
                    }
                }
                JSXElementChild::JSXElement(el) => {
                    result.push(self.jsx_elem_to_expr(*el.clone()));
                }
                JSXElementChild::JSXFragment(frag) => {
                    result.push(self.jsx_frag_to_expr(frag.clone()));
                }
                JSXElementChild::JSXSpreadChild(spread) => {
                    result.push(*spread.expr.clone());
                }
            }
        }

        result
    }

    // =========================================================================
    // Common helpers
    // =========================================================================

    fn jsx_name_to_expr(&self, name: JSXElementName) -> Expr {
        match name {
            JSXElementName::Ident(ident) => {
                let name = &*ident.sym;

                // Check if it's a component (starts with uppercase) or built-in element
                if name
                    .chars()
                    .next()
                    .map(|c| c.is_lowercase())
                    .unwrap_or(false)
                    && !name.contains('-')
                {
                    // Built-in HTML element - return as string
                    Expr::Lit(Lit::Str(Str {
                        span: ident.span,
                        value: ident.sym.as_str().into(),
                        raw: None,
                    }))
                } else {
                    // Component - preserve the original identifier with its context
                    // The resolver has already added the correct SyntaxContext
                    Expr::Ident(ident)
                }
            }
            JSXElementName::JSXMemberExpr(member) => self.jsx_member_expr_to_expr(member),
            JSXElementName::JSXNamespacedName(ns) => {
                if self.throw_if_namespace {
                    // In a real implementation, we'd emit an error here
                    // For now, just convert it
                }
                let name = format!("{}:{}", ns.ns.sym, ns.name.sym);
                Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: name.into(),
                    raw: None,
                }))
            }
        }
    }

    fn jsx_member_expr_to_expr(&self, member: JSXMemberExpr) -> Expr {
        let obj = match member.obj {
            // Preserve the original identifier with its context
            JSXObject::Ident(ident) => Box::new(Expr::Ident(ident)),
            JSXObject::JSXMemberExpr(inner) => Box::new(self.jsx_member_expr_to_expr(*inner)),
        };

        Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj,
            prop: MemberProp::Ident(IdentName::new(member.prop.sym, member.prop.span)),
        })
    }

    fn jsx_attr_to_prop(&self, attr: &JSXAttr) -> Prop {
        let key = match &attr.name {
            JSXAttrName::Ident(ident) => {
                let name = &*ident.sym;
                // Convert class to className, for to htmlFor, etc. (if needed)
                PropName::Ident(IdentName::new(ident.sym.clone(), ident.span))
            }
            JSXAttrName::JSXNamespacedName(ns) => {
                let name = format!("{}:{}", ns.ns.sym, ns.name.sym);
                PropName::Str(Str {
                    span: DUMMY_SP,
                    value: name.into(),
                    raw: None,
                })
            }
        };

        let value = self.jsx_attr_value_to_expr(&attr.value);

        Prop::KeyValue(KeyValueProp {
            key,
            value: Box::new(value),
        })
    }

    fn jsx_attr_value_to_expr(&self, value: &Option<JSXAttrValue>) -> Expr {
        match value {
            None => Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            })),
            Some(JSXAttrValue::Str(s)) => {
                // JSX string attributes need normalization:
                // - Newlines and surrounding whitespace collapse to a single space
                // - Clear raw so the printer properly re-escapes the string
                let value_str = s.value.to_string_lossy();
                let normalized = normalize_jsx_attr_string(&value_str);
                Expr::Lit(Lit::Str(Str {
                    span: s.span,
                    value: normalized.into(),
                    raw: None,
                }))
            }
            Some(JSXAttrValue::JSXExprContainer(container)) => match &container.expr {
                JSXExpr::Expr(expr) => *expr.clone(),
                JSXExpr::JSXEmptyExpr(_) => Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })),
            },
            Some(JSXAttrValue::JSXElement(el)) => {
                // Recursively convert nested JSX elements
                // This is a bit tricky with the borrow checker
                Expr::JSXElement(el.clone())
            }
            Some(JSXAttrValue::JSXFragment(frag)) => Expr::JSXFragment(frag.clone()),
        }
    }

    fn create_pragma_callee(&self, pragma: &Atom) -> Callee {
        // Parse pragma like "React.createElement" into member expression
        // Use top_level_ctxt for pragma identifiers since they reference top-level
        // bindings
        let parts: Vec<&str> = pragma.split('.').collect();

        if parts.len() == 1 {
            return Callee::Expr(Box::new(Expr::Ident(Ident::new(
                parts[0].into(),
                DUMMY_SP,
                self.top_level_ctxt,
            ))));
        }

        let mut expr: Expr =
            Expr::Ident(Ident::new(parts[0].into(), DUMMY_SP, self.top_level_ctxt));

        for part in &parts[1..] {
            expr = Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(expr),
                prop: MemberProp::Ident(IdentName::new((*part).into(), DUMMY_SP)),
            });
        }

        Callee::Expr(Box::new(expr))
    }

    fn wrap_with_pure_comment(&self, span: Span, expr: Expr) -> Expr {
        if let Some(comments) = &self.comments {
            comments.add_leading(
                span.lo,
                Comment {
                    kind: CommentKind::Block,
                    span: DUMMY_SP,
                    text: "#__PURE__".into(),
                },
            );
        }
        expr
    }

    // =========================================================================
    // Import injection
    // =========================================================================

    fn inject_imports_esm(&mut self, body: &mut Vec<ModuleItem>) {
        let mut specifiers = vec![];

        if let Some(jsx) = &self.import_jsx {
            specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                span: DUMMY_SP,
                local: jsx.clone(),
                imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                    "jsx".into(),
                    DUMMY_SP,
                ))),
                is_type_only: false,
            }));
        }

        if let Some(jsxs) = &self.import_jsxs {
            specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                span: DUMMY_SP,
                local: jsxs.clone(),
                imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                    "jsxs".into(),
                    DUMMY_SP,
                ))),
                is_type_only: false,
            }));
        }

        if let Some(jsx_dev) = &self.import_jsx_dev {
            specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                span: DUMMY_SP,
                local: jsx_dev.clone(),
                imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                    "jsxDEV".into(),
                    DUMMY_SP,
                ))),
                is_type_only: false,
            }));
        }

        if let Some(fragment) = &self.import_fragment {
            specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                span: DUMMY_SP,
                local: fragment.clone(),
                imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                    "Fragment".into(),
                    DUMMY_SP,
                ))),
                is_type_only: false,
            }));
        }

        let runtime_source = if self.development {
            format!("{}/jsx-dev-runtime", self.import_source)
        } else {
            format!("{}/jsx-runtime", self.import_source)
        };

        // Inject createElement import if needed (before jsx-runtime import)
        if let Some(create_element) = &self.import_create_element {
            body.insert(
                0,
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    specifiers: vec![ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: create_element.clone(),
                        imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                            "createElement".into(),
                            DUMMY_SP,
                        ))),
                        is_type_only: false,
                    })],
                    src: Box::new(Str {
                        span: DUMMY_SP,
                        value: self.import_source.clone().into(),
                        raw: None,
                    }),
                    type_only: false,
                    with: None,
                    phase: Default::default(),
                })),
            );
        }

        if !specifiers.is_empty() {
            body.insert(
                0,
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    specifiers,
                    src: Box::new(Str {
                        span: DUMMY_SP,
                        value: runtime_source.into(),
                        raw: None,
                    }),
                    type_only: false,
                    with: None,
                    phase: Default::default(),
                })),
            );
        }
    }

    fn inject_imports_cjs(&mut self, body: &mut Vec<Stmt>) {
        // For CommonJS, we use require() instead of import
        let mut has_jsx_runtime = false;
        let mut has_create_element = false;

        let runtime_source = if self.development {
            format!("{}/jsx-dev-runtime", self.import_source)
        } else {
            format!("{}/jsx-runtime", self.import_source)
        };

        // Check what we need from jsx-runtime
        let mut jsx_runtime_props = vec![];

        if let Some(jsx) = &self.import_jsx {
            has_jsx_runtime = true;
            jsx_runtime_props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(IdentName::new("jsx".into(), DUMMY_SP)),
                value: Box::new(Pat::Ident(jsx.clone().into())),
            }));
        }

        if let Some(jsxs) = &self.import_jsxs {
            has_jsx_runtime = true;
            jsx_runtime_props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(IdentName::new("jsxs".into(), DUMMY_SP)),
                value: Box::new(Pat::Ident(jsxs.clone().into())),
            }));
        }

        if let Some(jsx_dev) = &self.import_jsx_dev {
            has_jsx_runtime = true;
            jsx_runtime_props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(IdentName::new("jsxDEV".into(), DUMMY_SP)),
                value: Box::new(Pat::Ident(jsx_dev.clone().into())),
            }));
        }

        if let Some(fragment) = &self.import_fragment {
            has_jsx_runtime = true;
            jsx_runtime_props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(IdentName::new("Fragment".into(), DUMMY_SP)),
                value: Box::new(Pat::Ident(fragment.clone().into())),
            }));
        }

        // Insert createElement first (so it ends up after jsx-runtime)
        if let Some(create_element) = &self.import_create_element {
            // const { createElement: _createElement } = require("react")
            body.insert(
                0,
                Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Object(ObjectPat {
                            span: DUMMY_SP,
                            props: vec![ObjectPatProp::KeyValue(KeyValuePatProp {
                                key: PropName::Ident(IdentName::new(
                                    "createElement".into(),
                                    DUMMY_SP,
                                )),
                                value: Box::new(Pat::Ident(create_element.clone().into())),
                            })],
                            optional: false,
                            type_ann: None,
                        }),
                        init: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                                "require".into(),
                                DUMMY_SP,
                                self.unresolved_ctxt,
                            )))),
                            args: vec![Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: self.import_source.clone().into(),
                                raw: None,
                            }))
                            .as_arg()],
                            ..Default::default()
                        }))),
                        definite: false,
                    }],
                }))),
            );
        }

        if has_jsx_runtime {
            // const { jsx: _jsx, ... } = require("react/jsx-runtime")
            body.insert(
                0,
                Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Object(ObjectPat {
                            span: DUMMY_SP,
                            props: jsx_runtime_props,
                            optional: false,
                            type_ann: None,
                        }),
                        init: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                                "require".into(),
                                DUMMY_SP,
                                self.unresolved_ctxt,
                            )))),
                            args: vec![Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: runtime_source.into(),
                                raw: None,
                            }))
                            .as_arg()],
                            ..Default::default()
                        }))),
                        definite: false,
                    }],
                }))),
            );
        }
    }
}

/// Convert JSX text to a string, handling whitespace.
///
/// JSX text whitespace handling follows React's behavior:
/// - Lines containing only whitespace are removed (but single-line spaces are
///   kept)
/// - Leading whitespace (indentation) is trimmed
/// - Trailing whitespace on lines is preserved if the line has content
/// - Multiple consecutive whitespace becomes a single space
/// Check if a character is JSX whitespace (ASCII whitespace only).
/// Non-breaking spaces (\u00A0) should be treated as content, not whitespace.
fn is_jsx_whitespace(c: char) -> bool {
    matches!(c, ' ' | '\t' | '\n' | '\r')
}

/// Trim JSX whitespace from the start of a string (ASCII whitespace only).
fn trim_jsx_start(s: &str) -> &str {
    s.trim_start_matches(|c| is_jsx_whitespace(c))
}

/// Trim JSX whitespace from the end of a string (ASCII whitespace only).
fn trim_jsx_end(s: &str) -> &str {
    s.trim_end_matches(|c| is_jsx_whitespace(c))
}

/// Check if a string contains only JSX whitespace (ASCII whitespace only).
fn is_jsx_whitespace_only(s: &str) -> bool {
    s.chars().all(is_jsx_whitespace)
}

fn jsx_text_to_str(text: &JSXText) -> String {
    let value = &*text.value;

    // Special case: if text has no newlines, preserve it as-is
    // This handles cases like: "  " or "  {p}  " where spaces should be kept
    if !value.contains('\n') && !value.contains('\r') {
        return value.to_string();
    }

    let lines: Vec<&str> = value.lines().collect();

    if lines.is_empty() {
        return String::new();
    }

    // Check if original first line has content (determines if we preserve leading
    // whitespace)
    let first_line_has_content = lines
        .first()
        .map(|l| !is_jsx_whitespace_only(l))
        .unwrap_or(false);

    // Check if original last line has content (determines if we preserve trailing
    // whitespace)
    let last_line_has_content = lines
        .last()
        .map(|l| !is_jsx_whitespace_only(l))
        .unwrap_or(false);

    let last_line_idx = lines.len() - 1;

    // Process lines
    let mut processed: Vec<String> = vec![];

    for (i, line) in lines.iter().enumerate() {
        if is_jsx_whitespace_only(line) {
            continue; // Skip blank lines
        }

        // Determine leading whitespace handling
        let trimmed = if processed.is_empty() && first_line_has_content && i == 0 {
            // First non-blank line: preserve leading whitespace if original first line had
            // content
            line.to_string()
        } else {
            // Trim leading whitespace
            trim_jsx_start(line).to_string()
        };

        // Determine trailing whitespace handling:
        // Preserve trailing whitespace only if this is the actual last line AND it has
        // content
        let trimmed = if i == last_line_idx && last_line_has_content {
            trimmed
        } else {
            trim_jsx_end(&trimmed).to_string()
        };

        if !is_jsx_whitespace_only(&trimmed) {
            processed.push(trimmed);
        }
    }

    if processed.is_empty() {
        return String::new();
    }

    // Join with single space
    processed.join(" ")
}

/// Normalize a JSX attribute string value.
///
/// JSX attribute strings have special handling:
/// - Newlines and surrounding whitespace are collapsed to a single space
fn normalize_jsx_attr_string(s: &str) -> String {
    let mut result = String::with_capacity(s.len());
    let mut last_was_whitespace = false;

    for c in s.chars() {
        if c == '\n' || c == '\r' {
            // Newlines become spaces and trigger whitespace collapsing
            if !last_was_whitespace {
                result.push(' ');
            }
            last_was_whitespace = true;
        } else if c.is_whitespace() {
            // Collapse consecutive whitespace
            if !last_was_whitespace {
                result.push(' ');
            }
            last_was_whitespace = true;
        } else {
            result.push(c);
            last_was_whitespace = false;
        }
    }

    result
}
