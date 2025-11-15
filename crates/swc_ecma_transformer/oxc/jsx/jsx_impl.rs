//! React JSX
//!
//! This plugin transforms React JSX to JS.
//!
//! > This plugin is included in `preset-react`.
//!
//! Has two modes which create different output:
//! 1. Automatic
//! 2. Classic
//!
//! And also prod/dev modes:
//! 1. Production
//! 2. Development
//!
//! ## Example
//!
//! ### Automatic
//!
//! Input:
//! ```js
//! <div>foo</div>;
//! <Bar>foo</Bar>;
//! <>foo</>;
//! ```
//!
//! Output:
//! ```js
//! // Production mode
//! import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
//! _jsx("div", { children: "foo" });
//! _jsx(Bar, { children: "foo" });
//! _jsx(_Fragment, { children: "foo" });
//! ```
//!
//! ```js
//! // Development mode
//! var _jsxFileName = "<CWD>/test.js";
//! import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
//! _jsxDEV(
//!     "div", { children: "foo" }, void 0, false,
//!     { fileName: _jsxFileName, lineNumber: 1, columnNumber: 1 },
//!     this
//! );
//! _jsxDEV(
//!     Bar, { children: "foo" }, void 0, false,
//!     { fileName: _jsxFileName, lineNumber: 2, columnNumber: 1 },
//!     this
//! );
//! _jsxDEV(_Fragment, { children: "foo" }, void 0, false);
//! ```
//!
//! ### Classic
//!
//! Input:
//! ```js
//! <div>foo</div>;
//! <Bar>foo</Bar>;
//! <>foo</>;
//! ```
//!
//! Output:
//! ```js
//! // Production mode
//! React.createElement("div", null, "foo");
//! React.createElement(Bar, null, "foo");
//! React.createElement(React.Fragment, null, "foo");
//! ```
//!
//! ```js
//! // Development mode
//! var _jsxFileName = "<CWD>/test.js";
//! React.createElement("div", {
//!     __self: this,
//!     __source: { fileName: _jsxFileName, lineNumber: 1, columnNumber: 1 }
//! }, "foo");
//! React.createElement(Bar, {
//!     __self: this,
//!     __source: { fileName: _jsxFileName, lineNumber: 2, columnNumber: 1 }
//! }, "foo");
//! React.createElement(React.Fragment, null, "foo");
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/babel-plugin-transform-react-jsx).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-helper-builder-react-jsx>

use oxc_allocator::{
    Box as ArenaBox, StringBuilder as ArenaStringBuilder, TakeIn, Vec as ArenaVec,
};
use oxc_ast::{AstBuilder, NONE, ast::*};
use oxc_ecmascript::PropName;
use oxc_span::{Atom, SPAN, Span};
use oxc_syntax::{
    identifier::{is_line_terminator, is_white_space_single_line},
    reference::ReferenceFlags,
    symbol::SymbolFlags,
    xml_entities::XML_ENTITIES,
};
use oxc_traverse::{BoundIdentifier, Traverse};

use crate::{
    context::{TransformCtx, TraverseCtx},
    es2018::{ObjectRestSpread, ObjectRestSpreadOptions},
    state::TransformState,
};

use super::{
    diagnostics,
    jsx_self::JsxSelf,
    jsx_source::JsxSource,
    options::{JsxOptions, JsxRuntime},
};

pub struct JsxImpl<'a, 'ctx> {
    pure: bool,
    options: JsxOptions,
    object_rest_spread_options: Option<ObjectRestSpreadOptions>,

    ctx: &'ctx TransformCtx<'a>,

    pub(super) jsx_self: JsxSelf<'a, 'ctx>,
    pub(super) jsx_source: JsxSource<'a, 'ctx>,

    // States
    bindings: Bindings<'a, 'ctx>,
}

/// Bindings for different import options
enum Bindings<'a, 'ctx> {
    Classic(ClassicBindings<'a>),
    AutomaticScript(AutomaticScriptBindings<'a, 'ctx>),
    AutomaticModule(AutomaticModuleBindings<'a, 'ctx>),
}

impl Bindings<'_, '_> {
    #[inline]
    fn is_classic(&self) -> bool {
        matches!(self, Self::Classic(_))
    }
}

struct ClassicBindings<'a> {
    pragma: Pragma<'a>,
    pragma_frag: Pragma<'a>,
}

struct AutomaticScriptBindings<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    jsx_runtime_importer: Atom<'a>,
    react_importer_len: u32,
    require_create_element: Option<BoundIdentifier<'a>>,
    require_jsx: Option<BoundIdentifier<'a>>,
    is_development: bool,
}

impl<'a, 'ctx> AutomaticScriptBindings<'a, 'ctx> {
    fn new(
        ctx: &'ctx TransformCtx<'a>,
        jsx_runtime_importer: Atom<'a>,
        react_importer_len: u32,
        is_development: bool,
    ) -> Self {
        Self {
            ctx,
            jsx_runtime_importer,
            react_importer_len,
            require_create_element: None,
            require_jsx: None,
            is_development,
        }
    }

