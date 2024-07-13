use num_bigint::{BigInt as BigIntValue, Sign};
use swc_common::SyntaxContext;
use swc_ecma_ast::*;

/// Give a rough size for everything
pub trait Size {
    fn size(&self) -> usize;
}

impl Size for Lit {
    fn size(&self) -> usize {
        match self {
            Lit::Str(s) => s.value.len() + 2,
            // would be !0 or !1
            Lit::Bool(_) => 2,
            Lit::Null(_) => 4,
            Lit::Num(num) => num.value.size(),
            Lit::BigInt(i) => i.value.size(),
            Lit::Regex(r) => r.exp.len(),
            Lit::JSXText(s) => s.value.len(),
        }
    }
}

impl Size for UnaryOp {
    fn size(&self) -> usize {
        use UnaryOp::*;
        match self {
            Minus | Plus | Bang | Tilde => 1,
            TypeOf => 7,
            Void => 5,
            Delete => 7,
        }
    }
}

impl Size for UpdateOp {
    fn size(&self) -> usize {
        2
    }
}

impl Size for BinaryOp {
    fn size(&self) -> usize {
        use BinaryOp::*;
        match self {
            Lt | Gt | Add | Sub | Mul | Div | Mod | BitOr | BitXor | BitAnd | EqEq | NotEq
            | LtEq | GtEq | LShift | RShift | LogicalOr | LogicalAnd | Exp | NullishCoalescing
            | EqEqEq | NotEqEq | ZeroFillRShift => self.as_str().len(),

            In => 4,
            InstanceOf => 12,
        }
    }
}

impl Size for AssignOp {
    fn size(&self) -> usize {
        self.as_str().len()
    }
}

impl Size for PrivateName {
    fn size(&self) -> usize {
        // priv name can be mangled
        2
    }
}

// TODO: optimize
impl Size for f64 {
    fn size(&self) -> usize {
        if self.fract() == 0.0 {
            self.log10().ceil() as usize + 1
        } else {
            self.to_string().len()
        }
    }
}

#[allow(clippy::bool_to_int_with_if)]
impl Size for BigIntValue {
    fn size(&self) -> usize {
        let sign = if let Sign::Minus = self.sign() { 1 } else { 0 };
        // bits is bascially log2
        // use this until https://github.com/rust-num/num-bigint/issues/57
        let value = ((self.bits() as f64) / 10.0_f64.log2()).ceil() as usize + 1;
        sign + value + 1 // n
    }
}

/// Give a rough size for everything
pub trait SizeWithCtxt {
    fn size(&self, unresolved: SyntaxContext) -> usize;
}

const TODO: usize = 10000;

impl SizeWithCtxt for Expr {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            Expr::Lit(lit) => lit.size(),
            Expr::Ident(id) => id.size(unresolved),

            Expr::Bin(BinExpr {
                op, left, right, ..
            }) => op.size() + left.size(unresolved) + right.size(unresolved),

            Expr::Unary(UnaryExpr { arg, op, .. }) => op.size() + arg.size(unresolved),

            Expr::Call(CallExpr { callee, args, .. }) => {
                callee.size(unresolved) + args.size(unresolved) + 2
            }

            Expr::New(NewExpr { callee, args, .. }) => {
                args.as_ref().map_or(0, |args| args.size(unresolved) + 2)
                    + 4
                    + callee.size(unresolved)
            }

            Expr::Member(m) => m.obj.size(unresolved) + m.prop.size(unresolved),
            Expr::SuperProp(s) => 6 + s.prop.size(unresolved),
            Expr::Update(e) => e.arg.size(unresolved) + e.op.size(),

            Expr::Assign(AssignExpr {
                op, left, right, ..
            }) => left.size(unresolved) + op.size() + right.size(unresolved),

            Expr::Seq(e) => {
                e.exprs
                    .iter()
                    .map(|v| v.size(unresolved) + 1)
                    .sum::<usize>()
                    - 1
            }

            Expr::This(_) => 4,
            Expr::Array(a) => 2 + a.elems.size(unresolved),
            Expr::Object(o) => 2 + o.props.size(unresolved),

