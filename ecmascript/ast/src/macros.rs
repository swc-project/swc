/// Creates a corresponding operator.
///
/// Unary +,- is `op!(unary, "+")`, `op!(unary, "-")`.
///
/// Binary +,- is `op!(bin, "+")`, `op!(bin, "-")`.
#[macro_export]
macro_rules! op {
    (unary,"-") => {
        $crate::UnaryOp::Minus
    };
    (unary,"+") => {
        $crate::UnaryOp::Plus
    };
    ("!") => {
        $crate::UnaryOp::Bang
    };
    ("~") => {
        $crate::UnaryOp::Tilde
    };
    ("typeof") => {
        $crate::UnaryOp::TypeOf
    };
    ("void") => {
        $crate::UnaryOp::Void
    };
    ("delete") => {
        $crate::UnaryOp::Delete
    };

    ("++") => {
        $crate::UpdateOp::PlusPlus
    };
    ("--") => {
        $crate::UpdateOp::MinusMinus
    };

    ("==") => {
        $crate::BinaryOp::EqEq
    };
    ("!=") => {
        $crate::BinaryOp::NotEq
    };
    ("===") => {
        $crate::BinaryOp::EqEqEq
    };
    ("!==") => {
        $crate::BinaryOp::NotEqEq
    };
    ("<") => {
        $crate::BinaryOp::Lt
    };
    ("<=") => {
        $crate::BinaryOp::LtEq
    };
    (">") => {
        $crate::BinaryOp::Gt
    };
    (">=") => {
        $crate::BinaryOp::GtEq
    };
    ("<<") => {
        $crate::BinaryOp::LShift
    };
    (">>") => {
        $crate::BinaryOp::RShift
    };
    (">>>") => {
        $crate::BinaryOp::ZeroFillRShift
    };
    (bin,"+") => {
        $crate::BinaryOp::Add
    };
    (bin,"-") => {
        $crate::BinaryOp::Sub
    };
    ("*") => {
        $crate::BinaryOp::Mul
    };
    ("/") => {
        $crate::BinaryOp::Div
    };
    ("%") => {
        $crate::BinaryOp::Mod
    };
    ("|") => {
        $crate::BinaryOp::BitOr
    };
    ("^") => {
        $crate::BinaryOp::BitXor
    };
    ("&") => {
        $crate::BinaryOp::BitAnd
    };
    ("||") => {
        $crate::BinaryOp::LogicalOr
    };
    ("&&") => {
        $crate::BinaryOp::LogicalAnd
    };
    ("in") => {
        $crate::BinaryOp::In
    };
    ("instanceof") => {
        $crate::BinaryOp::InstanceOf
    };
    ("**") => {
        $crate::BinaryOp::Exp
    };
    ("??") => {
        $crate::BinaryOp::NullishCoalescing
    };

    ("=") => {
        $crate::AssignOp::Assign
    };
    ("+=") => {
        $crate::AssignOp::AddAssign
    };
    ("-=") => {
        $crate::AssignOp::SubAssign
    };
    ("*=") => {
        $crate::AssignOp::MulAssign
    };
    ("/=") => {
        $crate::AssignOp::DivAssign
    };
    ("%=") => {
        $crate::AssignOp::ModAssign
    };
    ("<<=") => {
        $crate::AssignOp::LShiftAssign
    };
    (">>=") => {
        $crate::AssignOp::RShiftAssign
    };
    (">>>=") => {
        $crate::AssignOp::ZeroFillRShiftAssign
    };
    ("|=") => {
        $crate::AssignOp::BitOrAssign
    };
    ("^=") => {
        $crate::AssignOp::BitXorAssign
    };
    ("&=") => {
        $crate::AssignOp::BitAndAssign
    };
    ("**=") => {
        $crate::AssignOp::ExpAssign
    };
    ("&&=") => {
        $crate::AssignOp::AndAssign
    };
    ("||=") => {
        $crate::AssignOp::OrAssign
    };
    ("??=") => {
        $crate::AssignOp::NullishAssign
    };
}

macro_rules! test_de {
    ($name:ident, $T:path, $s:literal) => {
        #[test]
        fn $name() {
            let _var: $T = ::serde_json::from_str(&$s).expect("failed to parse json");
        }
    };
}
