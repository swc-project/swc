//! The main crate of the swc project.
//!
//!
//!
//! # Customizing
//!
//!
//! This is documentation for building custom build tools on top of swc.
//!
//! ## Dependency version management
//!
//! The [swc_css](https://docs.rs/swc_css) facade crate re-exports the modules
//! required to build CSS tooling.
//!
//! ## Testing
//!
//! See [testing](https://docs.rs/testing) and
//! [swc_ecma_transforms_testing](https://docs.rs/swc_ecma_transforms_testing).
//!
//! ## Custom javascript transforms
//!
//!
//!
//! ### What is [Atom](swc_atoms::Atom)?
//!
//! It's basically an interned string. See [swc_atoms].
//!
//! ### Choosing between [Atom](swc_atoms::Atom) vs String
//!
//! You should  prefer [Atom](swc_atoms::Atom) over [String] if it's going
//! to be stored in an AST node.
//!
//! See [swc_atoms] for detailed description.
//!
//! ### Fold vs VisitMut vs Visit
//!
//! See [swc_visit] for detailed description.
//!
//!
//!  - [Fold](swc_ecma_visit::Fold)
//!  - [VisitMut](swc_ecma_visit::VisitMut)
//!  - [Visit](swc_ecma_visit::Visit)
//!
//!
//! ### Variable management (Scoping)
//!
//! See [swc_ecma_transforms::resolver].
//!
//! #### How identifiers work
//!
//! See the doc on [swc_ecma_ast::Ident] or on
//! [swc_ecma_transforms::resolver].
//!
//! #### Comparing two identifiers
//!
//! See [swc_ecma_ast::Id]. You can use
//! [swc_ecma_utils::ident::IdentLike::to_id] to extract important parts of an
//! [swc_ecma_ast::Ident].
//!
//! #### Creating a unique identifier
//!
//! See [swc_ecma_utils::private_ident].
//!
//! #### Prepending statements
//!
//! If you want to prepend statements to the beginning of a file, you can use
//! [swc_ecma_utils::prepend_stmts] or [swc_ecma_utils::prepend_stmt].
//!
//! These methods are aware of the fact that `"use strict"` directive should be
//! first in a file, and insert statements after directives.
//!
//! ### Improving readability
//!
//! Each stuffs are documented at itself.
//!
//!  - If you are creating or binding an [swc_ecma_ast::Expr] with operator, you
//!    can use [swc_ecma_ast::op].
//!
//!  - If you want to create [swc_ecma_ast::CallExpr], you can use
//!    [swc_ecma_utils::ExprFactory::as_callee] to create `callee`.
//!
//!  - If you want to create [swc_ecma_ast::CallExpr] or
//!    [swc_ecma_ast::NewExpr], you can use
//!    [swc_ecma_utils::ExprFactory::as_arg] to create arguments.
//!
//!
//!  - If you want to create [swc_ecma_ast::MemberExpr] where all identifiers
//!    are static (e.g. `Object.prototype.hasOwnProperty`), you can use
//!    [swc_ecma_utils::member_expr].
//!
//! ### Reducing binary size
//!
//! The visitor expands to a lot of code. You can reduce it by using macros like
//!
//!  - [noop_fold_type](swc_ecma_visit::noop_fold_type)
//!  - [noop_visit_mut_type](swc_ecma_visit::noop_visit_mut_type)
//!  - [noop_visit_type](swc_ecma_visit::noop_visit_type)
//!
//! These macros skip type-specific nodes. Use them only at a boundary where the
//! program is known not to contain such nodes.
//!
//! ### Porting `expr.evaluate()` of babel
//!
//! See [swc_ecma_minifier::eval::Evaluator].
#![deny(unused)]
#![allow(clippy::too_many_arguments)]
#![allow(clippy::mutable_key_type)]
#![cfg_attr(docsrs, feature(doc_cfg))]

pub extern crate swc_atoms as atoms;
extern crate swc_common as common;
/// React Compiler APIs.
#[cfg(feature = "react-compiler")]
#[cfg_attr(docsrs, doc(cfg(feature = "react-compiler")))]
pub extern crate swc_ecma_react_compiler as react_compiler;

use std::sync::Arc;

use anyhow::Error;
use swc_common::{
    comments::Comments,
    errors::{Handler, HANDLER},
    SourceFile, SourceMap, GLOBALS,
};
pub use swc_compiler_base::{PrintArgs, TransformOutput};
pub use swc_config::types::{BoolConfig, BoolOr, BoolOrDataConfig};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::Node;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms::helpers::{self, HelperData, Helpers};
use swc_ecma_visit::{FoldWith, VisitWith};
pub use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
pub use swc_node_comments::SwcComments;
pub use swc_sourcemap as sourcemap;

