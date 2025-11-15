//! Utility to load helper functions.
//!
//! This module provides functionality to load helper functions in different
//! modes, adapted from oxc_transformer's helper_loader module to work with
//! SWC's AST.
//!
//! ## Usage
//!
//! ```ignore
//! use swc_ecma_transformer::common::{Helper, HelperLoader, HelperLoaderMode};
//!
//! // Create a helper loader
//! let loader = HelperLoader::new(HelperLoaderMode::Runtime, "@swc/helpers");
//!
//! // Load a helper (returns the identifier or member expression to use)
//! let helper_expr = loader.load(Helper::AsyncToGenerator);
//! ```
//!
//! ## Modes
//!
//! ### Runtime ([`HelperLoaderMode::Runtime`])
//!
//! Uses `@swc/helpers` as a dependency, importing helper functions from the
//! runtime.
//!
//! Generated code example:
//!
//! ```js
//! import helperName from "@swc/helpers/helperName";
//! helperName(...arguments);
//! ```
//!
//! ### External ([`HelperLoaderMode::External`])
//!
//! Uses helper functions from a global `babelHelpers` variable.
//!
//! Generated code example:
//!
//! ```js
//! babelHelpers.helperName(...arguments);
//! ```
//!
//! ### Inline ([`HelperLoaderMode::Inline`])
//!
//! > Note: This mode is not currently implemented.
//!
//! Inline helper functions are inserted directly into the top of program.

use std::borrow::Cow;

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

/// Defines the mode for loading helper functions.
#[derive(Default, Clone, Copy, Debug, PartialEq, Eq)]
pub enum HelperLoaderMode {
    /// Inline mode: Helper functions are directly inserted into the program.
    ///
    /// Note: This mode is not currently implemented.
    Inline,

    /// External mode: Helper functions are accessed from a global
    /// `babelHelpers` object.
    ///
    /// Example output:
    /// ```js
    /// babelHelpers.helperName(...arguments);
    /// ```
    External,

    /// Runtime mode: Helper functions are imported from a runtime package.
    ///
    /// This is the default mode for this implementation.
    ///
    /// Example output:
    /// ```js
    /// import helperName from "@swc/helpers/helperName";
    /// helperName(...arguments);
    /// ```
    #[default]
    Runtime,
}

/// Helper loader options.
#[derive(Clone, Debug)]
pub struct HelperLoaderOptions {
    /// The module name to import helper functions from.
    /// Default: `@swc/helpers`
    pub module_name: Cow<'static, str>,

    /// The mode to use for loading helpers.
    pub mode: HelperLoaderMode,
}

impl Default for HelperLoaderOptions {
    fn default() -> Self {
        Self {
            module_name: Cow::Borrowed("@swc/helpers"),
            mode: HelperLoaderMode::default(),
        }
    }
}

/// Available helper functions.
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
    /// Returns the name of this helper function.
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

    /// Returns whether this helper is pure (has no side effects).
    pub const fn pure(self) -> bool {
        matches!(self, Self::ClassPrivateFieldLooseKey)
    }
}

/// Helper function loader.
///
/// Manages the loading of helper functions according to the configured mode.
/// This is a simpler implementation than oxc's, designed to work with SWC's
/// patterns.
pub struct HelperLoader {
    mode: HelperLoaderMode,
    module_name: Cow<'static, str>,
}

impl HelperLoader {
    /// Creates a new helper loader with the given mode and module name.
    pub fn new(mode: HelperLoaderMode, module_name: impl Into<Cow<'static, str>>) -> Self {
        Self {
            mode,
            module_name: module_name.into(),
        }
    }

    /// Creates a new helper loader from options.
    pub fn from_options(options: &HelperLoaderOptions) -> Self {
        Self {
            mode: options.mode,
            module_name: options.module_name.clone(),
        }
    }

    /// Returns the mode this loader is using.
    pub fn mode(&self) -> HelperLoaderMode {
        self.mode
    }

    /// Returns the module name for runtime helpers.
    pub fn module_name(&self) -> &str {
        &self.module_name
    }

    /// Gets the source path for a runtime helper.
    ///
    /// For example, for `AsyncToGenerator` helper with module name
    /// `@swc/helpers`, returns `@swc/helpers/asyncToGenerator`.
    pub fn get_runtime_source(&self, helper: Helper) -> String {
        format!("{}/{}", self.module_name, helper.name())
    }

