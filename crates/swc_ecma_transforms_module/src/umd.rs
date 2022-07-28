use anyhow::Context;
use swc_atoms::JsWord;
use swc_common::{
    comments::Comments, sync::Lrc, util::take::Take, FileName, Mark, SourceMap, Span, Spanned,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    is_valid_prop_ident, private_ident, quote_ident, quote_str,
    top_level_this::rewrite_top_level_this, undefined, ExprFactory, IsDirective,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

use self::config::BuiltConfig;
pub use self::config::Config;
use crate::{
    module_decl_strip::{Export, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip},
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        clone_first_use_strict, define_es_module, emit_export_stmts, local_name_for_src,
        use_strict, ImportInterop,
    },
};

mod config;

pub fn umd<C>(
    cm: Lrc<SourceMap>,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    as_folder(Umd {
        config: config.build(cm.clone()),
        unresolved_mark,
        cm,
        resolver: Resolver::Default,
        available_features,
        comments,

        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        dep_list: Default::default(),

        exports: None,
    })
}

pub fn umd_with_resolver<C>(
    cm: Lrc<SourceMap>,
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    as_folder(Umd {
        config: config.build(cm.clone()),
        unresolved_mark,
        cm,
        resolver: Resolver::Real { base, resolver },
        available_features,
        comments,

        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        dep_list: Default::default(),
        exports: None,
    })
}

pub struct Umd<C>
where
    C: Comments,
{
    cm: Lrc<SourceMap>,
    unresolved_mark: Mark,
    config: BuiltConfig,
    resolver: Resolver,
    available_features: FeatureFlag,
    comments: Option<C>,

    const_var_kind: VarDeclKind,

    dep_list: Vec<(Ident, JsWord, Span)>,

    exports: Option<Ident>,
}

impl<C> VisitMut for Umd<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        if !self.config.config.allow_top_level_this {
            rewrite_top_level_this(module, *undefined(DUMMY_SP));
        }

        let import_interop = self.config.config.import_interop();

        let filename = self.cm.span_to_filename(module.span);
        let exported_name = self.config.determine_export_name(filename);

        let module_items = &mut module.body;

        let mut strip = ModuleDeclStrip::new(self.const_var_kind);
        module_items.visit_mut_with(&mut strip);

        let mut stmts: Vec<Stmt> = Vec::with_capacity(module_items.len() + 4);

        // "use strict";
        if self.config.config.strict_mode {
            stmts.push(clone_first_use_strict(module_items).unwrap_or_else(use_strict));
        }

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
                .map(Into::into),
        );

        stmts.extend(module_items.take().into_iter().filter_map(|i| match i {
            ModuleItem::Stmt(stmt) if !stmt.is_use_strict() => Some(stmt),
            _ => None,
        }));

        if let Some(export_assign) = export_assign {
            let return_stmt = ReturnStmt {
                span: DUMMY_SP,
                arg: Some(export_assign),
            };

            stmts.push(return_stmt.into())
        }

        stmts.visit_mut_children_with(&mut ModuleRefRewriter {
            import_map,
            lazy_record: Default::default(),
        });

        // ====================
        //  Emit
        // ====================

        let (adapter_fn_expr, factory_params) = self.adapter(exported_name, is_export_assign);

        let factory_fn_expr = FnExpr {
            ident: None,
            function: Function {
                params: factory_params,
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            },
        };

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

