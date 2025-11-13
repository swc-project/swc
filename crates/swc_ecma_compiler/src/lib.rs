//! Transformer / Transpiler
//!
//! References:
//! * <https://www.typescriptlang.org/tsconfig#target>
//! * <https://babel.dev/docs/presets>
//! * <https://github.com/microsoft/TypeScript/blob/v5.6.3/src/compiler/transformer.ts>

use std::path::Path;

use swc_common::errors::DiagnosticBuilder;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

// Core
mod common;
mod compiler_assumptions;
mod context;
mod options;
mod state;
mod utils;

// Presets: <https://babel.dev/docs/presets>
mod es2015;
mod es2016;
mod es2017;
mod es2018;
mod es2019;
mod es2020;
mod es2021;
mod es2022;
mod es2026;
mod jsx;
mod proposals;
mod regexp;
mod typescript;

mod decorator;
mod plugins;

use common::Common;
use context::{TransformCtx, TraverseCtx};
use decorator::DecoratorTransform;
use es2015::ES2015;
use es2016::ES2016;
use es2017::ES2017;
use es2018::ES2018;
use es2019::ES2019;
use es2020::ES2020;
use es2021::ES2021;
use es2022::ES2022;
use es2026::ES2026;
use jsx::Jsx;
use regexp::RegExp;
use rustc_hash::FxHashMap;
use state::TransformState;
use typescript::TypeScript;

use crate::plugins::Plugins;
pub use crate::{
    common::helper_loader::{Helper, HelperLoaderMode, HelperLoaderOptions},
    compiler_assumptions::CompilerAssumptions,
    decorator::DecoratorOptions,
    es2015::{ArrowFunctionsOptions, ES2015Options},
    es2016::ES2016Options,
    es2017::ES2017Options,
    es2018::ES2018Options,
    es2019::ES2019Options,
    es2020::ES2020Options,
    es2021::ES2021Options,
    es2022::{ClassPropertiesOptions, ES2022Options},
    es2026::ES2026Options,
    jsx::{JsxOptions, JsxRuntime, ReactRefreshOptions},
    options::{
        babel::{BabelEnvOptions, BabelOptions},
        EnvOptions, Module, TransformOptions,
    },
    plugins::{PluginsOptions, StyledComponentsOptions},
    proposals::ProposalOptions,
    typescript::{RewriteExtensionsMode, TypeScriptOptions},
};

#[non_exhaustive]
pub struct TransformerReturn<'a> {
    pub errors: std::vec::Vec<DiagnosticBuilder<'a>>,
    /// Helpers used by this transform.
    #[deprecated = "Internal usage only"]
    pub helpers_used: FxHashMap<Helper, String>,
}

pub struct Transformer<'a> {
    ctx: TransformCtx<'a>,

    typescript: TypeScriptOptions,
    decorator: DecoratorOptions,
    plugins: PluginsOptions,
    jsx: JsxOptions,
    env: EnvOptions,
    #[expect(dead_code)]
    proposals: ProposalOptions,
}

impl<'a> Transformer<'a> {
    pub fn new(source_path: &Path, options: &TransformOptions) -> Self {
        let ctx = TransformCtx::new(source_path, options);
        Self {
            ctx,
            typescript: options.typescript.clone(),
            decorator: options.decorator,
            plugins: options.plugins.clone(),
            jsx: options.jsx.clone(),
            env: options.env,
            proposals: options.proposals,
        }
    }

    pub fn build(mut self, program: &mut Program) -> TransformerReturn<'a> {
        // TODO: Handle JSX comment-based configuration
        // if program.source_type.is_jsx() {
        //     jsx::update_options_with_comments(...);
        // }

