//! Do not use: This is not a public api and it can be changed without a version
//! bump.

use std::{mem::replace, ops::DerefMut};
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

/// Do not use: This is not a public api and it can be changed without a version
/// bump.
///
/// Helper for migration from [Fold] to [VisitMut]
#[doc(hidden)]
pub trait MapWithMut: Sized {
    fn dummy() -> Self;

    fn take(&mut self) -> Self {
        replace(self, Self::dummy())
    }

    #[inline]
    fn map_with_mut<F>(&mut self, op: F)
    where
        F: FnOnce(Self) -> Self,
    {
        let dummy = Self::dummy();
        let v = replace(self, dummy);
        let v = op(v);
        let _dummy = replace(self, v);
    }
}

impl MapWithMut for Program {
    #[inline]
    fn dummy() -> Self {
        Program::Module(Module::dummy())
    }
}

impl MapWithMut for ModuleItem {
    #[inline]
    fn dummy() -> Self {
        ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
    }
}

impl MapWithMut for Stmt {
    #[inline]
    fn dummy() -> Self {
        Stmt::Empty(EmptyStmt { span: DUMMY_SP })
    }
}

impl MapWithMut for Expr {
    #[inline]
    fn dummy() -> Self {
        Expr::Invalid(Invalid { span: DUMMY_SP })
    }
}

impl MapWithMut for Pat {
    #[inline]
    fn dummy() -> Self {
        Pat::Invalid(Invalid { span: DUMMY_SP })
    }
}

impl<T> MapWithMut for Option<T> {
    #[inline]
    fn dummy() -> Self {
        None
    }
}

impl<T> MapWithMut for Vec<T> {
    #[inline]
    fn dummy() -> Self {
        Vec::new()
    }
}

impl<T> MapWithMut for Box<T>
where
    T: MapWithMut,
{
    #[inline]
    fn dummy() -> Self {
        Box::new(T::dummy())
    }
}

impl MapWithMut for Ident {
    fn dummy() -> Self {
        Ident::new(js_word!(""), DUMMY_SP)
    }
}

impl MapWithMut for BindingIdent {
    fn dummy() -> Self {
        Ident::dummy().into()
    }
}

impl MapWithMut for ObjectPatProp {
    fn dummy() -> Self {
        ObjectPatProp::Assign(AssignPatProp {
            span: DUMMY_SP,
            key: Ident::dummy(),
            value: None,
        })
    }
}

impl MapWithMut for PatOrExpr {
    fn dummy() -> Self {
        PatOrExpr::Pat(Box::new(Pat::Ident(BindingIdent::dummy())))
    }
}

impl MapWithMut for Module {
    fn dummy() -> Self {
        Module {
            span: DUMMY_SP,
            body: vec![],
            shebang: None,
        }
    }
}

impl MapWithMut for JSXElement {
    fn dummy() -> Self {
        JSXElement {
            span: DUMMY_SP,
            opening: MapWithMut::dummy(),
            children: MapWithMut::dummy(),
            closing: MapWithMut::dummy(),
        }
    }
}

impl MapWithMut for ExprOrSuper {
    fn dummy() -> Self {
        ExprOrSuper::Super(Super { span: DUMMY_SP })
    }
}

impl MapWithMut for CallExpr {
    fn dummy() -> Self {
        CallExpr {
            span: DUMMY_SP,
            callee: MapWithMut::dummy(),
            args: MapWithMut::dummy(),
            type_args: Default::default(),
        }
    }
}
impl MapWithMut for JSXOpeningElement {
    fn dummy() -> Self {
        JSXOpeningElement {
            span: DUMMY_SP,
            name: MapWithMut::dummy(),
            attrs: MapWithMut::dummy(),
            self_closing: false,
            type_args: MapWithMut::dummy(),
        }
    }
}

impl MapWithMut for NewExpr {
    fn dummy() -> Self {
        NewExpr {
            span: DUMMY_SP,
            callee: MapWithMut::dummy(),
            args: MapWithMut::dummy(),
            type_args: Default::default(),
        }
    }
}
impl MapWithMut for JSXClosingElement {
    fn dummy() -> Self {
        JSXClosingElement {
            span: DUMMY_SP,
            name: MapWithMut::dummy(),
        }
    }
}

impl MapWithMut for Decl {
    fn dummy() -> Self {
        Decl::Var(MapWithMut::dummy())
    }
}

impl MapWithMut for VarDecl {
    fn dummy() -> Self {
        VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![],
        }
    }
}
impl MapWithMut for JSXElementName {
    fn dummy() -> Self {
        JSXElementName::Ident(Ident::dummy())
    }
}

impl MapWithMut for JSXFragment {
    fn dummy() -> Self {
        JSXFragment {
            span: DUMMY_SP,
            opening: MapWithMut::dummy(),
            children: MapWithMut::dummy(),
            closing: MapWithMut::dummy(),
        }
    }
}

impl MapWithMut for PropName {
    #[inline]
    fn dummy() -> Self {
        PropName::Ident(Ident::dummy())
    }
}

impl MapWithMut for BlockStmtOrExpr {
    #[inline]
    fn dummy() -> Self {
        BlockStmtOrExpr::Expr(MapWithMut::dummy())
    }
}

impl MapWithMut for VarDeclarator {
    #[inline]
    fn dummy() -> Self {
        VarDeclarator {
            span: DUMMY_SP,
            name: Pat::dummy(),
            init: None,
            definite: Default::default(),
        }
    }
}

