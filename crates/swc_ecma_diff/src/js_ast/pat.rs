use swc_ecma_ast::*;

diff_enum!(Pat, [Ident, Rest, Array, Object, Invalid, Assign, Expr]);
diff_enum!(PatOrExpr, [Pat, Expr]);
diff_struct!(ArrayPat, [span, elems, optional, type_ann]);
diff_struct!(ObjectPat, [span, props, optional, type_ann]);
diff_struct!(RestPat, [span, dot3_token, arg, type_ann]);
diff_struct!(AssignPat, [span, left, right, type_ann]);

diff_enum!(ObjectPatProp, [KeyValue, Assign, Rest]);
diff_struct!(KeyValuePatProp, [key, value]);
diff_struct!(AssignPatProp, [span, key, value]);
