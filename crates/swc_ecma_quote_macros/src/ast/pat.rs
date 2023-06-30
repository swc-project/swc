use swc_ecma_ast::*;

impl_struct!(BindingIdent, [id, type_ann]);
impl_struct!(ArrayPat, [span, elems, optional, type_ann]);
impl_struct!(ObjectPat, [span, props, optional, type_ann]);
impl_struct!(RestPat, [span, dot3_token, arg, type_ann]);
impl_struct!(AssignPat, [span, left, right]);
impl_struct!(Param, [span, decorators, pat]);
