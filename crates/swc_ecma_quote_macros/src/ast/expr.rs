use swc_ecma_ast::*;

impl_enum!(AssignTarget, [Simple, Pat], true);
impl_enum!(
    SimpleAssignTarget,
    [
        Ident,
        Member,
        SuperProp,
        Paren,
        OptChain,
        TsAs,
        TsNonNull,
        TsSatisfies,
        TsTypeAssertion,
        TsInstantiation,
        Invalid
    ]
);
impl_enum!(AssignTargetPat, [Array, Object, Invalid]);
impl_enum!(
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
        SuperProp,
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
        TsInstantiation,
        TsSatisfies,
        PrivateName,
        OptChain,
        Invalid
    ],
    true
);

impl_struct!(ThisExpr, [span]);
impl_struct!(ArrayLit, [span, elems]);
impl_struct!(ObjectLit, [span, props]);
impl_struct!(FnExpr, [ident, function]);
impl_struct!(
    ArrowExpr,
    [
        span,
        ctxt,
        params,
        body,
        is_async,
        is_generator,
        type_params,
        return_type
    ]
);
impl_struct!(ClassExpr, [ident, class]);
impl_struct!(Tpl, [span, exprs, quasis]);
impl_struct!(UnaryExpr, [span, op, arg]);
impl_struct!(UpdateExpr, [span, op, prefix, arg]);
impl_struct!(BinExpr, [span, op, left, right]);
impl_struct!(AssignExpr, [span, op, left, right]);
impl_struct!(MemberExpr, [span, obj, prop]);
impl_struct!(SuperPropExpr, [span, obj, prop]);
impl_struct!(CondExpr, [span, test, cons, alt]);

impl_struct!(CallExpr, [span, ctxt, callee, args, type_args]);
impl_struct!(ExprOrSpread, [spread, expr]);
impl_struct!(Super, [span]);
impl_struct!(Import, [span, phase]);
impl_struct!(NewExpr, [span, ctxt, callee, args, type_args]);
impl_struct!(SeqExpr, [span, exprs]);

impl_struct!(TaggedTpl, [span, ctxt, tag, type_params, tpl]);
impl_struct!(YieldExpr, [span, arg, delegate]);
impl_struct!(MetaPropExpr, [span, kind]);
impl_struct!(AwaitExpr, [span, arg]);
impl_struct!(JSXMemberExpr, [span, obj, prop]);
impl_struct!(JSXNamespacedName, [span, ns, name]);
impl_struct!(JSXEmptyExpr, [span]);
impl_struct!(JSXElement, [span, opening, closing, children]);
impl_struct!(JSXFragment, [span, opening, closing, children]);
impl_struct!(OptChainExpr, [span, optional, base]);

impl_struct!(ParenExpr, [span, expr]);
impl_struct!(
    Function,
    [
        ctxt,
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

impl_struct!(SpreadElement, [dot3_token, expr]);

impl_struct!(JSXExprContainer, [span, expr]);
impl_struct!(JSXSpreadChild, [span, expr]);

impl_struct!(JSXAttr, [span, name, value]);

impl_enum!(
    JSXAttrValue,
    [Lit, JSXExprContainer, JSXElement, JSXFragment]
);

impl_enum!(JSXAttrName, [Ident, JSXNamespacedName]);

impl_enum!(JSXExpr, [Expr, JSXEmptyExpr]);

impl_struct!(OptCall, [span, ctxt, callee, args, type_args]);

impl_enum!(Callee, [Super, Import, Expr]);
