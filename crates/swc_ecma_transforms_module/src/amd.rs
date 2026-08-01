use std::borrow::Cow;

use regex::Regex;
use rustc_hash::FxHashSet;
use serde::{Deserialize, Serialize};
use swc_atoms::{atom, Atom};
use swc_common::{
    comments::{CommentKind, Comments},
    source_map::PURE_SP,
    util::take::Take,
    Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper_expr;
use swc_ecma_utils::{member_expr, private_ident, quote_ident, quote_str, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub use super::util::Config as InnerConfig;
use crate::{
    module_record::{
        exported_external_ts_import_equals_name, external_ts_import_equals_source,
        LocalExportEntries, ModuleRecordEntryReducer, ModuleRequestUsage, RequestedModule,
        RequestedModules, SourceModule,
    },
    module_ref_rewriter::{rewrite_import_bindings, ImportMap},
    path::Resolver,
    syntax_strip::{self, SyntaxStrippedModule},
    top_level_this::top_level_this,
    util::{
        define_es_module, emit_export_stmts, local_name_for_src, sort_export_bindings, use_strict,
        ImportInterop,
    },
    SpanCtx,
};

mod emit;

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

#[derive(Default)]
pub struct FeatureFlag {
    pub support_block_scoping: bool,
    pub support_arrow: bool,
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

        support_arrow: available_features.support_arrow,
        const_var_kind: if available_features.support_block_scoping {
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

    dep_list: Vec<(Ident, Atom, SpanCtx)>,
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

        if !self.config.allow_top_level_this {
            top_level_this(&mut n.body, *Expr::undefined(DUMMY_SP));
        }

        let SyntaxStrippedModule {
            directives,
            has_use_strict,
            requested_modules,
            local_export_entries,
            export_assign,
            body,
            has_module_syntax,
        } = syntax_strip::lower(SourceModule::collect(n.body.take()), self.const_var_kind);

        let mut stmts: Vec<Stmt> = Vec::with_capacity(body.len() + 4);
        stmts.extend(directives);

        // "use strict";
        if self.config.strict_mode && !has_use_strict {
            stmts.push(use_strict());
        }

        let import_interop = self.config.import_interop();

        let is_export_assign = export_assign.is_some();

        if has_module_syntax && !import_interop.is_none() && !is_export_assign {
            stmts.push(define_es_module(self.exports()));
        }

        let mut import_map = Default::default();
        let ts_import_equals_exports: FxHashSet<Atom> = body
            .iter()
            .filter_map(exported_external_ts_import_equals_name)
            .cloned()
            .collect();

        stmts.extend(self.handle_import_export(
            &mut import_map,
            requested_modules,
            local_export_entries,
            &ts_import_equals_exports,
            is_export_assign,
        ));

        stmts.extend(
            body.into_iter()
                .filter_map(|item| self.lower_body_item(&mut import_map, item)),
        );

        if let Some(export_assign) = export_assign {
            let return_stmt = ReturnStmt {
                span: DUMMY_SP,
                arg: Some(export_assign),
            };

            stmts.push(return_stmt.into());
        }

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        rewrite_import_bindings(&mut stmts, import_map, Default::default());

        n.body = emit::emit(
            stmts,
            emit::EmitModule {
                module_id: self.module_id.clone(),
                require: self.require.clone(),
                exports: self.exports.take(),
                module: self.module.clone(),
                deps: self.dep_list.take(),
            },
            self.unresolved_mark,
            &self.resolver,
        );
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
                            *value = self
                                .resolver
                                .resolve(value.to_atom_lossy().into_owned())
                                .into();
                            *raw = None;
                        }
                    }
                });

                let mut require = self.require.clone();
                require.span = *import_span;

                // `import()` is specified as an ImportCall. AMD lowers it to a
                // promise around async `require([arg], ...)`.
                // Spec: https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-import-calls
                *n = amd_dynamic_import(
                    *span,
                    args.take(),
                    require,
                    self.config.import_interop(),
                    self.support_arrow,
                );
            }
            Expr::Member(MemberExpr { span, obj, prop })
                if !self.config.preserve_import_meta
                    && obj
                        .as_meta_prop()
                        .is_some_and(|p| p.kind == MetaPropKind::ImportMeta) =>
            {
                // `import.meta` is host-populated in the spec. AMD lowers
                // supported host fields to loader-specific values.
                // Spec:
                // - https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-hostgetimportmetaproperties
                // - https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-hostfinalizeimportmeta
                let p = match prop {
                    MemberProp::Ident(IdentName { sym, .. }) => Cow::Borrowed(&**sym),
                    MemberProp::Computed(ComputedPropName { expr, .. }) => match &**expr {
                        Expr::Lit(Lit::Str(s)) => s.value.to_string_lossy(),
                        _ => return,
                    },
                    MemberProp::PrivateName(..) => return,
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                };
                self.found_import_meta = true;

                match &*p {
                    // new URL(module.uri, document.baseURI).href
                    "url" => {
                        *n = amd_import_meta_url(*span, self.module());
                    }
                    // require.toUrl()
                    "resolve" => {
                        let mut require = self.require.clone();
                        require.span = obj.span();
                        *obj = require.into();

                        match prop {
                            MemberProp::Ident(IdentName { sym, .. }) => *sym = atom!("toUrl"),
                            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                                match &mut **expr {
                                    Expr::Lit(Lit::Str(s)) => {
                                        s.value = atom!("toUrl").into();
                                        s.raw = None;
                                    }
                                    _ => unreachable!(),
                                }
                            }
                            MemberProp::PrivateName(..) => unreachable!(),
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        }
                    }
                    // module.uri.split("/").pop()
                    "filename" => {
                        *n = amd_import_meta_filename(*span, self.module());
                    }
                    // require.toUrl(".")
                    "dirname" => {
                        let mut require = self.require.clone();
                        require.span = obj.span();
                        *obj = require.into();

                        match prop {
                            MemberProp::Ident(IdentName { sym, .. }) => *sym = atom!("toUrl"),
                            MemberProp::Computed(ComputedPropName { expr, .. }) => {
                                match &mut **expr {
                                    Expr::Lit(Lit::Str(s)) => {
                                        s.value = atom!("toUrl").into();
                                        s.raw = None;
                                    }
                                    _ => unreachable!(),
                                }
                            }
                            MemberProp::PrivateName(..) => unreachable!(),
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        }

                        *n = n.take().as_call(n.span(), vec![quote_str!(".").as_arg()]);
                    }
                    "main" => {
                        *n = BinExpr {
                            span: *span,
                            left: self.module().make_member(quote_ident!("id")).into(),
                            op: op!("=="),
                            right: quote_str!("main").into(),
                        }
                        .into();
                    }
                    _ => {}
                }
            }
            Expr::OptChain(OptChainExpr { base, .. }) if !self.config.preserve_import_meta => {
                if let OptChainBase::Member(member) = &mut **base {
                    if member
                        .obj
                        .as_meta_prop()
                        .is_some_and(|meta_prop| meta_prop.kind == MetaPropKind::ImportMeta)
                    {
                        *n = member.take().into();
                        n.visit_mut_with(self);
                        return;
                    }
                }

                n.visit_mut_children_with(self);
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
        requested_modules: RequestedModules,
        local_export_entries: LocalExportEntries,
        ts_import_equals_exports: &FxHashSet<Atom>,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.import_interop();

        let mut stmts = Vec::with_capacity(requested_modules.len());

        let mut export_bindings = local_export_entries.into_iter().collect();

        requested_modules.into_iter().for_each(
            |(
                module_request,
                RequestedModule {
                    span: src_span,
                    entries: module_entries,
                    usage: mut module_usage,
                    ..
                },
            )| {
                let src = module_request.src().clone();
                let is_node_default = !module_usage.has_named() && import_interop.is_node();

                if import_interop.is_none() {
                    module_usage -= ModuleRequestUsage::NAMESPACE;
                }

                let need_re_export = module_usage.has_star_export();
                let need_interop = module_usage.needs_interop();

                let mod_ident = private_ident!(local_name_for_src(&src));

                self.dep_list.push((mod_ident.clone(), src, src_span));

                module_entries.reduce(
                    import_map,
                    &mut export_bindings,
                    &mod_ident,
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
                        ImportInterop::Swc if module_usage.needs_interop() => {
                            if module_usage.needs_namespace_object() {
                                helper_expr!(interop_require_wildcard)
                            } else {
                                helper_expr!(interop_require_default)
                            }
                            .as_call(PURE_SP, vec![import_expr.as_arg()])
                        }
                        ImportInterop::Node if module_usage.needs_namespace_object() => {
                            helper_expr!(interop_require_wildcard)
                                .as_call(PURE_SP, vec![import_expr.as_arg(), true.as_arg()])
                        }
                        _ => import_expr,
                    }
                }

                // mod = _introp(mod);
                if need_interop {
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

        export_bindings.retain(|(export_name, _)| !ts_import_equals_exports.contains(export_name));

        if !export_bindings.is_empty() && !is_export_assign {
            sort_export_bindings(&mut export_bindings);

            let exports = self.exports();

            export_stmts = emit_export_stmts(exports, export_bindings);
        }

        export_stmts.into_iter().chain(stmts)
    }

    fn lower_body_item(&mut self, import_map: &mut ImportMap, item: ModuleItem) -> Option<Stmt> {
        match item {
            ModuleItem::Stmt(stmt) if !stmt.is_empty() => Some(stmt),
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => {
                self.lower_ts_import_equals(import_map, *import)
            }
            _ => None,
        }
    }

    fn lower_ts_import_equals(
        &mut self,
        import_map: &mut ImportMap,
        import: TsImportEqualsDecl,
    ) -> Option<Stmt> {
        let src = external_ts_import_equals_source(&import)?;
        let src_span = src.span;
        let request = src.value.to_atom_lossy().into_owned();
        let TsImportEqualsDecl {
            id: local,
            is_export,
            ..
        } = import;
        let param = if is_export {
            local.clone().into_private()
        } else {
            local.clone()
        };

        self.dep_list
            .push((param.clone(), request, (src_span, Default::default())));

        if !is_export {
            return None;
        }

        Some(self.emit_ts_import_equals(import_map, local, is_export, param.into()))
    }

    fn emit_ts_import_equals(
        &mut self,
        import_map: &mut ImportMap,
        local: Ident,
        is_export: bool,
        value: Expr,
    ) -> Stmt {
        if is_export {
            import_map.insert(local.to_id(), (self.exports(), Some(local.sym.clone())));
            return value
                .make_assign_to(op!("="), self.exports().make_member(local.into()).into())
                .into_stmt();
        }

        value
            .into_var_decl(self.const_var_kind, local.into())
            .into()
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
        prop: MemberProp::Ident(atom!("href").into()),
    }
    .into()
}

// module.uri.split("/").pop()
fn amd_import_meta_filename(span: Span, module: Ident) -> Expr {
    module
        .make_member(quote_ident!("uri"))
        .make_member(quote_ident!("split"))
        .as_call(DUMMY_SP, vec![quote_str!("/").as_arg()])
        .make_member(quote_ident!("pop"))
        .as_call(span, vec![])
}
