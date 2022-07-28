use swc_atoms::js_word;
use swc_common::{
    collections::AHashSet, comments::Comments, util::take::Take, FileName, Mark, Span, Spanned,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureFlag, helper_expr};
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, top_level_this::rewrite_top_level_this, undefined,
    ExprFactory, FunctionFactory, IsDirective,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    module_decl_strip::{Export, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip},
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        clone_first_use_strict, define_es_module, emit_export_stmts, local_name_for_src, prop_name,
        use_strict, ImportInterop, ObjPropKeyIdent,
    },
};

pub fn common_js<C>(
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    as_folder(Cjs {
        config,
        resolver: Resolver::Default,
        unresolved_mark,
        available_features,
        comments,
        support_arrow: caniuse!(available_features.ArrowFunctions),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },
    })
}

pub fn common_js_with_resolver<C>(
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
    as_folder(Cjs {
        config,
        resolver: Resolver::Real { base, resolver },
        unresolved_mark,
        available_features,
        comments,
        support_arrow: caniuse!(available_features.ArrowFunctions),
        const_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Const
        } else {
            VarDeclKind::Var
        },
    })
}

pub struct Cjs<C>
where
    C: Comments,
{
    config: Config,
    resolver: Resolver,
    unresolved_mark: Mark,
    available_features: FeatureFlag,
    comments: Option<C>,
    support_arrow: bool,
    const_var_kind: VarDeclKind,
}

