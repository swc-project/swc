use swc_atoms::js_word;
use swc_common::{collections::AHashSet, util::take::Take, FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper, helper_expr};
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, ExprFactory, FunctionFactory, IsDirective,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    module_decl_strip::{Export, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip},
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        clone_first_use_strict, define_es_module, emit_export_stmts, local_name_for_src, use_strict,
    },
};

pub fn common_js(
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Default,
        unresolved_mark,
        available_features,
        support_arrow: caniuse!(available_features.ArrowFunctions),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        exports: None,
    })
}

pub fn common_js_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Real { base, resolver },
        unresolved_mark,
        available_features,
        support_arrow: caniuse!(available_features.ArrowFunctions),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },

        exports: None,
    })
}

pub struct Cjs {
    config: Config,
    resolver: Resolver,
    unresolved_mark: Mark,
    available_features: FeatureFlag,
    support_arrow: bool,
    const_var_kind: VarDeclKind,

    exports: Option<Ident>,
}

impl VisitMut for Cjs {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut strip = ModuleDeclStrip::default();
        n.visit_mut_with(&mut strip);

        let mut stmts: Vec<ModuleItem> = Vec::with_capacity(n.len() + 4);

        // "use strict";
        if self.config.strict_mode {
            stmts.push(clone_first_use_strict(n).unwrap_or_else(use_strict).into());
        }

        let ModuleDeclStrip {
            link,
            export,
            export_assign,
            ..
        } = strip;

        let is_export_assign = export_assign.is_some();

        if !self.config.no_interop && !is_export_assign {
            stmts.push(define_es_module(self.exports()).into())
        }

        let mut import_map = Default::default();
        let mut lazy_record = Default::default();

        // `import` -> `require`
        // `export` -> `_export(exports, {});`
        stmts.extend(
            self.handle_import_export(
                &mut import_map,
                &mut lazy_record,
                link,
                export,
                is_export_assign,
            )
            .map(Into::into),
        );

        stmts.extend(n.take().into_iter().filter(|item| match item {
            ModuleItem::Stmt(stmt) => !stmt.is_use_strict(),
            _ => false,
        }));

        // `export = expr;` -> `module.exports = expr;`
        if let Some(export_assign) = export_assign {
            stmts.push(
                export_assign
                    .make_assign_to(
                        op!("="),
                        member_expr!(DUMMY_SP.apply_mark(self.unresolved_mark), module.exports)
                            .into(),
                    )
                    .into_stmt()
                    .into(),
            )
        }

        if !self.config.ignore_dynamic || !self.config.preserve_import_meta {
            stmts.visit_mut_children_with(self);
        }

        stmts.visit_mut_children_with(&mut ModuleRefRewriter {
            import_map,
            lazy_record,
            top_level: true,
        });

        *n = stmts;
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

                let require_span = import_span.apply_mark(self.unresolved_mark);
                *n = cjs_dynamic_import(
                    *span,
                    args.take(),
                    quote_ident!(require_span, "require"),
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

                let require = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "require");
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
        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export
            .into_iter()
            .map(|((key, span), ident)| (key, span, ident.into()))
            .collect();

