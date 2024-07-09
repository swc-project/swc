use swc_ecma_ast::*;

impl_enum!(
    Decl,
    [
        Class,
        Fn,
        Var,
        TsInterface,
        TsTypeAlias,
        TsEnum,
        TsModule,
        Using
    ]
);

impl_struct!(ClassDecl, [ident, class]);
impl_struct!(FnDecl, [ident, function]);
impl_struct!(VarDecl, [span, ctxt, kind, declare, decls]);
impl_struct!(VarDeclarator, [span, name, init, definite]);
impl_struct!(UsingDecl, [span, is_await, decls]);
