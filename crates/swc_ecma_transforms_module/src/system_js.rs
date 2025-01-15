use anyhow::Context;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, Mark, Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    member_expr, private_ident, quote_ident, quote_str, var::VarCollector, ExprFactory,
};
use swc_ecma_visit::{fold_pass, standard_only_fold, Fold, FoldWith, VisitWith};

pub use super::util::Config as InnerConfig;
use crate::{
    path::Resolver,
    top_level_this::top_level_this,
    util::{local_name_for_src, use_strict},
};
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub allow_top_level_this: bool,

    #[serde(flatten, default)]
    pub config: InnerConfig,
}

struct SystemJs {
    unresolved_mark: Mark,
    resolver: Resolver,
    config: Config,

    declare_var_idents: Vec<Ident>,
    export_map: AHashMap<Id, Vec<JsWord>>,
    export_names: Vec<JsWord>,
    export_values: Vec<Box<Expr>>,
    tla: bool,
    enter_async_fn: u32,
    root_fn_decl_idents: Vec<Ident>,
    module_item_meta_list: Vec<ModuleItemMeta>,
    import_idents: Vec<Id>,
    export_ident: Ident,
    context_ident: Ident,
}

pub fn system_js(resolver: Resolver, unresolved_mark: Mark, config: Config) -> impl Pass {
    fold_pass(SystemJs {
        unresolved_mark,
        resolver,
        config,
        declare_var_idents: Vec::new(),
        export_map: Default::default(),
        export_names: Vec::new(),
        export_values: Vec::new(),
        tla: false,
        enter_async_fn: 0,
        root_fn_decl_idents: Vec::new(),
        module_item_meta_list: Vec::new(),
        import_idents: Vec::new(),
        export_ident: private_ident!("_export"),
        context_ident: private_ident!("_context"),
    })
}

struct ModuleItemMeta {
    export_names: Vec<JsWord>,
    export_values: Vec<Box<Expr>>,
    has_export_all: bool,
    src: JsWord,
    setter_fn_stmts: Vec<Stmt>,
}

impl SystemJs {
    fn export_call(&self, name: JsWord, span: Span, expr: Expr) -> CallExpr {
        CallExpr {
            span,
            callee: self.export_ident.clone().as_callee(),
            args: vec![quote_str!(name).as_arg(), expr.as_arg()],
            ..Default::default()
        }
    }

    fn fold_module_name_ident(&mut self, ident: Ident) -> Expr {
        if &*ident.sym == "__moduleName" && ident.ctxt.outer() == self.unresolved_mark {
            return self
                .context_ident
                .clone()
                .make_member(quote_ident!("id"))
                .into();
        }
        ident.into()
    }

    fn replace_assign_expr(&mut self, assign_expr: AssignExpr) -> Expr {
        match &assign_expr.left {
            AssignTarget::Simple(pat_or_expr) => match pat_or_expr {
                SimpleAssignTarget::Ident(ident) => {
                    for (k, v) in self.export_map.iter() {
                        if ident.to_id() == *k {
                            let mut expr = assign_expr.into();
                            for value in v.iter() {
                                expr = self.export_call(value.clone(), DUMMY_SP, expr).into();
                            }
                            return expr;
                        }
                    }
                    assign_expr.into()
                }
                _ => assign_expr.into(),
            },
            AssignTarget::Pat(pat) => {
                let mut to: Vec<Id> = Vec::new();
                pat.visit_with(&mut VarCollector { to: &mut to });

                match pat {
                    AssignTargetPat::Object(..) | AssignTargetPat::Array(..) => {
                        let mut exprs = vec![Box::new(Expr::Assign(assign_expr))];

                        for to in to {
                            for (k, v) in self.export_map.iter() {
                                if to == *k {
                                    for _ in v.iter() {
                                        exprs.push(
                                            self.export_call(
                                                to.0.clone(),
                                                DUMMY_SP,
                                                Ident::new(to.0.clone(), DUMMY_SP, to.1).into(),
                                            )
                                            .into(),
                                        );
                                    }
                                    break;
                                }
                            }
                        }
                        SeqExpr {
                            span: DUMMY_SP,
                            exprs,
                        }
                        .into()
                    }
                    _ => assign_expr.into(),
                }
            }
        }
    }

