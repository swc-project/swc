use anyhow::Context;
use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureSet, helper};
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, ExprFactory, FunctionFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config as InnerConfig;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

use crate::{
    module_decl_strip::{
        Export, ExportObjPropList, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip,
    },
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        define_es_module, esm_export, esm_export_star, has_use_strict, local_name_for_src,
        object_define_enumerable, prop_arrow, prop_function, prop_method, use_strict,
    },
};

pub fn amd(
    unresolved_mark: Mark,
    config: Config,
    _target: EsVersion,
    available_features: FeatureSet,
) -> impl Fold + VisitMut {
    let Config { module_id, config } = config;

    as_folder(Amd {
        module_id,
        config,
        unresolved_mark,
        resolver: Resolver::Default,

        support_arrow: caniuse!(available_features.ArrowFunctions),
        support_shorthand: caniuse!(available_features.ShorthandProperties),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        dep_list: Default::default(),
        require: quote_ident!(DUMMY_SP.apply_mark(unresolved_mark), "require"),
        exports: None,
        module: None,
        found_import_meta: false,
    })
}

pub fn amd_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
    _target: EsVersion,
    available_features: FeatureSet,
) -> impl Fold + VisitMut {
    let Config { module_id, config } = config;

    as_folder(Amd {
        module_id,
        config,
        unresolved_mark,
        resolver: Resolver::Real { base, resolver },

        support_arrow: caniuse!(available_features.ArrowFunctions),
        support_shorthand: caniuse!(available_features.ShorthandProperties),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        dep_list: Default::default(),
        require: quote_ident!(DUMMY_SP.apply_mark(unresolved_mark), "require"),
        exports: None,
        module: None,
        found_import_meta: false,
    })
}

pub struct Amd {
    module_id: Option<String>,
    config: InnerConfig,
    unresolved_mark: Mark,
    resolver: Resolver,

    support_arrow: bool,
    support_shorthand: bool,
    const_var_kind: VarDeclKind,

    dep_list: Vec<(Ident, JsWord, Span)>,
    require: Ident,
    exports: Option<Ident>,
    module: Option<Ident>,
    found_import_meta: bool,
}

impl VisitMut for Amd {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut strip = ModuleDeclStrip::default();
        n.visit_mut_with(&mut strip);

        let mut stmts: Vec<Stmt> = Vec::with_capacity(n.len() + 4);

        // "use strict";
        if self.config.strict_mode && !has_use_strict(n) {
            stmts.push(use_strict());
        }

        let ModuleDeclStrip {
            link,
            export,
            export_assign,
            ..
        } = strip;

        let mut import_map = Default::default();

        stmts.extend(
            self.handle_import_export(&mut import_map, link, export)
                .map(Into::into),
        );

        stmts.extend(n.take().into_iter().map(|i| match i {
            ModuleItem::ModuleDecl(_) => {
                unreachable!("All ModuleDecl should be removed by ModuleDeclStrip")
            }
            ModuleItem::Stmt(stmt) => stmt,
        }));

        if let Some(export_assign) = export_assign {
            let return_stmt = ReturnStmt {
                span: DUMMY_SP,
                arg: Some(export_assign),
            };

            stmts.push(return_stmt.into())
        }

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        stmts.visit_mut_children_with(&mut ModuleRefRewriter {
            import_map,
            lazy_record: Default::default(),
            top_level: true,
        });

        // ====================
        //  Emit
        // ====================

        let require = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require");
        let mut elems = vec![Some(quote_str!("require").as_arg())];
        let mut params = vec![require.into()];

        if let Some(exports) = self.exports.take() {
            elems.push(Some(quote_str!("exports").as_arg()));
            params.push(exports.into())
        }

