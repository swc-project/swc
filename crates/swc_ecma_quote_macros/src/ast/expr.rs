use swc_ecma_ast::*;

fail_todo!(ThisExpr);
fail_todo!(ArrayLit);
fail_todo!(ObjectLit);
fail_todo!(FnExpr);
fail_todo!(ArrowExpr);
fail_todo!(ClassExpr);
fail_todo!(Tpl);
impl_struct!(UnaryExpr, [span, op, arg]);
impl_struct!(UpdateExpr, [span, op, prefix, arg]);
impl_struct!(BinExpr, [span, op, left, right]);
impl_struct!(AssignExpr, [span, op, left, right]);
fail_todo!(MemberExpr);
fail_todo!(SuperPropExpr);
fail_todo!(CondExpr);

impl_struct!(CallExpr, [span, callee, args, type_args]);
impl_struct!(ExprOrSpread, [spread, expr]);
impl_struct!(Super, [span]);
impl_struct!(Import, [span]);
impl_struct!(NewExpr, [span, callee, args, type_args]);
impl_struct!(SeqExpr, [span, exprs]);

fail_todo!(TaggedTpl);
impl_struct!(YieldExpr, [span, arg, delegate]);
fail_todo!(MetaPropExpr);
fail_todo!(AwaitExpr);
fail_todo!(JSXMemberExpr);
fail_todo!(JSXNamespacedName);
fail_todo!(JSXEmptyExpr);
fail_todo!(JSXElement);
fail_todo!(JSXFragment);
fail_todo!(OptChainExpr);

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
impl_struct!(
    Class,
    [
        span,
        decorators,
        body,
        super_class,
        is_abstract,
        type_params,
        super_type_params,
        implements
    ]
);
impl_struct!(Decorator, [span, expr]);
