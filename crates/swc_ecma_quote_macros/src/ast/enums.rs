use pmutil::q;
use swc_ecma_ast::*;

macro_rules! impl_simple_enum {
    ($E:ident, [ $($v:ident),* ]) => {
        impl crate::ast::ToCode for $E {
            fn to_code(&self, _: &crate::ctxt::Ctx) -> syn::Expr {
                match self {
                    $(
                        $E::$v => q!(
                            Vars {},
                            { swc_core::ast::$E::$v }
                        )
                        .parse(),
                    )*
                }
            }
        }
    };
}

impl_simple_enum!(VarDeclKind, [Var, Const, Let]);
impl_simple_enum!(UnaryOp, [Minus, Plus, Bang, Tilde, TypeOf, Void, Delete]);
impl_simple_enum!(UpdateOp, [PlusPlus, MinusMinus]);
impl_simple_enum!(
    AssignOp,
    [
        Assign,
        AddAssign,
        SubAssign,
        MulAssign,
        DivAssign,
        ModAssign,
        LShiftAssign,
        RShiftAssign,
        ZeroFillRShiftAssign,
        BitOrAssign,
        BitXorAssign,
        BitAndAssign,
        ExpAssign,
        AndAssign,
        OrAssign,
        NullishAssign
    ]
);
impl_simple_enum!(
    BinaryOp,
    [
        EqEq,
        NotEq,
        EqEqEq,
        NotEqEq,
        Lt,
        LtEq,
        Gt,
        GtEq,
        LShift,
        RShift,
        ZeroFillRShift,
        Add,
        Sub,
        Mul,
        Div,
        Mod,
        BitOr,
        BitXor,
        BitAnd,
        LogicalOr,
        LogicalAnd,
        In,
        InstanceOf,
        Exp,
        NullishCoalescing
    ]
);

impl_simple_enum!(Accessibility, [Public, Protected, Private]);
impl_simple_enum!(MethodKind, [Method, Getter, Setter]);
impl_simple_enum!(MetaPropKind, [NewTarget, ImportMeta]);
