use swc_atoms::js_word;
use swc_common::{collections::AHashSet, util::take::Take, FileName, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{feature::FeatureSet, helper};
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, ExprFactory, FunctionFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub use super::util::Config;
use crate::{
    module_decl_strip::{
        Export, ExportObjPropList, Link, LinkFlag, LinkItem, LinkSpecifierReducer, ModuleDeclStrip,
    },
    module_ref_rewriter::{ImportMap, ModuleRefRewriter},
    path::{ImportResolver, Resolver},
    util::{
        define_es_module, esm_export, esm_export_one, has_use_strict, local_name_for_src,
        prop_arrow, prop_function, prop_method, use_strict,
    },
};

pub fn common_js(
    unresolved_mark: Mark,
    config: Config,
    _target: EsVersion,
    available_features: FeatureSet,
) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Default,
        unresolved_mark,

        support_arrow: caniuse!(available_features.ArrowFunctions),
        support_shorthand: caniuse!(available_features.ShorthandProperties),

        exports: None,
    })
}

pub fn common_js_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
    _target: EsVersion,
    available_features: FeatureSet,
) -> impl Fold + VisitMut {
    as_folder(Cjs {
        config,
        resolver: Resolver::Real { base, resolver },
        unresolved_mark,

        support_arrow: caniuse!(available_features.ArrowFunctions),
        support_shorthand: caniuse!(available_features.ShorthandProperties),

        exports: None,
    })
}

pub struct Cjs {
    config: Config,
    resolver: Resolver,
    unresolved_mark: Mark,
    support_arrow: bool,
    support_shorthand: bool,

    exports: Option<Ident>,
}

impl VisitMut for Cjs {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let mut strip = ModuleDeclStrip::default();
        n.visit_mut_with(&mut strip);

        let mut stmts: Vec<ModuleItem> = Vec::with_capacity(n.len() + 4);

        // "use strict";
        if self.config.strict_mode && !has_use_strict(n) {
            stmts.push(use_strict().into());
        }

        let ModuleDeclStrip {
            link,
            export,
            export_assign,
            ..
        } = strip;

        let mut import_map = Default::default();
        let mut lazy_record = Default::default();

        // `import` -> `require`
        // `export` -> `_export(exports, {});`
        stmts.extend(
            self.handle_import_export(&mut import_map, &mut lazy_record, link, export)
                .map(Into::into),
        );

        stmts.extend(n.take());

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
                    decl_mod_ident && !link_flag.re_export() && self.config.lazy.is_lazy(&src);

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
                        Stmt::Decl(Decl::Fn(lazy_require(import_expr, raw_mod_ident)))
                    } else {
                        Stmt::Decl(Decl::Var(
                            import_expr.into_var_decl(VarDeclKind::Var, raw_mod_ident.into()),
                        ))
                    }
                });

                // _reExport(exports, require("mod"));
                let import_expr = if link_flag.re_export() {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(re_export, "reExport"),
                        args: vec![self.exports().as_arg(), import_expr.as_arg()],
                        type_args: Default::default(),
                    }
                    .into()
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
                        Stmt::Decl(Decl::Fn(lazy_require(import_expr, mod_ident)))
                    } else {
                        Stmt::Decl(
                            import_expr
                                .into_var_decl(VarDeclKind::Var, mod_ident.into())
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

        let export_stmts = self.export_stmts(export_obj_prop_list);

        self.exports
            .clone()
            .map(define_es_module)
            .into_iter()
            .chain(export_stmts)
            .chain(stmts)
    }

    fn exports(&mut self) -> Ident {
        self.exports.clone().unwrap_or_else(|| {
            let new_ident = quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "exports");
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
                    esm_export_one(
                        self.exports().as_arg(),
                        quote_str!(span, prop_name).as_arg(),
                        prop_auto((js_word!("get"), DUMMY_SP, expr)),
                    )
                    .into_stmt()
                })
                .into_iter()
                .collect(),
            _ => {
                prop_list.sort_by(|a, b| a.0.cmp(&b.0));
                let props = prop_list.into_iter().map(prop_auto).collect();
                let obj_lit = ObjectLit {
                    span: DUMMY_SP,
                    props,
                };

                let esm_export_ident = private_ident!("__export");

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
            CallExpr {
                span: DUMMY_SP,
                callee: helper!(interop_require_wildcard, "interopRequireWildcard"),
                args: vec![require.as_arg()],
                type_args: None,
            }
            .into()
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
pub fn lazy_require(expr: Expr, mod_ident: Ident) -> FnDecl {
    let data = private_ident!("data");
    let data_decl = expr.into_var_decl(VarDeclKind::Var, data.clone().into());
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
