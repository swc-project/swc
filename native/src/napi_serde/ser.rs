use super::Error;
use napi::{Env, JsObject};
use serde::Serializer;

pub(super) struct Ser<'env> {
    pub env: &'env Env,
}

#[doc(hidden)]
pub struct ArraySerializer<'env> {
    env: &'env Env,
    array: Handle<'j, JsArray>,
}

#[doc(hidden)]
pub struct TupleVariantSerializer<'env> {
    env: &'env Env,
    outter_object: Handle<'j, JsObject>,
    inner: ArraySerializer<'env>,
}

#[doc(hidden)]
pub struct MapSerializer<'env> {
    env: &'env Env,
    object: Handle<'j, JsObject>,
    key_holder: Handle<'j, JsObject>,
}

#[doc(hidden)]
pub struct StructSerializer<'env> {
    env: &'env Env,
    object: Handle<'j, JsObject>,
}

#[doc(hidden)]
pub struct StructVariantSerializer<'env> {
    env: &'env Env,
    outer_object: Handle<'j, JsObject>,
    inner: StructSerializer<'env>,
}

impl<'env> Serializer for Ser<'env> {
    type Ok = JsObject;
    type Error = Error;

    type SerializeSeq = ArraySerializer<'env>;
    type SerializeTuple = ArraySerializer<'env>;
    type SerializeTupleStruct = ArraySerializer<'env>;

    type SerializeTupleVariant = TupleVariantSerializer<'env>;
    type SerializeMap = MapSerializer<'env>;
    type SerializeStruct = StructSerializer<'env>;
    type SerializeStructVariant = StructVariantSerializer<'env>;
}
