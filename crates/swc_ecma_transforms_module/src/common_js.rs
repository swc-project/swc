use std::{
    cell::{Ref, RefCell, RefMut},
    rc::Rc,
};

use indexmap::IndexSet;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    FileName, Mark, Span, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    find_ids, ident::IdentLike, member_expr, private_ident, quote_ident, quote_str,
    var::VarCollector, DestructuringFinder, ExprFactory, IsDirective,
};
use swc_ecma_visit::{noop_fold_type, noop_visit_type, Fold, FoldWith, Visit, VisitWith};

pub use super::util::Config;
use super::util::{
    define_es_module, define_property, has_use_strict, initialize_to_undefined, make_descriptor,
    use_strict, ModulePass, Scope,
};
use crate::path::{ImportResolver, Resolver};

pub fn common_js(
    top_level_mark: Mark,
    config: Config,
    scope: Option<Rc<RefCell<Scope>>>,
) -> impl Fold {
    let scope = scope.unwrap_or_default();
    CommonJs {
        top_level_mark,
        config,
        scope,
        in_top_level: Default::default(),
        resolver: Resolver::Default,
    }
}

pub fn common_js_with_resolver(
    resolver: Box<dyn ImportResolver>,
    base: FileName,
    top_level_mark: Mark,
    config: Config,
    scope: Option<Rc<RefCell<Scope>>>,
) -> impl Fold {
    let scope = scope.unwrap_or_default();

    CommonJs {
        top_level_mark,
        config,
        scope,
        in_top_level: Default::default(),
        resolver: Resolver::Real { base, resolver },
    }
}

struct LazyIdentifierVisitor {
    scope: Rc<RefCell<Scope>>,
    top_level_idents: AHashSet<JsWord>,
}
impl LazyIdentifierVisitor {
    fn new(scope: Rc<RefCell<Scope>>) -> Self {
        LazyIdentifierVisitor {
            scope,
            top_level_idents: Default::default(),
        }
    }
}

/*
An import can be performed lazily if it isn't used at the module's top-level.
This visitor scans only the identifiers at the top level by not traversing nodes
that introduce nesting. It then looks up identifiers to see if they match an
imported specifier name.
 */
impl Visit for LazyIdentifierVisitor {
    noop_visit_type!();

    fn visit_import_decl(&mut self, _: &ImportDecl) {}

    fn visit_export_decl(&mut self, _: &ExportDecl) {}

    fn visit_named_export(&mut self, _: &NamedExport) {}

    fn visit_export_default_decl(&mut self, _: &ExportDefaultDecl) {}

    fn visit_export_default_expr(&mut self, _: &ExportDefaultExpr) {}

    fn visit_export_all(&mut self, export: &ExportAll) {
        self.top_level_idents.insert(export.src.value.clone());
    }

    fn visit_labeled_stmt(&mut self, _: &LabeledStmt) {}

    fn visit_continue_stmt(&mut self, _: &ContinueStmt) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_function(&mut self, _: &Function) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_setter_prop(&mut self, _: &SetterProp) {}

    fn visit_getter_prop(&mut self, _: &GetterProp) {}

    fn visit_class_prop(&mut self, _: &ClassProp) {}

    fn visit_prop_name(&mut self, prop_name: &PropName) {
        if let PropName::Computed(n) = prop_name {
            n.visit_with(self)
        }
    }

    fn visit_decl(&mut self, decl: &Decl) {
        if let Decl::Class(ref c) = decl {
            c.class.super_class.visit_with(self);
            c.class.body.visit_with(self);
        }
    }

    fn visit_ident(&mut self, ident: &Ident) {
        let v = self.scope.borrow().idents.get(&ident.to_id()).cloned();
        if let Some((src, _)) = v {
            self.top_level_idents.insert(src);
        }
    }
}

struct CommonJs {
    top_level_mark: Mark,
    config: Config,
    scope: Rc<RefCell<Scope>>,
    in_top_level: bool,
    resolver: Resolver,
}

/// TODO: VisitMut
impl Fold for CommonJs {
    noop_fold_type!();

    mark_as_nested!();

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut emitted_esmodule = false;
        let mut stmts = Vec::with_capacity(items.len() + 4);
        let mut extra_stmts = Vec::with_capacity(items.len());

