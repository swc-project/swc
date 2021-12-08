use crate::flavor::Flavor;
use serde::Serializer;

pub(crate) fn serialize_optional<S>(o: &Option<bool>, s: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    return s.serialize_some(&o.unwrap_or(false));
}

/// Always serializes as a boolean value.
pub(crate) fn serialize_as_bool<S>(o: &Option<bool>, s: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    s.serialize_bool(o.unwrap_or(false))
}

pub(crate) fn skip_expression_for_fn<T>(_: T) -> bool {
    match Flavor::current() {
        Flavor::Acorn { .. } => false,
        Flavor::Babel => true,
    }
}

pub(crate) fn skip_interpreter<T>(_: T) -> bool {
    match Flavor::current() {
        Flavor::Acorn { .. } => true,
        Flavor::Babel => false,
    }
}

pub(crate) fn skip_typescript<T>(_: T) -> bool {
    match Flavor::current() {
        Flavor::Acorn { .. } => true,
        Flavor::Babel => false,
    }
}

pub(crate) fn should_emit_comments_on_program<T>(_: T) -> bool {
    match Flavor::current() {
        Flavor::Acorn { extra_comments } => extra_comments,
        _ => false,
    }
}
