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

use std::{borrow::Cow, collections::HashMap};

use once_cell::sync::Lazy;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use super::{
    diagnostics,
    jsx_self::JsxSelf,
    jsx_source::JsxSource,
    options::{JsxOptions, JsxRuntime},
};
use crate::{
    context::{TransformCtx, TraverseCtx},
    es2018::ObjectRestSpreadOptions,
};

/// XML entities mapping
static XML_ENTITIES: Lazy<HashMap<&'static str, char>> = Lazy::new(|| {
    let mut map = HashMap::new();
    map.insert("quot", '"');
    map.insert("amp", '&');
    map.insert("apos", '\'');
    map.insert("lt", '<');
    map.insert("gt", '>');
    map.insert("nbsp", '\u{00A0}');
    map.insert("iexcl", '\u{00A1}');
    map.insert("cent", '\u{00A2}');
    map.insert("pound", '\u{00A3}');
    map.insert("curren", '\u{00A4}');
    map.insert("yen", '\u{00A5}');
    map.insert("brvbar", '\u{00A6}');
    map.insert("sect", '\u{00A7}');
    map.insert("uml", '\u{00A8}');
    map.insert("copy", '\u{00A9}');
    map.insert("ordf", '\u{00AA}');
    map.insert("laquo", '\u{00AB}');
    map.insert("not", '\u{00AC}');
    map.insert("shy", '\u{00AD}');
    map.insert("reg", '\u{00AE}');
    map.insert("macr", '\u{00AF}');
    map.insert("deg", '\u{00B0}');
    map.insert("plusmn", '\u{00B1}');
    map.insert("sup2", '\u{00B2}');
    map.insert("sup3", '\u{00B3}');
    map.insert("acute", '\u{00B4}');
    map.insert("micro", '\u{00B5}');
    map.insert("para", '\u{00B6}');
    map.insert("middot", '\u{00B7}');
    map.insert("cedil", '\u{00B8}');
    map.insert("sup1", '\u{00B9}');
    map.insert("ordm", '\u{00BA}');
    map.insert("raquo", '\u{00BB}');
    map.insert("frac14", '\u{00BC}');
    map.insert("frac12", '\u{00BD}');
    map.insert("frac34", '\u{00BE}');
    map.insert("iquest", '\u{00BF}');
    map.insert("Agrave", '\u{00C0}');
    map.insert("Aacute", '\u{00C1}');
    map.insert("Acirc", '\u{00C2}');
    map.insert("Atilde", '\u{00C3}');
    map.insert("Auml", '\u{00C4}');
    map.insert("Aring", '\u{00C5}');
    map.insert("AElig", '\u{00C6}');
    map.insert("Ccedil", '\u{00C7}');
    map.insert("Egrave", '\u{00C8}');
    map.insert("Eacute", '\u{00C9}');
    map.insert("Ecirc", '\u{00CA}');
    map.insert("Euml", '\u{00CB}');
    map.insert("Igrave", '\u{00CC}');
    map.insert("Iacute", '\u{00CD}');
    map.insert("Icirc", '\u{00CE}');
    map.insert("Iuml", '\u{00CF}');
    map.insert("ETH", '\u{00D0}');
    map.insert("Ntilde", '\u{00D1}');
    map.insert("Ograve", '\u{00D2}');
    map.insert("Oacute", '\u{00D3}');
    map.insert("Ocirc", '\u{00D4}');
    map.insert("Otilde", '\u{00D5}');
    map.insert("Ouml", '\u{00D6}');
    map.insert("times", '\u{00D7}');
    map.insert("Oslash", '\u{00D8}');
    map.insert("Ugrave", '\u{00D9}');
    map.insert("Uacute", '\u{00DA}');
    map.insert("Ucirc", '\u{00DB}');
    map.insert("Uuml", '\u{00DC}');
    map.insert("Yacute", '\u{00DD}');
    map.insert("THORN", '\u{00DE}');
    map.insert("szlig", '\u{00DF}');
    map.insert("agrave", '\u{00E0}');
    map.insert("aacute", '\u{00E1}');
    map.insert("acirc", '\u{00E2}');
    map.insert("atilde", '\u{00E3}');
    map.insert("auml", '\u{00E4}');
    map.insert("aring", '\u{00E5}');
    map.insert("aelig", '\u{00E6}');
    map.insert("ccedil", '\u{00E7}');
    map.insert("egrave", '\u{00E8}');
    map.insert("eacute", '\u{00E9}');
    map.insert("ecirc", '\u{00EA}');
    map.insert("euml", '\u{00EB}');
    map.insert("igrave", '\u{00EC}');
    map.insert("iacute", '\u{00ED}');
    map.insert("icirc", '\u{00EE}');
    map.insert("iuml", '\u{00EF}');
    map.insert("eth", '\u{00F0}');
    map.insert("ntilde", '\u{00F1}');
    map.insert("ograve", '\u{00F2}');
    map.insert("oacute", '\u{00F3}');
    map.insert("ocirc", '\u{00F4}');
    map.insert("otilde", '\u{00F5}');
    map.insert("ouml", '\u{00F6}');
    map.insert("divide", '\u{00F7}');
    map.insert("oslash", '\u{00F8}');
    map.insert("ugrave", '\u{00F9}');
    map.insert("uacute", '\u{00FA}');
    map.insert("ucirc", '\u{00FB}');
    map.insert("uuml", '\u{00FC}');
    map.insert("yacute", '\u{00FD}');
    map.insert("thorn", '\u{00FE}');
    map.insert("yuml", '\u{00FF}');
    map
});

