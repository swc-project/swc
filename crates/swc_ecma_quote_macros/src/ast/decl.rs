use swc_ecma_ast::*;

impl_enum!(
    Decl,
    [Class, Fn, Var, TsInterface, TsTypeAlias, TsEnum, TsModule]
);

impl_struct!(ClassDecl, [ident, class]);
impl_struct!(FnDecl, [ident, function]);
impl_struct!(VarDecl, [span, kind, declare, decls]);
impl_struct!(VarDeclarator, [span, name, init, definite]);
