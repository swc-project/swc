use swc_ecma_ast::*;

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

diff_struct!(ThisExpr, [span]);
diff_struct!(ArrayLit, [span, elems]);
diff_struct!(ExprOrSpread, [spread, expr]);
diff_struct!(ObjectLit, [span, props]);
diff_struct!(FnExpr, [ident, function]);
diff_struct!(UnaryExpr, [span, op, arg]);
