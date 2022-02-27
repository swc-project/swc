use pmutil::q;
use swc_ecma_ast::*;

use crate::ctxt::Ctx;

macro_rules! fail_todo {
    ($T:ty) => {
        impl crate::ast::ToCode for $T {
            fn to_code(&self, _: &crate::ctxt::Ctx) -> syn::Expr {
                todo!("ToCode for {}", stringify!($T))
            }
        }
    };
}

mod decl;
mod expr;
mod id;
mod module_decl;
mod pat;
mod stmt;
mod typescript;

pub(crate) trait ToCode: 'static {
    fn to_code(&self, cx: &Ctx) -> syn::Expr;
}

impl<T> ToCode for Box<T>
where
    T: ?Sized + ToCode,
{
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        (**self).to_code(cx)
    }
}

/// Used instead of Box<T>, to reduce mistakes.
pub struct BoxWrapper<T>
where
    T: ?Sized,
{
    pub inner: Box<T>,
}

/// TODO: Optimize
impl<T> ToCode for BoxWrapper<T>
where
    T: ?Sized + ToCode,
{
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        q!(
            Vars {
                inner: self.inner.to_code(cx)
            },
            { Box::new(inner) }
        )
        .parse()
    }
}

/// TODO: Optimize
impl<T> ToCode for Option<T>
where
    T: ToCode,
{
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        match self {
            Some(inner) => q!(
                Vars {
                    inner: inner.to_code(cx)
                },
                { Some(inner) }
            )
            .parse(),
            None => q!({ None }).parse(),
        }
    }
}

macro_rules! impl_enum {
    ($E:ident, [ $($v:ident),* ]) => {
        impl ToCode for $E {
            fn to_code(&self, cx: & Ctx) -> syn::Expr {
                match self {
                    $(
                        $E::$v(inner) => q!(
                            Vars {
                                inner: inner.to_code(cx)
                            },
                            { $E::$v(inner) }
                        )
                        .parse(),
                    )*
                }
            }
        }
    };
}

impl_enum!(ModuleItem, [ModuleDecl, Stmt]);
impl_enum!(
    ModuleDecl,
    [
        Import,
        ExportDecl,
        ExportNamed,
        ExportDefaultDecl,
        ExportDefaultExpr,
        ExportAll,
        TsImportEquals,
        TsExportAssignment,
        TsNamespaceExport
    ]
);
impl_enum!(
    Stmt,
    [
        Block, Empty, Debugger, With, Return, Labeled, Break, Continue, If, Switch, Throw, Try,
        While, DoWhile, For, ForIn, ForOf, Decl, Expr
    ]
);
impl_enum!(
    Decl,
    [Class, Fn, Var, TsInterface, TsTypeAlias, TsEnum, TsModule]
);
impl_enum!(Expr, []);
impl_enum!(Pat, []);