    /// Creates an expression to access the helper function.
    ///
    /// The returned expression depends on the mode:
    /// - Runtime: Returns an identifier (to be imported separately)
    /// - External: Returns a member expression (`babelHelpers.helperName`)
    /// - Inline: Currently unimplemented
    pub fn create_helper_expr(&self, helper: Helper) -> Box<Expr> {
        match self.mode {
            HelperLoaderMode::Runtime => {
                // For runtime mode, we return an identifier.
                // The import should be added separately via module_imports.
                Box::new(Expr::Ident(Ident::new(
                    helper.name().to_string().into(),
                    DUMMY_SP,
                    Default::default(),
                )))
            }
            HelperLoaderMode::External => {
                // For external mode, create babelHelpers.helperName
                Box::new(Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Expr::Ident(Ident::new(
                        "babelHelpers".to_string().into(),
                        DUMMY_SP,
                        Default::default(),
                    ))),
                    prop: MemberProp::Ident(IdentName::new(
                        helper.name().to_string().into(),
                        DUMMY_SP,
                    )),
                }))
            }
            HelperLoaderMode::Inline => {
                unimplemented!("Inline helpers are not yet supported")
            }
        }
    }

    /// Creates a call expression for the helper function.
    ///
    /// This is a convenience method that creates the helper expression and
    /// wraps it in a call expression with the provided arguments.
    pub fn create_helper_call(&self, helper: Helper, args: Vec<ExprOrSpread>) -> Box<Expr> {
        let callee = Callee::Expr(self.create_helper_expr(helper));

        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee,
            args,
            ..Default::default()
        }))
    }
}

impl Default for HelperLoader {
    fn default() -> Self {
        Self::from_options(&HelperLoaderOptions::default())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_helper_names() {
        assert_eq!(Helper::AsyncToGenerator.name(), "asyncToGenerator");
        assert_eq!(Helper::ObjectSpread2.name(), "objectSpread2");
        assert_eq!(Helper::Extends.name(), "extends");
    }

    #[test]
    fn test_helper_pure() {
        assert!(Helper::ClassPrivateFieldLooseKey.pure());
        assert!(!Helper::AsyncToGenerator.pure());
        assert!(!Helper::Extends.pure());
    }

    #[test]
    fn test_helper_loader_runtime_source() {
        let loader = HelperLoader::new(HelperLoaderMode::Runtime, "@swc/helpers");
        assert_eq!(
            loader.get_runtime_source(Helper::AsyncToGenerator),
            "@swc/helpers/asyncToGenerator"
        );
    }

    #[test]
    fn test_helper_loader_runtime_expr() {
        let loader = HelperLoader::new(HelperLoaderMode::Runtime, "@swc/helpers");
        let expr = loader.create_helper_expr(Helper::AsyncToGenerator);

        match &*expr {
            Expr::Ident(ident) => {
                assert_eq!(&*ident.sym, "asyncToGenerator");
            }
            _ => panic!("Expected identifier expression"),
        }
    }

    #[test]
    fn test_helper_loader_external_expr() {
        let loader = HelperLoader::new(HelperLoaderMode::External, "@swc/helpers");
        let expr = loader.create_helper_expr(Helper::AsyncToGenerator);

        match &*expr {
            Expr::Member(member) => {
                match &*member.obj {
                    Expr::Ident(ident) => {
                        assert_eq!(&*ident.sym, "babelHelpers");
                    }
                    _ => panic!("Expected identifier for object"),
                }
                match &member.prop {
                    MemberProp::Ident(ident) => {
                        assert_eq!(&*ident.sym, "asyncToGenerator");
                    }
                    _ => panic!("Expected identifier property"),
                }
            }
            _ => panic!("Expected member expression"),
        }
    }

    #[test]
    fn test_helper_loader_call() {
        let loader = HelperLoader::new(HelperLoaderMode::Runtime, "@swc/helpers");
        let expr = loader.create_helper_call(Helper::AsyncToGenerator, vec![]);

        match &*expr {
            Expr::Call(call) => {
                assert!(call.args.is_empty());
            }
            _ => panic!("Expected call expression"),
        }
    }

    #[test]
    fn test_default_options() {
        let options = HelperLoaderOptions::default();
        assert_eq!(options.module_name, "@swc/helpers");
        assert_eq!(options.mode, HelperLoaderMode::Runtime);
    }

    #[test]
    fn test_custom_module_name() {
        let loader = HelperLoader::new(HelperLoaderMode::Runtime, "custom-helpers");
        assert_eq!(
            loader.get_runtime_source(Helper::Extends),
            "custom-helpers/extends"
        );
    }
}
