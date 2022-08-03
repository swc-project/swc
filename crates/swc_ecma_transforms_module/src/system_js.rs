use ahash::AHashSet;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{util::take::Take, FileName, Mark, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::feature::FeatureFlag;
use swc_ecma_utils::{
    contains_top_level_await, find_pat_ids, private_ident, quote_ident, quote_str,
    top_level_this::rewrite_top_level_this, undefined, ExprFactory, IsDirective,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
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

#[derive(Debug, Clone)]
enum ExportItem {
    Named(Span),
    Alias(Span, JsWord),
}

impl Spanned for ExportItem {
    fn span(&self) -> Span {
        match self {
            Self::Named(span) | Self::Alias(span, ..) => *span,
        }
    }
}

enum ExportProp {
    Ident(Span, JsWord, Id),
    Expr(Span, JsWord, Box<Expr>),
}

impl ExportProp {
    fn from_export_item(local_id: Id, export_item: ExportItem) -> Self {
        match export_item {
            ExportItem::Named(span) => Self::Ident(span, local_id.0.clone(), local_id),
            ExportItem::Alias(export_span, export_name) => {
                Self::Ident(export_span, export_name, local_id)
            }
        }
    }

    fn from_export_item_with_init(local_id: Id, export_item: ExportItem, init: Box<Expr>) -> Self {
        match export_item {
            ExportItem::Named(span) => Self::Expr(span, local_id.0, init),
            ExportItem::Alias(export_span, export_name) => {
                Self::Expr(export_span, export_name, init)
            }
        }
    }

    fn into_prop(self, support_shorthand: bool) -> Prop {
        match self {
            ExportProp::Ident(export_span, export_name, local_id) => {
                if support_shorthand && export_name == local_id.0 {
                    Prop::Shorthand(quote_ident!(export_span, export_name))
                } else {
                    Prop::KeyValue(KeyValueProp {
                        key: prop_name(&export_name, export_span).into(),
                        value: Box::new(Ident::from(local_id).into()),
                    })
                }
            }
            ExportProp::Expr(export_span, export_name, expr) => Prop::KeyValue(KeyValueProp {
                key: prop_name(&export_name, export_span).into(),
                value: Box::new(*expr),
            }),
        }
    }
}

struct Feature {
    arrow: bool,
    shorthand: bool,
    let_var_kind: VarDeclKind,
}

impl Feature {
    fn new(feature_flag: FeatureFlag) -> Self {
        Self {
            arrow: caniuse!(feature_flag.ArrowFunctions),
            shorthand: caniuse!(feature_flag.ShorthandProperties),
            let_var_kind: if caniuse!(feature_flag.BlockScoping) {
                VarDeclKind::Let
            } else {
                VarDeclKind::Var
            },
        }
    }
}

#[allow(unused)]
struct SystemJs {
    unresolved_mark: Mark,
    resolver: Resolver,
    config: Config,
    feature: Feature,

    export: Ident,
    context: Ident,
    is_async: bool,
    is_global_this: bool,

    link: Link,
    /// local_id -> [ExportItem]
    export_map: IndexMap<Id, Vec<ExportItem>>,
    export_list: Vec<ExportProp>,
    decls: Vec<Ident>,
    hoist_fn_ids: AHashSet<Id>,
}

pub fn system_js(
    unresolved_mark: Mark,
    config: Config,
    feature_flag: FeatureFlag,
) -> impl Fold + VisitMut {
    as_folder(SystemJs {
        unresolved_mark,
        resolver: Resolver::Default,
        config,
        feature: Feature::new(feature_flag),

        export: private_ident!("_export"),
        context: private_ident!("_context"),
        is_async: false,
        is_global_this: true,

        link: Default::default(),
        export_map: Default::default(),
        export_list: Default::default(),
        decls: Default::default(),
        hoist_fn_ids: Default::default(),
    })
}

pub fn system_js_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    unresolved_mark: Mark,
    config: Config,
    feature_flag: FeatureFlag,
) -> impl Fold + VisitMut {
    as_folder(SystemJs {
        unresolved_mark,
        resolver: Resolver::Real { base, resolver },
        config,
        feature: Feature::new(feature_flag),

        export: private_ident!("_export"),
        context: private_ident!("_context"),
        is_async: false,
        is_global_this: true,

        link: Default::default(),
        export_map: Default::default(),
        export_list: Default::default(),
        decls: Default::default(),
        hoist_fn_ids: Default::default(),
    })
}

impl VisitMut for SystemJs {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        if !self.config.allow_top_level_this {
            rewrite_top_level_this(n, *undefined(DUMMY_SP));
        }

        n.visit_with(self);

        let mut before_body = vec![clone_first_use_strict(n).unwrap_or_else(use_strict)];

        let mut hoist = vec![];
        let mut execute = vec![];

        for mut stmt in n.drain(..) {
            let stmt_span = stmt.span();
            stmt.visit_mut_children_with(self);

            match stmt {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => {
                    self.reduce_decl(decl, stmt_span, &mut hoist, &mut execute)
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl,
                    ..
                })) => self.reduce_default_decl(decl, stmt_span, &mut hoist, &mut execute),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    expr,
                    ..
                })) => self.reduce_default_expr(expr, stmt_span, &mut execute),
                ModuleItem::Stmt(stmt) if !stmt.is_use_strict() => execute.push(stmt),
                _ => {}
            }
        }

        if !self.decls.is_empty() {
            self.decls.sort_by_key(Spanned::span);

            before_body.push(
                Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: self.feature.let_var_kind,
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

        for (local_id, list) in self.export_map.iter() {
            let is_hoist = self.hoist_fn_ids.contains(local_id);

            self.export_list.extend(list.iter().map(|e| {
                if is_hoist {
                    ExportProp::from_export_item(local_id.clone(), e.clone())
                } else {
                    ExportProp::from_export_item_with_init(
                        local_id.clone(),
                        e.clone(),
                        undefined(DUMMY_SP),
                    )
                }
            }));
        }

        if !self.export_list.is_empty() {
            let export_list = self.export_list.take();
            before_body.push(self.export_expr(export_list).into_stmt());
        }

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
            let execute = self.fn_expr(self.is_async, Default::default(), execute);

            KeyValueProp {
                key: quote_ident!("execute").into(),
                value: Box::new(execute),
            }
            .into()
        };

        let return_stmt = Expr::Object(ObjectLit {
            span: DUMMY_SP,
            props: vec![setters.into(), execute.into()],
        })
        .into_return_stmt();

        before_body.push(return_stmt.into());

        let fn_expr = self.fn_expr(
            false,
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

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::MetaProp(MetaPropExpr {
                span,
                kind: MetaPropKind::ImportMeta,
            }) => {
                *n = Expr::Member(MemberExpr {
                    obj: Box::new(self.context.clone().into()),
                    span: *span,
                    prop: MemberProp::Ident(quote_ident!("meta")),
                });
            }

            _ => n.visit_mut_children_with(self),
        };
    }
}

