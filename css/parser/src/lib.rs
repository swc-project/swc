pub use self::input::Input;
use nom::{
    bytes::complete::{is_a, tag, take_while, take_while1},
    error::ErrorKind,
    IResult,
};
use swc_css_ast::*;
use util::{span, PResultExt};

pub type PResult<'a, T> = IResult<Input<'a>, T>;

mod input;
mod util;

pub fn parse(i: Input) -> PResult<Stylesheet> {
    unimplemented!("parse")
}

fn parse_rule(i: Input) -> PResult<Rule> {
    if i.starts_with('@') {
        return parse_at_rule(i).map_from();
    }

    parse_style_rule(i).map_from()
}

fn parse_at_rule(i: Input) -> PResult<AtRule> {
    let start = i.start_pos();
    let (i, _) = tag("@")(i)?;

    let (i, id) = take_while(|c: char| c.is_alphabetic())(i).map_from()?;
    let (i, _) = take_ws(i)?;

    let (i, text) = take_while(|c| c != ';')(i).map_from()?;

    Ok((
        i,
        AtRule {
            span: span(i, start),
            id,
            text,
        },
    ))
}

fn parse_style_rule(i: Input) -> PResult<StyleRule> {
    unimplemented!("parse_style_rule")
}

/// Eats one or more whitespaces
fn take_ws(i: Input) -> PResult<()> {
    let (i, _) = take_while1(|c| c == ' ')(i)?;

    Ok((i, ()))
}
