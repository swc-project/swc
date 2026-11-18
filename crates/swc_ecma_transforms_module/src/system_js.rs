use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_top_level_await, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut};

pub use super::util::Config;
use crate::{
    module_record::SourceModule, path::Resolver, top_level_this::top_level_this, util::use_strict,
};

mod emit;
mod ir;
mod lower;
mod pattern;
mod rewrite;
mod util;

#[must_use]
pub fn system_js(resolver: Resolver, unresolved_mark: Mark, config: Config) -> impl Pass {
    visit_mut_pass(SystemJs {
        resolver,
        unresolved_mark,
        config,
    })
}

struct SystemJs {
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
}

impl VisitMut for SystemJs {
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, n: &mut Module) {
        if !self.config.allow_top_level_this {
            top_level_this(&mut n.body, *Expr::undefined(DUMMY_SP));
        }

        let mut source = SourceModule::collect(n.body.take());
        let has_use_strict = source.has_use_strict;
        let mut wrapper_stmts = std::mem::take(&mut source.directives);
        wrapper_stmts.reserve(8);

        if self.config.strict_mode && !has_use_strict {
            wrapper_stmts.push(use_strict());
        }

        let export_ident = private_ident!("_export");
        let context_ident = private_ident!("_context");
        let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);

        let mut module = lower::lower(source);

        rewrite::rewrite_special_refs(
            &mut module,
            context_ident.clone(),
            unresolved_ctxt,
            &self.resolver,
            self.config.ignore_dynamic,
            self.config.preserve_import_meta,
        );

        let mut export_rewriter = rewrite::ExportBindingRewriter::new(
            module.exports.local_exports.clone(),
            export_ident.clone(),
            module.export_setters.clone(),
        );
        rewrite::rewrite_export_bindings(&mut module, &mut export_rewriter);
        if export_rewriter.needs_old_temp() {
            module.wrapper_vars.push(export_rewriter.old_temp());
        }
        if export_rewriter.needs_export_setters() {
            module.needs_export_setters = true;
        }

        module.async_execute = module.execute_stmts.iter().any(contains_top_level_await);
        let register_args = emit::emit(
            wrapper_stmts,
            module,
            export_ident,
            context_ident,
            &self.resolver,
        );

        n.body = vec![quote_ident!(unresolved_ctxt, "System")
            .make_member(quote_ident!("register"))
            .as_call(DUMMY_SP, register_args)
            .into_stmt()
            .into()];
    }

    fn visit_mut_script(&mut self, _: &mut Script) {}
}
