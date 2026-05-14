#![allow(dead_code)]

use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_transforms_base::assumptions::Assumptions;
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
#[cfg(feature = "es3")]
mod es3;
mod hook_utils;
mod jsx;
mod options;
mod regexp;
mod typescript;
mod utils;

#[derive(Default)]
pub struct TraverseCtx {
    pub(crate) statement_injector: common::StmtInjectorStore,
    pub(crate) var_declarations: common::VarDeclarationsStore,
    #[cfg(feature = "es3")]
    pub(crate) es3: es3::ReservedWordContext,
}

pub fn transform_hook(options: Options) -> impl VisitMutHook<TraverseCtx> {
    let needs_var_declarations = options.env.es2021.logical_assignment_operators
        || options.env.es2020.nullish_coalescing
        || options.env.es2018.object_rest_spread
        || options.env.es2016.exponentiation_operator;

    let hook = HookBuilder::new(NoopHook);

    let hook = hook.chain_optional(options.typescript.map(crate::typescript::hook));
    let hook = hook.chain_optional(options.decorator.map(crate::decorators::hook));
    let hook = hook.chain_optional(options.jsx.map(crate::jsx::hook));

    let hook = hook.chain(crate::es2026::hook(options.env.es2026));
    let hook = hook.chain(crate::es2022::hook(options.env.es2022));
    let hook = hook.chain(crate::es2021::hook(options.env.es2021));
    let hook = hook.chain(crate::es2020::hook(options.env.es2020, options.assumptions));
    let hook = hook.chain(crate::es2019::hook(options.env.es2019));
    let hook = hook.chain(crate::es2018::hook(options.env.es2018, options.assumptions));
    let hook = hook.chain(crate::es2017::hook(
        options.env.es2017,
        options.unresolved_ctxt,
        options.assumptions.ignore_function_length,
    ));
    let hook = hook.chain(crate::es2016::hook(options.env.es2016));
    let hook = hook.chain(crate::es2015::hook(options.env.es2015));
    let hook = hook.chain_optional(crate::regexp::hook(options.env.regexp));
    let hook = hook.chain(crate::bugfix::hook(options.env.bugfix));

    // ES3 transforms should run after all higher ES versions
    #[cfg(feature = "es3")]
    let hook = hook.chain(crate::es3::hook(options.env.es3));

    // VarDeclarations must run after all transforms that may queue generated
    // declarations. Most transformer passes do not need it, and keeping it in
    // the hook chain for those passes only pushes/pops empty declaration scopes.
    let hook = hook.chain(if needs_var_declarations {
        Some(common::VarDeclarations::default())
    } else {
        None
    });

    hook.build()
}

pub fn hook_pass<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    let ctx = TraverseCtx::default();

    visit_mut_pass(VisitMutWithHook { hook, context: ctx })
}

fn hook_pass_with_var_declarations<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    hook_pass(
        HookBuilder::new(hook)
            .chain(common::VarDeclarations::default())
            .build(),
    )
}

struct OptionalPass<P> {
    pass: P,
    enabled: bool,
}

impl<P> Pass for OptionalPass<P>
where
    P: Pass,
{
    fn process(&mut self, program: &mut Program) {
        if self.enabled {
            self.pass.process(program);
        }
    }
}

pub fn es2022_static_blocks() -> impl Pass {
    hook_pass(crate::es2022::class_static_block::hook())
}

pub fn es2022_private_in_object() -> impl Pass {
    crate::es2022::private_property_in_object::pass()
}

pub fn es2022_runtime_transforms(regexp_options: crate::regexp::RegExpOptions) -> impl Pass {
    (
        hook_pass(
            HookBuilder::new(NoopHook)
                .chain(crate::es2022::class_static_block::hook())
                .chain_optional(crate::regexp::hook(regexp_options))
                .build(),
        ),
        crate::es2022::private_property_in_object::pass(),
    )
}

pub fn es2021_logical_assignments() -> impl Pass {
    hook_pass_with_var_declarations(crate::es2021::logical_assignment_operators::hook())
}

pub fn es2020_export_namespace_from() -> impl Pass {
    crate::es2020::export_namespace_from::pass()
}

pub fn es2020_nullish_coalescing(no_document_all: bool) -> impl Pass {
    hook_pass_with_var_declarations(crate::es2020::nullish_coalescing::hook(no_document_all))
}

pub fn es2020_runtime_transforms(no_document_all: bool) -> impl Pass {
    hook_pass_with_var_declarations(
        HookBuilder::new(NoopHook)
            .chain(crate::es2020::export_namespace_from::hook())
            .chain(crate::es2020::nullish_coalescing::hook(no_document_all))
            .build(),
    )
}

pub fn es2019_optional_catch_binding() -> impl Pass {
    crate::es2019::optional_catch_binding::pass()
}

pub fn es2018_object_rest_spread(assumptions: Assumptions) -> impl Pass {
    hook_pass_with_var_declarations(crate::es2018::object_rest_spread::hook(assumptions))
}

pub fn es2018_runtime_transforms(
    assumptions: Assumptions,
    regexp_options: crate::regexp::RegExpOptions,
) -> impl Pass {
    hook_pass_with_var_declarations(
        HookBuilder::new(NoopHook)
            .chain(crate::es2018::object_rest_spread::hook(assumptions))
            .chain_optional(crate::regexp::hook(regexp_options))
            .build(),
    )
}

pub fn es2017_async_to_generator(
    unresolved_ctxt: swc_common::SyntaxContext,
    ignore_function_length: bool,
) -> impl Pass {
    hook_pass(crate::es2017::async_to_generator::hook(
        unresolved_ctxt,
        ignore_function_length,
    ))
}

pub fn es2016_exponentiation() -> impl Pass {
    hook_pass_with_var_declarations(crate::es2016::exponentiation_operator::hook())
}

pub fn es2015_shorthand() -> impl Pass {
    hook_pass(crate::es2015::shorthand::hook())
}

pub fn es2015_function_name() -> impl Pass {
    hook_pass(crate::es2015::function_name::hook())
}

pub fn es2015_duplicate_keys() -> impl Pass {
    hook_pass(crate::es2015::duplicate_keys::hook())
}

pub fn es2015_sticky_regex() -> impl Pass {
    regexp_pass(crate::regexp::RegExpOptions {
        sticky_regex: true,
        ..Default::default()
    })
}

pub fn es2015_instanceof() -> impl Pass {
    hook_pass(crate::es2015::instanceof::hook())
}

pub fn es2015_typeof_symbol() -> impl Pass {
    hook_pass(crate::es2015::typeof_symbol::hook())
}

pub fn es2015_runtime_transforms() -> impl Pass {
    hook_pass(
        HookBuilder::new(NoopHook)
            .chain(crate::es2015::shorthand::hook())
            .chain(crate::es2015::duplicate_keys::hook())
            .chain(crate::es2015::instanceof::hook())
            .chain(crate::es2015::typeof_symbol::hook())
            .chain_optional(crate::regexp::hook(crate::regexp::RegExpOptions {
                sticky_regex: true,
                ..Default::default()
            }))
            .build(),
    )
}

pub fn regexp_pass(options: crate::regexp::RegExpOptions) -> impl Pass {
    let enabled = options.is_enabled();

    OptionalPass {
        pass: crate::regexp::pass(options),
        enabled,
    }
}

impl Options {
    pub fn into_pass(self) -> impl Pass {
        let hook = transform_hook(self);

        hook_pass(hook)
    }
}
