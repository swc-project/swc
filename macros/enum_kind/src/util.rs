use syn::*;

pub fn is_bool(ty: &Type) -> bool {
    if let Type::Path(TypePath {
        qself: None,
        path: Path {
            leading_colon: None,
            ref segments,
        },
    }) = ty
    {
        // check for bool
        if segments.len() == 1 && segments.first().unwrap().ident == "bool" {
            return true;
        }
    }

    false
}