        if self.config.strict_mode && !has_use_strict(&items) {
            stmts.push(ModuleItem::Stmt(use_strict()));
        }

        let mut exports = vec![];
        let mut initialized = IndexSet::default();

        let mut export_alls: AHashMap<JsWord, Ident> = Default::default();
        // Used only if export * exists
        let mut exported_names: Option<Ident> = None;

        // Make a preliminary pass through to collect exported names ahead of time
        for item in &items {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                ref specifiers,
                ..
            })) = item
            {
                for ExportNamedSpecifier { orig, exported, .. } in
                    specifiers.iter().filter_map(|e| match e {
                        ExportSpecifier::Named(e) => Some(e),
                        _ => None,
                    })
                {
                    let exported = match &exported {
                        Some(ModuleExportName::Ident(ident)) => Some(ident),
                        Some(ModuleExportName::Str(..)) => {
                            unimplemented!("module string names unimplemented")
                        }
                        _ => None,
                    };
                    let orig = match &orig {
                        ModuleExportName::Ident(ident) => ident,
                        _ => unimplemented!("module string names unimplemented"),
                    };
                    if let Some(exported) = &exported {
                        exports.push(exported.sym.clone());
                    } else {
                        exports.push(orig.sym.clone());
                    }
                }
            }
        }

        for item in &items {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Var(v),
                ..
            })) = item
            {
                self.scope
                    .borrow_mut()
                    .exported_var_decls
                    .extend(find_ids(&v.decls));
            }
        }

        // Make another preliminary pass to collect all import sources and their
        // specifiers.
        for item in &items {
            self.in_top_level = true;
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                self.scope.borrow_mut().insert_import(import.clone())
            }
        }

        // Map all top-level identifiers that match imported specifiers, and blacklist
        // them from lazy imports.
        let mut visitor = LazyIdentifierVisitor::new(self.scope.clone());
        items.visit_with(&mut visitor);
        for ident in visitor.top_level_idents {
            self.scope.borrow_mut().lazy_blacklist.insert(ident);
        }

        for item in items {
            self.in_top_level = true;

            match item {
                ModuleItem::Stmt(ref s) if s.is_use_strict() => {
                    stmts.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    self.scope.borrow_mut().insert_import(import)
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportAll(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..))
                | ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(..)) => {
                    if !self.config.strict && !emitted_esmodule {
                        emitted_esmodule = true;

                        stmts.push(ModuleItem::Stmt(define_es_module(quote_ident!("exports"))));
                    }

                    let mut scope_ref_mut = self.scope.borrow_mut();
                    let scope = &mut *scope_ref_mut;
                    macro_rules! init_export {
                        ("default") => {{
                            init_export!(js_word!("default"))
                        }};
                        ($name:expr) => {{
                            exports.push($name.clone());
                            initialized.insert($name.clone());
                        }};
                    }
                    match item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl {
                                decl: DefaultDecl::Fn(..),
                                ..
                            },
                        )) => {
                            // initialized.insert(js_word!("default"));
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                            ExportDefaultDecl {
                                decl: DefaultDecl::TsInterfaceDecl(..),
                                ..
                            },
                        )) => {}

                        ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export)) => {
                            scope.import_to_export(&export.src, true);

                            scope
                                .import_types
                                .entry(export.src.value.clone())
                                .and_modify(|v| *v = true);
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(..))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(..)) => {
                            init_export!("default")
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                            src: Some(ref src),
                            ref specifiers,
                            ..
                        })) => {
                            scope.import_to_export(src, !specifiers.is_empty());
                        }

                        _ => {}
                    }
                    drop(scope_ref_mut);

                    match item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export)) => {
                            let mut scope_ref_mut = self.scope.borrow_mut();
                            let scope = &mut *scope_ref_mut;

                            if exported_names.is_none()
                                && (!export_alls.is_empty() || !exports.is_empty())
                            {
                                let exported_names_ident = private_ident!("_exportNames");
                                stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    decls: vec![VarDeclarator {
                                        span: DUMMY_SP,
                                        name: exported_names_ident.clone().into(),
                                        init: Some(Box::new(Expr::Object(ObjectLit {
                                            span: DUMMY_SP,
                                            props: exports
                                                .clone()
                                                .into_iter()
                                                .filter_map(|export| {
                                                    if export == js_word!("default") {
                                                        return None;
                                                    }

                                                    Some(PropOrSpread::Prop(Box::new(
                                                        Prop::KeyValue(KeyValueProp {
                                                            key: PropName::Ident(Ident::new(
                                                                export, DUMMY_SP,
                                                            )),
                                                            value: true.into(),
                                                        }),
                                                    )))
                                                })
                                                .collect(),
                                        }))),
                                        definite: false,
                                    }],
                                    declare: false,
                                }))));

                                exported_names = Some(exported_names_ident);
                            }

                            let data = scope
                                .import_to_export(&export.src, true)
                                .expect("Export should exists");
                            export_alls.entry(export.src.value.clone()).or_insert(data);

                            drop(scope_ref_mut);
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: decl @ Decl::Class(..),
                            ..
                        }))
                        | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: decl @ Decl::Fn(..),
                            ..
                        })) => {
                            let (ident, is_class) = match decl {
                                Decl::Class(ref c) => (c.ident.clone(), true),
                                Decl::Fn(ref f) => (f.ident.clone(), false),
                                _ => unreachable!(),
                            };

                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(decl.fold_with(self))));

                            if !is_class {
                                let mut scope = self.scope.borrow_mut();
                                scope
                                    .exported_bindings
                                    .entry((ident.sym.clone(), ident.span.ctxt()))
                                    .or_default()
                                    .push((ident.sym.clone(), ident.span.ctxt()));
                            }

                            let append_to: &mut Vec<_> = if is_class {
                                &mut extra_stmts
                            } else {
                                // Function declaration cannot throw
                                &mut stmts
                            };

                            append_to.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(Box::new(
                                        quote_ident!("exports").make_member(ident.clone()),
                                    )),
                                    op: op!("="),
                                    right: Box::new(ident.into()),
                                }
                                .into_stmt()
                                .into(),
                            );
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            decl: Decl::Var(var),
                            ..
                        })) => {
                            let new_var = var.clone().fold_with(self);

                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(new_var))));

                            let mut scope = self.scope.borrow_mut();
                            var.decls.visit_with(&mut VarCollector {
                                to: &mut scope.declared_vars,
                            });

                            let mut found: Vec<Ident> = vec![];
                            for decl in var.decls {
                                let mut v = DestructuringFinder { found: &mut found };
                                decl.visit_with(&mut v);

                                for ident in found.drain(..) {
                                    scope
                                        .exported_bindings
                                        .entry((ident.sym.clone(), ident.span.ctxt()))
                                        .or_default()
                                        .push((ident.sym.clone(), ident.span.ctxt()));
                                    init_export!(ident.sym);

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(Box::new(
                                                quote_ident!("exports").make_member(ident.clone()),
                                            )),
                                            op: op!("="),
                                            right: Box::new(ident.into()),
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                            }
                            drop(scope);
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..)) => {
                            //
                            extra_stmts.push(item.fold_with(self));
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl)) => {
                            match decl.decl {
                                DefaultDecl::Class(ClassExpr { ident, class }) => {
                                    let class = class.fold_with(self);

                                    init_export!("default");

                                    let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                    extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Class(
                                        ClassDecl {
                                            ident: ident.clone(),
                                            class,
                                            declare: false,
                                        }
                                        .fold_with(self),
                                    ))));

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(member_expr!(
                                                DUMMY_SP,
                                                exports.default
                                            )),
                                            op: op!("="),
                                            right: Box::new(ident.into()),
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                                DefaultDecl::Fn(FnExpr { ident, function }) => {
                                    // init_export!("default");
                                    let ident = ident.unwrap_or_else(|| private_ident!("_default"));

                                    // bind default exported fn into scope. Note this assigns
                                    // syntaxcontext
                                    // for the `default` ident, since default export is always named
                                    // as `export.default`
                                    // instead of actual ident of FnExpr even if it exists.
                                    {
                                        let mut scope = self.scope.borrow_mut();

                                        scope
                                            .exported_bindings
                                            .entry((ident.sym.clone(), ident.span.ctxt()))
                                            .or_default()
                                            .push((js_word!("default"), DUMMY_SP.ctxt()));
                                    }

                                    extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(
                                        FnDecl {
                                            ident: ident.clone(),
                                            function,
                                            declare: false,
                                        }
                                        .fold_with(self),
                                    ))));

                                    stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(member_expr!(
                                                DUMMY_SP,
                                                exports.default
                                            )),
                                            op: op!("="),
                                            right: Box::new(ident.into()),
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                                _ => extra_stmts.push(
                                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(decl))
                                        .fold_with(self),
                                ),
                            }
                        }

                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(expr)) => {
                            let ident = private_ident!("_default");

                            // TODO: Optimization (when expr cannot throw, `exports.default =
                            // void 0` is not required)

                            // We use extra statements because of the initialization
                            extra_stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: ident.clone().into(),
                                    init: Some(expr.expr.fold_with(self)),
                                    definite: false,
                                }],
                                declare: false,
                            }))));
                            extra_stmts.push(
                                AssignExpr {
                                    span: DUMMY_SP,
                                    left: PatOrExpr::Expr(member_expr!(DUMMY_SP, exports.default)),
                                    op: op!("="),
                                    right: Box::new(ident.into()),
                                }
                                .into_stmt()
                                .into(),
                            );
                        }

                        // export { foo } from 'foo';
                        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                            let mut scope = self.scope.borrow_mut();
                            let imported = export.src.clone().map(|src| {
                                scope.import_to_export(&src, !export.specifiers.is_empty())
                            });

                            stmts.reserve(export.specifiers.len());

                            drop(scope);

                            for ExportNamedSpecifier { orig, exported, .. } in export
                                .specifiers
                                .into_iter()
                                .map(|e| match e {
                                    ExportSpecifier::Named(e) => e,
                                    _ => unreachable!(
                                        "export default from 'foo'; should be removed by previous \
                                         pass"
                                    ),
                                })
                                .filter(|e| !e.is_type_only)
                            {
                                let exported = match &exported {
                                    Some(ModuleExportName::Ident(ident)) => Some(ident),
                                    Some(ModuleExportName::Str(..)) => {
                                        unimplemented!("module string names unimplemented")
                                    }
                                    _ => None,
                                };
                                let orig = match &orig {
                                    ModuleExportName::Ident(ident) => ident,
                                    _ => unimplemented!("module string names unimplemented"),
                                };

                                let mut scope = self.scope.borrow_mut();
                                let is_import_default = orig.sym == js_word!("default");

                                let key = orig.to_id();
                                if scope.declared_vars.contains(&key) {
                                    scope
                                        .exported_bindings
                                        .entry(key.clone())
                                        .or_default()
                                        .push(
                                            exported
                                                .map(|i| (i.sym.clone(), i.span.ctxt()))
                                                .unwrap_or_else(|| {
                                                    (orig.sym.clone(), orig.span.ctxt())
                                                }),
                                        );
                                }

                                if let Some(ref src) = export.src {
                                    if is_import_default {
                                        scope
                                            .import_types
                                            .entry(src.value.clone())
                                            .or_insert(false);
                                    }
                                }

                                let lazy = if let Some(ref src) = export.src {
                                    if scope.lazy_blacklist.contains(&src.value) {
                                        false
                                    } else {
                                        self.config.lazy.is_lazy(&src.value)
                                    }
                                } else {
                                    match scope.idents.get(&(orig.sym.clone(), orig.span.ctxt())) {
                                        Some((ref src, _)) => {
                                            if scope.lazy_blacklist.contains(src) {
                                                false
                                            } else {
                                                self.config.lazy.is_lazy(src)
                                            }
                                        }
                                        None => false,
                                    }
                                };

                                let is_reexport = export.src.is_some()
                                    || scope
                                        .idents
                                        .contains_key(&(orig.sym.clone(), orig.span.ctxt()));

                                drop(scope);

                                let old = self.in_top_level;

                                // When we are in top level we make import not lazy.
                                let is_top_level = if lazy { !is_reexport } else { true };
                                self.in_top_level = is_top_level;

                                let value = match imported {
                                    Some(ref imported) => Box::new(
                                        imported.clone().unwrap().make_member(orig.clone()),
                                    ),
                                    None => Box::new(Expr::Ident(orig.clone()).fold_with(self)),
                                };

                                // True if we are exporting our own stuff.
                                let is_value_ident = matches!(*value, Expr::Ident(..));

                                self.in_top_level = old;

                                if is_value_ident {
                                    let exported_symbol = exported
                                        .as_ref()
                                        .map(|e| e.sym.clone())
                                        .unwrap_or_else(|| orig.sym.clone());
                                    init_export!(exported_symbol);

                                    extra_stmts.push(
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Expr(Box::new(
                                                quote_ident!("exports").make_member(
                                                    (exported.unwrap_or(orig)).clone(),
                                                ),
                                            )),
                                            op: op!("="),
                                            right: value,
                                        }
                                        .into_stmt()
                                        .into(),
                                    );
                                } else {
                                    stmts.push(
                                        define_property(vec![
                                            quote_ident!("exports").as_arg(),
                                            {
                                                // export { foo }
                                                //  -> 'foo'

                                                // export { foo as bar }
                                                //  -> 'bar'
                                                let i = exported.unwrap_or(orig).clone();
                                                quote_str!(i.span, i.sym).as_arg()
                                            },
                                            make_descriptor(value).as_arg(),
                                        ])
                                        .into_stmt()
                                        .into(),
                                    );
                                }
                            }
                        }

                        _ => unreachable!(),
                    }
                }
                _ => extra_stmts.push(item.fold_with(self)),
            }
        }

        let mut scope_ref_mut = self.scope.borrow_mut();
        let scope = &mut *scope_ref_mut;

        if !initialized.is_empty() {
            stmts.extend(initialize_to_undefined(
                quote_ident!("exports"),
                initialized,
            ));
        }
        let scope = &mut *scope;
        for (src, import) in scope.imports.drain(..) {
            let lazy = if scope.lazy_blacklist.contains(&src) {
                false
            } else {
                self.config.lazy.is_lazy(&src)
            };

            let require = self
                .resolver
                .make_require_call(self.top_level_mark, src.clone());

            match import {
                Some(import) => {
                    let ty = scope.import_types.get(&src);
                    let rhs = match ty {
                        Some(true) if !self.config.no_interop => Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(interop_require_wildcard, "interopRequireWildcard"),
                            args: vec![require.as_arg()],
                            type_args: Default::default(),
                        })),
                        Some(false) if !self.config.no_interop => Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(interop_require_default, "interopRequireDefault"),
                            args: vec![require.as_arg()],
                            type_args: Default::default(),
                        })),
                        _ => Box::new(require),
                    };

                    let ident = Ident::new(import.0, import.1);

                    if lazy {
                        let return_data = Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(quote_ident!("data").into())),
                        });

                        stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                            ident: ident.clone(),
                            function: Function {
                                span: DUMMY_SP,
                                is_async: false,
                                is_generator: false,
                                decorators: Default::default(),
                                body: Some(BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![
                                        // const data = require();
                                        Stmt::Decl(Decl::Var(VarDecl {
                                            span: DUMMY_SP,
                                            kind: VarDeclKind::Const,
                                            decls: vec![VarDeclarator {
                                                span: DUMMY_SP,
                                                name: quote_ident!("data").into(),
                                                init: Some(rhs),
                                                definite: false,
                                            }],
                                            declare: false,
                                        })),
                                        // foo = function() { return data; };
                                        AssignExpr {
                                            span: DUMMY_SP,
                                            left: PatOrExpr::Pat(ident.into()),
                                            op: op!("="),
                                            right: Box::new(
                                                FnExpr {
                                                    ident: None,
                                                    function: Function {
                                                        span: DUMMY_SP,
                                                        is_async: false,
                                                        is_generator: false,
                                                        decorators: Default::default(),
                                                        body: Some(BlockStmt {
                                                            span: DUMMY_SP,
                                                            stmts: vec![return_data.clone()],
                                                        }),
                                                        params: vec![],
                                                        type_params: Default::default(),
                                                        return_type: Default::default(),
                                                    },
                                                }
                                                .into(),
                                            ),
                                        }
                                        .into_stmt(),
                                        // return data
                                        return_data,
                                    ],
                                }),
                                params: vec![],
                                type_params: Default::default(),
                                return_type: Default::default(),
                            },
                            declare: false,
                        }))));
                    } else {
                        stmts.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: import.1,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.into(),
                                init: Some(rhs),
                                definite: false,
                            }],
                            declare: false,
                        }))));
                    }
                }
                None => {
                    stmts.push(require.into_stmt().into());
                }
            }

            let exported = export_alls.remove(&src);
            if let Some(export) = exported {
                stmts.push(ModuleItem::Stmt(Scope::handle_export_all(
                    quote_ident!("exports"),
                    exported_names.clone(),
                    export,
                )));
            }
        }

        stmts.append(&mut extra_stmts);

        stmts
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let top_level = self.in_top_level;
        Scope::fold_expr(self, quote_ident!("exports"), top_level, expr)
    }

    fn fold_prop(&mut self, p: Prop) -> Prop {
        match p {
            Prop::Shorthand(ident) => Scope::fold_shorthand_prop(self, ident),

            _ => p.fold_children_with(self),
        }
    }

    ///
    /// - collects all declared variables for let and var.
    fn fold_var_decl(&mut self, var: VarDecl) -> VarDecl {
        if var.kind != VarDeclKind::Const {
            var.decls.visit_with(&mut VarCollector {
                to: &mut self.scope.borrow_mut().declared_vars,
            });
        }

        VarDecl {
            decls: var.decls.fold_with(self),
            ..var
        }
    }

    fn fold_fn_decl(&mut self, node: FnDecl) -> FnDecl {
        self.scope
            .borrow_mut()
            .declared_vars
            .push((node.ident.sym.clone(), node.ident.span.ctxt()));

        node.fold_children_with(self)
    }

    fn fold_class_decl(&mut self, node: ClassDecl) -> ClassDecl {
        self.scope
            .borrow_mut()
            .declared_vars
            .push((node.ident.sym.clone(), node.ident.span.ctxt()));

        node.fold_children_with(self)
    }
}