    fn replace_update_expr(&mut self, update_expr: UpdateExpr) -> Expr {
        if !update_expr.prefix {
            match &*update_expr.arg {
                Expr::Ident(ident) => {
                    for (k, v) in self.export_map.iter() {
                        if ident.to_id() == *k {
                            let mut expr = BinExpr {
                                span: DUMMY_SP,
                                op: op!(bin, "+"),
                                left: UnaryExpr {
                                    span: DUMMY_SP,
                                    op: op!(unary, "+"),
                                    arg: Box::new(Expr::Ident(ident.clone())),
                                }
                                .into(),
                                right: 1.0.into(),
                            }
                            .into();
                            for value in v.iter() {
                                expr = self.export_call(value.clone(), DUMMY_SP, expr).into();
                            }
                            return SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![Box::new(expr), Box::new(Expr::Update(update_expr))],
                            }
                            .into();
                        }
                    }
                    update_expr.into()
                }
                _ => update_expr.into(),
            }
        } else {
            update_expr.into()
        }
    }

    fn add_export_name(&mut self, key: Id, value: JsWord) {
        let mut find = false;
        for (k, v) in self.export_map.iter_mut() {
            if key == *k {
                v.push(value.clone());
                find = true;
                break;
            }
        }
        if !find {
            self.export_map.insert(key, vec![value]);
        }
    }

    fn add_declare_var_idents(&mut self, ident: &Ident) {
        self.declare_var_idents.push(ident.clone());
    }

    fn build_export_call(
        &mut self,
        export_names: &mut Vec<JsWord>,
        export_values: &mut Vec<Box<Expr>>,
    ) -> Vec<Stmt> {
        match export_names.len() {
            0 => Vec::new(),
            1 => vec![self
                .export_call(export_names.remove(0), DUMMY_SP, *export_values.remove(0))
                .into_stmt()],
            _ => {
                let mut props = Vec::new();
                for (sym, value) in export_names.drain(..).zip(export_values.drain(..)) {
                    props.push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                        key: match Ident::verify_symbol(&sym) {
                            Ok(..) => PropName::Ident(quote_ident!(sym)),
                            Err(..) => PropName::Str(quote_str!(sym)),
                        },
                        value,
                    }))));
                }
                vec![CallExpr {
                    span: DUMMY_SP,
                    callee: self.export_ident.clone().as_callee(),
                    args: vec![ObjectLit {
                        span: DUMMY_SP,
                        props,
                    }
                    .as_arg()],
                    ..Default::default()
                }
                .into_stmt()]
            }
        }
    }

    fn build_module_item_export_all(&mut self, mut meta: ModuleItemMeta) -> Vec<Stmt> {
        if !meta.has_export_all {
            meta.setter_fn_stmts.append(
                &mut self.build_export_call(&mut meta.export_names, &mut meta.export_values),
            );
        } else {
            let export_obj = quote_ident!("exportObj");
            let key_ident = quote_ident!("key");
            let target = quote_ident!(local_name_for_src(&meta.src));
            meta.setter_fn_stmts.push(
                VarDecl {
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: export_obj.clone().into(),
                        init: Some(Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: Vec::new(),
                        }))),
                        definite: false,
                    }],
                    ..Default::default()
                }
                .into(),
            );
            meta.setter_fn_stmts.push(
                ForInStmt {
                    span: DUMMY_SP,
                    left: VarDecl {
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: key_ident.clone().into(),
                            init: None,
                            definite: false,
                        }],
                        ..Default::default()
                    }
                    .into(),
                    right: target.clone().into(),

                    body: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::If(IfStmt {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(BinExpr {
                                span: DUMMY_SP,
                                op: op!("&&"),
                                left: Box::new(
                                    key_ident
                                        .clone()
                                        .make_bin(op!("!=="), quote_str!("default")),
                                ),
                                right: Box::new(
                                    key_ident
                                        .clone()
                                        .make_bin(op!("!=="), quote_str!("__esModule")),
                                ),
                            })),
                            cons: Box::new(Stmt::Block(BlockStmt {
                                stmts: vec![AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: export_obj
                                        .clone()
                                        .computed_member(key_ident.clone())
                                        .into(),
                                    right: target.computed_member(key_ident).into(),
                                }
                                .into_stmt()],
                                ..Default::default()
                            })),
                            alt: None,
                        })],

                        ..Default::default()
                    })),
                }
                .into(),
            );
            for (sym, value) in meta
                .export_names
                .drain(..)
                .zip(meta.export_values.drain(..))
            {
                meta.setter_fn_stmts.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: export_obj.clone().make_member(quote_ident!(sym)).into(),
                        right: value,
                    }
                    .into_stmt(),
                );
            }
            meta.setter_fn_stmts.push(
                CallExpr {
                    span: DUMMY_SP,
                    callee: self.export_ident.clone().as_callee(),
                    args: vec![export_obj.as_arg()],
                    ..Default::default()
                }
                .into_stmt(),
            );
        }

        meta.setter_fn_stmts
    }

    fn add_module_item_meta(&mut self, mut m: ModuleItemMeta) {
        match self
            .module_item_meta_list
            .iter()
            .position(|i| m.src.eq(&i.src))
        {
            Some(index) => {
                let mut meta = self.module_item_meta_list.remove(index);
                meta.setter_fn_stmts.append(&mut m.setter_fn_stmts);
                meta.export_names.append(&mut m.export_names);
                meta.export_values.append(&mut m.export_values);
                if m.has_export_all {
                    meta.has_export_all = m.has_export_all;
                }
                self.module_item_meta_list.insert(index, meta);
            }
            None => {
                self.module_item_meta_list.push(m);
            }
        }
    }

    #[allow(clippy::boxed_local)]
    fn hoist_var_decl(&mut self, var_decl: Box<VarDecl>) -> Option<Expr> {
        let mut exprs = Vec::new();
        for var_declarator in var_decl.decls {
            let mut tos: Vec<Id> = Vec::new();
            var_declarator.visit_with(&mut VarCollector { to: &mut tos });

            for (sym, ctxt) in tos {
                if var_declarator.init.is_none() {
                    for (k, v) in self.export_map.iter_mut() {
                        if (sym.clone(), ctxt) == *k {
                            for value in v.iter() {
                                self.export_names.push(value.clone());
                                self.export_values.push(Expr::undefined(DUMMY_SP));
                            }
                            break;
                        }
                    }
                }
                self.declare_var_idents
                    .push(Ident::new(sym, DUMMY_SP, ctxt));
            }

            if let Some(init) = var_declarator.init {
                exprs.push(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: var_declarator.name.try_into().unwrap(),
                        right: init,
                    }
                    .into(),
                );
            }
        }
        match exprs.len() {
            0 => None,
            _ => Some(
                SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into(),
            ),
        }
    }

    fn hoist_for_var_decl(&mut self, var_decl_or_pat: ForHead) -> ForHead {
        if let ForHead::VarDecl(mut var_decl) = var_decl_or_pat {
            if var_decl.kind == VarDeclKind::Var {
                let var_declarator = var_decl.decls.remove(0);
                let mut tos: Vec<Id> = Vec::new();
                var_declarator.visit_with(&mut VarCollector { to: &mut tos });

                for to in tos {
                    if var_declarator.init.is_none() {
                        for (k, v) in self.export_map.iter_mut() {
                            if to == *k {
                                for value in v.iter() {
                                    self.export_names.push(value.clone());
                                    self.export_values.push(Expr::undefined(DUMMY_SP));
                                }
                                break;
                            }
                        }
                    }
                    self.declare_var_idents
                        .push(Ident::new(to.0, DUMMY_SP, to.1));
                }

                ForHead::Pat(var_declarator.name.into())
            } else {
                ForHead::VarDecl(var_decl)
            }
        } else {
            var_decl_or_pat
        }
    }

    fn hoist_variables(&mut self, stmt: Stmt) -> Stmt {
        match stmt {
            Stmt::Decl(decl) => {
                if let Decl::Var(var_decl) = decl {
                    // if var_decl.kind == VarDeclKind::Var {
                    if let Some(expr) = self.hoist_var_decl(var_decl) {
                        expr.into_stmt()
                    } else {
                        EmptyStmt { span: DUMMY_SP }.into()
                    }
                    // } else {
                    //     return Stmt::Decl(Decl::Var(var_decl));
                    // }
                } else {
                    decl.into()
                }
            }
            Stmt::For(for_stmt) => {
                if let Some(init) = for_stmt.init {
                    if let VarDeclOrExpr::VarDecl(var_decl) = init {
                        if var_decl.kind == VarDeclKind::Var {
                            ForStmt {
                                init: self
                                    .hoist_var_decl(var_decl)
                                    .map(|expr| VarDeclOrExpr::Expr(Box::new(expr))),
                                ..for_stmt
                            }
                            .into()
                        } else {
                            ForStmt {
                                init: Some(VarDeclOrExpr::VarDecl(var_decl)),
                                ..for_stmt
                            }
                            .into()
                        }
                    } else {
                        ForStmt {
                            init: Some(init),
                            ..for_stmt
                        }
                        .into()
                    }
                } else {
                    for_stmt.into()
                }
            }
            Stmt::ForIn(for_in_stmt) => ForInStmt {
                left: self.hoist_for_var_decl(for_in_stmt.left),
                ..for_in_stmt
            }
            .into(),
            Stmt::ForOf(for_of_stmt) => ForOfStmt {
                left: self.hoist_for_var_decl(for_of_stmt.left),
                ..for_of_stmt
            }
            .into(),
            _ => stmt,
        }
    }
}

