use anyhow::Context;
use regex::Regex;
use serde::{Deserialize, Serialize};
use swc_atoms::{js_word, JsWord};
use swc_common::{comments::Comments, util::take::Take, FileName, Mark, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, ExprFactory, FunctionFactory, IsDirective,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config as InnerConfig;
use crate::{
    module_decl_strip::{Export, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip},
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        clone_first_use_strict, define_es_module, emit_export_stmts, local_name_for_src,
        use_strict, ImportInterop,
    },
};

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

pub fn amd<C>(
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    let Config { module_id, config } = config;

    as_folder(Amd {
        module_id,
        config,
        unresolved_mark,
        resolver: Resolver::Default,
        available_features,
        comments,

        support_arrow: caniuse!(available_features.ArrowFunctions),
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

pub fn amd_with_resolver<C>(
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
    let Config { module_id, config } = config;

    as_folder(Amd {
        module_id,
        config,
        unresolved_mark,
        resolver: Resolver::Real { base, resolver },
        comments,

        available_features,
        support_arrow: caniuse!(available_features.ArrowFunctions),
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

pub struct Amd<C>
where
    C: Comments,
{
    module_id: Option<String>,
    config: InnerConfig,
    unresolved_mark: Mark,
    resolver: Resolver,
    comments: Option<C>,

    available_features: FeatureFlag,
    support_arrow: bool,
    const_var_kind: VarDeclKind,

    dep_list: Vec<(Ident, JsWord, Span)>,
    require: Ident,
    exports: Option<Ident>,
    module: Option<Ident>,
    found_import_meta: bool,
}

impl<C> VisitMut for Amd<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        if let Some(first) = n.first() {
            if self.module_id.is_none() {
                self.module_id = self.get_amd_module_id_from_comments(first.span());
            }
        }

        let import_interop = self.config.import_interop();

        let mut strip = ModuleDeclStrip::default();
        n.visit_mut_with(&mut strip);

        let mut stmts: Vec<Stmt> = Vec::with_capacity(n.len() + 4);

        // "use strict";
        if self.config.strict_mode {
            stmts.push(clone_first_use_strict(n).unwrap_or_else(use_strict));
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

        stmts.extend(n.take().into_iter().filter_map(|item| match item {
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

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        stmts.visit_mut_children_with(&mut ModuleRefRewriter {
            import_map,
            lazy_record: Default::default(),
            allow_top_level_this: self.config.allow_top_level_this,
            is_global_this: true,
        });

        // ====================
        //  Emit
        // ====================

        let mut elems = vec![Some(quote_str!("require").as_arg())];
        let mut params = vec![self.require.clone().into()];

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

        *n = vec![
            quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "define")
                .as_call(DUMMY_SP, amd_call_args)
                .into_stmt()
                .into(),
        ];
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
                    self.pure_span(),
                    args.take(),
                    require,
                    self.config.import_interop(),
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

impl<C> Amd<C>
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
        let import_interop = self.config.import_interop();

        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export
            .into_iter()
            .map(|((key, span), ident)| (key, span, ident.into()))
            .collect();

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
                };
            },
        );

        let mut export_stmts = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            export_obj_prop_list.sort_by(|a, b| a.1.cmp(&b.1));

            let features = self.available_features;
            let exports = self.exports();

            export_stmts = emit_export_stmts(features, exports, export_obj_prop_list);
        }

        export_stmts.into_iter().chain(stmts)
    }

    fn module(&mut self) -> Ident {
        self.module
            .get_or_insert_with(|| private_ident!("module"))
            .clone()
    }

    fn exports(&mut self) -> Ident {
        self.exports
            .get_or_insert_with(|| private_ident!("exports"))
            .clone()
    }

    fn pure_span(&self) -> Span {
        let mut span = DUMMY_SP;

        if self.config.import_interop().is_none() {
            return span;
        }

        if let Some(comments) = &self.comments {
            span = Span::dummy_with_cmt();
            comments.add_pure_comment(span.lo);
        }
        span
    }

    fn get_amd_module_id_from_comments(&self, span: Span) -> Option<String> {
        // https://github.com/microsoft/TypeScript/blob/1b9c8a15adc3c9a30e017a7048f98ef5acc0cada/src/compiler/parser.ts#L9648-L9658
        let amd_module_re = Regex::new(
            r##"(?i)^/\s*<amd-module.*?name\s*=\s*(?:(?:'([^']*)')|(?:"([^"]*)")).*?/>"##,
        )
        .unwrap();

        self.comments.as_ref().and_then(|comments| {
            comments
                .get_leading(span.lo)
                .iter()
                .flatten()
                .rev()
                .find_map(|cmt| {
                    amd_module_re
                        .captures(&cmt.text)
                        .and_then(|cap| cap.get(1).or_else(|| cap.get(2)))
                })
                .map(|m| m.as_str().to_string())
        })
    }
}

/// new Promise((resolve, reject) => require([arg], m => resolve(m), reject))
pub(crate) fn amd_dynamic_import(
    span: Span,
    pure_span: Span,
    args: Vec<ExprOrSpread>,
    require: Ident,
    import_interop: ImportInterop,
    support_arrow: bool,
) -> Expr {
    let resolve = private_ident!("resolve");
    let reject = private_ident!("reject");
    let arg = args[..1].iter().cloned().map(Option::Some).collect();

    let module = private_ident!("m");

    let resolved_module: Expr = match import_interop {
        ImportInterop::None => module.clone().into(),
        ImportInterop::Swc => helper_expr!(interop_require_wildcard, "interopRequireWildcard")
            .as_call(pure_span, vec![module.clone().as_arg()]),
        ImportInterop::Node => helper_expr!(interop_require_wildcard, "interopRequireWildcard")
            .as_call(pure_span, vec![module.clone().as_arg(), true.as_arg()]),
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
