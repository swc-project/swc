use crate::ast::{JsDoc, JsDocTagItem};
use nom::{
    bytes::complete::{tag, take_while},
    character::is_alphabetic,
    IResult,
};
use swc_common::{BytePos, Span};

pub mod ast;

pub fn parse(start: BytePos, end: BytePos, i: &str) -> IResult<&str, JsDoc> {}

pub fn parse_tag_item(start: BytePos, end: BytePos, i: &str) -> IResult<&str, JsDocTagItem> {
    let (i, _) = tag("@")(i)?;

    let (i, tag_name) = take_while(is_alphabetic)(i)?;

    let tag = match tag_name {
        "abstract" | "virtual" => {}
        "access" => {}
        "alias" => {}
        "async" => {}
        "augments" | "extends" => {}
        "author" => {}
        "borrows" => {}
        "callback" => {}
        "class" | "constructor" => {}
        "classdesc" => {}
        "constant" | "const" => {}
        "constructs" => {}
        "copyright" => {}
        "default" | "defaultvalue" => {}
        "deprecated" => {}
        "description" | "desc" => {}
        "enum" => {}
        "event" => {}
        "example" => {}
        "exports" => {}
        "external" => {}
        "file" => {}
        "fires" => {}
        "function" => {}
        "generator" => {}
        "global" => {}
        "hideconstructor" => {}
        "ignore" => {}
        "implements" => {}
        "inheritdoc" => {}
        "inner" => {}
        "instance" => {}
        "interface" => {}
        "kind" => {}
        "lendsx" => {}
        "license" => {}
        "listens" => {}
        "member" | "var" => {}
        "memberof" => {}
        "mixes" => {}
        "mixin" => {}
        "module" => {}
        "name" => {}
        "namespace" => {}
        "override" => {}
        "package" => {}
        "param" | "arg" | "argument" => {}
        "private" => {}
        "property" | "prop" => {}
        "protected" => {}
        "public" => {}
        "readonly" => {}
        "requires" => {}
        "returns" | "return" => {}
        "see" => {}
        "since" => {}
        "static" => {}
        "summary" => {}
        "this" => {}
        "tutorial" => {}
        "type" => {}
        "typedef" => {}
        "variation" => {}
        "version" => {}
        "yields" | "yield" => {}
    };

    Ok((
        i,
        JsDocTagItem {
            span: Span::new(start, end, Default::default()),
            tag_name: tag_name.into(),
            tag,
        },
    ))
}
