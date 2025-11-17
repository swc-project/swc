//! JSX transformation implementation.

use swc_atoms::Atom;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use super::{JsxOptions, Runtime};
use crate::{
    common::{ModuleImports, VarDeclarations},
    TransformCtx,
};

/// JSX transformer implementing the VisitMutHook pattern.
///
/// This transformer converts JSX syntax into JavaScript function calls,
/// supporting both classic (React.createElement) and automatic (_jsx, _jsxs)
/// runtimes.
pub struct JsxTransform {
    options: JsxOptions,
    module_imports: ModuleImports,
    var_declarations: VarDeclarations,

    // Track which helper imports are needed for automatic runtime
    needs_jsx: bool,
    needs_jsxs: bool,
    needs_fragment: bool,
}

impl JsxTransform {
    /// Creates a new JSX transformer with the given options.
    pub fn new(options: JsxOptions) -> Self {
        Self {
            options,
            module_imports: ModuleImports::new(),
            var_declarations: VarDeclarations::new(),
            needs_jsx: false,
            needs_jsxs: false,
            needs_fragment: false,
        }
    }

    /// Transforms a JSX element to an expression.
    fn jsx_elem_to_expr(&mut self, elem: JSXElement, ctx: &mut TransformCtx) -> Box<Expr> {
        let JSXElement {
            opening, children, ..
        } = elem;

        // Extract the tag name
        let tag_expr = self.jsx_name_to_expr(&opening.name);

        // Check if this is a fragment-like component
        let is_fragment =
            matches!(&opening.name, JSXElementName::Ident(i) if &*i.sym == "Fragment");

        // Process attributes to create props object
        let (props, key_prop) = self.process_attributes(&opening.attrs, ctx);

        // Process children
        let processed_children = self.process_children(children, ctx);

        // Determine if we need jsxs (multiple children)
        let use_jsxs = processed_children.len() > 1;

        match self.options.runtime {
            Runtime::Automatic => self.create_automatic_runtime_call(
                tag_expr,
                props,
                key_prop,
                processed_children,
                use_jsxs,
                is_fragment,
            ),
            Runtime::Classic => {
                self.create_classic_runtime_call(tag_expr, props, processed_children)
            }
        }
    }

    /// Transforms a JSX fragment to an expression.
    fn jsx_frag_to_expr(&mut self, frag: JSXFragment, ctx: &mut TransformCtx) -> Box<Expr> {
        let children = self.process_children(frag.children, ctx);
        let use_jsxs = children.len() > 1;

        match self.options.runtime {
            Runtime::Automatic => {
                self.needs_fragment = true;
                let fragment_expr = Box::new(Expr::Ident(Ident::new(
                    "_Fragment".into(),
                    DUMMY_SP,
                    Default::default(),
                )));

                self.create_automatic_runtime_call(
                    fragment_expr,
                    None,
                    None,
                    children,
                    use_jsxs,
                    true,
                )
            }
            Runtime::Classic => {
                let fragment_expr = self.get_fragment_expr();
                self.create_classic_runtime_call(fragment_expr, None, children)
            }
        }
    }

