use crate::{bundler::load::Specifier, load::Load, resolve::Resolve, Bundler};
use std::collections::HashMap;
use swc_atoms::{js_word, JsWord};
use swc_common::{Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};
use swc_ecma_visit::{noop_fold_type, noop_visit_mut_type, Fold, FoldWith, VisitMut, VisitMutWith};

pub(super) type RemarkMap = HashMap<Id, SyntaxContext>;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// Applied to dependencies
    ///
    ///
    /// If `imports` is [None], it means all specifier can be used.
    pub(super) fn remark_exports(
        &self,
        mut dep: Module,
        dep_ctxt: SyntaxContext,
        imports: Option<&[Specifier]>,
        unexport: bool,
    ) -> Module {
        let mut v = ExportRenamer {
            dep_ctxt,
            imports,
            extras: vec![],
            remark_map: Default::default(),
            unexport,
        };
        dep = dep.fold_with(&mut v);

        if !v.remark_map.is_empty() {
            log::debug!("Remark map: {:?}", v.remark_map);

            // Swap syntax context. Although name is remark, it's actually
            // swapping because ExportRenamer inserts two-side conversion
            // rule.
            self.remark(&mut dep, &v.remark_map);
        }

        dep
    }

    pub(super) fn remark(&self, module: &mut Module, remark_map: &RemarkMap) {
        module.visit_mut_with(&mut RemarkIdents { map: remark_map });
    }
}
/// Applied to dependency modules.
struct ExportRenamer<'a> {
    /// The mark applied to identifiers exported to dependant modules.
    dep_ctxt: SyntaxContext,
    remark_map: RemarkMap,

    /// Dependant module's import
    imports: Option<&'a [Specifier]>,
    extras: Vec<Stmt>,

    unexport: bool,
}

