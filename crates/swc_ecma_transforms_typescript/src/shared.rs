use swc_atoms::Wtf8Atom;
use swc_ecma_ast::TsEnumMemberId;

/// Returns an enum member name without discarding lone surrogates.
#[inline]
pub(crate) fn enum_member_name(id: &TsEnumMemberId) -> Wtf8Atom {
    match id {
        TsEnumMemberId::Ident(ident) => ident.sym.clone().into(),
        TsEnumMemberId::Str(str_lit) => str_lit.value.clone(),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}