        if let Some(module) = self.module.clone() {
            elems.push(Some(quote_str!("module").as_arg()));
            params.push(module.into())
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

                elems.push(Some(quote_str!(src_span, src_path).as_arg()));
                params.push(ident.into());
            });

        let mut amd_call_args = Vec::with_capacity(3);
        if let Some(module_id) = self.module_id.clone() {
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
                    span: DUMMY_SP,
                    stmts,
                }),
                is_generator: false,
                is_async: false,
                type_params: None,
                return_type: None,
            }
            .into_fn_expr(None)
            .as_arg(),
        );

        *n = vec![quote_ident!("define")
            .as_call(DUMMY_SP, amd_call_args)
            .into_stmt()
            .into()];
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Call(CallExpr {
                span,
                callee: Callee::Import(Import { span: import_span }),
                args,
                ..
            }) if !self.config.ignore_dynamic => {
                args.visit_mut_with(self);

                args.get_mut(0).into_iter().for_each(|x| {
                    if let ExprOrSpread { spread: None, expr } = x {
                        if let Expr::Lit(Lit::Str(Str { value, raw, .. })) = &mut **expr {
                            *value = self.resolver.resolve(value.clone());
                            *raw = None;
                        }
                    }
                });

                let mut require = self.require.clone();
                require.span = import_span.apply_mark(require.span.ctxt().outer());

                *n = amd_dynamic_import(
                    *span,
                    args.take(),
                    require,
                    !self.config.no_interop,
                    self.support_arrow,
                );
            }
            Expr::Member(MemberExpr {
                span,
                obj,
                prop:
                    MemberProp::Ident(Ident {
                        sym: js_word!("url"),
                        ..
                    }),
            }) if !self.config.preserve_import_meta
                && obj
                    .as_meta_prop()
                    .map(|p| p.kind == MetaPropKind::ImportMeta)
                    .unwrap_or_default() =>
            {
                obj.visit_mut_with(self);

                *n = amd_import_meta_url(*span, self.module());
                self.found_import_meta = true;
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}

impl Amd {
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        link: Link,
        export: Export,
    ) -> impl Iterator<Item = Stmt> {
        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export
            .into_iter()
            .map(|((key, span), ident)| (key, span, ident.into()))
            .collect();

        let esm_export_star_ident = private_ident!("_exportStar");
        let mut has_export_star = false;

        link.into_iter().for_each(
            |(src, LinkItem(src_span, link_specifier_set, mut link_flag))| {
                let is_swc_detault_helper =
                    !link_flag.has_named() && src.starts_with("@swc/helpers/");

                if self.config.no_interop || is_swc_detault_helper {
                    link_flag -= LinkFlag::NAMESPACE;
                }

                let need_re_export = link_flag.re_export();
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
                    is_swc_detault_helper,
                );

                if is_swc_detault_helper {
                    stmts.push(
                        mod_ident
                            .clone()
                            .make_member(quote_ident!("default"))
                            .make_assign_to(op!("="), mod_ident.clone().as_pat_or_expr())
                            .into_stmt(),
                    )
                }

                if need_re_export || need_interop {
                    // _exportStar(mod, exports);
                    let import_expr: Expr = if need_re_export {
                        has_export_star = true;
                        esm_export_star_ident.clone().as_call(
                            DUMMY_SP,
                            vec![mod_ident.clone().as_arg(), self.exports().as_arg()],
                        )
                    } else {
                        mod_ident.clone().into()
                    };

                    // _introp(mod);
                    let import_expr = if !need_interop {
                        import_expr
                    } else {
                        CallExpr {
                            span: DUMMY_SP,
                            callee: if link_flag.namespace() {
                                helper!(interop_require_wildcard, "interopRequireWildcard")
                            } else {
                                helper!(interop_require_default, "interopRequireDefault")
                            },
                            args: vec![import_expr.as_arg()],
                            type_args: Default::default(),
                        }
                        .into()
                    };

                    // mod = _introp(mod);
                    // var mod1 = _introp(mod);
                    let stmt = if need_new_var {
                        let var_decl = VarDecl {
                            span: DUMMY_SP,
                            kind: self.const_var_kind,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: new_var_ident.into(),
                                init: Some(Box::new(import_expr)),
                                definite: false,
                            }],
                        };

                        Decl::Var(var_decl).into()
                    } else if need_interop {
                        import_expr
                            .make_assign_to(op!("="), mod_ident.as_pat_or_expr())
                            .into_stmt()
                    } else {
                        import_expr.into_stmt()
                    };

                    stmts.push(stmt)
                }
            },
        );

        let mut export_stmts = self.export_stmts(export_obj_prop_list);

        if has_export_star {
            export_stmts.push(Stmt::Decl(Decl::Fn(
                esm_export_star().into_fn_decl(esm_export_star_ident),
            )));
        }

        self.exports
            .clone()
            .map(define_es_module)
            .into_iter()
            .chain(export_stmts)
            .chain(stmts)
    }

    fn exports(&mut self) -> Ident {
        self.exports.clone().unwrap_or_else(|| {
            let new_ident = private_ident!("exports");
            self.exports = Some(new_ident.clone());
            new_ident
        })
    }

    fn export_stmts(&mut self, mut prop_list: ExportObjPropList) -> Vec<Stmt> {
        let prop_auto = if self.support_arrow {
            prop_arrow
        } else if self.support_shorthand {
            prop_method
        } else {
            prop_function
        };

        match prop_list.len() {
            0 | 1 => prop_list
                .pop()
                .map(|(prop_name, span, expr)| {
                    object_define_enumerable(
                        self.exports().as_arg(),
                        quote_str!(span, prop_name).as_arg(),
                        prop_auto((js_word!("get"), DUMMY_SP, expr)).into(),
                    )
                    .into_stmt()
                })
                .into_iter()
                .collect(),
            _ => {
                prop_list.sort_by(|a, b| a.0.cmp(&b.0));
                let props = prop_list
                    .into_iter()
                    .map(prop_auto)
                    .map(Into::into)
                    .collect();
                let obj_lit = ObjectLit {
                    span: DUMMY_SP,
                    props,
                };

                let esm_export_ident = private_ident!("_export");

                vec![
                    Stmt::Decl(Decl::Fn(
                        esm_export().into_fn_decl(esm_export_ident.clone()),
                    )),
                    esm_export_ident
                        .as_call(DUMMY_SP, vec![self.exports().as_arg(), obj_lit.as_arg()])
                        .into_stmt(),
                ]
            }
        }
    }

    fn module(&mut self) -> Ident {
        self.module.clone().unwrap_or_else(|| {
            let new_ident = private_ident!("module");
            self.module = Some(new_ident.clone());
            new_ident
        })
    }
}