mod codegen;
pub mod config;
mod dropped_comments_preserver;
mod flow;
mod input_source_map;
mod legacy;
mod minify;
mod pipeline;
mod plugin;
pub mod resolver;

pub use minify::JsMinifyExtras;
pub use pipeline::{
    CompileInput, CompileRequest, PipelineContext, PipelineHooks, TransformedProgram,
};
pub mod wasm_analysis;

/// A compiler backed by a shared source map.
///
/// Compilation and parsing methods that emit diagnostics accept a
/// [`swc_common::errors::Handler`]. The caller should inspect that handler
/// after the operation completes. Transform operations also require the caller
/// to install [`swc_common::GLOBALS`].
pub struct Compiler {
    /// Source map used by parsing, transforms, diagnostics, and code
    /// generation.
    pub cm: Arc<SourceMap>,
    comments: SwcComments,
}

impl Compiler {
    pub fn new(cm: Arc<SourceMap>) -> Self {
        Compiler {
            cm,
            comments: Default::default(),
        }
    }

    pub fn comments(&self) -> &SwcComments {
        &self.comments
    }

    /// Runs `op`, checking in debug builds that the caller installed
    /// [`swc_common::GLOBALS`].
    ///
    /// This method does not install the globals.
    pub fn run<R, F>(&self, op: F) -> R
    where
        F: FnOnce() -> R,
    {
        debug_assert!(
            GLOBALS.is_set(),
            "`swc_common::GLOBALS` is required for this operation"
        );

        op()
    }

    /// Runs an AST transform with the helper and diagnostic scopes installed.
    ///
    /// The caller must already have installed [`swc_common::GLOBALS`].
    pub fn run_transform<F, Ret>(&self, handler: &Handler, external_helpers: bool, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        self.run_transform_scope(handler, external_helpers, op, |result, _| result)
    }

    /// Runs an AST transform and returns the helper requirements it recorded.
    pub(crate) fn run_transform_with_helpers<F, Ret>(
        &self,
        handler: &Handler,
        external_helpers: bool,
        op: F,
    ) -> (Ret, HelperData)
    where
        F: FnOnce() -> Ret,
    {
        self.run_transform_scope(handler, external_helpers, op, |result, helpers| {
            (result, helpers.data())
        })
    }

    fn run_transform_scope<F, Ret, Finish, Output>(
        &self,
        handler: &Handler,
        external_helpers: bool,
        op: F,
        finish: Finish,
    ) -> Output
    where
        F: FnOnce() -> Ret,
        Finish: FnOnce(Ret, &Helpers) -> Output,
    {
        self.run(|| {
            let helpers = Helpers::new(external_helpers);
            helpers::HELPERS.set(&helpers, || HANDLER.set(handler, || finish(op(), &helpers)))
        })
    }

    /// Applies a fold with the helper and diagnostic scopes installed.
    #[cfg_attr(debug_assertions, tracing::instrument(skip_all))]
    pub fn transform(
        &self,
        handler: &Handler,
        program: Program,
        external_helpers: bool,
        mut pass: impl swc_ecma_visit::Fold,
    ) -> Program {
        self.run_transform(handler, external_helpers, || {
            // Fold module
            program.fold_with(&mut pass)
        })
    }

    /// Parses a JavaScript, TypeScript, or, when enabled, Flow file.
    pub fn parse_js(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        target: EsVersion,
        syntax: Syntax,
        is_module: config::IsModule,
        comments: Option<&dyn Comments>,
    ) -> Result<Program, Error> {
        swc_compiler_base::parse_js(
            self.cm.clone(),
            fm,
            handler,
            target,
            syntax,
            is_module,
            comments,
        )
    }

    /// Converts an AST node to source code and an optional source map.
    ///
    /// This method receives the target file path but does not write to it. See
    /// <https://github.com/swc-project/swc/issues/1255>.
    #[allow(clippy::too_many_arguments)]
    pub fn print<T>(&self, node: &T, args: PrintArgs) -> Result<TransformOutput, Error>
    where
        T: Node + VisitWith<swc_compiler_base::IdentCollector>,
    {
        swc_compiler_base::print(self.cm.clone(), node, args)
    }

    /// Compiles a source file with the direct linear pipeline.
    #[cfg_attr(
        debug_assertions,
        tracing::instrument(target = "swc::pipeline", skip(self, handler, opts))
    )]
    pub fn process_js_file(
        &self,
        fm: Arc<SourceFile>,
        handler: &Handler,
        opts: &config::Options,
    ) -> Result<TransformOutput, Error> {
        self.compile(handler, CompileInput::source(fm), opts)
            .codegen()
    }

    /// Creates a lazy request for the direct linear compilation pipeline.
    pub fn compile<'a>(
        &'a self,
        handler: &'a Handler,
        input: CompileInput,
        options: &'a config::Options,
    ) -> CompileRequest<'a> {
        CompileRequest::new(self, handler, input, options)
    }
}
