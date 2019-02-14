use crate::{
    pass::Pass,
    util::{prepend_stmts, var::VarCollector, ExprFactory, State},
};
use ast::*;
use fxhash::FxHashMap;
use swc_atoms::JsWord;
use swc_common::{
    util::move_map::MoveMap, Fold, FoldWith, Spanned, SyntaxContext, VisitWith, DUMMY_SP,
};

/// Strips type annotations out.
pub fn strip() -> impl Pass + Clone {
    Strip::default()
}

#[derive(Default, Clone)]
struct Strip {
    non_top_level: State<bool>,
    scope: State<Scope>,
}

impl Strip {
    fn handle_decl(&mut self, decl: &Decl) {
        // We don't care about stuffs which cannot be exported
        if self.non_top_level.value {
            return;
        }

        macro_rules! store {
            ($sym:expr, $ctxt:expr, $concrete:expr) => {{
                let entry = self
                    .scope
                    .value
                    .decls
                    .entry(($sym.clone(), $ctxt))
                    .or_default();

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

#[derive(Default)]
struct Scope {
    decls: FxHashMap<(JsWord, SyntaxContext), DeclInfo>,
}

#[derive(Debug, Default)]
struct DeclInfo {
    /// interface / type alias
    has_type: bool,
    /// Var, Fn, Class
    has_concrete: bool,
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

impl Fold<Vec<ModuleItem>> for Strip {
    fn fold(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let items = items.fold_children(self);

        items.move_flat_map(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..)) => None,

            ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(..)))
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

            ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => Some(
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export.expr).fold_with(self)),
            ),
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(mut export)) => {
                // if specifier become empty, we remove export statement.

                export.specifiers.retain(|s| match *s {
                    ExportSpecifier::Named(NamedExportSpecifier { ref orig, .. }) => {
                        if let Some(e) = self
                            .scope
                            .value
                            .decls
                            .get(&(orig.sym.clone(), orig.span.ctxt()))
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
        })
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

    to!(
        issue_196_01,
        "export type Link = { key: string; text: string };",
        ""
    );

    to!(
        issue_196_02,
        "type Link = { key: string; text: string };
export { Link };",
        ""
    );

    to!(
        issue_196_03,
        "type Link = { key: string; text: string };
const Link = 'Boo';
export { Link };",
        "const Link = 'Boo';
export { Link };"
    );

    // TODO: Test function / variable hoisting
}
