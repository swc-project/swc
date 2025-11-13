use std::{
    cell::RefCell,
    mem,
    path::{Path, PathBuf},
};

use swc_common::errors::DiagnosticBuilder;

use crate::{
    common::{
        helper_loader::HelperLoaderStore, module_imports::ModuleImportsStore,
        statement_injector::StatementInjectorStore, top_level_statements::TopLevelStatementsStore,
        var_declarations::VarDeclarationsStore,
    },
    state::TransformState,
    CompilerAssumptions, Module, TransformOptions,
};

/// Context type for SWC's visitor hooks.
///
/// This type represents the traversal context passed through visitor methods.
/// It is designed to be compatible with `VisitMutHook<TraverseCtx>` from
/// swc_ecma_hooks.
///
/// In SWC's architecture, the context provides access to the transform state
/// and can be extended with additional data needed during transformation.
pub type TraverseCtx<'a> = TransformState<'a>;

/// Transform context containing configuration and state for the transformation.
///
/// This struct holds all the necessary information and utilities for
/// transforming JavaScript/TypeScript code, including file information, module
/// configuration, compiler assumptions, and various helper stores for managing
/// code generation.
pub struct TransformCtx<'a> {
    /// Collection of diagnostic errors encountered during transformation
    errors: RefCell<Vec<DiagnosticBuilder<'a>>>,

    /// Filename without extension from the source path
    ///
    /// See: <https://babeljs.io/docs/options#filename>
    pub filename: String,

    /// Source path in the form of `<CWD>/path/to/file/input.js`
    pub source_path: PathBuf,

    /// Module system type (ESM, CommonJS, etc.)
    pub module: Module,

    /// Compiler assumptions for producing smaller output
    ///
    /// See: <https://babeljs.io/docs/assumptions>
    pub assumptions: CompilerAssumptions,

    // Helpers
    /// Manage helper loading for runtime helpers
    pub helper_loader: HelperLoaderStore,
    /// Manage import statements globally across the module
    pub module_imports: ModuleImportsStore,
    /// Manage inserting `var` statements globally
    pub var_declarations: VarDeclarationsStore,
    /// Manage inserting statements immediately before or after the target
    /// statement
    pub statement_injector: StatementInjectorStore,
    /// Manage inserting statements at top of program globally
    pub top_level_statements: TopLevelStatementsStore,

    // State for multiple plugins interacting
    /// Indicates if class properties plugin is enabled
    pub is_class_properties_plugin_enabled: bool,
}

impl<'a> TransformCtx<'a> {
    /// Creates a new transform context from a source path and transform
    /// options.
    ///
    /// # Arguments
    ///
    /// * `source_path` - Path to the source file being transformed
    /// * `options` - Transformation options including module system,
    ///   assumptions, etc.
    pub fn new(source_path: &Path, options: &TransformOptions) -> Self {
        let filename = source_path
            .file_stem() // omit file extension
            .map_or_else(
                || String::from("unknown"),
                |name| name.to_string_lossy().to_string(),
            );

        Self {
            errors: RefCell::new(vec![]),
            filename,
            source_path: source_path.to_path_buf(),
            module: options.env.module,
            assumptions: options.assumptions,
            helper_loader: HelperLoaderStore::new(&options.helper_loader),
            module_imports: ModuleImportsStore::new(),
            var_declarations: VarDeclarationsStore::new(),
            statement_injector: StatementInjectorStore::new(),
            top_level_statements: TopLevelStatementsStore::new(),
            is_class_properties_plugin_enabled: options.env.es2022.class_properties.is_some(),
        }
    }

    /// Takes ownership of all accumulated errors, leaving the error vector
    /// empty.
    ///
    /// This is typically called after transformation to retrieve any
    /// diagnostics that were collected during the process.
    pub fn take_errors(&self) -> Vec<DiagnosticBuilder<'a>> {
        mem::take(&mut self.errors.borrow_mut())
    }

    /// Adds a diagnostic error to the error collection.
    ///
    /// Errors are accumulated during transformation and can be retrieved later
    /// using `take_errors()`.
    pub fn error(&self, error: DiagnosticBuilder<'a>) {
        self.errors.borrow_mut().push(error);
    }
}
