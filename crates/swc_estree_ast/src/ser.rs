use crate::flavor::Flavor;
use serde::Serializer;

pub(crate) fn serialize_optional<S>(o: &Option<bool>, s: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    if matches!(Flavor::current(), Flavor::Acorn) {
        return s.serialize_some(&o.unwrap_or(false));
    }

    if o.is_none() {
        return s.serialize_none();
    }
    s.serialize_some(&o.unwrap())
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
        Flavor::Acorn => false,
        Flavor::Babel => true,
    }
}

pub(crate) fn skip_interpreter<T>(_: T) -> bool {
    match Flavor::current() {
        Flavor::Acorn => true,
        Flavor::Babel => false,
    }
}