    fn require_create_element(&mut self, ctx: &mut TraverseCtx<'a>) -> IdentifierReference<'a> {
        if self.require_create_element.is_none() {
            let source =
                get_import_source(self.jsx_runtime_importer.as_str(), self.react_importer_len);
            // We have to insert this `require` above `require("react/jsx-runtime")`
            // just to pass one of Babel's tests, but the order doesn't actually matter.
            // TODO(improve-on-babel): Remove this once we don't need our output to match Babel exactly.
            let id = self.add_require_statement("react", source, true, ctx);
            self.require_create_element = Some(id);
        }
        self.require_create_element.as_ref().unwrap().create_read_reference(ctx)
    }

    fn require_jsx(&mut self, ctx: &mut TraverseCtx<'a>) -> IdentifierReference<'a> {
        if self.require_jsx.is_none() {
            let var_name =
                if self.is_development { "reactJsxDevRuntime" } else { "reactJsxRuntime" };
            let id = self.add_require_statement(var_name, self.jsx_runtime_importer, false, ctx);
            self.require_jsx = Some(id);
        }
        self.require_jsx.as_ref().unwrap().create_read_reference(ctx)
    }

    fn add_require_statement(
        &self,
        variable_name: &str,
        source: Atom<'a>,
        front: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        let binding =
            ctx.generate_uid_in_root_scope(variable_name, SymbolFlags::FunctionScopedVariable);
        self.ctx.module_imports.add_default_import(source, binding.clone(), front);
        binding
    }
}

struct AutomaticModuleBindings<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    jsx_runtime_importer: Atom<'a>,
    react_importer_len: u32,
    import_create_element: Option<BoundIdentifier<'a>>,
    import_fragment: Option<BoundIdentifier<'a>>,
    import_jsx: Option<BoundIdentifier<'a>>,
    import_jsxs: Option<BoundIdentifier<'a>>,
    is_development: bool,
}

impl<'a, 'ctx> AutomaticModuleBindings<'a, 'ctx> {
    fn new(
        ctx: &'ctx TransformCtx<'a>,
        jsx_runtime_importer: Atom<'a>,
        react_importer_len: u32,
        is_development: bool,
    ) -> Self {
        Self {
            ctx,
            jsx_runtime_importer,
            react_importer_len,
            import_create_element: None,
            import_fragment: None,
            import_jsx: None,
            import_jsxs: None,
            is_development,
        }
    }

