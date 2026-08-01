use anyhow::Context;
use swc_atoms::Atom;
use swc_common::{sync::Lrc, Mark, SourceMap, Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{is_valid_prop_ident, private_ident, quote_ident, quote_str, ExprFactory};

use super::config::BuiltConfig;
use crate::{path::Resolver, SpanCtx};

pub(super) struct EmitModule {
    pub span: Span,
    pub is_export_assign: bool,
    pub exports: Option<Ident>,
    pub deps: Vec<(Ident, Atom, SpanCtx)>,
}

pub(super) fn emit(
    stmts: Vec<Stmt>,
    module: EmitModule,
    cm: &Lrc<SourceMap>,
    config: &BuiltConfig,
    unresolved_mark: Mark,
    resolver: &Resolver,
) -> Vec<ModuleItem> {
    let (adapter_fn_expr, factory_params) =
        emit_adapter(&module, cm, config, unresolved_mark, resolver);

    let factory_fn_expr: Expr = Function {
        params: factory_params,
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
    .into();

    vec![adapter_fn_expr
        .as_call(
            DUMMY_SP,
            vec![
                ThisExpr { span: DUMMY_SP }.as_arg(),
                factory_fn_expr.as_arg(),
            ],
        )
        .into_stmt()
        .into()]
}

/// Builds the UMD adapter function and returns it with the factory params.
///
/// The adapter always emits `CommonJS`, AMD, and global-fallback branches:
/// ```javascript
/// if (typeof module === "object" && typeof module.exports === "object") { ... }
/// else if (typeof define === "function" && define.amd) { ... }
/// else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) { ... }
/// ```
///
/// For regular ES exports, `exports` is added as the first CommonJS/AMD
/// dependency and factory param. The global fallback creates the configured
/// export object and passes it as the first factory argument:
/// ```javascript
/// factory(exports, require("mod"));
/// define(["exports", "mod"], factory);
/// factory((global.lib = {}), global.mod);
/// function (exports, mod) { ... }
/// ```
///
/// For `export =`, there is no `exports` param. The factory returns the module
/// value, `CommonJS` assigns that return value to `module.exports`, AMD only
/// registers the dependency list, and the fallback branch assigns the factory
/// result to the inferred global export name:
/// ```javascript
/// module.exports = factory(require("mod"));
/// define(["mod"], factory);
/// global.lib = factory(global.mod);
/// function (mod) { ... }
/// ```
fn emit_adapter(
    module: &EmitModule,
    cm: &Lrc<SourceMap>,
    config: &BuiltConfig,
    unresolved_mark: Mark,
    resolver: &Resolver,
) -> (FnExpr, Vec<Param>) {
    macro_rules! js_typeof {
        ($test:expr =>! $type:expr) => {
            Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("typeof"),
                arg: Box::new(Expr::from($test)),
            })
            .make_bin(op!("!=="), quote_str!($type))
        };

        ($test:expr => $type:expr) => {
            Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("typeof"),
                arg: Box::new(Expr::from($test)),
            })
            .make_bin(op!("==="), quote_str!($type))
        };
    }

    let module_ident = quote_ident!(SyntaxContext::empty().apply_mark(unresolved_mark), "module");
    let require = quote_ident!(
        SyntaxContext::empty().apply_mark(unresolved_mark),
        "require"
    );
    let define = quote_ident!(SyntaxContext::empty().apply_mark(unresolved_mark), "define");
    let global_this = quote_ident!(
        SyntaxContext::empty().apply_mark(unresolved_mark),
        "globalThis"
    );
    let js_self = quote_ident!(SyntaxContext::empty().apply_mark(unresolved_mark), "self");

    let global = private_ident!("global");
    let factory = private_ident!("factory");

    let module_exports = module_ident.clone().make_member(quote_ident!("exports"));
    let define_amd = define.clone().make_member(quote_ident!("amd"));

    let mut cjs_args = Vec::new();
    let mut amd_dep_list = Vec::new();
    let mut browser_args = Vec::new();

    let mut factory_params = Vec::new();

    if !module.is_export_assign {
        if let Some(exports) = &module.exports {
            cjs_args.push(quote_ident!("exports").as_arg());
            amd_dep_list.push(Some(quote_str!("exports").as_arg()));
            browser_args.push(
                ObjectLit::default()
                    .make_assign_to(
                        op!("="),
                        module_global_export_member(module.span, cm, config, &global).into(),
                    )
                    .as_arg(),
            );
            factory_params.push(exports.clone().into());
        }
    }

    module.deps.iter().for_each(|(ident, src_path, src_span)| {
        let src_path = match resolver {
            Resolver::Real { resolver, base } => resolver
                .resolve_import(base, src_path)
                .with_context(|| format!("failed to resolve `{src_path}`"))
                .unwrap(),
            Resolver::Default => src_path.clone(),
        };

        cjs_args.push(
            require
                .clone()
                .as_call(
                    DUMMY_SP,
                    vec![quote_str!(src_span.0, src_path.clone()).as_arg()],
                )
                .as_arg(),
        );
        amd_dep_list.push(Some(quote_str!(src_span.0, src_path.clone()).as_arg()));

        let global_dep = {
            let dep_name = config.global_name(&src_path);
            let global = global.clone();
            if is_valid_prop_ident(&dep_name) {
                global.make_member(quote_ident!(dep_name))
            } else {
                global.computed_member(quote_str!(dep_name))
            }
        };
        browser_args.push(global_dep.as_arg());
        factory_params.push(ident.clone().into());
    });

    let cjs_if_test = js_typeof!(module_ident.clone() => "object")
        .make_bin(op!("&&"), js_typeof!(module_exports.clone() => "object"));
    let mut cjs_if_body = factory.clone().as_call(DUMMY_SP, cjs_args);
    if module.is_export_assign {
        cjs_if_body = cjs_if_body.make_assign_to(op!("="), module_exports.clone().into());
    }

    let amd_if_test = js_typeof!(define.clone() => "function").make_bin(op!("&&"), define_amd);
    let amd_if_body = define.as_call(
        DUMMY_SP,
        vec![
            ArrayLit {
                span: DUMMY_SP,
                elems: amd_dep_list,
            }
            .as_arg(),
            factory.clone().as_arg(),
        ],
    );

    let browser_if_test = CondExpr {
        span: DUMMY_SP,
        test: Box::new(js_typeof!(global_this.clone() =>! "undefined")),
        cons: Box::new(global_this.into()),
        alt: Box::new(global.clone().make_bin(op!("||"), js_self)),
    }
    .make_assign_to(op!("="), global.clone().into());

    let mut browser_if_body = factory.clone().as_call(DUMMY_SP, browser_args);
    if module.is_export_assign {
        browser_if_body = browser_if_body.make_assign_to(
            op!("="),
            module_global_export_member(module.span, cm, config, &global).into(),
        );
    }

    let browser_if = if_stmt(browser_if_test, browser_if_body, None);
    let amd_if = if_stmt(amd_if_test, amd_if_body, Some(browser_if));
    let adapter_body = BlockStmt {
        span: DUMMY_SP,
        stmts: vec![if_stmt(cjs_if_test, cjs_if_body, Some(amd_if))],
        ..Default::default()
    };

    let adapter_fn_expr = Function {
        params: vec![global.into(), factory.into()],
        span: DUMMY_SP,
        body: Some(adapter_body),
        is_generator: false,
        is_async: false,
        ..Default::default()
    }
    .into();

    (adapter_fn_expr, factory_params)
}

fn if_stmt(test: Expr, body: Expr, alt: Option<Stmt>) -> Stmt {
    IfStmt {
        span: DUMMY_SP,
        test: Box::new(test),
        cons: Box::new(body.into_stmt()),
        alt: alt.map(Box::new),
    }
    .into()
}

/// Returns the browser fallback global member for the current module.
fn module_global_export_member(
    module_span: Span,
    cm: &Lrc<SourceMap>,
    config: &BuiltConfig,
    global: &Ident,
) -> MemberExpr {
    let filename = cm.span_to_filename(module_span);
    let exported_name = config.determine_export_name(filename);

    global.clone().make_member(exported_name.into())
}
