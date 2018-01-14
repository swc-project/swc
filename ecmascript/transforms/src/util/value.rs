use self::Value::{Known, Unknown};
use std::ops::Not;

/// Runtime value.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Value<T> {
    Known(T),
    Unknown,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub enum Type {
    Undefined,
    Null,
    Bool,
    Str,
    Symbol,
    Num,
    Obj,
}

impl<T> Value<T> {
    pub fn is_unknown(&self) -> bool {
        match *self {
            Unknown => true,
            _ => false,
        }
    }
}

impl Value<bool> {
    pub fn and(self, other: Self) -> Self {
        match self {
            Known(true) => other,
            Known(false) => Known(false),
            Unknown => match other {
                Known(false) => Known(false),
                _ => Unknown,
            },
        }
    }

    pub fn or(self, other: Self) -> Self {
        match self {
            Known(true) => Known(true),
            Known(false) => other,
            Unknown => match other {
                Known(true) => Known(true),
                _ => Unknown,
            },
        }
    }
}

impl Not for Value<bool> {
    type Output = Self;
    fn not(self) -> Self {
        match self {
            Value::Known(b) => Value::Known(!b),
            Value::Unknown => Value::Unknown,
        }
    }
}
