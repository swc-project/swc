//! Utility to load helper functions.
//!
//! This module provides functionality to load helper functions in different
//! modes. It supports runtime, external, and inline (not yet implemented) modes
//! for loading helper functions.
//!
//! ## Usage
//!
//! You can call [`TransformCtx::helper_load`] to load a helper function and use
//! it in your CallExpression.
//!
//! ```rs
//! let callee = self.ctx.helper_load("helperName");
//! let call = self.ctx.ast.call_expression(callee, ...arguments);
//! ```
//!
//! And also you can call [`TransformCtx::helper_call`] directly to load and
//! call a helper function.
//!
//! ```rs
//! let call_expression = self.ctx.helper_call("helperName", ...arguments);
//! ```
//!
//! ## Modes
//!
//! ### Runtime ([`HelperLoaderMode::Runtime`])
//!
//! Uses `@oxc-project/runtime` as a dependency, importing helper functions from
//! the runtime.
//!
//! Generated code example:
//!
//! ```js
//! import helperName from "@oxc-project/runtime/helpers/helperName";
//! helperName(...arguments);
//! ```
//!
//! Based on [@babel/plugin-transform-runtime](https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-runtime).
//!
//! ### External ([`HelperLoaderMode::External`])
//!
//! Uses helper functions from a global `babelHelpers` variable. This is the
//! default mode for testing.
//!
//! Generated code example:
//!
//! ```js
//! babelHelpers.helperName(...arguments);
//! ```
//!
//! Based on [@babel/plugin-external-helpers](https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-external-helpers).
//!
//! ### Inline ([`HelperLoaderMode::Inline`])
//!
//! > Note: This mode is not currently implemented.
//!
//! Inline helper functions are inserted directly into the top of program.
//!
//! Generated code example:
//!
//! ```js
//! function helperName(...arguments) { ... } // Inlined helper function
//! helperName(...arguments);
//! ```
//!
//! Based on [@babel/helper](https://github.com/babel/babel/tree/v7.26.2/packages/babel-helpers).
//!
//! ## Implementation
//!
//! Unlike other "common" utilities, this one has no transformer. It adds
//! imports to the program via `ModuleImports` transform.

use std::{borrow::Cow, cell::RefCell};

use rustc_hash::FxHashMap;
use serde::Deserialize;
use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use crate::context::{TransformCtx, TraverseCtx};

/// Defines the mode for loading helper functions.
#[derive(Default, Clone, Copy, Debug, Deserialize)]
pub enum HelperLoaderMode {
    /// Inline mode: Helper functions are directly inserted into the program.
    ///
    /// Note: This mode is not currently implemented.
    ///
    /// Example output:
    /// ```js
    /// function helperName(...arguments) { ... } // Inlined helper function
    /// helperName(...arguments);
    /// ```
    Inline,
    /// External mode: Helper functions are accessed from a global
    /// `babelHelpers` object.
    ///
    /// This is the default mode used in Babel tests.
    ///
    /// Example output:
    /// ```js
    /// babelHelpers.helperName(...arguments);
    /// ```
    External,
    /// Runtime mode: Helper functions are imported from a runtime package.
    ///
    /// This mode is similar to how @babel/plugin-transform-runtime works.
    /// It's the default mode for this implementation.
    ///
    /// Example output:
    /// ```js
    /// import helperName from "@oxc-project/runtime/helpers/helperName";
    /// helperName(...arguments);
    /// ```
    #[default]
    Runtime,
}

/// Helper loader options.
#[derive(Clone, Debug, Deserialize)]
pub struct HelperLoaderOptions {
    #[serde(default = "default_as_module_name")]
    /// The module name to import helper functions from.
    /// Default: `@oxc-project/runtime`
    pub module_name: Cow<'static, str>,
    pub mode: HelperLoaderMode,
}

impl Default for HelperLoaderOptions {
    fn default() -> Self {
        Self {
            module_name: default_as_module_name(),
            mode: HelperLoaderMode::default(),
        }
    }
}

fn default_as_module_name() -> Cow<'static, str> {
    Cow::Borrowed("@oxc-project/runtime")
}

/// Available helpers.
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Debug)]
pub enum Helper {
    AwaitAsyncGenerator,
    AsyncGeneratorDelegate,
    AsyncIterator,
    AsyncToGenerator,
    ObjectSpread2,
    WrapAsyncGenerator,
    Extends,
    ObjectDestructuringEmpty,
    ObjectWithoutProperties,
    ToPropertyKey,
    DefineProperty,
    ClassPrivateFieldInitSpec,
    ClassPrivateMethodInitSpec,
    ClassPrivateFieldGet2,
    ClassPrivateFieldSet2,
    AssertClassBrand,
    ToSetter,
    ClassPrivateFieldLooseKey,
    ClassPrivateFieldLooseBase,
    SuperPropGet,
    SuperPropSet,
    ReadOnlyError,
    WriteOnlyError,
    CheckInRHS,
    Decorate,
    DecorateParam,
    DecorateMetadata,
    UsingCtx,
}