impl<C> Umd<C>
where
    C: Comments,
{
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        link: Link,
        export: Export,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.config.import_interop();

        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export.into_iter().map(Into::into).collect();

        link.into_iter().for_each(
            |(src, LinkItem(src_span, link_specifier_set, mut link_flag))| {
                let is_swc_default_helper =
                    !link_flag.has_named() && src.starts_with("@swc/helpers/");

                let is_node_default = !link_flag.has_named() && import_interop.is_node();

                if import_interop.is_none() || is_swc_default_helper {
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
                    is_swc_default_helper || is_node_default,
                );

                if is_swc_default_helper {
                    stmts.push(
                        mod_ident
                            .clone()
                            .make_member(quote_ident!("default"))
                            .make_assign_to(op!("="), mod_ident.clone().as_pat_or_expr())
                            .into_stmt(),
                    )
                }

                // _exportStar(mod, exports);
                let mut import_expr: Expr = if need_re_export {
                    helper_expr!(export_star, "exportStar").as_call(
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
                            helper_expr!(interop_require_wildcard, "interopRequireWildcard")
                        } else {
                            helper_expr!(interop_require_default, "interopRequireDefault")
                        }
                        .as_call(self.pure_span(), vec![import_expr.as_arg()]),
                        ImportInterop::Node if link_flag.namespace() => {
                            helper_expr!(interop_require_wildcard, "interopRequireWildcard")
                                .as_call(
                                    self.pure_span(),
                                    vec![import_expr.as_arg(), true.as_arg()],
                                )
                        }
                        _ => import_expr,
                    }
                };

                // mod = _introp(mod);
                // var mod1 = _introp(mod);
                if need_new_var {
                    let stmt: Stmt = Stmt::Decl(Decl::Var(
                        import_expr.into_var_decl(self.const_var_kind, new_var_ident.into()),
                    ));

                    stmts.push(stmt)
                } else if need_interop {
                    let stmt = import_expr
                        .make_assign_to(op!("="), mod_ident.as_pat_or_expr())
                        .into_stmt();
                    stmts.push(stmt);
                } else if need_re_export {
                    stmts.push(import_expr.into_stmt());
                }
            },
        );

        let mut export_stmts = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            export_obj_prop_list.sort_by_key(|prop| prop.span());

            let features = self.available_features;
            let exports = self.exports();

            export_stmts = emit_export_stmts(features, exports, export_obj_prop_list);
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
    fn adapter(&mut self, exported_name: Ident, is_export_assign: bool) -> (FnExpr, Vec<Param>) {
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
        let module = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "module");

        let require = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require");
        let define = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "define");
        let global_this = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "globalThis");
        let js_self = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "self");

        // adapter arguments
        let global = private_ident!("global");
        let factory = private_ident!("factory");

        let module_exports = module.clone().make_member(quote_ident!("exports"));
        let global_lib = global.clone().make_member(exported_name);
        let define_amd = define.clone().make_member(quote_ident!("amd"));

        let mut cjs_args = vec![];
        let mut amd_dep_list = vec![];
        let mut browser_args = vec![];

        let mut factory_params = vec![];

        if !is_export_assign && self.exports.is_some() {
            cjs_args.push(quote_ident!("exports").as_arg());
            amd_dep_list.push(Some(quote_str!("exports").as_arg()));
            browser_args.push(
                Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: Default::default(),
                })
                .make_assign_to(op!("="), global_lib.as_pat_or_expr())
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
                            vec![quote_str!(src_span, src_path.clone()).as_arg()],
                        )
                        .as_arg(),
                );
                amd_dep_list.push(Some(quote_str!(src_span, src_path.clone()).as_arg()));

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
            cjs_if_body =
                cjs_if_body.make_assign_to(op!("="), module_exports.clone().as_pat_or_expr());
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
        .make_assign_to(op!("="), global.clone().as_pat_or_expr());

        let mut browser_if_body = factory.clone().as_call(DUMMY_SP, browser_args);
        if is_export_assign {
            browser_if_body =
                browser_if_body.make_assign_to(op!("="), module_exports.as_pat_or_expr());
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
        };

        let adapter_fn_expr = FnExpr {
            ident: None,
            function: Function {
                params: vec![global.into(), factory.into()],
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(adapter_body),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            },
        };

        (adapter_fn_expr, factory_params)
    }

    fn pure_span(&self) -> Span {
        let mut span = DUMMY_SP;

        if self.config.config.import_interop().is_none() {
            return span;
        }

        if let Some(comments) = &self.comments {
            span = Span::dummy_with_cmt();
            comments.add_pure_comment(span.lo);
        }
        span
    }
}
