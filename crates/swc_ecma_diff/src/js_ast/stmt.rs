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
