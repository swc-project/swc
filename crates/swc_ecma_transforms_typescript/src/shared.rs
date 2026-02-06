use swc_atoms::Atom;
use swc_ecma_ast::{Ident, TsEntityName, TsEnumMemberId};

/// Returns enum member key as an atom for record lookup.
#[inline]
pub(crate) fn enum_member_id_atom(id: &TsEnumMemberId) -> Atom {
    match id {
        TsEnumMemberId::Ident(ident) => ident.sym.clone(),
        TsEnumMemberId::Str(str_lit) => str_lit.value.to_atom_lossy().into_owned(),
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