pub struct JsxImpl {
    pure: bool,
    options: JsxOptions,
    object_rest_spread_options: Option<ObjectRestSpreadOptions>,

    pub(super) jsx_self: JsxSelf,
    pub(super) jsx_source: JsxSource,

    // States
    bindings: Bindings,
}

/// Bindings for different import options
enum Bindings {
    Classic(ClassicBindings),
    AutomaticScript(AutomaticScriptBindings),
    AutomaticModule(AutomaticModuleBindings),
}

impl Bindings {
    #[inline]
    fn is_classic(&self) -> bool {
        matches!(self, Self::Classic(_))
    }
}

struct ClassicBindings {
    pragma: Pragma,
    pragma_frag: Pragma,
}

struct AutomaticScriptBindings {
    jsx_runtime_importer: Cow<'static, str>,
    react_importer_len: u32,
    require_create_element: Option<Ident>,
    require_jsx: Option<Ident>,
    is_development: bool,
}

impl AutomaticScriptBindings {
    fn new(
        jsx_runtime_importer: Cow<'static, str>,
        react_importer_len: u32,
        is_development: bool,
    ) -> Self {
        Self {
            jsx_runtime_importer,
            react_importer_len,
            require_create_element: None,
            require_jsx: None,
            is_development,
        }
    }

    fn require_create_element(&mut self, ctx: &TraverseCtx) -> Ident {
        if self.require_create_element.is_none() {
            let source = get_import_source(&self.jsx_runtime_importer, self.react_importer_len);
            let id = self.add_require_statement("react", source, true, ctx);
            self.require_create_element = Some(id);
        }
        self.require_create_element.clone().unwrap()
    }

    fn require_jsx(&mut self, ctx: &TraverseCtx) -> Ident {
        if self.require_jsx.is_none() {
            let var_name = if self.is_development {
                "reactJsxDevRuntime"
            } else {
                "reactJsxRuntime"
            };
            let id = self.add_require_statement(
                var_name,
                self.jsx_runtime_importer.as_ref(),
                false,
                ctx,
            );
            self.require_jsx = Some(id);
        }
        self.require_jsx.clone().unwrap()
    }

    fn add_require_statement(
        &self,
        variable_name: &str,
        source: &str,
        front: bool,
        ctx: &TraverseCtx,
    ) -> Ident {
        // Generate unique identifier
        let binding = Ident::new(variable_name.into(), DUMMY_SP, Default::default());
        ctx.module_imports
            .add_default_import(source.into(), binding.sym.clone(), front);
        binding
    }
}

struct AutomaticModuleBindings {
    jsx_runtime_importer: Cow<'static, str>,
    react_importer_len: u32,
    import_create_element: Option<Ident>,
    import_fragment: Option<Ident>,
    import_jsx: Option<Ident>,
    import_jsxs: Option<Ident>,
    is_development: bool,
}

impl AutomaticModuleBindings {
    fn new(
        jsx_runtime_importer: Cow<'static, str>,
        react_importer_len: u32,
        is_development: bool,
    ) -> Self {
        Self {
            jsx_runtime_importer,
            react_importer_len,
            import_create_element: None,
            import_fragment: None,
            import_jsx: None,
            import_jsxs: None,
            is_development,
        }
    }

    fn import_create_element(&mut self, ctx: &TraverseCtx) -> Ident {
        if self.import_create_element.is_none() {
            let source = get_import_source(&self.jsx_runtime_importer, self.react_importer_len);
            let id = self.add_import_statement("createElement", source, ctx);
            self.import_create_element = Some(id);
        }
        self.import_create_element.clone().unwrap()
    }

    fn import_fragment(&mut self, ctx: &TraverseCtx) -> Ident {
        if self.import_fragment.is_none() {
            self.import_fragment = Some(self.add_jsx_import_statement("Fragment", ctx));
        }
        self.import_fragment.clone().unwrap()
    }

    fn import_jsx(&mut self, ctx: &TraverseCtx) -> Ident {
        if self.import_jsx.is_none() {
            if self.is_development {
                self.add_import_jsx_dev(ctx);
            } else {
                self.import_jsx = Some(self.add_jsx_import_statement("jsx", ctx));
            }
        }
        self.import_jsx.clone().unwrap()
    }

    fn import_jsxs(&mut self, ctx: &TraverseCtx) -> Ident {
        if self.import_jsxs.is_none() {
            if self.is_development {
                self.add_import_jsx_dev(ctx);
            } else {
                self.import_jsxs = Some(self.add_jsx_import_statement("jsxs", ctx));
            }
        }
        self.import_jsxs.clone().unwrap()
    }