    /// Converts a JSX element/attribute name to an expression.
    fn jsx_name_to_expr(&self, name: &JSXElementName) -> Box<Expr> {
        match name {
            JSXElementName::Ident(ident) => {
                let sym = &ident.sym;
                // Lowercase names are strings, uppercase are identifiers
                if sym.chars().next().unwrap().is_lowercase() {
                    Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: sym.clone().into(),
                        raw: None,
                    })))
                } else {
                    Box::new(Expr::Ident(Ident::new(
                        sym.clone(),
                        DUMMY_SP,
                        Default::default(),
                    )))
                }
            }
            JSXElementName::JSXMemberExpr(member) => self.jsx_member_expr_to_expr(member),
            JSXElementName::JSXNamespacedName(namespaced) => {
                // Convert namespace to string "namespace:name"
                let name = format!("{}:{}", namespaced.ns.sym, namespaced.name.sym);
                Box::new(Expr::Lit(Lit::Str(Str {
                    span: DUMMY_SP,
                    value: name.into(),
                    raw: None,
                })))
            }
        }
    }

    /// Converts a JSX member expression to an expression.
    fn jsx_member_expr_to_expr(&self, member: &JSXMemberExpr) -> Box<Expr> {
        let obj = match &member.obj {
            JSXObject::Ident(ident) => Box::new(Expr::Ident(Ident::new(
                ident.sym.clone(),
                DUMMY_SP,
                Default::default(),
            ))),
            JSXObject::JSXMemberExpr(nested) => self.jsx_member_expr_to_expr(nested),
        };

        Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: obj.into(),
            prop: MemberProp::Ident(IdentName::new(member.prop.sym.clone(), DUMMY_SP)),
        }))
    }

    /// Processes JSX attributes into props object and extracts key.
    fn process_attributes(
        &self,
        attrs: &[JSXAttrOrSpread],
        _ctx: &mut TransformCtx,
    ) -> (Option<Box<Expr>>, Option<Box<Expr>>) {
        if attrs.is_empty() {
            return (None, None);
        }

        let mut props = Vec::new();
        let mut key_prop = None;

        for attr in attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(jsx_attr) => {
                    let prop_name = self.jsx_attr_name_to_prop_name(&jsx_attr.name);

                    // Extract key separately for automatic runtime
                    if self.options.runtime == Runtime::Automatic {
                        if let PropName::Ident(ident) = &prop_name {
                            if &*ident.sym == "key" {
                                if let Some(value) = &jsx_attr.value {
                                    key_prop = Some(self.jsx_attr_value_to_expr(value));
                                }
                                continue;
                            }
                        }
                    }

                    let value = if let Some(v) = &jsx_attr.value {
                        self.jsx_attr_value_to_expr(v)
                    } else {
                        // Boolean attribute with no value defaults to true
                        Box::new(Expr::Lit(Lit::Bool(Bool {
                            span: DUMMY_SP,
                            value: true,
                        })))
                    };

                    props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: prop_name,
                        value,
                    }))));
                }
                JSXAttrOrSpread::SpreadElement(spread) => {
                    props.push(PropOrSpread::Spread(SpreadElement {
                        dot3_token: DUMMY_SP,
                        expr: spread.expr.clone(),
                    }));
                }
            }
        }

        let props_obj = if props.is_empty() {
            None
        } else {
            Some(Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props,
            })))
        };

        (props_obj, key_prop)
    }

    /// Converts JSX attribute name to property name.
    fn jsx_attr_name_to_prop_name(&self, name: &JSXAttrName) -> PropName {
        match name {
            JSXAttrName::Ident(ident) => {
                let sym = &ident.sym;
                // Check if the identifier contains hyphens
                if sym.contains('-') {
                    PropName::Str(Str {
                        span: DUMMY_SP,
                        value: sym.clone().into(),
                        raw: None,
                    })
                } else {
                    PropName::Ident(IdentName::new(sym.clone(), DUMMY_SP))
                }
            }
            JSXAttrName::JSXNamespacedName(namespaced) => {
                let name = format!("{}:{}", namespaced.ns.sym, namespaced.name.sym);
                PropName::Str(Str {
                    span: DUMMY_SP,
                    value: name.into(),
                    raw: None,
                })
            }
        }
    }

    /// Converts JSX attribute value to expression.
    fn jsx_attr_value_to_expr(&self, value: &JSXAttrValue) -> Box<Expr> {
        match value {
            JSXAttrValue::Str(s) => Box::new(Expr::Lit(Lit::Str(s.clone()))),
            JSXAttrValue::JSXExprContainer(container) => match &container.expr {
                JSXExpr::Expr(expr) => expr.clone(),
                JSXExpr::JSXEmptyExpr(_) => {
                    // Empty expression becomes undefined
                    Box::new(Expr::Ident(Ident::new(
                        "undefined".into(),
                        DUMMY_SP,
                        Default::default(),
                    )))
                }
            },
            JSXAttrValue::JSXElement(_elem) => {
                // Recursively transform nested JSX element
                // TODO: Proper recursive transformation
                Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                        "_jsx".into(),
                        DUMMY_SP,
                        Default::default(),
                    )))),
                    args: vec![],
                    ..Default::default()
                }))
            }
            JSXAttrValue::JSXFragment(_frag) => {
                // Recursively transform nested JSX fragment
                // TODO: Proper recursive transformation
                Box::new(Expr::Ident(Ident::new(
                    "undefined".into(),
                    DUMMY_SP,
                    Default::default(),
                )))
            }
        }
    }

    /// Processes JSX children into expressions.
    fn process_children(
        &self,
        children: Vec<JSXElementChild>,
        ctx: &mut TransformCtx,
    ) -> Vec<Box<Expr>> {
        children
            .into_iter()
            .filter_map(|child| self.jsx_child_to_expr(child, ctx))
            .collect()
    }

    /// Converts a JSX child to an expression, filtering out empty text nodes.
    fn jsx_child_to_expr(
        &self,
        child: JSXElementChild,
        _ctx: &mut TransformCtx,
    ) -> Option<Box<Expr>> {
        match child {
            JSXElementChild::JSXText(text) => {
                let normalized = self.normalize_jsx_text(&text.value);
                if normalized.is_empty() {
                    None
                } else {
                    Some(Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: normalized.into(),
                        raw: None,
                    }))))
                }
            }
            JSXElementChild::JSXExprContainer(container) => match container.expr {
                JSXExpr::Expr(expr) => Some(expr),
                JSXExpr::JSXEmptyExpr(_) => None,
            },
            JSXElementChild::JSXElement(_elem) => {
                // TODO: Recursive transformation
                Some(Box::new(Expr::Ident(Ident::new(
                    "null".into(),
                    DUMMY_SP,
                    Default::default(),
                ))))
            }
            JSXElementChild::JSXFragment(_frag) => {
                // TODO: Recursive transformation
                Some(Box::new(Expr::Ident(Ident::new(
                    "null".into(),
                    DUMMY_SP,
                    Default::default(),
                ))))
            }
            JSXElementChild::JSXSpreadChild(_) => {
                // Spread children are not commonly supported
                None
            }
        }
    }

    /// Normalizes JSX text by handling whitespace like React does.
    fn normalize_jsx_text(&self, text: &Atom) -> String {
        let s = text.as_ref();

        // Split into lines
        let lines: Vec<&str> = s.lines().collect();
        if lines.is_empty() {
            return String::new();
        }

        let mut result = Vec::new();

        for (i, line) in lines.iter().enumerate() {
            let is_first = i == 0;
            let is_last = i == lines.len() - 1;
            let is_only = lines.len() == 1;

            let trimmed = if is_only {
                line.trim()
            } else if is_first {
                line.trim_end()
            } else if is_last {
                line.trim_start()
            } else {
                line.trim()
            };

            if !trimmed.is_empty() {
                result.push(trimmed);
            }
        }

        result.join(" ")
    }

    /// Creates a call expression for automatic runtime.
    fn create_automatic_runtime_call(
        &mut self,
        tag: Box<Expr>,
        props: Option<Box<Expr>>,
        key: Option<Box<Expr>>,
        children: Vec<Box<Expr>>,
        use_jsxs: bool,
        _is_fragment: bool,
    ) -> Box<Expr> {
        // Track which import we need
        if use_jsxs {
            self.needs_jsxs = true;
        } else {
            self.needs_jsx = true;
        }

        // Build props object with children
        let props_with_children = if children.is_empty() {
            props.unwrap_or_else(|| {
                Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                }))
            })
        } else {
            let children_value = if children.len() == 1 {
                children.into_iter().next().unwrap()
            } else {
                Box::new(Expr::Array(ArrayLit {
                    span: DUMMY_SP,
                    elems: children
                        .into_iter()
                        .map(|child| {
                            Some(ExprOrSpread {
                                spread: None,
                                expr: child,
                            })
                        })
                        .collect(),
                }))
            };

            let mut props_vec = if let Some(Expr::Object(obj)) = props.map(|p| *p) {
                obj.props
            } else {
                vec![]
            };

            props_vec.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(IdentName::new("children".into(), DUMMY_SP)),
                value: children_value,
            }))));

            Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: props_vec,
            }))
        };

        // Create the call: _jsx(tag, props) or _jsxs(tag, props)
        let callee_name = if use_jsxs { "_jsxs" } else { "_jsx" };

        let mut args = vec![
            ExprOrSpread {
                spread: None,
                expr: tag,
            },
            ExprOrSpread {
                spread: None,
                expr: props_with_children,
            },
        ];

        // Add key if present
        if let Some(key_expr) = key {
            args.push(ExprOrSpread {
                spread: None,
                expr: key_expr,
            });
        }

        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                callee_name.into(),
                DUMMY_SP,
                Default::default(),
            )))),
            args,
            ..Default::default()
        }))
    }

    /// Creates a call expression for classic runtime.
    fn create_classic_runtime_call(
        &self,
        tag: Box<Expr>,
        props: Option<Box<Expr>>,
        children: Vec<Box<Expr>>,
    ) -> Box<Expr> {
        let pragma = self.get_pragma_expr();

        let mut args = vec![
            ExprOrSpread {
                spread: None,
                expr: tag,
            },
            ExprOrSpread {
                spread: None,
                expr: props
                    .unwrap_or_else(|| Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP })))),
            },
        ];

        // Add children as remaining arguments
        for child in children {
            args.push(ExprOrSpread {
                spread: None,
                expr: child,
            });
        }

        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(pragma),
            args,
            ..Default::default()
        }))
    }

    /// Gets the pragma expression for classic runtime.
    fn get_pragma_expr(&self) -> Box<Expr> {
        let pragma = self
            .options
            .pragma
            .as_deref()
            .unwrap_or("React.createElement");

        // Parse pragma (e.g., "React.createElement" -> MemberExpr)
        if pragma.contains('.') {
            let parts: Vec<&str> = pragma.split('.').collect();
            let mut expr = Box::new(Expr::Ident(Ident::new(
                parts[0].into(),
                DUMMY_SP,
                Default::default(),
            )));

            for part in &parts[1..] {
                expr = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: expr.into(),
                    prop: MemberProp::Ident(IdentName::new((*part).into(), DUMMY_SP)),
                }));
            }

            expr
        } else {
            Box::new(Expr::Ident(Ident::new(
                pragma.into(),
                DUMMY_SP,
                Default::default(),
            )))
        }
    }

    /// Gets the fragment expression for classic runtime.
    fn get_fragment_expr(&self) -> Box<Expr> {
        let pragma_frag = self
            .options
            .pragma_frag
            .as_deref()
            .unwrap_or("React.Fragment");

        // Parse pragma_frag (e.g., "React.Fragment" -> MemberExpr)
        if pragma_frag.contains('.') {
            let parts: Vec<&str> = pragma_frag.split('.').collect();
            let mut expr = Box::new(Expr::Ident(Ident::new(
                parts[0].into(),
                DUMMY_SP,
                Default::default(),
            )));

            for part in &parts[1..] {
                expr = Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: expr.into(),
                    prop: MemberProp::Ident(IdentName::new((*part).into(), DUMMY_SP)),
                }));
            }

            expr
        } else {
            Box::new(Expr::Ident(Ident::new(
                pragma_frag.into(),
                DUMMY_SP,
                Default::default(),
            )))
        }
    }

    /// Injects necessary imports for automatic runtime.
    fn inject_imports(&mut self, module_body: &mut Vec<ModuleItem>) {
        if self.options.runtime != Runtime::Automatic {
            return;
        }

        let runtime_path = if self.options.development {
            format!("{}/jsx-dev-runtime", self.options.import_source)
        } else {
            format!("{}/jsx-runtime", self.options.import_source)
        };

        // Add imports based on what's needed
        if self.needs_jsx {
            self.module_imports
                .add_named_import(&runtime_path, "jsx", "_jsx");
        }
        if self.needs_jsxs {
            self.module_imports
                .add_named_import(&runtime_path, "jsxs", "_jsxs");
        }
        if self.needs_fragment {
            self.module_imports
                .add_named_import(&runtime_path, "Fragment", "_Fragment");
        }

        // Generate import statements
        let imports = self.module_imports.build_stmts();
        module_body.splice(0..0, imports);
    }
}

