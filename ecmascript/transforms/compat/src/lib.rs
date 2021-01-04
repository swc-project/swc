//! New-generation javascript to old-javascript compiler.

pub use self::{
    es2015::es2015, es2016::es2016, es2017::es2017, es2018::es2018, es2020::es2020, es3::es3,
};

pub mod es2015;
pub mod es2016;
pub mod es2017;
pub mod es2018;
pub mod es2020;
pub mod es3;
pub mod reserved_words;
