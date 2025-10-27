use std::borrow::Cow;

use anyhow::Context;
use regex::Regex;
use rustc_hash::FxHashSet;
use swc_atoms::{atom, Atom};
use swc_common::{
    comments::{CommentKind, Comments},
    source_map::PURE_SP,
    sync::Lrc,
    util::take::Take,
    Mark, SourceMap, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper_expr;
use swc_ecma_utils::{
    is_valid_prop_ident, member_expr, private_ident, quote_expr, quote_ident, quote_str,
    ExprFactory, FunctionFactory, IsDirective,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{
    module_decl_strip::{
        Export, ExportKV, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip,
    },
    module_ref_rewriter::{rewrite_import_bindings, ImportMap},
    path::Resolver,
    top_level_this::top_level_this,
    util::{
        define_es_module, emit_export_stmts, local_name_for_src, prop_name, use_strict,
        ImportInterop, VecStmtLike,
    },
    SpanCtx,
};

/// Mode for module transformation
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum TransformMode {
    Amd,
    CommonJs,
    Umd,
}

/// Unified configuration for all module transforms
#[derive(Clone)]
pub(crate) struct ModuleConfig {
    pub mode: TransformMode,

    // Common config fields
    pub strict_mode: bool,
    pub allow_top_level_this: bool,
    pub import_interop: ImportInterop,
    pub no_interop: bool,
    pub ignore_dynamic: bool,
    pub preserve_import_meta: bool,
    pub lazy: crate::util::Lazy,
    pub export_interop_annotation: bool,

    // AMD-specific
    pub module_id: Option<String>,

    // UMD-specific
    pub umd_globals: std::collections::HashMap<String, Box<Expr>>,
    pub source_map: Option<Lrc<SourceMap>>,
}

impl ModuleConfig {
    pub fn import_interop(&self) -> ImportInterop {
        if self.no_interop {
            ImportInterop::None
        } else {
            self.import_interop
        }
    }

    pub fn export_interop_annotation(&self) -> bool {
        self.export_interop_annotation && self.mode == TransformMode::CommonJs
    }
}

/// Unified module transform visitor
pub(crate) struct ModuleTransform<C>
where
    C: Comments,
{
    config: ModuleConfig,
    resolver: Resolver,
    unresolved_mark: Mark,
    comments: Option<C>,

    // Feature flags
    support_arrow: bool,
    const_var_kind: VarDeclKind,

    // AMD/UMD specific - dependency list for define() call
    dep_list: Vec<(Ident, Atom, SpanCtx)>,

    // Identifiers
    require: Ident,
    exports: Option<Ident>,
    module: Option<Ident>,

    // AMD specific
    found_import_meta: bool,
}

impl<C> ModuleTransform<C>
where
    C: Comments,
{
    pub fn new(
        config: ModuleConfig,
        resolver: Resolver,
        unresolved_mark: Mark,
        comments: Option<C>,
        support_arrow: bool,
        support_block_scoping: bool,
    ) -> Self {
        Self {
            require: quote_ident!(
                SyntaxContext::empty().apply_mark(unresolved_mark),
                "require"
            ),
            const_var_kind: if support_block_scoping {
                VarDeclKind::Const
            } else {
                VarDeclKind::Var
            },
            config,
            resolver,
            unresolved_mark,
            comments,
            support_arrow,
            dep_list: Default::default(),
            exports: None,
            module: None,
            found_import_meta: false,
        }
    }

    fn exports(&mut self) -> Ident {
        if self.config.mode == TransformMode::CommonJs {
            quote_ident!(
                SyntaxContext::empty().apply_mark(self.unresolved_mark),
                "exports"
            )
        } else {
            self.exports
                .get_or_insert_with(|| private_ident!("exports"))
                .clone()
        }
    }

    fn module(&mut self) -> Ident {
        self.module
            .get_or_insert_with(|| private_ident!("module"))
            .clone()
    }

    fn get_amd_module_id_from_comments(&self, span: Span) -> Option<String> {
        if self.config.mode != TransformMode::Amd {
            return None;
        }

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

impl<C> VisitMut for ModuleTransform<C>
where
    C: Comments,
{
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, n: &mut Module) {
        match self.config.mode {
            TransformMode::Amd => self.visit_mut_module_amd(n),
            TransformMode::CommonJs => self.visit_mut_module_cjs(n),
            TransformMode::Umd => self.visit_mut_module_umd(n),
        }
    }

    fn visit_mut_script(&mut self, _: &mut Script) {
        // skip script
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if !self.config.ignore_dynamic {
            if matches!(
                n,
                Expr::Call(CallExpr {
                    callee: Callee::Import(Import {
                        phase: ImportPhase::Evaluation,
                        ..
                    }),
                    ..
                })
            ) {
                self.handle_dynamic_import(n);
                return;
            }
        }

        if !self.config.preserve_import_meta {
            if let Expr::Member(MemberExpr { obj, .. }) = n {
                if obj
                    .as_meta_prop()
                    .map(|p| p.kind == MetaPropKind::ImportMeta)
                    .unwrap_or_default()
                {
                    self.handle_import_meta(n);
                    return;
                }
            }

            if let Expr::OptChain(OptChainExpr { base, .. }) = n {
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
                };
            }
        }

        n.visit_mut_children_with(self);
    }
}

// AMD-specific implementation
impl<C> ModuleTransform<C>
where
    C: Comments,
{
    fn visit_mut_module_amd(&mut self, n: &mut Module) {
        if self.config.module_id.is_none() {
            self.config.module_id = self.get_amd_module_id_from_comments(n.span);
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

        stmts.extend(self.handle_import_export_amd(
            &mut import_map,
            link,
            export,
            is_export_assign,
        ));

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

        // Emit AMD wrapper
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
                        .with_context(|| format!("failed to resolve `{src_path}`"))
                        .unwrap(),
                    Resolver::Default => src_path,
                };

                elems.push(Some(quote_str!(src_span.0, src_path).as_arg()));
                params.push(ident.into());
            });

        let mut amd_call_args = Vec::with_capacity(3);
        if let Some(module_id) = self.config.module_id.clone() {
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

    fn handle_import_export_amd(
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

                let mut import_expr: Expr = if need_re_export {
                    helper_expr!(export_star).as_call(
                        DUMMY_SP,
                        vec![mod_ident.clone().as_arg(), self.exports().as_arg()],
                    )
                } else {
                    mod_ident.clone().into()
                };

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
}

// CommonJS-specific implementation
impl<C> ModuleTransform<C>
where
    C: Comments,
{
    fn visit_mut_module_cjs(&mut self, n: &mut Module) {
        let mut stmts: Vec<ModuleItem> = Vec::with_capacity(n.body.len() + 6);

        // Collect directives
        stmts.extend(
            &mut n
                .body
                .iter_mut()
                .take_while(|i| i.directive_continue())
                .map(|i| i.take()),
        );

        // "use strict";
        if self.config.strict_mode && !stmts.has_use_strict() {
            stmts.push(use_strict().into());
        }

        if !self.config.allow_top_level_this {
            top_level_this(&mut n.body, *Expr::undefined(DUMMY_SP));
        }

        let import_interop = self.config.import_interop();

        let mut module_map = Default::default();

        let mut has_ts_import_equals = false;

        // handle `import foo = require("mod")`
        n.body.iter_mut().for_each(|item| {
            if let ModuleItem::ModuleDecl(module_decl) = item {
                *item = self.handle_ts_import_equals(
                    module_decl.take(),
                    &mut module_map,
                    &mut has_ts_import_equals,
                );
            }
        });

        let mut strip = ModuleDeclStrip::new(self.const_var_kind);
        n.body.visit_mut_with(&mut strip);

        let ModuleDeclStrip {
            link,
            export,
            export_assign,
            has_module_decl,
            ..
        } = strip;

        let has_module_decl = has_module_decl || has_ts_import_equals;

        let is_export_assign = export_assign.is_some();

        if has_module_decl && !import_interop.is_none() && !is_export_assign {
            stmts.push(define_es_module(self.exports()).into())
        }

        let mut lazy_record = Default::default();

        stmts.extend(
            self.handle_import_export_cjs(
                &mut module_map,
                &mut lazy_record,
                link,
                export,
                is_export_assign,
            )
            .map(From::from),
        );

        stmts.extend(n.body.take().into_iter().filter(|item| match item {
            ModuleItem::Stmt(stmt) => !stmt.is_empty(),
            _ => false,
        }));

        if let Some(export_assign) = export_assign {
            stmts.push(
                export_assign
                    .make_assign_to(
                        op!("="),
                        member_expr!(
                            SyntaxContext::empty().apply_mark(self.unresolved_mark),
                            Default::default(),
                            module.exports
                        )
                        .into(),
                    )
                    .into_stmt()
                    .into(),
            )
        }

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        rewrite_import_bindings(&mut stmts, module_map, lazy_record);

        n.body = stmts;
    }

    fn handle_import_export_cjs(
        &mut self,
        import_map: &mut ImportMap,
        lazy_record: &mut FxHashSet<Id>,
        link: Link,
        export: Export,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.import_interop();
        let export_interop_annotation = self.config.export_interop_annotation();
        let is_node = import_interop.is_node();

        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export.into_iter().collect();

        let lexer_reexport = if export_interop_annotation {
            self.emit_lexer_reexport(&link)
        } else {
            None
        };

        link.into_iter().for_each(
            |(src, LinkItem(src_span, link_specifier_set, mut link_flag))| {
                let is_node_default = !link_flag.has_named() && is_node;

                if import_interop.is_none() {
                    link_flag -= LinkFlag::NAMESPACE;
                }

                let mod_ident = private_ident!(local_name_for_src(&src));

                let mut decl_mod_ident = false;

                link_specifier_set.reduce(
                    import_map,
                    &mut export_obj_prop_list,
                    &mod_ident,
                    &None,
                    &mut decl_mod_ident,
                    is_node_default,
                );

                let is_lazy =
                    decl_mod_ident && !link_flag.export_star() && self.config.lazy.is_lazy(&src);

                if is_lazy {
                    lazy_record.insert(mod_ident.to_id());
                }

                let import_expr =
                    self.resolver
                        .make_require_call(self.unresolved_mark, src, src_span.0);

                let import_expr = if link_flag.export_star() {
                    helper_expr!(export_star).as_call(
                        DUMMY_SP,
                        vec![import_expr.as_arg(), self.exports().as_arg()],
                    )
                } else {
                    import_expr
                };

                let import_expr = {
                    match import_interop {
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

                if decl_mod_ident {
                    let stmt = if is_lazy {
                        lazy_require(import_expr, mod_ident, self.const_var_kind).into()
                    } else {
                        import_expr
                            .into_var_decl(self.const_var_kind, mod_ident.into())
                            .into()
                    };

                    stmts.push(stmt);
                } else {
                    stmts.push(import_expr.into_stmt());
                }
            },
        );

        let mut export_stmts: Vec<Stmt> = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            export_obj_prop_list.sort_by_cached_key(|(key, ..)| key.clone());

            let exports = self.exports();

            if export_interop_annotation && export_obj_prop_list.len() > 1 {
                export_stmts.extend(self.emit_lexer_exports_init(&export_obj_prop_list));
            }

            export_stmts.extend(emit_export_stmts(exports, export_obj_prop_list));
        }

        export_stmts.extend(lexer_reexport);

        export_stmts.into_iter().chain(stmts)
    }

    fn handle_ts_import_equals(
        &mut self,
        module_decl: ModuleDecl,
        module_map: &mut ImportMap,
        has_ts_import_equals: &mut bool,
    ) -> ModuleItem {
        match module_decl {
            ModuleDecl::TsImportEquals(v)
                if matches!(
                    &*v,
                    TsImportEqualsDecl {
                        is_type_only: false,
                        module_ref: TsModuleRef::TsExternalModuleRef(TsExternalModuleRef { .. }),
                        ..
                    }
                ) =>
            {
                let TsImportEqualsDecl {
                    span,
                    is_export,
                    id,
                    module_ref,
                    ..
                } = *v;
                let Str {
                    span: src_span,
                    value: src,
                    ..
                } = module_ref.expect_ts_external_module_ref().expr;

                *has_ts_import_equals = true;

                let require = self.resolver.make_require_call(
                    self.unresolved_mark,
                    src.to_atom_lossy().into_owned(),
                    src_span,
                );

                if is_export {
                    module_map.insert(id.to_id(), (self.exports(), Some(id.sym.clone())));

                    let assign_expr = AssignExpr {
                        span,
                        op: op!("="),
                        left: self.exports().make_member(id.into()).into(),
                        right: Box::new(require),
                    };

                    assign_expr.into_stmt()
                } else {
                    let mut var_decl = require.into_var_decl(self.const_var_kind, id.into());
                    var_decl.span = span;

                    var_decl.into()
                }
                .into()
            }
            _ => module_decl.into(),
        }
    }

    fn emit_lexer_exports_init(&mut self, export_id_list: &[ExportKV]) -> Option<Stmt> {
        match export_id_list.len() {
            0 => None,
            1 => {
                let expr: Expr = 0.into();

                let (key, export_item) = &export_id_list[0];
                let prop = prop_name(key, Default::default()).into();
                let export_binding = MemberExpr {
                    obj: Box::new(self.exports().into()),
                    span: export_item.export_name_span().0,
                    prop,
                };
                let expr = expr.make_assign_to(op!("="), export_binding.into());
                let expr = BinExpr {
                    span: DUMMY_SP,
                    op: op!("&&"),
                    left: 0.into(),
                    right: Box::new(expr),
                };

                Some(expr.into_stmt())
            }
            _ => {
                let props = export_id_list
                    .iter()
                    .map(|(key, ..)| prop_name(key, Default::default()))
                    .map(|key| KeyValueProp {
                        key: key.into(),
                        value: quote_expr!(DUMMY_SP, null).into(),
                    })
                    .map(Prop::KeyValue)
                    .map(Box::new)
                    .map(PropOrSpread::Prop)
                    .collect();

                let module_exports_assign = ObjectLit {
                    span: DUMMY_SP,
                    props,
                }
                .make_assign_to(
                    op!("="),
                    member_expr!(
                        SyntaxContext::empty().apply_mark(self.unresolved_mark),
                        Default::default(),
                        module.exports
                    )
                    .into(),
                );

                let expr = BinExpr {
                    span: DUMMY_SP,
                    op: op!("&&"),
                    left: 0.into(),
                    right: Box::new(module_exports_assign),
                };

                Some(expr.into_stmt())
            }
        }
    }

    fn emit_lexer_reexport(&self, link: &Link) -> Option<Stmt> {
        link.iter()
            .filter(|(.., LinkItem(.., link_flag))| link_flag.export_star())
            .map(|(src, ..)| {
                let import_expr =
                    self.resolver
                        .make_require_call(self.unresolved_mark, src.clone(), DUMMY_SP);

                quote_ident!("__export").as_call(DUMMY_SP, vec![import_expr.as_arg()])
            })
            .reduce(|left, right| {
                BinExpr {
                    span: DUMMY_SP,
                    op: op!("&&"),
                    left: left.into(),
                    right: right.into(),
                }
                .into()
            })
            .map(|expr| {
                BinExpr {
                    span: DUMMY_SP,
                    op: op!("&&"),
                    left: 0.into(),
                    right: expr.into(),
                }
                .into_stmt()
            })
    }
}

// UMD-specific implementation
impl<C> ModuleTransform<C>
where
    C: Comments,
{
    fn visit_mut_module_umd(&mut self, module: &mut Module) {
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
        if self.config.strict_mode && !stmts.has_use_strict() {
            stmts.push(use_strict());
        }

        if !self.config.allow_top_level_this {
            top_level_this(module_items, *Expr::undefined(DUMMY_SP));
        }

        let import_interop = self.config.import_interop();

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

        stmts.extend(self.handle_import_export_umd(
            &mut import_map,
            link,
            export,
            is_export_assign,
        ));

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

        let (adapter_fn_expr, factory_params) =
            self.build_umd_adapter(module.span, is_export_assign);

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

    fn handle_import_export_umd(
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

                let mut import_expr: Expr = if need_re_export {
                    helper_expr!(export_star).as_call(
                        DUMMY_SP,
                        vec![mod_ident.clone().as_arg(), self.exports().as_arg()],
                    )
                } else {
                    mod_ident.clone().into()
                };

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

    fn build_umd_adapter(
        &mut self,
        module_span: Span,
        is_export_assign: bool,
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

        let global = private_ident!("global");
        let factory = private_ident!("factory");

        let module_exports = module.clone().make_member(quote_ident!("exports"));
        let define_amd = define.clone().make_member(quote_ident!("amd"));

        let mut cjs_args = Vec::new();
        let mut amd_dep_list = Vec::new();
        let mut browser_args = Vec::new();

        let mut factory_params = Vec::new();

        if !is_export_assign && self.exports.is_some() {
            let exported_name = self.determine_umd_export_name(module_span);
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
                        .with_context(|| format!("failed to resolve `{src_path}`"))
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
                    let dep_name = self.get_umd_global_name(&src_path);
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

    fn determine_umd_export_name(&self, module_span: Span) -> Ident {
        if let Some(cm) = &self.config.source_map {
            let filename = cm.span_to_filename(module_span);
            match &*filename {
                swc_common::FileName::Real(ref path) => {
                    let s = match path.file_stem() {
                        Some(stem) => self.umd_global_name_for_path(&stem.to_string_lossy()),
                        None => self.umd_global_name_for_path(&path.display().to_string()),
                    };

                    quote_ident!(s).into()
                }
                swc_common::FileName::Custom(s) => {
                    let s = self.umd_global_name_for_path(s);
                    quote_ident!(s).into()
                }
                _ => quote_ident!("lib").into(),
            }
        } else {
            quote_ident!("lib").into()
        }
    }

    fn umd_global_name_for_path(&self, src: &str) -> Atom {
        use inflector::Inflector;
        if !src.contains('/') {
            return src.to_camel_case().into();
        }

        src.split('/').next_back().unwrap().to_camel_case().into()
    }

    fn get_umd_global_name(&self, src: &str) -> Atom {
        self.umd_global_name_for_path(src)
    }
}

// Dynamic import and import.meta handling
impl<C> ModuleTransform<C>
where
    C: Comments,
{
    fn handle_dynamic_import(&mut self, n: &mut Expr) {
        let (span, import_span, args) = match n {
            Expr::Call(CallExpr {
                span,
                callee:
                    Callee::Import(Import {
                        span: import_span,
                        phase: ImportPhase::Evaluation,
                    }),
                args,
                ..
            }) => (*span, *import_span, args),
            _ => return,
        };

        args.visit_mut_with(self);

        let mut is_lit_path = false;

        args.get_mut(0).into_iter().for_each(|x| {
            if let ExprOrSpread { spread: None, expr } = x {
                if let Expr::Lit(Lit::Str(Str { value, raw, .. })) = &mut **expr {
                    is_lit_path = true;
                    *value = self
                        .resolver
                        .resolve(value.to_atom_lossy().into_owned())
                        .into();
                    *raw = None;
                }
            }
        });

        *n = match self.config.mode {
            TransformMode::Amd => {
                let mut require = self.require.clone();
                require.span = import_span;

                amd_dynamic_import(
                    span,
                    args.take(),
                    require,
                    self.config.import_interop(),
                    self.support_arrow,
                )
            }
            TransformMode::CommonJs => {
                let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);

                cjs_dynamic_import(
                    span,
                    args.take(),
                    quote_ident!(unresolved_ctxt, import_span, "require"),
                    self.config.import_interop(),
                    self.support_arrow,
                    is_lit_path,
                )
            }
            TransformMode::Umd => {
                // UMD doesn't handle dynamic imports - leave unchanged
                return;
            }
        };
    }

    fn handle_import_meta(&mut self, n: &mut Expr) {
        let (span, obj, prop) = match n {
            Expr::Member(MemberExpr { span, obj, prop }) => (span, obj, prop),
            _ => return,
        };

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

        match self.config.mode {
            TransformMode::Amd => {
                self.found_import_meta = true;

                match &*p {
                    "url" => {
                        *n = amd_import_meta_url(*span, self.module());
                    }
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
                            _ => {}
                        }
                    }
                    "filename" => {
                        *n = amd_import_meta_filename(*span, self.module());
                    }
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
                            _ => {}
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
            TransformMode::CommonJs => match &*p {
                "url" => {
                    let require = quote_ident!(
                        SyntaxContext::empty().apply_mark(self.unresolved_mark),
                        "require"
                    );
                    *n = cjs_import_meta_url(*span, require, self.unresolved_mark);
                }
                "resolve" => {
                    let require = quote_ident!(
                        SyntaxContext::empty().apply_mark(self.unresolved_mark),
                        obj.span(),
                        "require"
                    );

                    *obj = Box::new(require.into());
                }
                "filename" => {
                    *n = quote_ident!(
                        SyntaxContext::empty().apply_mark(self.unresolved_mark),
                        *span,
                        "__filename"
                    )
                    .into();
                }
                "dirname" => {
                    *n = quote_ident!(
                        SyntaxContext::empty().apply_mark(self.unresolved_mark),
                        *span,
                        "__dirname"
                    )
                    .into();
                }
                "main" => {
                    let ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);
                    let require = quote_ident!(ctxt, "require");
                    let require_main = require.make_member(quote_ident!("main"));
                    let module = quote_ident!(ctxt, "module");

                    *n = BinExpr {
                        span: *span,
                        op: op!("=="),
                        left: require_main.into(),
                        right: module.into(),
                    }
                    .into();
                }
                _ => {}
            },
            TransformMode::Umd => {
                // UMD doesn't handle import.meta
            }
        }
    }
}

// Helper functions for dynamic import
fn amd_dynamic_import(
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

fn cjs_dynamic_import(
    span: Span,
    args: Vec<ExprOrSpread>,
    require: Ident,
    import_interop: ImportInterop,
    support_arrow: bool,
    is_lit_path: bool,
) -> Expr {
    let p = private_ident!("p");

    let (resolve_args, callback_params, require_args) = if is_lit_path {
        (Vec::new(), Vec::new(), args)
    } else {
        (args, vec![p.clone().into()], vec![p.as_arg()])
    };

    let then = member_expr!(Default::default(), Default::default(), Promise.resolve)
        .as_call(DUMMY_SP, resolve_args)
        .make_member(quote_ident!("then"));

    let import_expr = {
        let require = require.as_call(DUMMY_SP, require_args);

        match import_interop {
            ImportInterop::None => require,
            ImportInterop::Swc => {
                helper_expr!(interop_require_wildcard).as_call(PURE_SP, vec![require.as_arg()])
            }
            ImportInterop::Node => helper_expr!(interop_require_wildcard)
                .as_call(PURE_SP, vec![require.as_arg(), true.as_arg()]),
        }
    };

    then.as_call(
        span,
        vec![import_expr
            .into_lazy_auto(callback_params, support_arrow)
            .as_arg()],
    )
}

fn cjs_import_meta_url(span: Span, require: Ident, unresolved_mark: Mark) -> Expr {
    require
        .as_call(DUMMY_SP, vec!["url".as_arg()])
        .make_member(quote_ident!("pathToFileURL"))
        .as_call(
            DUMMY_SP,
            vec![quote_ident!(
                SyntaxContext::empty().apply_mark(unresolved_mark),
                "__filename"
            )
            .as_arg()],
        )
        .make_member(quote_ident!("toString"))
        .as_call(span, Default::default())
}

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

fn amd_import_meta_filename(span: Span, module: Ident) -> Expr {
    module
        .make_member(quote_ident!("uri"))
        .make_member(quote_ident!("split"))
        .as_call(DUMMY_SP, vec![quote_str!("/").as_arg()])
        .make_member(quote_ident!("pop"))
        .as_call(span, vec![])
}

/// ```javascript
/// function foo() {
///   const data = expr;
///
///   foo = () => data;
///
///   return data;
/// }
/// ```
fn lazy_require(expr: Expr, mod_ident: Ident, var_kind: VarDeclKind) -> FnDecl {
    let data = private_ident!("data");
    let data_decl = expr.into_var_decl(var_kind, data.clone().into());
    let data_stmt = data_decl.into();
    let overwrite_stmt = data
        .clone()
        .into_lazy_fn(Default::default())
        .into_fn_expr(None)
        .make_assign_to(op!("="), mod_ident.clone().into())
        .into_stmt();
    let return_stmt = data.into_return_stmt().into();

    FnDecl {
        ident: mod_ident,
        declare: false,
        function: Function {
            params: Default::default(),
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![data_stmt, overwrite_stmt, return_stmt],
                ..Default::default()
            }),
            is_generator: false,
            is_async: false,
            ..Default::default()
        }
        .into(),
    }
}
