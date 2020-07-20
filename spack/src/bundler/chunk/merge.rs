use super::Bundler;
use crate::{
    bundler::{export::Exports, load_transformed::Specifier},
    Id, ModuleId,
};
use anyhow::{Context, Error};
use std::{
    mem::take,
    ops::{Deref, DerefMut},
    sync::atomic::Ordering,
};
use swc_atoms::{js_word, JsWord};
use swc_common::{Mark, Span, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms::noop_fold_type;
use swc_ecma_utils::{
    find_ids, prepend, private_ident, undefined, DestructuringFinder, ExprFactory, StmtLike,
};
use swc_ecma_visit::{Fold, FoldWith, VisitWith};

impl Bundler<'_> {
    /// Merge `targets` into `entry`.
    pub(super) fn merge_modules(
        &self,
        entry: ModuleId,
        targets: &mut Vec<ModuleId>,
    ) -> Result<Module, Error> {
        self.swc.run(|| {
            let info = self.scope.get_module(entry).unwrap();

            let mut entry: Module = (*info.module).clone();
            if targets.is_empty() {
                return Ok((*info.module).clone());
            }

            log::info!("Merge: {} <= {:?}", info.fm.name, targets);

            // {
            //     let code = self
            //         .swc
            //         .print(
            //             &entry.clone().fold_with(&mut HygieneVisualizer),
            //             SourceMapsConfig::Bool(false),
            //             None,
            //             false,
            //         )
            //         .unwrap()
            //         .code;
            //
            //     println!("Before merging:\n{}\n\n\n", code);
            // }

            for (src, specifiers) in &info.imports.specifiers {
                if !targets.contains(&src.module_id) {
                    log::debug!(
                        "Not merging: not in target: ({}):{} <= ({}):{}",
                        info.id,
                        info.fm.name,
                        src.module_id,
                        src.src.value,
                    );
                    continue;
                }
                log::debug!("Merging: {} <= {}", info.fm.name, src.src.value);

                if specifiers.iter().any(|v| v.is_namespace()) {
                    unimplemented!(
                        "accessing namespace dependency with computed key: {} -> {}",
                        info.id,
                        src.module_id
                    )
                }
                if src.is_unconditional {
                    if let Some(imported) = self.scope.get_module(src.module_id) {
                        info.helpers.extend(&imported.helpers);

                        // In the case of
                        //
                        //  a <- b
                        //  b <- c
                        //
                        // we change it to
                        //
                        // a <- b + chunk(c)
                        //
                        let mut dep =
                            self.merge_modules(src.module_id, targets)
                                .with_context(|| {
                                    format!(
                                        "failed to merge: ({}):{} <= ({}):{}",
                                        info.id, info.fm.name, src.module_id, src.src.value
                                    )
                                })?;

                        if let Some(pos) = targets.iter().position(|x| *x == info.id) {
                            targets.remove(pos);
                        }

                        if imported.is_es6 {
                            //{
                            //    let code = self
                            //        .swc
                            //        .print(
                            //            &dep.clone().fold_with(&mut HygieneVisualizer),
                            //            info.fm.clone(),
                            //            false,
                            //            false,
                            //        )
                            //        .unwrap()
                            //        .code;
                            //
                            //    println!("Dep before drop_unused:\n{}\n\n\n", code);
                            //}

                            // Tree-shaking
                            dep = self.drop_unused(imported.fm.clone(), dep, Some(&specifiers));

                            //{
                            //    let code = self
                            //        .swc
                            //        .print(
                            //            &dep.clone().fold_with(&mut HygieneVisualizer),
                            //            info.fm.clone(),
                            //            false,
                            //            false,
                            //        )
                            //        .unwrap()
                            //        .code;
                            //
                            //    println!("Dep after drop_unused:\n{}\n\n\n", code);
                            //}

                            if let Some(imports) = info
                                .imports
                                .specifiers
                                .iter()
                                .find(|(s, _)| s.module_id == imported.id)
                                .map(|v| &v.1)
                            {
                                dep = dep.fold_with(&mut ExportRenamer {
                                    mark: imported.mark(),
                                    _exports: &imported.exports,
                                    imports: &imports,
                                    extras: vec![],
                                });
                            }

                            dep = dep.fold_with(&mut Unexporter);

                            if !specifiers.is_empty() {
                                entry = entry.fold_with(&mut LocalMarker {
                                    mark: imported.mark(),
                                    specifiers: &specifiers,
                                    excluded: vec![],
                                });

                                // // Note: this does not handle `export default
                                // foo`
                                // dep = dep.fold_with(&mut LocalMarker {
                                //     mark: imported.mark(),
                                //     specifiers: &imported.exports.items,
                                // });
                            }

                            dep = dep.fold_with(&mut GlobalMarker {
                                used_mark: self.used_mark,
                                module_mark: imported.mark(),
                            });

                            // {
                            //     let code = self
                            //         .swc
                            //         .print(
                            //             &dep.clone().fold_with(&mut HygieneVisualizer),
                            //             SourceMapsConfig::Bool(false),
                            //             None,
                            //             false,
                            //         )
                            //         .unwrap()
                            //         .code;
                            //
                            //     println!("Dep:\n{}\n\n\n", code);
                            // }

                            // {
                            //     let code = self
                            //         .swc
                            //         .print(
                            //             &entry.clone().fold_with(&mut HygieneVisualizer),
                            //             SourceMapsConfig::Bool(false),
                            //             None,
                            //             false,
                            //         )
                            //         .unwrap()
                            //         .code;
                            //
                            //     println!("@: Before merging:\n{}\n\n\n", code);
                            // }

                            // Replace import statement / require with module body
                            let mut injector = Es6ModuleInjector {
                                imported: dep.body.clone(),
                                src: src.src.clone(),
                            };
                            entry.body.visit_mut_with(&mut injector);

                            // {
                            //     let code = self
                            //         .swc
                            //         .print(
                            //             &entry.clone().fold_with(&mut
                            // HygieneVisualizer),
                            //             SourceMapsConfig::Bool(false),
                            //             None,
                            //             false,
                            //         )
                            //         .unwrap()
                            //         .code;
                            //
                            //     println!("Merged:\n{}\n\n\n", code);
                            // }

                            if injector.imported.is_empty() {
                                continue;
                            }
                        }

                        {
                            // common js module is transpiled as
                            //
                            //  Src:
                            //      const foo = require('foo');
                            //
                            // Output:
                            //
                            //      const load = __spack__require.bind(void 0, function(module,
                            // exports){
                            //      // ... body of foo
                            // });      const foo = load();
                            //
                            // As usual, this behavior depends on hygiene.

                            let load_var = private_ident!("load");

                            {
                                // ... body of foo
                                let module_fn = Expr::Fn(FnExpr {
                                    ident: None,
                                    function: Function {
                                        params: vec![
                                            // module
                                            Param {
                                                span: DUMMY_SP.apply_mark(self.top_level_mark),
                                                decorators: Default::default(),
                                                pat: Pat::Ident(Ident::new(
                                                    "module".into(),
                                                    DUMMY_SP,
                                                )),
                                            },
                                            // exports
                                            Param {
                                                span: DUMMY_SP.apply_mark(self.top_level_mark),
                                                decorators: Default::default(),
                                                pat: Pat::Ident(Ident::new(
                                                    "exports".into(),
                                                    DUMMY_SP,
                                                )),
                                            },
                                        ],
                                        decorators: vec![],
                                        span: DUMMY_SP,
                                        body: Some(BlockStmt {
                                            span: dep.span,
                                            stmts: dep
                                                .body
                                                .into_iter()
                                                .map(|v| match v {
                                                    ModuleItem::ModuleDecl(_) => unreachable!(
                                                        "module item found but is_es6 is false"
                                                    ),
                                                    ModuleItem::Stmt(s) => s,
                                                })
                                                .collect(),
                                        }),
                                        is_generator: false,
                                        is_async: false,
                                        type_params: None,
                                        return_type: None,
                                    },
                                });

                                // var load = __spack_require__.bind(void 0, moduleDecl)
                                let load_var = Stmt::Decl(Decl::Var(VarDecl {
                                    span: DUMMY_SP,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: vec![VarDeclarator {
                                        span: DUMMY_SP,
                                        name: Pat::Ident(load_var.clone()),
                                        init: Some(box Expr::Call(CallExpr {
                                            span: DUMMY_SP,
                                            callee: {
                                                info.helpers.require.store(true, Ordering::SeqCst);
                                                Ident::new(
                                                    "__spack_require__".into(),
                                                    DUMMY_SP.apply_mark(self.top_level_mark),
                                                )
                                                .member(Ident::new("bind".into(), DUMMY_SP))
                                                .as_callee()
                                            },
                                            args: vec![
                                                undefined(DUMMY_SP).as_arg(),
                                                module_fn.as_arg(),
                                            ],
                                            type_args: None,
                                        })),
                                        definite: false,
                                    }],
                                }));

                                prepend(&mut entry.body, ModuleItem::Stmt(load_var));

                                log::warn!("Injecting load");
                            }

                            let load = CallExpr {
                                span: DUMMY_SP,
                                callee: load_var.as_callee(),
                                args: vec![],
                                type_args: None,
                            };

                            entry.body.visit_mut_with(&mut RequireReplacer {
                                src: src.src.value.clone(),
                                load,
                            });

                            // {
                            //     let code = self
                            //         .swc
                            //         .print(
                            //             &entry.clone().fold_with(&mut HygieneVisualizer),
                            //             SourceMapsConfig::Bool(false),
                            //             None,
                            //             false,
                            //         )
                            //         .unwrap()
                            //         .code;
                            //
                            //     println!("@: After replace-require:\n{}\n\n\n", code);
                            // }

                            log::info!("Replaced requires with load");
                        }
                    }
                } else {
                    unimplemented!("conditional dependency: {} -> {}", info.id, src.module_id)
                }
            }

            Ok(entry)
        })
    }
}

