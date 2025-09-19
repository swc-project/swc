#![allow(deprecated)]

use serde::Deserialize;

#[derive(Deserialize)]
#[deprecated = "Not used by swc, and this will be removed with next breaking change"]
pub struct Node<T> {
    #[serde(default, rename = "type")]
    pub ty: String,
    #[serde(flatten)]
    pub node: T,
}

#[derive(Deserialize)]
pub struct Type {
    #[serde(rename = "type")]
    pub ty: String,
}

#[cfg(feature = "encoding-impl")]
pub struct WithChar<T>(pub T);

#[cfg(feature = "encoding-impl")]
impl cbor4ii::core::enc::Encode for WithChar<&char> {
    fn encode<W: cbor4ii::core::enc::Write>(
        &self,
        writer: &mut W,
    ) -> Result<(), cbor4ii::core::enc::Error<W::Error>> {
        u32::from(*self.0).encode(writer)
    }
}

#[cfg(feature = "encoding-impl")]
impl<'de> cbor4ii::core::dec::Decode<'de> for WithChar<char> {
    fn decode<R: cbor4ii::core::dec::Read<'de>>(
        reader: &mut R,
    ) -> Result<Self, cbor4ii::core::dec::Error<R::Error>> {
        let n = u32::decode(reader)?;
        let value =
            char::from_u32(n).ok_or_else(|| cbor4ii::core::dec::Error::Mismatch {
                name: &"Token::Delim",
                found: 0,
            })?;
        Ok(WithChar(value))
    }
}
