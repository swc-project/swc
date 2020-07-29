use crate::ast::{JsDoc, JsDocTagItem};
use nom::{
    bytes::complete::{tag, take_while},
    character::is_alphabetic,
    IResult,
};

pub mod ast;

pub fn parse(i: &str) -> IResult<&str, JsDoc> {}

pub fn parse_tag_item(i: &str) -> IResult<&str, JsDocTagItem> {
    let (i, _) = tag("@")(i)?;

    let (i, tag_name) = take_while(is_alphabetic)(i)?;

    match tag_name {
        "abstract" | "virtual" => {}
        "access" => {}
        "alias" => {}
        "async" => {}
        "augments" | "extends" => {}
        "author" => {}
        "borrows" => {}
        "callback" => {}
        "class" | "constructor" => {}
    }
}