/// `export var a = 1` => `var a = 1`
struct Unexporter;

noop_fold_type!(Unexporter);

impl Fold for Unexporter {
    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        match item {
            ModuleItem::ModuleDecl(decl) => match decl {
                ModuleDecl::ExportDecl(decl) => ModuleItem::Stmt(Stmt::Decl(decl.decl)),
                ModuleDecl::ExportDefaultExpr(..) => {
                    ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                }
                ModuleDecl::ExportNamed(ref n) if n.src.is_none() => {
                    ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
                }
                ModuleDecl::Import(..) => ModuleItem::ModuleDecl(decl),

                // TODO: Handle all
                _ => unimplemented!("Unexporter: {:?}", decl),
            },

            _ => item,
        }
    }
}

/// Applied to dependency modules.
struct ExportRenamer<'a> {
    /// The mark applied to identifiers exported to dependant modules.
    mark: Mark,
    _exports: &'a Exports,
    /// Dependant module's import
    imports: &'a [Specifier],
    extras: Vec<Stmt>,
}

noop_fold_type!(ExportRenamer<'_>);

impl ExportRenamer<'_> {
    pub fn aliased_import(&self, sym: &JsWord) -> Option<Id> {
        log::debug!("aliased_import({})\n{:?}\n\n\n", sym, self.imports);

        self.imports.iter().find_map(|s| match s {
            Specifier::Specific {
                ref local,
                alias: Some(ref alias),
                ..
            } if *alias == *sym => Some(local.clone()),
            Specifier::Specific {
                ref local,
                alias: None,
                ..
            } if *local == *sym => Some(local.clone()),
            _ => None,
        })
    }
}

