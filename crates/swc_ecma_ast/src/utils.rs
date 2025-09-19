#[cfg(feature = "encoding-impl")]
use cbor4ii::core::{dec, enc, error, types};

#[cfg(feature = "encoding-impl")]
pub(crate) struct ArrayOption<T>(pub T);

#[cfg(feature = "encoding-impl")]
impl<T: enc::Encode> enc::Encode for ArrayOption<&'_ Vec<Option<T>>> {
    fn encode<W: enc::Write>(&self, writer: &mut W) -> Result<(), enc::Error<W::Error>> {
        <types::Array<()>>::bounded(self.0.len(), writer)?;
        for item in self.0.iter() {
            types::Maybe(item).encode(writer)?;
        }
        Ok(())
    }
}

#[cfg(feature = "encoding-impl")]
impl<'de, T: dec::Decode<'de>> dec::Decode<'de> for ArrayOption<Vec<Option<T>>> {
    fn decode<R: dec::Read<'de>>(reader: &mut R) -> Result<Self, dec::Error<R::Error>> {
        let len = <types::Array<()>>::len(reader)?;
        let Some(len) = len else {
            return Err(error::DecodeError::RequireLength {
                name: &"array-option",
                found: len.map(error::Len::new).unwrap_or(error::Len::Indefinite),
            });
        };
        let mut q = Vec::with_capacity(std::cmp::min(len, 128));
        for _ in 0..len {
            q.push(<types::Maybe<Option<T>>>::decode(reader)?.0);
        }
        Ok(ArrayOption(q))
    }
}
