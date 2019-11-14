pub use self::opt_chaining::optional_chaining;
use crate::{
    pass::Pass,
    util::{prepend_stmts, var::VarCollector, ExprFactory},
};
use ast::*;
use hashbrown::HashMap;
use swc_atoms::JsWord;
use swc_common::{
    util::move_map::MoveMap, Fold, FoldWith, Spanned, SyntaxContext, Visit, VisitWith, DUMMY_SP,
};

mod opt_chaining;
#[cfg(test)]
mod tests;

/// Strips type annotations out.
pub fn strip() -> impl Pass {
    Strip::default()
}

#[derive(Default)]
struct Strip {
    non_top_level: bool,
    scope: Scope,
    phase: Phase,
}

#[derive(Debug, Clone, Copy)]
enum Phase {
    ///
    ///  - analyze ident usages
    ///  - remove type annotations
    Analysis,
    ///
    ///  - remove type-only imports
    DropImports,
}
impl Default for Phase {
    fn default() -> Self {
        Phase::Analysis
    }
}

#[derive(Default)]
struct Scope {
    decls: HashMap<(JsWord, SyntaxContext), DeclInfo>,
    imported_idents: HashMap<(JsWord, SyntaxContext), DeclInfo>,
}

#[derive(Debug, Default)]
struct DeclInfo {
    /// interface / type alias
    has_type: bool,
    /// Var, Fn, Class
    has_concrete: bool,
}

impl Strip {
    fn handle_decl(&mut self, decl: &Decl) {
        // We don't care about stuffs which cannot be exported
        if self.non_top_level {
            return;
        }

        macro_rules! store {
            ($sym:expr, $ctxt:expr, $concrete:expr) => {{
                let entry = self.scope.decls.entry(($sym.clone(), $ctxt)).or_default();

                if $concrete {
                    entry.has_concrete = true
                } else {
                    entry.has_type = true;
                }
            }};
        }
        match *decl {
            Decl::Class(ClassDecl { ref ident, .. }) | Decl::Fn(FnDecl { ref ident, .. }) => {
                store!(ident.sym, ident.span.ctxt(), true);
            }

            Decl::Var(ref var) => {
                let mut names = vec![];
                var.decls.visit_with(&mut VarCollector { to: &mut names });

                for name in names {
                    store!(name.0, name.1, true);
                }
            }

            Decl::TsEnum(TsEnumDecl { ref id, .. })
            | Decl::TsInterface(TsInterfaceDecl { ref id, .. })
            | Decl::TsModule(TsModuleDecl {
                id: TsModuleName::Ident(ref id),
                ..
            })
            | Decl::TsTypeAlias(TsTypeAliasDecl { ref id, .. }) => {
                store!(id.sym, id.span.ctxt(), false)
            }

            Decl::TsModule(TsModuleDecl {
                id:
                    TsModuleName::Str(Str {
                        ref value, span, ..
                    }),
                ..
            }) => store!(value, span.ctxt(), false),
        }
    }
}

impl Fold<Constructor> for Strip {
    fn fold(&mut self, c: Constructor) -> Constructor {
        let c = c.fold_children(self);

        let mut stmts = vec![];

        let params = c.params.move_map(|param| match param {
            PatOrTsParamProp::Pat(..) => param,
            PatOrTsParamProp::TsParamProp(param) => {
                let (ident, param) = match param.param {
                    TsParamPropParam::Ident(i) => (i.clone(), Pat::Ident(i)),
                    TsParamPropParam::Assign(AssignPat {
                        span,
                        left: box Pat::Ident(i),
                        right,
                        type_ann: _,
                    }) => (
                        i.clone(),
                        Pat::Assign(AssignPat {
                            span,
                            left: box Pat::Ident(i),
                            right,
                            type_ann: None,
                        }),
                    ),
                    _ => unreachable!("destructuring pattern inside TsParameterProperty"),
                };
                stmts.push(Stmt::Expr(box Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(box ThisExpr { span: DUMMY_SP }.member(ident.clone())),
                    op: op!("="),
                    right: box Expr::Ident(ident),
                })));

                PatOrTsParamProp::Pat(param)
            }
        });

        let body = match c.body {
            Some(mut body) => {
                prepend_stmts(&mut body.stmts, stmts.into_iter());
                Some(body)
            }
            None => None,
        };

        Constructor { params, body, ..c }
    }
}

