use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod export_namespace_from;
mod nullish_coalescing_operator;
mod optional_chaining;
mod options;
use export_namespace_from::ExportNamespaceFrom;
use nullish_coalescing_operator::NullishCoalescingOperator;
pub use optional_chaining::OptionalChaining;
pub use options::ES2020Options;

pub struct ES2020 {
    options: ES2020Options,

    // Plugins
    export_namespace_from: ExportNamespaceFrom,
    nullish_coalescing_operator: NullishCoalescingOperator,
    optional_chaining: OptionalChaining,
}

impl ES2020 {
    pub fn new(options: ES2020Options) -> Self {
        Self {
            options,
            export_namespace_from: ExportNamespaceFrom::new(),
            nullish_coalescing_operator: NullishCoalescingOperator::new(),
            optional_chaining: OptionalChaining::new(),
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2020 {
    fn exit_program(&mut self, _program: &mut Program, _ctx: &mut TraverseCtx) {
        // TODO: Delegate to export_namespace_from when enabled
        // if self.options.export_namespace_from {
        //     self.export_namespace_from.exit_program(program, ctx);
        // }
    }

    fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // TODO: Delegate to transforms when enabled
        // if self.options.nullish_coalescing_operator {
        //     self.nullish_coalescing_operator.enter_expr(expr, ctx);
        // }
        //
        // if self.options.optional_chaining {
        //     self.optional_chaining.enter_expr(expr, ctx);
        // }
    }

    fn enter_big_int(&mut self, _node: &mut BigInt, _ctx: &mut TraverseCtx) {
        // TODO: Emit warning when big_int option is enabled
        // if self.options.big_int {
        //     // Warning: Big integer literals are not available
        // }
    }

    fn enter_import_specifier(&mut self, _node: &mut ImportSpecifier, _ctx: &mut TraverseCtx) {
        // TODO: Check for arbitrary_module_namespace_names when enabled
        // if self.options.arbitrary_module_namespace_names {
        //     // Check for string literal module names
        // }
    }

    fn enter_export_specifier(&mut self, _node: &mut ExportSpecifier, _ctx: &mut TraverseCtx) {
        // TODO: Check for arbitrary_module_namespace_names when enabled
        // if self.options.arbitrary_module_namespace_names {
        //     // Check for string literal module names
        // }
    }

    fn enter_export_all(&mut self, _node: &mut ExportAll, _ctx: &mut TraverseCtx) {
        // TODO: Check for arbitrary_module_namespace_names when enabled
        // if self.options.arbitrary_module_namespace_names {
        //     // Check for string literal module names
        // }
    }
}