impl<C> VisitMutHook<C> for JsxTransform {
    /// Called when entering a program node.
    fn enter_program(&mut self, _n: &mut Program, _ctx: &mut C) {
        // Reset state for new program
        self.needs_jsx = false;
        self.needs_jsxs = false;
        self.needs_fragment = false;
    }

    /// Called when exiting a program node.
    fn exit_program(&mut self, _n: &mut Program, _ctx: &mut C) {
        // Finalization happens in module/script visitors
    }
}

impl VisitMut for JsxTransform {
    /// Transform JSX expressions.
    fn visit_mut_expr(&mut self, n: &mut Expr) {
        // Visit children first
        n.visit_mut_children_with(self);

        // We need a mutable TransformCtx but we don't have one in VisitMut
        // For now, create a dummy one - this will be improved when integrated
        // TODO: Pass ctx through properly
        let source_map = swc_common::sync::Lrc::new(swc_common::SourceMap::default());
        let handler = swc_common::sync::Lrc::new(swc_common::errors::Handler::with_emitter(
            true,
            false,
            Box::new(swc_common::errors::EmitterWriter::new(
                Box::new(std::io::stderr()),
                Some(source_map.clone()),
                false,
                true,
            )),
        ));
        let mut ctx = TransformCtx::new(
            std::path::PathBuf::new(),
            std::sync::Arc::new(String::new()),
            source_map,
            handler,
        );

        // Transform JSX element
        match n {
            Expr::JSXElement(elem) => {
                let elem_taken = elem.take();
                let transformed = self.jsx_elem_to_expr(*elem_taken, &mut ctx);
                *n = *transformed;
            }
            Expr::JSXFragment(frag) => {
                let frag_taken = frag.take();
                let transformed = self.jsx_frag_to_expr(frag_taken, &mut ctx);
                *n = *transformed;
            }
            _ => {}
        }
    }

