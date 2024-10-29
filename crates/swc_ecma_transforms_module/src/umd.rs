use anyhow::Context;
use swc_atoms::JsWord;
use swc_common::{
    source_map::PURE_SP, sync::Lrc, util::take::Take, Mark, SourceMap, Span, SyntaxContext,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    is_valid_prop_ident, private_ident, quote_ident, quote_str, ExprFactory, IsDirective,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use self::config::BuiltConfig;
pub use self::config::Config;
use crate::{
    module_decl_strip::{Export, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip},
    module_ref_rewriter::{rewrite_import_bindings, ImportMap},
    path::Resolver,
    top_level_this::top_level_this,
    util::{
        define_es_module, emit_export_stmts, local_name_for_src, use_strict, ImportInterop,
        VecStmtLike,
    },
    SpanCtx,
};

mod config;

pub fn umd(
    cm: Lrc<SourceMap>,
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Pass {
    visit_mut_pass(Umd {
        config: config.build(cm.clone()),
        unresolved_mark,
        cm,
        resolver,

        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        dep_list: Default::default(),

        exports: None,
    })
}

pub struct Umd {
    cm: Lrc<SourceMap>,
    unresolved_mark: Mark,
    config: BuiltConfig,
    resolver: Resolver,

    const_var_kind: VarDeclKind,

    dep_list: Vec<(Ident, JsWord, SpanCtx)>,

    exports: Option<Ident>,
}

impl VisitMut for Umd {
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, module: &mut Module) {
        let module_items = &mut module.body;

        let mut stmts: Vec<Stmt> = Vec::with_capacity(module_items.len() + 4);

        // Collect directives
        stmts.extend(
            module_items
                .iter_mut()
                .take_while(|i| i.directive_continue())
                .map(|i| i.take())
                .map(ModuleItem::expect_stmt),
        );

        // "use strict";
        if self.config.config.strict_mode && !stmts.has_use_strict() {
            stmts.push(use_strict());
        }

        if !self.config.config.allow_top_level_this {
            top_level_this(module_items, *Expr::undefined(DUMMY_SP));
        }

        let import_interop = self.config.config.import_interop();

        let mut strip = ModuleDeclStrip::new(self.const_var_kind);
        module_items.visit_mut_with(&mut strip);

        let ModuleDeclStrip {
            link,
            export,
            export_assign,
            has_module_decl,
            ..
        } = strip;

        let is_export_assign = export_assign.is_some();

        if has_module_decl && !import_interop.is_none() && !is_export_assign {
            stmts.push(define_es_module(self.exports()))
        }

        let mut import_map = Default::default();

        stmts.extend(
            self.handle_import_export(&mut import_map, link, export, is_export_assign)
                .map(From::from),
        );

        stmts.extend(module_items.take().into_iter().filter_map(|i| match i {
            ModuleItem::Stmt(stmt) if !stmt.is_empty() => Some(stmt),
            _ => None,
        }));

        if let Some(export_assign) = export_assign {
            let return_stmt = ReturnStmt {
                span: DUMMY_SP,
                arg: Some(export_assign),
            };

            stmts.push(return_stmt.into())
        }

        rewrite_import_bindings(&mut stmts, import_map, Default::default());

        // ====================
        //  Emit
        // ====================

        let (adapter_fn_expr, factory_params) = self.adapter(module.span, is_export_assign);

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

        *module_items = vec![adapter_fn_expr
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
}

impl Umd {
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        link: Link,
        export: Export,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.config.import_interop();

        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export.into_iter().collect();

        link.into_iter().for_each(
            |(src, LinkItem(src_span, link_specifier_set, mut link_flag))| {
                let is_node_default = !link_flag.has_named() && import_interop.is_node();

                if import_interop.is_none() {
                    link_flag -= LinkFlag::NAMESPACE;
                }

                let need_re_export = link_flag.export_star();
                let need_interop = link_flag.interop();
                let need_new_var = link_flag.need_raw_import();

                let mod_ident = private_ident!(local_name_for_src(&src));
                let new_var_ident = if need_new_var {
                    private_ident!(local_name_for_src(&src))
                } else {
                    mod_ident.clone()
                };

                self.dep_list.push((mod_ident.clone(), src, src_span));

                link_specifier_set.reduce(
                    import_map,
                    &mut export_obj_prop_list,
                    &new_var_ident,
                    &Some(mod_ident.clone()),
                    &mut false,
                    is_node_default,
                );

                // _export_star(mod, exports);
                let mut import_expr: Expr = if need_re_export {
                    helper_expr!(export_star).as_call(
                        DUMMY_SP,
                        vec![mod_ident.clone().as_arg(), self.exports().as_arg()],
                    )
                } else {
                    mod_ident.clone().into()
                };

                // _introp(mod);
                if need_interop {
                    import_expr = match import_interop {
                        ImportInterop::Swc if link_flag.interop() => if link_flag.namespace() {
                            helper_expr!(interop_require_wildcard)
                        } else {
                            helper_expr!(interop_require_default)
                        }
                        .as_call(PURE_SP, vec![import_expr.as_arg()]),
                        ImportInterop::Node if link_flag.namespace() => {
                            helper_expr!(interop_require_wildcard)
                                .as_call(PURE_SP, vec![import_expr.as_arg(), true.as_arg()])
                        }
                        _ => import_expr,
                    }
                };

                // mod = _introp(mod);
                // var mod1 = _introp(mod);
                if need_new_var {
                    let stmt: Stmt = import_expr
                        .into_var_decl(self.const_var_kind, new_var_ident.into())
                        .into();

                    stmts.push(stmt)
                } else if need_interop {
                    let stmt = import_expr
                        .make_assign_to(op!("="), mod_ident.into())
                        .into_stmt();
                    stmts.push(stmt);
                } else if need_re_export {
                    stmts.push(import_expr.into_stmt());
                }
            },
        );

        let mut export_stmts = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            export_obj_prop_list.sort_by_cached_key(|(key, ..)| key.clone());

            let exports = self.exports();

            export_stmts = emit_export_stmts(exports, export_obj_prop_list);
        }

        export_stmts.into_iter().chain(stmts)
    }

    fn exports(&mut self) -> Ident {
        self.exports
            .get_or_insert_with(|| private_ident!("exports"))
            .clone()
    }

    /// - Without `export =`
    /// ```javascript
    /// (function (global, factory) {
    ///   if (typeof module === "object" && typeof module.exports === "object") {
    ///     factory(exports, require("mod"));
    ///   } else if (typeof define === "function" && define.amd) {
    ///     define(["exports", "mod"], factory);
    ///   } else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) {
    ///     factory((global.lib = {}), global.mod);
    ///   }
    /// })(this, function (exports, mod) {
    ///   ...
    /// });
    /// ```
    /// - With `export =`
    /// ```javascript
    /// (function (global, factory) {
    ///   if (typeof module === "object" && typeof module.exports === "object") {
    ///     module.exports = factory(require("mod"));
    ///   } else if (typeof define === "function" && define.amd) {
    ///     define(["mod"], factory);
    ///   } else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) {
    ///     global.lib = factory(global.mod);
    ///   }
    /// })(this, function (mod) {
    ///   ...
    /// });
    /// ```
    /// Return: adapter expr and factory params
    fn adapter(&mut self, module_span: Span, is_export_assign: bool) -> (FnExpr, Vec<Param>) {
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

        // define unresolved ref
        let module = quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "module"
        );

        let require = quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "require"
        );
        let define = quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "define"
        );
        let global_this = quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "globalThis"
        );
        let js_self = quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "self"
        );

        // adapter arguments
        let global = private_ident!("global");
        let factory = private_ident!("factory");

        let module_exports = module.clone().make_member(quote_ident!("exports"));
        let define_amd = define.clone().make_member(quote_ident!("amd"));

        let mut cjs_args = Vec::new();
        let mut amd_dep_list = Vec::new();
        let mut browser_args = Vec::new();

        let mut factory_params = Vec::new();

        if !is_export_assign && self.exports.is_some() {
            let filename = self.cm.span_to_filename(module_span);
            let exported_name = self.config.determine_export_name(filename);
            let global_lib = global.clone().make_member(exported_name.into());

            cjs_args.push(quote_ident!("exports").as_arg());
            amd_dep_list.push(Some(quote_str!("exports").as_arg()));
            browser_args.push(
                ObjectLit {
                    span: DUMMY_SP,
                    props: Default::default(),
                }
                .make_assign_to(op!("="), global_lib.into())
                .as_arg(),
            );
            factory_params.push(self.exports().into());
        }

        self.dep_list
            .take()
            .into_iter()
            .for_each(|(ident, src_path, src_span)| {
                let src_path = match &self.resolver {
                    Resolver::Real { resolver, base } => resolver
                        .resolve_import(base, &src_path)
                        .with_context(|| format!("failed to resolve `{}`", src_path))
                        .unwrap(),
                    Resolver::Default => src_path,
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
                    let dep_name = self.config.global_name(&src_path);
                    let global = global.clone();
                    if is_valid_prop_ident(&dep_name) {
                        global.make_member(quote_ident!(dep_name))
                    } else {
                        global.computed_member(quote_str!(dep_name))
                    }
                };
                browser_args.push(global_dep.as_arg());
                factory_params.push(ident.into());
            });

        let cjs_if_test = js_typeof!(module => "object")
            .make_bin(op!("&&"), js_typeof!(module_exports.clone() => "object"));
        let mut cjs_if_body = factory.clone().as_call(DUMMY_SP, cjs_args);
        if is_export_assign {
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
        if is_export_assign {
            browser_if_body = browser_if_body.make_assign_to(op!("="), module_exports.into());
        }

        let adapter_body = BlockStmt {
            span: DUMMY_SP,
            stmts: vec![IfStmt {
                span: DUMMY_SP,
                test: Box::new(cjs_if_test),
                cons: Box::new(cjs_if_body.into_stmt()),
                alt: Some(Box::new(
                    IfStmt {
                        span: DUMMY_SP,
                        test: Box::new(amd_if_test),
                        cons: Box::new(amd_if_body.into_stmt()),
                        alt: Some(Box::new(
                            IfStmt {
                                span: DUMMY_SP,
                                test: Box::new(browser_if_test),
                                cons: Box::new(browser_if_body.into_stmt()),
                                alt: None,
                            }
                            .into(),
                        )),
                    }
                    .into(),
                )),
            }
            .into()],
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
}