    fn import_create_element(&mut self, ctx: &mut TraverseCtx<'a>) -> IdentifierReference<'a> {
        if self.import_create_element.is_none() {
            let source =
                get_import_source(self.jsx_runtime_importer.as_str(), self.react_importer_len);
            let id = self.add_import_statement("createElement", source, ctx);
            self.import_create_element = Some(id);
        }
        self.import_create_element.as_ref().unwrap().create_read_reference(ctx)
    }

    fn import_fragment(&mut self, ctx: &mut TraverseCtx<'a>) -> IdentifierReference<'a> {
        if self.import_fragment.is_none() {
            self.import_fragment = Some(self.add_jsx_import_statement("Fragment", ctx));
        }
        self.import_fragment.as_ref().unwrap().create_read_reference(ctx)
    }

    fn import_jsx(&mut self, ctx: &mut TraverseCtx<'a>) -> IdentifierReference<'a> {
        if self.import_jsx.is_none() {
            if self.is_development {
                self.add_import_jsx_dev(ctx);
            } else {
                self.import_jsx = Some(self.add_jsx_import_statement("jsx", ctx));
            }
        }
        self.import_jsx.as_ref().unwrap().create_read_reference(ctx)
    }

    fn import_jsxs(&mut self, ctx: &mut TraverseCtx<'a>) -> IdentifierReference<'a> {
        if self.import_jsxs.is_none() {
            if self.is_development {
                self.add_import_jsx_dev(ctx);
            } else {
                self.import_jsxs = Some(self.add_jsx_import_statement("jsxs", ctx));
            }
        }
        self.import_jsxs.as_ref().unwrap().create_read_reference(ctx)
    }

    // Inline so that compiler can see in `import_jsx` and `import_jsxs` that fields
    // are always `Some` after calling this function, and can elide the `unwrap()`s
    #[inline]
    fn add_import_jsx_dev(&mut self, ctx: &mut TraverseCtx<'a>) {
        let id = self.add_jsx_import_statement("jsxDEV", ctx);
        self.import_jsx = Some(id.clone());
        self.import_jsxs = Some(id);
    }

    fn add_jsx_import_statement(
        &self,
        name: &'static str,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        self.add_import_statement(name, self.jsx_runtime_importer, ctx)
    }

    fn add_import_statement(
        &self,
        name: &'static str,
        source: Atom<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        let binding = ctx.generate_uid_in_root_scope(name, SymbolFlags::Import);
        self.ctx.module_imports.add_named_import(source, Atom::from(name), binding.clone(), false);
        binding
    }
}

#[inline]
fn get_import_source(jsx_runtime_importer: &str, react_importer_len: u32) -> Atom<'_> {
    Atom::from(&jsx_runtime_importer[..react_importer_len as usize])
}

/// Pragma used in classic mode.
///
/// `Double` is first as it's most common.
enum Pragma<'a> {
    /// `React.createElement`
    Double(Atom<'a>, Atom<'a>),
    /// `createElement`
    Single(Atom<'a>),
    /// `foo.bar.qux`
    Multiple(Vec<Atom<'a>>),
    /// `this`, `this.foo`, `this.foo.bar.qux`
    This(Vec<Atom<'a>>),
    /// `import.meta`, `import.meta.foo`, `import.meta.foo.bar.qux`
    ImportMeta(Vec<Atom<'a>>),
}

impl<'a> Pragma<'a> {
    /// Parse `options.pragma` or `options.pragma_frag`.
    ///
    /// If provided option is invalid, raise an error and use default.
    fn parse(
        pragma: Option<&str>,
        default_property_name: &'static str,
        ast: AstBuilder<'a>,
        ctx: &TransformCtx<'a>,
    ) -> Self {
        if let Some(pragma) = pragma {
            if pragma.is_empty() {
                ctx.error(diagnostics::invalid_pragma());
            } else {
                return Self::parse_impl(pragma, ast);
            }
        }

        Self::Double(Atom::from("React"), Atom::from(default_property_name))
    }

    fn parse_impl(pragma: &str, ast: AstBuilder<'a>) -> Self {
        let strs_to_atoms = |parts: &[&str]| parts.iter().map(|part| ast.atom(part)).collect();

        let parts = pragma.split('.').collect::<Vec<_>>();
        match &parts[..] {
            [] => unreachable!(),
            ["this", rest @ ..] => Self::This(strs_to_atoms(rest)),
            ["import", "meta", rest @ ..] => Self::ImportMeta(strs_to_atoms(rest)),
            [first, second] => Self::Double(ast.atom(first), ast.atom(second)),
            [only] => Self::Single(ast.atom(only)),
            parts => Self::Multiple(strs_to_atoms(parts)),
        }
    }

    fn create_expression(&self, ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
        let (object, parts) = match self {
            Self::Double(first, second) => {
                let object = get_read_identifier_reference(SPAN, *first, ctx);
                return Expression::from(ctx.ast.member_expression_static(
                    SPAN,
                    object,
                    ctx.ast.identifier_name(SPAN, *second),
                    false,
                ));
            }
            Self::Single(single) => {
                return get_read_identifier_reference(SPAN, *single, ctx);
            }
            Self::Multiple(parts) => {
                let mut parts = parts.iter();
                let first = *parts.next().unwrap();
                let object = get_read_identifier_reference(SPAN, first, ctx);
                (object, parts)
            }
            Self::This(parts) => {
                let object = ctx.ast.expression_this(SPAN);
                (object, parts.iter())
            }
            Self::ImportMeta(parts) => {
                let object = ctx.ast.expression_meta_property(
                    SPAN,
                    ctx.ast.identifier_name(SPAN, Atom::from("import")),
                    ctx.ast.identifier_name(SPAN, Atom::from("meta")),
                );
                (object, parts.iter())
            }
        };

        let mut expr = object;
        for &item in parts {
            let name = ctx.ast.identifier_name(SPAN, item);
            expr = ctx.ast.member_expression_static(SPAN, expr, name, false).into();
        }
        expr
    }
}

impl<'a, 'ctx> JsxImpl<'a, 'ctx> {
    pub fn new(
        options: JsxOptions,
        object_rest_spread_options: Option<ObjectRestSpreadOptions>,
        ast: AstBuilder<'a>,
        ctx: &'ctx TransformCtx<'a>,
    ) -> Self {
        // Only add `pure` when `pure` is explicitly set to `true` or all JSX options are default.
        let pure = options.pure || (options.import_source.is_none() && options.pragma.is_none());
        let bindings = match options.runtime {
            JsxRuntime::Classic => {
                if options.import_source.is_some() {
                    ctx.error(diagnostics::import_source_cannot_be_set());
                }
                let pragma = Pragma::parse(options.pragma.as_deref(), "createElement", ast, ctx);
                let pragma_frag =
                    Pragma::parse(options.pragma_frag.as_deref(), "Fragment", ast, ctx);
                Bindings::Classic(ClassicBindings { pragma, pragma_frag })
            }
            JsxRuntime::Automatic => {
                if options.pragma.is_some() || options.pragma_frag.is_some() {
                    ctx.error(diagnostics::pragma_and_pragma_frag_cannot_be_set());
                }

                let is_development = options.development;
                #[expect(clippy::single_match_else, clippy::cast_possible_truncation)]
                let (jsx_runtime_importer, source_len) = match options.import_source.as_ref() {
                    Some(import_source) => {
                        let mut import_source = &**import_source;
                        let source_len = match u32::try_from(import_source.len()) {
                            Ok(0) | Err(_) => {
                                ctx.error(diagnostics::invalid_import_source());
                                import_source = "react";
                                import_source.len() as u32
                            }
                            Ok(source_len) => source_len,
                        };
                        let jsx_runtime_importer = ast.atom(&format!(
                            "{}/jsx-{}runtime",
                            import_source,
                            if is_development { "dev-" } else { "" }
                        ));
                        (jsx_runtime_importer, source_len)
                    }
                    None => {
                        let jsx_runtime_importer = if is_development {
                            Atom::from("react/jsx-dev-runtime")
                        } else {
                            Atom::from("react/jsx-runtime")
                        };
                        (jsx_runtime_importer, "react".len() as u32)
                    }
                };

                if ctx.source_type.is_script() {
                    Bindings::AutomaticScript(AutomaticScriptBindings::new(
                        ctx,
                        jsx_runtime_importer,
                        source_len,
                        is_development,
                    ))
                } else {
                    Bindings::AutomaticModule(AutomaticModuleBindings::new(
                        ctx,
                        jsx_runtime_importer,
                        source_len,
                        is_development,
                    ))
                }
            }
        };

        Self {
            pure,
            options,
            object_rest_spread_options,
            ctx,
            jsx_self: JsxSelf::new(ctx),
            jsx_source: JsxSource::new(ctx),
            bindings,
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for JsxImpl<'a, '_> {
    fn exit_program(&mut self, _program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        self.insert_filename_var_statement(ctx);
    }

    #[inline]
    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if !matches!(expr, Expression::JSXElement(_) | Expression::JSXFragment(_)) {
            return;
        }
        *expr = match expr.take_in(ctx.ast) {
            Expression::JSXElement(e) => self.transform_jsx_element(e, ctx),
            Expression::JSXFragment(e) => self.transform_jsx(e.span, None, e.unbox().children, ctx),
            _ => unreachable!(),
        };
    }
}

impl<'a> JsxImpl<'a, '_> {
    fn is_script(&self) -> bool {
        self.ctx.source_type.is_script()
    }

    fn insert_filename_var_statement(&self, ctx: &TraverseCtx<'a>) {
        let Some(declarator) = self.jsx_source.get_filename_var_declarator(ctx) else { return };

        // If is a module, add filename statements before `import`s. If script, then after `require`s.
        // This is the same behavior as Babel.
        // If in classic mode, then there are no import statements, so it doesn't matter either way.
        // TODO(improve-on-babel): Simplify this once we don't need to follow Babel exactly.
        if self.bindings.is_classic() || !self.is_script() {
            // Insert before imports - add to `top_level_statements` immediately
            let stmt = Statement::VariableDeclaration(ctx.ast.alloc_variable_declaration(
                SPAN,
                VariableDeclarationKind::Var,
                ctx.ast.vec1(declarator),
                false,
            ));
            self.ctx.top_level_statements.insert_statement(stmt);
        } else {
            // Insert after imports - add to `var_declarations`, which are inserted after `require` statements
            self.ctx.var_declarations.insert_var_declarator(declarator, ctx);
        }
    }

    fn transform_jsx_element(
        &mut self,
        element: ArenaBox<'a, JSXElement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let JSXElement { span, opening_element, closing_element, children } = element.unbox();
        Self::delete_reference_for_closing_element(closing_element.as_deref(), ctx);
        self.transform_jsx(span, Some(opening_element), children, ctx)
    }

    fn transform_jsx(
        &mut self,
        span: Span,
        opening_element: Option<ArenaBox<'a, JSXOpeningElement<'a>>>,
        children: ArenaVec<JSXChild<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let has_key_after_props_spread =
            opening_element.as_ref().is_some_and(|e| Self::has_key_after_props_spread(e));
        // If has_key_after_props_spread is true, we need to fallback to `createElement` same behavior as classic runtime
        let is_classic = self.bindings.is_classic() || has_key_after_props_spread;
        let is_automatic = !is_classic;
        let is_development = self.options.development;
        let is_element = opening_element.is_some();

        // The maximum capacity length of arguments allowed.
        let capacity = if is_classic { 3 + children.len() } else { 6 };
        let mut arguments = ctx.ast.vec_with_capacity(capacity);

        // The key prop in `<div key={true} />`
        let mut key_prop = None;

        // The object properties for the second argument of `React.createElement`
        let mut properties = ctx.ast.vec();
        let (element_name, attributes) = opening_element
            .map(|e| {
                let e = e.unbox();
                (Some(e.name), Some(e.attributes))
            })
            .unwrap_or_default();

        if let Some(attributes) = attributes {
            let attributes_len = attributes.len();
            for attribute in attributes {
                match attribute {
                    JSXAttributeItem::Attribute(attr) => {
                        let JSXAttribute { span, name, value } = attr.unbox();
                        match &name {
                            JSXAttributeName::Identifier(ident)
                                if self.options.development
                                    && self.options.jsx_self_plugin
                                    && ident.name == "__self" =>
                            {
                                self.jsx_self.report_error(ident.span);
                            }
                            JSXAttributeName::Identifier(ident)
                                if self.options.development
                                    && self.options.jsx_source_plugin
                                    && ident.name == "__source" =>
                            {
                                self.jsx_source.report_error(ident.span);
                            }
                            JSXAttributeName::Identifier(ident) if ident.name == "key" => {
                                if value.is_none() {
                                    self.ctx.error(diagnostics::valueless_key(ident.span));
                                } else if is_automatic {
                                    // In automatic mode, extract the key before spread prop,
                                    // and add it to the third argument later.
                                    key_prop = value;
                                    continue;
                                }
                            }
                            _ => {}
                        }

                        // Add attribute to prop object
                        let kind = PropertyKind::Init;
                        let key = Self::get_attribute_name(name, ctx);
                        let value = self.transform_jsx_attribute_value(value, ctx);
                        let object_property = ctx.ast.object_property_kind_object_property(
                            span, kind, key, value, false, false, false,
                        );
                        properties.push(object_property);
                    }
                    // optimize `{...prop}` to `prop` in static mode
                    JSXAttributeItem::SpreadAttribute(spread) => {
                        let JSXSpreadAttribute { argument, span } = spread.unbox();
                        if is_classic
                            && attributes_len == 1
                            // Don't optimize when dev plugins are enabled - spread must be preserved
                            // to merge with injected `__self` and `__source` props
                            && !(self.options.jsx_self_plugin || self.options.jsx_source_plugin)
                        {
                            // deopt if spreading an object with `__proto__` key
                            if !matches!(&argument, Expression::ObjectExpression(o) if has_proto(o))
                            {
                                arguments.push(Argument::from(argument));
                                continue;
                            }
                        }

                        // Add attribute to prop object
                        match argument {
                            Expression::ObjectExpression(expr) if !has_proto(&expr) => {
                                properties.extend(expr.unbox().properties);
                            }
                            argument => {
                                let object_property =
                                    ctx.ast.object_property_kind_spread_property(span, argument);
                                properties.push(object_property);
                            }
                        }
                    }
                }
            }
        }

        let mut need_jsxs = false;

        // Append children to object properties in automatic mode
        if is_automatic {
            let mut children = ctx.ast.vec_from_iter(
                children
                    .into_iter()
                    .filter_map(|child| self.transform_jsx_child_automatic(child, ctx)),
            );
            let children_len = children.len();
            if children_len != 0 {
                let value = if children_len == 1 {
                    children.pop().unwrap()
                } else {
                    need_jsxs = true;
                    let elements = children.into_iter().map(ArrayExpressionElement::from);
                    let elements = ctx.ast.vec_from_iter(elements);
                    ctx.ast.expression_array(SPAN, elements)
                };
                let children = ctx.ast.property_key_static_identifier(SPAN, "children");
                let kind = PropertyKind::Init;
                let property = ctx.ast.object_property_kind_object_property(
                    SPAN, kind, children, value, false, false, false,
                );
                properties.push(property);
            }

            // If runtime is automatic that means we always to add `{ .. }` as the second argument even if it's empty
            let mut object_expression = ctx.ast.expression_object(SPAN, properties);
            if let Some(options) = self.object_rest_spread_options {
                ObjectRestSpread::transform_object_expression(
                    options,
                    &mut object_expression,
                    self.ctx,
                    ctx,
                );
            }
            arguments.push(Argument::from(object_expression));

            // Only jsx and jsxDev will have more than 2 arguments
            // key
            if key_prop.is_some() {
                arguments.push(Argument::from(self.transform_jsx_attribute_value(key_prop, ctx)));
            } else if is_development {
                arguments.push(Argument::from(ctx.ast.void_0(SPAN)));
            }

            // isStaticChildren
            if is_development {
                arguments.push(Argument::from(
                    ctx.ast.expression_boolean_literal(SPAN, children_len > 1),
                ));
            }

            // Fragment doesn't have source and self
            if is_element {
                // { __source: { fileName, lineNumber, columnNumber } }
                if self.options.jsx_source_plugin {
                    let (line, column) = self.jsx_source.get_line_column(span.start);
                    let expr = self.jsx_source.get_source_object(line, column, ctx);
                    arguments.push(Argument::from(expr));
                }

                // this
                if self.options.jsx_self_plugin && JsxSelf::can_add_self_attribute(ctx) {
                    arguments.push(Argument::from(ctx.ast.expression_this(SPAN)));
                }
            }
        } else {
            // React.createElement's second argument
            if is_element {
                if self.options.jsx_self_plugin && JsxSelf::can_add_self_attribute(ctx) {
                    properties.push(JsxSelf::get_object_property_kind_for_jsx_plugin(ctx));
                }

                if self.options.jsx_source_plugin {
                    let (line, column) = self.jsx_source.get_line_column(span.start);
                    properties.push(
                        self.jsx_source.get_object_property_kind_for_jsx_plugin(line, column, ctx),
                    );
                }
            }

            if !properties.is_empty() {
                let mut object_expression = ctx.ast.expression_object(SPAN, properties);
                if let Some(options) = self.object_rest_spread_options {
                    ObjectRestSpread::transform_object_expression(
                        options,
                        &mut object_expression,
                        self.ctx,
                        ctx,
                    );
                }
                arguments.push(Argument::from(object_expression));
            } else if arguments.is_empty() {
                // If not and second argument doesn't exist, we should add `null` as the second argument
                let null_expr = ctx.ast.expression_null_literal(SPAN);
                arguments.push(Argument::from(null_expr));
            }

            // React.createElement(type, arguments, ...children)
            //                                      ^^^^^^^^^^^
            arguments.extend(
                children
                    .into_iter()
                    .filter_map(|child| self.transform_jsx_child_classic(child, ctx)),
            );
        }

        // It would be better to push to `arguments` earlier, rather than use `insert`.
        // But we have to do it here to replicate the same import order as Babel, in order to pass
        // Babel's conformance tests.
        // TODO(improve-on-babel): Change this if we can handle differing output in tests.
        let argument_expr = if let Some(element_name) = element_name {
            self.transform_element_name(element_name, ctx)
        } else {
            self.get_fragment(ctx)
        };
        arguments.insert(0, Argument::from(argument_expr));
        debug_assert!(arguments.len() <= capacity);

        let callee = self.get_create_element(has_key_after_props_spread, need_jsxs, ctx);
        ctx.ast.expression_call_with_pure(span, callee, NONE, arguments, false, self.pure)
    }

    fn transform_element_name(
        &self,
        name: JSXElementName<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        match name {
            JSXElementName::Identifier(ident) => {
                ctx.ast.expression_string_literal(ident.span, ident.name, None)
            }
            JSXElementName::IdentifierReference(ident) => Expression::Identifier(ident),
            JSXElementName::MemberExpression(member_expr) => {
                Self::transform_jsx_member_expression(member_expr, ctx)
            }
            JSXElementName::NamespacedName(namespaced) => {
                if self.options.throw_if_namespace {
                    self.ctx.error(diagnostics::namespace_does_not_support(namespaced.span));
                }
                let namespace_name = ctx.ast.atom_from_strs_array([
                    &namespaced.namespace.name,
                    ":",
                    &namespaced.name.name,
                ]);
                ctx.ast.expression_string_literal(namespaced.span, namespace_name, None)
            }
            JSXElementName::ThisExpression(expr) => ctx.ast.expression_this(expr.span),
        }
    }

    fn get_fragment(&mut self, ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
        match &mut self.bindings {
            Bindings::Classic(bindings) => bindings.pragma_frag.create_expression(ctx),
            Bindings::AutomaticScript(bindings) => {
                let object_ident = bindings.require_jsx(ctx);
                let property_name = Atom::from("Fragment");
                create_static_member_expression(object_ident, property_name, ctx)
            }
            Bindings::AutomaticModule(bindings) => {
                let ident = bindings.import_fragment(ctx);
                Expression::Identifier(ctx.alloc(ident))
            }
        }
    }

    fn get_create_element(
        &mut self,
        has_key_after_props_spread: bool,
        jsxs: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        match &mut self.bindings {
            Bindings::Classic(bindings) => bindings.pragma.create_expression(ctx),
            Bindings::AutomaticScript(bindings) => {
                let (ident, property_name) = if has_key_after_props_spread {
                    (bindings.require_create_element(ctx), Atom::from("createElement"))
                } else {
                    let property_name = if bindings.is_development {
                        Atom::from("jsxDEV")
                    } else if jsxs {
                        Atom::from("jsxs")
                    } else {
                        Atom::from("jsx")
                    };
                    (bindings.require_jsx(ctx), property_name)
                };
                create_static_member_expression(ident, property_name, ctx)
            }
            Bindings::AutomaticModule(bindings) => {
                let ident = if has_key_after_props_spread {
                    bindings.import_create_element(ctx)
                } else if jsxs {
                    bindings.import_jsxs(ctx)
                } else {
                    bindings.import_jsx(ctx)
                };
                Expression::Identifier(ctx.alloc(ident))
            }
        }
    }

    fn transform_jsx_member_expression(
        expr: ArenaBox<'a, JSXMemberExpression<'a>>,
        ctx: &TraverseCtx<'a>,
    ) -> Expression<'a> {
        let JSXMemberExpression { span, object, property } = expr.unbox();
        let object = match object {
            JSXMemberExpressionObject::IdentifierReference(ident) => Expression::Identifier(ident),
            JSXMemberExpressionObject::MemberExpression(expr) => {
                Self::transform_jsx_member_expression(expr, ctx)
            }
            JSXMemberExpressionObject::ThisExpression(expr) => ctx.ast.expression_this(expr.span),
        };
        let property = ctx.ast.identifier_name(property.span, property.name);
        ctx.ast.member_expression_static(span, object, property, false).into()
    }

    fn transform_jsx_attribute_value(
        &mut self,
        value: Option<JSXAttributeValue<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        match value {
            Some(JSXAttributeValue::StringLiteral(s)) => {
                let mut decoded = None;
                Self::decode_entities(s.value.as_str(), &mut decoded, s.value.len(), ctx);
                let jsx_text = if let Some(decoded) = decoded {
                    // Text contains HTML entities which were decoded.
                    // `decoded` contains the decoded string as an `ArenaString`. Convert it to `Atom`.
                    Atom::from(decoded)
                } else {
                    // No HTML entities needed to be decoded. Use the original `Atom` without copying.
                    s.value
                };
                ctx.ast.expression_string_literal(s.span, jsx_text, None)
            }
            Some(JSXAttributeValue::Element(e)) => self.transform_jsx_element(e, ctx),
            Some(JSXAttributeValue::Fragment(e)) => {
                self.transform_jsx(e.span, None, e.unbox().children, ctx)
            }
            Some(JSXAttributeValue::ExpressionContainer(c)) => match c.unbox().expression {
                jsx_expr @ match_expression!(JSXExpression) => jsx_expr.into_expression(),
                JSXExpression::EmptyExpression(e) => {
                    ctx.ast.expression_boolean_literal(e.span, true)
                }
            },
            None => ctx.ast.expression_boolean_literal(SPAN, true),
        }
    }

    fn transform_jsx_child_automatic(
        &mut self,
        child: JSXChild<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        // Align spread child behavior with esbuild.
        // Instead of Babel throwing `Spread children are not supported in React.`
        // `<>{...foo}</>` -> `jsxs(Fragment, { children: [ ...foo ] })`
        if let JSXChild::Spread(e) = child {
            let JSXSpreadChild { span, expression } = e.unbox();
            let spread_element = ctx.ast.array_expression_element_spread_element(span, expression);
            let elements = ctx.ast.vec1(spread_element);
            Some(ctx.ast.expression_array(span, elements))
        } else {
            self.transform_jsx_child(child, ctx)
        }
    }

    fn transform_jsx_child_classic(
        &mut self,
        child: JSXChild<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Argument<'a>> {
        // Align spread child behavior with esbuild.
        // Instead of Babel throwing `Spread children are not supported in React.`
        // `<>{...foo}</>` -> `React.createElement(React.Fragment, null, ...foo)`
        if let JSXChild::Spread(e) = child {
            let JSXSpreadChild { span, expression } = e.unbox();
            Some(ctx.ast.argument_spread_element(span, expression))
        } else {
            self.transform_jsx_child(child, ctx).map(Argument::from)
        }
    }

    fn transform_jsx_child(
        &mut self,
        child: JSXChild<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        match child {
            JSXChild::Text(text) => Self::transform_jsx_text(&text, ctx),
            JSXChild::ExpressionContainer(e) => match e.unbox().expression {
                jsx_expr @ match_expression!(JSXExpression) => Some(jsx_expr.into_expression()),
                JSXExpression::EmptyExpression(_) => None,
            },
            JSXChild::Element(e) => Some(self.transform_jsx_element(e, ctx)),
            JSXChild::Fragment(e) => {
                Some(self.transform_jsx(e.span, None, e.unbox().children, ctx))
            }
            JSXChild::Spread(_) => unreachable!(),
        }
    }

    fn get_attribute_name(name: JSXAttributeName<'a>, ctx: &TraverseCtx<'a>) -> PropertyKey<'a> {
        match name {
            JSXAttributeName::Identifier(ident) => {
                let name = ident.name;
                if ident.name.contains('-') {
                    PropertyKey::from(ctx.ast.expression_string_literal(ident.span, name, None))
                } else {
                    ctx.ast.property_key_static_identifier(ident.span, name)
                }
            }
            JSXAttributeName::NamespacedName(namespaced) => {
                let name = ctx.ast.atom(&namespaced.to_string());
                PropertyKey::from(ctx.ast.expression_string_literal(namespaced.span, name, None))
            }
        }
    }

    fn transform_jsx_text(text: &JSXText<'a>, ctx: &TraverseCtx<'a>) -> Option<Expression<'a>> {
        Self::fixup_whitespace_and_decode_entities(text.value, ctx)
            .map(|value| ctx.ast.expression_string_literal(text.span, value, None))
    }

    /// JSX trims whitespace at the end and beginning of lines, except that the
    /// start/end of a tag is considered a start/end of a line only if that line is
    /// on the same line as the closing tag. See examples in
    /// tests/cases/conformance/jsx/tsxReactEmitWhitespace.tsx
    /// See also <https://www.w3.org/TR/html4/struct/text.html#h-9.1> and <https://www.w3.org/TR/CSS2/text.html#white-space-model>
    ///
    /// An equivalent algorithm would be:
    /// - If there is only one line, return it.
    /// - If there is only whitespace (but multiple lines), return `undefined`.
    /// - Split the text into lines.
    /// - 'trimRight' the first line, 'trimLeft' the last line, 'trim' middle lines.
    /// - Decode entities on each line (individually).
    /// - Remove empty lines and join the rest with " ".
    ///
    /// <https://github.com/microsoft/TypeScript/blob/f0374ce2a9c465e27a15b7fa4a347e2bd9079450/src/compiler/transformers/jsx.ts#L557-L608>
    fn fixup_whitespace_and_decode_entities(
        text: Atom<'a>,
        ctx: &TraverseCtx<'a>,
    ) -> Option<Atom<'a>> {
        // Avoid copying strings in the common case where there's only 1 line of text,
        // and it contains no HTML entities that need decoding.
        //
        // Where we do have to decode HTML entities, or concatenate multiple lines, assemble the
        // concatenated text directly in arena, in an `ArenaString` (the accumulator `acc`),
        // to avoid allocations. Initialize that `ArenaString` with capacity equal to length of
        // the original text. This may be a bit more capacity than is required, once whitespace
        // is removed, but it's highly unlikely to be insufficient capacity, so the `ArenaString`
        // shouldn't need to reallocate while it's being constructed.
        //
        // When first line containing some text is found:
        // * If it contains HTML entities, decode them and write decoded text to accumulator `acc`.
        // * Otherwise, store trimmed text in `only_line` as an `Atom<'a>`.
        //
        // When another line containing some text is found:
        // * If accumulator isn't already initialized, initialize it, starting with `only_line`.
        // * Push a space to the accumulator.
        // * Decode current line into the accumulator.
        //
        // At the end:
        // * If accumulator is initialized, convert the `ArenaString` to an `Atom` and return it.
        // * If `only_line` contains a string, that means only 1 line contained text, and that line
        //   didn't contain any HTML entities which needed decoding.
        //   So we can just return the `Atom` that's in `only_line` (without any copying).

        let mut acc: Option<ArenaStringBuilder> = None;
        let mut only_line: Option<Atom<'a>> = None;
        let mut first_non_whitespace: Option<usize> = Some(0);
        let mut last_non_whitespace: Option<usize> = None;
        for (index, c) in text.char_indices() {
            if is_line_terminator(c) {
                if let (Some(first), Some(last)) = (first_non_whitespace, last_non_whitespace) {
                    Self::add_line_of_jsx_text(
                        Atom::from(&text.as_str()[first..last]),
                        &mut acc,
                        &mut only_line,
                        text.len(),
                        ctx,
                    );
                }
                first_non_whitespace = None;
            } else if !is_white_space_single_line(c) {
                last_non_whitespace = Some(index + c.len_utf8());
                if first_non_whitespace.is_none() {
                    first_non_whitespace.replace(index);
                }
            }
        }

        if let Some(first) = first_non_whitespace {
            Self::add_line_of_jsx_text(
                Atom::from(&text.as_str()[first..]),
                &mut acc,
                &mut only_line,
                text.len(),
                ctx,
            );
        }

        if let Some(acc) = acc { Some(Atom::from(acc)) } else { only_line }
    }

    fn add_line_of_jsx_text(
        trimmed_line: Atom<'a>,
        acc: &mut Option<ArenaStringBuilder<'a>>,
        only_line: &mut Option<Atom<'a>>,
        text_len: usize,
        ctx: &TraverseCtx<'a>,
    ) {
        if let Some(buffer) = acc.as_mut() {
            // Already some text in accumulator. Push a space before this line is added to `acc`.
            buffer.push(' ');
        } else if let Some(only_line) = only_line.take() {
            // This is the 2nd line containing text. Previous line did not contain any HTML entities.
            // Generate an accumulator containing previous line and a trailing space.
            // Current line will be added to the accumulator after it.
            let mut buffer = ArenaStringBuilder::with_capacity_in(text_len, ctx.ast.allocator);
            buffer.push_str(only_line.as_str());
            buffer.push(' ');
            *acc = Some(buffer);
        }

        // Decode any HTML entities in this line
        Self::decode_entities(trimmed_line.as_str(), acc, text_len, ctx);

        if acc.is_none() {
            // This is the first line containing text, and there are no HTML entities in this line.
            // Record this line in `only_line`.
            // If this turns out to be the only line, we won't need to construct an `ArenaString`,
            // so avoid all copying.
            *only_line = Some(trimmed_line);
        }
    }

    /// Replace entities like "&nbsp;", "&#123;", and "&#xDEADBEEF;" with the characters they encode.
    /// * See <https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>
    ///   Code adapted from <https://github.com/microsoft/TypeScript/blob/514f7e639a2a8466c075c766ee9857a30ed4e196/src/compiler/transformers/jsx.ts#L617C1-L635>
    ///
    /// If either:
    /// (a) Text contains any HTML entities that need to be decoded, or
    /// (b) accumulator `acc` passed in to this method is `Some`
    /// then push the decoded string to `acc` (initializing it first if required).
    ///
    /// Otherwise, leave `acc` as `None`. This indicates that the text contains no HTML entities.
    /// Caller can use a slice of the original text, rather than making any copies.
    fn decode_entities(
        s: &str,
        acc: &mut Option<ArenaStringBuilder<'a>>,
        text_len: usize,
        ctx: &TraverseCtx<'a>,
    ) {
        let mut chars = s.char_indices();
        let mut prev = 0;
        while let Some((i, c)) = chars.next() {
            if c == '&' {
                let mut start = i;
                let mut end = None;
                for (j, c) in chars.by_ref() {
                    if c == ';' {
                        end.replace(j);
                        break;
                    } else if c == '&' {
                        start = j;
                    }
                }
                if let Some(end) = end {
                    let buffer = acc.get_or_insert_with(|| {
                        ArenaStringBuilder::with_capacity_in(text_len, ctx.ast.allocator)
                    });

                    buffer.push_str(&s[prev..start]);
                    prev = end + 1;
                    let word = &s[start + 1..end];
                    if let Some(decimal) = word.strip_prefix('#') {
                        if let Some(hex) = decimal.strip_prefix('x') {
                            if let Some(c) =
                                u32::from_str_radix(hex, 16).ok().and_then(char::from_u32)
                            {
                                // `&#x0123;`
                                buffer.push(c);
                                continue;
                            }
                        } else if let Some(c) = decimal.parse::<u32>().ok().and_then(char::from_u32)
                        {
                            // `&#0123;`
                            buffer.push(c);
                            continue;
                        }
                    } else if let Some(c) = XML_ENTITIES.get(word) {
                        // e.g. `&quote;`, `&amp;`
                        buffer.push(*c);
                        continue;
                    }
                    // Fallback
                    buffer.push('&');
                    buffer.push_str(word);
                    buffer.push(';');
                } else {
                    // Reached end of text without finding a `;` after the `&`.
                    // No point searching for a further `&`, so exit the loop.
                    break;
                }
            }
        }

        if let Some(buffer) = acc.as_mut() {
            buffer.push_str(&s[prev..]);
        }
    }

    /// The react jsx/jsxs transform falls back to `createElement` when an explicit `key` argument comes after a spread
    /// <https://github.com/microsoft/TypeScript/blob/6134091642f57c32f50e7b5604635e4d37dd19e8/src/compiler/transformers/jsx.ts#L264-L278>
    fn has_key_after_props_spread(opening_element: &JSXOpeningElement<'a>) -> bool {
        let mut spread = false;
        for attr in &opening_element.attributes {
            if matches!(attr, JSXAttributeItem::SpreadAttribute(_)) {
                spread = true;
            } else if spread && matches!(attr, JSXAttributeItem::Attribute(a) if a.is_key()) {
                return true;
            }
        }
        false
    }

    fn delete_reference_for_closing_element(
        element: Option<&JSXClosingElement<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if let Some(element) = &element
            && let Some(ident) = element.name.get_identifier()
        {
            ctx.delete_reference_for_identifier(ident);
        }
    }
}

/// Create `IdentifierReference` for var name in current scope which is read from
fn get_read_identifier_reference<'a>(
    span: Span,
    name: Atom<'a>,
    ctx: &mut TraverseCtx<'a>,
) -> Expression<'a> {
    let reference_id = ctx.create_reference_in_current_scope(name.as_str(), ReferenceFlags::Read);
    let ident = ctx.ast.alloc_identifier_reference_with_reference_id(span, name, reference_id);
    Expression::Identifier(ident)
}

fn create_static_member_expression<'a>(
    object_ident: IdentifierReference<'a>,
    property_name: Atom<'a>,
    ctx: &TraverseCtx<'a>,
) -> Expression<'a> {
    let object = Expression::Identifier(ctx.alloc(object_ident));
    let property = ctx.ast.identifier_name(SPAN, property_name);
    ctx.ast.member_expression_static(SPAN, object, property, false).into()
}

