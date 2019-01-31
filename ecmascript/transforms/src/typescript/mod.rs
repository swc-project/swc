use crate::pass::Pass;
use ast::*;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned};

/// Strips type annotations out.
pub fn strip() -> impl Pass + Clone + Copy {
    Strip
}

#[derive(Clone, Copy)]
struct Strip;

impl Fold<Vec<ModuleItem>> for Strip {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        items.move_flat_map(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(..)))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(..)))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(..)))
            | ModuleItem::Stmt(Stmt::Decl(Decl::TsTypeAlias(..)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Decl::TsEnum(..)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Decl::TsInterface(..)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Decl::TsModule(..)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(Decl::TsTypeAlias(..)))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                ExportDefaultDecl::TsInterfaceDecl(..),
            ))
            | ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(..))
            | ModuleItem::ModuleDecl(ModuleDecl::TsImportEqualsDecl(..))
            | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExportDecl(..)) => None,

            _ => Some(item),
        })
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

macro_rules! to_none {
    ($T:ty) => {
        impl Fold<Option<$T>> for Strip {
            fn fold(&mut self, _: Option<$T>) -> Option<$T> {
                None
            }
        }
    };
    ($T:ty,) => {
        to_none!($T);
    };
    ($T:ty, $($rest:tt)+) => {
        to_none!($T);
        to_none!($($rest)*);
    };
}

to_none!(
    Accessibility,
    TsType,
    TsTypeAnn,
    TsTypeParamDecl,
    TsTypeParamInstantiation
);
