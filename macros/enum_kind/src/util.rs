use syn::*;

pub fn is_bool(ty: &Type) -> bool {
    match *ty {
        Type::Path(TypePath {
            qself: None,
            path:
                Path {
                    leading_colon: None,
                    ref segments,
                },
        }) => {
            // check for bool
            if segments.len() == 1 && segments.first().unwrap().item().ident.sym.as_str() == "bool"
            {
                return true;
            }
        }
        _ => {}
    }

    false
}

pub fn is_attr_name(attr: &Attribute, name: &str) -> bool {
    match *attr {
        Attribute {
            path:
                Path {
                    leading_colon: None,
                    ref segments,
                },
            is_sugared_doc: false,
            ..
        } if segments.len() == 1 =>
        {
            segments.first().unwrap().into_item().ident == name
        }
        _ => false,
    }
}
