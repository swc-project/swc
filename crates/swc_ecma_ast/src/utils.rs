use cbor4ii::core::{ dec, enc, error, types };

pub(crate) struct ArrayOption<T>(pub T);

impl<T: enc::Encode> enc::Encode for ArrayOption<&'_ Vec<Option<T>>> {
    fn encode<W: enc::Write>(&self, writer: &mut W) -> Result<(), enc::Error<W::Error>> {
        <types::Array<()>>::bounded(self.0.len(), writer)?;
        for item in self.0.iter() {
            types::Maybe(item).encode(writer)?;
        }
        Ok(())
    }
}

impl<'de, T: dec::Decode<'de>> dec::Decode<'de> for ArrayOption<Vec<Option<T>>> {
    fn decode<R: dec::Read<'de>>(reader: &mut R) -> Result<Self, dec::Error<R::Error>> {
        let len = <types::Array<()>>::len(reader)?;
        let Some(len) = len
            else {
                return Err(error::DecodeError::RequireLength {
                    name: &"array-option",
                    found: len.map(error::Len::new).unwrap_or(error::Len::Indefinite)
                });
            };
        let mut q = Vec::with_capacity(std::cmp::min(len, 128));
        for _ in 0..len {
            q.push(<types::Maybe<Option<T>>>::decode(reader)?.0);
        }
        Ok(ArrayOption(q))
    }
}

#[derive(Clone)]
#[cfg(feature = "unknown")]
pub struct Unknown(cbor4ii::core::BoxedRawValue);

#[cfg(feature = "unknown")]
impl enc::Encode for Unknown {
    fn encode<W: enc::Write>(&self, writer: &mut W) -> Result<(), enc::Error<W::Error>> {
        self.0.encode(writer)
    }
}

#[cfg(feature = "unknown")]
impl<'de> dec::Decode<'de> for Unknown {
    fn decode<R: dec::Read<'de>>(reader: &mut R) -> Result<Self, dec::Error<R::Error>> {
        cbor4ii::core::BoxedRawValue::decode(reader).map(Unknown)
    }
}

#[cfg(feature = "unknown")]
impl PartialEq for Unknown {
    fn eq(&self, other: &Self) -> bool {
        self.0.as_bytes() == other.0.as_bytes()
    }
}

#[cfg(feature = "unknown")]
impl Eq for Unknown {}

#[cfg(feature = "unknown")]
impl std::hash::Hash for Unknown {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.0.as_bytes().hash(state)
    }
}

#[cfg(feature = "rkyv-impl")]
#[cfg(feature = "unknown")]
#[derive(Debug)]
struct UnknownType;

#[cfg(feature = "rkyv-impl")]
#[cfg(feature = "unknown")]
impl std::error::Error for UnknownType {}

#[cfg(feature = "rkyv-impl")]
#[cfg(feature = "unknown")]
impl std::fmt::Display for UnknownType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "cannot access unknown type")
    }
}

#[cfg(feature = "rkyv-impl")]
#[cfg(feature = "unknown")]
impl rkyv::Archive for Unknown {
    type Archived = std::marker::PhantomData<Unknown>;
    type Resolver = ();

    fn resolve(&self, _resolver: Self::Resolver, _out: rkyv::Place<Self::Archived>) {
        //
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
#[cfg(feature = "unknown")]
impl<S> rkyv::Serialize<S> for Unknown
where
    S: rancor::Fallible + rkyv::ser::Writer + ?Sized,
    S::Error: rancor::Source,
{
    fn serialize(&self, _serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        Err(<S::Error as rancor::Source>::new(UnknownType))
    }
}

/// NOT A PUBLIC API
#[cfg(feature = "rkyv-impl")]
#[cfg(feature = "unknown")]
impl<D> rkyv::Deserialize<Unknown, D> for std::marker::PhantomData<Unknown>
where
    D: ?Sized + rancor::Fallible,
    D::Error: rancor::Source,
{
    fn deserialize(&self, _deserializer: &mut D) -> Result<Unknown, <D as rancor::Fallible>::Error> {
        Err(<D::Error as rancor::Source>::new(UnknownType))
    }
}

#[cfg(feature = "unknown")]
impl std::fmt::Debug for Unknown {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
       write!(f, "Unknown") 
    }
}

#[cfg(feature = "unknown")]
impl serde::Serialize for Unknown {
    fn serialize<S>(&self, _serializer: S) -> Result<S::Ok, S::Error>
    where S: serde::Serializer
    {
        use serde::ser::Error;

        Err(S::Error::custom("cannot serialize unknown type"))    
    }
}

#[cfg(feature = "unknown")]
impl<'de> serde::Deserialize<'de> for Unknown {
    fn deserialize<D>(_deserializer: D) -> Result<Self, D::Error>
    where D: serde::Deserializer<'de>
    {
        use serde::de::Error;

        Err(D::Error::custom("cannot deserialize unknown type"))
    }
}

#[track_caller]
#[cfg(feature = "unknown")]
pub(crate) fn unknown() -> ! {
    panic!("unknown node")
}