impl Visit for SystemJs {
    noop_visit_type!();

    fn visit_module_items(&mut self, n: &[ModuleItem]) {
        self.is_async = n.iter().any(contains_top_level_await);

        n.visit_children_with(self);
    }

    fn visit_module_item(&mut self, n: &ModuleItem) {
        if n.is_module_decl() {
            n.visit_children_with(self);
        }
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        if n.type_only {
            return;
        }

        n.visit_children_with(self);

        let ImportDecl {
            specifiers, src, ..
        } = n.clone();

        self.link
            .entry(src.value)
            .or_default()
            .mut_dummy_span(n.src.span)
            .extend(specifiers.into_iter().map(Into::into));
    }

    fn visit_import_specifier(&mut self, n: &ImportSpecifier) {
        match n {
            ImportSpecifier::Named(ImportNamedSpecifier { local, .. })
            | ImportSpecifier::Default(ImportDefaultSpecifier { local, .. })
            | ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                self.decls.push(local.clone());
            }
        }
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        if let Decl::Fn(FnDecl {
            ident,
            declare: false,
            ..
        }) = &n.decl
        {
            self.hoist_fn_ids.insert(ident.to_id());
        }

        match &n.decl {
            Decl::Class(ClassDecl {
                ident,
                declare: false,
                ..
            })
            | Decl::Fn(FnDecl {
                ident,
                declare: false,
                ..
            }) => {
                self.export_map
                    .entry(ident.to_id())
                    .or_default()
                    .push(ExportItem::Named(ident.span));
            }

            Decl::Var(VarDecl {
                decls,
                declare: false,
                ..
            }) => {
                find_pat_ids::<_, Ident>(decls)
                    .into_iter()
                    .for_each(|ident| {
                        let id = ident.to_id();

                        self.export_map
                            .entry(id)
                            .or_default()
                            .push(ExportItem::Named(ident.span));
                    });
            }
            _ => {}
        };
    }

    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl) {
        if let DefaultDecl::Fn(FnExpr {
            ident: Some(ident), ..
        }) = &n.decl
        {
            self.hoist_fn_ids.insert(ident.to_id());
        }

        match &n.decl {
            DefaultDecl::Class(ClassExpr {
                ident: Some(ident), ..
            })
            | DefaultDecl::Fn(FnExpr {
                ident: Some(ident), ..
            }) => self
                .export_map
                .entry(ident.to_id())
                .or_default()
                .push(ExportItem::Alias(n.span, "default".into())),

            _ => (),
        };
    }

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
                    let (local, local_span) = match orig {
                        ModuleExportName::Ident(ref id) => (id.to_id(), id.span),
                        ModuleExportName::Str(_) => {
                            unreachable!(r#"`export {{ "foo" }}` without src is invalid"#)
                        }
                    };

                    if let Some(exported) = exported {
                        let (span, export_name) = match exported {
                            ModuleExportName::Ident(Ident {
                                span,
                                sym: export_name,
                                ..
                            })
                            | ModuleExportName::Str(Str {
                                span,
                                value: export_name,
                                ..
                            }) => (span, export_name),
                        };

                        self.export_map
                            .entry(local)
                            .or_default()
                            .push(ExportItem::Alias(span, export_name));
                    } else {
                        self.export_map
                            .entry(local)
                            .or_default()
                            .push(ExportItem::Named(local_span));
                    }
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

    fn fn_expr(&self, is_async: bool, params: Vec<Pat>, stmts: Vec<Stmt>) -> Expr {
        if self.feature.arrow {
            ArrowExpr {
                span: DUMMY_SP,
                params,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                }
                .into(),
                is_async,
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
                        is_async,
                        type_params: None,
                        return_type: None,
                    },
                }
                .into()
            }
        }
    }

    fn export_expr(&self, mut prop_list: Vec<ExportProp>) -> Box<Expr> {
        match prop_list.len() {
            0 => unreachable!(),
            // _export("foo", foo);
            // _export("foo", foo = expr);
            1 => match prop_list.pop().unwrap() {
                ExportProp::Ident(_, export_name, id) => Box::new(self.export.clone().as_call(
                    DUMMY_SP,
                    vec![quote_str!(export_name).as_arg(), id.as_arg()],
                )),
                ExportProp::Expr(_, export_name, expr) => Box::new(self.export.clone().as_call(
                    DUMMY_SP,
                    vec![quote_str!(export_name).as_arg(), expr.as_arg()],
                )),
            },
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
                            .map(|export_prop| export_prop.into_prop(self.feature.shorthand))
                            .map(Box::new)
                            .map(PropOrSpread::Prop)
                            .collect(),
                    }
                    .as_arg()],
            )),
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

                let mut expr: Expr = AssignExpr {
                    span: stmt_span,
                    op: op!("="),
                    left: Pat::Ident(ident.clone().into()).into(),
                    right: Box::new(
                        ClassExpr {
                            ident: Some(ident.clone()),
                            class,
                        }
                        .into(),
                    ),
                }
                .into();

                if let Some(list) = self.export_map.get(&ident.to_id()) {
                    let mut props = Vec::<ExportProp>::default();

                    let mut iter = list.iter();
                    if let Some(export_item) = iter.next() {
                        props.push(ExportProp::from_export_item_with_init(
                            ident.to_id(),
                            export_item.clone(),
                            Box::new(expr),
                        ));
                    }

                    for export_item in iter {
                        props.push(ExportProp::from_export_item(
                            ident.to_id(),
                            export_item.clone(),
                        ));
                    }

                    expr = *self.export_expr(props);
                }

                execute.push(expr.into_stmt());
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
                let mut props = Vec::<ExportProp>::default();

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
                                if let Some(export_item) = iter.next() {
                                    props.push(ExportProp::from_export_item_with_init(
                                        id.to_id(),
                                        export_item.clone(),
                                        Box::new(expr.into()),
                                    ));
                                }

                                for export_item in iter {
                                    props.push(ExportProp::from_export_item(
                                        id.to_id(),
                                        export_item.clone(),
                                    ));
                                }
                            }
                        } else {
                            if !props.is_empty() {
                                exprs.push(self.export_expr(props.take()))
                            }

                            exprs.push(Box::new(expr.into()));

                            for id in find_pat_ids::<_, Ident>(&name) {
                                if let Some(list) = self.export_map.get(&id.to_id()) {
                                    for export_item in list {
                                        props.push(ExportProp::from_export_item(
                                            id.to_id(),
                                            export_item.clone(),
                                        ));
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

    fn reduce_default_decl(
        &mut self,
        decl: DefaultDecl,
        stmt_span: Span,
        hoist: &mut Vec<Stmt>,
        execute: &mut Vec<Stmt>,
    ) {
        match decl {
            DefaultDecl::Class(ClassExpr { ident, class }) => {
                if let Some(ident) = ident {
                    self.reduce_decl(
                        Decl::Class(ClassDecl {
                            ident,
                            declare: false,
                            class,
                        }),
                        stmt_span,
                        hoist,
                        execute,
                    );
                } else {
                    self.export_list.push(ExportProp::Expr(
                        stmt_span,
                        "default".into(),
                        undefined(DUMMY_SP),
                    ));

                    execute.push(
                        self.export
                            .clone()
                            .as_call(
                                DUMMY_SP,
                                vec![
                                    quote_str!("default").as_arg(),
                                    ClassExpr { ident, class }.as_arg(),
                                ],
                            )
                            .into_stmt(),
                    )
                }
            }
            DefaultDecl::Fn(FnExpr { ident, function }) => {
                if let Some(ident) = ident {
                    self.reduce_decl(
                        Decl::Fn(FnDecl {
                            ident,
                            function,
                            declare: false,
                        }),
                        stmt_span,
                        hoist,
                        execute,
                    );
                } else {
                    self.export_list.push(ExportProp::Expr(
                        stmt_span,
                        "default".into(),
                        Box::new(FnExpr { ident, function }.into()),
                    ));
                }
            }
            DefaultDecl::TsInterfaceDecl(..) => {}
        }
    }

    fn reduce_default_expr(&mut self, expr: Box<Expr>, stmt_span: Span, execute: &mut Vec<Stmt>) {
        self.export_list.push(ExportProp::Expr(
            stmt_span,
            "default".into(),
            undefined(DUMMY_SP),
        ));

        execute.push(Stmt::Expr(ExprStmt {
            span: stmt_span,
            expr: Box::new(self.export.clone().as_call(
                DUMMY_SP,
                vec![quote_str!("default").as_arg(), expr.as_arg()],
            )),
        }))
    }
}