/// Check if an `ObjectExpression` has a property called `__proto__`.
///
/// Returns `true` for any of:
/// * `{ __proto__: ... }`
/// * `{ "__proto__": ... }`
/// * `{ ["__proto__"]: ... }`
///
/// Also currently returns `true` for `{ [__proto__]: ... }`, but that's probably not correct.
/// TODO: Fix that.
fn has_proto(e: &ObjectExpression<'_>) -> bool {
    e.properties.iter().any(|p| p.prop_name().is_some_and(|(name, _)| name == "__proto__"))
}

#[cfg(test)]
mod test {
    use std::path::Path;

    use oxc_allocator::Allocator;
    use oxc_ast::ast::Expression;
    use oxc_semantic::Scoping;
    use oxc_syntax::{node::NodeId, scope::ScopeFlags};
    use oxc_traverse::ReusableTraverseCtx;

    use super::Pragma;
    use crate::{TransformCtx, TransformOptions, state::TransformState};

    macro_rules! setup {
        ($traverse_ctx:ident, $transform_ctx:ident) => {
            let allocator = Allocator::default();

            let mut scoping = Scoping::default();
            scoping.add_scope(None, NodeId::DUMMY, ScopeFlags::Top);

            let state = TransformState::default();
            let traverse_ctx = ReusableTraverseCtx::new(state, scoping, &allocator);
            // SAFETY: Macro user only gets a `&mut TransCtx`, which cannot be abused
            let mut traverse_ctx = unsafe { traverse_ctx.unwrap() };
            let $traverse_ctx = &mut traverse_ctx;

            let $transform_ctx =
                TransformCtx::new(Path::new("test.jsx"), &TransformOptions::default());
        };
    }