    // Inline so that compiler can see in `import_jsx` and `import_jsxs` that fields
    // are always `Some` after calling this function, and can elide the `unwrap()`s
    #[inline]
    fn add_import_jsx_dev(&mut self, ctx: &TraverseCtx) {
        let id = self.add_jsx_import_statement("jsxDEV", ctx);
        self.import_jsx = Some(id.clone());
        self.import_jsxs = Some(id);
    }

    fn add_jsx_import_statement(&self, name: &'static str, ctx: &TraverseCtx) -> Ident {
        self.add_import_statement(name, self.jsx_runtime_importer.as_ref(), ctx)
    }

    fn add_import_statement(&self, name: &'static str, source: &str, ctx: &TraverseCtx) -> Ident {
        let binding = Ident::new(name.into(), DUMMY_SP, Default::default());
        ctx.module_imports
            .add_named_import(source.into(), name.into(), binding.sym.clone(), false);
        binding
    }
}

#[inline]
fn get_import_source(jsx_runtime_importer: &str, react_importer_len: u32) -> &str {
    &jsx_runtime_importer[..react_importer_len as usize]
}

/// Pragma used in classic mode.
///
/// `Double` is first as it's most common.
enum Pragma {
    /// `React.createElement`
    Double(Cow<'static, str>, Cow<'static, str>),
    /// `createElement`
    Single(Cow<'static, str>),
    /// `foo.bar.qux`
    Multiple(Vec<Cow<'static, str>>),
    /// `this`, `this.foo`, `this.foo.bar.qux`
    This(Vec<Cow<'static, str>>),
    /// `import.meta`, `import.meta.foo`, `import.meta.foo.bar.qux`
    ImportMeta(Vec<Cow<'static, str>>),
}

impl Pragma {
    /// Parse `options.pragma` or `options.pragma_frag`.
    ///
    /// If provided option is invalid, raise an error and use default.
    fn parse(
        pragma: Option<&str>,
        default_property_name: &'static str,
        ctx: &TransformCtx,
    ) -> Self {
        if let Some(pragma) = pragma {
            if pragma.is_empty() {
                ctx.error(diagnostics::invalid_pragma());
            } else {
                return Self::parse_impl(pragma);
            }
        }

        Self::Double(Cow::Borrowed("React"), Cow::Borrowed(default_property_name))
    }

    fn parse_impl(pragma: &str) -> Self {
        let strs_to_atoms = |parts: &[&str]| {
            parts
                .iter()
                .map(|part| Cow::Owned((*part).to_string()))
                .collect::<Vec<_>>()
        };

        let parts = pragma.split('.').collect::<Vec<_>>();
        match &parts[..] {
            [] => unreachable!(),
            ["this", rest @ ..] => Self::This(strs_to_atoms(rest)),
            ["import", "meta", rest @ ..] => Self::ImportMeta(strs_to_atoms(rest)),
            [first, second] => Self::Double(
                Cow::Owned((*first).to_string()),
                Cow::Owned((*second).to_string()),
            ),
            [only] => Self::Single(Cow::Owned((*only).to_string())),
            parts => Self::Multiple(strs_to_atoms(parts)),
        }
    }

    fn create_expression(&self) -> Expr {
        let (object, parts) = match self {
            Self::Double(first, second) => {
                let object = Box::new(Expr::Ident(Ident::new(
                    first.as_ref().into(),
                    DUMMY_SP,
                    Default::default(),
                )));
                return Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: object,
                    prop: MemberProp::Ident(IdentName::new(second.as_ref().into(), DUMMY_SP)),
                });
            }
            Self::Single(single) => {
                return Expr::Ident(Ident::new(
                    single.as_ref().into(),
                    DUMMY_SP,
                    Default::default(),
                ));
            }
            Self::Multiple(parts) => {
                let mut parts = parts.iter();
                let first = parts.next().unwrap();
                let object = Box::new(Expr::Ident(Ident::new(
                    first.as_ref().into(),
                    DUMMY_SP,
                    Default::default(),
                )));
                (object, parts)
            }
            Self::This(parts) => {
                let object = Box::new(Expr::This(ThisExpr { span: DUMMY_SP }));
                (object, parts.iter())
            }
            Self::ImportMeta(parts) => {
                let object = Box::new(Expr::MetaProp(MetaPropExpr {
                    span: DUMMY_SP,
                    kind: MetaPropKind::ImportMeta,
                }));
                (object, parts.iter())
            }
        };

        let mut expr = object;
        for item in parts {
            expr = Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: expr,
                prop: MemberProp::Ident(IdentName::new(item.as_ref().into(), DUMMY_SP)),
            }));
        }
        *expr
    }
}

