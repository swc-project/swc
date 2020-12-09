//!
//!
//!
//! # Rules
//!
//!  - We abuse `Parameter.ref_path` to store type name.

pub(crate) use self::case::RenameRule;
use crate::parse::{KeyValue, Paren};
use syn::{parse2, Attribute, Field, Ident, Lit, LitStr, Meta};

mod case;

/// Search for `#[serde(rename_all = '')]`
pub(crate) fn get_rename_all(attrs: &[Attribute]) -> RenameRule {
    attrs
        .iter()
        .find_map(|attr| {
            //
            if !attr.path.is_ident("serde") {
                return None;
            }

            match parse2::<Paren<KeyValue<Ident, LitStr>>>(attr.tokens.clone()).map(|v| v.inner) {
                Ok(kv) if kv.key.to_string() == "rename_all" => {
                    Some(kv.value.value().parse().unwrap())
                }
                _ => None,
            }
        })
        .unwrap_or(RenameRule::None)
}

/// Search for `#[serde(rename = '')]`
fn get_rename(attrs: &[Attribute]) -> Option<String> {
    attrs.iter().find_map(|attr| {
        //
        if !attr.path.is_ident("serde") {
            return None;
        }

        // Handle #[serde(rename = "foo")]
        let meta = match parse2::<Paren<Meta>>(attr.tokens.clone()) {
            Ok(v) => v.inner,
            Err(..) => return None,
        };

        if meta.path().is_ident("rename") {
            return match meta {
                Meta::NameValue(meta) => match meta.lit {
                    Lit::Str(s) => Some(s.value()),
                    _ => None,
                },
                _ => None,
            };
        }

        return None;
    })
}

pub fn field_name(type_attrs: &[Attribute], field: &Field) -> String {
    if let Some(s) = get_rename(&field.attrs) {
        return s;
    }

    let rule = get_rename_all(type_attrs);

    rule.apply_to_field(&field.ident.as_ref().unwrap().to_string())
}
