use swc_ecma_ast::*;

diff_enum!(Pat, [Ident, Rest, Array, Object, Invalid]);
diff_enum!(PatOrExpr, [Pat, Expr]);
