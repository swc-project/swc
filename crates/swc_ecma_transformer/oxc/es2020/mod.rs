use oxc_ast::ast::*;
use oxc_diagnostics::OxcDiagnostic;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod export_namespace_from;
mod nullish_coalescing_operator;
mod optional_chaining;
mod options;
use export_namespace_from::ExportNamespaceFrom;
use nullish_coalescing_operator::NullishCoalescingOperator;
pub use optional_chaining::OptionalChaining;
pub use options::ES2020Options;

pub struct ES2020<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    options: ES2020Options,

    // Plugins
    export_namespace_from: ExportNamespaceFrom<'a, 'ctx>,
    nullish_coalescing_operator: NullishCoalescingOperator<'a, 'ctx>,
    optional_chaining: OptionalChaining<'a, 'ctx>,
}

impl<'a, 'ctx> ES2020<'a, 'ctx> {
    pub fn new(options: ES2020Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            ctx,
            options,
            export_namespace_from: ExportNamespaceFrom::new(ctx),
            nullish_coalescing_operator: NullishCoalescingOperator::new(ctx),
            optional_chaining: OptionalChaining::new(ctx),
        }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2020<'a, '_> {
    fn exit_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.export_namespace_from {
            self.export_namespace_from.exit_program(program, ctx);
        }
    }

    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.nullish_coalescing_operator {
            self.nullish_coalescing_operator.enter_expression(expr, ctx);
        }

        if self.options.optional_chaining {
            self.optional_chaining.enter_expression(expr, ctx);
        }
    }

    fn enter_formal_parameters(
        &mut self,
        node: &mut FormalParameters<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.optional_chaining {
            self.optional_chaining.enter_formal_parameters(node, ctx);
        }
    }

    fn exit_formal_parameters(
        &mut self,
        node: &mut FormalParameters<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.optional_chaining {
            self.optional_chaining.exit_formal_parameters(node, ctx);
        }
    }

    fn enter_big_int_literal(&mut self, node: &mut BigIntLiteral<'a>, _ctx: &mut TraverseCtx<'a>) {
        if self.options.big_int {
            let warning = OxcDiagnostic::warn(
                "Big integer literals are not available in the configured target environment.",
            )
            .with_label(node.span);
            self.ctx.error(warning);
        }
    }

    fn enter_import_specifier(
        &mut self,
        node: &mut ImportSpecifier<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.arbitrary_module_namespace_names
            && let ModuleExportName::StringLiteral(literal) = &node.imported
        {
            let warning = OxcDiagnostic::warn(
                "Arbitrary module namespace identifier names are not available in the configured target environment.",
            )
            .with_label(literal.span);
            self.ctx.error(warning);
        }
    }

    fn enter_export_specifier(
        &mut self,
        node: &mut ExportSpecifier<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.arbitrary_module_namespace_names {
            if let ModuleExportName::StringLiteral(literal) = &node.exported {
                let warning = OxcDiagnostic::warn(
                    "Arbitrary module namespace identifier names are not available in the configured target environment.",
                )
                .with_label(literal.span);
                self.ctx.error(warning);
            }
            if let ModuleExportName::StringLiteral(literal) = &node.local {
                let warning = OxcDiagnostic::warn(
                    "Arbitrary module namespace identifier names are not available in the configured target environment.",
                )
                .with_label(literal.span);
                self.ctx.error(warning);
            }
        }
    }

    fn enter_export_all_declaration(
        &mut self,
        node: &mut ExportAllDeclaration<'a>,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        if self.options.arbitrary_module_namespace_names
            && let Some(ModuleExportName::StringLiteral(literal)) = &node.exported
        {
            let warning = OxcDiagnostic::warn(
                "Arbitrary module namespace identifier names are not available in the configured target environment.",
            )
            .with_label(literal.span);
            self.ctx.error(warning);
        }
    }
}