            Expr::Yield(YieldExpr { arg, delegate, .. }) => {
                6 + *delegate as usize + arg.as_ref().map_or(0, |a| a.size(unresolved))
            }
            Expr::Await(a) => 6 + a.arg.size(unresolved),
            Expr::Cond(CondExpr {
                test, cons, alt, ..
            }) => test.size(unresolved) + 1 + cons.size(unresolved) + 1 + alt.size(unresolved),
            Expr::Tpl(t) => t.size(unresolved),
            Expr::TaggedTpl(t) => t.tag.size(unresolved) + t.tpl.size(unresolved),

            Expr::Arrow(ArrowExpr {
                params,
                body,
                is_async,
                ..
            }) => match &**body {
                BlockStmtOrExpr::BlockStmt(_) => TODO,
                BlockStmtOrExpr::Expr(e) => {
                    let p = match &params[..] {
                        [] => 2,
                        [Pat::Ident(_)] => 1,
                        _ => 2 + params.size(unresolved),
                    };
                    let a = if *is_async {
                        5 + usize::from(params.len() != 1)
                    } else {
                        0
                    };

                    p + a + 2 + e.size(unresolved)
                }
            },
            Expr::Fn(_) => TODO,
            Expr::Class(_) => TODO,

            Expr::MetaProp(m) => match m.kind {
                MetaPropKind::NewTarget => 10,
                MetaPropKind::ImportMeta => 11,
            },
            Expr::PrivateName(p) => p.size(),
            Expr::OptChain(p) => match &*p.base {
                OptChainBase::Member(m) => 1 + m.obj.size(unresolved) + m.prop.size(unresolved),
                OptChainBase::Call(c) => {
                    1 + c.callee.size(unresolved) + c.args.size(unresolved) + 2
                }
            },

            Expr::Paren(p) => 2 + p.expr.size(unresolved),
            Expr::Invalid(_) => 0,

            Expr::JSXMember(_) => TODO,
            Expr::JSXNamespacedName(_) => TODO,
            Expr::JSXEmpty(_) => TODO,
            Expr::JSXElement(_) => TODO,
            Expr::JSXFragment(_) => TODO,
            Expr::TsTypeAssertion(_) => TODO,
            Expr::TsConstAssertion(_) => TODO,
            Expr::TsNonNull(_) => TODO,
            Expr::TsAs(_) => TODO,
            Expr::TsInstantiation(_) => TODO,
            Expr::TsSatisfies(_) => TODO,
        }
    }
}

impl SizeWithCtxt for Ident {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        if self.ctxt == unresolved {
            self.sym.len()
        } else {
            1
        }
    }
}

impl SizeWithCtxt for Callee {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            Callee::Super(_) => 5,
            Callee::Import(_) => 6,
            Callee::Expr(e) => e.size(unresolved),
        }
    }
}

impl SizeWithCtxt for ExprOrSpread {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        let mut c = 0;

        if self.spread.is_some() {
            c += 3;
        }

        c += self.expr.size(unresolved);

        c
    }
}

impl SizeWithCtxt for MemberProp {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            MemberProp::Ident(id) => 1 + id.sym.len(),
            MemberProp::PrivateName(priv_name) => 1 + priv_name.size(),
            MemberProp::Computed(c) => 2 + c.expr.size(unresolved),
        }
    }
}

impl SizeWithCtxt for SuperProp {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            SuperProp::Ident(id) => 1 + id.sym.len(),
            SuperProp::Computed(c) => 2 + c.expr.size(unresolved),
        }
    }
}

impl SizeWithCtxt for Pat {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            Pat::Ident(id) => id.size(unresolved),
            Pat::Array(a) => 2 + a.elems.size(unresolved),
            Pat::Rest(r) => 3 + r.arg.size(unresolved),
            Pat::Object(o) => 2 + o.props.size(unresolved),
            Pat::Assign(a) => a.left.size(unresolved) + 1 + a.right.size(unresolved),
            Pat::Invalid(_) => 0,
            Pat::Expr(e) => e.size(unresolved),
        }
    }
}

