//! Utility to load helper functions.
//!
//! This module provides functionality to load helper functions in different modes.
//! It supports runtime, external, and inline (not yet implemented) modes for loading helper functions.
//!
//! ## Usage
//!
//! You can call [`TransformCtx::helper_load`] to load a helper function and use it in your CallExpression.
//!
//! ```rs
//! let callee = self.ctx.helper_load("helperName");
//! let call = self.ctx.ast.call_expression(callee, ...arguments);
//! ```
//!
//! And also you can call [`TransformCtx::helper_call`] directly to load and call a helper function.
//!
//! ```rs
//! let call_expression = self.ctx.helper_call("helperName", ...arguments);
//! ```
//!
//! ## Modes
//!
//! ### Runtime ([`HelperLoaderMode::Runtime`])
//!
//! Uses `@oxc-project/runtime` as a dependency, importing helper functions from the runtime.
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
//! Uses helper functions from a global `babelHelpers` variable. This is the default mode for testing.
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
//! Unlike other "common" utilities, this one has no transformer. It adds imports to the program
//! via `ModuleImports` transform.

use std::{borrow::Cow, cell::RefCell};

use rustc_hash::FxHashMap;
use serde::Deserialize;

use oxc_allocator::Vec as ArenaVec;
use oxc_ast::{
    NONE,
    ast::{Argument, CallExpression, Expression},
};
use oxc_semantic::{ReferenceFlags, SymbolFlags};
use oxc_span::{Atom, SPAN, Span};
use oxc_traverse::BoundIdentifier;

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
    /// External mode: Helper functions are accessed from a global `babelHelpers` object.
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
        Self { module_name: default_as_module_name(), mode: HelperLoaderMode::default() }
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
pub struct HelperLoaderStore<'a> {
    module_name: Cow<'static, str>,
    mode: HelperLoaderMode,
    /// Loaded helpers, determined what helpers are loaded and what imports should be added.
    loaded_helpers: RefCell<FxHashMap<Helper, BoundIdentifier<'a>>>,
    pub(crate) used_helpers: RefCell<FxHashMap<Helper, String>>,
}

impl HelperLoaderStore<'_> {
    pub fn new(options: &HelperLoaderOptions) -> Self {
        Self {
            module_name: options.module_name.clone(),
            mode: options.mode,
            loaded_helpers: RefCell::new(FxHashMap::default()),
            used_helpers: RefCell::new(FxHashMap::default()),
        }
    }
}

// Public methods implemented directly on `TransformCtx`, as they need access to `TransformCtx::module_imports`.
impl<'a> TransformCtx<'a> {
    /// Load and call a helper function and return a `CallExpression`.
    pub fn helper_call(
        &self,
        helper: Helper,
        span: Span,
        arguments: ArenaVec<'a, Argument<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> CallExpression<'a> {
        let callee = self.helper_load(helper, ctx);
        let pure = helper.pure();
        ctx.ast.call_expression_with_pure(span, callee, NONE, arguments, false, pure)
    }

    /// Same as [`TransformCtx::helper_call`], but returns a `CallExpression` wrapped in an `Expression`.
    pub fn helper_call_expr(
        &self,
        helper: Helper,
        span: Span,
        arguments: ArenaVec<'a, Argument<'a>>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let callee = self.helper_load(helper, ctx);
        let pure = helper.pure();
        ctx.ast.expression_call_with_pure(span, callee, NONE, arguments, false, pure)
    }

    /// Load a helper function and return a callee expression.
    pub fn helper_load(&self, helper: Helper, ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
        let helper_loader = &self.helper_loader;
        let source = helper_loader.get_runtime_source(helper, ctx);
        helper_loader.used_helpers.borrow_mut().entry(helper).or_insert_with(|| source.to_string());

        match helper_loader.mode {
            HelperLoaderMode::Runtime => {
                helper_loader.transform_for_runtime_helper(helper, source, self, ctx)
            }
            HelperLoaderMode::External => {
                HelperLoaderStore::transform_for_external_helper(helper, ctx)
            }
            HelperLoaderMode::Inline => {
                unreachable!("Inline helpers are not supported yet");
            }
        }
    }
}

// Internal methods
impl<'a> HelperLoaderStore<'a> {
    fn transform_for_runtime_helper(
        &self,
        helper: Helper,
        source: Atom<'a>,
        transform_ctx: &TransformCtx<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Expression<'a> {
        let mut loaded_helpers = self.loaded_helpers.borrow_mut();
        let binding = loaded_helpers
            .entry(helper)
            .or_insert_with(|| Self::get_runtime_helper(helper, source, transform_ctx, ctx));
        binding.create_read_expression(ctx)
    }

    fn get_runtime_helper(
        helper: Helper,
        source: Atom<'a>,
        transform_ctx: &TransformCtx<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> BoundIdentifier<'a> {
        let helper_name = helper.name();

        let flag = if transform_ctx.source_type.is_module() {
            SymbolFlags::Import
        } else {
            SymbolFlags::FunctionScopedVariable
        };
        let binding = ctx.generate_uid_in_root_scope(helper_name, flag);

        transform_ctx.module_imports.add_default_import(source, binding.clone(), false);

        binding
    }

    // Construct string directly in arena without an intermediate temp allocation
    fn get_runtime_source(&self, helper: Helper, ctx: &TraverseCtx<'a>) -> Atom<'a> {
        ctx.ast.atom_from_strs_array([&self.module_name, "/helpers/", helper.name()])
    }

    fn transform_for_external_helper(helper: Helper, ctx: &mut TraverseCtx<'a>) -> Expression<'a> {
        static HELPER_VAR: &str = "babelHelpers";

        let symbol_id = ctx.scoping().find_binding(ctx.current_scope_id(), HELPER_VAR);
        let object =
            ctx.create_ident_expr(SPAN, Atom::from(HELPER_VAR), symbol_id, ReferenceFlags::Read);
        let property = ctx.ast.identifier_name(SPAN, Atom::from(helper.name()));
        Expression::from(ctx.ast.member_expression_static(SPAN, object, property, false))
    }
}
