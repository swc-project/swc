use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{util::take::Take, FileName, Mark, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::feature::FeatureFlag;
use swc_ecma_utils::{
    find_pat_ids, private_ident, quote_ident, quote_str, ExprFactory, IsDirective,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitWith,
};

use crate::{
    module_decl_strip::Link,
    path::{ImportResolver, Resolver},
    util::{clone_first_use_strict, prop_name, use_strict},
};
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub allow_top_level_this: bool,
    #[serde(default)]
    pub system_global: Option<JsWord>,
}

type ExportList = Vec<(JsWord, Span)>;

#[allow(unused)]
struct SystemJs {
    unresolved_mark: Mark,
    resolver: Resolver,
    config: Config,
    available_features: FeatureFlag,

    support_arrow: bool,
    let_var_kind: VarDeclKind,

    export: Ident,
    context: Ident,

    link: Link,
    /// diffreent from [crate::module_decl_strip::Export]
    /// map local id to export name
    export_map: IndexMap<Id, ExportList>,
    decls: Vec<Ident>,
    // fn_decls: AHashSet<Id>,
}

pub fn system_js(
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Fold + VisitMut {
    as_folder(SystemJs {
        unresolved_mark,
        resolver: Resolver::Default,
        config,
        available_features,

        support_arrow: caniuse!(available_features.ArrowFunctions),
        let_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Let
        } else {
            VarDeclKind::Var
        },

        export: private_ident!("_export"),
        context: private_ident!("_context"),

        link: Default::default(),
        export_map: Default::default(),
        decls: Default::default(),
        // fn_decls: Default::default(),
    })
}

pub fn system_js_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
    available_features: FeatureFlag,
) -> impl Fold + VisitMut {
    as_folder(SystemJs {
        unresolved_mark,
        resolver: Resolver::Real { base, resolver },
        config,
        available_features,

        support_arrow: caniuse!(available_features.ArrowFunctions),
        let_var_kind: if caniuse!(available_features.BlockScoping) {
            VarDeclKind::Let
        } else {
            VarDeclKind::Var
        },

        export: private_ident!("_export"),
        context: private_ident!("_context"),

        link: Default::default(),
        export_map: Default::default(),
        decls: Default::default(),
        // fn_decls: Default::default(),
    })
}

impl VisitMut for SystemJs {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_with(self);

        let mut before_body = vec![clone_first_use_strict(n).unwrap_or_else(use_strict)];

        let mut hoist = vec![];
        let mut execute = vec![];

        for stmt in n.drain(..) {
            let stmt_span = stmt.span();

            match stmt {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => {
                    self.reduce_decl(decl, stmt_span, &mut hoist, &mut execute)
                }
                ModuleItem::Stmt(stmt) if !stmt.is_use_strict() => execute.push(stmt),
                _ => {}
            }
        }

        if !self.decls.is_empty() {
            before_body.push(
                Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: self.let_var_kind,
                    declare: false,
                    decls: self
                        .decls
                        .take()
                        .into_iter()
                        .map(Into::into)
                        .map(Pat::Ident)
                        .map(|name| VarDeclarator {
                            span: DUMMY_SP,
                            name,
                            init: None,
                            definite: false,
                        })
                        .collect(),
                })
                .into(),
            );
        }

        before_body.extend(hoist);

        let setters = vec![];

        let setters: Prop = {
            let setters = ArrayLit {
                span: DUMMY_SP,
                elems: setters,
            };

            KeyValueProp {
                key: quote_ident!("setters").into(),
                value: Box::new(setters.into()),
            }
            .into()
        };

        let execute: Prop = {
            let execute = self.fn_expr(Default::default(), execute);

            KeyValueProp {
                key: quote_ident!("execute").into(),
                value: Box::new(execute),
            }
            .into()
        };

        let return_stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![setters.into(), execute.into()],
            }))),
        };

        before_body.push(return_stmt.into());

        let fn_expr = self.fn_expr(
            vec![self.export.clone().into(), self.context.clone().into()],
            before_body,
        );

        let system = self.system();

        let deps = ArrayLit {
            span: DUMMY_SP,
            elems: self
                .link
                .iter()
                .map(|(k, v)| Some(quote_str!(v.0, k).as_arg()))
                .collect(),
        };

        *n = vec![system
            .make_member(quote_ident!("register"))
            .as_call(DUMMY_SP, vec![deps.as_arg(), fn_expr.as_arg()])
            .into_stmt()
            .into()]
    }
}