impl ExportRenamer<'_> {
    /// Returns [SyntaxContext] for the name of variable.
    fn mark_as_remarking_required(&mut self, exported: Id, orig: Id) -> SyntaxContext {
        log::debug!("Remarking required: {:?} -> {:?}", exported, orig);

        let ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));
        self.remark_map
            .insert((exported.0.clone(), ctxt), exported.1);
        self.remark_map.insert(orig, ctxt);
        ctxt
    }

    fn aliased_import(&self, sym: &JsWord) -> Option<Id> {
        if self.imports.is_none() {
            return Some((sym.clone(), self.dep_ctxt));
        }

        self.imports
            .as_ref()
            .unwrap()
            .iter()
            .find_map(|s| match s {
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
            .map(|v| v.to_id())
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
    noop_fold_type!();

    fn fold_class(&mut self, node: Class) -> Class {
        node
    }

    fn fold_function(&mut self, node: Function) -> Function {
        node
    }

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        let mut actual = ActualMarker {
            dep_ctxt: self.dep_ctxt,
            imports: self.imports,
        };

        let span = item.span();
        let item: ModuleItem = item.fold_children_with(self);

        match item {
            ModuleItem::Stmt(..) => return item,

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                let ident = match export.decl {
                    DefaultDecl::Class(ClassExpr {
                        ident: Some(ident),
                        class,
                    }) => {
                        return ModuleItem::Stmt(Stmt::Decl(Decl::Class(ClassDecl {
                            ident,
                            declare: false,
                            class,
                        })))
                    }
                    DefaultDecl::Fn(FnExpr {
                        ident: Some(ident),
                        function,
                    }) => {
                        return ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                            ident,
                            declare: false,
                            function,
                        })))
                    }
                    _ => self.aliased_import(&js_word!("default")),
                };

                let ident = if let Some(id) = ident {
                    id
                } else {
                    log::debug!("Dropping export default declaration because it's not used");

                    return Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into();
                };

                match export.decl {
                    DefaultDecl::Class(c) => {
                        return ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: export.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(Ident::new(
                                    ident.0,
                                    DUMMY_SP.with_ctxt(self.dep_ctxt),
                                )),
                                init: Some(Box::new(Expr::Class(c))),
                                definite: false,
                            }],
                        })))
                    }
                    DefaultDecl::Fn(f) => {
                        return ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: export.span,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(Ident::new(
                                    ident.0,
                                    DUMMY_SP.with_ctxt(self.dep_ctxt),
                                )),
                                init: Some(Box::new(Expr::Fn(f))),
                                definite: false,
                            }],
                        })))
                    }
                    DefaultDecl::TsInterfaceDecl(_) => {
                        log::debug!(
                            "Dropping export default declaration because ts interface declaration \
                             is not supported yet"
                        );

                        return Stmt::Empty(EmptyStmt { span: DUMMY_SP }).into();
                    }
                }
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(e)) => {
                let ident = self.aliased_import(&js_word!("default"));

                // TODO: Optimize if type of expression is identifier.

                return if let Some(ident) = ident {
                    let ctxt = self.mark_as_remarking_required(
                        (ident.0.clone(), self.dep_ctxt),
                        ident.clone(),
                    );

                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: e.span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(Ident::new(ident.0, DUMMY_SP.with_ctxt(ctxt))),
                            init: Some(e.expr),
                            definite: false,
                        }],
                    })))
                } else {
                    log::trace!("Removing default export expression as it's not imported");

                    // Expression statement cannot start with function
                    ModuleItem::Stmt(Stmt::Expr(ExprStmt {
                        span: e.span,
                        expr: Box::new(Expr::Paren(ParenExpr {
                            span: DUMMY_SP,
                            expr: e.expr,
                        })),
                    }))
                };
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(e)) if e.src.is_none() => {
                if self.unexport {
                    let mut var_decls = Vec::with_capacity(e.specifiers.len());

                    e.specifiers.into_iter().for_each(|specifier| {
                        let span = specifier.span();
                        let ident = match &specifier {
                            // TODO
                            ExportSpecifier::Namespace(s) => self.aliased_import(&s.name.sym),
                            ExportSpecifier::Default(..) => {
                                self.aliased_import(&js_word!("default"))
                            }
                            ExportSpecifier::Named(s) => {
                                if let Some(exported) = &s.exported {
                                    // We need remarking

                                    match self.aliased_import(&exported.sym) {
                                        Some(v) => {
                                            let ctxt = self.mark_as_remarking_required(
                                                v.clone(),
                                                s.orig.to_id(),
                                            );
                                            log::trace!(
                                                "exported = {}{:?}",
                                                exported.sym,
                                                exported.span.ctxt
                                            );
                                            log::trace!("id = {:?}", v);
                                            log::trace!(
                                                "orig = {}{:?}",
                                                s.orig.sym,
                                                s.orig.span.ctxt()
                                            );

                                            Some((v.0, ctxt))
                                        }
                                        None => None,
                                    }
                                } else {
                                    match self.aliased_import(&s.orig.sym) {
                                        Some(id) => {
                                            let ctxt = self.mark_as_remarking_required(
                                                (s.orig.sym.clone(), self.dep_ctxt),
                                                s.orig.to_id(),
                                            );
                                            self.remark_map
                                                .insert((id.0.clone(), ctxt), self.dep_ctxt);

                                            Some((id.0, ctxt))
                                        }
                                        None => None,
                                    }
                                }
                            }
                        };

                        if let Some(i) = ident {
                            let orig = match specifier {
                                // TODO
                                ExportSpecifier::Namespace(s) => s.name,
                                ExportSpecifier::Default(..) => {
                                    Ident::new(js_word!("default"), span)
                                }
                                ExportSpecifier::Named(s) => s.orig,
                            };

                            var_decls.push(VarDeclarator {
                                span,
                                name: Pat::Ident(Ident::new(i.0, DUMMY_SP.with_ctxt(i.1))),
                                init: Some(Box::new(Expr::Ident(orig))),
                                definite: false,
                            })
                        } else {
                            log::trace!(
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
                } else {
                    let mut export_specifiers = Vec::with_capacity(e.specifiers.len());

                    e.specifiers.into_iter().for_each(|specifier| {
                        let span = specifier.span();
                        let ident = match &specifier {
                            // TODO
                            ExportSpecifier::Namespace(s) => self.aliased_import(&s.name.sym),
                            ExportSpecifier::Default(..) => {
                                self.aliased_import(&js_word!("default"))
                            }
                            ExportSpecifier::Named(s) => {
                                if let Some(exported) = &s.exported {
                                    // We need remarking

                                    match self.aliased_import(&exported.sym) {
                                        Some(v) => {
                                            let ctxt = self.mark_as_remarking_required(
                                                v.clone(),
                                                s.orig.to_id(),
                                            );
                                            log::trace!(
                                                "exported = {}{:?}",
                                                exported.sym,
                                                exported.span.ctxt
                                            );
                                            log::trace!("id = {:?}", v);
                                            log::trace!(
                                                "orig = {}{:?}",
                                                s.orig.sym,
                                                s.orig.span.ctxt()
                                            );

                                            Some((v.0, ctxt))
                                        }
                                        None => None,
                                    }
                                } else {
                                    match self.aliased_import(&s.orig.sym) {
                                        Some(id) => {
                                            let ctxt = self.mark_as_remarking_required(
                                                (s.orig.sym.clone(), self.dep_ctxt),
                                                s.orig.to_id(),
                                            );

                                            Some((id.0, ctxt))
                                        }
                                        None => None,
                                    }
                                }
                            }
                        };

                        if let Some(i) = ident {
                            let orig = match specifier {
                                // TODO
                                ExportSpecifier::Namespace(s) => s.name,
                                ExportSpecifier::Default(..) => {
                                    Ident::new(js_word!("default"), span)
                                }
                                ExportSpecifier::Named(s) => s.orig,
                            };

                            export_specifiers.push(ExportSpecifier::Named(ExportNamedSpecifier {
                                span,
                                orig,
                                exported: Some(Ident::new(i.0, DUMMY_SP.with_ctxt(i.1))),
                            }));

                        // export_specifiers.push(VarDeclarator {
                        //     span,
                        //     name: Pat::Ident(Ident::new(i.0,
                        // DUMMY_SP.with_ctxt(i.1))),
                        //     init: Some(Box::new(Expr::Ident(orig))),
                        //     definite: false,
                        // })
                        } else {
                            log::trace!(
                                "Removing export specifier {:?} as it's not imported (`unexport` \
                                 is false, but it's not used)",
                                specifier
                            );
                        }
                    });

                    if !export_specifiers.is_empty() {
                        return ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                            type_only: false,
                            span: e.span,
                            specifiers: export_specifiers,
                            src: None,
                        }));
                    }

                    return Stmt::Empty(EmptyStmt { span }).into();
                }
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) => {
                //
                return match decl.decl {
                    Decl::TsInterface(_)
                    | Decl::TsTypeAlias(_)
                    | Decl::TsEnum(_)
                    | Decl::TsModule(_) => ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)),

                    Decl::Class(mut c) => {
                        c.ident = match actual.rename(c.ident, true) {
                            Ok(v) => v,
                            Err(v) => v,
                        };

                        if self.unexport {
                            Stmt::Decl(Decl::Class(c)).into()
                        } else {
                            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                decl: Decl::Class(c),
                                ..decl
                            }))
                        }
                    }
                    Decl::Fn(mut f) => {
                        f.ident = match actual.rename(f.ident, true) {
                            Ok(v) => v,
                            Err(v) => v,
                        };
                        if self.unexport {
                            Stmt::Decl(Decl::Fn(f)).into()
                        } else {
                            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                decl: Decl::Fn(f),
                                ..decl
                            }))
                        }
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

