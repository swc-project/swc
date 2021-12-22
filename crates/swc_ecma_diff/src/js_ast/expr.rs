use swc_ecma_ast::*;

use crate::{Ctx, Diff, DiffResult};

diff_enum!(
    Expr,
    [
        This,
        Array,
        Object,
        Fn,
        Unary,
        Update,
        Bin,
        Assign,
        Member,
        Cond,
        Call,
        New,
        Seq,
        Ident,
        Lit,
        Tpl,
        TaggedTpl,
        Arrow,
        Class,
        Yield,
        MetaProp,
        Await,
        Paren,
        JSXMember,
        JSXNamespacedName,
        JSXEmpty,
        JSXElement,
        JSXFragment,
        TsTypeAssertion,
        TsConstAssertion,
        TsNonNull,
        TsAs,
        PrivateName,
        OptChain,
        Invalid
    ]
);

diff_enum!(PropOrSpread, [Prop, Spread]);
diff_enum!(BlockStmtOrExpr, [BlockStmt, Expr]);
diff_enum!(ExprOrSuper, [Expr, Super]);
diff_enum!(Lit, [Str, Num, Regex, BigInt]);

diff_struct!(ThisExpr, [span]);
diff_struct!(ArrayLit, [span, elems]);
diff_struct!(ExprOrSpread, [spread, expr]);
diff_struct!(ObjectLit, [span, props]);
diff_struct!(FnExpr, [ident, function]);
diff_struct!(UnaryExpr, [span, op, arg]);
diff_struct!(Decorator, [span, expr]);
diff_struct!(UpdateExpr, [span, prefix, op, arg]);
diff_struct!(BinExpr, [span, op, left, right]);
diff_struct!(AssignExpr, [span, op, left, right]);
diff_struct!(MemberExpr, [span, obj, prop, computed]);
diff_struct!(CondExpr, [span, test, cons, alt]);
diff_struct!(CallExpr, [span, callee, args, type_args]);
diff_struct!(NewExpr, [span, callee, args, type_args]);
diff_struct!(SeqExpr, [span, exprs]);
diff_struct!(Tpl, [span, exprs, quasis]);
diff_struct!(TaggedTpl, [span, tag, tpl, type_params]);
diff_struct!(TplElement, [span, cooked, raw, tail]);
diff_struct!(Str, [span, value, has_escape, kind]);
diff_struct!(
    ArrowExpr,
    [
        span,
        params,
        body,
        is_async,
        is_generator,
        type_params,
        return_type
    ]
);
diff_struct!(ClassExpr, [ident, class]);
diff_struct!(YieldExpr, [span, arg, delegate]);
diff_struct!(MetaPropExpr, [meta, prop]);
diff_struct!(AwaitExpr, [span, arg]);
diff_struct!(ParenExpr, [span, expr]);
diff_struct!(JSXMemberExpr, [obj, prop]);

/// Ignored
impl Diff for StrKind {
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
        DiffResult::Identical
    }
}
