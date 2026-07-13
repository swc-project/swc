use std::borrow::Cow;

use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{
    source_map::PURE_SP, util::take::Take, Mark, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper_expr;
use swc_ecma_utils::{
    member_expr, private_ident, quote_expr, quote_ident, ExprFactory, FunctionFactory,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    module_record::{
        exported_external_ts_import_equals_name, external_ts_import_equals_source, ExportBinding,
        LocalExportEntries, ModuleRecordEntryReducer, ModuleRequestUsage, RequestedModule,
        RequestedModules, SourceModule,
    },
    module_ref_rewriter::{rewrite_import_bindings, ImportMap},
    path::Resolver,
    syntax_strip::{self, SyntaxStrippedModule},
    top_level_this::top_level_this,
    util::{
        define_es_module, emit_export_stmts, local_name_for_src, prop_name, sort_export_bindings,
        use_strict, ImportInterop,
    },
};

#[derive(Default)]
pub struct FeatureFlag {
    pub support_block_scoping: bool,
    pub support_arrow: bool,
}

#[must_use]
pub fn common_js(
    resolver: Resolver,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Pass {
    visit_mut_pass(Cjs {
        config,
        resolver,
        unresolved_mark,
        support_arrow: available_features.support_arrow,
        const_var_kind: if available_features.support_block_scoping {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },
    })
}

pub struct Cjs {
    config: Config,
    resolver: Resolver,
    unresolved_mark: Mark,
    support_arrow: bool,
    const_var_kind: VarDeclKind,
}

impl VisitMut for Cjs {
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, n: &mut Module) {
        if !self.config.allow_top_level_this {
            top_level_this(&mut n.body, *Expr::undefined(DUMMY_SP));
        }

        let import_interop = self.config.import_interop();

        let mut module_map = Default::default();

        let SyntaxStrippedModule {
            directives,
            has_use_strict,
            requested_modules,
            local_export_entries,
            export_assign,
            body,
            has_module_syntax,
        } = syntax_strip::lower(SourceModule::collect(n.body.take()), self.const_var_kind);

        let mut stmts: Vec<ModuleItem> = Vec::with_capacity(body.len() + 6);
        stmts.extend(directives.into_iter().map(ModuleItem::from));

        // "use strict";
        if self.config.strict_mode && !has_use_strict {
            stmts.push(use_strict().into());
        }

        let is_export_assign = export_assign.is_some();

        if has_module_syntax && !import_interop.is_none() && !is_export_assign {
            stmts.push(define_es_module(self.exports()).into());
        }

        let mut lazy_record = Default::default();
        let ts_import_equals_exports: FxHashSet<Atom> = body
            .iter()
            .filter_map(exported_external_ts_import_equals_name)
            .cloned()
            .collect();

        // `import` -> `require`
        // `export` -> `_export(exports, {});`
        stmts.extend(
            self.handle_import_export(
                &mut module_map,
                &mut lazy_record,
                requested_modules,
                local_export_entries,
                &ts_import_equals_exports,
                is_export_assign,
            )
            .map(From::from),
        );

        stmts.extend(
            body.into_iter()
                .filter_map(|item| self.lower_body_item(&mut module_map, item)),
        );

        // `export = expr;` -> `module.exports = expr;`
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
            );
        }

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        rewrite_import_bindings(&mut stmts, module_map, lazy_record);

        n.body = stmts;
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

                let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);

                // `import()` is specified as an ImportCall. CommonJS lowers it
                // to a promise chain that evaluates `require(...)`.
                // Spec: https://tc39.es/ecma262/multipage/ecmascript-language-expressions.html#sec-import-calls
                *n = cjs_dynamic_import(
                    *span,
                    args.take(),
                    quote_ident!(unresolved_ctxt, *import_span, "require"),
                    self.config.import_interop(),
                    self.support_arrow,
                    is_lit_path,
                );
            }
            Expr::Member(MemberExpr { span, obj, prop })
                if !self.config.preserve_import_meta
                    && obj
                        .as_meta_prop()
                        .is_some_and(|p| p.kind == MetaPropKind::ImportMeta) =>
            {
                // `import.meta` is host-populated in the spec. CommonJS
                // lowers supported host fields to Node-like runtime values.
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

                match &*p {
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

                        **obj = require.into();
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

impl Cjs {
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        lazy_record: &mut FxHashSet<Id>,
        requested_modules: RequestedModules,
        local_export_entries: LocalExportEntries,
        ts_import_equals_exports: &FxHashSet<Atom>,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.import_interop();
        let export_interop_annotation = self.config.export_interop_annotation();
        let is_node = import_interop.is_node();

        let mut stmts = Vec::with_capacity(requested_modules.len());

        let mut export_bindings: Vec<ExportBinding> = local_export_entries.into_iter().collect();

        let lexer_reexport = if export_interop_annotation {
            self.emit_lexer_reexport(&requested_modules)
        } else {
            None
        };

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

                if import_interop.is_none() {
                    module_usage -= ModuleRequestUsage::NAMESPACE;
                }

                let is_node_default = !module_usage.has_named() && is_node;
                let mod_ident = private_ident!(local_name_for_src(&src));

                let mut decl_mod_ident = false;

                module_entries.reduce(
                    import_map,
                    &mut export_bindings,
                    &mod_ident,
                    &mut decl_mod_ident,
                    is_node_default,
                );

                let is_lazy = decl_mod_ident
                    && !module_usage.has_star_export()
                    && self.config.lazy.is_lazy(&src);

                if is_lazy {
                    lazy_record.insert(mod_ident.to_id());
                }

                // require("mod");
                let import_expr =
                    self.resolver
                        .make_require_call(self.unresolved_mark, src.clone(), src_span.0);

                // _export_star(require("mod"), exports);
                let import_expr = if module_usage.has_star_export() {
                    helper_expr!(export_star).as_call(
                        DUMMY_SP,
                        vec![import_expr.as_arg(), self.exports().as_arg()],
                    )
                } else {
                    import_expr
                };

                // _introp(require("mod"));
                let import_expr = {
                    match import_interop {
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

        export_bindings.retain(|(export_name, _)| !ts_import_equals_exports.contains(export_name));

        if !export_bindings.is_empty() && !is_export_assign {
            sort_export_bindings(&mut export_bindings);

            let exports = self.exports();

            if export_interop_annotation && export_bindings.len() > 1 {
                export_stmts.extend(self.emit_lexer_exports_init(&export_bindings));
            }

            export_stmts.extend(emit_export_stmts(exports, export_bindings));
        }

        export_stmts.extend(lexer_reexport);

        export_stmts.into_iter().chain(stmts)
    }

    fn lower_body_item(&self, import_map: &mut ImportMap, item: ModuleItem) -> Option<ModuleItem> {
        match item {
            ModuleItem::Stmt(stmt) if !stmt.is_empty() => Some(stmt.into()),
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => self
                .lower_ts_import_equals(import_map, *import)
                .map(From::from),
            _ => None,
        }
    }

    fn lower_ts_import_equals(
        &self,
        import_map: &mut ImportMap,
        import: TsImportEqualsDecl,
    ) -> Option<Stmt> {
        let src = external_ts_import_equals_source(&import)?;
        let value = self.resolver.make_require_call(
            self.unresolved_mark,
            src.value.to_atom_lossy().into_owned(),
            src.span,
        );

        Some(self.emit_ts_import_equals(import_map, import.id, import.is_export, value))
    }

    fn emit_ts_import_equals(
        &self,
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

    fn exports(&self) -> Ident {
        quote_ident!(
            SyntaxContext::empty().apply_mark(self.unresolved_mark),
            "exports"
        )
    }

    /// emit [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer) friendly exports list
    /// ```javascript
    /// 0 && (exports.foo = 0);
    /// 0 && (module.exports = { foo: _, bar: _ });
    /// ```
    fn emit_lexer_exports_init(&mut self, export_id_list: &[ExportBinding]) -> Option<Stmt> {
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
                        // `cjs-module-lexer` only support identifier as value
                        // `null` is treated as identifier in `cjs-module-lexer`
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

    /// emit [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer) friendly exports list
    /// ```javascript
    /// 0 && __export(require("foo")) && __export(require("bar"));
    /// ```
    fn emit_lexer_reexport(&self, requested_modules: &RequestedModules) -> Option<Stmt> {
        requested_modules
            .iter()
            .filter(|(.., RequestedModule { usage, .. })| usage.has_star_export())
            .map(|(module_request, ..)| {
                let import_expr = self.resolver.make_require_call(
                    self.unresolved_mark,
                    module_request.src().clone(),
                    DUMMY_SP,
                );

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

/// ```javascript
/// Promise.resolve(args).then(p => require(p))
/// // for literial dynamic import:
/// Promise.resolve().then(() => require(args))
/// ```
pub(crate) fn cjs_dynamic_import(
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
        // TODO: handle import assert
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

/// require('url').pathToFileURL(__`filename).toString()`
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

/// ```javascript
/// function foo() {
///   const data = expr;
///
///   foo = () => data;
///
///   return data;
/// }
/// ```
#[must_use]
pub fn lazy_require(expr: Expr, mod_ident: Ident, var_kind: VarDeclKind) -> FnDecl {
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