    /// Inject imports when exiting a module.
    fn visit_mut_module(&mut self, n: &mut Module) {
        // Visit all children first to collect what imports we need
        n.visit_mut_children_with(self);

        // Inject imports at the top
        self.inject_imports(&mut n.body);
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{sync::Lrc, SourceMap};

    use super::*;

    #[test]
    fn test_jsx_transform_creation() {
        let options = JsxOptions::default();
        let _transform = JsxTransform::new(options);
    }

    #[test]
    fn test_normalize_jsx_text() {
        let options = JsxOptions::default();
        let transform = JsxTransform::new(options);

        // Test whitespace normalization
        assert_eq!(transform.normalize_jsx_text(&"hello".into()), "hello");
        assert_eq!(transform.normalize_jsx_text(&"  hello  ".into()), "hello");
        assert_eq!(
            transform.normalize_jsx_text(&"hello\n  world".into()),
            "hello world"
        );
        assert_eq!(
            transform.normalize_jsx_text(&"\n  hello\n  world\n".into()),
            "hello world"
        );
    }

    #[test]
    fn test_jsx_options_builder() {
        let options = JsxOptions::new()
            .with_runtime(Runtime::Classic)
            .with_pragma("h")
            .with_pragma_frag("Fragment")
            .with_development(true);

        assert_eq!(options.runtime, Runtime::Classic);
        assert_eq!(options.pragma, Some("h".to_string()));
        assert_eq!(options.pragma_frag, Some("Fragment".to_string()));
        assert!(options.development);
    }
}