impl Fold for SystemJs {
    standard_only_fold!();

    fn fold_call_expr(&mut self, expr: CallExpr) -> CallExpr {
        let expr = expr.fold_children_with(self);

        match expr.callee {
            Callee::Import(_) => CallExpr {
                callee: self
                    .context_ident
                    .clone()
                    .make_member(quote_ident!("import"))
                    .as_callee(),
                ..expr
            },
            _ => expr,
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Ident(ident) => self.fold_module_name_ident(ident),
            Expr::Assign(assign) => {
                let assign_expr = AssignExpr {
                    right: match *assign.right {
                        Expr::Ident(ident) => Box::new(self.fold_module_name_ident(ident)),
                        Expr::Assign(AssignExpr {
                            op: AssignOp::Assign,
                            ..
                        }) => {
                            return self.replace_assign_expr(AssignExpr {
                                right: assign.right,
                                ..assign
                            });
                        }
                        _ => assign.right,
                    },
                    ..assign
                }
                .fold_with(self);
                self.replace_assign_expr(assign_expr)
            }
            Expr::Update(update) => self.replace_update_expr(update),
            Expr::Call(call) => match call.callee {
                Callee::Import(_) => CallExpr {
                    args: call.args.fold_with(self),
                    callee: self
                        .context_ident
                        .clone()
                        .make_member(quote_ident!("import"))
                        .as_callee(),
                    ..call
                }
                .into(),
                _ => call.into(),
            },
            Expr::MetaProp(meta_prop_expr) => match meta_prop_expr.kind {
                MetaPropKind::ImportMeta => self
                    .context_ident
                    .clone()
                    .make_member(quote_ident!("meta"))
                    .into(),
                _ => meta_prop_expr.into(),
            },
            Expr::Await(await_expr) => {
                if self.enter_async_fn == 0 {
                    self.tla = true;
                }

                await_expr.into()
            }
            _ => expr,
        }
    }