impl ExportRenamer<'_> {
    fn fold_stmt_like<T>(&mut self, items: Vec<T>) -> Vec<T>
    where
        T: FoldWith<Self> + StmtLike,
    {
        let mut buf = Vec::with_capacity(items.len() + 4);

        for item in items {
            let item = item.fold_with(self);
            buf.push(item);

            buf.extend(self.extras.drain(..).map(|v| T::from_stmt(v)))
        }

        buf
    }
}

impl Fold for ExportRenamer<'_> {
    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        let mut actual = ActualMarker {
            mark: self.mark,
            imports: self.imports,
        };

        let span = item.span();
        let item: ModuleItem = item.fold_children(self);

        match item {
            ModuleItem::Stmt(..) => return item,

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(e)) => {
                let ident = self.aliased_import(&js_word!("default"));

                return if let Some(ident) = ident {
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: e.span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(ident.replace_mark(self.mark).into_ident()),
                            init: Some(e.expr),
                            definite: false,
                        }],
                    }))
                    .into()
                } else {
                    log::debug!("Removing default export expression as it's not imported");

                    ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: e.span,
                        expr: e.expr,
                    }))
                };
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(e)) if e.src.is_none() => {
                let mut var_decls = Vec::with_capacity(e.specifiers.len());

                e.specifiers.into_iter().for_each(|specifier| {
                    let span = specifier.span();
                    let ident = match &specifier {
                        // TODO
                        ExportSpecifier::Namespace(s) => self.aliased_import(&s.name.sym),
                        ExportSpecifier::Default(..) => self.aliased_import(&js_word!("default")),
                        ExportSpecifier::Named(s) => {
                            if let Some(exported) = &s.exported {
                                self.aliased_import(&exported.sym)
                            } else {
                                self.aliased_import(&s.orig.sym)
                            }
                        }
                    };

                    if let Some(i) = ident {
                        let orig = match specifier {
                            // TODO
                            ExportSpecifier::Namespace(s) => s.name,
                            ExportSpecifier::Default(..) => Ident::new(js_word!("default"), span),
                            ExportSpecifier::Named(s) => s.orig,
                        };

                        var_decls.push(VarDeclarator {
                            span,
                            name: Pat::Ident(i.replace_mark(self.mark).into_ident()),
                            init: Some(box Expr::Ident(orig)),
                            definite: false,
                        })
                    } else {
                        log::debug!(
                            "Removing export specifier {:?} as it's not imported",
                            specifier
                        );
                    }
                });

                if !var_decls.is_empty() {
                    self.extras.push(Stmt::Decl(Decl::Var(VarDecl {
                        span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: var_decls,
                    })))
                }

                return Stmt::Empty(EmptyStmt { span }).into();
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) => {
                //
                return match decl.decl {
                    Decl::TsInterface(_)
                    | Decl::TsTypeAlias(_)
                    | Decl::TsEnum(_)
                    | Decl::TsModule(_) => ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)),

                    Decl::Class(mut c) => {
                        c.ident = actual.fold(c.ident);
                        Stmt::Decl(Decl::Class(c)).into()
                    }
                    Decl::Fn(mut f) => {
                        f.ident = actual.fold(f.ident);
                        Stmt::Decl(Decl::Fn(f)).into()
                    }
                    Decl::Var(..) => {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl.fold_with(&mut actual)))
                    }
                };
            }

            _ => {}
        }

        item
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(items)
    }

    fn fold_stmts(&mut self, items: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(items)
    }
}

