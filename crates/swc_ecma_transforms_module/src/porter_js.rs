use std::env;

use anyhow::Context;
use indexmap::IndexSet;
use serde::{Deserialize, Serialize};
use swc_atoms::js_word;
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

fn browser_default() -> bool {
    // default to true
    match env::var("BROWSER") {
        Ok(val) => val == "true",
        Err(_) => true,
    }
}

fn node_env_default() -> String {
    match env::var("NODE_ENV") {
        Ok(val) => val,
        Err(_) => "".to_string(),
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub module_id: Option<String>,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

pub fn porter_js<C>(
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
    comments: Option<C>,
) -> impl Fold + VisitMut
where
    C: Comments,
{
    let Config { module_id, config } = config;

    as_folder(PorterJs {
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
        browser: browser_default(),
        node_env: node_env_default(),
    })
}

pub fn porter_js_with_resolver<C>(
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

    as_folder(PorterJs {
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
        browser: browser_default(),
        node_env: node_env_default(),
    })
}

pub struct PorterJs<C>
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

    dep_list: IndexSet<String>,
    require: Ident,
    exports: Option<Ident>,
    module: Option<Ident>,
    found_import_meta: bool,
    browser: bool,
    node_env: String,
}

enum Envify {
    Str(String),
    Bool(bool),
    None,
}

impl<C> VisitMut for PorterJs<C>
where
    C: Comments,
{
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let import_interop = self.config.import_interop();

        let mut strip = ModuleDeclStrip::new(self.const_var_kind);
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
                .map(From::from),
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

        let mut elems = vec![];
        let mut params = vec![self.require.clone().into()];

        if let Some(exports) = self.exports.take() {
            params.push(exports.into())
        }

        if let Some(module) = self.module.clone() {
            params.push(module.into())
        }

        self.dep_list.drain(..).for_each(|src_path| {
            let src_path = match &self.resolver {
                Resolver::Real { resolver, base } => resolver
                    .resolve_import(base, &src_path)
                    .with_context(|| format!("failed to resolve `{}`", src_path))
                    .unwrap(),
                Resolver::Default => src_path.into(),
            };

            elems.push(Some(quote_str!(src_path).as_arg()));
        });

        let mut porter_js_call_args = Vec::with_capacity(3);
        if let Some(module_id) = &self.module_id {
            porter_js_call_args.push(quote_str!(module_id.clone()).as_arg());
        }
        porter_js_call_args.push(
            ArrayLit {
                span: DUMMY_SP,
                elems,
            }
            .as_arg(),
        );
        porter_js_call_args.push(
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
            quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "porter.define")
                .as_call(DUMMY_SP, porter_js_call_args)
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

                let mut require = self.require.clone();
                require.span = import_span.apply_mark(require.span.ctxt().outer());

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

                *n = porter_js_dynamic_import(
                    *span,
                    self.pure_span(),
                    args.take(),
                    require,
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

                *n = porter_js_import_meta_url(*span, self.module());
                self.found_import_meta = true;
            }
            Expr::Call(CallExpr {
                callee: Callee::Expr(expr),
                args,
                ..
            }) if matches!(
                **expr,
                Expr::Ident(Ident {
                    sym: js_word!("require"),
                    ..
                })
            ) =>
            {
                if let Some(ExprOrSpread { expr, .. }) = args.get(0) {
                    if let Expr::Lit(Lit::Str(src)) = &**expr {
                        self.dep_list.insert_full(src.value.to_string());
                    }
                }
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if &*n.sym == "exports" {
            self.exports();
        }
        if &*n.sym == "module" {
            self.module();
        }
    }

    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        let val = self.lazy_test(&n.test);
        if let Some(val) = val {
            if val {
                n.alt = None;
            } else {
                n.cons = Box::new(Stmt::Block(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![],
                }));
            }
        }
        n.visit_mut_children_with(self)
    }

    fn visit_mut_cond_expr(&mut self, n: &mut CondExpr) {
        let val = self.lazy_test(&n.test);
        if let Some(val) = val {
            if val {
                n.alt = Box::new(Expr::Ident(Ident {
                    sym: js_word!("undefined"),
                    span: DUMMY_SP,
                    optional: false,
                }));
            } else {
                n.cons = Box::new(Expr::Ident(Ident {
                    sym: js_word!("undefined"),
                    span: DUMMY_SP,
                    optional: false,
                }));
            }
        }
        n.visit_mut_children_with(self)
    }
}

