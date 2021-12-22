use swc_ecma_ast::*;

diff_enum!(
    Stmt,
    [
        Block, Empty, Debugger, With, Return, Labeled, Break, Continue, If, Switch, Throw, Try,
        While, DoWhile, For, ForIn, ForOf, Decl, Expr
    ]
);

diff_struct!(BlockStmt, [span, stmts]);
diff_struct!(EmptyStmt, [span]);
diff_struct!(DebuggerStmt, [span]);
diff_struct!(WithStmt, [span, obj, body]);
diff_struct!(ReturnStmt, [span, arg]);
diff_struct!(ThrowStmt, [span, arg]);
diff_struct!(LabeledStmt, [span, label, body]);
diff_struct!(BreakStmt, [span, label]);
diff_struct!(ContinueStmt, [span, label]);
diff_struct!(IfStmt, [span, test, cons, alt]);
diff_struct!(SwitchStmt, [span, discriminant, cases]);
diff_struct!(SwitchCase, [span, test, cons]);
diff_struct!(TryStmt, [span, block, handler, finalizer]);
diff_struct!(WhileStmt, [span, test, body]);
diff_struct!(DoWhileStmt, [span, test, body]);
diff_struct!(ForStmt, [span, init, test, update, body]);
diff_struct!(ForInStmt, [span, left, right, body]);
diff_struct!(ForOfStmt, [span, left, right, body, await_token]);
diff_struct!(ExprStmt, [span, expr]);

diff_struct!(CatchClause, [span, param, body]);

diff_enum!(VarDeclOrPat, [VarDecl, Pat]);
diff_enum!(VarDeclOrExpr, [VarDecl, Expr]);

diff_enum!(
    Decl,
    [Class, Fn, TsInterface, TsTypeAlias, TsEnum, TsModule]
);

diff_struct!(VarDecl, [span, kind, decls, declare]);
diff_struct!(VarDeclarator, [span, name, init, definite]);
diff_struct!(ClassDecl, [ident, class, declare]);
diff_struct!(FnDecl, [ident, function, declare]);

diff_struct!(
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

diff_struct!(Param, [span, decorators, pat]);
diff_struct!(
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
diff_enum!(
    ClassMember,
    [
        Constructor,
        Method,
        PrivateMethod,
        ClassProp,
        PrivateProp,
        TsIndexSignature,
        Empty,
        StaticBlock
    ]
);
diff_struct!(
    Constructor,
    [span, params, body, key, accessibility, is_optional]
);
diff_enum!(ParamOrTsParamProp, [Param, TsParamProp]);
