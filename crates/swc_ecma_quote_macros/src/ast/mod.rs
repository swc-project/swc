use pmutil::q;
use swc_common::Span;
use swc_ecma_ast::*;
use syn::ExprBlock;

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
                $E::$v(inner) => pmutil::q!(
                    Vars {
                        val: crate::ast::ToCode::to_code(inner, $cx),
                    },
                    { swc_ecma_quote::swc_ecma_ast::$E::$v(val) }
                )
                .parse(),
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
                if let Self::Ident(i) = self {
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

                $(
                    builder.add(
                        stringify!($v),
                        crate::ast::ToCode::to_code(&self.$v, cx),
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
        q!(
            Vars {
                inner: (**self).to_code(cx)
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

impl_struct!(Invalid, [span]);

impl ToCode for Span {
    fn to_code(&self, _: &Ctx) -> syn::Expr {
        q!({ swc_ecma_quote::swc_common::DUMMY_SP }).parse()
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
        StaticBlock
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
        let var_stmt = q!(Vars { len: self.len() }, {
            let mut items = Vec::with_capacity(len);
        })
        .parse::<syn::Stmt>();
        let mut stmts = vec![var_stmt];

        for item in self {
            stmts.push(syn::Stmt::Semi(
                q!(
                    Vars {
                        item: item.to_code(cx)
                    },
                    { items.push(item) }
                )
                .parse(),
                Default::default(),
            ));
        }

        stmts.push(syn::Stmt::Expr(q!(Vars {}, { items }).parse()));

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