impl<C> PorterJs<C>
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

        let mut export_obj_prop_list = export.into_iter().map(From::from).collect();

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

                let mod_ident = private_ident!(local_name_for_src(&src));

                let mut decl_mod_ident = false;

                self.dep_list.insert_full(src.to_string());

                link_specifier_set.reduce(
                    import_map,
                    &mut export_obj_prop_list,
                    &mod_ident,
                    &None,
                    &mut decl_mod_ident,
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
                let mut import_expr: Expr = if need_re_export {
                    helper_expr!(export_star, "exportStar").as_call(
                        DUMMY_SP,
                        vec![import_expr.as_arg(), self.exports().as_arg()],
                    )
                } else {
                    import_expr
                };

                // _introp(require("mod"));
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

                // var mod1 = _introp(mod);
                if decl_mod_ident {
                    let stmt: Stmt = import_expr
                        .into_var_decl(self.const_var_kind, mod_ident.into())
                        .into();
                    stmts.push(stmt)
                } else if need_interop {
                    let stmt = import_expr
                        .make_assign_to(op!("="), mod_ident.as_pat_or_expr())
                        .into_stmt();
                    stmts.push(stmt);
                } else {
                    stmts.push(import_expr.into_stmt());
                };
            },
        );

        let mut export_stmts = Default::default();

        if !export_obj_prop_list.is_empty() && !is_export_assign {
            export_obj_prop_list.sort_by_key(|prop| prop.span());

            let features = self.available_features;
            let exports = self.exports();

            export_stmts = emit_export_stmts(features, exports, export_obj_prop_list);
        }

        export_stmts.into_iter().chain(stmts)
    }

    fn module(&mut self) -> Ident {
        self.exports();
        self.module
            .get_or_insert_with(|| {
                quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "module")
            })
            .clone()
    }

    fn exports(&mut self) -> Ident {
        self.exports
            .get_or_insert_with(|| {
                quote_ident!(DUMMY_SP.apply_mark(self.unresolved_mark), "exports")
            })
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

    fn lazy_eval(&self, n: &Expr) -> Envify {
        match n {
            // true
            Expr::Lit(Lit::Bool(lit)) => Envify::Bool(lit.value),
            // "production"
            Expr::Lit(Lit::Str(lit)) => Envify::Str(lit.value.to_string()),
            // process.browser
            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(prop),
                ..
            }) if matches!(
                **obj,
                Expr::Ident(Ident {
                    sym: js_word!("process"),
                    ..
                })
            ) && &*prop.sym == "browser" =>
            {
                Envify::Bool(self.browser)
            }
            // process.env.NODE_ENV
            Expr::Member(MemberExpr {
                obj,
                prop:
                    MemberProp::Ident(Ident {
                        sym: js_word!("NODE_ENV"),
                        ..
                    }),
                ..
            }) => {
                if let Expr::Member(MemberExpr {
                    obj,
                    prop:
                        MemberProp::Ident(Ident {
                            sym: js_word!("env"),
                            ..
                        }),
                    ..
                }) = &**obj
                {
                    if let Expr::Ident(Ident {
                        sym: js_word!("process"),
                        ..
                    }) = **obj
                    {
                        Envify::Str(self.node_env.to_string())
                    } else {
                        Envify::None
                    }
                } else {
                    Envify::None
                }
            }
            // process.env.BROWSER
            Expr::Member(MemberExpr {
                obj,
                prop: MemberProp::Ident(prop),
                ..
            }) if &*prop.sym == "BROWSER" => {
                if let Expr::Member(MemberExpr {
                    prop:
                        MemberProp::Ident(Ident {
                            sym: js_word!("env"),
                            ..
                        }),
                    ..
                }) = &**obj
                {
                    if let Expr::Ident(Ident {
                        sym: js_word!("process"),
                        ..
                    }) = **obj
                    {
                        Envify::Bool(self.browser)
                    } else {
                        Envify::None
                    }
                } else {
                    Envify::None
                }
            }
            _ => Envify::None,
        }
    }

    fn lazy_test(&self, n: &Expr) -> Option<bool> {
        match n {
            Expr::Lit(Lit::Bool(lit)) => Some(lit.value),
            Expr::Member(..) => match self.lazy_eval(n) {
                Envify::Str(val) => Some(!val.is_empty()),
                Envify::Bool(val) => Some(val),
                Envify::None => None,
            },
            Expr::Bin(BinExpr {
                op: BinaryOp::EqEq,
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: BinaryOp::EqEqEq,
                left,
                right,
                ..
            }) => {
                let left_val = self.lazy_eval(left);
                let right_val = self.lazy_eval(right);
                match left_val {
                    Envify::Bool(left_val) => {
                        if let Envify::Bool(right_val) = right_val {
                            Some(left_val == right_val)
                        } else {
                            None
                        }
                    }
                    Envify::Str(left_val) => {
                        if let Envify::Str(right_val) = right_val {
                            Some(left_val == right_val)
                        } else {
                            None
                        }
                    }
                    _ => None,
                }
            }
            Expr::Bin(BinExpr {
                op: BinaryOp::NotEq,
                left,
                right,
                ..
            })
            | Expr::Bin(BinExpr {
                op: BinaryOp::NotEqEq,
                left,
                right,
                ..
            }) => {
                let left_val = self.lazy_eval(left);
                let right_val = self.lazy_eval(right);
                match left_val {
                    Envify::Bool(left_val) => {
                        if let Envify::Bool(right_val) = right_val {
                            Some(left_val != right_val)
                        } else {
                            None
                        }
                    }
                    Envify::Str(left_val) => {
                        if let Envify::Str(right_val) = right_val {
                            Some(left_val != right_val)
                        } else {
                            None
                        }
                    }
                    _ => None,
                }
            }
            _ => None,
        }
    }
}

/// ```javascript
/// Promise.resolve(args).then(p => require(p))
/// // for literial dynamic import:
/// Promise.resolve().then(() => require(args))
/// ```
pub(crate) fn porter_js_dynamic_import(
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

/// new URL(require.meta.url, document.baseURI).href
fn porter_js_import_meta_url(span: Span, require: Ident) -> Expr {
    MemberExpr {
        span,
        obj: Box::new(Expr::New(quote_ident!("URL").into_new_expr(
            DUMMY_SP,
            Some(vec![
                    (require
                        .make_member(quote_ident!("meta"))
                        .make_member(quote_ident!("url")))
                    .as_arg(),
                    member_expr!(DUMMY_SP, document.baseURI).as_arg(),
                ]),
        ))),
        prop: quote_ident!("href").into(),
    }
    .into()
}
