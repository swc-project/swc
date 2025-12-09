#![allow(dead_code)]

use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

use crate::hook_utils::{HookBuilder, NoopHook};
pub use crate::options::*;

mod bugfix;
mod common;
mod decorators;
mod es2015;
mod es2016;
mod es2017;
mod es2018;
mod es2019;
mod es2020;
mod es2021;
mod es2022;
mod es2026;
mod hook_utils;
mod jsx;
mod options;
mod regexp;
mod typescript;
mod utils;

#[derive(Default)]
pub struct TraverseCtx {
    pub(crate) statement_injector: common::StmtInjectorStore,
}

pub fn transform_hook(options: Options) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    let hook = hook.chain_optional(options.typescript.map(crate::typescript::hook));
    let hook = hook.chain_optional(options.decorator.map(crate::decorators::hook));
    let hook = hook.chain_optional(options.jsx.map(crate::jsx::hook));

    let hook = hook.chain(crate::es2026::hook(options.env.es2026));
    let hook = hook.chain(crate::es2022::hook(options.env.es2022));
    let hook = hook.chain(crate::es2021::hook(options.env.es2021));
    let hook = hook.chain(crate::es2020::hook(options.env.es2020));
    let hook = hook.chain(crate::es2019::hook(options.env.es2019));
    let hook = hook.chain(crate::es2018::hook(options.env.es2018));
    let hook = hook.chain(crate::es2017::hook(
        options.env.es2017,
        options.unresolved_ctxt,
        options.assumptions.ignore_function_length,
    ));
    let hook = hook.chain(crate::es2016::hook(options.env.es2016));
    let hook = hook.chain(crate::es2015::hook(options.env.es2015));
    let hook = hook.chain_optional(crate::regexp::hook(options.env.regexp));
    let hook = hook.chain(crate::bugfix::hook(options.env.bugfix));

    // Statement injector must be last to process all injected statements
    let hook = hook.chain(common::StmtInjector::default());

    hook.build()
}

pub fn hook_pass<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    let ctx = TraverseCtx::default();

    visit_mut_pass(VisitMutWithHook { hook, context: ctx })
}

impl Options {
    pub fn into_pass(self) -> impl Pass {
        let hook = transform_hook(self);

        hook_pass(hook)
    }
}