    #[test]
    fn default_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = None;
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::StaticMemberExpression(member) = &expr else { panic!() };
        let Expression::Identifier(object) = &member.object else { panic!() };
        assert_eq!(object.name, "React");
        assert_eq!(member.property.name, "createElement");
    }

    #[test]
    fn single_part_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("single");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::Identifier(ident) = &expr else { panic!() };
        assert_eq!(ident.name, "single");
    }

    #[test]
    fn two_part_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("first.second");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::StaticMemberExpression(member) = &expr else { panic!() };
        let Expression::Identifier(object) = &member.object else { panic!() };
        assert_eq!(object.name, "first");
        assert_eq!(member.property.name, "second");
    }

    #[test]
    fn multi_part_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("first.second.third");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::StaticMemberExpression(outer_member) = &expr else { panic!() };
        let Expression::StaticMemberExpression(inner_member) = &outer_member.object else {
            panic!()
        };
        let Expression::Identifier(object) = &inner_member.object else { panic!() };
        assert_eq!(object.name, "first");
        assert_eq!(inner_member.property.name, "second");
        assert_eq!(outer_member.property.name, "third");
    }

    #[test]
    fn this_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("this");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        assert!(matches!(&expr, Expression::ThisExpression(_)));
    }

    #[test]
    fn this_prop_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("this.a.b");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::StaticMemberExpression(outer_member) = &expr else { panic!() };
        let Expression::StaticMemberExpression(inner_member) = &outer_member.object else {
            panic!()
        };
        assert!(matches!(&inner_member.object, Expression::ThisExpression(_)));
        assert_eq!(inner_member.property.name, "a");
        assert_eq!(outer_member.property.name, "b");
    }

    #[test]
    fn import_meta_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("import.meta");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::MetaProperty(meta_prop) = &expr else { panic!() };
        assert_eq!(&meta_prop.meta.name, "import");
        assert_eq!(&meta_prop.property.name, "meta");
    }

    #[test]
    fn import_meta_prop_pragma() {
        setup!(traverse_ctx, transform_ctx);

        let pragma = Some("import.meta.prop");
        let pragma = Pragma::parse(pragma, "createElement", traverse_ctx.ast, &transform_ctx);
        let expr = pragma.create_expression(traverse_ctx);

        let Expression::StaticMemberExpression(member) = &expr else { panic!() };
        let Expression::MetaProperty(meta_prop) = &member.object else { panic!() };
        assert_eq!(&meta_prop.meta.name, "import");
        assert_eq!(&meta_prop.property.name, "meta");
        assert_eq!(member.property.name, "prop");
    }

    #[test]
    fn entity_after_stray_amp() {
        setup!(traverse_ctx, _transform_ctx);
        let input = "& &amp;";
        let mut acc = None;
        super::JsxImpl::decode_entities(input, &mut acc, input.len(), traverse_ctx);
        let out = acc.as_ref().unwrap().as_str();
        assert_eq!(out, "& &");
    }
}