struct ActualMarker<'a> {
    dep_ctxt: SyntaxContext,

    /// Dependant module's import
    imports: Option<&'a [Specifier]>,
}

impl ActualMarker<'_> {
    fn rename(&self, ident: Ident, only_if_aliased: bool) -> Result<Ident, Ident> {
        if self.imports.is_none() {
            return Err(ident);
        }

        if let Some(mut ident) = self.imports.as_ref().unwrap().iter().find_map(|s| match s {
            Specifier::Specific {
                alias: Some(alias),
                local,
            } if *alias == ident.sym => Some(Ident::new(local.sym().clone(), ident.span)),
            Specifier::Specific { alias: None, local }
                if !only_if_aliased && *local == ident.sym =>
            {
                Some(local.clone().into_ident())
            }
            _ => None,
        }) {
            ident.span = ident.span.with_ctxt(self.dep_ctxt);

            return Ok(ident);
        }

        Err(ident)
    }
}

impl Fold for ActualMarker<'_> {
    noop_fold_type!();

    fn fold_expr(&mut self, node: Expr) -> Expr {
        node
    }

    fn fold_ident(&mut self, ident: Ident) -> Ident {
        match self.rename(ident, false) {
            Ok(v) => v,
            Err(v) => v,
        }
    }

    fn fold_export_named_specifier(&mut self, s: ExportNamedSpecifier) -> ExportNamedSpecifier {
        if let Some(..) = s.exported {
            ExportNamedSpecifier {
                orig: self.fold_ident(s.orig),
                ..s
            }
        } else {
            match self.rename(s.orig.clone(), false) {
                Ok(exported) => ExportNamedSpecifier {
                    orig: s.orig,
                    exported: Some(exported),
                    ..s
                },
                Err(orig) => ExportNamedSpecifier { orig, ..s },
            }
        }
    }

    fn fold_prop(&mut self, p: Prop) -> Prop {
        match p {
            Prop::Shorthand(i) => match self.rename(i.clone(), false) {
                Ok(renamed) => Prop::KeyValue(KeyValueProp {
                    key: i.into(),
                    value: Box::new(renamed.into()),
                }),
                Err(orig) => Prop::Shorthand(orig),
            },
            _ => p.fold_with(self),
        }
    }

    // TODO: shorthand, etc
}

struct RemarkIdents<'a> {
    map: &'a RemarkMap,
}

impl VisitMut for RemarkIdents<'_> {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        let id = (*n).to_id();
        if let Some(&ctxt) = self.map.get(&id) {
            n.span = n.span.with_ctxt(ctxt);
            log::debug!("Remark: {:?} -> {:?}", id, ctxt)
        }
    }
}