impl Fold for ExportRenamer<'_> {
    fn fold_function(&mut self, node: Function) -> Function {
        node
    }

    fn fold_class(&mut self, node: Class) -> Class {
        node
    }
}

struct ActualMarker<'a> {
    mark: Mark,

    /// Dependant module's import
    imports: &'a [Specifier],
}

noop_fold_type!(ActualMarker<'_>);

impl Fold for ActualMarker<'_> {
    fn fold_ident(&mut self, ident: Ident) -> Ident {
        if let Some(mut ident) = self.imports.iter().find_map(|s| match s {
            Specifier::Specific {
                alias: Some(alias),
                local,
            } if *alias == ident.sym => Some(Ident::new(local.sym().clone(), ident.span)),
            Specifier::Specific { alias: None, local } if *local == ident.sym => {
                Some(local.clone().into_ident())
            }
            _ => None,
        }) {
            ident.span = ident
                .span
                .with_ctxt(SyntaxContext::empty().apply_mark(self.mark));

            return ident;
        }

        ident
    }
}

impl Fold for ActualMarker<'_> {
    fn fold_expr(&mut self, node: Expr) -> Expr {
        node
    }
}

/// Applied to the importer module, and marks (connects) imported idents.
struct LocalMarker<'a> {
    /// Mark applied to imported idents.
    mark: Mark,
    specifiers: &'a [Specifier],
    excluded: Vec<Id>,
}

