pub use self::input::Input;
use nom::{
    bytes::complete::{tag, take_while},
    error::ErrorKind,
    IResult,
};
use swc_css_ast::*;
use util::PResultExt;

pub type PResult<'a, T> = IResult<Input<'a>, T>;

mod input;
mod util;

pub fn parse(i: Input) -> PResult<Stylesheet> {
    unimplemented!("parse")
}

fn parse_rule(i: Input) -> PResult<Rule> {
    if i.starts_with('@') {
        return parse_at_rule(i).map_value(From::from);
    }

    parse_style_rule(i).map_value(From::from)
}

fn parse_at_rule(i: Input) -> PResult<AtRule> {
    let (i, _) = tag("@")(i)?;

    let (i, id) = take_while(|c: char| c.is_alphabetic())(i)?;
    let (i, _) = take_space(i);

    let (i, text) = take_while(|c| c != ';')(i);

    Ok((i, AtRule {}))
}

fn parse_style_rule(i: Input) -> PResult<StyleRule> {
    unimplemented!("parse_style_rule")
}
