use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::*;
use syn::{parse_quote, ExprBlock};

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

macro_rules! impl_enum_body {
    ($E:ident, $s:expr, $cx:expr,[ $($v:ident),* ]) => {
        match $s {
            $(
                $E::$v(inner) => {
                    let val = crate::ast::ToCode::to_code(inner, $cx);
                    syn::parse_quote!(
                        swc_core::ecma::ast::$E::$v(#val)
                    )
                },
            )*
        }
    };
}

macro_rules! impl_enum {
    ($E:ident, [ $($v:ident),* ]) => {
        impl crate::ast::ToCode for $E {
            fn to_code(&self, cx: &crate::ctxt::Ctx) -> syn::Expr {
                impl_enum_body!($E, self, cx, [ $($v),* ])
            }
        }
    };


    ($E:ident, [ $($v:ident),* ], true) => {
        impl crate::ast::ToCode for $E {
            fn to_code(&self, cx: &crate::ctxt::Ctx) -> syn::Expr {
                if let Some(i) = self.as_ident() {
                    if let Some(var_name) = i.sym.strip_prefix('$') {
                        if let Some(var) = cx.var(crate::ctxt::VarPos::$E, var_name) {
                            return var.get_expr();
                        }
                    }
                }

                impl_enum_body!($E, self, cx, [ $($v),* ])
            }
        }
    };
}

macro_rules! impl_struct {
    (
        $name:ident,
        [ $($v:ident),* ]
    ) => {
        impl crate::ast::ToCode for $name {
            fn to_code(&self, cx: &crate::ctxt::Ctx) -> syn::Expr {
                let mut builder = crate::builder::Builder::new(stringify!($name));

                let Self { $($v,)* } = self;

                $(
                    builder.add(
                        stringify!($v),
                        crate::ast::ToCode::to_code($v, cx),
                    );
                )*

                syn::Expr::Struct(builder.build())
            }
        }
    };
}

mod class;
mod decl;
mod enums;
mod expr;
mod id;
mod lit;
mod module_decl;
mod pat;
mod prop;
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
        let inner = (**self).to_code(cx);
        parse_quote!(Box::new(#inner))
    }
}

/// TODO: Optimize
impl<T> ToCode for Option<T>
where
    T: ToCode,
{
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        match self {
            Some(inner) => {
                let inner = inner.to_code(cx);

                parse_quote!(Some(#inner))
            }
            None => parse_quote!(None),
        }
    }
}

impl_struct!(Invalid, [span]);

impl ToCode for Span {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        parse_quote!(swc_core::common::DUMMY_SP)
    }
}

impl ToCode for SyntaxContext {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        parse_quote!(swc_core::common::SyntaxContext::empty())
    }
}

impl_enum!(ModuleItem, [ModuleDecl, Stmt]);

impl_enum!(
    Pat,
    [Ident, Array, Rest, Object, Assign, Invalid, Expr],
    true
);
impl_enum!(Lit, [Str, Bool, Null, Num, BigInt, Regex, JSXText]);
impl_enum!(
    ClassMember,
    [
        Constructor,
        Method,
        PrivateMethod,
        ClassProp,
        PrivateProp,
        TsIndexSignature,
        Empty,
        StaticBlock,
        AutoAccessor
    ]
);
impl_enum!(ObjectPatProp, [KeyValue, Assign, Rest]);
impl_enum!(PropName, [Ident, Str, Num, Computed, BigInt]);
impl_enum!(ParamOrTsParamProp, [TsParamProp, Param]);
impl_enum!(PropOrSpread, [Spread, Prop]);
impl_enum!(BlockStmtOrExpr, [BlockStmt, Expr]);
impl_enum!(MemberProp, [Ident, PrivateName, Computed]);
impl_enum!(SuperProp, [Ident, Computed]);
impl_enum!(JSXObject, [Ident, JSXMemberExpr]);
impl_enum!(
    JSXElementChild,
    [
        JSXText,
        JSXElement,
        JSXExprContainer,
        JSXFragment,
        JSXSpreadChild
    ]
);
impl_enum!(OptChainBase, [Member, Call]);
impl_enum!(JSXElementName, [Ident, JSXMemberExpr, JSXNamespacedName]);
impl_enum!(JSXAttrOrSpread, [JSXAttr, SpreadElement]);

impl<T> ToCode for Vec<T>
where
    T: ToCode,
{
    fn to_code(&self, cx: &Ctx) -> syn::Expr {
        let len = self.len();
        let var_stmt: syn::Stmt = parse_quote!(let mut items = Vec::with_capacity(#len););
        let mut stmts = vec![var_stmt];

        for item in self {
            let item = item.to_code(cx);
            stmts.push(syn::Stmt::Expr(
                parse_quote!(items.push(#item)),
                Some(Default::default()),
            ));
        }

        stmts.push(syn::Stmt::Expr(parse_quote!(items), None));

        syn::Expr::Block(ExprBlock {
            attrs: Default::default(),
            label: Default::default(),
            block: syn::Block {
                brace_token: Default::default(),
                stmts,
            },
        })
    }
}
