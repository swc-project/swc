use anyhow::Context;
use regex::Regex;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{
    comments::{CommentKind, Comments},
    source_map::PURE_SP,
    util::take::Take,
    Mark, Span, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, ExprFactory, FunctionFactory, IsDirective,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub use super::util::Config as InnerConfig;
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

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

pub fn amd<C>(
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Pass
where
    C: Comments,
{
    let Config { module_id, config } = config;

    visit_mut_pass(Amd {
        module_id,
        config,
        unresolved_mark,
        resolver,
        comments,

        support_arrow: caniuse!(available_features.ArrowFunctions),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        dep_list: Default::default(),
        require: quote_ident!(
            SyntaxContext::empty().apply_mark(unresolved_mark),
            "require"
        ),
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

    support_arrow: bool,
    const_var_kind: VarDeclKind,

    dep_list: Vec<(Ident, JsWord, SpanCtx)>,
    require: Ident,
    exports: Option<Ident>,
    module: Option<Ident>,
    found_import_meta: bool,
}

impl<C> VisitMut for Amd<C>
where
    C: Comments,
{
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, n: &mut Module) {
        if self.module_id.is_none() {
            self.module_id = self.get_amd_module_id_from_comments(n.span);
        }

        let mut stmts: Vec<Stmt> = Vec::with_capacity(n.body.len() + 4);

        // Collect directives
        stmts.extend(
            &mut n
                .body
                .iter_mut()
                .take_while(|i| i.directive_continue())
                .map(|i| i.take())
                .map(ModuleItem::expect_stmt),
        );

        // "use strict";
        if self.config.strict_mode && !stmts.has_use_strict() {
            stmts.push(use_strict());
        }

        if !self.config.allow_top_level_this {
            top_level_this(&mut n.body, *Expr::undefined(DUMMY_SP));
        }

        let import_interop = self.config.import_interop();

        let mut strip = ModuleDeclStrip::new(self.const_var_kind);
        n.body.visit_mut_with(&mut strip);

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

        stmts.extend(n.body.take().into_iter().filter_map(|item| match item {
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

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        rewrite_import_bindings(&mut stmts, import_map, Default::default());

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

                elems.push(Some(quote_str!(src_span.0, src_path).as_arg()));
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

        n.body = vec![quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "define"
        )
        .as_call(DUMMY_SP, amd_call_args)
        .into_stmt()
        .into()];
    }

    fn visit_mut_script(&mut self, _: &mut Script) {
        // skip script
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Call(CallExpr {
                span,
                callee:
                    Callee::Import(Import {
                        span: import_span,
                        phase: ImportPhase::Evaluation,
                    }),
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
                require.span = *import_span;

                *n = amd_dynamic_import(
                    *span,
                    args.take(),
                    require,
                    self.config.import_interop(),
                    self.support_arrow,
                );
            }
            Expr::Member(MemberExpr { span, obj, prop })
                if prop.is_ident_with("url")
                    && !self.config.preserve_import_meta
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
                };
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

    fn get_amd_module_id_from_comments(&self, span: Span) -> Option<String> {
        // https://github.com/microsoft/TypeScript/blob/1b9c8a15adc3c9a30e017a7048f98ef5acc0cada/src/compiler/parser.ts#L9648-L9658
        let amd_module_re =
            Regex::new(r#"(?i)^/\s*<amd-module.*?name\s*=\s*(?:(?:'([^']*)')|(?:"([^"]*)")).*?/>"#)
                .unwrap();

        self.comments.as_ref().and_then(|comments| {
            comments
                .get_leading(span.lo)
                .iter()
                .flatten()
                .rev()
                .find_map(|cmt| {
                    if cmt.kind != CommentKind::Line {
                        return None;
                    }
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
        ImportInterop::Swc => {
            helper_expr!(interop_require_wildcard).as_call(PURE_SP, vec![module.clone().as_arg()])
        }
        ImportInterop::Node => helper_expr!(interop_require_wildcard)
            .as_call(PURE_SP, vec![module.clone().as_arg(), true.as_arg()]),
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
        ..Default::default()
    }
    .into()
}

/// new URL(module.uri, document.baseURI).href
fn amd_import_meta_url(span: Span, module: Ident) -> Expr {
    MemberExpr {
        span,
        obj: quote_ident!("URL")
            .into_new_expr(
                DUMMY_SP,
                Some(vec![
                    module.make_member(quote_ident!("uri")).as_arg(),
                    member_expr!(Default::default(), DUMMY_SP, document.baseURI).as_arg(),
                ]),
            )
            .into(),
        prop: MemberProp::Ident("href".into()),
    }
    .into()
}
