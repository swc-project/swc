use syn::Attribute;

pub fn remove_flatten_attrs(attrs: &mut Vec<Attribute>) {
    attrs.retain(|attr| {
        if attr.path.is_ident("flavor") {
            return false;
        }

        true
    })
}
