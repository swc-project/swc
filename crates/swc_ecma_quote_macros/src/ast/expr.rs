use swc_ecma_ast::*;

impl_struct!(ThisExpr);
impl_struct!(ArrayLit);
impl_struct!(ObjectLit);
impl_struct!(FnExpr);
impl_struct!(ArrowExpr);
impl_struct!(ClassExpr);
impl_struct!(Tpl);
impl_struct!(UnaryExpr, [span, op, arg]);
impl_struct!(UpdateExpr, [span, op, prefix, arg]);
impl_struct!(BinExpr, [span, op, left, right]);
impl_struct!(AssignExpr, [span, op, left, right]);
impl_struct!(MemberExpr);
impl_struct!(SuperPropExpr);
impl_struct!(CondExpr);

impl_struct!(CallExpr, [span, callee, args, type_args]);
impl_struct!(ExprOrSpread, [spread, expr]);
impl_struct!(Super, [span]);
impl_struct!(Import, [span]);
impl_struct!(NewExpr, [span, callee, args, type_args]);
impl_struct!(SeqExpr, [span, exprs]);

impl_struct!(TaggedTpl);
impl_struct!(YieldExpr, [span, arg, delegate]);
impl_struct!(MetaPropExpr);
impl_struct!(AwaitExpr);
impl_struct!(JSXMemberExpr);
impl_struct!(JSXNamespacedName);
impl_struct!(JSXEmptyExpr);
impl_struct!(JSXElement);
impl_struct!(JSXFragment);
impl_struct!(OptChainExpr);

impl_struct!(ParenExpr, [span, expr]);
impl_struct!(
    Function,
    [
        params,
        decorators,
        span,
        body,
        is_generator,
        is_async,
        type_params,
        return_type
    ]
);
impl_struct!(Decorator, [span, expr]);