impl JsxImpl {
    pub fn new(
        options: JsxOptions,
        object_rest_spread_options: Option<ObjectRestSpreadOptions>,
        ctx: &TransformCtx,
    ) -> Self {
        // Only add `pure` when `pure` is explicitly set to `true` or all JSX options
        // are default.
        let pure = options.pure || (options.import_source.is_none() && options.pragma.is_none());
        let bindings = match options.runtime {
            JsxRuntime::Classic => {
                if options.import_source.is_some() {
                    ctx.error(diagnostics::import_source_cannot_be_set());
                }
                let pragma = Pragma::parse(options.pragma.as_deref(), "createElement", ctx);
                let pragma_frag = Pragma::parse(options.pragma_frag.as_deref(), "Fragment", ctx);
                Bindings::Classic(ClassicBindings {
                    pragma,
                    pragma_frag,
                })
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
                        let jsx_runtime_importer = Cow::Owned(format!(
                            "{}/jsx-{}runtime",
                            import_source,
                            if is_development { "dev-" } else { "" }
                        ));
                        (jsx_runtime_importer, source_len)
                    }
                    None => {
                        let jsx_runtime_importer = if is_development {
                            Cow::Borrowed("react/jsx-dev-runtime")
                        } else {
                            Cow::Borrowed("react/jsx-runtime")
                        };
                        (jsx_runtime_importer, "react".len() as u32)
                    }
                };

                if ctx.module.is_script() {
                    Bindings::AutomaticScript(AutomaticScriptBindings::new(
                        jsx_runtime_importer,
                        source_len,
                        is_development,
                    ))
                } else {
                    Bindings::AutomaticModule(AutomaticModuleBindings::new(
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
            jsx_self: JsxSelf::new(),
            jsx_source: JsxSource::new(),
            bindings,
        }
    }
}

impl<'a> VisitMutHook<TraverseCtx<'a>> for JsxImpl {
    fn exit_program(&mut self, _program: &mut Program, ctx: &mut TraverseCtx<'a>) {
        self.insert_filename_var_statement(ctx);
    }

    #[inline]
    fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx<'a>) {
        if !matches!(expr, Expr::JSXElement(_) | Expr::JSXFragment(_)) {
            return;
        }
        *expr = match std::mem::replace(expr, Expr::Invalid(Invalid { span: DUMMY_SP })) {
            Expr::JSXElement(e) => self.transform_jsx_element(e, ctx),
            Expr::JSXFragment(e) => {
                let span = e.span;
                let children = e.children;
                self.transform_jsx(span, None, children, ctx)
            }
            _ => unreachable!(),
        };
    }
}

impl<'a> JsxImpl {
    fn is_script(&self, ctx: &TransformCtx) -> bool {
        ctx.module.is_script()
    }

