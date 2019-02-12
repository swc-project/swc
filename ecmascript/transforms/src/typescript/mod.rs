use crate::{
    pass::Pass,
    util::{prepend_stmts, ExprFactory},
};
use ast::*;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned, DUMMY_SP};

/// Strips type annotations out.
pub fn strip() -> impl Pass + Clone + Copy {
    Strip
}

#[derive(Clone, Copy)]
struct Strip;

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
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                ExportDefaultDecl::TsInterfaceDecl(..),
            ))
            | ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(..))
            | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(..)) => None,

            ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => Some(
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export.expr).fold_with(self)),
            ),

            _ => Some(item.fold_with(self)),
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

impl Fold<Expr> for Strip {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            Expr::TsAs(TsAsExpr { expr, .. }) => *expr,
            Expr::TsNonNull(TsNonNullExpr { expr, .. }) => *expr,
            Expr::TsTypeAssertion(TsTypeAssertion { expr, .. }) => *expr,
            Expr::TsTypeCast(TsTypeCastExpr { expr, .. }) => *expr,
            _ => expr,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::strip;

    macro_rules! to {
        ($name:ident, $from:expr, $to:expr) => {
            test!(
                ::swc_ecma_parser::Syntax::Typescript(Default::default()),
                |_| strip(),
                $name,
                $from,
                $to
            );
        };
    }

    to!(
        constructor_01,
        "class Foo {
    constructor(public readonly foo) {}
}",
        "class Foo {
    constructor(foo) {
        this.foo = foo;
    }
}"
    );

    to!(
        constructor_02,
        "class Foo {
    constructor(readonly foo) {
        this.bar = 1;
    }
}",
        "class Foo {
    constructor(foo) {
        this.foo = foo;
        this.bar = 1;
    }
}"
    );

    to!(export_import, "export import A = B", "export { B as A }");

    to!(export_equals, "export = Foo", "export default Foo");
}
