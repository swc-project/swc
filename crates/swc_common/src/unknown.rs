use cbor4ii::core::{dec, enc};

use crate::eq::EqIgnoreSpan;

#[derive(Clone)]
pub struct Unknown(cbor4ii::core::BoxedRawValue);

impl enc::Encode for Unknown {
    fn encode<W: enc::Write>(&self, writer: &mut W) -> Result<(), enc::Error<W::Error>> {
        self.0.encode(writer)
    }
}

impl<'de> dec::Decode<'de> for Unknown {
    fn decode<R: dec::Read<'de>>(reader: &mut R) -> Result<Self, dec::Error<R::Error>> {
        cbor4ii::core::BoxedRawValue::decode(reader).map(Unknown)
    }
}

impl PartialEq for Unknown {
    fn eq(&self, other: &Self) -> bool {
        self.0.as_bytes() == other.0.as_bytes()
    }
}

impl Eq for Unknown {}

impl EqIgnoreSpan for Unknown {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.0.as_bytes() == other.0.as_bytes()
    }
}

impl std::hash::Hash for Unknown {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.0.as_bytes().hash(state)
    }
}

impl std::fmt::Debug for Unknown {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Unknown")
    }
}

impl serde::Serialize for Unknown {
    fn serialize<S>(&self, _serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        use serde::ser::Error;

        Err(S::Error::custom("cannot serialize unknown type"))
    }
}

impl<'de> serde::Deserialize<'de> for Unknown {
    fn deserialize<D>(_deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use serde::de::Error;

        Err(D::Error::custom("cannot deserialize unknown type"))
    }
}

#[cfg(feature = "arbitrary")]
impl<'a> arbitrary::Arbitrary<'a> for Unknown {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        use cbor4ii::core::{BoxedRawValue, Value};

        let mut list = Vec::new();
        for _ in 0..u.arbitrary_len::<u64>()? {
            let n = u.int_in_range::<u64>(0..=102410241024)?;
            list.push(Value::Integer(n.into()));
        }
        let value = Value::Array(list);
        let value =
            BoxedRawValue::from_value(&value).map_err(|_| arbitrary::Error::IncorrectFormat)?;
        Ok(Unknown(value))
    }
}

#[cfg(feature = "shrink-to-fit")]
impl shrink_to_fit::ShrinkToFit for Unknown {
    fn shrink_to_fit(&mut self) {}
}