        link.into_iter().for_each(
            |(src, LinkItem(src_span, link_specifier_set, mut link_flag))| {
                // Optimize for `@swc/helpers`:
                // it there is no named import/export
                // instead generate
                // ```
                // var foo = require("@swc/helpers/foo");
                // (0, foo.default)(bar);
                // ```
                // we prefer
                // ```
                // var foo = require("@swc/helpers/foo").default;
                // foo(bar);
                // ```

                let is_swc_detault_helper =
                    !link_flag.has_named() && src.starts_with("@swc/helpers/");

                if self.config.no_interop || is_swc_detault_helper {
                    link_flag -= LinkFlag::NAMESPACE;
                }

                let mod_ident = private_ident!(local_name_for_src(&src));
                let raw_mod_ident = link_flag
                    .need_raw_import()
                    .then(|| private_ident!(local_name_for_src(&src)));

                let mut decl_mod_ident = false;

                link_specifier_set.reduce(
                    import_map,
                    &mut export_obj_prop_list,
                    &mod_ident,
                    &raw_mod_ident,
                    &mut decl_mod_ident,
                    is_swc_detault_helper,
                );

                let is_lazy =
                    decl_mod_ident && !link_flag.export_star() && self.config.lazy.is_lazy(&src);

                if is_lazy {
                    lazy_record.insert(mod_ident.to_id());
                    if let Some(raw_mod_ident) = &raw_mod_ident {
                        lazy_record.insert(raw_mod_ident.to_id());
                    }
                }

                // require("mod");
                let import_expr =
                    self.resolver
                        .make_require_call(self.unresolved_mark, src, src_span);

                let import_expr = if is_swc_detault_helper {
                    import_expr.make_member(quote_ident!("default"))
                } else {
                    import_expr
                };

                let import_assign = raw_mod_ident.map(|raw_mod_ident| {
                    let import_expr = import_expr.clone();
                    if is_lazy {
                        Stmt::Decl(Decl::Fn(lazy_require(
                            import_expr,
                            raw_mod_ident,
                            self.const_var_kind,
                        )))
                    } else {
                        Stmt::Decl(Decl::Var(
                            import_expr.into_var_decl(self.const_var_kind, raw_mod_ident.into()),
                        ))
                    }
                });

                // _exportStar(require("mod"), exports);
                let import_expr = if link_flag.export_star() {
                    helper_expr!(export_star, "exportStar").as_call(
                        DUMMY_SP,
                        vec![import_expr.as_arg(), self.exports().as_arg()],
                    )
                } else {
                    import_expr
                };

                // _introp(require("mod"));
                let import_expr = if !link_flag.interop() {
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

                if decl_mod_ident {
                    let stmt = if is_lazy {
                        Stmt::Decl(Decl::Fn(lazy_require(
                            import_expr,
                            mod_ident,
                            self.const_var_kind,
                        )))
                    } else {
                        Stmt::Decl(
                            import_expr
                                .into_var_decl(self.const_var_kind, mod_ident.into())
                                .into(),
                        )
                    };

                    if let Some(import_assign) = import_assign {
                        stmts.push(import_assign);
                    }

                    stmts.push(stmt);
                } else {
                    stmts.push(import_expr.into_stmt());
                }
            },
        );

        let mut export_stmts = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            let features = self.available_features;
            let exports = self.exports();

            export_stmts = emit_export_stmts(features, exports, export_obj_prop_list);
        }

        export_stmts.into_iter().chain(stmts)
    }

    fn exports(&mut self) -> Ident {
        self.exports
            .get_or_insert_with(|| {
                quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "exports")
            })
            .clone()
    }
}

/// Promise.resolve(args).then(p => require(p))
pub(crate) fn cjs_dynamic_import(
    span: Span,
    args: Vec<ExprOrSpread>,
    require: Ident,
    es_module_interop: bool,
    support_arrow: bool,
) -> Expr {
    let then = member_expr!(DUMMY_SP, Promise.resolve)
        // TODO: handle import assert
        .as_call(DUMMY_SP, args)
        .make_member(quote_ident!("then"));

    let path = private_ident!("p");

    let import_expr = {
        let require = require.as_call(DUMMY_SP, vec![path.clone().as_arg()]);

        if es_module_interop {
            helper_expr!(interop_require_wildcard, "interopRequireWildcard")
                .as_call(DUMMY_SP, vec![require.as_arg()])
        } else {
            require
        }
    };

    then.as_call(
        span,
        vec![import_expr
            .into_lazy_auto(vec![path.into()], support_arrow)
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
            vec![quote_ident!(DUMMY_SP.apply_mark(unresolved_mark), "__filename").as_arg()],
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
    let data_stmt = Stmt::Decl(Decl::Var(data_decl));
    let overwrite_stmt = data
        .clone()
        .into_lazy_fn(Default::default())
        .into_fn_expr(None)
        .make_assign_to(op!("="), mod_ident.clone().as_pat_or_expr())
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
            }),
            is_generator: false,
            is_async: false,
            type_params: None,
            return_type: None,
        },
    }
}