    fn fold_fn_decl(&mut self, fn_decl: FnDecl) -> FnDecl {
        let is_async = fn_decl.function.is_async;
        if is_async {
            self.enter_async_fn += 1;
        }
        let fold_fn_expr = fn_decl.fold_children_with(self);
        if is_async {
            self.enter_async_fn -= 1;
        }
        fold_fn_expr
    }

    fn fold_prop(&mut self, prop: Prop) -> Prop {
        let prop = prop.fold_children_with(self);

        match prop {
            Prop::Shorthand(shorthand) => Prop::KeyValue(KeyValueProp {
                key: PropName::Ident(shorthand.clone().into()),
                value: Box::new(self.fold_module_name_ident(shorthand)),
            }),
            Prop::KeyValue(key_value_prop) => Prop::KeyValue(KeyValueProp {
                key: key_value_prop.key,
                value: match *key_value_prop.value {
                    Expr::Ident(ident) => Box::new(self.fold_module_name_ident(ident)),
                    _ => key_value_prop.value,
                },
            }),
            _ => prop,
        }
    }

    fn fold_module(&mut self, module: Module) -> Module {
        let module = {
            let mut module = module;
            if !self.config.allow_top_level_this {
                top_level_this(&mut module, *Expr::undefined(DUMMY_SP));
            }
            module
        };
        let mut before_body_stmts: Vec<Stmt> = Vec::new();
        let mut execute_stmts = Vec::new();

        // collect top level fn decl
        for item in &module.body {
            if let ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) = item {
                self.root_fn_decl_idents.push(fn_decl.ident.clone());
            }
        }