    fn insert_filename_var_statement(&self, ctx: &TraverseCtx<'a>) {
        let Some(declarator) = self.jsx_source.get_filename_var_declarator(ctx) else {
            return;
        };

        // If is a module, add filename statements before `import`s. If script, then
        // after `require`s. This is the same behavior as Babel.
        // If in classic mode, then there are no import statements, so it doesn't matter
        // either way.
        if self.bindings.is_classic() || !self.is_script(ctx) {
            // Insert before imports - add to `top_level_statements` immediately
            let stmt = Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: vec![declarator],
                ..Default::default()
            })));
            ctx.top_level_statements.insert_statement(stmt);
        } else {
            // Insert after imports - add to `var_declarations`, which are inserted after
            // `require` statements
            ctx.var_declarations.insert_var_declarator(declarator);
        }
    }

    fn transform_jsx_element(
        &mut self,
        element: Box<JSXElement>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expr {
        let JSXElement {
            span,
            opening,
            children,
            ..
        } = *element;
        self.transform_jsx(span, Some(opening), children, ctx)
    }

    fn transform_jsx(
        &mut self,
        span: swc_common::Span,
        opening_element: Option<JSXOpeningElement>,
        children: Vec<JSXElementChild>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expr {
        let has_key_after_props_spread = opening_element
            .as_ref()
            .is_some_and(|e| Self::has_key_after_props_spread(e));
        // If has_key_after_props_spread is true, we need to fallback to `createElement`
        // same behavior as classic runtime
        let is_classic = self.bindings.is_classic() || has_key_after_props_spread;
        let is_automatic = !is_classic;
        let is_development = self.options.development;
        let is_element = opening_element.is_some();

        // The maximum capacity length of arguments allowed.
        let capacity = if is_classic { 3 + children.len() } else { 6 };
        let mut arguments = Vec::with_capacity(capacity);

        // The key prop in `<div key={true} />`
        let mut key_prop = None;

        // The object properties for the second argument of `React.createElement`
        let mut properties = Vec::new();
        let (element_name, attributes) = opening_element
            .map(|e| {
                let JSXOpeningElement { name, attrs, .. } = e;
                (Some(name), Some(attrs))
            })
            .unwrap_or_default();

        if let Some(attributes) = attributes {
            let attributes_len = attributes.len();
            for attribute in attributes {
                match attribute {
                    JSXAttrOrSpread::JSXAttr(attr) => {
                        let JSXAttr { span: _, name, value } = attr;
                        match &name {
                            JSXAttrName::Ident(ident)
                                if self.options.development
                                    && self.options.jsx_self_plugin
                                    && &*ident.sym == "__self" =>
                            {
                                self.jsx_self.report_error(ident.span, ctx);
                            }
                            JSXAttrName::Ident(ident)
                                if self.options.development
                                    && self.options.jsx_source_plugin
                                    && &*ident.sym == "__source" =>
                            {
                                self.jsx_source.report_error(ident.span, ctx);
                            }
                            JSXAttrName::Ident(ident) if &*ident.sym == "key" => {
                                if value.is_none() {
                                    ctx.error(diagnostics::valueless_key(ident.span));
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
                        let key = Self::get_attribute_name(name);
                        let value = self.transform_jsx_attribute_value(value, ctx);
                        let object_property =
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key,
                                value,
                            })));
                        properties.push(object_property);
                    }
                    // optimize `{...prop}` to `prop` in static mode
                    JSXAttrOrSpread::SpreadElement(spread) => {
                        let SpreadElement { expr, .. } = spread;
                        if is_classic
                            && attributes_len == 1
                            // Don't optimize when dev plugins are enabled - spread must be preserved
                            // to merge with injected `__self` and `__source` props
                            && !(self.options.jsx_self_plugin || self.options.jsx_source_plugin)
                        {
                            // deopt if spreading an object with `__proto__` key
                            if !matches!(&*expr, Expr::Object(o) if has_proto(o)) {
                                arguments.push(ExprOrSpread { spread: None, expr });
                                continue;
                            }
                        }

                        // Add attribute to prop object
                        match *expr {
                            Expr::Object(obj) if !has_proto(&obj) => {
                                properties.extend(obj.props);
                            }
                            expr => {
                                let object_property = PropOrSpread::Spread(SpreadElement {
                                    dot3_token: DUMMY_SP,
                                    expr: Box::new(expr),
                                });
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
            let mut children_exprs = children
                .into_iter()
                .filter_map(|child| self.transform_jsx_child_automatic(child, ctx))
                .collect::<Vec<_>>();
            let children_len = children_exprs.len();
            if children_len != 0 {
                let value: Box<Expr> = if children_len == 1 {
                    Box::new(children_exprs.pop().unwrap())
                } else {
                    need_jsxs = true;
                    let elements = children_exprs
                        .into_iter()
                        .map(|expr| {
                            Some(ExprOrSpread {
                                spread: None,
                                expr: Box::new(expr),
                            })
                        })
                        .collect();
                    Box::new(Expr::Array(ArrayLit {
                        span: DUMMY_SP,
                        elems: elements,
                    }))
                };
                let children = PropName::Ident(IdentName::new("children".into(), DUMMY_SP));
                let property = PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                    key: children,
                    value,
                })));
                properties.push(property);
            }

            // If runtime is automatic that means we always to add `{ .. }` as the second
            // argument even if it's empty
            let object_expression = Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: properties,
            }));
            // TODO: Object rest spread transformation is not yet implemented
            // if let Some(options) = self.object_rest_spread_options {
            //     ObjectRestSpread::transform_object_expression(
            //         options,
            //         &mut object_expression,
            //         self.ctx,
            //         ctx,
            //     );
            // }
            let _ = self.object_rest_spread_options;
            arguments.push(ExprOrSpread {
                spread: None,
                expr: object_expression,
            });

            // Only jsx and jsxDEV will have more than 2 arguments
            // key
            if key_prop.is_some() {
                arguments.push(ExprOrSpread {
                    spread: None,
                    expr: self.transform_jsx_attribute_value(key_prop, ctx),
                });
            } else if is_development {
                arguments.push(ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Unary(UnaryExpr {
                        span: DUMMY_SP,
                        op: op!("void"),
                        arg: Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        }))),
                    })),
                });
            }

            // isStaticChildren
            if is_development {
                arguments.push(ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Bool(Bool {
                        span: DUMMY_SP,
                        value: children_len > 1,
                    }))),
                });
            }

            // Fragment doesn't have source and self
            if is_element {
                // { __source: { fileName, lineNumber, columnNumber } }
                if self.options.jsx_source_plugin {
                    let (line, column) = self.jsx_source.get_line_column(span.lo.0);
                    let expr = Box::new(self.jsx_source.get_source_object(line, column));
                    arguments.push(ExprOrSpread { spread: None, expr });
                }

                // this
                if self.options.jsx_self_plugin && JsxSelf::can_add_self_attribute(ctx) {
                    arguments.push(ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                    });
                }
            }
        } else {
            // React.createElement's second argument
            if is_element {
                if self.options.jsx_self_plugin && JsxSelf::can_add_self_attribute(ctx) {
                    properties.push(JsxSelf::get_object_property_kind_for_jsx_plugin(ctx));
                }

                if self.options.jsx_source_plugin {
                    let (line, column) = self.jsx_source.get_line_column(span.lo.0);
                    properties.push(
                        self.jsx_source
                            .get_object_property_kind_for_jsx_plugin(line, column),
                    );
                }
            }

            if !properties.is_empty() {
                let object_expression = Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: properties,
                }));
                // TODO: Object rest spread transformation is not yet implemented
                // if let Some(options) = self.object_rest_spread_options {
                //     ObjectRestSpread::transform_object_expression(
                //         options,
                //         &mut object_expression,
                //         self.ctx,
                //         ctx,
                //     );
                // }
                let _ = self.object_rest_spread_options;
                arguments.push(ExprOrSpread {
                    spread: None,
                    expr: object_expression,
                });
            } else if arguments.is_empty() {
                // If not and second argument doesn't exist, we should add `null` as the second
                // argument
                let null_expr = Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP })));
                arguments.push(ExprOrSpread {
                    spread: None,
                    expr: null_expr,
                });
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
        // But we have to do it here to replicate the same import order as Babel, in
        // order to pass Babel's conformance tests.
        let argument_expr = if let Some(element_name) = element_name {
            self.transform_element_name(element_name, ctx)
        } else {
            self.get_fragment(ctx)
        };
        arguments.insert(
            0,
            ExprOrSpread {
                spread: None,
                expr: Box::new(argument_expr),
            },
        );
        debug_assert!(arguments.len() <= capacity);

        let callee = self.get_create_element(has_key_after_props_spread, need_jsxs, ctx);
        let call_expr = CallExpr {
            span,
            callee: Callee::Expr(Box::new(callee)),
            args: arguments,
            ..Default::default()
        };

        if self.pure {
            Expr::Paren(ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(Expr::Call(call_expr)),
            })
        } else {
            Expr::Call(call_expr)
        }
    }

    fn transform_element_name(&self, name: JSXElementName, ctx: &TraverseCtx<'a>) -> Expr {
        match name {
            JSXElementName::Ident(ident) => Expr::Lit(Lit::Str(Str {
                span: ident.span,
                value: ident.sym.into(),
                raw: None,
            })),
            JSXElementName::JSXMemberExpr(member_expr) => {
                Self::transform_jsx_member_expression(Box::new(member_expr), ctx)
            }
            JSXElementName::JSXNamespacedName(namespaced) => {
                if self.options.throw_if_namespace {
                    ctx.error(diagnostics::namespace_does_not_support(namespaced.span));
                }
                let namespace_name = format!("{}:{}", namespaced.ns.sym, namespaced.name.sym);
                Expr::Lit(Lit::Str(Str {
                    span: namespaced.span,
                    value: namespace_name.into(),
                    raw: None,
                }))
            }
        }
    }

    fn get_fragment(&mut self, ctx: &mut TraverseCtx<'a>) -> Expr {
        match &mut self.bindings {
            Bindings::Classic(bindings) => bindings.pragma_frag.create_expression(),
            Bindings::AutomaticScript(bindings) => {
                let object_ident = bindings.require_jsx(ctx);
                let property_name = "Fragment";
                create_static_member_expression(object_ident, property_name)
            }
            Bindings::AutomaticModule(bindings) => {
                let ident = bindings.import_fragment(ctx);
                Expr::Ident(ident)
            }
        }
    }

    fn get_create_element(
        &mut self,
        has_key_after_props_spread: bool,
        jsxs: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expr {
        match &mut self.bindings {
            Bindings::Classic(bindings) => bindings.pragma.create_expression(),
            Bindings::AutomaticScript(bindings) => {
                let (ident, property_name) = if has_key_after_props_spread {
                    (bindings.require_create_element(ctx), "createElement")
                } else {
                    let property_name = if bindings.is_development {
                        "jsxDEV"
                    } else if jsxs {
                        "jsxs"
                    } else {
                        "jsx"
                    };
                    (bindings.require_jsx(ctx), property_name)
                };
                create_static_member_expression(ident, property_name)
            }
            Bindings::AutomaticModule(bindings) => {
                let ident = if has_key_after_props_spread {
                    bindings.import_create_element(ctx)
                } else if jsxs {
                    bindings.import_jsxs(ctx)
                } else {
                    bindings.import_jsx(ctx)
                };
                Expr::Ident(ident)
            }
        }
    }

    fn transform_jsx_member_expression(expr: Box<JSXMemberExpr>, _ctx: &TraverseCtx<'a>) -> Expr {
        let JSXMemberExpr { obj, prop, .. } = *expr;
        let object = match obj {
            JSXObject::Ident(ident) => Box::new(Expr::Ident(ident)),
            JSXObject::JSXMemberExpr(expr) => {
                Box::new(Self::transform_jsx_member_expression(expr, _ctx))
            }
        };
        Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: object,
            prop: MemberProp::Ident(prop),
        })
    }

    fn transform_jsx_attribute_value(
        &mut self,
        value: Option<JSXAttrValue>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Box<Expr> {
        match value {
            Some(JSXAttrValue::Str(s)) => {
                let s_value_str = s.value.to_string_lossy();
                let decoded = decode_entities(&s_value_str);
                let jsx_text = if let Some(decoded) = decoded {
                    decoded.into()
                } else {
                    s.value
                };
                Box::new(Expr::Lit(Lit::Str(Str {
                    span: s.span,
                    value: jsx_text,
                    raw: None,
                })))
            }
            Some(JSXAttrValue::JSXElement(e)) => Box::new(self.transform_jsx_element(e, ctx)),
            Some(JSXAttrValue::JSXFragment(e)) => {
                let span = e.span;
                let children = e.children;
                Box::new(self.transform_jsx(span, None, children, ctx))
            }
            Some(JSXAttrValue::JSXExprContainer(c)) => match c.expr {
                JSXExpr::JSXEmptyExpr(_) => Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                }))),
                JSXExpr::Expr(expr) => expr,
            },
            None => Box::new(Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            }))),
        }
    }

    fn transform_jsx_child_automatic(
        &mut self,
        child: JSXElementChild,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expr> {
        // Align spread child behavior with esbuild.
        // Instead of Babel throwing `Spread children are not supported in React.`
        // `<>{...foo}</>` -> `jsxs(Fragment, { children: [ ...foo ] })`
        if let JSXElementChild::JSXSpreadChild(e) = child {
            let expr = e.expr;
            let elements = vec![Some(ExprOrSpread {
                spread: Some(DUMMY_SP),
                expr,
            })];
            Some(Expr::Array(ArrayLit {
                span: DUMMY_SP,
                elems: elements,
            }))
        } else {
            self.transform_jsx_child(child, ctx)
        }
    }

    fn transform_jsx_child_classic(
        &mut self,
        child: JSXElementChild,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<ExprOrSpread> {
        // Align spread child behavior with esbuild.
        // Instead of Babel throwing `Spread children are not supported in React.`
        // `<>{...foo}</>` -> `React.createElement(React.Fragment, null, ...foo)`
        if let JSXElementChild::JSXSpreadChild(e) = child {
            let expr = e.expr;
            Some(ExprOrSpread {
                spread: Some(DUMMY_SP),
                expr,
            })
        } else {
            self.transform_jsx_child(child, ctx)
                .map(|expr| ExprOrSpread {
                    spread: None,
                    expr: Box::new(expr),
                })
        }
    }

    fn transform_jsx_child(
        &mut self,
        child: JSXElementChild,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expr> {
        match child {
            JSXElementChild::JSXText(text) => Self::transform_jsx_text(&text),
            JSXElementChild::JSXExprContainer(e) => match e.expr {
                JSXExpr::Expr(expr) => Some(*expr),
                JSXExpr::JSXEmptyExpr(_) => None,
            },
            JSXElementChild::JSXElement(e) => Some(self.transform_jsx_element(e, ctx)),
            JSXElementChild::JSXFragment(e) => {
                let span = e.span;
                let children = e.children;
                Some(self.transform_jsx(span, None, children, ctx))
            }
            JSXElementChild::JSXSpreadChild(_) => unreachable!(),
        }
    }

    fn get_attribute_name(name: JSXAttrName) -> PropName {
        match name {
            JSXAttrName::Ident(ident) => {
                let name = ident.sym;
                if name.contains('-') {
                    PropName::Str(Str {
                        span: ident.span,
                        value: name.into(),
                        raw: None,
                    })
                } else {
                    PropName::Ident(IdentName {
                        span: ident.span,
                        sym: name,
                    })
                }
            }
            JSXAttrName::JSXNamespacedName(namespaced) => {
                let name = format!("{}:{}", namespaced.ns.sym, namespaced.name.sym);
                PropName::Str(Str {
                    span: namespaced.span,
                    value: name.into(),
                    raw: None,
                })
            }
        }
    }

    fn transform_jsx_text(text: &JSXText) -> Option<Expr> {
        fixup_whitespace_and_decode_entities(&text.value).map(|value| {
            Expr::Lit(Lit::Str(Str {
                span: text.span,
                value: value.into(),
                raw: None,
            }))
        })
    }

    /// JSX trims whitespace at the end and beginning of lines, except that the
    /// start/end of a tag is considered a start/end of a line only if that line
    /// is on the same line as the closing tag. See examples in
    /// tests/cases/conformance/jsx/tsxReactEmitWhitespace.tsx
    /// See also <https://www.w3.org/TR/html4/struct/text.html#h-9.1> and <https://www.w3.org/TR/CSS2/text.html#white-space-model>
    ///
    /// An equivalent algorithm would be:
    /// - If there is only one line, return it.
    /// - If there is only whitespace (but multiple lines), return `undefined`.
    /// - Split the text into lines.
    /// - 'trimRight' the first line, 'trimLeft' the last line, 'trim' middle
    ///   lines.
    /// - Decode entities on each line (individually).
    /// - Remove empty lines and join the rest with " ".
    ///
    /// <https://github.com/microsoft/TypeScript/blob/f0374ce2a9c465e27a15b7fa4a347e2bd9079450/src/compiler/transformers/jsx.ts#L557-L608>
    /// The react jsx/jsxs transform falls back to `createElement` when an
    /// explicit `key` argument comes after a spread <https://github.com/microsoft/TypeScript/blob/6134091642f57c32f50e7b5604635e4d37dd19e8/src/compiler/transformers/jsx.ts#L264-L278>
    fn has_key_after_props_spread(opening_element: &JSXOpeningElement) -> bool {
        let mut spread = false;
        for attr in &opening_element.attrs {
            if matches!(attr, JSXAttrOrSpread::SpreadElement(_)) {
                spread = true;
            } else if spread
                && matches!(attr, JSXAttrOrSpread::JSXAttr(a) if matches!(&a.name, JSXAttrName::Ident(ident) if &*ident.sym == "key"))
            {
                return true;
            }
        }
        false
    }
}

fn fixup_whitespace_and_decode_entities(text: &str) -> Option<Cow<str>> {
    let mut acc: Option<String> = None;
    let mut only_line: Option<&str> = None;
    let mut first_non_whitespace: Option<usize> = Some(0);
    let mut last_non_whitespace: Option<usize> = None;
    for (index, c) in text.char_indices() {
        if is_line_terminator(c) {
            if let (Some(first), Some(last)) = (first_non_whitespace, last_non_whitespace) {
                add_line_of_jsx_text(&text[first..last], &mut acc, &mut only_line, text.len());
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
        add_line_of_jsx_text(&text[first..], &mut acc, &mut only_line, text.len());
    }

    if let Some(acc) = acc {
        Some(Cow::Owned(acc))
    } else {
        only_line.map(Cow::Borrowed)
    }
}

fn add_line_of_jsx_text<'a>(
    trimmed_line: &'a str,
    acc: &mut Option<String>,
    only_line: &mut Option<&'a str>,
    text_len: usize,
) {
    if let Some(buffer) = acc.as_mut() {
        // Already some text in accumulator. Push a space before this line is added to
        // `acc`.
        buffer.push(' ');
    } else if let Some(only_line) = only_line.take() {
        // This is the 2nd line containing text. Previous line did not contain any HTML
        // entities. Generate an accumulator containing previous line and a
        // trailing space. Current line will be added to the accumulator
        // after it.
        let mut buffer = String::with_capacity(text_len);
        buffer.push_str(only_line);
        buffer.push(' ');
        *acc = Some(buffer);
    }

    // Decode any HTML entities in this line
    decode_entities_into(trimmed_line, acc, text_len);

    if acc.is_none() {
        // This is the first line containing text, and there are no HTML entities in
        // this line. Record this line in `only_line`.
        // If this turns out to be the only line, we won't need to construct an
        // `String`, so avoid all copying.
        *only_line = Some(trimmed_line);
    }
}

/// Replace entities like "&nbsp;", "&#123;", and "&#xDEADBEEF;" with the
/// characters they encode.
/// * See <https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>
///   Code adapted from <https://github.com/microsoft/TypeScript/blob/514f7e639a2a8466c075c766ee9857a30ed4e196/src/compiler/transformers/jsx.ts#L617C1-L635>
///
/// If either:
/// (a) Text contains any HTML entities that need to be decoded, or
/// (b) accumulator `acc` passed in to this method is `Some`
/// then push the decoded string to `acc` (initializing it first if
/// required).
///
/// Otherwise, leave `acc` as `None`. This indicates that the text contains
/// no HTML entities. Caller can use a slice of the original text,
/// rather than making any copies.
fn decode_entities_into(s: &str, acc: &mut Option<String>, text_len: usize) {
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
                let buffer = acc.get_or_insert_with(|| String::with_capacity(text_len));

                buffer.push_str(&s[prev..start]);
                prev = end + 1;
                let word = &s[start + 1..end];
                if let Some(decimal) = word.strip_prefix('#') {
                    if let Some(hex) = decimal.strip_prefix('x') {
                        if let Some(c) = u32::from_str_radix(hex, 16).ok().and_then(char::from_u32)
                        {
                            // `&#x0123;`
                            buffer.push(c);
                            continue;
                        }
                    } else if let Some(c) = decimal.parse::<u32>().ok().and_then(char::from_u32) {
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

/// Decode HTML entities in a string
fn decode_entities(s: &str) -> Option<String> {
    let mut acc = None;
    decode_entities_into(s, &mut acc, s.len());
    acc
}

fn create_static_member_expression(object_ident: Ident, property_name: &str) -> Expr {
    let object = Box::new(Expr::Ident(object_ident));
    let property = IdentName::new(property_name.into(), DUMMY_SP);
    Expr::Member(MemberExpr {
        span: DUMMY_SP,
        obj: object,
        prop: MemberProp::Ident(property),
    })
}

/// Check if an `ObjectExpression` has a property called `__proto__`.
///
/// Returns `true` for any of:
/// * `{ __proto__: ... }`
/// * `{ "__proto__": ... }`
/// * `{ ["__proto__"]: ... }`
///
/// Also currently returns `true` for `{ [__proto__]: ... }`, but that's
/// probably not correct.
fn has_proto(e: &ObjectLit) -> bool {
    e.props.iter().any(|p| match p {
        PropOrSpread::Prop(prop) => match &**prop {
            Prop::Shorthand(i) => &*i.sym == "__proto__",
            Prop::KeyValue(KeyValueProp { key, .. })
            | Prop::Getter(GetterProp { key, .. })
            | Prop::Setter(SetterProp { key, .. })
            | Prop::Method(MethodProp { key, .. }) => match key {
                PropName::Ident(i) => &*i.sym == "__proto__",
                PropName::Str(s) => &*s.value == "__proto__",
                PropName::Num(_) | PropName::BigInt(_) | PropName::Computed(_) => false,
            },
            Prop::Assign(_) => false,
        },
        PropOrSpread::Spread(_) => false,
    })
}

fn is_line_terminator(c: char) -> bool {
    matches!(c, '\n' | '\r' | '\u{2028}' | '\u{2029}')
}

fn is_white_space_single_line(c: char) -> bool {
    matches!(
        c,
        '\u{0009}' | '\u{000B}' | '\u{000C}' | '\u{0020}' | '\u{00A0}' | '\u{FEFF}'
    )
}
