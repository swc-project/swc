use super::Error;
use napi::{Env, JsObject, JsUnknown, Status};
use serde::{
    ser::{
        SerializeMap, SerializeSeq, SerializeStruct, SerializeStructVariant, SerializeTuple,
        SerializeTupleStruct, SerializeTupleVariant,
    },
    Serialize, Serializer,
};

pub fn serialize<T>(env: &Env, node: &T) -> napi::Result<napi::JsUnknown>
where
    T: Serialize,
{
    let s = Ser { env };
    match node.serialize(s) {
        Ok(v) => Ok(v),
        Err(err) => match err {
            Error::Normal(v) => Err(napi::Error::new(Status::GenericFailure, format!("{:?}", v))),
            Error::Napi(err) => Err(err),
        },
    }
}

struct Ser<'env> {
    env: &'env Env,
}

#[doc(hidden)]
struct ArraySerializer<'env> {
    env: &'env Env,
    array: JsObject,
}

#[doc(hidden)]
struct TupleVariantSerializer<'env> {
    outter_object: JsObject,
    inner: ArraySerializer<'env>,
}

#[doc(hidden)]
struct MapSerializer<'env> {
    env: &'env Env,
    object: JsObject,
    key_holder: JsObject,
}

#[doc(hidden)]
struct StructSerializer<'env> {
    env: &'env Env,
    object: JsObject,
}

#[doc(hidden)]
struct StructVariantSerializer<'env> {
    outer_object: JsObject,
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

    fn serialize_unit_struct(self, _name: &'static str) -> Result<Self::Ok, Self::Error> {
        Ok(self.env.get_null()?.into_unknown()?)
    }

    fn serialize_unit_variant(
        self,
        _name: &'static str,
        _variant_index: u32,
        variant: &'static str,
    ) -> Result<Self::Ok, Self::Error> {
        self.serialize_str(variant)
    }

    fn serialize_newtype_struct<T: ?Sized>(
        self,
        _name: &'static str,
        value: &T,
    ) -> Result<Self::Ok, Self::Error>
    where
        T: serde::Serialize,
    {
        value.serialize(self)
    }

    fn serialize_newtype_variant<T: ?Sized>(
        self,
        _name: &'static str,
        _variant_index: u32,
        variant: &'static str,
        value: &T,
    ) -> Result<Self::Ok, Self::Error>
    where
        T: serde::Serialize,
    {
        let mut obj = self.env.create_object()?;
        let value = serialize(&self.env, &value)?;
        obj.set_named_property(variant, value)?;
        Ok(obj.into_unknown()?)
    }

    fn serialize_seq(self, len: Option<usize>) -> Result<Self::SerializeSeq, Self::Error> {
        Ok(ArraySerializer {
            env: self.env,
            array: self.env.create_array_with_length(len.unwrap_or(0))?,
        })
    }

    fn serialize_tuple(self, len: usize) -> Result<Self::SerializeTuple, Self::Error> {
        Ok(ArraySerializer {
            env: self.env,
            array: self.env.create_array_with_length(len)?,
        })
    }

    fn serialize_tuple_struct(
        self,
        _name: &'static str,
        len: usize,
    ) -> Result<Self::SerializeTupleStruct, Self::Error> {
        Ok(ArraySerializer {
            env: self.env,
            array: self.env.create_array_with_length(len)?,
        })
    }

    fn serialize_tuple_variant(
        self,
        _name: &'static str,
        _variant_index: u32,
        _variant: &'static str,
        len: usize,
    ) -> Result<Self::SerializeTupleVariant, Self::Error> {
        Ok(TupleVariantSerializer {
            outter_object: self.env.create_object()?,
            inner: ArraySerializer {
                env: self.env,
                array: self.env.create_array_with_length(len)?,
            },
        })
    }

    fn serialize_map(self, _len: Option<usize>) -> Result<Self::SerializeMap, Self::Error> {
        Ok(MapSerializer {
            env: self.env,
            object: self.env.create_object()?,
            key_holder: self.env.create_object()?,
        })
    }

    fn serialize_struct(
        self,
        _name: &'static str,
        _len: usize,
    ) -> Result<Self::SerializeStruct, Self::Error> {
        Ok(StructSerializer {
            env: self.env,
            object: self.env.create_object()?,
        })
    }

    fn serialize_struct_variant(
        self,
        _name: &'static str,
        _variant_index: u32,
        _variant: &'static str,
        _len: usize,
    ) -> Result<Self::SerializeStructVariant, Self::Error> {
        Ok(StructVariantSerializer {
            outer_object: self.env.create_object()?,
            inner: StructSerializer {
                env: self.env,
                object: self.env.create_object()?,
            },
        })
    }
}

impl SerializeSeq for ArraySerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_element<T: ?Sized>(&mut self, value: &T) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        let value = serialize(self.env, &value)?;
        let cur_len = self.array.get_array_length()?;
        self.array.set_index(cur_len as _, value)?;
        Ok(())
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.array.into_unknown()?)
    }
}

impl SerializeTuple for ArraySerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_element<T: ?Sized>(&mut self, value: &T) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        SerializeSeq::serialize_element(self, value)
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        SerializeSeq::end(self)
    }
}

impl SerializeTupleStruct for ArraySerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_field<T: ?Sized>(&mut self, value: &T) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        SerializeSeq::serialize_element(self, value)
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        SerializeSeq::end(self)
    }
}

impl SerializeTupleVariant for TupleVariantSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_field<T: ?Sized>(&mut self, value: &T) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        SerializeSeq::serialize_element(&mut self.inner, value)
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.outter_object.into_unknown()?)
    }
}

impl SerializeMap for MapSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_key<T: ?Sized>(&mut self, key: &T) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        let key = serialize(self.env, &key)?;
        self.key_holder.set_named_property("key", key)?;
        Ok(())
    }

    fn serialize_value<T: ?Sized>(&mut self, value: &T) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        let key = self.key_holder.get_named_property("key")?;
        let value = serialize(self.env, &value)?;
        self.object.set_property(key, value)?;
        Ok(())
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.object.into_unknown()?)
    }
}

impl SerializeStruct for StructSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_field<T: ?Sized>(
        &mut self,
        key: &'static str,
        value: &T,
    ) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        let value = serialize(self.env, &value)?;
        self.object.set_named_property(key, value)?;
        Ok(())
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.object.into_unknown()?)
    }
}

impl SerializeStructVariant for StructVariantSerializer<'_> {
    type Ok = JsUnknown;
    type Error = Error;

    fn serialize_field<T: ?Sized>(
        &mut self,
        key: &'static str,
        value: &T,
    ) -> Result<(), Self::Error>
    where
        T: serde::Serialize,
    {
        SerializeStruct::serialize_field(&mut self.inner, key, value)?;
        Ok(())
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(self.outer_object.into_unknown()?)
    }
}