        for item in module.body {
            match item {
                ModuleItem::ModuleDecl(decl) => match decl {
                    ModuleDecl::Import(import) => {
                        let src = match &self.resolver {
                            Resolver::Real { resolver, base } => resolver
                                .resolve_import(base, &import.src.value)
                                .with_context(|| {
                                    format!("failed to resolve import `{}`", import.src.value)
                                })
                                .unwrap(),
                            Resolver::Default => import.src.value,
                        };

                        let source_alias = local_name_for_src(&src);

                        let mut setter_fn_stmts = Vec::new();

                        for specifier in import.specifiers {
                            match specifier {
                                ImportSpecifier::Default(specifier) => {
                                    self.import_idents.push(specifier.local.to_id());
                                    self.add_declare_var_idents(&specifier.local);
                                    setter_fn_stmts.push(
                                        AssignExpr {
                                            span: specifier.span,
                                            op: op!("="),
                                            left: specifier.local.into(),
                                            right: quote_ident!(source_alias.clone())
                                                .make_member(quote_ident!("default"))
                                                .into(),
                                        }
                                        .into_stmt(),
                                    );
                                }
                                ImportSpecifier::Named(specifier) => {
                                    self.add_declare_var_idents(&specifier.local);
                                    setter_fn_stmts.push(
                                        AssignExpr {
                                            span: specifier.span,
                                            op: op!("="),
                                            left: specifier.local.clone().into(),
                                            right: MemberExpr {
                                                span: DUMMY_SP,
                                                obj: Box::new(
                                                    quote_ident!(source_alias.clone()).into(),
                                                ),
                                                prop: match specifier.imported {
                                                    Some(m) => get_module_export_member_prop(&m),
                                                    None => {
                                                        MemberProp::Ident(specifier.local.into())
                                                    }
                                                },
                                            }
                                            .into(),
                                        }
                                        .into_stmt(),
                                    );
                                }
                                ImportSpecifier::Namespace(specifier) => {
                                    self.import_idents.push(specifier.local.to_id());
                                    self.add_declare_var_idents(&specifier.local);
                                    setter_fn_stmts.push(
                                        AssignExpr {
                                            span: specifier.span,
                                            op: op!("="),
                                            left: specifier.local.into(),
                                            right: quote_ident!(source_alias.clone()).into(),
                                        }
                                        .into_stmt(),
                                    );
                                }
                            }
                        }

                        self.add_module_item_meta(ModuleItemMeta {
                            export_names: Vec::new(),
                            export_values: Vec::new(),
                            has_export_all: false,
                            src: src.clone(),
                            setter_fn_stmts,
                        });
                    }
                    ModuleDecl::ExportNamed(decl) => match decl.src {
                        Some(s) => {
                            let src = match &self.resolver {
                                Resolver::Real { resolver, base } => resolver
                                    .resolve_import(base, &s.value)
                                    .with_context(|| {
                                        format!("failed to resolve import `{}`", s.value)
                                    })
                                    .unwrap(),
                                Resolver::Default => s.value,
                            };
                            for specifier in decl.specifiers {
                                let source_alias = local_name_for_src(&src);
                                let mut export_names = Vec::new();
                                let mut export_values = Vec::new();

                                match specifier {
                                    ExportSpecifier::Named(specifier) => {
                                        export_names.push(match &specifier.exported {
                                            Some(m) => get_module_export_name(m).0,
                                            None => get_module_export_name(&specifier.orig).0,
                                        });
                                        export_values.push(
                                            MemberExpr {
                                                span: DUMMY_SP,
                                                obj: Box::new(
                                                    quote_ident!(source_alias.clone()).into(),
                                                ),
                                                prop: get_module_export_member_prop(
                                                    &specifier.orig,
                                                ),
                                            }
                                            .into(),
                                        );
                                    }
                                    ExportSpecifier::Default(specifier) => {
                                        export_names.push(specifier.exported.sym.clone());
                                        export_values.push(
                                            quote_ident!(source_alias.clone())
                                                .make_member(quote_ident!("default"))
                                                .into(),
                                        );
                                    }
                                    ExportSpecifier::Namespace(specifier) => {
                                        export_names
                                            .push(get_module_export_name(&specifier.name).0);
                                        export_values
                                            .push(quote_ident!(source_alias.clone()).into());
                                    }
                                }

                                self.add_module_item_meta(ModuleItemMeta {
                                    export_names,
                                    export_values,
                                    has_export_all: false,
                                    src: src.clone(),
                                    setter_fn_stmts: Vec::new(),
                                });
                            }
                        }
                        None => {
                            for specifier in decl.specifiers {
                                if let ExportSpecifier::Named(specifier) = specifier {
                                    let id = get_module_export_name(&specifier.orig);

                                    if self.root_fn_decl_idents.iter().any(|i| i.sym == id.0) {
                                        // hoisted function export
                                        self.export_names.push(match &specifier.exported {
                                            Some(m) => get_module_export_name(m).0,
                                            None => id.0.clone(),
                                        });
                                        self.export_values.push(Box::new(get_module_export_expr(
                                            &specifier.orig,
                                        )));
                                    }
                                    if self.import_idents.iter().any(|i| id == *i) {
                                        execute_stmts.push(
                                            self.export_call(
                                                id.0.clone(),
                                                DUMMY_SP,
                                                match &specifier.exported {
                                                    Some(m) => get_module_export_expr(m),
                                                    None => get_module_export_expr(&specifier.orig),
                                                },
                                            )
                                            .into_stmt(),
                                        );
                                    }
                                    self.add_export_name(
                                        id,
                                        match specifier.exported {
                                            Some(m) => get_module_export_name(&m).0,
                                            None => get_module_export_name(&specifier.orig).0,
                                        },
                                    );
                                }
                            }
                        }
                    },
                    ModuleDecl::ExportDecl(decl) => {
                        match decl.decl {
                            Decl::Class(class_decl) => {
                                let ident = class_decl.ident;
                                self.export_names.push(ident.sym.clone());
                                self.export_values.push(Expr::undefined(DUMMY_SP));
                                self.add_declare_var_idents(&ident);
                                self.add_export_name(ident.to_id(), ident.sym.clone());
                                execute_stmts.push(
                                    AssignExpr {
                                        span: DUMMY_SP,
                                        op: op!("="),
                                        left: ident.clone().into(),
                                        right: ClassExpr {
                                            ident: Some(ident.clone()),
                                            class: class_decl.class,
                                        }
                                        .into(),
                                    }
                                    .into_stmt(),
                                );
                            }
                            Decl::Fn(fn_decl) => {
                                self.export_names.push(fn_decl.ident.sym.clone());
                                self.export_values.push(fn_decl.ident.clone().into());
                                self.add_export_name(
                                    fn_decl.ident.to_id(),
                                    fn_decl.ident.sym.clone(),
                                );
                                before_body_stmts.push(fn_decl.into());
                            }
                            Decl::Var(var_decl) => {
                                let mut decl = VarDecl {
                                    decls: Vec::new(),
                                    ..*var_decl
                                };
                                for var_declarator in var_decl.decls {
                                    let mut tos: Vec<Id> = Vec::new();
                                    var_declarator.visit_with(&mut VarCollector { to: &mut tos });
                                    for to in tos {
                                        let ident = Ident::new(to.0.clone(), DUMMY_SP, to.1);
                                        self.add_export_name(to, ident.sym.clone());
                                    }
                                    decl.decls.push(var_declarator);
                                }
                                execute_stmts.push(decl.into());
                            }
                            _ => {}
                        };
                    }
                    ModuleDecl::ExportDefaultDecl(decl) => {
                        match decl.decl {
                            DefaultDecl::Class(class_expr) => {
                                if let Some(ident) = &class_expr.ident {
                                    self.export_names.push("default".into());
                                    self.export_values.push(Expr::undefined(DUMMY_SP));
                                    self.add_declare_var_idents(ident);
                                    self.add_export_name(ident.to_id(), "default".into());
                                    execute_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            op: op!("="),
                                            left: ident.clone().into(),
                                            right: class_expr.into(),
                                        }
                                        .into_stmt(),
                                    );
                                } else {
                                    self.export_names.push("default".into());
                                    self.export_values.push(class_expr.into());
                                }
                            }
                            DefaultDecl::Fn(fn_expr) => {
                                if let Some(ident) = &fn_expr.ident {
                                    self.export_names.push("default".into());
                                    self.export_values.push(ident.clone().into());
                                    self.add_export_name(ident.to_id(), "default".into());
                                    before_body_stmts.push(
                                        FnDecl {
                                            ident: ident.clone(),
                                            declare: false,
                                            function: fn_expr.function,
                                        }
                                        .into(),
                                    );
                                } else {
                                    self.export_names.push("default".into());
                                    self.export_values.push(fn_expr.into());
                                }
                            }
                            _ => {}
                        };
                    }
                    ModuleDecl::ExportDefaultExpr(expr) => {
                        execute_stmts.push(
                            self.export_call("default".into(), expr.span, *expr.expr)
                                .into_stmt(),
                        );
                    }
                    ModuleDecl::ExportAll(decl) => {
                        self.add_module_item_meta(ModuleItemMeta {
                            export_names: Vec::new(),
                            export_values: Vec::new(),
                            has_export_all: true,
                            src: decl.src.value,
                            setter_fn_stmts: Vec::new(),
                        });
                    }
                    _ => {}
                },
                ModuleItem::Stmt(stmt) => match stmt {
                    Stmt::Decl(decl) => match decl {
                        Decl::Class(class_decl) => {
                            self.add_declare_var_idents(&class_decl.ident);
                            execute_stmts.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: class_decl.ident.clone().into(),
                                    right: ClassExpr {
                                        ident: Some(class_decl.ident.clone()),
                                        class: class_decl.class,
                                    }
                                    .into(),
                                }
                                .into_stmt(),
                            );
                        }
                        Decl::Fn(fn_decl) => {
                            before_body_stmts.push(fn_decl.into());
                        }
                        _ => execute_stmts.push(decl.into()),
                    },
                    _ => execute_stmts.push(stmt),
                },
            }
        }

        // ====================
        //  fold_with function, here export_map is collected finished.
        // ====================

        before_body_stmts = before_body_stmts
            .into_iter()
            .map(|s| s.fold_with(self))
            .collect();

        execute_stmts = execute_stmts
            .into_iter()
            .map(|s| self.hoist_variables(s).fold_with(self))
            .filter(|s| !matches!(s, Stmt::Empty(_)))
            .collect();

        // ====================
        //  generate export call, here export_names is collected finished.
        // ====================
        if !self.export_names.is_empty() {
            let mut export_names = self.export_names.drain(..).collect();
            let mut export_values = self.export_values.drain(..).collect();
            before_body_stmts
                .append(&mut self.build_export_call(&mut export_names, &mut export_values));
        }

        let mut setters = ArrayLit {
            span: DUMMY_SP,
            elems: Vec::new(),
        };

        let mut dep_module_names = ArrayLit {
            span: DUMMY_SP,
            elems: Vec::new(),
        };

        let module_item_meta_list: Vec<ModuleItemMeta> =
            self.module_item_meta_list.drain(..).collect();
        for meta in module_item_meta_list {
            dep_module_names
                .elems
                .push(Some(quote_str!(meta.src.clone()).as_arg()));
            setters.elems.push(Some(
                Function {
                    params: vec![Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: quote_ident!(local_name_for_src(&meta.src)).into(),
                    }],
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: self.build_module_item_export_all(meta),
                        ..Default::default()
                    }),
                    is_generator: false,
                    is_async: false,
                    ..Default::default()
                }
                .as_arg(),
            ));
        }

        let execute = Box::new(Function {
            params: Vec::new(),
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                stmts: execute_stmts,
                ..Default::default()
            }),
            is_generator: false,
            is_async: self.tla,
            ..Default::default()
        });

        let return_stmt = ReturnStmt {
            span: DUMMY_SP,
            arg: Some(
                ObjectLit {
                    span: DUMMY_SP,
                    props: vec![
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("setters").into(),
                            value: Box::new(Expr::Array(setters)),
                        }))),
                        PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: quote_ident!("execute").into(),
                            value: Box::new(Expr::Fn(FnExpr {
                                ident: None,
                                function: execute,
                            })),
                        }))),
                    ],
                }
                .into(),
            ),
        };

        let mut function_stmts = vec![use_strict()];

        if !self.declare_var_idents.is_empty() {
            function_stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self
                        .declare_var_idents
                        .iter()
                        .map(|i| VarDeclarator {
                            span: i.span,
                            name: i.clone().into(),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                    ..Default::default()
                }
                .into(),
            );
        }
        function_stmts.append(&mut before_body_stmts);
        function_stmts.push(return_stmt.into());

        let function = Box::new(Function {
            params: vec![
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: self.export_ident.clone().into(),
                },
                Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: self.context_ident.clone().into(),
                },
            ],
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: function_stmts,
                ..Default::default()
            }),
            is_generator: false,
            is_async: false,
            ..Default::default()
        });

        Module {
            body: vec![CallExpr {
                span: DUMMY_SP,
                callee: member_expr!(Default::default(), Default::default(), System.register)
                    .as_callee(),
                args: vec![
                    dep_module_names.as_arg(),
                    FnExpr {
                        ident: None,
                        function,
                    }
                    .as_arg(),
                ],
                ..Default::default()
            }
            .into_stmt()
            .into()],
            ..module
        }
    }
}

#[inline]
fn get_module_export_name(module_export_name: &ModuleExportName) -> Id {
    match &module_export_name {
        ModuleExportName::Ident(ident) => ident.to_id(),
        ModuleExportName::Str(s) => (s.value.clone(), SyntaxContext::empty()),
    }
}

#[inline]
fn get_module_export_expr(module_export_name: &ModuleExportName) -> Expr {
    match &module_export_name {
        ModuleExportName::Ident(ident) => ident.clone().into(),
        ModuleExportName::Str(s) => Lit::Str(quote_str!(s.value.clone())).into(),
    }
}

#[inline]
fn get_module_export_member_prop(module_export_name: &ModuleExportName) -> MemberProp {
    match &module_export_name {
        ModuleExportName::Ident(ident) => MemberProp::Ident(ident.clone().into()),
        ModuleExportName::Str(s) => MemberProp::Computed(ComputedPropName {
            span: s.span,
            expr: Lit::Str(quote_str!(s.value.clone())).into(),
        }),
    }
}
