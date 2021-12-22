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
diff_enum!(Lit, [Str, Bool, Null, BigInt, Num, Regex, JSXText]);
diff_enum!(JSXAttrOrSpread, [JSXAttr, SpreadElement]);
diff_enum!(Prop, [Shorthand, KeyValue, Assign, Getter, Setter, Method]);

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
diff_struct!(JSXNamespacedName, [ns, name]);
diff_enum!(JSXObject, [JSXMemberExpr, Ident]);
diff_struct!(JSXEmptyExpr, [span]);
diff_struct!(JSXElement, [span, opening, children, closing]);
diff_struct!(
    JSXOpeningElement,
    [span, name, attrs, self_closing, type_args]
);
diff_enum!(
    JSXElementChild,
    [
        JSXElement,
        JSXText,
        JSXSpreadChild,
        JSXExprContainer,
        JSXFragment
    ]
);
diff_struct!(JSXAttr, [span, name, value]);
diff_enum!(JSXAttrName, [Ident, JSXNamespacedName]);
diff_enum!(
    JSXAttrValue,
    [Lit, JSXExprContainer, JSXElement, JSXFragment]
);
diff_struct!(JSXClosingElement, [span, name]);
diff_struct!(JSXFragment, [span, opening, children, closing]);
diff_enum!(JSXElementName, [Ident, JSXMemberExpr, JSXNamespacedName]);
diff_struct!(JSXOpeningFragment, [span]);
diff_struct!(JSXClosingFragment, [span]);
diff_struct!(JSXSpreadChild, [span, expr]);
diff_struct!(JSXExprContainer, [span, expr]);
diff_enum!(JSXExpr, [JSXEmptyExpr, Expr]);
diff_struct!(PrivateName, [span, id]);
diff_struct!(OptChainExpr, [span, question_dot_token, expr]);
diff_struct!(SpreadElement, [dot3_token, expr]);
diff_struct!(Super, [span]);
diff_struct!(Bool, [span, value]);
diff_struct!(Null, [span]);
diff_struct!(Number, [span, value]);
diff_struct!(BigInt, [span, value]);
diff_struct!(Regex, [span, exp, flags]);
diff_struct!(JSXText, [span, value, raw]);
diff_struct!(AssignProp, [key, value]);
diff_struct!(KeyValueProp, [key, value]);
diff_struct!(GetterProp, [span, key, type_ann, body]);
diff_struct!(SetterProp, [span, key, param, body]);
diff_struct!(MethodProp, [key, function]);
diff_enum!(PropName, [Ident, Str, BigInt, Num, Computed]);
diff_struct!(ComputedPropName, [span, expr]);
diff_struct!(BindingIdent, [id, type_ann]);

/// Ignored
impl Diff for StrKind {
    fn diff(&mut self, _: &mut Self, _: &mut Ctx) -> DiffResult {
        DiffResult::Identical
    }
}

trivial!(Tpl);
