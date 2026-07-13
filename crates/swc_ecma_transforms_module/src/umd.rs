use rustc_hash::FxHashSet;
use swc_atoms::Atom;
use swc_common::{source_map::PURE_SP, sync::Lrc, util::take::Take, Mark, SourceMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper_expr;
use swc_ecma_utils::{private_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut};

use self::config::BuiltConfig;
pub use self::config::Config;
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

mod config;
mod emit;

#[derive(Default)]
pub struct FeatureFlag {
    pub support_block_scoping: bool,
}

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

        const_var_kind: if available_features.support_block_scoping {
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

    dep_list: Vec<(Ident, Atom, SpanCtx)>,

    exports: Option<Ident>,
}

impl VisitMut for Umd {
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, module: &mut Module) {
        let module_items = &mut module.body;

        if !self.config.config.allow_top_level_this {
            top_level_this(module_items, *Expr::undefined(DUMMY_SP));
        }

        let SyntaxStrippedModule {
            directives,
            has_use_strict,
            requested_modules,
            local_export_entries,
            export_assign,
            body,
            has_module_syntax,
        } = syntax_strip::lower(
            SourceModule::collect(module_items.take()),
            self.const_var_kind,
        );

        let mut stmts: Vec<Stmt> = Vec::with_capacity(body.len() + 4);
        stmts.extend(directives);

        // "use strict";
        if self.config.config.strict_mode && !has_use_strict {
            stmts.push(use_strict());
        }

        let import_interop = self.config.config.import_interop();

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

        rewrite_import_bindings(&mut stmts, import_map, Default::default());

        *module_items = emit::emit(
            stmts,
            emit::EmitModule {
                span: module.span,
                is_export_assign,
                exports: self.exports.clone(),
                deps: self.dep_list.take(),
            },
            &self.cm,
            &self.config,
            self.unresolved_mark,
            &self.resolver,
        );
    }
}

impl Umd {
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        requested_modules: RequestedModules,
        local_export_entries: LocalExportEntries,
        ts_import_equals_exports: &FxHashSet<Atom>,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.config.import_interop();

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

    fn exports(&mut self) -> Ident {
        self.exports
            .get_or_insert_with(|| private_ident!("exports"))
            .clone()
    }
}