impl SizeWithCtxt for AssignTarget {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            AssignTarget::Simple(e) => e.size(unresolved),
            AssignTarget::Pat(p) => p.size(unresolved),
        }
    }
}

impl SizeWithCtxt for SimpleAssignTarget {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            SimpleAssignTarget::Ident(e) => {
                if e.ctxt == unresolved {
                    e.sym.len()
                } else {
                    1
                }
            }
            SimpleAssignTarget::Member(e) => e.obj.size(unresolved) + e.prop.size(unresolved),
            SimpleAssignTarget::SuperProp(e) => 6 + e.prop.size(unresolved),
            SimpleAssignTarget::Paren(e) => 2 + e.expr.size(unresolved),
            SimpleAssignTarget::OptChain(e) => match &*e.base {
                OptChainBase::Member(m) => 1 + m.obj.size(unresolved) + m.prop.size(unresolved),
                OptChainBase::Call(c) => {
                    1 + c.callee.size(unresolved) + c.args.size(unresolved) + 2
                }
            },
            SimpleAssignTarget::TsAs(_)
            | SimpleAssignTarget::TsSatisfies(_)
            | SimpleAssignTarget::TsNonNull(_)
            | SimpleAssignTarget::TsTypeAssertion(_)
            | SimpleAssignTarget::TsInstantiation(_)
            | SimpleAssignTarget::Invalid(_) => TODO,
        }
    }
}

impl SizeWithCtxt for AssignTargetPat {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            AssignTargetPat::Array(a) => 2 + a.elems.size(unresolved),
            AssignTargetPat::Object(o) => 2 + o.props.size(unresolved),
            AssignTargetPat::Invalid(_) => unreachable!(),
        }
    }
}

impl SizeWithCtxt for PropName {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            PropName::Ident(id) => id.sym.len(),
            PropName::Str(s) => s.value.len(),
            PropName::Num(n) => n.value.size(),
            PropName::Computed(c) => 2 + c.expr.size(unresolved),
            PropName::BigInt(n) => n.value.size(),
        }
    }
}

impl SizeWithCtxt for ObjectPatProp {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            ObjectPatProp::KeyValue(k) => k.key.size(unresolved) + 1 + k.value.size(unresolved),
            ObjectPatProp::Assign(a) => {
                a.key.sym.len() + a.value.as_ref().map_or(0, |v| v.size(unresolved) + 1)
            }
            ObjectPatProp::Rest(r) => 3 + r.arg.size(unresolved),
        }
    }
}

impl SizeWithCtxt for PropOrSpread {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        match self {
            PropOrSpread::Spread(s) => 3 + s.expr.size(unresolved),
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(s) => s.sym.len(),
                Prop::KeyValue(KeyValueProp { key, value }) => {
                    key.size(unresolved) + 1 + value.size(unresolved)
                }
                // where is Prop::Assign valid?
                Prop::Assign(_) => TODO,
                Prop::Getter(_) => TODO,
                Prop::Setter(_) => TODO,
                Prop::Method(_) => TODO,
            },
        }
    }
}

impl SizeWithCtxt for Tpl {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        let Self { exprs, quasis, .. } = self;
        let expr_len: usize = exprs.iter().map(|e| e.size(unresolved) + 3).sum();
        let str_len: usize = quasis.iter().map(|q| q.raw.len()).sum();
        2 + expr_len + str_len
    }
}

impl<T: SizeWithCtxt> SizeWithCtxt for Vec<T> {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        let mut c = 0;

        for item in self.iter() {
            c += item.size(unresolved) + 1; // comma
        }

        if !self.is_empty() {
            c -= 1;
        }

        c
    }
}

impl<T: SizeWithCtxt> SizeWithCtxt for Vec<Option<T>> {
    fn size(&self, unresolved: SyntaxContext) -> usize {
        let mut c = 0;

        for item in self.iter() {
            c += 1; // comma
            if let Some(item) = item {
                c += item.size(unresolved); // extra comma
            }
        }

        c -= match self.last() {
            // if empty or last is none, no need to remove dangling comma
            None | Some(None) => 0,
            _ => 1,
        };

        c
    }
}