impl<C> VisitMut for Cjs<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        if !self.config.allow_top_level_this {
            rewrite_top_level_this(n, *undefined(DUMMY_SP));
        }

        let import_interop = self.config.import_interop();

        let mut module_map = Default::default();

        let mut has_ts_import_equals = false;

        // handle `import foo = require("mod")`
        n.iter_mut().for_each(|item| {
            if let ModuleItem::ModuleDecl(module_decl) = item {
                *item = self.handle_ts_import_equals(
                    module_decl.take(),
                    &mut module_map,
                    &mut has_ts_import_equals,
                );
            }
        });

        let mut strip = ModuleDeclStrip::new(self.const_var_kind);
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
            import_map: module_map,
            lazy_record,
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

                let require_span = import_span.apply_mark(self.unresolved_mark);

                *n = cjs_dynamic_import(
                    *span,
                    self.pure_span(),
                    args.take(),
                    quote_ident!(require_span, "require"),
                    self.config.import_interop(),
                    self.support_arrow,
                    is_lit_path,
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

impl<C> Cjs<C>
where
    C: Comments,
{
    fn handle_import_export(
        &mut self,
        import_map: &mut ImportMap,
        lazy_record: &mut AHashSet<Id>,
        link: Link,
        export: Export,
        is_export_assign: bool,
    ) -> impl Iterator<Item = Stmt> {
        let import_interop = self.config.import_interop();

        let mut stmts = Vec::with_capacity(link.len());

        let mut export_obj_prop_list = export.into_iter().map(Into::into).collect();

        link.into_iter().for_each(
            |(src, LinkItem(src_span, link_specifier_set, mut link_flag))| {
                // Optimize for `@swc/helpers`:
                // if there is no named import/export
                // avoid to generate
                // ```
                // var foo = require("@swc/helpers/foo");
                // (0, foo.default)(bar);
                // ```
                // instead, we prefer
                // ```
                // var foo = require("@swc/helpers/foo").default;
                // foo(bar);
                // ```

                let is_swc_default_helper =
                    !link_flag.has_named() && src.starts_with("@swc/helpers/");

                let is_node_default = !link_flag.has_named() && import_interop.is_node();

                if import_interop.is_none() || is_swc_default_helper {
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
                    is_swc_default_helper || is_node_default,
                );

                let is_lazy =
                    decl_mod_ident && !link_flag.export_star() && self.config.lazy.is_lazy(&src);

                if is_lazy {
                    lazy_record.insert(mod_ident.to_id());
                }

                // require("mod");
                let import_expr =
                    self.resolver
                        .make_require_call(self.unresolved_mark, src, src_span);

                let import_expr = if is_swc_default_helper {
                    import_expr.make_member(quote_ident!("default"))
                } else {
                    import_expr
                };

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
                let import_expr = {
                    match import_interop {
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

                    stmts.push(stmt);
                } else {
                    stmts.push(import_expr.into_stmt());
                }
            },
        );

        let mut export_stmts: Vec<Stmt> = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            export_obj_prop_list.sort_by_key(|prop| prop.span());

            if import_interop.is_node() {
                export_stmts = self.emit_lexer_exports_init(&export_obj_prop_list);
            }

            let features = self.available_features;
            let exports = self.exports();

            export_stmts.extend(emit_export_stmts(features, exports, export_obj_prop_list));
        }

        export_stmts.into_iter().chain(stmts)
    }

    fn handle_ts_import_equals(
        &self,
        module_decl: ModuleDecl,
        module_map: &mut ImportMap,
        has_ts_import_equals: &mut bool,
    ) -> ModuleItem {
        if let ModuleDecl::TsImportEquals(TsImportEqualsDecl {
            span,
            declare: false,
            is_export,
            is_type_only: false,
            id,
            module_ref:
                TsModuleRef::TsExternalModuleRef(TsExternalModuleRef {
                    expr:
                        Str {
                            span: src_span,
                            value: src,
                            ..
                        },
                    ..
                }),
        }) = module_decl
        {
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
                    left: id.as_pat_or_expr(),
                    right: Box::new(require),
                };

                assign_expr.into_stmt()
            } else {
                // const foo = require("mod")
                let mut var_decl = require.into_var_decl(self.const_var_kind, id.into());
                var_decl.span = span;

                Stmt::Decl(var_decl.into())
            }
            .into()
        } else {
            module_decl.into()
        }
    }

    fn exports(&self) -> Ident {
        quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "exports")
    }

    /// emit [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer) friendly exports list
    /// ```javascript
    /// exports.foo = exports.bar = void 0;
    /// ```
    fn emit_lexer_exports_init(&mut self, export_id_list: &[ObjPropKeyIdent]) -> Vec<Stmt> {
        export_id_list
            .chunks(100)
            .map(|group| {
                let mut expr = *undefined(DUMMY_SP);

                for key_value in group {
                    let prop = prop_name(key_value.key(), DUMMY_SP).into();

                    let export_binding = MemberExpr {
                        obj: Box::new(self.exports().into()),
                        span: key_value.span(),
                        prop,
                    };

                    expr = expr.make_assign_to(op!("="), export_binding.as_pat_or_expr());
                }

                expr.into_stmt()
            })
            .collect()
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
}

/// ```javascript
/// Promise.resolve(args).then(p => require(p))
/// // for literial dynamic import:
/// Promise.resolve().then(() => require(args))
/// ```
pub(crate) fn cjs_dynamic_import(
    span: Span,
    pure_span: Span,
    args: Vec<ExprOrSpread>,
    require: Ident,
    import_interop: ImportInterop,
    support_arrow: bool,
    is_lit_path: bool,
) -> Expr {
    let p = private_ident!("p");

    let (resolve_args, callback_params, require_args) = if is_lit_path {
        (vec![], vec![], args)
    } else {
        (args, vec![p.clone().into()], vec![p.as_arg()])
    };

    let then = member_expr!(DUMMY_SP, Promise.resolve)
        // TODO: handle import assert
        .as_call(DUMMY_SP, resolve_args)
        .make_member(quote_ident!("then"));

    let import_expr = {
        let require = require.as_call(DUMMY_SP, require_args);

        match import_interop {
            ImportInterop::None => require,
            ImportInterop::Swc => helper_expr!(interop_require_wildcard, "interopRequireWildcard")
                .as_call(pure_span, vec![require.as_arg()]),
            ImportInterop::Node => helper_expr!(interop_require_wildcard, "interopRequireWildcard")
                .as_call(pure_span, vec![require.as_arg(), true.as_arg()]),
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
