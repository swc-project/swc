use anyhow::Context;
use swc_atoms::Atom;
use swc_common::{Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{quote_ident, quote_str, ExprFactory, FunctionFactory};

use crate::{path::Resolver, SpanCtx};

pub(super) struct EmitModule {
    pub module_id: Option<String>,
    pub require: Ident,
    pub exports: Option<Ident>,
    pub module: Option<Ident>,
    pub deps: Vec<(Ident, Atom, SpanCtx)>,
}

pub(super) fn emit(
    stmts: Vec<Stmt>,
    mut module: EmitModule,
    unresolved_mark: Mark,
    resolver: &Resolver,
) -> Vec<ModuleItem> {
    let mut elems = vec![Some(quote_str!("require").as_arg())];
    let mut params = vec![module.require.into()];

    if let Some(exports) = module.exports {
        elems.push(Some(quote_str!("exports").as_arg()));
        params.push(exports.into());
    }

    if let Some(module) = module.module {
        elems.push(Some(quote_str!("module").as_arg()));
        params.push(module.into());
    }

    module
        .deps
        .into_iter()
        .for_each(|(ident, src_path, src_span)| {
            let src_path = match resolver {
                Resolver::Real { resolver, base } => resolver
                    .resolve_import(base, &src_path)
                    .with_context(|| format!("failed to resolve `{src_path}`"))
                    .unwrap(),
                Resolver::Default => src_path,
            };

            elems.push(Some(quote_str!(src_span.0, src_path).as_arg()));
            params.push(ident.into());
        });

    let mut amd_call_args = Vec::with_capacity(3);
    if let Some(module_id) = module.module_id.take() {
        amd_call_args.push(quote_str!(module_id).as_arg());
    }
    amd_call_args.push(
        ArrayLit {
            span: DUMMY_SP,
            elems,
        }
        .as_arg(),
    );

    amd_call_args.push(
        Function {
            params,
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                stmts,
                ..Default::default()
            }),
            is_generator: false,
            is_async: false,
            ..Default::default()
        }
        .into_fn_expr(None)
        .as_arg(),
    );

    vec![
        quote_ident!(SyntaxContext::empty().apply_mark(unresolved_mark), "define")
            .as_call(DUMMY_SP, amd_call_args)
            .into_stmt()
            .into(),
    ]
}
