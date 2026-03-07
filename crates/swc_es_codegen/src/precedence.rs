use swc_es_ast::{BinaryOp, Expr};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
pub enum Precedence {
    Lowest = 0,
    Sequence,
    Assignment,
    Conditional,
    LogicalOr,
    LogicalAnd,
    BitOr,
    BitXor,
    BitAnd,
    Equality,
    Relational,
    Shift,
    Additive,
    Multiplicative,
    Exponential,
    Prefix,
    Postfix,
    Call,
    Member,
    Primary,
}

impl Precedence {
    #[inline]
    pub fn next(self) -> Self {
        match self {
            Precedence::Lowest => Precedence::Sequence,
            Precedence::Sequence => Precedence::Assignment,
            Precedence::Assignment => Precedence::Conditional,
            Precedence::Conditional => Precedence::LogicalOr,
            Precedence::LogicalOr => Precedence::LogicalAnd,
            Precedence::LogicalAnd => Precedence::BitOr,
            Precedence::BitOr => Precedence::BitXor,
            Precedence::BitXor => Precedence::BitAnd,
            Precedence::BitAnd => Precedence::Equality,
            Precedence::Equality => Precedence::Relational,
            Precedence::Relational => Precedence::Shift,
            Precedence::Shift => Precedence::Additive,
            Precedence::Additive => Precedence::Multiplicative,
            Precedence::Multiplicative => Precedence::Exponential,
            Precedence::Exponential => Precedence::Prefix,
            Precedence::Prefix => Precedence::Postfix,
            Precedence::Postfix => Precedence::Call,
            Precedence::Call => Precedence::Member,
            Precedence::Member => Precedence::Primary,
            Precedence::Primary => Precedence::Primary,
        }
    }
}

#[inline]
pub fn binary_precedence(op: BinaryOp) -> Precedence {
    match op {
        BinaryOp::LogicalOr | BinaryOp::NullishCoalescing => Precedence::LogicalOr,
        BinaryOp::LogicalAnd => Precedence::LogicalAnd,
        BinaryOp::BitOr => Precedence::BitOr,
        BinaryOp::BitXor => Precedence::BitXor,
        BinaryOp::BitAnd => Precedence::BitAnd,
        BinaryOp::EqEq | BinaryOp::EqEqEq | BinaryOp::NotEq | BinaryOp::NotEqEq => {
            Precedence::Equality
        }
        BinaryOp::Lt
        | BinaryOp::LtEq
        | BinaryOp::Gt
        | BinaryOp::GtEq
        | BinaryOp::In
        | BinaryOp::InstanceOf => Precedence::Relational,
        BinaryOp::LShift | BinaryOp::RShift | BinaryOp::ZeroFillRShift => Precedence::Shift,
        BinaryOp::Add | BinaryOp::Sub => Precedence::Additive,
        BinaryOp::Mul | BinaryOp::Div | BinaryOp::Mod => Precedence::Multiplicative,
        BinaryOp::Exp => Precedence::Exponential,
    }
}

#[inline]
pub fn expr_precedence(expr: &Expr) -> Precedence {
    match expr {
        Expr::Seq(_) => Precedence::Sequence,
        Expr::Assign(_) | Expr::Arrow(_) | Expr::Yield(_) => Precedence::Assignment,
        Expr::Cond(_) => Precedence::Conditional,
        Expr::Binary(expr) => binary_precedence(expr.op),
        Expr::TsAs(_) => Precedence::Relational,
        Expr::Unary(_) | Expr::Await(_) => Precedence::Prefix,
        Expr::Update(expr) => {
            if expr.prefix {
                Precedence::Prefix
            } else {
                Precedence::Postfix
            }
        }
        Expr::Call(_) | Expr::New(_) | Expr::TaggedTemplate(_) | Expr::OptChain(_) => {
            Precedence::Call
        }
        Expr::Member(_) => Precedence::Member,
        Expr::Paren(_) => Precedence::Primary,
        Expr::Ident(_)
        | Expr::Lit(_)
        | Expr::Function(_)
        | Expr::Class(_)
        | Expr::JSXElement(_)
        | Expr::Array(_)
        | Expr::Object(_)
        | Expr::Template(_)
        | Expr::MetaProp(_) => Precedence::Primary,
    }
}

#[inline]
pub fn is_right_associative_binary(op: BinaryOp) -> bool {
    matches!(op, BinaryOp::Exp)
}