impl MapWithMut for TplElement {
    #[inline]
    fn dummy() -> Self {
        TplElement {
            span: DUMMY_SP,
            tail: false,
            cooked: None,
            raw: Str {
                span: DUMMY_SP,
                value: "".into(),
                has_escape: false,
                kind: Default::default(),
            },
        }
    }
}
impl MapWithMut for JSXOpeningFragment {
    fn dummy() -> Self {
        JSXOpeningFragment { span: DUMMY_SP }
    }
}

impl MapWithMut for JSXClosingFragment {
    fn dummy() -> Self {
        JSXClosingFragment { span: DUMMY_SP }
    }
}

impl MapWithMut for Class {
    fn dummy() -> Self {
        Class {
            span: DUMMY_SP,
            decorators: Default::default(),
            body: Default::default(),
            super_class: Default::default(),
            is_abstract: Default::default(),
            type_params: Default::default(),
            super_type_params: Default::default(),
            implements: Default::default(),
        }
    }
}

/// Do not use: This is not a public api and it can be changed without a version
/// bump.
pub trait PatOrExprExt: AsOptExpr {
    fn as_ref(&self) -> &PatOrExpr;
    fn as_mut(&mut self) -> &mut PatOrExpr;

    fn as_ident(&self) -> Option<&Ident> {
        if let Some(expr) = self.as_expr() {
            match expr {
                Expr::Ident(i) => return Some(i),
                _ => {}
            }
        }

        match self.as_ref() {
            PatOrExpr::Expr(e) => match &**e {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
            PatOrExpr::Pat(p) => match &**p {
                Pat::Ident(i) => Some(&i.id),
                _ => None,
            },
        }
    }

    fn as_ident_mut(&mut self) -> Option<&mut Ident> {
        match self.as_mut() {
            PatOrExpr::Pat(p) => match **p {
                Pat::Ident(ref mut i) => Some(&mut i.id),
                Pat::Expr(ref mut e) => match e.deref_mut() {
                    Expr::Ident(i) => Some(i),
                    _ => None,
                },
                _ => None,
            },
            PatOrExpr::Expr(ref mut e) => match e.deref_mut() {
                Expr::Ident(i) => Some(i),
                _ => None,
            },
        }
    }

    fn normalize_expr(self) -> Self;

    fn normalize_ident(self) -> Self;
}

impl PatOrExprExt for PatOrExpr {
    fn as_ref(&self) -> &PatOrExpr {
        self
    }

    fn as_mut(&mut self) -> &mut PatOrExpr {
        self
    }

    fn normalize_expr(self) -> Self {
        match self {
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => PatOrExpr::Expr(expr),
                _ => return PatOrExpr::Pat(pat),
            },
            _ => self,
        }
    }

    fn normalize_ident(self) -> Self {
        match self {
            PatOrExpr::Expr(expr) => match *expr {
                Expr::Ident(i) => PatOrExpr::Pat(Box::new(Pat::Ident(i.into()))),
                _ => PatOrExpr::Expr(expr),
            },
            PatOrExpr::Pat(pat) => match *pat {
                Pat::Expr(expr) => match *expr {
                    Expr::Ident(i) => PatOrExpr::Pat(Box::new(Pat::Ident(i.into()))),
                    _ => PatOrExpr::Expr(expr),
                },
                _ => PatOrExpr::Pat(pat),
            },
        }
    }
}

pub trait ExprRefExt: ExprExt {
    fn as_ident(&self) -> Option<&Ident> {
        match self.as_expr() {
            Expr::Ident(ref i) => Some(i),
            _ => None,
        }
    }
}

impl<T> ExprRefExt for T where T: ExprExt {}

/// Do not use: This is not a public api and it can be changed without a version
/// bump.
pub trait AsOptExpr {
    fn as_expr(&self) -> Option<&Expr>;
    fn as_expr_mut(&mut self) -> Option<&mut Expr>;
}

impl AsOptExpr for PatOrExpr {
    fn as_expr(&self) -> Option<&Expr> {
        match self.as_ref() {
            PatOrExpr::Expr(e) => Some(e),
            PatOrExpr::Pat(p) => match &**p {
                Pat::Expr(e) => Some(e),
                _ => None,
            },
        }
    }

    fn as_expr_mut(&mut self) -> Option<&mut Expr> {
        match self.as_mut() {
            PatOrExpr::Expr(e) => Some(e.deref_mut()),
            PatOrExpr::Pat(p) => match &mut **p {
                Pat::Expr(e) => Some(e.deref_mut()),
                _ => None,
            },
        }
    }
}

impl AsOptExpr for ExprOrSuper {
    fn as_expr(&self) -> Option<&Expr> {
        match self {
            ExprOrSuper::Super(_) => None,
            ExprOrSuper::Expr(e) => Some(e),
        }
    }

    fn as_expr_mut(&mut self) -> Option<&mut Expr> {
        match self {
            ExprOrSuper::Super(_) => None,
            ExprOrSuper::Expr(e) => Some(e),
        }
    }
}

impl<N> AsOptExpr for Option<N>
where
    N: AsOptExpr,
{
    fn as_expr(&self) -> Option<&Expr> {
        match self {
            Some(n) => n.as_expr(),
            None => None,
        }
    }

    fn as_expr_mut(&mut self) -> Option<&mut Expr> {
        match self {
            None => None,
            Some(n) => n.as_expr_mut(),
        }
    }
}
