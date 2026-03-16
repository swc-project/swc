#![deny(clippy::all)]

use swc_common::errors::HANDLER;
use swc_ecma_ast::{Pass, Program};
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

pub mod entrypoint;
pub mod error;
pub mod fast_check;
pub mod hir;
pub mod inference;
pub mod optimization;
pub mod options;
pub mod reactive_scopes;
pub mod ssa;
pub mod transform;
pub mod utils;
pub mod validation;

pub use crate::{
    entrypoint::{compile_fn, compile_program, CompileReport, CompilerPass},
    error::{CompilerDiagnostic, CompilerError, CompilerErrorDetail, ErrorCategory, ErrorSeverity},
    options::{
        default_options, parse_plugin_options, CompilationMode, CompilerOutputMode,
        CompilerReactTarget, DynamicGatingOptions, EnvironmentConfig,
        ExhaustiveEffectDependenciesMode, ExternalFunction, Logger, LoggerEvent,
        PanicThresholdOptions, ParsedPluginOptions, PluginOptions, SourceSelection,
    },
    reactive_scopes::CodegenFunction,
};

/// Returns a SWC pass wrapper for React Compiler.
pub fn react_compiler(options: ParsedPluginOptions) -> impl Pass {
    visit_mut_pass(ReactCompilerVisitor { options })
}

struct ReactCompilerVisitor {
    options: ParsedPluginOptions,
}

impl VisitMut for ReactCompilerVisitor {
    fn visit_mut_program(&mut self, program: &mut Program) {
        let pass = CompilerPass {
            opts: self.options.clone(),
            filename: None,
            comments: Vec::new(),
            code: None,
        };

        if let Err(err) = compile_program(program, &pass) {
            if HANDLER.is_set() {
                HANDLER.with(|handler| {
                    handler.struct_err(&err.to_string()).emit();
                });
            }
        }

        program.visit_mut_children_with(self);
    }
}