impl Helper {
    pub const fn name(self) -> &'static str {
        match self {
            Self::AwaitAsyncGenerator => "awaitAsyncGenerator",
            Self::AsyncGeneratorDelegate => "asyncGeneratorDelegate",
            Self::AsyncIterator => "asyncIterator",
            Self::AsyncToGenerator => "asyncToGenerator",
            Self::ObjectSpread2 => "objectSpread2",
            Self::WrapAsyncGenerator => "wrapAsyncGenerator",
            Self::Extends => "extends",
            Self::ObjectDestructuringEmpty => "objectDestructuringEmpty",
            Self::ObjectWithoutProperties => "objectWithoutProperties",
            Self::ToPropertyKey => "toPropertyKey",
            Self::DefineProperty => "defineProperty",
            Self::ClassPrivateFieldInitSpec => "classPrivateFieldInitSpec",
            Self::ClassPrivateMethodInitSpec => "classPrivateMethodInitSpec",
            Self::ClassPrivateFieldGet2 => "classPrivateFieldGet2",
            Self::ClassPrivateFieldSet2 => "classPrivateFieldSet2",
            Self::AssertClassBrand => "assertClassBrand",
            Self::ToSetter => "toSetter",
            Self::ClassPrivateFieldLooseKey => "classPrivateFieldLooseKey",
            Self::ClassPrivateFieldLooseBase => "classPrivateFieldLooseBase",
            Self::SuperPropGet => "superPropGet",
            Self::SuperPropSet => "superPropSet",
            Self::ReadOnlyError => "readOnlyError",
            Self::WriteOnlyError => "writeOnlyError",
            Self::CheckInRHS => "checkInRHS",
            Self::Decorate => "decorate",
            Self::DecorateParam => "decorateParam",
            Self::DecorateMetadata => "decorateMetadata",
            Self::UsingCtx => "usingCtx",
        }
    }

    pub const fn pure(self) -> bool {
        matches!(self, Self::ClassPrivateFieldLooseKey)
    }
}

/// Stores the state of the helper loader in [`TransformCtx`].
pub struct HelperLoaderStore {
    module_name: Cow<'static, str>,
    mode: HelperLoaderMode,
    /// Loaded helpers, determined what helpers are loaded and what imports
    /// should be added.
    loaded_helpers: RefCell<FxHashMap<Helper, Ident>>,
    pub(crate) used_helpers: RefCell<FxHashMap<Helper, String>>,
}

impl HelperLoaderStore {
    pub fn new(options: &HelperLoaderOptions) -> Self {
        Self {
            module_name: options.module_name.clone(),
            mode: options.mode,
            loaded_helpers: RefCell::new(FxHashMap::default()),
            used_helpers: RefCell::new(FxHashMap::default()),
        }
    }
}

// Public methods implemented directly on `TransformCtx`, as they need access to
// `TransformCtx::module_imports`.
impl TransformCtx {
    /// Load and call a helper function and return a `CallExpr`.
    pub fn helper_call<'a>(
        &self,
        helper: Helper,
        span: Span,
        arguments: Vec<ExprOrSpread>,
        _ctx: &mut TraverseCtx<'a>,
    ) -> CallExpr {
        let callee = self.helper_load(helper, span, _ctx);
        CallExpr {
            span,
            ctxt: SyntaxContext::empty(),
            callee: Callee::Expr(Box::new(callee)),
            args: arguments,
            type_args: None,
        }
    }

    /// Same as [`TransformCtx::helper_call`], but returns a `CallExpr`
    /// wrapped in an `Expr`.
    pub fn helper_call_expr<'a>(
        &self,
        helper: Helper,
        span: Span,
        arguments: Vec<ExprOrSpread>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expr {
        Expr::Call(self.helper_call(helper, span, arguments, ctx))
    }

    /// Load a helper function and return a callee expression.
    pub fn helper_load<'a>(&self, helper: Helper, span: Span, _ctx: &mut TraverseCtx<'a>) -> Expr {
        let helper_loader = &self.helper_loader;
        let source = helper_loader.get_runtime_source(helper);
        helper_loader
            .used_helpers
            .borrow_mut()
            .entry(helper)
            .or_insert_with(|| source.clone());

        match helper_loader.mode {
            HelperLoaderMode::Runtime => {
                helper_loader.transform_for_runtime_helper(helper, source, self, span)
            }
            HelperLoaderMode::External => {
                HelperLoaderStore::transform_for_external_helper(helper, span)
            }
            HelperLoaderMode::Inline => {
                unreachable!("Inline helpers are not supported yet");
            }
        }
    }
}

// Internal methods
impl HelperLoaderStore {
    fn transform_for_runtime_helper(
        &self,
        helper: Helper,
        source: String,
        transform_ctx: &TransformCtx,
        span: Span,
    ) -> Expr {
        let mut loaded_helpers = self.loaded_helpers.borrow_mut();
        let binding = loaded_helpers
            .entry(helper)
            .or_insert_with(|| Self::get_runtime_helper(helper, source, transform_ctx));
        Expr::Ident(binding.clone())
    }

    fn get_runtime_helper(helper: Helper, source: String, transform_ctx: &TransformCtx) -> Ident {
        let helper_name = helper.name();

        // Create a unique identifier for the helper
        let binding = Ident::new(helper_name.into(), DUMMY_SP, SyntaxContext::empty());

        transform_ctx
            .module_imports
            .add_default_import(source.into(), binding.sym.clone(), false);

        binding
    }

    // Construct string for the runtime source
    fn get_runtime_source(&self, helper: Helper) -> String {
        format!("{}/helpers/{}", self.module_name, helper.name())
    }

    fn transform_for_external_helper(helper: Helper, span: Span) -> Expr {
        static HELPER_VAR: &str = "babelHelpers";

        let object = Box::new(Expr::Ident(Ident::new(
            HELPER_VAR.into(),
            span,
            SyntaxContext::empty(),
        )));
        let property = MemberProp::Ident(IdentName::new(helper.name().into(), span));
        Expr::Member(MemberExpr {
            span,
            obj: object,
            prop: property,
        })
    }
}
