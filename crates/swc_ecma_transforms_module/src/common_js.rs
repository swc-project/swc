use swc_common::{
    collections::AHashSet, source_map::PURE_SP, util::take::Take, Mark, Span, SyntaxContext,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    member_expr, private_ident, quote_expr, quote_ident, ExprFactory, FunctionFactory, IsDirective,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub use super::util::Config;
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
};

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
        available_features,
        support_arrow: caniuse!(available_features.ArrowFunctions),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
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
    available_features: FeatureFlag,
    support_arrow: bool,
    const_var_kind: VarDeclKind,
}

impl VisitMut for Cjs {
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, n: &mut Module) {
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

        // `import` -> `require`
        // `export` -> `_export(exports, {});`
        stmts.extend(
            self.handle_import_export(
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
            )
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

                            *value = self.resolver.resolve(value.clone());
                            *raw = None;
                        }
                    }
                });

                let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.unresolved_mark);

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
                if prop.is_ident_with("url")
                    && !self.config.preserve_import_meta
                    && obj
                        .as_meta_prop()
                        .map(|p| p.kind == MetaPropKind::ImportMeta)
                        .unwrap_or_default() =>
            {
                obj.visit_mut_with(self);

                let require = quote_ident!(
                    SyntaxContext::empty().apply_mark(self.unresolved_mark),
                    "require"
                );
                *n = cjs_import_meta_url(*span, require, self.unresolved_mark);
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}

impl Cjs {
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        lazy_record: &mut AHashSet<Id>,
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

                // require("mod");
                let import_expr =
                    self.resolver
                        .make_require_call(self.unresolved_mark, src, src_span.0);

                // _export_star(require("mod"), exports);
                let import_expr = if link_flag.export_star() {
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

            let mut features = self.available_features;
            let exports = self.exports();

            if export_interop_annotation {
                if export_obj_prop_list.len() > 1 {
                    export_stmts.extend(self.emit_lexer_exports_init(&export_obj_prop_list));
                } else {
                    // `cjs-module-lexer` does not support `get: ()=> foo`
                    // see https://github.com/nodejs/cjs-module-lexer/pull/74
                    features -= FeatureFlag::ArrowFunctions;
                }
            }

            export_stmts.extend(emit_export_stmts(exports, export_obj_prop_list));
        }

        export_stmts.extend(lexer_reexport);

        export_stmts.into_iter().chain(stmts)
    }

    fn handle_ts_import_equals(
        &self,
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

                let require = self
                    .resolver
                    .make_require_call(self.unresolved_mark, src, src_span);

                if is_export {
                    // exports.foo = require("mod")
                    module_map.insert(id.to_id(), (self.exports(), Some(id.sym.clone())));

                    let assign_expr = AssignExpr {
                        span,
                        op: op!("="),
                        left: self.exports().make_member(id.into()).into(),
                        right: Box::new(require),
                    };

                    assign_expr.into_stmt()
                } else {
                    // const foo = require("mod")
                    let mut var_decl = require.into_var_decl(self.const_var_kind, id.into());
                    var_decl.span = span;

                    var_decl.into()
                }
                .into()
            }
            _ => module_decl.into(),
        }
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

/// require('url').pathToFileURL(__filename).toString()
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