impl Visit for SystemJs {
    noop_visit_type!();

    fn visit_module_item(&mut self, n: &ModuleItem) {
        if n.is_module_decl() {
            n.visit_children_with(self);
        }
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        if n.type_only {
            return;
        }

        let ImportDecl {
            specifiers, src, ..
        } = n.clone();

        self.link
            .entry(src.value)
            .or_default()
            .mut_dummy_span(n.src.span)
            .extend(specifiers.into_iter().map(Into::into));
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        match &n.decl {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                self.export_map
                    .entry(ident.to_id())
                    .or_default()
                    .push((ident.sym.clone(), ident.span));
            }

            Decl::Var(v) => {
                find_pat_ids::<_, Ident>(&v.decls)
                    .into_iter()
                    .for_each(|ident| {
                        let id = ident.to_id();
                        let Ident { sym, span, .. } = ident;

                        self.export_map.entry(id).or_default().push((sym, span));
                    });
            }
            _ => {}
        };
    }

    fn visit_export_default_decl(&mut self, _n: &ExportDefaultDecl) {}

    fn visit_named_export(&mut self, n: &NamedExport) {
        if n.type_only {
            return;
        }

        let NamedExport {
            specifiers, src, ..
        } = n.clone();

        if let Some(src) = src {
            self.link
                .entry(src.value)
                .or_default()
                .mut_dummy_span(src.span)
                .extend(specifiers.into_iter().map(Into::into));
        } else {
            specifiers.into_iter().for_each(|s| match s {
                ExportSpecifier::Namespace(..) => {
                    unreachable!("`export *` without src is invalid")
                }
                ExportSpecifier::Default(..) => {
                    unreachable!("`export foo` without src is invalid")
                }
                ExportSpecifier::Named(ExportNamedSpecifier { orig, exported, .. }) => {
                    let local = match orig {
                        ModuleExportName::Ident(ref id) => id.to_id(),
                        ModuleExportName::Str(_) => {
                            unreachable!(r#"`export {{ "foo" }}` without src is invalid"#)
                        }
                    };

                    let (value, span) = match exported.unwrap_or(orig) {
                        ModuleExportName::Ident(Ident { span, sym, .. }) => (sym, span),
                        ModuleExportName::Str(Str { span, value, .. }) => (value, span),
                    };

                    self.export_map
                        .entry(local)
                        .or_default()
                        .push((value, span));
                }
            });
        }
    }
}

impl SystemJs {
    fn system(&self) -> Ident {
        let span = DUMMY_SP.apply_mark(self.unresolved_mark);
        self.config.system_global.as_ref().map_or_else(
            || quote_ident!(span, "System"),
            |system| quote_ident!(span, system),
        )
    }