impl ModulePass for CommonJs {
    fn config(&self) -> &Config {
        &self.config
    }

    fn scope(&self) -> Ref<Scope> {
        self.scope.borrow()
    }

    fn scope_mut(&mut self) -> RefMut<Scope> {
        self.scope.borrow_mut()
    }

    fn resolver(&self) -> &Resolver {
        &self.resolver
    }

    fn make_dynamic_import(&mut self, span: Span, args: Vec<ExprOrSpread>) -> Expr {
        handle_dynamic_import(span, args, !self.config.no_interop)
    }
}

/// ```js
/// Promise.resolve().then(function () { return require('./foo'); })
/// ```
pub(super) fn handle_dynamic_import(
    span: Span,
    args: Vec<ExprOrSpread>,
    es_module_interop: bool,
) -> Expr {
    let resolve_call = CallExpr {
        span: DUMMY_SP,
        callee: member_expr!(DUMMY_SP, Promise.resolve).as_callee(),
        args: Default::default(),
        type_args: Default::default(),
    };
    // Promise.resolve().then
    let then = resolve_call.make_member(quote_ident!("then"));

    return Expr::Call(CallExpr {
        span,
        callee: then.as_callee(),
        args: vec![
            // function () { return require('./foo'); }
            FnExpr {
                ident: None,
                function: Function {
                    span: DUMMY_SP,
                    params: vec![],
                    is_generator: false,
                    is_async: false,
                    type_params: Default::default(),
                    return_type: Default::default(),
                    decorators: Default::default(),
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some({
                                let mut expr = Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: quote_ident!("require").as_callee(),
                                    args,
                                    type_args: Default::default(),
                                }));

                                if es_module_interop {
                                    expr = Box::new(Expr::Call(CallExpr {
                                        span: DUMMY_SP,
                                        callee: helper!(
                                            interop_require_wildcard,
                                            "interopRequireWildcard"
                                        ),
                                        args: vec![expr.as_arg()],
                                        type_args: Default::default(),
                                    }));
                                }

                                expr
                            }),
                        })],
                    }),
                },
            }
            .as_arg(),
        ],
        type_args: Default::default(),
    });
}
