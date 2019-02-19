extern crate serde;
#[macro_use]
extern crate string_enum;
use std::fmt::{Debug, Display};

pub trait Assert: Debug + Display {}

#[derive(StringEnum)]
pub enum Tokens {
    ///`a`
    A,
    ///`struct-like`
    StructLike {},
    /// `tuple-like`
    TupleLike(u8),
}

impl Assert for Tokens {}

#[test]
fn as_str() {
    assert_eq!(Tokens::A.as_str(), "a");
    assert_eq!(Tokens::StructLike {}.as_str(), "struct-like");
    assert_eq!(Tokens::TupleLike(13).as_str(), "tuple-like");
}

#[test]
fn test_fmt() {
    assert_eq!(Tokens::A.to_string(), "a");
    assert_eq!(format!("{}", Tokens::A), "a");
}