    fn fn_expr(&self, params: Vec<Pat>, stmts: Vec<Stmt>) -> Expr {
        if self.support_arrow {
            ArrowExpr {
                span: DUMMY_SP,
                params,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                }
                .into(),
                is_async: false,
                is_generator: false,
                type_params: None,
                return_type: None,
            }
            .into()
        } else {
            {
                FnExpr {
                    ident: None,
                    function: Function {
                        params: params.into_iter().map(Into::into).collect(),
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
                    },
                }
                .into()
            }
        }
    }

    fn reduce_decl(
        &mut self,
        decl: Decl,
        stmt_span: Span,
        hoist: &mut Vec<Stmt>,
        execute: &mut Vec<Stmt>,
    ) {
        match decl {
            Decl::Class(ClassDecl {
                ident,
                declare,
                class,
            }) => {
                if declare {
                    return;
                }

                self.decls.push(ident.clone());

                let stmt = AssignExpr {
                    span: stmt_span,
                    op: op!("="),
                    left: Pat::Ident(ident.clone().into()).into(),
                    right: Box::new(
                        ClassExpr {
                            ident: Some(ident),
                            class,
                        }
                        .into(),
                    ),
                }
                .into_stmt();

                execute.push(stmt);
            }
            Decl::Fn(FnDecl { declare, .. }) => {
                if declare {
                    return;
                }

                // self.decls.push(ident.clone());
                // self.fn_decls.insert(ident.to_id());

                hoist.push(decl.into());
            }
            Decl::Var(VarDecl { declare, decls, .. }) => {
                if declare {
                    return;
                }

                self.decls.extend(find_pat_ids(&decls));

                let mut exprs = Vec::<Box<Expr>>::default();
                let mut props = Vec::<(&JsWord, Span, Expr)>::default();

                for VarDeclarator {
                    span,
                    name,
                    init,
                    definite,
                } in decls
                {
                    if definite {
                        continue;
                    }

                    if let Some(init) = init {
                        let expr = AssignExpr {
                            span,
                            op: op!("="),
                            left: name.clone().into(),
                            right: init,
                        };

                        // let_chains
                        if let Pat::Ident(BindingIdent { id, .. }) = name {
                            if let Some(list) = self.export_map.get(&id.to_id()) {
                                let mut iter = list.iter();
                                if let Some((export_name, export_span)) = iter.next() {
                                    props.push((export_name, *export_span, expr.into()));
                                }

                                for (export_name, export_span) in iter {
                                    props.push((export_name, *export_span, id.clone().into()));
                                }
                            }
                        } else {
                            if !props.is_empty() {
                                exprs.push(self.export_expr(props.take()))
                            }

                            exprs.push(Box::new(expr.into()));

                            for id in find_pat_ids::<_, Ident>(&name) {
                                if let Some(list) = self.export_map.get(&id.to_id()) {
                                    for (export_name, export_span) in list {
                                        props.push((export_name, *export_span, id.clone().into()));
                                    }
                                }
                            }
                        }
                    }
                }

                if !props.is_empty() {
                    exprs.push(self.export_expr(props.take()))
                }

                match exprs.len() {
                    0 => {}
                    1 => {
                        let expr = exprs.pop().unwrap();
                        execute.push(Stmt::Expr(ExprStmt {
                            span: stmt_span,
                            expr,
                        }))
                    }
                    _ => execute.push(Stmt::Expr(ExprStmt {
                        span: stmt_span,
                        expr: Box::new(
                            SeqExpr {
                                span: DUMMY_SP,
                                exprs,
                            }
                            .into(),
                        ),
                    })),
                }
            }
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {}
        }
    }

    fn export_expr(&self, mut prop_list: Vec<(&JsWord, Span, Expr)>) -> Box<Expr> {
        match prop_list.len() {
            0 => unreachable!(),
            // _export("foo", foo = expr);
            1 => {
                let (export_name, export_span, expr) = prop_list.pop().unwrap();
                Box::new(self.export.clone().as_call(
                    DUMMY_SP,
                    vec![quote_str!(export_span, export_name).as_arg(), expr.as_arg()],
                ))
            }
            // _export({
            //     foo: foo = expr,
            //     bar: foo,
            //     baz: baz,
            // })
            _ => Box::new(self.export.clone().as_call(
                DUMMY_SP,
                vec![ObjectLit {
                                span: DUMMY_SP,
                                props: prop_list
                                    .into_iter()
                                    .map(|(export_name, export_span, expr)| KeyValueProp {
                                        key: prop_name(export_name, export_span).into(),
                                        value: Box::new(expr),
                                    })
                                    .map(Prop::KeyValue)
                                    .map(Box::new)
                                    .map(PropOrSpread::Prop)
                                    .collect(),
                            }
                            .as_arg()],
            )),
        }
    }
}