        let mut transformer = TransformerImpl {
            ctx: &mut self.ctx,
            common: Common::new(&self.env, &self.ctx),
            decorator: decorator::DecoratorTransform::new(self.decorator, &self.ctx),
            plugins: Plugins::new(self.plugins, &self.ctx),
            x0_typescript: TypeScript::new(&self.typescript, &self.ctx),
            x1_jsx: Jsx::new(self.jsx, self.env.es2018.object_rest_spread, &self.ctx),
            x2_es2026: ES2026::new(self.env.es2026, &self.ctx),
            x2_es2022: ES2022::new(
                self.env.es2022,
                !self.typescript.allow_declare_fields
                    || self.typescript.remove_class_fields_without_initializer,
                &self.ctx,
            ),
            x2_es2021: ES2021::new(self.env.es2021, &self.ctx),
            x2_es2020: ES2020::new(self.env.es2020, &self.ctx),
            x2_es2019: ES2019::new(self.env.es2019, &self.ctx),
            x2_es2018: ES2018::new(self.env.es2018, &self.ctx),
            x2_es2016: ES2016::new(self.env.es2016, &self.ctx),
            x2_es2017: ES2017::new(self.env.es2017, &self.ctx),
            x3_es2015: ES2015::new(self.env.es2015, &self.ctx),
            x4_regexp: RegExp::new(self.env.regexp, &self.ctx),
        };

        // Visit the program using SWC's visitor pattern
        program.visit_mut_with(&mut transformer);

        let helpers_used = self
            .ctx
            .helper_loader
            .used_helpers
            .borrow_mut()
            .drain()
            .collect();

        #[expect(deprecated)]
        TransformerReturn {
            errors: self.ctx.take_errors(),
            helpers_used,
        }
    }
}

struct TransformerImpl<'a, 'ctx> {
    ctx: &'a mut TransformCtx<'ctx>,
    // NOTE: all callbacks must run in order.
    x0_typescript: TypeScript<'a, 'ctx>,
    decorator: decorator::DecoratorTransform<'a, 'ctx>,
    plugins: Plugins<'a, 'ctx>,
    x1_jsx: Jsx<'a, 'ctx>,
    x2_es2026: ES2026<'a, 'ctx>,
    x2_es2022: ES2022<'a, 'ctx>,
    x2_es2021: ES2021<'a, 'ctx>,
    x2_es2020: ES2020<'a, 'ctx>,
    x2_es2019: ES2019<'a, 'ctx>,
    x2_es2018: ES2018<'a, 'ctx>,
    x2_es2017: ES2017<'a, 'ctx>,
    x2_es2016: ES2016<'a, 'ctx>,
    #[expect(unused)]
    x3_es2015: ES2015<'a, 'ctx>,
    x4_regexp: RegExp<'a, 'ctx>,
    common: Common<'a, 'ctx>,
}

/// The main transformer that implements SWC's VisitMut trait.
///
/// This orchestrates all the individual transform plugins by calling their
/// VisitMutHook enter/exit methods in the correct order.
impl VisitMut for TransformerImpl<'_, '_> {
    fn visit_mut_program(&mut self, program: &mut Program) {
        let mut ctx = TransformState::default();

        // Enter hooks
        self.x0_typescript.enter_program(program, &mut ctx);
        self.plugins.enter_program(program, &mut ctx);
        self.x1_jsx.enter_program(program, &mut ctx);
        self.x2_es2026.enter_program(program, &mut ctx);

        // Visit children
        program.visit_mut_children_with(self);

        // Exit hooks
        self.decorator.exit_program(program, &mut ctx);
        self.x1_jsx.exit_program(program, &mut ctx);
        self.x0_typescript.exit_program(program, &mut ctx);
        self.x2_es2022.exit_program(program, &mut ctx);
        self.x2_es2020.exit_program(program, &mut ctx);
        self.x2_es2018.exit_program(program, &mut ctx);
        self.common.exit_program(program, &mut ctx);
    }

    // Additional visit_mut methods can be added here to call specific hooks
    // For now, we rely on visit_mut_program and let child visitors handle the rest
    //
    // Example of how to add hook support for specific nodes:
    // fn visit_mut_expr(&mut self, expr: &mut Expr) {
    //     let mut ctx = TransformState::default();
    //     self.x2_es2016.enter_expr(expr, &mut ctx);
    //     expr.visit_mut_children_with(self);
    //     self.common.exit_expr(expr, &mut ctx);
    // }
}