impl Fold<Vec<ClassMember>> for Strip {
    fn fold(&mut self, members: Vec<ClassMember>) -> Vec<ClassMember> {
        let members = members.fold_children(self);

        members.move_flat_map(|member| match member {
            ClassMember::Constructor(Constructor { body: None, .. }) => None,
            ClassMember::Method(ClassMethod {
                is_abstract: true, ..
            })
            | ClassMember::Method(ClassMethod {
                function: Function { body: None, .. },
                ..
            }) => None,

            _ => Some(member),
        })
    }
}

impl Fold<Vec<Pat>> for Strip {
    fn fold(&mut self, pats: Vec<Pat>) -> Vec<Pat> {
        let mut pats = pats.fold_children(self);

        // Remove this from parameter list
        pats.retain(|pat| match *pat {
            Pat::Ident(Ident {
                sym: js_word!("this"),
                ..
            }) => false,
            _ => true,
        });

        pats
    }
}

impl Fold<Vec<ModuleItem>> for Strip {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        // First pass
        let items = items.fold_children(self);

        let old = self.phase;
        self.phase = Phase::DropImports.into();

        // Second pass
        let items = items.move_flat_map(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..)) => None,

            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                function: Function { body: None, .. },
                ..
            })))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(..)))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(..)))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(..)))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(..)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsEnum(..),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsInterface(..),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsModule(..),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsTypeAlias(..),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl:
                    Decl::Fn(FnDecl {
                        function: Function { body: None, .. },
                        ..
                    }),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                decl:
                    DefaultDecl::Fn(FnExpr {
                        function: Function { body: None, .. },
                        ..
                    }),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                decl: DefaultDecl::TsInterfaceDecl(..),
                ..
            }))
            | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(..)) => None,

            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) => {
                if !import.is_export {
                    return None;
                }

                Some(ModuleItem::ModuleDecl(
                    ModuleDecl::ExportNamed(NamedExport {
                        span: DUMMY_SP,
                        specifiers: vec![ExportSpecifier::Named(NamedExportSpecifier {
                            span: DUMMY_SP,
                            exported: Some(import.id),
                            orig: match import.module_ref {
                                TsModuleRef::TsEntityName(TsEntityName::Ident(i)) => i,
                                _ => unimplemented!("export import A = B where B != Ident"),
                            },
                        })],
                        src: None,
                    })
                    .fold_with(self),
                ))
            }

            ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => {
                Some(ModuleItem::ModuleDecl(
                    ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                        span: export.span(),
                        expr: export.expr,
                    })
                    .fold_with(self),
                ))
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                // if specifier become empty, we remove export statement.

                export.specifiers.retain(|s| match *s {
                    ExportSpecifier::Named(NamedExportSpecifier { ref orig, .. }) => {
                        if let Some(e) = self.scope.decls.get(&(orig.sym.clone(), orig.span.ctxt()))
                        {
                            e.has_concrete
                        } else {
                            return true;
                        }
                    }
                    _ => true,
                });
                if export.specifiers.is_empty() {
                    return None;
                }

                Some(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                    NamedExport { ..export },
                )))
            }

            _ => Some(item.fold_with(self)),
        });
        self.phase = old;

        items
    }
}

