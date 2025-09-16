//! This module is private module and can be changed without notice.
//!
//! This contains code from serde 1.0.219 to maintain compatibility
//! with serde versions 1.0.220+

use std::borrow::Cow;
use std::marker::PhantomData;

#[cfg(not(no_serde_derive))]
pub mod de;
#[cfg(not(no_serde_derive))]
pub mod ser;

pub mod doc;

pub use std::clone::Clone;
pub use std::convert::{From, Into};
pub use std::default::Default;
pub use std::fmt::{self, Formatter};
pub use std::marker::PhantomData as PhantomDataType;
pub use std::option::Option::{self, None, Some};
pub use std::ptr;
pub use std::result::Result::{self, Err, Ok};

pub use self::string::from_utf8_lossy;

pub use std::string::ToString;
pub use std::vec::Vec;

pub use std::convert::TryFrom;

mod string {
    use std::borrow::Cow;

    pub fn from_utf8_lossy(bytes: &[u8]) -> Cow<str> {
        String::from_utf8_lossy(bytes)
    }
}

// Re-export serde's __private module for compatibility
pub mod serde {
    pub use ::serde::__private as __private;
}