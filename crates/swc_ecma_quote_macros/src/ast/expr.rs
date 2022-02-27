use swc_ecma_ast::*;

impl_struct!(ThisExpr, [span]);
impl_struct!(ArrayLit, [span, elems]);
impl_struct!(ObjectLit, [span, props]);
impl_struct!(FnExpr, [ident, function]);
impl_struct!(
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
impl_struct!(ClassExpr, [ident, class]);
impl_struct!(Tpl, [exprs, quasis]);
impl_struct!(UnaryExpr, [span, op, arg]);
impl_struct!(UpdateExpr, [span, op, prefix, arg]);
impl_struct!(BinExpr, [span, op, left, right]);
impl_struct!(AssignExpr, [span, op, left, right]);
impl_struct!(MemberExpr, [span, obj, prop]);
impl_struct!(SuperPropExpr, [span, obj, prop]);
impl_struct!(CondExpr, [span, test, cons, alt]);

impl_struct!(CallExpr, [span, callee, args, type_args]);
impl_struct!(ExprOrSpread, [spread, expr]);
impl_struct!(Super, [span]);
impl_struct!(Import, [span]);
impl_struct!(NewExpr, [span, callee, args, type_args]);
impl_struct!(SeqExpr, [span, exprs]);

impl_struct!(TaggedTpl, [span, tag, type_params, tpl]);
impl_struct!(YieldExpr, [span, arg, delegate]);
impl_struct!(MetaPropExpr, [span, kind]);
impl_struct!(AwaitExpr, [span, arg]);
impl_struct!(JSXMemberExpr, [obj, prop]);
impl_struct!(JSXNamespacedName, [ns, name]);
impl_struct!(JSXEmptyExpr, [span]);
impl_struct!(JSXElement, [span, opening, closing, children]);
impl_struct!(JSXFragment, [span, opening, closing, children]);
impl_struct!(OptChainExpr, [span, question_dot_token, base]);

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

impl_struct!(TplElement, [span, tail, cooked, raw]);

impl_struct!(
    JSXOpeningElement,
    [name, span, attrs, self_closing, type_args]
);
impl_struct!(JSXClosingElement, [name, span]);

impl_struct!(JSXOpeningFragment, [span]);
impl_struct!(JSXClosingFragment, [span]);