impl Fold<ImportDecl> for Strip {
    fn fold(&mut self, mut import: ImportDecl) -> ImportDecl {
        match self.phase {
            Phase::Analysis => {
                macro_rules! store {
                    ($i:expr) => {{
                        self.scope
                            .imported_idents
                            .insert(($i.sym.clone(), $i.span.ctxt()), Default::default());
                    }};
                }
                for s in &import.specifiers {
                    match *s {
                        ImportSpecifier::Default(ref import) => store!(import.local),
                        ImportSpecifier::Specific(ref import) => store!(import.local),
                        ImportSpecifier::Namespace(..) => {}
                    }
                }

                import
            }
            Phase::DropImports => {
                import.specifiers.retain(|s| match *s {
                    ImportSpecifier::Default(ImportDefault { ref local, .. })
                    | ImportSpecifier::Specific(ImportSpecific { ref local, .. }) => {
                        let entry = self
                            .scope
                            .imported_idents
                            .get(&(local.sym.clone(), local.span.ctxt()));
                        match entry {
                            Some(&DeclInfo {
                                has_type: true,
                                has_concrete: false,
                            }) => false,
                            _ => true,
                        }
                    }
                    _ => true,
                });

                import
            }
        }
    }
}

impl Fold<Ident> for Strip {
    fn fold(&mut self, i: Ident) -> Ident {
        self.scope
            .imported_idents
            .entry((i.sym.clone(), i.span.ctxt()))
            .and_modify(|v| v.has_concrete = true);

        Ident {
            optional: false,
            ..i.fold_children(self)
        }
    }
}

impl Visit<TsEntityName> for Strip {
    fn visit(&mut self, name: &TsEntityName) {
        assert!(match self.phase {
            Phase::Analysis => true,
            _ => false,
        });

        match *name {
            TsEntityName::Ident(ref i) => {
                self.scope
                    .imported_idents
                    .entry((i.sym.clone(), i.span.ctxt()))
                    .and_modify(|v| v.has_type = true);
            }
            TsEntityName::TsQualifiedName(..) => name.visit_children(self),
        }
    }
}

impl Fold<Decl> for Strip {
    fn fold(&mut self, decl: Decl) -> Decl {
        self.handle_decl(&decl);

        let old = self.non_top_level;
        self.non_top_level = true.into();
        let decl = decl.fold_children(self);
        self.non_top_level = old;
        decl
    }
}

impl Fold<Stmt> for Strip {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            Stmt::Decl(decl) => match decl {
                Decl::TsEnum(..)
                | Decl::TsInterface(..)
                | Decl::TsModule(..)
                | Decl::TsTypeAlias(..) => {
                    let span = decl.span();
                    return Stmt::Empty(EmptyStmt { span });
                }
                _ => Stmt::Decl(decl),
            },
            _ => stmt,
        }
    }
}

macro_rules! type_to_none {
    ($T:ty) => {
        impl Fold<Option<$T>> for Strip {
            fn fold(&mut self, node: Option<$T>) -> Option<$T> {
                node.visit_with(self);

                None
            }
        }
    };
    ($T:ty,) => {
        type_to_none!($T);
    };
    ($T:ty, $($rest:tt)+) => {
        type_to_none!($T);
        type_to_none!($($rest)*);
    };
}

impl Fold<Option<Accessibility>> for Strip {
    fn fold(&mut self, _: Option<Accessibility>) -> Option<Accessibility> {
        None
    }
}

type_to_none!(TsType, TsTypeAnn, TsTypeParamDecl, TsTypeParamInstantiation);

impl Fold<Expr> for Strip {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = match expr {
            Expr::Member(MemberExpr {
                span,
                obj,
                prop,
                computed,
            }) => Expr::Member(MemberExpr {
                span,
                obj: obj.fold_with(self),
                prop: if computed { prop.fold_with(self) } else { prop },
                computed,
            }),
            _ => expr.fold_children(self),
        };

        match expr {
            Expr::TsAs(TsAsExpr { expr, .. }) => *expr,
            Expr::TsNonNull(TsNonNullExpr { expr, .. }) => *expr,
            Expr::TsTypeAssertion(TsTypeAssertion { expr, .. }) => *expr,
            Expr::TsTypeCast(TsTypeCastExpr { expr, .. }) => *expr,
            _ => expr,
        }
    }
}
