use swc_atoms::Wtf8Atom;
use swc_ecma_ast::{Ident, TsEntityName, TsEnumMemberId};

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

/// Returns the root identifier of an entity name chain like `A.B.C`.
pub(crate) fn get_module_ident(ts_entity_name: &TsEntityName) -> &Ident {
    match ts_entity_name {
        TsEntityName::TsQualifiedName(ts_qualified_name) => {
            get_module_ident(&ts_qualified_name.left)
        }
        TsEntityName::Ident(ident) => ident,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}
