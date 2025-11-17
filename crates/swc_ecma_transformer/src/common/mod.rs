//! Common utilities for ECMAScript transformers.
//!
//! This module provides foundational utilities used across different
//! transformation passes:
//!
//! - [`helper_loader`]: Manages helper function imports and loading
//! - [`module_imports`]: Tracks and generates import statements
//! - [`statement_injector`]: Utilities for inserting statements before/after
//!   AST nodes
//! - [`var_declarations`]: Helpers for creating and managing variable
//!   declarations
//!
//! These utilities are designed to work with SWC's AST and visitor patterns,
//! providing the infrastructure needed by individual transform passes.

pub mod helper_loader;
pub mod module_imports;
pub mod statement_injector;
pub mod var_declarations;

pub use helper_loader::{Helper, HelperLoader, HelperLoaderMode, HelperLoaderOptions};
pub use module_imports::ModuleImports;
pub use statement_injector::StatementInjector;
pub use var_declarations::VarDeclarations;