/// new Promise((resolve, reject) => require([arg], m => resolve(m), reject))
pub(crate) fn amd_dynamic_import(
    span: Span,
    args: Vec<ExprOrSpread>,
    require: Ident,
    es_module_interop: bool,
    support_arrow: bool,
) -> Expr {
    let resolve = private_ident!("resolve");
    let reject = private_ident!("reject");
    let arg = args[..1].iter().cloned().map(Option::Some).collect();

    let module = private_ident!("m");

    let resolved_module: Expr = if es_module_interop {
        CallExpr {
            span: DUMMY_SP,
            callee: helper!(interop_require_wildcard, "interopRequireWildcard"),
            args: vec![module.clone().as_arg()],
            type_args: None,
        }
        .into()
    } else {
        module.clone().into()
    };

    let resolve_callback = resolve
        .clone()
        .as_call(DUMMY_SP, vec![resolved_module.as_arg()])
        .into_lazy_auto(vec![module.into()], support_arrow);

    let require_call = require.as_call(
        DUMMY_SP,
        vec![
            ArrayLit {
                span: DUMMY_SP,
                elems: arg,
            }
            .as_arg(),
            resolve_callback.as_arg(),
            reject.clone().as_arg(),
        ],
    );

    let promise_executer =
        require_call.into_lazy_auto(vec![resolve.into(), reject.into()], support_arrow);

    NewExpr {
        span,
        callee: Box::new(quote_ident!("Promise").into()),
        args: Some(vec![promise_executer.as_arg()]),
        type_args: None,
    }
    .into()
}

/// new URL(module.uri, document.baseURI).href
fn amd_import_meta_url(span: Span, module: Ident) -> Expr {
    MemberExpr {
        span,
        obj: Box::new(Expr::New(quote_ident!("URL").into_new_expr(
            DUMMY_SP,
            Some(vec![
                module.make_member(quote_ident!("uri")).as_arg(),
                member_expr!(DUMMY_SP, document.baseURI).as_arg(),
            ]),
        ))),
        prop: quote_ident!("href").into(),
    }
    .into()
}
