// FlatMapSerializer implementation copied from serde 1.0.219
// This is needed because serde::__private is not available in serde 1.0.220+

use serde::ser::{self, Serialize, SerializeMap, Serializer};

/// A serializer that delegates to a `SerializeMap` for serializing struct
/// fields. This allows flattening struct fields into a parent map structure.
pub struct FlatMapSerializer<'a, M: 'a>(pub &'a mut M);

impl<'a, M> Serializer for FlatMapSerializer<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();
    type SerializeMap = FlatMapSerializeMap<'a, M>;
    type SerializeSeq = FlatMapSerializeSeq<'a, M>;
    type SerializeStruct = FlatMapSerializeStruct<'a, M>;
    type SerializeStructVariant = FlatMapSerializeStructVariant<'a, M>;
    type SerializeTuple = FlatMapSerializeTuple<'a, M>;
    type SerializeTupleStruct = FlatMapSerializeTupleStruct<'a, M>;
    type SerializeTupleVariant = FlatMapSerializeTupleVariant<'a, M>;

    fn serialize_bool(self, _v: bool) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten bool"))
    }

    fn serialize_i8(self, _v: i8) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten i8"))
    }

    fn serialize_i16(self, _v: i16) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten i16"))
    }

    fn serialize_i32(self, _v: i32) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten i32"))
    }

    fn serialize_i64(self, _v: i64) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten i64"))
    }

    fn serialize_u8(self, _v: u8) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten u8"))
    }

    fn serialize_u16(self, _v: u16) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten u16"))
    }

    fn serialize_u32(self, _v: u32) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten u32"))
    }

    fn serialize_u64(self, _v: u64) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten u64"))
    }

    fn serialize_f32(self, _v: f32) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten f32"))
    }

    fn serialize_f64(self, _v: f64) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten f64"))
    }

    fn serialize_char(self, _v: char) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten char"))
    }

    fn serialize_str(self, _v: &str) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten str"))
    }

    fn serialize_bytes(self, _v: &[u8]) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten bytes"))
    }

    fn serialize_none(self) -> Result<Self::Ok, Self::Error> {
        Ok(())
    }

    fn serialize_some<T>(self, value: &T) -> Result<Self::Ok, Self::Error>
    where
        T: ?Sized + Serialize,
    {
        value.serialize(self)
    }

    fn serialize_unit(self) -> Result<Self::Ok, Self::Error> {
        Ok(())
    }

    fn serialize_unit_struct(self, _name: &'static str) -> Result<Self::Ok, Self::Error> {
        Ok(())
    }

    fn serialize_unit_variant(
        self,
        _name: &'static str,
        _variant_index: u32,
        variant: &'static str,
    ) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom(format_args!(
            "cannot flatten enum variant `{variant}`"
        )))
    }

    fn serialize_newtype_struct<T>(
        self,
        _name: &'static str,
        value: &T,
    ) -> Result<Self::Ok, Self::Error>
    where
        T: ?Sized + Serialize,
    {
        value.serialize(self)
    }

    fn serialize_newtype_variant<T>(
        self,
        _name: &'static str,
        _variant_index: u32,
        variant: &'static str,
        _value: &T,
    ) -> Result<Self::Ok, Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom(format_args!(
            "cannot flatten enum variant `{variant}`"
        )))
    }

    fn serialize_seq(self, _len: Option<usize>) -> Result<Self::SerializeSeq, Self::Error> {
        Ok(FlatMapSerializeSeq(self.0))
    }

    fn serialize_tuple(self, _len: usize) -> Result<Self::SerializeTuple, Self::Error> {
        Ok(FlatMapSerializeTuple(self.0))
    }

    fn serialize_tuple_struct(
        self,
        _name: &'static str,
        _len: usize,
    ) -> Result<Self::SerializeTupleStruct, Self::Error> {
        Ok(FlatMapSerializeTupleStruct(self.0))
    }

    fn serialize_tuple_variant(
        self,
        _name: &'static str,
        _variant_index: u32,
        variant: &'static str,
        _len: usize,
    ) -> Result<Self::SerializeTupleVariant, Self::Error> {
        Err(ser::Error::custom(format_args!(
            "cannot flatten enum variant `{variant}`",
        )))
    }

    fn serialize_map(self, _len: Option<usize>) -> Result<Self::SerializeMap, Self::Error> {
        Ok(FlatMapSerializeMap(self.0))
    }

    fn serialize_struct(
        self,
        _name: &'static str,
        _len: usize,
    ) -> Result<Self::SerializeStruct, Self::Error> {
        Ok(FlatMapSerializeStruct(self.0))
    }

    fn serialize_struct_variant(
        self,
        _name: &'static str,
        _variant_index: u32,
        variant: &'static str,
        _len: usize,
    ) -> Result<Self::SerializeStructVariant, Self::Error> {
        Err(ser::Error::custom(format_args!(
            "cannot flatten enum variant `{variant}`"
        )))
    }
}

#[allow(dead_code)]
pub struct FlatMapSerializeSeq<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeSeq for FlatMapSerializeSeq<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_element<T>(&mut self, _value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten sequence"))
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten sequence"))
    }
}

#[allow(dead_code)]
pub struct FlatMapSerializeTuple<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeTuple for FlatMapSerializeTuple<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_element<T>(&mut self, _value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten tuple"))
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten tuple"))
    }
}

#[allow(dead_code)]
pub struct FlatMapSerializeTupleStruct<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeTupleStruct for FlatMapSerializeTupleStruct<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_field<T>(&mut self, _value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten tuple struct"))
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten tuple struct"))
    }
}

#[allow(dead_code)]
pub struct FlatMapSerializeTupleVariant<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeTupleVariant for FlatMapSerializeTupleVariant<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_field<T>(&mut self, _value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten tuple variant"))
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten tuple variant"))
    }
}

pub struct FlatMapSerializeMap<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeMap for FlatMapSerializeMap<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_key<T>(&mut self, _key: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten map"))
    }

    fn serialize_value<T>(&mut self, _value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten map"))
    }

    fn serialize_entry<K, V>(&mut self, key: &K, value: &V) -> Result<(), Self::Error>
    where
        K: ?Sized + Serialize,
        V: ?Sized + Serialize,
    {
        self.0.serialize_entry(key, value)
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(())
    }
}

pub struct FlatMapSerializeStruct<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeStruct for FlatMapSerializeStruct<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_field<T>(&mut self, key: &'static str, value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        self.0.serialize_entry(key, value)
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Ok(())
    }
}

#[allow(dead_code)]
pub struct FlatMapSerializeStructVariant<'a, M: 'a>(&'a mut M);

impl<'a, M> ser::SerializeStructVariant for FlatMapSerializeStructVariant<'a, M>
where
    M: SerializeMap + 'a,
{
    type Error = M::Error;
    type Ok = ();

    fn serialize_field<T>(&mut self, _key: &'static str, _value: &T) -> Result<(), Self::Error>
    where
        T: ?Sized + Serialize,
    {
        Err(ser::Error::custom("cannot flatten struct variant"))
    }

    fn end(self) -> Result<Self::Ok, Self::Error> {
        Err(ser::Error::custom("cannot flatten struct variant"))
    }
}