noop_fold_type!(LocalMarker<'_>);

impl<'a> LocalMarker<'a> {
    /// Searches for i, and fold T.
    #[allow(dead_code)]
    fn recurse<I, F, Ret>(&mut self, excluded_idents: I, op: F) -> Ret
    where
        F: FnOnce(I, &mut Self) -> Ret,
        I: for<'any> VisitWith<DestructuringFinder<'any, Id>>,
    {
        let len = self.excluded.len();
        let ids = find_ids(&excluded_idents);

        self.excluded.extend(ids);
        let ret = op(excluded_idents, self);
        self.excluded.drain(len..);

        ret
    }

    fn exclude<I>(&mut self, excluded_idents: &I) -> Excluder<'a, '_>
    where
        I: for<'any> VisitWith<DestructuringFinder<'any, Id>>,
    {
        let ids = find_ids(&excluded_idents);

        self.excluded.extend(ids);
        Excluder { inner: self }
    }
}

struct Excluder<'a, 'b> {
    inner: &'b mut LocalMarker<'a>,
}

impl<'a, 'b> Deref for Excluder<'a, 'b> {
    type Target = LocalMarker<'a>;

    fn deref(&self) -> &Self::Target {
        &*self.inner
    }
}

impl<'a, 'b> DerefMut for Excluder<'a, 'b> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.inner
    }
}

impl Fold for LocalMarker<'_> {
    fn fold_fn_expr(&mut self, mut node: FnExpr) -> FnExpr {
        let mut f = self.exclude(&node.ident);

        node.function = node.function.fold_with(&mut f);

        node
    }

    fn fold_fn_decl(&mut self, mut node: FnDecl) -> FnDecl {
        self.excluded.push((&node.ident).into());
        node.function = node.function.fold_with(self);
        node
    }

    fn fold_class_expr(&mut self, mut node: ClassExpr) -> ClassExpr {
        let mut f = self.exclude(&node.ident);
        node.class = node.class.fold_with(&mut f);
        node
    }

    fn fold_class_decl(&mut self, mut node: ClassDecl) -> ClassDecl {
        self.excluded.push((&node.ident).into());
        node.class = node.class.fold_with(self);
        node
    }

    fn fold_function(&mut self, mut node: Function) -> Function {
        let mut f = self.exclude(&node.params);
        node.body = node.body.fold_with(&mut f);
        node
    }

    fn fold_constructor(&mut self, mut node: Constructor) -> Constructor {
        let mut f = self.exclude(&node.params);
        node.body = node.body.fold_with(&mut f);
        node
    }

    fn fold_setter_prop(&mut self, mut node: SetterProp) -> SetterProp {
        let mut f = self.exclude(&node.param);
        node.body = node.body.fold_with(&mut f);
        node
    }

    fn fold_catch_clause(&mut self, mut node: CatchClause) -> CatchClause {
        let mut f = self.exclude(&node.param);
        node.body = node.body.fold_with(&mut f);
        node
    }

    fn fold_labeled_stmt(&mut self, node: LabeledStmt) -> LabeledStmt {
        LabeledStmt {
            body: node.body.fold_with(self),
            ..node
        }
    }

    fn fold_member_expr(&mut self, mut e: MemberExpr) -> MemberExpr {
        e.obj = e.obj.fold_with(self);

        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }

    fn fold_ident(&mut self, mut node: Ident) -> Ident {
        if self.excluded.iter().any(|i| *i == node) {
            return node;
        }

        // TODO: sym() => correct span
        if self.specifiers.iter().any(|id| *id.local() == node) {
            node.span = node
                .span
                .with_ctxt(SyntaxContext::empty().apply_mark(self.mark));
        }

        node
    }
}

struct Es6ModuleInjector {
    imported: Vec<ModuleItem>,
    src: Str,
}

