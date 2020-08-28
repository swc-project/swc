use super::Error;
use napi::{Env, JsUnknown};
use serde::{
    ser::{
        SerializeMap, SerializeSeq, SerializeStruct, SerializeStructVariant, SerializeTuple,
        SerializeTupleStruct, SerializeTupleVariant,
    },
    Serializer,
};

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
    outter_object: Handle<'j, JsUnknown>,
    inner: ArraySerializer<'env>,
}

#[doc(hidden)]
pub struct MapSerializer<'env> {
    env: &'env Env,
    object: Handle<'j, JsUnknown>,
    key_holder: Handle<'j, JsUnknown>,
}

#[doc(hidden)]
pub struct StructSerializer<'env> {
    env: &'env Env,
    object: Handle<'j, JsUnknown>,
}

#[doc(hidden)]
pub struct StructVariantSerializer<'env> {
    env: &'env Env,
    outer_object: Handle<'j, JsUnknown>,
    inner: StructSerializer<'env>,
}

impl<'env> Serializer for Ser<'env> {
    type Ok = JsUnknown;
    type Error = Error;

    type SerializeSeq = ArraySerializer<'env>;
    type SerializeTuple = ArraySerializer<'env>;
    type SerializeTupleStruct = ArraySerializer<'env>;

    type SerializeTupleVariant = TupleVariantSerializer<'env>;
    type SerializeMap = MapSerializer<'env>;
    type SerializeStruct = StructSerializer<'env>;
    type SerializeStructVariant = StructVariantSerializer<'env>;

    fn serialize_bool(self, v: bool) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.get_boolean(v)?.into_unknown()?)
    }

    fn serialize_i8(self, v: i8) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_int32(v as _)?.into_unknown()?)
    }

    fn serialize_i16(self, v: i16) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_int32(v as _)?.into_unknown()?)
    }

    fn serialize_i32(self, v: i32) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_int32(v)?.into_unknown()?)
    }

    fn serialize_i64(self, v: i64) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_int64(v)?.into_unknown()?)
    }

    fn serialize_u8(self, v: u8) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_uint32(v as _)?.into_unknown()?)
    }

    fn serialize_u16(self, v: u16) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_uint32(v as _)?.into_unknown()?)
    }

    fn serialize_u32(self, v: u32) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_uint32(v as _)?.into_unknown()?)
    }

    fn serialize_u64(self, v: u64) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_int64(v as _)?.into_unknown()?)
    }

    fn serialize_f32(self, v: f32) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_double(v as _)?.into_unknown()?)
    }

    fn serialize_f64(self, v: f64) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_double(v as _)?.into_unknown()?)
    }

    fn serialize_char(self, v: char) -> Result<Self::Ok, Self::Error> {
        Ok(self
            .env
            .create_string_from_std(v.to_string())?
            .into_unknown()?)
    }

    fn serialize_str(self, v: &str) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.create_string(v)?.into_unknown()?)
    }

    fn serialize_bytes(self, v: &[u8]) -> Result<Self::Ok, Self::Error> {
        Ok(self
            .env
            .create_buffer_with_data(v.to_vec())?
            .into_unknown()?)
    }

    fn serialize_none(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.get_null()?.into_unknown()?)
    }

    fn serialize_some<T: ?Sized>(self, value: &T) -> Result<Self::Ok, Self::Error>
    where
        T: serde::Serialize,
    {
        value.serialize(self)
    }

    fn serialize_unit(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.get_null()?.into_unknown()?)
    }

    fn serialize_unit_struct(self, name: &'static str) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.get_null()?.into_unknown()?)
    }

    fn serialize_unit_variant(
        self,
        name: &'static str,
        variant_index: u32,
        variant: &'static str,
    ) -> Result<Self::Ok, Self::Error> {
        self.serialize_str(variant)
    }

    fn serialize_newtype_struct<T: ?Sized>(
        self,
        name: &'static str,
        value: &T,
    ) -> Result<Self::Ok, Self::Error>
    where
        T: serde::Serialize,
    {
        value.serialize(self)
    }

    fn serialize_newtype_variant<T: ?Sized>(
        self,
        name: &'static str,
        variant_index: u32,
        variant: &'static str,
        value: &T,
    ) -> Result<Self::Ok, Self::Error>
    where
        T: serde::Serialize,
    {
        todo!()
    }

    fn serialize_seq(self, len: Option<usize>) -> Result<Self::SerializeSeq, Self::Error> {
        todo!()
    }

    fn serialize_tuple(self, len: usize) -> Result<Self::SerializeTuple, Self::Error> {
        todo!()
    }

    fn serialize_tuple_struct(
        self,
        name: &'static str,
        len: usize,
    ) -> Result<Self::SerializeTupleStruct, Self::Error> {
        todo!()
    }

    fn serialize_tuple_variant(
        self,
        name: &'static str,
        variant_index: u32,
        variant: &'static str,
        len: usize,
    ) -> Result<Self::SerializeTupleVariant, Self::Error> {
        todo!()
    }

    fn serialize_map(self, len: Option<usize>) -> Result<Self::SerializeMap, Self::Error> {
        todo!()
    }

    fn serialize_struct(
        self,
        name: &'static str,
        len: usize,
    ) -> Result<Self::SerializeStruct, Self::Error> {
        todo!()
    }

    fn serialize_struct_variant(
        self,
        name: &'static str,
        variant_index: u32,
        variant: &'static str,
        len: usize,
    ) -> Result<Self::SerializeStructVariant, Self::Error> {
        todo!()
    }
}

impl SerializeSeq for ArraySerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}

impl SerializeTuple for ArraySerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}

impl SerializeTupleStruct for ArraySerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}

impl SerializeTupleVariant for TupleVariantSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}

impl SerializeMap for MapSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}

impl SerializeStruct for StructSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}

impl SerializeStructVariant for StructVariantSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;
}