impl VisitMut<Vec<ModuleItem>> for Es6ModuleInjector {
    fn visit_mut(&mut self, orig: &mut Vec<ModuleItem>) {
        let items = take(orig);
        let mut buf = Vec::with_capacity(self.imported.len() + items.len());

        for item in items {
            //
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl { ref src, .. }))
                    if src.value == self.src.value =>
                {
                    buf.extend(take(&mut self.imported));
                }

                _ => buf.push(item),
            }
        }

        *orig = buf;
    }
}

struct GlobalMarker {
    used_mark: Mark,
    module_mark: Mark,
}

noop_fold_type!(GlobalMarker);

impl GlobalMarker {
    fn is_marked_as_used(&self, span: Span) -> bool {
        let mut ctxt = span.ctxt();
        loop {
            let m = ctxt.remove_mark();
            if m == Mark::root() {
                return false;
            }
            if m == self.used_mark {
                return true;
            }
        }
    }
}

impl Fold for GlobalMarker {
    fn fold_span(&mut self, span: Span) -> Span {
        if self.is_marked_as_used(span) {
            return span.apply_mark(self.module_mark);
        }

        span
    }
}

struct RequireReplacer {
    src: JsWord,
    load: CallExpr,
}

impl VisitMut<ModuleItem> for RequireReplacer {
    fn visit_mut(&mut self, node: &mut ModuleItem) {
        node.visit_mut_children(self);

        match node {
            ModuleItem::ModuleDecl(ModuleDecl::Import(i)) => {
                // Replace import progress from 'progress';
                if i.src.value == self.src {
                    // Side effech import
                    if i.specifiers.is_empty() {
                        *node = ModuleItem::Stmt(
                            CallExpr {
                                span: DUMMY_SP,
                                callee: self.load.clone().as_callee(),
                                args: vec![],
                                type_args: None,
                            }
                            .into_stmt(),
                        );
                        return;
                    }

                    let mut props = vec![];
                    for spec in i.specifiers.clone() {
                        match spec {
                            ImportSpecifier::Named(s) => {
                                if let Some(imported) = s.imported {
                                    props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                                        key: imported.into(),
                                        value: box s.local.into(),
                                    }));
                                } else {
                                    props.push(ObjectPatProp::Assign(AssignPatProp {
                                        span: s.span,
                                        key: s.local,
                                        value: None,
                                    }));
                                }
                            }
                            ImportSpecifier::Default(s) => {
                                props.push(ObjectPatProp::KeyValue(KeyValuePatProp {
                                    key: PropName::Ident(Ident::new("default".into(), DUMMY_SP)),
                                    value: box s.local.into(),
                                }));
                            }
                            ImportSpecifier::Namespace(ns) => {
                                *node = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                                    span: i.span,
                                    kind: VarDeclKind::Var,
                                    declare: false,
                                    decls: vec![VarDeclarator {
                                        span: ns.span,
                                        name: ns.local.into(),
                                        init: Some(
                                            box CallExpr {
                                                span: DUMMY_SP,
                                                callee: self.load.clone().as_callee(),
                                                args: vec![],
                                                type_args: None,
                                            }
                                            .into(),
                                        ),
                                        definite: false,
                                    }],
                                })));
                                return;
                            }
                        }
                    }

                    *node = ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: i.span,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: i.span,
                            name: Pat::Object(ObjectPat {
                                span: DUMMY_SP,
                                props,
                                optional: false,
                                type_ann: None,
                            }),
                            init: Some(box self.load.clone().into()),
                            definite: false,
                        }],
                    })));
                    return;
                }
            }
            _ => {}
        }
    }
}

impl VisitMut<CallExpr> for RequireReplacer {
    fn visit_mut(&mut self, node: &mut CallExpr) {
        node.visit_mut_children(self);

        match &node.callee {
            ExprOrSuper::Expr(box Expr::Ident(i)) => {
                // TODO: Check for global mark
                if i.sym == *"require" && node.args.len() == 1 {
                    match &*node.args[0].expr {
                        Expr::Lit(Lit::Str(s)) => {
                            if self.src == s.value {
                                *node = self.load.clone();

                                log::debug!("Found, and replacing require");
                            }
                        }
                        _ => {}
                    }
                }
            }
            _ => {}
        }
    }
}
